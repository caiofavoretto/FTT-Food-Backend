import { Router } from 'express';
import { getRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import Food from '../models/Food';
import AppError from '../errors/AppError';

const foodsRouter = Router();

foodsRouter.post('/', async (request, response) => {
  const { name, description } = request.body;

  console.log(name);
  console.log(description);

  const foodsRepository = getRepository(Food);

  const food = foodsRepository.create({
    name,
    description,
  });

  await foodsRepository.save(food);

  return response.json(food);
});

foodsRouter.get('/', async (request, response) => {
  const foodsRepository = getRepository(Food);

  const foods = await foodsRepository.find();

  return response.json(foods);
});

foodsRouter.patch('/:id', async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) throw new AppError('Id invalido');

  const foodsRepository = getRepository(Food);
  const foodExists = await foodsRepository.findOne({ id });

  if (!foodExists) throw new AppError('Comida não existente', 404);

  const { name, description } = request.body;

  foodExists.name = name;
  foodExists.description = description;

  await foodsRepository.save(foodExists);

  return response.json(foodExists);
});

foodsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) throw new AppError('Id invalido');

  const foodsRepository = getRepository(Food);
  const foodExists = await foodsRepository.findOne({ id });

  if (!foodExists) throw new AppError('Comida não existente', 404);

  await foodsRepository.remove(foodExists);

  return response.status(204).send();
});

export default foodsRouter;
