import AuthApi from "@/actions/authApi";
import axios from "axios";
import { create } from "zustand";
import { devtools } from 'zustand/middleware'

interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
  user: User | null;
  
  setIsAuth: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setUser: (value: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    username: string,
    avatar: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useStore = create<AuthState>()(
  devtools((set: any) => ({
    isAuth: false,
    isLoading: true,
    user: null,

    setIsAuth: (value: boolean) => set({ isAuth: value }),
    setIsLoading: (value: boolean) => set({isLoading: value}),
    setUser: (value: User | null) => set({ user: value }),
    signIn: async (email: string, password: string) => {
      try {
        const response = await AuthApi.signIn({ email, password });
        localStorage.setItem("token", response.data.accessToken);
        set({ isAuth: true, user: response.data.user });
      } catch (e: any) {
        console.error(e.response?.data?.message);
      }
    },

    signUp: async (
      email: string,
      password: string,
      username: string,
      avatar: string
    ) => {
      try {
        const response = await AuthApi.signUp({ email, password, username, avatar });
        localStorage.setItem("token", response.data.accessToken);
        set({ isAuth: true, user: response.data.user });
      } catch (e: any) {
        console.error(e.response?.data?.message);
      }
    },

    signOut: async () => {
      try {
        await AuthApi.signOut();
        localStorage.removeItem("token");
        set({ isAuth: false, user: null });
      } catch (e: any) {
        console.error(e.response?.data?.message);
      }
    },

    checkAuth: async () => {
      set({ isLoading: true });
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/refresh`, {}, {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        set({ isAuth: true, user: response.data.user });
      } catch (e: any) {
        console.error(e.response?.data?.message);
      } finally {
        set({ isLoading: false });
      }
    },

  }))
);

