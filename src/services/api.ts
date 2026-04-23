// import axios from "axios";

// const loginApi = axios.create({

//   baseURL: "http://127.0.0.1:8000/api/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,  
// })

// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// API.interceptors.request.use((config) => {
//   const accessToken =
//     localStorage.getItem("access_token") ||
//     localStorage.getItem("token") ||
//     localStorage.getItem("access");

//   if (accessToken) {
//     if (!config.headers) {
//       config.headers = {} as any;
//     }
//     (config.headers as any).Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });



// export { API, loginApi };



// import axios, { AxiosRequestHeaders } from "axios";

// // 🔐 Login API (for auth only)
// const loginApi = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
//   withCredentials: true,
// });

// // 🔐 Main API
// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
//   withCredentials: true,
// });

// // 🔑 Attach JWT token automatically
// API.interceptors.request.use((config) => {
//   const accessToken =
//     localStorage.getItem("access_token") ||
//     localStorage.getItem("token") ||
//     localStorage.getItem("access");

//   if (accessToken) {
//     // ✅ Fix TypeScript issue
//     config.headers = (config.headers || {}) as AxiosRequestHeaders;

//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

// export { API, loginApi };








import axios, { AxiosRequestHeaders } from "axios";

// 🔐 Login API (no token needed here)
const loginApi = axios.create({
  // baseURL: "http://127.0.0.1:8000/api/",
  baseURL:"https://resume-project-b.onrender.com/api/",
  // withCredentials:false,
  withCredentials:true,
});

// 🔐 Main API (with token)
const API = axios.create({
  // baseURL: "http://127.0.0.1:8000/api/",
  baseURL:"https://resume-project-b.onrender.com/api/",
  // withCredentials: false,
  withCredentials:true,
});

// 🔑 Attach JWT automatically
API.interceptors.request.use((config) => {
  const accessToken =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access");

  if (accessToken) {
    config.headers = (config.headers || {}) as AxiosRequestHeaders;
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export { API, loginApi };