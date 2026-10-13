import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'musicIsStorage';

const UPLOADED_HASH_PATTERNS = {
  img: /^[0-9a-f-]{36}\.(jpg|jpeg|png|gif|webp)$/,
  mp3: /^[0-9a-f-]{36}\.(mp3|wav|ogg|m4a|flac)$/,
};

export const assertUploadedHash = (
  folder: keyof typeof UPLOADED_HASH_PATTERNS,
  hash: string
): string => {
  if (!UPLOADED_HASH_PATTERNS[folder].test(hash)) {
    throw new Error('Invalid uploaded file');
  }
  return hash;
};

export const removeStoredFile = async (
  supabase: SupabaseClient,
  folder: string,
  hash: string
) => {
  const path = `${folder}/${hash}`;
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) console.error(`Failed to remove ${path}`, error);
};
