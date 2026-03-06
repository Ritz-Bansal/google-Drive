
export function typeAndContentType(type: string){
    let extension: string, contentType: string | null;
    const fileTypeAndExtension = type.split('/');
    const length = fileTypeAndExtension.length;

    extension = fileTypeAndExtension[length-1] ?? "bin";
    if(fileTypeAndExtension[0] != "image" && fileTypeAndExtension[0] != "video" && fileTypeAndExtension[0] != "application"){
        contentType = null;
    }
    contentType = type;
    return {
        extension: extension,
        contentType: contentType
    }
}