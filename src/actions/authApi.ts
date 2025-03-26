import api from "./axios";

export default class AuthApi {
  static async signUp({
    email,
    password,
    username,
    avatar
  }: {
    email: string;
    password: string;
    username: string;
    avatar: string;
  }) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);
    formData.append("avatar", avatar);
    const response = await api.post("/user/signup", formData);
    return response;
  }

  static async signIn({
    email,
    password
  }: {
    email: string;
    password: string;
  }) {
      const response = await api.post("/user/signin", { email, password });
      return response;
  }
  
  static async signOut() {
      const response = await api.post("/user/signout");
      return response;
  }

  static async sendActivationEmail(email: string) {
    const response = await api.post("/mail/activation", {email});
    return response;
  }
}
