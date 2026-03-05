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
//   title: string;
//   onSubmit: () => void;
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<SetStateAction<boolean>>;
//   modalType: "createFolder" | "uploadFile" | null;
// }

interface IModal {
  modalType: "createFolder" | "uploadFile" | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  title: string;
}
// {title, onSubmit, isOpen, setIsOpen, modalType}
export function Modal({ modalType, isOpen, setIsOpen, title }: IModal) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <form>
        <DialogContent className="sm:max-w-sm rounded-3xl sm:min-h-48 bg-[#E4EFED] border-0">
          <DialogHeader>
            <DialogTitle className="font-semibold text-2xl pl-4 text-[#3BAD9E]">{title}</DialogTitle>
          </DialogHeader>
            {modalType === "createFolder" && <CreateNewFolder setIsOpen={setIsOpen} />}
            {modalType === "uploadFile" && <Upload setIsOpen={setIsOpen}/>}
        </DialogContent>
      </form>
    </Dialog>
  );
}


// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export function Modal({ modalType, isOpen, setIsOpen, title }: IModal) {
//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <form>
//         <DialogContent className="data-[state=open]:!zoom-in-0 data-[state=open]:duration-600 sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle></DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4">
//             <div className="grid gap-3">
//               <Label htmlFor="name-1">Name</Label>
//               <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
//             </div>
//             <div className="grid gap-3">
//               <Label htmlFor="username-1">Username</Label>
//               <Input id="username-1" name="username" defaultValue="@peduarte" />
//             </div>
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button type="submit">Save changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </form>
//     </Dialog>
//   );
// };

// export default DialogZoomInDemo;

