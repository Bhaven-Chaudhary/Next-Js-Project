import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request){

    dbConnect();
    const {username, content} = await request.json();

    try {

        const user = await UserModel.findOne({username})
        
        if(!user){
            return Response.json({
                success:false,
                message: "User not found"
            },{status: 404});
        }


        //check is user is accepting messages
        if(user?.isAcceptingMessage){

            const newMessage = {content, createdAt: new Date()}
            user.messages.push(newMessage as Message)
            await user.save();
            return Response.json({
                success:true,
                message: "Message send successfully"
            },{status: 200});

        }else{
            return Response.json({
                success:false,
                message: "user is not accepting message"
            },{status: 403});
        }


        
    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message: "Unable to send message to user"
        },{status: 500});
    }
}