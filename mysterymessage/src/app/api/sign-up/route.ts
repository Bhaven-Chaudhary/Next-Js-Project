//Writing api for sign up

import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnection";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

//Function name is post as we have to give type of api method as a function name, here name implies what type of request we want to send to backend
//For this api we are sending post request, path will be: api/sign-up

export async function POST(request: Request){

    await dbConnect();

    try {

        const {username, email, password} = await request.json()
        
    } catch (error) {
        console.log("Error registering user", error)
        return  Response.json({
            success: false,
            message: "Error registering user"
        },
        {
            status: 500
        });
    }

}