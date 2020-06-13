import { Router } from 'express';

import UserRouter from './users.routes';
import FoodsRouter from './foods.routes';
import SessionsRouter from './sessions.routes';
import AttendancesRouter from './attendances.routes';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const routes = Router();

routes.use('/users', UserRouter);
routes.use('/foods', FoodsRouter);
routes.use('/sessions', SessionsRouter);
routes.use('/attendances', ensureAuthenticated, AttendancesRouter);

export default routes;
