import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const imageId = resolvedParams.id;

    const { data: imageData, error: fetchError } = await supabase
      .from('user_images')
      .select('original_image, generated_image, original_image_path, generated_image_path')
      .eq('id', imageId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !imageData) {
      console.error('Error fetching image:', fetchError);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Try to delete from storage using path columns if they exist
    const originalPath = imageData.original_image_path || imageData.original_image;
    const generatedPath = imageData.generated_image_path || imageData.generated_image;

    // Check if paths look like URLs (not file paths)
    const isUrl = (path: string) => path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:');

    // Only try to delete from storage if paths don't look like URLs
    if (originalPath && !isUrl(originalPath)) {
      console.log('[Delete] Deleting original image from storage:', originalPath)
      const { error: originalDeleteError } = await supabase.storage
        .from('user-images')
        .remove([originalPath]);

      if (originalDeleteError) {
        console.error('Error deleting original image from storage:', originalDeleteError);
      }
    }

    if (generatedPath && !isUrl(generatedPath)) {
      console.log('[Delete] Deleting generated image from storage:', generatedPath)
      const { error: generatedDeleteError } = await supabase.storage
        .from('user-images')
        .remove([generatedPath]);

      if (generatedDeleteError) {
        console.error('Error deleting generated image from storage:', generatedDeleteError);
      }
    }

    const { error } = await supabase
      .from('user_images')
      .delete()
      .eq('id', imageId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting image from database:', error);
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/images/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
