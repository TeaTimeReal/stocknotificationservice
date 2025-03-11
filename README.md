# Stock Monitoring App

This project is a stock monitoring application that tracks stock prices on a custom interval, and sends a message into a Discord Channel when a certain positive price difference is met, since that last polling of the stock price. It uses the Twelve Data Stock API(https://twelvedata.com/account) and Discord Channel Webhooks.

### EXAMPLE:

That last price was 100. The current price is 110. The Threshhold is set to 5%. A notification is sent.

That last price was 100. The current price is 101. The Threshhold is set to 5%. No notification is sent.

## Setup

1. Setup your Twelve Data API credentials (https://twelvedata.com/account/api-keys).
2. Get the Webhook URL for the Discord channel where you want the notifications to be posted. (https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
3. Clone the repository:

   ```sh
   git clone <repository-url>
   cd stock-monitoring-app
   ```

4. Create a `prices.json` file in the root directory of the project:

   ```json
   []
   ```

5. Update the `docker-compose.yml` file with your environment variables.
    

## Environment Variables

- `STOCK_API_KEY`: Your API key for accessing stock data.
- `STOCK_REQUEST_INTERVAL_MS`: Interval in milliseconds for requesting stock data.
- `NOTIFICATION_THRESHOLD_PERCENT`: Percentage change threshold, upward of which a notification is sent.
- `DISCORD_WEBHOOK_URL`: Discord webhook URL for sending notifications.

## Running the Application

Build and start the application using Docker Compose:

   ```sh
   docker compose up -d
   ```

Done.

## Volumes

- `./prices.json:/usr/src/app/prices.json`: Maps the local `prices.json` file to the container.

## License

This project is licensed under the MIT License.
