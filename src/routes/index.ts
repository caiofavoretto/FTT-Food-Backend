import { Router } from 'express';

import UserRouter from './users.routes';
import RolesRouter from './roles.routes';
import GendersRouter from './genders.routes';
import FoodsRouter from './foods.routes';
import MealsRouter from './meals.routes';
import MenusRouter from './menus.routes';
import SessionsRouter from './sessions.routes';
import AttendancesRouter from './attendances.routes';
import RatingRouter from './ratings.routes';
import ProfileRouter from './profile.routes';
import SuggestionRouter from './suggestions.routes';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';
import EnsureEmployeeAuthenticated from '../middleware/ensureEmployeeAuthenticated';

const routes = Router();

routes.use('/users', UserRouter);
routes.use('/profiles', EnsureAuthenticated, ProfileRouter);
routes.use('/roles', EnsureEmployeeAuthenticated, RolesRouter);
routes.use('/genders', EnsureEmployeeAuthenticated, GendersRouter);
routes.use('/attendances', EnsureAuthenticated, AttendancesRouter);

routes.use('/ratings', EnsureAuthenticated, RatingRouter);
routes.use('/suggestions', SuggestionRouter);

routes.use('/foods', FoodsRouter);
routes.use('/meals', EnsureEmployeeAuthenticated, MealsRouter);
routes.use('/menus', MenusRouter);

routes.use('/sessions', SessionsRouter);

export default routes;
