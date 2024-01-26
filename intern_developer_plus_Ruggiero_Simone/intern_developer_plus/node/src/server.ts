import express, { Express } from 'express';
const app: Express = express();
const port: number = 3001;
import fileRouter from './routes/file.route';
import cors from 'cors';
import ejs from 'ejs';
import * as fs from 'fs';

// Impostazione del motore di rendering
app.set('view engine', 'ejs');

app.use(cors());

app.use(express.static('public'));

app.use('/file', fileRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
