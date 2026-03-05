import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import ShowContent, { Loadcontent } from "./components/ShowContent";
import DirectoryLayout from "./layouts/DirectoryLayout";
import FileContent from "./components/FileContent";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<ShowContent />} loader={Loadcontent} />
        <Route path="directory" element={<DirectoryLayout />}>
          <Route path=":dirid" element={<ShowContent />} loader={Loadcontent} />
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
