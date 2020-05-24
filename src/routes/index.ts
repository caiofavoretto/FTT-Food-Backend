import { Router } from 'express';
import FoodsRouter from './foods.routes';

const routes = Router();

routes.use('/foods', FoodsRouter);

export default routes;
