import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

const userRouter = Router();

userRouter.post('/', async (request, response) => {
  const { name, last_name, email, role_id, registry, password } = request.body;

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({
    name,
    last_name,
    email,
    role_id,
    registry,
    password,
  });

  delete user.password_hash;

  return response.json(user);
});

export default userRouter;
