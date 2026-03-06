import { useContext, useEffect, useState } from "react";
import LeftBarButton from "./LeftBarButton";
import { Modal } from "./Modal";
import { ProgressDemo } from "./Progress";
import { DriveContext } from "@/store/DriveContext";

function LeftBar(){
    const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
    // const [sizeInGB, setSizeInGB] = useState<number>(0);
    // const [percentage, setPercentage] = useState<number>(0);
    const {files} = useContext(DriveContext)!;

    
    // useEffect(function totalFileSize(){
    // no need of useEffect idhar, only for sideEffects, as soon as the files canges, the entire component will re-render
      console.log("Inside the useEffect");
      let totalSize: number = 0;
      files.forEach((file) => {
        totalSize += file.size;
      });
      console.log("Total size in bytes ", totalSize);

      const GB = 1024*1024*1024;
      const total_size_in_gb = Number((totalSize/(GB)).toFixed(2));
      // aisa calculate karna se thoda sa error can come as meine pehele hi number ko reduce kardiya hai, par itna chalta hai
      // kar hi deta hu theek
      const percent = Number(((totalSize / (1 * GB)) * 100).toFixed(2)); // ((x)*100)/1 ko mein direct x*100 likhra hu as max size is 1 GB
      console.log("Total size in GB ",total_size_in_gb);
      console.log("Percentage " ,percent);
      // setSizeInGB(total_size_in_gb);
      // setPercentage(Number(percent.toFixed(2))); // therefore .0 has no value now
    // }, [files]);

    function onClick(){
        setIsUploadOpen(true);
    }

    function onCLickerStorage(){
      console.log("progress bar");
    }

    function onCLickerGetMoreStorage(){
      alert("Feature under progress");
    }

    return (
      <div className="bg-[#3BAD9E] h-full rounded-tr-[6rem] flex flex-col justify-between">
        {/* {console.log("Inside the component")} */}
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
          <LeftBarButton content={`Storage (${percent}% full)`} onCLickHandler={onCLickerStorage}/>
          <ProgressDemo progress={percent}/> {/* percentage and progress same baat here */}
          <p className="text-xs mt-2 text-white">{`${total_size_in_gb} GB of 1 GB used`}</p>
          <div className="mb-12 mt-8 ">

          <LeftBarButton content="Get more storage" onCLickHandler={onCLickerGetMoreStorage} />
          </div>
        </div> 
      </div>
    );
}

export default LeftBar;