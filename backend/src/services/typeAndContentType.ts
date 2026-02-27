
export function typeAndContentType(type: string){
    let extension: string, contentType: string;

    if (type == "video") {
        extension = ".mp4";
        contentType = "video/mp4";
    } else if (type == "image") {
        extension = ".jpeg";
        contentType = "image/png";
    } else {
        extension = ".pdf";
        contentType = "application/pdf";
    }

    return {
        extension: extension,
        contentType: contentType
    }
}