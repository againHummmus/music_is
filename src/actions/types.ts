import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type Db = SupabaseClient<Database>;

export const TRACK_SELECT = `
  id,
  name,
  file_hash,
  artistId,
  albumId,
  Album ( id, name, image_hash ),
  Artist ( id, name )
`;

export const TRACK_WITH_STATS_SELECT = `
  ${TRACK_SELECT},
  Track_like ( count ),
  Playlist_track ( count )
`;

export const USER_BRIEF_SELECT = `id, username, avatar_url`;

export const USER_PUBLIC_COLUMNS = `id, username, avatar_url, app_role, artistId`;

export const USER_CARD_SELECT = `
  ${USER_PUBLIC_COLUMNS},
  followers:User_user_subscription!User_user_subscription_Followee_fkey ( count ),
  viewerSubscription:User_user_subscription!User_user_subscription_Followee_fkey ( id )
`;

export const USER_SELF_COLUMNS = `${USER_PUBLIC_COLUMNS}, created_at, sbUserId, recommendations_enabled`;

export const USER_WITH_ARTIST_SELECT = `${USER_SELF_COLUMNS}, Artist(*)`;

export const ALBUM_SELECT = `id, name, year, image_hash, artistId`;

export const ALBUM_DETAILS_SELECT = `
  ${ALBUM_SELECT},
  Artist ( id, name ),
  Track ( ${TRACK_SELECT} )
`;

export const PLAYLIST_SELECT = `
  *,
  Creator:Creator ( ${USER_BRIEF_SELECT} ),
  User_playlist ( id, User ),
  Playlist_track (
    *,
    Track ( ${TRACK_SELECT} )
  )
`;

export const PLAYLIST_TRACK_SELECT = `
  *,
  Track ( ${TRACK_SELECT} )
`;

const PLAYLIST_EMBED_FIELDS = `
  *,
  Creator:Creator ( ${USER_BRIEF_SELECT} ),
  Playlist_track (
    *,
    Track ( ${TRACK_SELECT} )
  )
`;

export const USER_PLAYLIST_SELECT = `
  *,
  Playlist ( ${PLAYLIST_EMBED_FIELDS} )
`;

export const USER_SELECT = `${USER_PUBLIC_COLUMNS}, Artist(*)`;

export const USER_PROFILE_SELECT = `
  ${USER_SELECT},
  User_playlist (
    id,
    is_creator,
    Playlist ( ${PLAYLIST_EMBED_FIELDS} )
  )
`;

export const MESSAGE_SELECT = `
  *,
  User:User ( ${USER_BRIEF_SELECT} ),
  Track ( ${TRACK_SELECT} )
`;

export const POST_SELECT = `
  *,
  User:User ( ${USER_BRIEF_SELECT} ),
  Post_like ( userId )
`;

export const DIALOGUE_SELECT = `
  dialogueId,
  is_creator,
  Dialogue (
    id,
    title,
    Message(count),
    User_dialogue (
      userId,
      is_creator,
      User:User ( ${USER_BRIEF_SELECT} )
    )
  )
`;

export const PARTICIPANT_SELECT = `userId, is_creator, User:User ( ${USER_BRIEF_SELECT} )`;

export const MUTUAL_PLAYLISTS_SELECT = `
  User_playlist (
    id,
    is_creator,
    Playlist ( ${PLAYLIST_EMBED_FIELDS} )
  )
`;

const _trackQuery = (db: Db) => db.from('Track').select(TRACK_SELECT);
export type TrackRow = QueryData<ReturnType<typeof _trackQuery>>[number];

const _trackWithStatsQuery = (db: Db) =>
  db.from('Track').select(TRACK_WITH_STATS_SELECT);
export type TrackWithStatsRow = QueryData<
  ReturnType<typeof _trackWithStatsQuery>
>[number];

const _albumQuery = (db: Db) => db.from('Album').select(ALBUM_SELECT);
export type AlbumRow = QueryData<ReturnType<typeof _albumQuery>>[number];

const _albumDetailsQuery = (db: Db) =>
  db.from('Album').select(ALBUM_DETAILS_SELECT);
export type AlbumDetailsRow = QueryData<
  ReturnType<typeof _albumDetailsQuery>
>[number];

const _playlistQuery = (db: Db) => db.from('Playlist').select(PLAYLIST_SELECT);
export type PlaylistRow = QueryData<ReturnType<typeof _playlistQuery>>[number];

const _playlistWithTracksQuery = (db: Db) =>
  db.from('Playlist').select(PLAYLIST_EMBED_FIELDS);
export type PlaylistWithTracksRow = QueryData<
  ReturnType<typeof _playlistWithTracksQuery>
>[number];

const _playlistTrackQuery = (db: Db) =>
  db.from('Playlist_track').select(PLAYLIST_TRACK_SELECT);
export type PlaylistTrackRow = QueryData<
  ReturnType<typeof _playlistTrackQuery>
>[number];

const _userPlaylistQuery = (db: Db) =>
  db.from('User_playlist').select(USER_PLAYLIST_SELECT);
export type UserPlaylistRow = QueryData<
  ReturnType<typeof _userPlaylistQuery>
>[number];

const _userQuery = (db: Db) => db.from('User').select(USER_SELECT);
export type UserRow = QueryData<ReturnType<typeof _userQuery>>[number];

const _userProfileQuery = (db: Db) => db.from('User').select(USER_PROFILE_SELECT);
export type UserProfileRow = QueryData<
  ReturnType<typeof _userProfileQuery>
>[number];

const _userWithArtistQuery = (db: Db) =>
  db.from('User').select(USER_WITH_ARTIST_SELECT);
export type UserWithArtistRow = QueryData<
  ReturnType<typeof _userWithArtistQuery>
>[number];

const _userBasicQuery = (db: Db) => db.from('User').select(USER_PUBLIC_COLUMNS);
export type UserBasicRow = QueryData<
  ReturnType<typeof _userBasicQuery>
>[number];

const _userCardQuery = (db: Db) => db.from('User').select(USER_CARD_SELECT);
export type UserCardRow = QueryData<ReturnType<typeof _userCardQuery>>[number];

const _messageQuery = (db: Db) => db.from('Message').select(MESSAGE_SELECT);
export type MessageRow = QueryData<ReturnType<typeof _messageQuery>>[number];

const _postQuery = (db: Db) => db.from('Post').select(POST_SELECT);
export type PostRow = QueryData<ReturnType<typeof _postQuery>>[number];

const _dialogueQuery = (db: Db) =>
  db.from('User_dialogue').select(DIALOGUE_SELECT);
export type DialogueRow = QueryData<ReturnType<typeof _dialogueQuery>>[number];

const _participantQuery = (db: Db) =>
  db.from('User_dialogue').select(PARTICIPANT_SELECT);
export type ParticipantRow = QueryData<
  ReturnType<typeof _participantQuery>
>[number];

const _mutualFriendQuery = (db: Db) =>
  db.from('User').select(`${USER_CARD_SELECT}, ${MUTUAL_PLAYLISTS_SELECT}`);
export type MutualFriendRow = QueryData<
  ReturnType<typeof _mutualFriendQuery>
>[number];

export type UserWithArtist = UserWithArtistRow & { email: string | null };

export type AuthResult = {
  data: {
    user: UserWithArtist | null;
  } | null;
  error: { message: string } | null;
};
