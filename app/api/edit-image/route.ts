import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL,
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL,
    "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || process.env.SITE_NAME,
  },
});

export async function POST(request: NextRequest) {
  try {
    console.log('[API] Starting image generation request...')
    
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();

    console.log('[API] User authenticated:', !!user, user?.id)

    if (!user) {
      console.log('[API] No user found, returning 401')
      return NextResponse.json(
        { error: 'Please login to use this feature' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image, prompt } = body;

    console.log('[API] Request body received:', { hasImage: !!image, hasPrompt: !!prompt, imageSize: image?.length })

    if (!image || !prompt) {
      console.log('[API] Missing required fields')
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      );
    }

    // Validate image format
    if (!image.startsWith('data:image/')) {
      console.log('[API] Invalid image format')
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    // Check user credits
    let { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('user_id', user.id)
      .maybeSingle();

    if (creditsError && creditsError.code === 'PGRST116') {
      console.log('User credits not found, creating new record...')
      const { data: newCreditsData, error: insertError } = await supabase.rpc('handle_new_user_credits', {
        p_user_id: user.id
      })

      if (insertError) {
        console.error('Error creating user credits:', insertError)
        return NextResponse.json(
          { error: 'Failed to create user credits' },
          { status: 500 }
        );
      }

      creditsData = newCreditsData
      creditsError = null
    }

    if (creditsError || !creditsData) {
      return NextResponse.json(
        { error: 'Failed to check credits. Please try again.' },
        { status: 500 }
      );
    }

    if (creditsData.credits_remaining <= 0) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits',
          creditsRemaining: 0,
          message: 'You have used all your free image generation credits. Please purchase more credits to continue.'
        },
        { status: 402 }
      );
    }

    console.log('[API] OpenRouter Configuration:', {
      baseURL: process.env.OPENROUTER_BASE_URL,
      hasApiKey: !!process.env.OPENROUTER_API_KEY,
      apiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...',
      model: process.env.OPENROUTER_MODEL
    })

    console.log('[API] Calling OpenAI API...')
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

    console.log('[API] OpenAI response received:', {
      hasChoices: !!completion.choices,
      choicesCount: completion.choices?.length,
      firstChoice: completion.choices?.[0],
      fullMessage: completion.choices?.[0]?.message,
      fullCompletion: JSON.stringify(completion, null, 2)
    })

    if (!completion.choices || completion.choices.length === 0) {
      console.error('[API] No choices in OpenAI response')
      return NextResponse.json(
        { error: 'No response from AI model' },
        { status: 500 }
      );
    }

    const choice = completion.choices[0];

    console.log('[API] Choice:', JSON.stringify(choice, null, 2))

    if ((completion as any).error) {
      console.error('[API] AI model returned error:', (completion as any).error)
      return NextResponse.json(
        { error: `AI model error: ${(completion as any).error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    if (!choice) {
      console.error('[API] No choice returned from AI model')
      return NextResponse.json(
        { error: 'AI model returned empty response' },
        { status: 500 }
      );
    }

    const message = choice.message;
    const response = message.content;

    console.log('[API] Message content:', response)

    // Check response content and try to extract image data
    let imageResult = null;
    let isImageGeneration = false;
    let textResult = response || "Image processed successfully!";

    const messageWithImages = message as any;

    // First check message.images array (new format for Gemini 2.5 Flash Image)
    if (messageWithImages.images && Array.isArray(messageWithImages.images) && messageWithImages.images.length > 0) {
      console.log('[API] Found images in message.images array:', messageWithImages.images.length)
      const imageData = messageWithImages.images[0];

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
        console.log('[API] Image extracted successfully')
      }
    }

    // If no image found and no text response, return error
    if (!isImageGeneration && (!response || response.trim() === '')) {
      console.error('[API] Empty response from AI model and no images found')
      return NextResponse.json(
        { error: 'AI model returned empty response. The image or prompt may violate content policies.' },
        { status: 500 }
      );
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

    // If successfully generated image, save to database and deduct credits
    if (isImageGeneration && imageResult) {
      try {
        // Generate unique file names
        const timestamp = Date.now();
        const originalFileName = `${user.id}/${timestamp}_original.png`;
        const generatedFileName = `${user.id}/${timestamp}_generated.png`;

        // Upload original image to Supabase Storage
        console.log('[API] Uploading original image to Supabase Storage, filename:', originalFileName)
        
        // Convert original image (base64) to Blob for upload
        const base64Data = image.split(',')[1];
        const binaryData = Buffer.from(base64Data, 'base64');
        const originalImageBlob = new Blob([binaryData], { type: 'image/png' });
        
        const { data: originalUploadData, error: originalUploadError } = await supabase.storage
          .from('user-images')
          .upload(originalFileName, originalImageBlob, {
            contentType: 'image/png',
            upsert: false
          });

        if (originalUploadError) {
          console.error('Error uploading original image to storage:', originalUploadError);
          return NextResponse.json(
            { error: 'Failed to upload original image' },
            { status: 500 }
          );
        }
        console.log('[API] Original image uploaded successfully:', originalUploadData?.path)

        // Upload generated image to Supabase Storage
        console.log('[API] Uploading generated image to Supabase Storage, filename:', generatedFileName)
        
        // Convert imageResult to Blob for upload
        let generatedImageBlob: Blob;
        if (typeof imageResult === 'string') {
          if (imageResult.startsWith('http')) {
            // It's a URL, fetch the image data
            const response = await fetch(imageResult);
            generatedImageBlob = await response.blob();
          } else if (imageResult.startsWith('data:')) {
            // It's a base64 data URL, convert to Blob
            const base64Data = imageResult.split(',')[1];
            const binaryData = Buffer.from(base64Data, 'base64');
            generatedImageBlob = new Blob([binaryData], { type: 'image/png' });
          } else {
            // It's a raw base64 string, convert to Blob
            const binaryData = Buffer.from(imageResult, 'base64');
            generatedImageBlob = new Blob([binaryData], { type: 'image/png' });
          }
        } else {
          // If it's already a Blob or Buffer, use it directly
          generatedImageBlob = imageResult instanceof Blob ? imageResult : new Blob([imageResult], { type: 'image/png' });
        }
        
        const { data: generatedUploadData, error: generatedUploadError } = await supabase.storage
          .from('user-images')
          .upload(generatedFileName, generatedImageBlob, {  
            contentType: 'image/png',
            upsert: false
          });

        if (generatedUploadError) {
          console.error('Error uploading generated image to storage:', generatedUploadError);
          return NextResponse.json(
            { error: 'Failed to upload generated image' },
            { status: 500 }
          );
        }
        console.log('[API] Generated image uploaded successfully:', generatedUploadData?.path)

        // Get public URLs for both images
        console.log('[API] Getting public URLs for images...')
        const { data: originalPublicUrl } = await supabase.storage
          .from('user-images')
          .getPublicUrl(originalFileName);

        const { data: generatedPublicUrl } = await supabase.storage
          .from('user-images')
          .getPublicUrl(generatedFileName);

        console.log('[API] Public URLs:', {
          original: originalPublicUrl?.publicUrl,
          generated: generatedPublicUrl?.publicUrl
        })

        if (!originalPublicUrl.publicUrl || !generatedPublicUrl.publicUrl) {
          console.error('Error getting public URLs');
          return NextResponse.json(
            { error: 'Failed to get public URLs' },
            { status: 500 }
          );
        }

        // Save file paths to database
        console.log('[API] Saving image data to database...')
        const { error: dbError } = await supabase
          .from('user_images')
          .insert({
            user_id: user.id,
            original_image_path: originalFileName,
            generated_image_path: generatedFileName,
            original_image: originalPublicUrl.publicUrl,
            generated_image: generatedPublicUrl.publicUrl,
            prompt: prompt
          });

        if (dbError) {
          console.error('Error saving image to database:', dbError);
          return NextResponse.json(
            { error: 'Failed to save image' },
            { status: 500 }
          );
        }
        console.log('[API] Image saved to database successfully')

        // Deduct one credit
        const { error: deductError } = await supabase
          .from('user_credits')
          .update({
            credits_remaining: creditsData.credits_remaining - 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (deductError) {
          console.error('Error deducting credit:', deductError);
        }
      } catch (error) {
        console.error('Error processing image generation:', error);
      }
    }

    return NextResponse.json({
      success: true,
      result: textResult,
      imageResult: imageResult,
      isImageGeneration,
      usage: completion.usage,
      creditsRemaining: isImageGeneration ? creditsData.credits_remaining - 1 : creditsData.credits_remaining
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