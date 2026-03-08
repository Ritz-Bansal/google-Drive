import LeftBar from "@/components/LeftBar";
import TopBar from "@/components/TopBar";
import api from "@/lib/api";
import { DriveContext } from "@/store/DriveContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainContent from "@/components/MainContent";

function Home() {
  const { folders, setFolders } = useContext(DriveContext)!;
  const { files, setFiles } = useContext(DriveContext)!;
  const { totalSize, setTotalSize } = useContext(DriveContext)!;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { parentId } = useParams();
  console.log("ParentId ", parentId);

  async function fetch() {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/file/check", {
        params: { parentId: parentId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status == 200) {
        setFiles(response.data.file);
        setFolders(response.data.folder);
        setTotalSize(response.data.totalSize);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetch();
    return () => {
      setFolders([]);
      setFiles([]);
    };
  }, [parentId]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* TopBar */}
      <TopBar onMenuToggle={() => setSidebarOpen((o) => !o)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* LeftBar — slide-in on mobile, always visible on md+ */}
        <div
          className={`
            fixed top-0 left-0 h-full w-[250px] z-30 transition-transform duration-300
            md:static md:translate-x-0 md:z-auto md:flex-shrink-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <LeftBar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <MainContent isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default Home;
