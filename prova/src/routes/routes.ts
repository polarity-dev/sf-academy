import * as express from "express";
const router = express.Router();

import { listUsers, addUser, login, home } from "../controllers/api";

router.route("/listUsers").get(listUsers);
router.route("/addUser").post(addUser);
router.route("/login").post(login);
router.route("/").get(home);

export default router;