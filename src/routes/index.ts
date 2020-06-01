import { Router } from 'express';
import FoodsRouter from './foods.routes';

import UserRouter from './users.routes';

const routes = Router();

routes.use('/users', UserRouter);
routes.use('/foods', FoodsRouter);

export default routes;
