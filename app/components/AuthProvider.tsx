"use client";
import { createContext, useContext } from "react";
import { useUser } from "../lib/useUser";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const userState = useUser();
  return <AuthContext.Provider value={userState}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
