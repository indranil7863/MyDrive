import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";


const FileContent = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const { fileid } = useParams();
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function loadFile() {
      const res = await fetch(`${backend_url}/files/${fileid}`);
      const data = await res.json();
      setFile(data);
    }

    loadFile();
  }, [fileid]);

  if (file.type.startsWith("image")) {
    return <img src={url} width="400" />;
  }

  if (file.type.startsWith("video")) {
    return <video src={url} controls width="500" />;
  }

  if (file.type.startsWith("audio")) {
    return <audio src={url} controls />;
  }

  if (file.type === "application/pdf") {
    return <iframe src={url} width="600" height="500"></iframe>;
  }

  return <p>Preview not supported</p>;
};

export default FileContent;
