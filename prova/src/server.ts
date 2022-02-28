import express from "express";
import client from "./config/db";
import router from "./routes/routes";

// App configuration
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Connect to mongodb database
export const db = client.db("sfacademy");
console.log("MONGO DB CONNECTED");

// Define routes
app.use("/", router);

app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
});