import {z} from "zod";

//Schema for sign In
//identifier can be anything of your choice, it can be email or usr name.

export const signInSchema = z.object({
    identifier: z.string(),
    password: z.string()
})