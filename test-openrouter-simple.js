const OpenAI = require('openai');

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Image Editor",
  },
});

async function testOpenRouter() {
  console.log('='.repeat(60));
  console.log('Testing OpenRouter API');
  console.log('='.repeat(60));
  console.log('');
  console.log('Configuration:');
  console.log('  Base URL:', 'https://openrouter.ai/api/v1');
  console.log('  API Key:', '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');
  console.log('  Model:', 'google/gemini-2.5-flash-image');
  console.log('');
  console.log('='.repeat(60));
  console.log('Sending request...');
  console.log('='.repeat(60));
  console.log('');

  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash-image',
      messages: [
        {
          role: 'user',
          content: 'Hello, please respond with just "OK"'
        }
      ],
      max_tokens: 10,
    });

    console.log('='.repeat(60));
    console.log('SUCCESS! Response received:');
    console.log('='.repeat(60));
    console.log('');
    console.log('Full response:', JSON.stringify(completion, null, 2));
    console.log('');
    console.log('Message content:', completion.choices[0].message.content);
    console.log('');
    console.log('Usage:', JSON.stringify(completion.usage, null, 2));
    console.log('');
    console.log('='.repeat(60));
    console.log('Test completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.log('='.repeat(60));
    console.log('ERROR! Request failed:');
    console.log('='.repeat(60));
    console.log('');
    console.log('Error message:', error.message);
    console.log('');
    console.log('Error status:', error.status);
    console.log('');
    console.log('Error code:', error.code);
    console.log('');
    console.log('Full error:', JSON.stringify(error, null, 2));
    console.log('');
    console.log('='.repeat(60));
    console.log('Test failed!');
    console.log('='.repeat(60));
  }
}

testOpenRouter();
