import { Router } from 'express';

import UserRouter from './users.routes';
import FoodsRouter from './foods.routes';
import MealsRouter from './meals.routes';
import SessionsRouter from './sessions.routes';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';

const routes = Router();

routes.use('/users', UserRouter);
routes.use('/foods', FoodsRouter);
routes.use('/meals', EnsureAuthenticated, MealsRouter);
routes.use('/sessions', SessionsRouter);

export default routes;
