import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import image from "../assets/image.png";
import pdf from "../assets/pdf.png";
import video from "../assets/video.png"

interface IFile{
  id: string;
  title: string;
  contentType: string;
  size: number;
}

function File({id, title, contentType, size}: IFile){
    let gb = false;
    if(size >= 1000){
      size = size/1000;
      gb = true;
    }

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
      <div id={id} onClick={()=> fileClick(id)} className="border-b-2 flex items-center justify-between border-gray-100 pb-4 ">
        <div className="flex mt-5">
          <img src={type == "image" ? image : type == "video" ? video : pdf } className="w-[15px] max-h-[15px] mt-1.5 mr-2" />
          <p>{title}</p>
        </div>
        <div className="pl-7 flex mt-5 h-full">
          <p className="min-w-[75px] text-center mr-8">{gb ? size+" GB" : size+" MB"}</p>
        </div>
      </div>
    );
}

export default File;