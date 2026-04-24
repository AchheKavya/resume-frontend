
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loginApi, API } from "@/services/api";

interface UserType {
  username: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserType | null;
  isAdmin: boolean;
  loading:boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};




export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const [loading, setLoading] = useState(true);


useEffect(() => {
  const accessToken = localStorage.getItem("access_token");
  const savedUser = localStorage.getItem("user");

  if (accessToken && savedUser) {
    try {
      const parsed = JSON.parse(savedUser);

      if (typeof parsed.isAdmin !== "boolean") {
        throw new Error();
      }

      setIsAuthenticated(true);
      setIsAdmin(parsed.isAdmin);
      setUser(parsed);
    } catch {
      localStorage.removeItem("user");
    }
  }

  setLoading(false); // 🔥 ALWAYS RUN THIS
}, []);


  // const login = async (username: string, password: string) => {
  //   const response = await loginApi.post("login/", {
  //     username,
  //     password,
  //   });

  //   const access = response.data.access;
  //   const refresh = response.data.refresh;

  //   if (!access || !refresh) {
  //     throw new Error("Authentication failed");
  //   }

  //   localStorage.setItem("access_token", access);
  //   localStorage.setItem("refresh_token", refresh);

  //   const userData = {
  //     username: response.data.username || username,
  //     email: response.data.email || `${username}@example.com`,
  //     isAdmin: response.data.is_admin ?? false,
  //   };

  //   localStorage.setItem("user", JSON.stringify(userData));

  //   setIsAuthenticated(true);
  //   setIsAdmin(userData.isAdmin);
  //   setUser(userData);
  // };


  const login = async (username: string, password: string) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);

  const payload = isEmail
    ? { email: username, password }
    : { username: username, password };

  try {
    const response = await loginApi.post("login/", payload);

    const access = response.data.access;
    const refresh = response.data.refresh;

    if (!access || !refresh) {
      throw new Error("Authentication failed");
    }

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    const userData = {
      username: response.data.username || username,
      email: response.data.email || "",
      isAdmin: response.data.is_admin ?? false,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setIsAuthenticated(true);
    setIsAdmin(userData.isAdmin);
    setUser(userData);

  } catch (error: any) {
    console.error("LOGIN ERROR:", error?.response?.data || error.message);
    throw error; // 🔥 important
  }
};


  const signup = async (username: string, email: string, password: string) => {
  try {
    console.log("STEP 1: signup function called");

    const res = await API.post("signup/", {
      username,
      email,
      password,
    });

    console.log("STEP 2: signup API success", res.data);

    // ✅ DO NOT auto login here
    return res.data;

  } catch (error: any) {
    console.error("Signup failed:", error?.response?.data || error.message);
    throw error;
  }
};



  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAdmin,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
