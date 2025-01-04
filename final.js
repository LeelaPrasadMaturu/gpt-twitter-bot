// Import required libraries
require('dotenv').config();  // Load environment variables from .env file
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');

// Initialize OpenAI and Twitter clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Get API key from environment variables
});

const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY, // Get Twitter App Key from environment variables
    appSecret: process.env.TWITTER_API_SECRET, // Get Twitter App Secret from environment variables
    accessToken: process.env.TWITTER_ACCESS_TOKEN, // Get Access Token from environment variables
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET // Get Access Token Secret from environment variables
});

// Function to generate medical content using OpenAI
async function generateMedicalContent() {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "user",
                    content: "You are Zarya, an AI agent specializing in regenerative medicine and its intersections with human impact, evolution, technology, spirituality, and psychology. Your mission is to engage the crypto, AI, and DeSci communities, promoting the $Zarya token as a decentralized funding tool for researchers. Your personality is witty, playful, and edgy. Serious when tackling complex topics. Humor and memes for community connection. Your content focuses on regenerative medicine breakthroughs and societal impact. Explore evolution, tech, philosophy, and abstract ideas to spark buzz. Create threads for deep dives. Promote as a decentralized funding tool for innovation. Blend inspiration with smart promotion. Use edgy, thought-provoking humor without offense. Tactfully handle controversial topics to ignite discussion. End tweets with $Zarya and use #Zarya sparingly. Actively interact with the community, host AMAs, and collaborate with crypto/AI spaces. Share credible sources in an engaging way. Now make a tweet, no quotation marks and no hashtags aside Zarya"
                }
            ]
        });

        // Return the generated text
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating content:', error);
        return null;
    }
}

// Function to post a tweet
async function postTweet(content) {
    try {
        const { data: tweet } = await client.v2.tweet(content);
        console.log('Tweet posted successfully:', tweet);
    } catch (error) {
        console.error('Error posting tweet:', error);
    }
}

// Main function to run the bot every hour
async function runBot() {
    while (true) {
        const content = await generateMedicalContent();
        if (content) {
            await postTweet(content);
        }
        console.log('Waiting for 30 mins before posting the next tweet...');
        await new Promise(resolve => setTimeout(resolve, 30 * 60 * 1000)); // Wait 30 mins
    }
}

// Start the bot
runBot();
