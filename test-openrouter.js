import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || 'AI Image Editor',
  },
});

async function testOpenRouter() {
  console.log('Testing OpenRouter API...');
  console.log('Base URL:', process.env.OPENROUTER_BASE_URL);
  console.log('API Key:', process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...');
  console.log('Model:', process.env.OPENROUTER_MODEL);
  
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash-image",
      messages: [
        {
          role: "user",
          content: "Hello, can you respond with just 'OK'?"
        }
      ],
      max_tokens: 10,
    });

    console.log('Success! Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

testOpenRouter();
