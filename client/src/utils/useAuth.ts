import { useEffect, useState } from "react";

export default function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );
    const [isRefreshToken, setIsRefreshToken] = useState<boolean | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        console.log(accessToken, refreshToken);
        setIsAuthenticated(!!accessToken);
        setIsRefreshToken(!!refreshToken);
    }, []);

    return { isAuthenticated, isRefreshToken };
}
