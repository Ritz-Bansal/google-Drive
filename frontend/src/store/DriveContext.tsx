// https://medium.com/@nazmifeeroz/how-to-use-react-usecontext-and-usestate-hooks-as-a-global-store-1b4f1898034f
import type { IFiles, IFolders } from "@/types/interfaces";
import { useState, createContext, type ReactNode, type SetStateAction } from "react";

interface IDataProvider {
    children: React.ReactNode;
}

interface ICreateContext {
  files: IFiles[];
  setFiles: React.Dispatch<SetStateAction<IFiles[]>>;
  folders: IFolders[];
  setFolders: React.Dispatch<SetStateAction<IFolders[]>>;
  totalSize: number;
  setTotalSize: React.Dispatch<SetStateAction<number>>;
}

export const DriveContext = createContext<ICreateContext | null>(null);




export function DriveProvider({children}: IDataProvider){
  const [folders, setFolders] = useState<IFolders[]>([]);
  const [files, setFiles] = useState<IFiles[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);

    return (
        <DriveContext.Provider value={{
            files,
            folders,
            setFolders,
            setFiles,
            totalSize,
            setTotalSize,
        }}>
            {children}
        </DriveContext.Provider>
    )
}