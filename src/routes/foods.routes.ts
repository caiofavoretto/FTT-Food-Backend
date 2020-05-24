import { Router } from 'express';
import { getRepository } from 'typeorm';
import Food from '../models/Food';

const foodsRouter = Router();

foodsRouter.post('/', async (request, response) => {
  const { name, description } = request.body;

  const foodsRepository = getRepository(Food);

  const food = foodsRepository.create({
    name,
    description,
  });

  await foodsRepository.save(food);

  return response.json(food);
});

export default foodsRouter;
