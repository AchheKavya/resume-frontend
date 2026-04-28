// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
// });

// // Google Login API
// export const googleLogin = (token) => {
//   return API.post("/google-auth/", {
//     token: token,
//   });
// };


import axios from "axios";

const API = axios.create({
  // baseURL: "http://127.0.0.1:8000/api",
   baseURL:"https://resume-project-z8ag.onrender.com/api",
});

// export const googleLogin = (token) => {
//   return API.post("/google-auth/", {
//     token: token,
//   });

export const googleLogin = (data) => {
  return API.post("/google-auth/", data);
};
