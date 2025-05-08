import api from "./axios";

export default class PlaylistTrackApi {

  static async createPlaylistTrack({
    trackId,
    playlistId,
  }: {
    trackId: string;
    playlistId: string;
  }) {
    const response = await api.post(
      "/playlist-track",
      { trackId, playlistId },
      { withCredentials: true }
    );
    return response;
  }

  static async deletePlaylistTrack({ id }: { id: string }) {
    const response = await api.delete(`/playlist-track/${id}`, {
      withCredentials: true,
    });
    return response;
  }

  static async searchPlaylistTracks({
    playlistId,
    trackId,
    limit = 10,
    offset = 0,
  }: {
    playlistId?: string;
    trackId?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = { playlistId, trackId, limit, offset };
    const response = await api.get("/playlist-track", {
      params,
      withCredentials: true,
    });
    return response;
  }
}
