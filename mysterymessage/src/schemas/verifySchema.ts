import {z} from "zod";

//Schema to validate verification code
export const verifySchema = z.object({
    code: z.string().min(6, "Verification code must be minimum 6 characters")
})