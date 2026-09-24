import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'musicIsStorage';

export const makeObjectKey = (folder: string, fileName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileExtension = fileName.split('.').pop();

  return `${folder}/${timestamp}-${randomString}.${fileExtension}`;
};

export const uploadPublicFile = async (
  supabase: SupabaseClient,
  path: string,
  file: File
) => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  return { data, error };
};

export const uploadAndGetHash = async (
  supabase: SupabaseClient,
  folder: string,
  file: File
): Promise<string> => {
  const objectKey = makeObjectKey(folder, file.name);
  const { error } = await uploadPublicFile(supabase, objectKey, file);
  if (error) throw error;

  const hash = objectKey.split('/').pop();
  if (!hash) throw new Error('Failed to derive object hash');
  return hash;
};
