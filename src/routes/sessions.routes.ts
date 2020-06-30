import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { registry, password } = request.body;

  const authenticateUserService = new AuthenticateUserService();

  const { user, token } = await authenticateUserService.execute({
    registry,
    password,
    type: 'mobile',
  });

  delete user.password_hash;

  if (user.avatar_url) {
    user.avatar_url = `${process.env.APPLICATION_URL}/files/${user.avatar_url}`;
  }

  return response.json({ user, token });
});

sessionsRouter.post('/backoffice', async (request, response) => {
  const { registry, password } = request.body;

  const authenticateUserService = new AuthenticateUserService();

  const { user, token } = await authenticateUserService.execute({
    registry,
    password,
    type: 'backoffice',
  });

  delete user.password_hash;

  if (user.avatar_url) {
    user.avatar_url = `${process.env.APPLICATION_URL}/files/${user.avatar_url}`;
  }

  return response.json({ user, token });
});

export default sessionsRouter;
