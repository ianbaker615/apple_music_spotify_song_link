require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const APPLE_MUSIC_REGEX = /https?:\/\/music\.apple\.com\/[^\s]+/gi;
const SPOTIFY_REGEX = /https?:\/\/open\.spotify\.com\/(track|album|playlist)\/[^\s]+/gi;
const SONGLINK_API = 'https://api.song.link/v1-alpha.1/links';

async function convertLink(url) {
    try {
        const response = await axios.get(SONGLINK_API, {
            params: { url: encodeURIComponent(url) }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error converting link:', error.message);
        return null;
    }
}

function extractPlatformLinks(data, originalPlatform) {
    const links = [];
    
    if (originalPlatform === 'apple' && data.linksByPlatform?.spotify) {
        links.push({
            platform: 'Spotify',
            url: data.linksByPlatform.spotify.url
        });
    } else if (originalPlatform === 'spotify' && data.linksByPlatform?.appleMusic) {
        links.push({
            platform: 'Apple Music',
            url: data.linksByPlatform.appleMusic.url
        });
    }
    
    return links;
}

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    const appleLinks = message.content.match(APPLE_MUSIC_REGEX) || [];
    const spotifyLinks = message.content.match(SPOTIFY_REGEX) || [];
    
    const allLinks = [
        ...appleLinks.map(link => ({ url: link, platform: 'apple' })),
        ...spotifyLinks.map(link => ({ url: link, platform: 'spotify' }))
    ];
    
    if (allLinks.length === 0) return;
    
    const convertedLinks = [];
    
    for (const link of allLinks) {
        const data = await convertLink(link.url);
        if (data) {
            const platformLinks = extractPlatformLinks(data, link.platform);
            if (platformLinks.length > 0) {
                let entityInfo = '';
                const entity = Object.values(data.entitiesByUniqueId)[0];
                if (entity) {
                    entityInfo = `**${entity.title}** by ${entity.artistName}`;
                }
                
                convertedLinks.push({
                    original: link.url,
                    converted: platformLinks,
                    info: entityInfo
                });
            }
        }
    }
    
    if (convertedLinks.length > 0) {
        let replyMessage = '';
        
        for (const linkData of convertedLinks) {
            if (linkData.info) {
                replyMessage += `${linkData.info}\n`;
            }
            for (const converted of linkData.converted) {
                replyMessage += `${converted.platform}: ${converted.url}\n`;
            }
            replyMessage += '\n';
        }
        
        if (replyMessage) {
            replyMessage = replyMessage.trim() + '\n\n_Powered by Songlink_';
            await message.reply(replyMessage);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);