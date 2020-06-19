import { Router } from 'express';

import UserRouter from './users.routes';
import RolesRouter from './roles.routes';
import FoodsRouter from './foods.routes';
import MealsRouter from './meals.routes';
import MenusRouter from './menus.routes';
import SessionsRouter from './sessions.routes';
import AttendancesRouter from './attendances.routes';
import RatingRouter from './ratings.routes';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';

const routes = Router();

routes.use('/users', UserRouter);
routes.use('/roles', RolesRouter);

routes.use('/foods', EnsureAuthenticated, FoodsRouter);
routes.use('/meals', EnsureAuthenticated, MealsRouter);
routes.use('/menus', EnsureAuthenticated, MenusRouter);
routes.use('/attendances', EnsureAuthenticated, AttendancesRouter);
routes.use('/ratings', EnsureAuthenticated, RatingRouter);

routes.use('/sessions', SessionsRouter);

export default routes;
