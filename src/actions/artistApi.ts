import api from "./axios";

export default class ArtistApi {
  static async createArtist({
    name,
    userId,
    image,
  }: {name: string, userId?: string, image: File}) {
    const formData = new FormData();
    formData.append("name", name);
    userId && formData.append("userId", userId.toString());
    image && formData.append("image", image);

    const response = await api.post("/artist", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response;
  }

  static async searchArtists({
    id,
    name,
    limit = 10,
    offset = 0,
  }: {
    id?: string;
    name?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = {
      id,
      name,
      limit,
      offset,
    };

    const response = await api.get("/artist", { params });
    return response;
  }
}
