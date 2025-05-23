import api from "./axios";

export default class RecommendationApi {

  static async getUserRecommendations({userId}: {userId: string}) {
    const response = await api.get(`/recommendations/user-recommendations/${userId}`,
      {withCredentials: true},
    );
    return response.data;
  }
}