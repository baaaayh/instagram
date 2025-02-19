import { useEffect } from "react";
import axios from "axios";
import { useNavigate, NavigateFunction, Outlet } from "react-router-dom";
import useAuth from "@/utils/useAuth";

async function getNewAccessToken(navigate: NavigateFunction) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        navigate("/accounts/login");
        return;
    }

    try {
        const response = await axios.post("/api/token/refresh", {
            refreshToken,
        });

        const data = response.data;

        if (response.status === 200) {
            localStorage.setItem("accessToken", data.accessToken);
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
    const { isAuthenticated, isRefreshToken } = useAuth();
    const navigate = useNavigate();

    console.log(isAuthenticated, isRefreshToken);

    useEffect(() => {
        if (isAuthenticated === null) return;
        if (isAuthenticated === false) {
            if (isRefreshToken) {
                getNewAccessToken(navigate);
            } else if (isRefreshToken === false) {
                navigate("/accounts/login");
            }
        } else {
            navigate("/");
        }
    }, [isAuthenticated, isRefreshToken, navigate]);

    if (isAuthenticated === null) {
        return null;
    }

    return <Outlet />;
};

export default PrivateRoute;
