import api from "@/lib/api";
import { DriveContext } from "@/store/DriveContext";
import type { IFiles, IFolders } from "@/types/interfaces";
import { Search } from "lucide-react";
import { useContext, useEffect, useState, type SetStateAction } from "react";
import { useParams } from "react-router-dom";

// interface ISearchBar {
//   setFolders: React.Dispatch<SetStateAction<IFolders[]>>;
//   setFiles: React.Dispatch<SetStateAction<IFiles[]>>;
// }
// {setFiles, setFolders}: ISearchBar
function SearchBar(){
    const [title, setTitle] = useState("");
    const {setFolders, setFiles} = useContext(DriveContext)!;
    
    const { parentId } = useParams();
    async function searchData(){
        try{
            console.log(title);
            console.log(parentId);
            const token = localStorage.getItem('token');
            const response = await api.get("/file/search", { // get mein body nai bhejna
                params: {
                    parentId: parentId,
                    title: title
                }, headers: {
                    Authorization:  `Bearer ${token}` 
                }
            });
            
            setFolders(response.data.folder);
            setFiles(response.data.file);
            
        }catch(error: any){
            console.log(error);
        }
    }
    
    // need to do debouncing here
    useEffect(() => {
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
        <Search className="absolute mt-4 text-[#6c6969] font-medium ml-7 w-4 h-4" />
        <input
          className="border-0 outline-0 placeholder-[#8C8989] pl-14 font-medium bg-[#E4EFED] rounded-4xl w-full p-3.5"
          type="text"
          placeholder="Seach..."
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
    );
}

export default SearchBar;