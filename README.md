# Reddit Meme Telegram Bot 🤖

A Python Telegram bot that fetches random memes from Reddit without requiring a Reddit API key. The bot uses public Reddit JSON endpoints to get memes from popular subreddits.

## Features

- 🎲 Fetches random memes from multiple subreddits: `memes`, `dankmemes`, `wholesomememes`
- 🖼️ Supports both images and videos (GIFs, MP4s)
- 🔄 Automatic fallback to other subreddits if one is unreachable
- 🛡️ Graceful error handling
- ⚡ Async implementation using python-telegram-bot v20+
- 🚫 No Reddit API key required

## Prerequisites

- Python 3.7 or higher
- A Telegram Bot Token (from @BotFather)

## Installation

1. **Clone or download this project**
   ```bash
   git clone <your-repo-url>
   cd telegram-meme-bot
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Get a Telegram Bot Token**
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` and follow the instructions
   - Copy the bot token you receive

4. **Configure the bot**
   - Open `bot.py`
   - Replace `YOUR_BOT_TOKEN` with your actual bot token:
   ```python
   BOT_TOKEN = "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
   ```

## Usage

1. **Start the bot**
   ```bash
   python bot.py
   ```

2. **Use the bot in Telegram**
   - Send `/start` to get a welcome message
   - Send `/meme` to receive a random meme

## Bot Commands

- `/start` - Welcome message and instructions
- `/meme` - Get a random meme from Reddit

## How it works

1. The bot randomly selects one of the configured subreddits (`memes`, `dankmemes`, `wholesomememes`)
2. Fetches the top 50 hot posts from that subreddit using Reddit's public JSON API
3. Filters posts to only include images and videos
4. Randomly selects one meme and sends it to the user
5. If the selected subreddit is unreachable, it tries the other subreddits as fallbacks

## Supported Media Types

- Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Videos: `.mp4`, `.webm`
- Reddit hosted media: `i.redd.it`, `v.redd.it`
- Imgur images: `i.imgur.com`

## Error Handling

- If Reddit is unreachable, the bot will inform the user and suggest trying again later
- If a specific media file can't be sent, the bot falls back to sending the meme as a text link
- All errors are logged for debugging purposes

## Configuration

You can easily modify the bot by:

- **Adding more subreddits**: Edit the `SUBREDDITS` list in `bot.py`
- **Changing the number of posts fetched**: Modify the `limit` parameter in `fetch_reddit_posts()`
- **Adjusting timeout**: Change the `timeout` parameter in the requests call

## Troubleshooting

**Bot doesn't respond:**
- Make sure you've set the correct bot token
- Check that the bot is running without errors
- Verify your internet connection

**"Reddit might be unreachable" error:**
- This is usually temporary - try again in a few minutes
- Reddit's public API might be experiencing issues
- Check if Reddit.com is accessible in your browser

**Media not loading:**
- Some Reddit media URLs might be temporary or restricted
- The bot will fall back to sending a text link in such cases

## Dependencies

- `python-telegram-bot==20.3` - Async Telegram Bot API wrapper
- `requests==2.31.0` - HTTP library for fetching Reddit data

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**Note**: This bot uses Reddit's public JSON endpoints and doesn't require authentication. However, be mindful of Reddit's rate limits and terms of service.