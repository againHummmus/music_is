import { createClient } from '@supabase/supabase-js';
import type { QueryData } from '@supabase/supabase-js';
import type { Database } from '../../database.types';

const schema = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export const USER_PLAYLIST_SELECT = `
  *,
  Playlist (
    *,
    Creator:Creator ( ${USER_BRIEF_SELECT} ),
    Playlist_track (
      *,
      Track ( ${TRACK_SELECT} )
    )
  )
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

export const RECOMMENDATION_SELECT = `*, RecommendedUser:RecommendedUser ( * )`;

export const SUBSCRIPTION_SELECT = `
  *,
  Followee:Followee (
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

const _trackQuery = schema.from('Track').select(TRACK_SELECT);
export type TrackRow = QueryData<typeof _trackQuery>[number];

const _albumQuery = schema.from('Album').select(ALBUM_SELECT);
export type AlbumRow = QueryData<typeof _albumQuery>[number];

const _playlistQuery = schema.from('Playlist').select(PLAYLIST_SELECT);
export type PlaylistRow = QueryData<typeof _playlistQuery>[number];

const _playlistTrackQuery = schema
  .from('Playlist_track')
  .select(PLAYLIST_TRACK_SELECT);
export type PlaylistTrackRow = QueryData<typeof _playlistTrackQuery>[number];

const _userPlaylistQuery = schema
  .from('User_playlist')
  .select(USER_PLAYLIST_SELECT);
export type UserPlaylistRow = QueryData<typeof _userPlaylistQuery>[number];

const _userFullQuery = schema.from('User').select(USER_SELECT);
export type UserRow = QueryData<typeof _userFullQuery>[number];

const _userWithArtistQuery = schema.from('User').select(USER_WITH_ARTIST_SELECT);
export type UserWithArtistRow = QueryData<typeof _userWithArtistQuery>[number];

const _userBasicQuery = schema.from('User').select(USER_PUBLIC_COLUMNS);
export type UserBasicRow = QueryData<typeof _userBasicQuery>[number];

const _messageQuery = schema.from('Message').select(MESSAGE_SELECT);
export type MessageRow = QueryData<typeof _messageQuery>[number];

const _postQuery = schema.from('Post').select(POST_SELECT);
export type PostRow = QueryData<typeof _postQuery>[number];

const _dialogueQuery = schema.from('User_dialogue').select(DIALOGUE_SELECT);
export type DialogueRow = QueryData<typeof _dialogueQuery>[number];

const _participantQuery = schema
  .from('User_dialogue')
  .select(PARTICIPANT_SELECT);
export type ParticipantRow = QueryData<typeof _participantQuery>[number];

const _recsQuery = schema
  .from('User_recommendation')
  .select(RECOMMENDATION_SELECT);
export type RecommendationRow = QueryData<typeof _recsQuery>[number];

const _subscriptionQuery = schema
  .from('User_user_subscription')
  .select(SUBSCRIPTION_SELECT);
export type SubscriptionRow = QueryData<typeof _subscriptionQuery>[number];

const _mutualFriendQuery = schema
  .from('User')
  .select(
    `${USER_PUBLIC_COLUMNS}, ${MUTUAL_POSTS_SELECT}, ${MUTUAL_PLAYLISTS_SELECT}`
  );
export type MutualFriendRow = QueryData<typeof _mutualFriendQuery>[number];

export type UserWithArtist = UserWithArtistRow;

export type AuthResult = {
  data: {
    user: UserWithArtist | null;
  } | null;
  error: { message: string } | null;
};
