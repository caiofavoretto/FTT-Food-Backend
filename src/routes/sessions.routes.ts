import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { registry, password } = request.body;

  const authenticateUserService = new AuthenticateUserService();

  const { user, token } = await authenticateUserService.execute({
    registry,
    password,
  });

  delete user.password_hash;

  if (user.avatar_url) {
    user.avatar_url = `http://localhost:3333/files/${user.avatar_url}`;
  }

  return response.json({ user, token });
});

export default sessionsRouter;
