import { DriveContext } from "@/store/DriveContext";
import { useContext, useState } from "react";
import Folders from "./Folders";
import File from "./File";
import createFolder from "../assets/newFolder.png"
import slideLeft from "../assets/arrow.png";
import slideRight from "../assets/rightArrow.png";
import { Modal } from "./Modal";
import { ScrollBar } from "./ScrollBar";
import { FileSkeleton } from "./FileSkeleton";
import { FolderSkeleton } from "./FolderSkeleton";

interface IMainContent {
  isLoading: boolean;
}

function MainContent({isLoading}: IMainContent) {
  //   const folders = [
  //     { id: "f1a2b3c4-d111-4a11-8a11-abcdef000001", title: "Work" },
  //     { id: "f1a2b3c4-d222-4a22-8a22-abcdef000002", title: "Personal" },
  //     { id: "f1a2b3c4-d333-4a33-8a33-abcdef000003", title: "Projects" },
  //     { id: "f1a2b3c4-d444-4a44-8a44-abcdef000004", title: "Finance" },
  //     { id: "f1a2b3c4-d555-4a55-8a55-abcdef000005", title: "Travel" },
  //     { id: "f1a2b3c4-d666-4a66-8a66-abcdef000006", title: "Ideas" },
  //     { id: "f1a2b3c4-d777-4a77-8a77-abcdef000007", title: "Learning" },
  //     { id: "f1a2b3c4-d888-4a88-8a88-abcdef000008", title: "Fitness" },
  //     { id: "f1a2b3c4-d999-4a99-8a99-abcdef000009", title: "Clients" },
  //     { id: "f1a2b3c4-d000-4a00-8a00-abcdef000010", title: "Archive" },
  //   ];
  const { folders } = useContext(DriveContext)!;
  const { files } = useContext(DriveContext)!;
  const [startIdx, setStartIdx] = useState(0);
  const visibleFolders = folders.slice(startIdx, startIdx+5);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);


  const len = folders.length;
  function handleIncIndex(){

    if(startIdx+1+5 <= len+1){
      setStartIdx((x)=> x+1);
    }
  }

  function handleDecIndex(){
    if(startIdx-1 >=0 ){
      setStartIdx((x) => x-1);
    }
  }
  return (
    <div className="mx-20 mt-10">
      <h2 className="text-3xl font-semibold text-[#3BAD9E]">My Drive</h2>

      <div className="mt-10">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg text-[#8C8989]">FOLDER</h2>
          <div className="flex gap-10 mr-5">
            <img
              onClick={handleDecIndex}
              src={slideRight}
              className="h-[15px]"
            />
            <img
              onClick={handleIncIndex}
              src={slideLeft}
              className="h-[15px]"
            />
          </div>
        </div>
        <div className="flex mt-5">
          {isCreateOpen && (
            <Modal
            modalType={"createFolder"}
            isOpen={isCreateOpen}
            setIsOpen={setIsCreateOpen}
            title="New folder"
            />
          )}
          {isLoading ? <FolderSkeleton/> : <><img
            src={createFolder}
            onClick={() => setIsCreateOpen(true)}
            alt=""
            className="w-[150px] h-[110px]"
          />
          {visibleFolders.map((folder) => (
            <Folders id={folder.id} title={folder.title} />
          ))}
          </>}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg text-[#8C8989] font-bold">ALL FILES</h2>
        <div className="flex justify-between text-[#3BAD9E] font-medium mt-3">
          <div>NAME</div>
          <div className="mr-12">FILE SIZE</div>
        </div>
        {/* <ScrollBar /> */}
        <div className="h-48 overflow-y-auto no-scrollbar">
          {isLoading? <FileSkeleton />:files.map((file) => (
            <File id={file.id} title={file.title} type={file.type} size={100} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainContent;
