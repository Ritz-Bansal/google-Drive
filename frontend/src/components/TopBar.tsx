import SearchBar from "./SearchBar";
import logo from "../assets/logo.png";
import { AvatarSkeleton } from "./AvatarSkeleton.";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import type { IFiles, IFolders } from "@/types/interfaces";
import { Menu } from "lucide-react";

interface ITopBar {
  isShared?: boolean;
  shareHash?: string;
  setSharedFolders?: React.Dispatch<React.SetStateAction<IFolders[]>>;
  setSharedFiles?: React.Dispatch<React.SetStateAction<IFiles[]>>;
  onMenuToggle?: () => void;
}

function TopBar({ isShared, shareHash, setSharedFiles, setSharedFolders, onMenuToggle }: ITopBar) {
  const [profileIsLoading, setProfileIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [initial, setInitial] = useState<string>("");
  const navigate = useNavigate();

  if (!isShared) {
    async function fetchProfile() {
      try {
        const response = await api.get("/user/profile", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (response.status == 200) {
          const data: string = response.data.username;
          const name = data.toUpperCase();
          setUsername(name);
          setInitial(name[0]!);
        }
        setProfileIsLoading(false);
      } catch (error) {
        console.log(error);
        setProfileIsLoading(false);
      }
    }

    useEffect(() => {
      fetchProfile();
    }, []);
  }

  function navigateFunction(route: string) {
    navigate(`${route}`);
  }

  return (
    <div className="flex items-center py-4 px-4 md:px-6 md:pt-10 md:pb-6 gap-2">
      {/* Hamburger — mobile only */}
      {!isShared && onMenuToggle && (
        <button
          className="md:hidden flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} className="text-[#3BAD9E]" />
        </button>
      )}

      {/* Logo */}
      <div className="flex-shrink-0">
        <img src={logo} alt="Logo" className="w-[100px] md:w-[140px]" />
      </div>

      {/* Search bar — left-aligned with My Drive content on desktop */}
      <div className="w-full md:w-[60%] mx-2 md:ml-35 md:mr-4">
        <SearchBar
          isShared={isShared}
          shareHash={shareHash}
          setSharedFolders={setSharedFolders}
          setSharedFiles={setSharedFiles}
        />
      </div>

      {/* Right side: auth buttons or avatar */}
      <div className="ml-auto flex-shrink-0 flex items-center gap-2 md:gap-3 md:pr-8">
        {isShared ? (
          <div className="flex gap-2">
            <button
              className="bg-[#3BAD9E] rounded-lg px-3 py-1.5 text-white text-sm md:text-base md:min-w-20"
              onClick={() => navigateFunction("/signup")}
            >
              Sign Up
            </button>
            <button
              className="bg-[#3BAD9E] rounded-lg px-3 py-1.5 text-white text-sm md:text-base md:min-w-20"
              onClick={() => navigateFunction("/signin")}
            >
              Sign In
            </button>
          </div>
        ) : (
            <div className="flex gap-4 justify-end ">
              {profileIsLoading ? (
                <AvatarSkeleton />
              ) : (
                <>
                  <h1 className="hidden sm:block text-base md:text-xl text-[#8C8989] font-bold truncate max-w-[120px]">
                    {username}
                  </h1>
                  <button className="rounded-full text-sm md:text-lg text-white font-semibold bg-[#3BAD9E] h-8 w-8 flex-shrink-0 flex items-center justify-center">
                    {initial}
                  </button>
                </>
              )}
            </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
