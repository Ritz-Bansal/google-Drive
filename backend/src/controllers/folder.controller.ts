import type { Request, Response } from "express";
import { createFolderSchema } from "../validators/folder.validator.js";
import { prisma } from "../lib/client.js";

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

    const folder = await prisma.folder.create({
      data: {
        userId: userId,
        title: title,
        parentId: parentId,
      },
    });

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
