import { supabase } from './supabaseBrowser';

const BUCKET_NAME = 'musicIsStorage';

export async function uploadFromBrowser(
  folder: string,
  file: File
): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const hash = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(`${folder}/${hash}`, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });
  if (error) throw error;

  return hash;
}

export async function withUploadedFile<T>(
  folder: string,
  file: File,
  action: (hash: string) => Promise<T>
): Promise<T> {
  const hash = await uploadFromBrowser(folder, file);
  try {
    return await action(hash);
  } catch (error) {
    await removeFromBrowser(folder, hash);
    throw error;
  }
}

export async function removeFromBrowser(folder: string, hash: string) {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([`${folder}/${hash}`]);
  if (error) console.error(`Failed to remove ${folder}/${hash}`, error);
}
