import { User } from '../models/user';
import client from "../config/db";
import bcrypt from "bcrypt";
import { ErrorResponse } from "../utils/error_response";
import path from "path";

const db = client.db("sfacademy");

export function listUsers (req, res, next) {
    const user = req.params.user;
    db.collection("users").find({username: user}).toArray((err, results) => {
        if(results.length == 0) {
            return next(new ErrorResponse("User not found", 401));
        }
        res.send(results[0]);
    });
}

export function addUser (req, res, next) {
    var { username, password } = req.body;
    db.collection("users").find({username: username}).toArray((err, users) => {
        if (users.length > 0) {
            return next(new ErrorResponse("User already exists", 401));
        } else {
            // hash password and insert into database
            bcrypt.genSalt(10, (err ,salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    password = hash;
                    const user = new User(username, password);
                    db.collection("users").insertOne(user);
                    res.send({added_user: user});
                });
            });
        }
    });
}

export async function login (req, res, next) {
    var { username, password } = req.body;
    if (!username || !password) {
        return next(new ErrorResponse("Please provide both username and password.", 401));
    }
    try {
        const user = await db.collection("users").findOne({username});
        if (!user) {
            return next(new ErrorResponse("User not found", 401));
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return next(new ErrorResponse("Username and password do not match", 401));
        } else {
            res.status(200).send({message: "Authenticated"});
        }
    } catch (err) {
        console.log(err);
    }
}

export function home (req, res, next) {
    res.sendFile(path.join(__dirname, "../templates/index.html"));
}