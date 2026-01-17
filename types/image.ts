export interface UserImage {
  id: string
  user_id: string
  original_image: string
  generated_image: string
  original_image_path?: string
  generated_image_path?: string
  prompt: string
  created_at: string
  updated_at: string
}

export interface CreateImageInput {
  original_image: string
  generated_image: string
  prompt: string
}
