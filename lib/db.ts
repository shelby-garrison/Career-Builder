import mongoose from "mongoose";

const globalWithMongoose = global as unknown as { mongooseConn?: typeof mongoose };

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalWithMongoose.mongooseConn && mongoose.connection.readyState === 1) {
    return globalWithMongoose.mongooseConn;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  const conn = await mongoose.connect(uri, { autoIndex: true });
  globalWithMongoose.mongooseConn = conn;
  return conn;
}
