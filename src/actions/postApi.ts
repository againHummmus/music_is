import api from './axios';

export default class PostApi {
  static async createPost({ content, trackId, playlistId, userId }: { content: string, trackId?: string, playlistId?: string, userId: string }) {
    const response = await api.post(
      '/post',
      { content, trackId, playlistId, userId },
      { withCredentials: true }
    );
    return response.data;
  }

  static async deletePost({ id }: { id: string }) {
    const response = await api.delete(`/post/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }

  static async searchPosts(params: any) {
    const response = await api.get('/post', {
      params,
      withCredentials: true,
    });
    return response.data;
  }

  static async getPost({ id }: { id: string }) {
    const response = await api.get(`/post/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
}
