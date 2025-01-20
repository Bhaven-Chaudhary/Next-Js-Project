import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";
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
                const isPasswordCorrect = await bcrypt.compare( credentials.password,user.password);

                if(isPasswordCorrect){

                    return user;
                }else{
                    throw new Error("Incorrect Password")

                }

            } catch (err: any) {
                throw new Error(err);
            }

        },
    })],
    callbacks:{
        async jwt({ token, user }) {

            if(user){
                
                // Adding user data in token to make it available where token is present 
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {

            // Adding user data in session to make it available where session is present 
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username
            }
            return session
        },
        
    },
    pages:{
        signIn: "/sign-in"
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

}
