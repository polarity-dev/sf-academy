import { Router } from "express";

const defaultRoute = Router();

defaultRoute.get("/", (req, res) => {
  res.send("Default api response");
});

export default defaultRoute;
