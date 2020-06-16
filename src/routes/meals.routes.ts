import { Router } from 'express';
import { getRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import Meal from '../models/Meal';
import AppError from '../errors/AppError';
import UpdateMealService from '../services/UpdateMealService';
import CreateMealService from '../services/CreateMealService';
import DeleteMealService from '../services/DeleteMealService';

const mealsRouter = Router();

mealsRouter.post('/', async (request, response) => {
  const { description, date, foods } = request.body;

  const createMealService = new CreateMealService();

  const meal = await createMealService.execute({
    description,
    date,
    foods,
  });

  return response.json(meal);
});

mealsRouter.get('/', async (request, response) => {
  const mealsRepository = getRepository(Meal);

  const meals = await mealsRepository.find();

  return response.json(meals);
});

mealsRouter.patch('/:id', async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    throw new AppError('Id inválido.');
  }

  const { description, date } = request.body;

  const updateMealService = new UpdateMealService();

  const meal = await updateMealService.execute({
    id,
    description,
    date,
  });

  return response.json(meal);
});

mealsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    throw new AppError('Id inválido.');
  }

  const deleteMealService = new DeleteMealService();

  await deleteMealService.execute({
    id,
  });

  return response.status(204).send();
});

export default mealsRouter;
