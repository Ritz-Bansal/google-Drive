import type { Request, Response } from "express";
import { createFolderSchema } from "../validators/folder.validator.js";
import { prisma } from "../lib/client.js";

interface IIsValid  {
    parentId:   string | null;
    title:      string;
    id:         string;
    numberId:   number;
    userId:     string;
    path:       string;
}

export async function createRootFolderController(req: Request, res: Response) {
  try {
    console.log("insdide backend route");
    console.log("Inside the folder controller");

    let { parentId, title } = req.body;
    if (parentId == undefined) {
      parentId = null;
    }
    const parsed = createFolderSchema.safeParse({ parentId, title });

    if (!parsed.success) {
      return res.status(400).json({
        message: "Incorect inputs, Title required",
      });
    }

    const userId = req.userId!;
    let isValid: IIsValid | null = null;
    if(parentId != null){
      isValid = await prisma.folder.findUnique({
        where: {
          id: parentId
        }
      })
  
      if(!isValid){
        return res.status(400).json({
          message: "Incorrect parent Id"
        });
      }
      
    }

    // using transactions as I want ki ya toh dono hoye ya toh koi na ho
    const folder = await prisma.$transaction(async (tx)=> {
      const folder = await tx.folder.create({
        data: {
          userId: userId,
          title: title,
          parentId: parentId,
          path: "temp"
        },
      });
  
      let path: string;
      if(parentId == null){
        path = `/${folder.numberId}`
      }else{
        path = `${isValid?.path}/${folder.numberId}/`
      }
  
      await tx.folder.update({
        where:  {
          id: folder.id
        },data: {
          path: path
        }
      });
    
      return folder;
    })

    console.log("Before response");
    return res.status(201).json({
      id: folder.id,
      title: folder.title,
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
