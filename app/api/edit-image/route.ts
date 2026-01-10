import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL,
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL,
    "X-Title": process.env.SITE_NAME,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, prompt } = body;

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      );
    }

    // 验证图片格式
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash-image",
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": `Generate an edited version of this image based on the following request: "${prompt}".

Please create a new image that incorporates the uploaded image with the requested modifications. Return the generated image data.`
            },
            {
              "type": "image_url",
              "image_url": {
                "url": image
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const message = completion.choices[0].message;
    const response = message.content;

    // 检查响应内容，尝试提取图像数据
    let imageResult = null;
    let isImageGeneration = false;
    let textResult = response || "Image processed successfully!";

    // 首先检查 message.images 数组（Gemini 2.5 Flash Image 的新格式）
    if (message.images && Array.isArray(message.images) && message.images.length > 0) {
      const imageData = message.images[0];

      // 检查图像数据的不同可能格式
      if (typeof imageData === 'string') {
        imageResult = imageData;
      } else if (imageData.url) {
        imageResult = imageData.url;
      } else if (imageData.data) {
        // 如果是 base64 数据，添加前缀
        imageResult = imageData.data.startsWith('data:') ? imageData.data : `data:image/png;base64,${imageData.data}`;
      } else if (imageData.image_url && imageData.image_url.url) {
        imageResult = imageData.image_url.url;
      }

      if (imageResult) {
        isImageGeneration = true;
        textResult = "Image generated successfully!";
      }
    }

    // 如果 images 数组中没有找到，检查传统的 content 字段
    if (!isImageGeneration && response) {
      // 检查是否包含图像URL
      const imageUrlMatch = response.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi);
      if (imageUrlMatch) {
        isImageGeneration = true;
        imageResult = imageUrlMatch[0];
        textResult = "Image generated successfully!";
      }

      // 检查是否包含base64图像数据
      const base64ImageMatch = response.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g);
      if (base64ImageMatch) {
        isImageGeneration = true;
        imageResult = base64ImageMatch[0];
        textResult = "Image generated successfully!";
      }
    }

    console.log('Full API Response:', {
      message: completion.choices[0].message,
      response: response ? response.substring(0, 200) + '...' : 'empty',
      usage: completion.usage,
      isImageGeneration,
      imageResult: imageResult ? imageResult.substring(0, 100) + '...' : null,
      imagesArray: completion.choices[0].message.images
    });

    return NextResponse.json({
      success: true,
      result: textResult,
      imageResult: imageResult,
      isImageGeneration,
      usage: completion.usage
    });

  } catch (error) {
    console.error('Error processing image:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}