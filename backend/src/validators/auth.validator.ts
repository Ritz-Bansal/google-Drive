import zod from "zod";

export const signupSchema = zod.object({
    email: zod.email(),
    gender: zod.enum(["male", "female", "other"]),
    username: zod.string(),
    password: zod.string(),
    // profilePicture: zod.url() || null
});

export const signinSchema = zod.object({
    email: zod.email(),
    password: zod.string()
});

