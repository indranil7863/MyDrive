import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FileImage from "./FileImage";
const ShowContent = () => {
  const { dirid } = useParams();

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [data, setData] = useState({ files: [], directories: [] });
  const [isRename, setIsRename] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileId, setFileId] = useState("");
  const [showMenu, setShowMenu] = useState("");

  const [isCreatFolder, setIsCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("New Folder");
  const [isRenameDir, setIsRenameDir] = useState(false);
  const [renameDir, setRenameDir] = useState("");
  const [dirIdRename, setDirIdRename] = useState("");

  // const [editing, setEditing] = useState(true);
  const inputRef = useRef(null);

  function toggleId(fileid) {
    if (fileid === showMenu) {
      setShowMenu("");
    } else {
      setShowMenu("");
      setShowMenu(fileid);
    }
  }

  async function FileOpen(fileid) {
    const url = "http://localhost:4000/files/";
    const res = await fetch(url + fileid);
    console.log(res.blob());
  }

  // file rename
  function RenameHandler(oldfilename, fileid) {
    setNewFileName(oldfilename);
    setFileId(fileid);
    setIsRename(!isRename);
    setShowMenu("");
  }
  async function SaveHandler() {
    setIsRename(!isRename);
    // api call
    const response = await fetch(`http://127.0.0.1:4000/files/${fileId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        newfilename: newFileName,
      }),
    });
    const data = await response.json();
    if (data.status === 200) console.log("file renamed");
    // re-render compoentnt
    FetchData();
    setNewFileName("");
  }
  // file delete
  async function DeleteHandler(fileid) {
    const response = await fetch(`http://localhost:4000/files/${fileid}`, {
      method: "DELETE",
    });
    const data = await response.json();
    // re-render component
    setShowMenu("");
    FetchData();
  }

  async function FetchData() {
    const url = "http://localhost:4000/directory";
    const response = await fetch(url + `/${dirid ? dirid : ""}`);
    const data = await response.json();
    console.log("show-data", data);

    setData(data);
  }

  async function DownloadHandler(fileid, filename) {
    const res = await fetch(
      "http://localhost:4000/files/" + fileid + "?action=download",
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // filename
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  }
  // file upload
  function UploadFileHandler(e) {
    const File = e.target.files[0];

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `http://localhost:4000/files/${File.name}`);
    xhr.setRequestHeader("parentdirid", dirid);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        console.log(percent);
      }
    };
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("successfully uploaded!");
        alert("successfully uploaded!");
        // fetch data
        FetchData();
      }
    };
    xhr.onerror = function () {
      console.log("network error!!");
    };
    xhr.send(File);
  }

  // directory creation
  function CreateDirectroyHandler() {
    // parentdirid, dirname
    setIsCreateFolder((prev) => !prev);
  }

  async function SaveDirectoryHandler() {
    setIsCreateFolder((prev) => !prev);
    // api call
    const res = await fetch(`http://localhost:4000/directory/`, {
      headers: {
        parentdirid: dirid,
        dirname: newFolderName,
      },
      method: "POST",
    });
    if (res.status === 200) {
      // fetch updated data again
      FetchData();
      setNewFolderName("New Folder");
    } else {
      console.log("Folder is not created!");
    }
  }

  // directory rename
  function DirectoryRename(dirid, dirname) {
    setRenameDir(dirname);
    setIsRenameDir((prev) => !prev);
    setDirIdRename(dirid);
    setShowMenu(false);
  }

  async function DirSaveHandler() {
    setIsRenameDir((prev) => !prev);

    // api call
    const response = await fetch(
      `http://127.0.0.1:4000/directory/${dirIdRename}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          newdirname: renameDir,
        }),
      },
    );
    const data = await response.json();
    if (data.status === 200) console.log("directory renamed");
    // re-render compoentnt
    FetchData();
    setDirIdRename("");
  }
  // directory delete
  async function DirDeleteHandler(DirId) {
    const res = await fetch(`http://localhost:4000/directory/${DirId}`, {
      method: "DELETE",
    });
    if (res.status === 200) {
      alert("Folder deleted Successfully");
      FetchData();
    } else {
      alert("unable to delete Folder!");
    }
  }
  // open directory
  function OpenDirectory(Dirid) {
    navigate(`/directory/${Dirid}`);
  }

  useEffect(() => {
    FetchData();
    if (isCreatFolder) {
      inputRef.current.select();
    }
    if (isRenameDir) {
      inputRef.current.select();
    }
    if (isRename) {
      const fileName = newFileName.split(".")[0];
      inputRef.current.focus();

      inputRef.current.setSelectionRange(0, fileName.length);
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dirid, isCreatFolder, isRename, isRenameDir]);

  return (
    <div className="main-file-container">
      <div className="banner-section">
        <label htmlFor="fileupload">
          <div className="upload-file">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-upload"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
            </svg>
            <span>Upload</span>
          </div>
          <input
            onChange={UploadFileHandler}
            type="file"
            id="fileupload"
            style={{ display: "none" }}
          />
        </label>
        <button onClick={CreateDirectroyHandler} className="create-folder">
          <span class="material-symbols-outlined">create_new_folder</span>
          <span>Create Folder</span>
        </button>
      </div>
      {isCreatFolder && (
        <div className="set-foldername">
          <input
            type="text"
            value={newFolderName}
            ref={inputRef}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <div>
            <button onClick={SaveDirectoryHandler} className="savebtn">
              save
            </button>
            <button
              onClick={() => setIsCreateFolder((prev) => !prev)}
              className="canclebtn"
            >
              cancle
            </button>
          </div>
        </div>
      )}
      {data.directories.map((dir) => {
        return (
          <div key={dir.id} className="folder-item">
            <div
              onClick={() => OpenDirectory(dir.id)}
              className="folder-img-name"
            >
              <img
                src="https://img.icons8.com/?size=100&id=74359&format=png&color=228BE6"
                alt=""
                className="folder-img"
              />
              <p>{dir.name}</p>
            </div>

            <div onClick={() => toggleId(dir.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
              </svg>
            </div>
            {showMenu === dir.id && (
              <div ref={menuRef} className="options-dropdown">
                <button
                  onClick={() => DirectoryRename(dir.id, dir.name)}
                  className="rename-btn"
                >
                  rename
                </button>
                <button
                  onClick={() => DirDeleteHandler(dir.id)}
                  className="delete-btn"
                >
                  delete
                </button>
              </div>
            )}
          </div>
        );
      })}
      {data.files.map((file) => {
        return (
          <div key={file.id} className="file-item">
            <div className="folder-img-name">
              <FileImage filename={file.name} />
              <p>{file.name}</p>
            </div>

            {/* <Link to={`/files/${file.id}`}>Open</Link> */}
            <div onClick={() => toggleId(file.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
              </svg>
            </div>
            {showMenu === file.id && (
              <div ref={menuRef} className="options-dropdown">
                <button
                  className="download-btn"
                  onClick={() => DownloadHandler(file.id, file.name)}
                >
                  Download
                </button>
                <button
                  className="rename-btn"
                  onClick={() => RenameHandler(file.name, file.id)}
                >
                  Rename
                </button>
                <button
                  className="delete-btn"
                  onClick={() => DeleteHandler(file.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
      {isRename && (
        <div className="dialog-box">
          Re-Name:{" "}
          <input
            ref={inputRef}
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          <button onClick={SaveHandler}>Save</button>
        </div>
      )}
      {isRenameDir && (
        <div className="dialog-box">
          Re-Name:{" "}
          <input
            ref={inputRef}
            type="text"
            value={renameDir}
            onChange={(e) => setRenameDir(e.target.value)}
          />
          <button onClick={DirSaveHandler}>Save</button>
        </div>
      )}
    </div>
  );
};

export default ShowContent;
