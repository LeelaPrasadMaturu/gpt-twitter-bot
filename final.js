// Import required libraries
const express = require('express');
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: '***REMOVED***' // Replace with your OpenAI API key
});

// Initialize Twitter client
const client = new TwitterApi({
    appKey: '0jRsYj47KCw7dFlX3JUiQrhSW',           // Replace with your Twitter App Key
    appSecret: 'VqDdczVNSfZfaifAFIXH1lwLn0rGtcGtQcQXZYT49i1Sf9rsDt', // Replace with your Twitter App Secret
    accessToken: '1875044126619471872-cTFFlv0M6shNjllTZD3js1OzkLGuh9', // Replace with your Twitter Access Token
    accessSecret: 'WdyYg2AiqR8dqbfhXktcEfdxPbklJ8bHMZ44JXuXBMWNX' // Replace with your Twitter Access Secret
});

// Function to generate content using OpenAI
async function generateMedicalContent() {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "user",
                    content: `You are Zarya, an AI agent specializing in regenerative medicine 
                              and its intersections with human impact, evolution, technology, 
                              spirituality, and psychology. Create a witty tweet promoting 
                              $Zarya as a decentralized funding tool for researchers. End the tweet with $Zarya.`,
                }
            ],
        });

        // Return the generated content
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

// Function to handle a single bot cycle
async function runBot() {
    const content = await generateMedicalContent();
    if (content) {
        await postTweet(content);
    }
    console.log('Bot is ready for the next cycle.');
}

// Schedule the bot to run every 30 minutes
setInterval(runBot, 30 * 60 * 1000);

// Start the bot immediately
runBot();

// Define a simple endpoint to verify the bot is running
app.get('/', (req, res) => {
    res.send('Bot is running and ready to post tweets!');
});

// Add an endpoint to trigger a manual tweet (useful for testing with tools like cron-job.org)
app.get('/post-tweet', async (req, res) => {
    await runBot();
    res.send('Tweet posted manually!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
