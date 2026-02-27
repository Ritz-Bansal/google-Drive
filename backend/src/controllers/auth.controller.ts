import { prisma } from "../lib/client.js";
import { signinSchema, signupSchema } from "../validators/auth.validator.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT = process.env.JWT!;

export async function signupController (req: Request, res: Response) {
  try {
    
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Incorect inputs",
      });
    }

    const { email, username, gender, password } = parsed.data;
    
    //
    // 1. do not use findMany as it will increase the latency as it would have to go to all the rows, if 100k, it goes to all the 100k
    // rows, jabki hamara kaam 1 row se hi ho jayega, if we use findFirst, it is optimised, as suppose 100k rows hai, but wwe found
    // that at 10k row, therefore no need to query more rows, worst case mein it would be 100k only.

    // 2. suppose I found 10k rows with the same email, then I/O cost bohot zyada, i.e, data ko ek jagah se dusri jagah leke jaane
    // ka cost is very much, whereas in findFirst even if 10k rows with the same email exist, we will send only one data, this is
    // the biggest cost and needs to be optimised --> expensive than any other thing, waah kya socha hai
    const existing = await prisma.user.findFirst({ 
      where: {
        email: email,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "email taken",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hash,
        gender: gender,
        email: email
      },
    });

    return res.status(201).json({
      message: "Signup sucessfull",
      userId: user.id,
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function signinController(req: Request, res: Response)  {
  try {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Incorrect inputs",
      });
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist, please signup first",
      });
    }

    const isValid = bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({
        message: "Incorret password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT,
    );

    return res.status(200).json({
      message: "Signin successful",
      token: token,
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}