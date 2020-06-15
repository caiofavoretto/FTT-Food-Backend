import { Router } from 'express';

import UserRouter from './users.routes';
import FoodsRouter from './foods.routes';
import MealsRouter from './meals.routes';
import SessionsRouter from './sessions.routes';

const routes = Router();

routes.use('/users', UserRouter);
routes.use('/foods', FoodsRouter);
routes.use('/meals', MealsRouter);
routes.use('/sessions', SessionsRouter);

export default routes;
