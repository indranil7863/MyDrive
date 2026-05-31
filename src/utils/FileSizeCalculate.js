
export function FileSizeCalculate(filesize){
    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;

    if(filesize >= GB){
        return `${(filesize / GB).toFixed(2)} GB`
    }else if(filesize >= MB){
        return `${(filesize / MB).toFixed(2)} MB`
    }else if(filesize >= KB){
        return `${(filesize / KB).toFixed(2)} KB`
    }else{
        return `${filesize} B`
    }
    
}