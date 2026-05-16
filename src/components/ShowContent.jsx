import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import profilepic from "../assets/user.png";
import FileImage from "./FileImage";
import { toast } from 'react-toastify';

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
    try {
      const url = "http://localhost:4000/files/";
      const res = await fetch(url + fileid);

    } catch (error) {
      toast.error("network error!")
    }
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
    try {
      const response = await fetch(`http://localhost:4000/files/${fileId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          newfilename: newFileName,
        }),
      });

      if (response.status === 200) {
        toast.success("file renamed");
      } else {
        toast.error("unable to rename file!")
      }
    } catch (error) {
      toast.error("network error!")
    }
    // re-render compoentnt
    FetchData();
    setNewFileName("");
  }
  // file delete
  async function DeleteHandler(fileid) {
    try {
      const response = await fetch(`http://localhost:4000/files/${fileid}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        toast.success("file deleted!")
      } else {
        toast.error("unable to delete the file!")
      }
    } catch (error) {
      toast.error("network error!")
    }

    // re-render component
    setShowMenu("");
    FetchData();
  }

  async function FetchData() {
    try {
      const url = "http://localhost:4000/directory";
      const response = await fetch(url + `/${dirid ? dirid : ""}`, {
        credentials: "include",
      });
      const data = await response.json();
      console.log("show-data", data);
      if (response.status !== 200) {
        navigate("/register");
        toast.error("You are not logged in!")
      }
      setData(data);
    } catch (error) {
      toast.error("network error!")
    }
  }

  async function DownloadHandler(fileid, filename) {
    const res = await fetch(
      "http://localhost:4000/files/" + fileid + "?action=download", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    }
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

  const [progress, setProgress] = useState(0);
  // file upload
  function UploadFileHandler(e) {
    const File = e.target.files[0];

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open("POST", `http://localhost:4000/files/${File.name}`);
    xhr.setRequestHeader("parentdirid", dirid);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.floor((event.loaded / event.total) * 100)
        console.log(percent);
        setProgress(Number(percent));
      }
    };
    xhr.onload = function () {
      if (xhr.status === 200) {
        setProgress(0);
        toast.success("Successfully uploaded!")

        // fetch data
        FetchData();
      }
    };
    xhr.onerror = function () {
      toast.error("network error!")
    };
    xhr.send(File);
  }
  console.log("progress: ", progress);

  // directory creation
  function CreateDirectroyHandler() {
    // parentdirid, dirname
    setIsCreateFolder((prev) => !prev);
  }

  async function SaveDirectoryHandler() {
    setIsCreateFolder((prev) => !prev);
    // api call
    try {
      const res = await fetch(`http://localhost:4000/directory/`, {
        credentials: "include",
        headers: {
          parentdirid: dirid,
          dirname: newFolderName,
        },
        method: "POST",
      });
      console.log(dirid);
      if (res.status === 200) {
        toast.success(`${newFolderName} folder created!`)
        // fetch updated data again
        FetchData();
        setNewFolderName("New Folder");
      } else {
        toast.error("Folder is not created!")
      }
    } catch (error) {
      toast.error("network error!")
    }
  }

  // directory rename
  function DirectoryRename(dirid, dirname) {
    setRenameDir(dirname);
    setIsRenameDir((prev) => !prev);
    console.log("dirid: ", dirid);
    setDirIdRename(dirid);
    setShowMenu(false);
  }

  async function DirSaveHandler() {
    setIsRenameDir((prev) => !prev);
    // api call
    // console.log("dirIdRename: ", dirIdRename);
    try {
      const response = await fetch(
        `http://localhost:4000/directory/${dirIdRename}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({
            newdirname: renameDir,
          }),
        },
      );

      if (response.status === 200) {
        toast.success("directory renamed!")
      } else {
        toast.error("unable to rename!")
      }
    } catch (error) {
      toast.error("network error!")
    }
    // re-render compoentnt
    FetchData();
    setDirIdRename("");
  }


  // directory delete
  async function DirDeleteHandler(DirId) {
    try {
      const res = await fetch(`http://localhost:4000/directory/${DirId}`, {
      credentials: "include",
      method: "DELETE",
    });
    if (res.status === 200) {
      toast.success("directory deleted!");
      FetchData();
    } else {
      toast.error("unable to delete Folder!")
    }
    } catch (error) {
      toast.error("network error!");
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
      <div className="wrapper-banner-section">
        <div className="banner-section">
          <div className="banner-firstdiv">
            <label htmlFor="fileupload">
              <div className="upload-file">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-upload"
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
          <Link to="/profile" className="profile-wrapper">
            <div className="profile-imgcontainer">
              <img src={profilepic} alt="image" title="profile" />
            </div>
          </Link>
        </div>
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {!data.files.length && !data.directories.length && (
        <div className="blank-message">
          <p>
            No files are uploaded here. upload your desired files and create
            directories.
          </p>
        </div>
      )}
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
          <div key={dir._id} className="folder-item">
            <div
              onClick={() => OpenDirectory(dir._id)}
              className="folder-img-name"
            >
              <img
                src="https://img.icons8.com/?size=100&id=74359&format=png&color=228BE6"
                alt=""
                className="folder-img"
              />
              <p className="dir-name">{dir.dirname}</p>
            </div>

            <div onClick={() => toggleId(dir._id)}>
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
            {showMenu === dir._id && (
              <div ref={menuRef} className="options-dropdown">
                <button
                  onClick={() => DirectoryRename(dir._id, dir.dirname)}
                  className="rename-btn"
                >
                  rename
                </button>
                <button
                  onClick={() => DirDeleteHandler(dir._id)}
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
          <div key={file._id} className="file-item">
            <div className="folder-img-name" onClick={() => navigate(`/file/${file._id}`, { state: file })}>
              <FileImage filename={file.fileName} />
              <p className="file-name">{file.fileName}</p>
            </div>

            {/* <Link to={`/files/${file.id}`}>Open</Link> */}
            <div onClick={() => toggleId(file._id)}>
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
            {showMenu === file._id && (
              <div ref={menuRef} className="options-dropdown">
                <button
                  className="download-btn"
                  onClick={() => DownloadHandler(file._id, file.fileName)}
                >
                  Download
                </button>
                <button
                  className="rename-btn"
                  onClick={() => RenameHandler(file.fileName, file._id)}
                >
                  Rename
                </button>
                <button
                  className="delete-btn"
                  onClick={() => DeleteHandler(file._id)}
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
