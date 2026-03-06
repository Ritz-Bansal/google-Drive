import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import image from "../assets/image.png";
import pdf from "../assets/pdf.png";
import video from "../assets/video.png"
import { sizeFormatter } from "@/lib/sizeFormatter";

interface IFile{
  id: string;
  title: string;
  contentType: string;
  size: number;
}

function File({id, title, contentType, size}: IFile){
    // let kb = false;
    // if(size >= 1024){
    //   size = size/1024;
    //   kb = true;
    // }

    console.log("Size is ",size);
    // let kb = false;
    // let displaySize = size;

    // if (size >= 1024) {
    //   displaySize = size / 1024;
    //   kb = true;
    // }
    // const displaySizee = displaySize.toFixed(1);

    const {displaySize, displayType} = sizeFormatter(size);

    async function fileClick(id: string){
      try{
        const response = await api.get(`/file/fetch/${id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('token')
          }
        });
        if(response.status == 200){
          window.open(response.data.message.fileUrl, "_blank");
        }
      
      }catch(error){
        console.log(error);
      }
    }

    let contentTypeParts = contentType.split('/');
    const type = contentTypeParts[0] == "image" ? "image" : contentTypeParts[0] == "video" ? "video" : "pdf"

    return (
      <div onClick={()=> fileClick(id)} className="border-b-2 flex items-center justify-between border-gray-100 pb-4 ">
        <div className="flex mt-5">
          <img src={type == "image" ? image : type == "video" ? video : pdf } className="w-[15px] max-h-[15px] mt-1.5 mr-2" />
          <p>{title}</p>
        </div>
        <div className="pl-7 flex mt-5 h-full">
          <p className="min-w-[75px] text-center mr-8">{displaySize + " " + displayType}</p>
        </div>
      </div>
    );
}

export default File;