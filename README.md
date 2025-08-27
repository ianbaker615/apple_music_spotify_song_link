# Apple Music & Spotify Discord Bot

A Discord bot that automatically converts Apple Music links to Spotify links and vice versa, making music sharing seamless in Discord channels where users have different streaming preferences.

## Features

- Automatically detects Apple Music links and replies with Spotify equivalents
- Automatically detects Spotify links and replies with Apple Music equivalents
- Shows track/album information (title and artist)
- Handles multiple links in a single message
- Works with tracks, albums, and playlists
- No API keys required for music conversion (uses Song.link)

## Prerequisites

- Node.js v16.9.0 or higher
- A Discord Bot Token

## Setup Instructions

### 1. Create a Discord Application and Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section in the left sidebar
4. Click "Add Bot"
5. Under "Privileged Gateway Intents", enable:
   - MESSAGE CONTENT INTENT
6. Copy your bot token (you'll need this later)

### 2. Invite the Bot to Your Server

1. In the Discord Developer Portal, go to "OAuth2" > "URL Generator"
2. Under "Scopes", select:
   - `bot`
3. Under "Bot Permissions", select:
   - Send Messages
   - Read Messages/View Channels
   - Read Message History
4. **Integration Type**: Select "Guild Install" (for server-wide bot functionality)
5. Copy the generated URL and open it in your browser
6. Select your server and authorize the bot

### 3. Install and Configure the Bot

1. Clone this repository:
```bash
git clone <repository-url>
cd apple_spotify_discord_bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file by copying the example:
```bash
cp .env.example .env
```

4. Edit the `.env` file and add your Discord bot token:
```
DISCORD_TOKEN=your_actual_bot_token_here
```

### 4. Run the Bot

Start the bot:
```bash
node index.js
```

You should see "Logged in as [YourBotName]!" in the console.

## Usage

Simply post an Apple Music or Spotify link in any channel where the bot has access, and it will automatically reply with the equivalent link from the other platform.

Example:
- User posts: `Check out this song: https://open.spotify.com/track/abc123`
- Bot replies: `**Song Title** by Artist Name`  
  `Apple Music: https://music.apple.com/...`

## How It Works

The bot uses the [Song.link API](https://odesli.co/) to convert between music streaming platforms. Song.link provides a free API that matches songs across different streaming services.

## Rate Limits

- The Song.link API has a rate limit of 10 requests per minute without an API key
- If you need higher rate limits, you can contact Song.link for an API key

## Troubleshooting

- **Bot doesn't respond**: Make sure MESSAGE CONTENT INTENT is enabled in the Discord Developer Portal
- **"Token Invalid" error**: Double-check your bot token in the `.env` file
- **Bot is offline**: Ensure Node.js is running and check for any error messages in the console

## License

ISC