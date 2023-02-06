import * as path from 'path';
import * as express from 'express';

import * as routes from './routes';
import * as database from './database';
import * as daemon from "./daemon";


const app = express();

//back end, api
database.default.connect().then((con) => {
    daemon.start(con, 10 * 1000);
});
app.use(routes.default);

//front end, react router
app.use(express.static('public'));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on port: ${port}`));
