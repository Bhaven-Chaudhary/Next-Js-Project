import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  dbConnect();

  const { messageId } = params;
  const session = await getServerSession();

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount == 0) {
      // if modifiedCount is not change that means nothing is changed in document
      return Response.json(
        {
          success: false,
          message: "Unable to delete messages",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Unable to get user messages",
      },
      { status: 500 }
    );
  }
}
