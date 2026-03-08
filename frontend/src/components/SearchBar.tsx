import api from "@/lib/api";
import { DriveContext } from "@/store/DriveContext";
import type { IFiles, IFolders } from "@/types/interfaces";
import { Search } from "lucide-react";
import { useContext, useEffect, useRef, useState, type SetStateAction } from "react";
import { useParams } from "react-router-dom";

// interface ISearchBar {
//   setFolders: React.Dispatch<SetStateAction<IFolders[]>>;
//   setFiles: React.Dispatch<SetStateAction<IFiles[]>>;
// }
// {setFiles, setFolders}: ISearchBar

interface ISearchBarProps {
  isShared?: boolean;
  shareHash?: string;
  setSharedFolders?: React.Dispatch<SetStateAction<IFolders[]>>;
  setSharedFiles?: React.Dispatch<SetStateAction<IFiles[]>>;
}


function SearchBar({isShared, shareHash, setSharedFolders, setSharedFiles}: ISearchBarProps){
    const [title, setTitle] = useState("");
    const isFirstRender = useRef(true);
    const {setFolders, setFiles} = useContext(DriveContext)!;
    
    // const { parentId } = useParams();
    const { parentId, resourceId } = useParams();
    // shared route: /home/:hash/:resourceId
    // home route:   /home/:parentId?
    const currentFolderId = isShared ? resourceId : parentId;

    async function searchData(){
        try{
            if (isShared && shareHash && setSharedFolders && setSharedFiles) {
                if(title.length == 0){
                    // Re-fetch original shared data when search is cleared
                    const response = await api.get("/share/resource", {
                        params: {
                            hash: shareHash,
                            resourceId: currentFolderId,
                        },
                    });
                    setSharedFolders(response.data.folder);
                    setSharedFiles(response.data.file);
                    return;
                }
            
            const response = await api.get("/share/search", {
                params: {
                hash: shareHash,
                resourceId: currentFolderId,  
                title,
                },
            });

            setSharedFolders(response.data.folder);
            setSharedFiles(response.data.file);
            }else{
                if(title.length == 0){
                    // Re-fetch original data when search is cleared
                    const token = localStorage.getItem('token');
                    const response = await api.get("/file/check", {
                        params: { parentId: currentFolderId },
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setFolders(response.data.folder);
                    setFiles(response.data.file);
                    return;
                }
                console.log(title);
                console.log(parentId);
                const token = localStorage.getItem('token');
                const response = await api.get("/file/search", { // get mein body nai bhejna
                    params: {
                        parentId: currentFolderId,
                        title: title
                    }, headers: {
                        Authorization:  `Bearer ${token}` 
                    }
                });
                
                setFolders(response.data.folder);
                setFiles(response.data.file);
            }
            
        }catch(error: any){
            console.log(error);
        }
    }
    
    // need to do debouncing here
    useEffect(() => {
        // Skip the API call on initial mount — parent already fetches the data
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // setInterval or setTimeout, what should I use ? -> setTimeout obvio
        const timer = setTimeout(() => {
            searchData();
        }, 500)  // call the seachData after 1 sec

        // as soon as another data is typed in this 1 sec, useEffct will re-render and harkirat bhai
        // ne bola ki dusra useEffect call hone pehele, pehele wale ka return/cleanup function 
        // call hoga, bhai ne bola hoga toh hoga
        return () => {
            clearInterval(timer)
        }
    }, [title])
    
    return (
      <div>
        <Search className="absolute mt-4.5 text-[#6c6969] font-medium ml-7 w-4 h-4" />
        <input
          className="border-0 outline-0 placeholder-[#8C8989] pl-14 font-medium bg-[#E4EFED] rounded-4xl w-full p-3.5"
          type="text"
          placeholder="Search..."
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
    );
}

export default SearchBar;