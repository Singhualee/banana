import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

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
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Please login to use this feature' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image, prompt } = body;

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      );
    }

    // Validate image format
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

    // Check response content and try to extract image data
    let imageResult = null;
    let isImageGeneration = false;
    let textResult = response || "Image processed successfully!";

    // First check message.images array (new format for Gemini 2.5 Flash Image)
    if (message.images && Array.isArray(message.images) && message.images.length > 0) {
      const imageData = message.images[0];

      // Check different possible formats of image data
      if (typeof imageData === 'string') {
        imageResult = imageData;
      } else if (imageData.url) {
        imageResult = imageData.url;
      } else if (imageData.data) {
        // If it's base64 data, add prefix
        imageResult = imageData.data.startsWith('data:') ? imageData.data : `data:image/png;base64,${imageData.data}`;
      } else if (imageData.image_url && imageData.image_url.url) {
        imageResult = imageData.image_url.url;
      }

      if (imageResult) {
        isImageGeneration = true;
        textResult = "Image generated successfully!";
      }
    }

    // If not found in images array, check traditional content field
    if (!isImageGeneration && response) {
      // Check if it contains image URL
      const imageUrlMatch = response.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi);
      if (imageUrlMatch) {
        isImageGeneration = true;
        imageResult = imageUrlMatch[0];
        textResult = "Image generated successfully!";
      }

      // Check if it contains base64 image data
      const base64ImageMatch = response.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g);
      if (base64ImageMatch) {
        isImageGeneration = true;
        imageResult = base64ImageMatch[0];
        textResult = "Image generated successfully!";
      }
    }

    // If successfully generated image, save to database
    if (isImageGeneration && imageResult) {
      try {
        const { error: dbError } = await supabase
          .from('user_images')
          .insert({
            user_id: user.id,
            original_image: image,
            generated_image: imageResult,
            prompt: prompt
          });

        if (dbError) {
          console.error('Error saving image to database:', dbError);
          // Don't affect return result, just log error
        }
      } catch (error) {
        console.error('Error saving image to database:', error);
        // Don't affect return result, just log error
      }
    }

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