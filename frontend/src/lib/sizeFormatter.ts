export function sizeFormatter(size: number){
    let type: string, displaySize: number;
    const KB = 1024;
    const MB = 1024*1024;
    const GB = 1024*1024*1024;

    if(size/KB > 1){
        if(size/MB > 1){
            if(size/GB > 1){
                displaySize = size/GB;
                type = "GB";
            }else{
                displaySize = size/MB;
                type = "MB";
            }
        }else{
            displaySize = size/KB;
            type = "KB";
        }
    }else{
        displaySize = size;
        type = "B";
    }
    console.log(displaySize);
    return {
        displaySize: displaySize.toFixed(1),
        displayType: type
    }
}