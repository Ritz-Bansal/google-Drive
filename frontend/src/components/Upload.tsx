import api from "@/lib/api";
import { DriveContext } from "@/store/DriveContext";
import type { IFiles } from "@/types/interfaces";
import { useContext, useState, type SetStateAction } from "react";
import { useParams } from "react-router-dom";
import InputBox from "./InputBox";
import Button from "./Button";

interface IUpload{
    // setFiles: React.Dispatch<SetStateAction<IFiles[]>>;
    // files: IFiles[]
        setIsOpen: React.Dispatch<SetStateAction<boolean>>
}
// {setFiles, files}: IUpload
function Upload({setIsOpen}: IUpload){
    const {files, setFiles} = useContext(DriveContext)!;
    const {totalSize, setTotalSize} = useContext(DriveContext)!;
    const [title, setTitle] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [finalUrl, setFinalUrl] = useState<string>("");   
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null); 
    // const [isOpen, setIsOpen] = useState<boolean>(false);
    const { parentId } = useParams();


    async function upload(){
        try{
            if(uploadedFile == null){
                alert("Upload a file");
                return;
            }
            console.log("before presign");
            setIsDisable(true);
            // await new Promise(()=> {});
            const response = await api.post("/file/presigned", {
                type: uploadedFile?.type,
                size: uploadedFile?.size
            }, {headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }});
            
            console.log("After presign");
            if(response.status == 200){
                console.log(response.data);
                const presignedUrl = response.data.presignedUrl; 
                setFinalUrl(response.data.finalUrl);
                
                
                console.log("Beofre put");
                const upload = await fetch(`${presignedUrl}`, {
                  method: "PUT",
                  body: uploadedFile,
                  headers: {
                    "If-None-Match": "*",
                    // "Content-Type": uploadFile.type,
                  },
                });
                
                console.log("After put");
                if(upload.ok){
                    console.log("Before upload");
                    console.log(finalUrl);
                    console.log(title);
                    console.log(type);
                    console.log(parentId);
                    const responsex = await api.post("/file/upload", {
                        title: uploadedFile?.name, 
                        type: uploadedFile?.type,
                        fileUrl: response.data.finalUrl,
                        parentId: parentId,
                        size: uploadedFile?.size
                    }, {headers: {
                        Authorization: "Bearer " + localStorage.getItem('token')
                    }});
                    
                    console.log("After upload");
                    console.log(responsex.data);
                    if(responsex.status == 201){
                        alert("File uploaded");
                        setFiles([...files, responsex.data]);
                        setTotalSize(totalSize + (uploadedFile?.size ?? 0));
                        setIsOpen(false);
                    }
                }
            }
            setIsDisable(false);
            
        }catch(error){
            console.log(error);
            setIsDisable(false);
        }
    }
    
    return (
      <>
        {/* <DialogDemo modalType={"uploadFile"} title="Upload file" isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={upload} /> */}
        {/* <button onClick={upload}>Upload file</button> */} 
        {/* {(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            upload();
          }
        }} */}
        <form
          className="max-w-[335px]"
          onSubmit={(e) => {
            e.preventDefault();
            upload();
          }}
        >
          {/* <InputBox placeholder="Choose File" setterFunction={setUploadFile} type="file" /> */}

          <input
            id="upload-photo"
            type="file"
            onChange={(e) => {
              console.log(e.target.files?.[0] ?? null);
              setUploadedFile(e.target.files?.[0] ?? null);
            }}
            className="hidden"
            // className="border-[#3BAD9E] border-1 focus:outline-none focus:ring-[#3BAD9E] rounded-lg p-2.5 w-full text-left mb-4"
            accept="image/*, pdf, video/*"
          />
          <label
            htmlFor="upload-photo"
            className="border-[#3BAD9E] text-[1.2rem] block truncate text-[#6c6969] pl-5 border-1 focus:outline-none focus:ring-[#3BAD9E] rounded-lg p-2.5 text-left mb-4"
          >
            {uploadedFile ? uploadedFile.name : "Choose File"}
            {/* {console.log(uploadFile)} */}
          </label>

          {/* <input type="file" className="border-2" placeholder="upload here" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}/> */}
          {/* <input type="text"  placeholder="File title" onChange={(e) => setTitle(e.target.value)}/>
        <input type="text" placeholder="File type" onChange={(e) => setType(e.target.value)}/> */}
          {/* <button className="border-2" onClick={upload}>Upload file</button>
        <button onClick={()=> setIsOpen(false)}>Close</button> */}
          <div className="flex gap-2 justify-end w-full">
            <Button name="Upload File" isDialog={true} isDisable={isDisable} />
            <Button
              name="Close"
              onClick={() => setIsOpen(false)}
              isDialog={true}
              isDisable={isDisable}
            />
          </div>
        </form>
        {/* {console.log(uploadFile)}
        {console.log(files)} */}
      </>
    );
}

export default Upload;