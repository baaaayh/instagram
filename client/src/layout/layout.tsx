import { memo } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "@/components/SideNav";
import CommonHeader from "@/components/CommonHeader";
import { useWindowSizeStore } from "@/store/windowSizeStore";
import CreatePostModal from "@/components/CreatePostModal";
import AccountModal from "@/components/AccountModal";
import FeedModal from "@/components/FeedModal";

export default memo(function Layout() {
  const { width: windowWidth } = useWindowSizeStore();

  return (
    <div className="container">
      {windowWidth <= 765 && <CommonHeader />}
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
});
