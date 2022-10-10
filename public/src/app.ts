import express from "express";
import routes from "./routes";

import 'dotenv/config';

const app = express();
const port = process.env.PORT;

app.use("/", routes);
app.use("/importDataFromFile", routes);
app.use("/pendingData", routes);
app.use("/data", routes);

app.listen(port, () => {
  return console.log(`Public is listening at http://localhost:${port}`);
});
