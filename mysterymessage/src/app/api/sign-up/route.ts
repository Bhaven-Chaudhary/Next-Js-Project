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

        //checking is user name is already used, if value is true usr with it name already exists. That user already exit with this username
        const existingUserVerifiedByUserName = await UserModel.findOne({username, isVerified: true})

        if (existingUserVerifiedByUserName) {
            return Response.json({
                success: false,
                message: "Username already in use"
            },
            {
                status: 400
            })
        }

        //Checking that user is already present with this email address
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            //If user is present by email

            //Checking if present user is verified
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Verified user is already present with this email"
                }, {status: 400})
            }else {
                //If user exist but not verified, saving user with updated password and opt(i.e verify code)
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }

        }else{

            //Here user does not exit, creating new user and saving to database

            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            //setting expiry time for otp (i.e verification code ) to one hours
            expiryDate.setHours(expiryDate.getHours() + 1);

            // creating new user document using UserModel

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })

            // saving user to database
            await newUser.save();

        }

        //sending verification email
        const  emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        //If sending email is success
        return Response.json({
            success: true,
            message: "User registered successfully, please verify your email"
        }, {status: 200})
        
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