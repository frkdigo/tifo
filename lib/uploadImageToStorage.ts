import { supabase } from "./supabaseClient";

export async function uploadImageToStorage(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('team-avatars')
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data: publicUrlData } = supabase
    .storage
    .from('team-avatars')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
