import {z} from "zod"
import { userNameValidation } from "@/schemas/signUpSchema"
import UserModel from "@/model/User"
import dbConnect from "@/lib/dbConnection"

// creating zod validation schema to validate username as value of object  
const UserNameQuerySchema = z.object({
    username: userNameValidation
})


//api to handle user name validation, for this request we will receive username as query param in url
export async function GET(request:Request){
    dbConnect()

    try {
        //searchParams is an URLSearchParams object which can be used to access the individual query parameters
        const {searchParams} = new URL(request.url);

        /*get required query param(i.e username) from all available query params, 
        object format is created to match schema created for validation using zod on line 6*/
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate using zod (safeParse do not throw error on validation fail)
        const result  = UserNameQuerySchema.safeParse(queryParam)

        if(!result.success){
            const userNameError = result.error.format().username?._errors || 'Invalid query parameter';
            return Response.json({
                success: false,
                message: userNameError || "Invalid query parameter"
            },{status: 400})
        }

        const {username} = result.data

        //if username is valid, check is username is already taken
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
        
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "username already taken"
            },{status: 400})
        }

        return Response.json({
            success: true,
            message: "username is available"
        },{status: 200})
        
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Unable to validate user name"
        },
        {
            status: 500
        }
    )
    }

}