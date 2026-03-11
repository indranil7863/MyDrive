import React from "react";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div>
      <div className="nav-bar">
        <h2>My Drive</h2>
      </div>
      <Outlet />
    </div>
  );
};

export default HomeLayout;
