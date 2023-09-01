import mongoose from "mongoose"

let isConnected = false;

export const connectToDb = async () => {
  mongoose.set("strictQuery", true)

  if (!process.env.MONGODB_URL)
    return console.log("MongoDB URL missing ");
  
  if (isConnected)
    return console.log("MongoDB connection already established");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true; 
    return console.log("MongoDB connected");
    
  } catch (error) {
    console.log(error);
  }
}