import api from "./axios";

export default class UserPlaylistApi {

  static async createUserPlaylist({
    userId,
    playlistId,
    isCreator,
  }: {
    userId: string;
    playlistId: string;
    isCreator: boolean;
  }) {
    const response = await api.post(
      "/user-playlist",
      { userId, playlistId, isCreator },
      { withCredentials: true }
    );
    return response;
  }

  static async deleteUserPlaylist({ id }: { id: string }) {
    const response = await api.delete(`/user-playlist/${id}`, {
      withCredentials: true,
    });
    return response;
  }

  static async searchUserPlaylists({
    userId,
    playlistId,
    isCreator,
    limit = 10,
    offset = 0,
    includeDefaultPlaylists
  }: {
    userId?: string;
    playlistId?: string;
    isCreator?: boolean;
    limit?: number;
    offset?: number;
    includeDefaultPlaylists?: boolean
  }) {
    const params = { userId, playlistId, isCreator, limit, offset, includeDefaultPlaylists };
    const response = await api.get("/user-playlist", {
      params,
      withCredentials: true,
    });
    return response;
  }
}
