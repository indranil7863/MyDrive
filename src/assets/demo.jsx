function App() {
  const [directoryItem, setDirectoryItem] = useState([]);
  const [showProgress, setShowProgress] = useState(0);
  const [newInputVal, setNewInputVal] = useState("");
  const [isRename, setIsRename] = useState(false);

  const url = "http://127.0.0.1:4000";
  async function getDirectoryItems() {
    const response = await fetch("http://127.0.0.1:4000/");
    const data = await response.json();
    setDirectoryItem(data);
  }
  useEffect(() => {
    getDirectoryItems();
  }, []);
  async function FileHandler(e) {
    const File = e.target.files[0];
    console.log(File);
    // const response = await fetch("http://127.0.0.1:4000/", {
    //   headers: {
    //     "file-name": File.name,
    //   },
    //   method: "POST",
    //   body: File,
    // });
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:4000/");
    xhr.setRequestHeader("file-name", File.name);
    xhr.upload.onprogress = function (event) {
      console.log(event);
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        // console.log("Progress: ", percent.toFixed(2) + "%");
        setShowProgress(percent.toFixed(2));
      }
    };
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("successfully uploaded!");
        alert("successfully uploaded!");
        getDirectoryItems();
      }
    };
    xhr.onerror = function () {
      console.log("network error!!");
    };
    xhr.send(File);
  }

  async function DeleteHandler(filename) {
    const response = await fetch("http://127.0.0.1:4000/", {
      method: "DELETE",
      body: JSON.stringify({
        filename,
        url,
      }),
    });
    const data = await response.text();
    alert(data);
    getDirectoryItems();
  }

  async function RenameHandler(oldName) {
    setIsRename((prev) => !prev);
    if (!isRename) {
      setNewInputVal(oldName);
      console.log("hi there");
    } else {
      console.log("hello");
      const response = await fetch("http://127.0.0.1:4000/", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          oldName,
          newInputVal,
        }),
      });
      const data = await response.json();

      alert(data);
      if (response.status === 200) {
        getDirectoryItems();
      }
    }
  }
  return (
    <>
      <h1>hi there</h1>
      <input type="file" name="" id="" onChange={FileHandler} />
      <label htmlFor="rename">
        Rename:
        <input
          onChange={(e) => setNewInputVal(e.target.value)}
          value={newInputVal}
          type="text"
          name=""
          id="rename"
        />
      </label>
      <p>
        {parseInt(showProgress) === 100 || showProgress == 0
          ? ""
          : showProgress + "%"}
      </p>
      {directoryItem.map((item) => {
        return (
          <div key={item}>
            {item} <a href={`${url}/${item}?action=open`}>Open</a>
            <a href={`${url}/${item}?action=download`}>Download</a>
            <button onClick={() => DeleteHandler(item, url)}>Delete</button>
            <button onClick={() => RenameHandler(item)}>
              {isRename ? "Save" : "Rename"}
            </button>
            <br />
          </div>
        );
      })}
    </>
  );
}

export default App;
