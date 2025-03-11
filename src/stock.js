const axios = require("axios");
const fs = require("fs");

// Constants
const STOCK_API_KEY = process.env.STOCK_API_KEY;
const STOCK_API_URL = `https://api.twelvedata.com/price?symbol=FEZ&apikey=${STOCK_API_KEY}`;

const FILE_PATH = "prices.json";
const DEBUG_MODE = false; // If true: Requests to the Stock API are mocked with random prices
const STOCK_REQUEST_INTERVAL_MS = process.env.STOCK_REQUEST_INTERVAL_MS; // Interval in milliseconds to fetch stock data
const NOTIFICATION_THRESHOLD_PERCENT = process.env.NOTIFICATION_THRESHOLD_PERCENT; // Percentage above which a notification is sent to the Discord Webhook
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Function to post a message to Discord
async function postMessageToDiscord(message) {
  const payload = { content: message };

  try {
    const response = await axios.post(DISCORD_WEBHOOK_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending message:", error.response ? error.response.data : error.message);
  }
}

// Function to fetch stock data
async function fetchStockData() {
  try {
    const currentPrice = DEBUG_MODE ? getRandomPrice() : await getStockPriceFromAPI();
    const newEntry = createNewEntry(currentPrice);
    const logData = readLogData();

    const lastPrice = logData.length ? logData[logData.length - 1].price : null;
    const percentageDifference = lastPrice ? calculatePercentageDifference(currentPrice, lastPrice) : null;

    if (percentageDifference > NOTIFICATION_THRESHOLD_PERCENT) {
      sendNotification(currentPrice, lastPrice, percentageDifference);
    }

    newEntry.percentageDifference = percentageDifference;
    logData.push(newEntry);
    writeLogData(logData);

    console.log("New Entry:", newEntry);
  } catch (error) {
    console.error("Error:", error.response ? error.response.status : error.message);
  }
}

// Function to get stock price from API
async function getStockPriceFromAPI() {
  const response = await axios.get(STOCK_API_URL, { headers: { "User-Agent": "axios" } });
  return parseFloat(response.data.price);
}

// Function to get a random price for debug mode
function getRandomPrice() {
  const price = Math.random() * (55 - 45) + 45;
  return parseFloat(price.toFixed(2));
}

// Function to create a new entry
function createNewEntry(price) {
  return { timestamp: new Date().toISOString(), price };
}

// Function to read log data from file
function readLogData() {
  if (fs.existsSync(FILE_PATH)) {
    const fileContent = fs.readFileSync(FILE_PATH, "utf8");
    return fileContent ? JSON.parse(fileContent) : [];
  }
  return [];
}

// Function to write log data to file
function writeLogData(logData) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(logData, null, 2), "utf8");
}

// Function to calculate percentage difference
function calculatePercentageDifference(currentPrice, lastPrice) {
  return (((currentPrice - lastPrice) / lastPrice) * 100).toFixed(2);
}

// Function to send notification
function sendNotification(currentPrice, lastPrice, percentageDifference) {
  const message = `EURO STOXX 50 reached positive growth in the last 12 hours.
    Current price: ${currentPrice}
    Price 12 hours ago: ${lastPrice}
    Difference: ${percentageDifference}%`;
  postMessageToDiscord(message);
}

// Function to loop requests
async function loopRequests() {
  while (true) {
    await fetchStockData();
    await new Promise((resolve) => setTimeout(resolve, STOCK_REQUEST_INTERVAL_MS));
  }
}

loopRequests();
