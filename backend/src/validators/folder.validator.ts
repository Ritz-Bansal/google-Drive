import zod from "zod";

export const createFolderSchema = zod.object({
    parentId: zod.string().nullable(),
    title: zod.string(),
})