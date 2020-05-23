import { Router } from 'express';

import UserRouter from './users.routes';

const routes = Router();

routes.use('/users', UserRouter);

export default routes;
