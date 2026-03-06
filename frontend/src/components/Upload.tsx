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
    const [title, setTitle] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [finalUrl, setFinalUrl] = useState<string>("");   
    const [uploadFile, setUploadFile] = useState<File | null>(null); 
    // const [isOpen, setIsOpen] = useState<boolean>(false);
    const { parentId } = useParams();


    async function upload(){
        try{
            console.log("before presign");
            const response = await api.post("/file/presigned", {
                type: type
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
                  body: uploadFile,
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
                        title: title, 
                        type: type,
                        fileUrl: response.data.finalUrl,
                        parentId: parentId
                    }, {headers: {
                        Authorization: "Bearer " + localStorage.getItem('token')
                    }});
                    
                    console.log("After upload");
                    console.log(responsex.data);
                    if(responsex.status == 201){
                        alert("File uploaded");
                        setFiles([...files, responsex.data]);
                        setIsOpen(false);
                        
                    }
                }
            }
            
        }catch(error){
            console.log(error);
        }
    }
    
    return (
        <>
        {/* <DialogDemo modalType={"uploadFile"} title="Upload file" isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={upload} /> */}
        {/* <button onClick={upload}>Upload file</button> */}
        <form onSubmit={(e)=>{
            e.preventDefault();
            upload();
        }}>
        {/* <InputBox placeholder="Choose File" setterFunction={setUploadFile} type="file" /> */}
        <div >
            <input id="upload-photo" type="file" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                className="hidden"
                // className="border-[#3BAD9E] border-1 focus:outline-none focus:ring-[#3BAD9E] rounded-lg p-2.5 w-full text-left mb-4"
                accept="image/*, pdf, video/*"
            />
            <label htmlFor="upload-photo"
            className="border-[#3BAD9E] text-[1.2rem] block w-full text-[#6c6969] pl-5 border-1 focus:outline-none focus:ring-[#3BAD9E] rounded-lg p-2.5 text-left mb-4"
            >
                {uploadFile ? uploadFile.name : "Choose File"}
                {/* {console.log(uploadFile)} */}
            </label>
        </div>
        {/* <input type="file" className="border-2" placeholder="upload here" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}/> */}
        <input type="text"  placeholder="File title" onChange={(e) => setTitle(e.target.value)}/>
        <input type="text" placeholder="File type" onChange={(e) => setType(e.target.value)}/>
        {/* <button className="border-2" onClick={upload}>Upload file</button>
        <button onClick={()=> setIsOpen(false)}>Close</button> */}
        <div className="flex gap-2 justify-end">
            <Button name="Upload File" onClick={upload} isDialog={true} />
            <Button name="Close" onClick={()=> setIsOpen(false)} isDialog={true} />
        </div>
        </form>
        {/* {console.log(uploadFile)}
        {console.log(files)} */}
        </>
    )
}

export default Upload;