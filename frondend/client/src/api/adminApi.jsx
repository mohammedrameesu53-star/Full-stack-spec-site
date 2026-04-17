import axios from "axios";

const api = axios.create({
  baseURL: "https://full-stack-spec-site.onrender.com/api/admin"
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refresh = localStorage.getItem("adminRefresh");

        // 🔥 call refresh API
        const res = await axios.post(
          "https://full-stack-spec-site.onrender.com/api/admin/token/refresh/",
          { refresh }
        );

      
        localStorage.setItem("adminToken", res.data.access);

    
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);

      } catch (err) {
    
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefresh");

        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;