import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import mongoose from "mongoose";

//api route  to get user messages
export async function GET(request:Request) {
    dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success:false,
            message: "Not Authenticated"
        },{status: 401});
    }

    //Converting userId back to mongoose id format from string format
    //Id was converted to string in options.ts, aggregation requires id in mongooseId format
    const userId = new mongoose.Types.ObjectId(user._id);

    try {

        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
          ]).exec();
      
          if (!user || user.length === 0) {
            return Response.json(
              { message: 'User not found', success: false },
              { status: 404 }
            );
          }
      
          return Response.json(
            { messages: user[0].messages },
            {
              status: 200,
            }
          );

        
    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message: "Unable to get user messages"
        },{status: 500});
    }
}