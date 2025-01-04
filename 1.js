// Import required libraries
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');

// Initialize OpenAI and Twitter clients
const openai = new OpenAI({
    apiKey: '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' // Replace with your OpenAI API key
});

const client = new TwitterApi({
    appKey: 'Jvpg6CubWTwBXz5EyAyaB3Ak4',           // Replace with your Twitter App Key
    appSecret: 'gex77lNtNnTMsh9N9gY3BS86da05QBHxRNsSi1TqCo5TYpTaYM',     // Replace with your Twitter App Secret
    accessToken: '1812718365812879360-vk9qZc7ckXRkvQRqk6xylNvY6XscIQ', // Replace with your Twitter Access Token
    accessSecret: 'v8ik5zgIncs6lFyKJC96CfwO7HIQog62OGmDxtG6aIyBV'// Replace with your Twitter Access Secret
});

// Track replied mentions to avoid duplicate replies
const repliedMentions = new Set();

// Function to generate content using OpenAI
async function generateMedicalContent(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "user", content: [{ type: "text", text: prompt }] }
            ]
        });

        const content = response.choices[0].message.content[0].text.trim();

        // Ensure content is under 200 characters
        return content.length > 200 ? content.slice(0, 197) + "..." : content;
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

// Function to check for mentions and reply
// Function to reply to mentions
async function replyToMentions() {
    try {
        const mentions = await client.v2.search('@LeelaPrasad04'); // Replace with your handle
        if (!mentions || !mentions.data) return;

        for (const mention of mentions.data) {
            const tweetId = mention.id;
            const userHandle = mention.author_id;
            const mentionText = mention.text;

            // Generate a context-aware reply
            const prompt = `Reply to the following tweet in a helpful and friendly way: "${mentionText}"`;
            const replyContent = await generateMedicalContent(prompt);

            if (replyContent) {
                const reply = `@${userHandle} ${replyContent}`;
                await client.v2.reply(reply, tweetId);
                console.log(`Replied to mention from @${userHandle}:`, reply);
            }
        }
    } catch (error) {
        console.error("Error replying to mentions:", error);
    }
}


// Main function to run the bot
async function runBot() {
    // Post a medical tip every 30 minutes
    setInterval(async () => {
        const content = await generateMedicalContent("Provide a helpful medical tip for a tweet.");
        if (content) {
            await postTweet(content);
        }
    }, 30 * 60 * 1000);

    // Check for mentions and reply once to each
    await replyToMentions();
}

// Start the bot
runBot();
