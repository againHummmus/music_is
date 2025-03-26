interface Album {
  artistId: number | null;
  created_at: string;
  id: number;
  image_hash: string | null;
  name: string | null;
  year: number | null;
}

interface Artist {
  created_at: string;
  id: number;
  image_hash: string | null;
  name: string | null;
  userId: number | null;
}

interface Dialogue {
  created_at: string;
  id: number;
  title: string | null;
}

interface Dialogue_user {
  created_at: string;
  dialogueId: number | null;
  id: number;
  is_creator: boolean | null;
  userId: number | null;
}

interface Genre {
  created_at: string;
  id: number;
  name: string | null;
}

interface Group {
  created_at: string;
  description: string | null;
  id: number;
  name: string | null;
}

interface Message {
  content: string | null;
  created_at: string;
  dialogueId: number | null;
  id: number;
  userId: number | null;
}

interface Playlist {
  created_at: string;
  creatorId: number | null;
  id: number;
  is_public: boolean | null;
  name: string | null;
}

interface Playlist_editor {
  created_at: string;
  id: number;
  is_creator: boolean | null;
  playlistId: number | null;
  userId: number | null;
}

interface Playlist_track {
  created_at: string;
  id: number;
  playlistId: number | null;
  trackId: number | null;
}

interface Token {
  created_at: string;
  id: number;
  refresh_token: string | null;
  userId: number | null;
}

interface Track {
  albumId: number | null;
  artistId: number | null;
  created_at: string;
  duration: number | null;
  file_hash: string;
  genreId: number | null;
  id: number;
  likes_number: number | null;
  lyrics: string | null;
  name: string | null;
  userId: number | null;
}

interface User {
  activation_link: string | null;
  created_at: string;
  email: string;
  id: number;
  is_activated: boolean;
  password_hash: string;
  reset_code: string | null;
  reset_code_expires: string | null;
  username: string;
}

interface User_group {
  created_at: string;
  groupId: number | null;
  id: number;
  is_creator: boolean | null;
  userId: number | null;
}

interface User_profile {
  avatar_url: string | null;
  id: number;
  preferences_vector: number | null;
  userId: number;
}
