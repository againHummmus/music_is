import api from "./axios";

export default class UserApi {
  static async getMe() {
    const response = await api.post("/user/me", {}, {
      withCredentials: true,
    });
    return response.data.data;
  }

  static async getUser({id}: {id: string}) {
    const response = await api.get(`/user/${id}`);
    return response.data.data;
  }

  static async searchUsers(params?: any) {
    const response = await api.get("/user", {
      params,
      withCredentials: true,
    });
    return response.data;
  }

  static async signOut() {
    const response = await api.post(`/user/signout`, {}, { withCredentials: true });
    return response.data.data;
  }


  static async updateUser({file, newUsername, userId}: {file?: File, newUsername?: string, userId: string}) {
    console.log(file)
    const form = new FormData();
    form.append("userId", userId);
    file && form.append("avatar", file);
    newUsername && form.append("newUsername", newUsername);


    const response = await api.patch("/user/", form, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  }
}