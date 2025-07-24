import { ref } from "vue";
import type { RegisterFormData, LoginFormData } from "./types";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import useFirebase from "./useFirebase";
const user = ref<User | null>(null);

export const useAuth = () => {
  const { auth } = useFirebase();
  const { clear: clearUserSession, fetch: refreshUserSession } =
    useUserSession();
  if (auth) {
    onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser;
    });
  }

  const refreshSession = async () => {
    await refreshUserSession();
    return null;
  };

  const register = async (formData: RegisterFormData) => {
    try {
      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });
      console.log("Registration successful", response);
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const login = async (formData: LoginFormData) => {
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      const { api } = useAxios();
      const response = await api.post("/user/session");
      await refreshUserSession();
      user.value = response.data.user;
      return response.data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await clearUserSession();
      user.value = null;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getIdToken = async () => {
    if (!user.value) {
      throw new Error("User not authenticated");
    }
    return await user.value.getIdToken();
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully");
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    } catch (error) {
      console.error("Password reset failed:", error);
      throw error;
    }
  };

  return {
    user,
    register,
    login,
    logout,
    getIdToken,
    refreshSession,
    resetPassword,
  };
};
