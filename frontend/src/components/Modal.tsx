import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SetStateAction } from "react";
import FolderForm from "./FolderForm";
import UploadForm from "./UploadForm";
import CreateNewFolder from "./CreateNewFolder";
import Upload from "./Upload";


// interface IDialog {
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<SetStateAction<boolean>>;
// }
// {isOpen, setIsOpen}: IDialog

// interface IDialog {
  // title: string;
//   onSubmit: () => void;
  // isOpen: boolean;
  // setIsOpen: React.Dispatch<SetStateAction<boolean>>;
//   modalType: "createFolder" | "uploadFile" | null;
// }

interface IModal {
  modalType: "createFolder" | "uploadFile" | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  title: string;
  type: string;
}
// {title, onSubmit, isOpen, setIsOpen, modalType}
export function Modal({ modalType, isOpen, setIsOpen, title, type }: IModal) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild onClick={() => setIsOpen(true)}>
          <Button variant="outline">{type}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
            {modalType === "createFolder" && <CreateNewFolder setIsOpen={setIsOpen} />}
            {modalType === "uploadFile" && <Upload setIsOpen={setIsOpen}/>}
        </DialogContent>
      </form>
    </Dialog>
  );
}
