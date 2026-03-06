import type { Request, Response } from "express";
import { prisma } from "../lib/client.js";

export async function profileController(req: Request, res: Response){
    try {
        const userId = req.userId!; //userId only exists if the token is valid varna error thorw kardega
        const userData = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })

        return res.status(200).json({
            username: userData?.username
        })
    } catch {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
}