import * as mongoDB from "mongodb";

const connectDB = async () => {
    const URI="mongodb://root:rootpassword@mongodb:27017";
    const client=new mongoDB.MongoClient(URI);
    await client.connect();
    console.log("MONGO DB CONNECTED");
}

export default connectDB;