import { Outlet } from "react-router-dom";
import SideNav from "@/components/SideNav";
import CreatePostModal from "@/components/CreatePostModal";
import AccountModal from "@/components/AccountModal";
import FeedModal from "@/components/FeedModal";

export default function Layout() {
    return (
        <div className="container">
            <div className="view">
                <div className="view__inner">
                    <Outlet />
                </div>
            </div>
            <SideNav />
            <CreatePostModal />
            <AccountModal />
            <FeedModal />
        </div>
    );
}
