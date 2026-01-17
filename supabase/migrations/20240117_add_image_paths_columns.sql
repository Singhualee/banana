-- Add columns to store file paths instead of base64 data
ALTER TABLE user_images ADD COLUMN IF NOT EXISTS original_image_path TEXT;
ALTER TABLE user_images ADD COLUMN IF NOT EXISTS generated_image_path TEXT;

-- Create index on file paths for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_images_original_path ON user_images(original_image_path);
CREATE INDEX IF NOT EXISTS idx_user_images_generated_path ON user_images(generated_image_path);

-- Update existing data to use paths (optional - if you want to keep existing base64 data, skip this)
-- This is a one-time migration to move from base64 to storage
-- Uncomment the following if you want to migrate existing data:

/*
-- Function to migrate existing base64 images to storage
CREATE OR REPLACE FUNCTION migrate_images_to_storage()
RETURNS VOID AS $$
DECLARE
  image_record RECORD;
  file_name TEXT;
  upload_result RECORD;
BEGIN
  FOR image_record IN SELECT id, user_id, original_image, generated_image, prompt FROM user_images WHERE original_image_path IS NULL LOOP
    -- Upload original image
    file_name := image_record.user_id || '/' || image_record.id || '_original.png';
    
    INSERT INTO storage.objects (name, bucket_id, owner, metadata)
    VALUES (
      file_name,
      'user-images',
      image_record.user_id,
      jsonb_build_object('original_id', image_record.id)
    );
    
    -- Upload generated image
    file_name := image_record.user_id || '/' || image_record.id || '_generated.png';
    
    INSERT INTO storage.objects (name, bucket_id, owner, metadata)
    VALUES (
      file_name,
      'user-images',
      image_record.user_id,
      jsonb_build_object('generated_id', image_record.id)
    );
    
    -- Update user_images with paths
    UPDATE user_images
    SET 
      original_image_path = image_record.user_id || '/' || image_record.id || '_original.png',
      generated_image_path = image_record.user_id || '/' || image_record.id || '_generated.png'
    WHERE id = image_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run migration (uncomment to execute)
-- SELECT migrate_images_to_storage();
*/
