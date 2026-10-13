import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'musicIsStorage';
const USER_AGENT = 'musicIs-dev/1.0 (py0710@yandex.ru)';
const here = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(here, 'manifest.json');
const progressPath = path.join(here, 'progress.json');
const dryRun = process.argv.includes('--dry-run');

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } });
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const progress = fs.existsSync(progressPath)
  ? JSON.parse(fs.readFileSync(progressPath, 'utf8'))
  : { artists: [], albums: [], tracks: [] };
const saveProgress = () => fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function download(fileUrl) {
  for (let attempt = 0; attempt < 6; attempt++) {
    await sleep(1500);
    const res = await fetch(fileUrl, { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status !== 429 && res.status < 500) throw new Error(`${res.status} ${fileUrl}`);
    await sleep(10000 * (attempt + 1));
  }
  throw new Error(`Gave up downloading ${fileUrl}`);
}

const extensionFor = (mime) => (mime === 'image/png' ? 'png' : 'jpg');

async function upload(folder, extension, contentType, body) {
  const hash = `${randomUUID()}.${extension}`;
  const { error } = await db.storage
    .from(BUCKET)
    .upload(`${folder}/${hash}`, body, { contentType, cacheControl: '3600', upsert: false });
  if (error) throw error;
  return hash;
}

async function countReferences(folder, hash) {
  const checks =
    folder === 'mp3'
      ? [db.from('Track').select('id', { count: 'exact', head: true }).eq('file_hash', hash)]
      : [
          db.from('Artist').select('id', { count: 'exact', head: true }).eq('image_hash', hash),
          db.from('Album').select('id', { count: 'exact', head: true }).eq('image_hash', hash),
          db.from('User').select('id', { count: 'exact', head: true }).eq('avatar_url', hash),
        ];
  const results = await Promise.all(checks);
  for (const result of results) if (result.error) throw result.error;
  return results.reduce((sum, result) => sum + (result.count ?? 0), 0);
}

async function removeIfUnused(folder, hash) {
  if (!hash) return;
  if ((await countReferences(folder, hash)) > 0) return;
  const { error } = await db.storage.from(BUCKET).remove([`${folder}/${hash}`]);
  if (error) console.warn(`  could not remove ${folder}/${hash}: ${error.message}`);
}

async function uploadImage(image) {
  return upload('img', extensionFor(image.mime), image.mime, await download(image.url));
}

async function checkCurrentState() {
  const trackIds = manifest.flatMap((artist) => artist.trackIds);
  const { data, error } = await db.from('Track').select('id, artistId').in('id', trackIds);
  if (error) throw error;
  const found = new Map(data.map((track) => [track.id, track.artistId]));
  const problems = [];
  for (const artist of manifest) {
    for (const id of artist.trackIds) {
      if (!found.has(id)) problems.push(`track ${id} is missing`);
      else if (found.get(id) !== artist.artistId && !progress.tracks.includes(id)) {
        problems.push(`track ${id} belongs to artist ${found.get(id)}, expected ${artist.artistId}`);
      }
    }
  }
  return problems;
}

async function replaceArtist(artist) {
  if (progress.artists.includes(artist.artistId)) return;
  const { data: current, error } = await db
    .from('Artist')
    .select('image_hash')
    .eq('id', artist.artistId)
    .single();
  if (error) throw error;

  const imageHash = await uploadImage(artist.image);
  const { error: updateError } = await db
    .from('Artist')
    .update({ name: artist.artist, image_hash: imageHash })
    .eq('id', artist.artistId);
  if (updateError) throw updateError;
  await removeIfUnused('img', current.image_hash);

  progress.artists.push(artist.artistId);
  saveProgress();
  console.log(`artist ${artist.artistId} -> ${artist.artist}`);
}

async function replaceAlbum(artist, album) {
  if (progress.albums.includes(album.albumId)) return;
  const { data: current, error } = await db
    .from('Album')
    .select('image_hash')
    .eq('id', album.albumId)
    .single();
  if (error) throw error;

  const imageHash = await uploadImage(album.cover);
  const { error: updateError } = await db
    .from('Album')
    .update({
      name: album.name,
      year: album.year,
      image_hash: imageHash,
      artistId: artist.artistId,
    })
    .eq('id', album.albumId);
  if (updateError) throw updateError;
  await removeIfUnused('img', current.image_hash);

  progress.albums.push(album.albumId);
  saveProgress();
  console.log(`  album ${album.albumId} -> ${album.name}`);
}

async function replaceTrack(artist, album, trackId, track) {
  if (progress.tracks.includes(trackId)) return;
  const { data: current, error } = await db
    .from('Track')
    .select('file_hash')
    .eq('id', trackId)
    .single();
  if (error) throw error;

  const fileHash = await upload('mp3', 'mp3', 'audio/mpeg', await download(track.mp3));
  const { error: updateError } = await db
    .from('Track')
    .update({
      name: track.name,
      file_hash: fileHash,
      albumId: album.albumId,
      artistId: artist.artistId,
      lyrics: null,
      genreId: null,
    })
    .eq('id', trackId);
  if (updateError) throw updateError;
  await removeIfUnused('mp3', current.file_hash);

  progress.tracks.push(trackId);
  saveProgress();
  console.log(`    track ${trackId} -> ${track.name}`);
}

const problems = await checkCurrentState();
if (problems.length) {
  console.error('Database does not match the manifest:\n' + problems.join('\n'));
  process.exit(1);
}

if (dryRun) {
  for (const artist of manifest) {
    console.log(`artist ${artist.artistId} -> ${artist.artist}`);
    let index = 0;
    for (const album of artist.albums) {
      console.log(`  album ${album.albumId} -> ${album.name} (${album.year})`);
      for (const track of album.tracks) {
        console.log(`    track ${artist.trackIds[index++]} -> ${track.name}`);
      }
    }
  }
  console.log('\nDry run only. Nothing was changed.');
  process.exit(0);
}

for (const artist of manifest) {
  await replaceArtist(artist);
  let index = 0;
  for (const album of artist.albums) {
    await replaceAlbum(artist, album);
    for (const track of album.tracks) {
      await replaceTrack(artist, album, artist.trackIds[index++], track);
    }
  }
}

console.log('\nDone. All tracks, albums and artists from the manifest were replaced.');
