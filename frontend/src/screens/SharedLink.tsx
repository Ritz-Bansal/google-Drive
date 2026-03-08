import LeftBar from "@/components/LeftBar";
import MainContent from "@/components/MainContent";
import SearchBar from "@/components/SearchBar";
import TopBar from "@/components/TopBar";
import api from "@/lib/api";
import type { IFiles, IFolders } from "@/types/interfaces";
import { fetchResourceSchema } from "@/validators/share.validator";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SharedLink() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [folders, setFolders] = useState<IFolders[]>([]);
  const [files, setFiles] = useState<IFiles[]>([]);

  const { hash, resourceId } = useParams();

  async function fetchSharedData() {
    try {
      const parsed = fetchResourceSchema.safeParse({
        hash: hash,
        resourceId: resourceId,
      });
      if (!parsed.success) {
        return;
      }

      const response = await api.get("/share/resource", {
        params: {
          hash: hash,
          resourceId: resourceId,
        },
      });

      if (response.data.fileUrl) {
        window.location.href = response.data.fileUrl;
        return;
      }

      console.log(response.data);
      setFiles(response.data.file);
      setFolders(response.data.folder);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log(isLoading, "before fetch shared data");
    fetchSharedData();
    console.log(isLoading, "after fetch shared data");

    return () => {
      setFolders([]);
      setFiles([]);
    };
  }, [resourceId]);

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <div className="m-0 grid-rows-2">
        <TopBar isShared={true} shareHash={hash} setSharedFolders={setFolders} setSharedFiles={setFiles}/>
      </div>
      <div className="">
        {/* <LeftBar /> */}
        {/* <div className="mx-20 mt-4">
          <SearchBar />
        </div> */}
        <MainContent
          isShared={true}
          isLoading={isLoading}
          sharedFiles={files}
          sharedFolders={folders}
          shareHash={hash}
        />
      </div>
      {/* {JSON.stringify(folders)} */}
    </div>
  );
}

export default SharedLink;
