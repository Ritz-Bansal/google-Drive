import CreateNewFolder from "@/components/CreateNewFolder";
import Folders from "@/components/Folders";
import LeftBar from "@/components/LeftBar";
import { Modal } from "@/components/Modal";
import SearchBar from "@/components/SearchBar";
import TopBar from "@/components/TopBar";
// import Upload from "@/components/Upload";
import api from "@/lib/api";
import { DriveContext } from "@/store/DriveContext";
// import type { IFiles, IFolders } from "@/types/interfaces";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import MainContent from "@/components/MainContent";

function Home() {

  // const [folders, setFolders] = useState<IFolders[]>([]);
  // const [files, setFiles] = useState<IFiles[]>([]);

  // I want a better apprach, what if 100 modals ??????????
  const { folders, setFolders } = useContext(DriveContext)!;
  const { files, setFiles } = useContext(DriveContext)!;



  const navigate = useNavigate();
  const { parentId } = useParams();
  
  async function fetch() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/check", {
        params: {
          parentId: parentId,
        },
        headers: {
          Authorization: `Bearer ${token}`, // should I extract this out and put it in the interceptor
        },
      });

      if (response.status == 200) {
        setFiles(response.data.file);
        setFolders(response.data.folder);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetch();

    return () => {
      setFolders([]);
      setFiles([]);
    }
  }, [parentId]);
  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <div className="m-0 grid-rows-2"><TopBar/></div>
      <div className="grid grid-cols-[250px_1fr]">
        <LeftBar />
        <MainContent />
      </div>
      {/* {JSON.stringify(folders)} */}
    </div>
    
  );
}

export default Home;


      <div>
        {/* <CreateNewFolder setFolders = {setFolders} folders = {folders}/> */}
        {/* <Modal
          modalType={"createFolder"}
          isOpen={isCreateOpen}
          setIsOpen={setIsCreateOpen}
          title="New folder"
          type="Create new folder"
        /> */}
      {/* </div> */}
        <div>{/* <Upload setFiles={setFiles} files={files}/> */}</div>
        <div>
        {/* <Modal
          isOpen={isUploadOpen}
          setIsOpen={setIsUploadOpen}
          modalType={"uploadFile"}
          title="Upload File"
          type="Upload file"
        /> */}
      </div>
      <br />
        {/* {JSON.stringify(folders)}
      <br />
      <br />
      {JSON.stringify(files)} */}
        {/* <div className="flex gap-10">
        {folders.map((folder) => (
          <Folders id={folder.id} title={folder.title} />
        ))}
      </div>  */}
      </div>;
