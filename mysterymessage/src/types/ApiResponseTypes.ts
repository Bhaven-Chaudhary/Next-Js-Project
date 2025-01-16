// File to store types for api response 
import { Message } from "@/model/User";

export interface ApiResponse{
success: boolean;
message: string;
isAccepting?: boolean;
messages?: Array<Message>
}