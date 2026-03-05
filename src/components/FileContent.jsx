import { useParams } from "react-router-dom";
import { useEffect } from "react";

const FileContent = () => {
  const { fileid } = useParams();

  useEffect(() => {
    async function downloadFile() {
      const res = await fetch(
        "http://localhost:4000/files/" + fileid + "?action=download",
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileid;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    }

    downloadFile();
  }, [fileid]);

  return <div>Downloading...</div>;
};

export default FileContent;
