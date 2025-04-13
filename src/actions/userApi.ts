import api from "./axios";

export default class UserApi {
  static async getUser(id: string) {
    const response = await api.get(`/user/${id}`, { withCredentials: true });
    return response.data.data;
  }

  static async signOut() {
    const response = await api.post(`/user/signout`, {}, { withCredentials: true });
    return response.data.data;
  }
}
