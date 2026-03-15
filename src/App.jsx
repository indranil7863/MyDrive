import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Router,
  RouterProvider,
} from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import ShowContent from "./components/ShowContent";
import DirectoryLayout from "./layouts/DirectoryLayout";
import FileContent from "./components/FileContent";
import Register from "./components/Register";
import Profile from "./components/Profile";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<ShowContent />} />
        <Route path="profile" element={<Profile />} />
        <Route path="register" element={<Register />} />
        <Route path="directory" element={<DirectoryLayout />}>
          <Route path=":dirid" element={<ShowContent />} />
        </Route>
        <Route path="files">
          <Route path=":fileid" element={<FileContent />} />
          {/* <Route path="rename/:fileid" element={<RenameFile />} /> */}
        </Route>
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};

export default App;
