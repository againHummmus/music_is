import api from "./axios";

export default class GenreApi {
  static async createGenre({ name }: { name: string }) {
    const response = await api.post("/genre", { name }, { withCredentials: true });
    return response;
  }

  static async searchGenres({
    name = '',
    limit = 10,
    offset = 0,
  }: {
    name?: string;
    limit?: number;
    offset?: number;
  }) {
    const response = await api.get("/genre", {
      params: { name, limit, offset },
    });
    return response;
  }
}
