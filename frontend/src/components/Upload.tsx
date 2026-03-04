import api from "@/lib/api";
import { DriveContext } from "@/store/DriveContext";
import type { IFiles } from "@/types/interfaces";
import { useContext, useState, type SetStateAction } from "react";
import { useParams } from "react-router-dom";

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
        <input type="file" className="border-2" placeholder="upload here" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}/>
        <input type="text"  placeholder="File title" onChange={(e) => setTitle(e.target.value)}/>
        <input type="text" placeholder="File type" onChange={(e) => setType(e.target.value)}/>
        <button className="border-2" onClick={upload}>Upload file</button>
        <button onClick={()=> setIsOpen(false)}>Close</button>
        {/* {console.log(uploadFile)}
        {console.log(files)} */}
        </>
    )
}

export default Upload;