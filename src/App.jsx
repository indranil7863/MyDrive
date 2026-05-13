import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import ShowContent from "./components/ShowContent";
import DirectoryLayout from "./layouts/DirectoryLayout";

import Register from "./components/Register";
import Profile from "./components/Profile";
import FileView from "./components/FileView";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<ShowContent />} />
        <Route path="profile" element={<Profile />} />
        <Route path="register" element={<Register />} />
        <Route path="file/:id" element={<FileView/>} />
        <Route path="directory" element={<DirectoryLayout />}>
          <Route path=":dirid" element={<ShowContent />} />
        </Route>
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};

export default App;
