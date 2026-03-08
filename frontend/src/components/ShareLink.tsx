import { useState } from "react";
import Button from "./Button";
import api from "@/lib/api";
import { getLinkSchema, linkSchema } from "@/validators/share.validator";

interface IShareLink{
    type: "folder" | "file";
    id  : string;
}

function ShareLink({type, id}: IShareLink){
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [link, setLink] = useState<string | null>(null);

     async function createLink(){//type: string, id: string) {        
        try {
        setIsDisable(true);
        const parsed = linkSchema.safeParse({
          resourceType: type,
          resourceId: id,
        });

        if (!parsed.success) {
          alert("Wrong inputs");
          return;
        }

        const response = await api.post(
          "/share/link",
          {
            resourceType: type,
            resourceId: id,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          },
        );

        const hash = response.data.link;
        const link = `https://google-drive-mu-lemon.vercel.app//home/${hash}/${id}`;
        setLink(link);
        setIsDisable(false);
      } catch (error) { 
            alert(error);
            console.log(error);
            setIsDisable(false);
      }
    }

    async function fetchLink(){
        try {
        setIsDisable(true);
        console.log(id)
        const parsed = getLinkSchema.safeParse({resourceId: id});

        console.log(parsed.error);
        console.log(parsed.success);
        if (!parsed.success) {
        //   alert("Wrong inputs");
          return;
        }

        console.log(parsed.data);

        const response = await api.get("/share/link", {
          params: {
            resourceId: id,
          },headers: {
            Authorization: "Bearer " + localStorage.getItem('token')
          }
        });
        const hash = response.data.link;
        const link = `https://google-drive-mu-lemon.vercel.app//home/${hash}/${id}`;
        console.log(link);
        setLink(link);
        setIsDisable(false);
        

        } catch (error) { 
            alert(error);
            console.log(error);
            setIsDisable(false);
      }
    }

    return (
        <div>
        {link ? <div className="truncate max-w-[300] h-10 pl-4 text-[#6c6969] text-lg">{link}</div> : 
        <div className="h-10 "></div>}
        <div className="flex gap-2 justify-end w-full">
            <Button name="Create" onClick={createLink} isDialog={true} isDisable={isDisable} />
            <Button name="Fetch" onClick={fetchLink} isDialog={true} isDisable={isDisable} />
        </div>
        </div>
    )
}

export default ShareLink;