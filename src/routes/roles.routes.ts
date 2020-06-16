import { Router } from 'express';
import { getRepository } from 'typeorm';
import Role from '../models/Role';

const rolesRouter = Router();

rolesRouter.get('/', async (request, response) => {
  const rolesRepository = getRepository(Role);

  const roles = await rolesRepository.find();

  return response.json(roles);
});

export default rolesRouter;
