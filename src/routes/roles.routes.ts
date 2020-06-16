import { Router } from 'express';
import { getRepository } from 'typeorm';
import Role from '../models/Role';

const rolesRouter = Router();

rolesRouter.get('/', async (request, response) => {
  const rolesRepository = getRepository(Role);

  const roles = await rolesRepository.find();

  return response.json(roles);
});

rolesRouter.post('/', async (request, response) => {
  const { description } = request.body;
  const rolesRepository = getRepository(Role);

  const role = rolesRepository.create({
    description,
  });

  await rolesRepository.save(role);

  return response.json(role);
});

export default rolesRouter;
