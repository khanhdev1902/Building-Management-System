"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const refresh =async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/refresh",
        {},
        { withCredentials: true } // để gửi cookie
      );

      setAccessToken(res.data.accessToken);
    } catch (err) {
      console.log("Refresh token failed:", err);
      setAccessToken(null);
    }
  };

  //gọi refresh khi reload
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);


  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook dùng cho gọn
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};