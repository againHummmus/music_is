'use server';

import { headers } from 'next/headers';
import { requireSession } from './session';
import { removeStoredFile } from '@/lib/supabase/supabaseUtils';

const USER_TABLE = 'User';

export interface AccountExport {
  exportedAt: string;
  profile: {
    id: number;
    username: string | null;
    email: string | null;
    role: string;
    createdAt: string;
    avatarUrl: string | null;
    recommendationsEnabled: boolean;
  };
  posts: { id: number; content: string | null; createdAt: string }[];
  likedPosts: { postId: number | null; likedAt: string }[];
  likedTracks: { trackId: number | null; name: string | null; likedAt: string }[];
  playlists: {
    id: number;
    name: string | null;
    description: string | null;
    isPublic: boolean | null;
    tracks: (string | null)[];
  }[];
  following: (string | null)[];
  followers: (string | null)[];
  messages: {
    dialogueId: number | null;
    content: string | null;
    sentAt: string;
  }[];
  artist: {
    name: string | null;
    albums: { name: string | null; year: number | null }[];
    tracks: { name: string | null; lyrics: string | null }[];
  } | null;
}

export async function exportMyData(): Promise<AccountExport> {
  const { supabase, user } = await requireSession();

  const [posts, postLikes, trackLikes, playlists, following, followers, messages] =
    await Promise.all([
      supabase.from('Post').select('id, content, created_at').eq('userId', user.id),
      supabase.from('Post_like').select('postId, created_at').eq('userId', user.id),
      supabase
        .from('Track_like')
        .select('trackId, created_at, Track ( name )')
        .eq('userId', user.id),
      supabase
        .from('Playlist')
        .select('id, name, description, is_public, Playlist_track ( Track ( name ) )')
        .eq('Creator', user.id),
      supabase
        .from('User_user_subscription')
        .select('Followee:User!User_user_subscription_Followee_fkey ( username )')
        .eq('Follower', user.id),
      supabase
        .from('User_user_subscription')
        .select('Follower:User!User_user_subscription_Follower_fkey ( username )')
        .eq('Followee', user.id),
      supabase.from('Message').select('dialogueId, content, created_at').eq('userId', user.id),
    ]);

  for (const result of [
    posts,
    postLikes,
    trackLikes,
    playlists,
    following,
    followers,
    messages,
  ]) {
    if (result.error) throw result.error;
  }

  let artist: AccountExport['artist'] = null;
  if (user.artistId) {
    const [albums, tracks] = await Promise.all([
      supabase.from('Album').select('name, year').eq('artistId', user.artistId),
      supabase.from('Track').select('name, lyrics').eq('artistId', user.artistId),
    ]);
    if (albums.error) throw albums.error;
    if (tracks.error) throw tracks.error;
    artist = {
      name: user.Artist?.name ?? null,
      albums: albums.data ?? [],
      tracks: tracks.data ?? [],
    };
  }

  return {
    exportedAt: new Date().toISOString(),
    profile: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.app_role,
      createdAt: user.created_at,
      avatarUrl: user.avatar_url,
      recommendationsEnabled: user.recommendations_enabled,
    },
    posts: (posts.data ?? []).map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.created_at,
    })),
    likedPosts: (postLikes.data ?? []).map((like) => ({
      postId: like.postId,
      likedAt: like.created_at,
    })),
    likedTracks: (trackLikes.data ?? []).map((like) => ({
      trackId: like.trackId,
      name: like.Track?.name ?? null,
      likedAt: like.created_at,
    })),
    playlists: (playlists.data ?? []).map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      isPublic: playlist.is_public,
      tracks: playlist.Playlist_track.map((pt) => pt.Track?.name ?? null),
    })),
    following: (following.data ?? []).map((s) => s.Followee?.username ?? null),
    followers: (followers.data ?? []).map((s) => s.Follower?.username ?? null),
    messages: (messages.data ?? []).map((message) => ({
      dialogueId: message.dialogueId,
      content: message.content,
      sentAt: message.created_at,
    })),
    artist,
  };
}

export async function deleteMyAccount(): Promise<void> {
  const { supabase, user } = await requireSession();

  const filesToRemove: { folder: string; hash: string }[] = [];
  if (user.avatar_url) filesToRemove.push({ folder: 'img', hash: user.avatar_url });

  if (user.artistId) {
    const [albums, tracks] = await Promise.all([
      supabase.from('Album').select('image_hash').eq('artistId', user.artistId),
      supabase.from('Track').select('file_hash').eq('artistId', user.artistId),
    ]);
    if (albums.error) throw albums.error;
    if (tracks.error) throw tracks.error;
    if (user.Artist?.image_hash) {
      filesToRemove.push({ folder: 'img', hash: user.Artist.image_hash });
    }
    for (const album of albums.data ?? []) {
      if (album.image_hash) filesToRemove.push({ folder: 'img', hash: album.image_hash });
    }
    for (const track of tracks.data ?? []) {
      filesToRemove.push({ folder: 'mp3', hash: track.file_hash });
    }
  }

  const { error } = await supabase.rpc('delete_my_account');
  if (error) throw error;

  await Promise.all(
    filesToRemove.map(({ folder, hash }) => removeStoredFile(supabase, folder, hash))
  );
  await supabase.auth.signOut();
}

export async function changeEmail(newEmail: string): Promise<void> {
  const { supabase } = await requireSession();
  const origin = headers().get('origin') ?? undefined;

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: origin ? `${origin}/settings` : undefined }
  );
  if (error) throw error;
}

export async function changePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ error: string | null }> {
  const { supabase } = await requireSession();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser?.email) return { error: 'Unable to verify the current password' };

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: authUser.email,
    password: currentPassword,
  });
  if (verifyError) return { error: 'Current password is incorrect' };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error?.message ?? null };
}

export async function setRecommendationsEnabled(enabled: boolean): Promise<void> {
  const { supabase, user } = await requireSession();

  const { error } = await supabase
    .from(USER_TABLE)
    .update({ recommendations_enabled: enabled })
    .eq('id', user.id);
  if (error) throw error;
}
