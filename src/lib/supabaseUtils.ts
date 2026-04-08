import { supabase } from "@/lib/supabaseClient";

export const makeObjectKey = (folder: string, fileName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileExtension = fileName.split(".").pop();
  
  return `${folder}/${timestamp}-${randomString}.${fileExtension}`;
};

export const uploadPublicFile = async (path: string, file: File) => {
  const BUCKET_NAME = "public";

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  return { data, error };
};