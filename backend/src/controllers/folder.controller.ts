import type { Request, Response } from "express";
import {
  createFolderInRootSchema,
  createFolderSchema,
} from "../validators/folder.validator.js";
import { prisma } from "../lib/client.js";

interface IParams {
  parentId: string;
}

export async function createFolderController(
  req: Request<IParams>,
  res: Response,
) {
  //no need to hit the db and check anything, direct insert is fine I think, think more on this
  try {
    const parentId = req.params.parentId; // parentId never undefined as if undefined we can never hit this route, thanks to express routing
    const parsed = createFolderSchema.safeParse({title: req.body.title, parentId: parentId});
    if (!parsed.success) {
      return res.status(400).json({
        message:
          "Incorect inputs, Title required and parent folder Id required",
      });
    }

    const userId = req.userId!;
    const { title } = parsed.data;

    const isValid = await prisma.folder.findFirst({
      where: {
        id: parentId
      }
    });

    if(!isValid){
      return res.status(404).json({
        message: "The parent folder does not exist, create in root instead"
      })
    }

    const folder = await prisma.folder.create({
      data: {
        userId: userId,
        title: title,
        parentId: parentId,
      },
    });

    return res.status(201).json({
      folderId: folder.id,
      title: folder.title,
      parentId: folder.parentId,
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function createRootFolderController(
  req: Request,
  res: Response,
) {
  try {
    const parsed = createFolderInRootSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Incorect inputs, Title required",
      });
    }

    const userId = req.userId!;
    const { title } = parsed.data;

    const folder = await prisma.folder.create({
      data: {
        userId: userId,
        title: title,
        parentId: null
      },
    });

    return res.status(201).json({
      folderId: folder.id,
      title: folder.title,
      parentId: "root",
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// testing how req.params work 
// export async function createFolderController(req: Request, res: Response) {
//     const parentId = req.params.parentId;
//     console.log(parentId);
// }
