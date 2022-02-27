import express from "express";
import connectDB from "./config/db";

const PORT = process.env.PORT || 8080;
const app = express();

connectDB();

app.get("/", (req, res) => {
    res.send({message: "Success"});
});

app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
});