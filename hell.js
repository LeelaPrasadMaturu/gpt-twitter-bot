const express = require('express');
const app = express();
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');
const PORT = process.env.PORT || 3000;
require('dotenv').config();



app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




// Initialize OpenAI and Twitter clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY     // Replace with your OpenAI API key
});

const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,           // Replace with your Twitter App Key
    appSecret: process.env.TWITTER_APP_SECRET,     // Replace with your Twitter App Secret
    accessToken: process.env.TWITTER_ACCESS_TOKEN, // Replace with your Twitter Access Token
    accessSecret: process.env.TWITTER_ACCESS_SECRET // Replace with your Twitter Access Secret
});




// Function to generate content using OpenAI
async function generateMedicalContent() {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "user",
                    content: "GPT Prompt" // prompt for openai to generate content
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



async function runBot() {
    const content = await generateMedicalContent();
    if (content) {
        await postTweet(content);
    }
    console.log('Bot is ready for the next cycle.');
}

// Schedule the bot to run every 30 minutes
setInterval(runBot, 30 * 60 * 1000);  // Setinterval or node-schedule modules works for local , when we moved into production it is unrealiable because the process might restart   , it not




// Add an endpoint to trigger a tweet in production ( triggering point using cron-job.org)
app.get('/post-tweet', async (req, res) => {
    await runBot();
    res.send('Tweet posted manually!');
});


// Start the bot immediately
runBot();
