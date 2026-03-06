import zod from "zod";

export const createFolderSchema = zod.object({
    parentId: zod.string().nullable(),
    title: zod.string().min(3),
})

export const presignedurlSchema = zod.object({
    type: zod.string(),
    size: zod.number(),
});