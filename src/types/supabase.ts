import type { Database } from '../../database.types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

export type Album = Tables<'Album'>;
export type Artist = Tables<'Artist'>;
export type Dialogue = Tables<'Dialogue'>;
export type Genre = Tables<'Genre'>;
export type Group = Tables<'Group'>;
export type Message = Tables<'Message'>;
export type Playlist = Tables<'Playlist'>;
export type PlaylistLike = Tables<'Playlist_like'>;
export type PlaylistTrack = Tables<'Playlist_track'>;
export type Post = Tables<'Post'>;
export type PostLike = Tables<'Post_like'>;
export type Profile = Tables<'Profile'>;
export type Token = Tables<'Token'>;
export type Track = Tables<'Track'>;
export type TrackLike = Tables<'Track_like'>;
export type User = Tables<'User'>;
export type UserDialogue = Tables<'User_dialogue'>;
export type UserGroup = Tables<'User_group'>;
export type UserPlaylist = Tables<'User_playlist'>;
export type UserRecommendation = Tables<'User_recommendation'>;
export type UserSubscription = Tables<'User_user_subscription'>;
