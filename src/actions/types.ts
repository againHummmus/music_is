import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type Db = SupabaseClient<Database>;

export const TRACK_SELECT = `
  *,
  Album(*),
  Artist(*),
  Genre(*),
  Track_like(*),
  Playlist_track(*)
`;

export const USER_BRIEF_SELECT = `id, username, avatar_url`;

export const USER_PUBLIC_COLUMNS = `id, created_at, username, avatar_url, app_role, artistId, is_activated, preferences_vector`;

export const USER_SELF_COLUMNS = `${USER_PUBLIC_COLUMNS}, email, sbUserId`;

export const USER_WITH_ARTIST_SELECT = `${USER_SELF_COLUMNS}, Artist(*)`;

export const ALBUM_SELECT = `
  *,
  Artist(*),
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

export const USER_PLAYLIST_SELECT_INNER = `
  *,
  Playlist!inner ( ${PLAYLIST_EMBED_FIELDS} )
`;

export const USER_SELECT = `
  ${USER_PUBLIC_COLUMNS},
  Artist(*),
  User_playlist (
    id,
    is_creator,
    Playlist (
      *,
      Creator:Creator ( ${USER_BRIEF_SELECT} ),
      Playlist_track (
        *,
        Track ( ${TRACK_SELECT} )
      )
    )
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
  Post_like(*),
  Track ( ${TRACK_SELECT} ),
  Playlist (
    *,
    Creator:Creator ( ${USER_BRIEF_SELECT} )
  )
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

export const RECOMMENDATION_SELECT = `
  *,
  RecommendedUser:User!User_recommendation_RecommendedUser_fkey ( * )
`;

export const SUBSCRIPTION_SELECT = `
  *,
  Followee:User!User_user_subscription_Followee_fkey (
    ${USER_PUBLIC_COLUMNS},
    Post (
      *,
      Post_like(*)
    )
  )
`;

export const MUTUAL_POSTS_SELECT = `
  Post (
    *,
    Post_like(*)
  )
`;

export const MUTUAL_PLAYLISTS_SELECT = `
  User_playlist (
    id,
    is_creator,
    Playlist (
      *,
      Creator:Creator ( ${USER_BRIEF_SELECT} ),
      User_playlist ( id, User ),
      Playlist_track (
        *,
        Track ( ${TRACK_SELECT} )
      )
    )
  )
`;

const _trackQuery = (db: Db) => db.from('Track').select(TRACK_SELECT);
export type TrackRow = QueryData<ReturnType<typeof _trackQuery>>[number];

const _albumQuery = (db: Db) => db.from('Album').select(ALBUM_SELECT);
export type AlbumRow = QueryData<ReturnType<typeof _albumQuery>>[number];

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

const _userFullQuery = (db: Db) => db.from('User').select(USER_SELECT);
export type UserRow = QueryData<ReturnType<typeof _userFullQuery>>[number];

const _userWithArtistQuery = (db: Db) =>
  db.from('User').select(USER_WITH_ARTIST_SELECT);
export type UserWithArtistRow = QueryData<
  ReturnType<typeof _userWithArtistQuery>
>[number];

const _userBasicQuery = (db: Db) => db.from('User').select(USER_PUBLIC_COLUMNS);
export type UserBasicRow = QueryData<
  ReturnType<typeof _userBasicQuery>
>[number];

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

const _recsQuery = (db: Db) =>
  db.from('User_recommendation').select(RECOMMENDATION_SELECT);
export type RecommendationRow = QueryData<
  ReturnType<typeof _recsQuery>
>[number];

const _subscriptionQuery = (db: Db) =>
  db.from('User_user_subscription').select(SUBSCRIPTION_SELECT);
export type SubscriptionRow = QueryData<
  ReturnType<typeof _subscriptionQuery>
>[number];

const _mutualFriendQuery = (db: Db) =>
  db.from('User').select(
    `${USER_PUBLIC_COLUMNS}, ${MUTUAL_POSTS_SELECT}, ${MUTUAL_PLAYLISTS_SELECT}`
  );
export type MutualFriendRow = QueryData<
  ReturnType<typeof _mutualFriendQuery>
>[number];

export type UserWithArtist = UserWithArtistRow;

export type AuthResult = {
  data: {
    user: UserWithArtist | null;
  } | null;
  error: { message: string } | null;
};
