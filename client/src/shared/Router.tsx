import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/layout/layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Reset from "@/pages/Reset";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                </Route>
                <Route path="/accounts/login" element={<Login />} />
                <Route path="/accounts/signup" element={<SignUp />} />
                <Route path="/accounts/password/reset" element={<Reset />} />
            </Routes>
        </BrowserRouter>
    );
}
