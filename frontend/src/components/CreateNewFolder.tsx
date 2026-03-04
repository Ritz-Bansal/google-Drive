import React, { useContext, useState, type SetStateAction } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import type { IFolders } from "@/types/interfaces";
import { DriveContext } from "@/store/DriveContext";


interface ICreateNewFolder {
//     setFolders: React.Dispatch<SetStateAction<IFolders[]>>;
//     folders: IFolders[]
    setIsOpen: React.Dispatch<SetStateAction<boolean>>
}

// { setFolders, folders }: ICreateNewFolder
function CreateNewFolder({setIsOpen}: ICreateNewFolder){
    const { folders, setFolders } = useContext(DriveContext)!;
    const [title, setTitle] = useState("");
    const { parentId } = useParams();
    // const [isOpen, setIsOpen] = useState(false);

    async function createNewFolder(){
        console.log("Insde the frontedn function");
        try{
            const response = await api.post("/create", {
                title: title, 
                parentId: parentId
            }, {headers: {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }})

            console.log(response.data);
            if(response.status == 201){
                alert("Folder created");
                setFolders([...folders, response.data])
                setIsOpen(false);
            }
        }catch(error){
            console.log(error);
        }
    }

    return (
      <>
        {/* <DialogDemo modalType={"createFolder"} title="New folder" onSubmit={createNewFolder} isOpen={isOpen} setIsOpen = {setIsOpen}/> */}
        {/* <button  className="border-2" onClick={createNewFolder}>Create new folder</button> */}
        <input type="text" placeholder="Title of the new folder" onChange={(e) => setTitle(e.target.value)}/>
        <div className="flex gap-2 justify-end">
            <button className="border-2" onClick={createNewFolder}>Create</button>
            <button className="border-2" onClick={()=> setIsOpen(false)}>Close</button>
        </div>
      </>
    );
}

export default CreateNewFolder;