import {z} from "zod";

//Schema to check if user want to accept message or not

export const acceptMessagesSchema = z.object({
    acceptMessages: z.boolean() 
})