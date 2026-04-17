import axios from "axios";

const api = axios.create({
    baseURL: "https://full-stack-spec-site.onrender.com/api/",
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;


        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refresh = localStorage.getItem("refresh");

            try {
                const res = await axios.post(
                    "https://full-stack-spec-site.onrender.com/api/accounts/refresh/",
                    { refresh }
                );

    
                localStorage.setItem("access", res.data.access);

                
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                return api(originalRequest);

            } catch (err) {
                
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;