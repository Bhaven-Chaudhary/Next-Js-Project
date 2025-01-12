import {z} from "zod";

// creating user name schema using zod to validate user name 
export const userNameValidation = z
    .string()
    .min(2,'User name should be at least 2 character')
    .max(20,'User name should be max 20 character')
    .regex(/^[a-bA-B0-9]+$/, "User name should not contain special character")


// Creating typescript schema using zod to validate sign up details
export const singUpSchema = z.object({
    userName: userNameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6,{message: "Password must be minimum 6 characters"})
})