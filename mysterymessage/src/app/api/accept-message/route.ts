import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import {  User } from "next-auth";
import UserModel from "@/model/User";


//api route to change message acceptance status of  user
export async function POST(request: Request){
    dbConnect();

    //getting current session using next auth
    const session  = await getServerSession(authOptions);
    const user: User  = session?.user as User;

    if(!session || !session?.user){
        //return is user is not logged in
        return Response.json({
            success:false,
            message: "User not logged In"
        },{status: 401});
    }

    const userId = user._id;
    const {acceptingMessage} = await request.json();

    try {
        //Fetching user form database and updating at the same time using Id
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptingMessage },
            {new:true}
        )

        if(!updatedUser){
            //If user not found
            return Response.json({
                success:false,
                message: "Unable to update user acceptance message status"
            },{status: 401});
        }

        return Response.json({
            success:true,
            message: "User acceptance status updated successfully",
            user: updatedUser
        },{status: 200});




    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message: "Update user message acceptance status failed"
        },{status: 500});
    }


}

//api route to get isAccepting message status
export async function GET(request:Request) {
    dbConnect();

    //getting current session using next auth
    const session  = await getServerSession(authOptions);
    const user: User  = session?.user as User;

    if(!session || !session?.user){
        //return is user is not logged in
        return Response.json({
            success:false,
            message: "Not Authenticated"
        },{status: 401});
    }

    const userId = user._id;

    try {

        const foundUser = await UserModel.findById(userId);

        if(!foundUser){
            return Response.json({
                success:false,
                message: "User not found"
            },{status: 404});   
        }

        return Response.json({
            success:true,
            isAcceptingMessage : foundUser.isAcceptingMessage
        },{status: 200});
        
    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message: "Unable to fetch user message acceptance status"
        },{status: 500});
    }

}