import { Router } from 'express';
import { getRepository } from 'typeorm';
import Gender from '../models/Gender';

const gendersRouter = Router();

gendersRouter.get('/', async (request, response) => {
  const gendersRepository = getRepository(Gender);

  const genders = await gendersRepository.find();

  return response.json(genders);
});

export default gendersRouter;
