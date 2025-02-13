import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/layout/layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/accounts/login" element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
