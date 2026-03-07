import zod from "zod";

export const linkSchema = zod.object({
  resourceType: zod.enum(["folder", "file"]),
  resourceId: zod.string(),
});

export const getLinkSchema = zod.object({
  resourceId: zod.string(),
});

export const fetchResourceSchema = zod.object({
  hash: zod.string(),
  resourceId: zod.string(),
});