import api from "./axios";

export default class SubscriptionApi {

  static async createSubscription({ follower, followee }: { follower: string, followee: string }) {
    const response = await api.post(
      "/user-subscription",
      { follower, followee },
      { withCredentials: true }
    );
    return response.data;
  }

  static async deleteSubscription({ id }: { id: string }) {
    const response = await api.delete(
      `/user-subscription/${id}`,
      { withCredentials: true }
    );
    return response.data;
  }

  static async searchSubscriptions(params: { follower?: string, followee?: string, limit?: number, offset?: number } = {}) {
    const response = await api.get("/user-subscription", {
      params,
      withCredentials: true,
    });
    return response.data;
  }

  static async searchMutualFriends(params: { userId: string, limit?: number, offset?: number, getPosts?: boolean, getPlaylists?: boolean }) {
    const response = await api.get("/user-subscription/mutual-friends", {
      params,
      withCredentials: true,
    });
    return response.data;
  }
}