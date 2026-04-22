import { createContext, useContext } from "react";
import axios from "axios";

const API = axios.create({
  // baseURL: "http://127.0.0.1:8000/api/",
  baseURL:"https://resume-project-z8ag.onrender.com/api/",
  
});

// 🔐 Attach token automatically
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access_token");

  if (token && !req.url?.includes("signup")) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});



const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {

  // ✅ SIGNUP
  const signup = async (username: string, email: string, password: string) => {
    const res = await API.post("signup/", {
      username,
      email,
      password,
    });

    return res.data; // VERY IMPORTANT
  };

  // ✅ LOGIN
  const login = async (username: string, password: string) => {
    const res = await API.post("login/", {
      username,
      password,
    });

    // store token
    localStorage.setItem("token", res.data.access);
    localStorage.setItem("is_admin", res.data.is_admin);

    return res.data;
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook
export const useAuth = () => useContext(AuthContext);