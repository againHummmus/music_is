import api from "./axios";

export default class PostLikeApi {

  static async createPostLike({ userId, postId }: { userId: string, postId: string }) {
    const response = await api.post(
      "/post-like",
      { userId, postId },
      { withCredentials: true }
    );
    return response;
  }

  static async searchPostLikes({ userId, postId, limit = 10, offset = 0 }: { userId: string, postId: string, limit: number, offset: number }) {
    const params = {
      userId: userId || "",
      postId: postId || "",
      limit,
      offset,
    };

    const response = await api.get("/post-like", { params });
    return response;
  }

  static async deletePostLike({ userId, postId }: { userId: string, postId: string }) {
    const response = await api.delete(`/post-like/${userId}/${postId}`, { withCredentials: true });
    return response;
  }
}
