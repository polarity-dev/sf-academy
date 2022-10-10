import express from 'express';
import data from './data';
import defaultRoute from './default';
import importFile from './import';
import pending from './pending';

const routes = express.Router();

routes.use(defaultRoute);
routes.use(importFile);
routes.use(pending);
routes.use(data);

export default routes;