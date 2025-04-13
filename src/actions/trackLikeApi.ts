import api from "./axios";

export default class TrackLikeApi {

  static async createTrackLike({ userId, trackId }: { userId: string, trackId: string }) {
    const response = await api.post(
      "/trackLike",
      { userId, trackId },
      { withCredentials: true }
    );
    return response;
  }

  static async searchTrackLikes({ userId, trackId, limit = 10, offset = 0 }: { userId: string, trackId: string, limit: number, offset: number }) {
    const params = {
      userId: userId || "",
      trackId: trackId || "",
      limit,
      offset,
    };

    const response = await api.get("/trackLike", { params });
    return response;
  }

  static async deleteTrackLike({ userId, trackId }: { userId: string, trackId: string }) {
    const response = await api.delete(`/trackLike/${userId}/${trackId}`, { withCredentials: true });
    return response;
  }
}
