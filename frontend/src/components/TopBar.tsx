import SearchBar from "./SearchBar";
import logo from "../assets/logo.png"
import { AvatarSkeleton } from "./AvatarSkeleton.";
import { useEffect, useState } from "react";
import api from "@/lib/api";

function TopBar(){
  // Hardcoded for now, need to create a route to fetch the user details, I only have userID
    // const user = "Rithvik";
    // const profileIsLoading = true;
    // const profile = user.toUpperCase();
    // const initial = profile[0];
    const [profileIsLoading, setProfileIsLoading] = useState<boolean>(true);
    const [username, setUsername] = useState<string>("");
    const [initial, setInitial] = useState<string>("");

    async function fetchProfile(){
      try{
        // await new Promise(()=> {});
        const response = await api.get("/user/profile", {
          headers: {
            Authorization: 'Bearer '+ localStorage.getItem('token')
          }
        });
        if(response.status == 200){
          const data: string = response.data.username;
          const name =  data.toUpperCase();
          setUsername(name);
          setInitial(name[0]!);
        }

        setProfileIsLoading(false);
      }catch(error){
        console.log(error);
        setProfileIsLoading(false);
      }
    }

    useEffect(()=> {
      fetchProfile();
    }, []);
//
    return (
      <div className="flex items-center pt-12 pb-8">
        {/* basis-1/5 */}
        <div className=" text-center basis-1/7 pl-6">
          <img src={logo} alt="" width={150} />
        </div>
        {/* basis-2/5" */}
        <div className="basis-5/6 pl-35">
          <SearchBar />
        </div>
        <div className="flex py-3 basis-2/6 justify-end items-center pr-20 max-h-3">
          {profileIsLoading? <AvatarSkeleton/> : <><h1 className="text-xl text-[#8C8989] font-bold">{username}</h1>
          <button className="rounded-full ml-2.5 text-lg text-white font-semibold bg-[#3BAD9E] h-7.5 w-7.5">
            {initial}
          </button></>}
        </div>
      </div>
    );
}

export default TopBar;