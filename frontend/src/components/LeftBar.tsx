import { useState } from "react";
import LeftBarButton from "./LeftBarButton";
import { Modal } from "./Modal";
import { ProgressDemo } from "./Progress";

function LeftBar(){
    const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

    function onClick(){
        setIsUploadOpen(true);
    }

    function onCLickerStorage(){
        console.log("Inside onCLick storage");   
    }

    return (
      <div className="bg-[#3BAD9E] h-full rounded-tr-[6rem] flex flex-col justify-between">
        <div className="w-full text-center mt-13">
          <LeftBarButton content="Upload New File" onCLickHandler={onClick} />
          {isUploadOpen && (
            <Modal
              isOpen={isUploadOpen}
              setIsOpen={setIsUploadOpen}
              modalType={"uploadFile"}
              title="Upload File"
            />
          )}
        </div>

        <div className="items-center w-full flex flex-col">
          <LeftBarButton content="Storage (88% full)" onCLickHandler={onCLickerStorage}/>
          <ProgressDemo progress={88}/>
          <p className="text-xs mt-2 text-white">{"8.8 GB of 10 GB used"}</p>
          <div className="mb-12 mt-8 ">

          <LeftBarButton content="Get more storage" onCLickHandler={onCLickerStorage} />
          </div>
        </div> 
      </div>
    );
}

export default LeftBar;