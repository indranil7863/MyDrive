import React from "react";

const FileImage = ({ filename }) => {
  const filetype = filename.split(".").at(-1)?.toLowerCase();

  if (filetype === "txt") {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=10437&format=png&color=000000"
        alt="text file"
        className="files-image"
      />
    );
  }

  // images
  else if (
    ["jpeg", "jpg", "png", "webp", "gif", "bmp", "svg"].includes(filetype)
  ) {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=12245&format=png&color=000000"
        alt="image file"
        className="files-image"
      />
    );
  }

  // video
  else if (["mp4", "mkv", "avi", "mov", "webm"].includes(filetype)) {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=12769&format=png&color=000000"
        alt="video file"
        className="files-image"
      />
    );
  }

  // audio
  else if (["mp3", "wav", "ogg", "aac", "flac"].includes(filetype)) {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=11552&format=png&color=000000"
        alt="audio file"
        className="files-image"
      />
    );
  }

  // pdf
  else if (filetype === "pdf") {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=dINwMKiYXPhx&format=png&color=000000"
        alt="pdf"
        className="files-image"
      />
    );
  }

  // documents
  else if (["doc", "docx"].includes(filetype)) {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=0dgSXfA2wVRg&format=png&color=000000"
        alt="word"
        className="files-image"
      />
    );
  }

  // spreadsheets
  else if (["xls", "xlsx", "csv"].includes(filetype)) {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=4x37L9c7dsMn&format=png&color=000000"
        alt="excel"
        className="files-image"
      />
    );
  }

  // presentations
  else if (["ppt", "pptx"].includes(filetype)) {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=13625&format=png&color=000000"
        alt="powerpoint"
        className="files-image"
      />
    );
  }

  // archives
  else if (["zip", "rar", "7z", "tar", "gz"].includes(filetype)) {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=312&format=png&color=000000"
        alt="archive"
        className="files-image"
      />
    );
  }

  // code files
  else if (
    ["js", "ts", "html", "css", "json", "cpp", "c", "java", "py"].includes(
      filetype,
    )
  ) {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=37927&format=png&color=000000"
        alt="code"
        className="files-image"
      />
    );
  }

  // default file icon
  else {
    return (
      <img
        src="https://img.icons8.com/?size=100&id=11651&format=png&color=000000"
        alt="file"
        className="files-image"
      />
    );
  }
};

export default FileImage;
