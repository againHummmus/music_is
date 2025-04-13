import api from "./axios";

export default class AlbumApi {
  static async createAlbum({
    name,
    year,
    artistId,
    image_hash,
  }: Omit<Album, "id">) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("year", year.toString());
    formData.append("artistId", artistId.toString());
    formData.append("image", image_hash);
    const response = await api.post("/album", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response;
  }

  static async searchAlbums({
    name,
    artistId,
    limit = 10,
    offset = 0,
  }: {
    name?: string;
    artistId?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = {
      name: name || "",
      artistId: artistId || "",
      limit,
      offset,
    };
    const response = await api.get("/album", { params });
    return response;
  }
}
