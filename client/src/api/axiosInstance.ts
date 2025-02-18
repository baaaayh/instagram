import axios from "axios";

const API_URL = "/api";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    `${API_URL}/token/refresh`,
                    {},
                    { withCredentials: true }
                );

                localStorage.setItem("accessToken", res.data.accessToken);

                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${res.data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("리프레시 토큰 갱신 실패", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
