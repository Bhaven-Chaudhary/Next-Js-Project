//API to verify code
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
// import {z} from "zod"
// import { userNameValidation } from "@/schemas/signUpSchema";
// import { verifySchema } from "@/schemas/verifySchema";

// const codeVerificationQuerySchema = z.object({
//     username: userNameValidation,
//     code: verifySchema
// })

export async function POST(request: Request) {


    await dbConnect();
    
    try {

        const {username, code }= await request.json();

        // zod verification 
        // const result = codeVerificationQuerySchema.safeParse({
        //     username, code
        // })

        // if(!result.success){
            
        //     return Response.json({
        //         success: false,
        //         message: "Please enter valid code and username"
        //     },{status: 400})
        // }

        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json({
                success:false,
                message: "User not found"
            },{status: 400});
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            //If code is valid and code is not expired, verify user
            user.isVerified = true;
            user.save()
            return Response.json({
                success:true,
                message: "User verified successfully"
            },{status: 200});
        }else if(!isCodeNotExpired){
            //If code is expired
            return Response.json({
                success:false,
                message: "Verification code is expired, please sign up again "
            },{status: 400});
        }else{
            //Code not valid
            return Response.json({
                success:false,
                message: "Verification code not valid"
            },{status: 400});
        }
       
    } catch (error) {
        console.log("Error verifying user", error)
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            {status: 500}
        )
    }
}