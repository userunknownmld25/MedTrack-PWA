import asyncio
import logging
import random
import requests
from typing import Optional, Dict, Any
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# List of meme subreddits
SUBREDDITS = ['memes', 'dankmemes', 'wholesomememes']

class RedditMemeBot:
    def __init__(self, token: str):
        self.token = token
        self.session = requests.Session()
        # Set a user agent to avoid Reddit blocking
        self.session.headers.update({
            'User-Agent': 'TelegramMemeBot/1.0'
        })
    
    def fetch_reddit_posts(self, subreddit: str, limit: int = 50) -> Optional[list]:
        """
        Fetch posts from a Reddit subreddit using public JSON endpoint
        """
        try:
            url = f"https://www.reddit.com/r/{subreddit}/hot.json?limit={limit}"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            posts = data.get('data', {}).get('children', [])
            
            # Filter posts to only include images and videos
            media_posts = []
            for post in posts:
                post_data = post.get('data', {})
                url = post_data.get('url', '')
                
                # Check if it's an image or video
                if (url.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')) or
                    url.endswith(('.mp4', '.webm')) or
                    'i.redd.it' in url or
                    'v.redd.it' in url or
                    'i.imgur.com' in url):
                    
                    media_posts.append({
                        'title': post_data.get('title', 'No title'),
                        'url': url,
                        'permalink': f"https://reddit.com{post_data.get('permalink', '')}",
                        'subreddit': post_data.get('subreddit', subreddit)
                    })
            
            return media_posts
            
        except requests.RequestException as e:
            logger.error(f"Error fetching from r/{subreddit}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching from r/{subreddit}: {e}")
            return None
    
    def get_random_meme(self) -> Optional[Dict[str, Any]]:
        """
        Get a random meme from a random subreddit
        """
        # Randomly select a subreddit
        subreddit = random.choice(SUBREDDITS)
        logger.info(f"Fetching meme from r/{subreddit}")
        
        # Fetch posts from the selected subreddit
        posts = self.fetch_reddit_posts(subreddit)
        
        if not posts:
            # Try other subreddits if the first one fails
            remaining_subreddits = [s for s in SUBREDDITS if s != subreddit]
            for backup_subreddit in remaining_subreddits:
                logger.info(f"Trying backup subreddit r/{backup_subreddit}")
                posts = self.fetch_reddit_posts(backup_subreddit)
                if posts:
                    break
        
        if not posts:
            return None
        
        # Randomly select a post
        selected_post = random.choice(posts)
        return selected_post
    
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """
        Handle the /start command
        """
        await update.message.reply_text("Hi! Send /meme to get a random meme.")
    
    async def meme_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """
        Handle the /meme command
        """
        try:
            # Send a "typing" action to show the bot is working
            await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="upload_photo")
            
            # Get a random meme
            meme = self.get_random_meme()
            
            if not meme:
                await update.message.reply_text(
                    "Sorry, I couldn't fetch a meme right now. Reddit might be unreachable. "
                    "Please try again later! 😅"
                )
                return
            
            # Prepare caption
            caption = f"{meme['title']}\n\nFrom r/{meme['subreddit']}"
            
            # Send the meme based on its type
            url = meme['url']
            
            try:
                if url.endswith(('.mp4', '.webm')) or 'v.redd.it' in url:
                    # Send as video
                    await update.message.reply_video(
                        video=url,
                        caption=caption
                    )
                else:
                    # Send as photo
                    await update.message.reply_photo(
                        photo=url,
                        caption=caption
                    )
                    
            except Exception as media_error:
                logger.error(f"Error sending media {url}: {media_error}")
                # Fallback: send as text with link
                await update.message.reply_text(
                    f"{caption}\n\nLink: {url}"
                )
                
        except Exception as e:
            logger.error(f"Error in meme_command: {e}")
            await update.message.reply_text(
                "Oops! Something went wrong while fetching your meme. "
                "Please try again! 🤖"
            )
    
    def run(self):
        """
        Start the bot
        """
        # Create application
        application = Application.builder().token(self.token).build()
        
        # Add command handlers
        application.add_handler(CommandHandler("start", self.start_command))
        application.add_handler(CommandHandler("meme", self.meme_command))
        
        # Print startup message
        print("🤖 Reddit Meme Bot is starting...")
        print("Bot is now running! Press Ctrl+C to stop.")
        
        # Start the bot
        application.run_polling(allowed_updates=Update.ALL_TYPES)

def main():
    """
    Main function to run the bot
    """
    # You need to replace 'YOUR_BOT_TOKEN' with your actual bot token from @BotFather
    BOT_TOKEN = "YOUR_BOT_TOKEN"
    
    if BOT_TOKEN == "YOUR_BOT_TOKEN":
        print("❌ Error: Please set your bot token!")
        print("1. Create a bot with @BotFather on Telegram")
        print("2. Replace 'YOUR_BOT_TOKEN' in bot.py with your actual token")
        return
    
    # Create and run the bot
    bot = RedditMemeBot(BOT_TOKEN)
    bot.run()

if __name__ == "__main__":
    main()