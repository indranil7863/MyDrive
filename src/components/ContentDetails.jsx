import React from 'react'
import { FileSizeCalculate } from '../utils/FileSizeCalculate.js';

function ContentDetails({ details, setDetails, filename, filesize = 0, breadcrumb, isdirectory = false }) {
    function closeHandler() {
        setDetails(false);
    }
    console.log("received: ", filesize);
    const Filesize = FileSizeCalculate(filesize);
    console.log(Filesize);

    let filepath = "";
    if (breadcrumb == null) filepath += '/Root'
    else filepath = '/' + breadcrumb.join('/')

    return (
        <div>
            <div className="fixed z-10 bg-gray-100 rounded-xl border-2 flex flex-col gap-4 top-[25%] sm:left-[40%] left-[10%] max-w-[300px] max-h-[350px]">
                <h2 className="text-xl font-bold text-center" style={{ padding: "8px 0px" }}>Details</h2>
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto break-all" style={{ padding: "2px 10px" }}>
                    <p className="text-lg font-semibold">Name: <span className="text-sm font-light">{filename}</span></p>
                    <p className="text-lg font-semibold">Path: <span className="text-sm font-light">{!isdirectory ? filepath + "/" + filename : filepath + '/' + filename}</span></p>
                    <p className="text-lg font-semibold">Size: <span className="text-sm font-light">{Filesize}</span></p>
                    <p className="text-lg font-semibold">Created At: <span className="text-sm font-light">{new Date().toLocaleString()}</span></p>
                    <p className="text-lg font-semibold">Updated At: <span className="text-sm font-light">{new Date().toLocaleString()}</span></p>
                </div>
                <button onClick={closeHandler} className="bg-blue-400 font-bold rounded-b-lg hover:cursor-pointer" style={{ marginBottom: "4px", padding: "3px" }}>Close</button>
            </div>
        </div>
    )
}

export default ContentDetails