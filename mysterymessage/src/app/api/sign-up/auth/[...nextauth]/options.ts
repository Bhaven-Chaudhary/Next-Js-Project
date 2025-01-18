import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
    providers:[CredentialsProvider({
        id: 'credentials',
        name: 'Credentials',
        credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
          },
        async authorize(credentials): Promise<any> {
            // Callback to execute once user is to be authorized
            //Writing our logic to authorize user here
            
            //connect to database to fetch user to check if user exits for login
            await dbConnect();
            try {
                const user = await UserModel.findOne({
                    $or: [
                        { email: credentials?.email },
                        { username: credentials?.email },
                       
                      ],
                })

                //If user is not preset 
                if (!user) {
                    throw new Error('No user found with this email');
                }

                //If user is present, check if it is verified
                if(!user.isVerified){
                    throw new Error("Please verify your account before logging in")
                }
                //Check if password is matching
                const isPasswordCorrect = await bcrypt.compare(user.password, credentials.password);

                if(isPasswordCorrect){

                    return user;
                }else{
                    throw new Error("Incorrect Password")

                }

                
            } catch (err: any) {
                throw new Error(err);
            }

        },
    })]
}


