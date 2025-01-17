import mongoose, {Schema, Document} from "mongoose";

//The Message interface ensures type safety and autocomplete features for TypeScript
export interface Message extends Document{
    content: string,
    createdAt: Date
}

//Schema Definition: The MessageSchema defines the structure, validation, and default values for a "Message" document in MongoDB.
const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
}) 


//The User interface ensures type safety and autocomplete features for TypeScript
export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[],
}

//Schema Definition: The userSchema defines the structure, validation, and default values for a "User" document in MongoDB.
const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        trim:true,
        unique: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        trim:true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please use valid email address"]

    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode:{
        type: String,
        required: [true, "Verify code is required"],
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "Verify code expiry is required"],
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true
    },
    messages:[MessageSchema]
})

/*This line is used to ensure that the UserModel is only defined once in your application, avoiding errors caused by attempting to define a model with the same name multiple times in Mongoose.
*/
const UserModel = (mongoose.models.User  as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;