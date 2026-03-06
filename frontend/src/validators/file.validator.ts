import zod from "zod";

export const uploadParentFileSchema = zod.object({
  title: zod.string(),
  parentId: zod.uuid(),
  fileUrl: zod.url(),
  // type: zod.enum(["video", "image", "pdf"]),
});

export const uploadRootFileSchema = zod.object({
  title: zod.string(),
  fileUrl: zod.url(),
  type: zod.enum(["video", "image", "pdf"]),
});

// export const presignedurlSchema = zod.object({
//   type: zod.enum(["video", "image", "pdf"]),
// });

export const fetchFileSchema = zod.object({
  fileId: zod.string(),
});
