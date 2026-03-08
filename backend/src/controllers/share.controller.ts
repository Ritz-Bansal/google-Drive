import type { Request, Response } from "express";
import {
  fetchResourceSchema,
  getLinkSchema,
  linkSchema,
  sharedSearchSchema,
} from "../validators/share.validator.js";
import crypto from "crypto";
import { prisma } from "../lib/client.js";

export async function createLinkController(req: Request, res: Response) {
  try {
    const parsed = linkSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "resource id and resource type is required",
      });
    }

    const { resourceType, resourceId } = parsed.data;

    // checking if the solder or fiel exists or not, then create the hash
    if (resourceType == "file") {
      const file = await prisma.file.findUnique({ where: { id: resourceId } });
      if (!file) {
        return res.status(400).json({
          message: "File does not exist, kyu karte ho bhai aisa",
        });
      }
    } else {
      const folder = await prisma.folder.findUnique({
        where: { id: resourceId },
      });
      if (!folder) {
        return res.status(400).json({
          message: "Folder does not exist, kyu karte ho bhai aisa",
        });
      }
    }

    const hashExists = await prisma.sharableLink.findFirst({
      where: { resourceId: resourceId },
    });

    if (hashExists) {
      return res.status(400).json({
        message: "Link already exists",
      });
    }

    // bcrypt is computaionally slow, designed specifically for passwords
    // using nodejs inbuilt crypto library
    const hash = crypto.randomBytes(32).toString("hex");

    const link = await prisma.sharableLink.create({
      data: {
        type: resourceType,
        resourceId: resourceId,
        hash: hash,
      },
    });

    return res.status(201).json({
      link: link.hash,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error " + error,
    });
  }
}

export async function getLinkController(req: Request, res: Response) {
  try {
    const parsed = getLinkSchema.safeParse({
      resourceId: req.query.resourceId
    });

    console.log(parsed.error);
    console.log(parsed.success);
    console.log(req.query.resourceId);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Incorrect inputs",
      });
    }

    const { resourceId } = parsed.data;
    const link = await prisma.sharableLink.findFirst({
      where: { resourceId: resourceId },
    });

    if (!link) {
      return res.status(400).json({
        message: "Hash does not exist, create it",
      });
    }

    return res.status(200).json({
      link: link.hash,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error " + error,
    });
  }
}

export async function fetchResourceController(req: Request, res: Response) {
  try {
    const parsed = fetchResourceSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        message: "resource id and resource type is required",
      });
    }

    const { hash, resourceId } = parsed.data;

    const link = await prisma.sharableLink.findUnique({
      where: { hash: hash },
    });

    if (!link) {
      return res.status(400).json({
        message: "No such shared Link exist",
      });
    }

    if (link.type == "file") {
      // agar resoruce type is file, early return, kya child kya parent, sab maa chudaye
      const file = await prisma.file.findUnique({
        where: { id: link.resourceId },
      });

      if (!file) {
        return res.status(200).json({
          message: "The file was deleted",
        });
      }

      return res.status(200).json({
        id:       file.id,
        fileUrl:  file.url,
      });
    }

    // link.type == folder
    const folder = await prisma.folder.findUnique({
      where: { id: link.resourceId },
    });

    if (!folder) {
      return res.status(200).json({
        message: "The folder was deleted",
      });
    }

    // ek na ek toh exist karega hi varna link generate nahi hoti

    // talk
    // 1. dekh bhai, sab kuch hatado, hash se parent pe jao, aur parent ke sare children give to FE and it will render the accessed link accordingly

    // 2. only return the resource with the given resourceId, then FE will make a call and get everything (/check route),
    // isme bas ek chiz yeh hai ki agar woh resource exist hi nahi karta hua toh data jayega hi nai,
    // 1st mein data hamesha jayega, latency problems, but what if only file is shared, then toh I should
    // not fetch all the folders and file

    // i think kuch sign vagera karke bhej deta hu kyuki fetch wala ab I have to make public
    // i can check the sign hamesha

    // for folder
    const isValidFolders = await prisma.folder.findFirst({
      where: {
        id: resourceId,
        path: {
          startsWith: folder?.path!,
        },
      },
    });

    const isValidFile = await prisma.file.findFirst({
      where: {
        id: resourceId,
        path: {
          startsWith: folder.path
        }
      }
    })

    if(isValidFile){
      return res.status(200).json({
        id: isValidFile.id,
        fileUrl: isValidFile.url,
      });
    }

    // no need to check if !isValidFile as returned early
    if (!isValidFolders) {
      return res.status(404).json({
        message: "Resource does not exist",
      });
    }

    //fetch all the immediate child folders and file of it
    // sare ke liye toh I will use the path of it
    const allFolders = await prisma.folder.findMany({
      where: {
        parentId: isValidFolders.id
      }
    });

    const allFiles = await prisma.file.findMany({
      where: {
        parentId: isValidFolders.id
      }
    });

  return res.status(200).json({
    folder: allFolders.map((data) => ({
        id: data.id,
        title: data.title,
      })),

    file: allFiles.map((data) => ({
        id: data.id,
        title: data.title,
        type: data.type,
        size: data.size,
      })),
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error " + error,
    });
  }
}


export async function searchSharedController(req: Request, res: Response) {
  try {
    console.log("Inside the route");
    const parsed = sharedSearchSchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid inputs" });
    }

    const { hash, resourceId, title } = parsed.data;

    const link = await prisma.sharableLink.findUnique({ 
      where: { hash } 
    });

    if (!link) {
      return res.status(400).json({ 
        message: "No such shared Link exist" 
      });
    }

    // sirf folder type mein search hoga for folder and files
    if (link.type !== "folder") {
      return res.status(400).json({ 
        message: "Search is only allowed on folder links" 
      });
    }

    const rootFolder = await prisma.folder.findUnique({
      where: { id: link.resourceId },
    });

    if (!rootFolder) {
      return res.status(200).json({ message: "The folder was deleted" });
    }

    const isValidFolder = await prisma.folder.findFirst({
      where: {
        id: resourceId,
        path: { 
          startsWith: rootFolder.path 
        },
      },
    });

    if (!isValidFolder) {
      return res.status(404).json({ 
        message: "Resource does not exist" 
      });
    }

    // search karo
    const allFolders = await prisma.folder.findMany({
      where: {
        parentId: isValidFolder.id,
        title: { contains: title, mode: "insensitive" },
      },
    });
 
    const allFiles = await prisma.file.findMany({
      where: {
        parentId: isValidFolder.id,
        title: { contains: title, mode: "insensitive" },
      },
    });
 
    return res.status(200).json({
      folder: allFolders.map((data) => ({
        id: data.id,
        title: data.title,
      })),
      file: allFiles.map((data) => ({
        id: data.id,
        title: data.title,
        type: data.type,
        size: data.size,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error " + error });
  }
}


/*
flow

hash, resourceId
hash -> validate hash -> get the asset -> file(early return) -> folder(return the folder and the child of it) -> 
                          id                returns the file url            
                          parentId           



3rd nesting folder access returned 0

*/

