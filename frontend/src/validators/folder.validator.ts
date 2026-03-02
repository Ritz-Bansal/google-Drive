import zod from "zod";

export const createFolderSchema = zod.object({
  title: zod.string(),
  parentId: zod.uuid(),
});

export const createFolderInRootSchema = zod.object({
  title: zod.string(),
});
