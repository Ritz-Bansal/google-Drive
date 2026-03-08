import { useContext, useState } from "react";
import LeftBarButton from "./LeftBarButton";
import { Modal } from "./Modal";
import { ProgressDemo } from "./Progress";
import { DriveContext } from "@/store/DriveContext";
import { X, CloudUpload } from "lucide-react";

interface ILeftBar {
  onClose?: () => void;
}

function LeftBar({ onClose }: ILeftBar) {
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const { totalSize } = useContext(DriveContext)!;
  const GB = 1024 * 1024 * 1024;
  const total_size_in_gb = Number((totalSize / GB).toFixed(2));
  const percent = Number(((totalSize / (1 * GB)) * 100).toFixed(2));

  function onCLickerStorage() {
    console.log("progress bar");
  }

  function onCLickerGetMoreStorage() {
    alert("Feature under progress");
  }

  return (
    <div className="bg-[#3BAD9E] h-full rounded-tr-[6rem] flex flex-col justify-between">
      {/* Mobile close button */}
      {onClose && (
        <button
          className="md:hidden self-end mt-4 mr-4 p-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={18} className="text-white" />
        </button>
      )}

      {/* Upload New File — prominent styled button */}
      <div className="w-full flex justify-center mt-10 md:mt-14">
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 bg-white text-[#3BAD9E] font-semibold text-sm py-3 px-6 rounded-4xl w-[75%] justify-center shadow-sm hover:bg-[#eaf6f4] hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <CloudUpload size={16} />
          Upload New File
        </button>
        {isUploadOpen && (
          <Modal
            isOpen={isUploadOpen}
            setIsOpen={setIsUploadOpen}
            modalType={"uploadFile"}
            title="Upload File"
          />
        )}
      </div>

      <div className="items-center w-full flex flex-col gap-2">
        <LeftBarButton
          content={`Storage (${percent}% full)`}
          onCLickHandler={onCLickerStorage}
        />
        <ProgressDemo progress={percent} />
        <p className="text-xs mt-1 text-white">{`${total_size_in_gb} GB of 1 GB used`}</p>
        <div className="mb-12 mt-4 w-full">
          <LeftBarButton
            content="Get more storage"
            onCLickHandler={onCLickerGetMoreStorage}
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
}

export default LeftBar;