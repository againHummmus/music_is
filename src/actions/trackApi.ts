import api from "./axios";

export default class TrackApi {
  static async createTrack({
    genreId,
    artistId,
    albumId,
    name,
    lyrics,
    isAddedByUser,
    file,
  }: {
    genreId: string;
    artistId: string;
    albumId: string;
    name: string;
    lyrics?: string;
    isAddedByUser: boolean;
    file: File;
  }) {
    const formData = new FormData();
    formData.append("genreId", genreId);
    formData.append("artistId", artistId);
    formData.append("albumId", albumId);
    formData.append("name", name);
    formData.append("isAddedByUser", isAddedByUser.toString());
    if (lyrics) formData.append("lyrics", lyrics);
    formData.append("file", file);
    const response = await api.post("/track", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response;
  }

  static async searchTracks({
    id,
    genre,
    artist,
    album,
    likedByUserId,
    name,
    limit = 10,
    offset = 0,
  }: {
    id?: string;
    genre?: string;
    artist?: string;
    album?: string;
    likedByUserId?: string;
    name?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = {
      id,
      genre,
      artist,
      album,
      likedByUserId,
      name,
      limit,
      offset,
    };

    const response = await api.get("/track", { params });
    return response;
  }

  static async deleteTrack(trackId: string) {
    if (!trackId) {
      throw new Error("Track ID is required for deletion.");
    }

    const response = await api.delete(`/track/${trackId}`, {
      withCredentials: true,
    });
    return response;
  }
}
