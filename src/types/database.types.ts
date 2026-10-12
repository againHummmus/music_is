export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      Album: {
        Row: {
          artistId: number | null;
          created_at: string;
          id: number;
          image_hash: string | null;
          name: string | null;
          year: number | null;
        };
        Insert: {
          artistId?: number | null;
          created_at?: string;
          id?: number;
          image_hash?: string | null;
          name?: string | null;
          year?: number | null;
        };
        Update: {
          artistId?: number | null;
          created_at?: string;
          id?: number;
          image_hash?: string | null;
          name?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Album_artistId_fkey';
            columns: ['artistId'];
            isOneToOne: false;
            referencedRelation: 'Artist';
            referencedColumns: ['id'];
          },
        ];
      };
      Artist: {
        Row: {
          created_at: string;
          id: number;
          image_hash: string | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          image_hash?: string | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          image_hash?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      Dialogue: {
        Row: {
          created_at: string;
          id: number;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          title?: string | null;
        };
        Relationships: [];
      };
      Genre: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      Group: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      Message: {
        Row: {
          content: string | null;
          created_at: string;
          dialogueId: number | null;
          id: number;
          Track: number | null;
          userId: number | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          dialogueId?: number | null;
          id?: number;
          Track?: number | null;
          userId?: number | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          dialogueId?: number | null;
          id?: number;
          Track?: number | null;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Message_dialogueId_fkey';
            columns: ['dialogueId'];
            isOneToOne: false;
            referencedRelation: 'Dialogue';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Message_Track_fkey';
            columns: ['Track'];
            isOneToOne: false;
            referencedRelation: 'Track';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Message_Track_fkey';
            columns: ['Track'];
            isOneToOne: false;
            referencedRelation: 'track_with_like_count';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Message_Track_fkey';
            columns: ['Track'];
            isOneToOne: false;
            referencedRelation: 'track_with_like_count_last_day';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Message_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Playlist: {
        Row: {
          created_at: string;
          Creator: number | null;
          description: string | null;
          id: number;
          is_default: boolean;
          is_public: boolean | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          Creator?: number | null;
          description?: string | null;
          id?: number;
          is_default?: boolean;
          is_public?: boolean | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          Creator?: number | null;
          description?: string | null;
          id?: number;
          is_default?: boolean;
          is_public?: boolean | null;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Playlist_Creator_fkey';
            columns: ['Creator'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Playlist_like: {
        Row: {
          created_at: string;
          id: number;
          playlistId: number | null;
          userId: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          playlistId?: number | null;
          userId?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          playlistId?: number | null;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'PlaylistLike_playlistId_fkey';
            columns: ['playlistId'];
            isOneToOne: false;
            referencedRelation: 'Playlist';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'PlaylistLike_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Playlist_track: {
        Row: {
          created_at: string;
          id: number;
          playlistId: number | null;
          trackId: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          playlistId?: number | null;
          trackId?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          playlistId?: number | null;
          trackId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Playlist_track_playlistId_fkey';
            columns: ['playlistId'];
            isOneToOne: false;
            referencedRelation: 'Playlist';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Playlist_track_trackId_fkey';
            columns: ['trackId'];
            isOneToOne: false;
            referencedRelation: 'Track';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Playlist_track_trackId_fkey';
            columns: ['trackId'];
            isOneToOne: false;
            referencedRelation: 'track_with_like_count';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Playlist_track_trackId_fkey';
            columns: ['trackId'];
            isOneToOne: false;
            referencedRelation: 'track_with_like_count_last_day';
            referencedColumns: ['id'];
          },
        ];
      };
      Post: {
        Row: {
          content: string | null;
          created_at: string;
          id: number;
          playlistId: number | null;
          trackId: number | null;
          userId: number | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          id?: number;
          playlistId?: number | null;
          trackId?: number | null;
          userId?: number | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          id?: number;
          playlistId?: number | null;
          trackId?: number | null;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Post_playlistId_fkey';
            columns: ['playlistId'];
            isOneToOne: false;
            referencedRelation: 'Playlist';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Post_trackId_fkey';
            columns: ['trackId'];
            isOneToOne: false;
            referencedRelation: 'Track';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Post_trackId_fkey';
            columns: ['trackId'];
            isOneToOne: false;
            referencedRelation: 'track_with_like_count';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Post_trackId_fkey';
            columns: ['trackId'];
            isOneToOne: false;
            referencedRelation: 'track_with_like_count_last_day';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Post_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Post_like: {
        Row: {
          created_at: string;
          id: number;
          postId: number | null;
          userId: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          postId?: number | null;
          userId?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          postId?: number | null;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'PostLike_postId_fkey';
            columns: ['postId'];
            isOneToOne: false;
            referencedRelation: 'Post';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'PostLike_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Profile: {
        Row: {
          app_role: Database['public']['Enums']['roles'] | null;
          artistId: number | null;
          avatar_url: string | null;
          created_at: string | null;
          id: string;
          is_activated: boolean | null;
          preferences_vector: number | null;
          username: string | null;
        };
        Insert: {
          app_role?: Database['public']['Enums']['roles'] | null;
          artistId?: number | null;
          avatar_url?: string | null;
          created_at?: string | null;
          id: string;
          is_activated?: boolean | null;
          preferences_vector?: number | null;
          username?: string | null;
        };
        Update: {
          app_role?: Database['public']['Enums']['roles'] | null;
          artistId?: number | null;
          avatar_url?: string | null;
          created_at?: string | null;
          id?: string;
          is_activated?: boolean | null;
          preferences_vector?: number | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Profile_artistId_fkey';
            columns: ['artistId'];
            isOneToOne: false;
            referencedRelation: 'Artist';
            referencedColumns: ['id'];
          },
        ];
      };
      Token: {
        Row: {
          created_at: string;
          id: number;
          refresh_token: string | null;
          userId: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          refresh_token?: string | null;
          userId?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          refresh_token?: string | null;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'token_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Track: {
        Row: {
          albumId: number | null;
          artistId: number | null;
          created_at: string;
          file_hash: string;
          genreId: number | null;
          id: number;
          isAddedByUser: boolean | null;
          likes_number: number | null;
          lyrics: string | null;
          name: string | null;
        };
        Insert: {
          albumId?: number | null;
          artistId?: number | null;
          created_at?: string;
          file_hash: string;
          genreId?: number | null;
          id?: number;
          isAddedByUser?: boolean | null;
          likes_number?: number | null;
          lyrics?: string | null;
          name?: string | null;
        };
        Update: {
          albumId?: number | null;
          artistId?: number | null;
          created_at?: string;
          file_hash?: string;
          genreId?: number | null;
          id?: number;
          isAddedByUser?: boolean | null;
          likes_number?: number | null;
          lyrics?: string | null;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Track_albumId_fkey';
            columns: ['albumId'];
            isOneToOne: false;
            referencedRelation: 'Album';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Track_artistId_fkey';
            columns: ['artistId'];
            isOneToOne: false;
            referencedRelation: 'Artist';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Track_genreId_fkey';
            columns: ['genreId'];
            isOneToOne: false;
            referencedRelation: 'Genre';
            referencedColumns: ['id'];
          },
        ];
      };
      Track_like: {
        Row: {
          created_at: string;
          id: number;
          trackId: number | null;
          userId: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          trackId?: number | null;
          userId?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          trackId?: number | null;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'TrackLike_trackId_fkey';
            columns: ['trackId'];
            isOneToOne: false;
            referencedRelation: 'Track';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'TrackLike_trackId_fkey';
            columns: ['trackId'];
            isOneToOne: false;
            referencedRelation: 'track_with_like_count';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'TrackLike_trackId_fkey';
            columns: ['trackId'];
            isOneToOne: false;
            referencedRelation: 'track_with_like_count_last_day';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'TrackLike_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      User: {
        Row: {
          activation_link: string | null;
          app_role: Database['public']['Enums']['roles'];
          artistId: number | null;
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          id: number;
          is_activated: boolean;
          password_hash: string | null;
          preferences_vector: number | null;
          reset_code: string | null;
          reset_code_expires: string | null;
          sbUserId: string | null;
          username: string | null;
        };
        Insert: {
          activation_link?: string | null;
          app_role?: Database['public']['Enums']['roles'];
          artistId?: number | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          is_activated?: boolean;
          password_hash?: string | null;
          preferences_vector?: number | null;
          reset_code?: string | null;
          reset_code_expires?: string | null;
          sbUserId?: string | null;
          username?: string | null;
        };
        Update: {
          activation_link?: string | null;
          app_role?: Database['public']['Enums']['roles'];
          artistId?: number | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          is_activated?: boolean;
          password_hash?: string | null;
          preferences_vector?: number | null;
          reset_code?: string | null;
          reset_code_expires?: string | null;
          sbUserId?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'User_artistId_fkey';
            columns: ['artistId'];
            isOneToOne: false;
            referencedRelation: 'Artist';
            referencedColumns: ['id'];
          },
        ];
      };
      User_dialogue: {
        Row: {
          created_at: string;
          dialogueId: number | null;
          id: number;
          is_creator: boolean | null;
          userId: number | null;
        };
        Insert: {
          created_at?: string;
          dialogueId?: number | null;
          id?: number;
          is_creator?: boolean | null;
          userId?: number | null;
        };
        Update: {
          created_at?: string;
          dialogueId?: number | null;
          id?: number;
          is_creator?: boolean | null;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Dialogue_user_dialogueId_fkey';
            columns: ['dialogueId'];
            isOneToOne: false;
            referencedRelation: 'Dialogue';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'User_dialogue_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      User_group: {
        Row: {
          created_at: string;
          groupId: number | null;
          id: number;
          is_creator: boolean | null;
          userId: number | null;
        };
        Insert: {
          created_at?: string;
          groupId?: number | null;
          id?: number;
          is_creator?: boolean | null;
          userId?: number | null;
        };
        Update: {
          created_at?: string;
          groupId?: number | null;
          id?: number;
          is_creator?: boolean | null;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'User_group_groupId_fkey';
            columns: ['groupId'];
            isOneToOne: false;
            referencedRelation: 'Group';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'User_group_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      User_playlist: {
        Row: {
          created_at: string;
          id: number;
          is_creator: boolean | null;
          Playlist: number | null;
          User: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          is_creator?: boolean | null;
          Playlist?: number | null;
          User?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          is_creator?: boolean | null;
          Playlist?: number | null;
          User?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'User_playlist_Playlist_fkey';
            columns: ['Playlist'];
            isOneToOne: false;
            referencedRelation: 'Playlist';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'User_playlist_User_fkey';
            columns: ['User'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      User_recommendation: {
        Row: {
          created_at: string;
          id: number;
          RecommendedUser: number | null;
          User: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          RecommendedUser?: number | null;
          User?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          RecommendedUser?: number | null;
          User?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'User_recommendation_RecommendedUser_fkey';
            columns: ['RecommendedUser'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'User_recommendation_User_fkey';
            columns: ['User'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      User_user_subscription: {
        Row: {
          created_at: string;
          Followee: number | null;
          Follower: number | null;
          id: number;
        };
        Insert: {
          created_at?: string;
          Followee?: number | null;
          Follower?: number | null;
          id?: number;
        };
        Update: {
          created_at?: string;
          Followee?: number | null;
          Follower?: number | null;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'User_user_subscription_Followee_fkey';
            columns: ['Followee'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'User_user_subscription_Follower_fkey';
            columns: ['Follower'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      track_with_like_count: {
        Row: {
          albumId: number | null;
          artistId: number | null;
          created_at: string | null;
          file_hash: string | null;
          genreId: number | null;
          id: number | null;
          isAddedByUser: boolean | null;
          likes_count: number | null;
          likes_number: number | null;
          lyrics: string | null;
          name: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Track_albumId_fkey';
            columns: ['albumId'];
            isOneToOne: false;
            referencedRelation: 'Album';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Track_artistId_fkey';
            columns: ['artistId'];
            isOneToOne: false;
            referencedRelation: 'Artist';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Track_genreId_fkey';
            columns: ['genreId'];
            isOneToOne: false;
            referencedRelation: 'Genre';
            referencedColumns: ['id'];
          },
        ];
      };
      track_with_like_count_last_day: {
        Row: {
          albumId: number | null;
          artistId: number | null;
          created_at: string | null;
          file_hash: string | null;
          genreId: number | null;
          id: number | null;
          isAddedByUser: boolean | null;
          likes_count_last_day: number | null;
          likes_number: number | null;
          lyrics: string | null;
          name: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Track_albumId_fkey';
            columns: ['albumId'];
            isOneToOne: false;
            referencedRelation: 'Album';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Track_artistId_fkey';
            columns: ['artistId'];
            isOneToOne: false;
            referencedRelation: 'Artist';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Track_genreId_fkey';
            columns: ['genreId'];
            isOneToOne: false;
            referencedRelation: 'Genre';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      custom_access_token_hook: { Args: { event: Json }; Returns: Json };
      get_recommended_tracks: {
        Args: { current_user_id: number };
        Returns: Record<string, unknown>[];
      };
      get_recommended_users: {
        Args: { current_user_id: number };
        Returns: {
          rec_user_id: number;
          rec_username: string;
          similarity: number;
        }[];
      };
      select_setting: { Args: { setting_name: string }; Returns: string };
    };
    Enums: {
      roles: 'admin' | 'user' | 'artist';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      roles: ['admin', 'user', 'artist'],
    },
  },
} as const;
