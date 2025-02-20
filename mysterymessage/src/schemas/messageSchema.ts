import {z} from "zod";

//Schema for message entered by user

export const messageSchema = z.object({
    content: z
    .string()
    .min(6, {message:"Message must be minimum 6 characters long"})
    .max(300, {message:"Message must not be longer than 300 characters"})
})