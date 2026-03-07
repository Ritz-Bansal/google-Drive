import type { Request, Response } from "express";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";
import {
  fetchFileSchema,
  // presignedurlSchema,
  uploadParentFileSchema,
  uploadRootFileSchema,
} from "../validators/file.validator.js";
import { typeAndContentType } from "../services/typeAndContentType.js";
import { prisma } from "../lib/client.js";
import z from "zod";
import { presignedurlSchema } from "../validators/folder.validator.js";

const R2_URL = process.env.R2_URL!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_ACCESS_SECRET = process.env.R2_ACCESS_SECRET!;
const PUB_URL = process.env.PUB_URL!;

const S3 = new S3Client({
  region: "auto", // Required by SDK but not used by R2
  endpoint: R2_URL,
  // Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_ACCESS_SECRET,
  },
});

interface IParams {
  parentId: string;
}

export async function getPresignedUrlController(req: Request, res: Response) {
  // we do not get the file here, only the type of the file, and the size of it --> Presigned URLs exists so that files are not uploaded to backend
  // to save server cost
  try {
    console.log("Inside the presigned url");
    const { type, size } = req.body;
    
    const { success } = presignedurlSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        message: "Incorrect inputs, file type and file size is required",
      });
    }


    const { extension, contentType } = typeAndContentType(type);
    
    if(contentType == null){
      return res.status(400).json({
        message: "Upload either a video, image or pdf only"
      })
    }

    const userId = req.userId!;
    const totalSize = await prisma.file.aggregate({
      _sum: { size: true },
      where: {
        userId: userId
      }
    })

    const maxSize: number = 1024*1024*1024; // 1 GB
    if(totalSize._sum.size + size > maxSize){
      return res.status(402).json({
        message: "Upgrade to premium to get more storage"
      })
    }

    const pathName = "googleDrive/rithvik/" + Math.random() + `.${extension}`; // put the extension here, is it even needed ?

    const putUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: "youtube-100xdevs",
        Key: pathName,
        ContentType: contentType,
        ContentLength: size, //bytes -- optional hai bhai
        IfNoneMatch: "*",
        // always needed, kyuki if the different files are uploaded in the same location then the latest file will be used -- dikkat
        // this ensures ki file ek baar hi jaaye iss presigned url pe as it checks does the object in this bucket at this key exists or not, if not karle upload
        // if yes, return error status code  -- 412 Precondition Failed
      }),
      { expiresIn: 3600, signableHeaders: new Set(["if-none-match"]) }, // expires in 1 Hour
    );

    // I will return the presigned Url and the location where the asset will be finally stored, so that in the create route,
    //  i can get it and than put this in the DB URL
    console.log("Reponding from the presigned url")
    return res.status(200).json({
      presignedUrl: putUrl,
      finalUrl: `${PUB_URL}/` + pathName,
      contentType: contentType,
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// export async function createParentFileController(
//   req: Request<IParams>,
//   res: Response,
// ) {
//   try {
//     const parentId = req.params.parentId;
//     const { title, fileUrl, type } = req.body;
//     const { success } = uploadParentFileSchema.safeParse({
//       title: title,
//       parentId: parentId,
//       fileUrl: fileUrl,
//       // type: type,
//     });



//     if (!success) {
//       return res.status(400).json({
//         message: "Incorrect Inputs",
//       });
//     }

//     const userId = req.userId!;
//     const uploadedFile = await prisma.file.create({
//       data: {
//         title: title,
//         url: fileUrl,
//         parentId: parentId,
//         type: type,
//         userId: userId,
//       },
//     });

//     return res.status(201).json({
//       fileId: uploadedFile.id,
//       fileUrl: uploadedFile.url,
//       title: uploadedFile.title,
//       parentId: uploadedFile.parentId,
//     });
//   } catch {
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// }

interface IIsValid {
  parentId: string | null;
  title: string;
  id: string;
  numberId: number;
  userId: string;
  path: string;
}

export async function createRootFileController(req: Request, res: Response) {
  try {
    // I think no need to check file size wala here, as agar S3 mein hi nahi dala toh yaha 
    // pe daal bhi diya toh kya karlega, kuch nahi kar payega
    // 1 thing jo they can do is use their S3 and upload in my DB, but no one will do that as
    // if I delete the table, they will be fucked, so it's fine not to check here
    console.log("Inside the upload file");
    let { parentId } = req.body;
    const { title, fileUrl, type, size } = req.body;
    if(parentId == undefined){
      parentId = null;
    }
    const { success, error } = uploadRootFileSchema.safeParse({
      title: title,
      fileUrl: fileUrl,
      parentId: parentId,
      size: size,
      // type: type,
    });

    console.log(error);
    console.log(success);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Inputs",
      });
    }
    const { contentType } = typeAndContentType(type);

    if (contentType == null) {
      return res.status(400).json({
        message: "Upload image, video or pdf only",
      });
    }

    console.log(title);
    console.log(contentType)
    
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


    const uploadedFile = await prisma.$transaction(async (tx) => {
      const uploadedFile = await prisma.file.create({
        data: {
          title: title,
          url: fileUrl,
          parentId: parentId,
          type: type,
          userId: userId,
          size: size,
          path: "temp"
        },
      });

      let path: string;
      if (parentId == null) {
        path = `/${uploadedFile.numberId}`;
      } else {
        path = `${isValid?.path}/${uploadedFile.numberId}/`;
      }

      await prisma.file.update({
        where: {
          id: uploadedFile.id
        },
        data: {
          path: path
        }
      })

      return uploadedFile;
    })
    

    console.log("Responding from the upload file");
    return res.status(201).json({
      id: uploadedFile.id,
      // fileUrl: uploadedFile.url,
      title: uploadedFile.title,
      // parentId: uploadedFile.parentId,
      type: uploadedFile.type,
      size: size
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error " + error,
    });
  }
}

// sending the Public URL's initially but I think presigned URLs shoud be sent
export async function fetchFileController(req: Request, res: Response) {
  try {
    const fileId = req.params.fileId;
    const { success } = fetchFileSchema.safeParse({ fileId: fileId });

    if (!success) {
      return res.status(400).json({
        message: "File id should be string",
      });
    }

    const userId = req.userId;
    const file = await prisma.file.findFirst({
      // id is PK therefore only one file exits with this id, therefore findFirst always better
      where: {
        id: fileId as string, //as if not string error thrown,
        userId: userId!, // aise toh no need for it as fileId is enough as PK hai, but no harm, sounds more right
      },
    });

    if (!file) {
      return res.status(404).json({
        message: "No such file found",
      });
    }

    return res.status(200).json({
      message: {
        // fileId: file.id,
        fileUrl: file.url,
        // fileTitle: file.title
      },
    });
  } catch(error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// move this code to desirable place

const xyz = z.object({
  parentId: z.string().optional(),
});

interface IQuery {
  parentId: string | undefined | null;
  title: string;
}

// no need
// interface IData {
//     const data: ({
//     file: {
//         id: string;
//         title: string;
//         type: FileType;
//         url: string;
//         parentId: string | null;
//         userId: string;
//     }[];
// } & {
//     id: string;
//     title: string;
//     parentId: string | null;
//     userId: string;
// })[]

// }

export async function getFolderAndFilesController(
  req: Request<{}, {}, {}, IQuery>,
  res: Response,
) {
  console.log("Inside the fetch froute");
  try {
    let parentId = req.query.parentId;

    const { success } = xyz.safeParse({ parentId: parentId });
    // console.log("SUccess ", success);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect inputs",
      });
    }

    const userId = req.userId!;
    // root always exists, no need for else
    if (typeof parentId == "string") {
      const isExisting = await prisma.folder.findFirst({
        where: {
          parentId: parentId,
          userId: userId,
        },
      });

      if (!isExisting) {
        return res.status(411).json({
          message: "The given folder does not exist",
        });
      }
    } else {
      parentId = null;
    }

    // let data = [];
    // if (typeof parentId == "string") {
    const folderData = await prisma.folder.findMany({
      where: {
        parentId: parentId,
        userId: userId, // needs userId varna if parentId null then dikkat
      },
    });

    const fileData = await prisma.file.findMany({
      where: {
        parentId: parentId,
        userId: userId, // needs userId varna if parentId null then dikkat
      },
    });

    // console.log(JSON.stringify(folderData));
    // console.log(JSON.stringify(fileData));

    // let folderId = [];
    // let folderTitle = [];
    // let fileTitle = [];
    // let fileType = [];
    // let fileUrl = [];
    // let fileId = []; // just for testing

    // for(let i=0; i<data.length; i++){
    //   folderId.push(data[i]?.id);
    //   folderTitle.push(data[i]?.title);
    //   fileTitle.push(data[i]?.file.map(data => data.title));
    //   fileType.push(data[i]?.file.map(data => data.type));
    //   fileUrl.push(data[i]?.file.map(data => data.url));
    //   fileId.push(data[i]?.file.map(data => data.id));

    // }

    // console.log("response");
    // console.log(folderData);
    // console.log(fileData)
    return res.status(200).json({
      // folder: {
      //   id: folderData.map((data) => data.id),
      //   title: folderData.map((data) => data.title),
      // },
      // file: {
      //   title: fileData.map((data) => data.title),
      //   type: fileData.map((data) => data.type),
      //   // url: fileData.map(data => data.url), // only needed when the file is clicked
      //   id: fileData.map((data) => data.id), // I need to send this as after clicking on this file, I need to fetch the file's public url to render it
      // },
      folder: folderData.map(data => ({
        id: data.id,
        title: data.title
      })),
      file: fileData.map((data) => ({
        id: data.id,
        title: data.title,
        type: data.type,
        size: data.size
      }))
    });
    // this code can be removed
    // } else {
    //   //  parentId is undefined
    //   const data = await prisma.folder.findMany({
    //     where: {
    //       parentId: null,
    //     },
    //     include: {
    //       file: true,
    //     },
    //   });

    //   let folderId = [];
    //   let folderTitle = [];
    //   let fileTitle = [];
    //   let fileType = [];
    //   let fileUrl = [];

    //   for(let i=0; i<data.length; i++){
    //     folderId.push(data[i]?.id);
    //     folderTitle.push(data[i]?.title);
    //     fileTitle.push(data[i]?.file.map(data => data.title));
    //     fileType.push(data[i]?.file.map(data => data.type));
    //     fileUrl.push(data[i]?.file.map(data => data.url));
    //   }

    //   return res.status(200).json({
    //     data: {
    //       folder: {
    //         id: folderId,
    //         title: folderTitle
    //     },
    //     file: {
    //       title: fileTitle,
    //       type: fileType,
    //       url: fileUrl,
    //     }
    //   }});
    // }
  } catch {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

const searchSchema = z.object({
  parentId: z.string().optional(),
  title: z.string(),
});

//  this will be moved as search query dono folder aur file pe lagegi
export async function searchFileController(
  req: Request<{}, {}, {}, IQuery>,
  res: Response,
) {
  console.log("Inside the seach controller");
  try {
    let parentId = req.query.parentId;
    const title = req.query.title;
    console.log(title); 

    const { success, error } = searchSchema.safeParse({
      parentId: parentId,
      title: title,
    });

    // console.log(success);
    // console.log(error);
    // console.log(title);
    // console.log(parentId);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect inputs",
      });
    }

    const userId = req.userId!;
    if (typeof parentId == "string") {
      const isExisting = await prisma.folder.findFirst({
        where: {
          parentId: parentId,
          userId: userId,
        },
      });

      if (!isExisting) {
        return res.status(411).json({
          message: "The given folder does not exist",
        });
      }
    } else {
      parentId = null;
    }

    // let data = [];
    // if (typeof parentId == "string") {
    const folderData = await prisma.folder.findMany({
      where: {
        parentId: parentId,
        userId: userId, // needs userId varna if parentId null then dikkat
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
    });

    const fileData = await prisma.file.findMany({
      where: {
        parentId: parentId,
        userId: userId, // needs userId varna if parentId null then dikkat
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
    });

    // let folderId = [];
    // let folderTitle = [];
    // let fileTitle = [];
    // let fileType = [];
    // let fileUrl = [];

    // for (let i = 0; i < data.length; i++) {
    //   folderId.push(data[i]?.id);
    //   folderTitle.push(data[i]?.title);
    //   fileTitle.push(data[i]?.file.map((data) => data.title));
    //   fileType.push(data[i]?.file.map((data) => data.type));
    //   fileUrl.push(data[i]?.file.map((data) => data.url));
    // }

    // console.log("Before response");
    return res.status(200).json({
      // folder: {
      //   id: folderData.map((data) => data.id),
      //   title: folderData.map((data) => data.title),
      // },
      // file: {
      //   title: fileData.map((data) => data.title),
      //   type: fileData.map((data) => data.type),
      //   // url: fileData.map((data) => data.url), // no need to send the url
      //   id: fileData.map((data) => data.id),
      // },
      folder: folderData.map((data) => ({
        id: data.id,
        title: data.title,
      })),
      file: fileData.map((data) => ({
        id: data.id,
        title: data.title,
        type: data.type,
        size: data.size
      })),
    });
  } catch {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
