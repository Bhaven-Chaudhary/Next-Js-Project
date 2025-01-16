import mongoose from "mongoose";

// Creating type for connection object to add type safety for connection response received from database
type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {

    // check if connection already present 
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }

    //Setting up connection to database
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
         connection.isConnected = db.connections[0].readyState; 
        
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Connecting to database failed", error)
        process.exit(1)
    }
}

export default dbConnect;