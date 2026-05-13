import { useLocation } from "react-router-dom";

function FileView() {
    const {state} = useLocation();
    const url = `http://localhost:4000/files/${state._id}`
    
    const fileType = state.fileType;
    if(fileType.startsWith("image/")){
        return (<div className="center-div">
        <img src={url} alt='preview' width={400}/>
        </div>)
    }

    if(fileType.startsWith('video/')){
        return (
        <div className="center-div">
        <video controls width={500}>
            <source src={url} type={fileType} />
        </video>
        </div>)
    }

    if(fileType === "application/pdf"){
        return ( <div className="center-div">
        <iframe
            src={url}
            width="100%"
            height="600"
        />  
        </div>)
       
    }

    if(fileType.startsWith('audio/')){
        return (<div className="center-div">
        <audio controls>
            <source src={url} type={fileType} />
        </audio>
        </div>)
        
    }

  return (
    <div className="center-div">
        <p>Preview not available</p>
        <br />
        <a href={url} download>
            Download File
        </a>
    </div>
  )
}

export default FileView