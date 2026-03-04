import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface IFile{
  id: string;
  title: string;
  type: string;
  size: number;
}

function File({id, title, type, size}: IFile){
  const navigate = useNavigate();
    let gb = false;
    if(size >= 1000){
      size = size/1000;
      gb = true;
    }

    async function fileClick(id: string){
      try{
        const response = await api.get(`/file/${id}`, {
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

    return (
      <div id={id} onClick={()=> fileClick(id)} className="border-b-2 border-gray-100 pb-4 ">
        {/* <img src="" alt="" /> */}
        <div className="pl-7 flex justify-between mt-5 h-full">
          <p>{title}</p>
          <p className="min-w-[75px] text-center mr-8">{gb ? size+" GB" : size+" MB"}</p>
        </div>
      </div>
    );
}

export default File;