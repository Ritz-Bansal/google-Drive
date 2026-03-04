import { useState } from "react";
import folder from "../assets/folder.png"
import greenFolder from "../assets/greenFolder.png";
import { useNavigate } from "react-router-dom";


interface IFolders{
    id: string;
    title: string;
}

function Folders({id, title}: IFolders){
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const navigate = useNavigate();

    function navigateTo(id: string){
      navigate(`/home/${id}`);

    }
    return (
      <div className="w-[150px] h-[110px] ml-11" onMouseEnter={()=> setIsHovered(true)} onMouseLeave={()=> setIsHovered(false)}>
        <img id={id} onClick={()=> navigateTo(id)} src={isHovered ? greenFolder : folder} alt="" className="w-full h-full" />
        <p className={`text-sm text-ellipsis mt-2 text-left pl-2 ${isHovered ? "" :"truncate"} `}>{title}</p>
      </div>
    );
}

export default Folders;