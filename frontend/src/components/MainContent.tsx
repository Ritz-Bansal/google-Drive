import { DriveContext } from "@/store/DriveContext";
import { useContext, useEffect, useRef, useState } from "react";
import Folders from "./Folders";
import File from "./File";
import createFolder from "../assets/newFolder.png";
import slideLeft from "../assets/arrow.png";
import slideRight from "../assets/rightArrow.png";
import { Modal } from "./Modal";
import { FileSkeleton } from "./FileSkeleton";
import { FolderSkeleton } from "./FolderSkeleton";
import type { IFiles, IFolders } from "@/types/interfaces";

interface IMainContent {
  isLoading: boolean;
  sharedFiles?: IFiles[];
  sharedFolders?: IFolders[];
  isShared?: boolean;
  shareHash?: string;
}

/** Returns how many folder tiles fit in the current viewport (excluding the +create slot) */
function useVisibleCount() {
  const getCount = () => {
    const w = window.innerWidth;
    if (w < 640) return 2;   // mobile  — 1 create + 1 folder
    if (w < 1024) return 3;  // tablet  — 1 create + 2 folders
    return 5;                // desktop — 1 create + 4 folders
  };
  const [count, setCount] = useState(getCount);
  useEffect(() => {
    const handler = () => setCount(getCount());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return count;
}

function MainContent({
  isLoading,
  sharedFiles,
  sharedFolders,
  isShared,
  shareHash,
}: IMainContent) {
  const { folders } = useContext(DriveContext)!;
  const { files } = useContext(DriveContext)!;
  const [startIdx, setStartIdx] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const visibleCount = useVisibleCount();

  // Slots available for real folders (1 slot is always the +create button)
  const folderSlots = visibleCount;
  const len = folders.length;
  const visibleFolders = folders.slice(startIdx, startIdx + folderSlots);

  // Reset to 0 whenever folders array changes (covers search + navigation)
  // const prevFolderLen = useRef(len);
  // useEffect(() => {
  //   if (prevFolderLen.current !== len) {
  //     setStartIdx(0);
  //     prevFolderLen.current = len;
  //   }
  // }, [len]);

  // Also reset when visibleCount changes
  useEffect(() => {
    setStartIdx(0);
  }, [visibleCount]);

  // Can go right: there's at least 1 more folder beyond what's visible
  // "one extra" means we allow sliding until startIdx === len (all folders scrolled past)
  const canGoRight = startIdx + folderSlots< len+1 ;
  // Can go left: we're not at the start
  const canGoLeft = startIdx > 0;

  function handleIncIndex() {
    if (canGoRight) setStartIdx((x) => x + 1);
  }

  function handleDecIndex() {
    if (canGoLeft) setStartIdx((x) => x - 1);
  }

  return (
    <div className="mx-4 sm:mx-8 md:mx-20 mt-6 md:mt-10 flex flex-col h-full">
      <h2 className="text-2xl md:text-3xl font-semibold text-[#3BAD9E]">My Drive</h2>

      <div className="mt-10">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg text-[#8C8989]">FOLDER</h2>
          <div className="flex gap-10 mr-5">
            <img
              onClick={handleDecIndex}
              src={slideRight}
              className={`h-[15px] transition-opacity select-none ${canGoLeft ? "cursor-pointer opacity-100" : "opacity-25 cursor-default"}`}
            />
            <img
              onClick={handleIncIndex}
              src={slideLeft}
              className={`h-[15px] transition-opacity select-none ${canGoRight ? "cursor-pointer opacity-100" : "opacity-25 cursor-default"}`}
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
          {isLoading ? (
            <FolderSkeleton />
          ) : (
            <>
              <img
                src={createFolder}
                onClick={() => setIsCreateOpen(true)}
                alt=""
                className="w-[110px] sm:w-[130px] md:w-[150px] h-[90px] sm:h-[100px] md:h-[110px] flex-shrink-0 cursor-pointer"
              />
              {isShared
                ? sharedFolders!.map((folder) => (
                    <Folders
                      key={folder.id}
                      isShared={true}
                      shareHash={shareHash}
                      id={folder.id}
                      title={folder.title}
                    />
                  ))
                : visibleFolders.map((folder) => (
                    <Folders key={folder.id} id={folder.id} title={folder.title} />
                  ))}
            </>
          )}
        </div>
      </div>

      <div className="mt-12 flex flex-col flex-1 min-h-0">
        <h2 className="text-lg text-[#8C8989] font-bold">ALL FILES</h2>
        <div className="flex justify-between text-[#3BAD9E] font-medium mt-3">
          <div>NAME</div>
          <div className="hidden sm:block mr-4 md:mr-16">FILE SIZE</div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar min-h-0">
          {isLoading ? (
            <FileSkeleton />
          ) : isShared ? (
            sharedFiles!.map((file) => (
              <File
                key={file.id}
                id={file.id}
                title={file.title}
                contentType={file.type}
                size={file.size}
                isShared={isShared}
                shareHash={shareHash}
              />
            ))
          ) : (
            files.map((file) => (
              <File
                key={file.id}
                id={file.id}
                title={file.title}
                contentType={file.type}
                size={file.size}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MainContent;
