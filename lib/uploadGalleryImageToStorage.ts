import { supabase } from "./supabaseClient";

export async function uploadGalleryImageToStorage(file: File, topicId: string, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${topicId}_${userId}_${Date.now()}.${fileExt}`;
  const filePath = `gallery/${topicId}/${fileName}`;

  const { error } = await supabase.storage
    .from('gallery-images')
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data: publicUrlData } = supabase
    .storage
    .from('gallery-images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
