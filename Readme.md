# Twitter Posting Bot using OpenAI GPT Models  

This bot automatically generates content using **OpenAI's GPT models** and posts tweets using the **Twitter API**.  

## 🚀 Installation & Setup  

### **Step 1: Clone the Repository**  
```sh
git clone https://github.com/LeelaPrasadMaturu/twitter-posting-llm.git
cd twitter-posting-llm
```

### **Step 2: Install Dependencies** 
``
npm install
``

### **Step 3: Set Up API Keys**  
1. Get your OpenAI API key from OpenAI.
2. Get your Twitter API keys from Twitter Developer Portal.
3. Create a .env file in the project root and add the keys 


### **Step 4: Run the Bot**  
``
node twitterPostingBot.js
``


### 📌 Features
- ✅ Uses OpenAI GPT models to generate content
- ✅ Automatically posts tweets at scheduled intervals
- ✅ Supports manual tweet posting via API endpoint
- ✅ Easy-to-configure environment variables


### 🛠️ How to Manually Trigger a Tweet
You can manually post a tweet using this endpoint (useful for scheduling services like cron-job.org):
``
GET /post-tweet
``

##### Example (if running locally):
``
http://localhost:3000/post-tweet
``


-----


# Challenge: Automating Tweets at Regular Intervals

The primary challenge involves tweeting at consistent intervals, such as every 30 minutes or 1 hour.

## Local Development

When using time-based loops like `30 * 60 * 60` (for 30 minutes), the system functions correctly in a local environment.

## Production Challenges

However, when deploying to a production environment or any server (e.g., Render), this approach fails. Each new deployment resets the clock, and a significant issue arises because Render does not maintain any state to keep the clock running.

## Key Learnings

To overcome this, the most effective solution is:

1. **Host the Application**: Deploy the application on a hosting platform.
2. **Create a GET API**: Develop a GET API endpoint.
3. **Trigger with Cron Jobs**: Use online cron job platforms to send a GET request to this endpoint every 30 minutes. This request triggers the code to post a tweet.

This method ensures that the tweet automation works reliably in a production environment.
