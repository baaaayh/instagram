import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "@/shared/PrivateRoute";
import Layout from "@/layout/layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                    <Route path="/accounts/login" element={<Login />} />
                    <Route path="/accounts/signup" element={<SignUp />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
