import { useState } from "react";
import folder from "../assets/folder.png"
import greenFolder from "../assets/greenFolder.png";
import { useNavigate } from "react-router-dom";
import { Modal } from "./Modal";
import { ArrowUpRightIcon } from "lucide-react";


interface IFolders{
    id: string;
    title: string;
    isShared?: boolean;
    shareHash?: string;
}

function Folders({id, title, isShared, shareHash}: IFolders){
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [folderModal, setFolderModal] = useState<boolean>(false);
    const navigate = useNavigate();

function navigateTo(folderId: string) {
  if (isShared && shareHash) {
    navigate(`/home/${shareHash}/${folderId}`);
  } else {
    navigate(`/home/${folderId}`);
  }
}
    return (
      <>
        {!isShared && folderModal && (
          <Modal
            modalType="shareLink"
            isOpen={true}
            setIsOpen={setFolderModal}
            title="Share Link"
            type="folder"
            id={id}
          />
        )}
          <div className="w-[150px] h-[110px] ml-11">
            <img
              id={id}
              onClick={() => navigateTo(id)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              src={isHovered ? greenFolder : folder}
              alt=""
              className="w-full h-full"
            />
            <div className="flex justify-between">
              <p
                className={`text-sm text-ellipsis mt-2 text-left pl-2 ${isHovered ? "" : "truncate"}`}
              >
                {title}
              </p>
              {!isShared && (
                <button className="pt-2" onClick={() => setFolderModal(true)}>
                  <ArrowUpRightIcon size={19} />
                </button>
              )}
            </div>
          </div>
      </>
    );
}

export default Folders;