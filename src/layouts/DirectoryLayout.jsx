import React from "react";
import { Outlet } from "react-router-dom";

const DirectoryLayout = () => {
  return (
    <div>
      {/* <h1>THis is directory layout</h1> */}

      <Outlet />
    </div>
  );
};

export default DirectoryLayout;
