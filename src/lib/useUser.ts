import { useEffect, useState } from "react";

type UserState = {
  name: string;
  nickname: string;
  profileImage: string | null;
  email: string;
  isAdmin: boolean;
};

const STORAGE_KEY = "tifo_user";

export function useUser() {
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setUser(JSON.parse(raw));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function loginUser(name: string, nickname: string, profileImage: string | null, email: string, isAdmin: boolean) {
    const nextUser: UserState = {
      name,
      nickname: nickname || name,
      profileImage: profileImage || null,
      email,
      isAdmin,
    };
    setUser(nextUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    }
  }

  function updateUserProfile(nickname: string, profileImage: string | null) {
    setUser((prev) => {
      if (!prev) return prev;
      const nextUser = { ...prev, nickname, profileImage };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      }
      return nextUser;
    });
  }

  function logoutUser() {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  return { user, loginUser, updateUserProfile, logoutUser };
}
