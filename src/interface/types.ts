interface Album {
  id: string;
  artistId: string;
  image_hash: any;
  name: string;
  year: number;
}

interface Modal {
  isOpen: boolean;
  type?: "success" | "error" | "warning";
  message?: string;
  redirectUrl?: string;
}

interface Artist {
  id: string;
  image: any;
  name: string;
  User: User[];
}

interface Dialogue {
  created_at: string;
  id: string;
  title: string | null;
}

interface Dialogue_user {
  created_at: string;
  dialogueId: string | null;
  id: string;
  is_creator: boolean | null;
  userId: string | null;
}

interface Genre {
  id: string;
  name: string | null;
}

interface Group {
  created_at: string;
  description: string | null;
  id: string;
  name: string | null;
}

interface Message {
  content: string | null;
  created_at: string;
  dialogueId: string | null;
  id: string;
  userId: string | null;
}

interface Playlist {
  created_at: string;
  creatorId: string | null;
  id: string;
  is_public: boolean | null;
  name: string | null;
  Playlist_track: Playlist_track[];
}

interface Playlist_editor {
  created_at: string;
  id: string;
  is_creator: boolean | null;
  playlistId: string | null;
  userId: string | null;
}

interface Playlist_track {
  created_at: string;
  id: string;
  playlistId: string | null;
  trackId: string | null;
  Track: Track
}

interface Token {
  created_at: string;
  id: string;
  refresh_token: string | null;
  userId: string | null;
}

interface Track {
  albumId: string | null;
  artistId: string | null;
  created_at: string;
  duration: string | null;
  file_hash: string;
  genreId: string | null;
  id: string;
  likes_number: string | null;
  lyrics: string | null;
  name: string | null;
  userId: string | null;
  Album: Album;
  Artist: Artist;
  Genre: Genre;
}

interface User {
  activation_link: string | null;
  created_at: string;
  email: string;
  id: string;
  is_activated: boolean;
  password_hash: string;
  reset_code: string | null;
  reset_code_expires: string | null;
  username: string;
  app_role: 'user' | 'admin' | 'artist';
  Artist: Artist;
  avatar_url: string | null;
  preferences_vector: string | null;
  userId: string;
  artistId: any
}

interface User_group {
  created_at: string;
  groupId: string | null;
  id: string;
  is_creator: boolean | null;
  userId: string | null;
}

