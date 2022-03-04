import * as mongoDB from "mongodb";

// docker-compose up -d ---> DOCKER CONTAINER URI BELOW
const URI="mongodb://root:rootpassword@mongodb:27017";

//LOCALHOST MONGO URI
//const URI="mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const client = new mongoDB.MongoClient(URI);
client.connect();

export default client;