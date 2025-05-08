import api from "./axios";

export default class UserApi {
  static async getMe() {
    const response = await api.post("/user/me", {}, {
      withCredentials: true,
    });
    return response.data.data;
  }

  static async signOut() {
    const response = await api.post(`/user/signout`, {}, { withCredentials: true });
    return response.data.data;
  }
}