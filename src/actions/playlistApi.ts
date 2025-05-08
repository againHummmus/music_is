import api from "./axios";

export default class PlaylistApi {

  static async createPlaylist({
    name,
    description,
    creatorId,
    isPublic,
  }: {
    name: string;
    description: string,
    creatorId?: string;
    isPublic?: boolean;
  }) {
    const payload = { name, description, creatorId, isPublic };
    const response = await api.post("/playlist", payload, {
      withCredentials: true,
    });
    return response;
  }


  static async deletePlaylist({ id }: { id: string }) {
    const response = await api.delete(`/playlist/${id}`, {
      withCredentials: true,
    });
    return response;
  }


  static async searchPlaylists({
    id,
    name,
    creatorId,
    isPublic,
    isDefault,
    limit,
    offset = 0,
  }: {
    id?: string;
    name?: string;
    creatorId?: string;
    isPublic?: boolean;
    isDefault?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const params = { id, name, creatorId, isPublic, isDefault, limit, offset };

    const response = await api.get("/playlist", {
      params,
    });

    return response.data;
  }
}
