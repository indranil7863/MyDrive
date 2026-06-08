import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";

import FileImage from "./FileImage";
import Loading from "./Loading";
import { toast } from 'react-toastify';
import ContentDetails from "./ContentDetails";
import { FileSizeCalculate } from "../utils/FileSizeCalculate.js";
import { Upload, FolderPlus, House } from 'lucide-react'


const ShowContent = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const { dirid } = useParams();
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [breadcrumb, setBreadCrumb] = useState(null);

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
  const [isloading, setIsLoading] = useState(false);
  const [directoryFlow, setDirectoryFlow] = useState("root");
  const [details, setDetails] = useState(false);
  const directoryFLowRef = useRef("Root");
  // for drag and drop
  const [dragFile, setDragFile] = useState(null);
  const [isdragover, setIsDragOver] = useState(false);


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
      const url = `${backend_url}/files/`;
      const res = await fetch(url + fileid);
      if (res.status !== 200) {
        toast.error("This is can't be opened!")
      }

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
      const response = await fetch(`${backend_url}/files/${fileId}`, {
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
    setShowMenu("");
    setIsLoading(true);
    try {
      const response = await fetch(`${backend_url}/files/${fileid}`, {
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
    } finally {
      setIsLoading(false);
    }

    // re-render component
    setShowMenu("");
    FetchData();
  }

  // fetch breadcrumb call 
  async function FetchBreadCrumbData() {
    try {
      const response = await fetch(`${backend_url}/directory/breadcrumb/${dirid}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json();
      setBreadCrumb(data.result);
    } catch (error) {
      toast.error("network error!")
    }
  }



  // fetch directory data
  async function FetchData() {
    try {
      setIsLoading(true);
      const url = `${backend_url}/directory`;
      const response = await fetch(url + `/${dirid ? dirid : ""}`, {
        credentials: "include",
      });
      const data = await response.json();
      // console.log("show-data", data);
      if (response.status !== 200) {
        navigate("/register");
        toast.error("You are not logged in!")
      }
      // fetchBreadcrumb call
      if (dirid) await FetchBreadCrumbData(dirid);
      console.log(data);
      setData(data);
    } catch (error) {
      // navigate("/register");
      toast.error("network error!")
    } finally {
      setIsLoading(false);
    }
  }

  async function DownloadHandler(fileid, filename) {
    setShowMenu("");
    const res = await fetch(
      `${backend_url}/files/` + fileid + "?action=download", {
      credentials: "include",

    }
    );
    const data = await res.json();

    // const blob = await res.blob();
    // const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = data.url;
    a.download = filename; // filename
    document.body.appendChild(a);
    a.click();

    a.remove();

  }

  const [progress, setProgress] = useState(0);

  // file upload
  async function UploadFileHandler(e) {
    let File;
    if (e.type === "change") {
      File = e.target.files[0];
    }
    else if (e.type === "drop") {
      File = e.dataTransfer.files[0];
    }

    console.log("File: ", File);

    if (!File) return;
    const tempItem = {
      file: File,
      name: File.name,
      size: File.size,
    }
    console.log(tempItem)

    const data = await fetch(`${backend_url}/files/upload/initiate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: File.name,
        size: File.size,
        contentType: File.type,
        parentDirId: dirid
      })
    })

    const { uploadSignedUrl, fileId } = await data.json();
    // console.log("uploadUrl: ", uploadSignedUrl)
    StartUpload(tempItem, uploadSignedUrl);
  }

  // after getting singned url from backend send file to S3
  function StartUpload(tempItem, uploadSignedUrl) {
    console.log("tempitem:  ", tempItem);
    console.log("uploadUrl: ", uploadSignedUrl)
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("PUT", uploadSignedUrl);

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

    xhr.send(tempItem.file);
  }


  // directory creation
  function CreateDirectroyHandler() {
    // parentdirid, dirname
    setIsCreateFolder((prev) => !prev);
  }

  async function SaveDirectoryHandler() {
    setIsCreateFolder((prev) => !prev);
    // api call
    try {
      const res = await fetch(`${backend_url}/directory/`, {
        credentials: "include",
        headers: {
          parentdirid: dirid,
          dirname: newFolderName,
        },
        method: "POST",
      });

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
        `${backend_url}/directory/${dirIdRename}`,
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
    setShowMenu("");
    setIsLoading(true);
    try {
      const res = await fetch(`${backend_url}/directory/${DirId}`, {
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
    } finally {
      setIsLoading(false);
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

  const [currentDetails, setCurrentDetails] = useState({ filename: "", filesize: "", breadcrumb: [] });
  function DetailsButtonHandler(fileName, breadcrumb, filesize) {
    setDetails(true);
    setShowMenu("");
    console.log("filesize: ", filesize);
    setCurrentDetails((prev) => ({ ...prev, filename: fileName, filesize: filesize, breadcrumb: breadcrumb }));
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDrop(e) {
    e.preventDefault();
    console.log(e.dataTransfer.files[0])
    console.log("uploading drag & Drop File!");
    UploadFileHandler(e);
    setIsDragOver(false);
  }


  return (
    <div className={`min-h-screen flex flex-col gap-4 bg-gray-300`}>
      <div className="main-file-container">
        <div className={`wrapper-banner-section flex flex-col gap-2 ${isdragover ? "bg-gray-500" : "bg-[#ffffff]"}`} onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={() => setIsDragOver(false)}>
          <div>
            <Upload size={40} color="gray" />
          </div>
          <p className="font-bold text-lg">Upload Files or Create Directory</p>
          <p className="font-light text-gray-500">Drag and drop files here, or click to select files</p>
          <div className="banner-section">

            <label htmlFor="fileupload">
              <div className="upload-file">
                <Upload size={20} />
                <span className="text-sm">Upload File</span>
              </div>
              <input
                onChange={UploadFileHandler}
                type="file"
                id="fileupload"
                style={{ display: "none" }}
              />
            </label>
            <button onClick={CreateDirectroyHandler} className="create-folder">
              <FolderPlus size={20} />
              <span className="text-sm">Create Directory</span>
            </button>
          </div>
          <div className="progress-bar bg-green-700" style={{ width: `${progress}%` }}></div>
        </div>
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
      {
        isloading && (<div className="absolute top-[50%] left-[50%] z-10"><Loading /></div>)
      }
      <div className=" w-[90%] flex justify-center " style={{ margin: "0px auto" }}>
        <div className=" sm:rounded-xl bg-green-50 flex overflow-x-auto whitespace-nowrap scrollbar-none sm:w-[90%] w-full text-2xl font-bold text-blue-500 mx-auto" style={{ padding: "8px 20px" }}>
          {breadcrumb ? breadcrumb.map((dir, index) => (
            <span key={index} className=" text-center flex items-center" >
              {index !== 0 && <span className=" text-black px-2 w-4 inline-block text-center" style={{ padding: "0px 10px", width: "31px" }}>{" > "}</span>}
              <div className="text-xl flex items-center">
                {dir === "root" ? <><House color="gray" /><span className="text-2xl italic text-gray-400" style={{ padding: "0px 4px" }}></span></> : dir}
              </div>
            </span>
          )) : <House color="gray" />}
        </div>
      </div>
      <section className="flex flex-col gap-4 sm:w-[85%]  rounded-lg" style={{ margin: "0px auto", padding: "10px " }}>
        <div className=" flex flex-wrap justify-start gap-4 " style={{ padding: "4px" }}>
          {data.directories.length === 0 && <p className="text-center w-full italic text-gray-950/40">No Directories Created!</p>}
          {data.directories && data.directories.map((dir) => {
            return (
              <div key={dir._id} className="folder-item hover:cursor-pointer" >
                <div
                  onClick={() => OpenDirectory(dir._id)}
                  className="h-full w-full flex flex-col gap-4"
                  style={{ padding: "4px" }}
                >
                  <div className=" flex justify-between " style={{ padding: "5px 10px" }}>
                    <img
                      src="https://img.icons8.com/?size=100&id=74359&format=png&color=228BE6"
                      alt=""
                      className="folder-img"
                    />
                    <div className="w-8 text-center" onClick={(e) => {
                      toggleId(dir._id)
                      e.stopPropagation()
                    }}>
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
                  </div>
                  <p className="dir-name text-lg font-semibold">{dir.dirname}</p>
                  <p className="bg-gray-200 w-[60px] text-center rounded-lg text-sm">Folder</p>

                  <div className="flex justify-between " style={{}}>
                    <p>Size</p>
                    <p>{FileSizeCalculate(dir.TotalDirectorySize)}</p>
                  </div>


                </div>
                {
                  details && <ContentDetails details={details} setDetails={setDetails} filename={currentDetails.filename} filesize={currentDetails.filesize} breadcrumb={currentDetails.breadcrumb} isdirectory={true} />
                }


                {showMenu === dir._id && (
                  <div ref={menuRef} className="flex flex-col justify-center items-center gap-4 bg-gray-200 border-2 border-purple-300 text-black w-[150px] h-[150px] p-4 absolute right-0 top-6 z-5 rounded-sm">
                    <button
                      onClick={() => DirectoryRename(dir._id, dir.dirname)}
                      // className="rename-btn"
                      className="w-[80%] hover:text-blue-700 outline-0 border-0"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => DirDeleteHandler(dir._id)}
                      // className="delete-btn"
                      className="w-[80%] hover:text-blue-700 outline-0 "
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => DetailsButtonHandler(dir.dirname, breadcrumb, dir.TotalDirectorySize)}
                      className="w-[80%] hover:text-blue-700 outline-0 "
                    >
                      Details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className=" flex flex-wrap justify-start gap-4" style={{ padding: "4px" }}>
          {data.files.length === 0 && <p className="text-center w-full italic text-gray-950/40">No Files Uploaded!</p>}
          {data.files.map((file) => {
            return (
              <div key={file._id} className="file-item rounded-lg" >
                <div className="folder-img-name rounded-lg hover:cursor-pointer" onClick={() => navigate(`/file/${file._id}`, { state: file })}>
                  <div className="flex justify-between items-center" style={{ padding: "5px 10px" }}>
                    <div className="bg-gray-400/10 rounded-lg text-center" style={{ padding: "2px" }}>
                      <FileImage filename={file.fileName} />
                    </div>

                    <div onClick={(e) => {
                      toggleId(file._id);
                      e.stopPropagation()
                    }} >
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
                  </div>
                  <p className="file-name text-lg font-semibold">{file.fileName}</p>
                  <p className="bg-gray-200 w-[60px] text-center rounded-lg text-sm">{file.extension.slice(1).toUpperCase()}</p>

                  <div className="flex justify-between">
                    <p>Size</p>
                    <p>{FileSizeCalculate(file.fileSize)}</p>
                  </div>

                </div>
                {
                  details && <ContentDetails details={details} setDetails={setDetails} filename={currentDetails.filename} filesize={currentDetails.filesize} breadcrumb={currentDetails.breadcrumb} />
                }

                {/* <Link to={`/files/${file.id}`}>Open</Link> */}

                {showMenu === file._id && (
                  <div ref={menuRef} className="flex flex-col justify-center items-center gap-2 bg-gray-200 border-2 border-purple-300 text-black w-[150px] h-[150px]  absolute right-0 top-8 z-5 rounded-sm" >
                    <button
                      className="w-[80%] hover:text-blue-700 outline-0 "
                      onClick={() => DownloadHandler(file._id, file.fileName)}
                    >
                      Download
                    </button>
                    <button
                      className="w-[80%] hover:text-blue-700 outline-0 "
                      onClick={() => RenameHandler(file.fileName, file._id)}
                    >
                      Rename
                    </button>
                    <button
                      className="w-[80%] hover:text-blue-700 outline-0 "
                      onClick={() => DeleteHandler(file._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="w-[80%] hover:text-blue-700 outline-0 "
                      onClick={() => DetailsButtonHandler(file.fileName, breadcrumb, file.fileSize)}
                    >
                      Details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      {/* {!isloading && !data.files.length && !data.directories.length && (
        <div className="blank-message">
          <p>
            No files are uploaded here. upload your desired files and create
            directories.
          </p>
        </div>
      )} */}




      {
        isRename && (
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
        )
      }
      {
        isRenameDir && (
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
        )
      }
    </div >
  );
};

export default ShowContent;
