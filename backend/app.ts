import express, { Application } from 'express';
const app: Application = express();
const port = 3000;

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

