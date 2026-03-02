import CreateNewFolder from "@/components/CreateNewFolder";
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

function Home() {
  // const [folders, setFolders] = useState<IFolders[]>([]);
  // const [files, setFiles] = useState<IFiles[]>([]);

  // I want a better apprach, what if 100 modals ??????????
  const { folders, setFolders } = useContext(DriveContext)!;
  const { files, setFiles } = useContext(DriveContext)!;
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

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
  }, []);
  return (
    <div className="h-screen ">
      <div>
        <TopBar />
        {/* <SearchBar /> */}
      </div>
      <div>
        <LeftBar />
      </div>
      <div>
        {/* <CreateNewFolder setFolders = {setFolders} folders = {folders}/> */}
        {/* <Modal
          modalType={"createFolder"}
          isOpen={isCreateOpen}
          setIsOpen={setIsCreateOpen}
          title="New folder"
          type="Create new folder"
        />
      </div>
      <div>{/* <Upload setFiles={setFiles} files={files}/> */}</div>
      {/* <div>
        <Modal
          isOpen={isUploadOpen}
          setIsOpen={setIsUploadOpen}
          modalType={"uploadFile"}
          title="Upload File"
          type="Upload file"
        />
      </div>
      <br /> */}
      {/* {JSON.stringify(folders)}<br/><br/>
      {JSON.stringify(files)} */}
    </div>
  );
}

export default Home;
