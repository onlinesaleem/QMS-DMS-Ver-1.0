import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_REST_API_URL;
const AUTH_BASE_REST_API_URL = BASE_URL + "/auth";

// // Add a request interceptor
// axios.interceptors.request.use(function (config) {
//   config.headers['Authorization']=getToken();
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });

export const registerAPICall = (registerObj: any) =>
  axios.post(AUTH_BASE_REST_API_URL + "/register", registerObj);
export const loginAPICall = (usernameOrEmail: any, password: any) =>
  axios.post(AUTH_BASE_REST_API_URL + "/login", { usernameOrEmail, password });
export const storeToken = (token: string) =>
  localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const fetchUserId = (userName: any) =>
  axios.get(AUTH_BASE_REST_API_URL + "/findByUsername/" + userName);
export const saveLoggedInUser = (username: string, role: string) => {
  sessionStorage.setItem("authenticatedUser", username);
  sessionStorage.setItem("role", role);
};

export const isUserLoggedIn = () => {
  const username = sessionStorage.getItem("authenticatedUser");
  if (username == null) {
    return false;
  } else {
    return true;
  }
};

export const getLoggedInUser = () => {
  const username = sessionStorage.getItem("authenticatedUser");

  return username;
};

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export const isAdminUser = () => {
  let role = sessionStorage.getItem("role");

  if (role != null && role === "ROLE_ADMIN") {
    return true;
  } else {
    return false;
  }
};

export const isQualityUser = () => {
  let role = sessionStorage.getItem("role");
  if (role != null && role == "ROLE_QUALITY") {
    return true;
  } else {
    return false;
  }
};

export const isManagerUser = () => {
  let role = sessionStorage.getItem("role");
  if (role != null && role == "ROLE_MANAGER") {
    return true;
  } else {
    return false;
  }
};

export const isRoleUser = () => {
  let role = sessionStorage.getItem("role");
  if (role != null && role == "ROLE_USER") {
    return true;
  } else {
    return false;
  }
};


