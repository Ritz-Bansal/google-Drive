import api from "@/lib/api";
import { linkSchema } from "@/validators/share.validator";

export async function createLink(type: string, id: string){
    try{
        const parsed = linkSchema.safeParse({
          resourceType: type,
          resourceId: id
        });

        if(!parsed.success){
            alert("Wrong inputs");
            return;
        }

        const response = await api.post("/share/link", {
            resourceType: type,
            resourceId: id
        }, {headers: {
            Authorization: "Bearer " + localStorage.getItem('token')
        }});

        const hash = response.data.link;
        return hash;
        
    }catch(error){
        alert(error);
        console.log(error);
    }
}