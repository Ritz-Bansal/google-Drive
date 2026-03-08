import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import image from "../assets/image.png";
import pdf from "../assets/pdf.png";
import video from "../assets/video.png"
import { sizeFormatter } from "@/lib/sizeFormatter";
import { ArrowUpRightIcon } from "lucide-react";
import { useState } from "react";
import { Modal } from "./Modal";

interface IFile {
  id: string;
  title: string;
  contentType: string;
  size: number;
  isShared?: boolean;
  shareHash?: string;
}

function File({id, title, contentType, size, isShared, shareHash}: IFile){
    const [fileModal, setFileModal] = useState<boolean>(false);
    const [isDisable, setIsDisable] = useState<boolean>(false);

    console.log("Size is ",size);
    const {displaySize, displayType} = sizeFormatter(size);

  async function fileClick(fileId: string) {
    try {
      if(isDisable){
        return;
      }
      setIsDisable(true);
      if (isShared && shareHash) {
        const response = await api.get("/share/resource", {
          params: { hash: shareHash, resourceId: fileId },
        });
        if (response.data.fileUrl) {
          window.open(response.data.fileUrl, "_blank");
        }
      } else {
        const response = await api.get(`/file/fetch/${fileId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (response.status === 200) {
          window.open(response.data.message.fileUrl, "_blank");
        }
      }
      setIsDisable(false);
    } catch (error) {
      console.log(error);
      setIsDisable(false);
    }
  }

    let contentTypeParts = contentType.split('/');
    const type = contentTypeParts[0] == "image" ? "image" : contentTypeParts[0] == "video" ? "video" : "pdf"

    return (
      <>
 {!isShared && fileModal && (
      <Modal
        modalType="shareLink"
        isOpen={true}
        setIsOpen={setFileModal}
        title="Share Link"
        type="file"
        id={id}
      />
    )}

      <div className="border-b-2 border-gray-100 pb-4 flex items-center justify-between">
        <div onClick={() => fileClick(id)} className="flex mt-5 w-full">
          <img src={type == "image" ? image : type == "video" ? video : pdf} className="w-[15px] max-h-[15px] mt-1.5 mr-2" />
          <p>{title}</p>
        </div>
        <div className="pl-7 flex mt-5 h-full">
          <p className={`min-w-[75px] text-center ${isShared? "mr-14": "mr-9"} mt-1.5`}>
            {displaySize + " " + displayType}
          </p>
          {!isShared && (
            <button className="mt-2.25" 
            onClick={() => setFileModal(true)}>
              <ArrowUpRightIcon size={19}/>
            </button>
          )}
        </div>
      </div>
      </>
    );
}

export default File;