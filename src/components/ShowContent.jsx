import React, { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
const url = "http://localhost:4000";
const ShowContent = () => {
  const data = useLoaderData();
  const [isRename, setIsRename] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileId, setFileId] = useState("");

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
    setNewFileName("");
  }
  // file delete
  async function DeleteHandler(fileid) {
    const response = await fetch(`http://localhost:4000/files/${fileid}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    // re-render component
  }

  return (
    <div>
      {data.files.map((file) => {
        return (
          <div key={file.id}>
            <p>{file.name}</p>
            {/* <button onClick={() => FileOpen(file.id)}>Open</button> */}
            <Link to={`/files/${file.id}`}>Open</Link>
            <button>Download</button>
            <button onClick={() => RenameHandler(file.name, file.id)}>
              Rename
            </button>
            <button onClick={() => DeleteHandler(file.id)}>Delete</button>
          </div>
        );
      })}
      {isRename && (
        <div className="dialog-box">
          Re-Name:{" "}
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          <button onClick={SaveHandler}>Save</button>
        </div>
      )}
    </div>
  );
};

export default ShowContent;

export const Loadcontent = async ({ params }) => {
  console.log(params.dirid);
  const url = "http://localhost:4000/directory";
  const response = await fetch(url + `/${params.dirid ? params.dirid : ""}`);
  return response.json();
};
