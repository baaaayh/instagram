import { useEffect } from "react";
import axios from "axios";
import {
    useLocation,
    useNavigate,
    NavigateFunction,
    Outlet,
} from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

async function getNewAccessToken(navigate: NavigateFunction) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        navigate("/accounts/login");
        return;
    }

    try {
        const response = await axios.post(
            "/api/token/refresh",
            {},
            {
                headers: {
                    "x-refresh-token": `Bearer ${refreshToken}`,
                },
            }
        );

        const data = response.data;

        if (response.status === 200) {
            localStorage.setItem("accessToken", data.accessToken);
            useAuthStore.getState().setUserId(data.userId, data.userNickName);
            useAuthStore.getState().setTokenState(true, true);
        } else if (response.status === 401) {
            alert(data.error);
            navigate("/accounts/login");
        } else {
            alert(data.error);
            navigate("/accounts/login");
        }
    } catch (error) {
        console.error(error);
        navigate("/accounts/login");
    }
}

const PrivateRoute = () => {
    const { isAccessToken, isRefreshToken, setTokenState, resetTokenState } =
        useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const accessToken = !!localStorage.getItem("accessToken");
        const refreshToken = !!localStorage.getItem("refreshToken");
        setTokenState(accessToken, refreshToken);
    }, [location.pathname, setTokenState]);

    useEffect(() => {
        if (!isAccessToken) {
            if (isRefreshToken) {
                getNewAccessToken(navigate);
            }
            if (!isRefreshToken) {
                navigate("/accounts/login");
            }
        }
        if (isAccessToken) {
            if (!isRefreshToken) {
                localStorage.removeItem("accessToken");
                navigate("/accounts/login");
            }
            if (isRefreshToken) {
                return;
            }
        }
    }, [isAccessToken, isRefreshToken, navigate, resetTokenState]);

    if (isAccessToken === null) {
        return null;
    }

    return <Outlet />;
};

export default PrivateRoute;
