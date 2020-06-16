import { Router } from 'express';

import UserRouter from './users.routes';
import FoodsRouter from './foods.routes';
import MealsRouter from './meals.routes';
import MenusRouter from './menus.routes';
import SessionsRouter from './sessions.routes';
import AttendancesRouter from './attendances.routes';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';

const routes = Router();

routes.use('/users', UserRouter);
routes.use('/foods', EnsureAuthenticated, FoodsRouter);
routes.use('/meals', EnsureAuthenticated, MealsRouter);
routes.use('/menus', EnsureAuthenticated, MenusRouter);

routes.use('/sessions', SessionsRouter);
routes.use('/attendances', EnsureAuthenticated, AttendancesRouter);

export default routes;
