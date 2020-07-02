import { Router } from 'express';

import { getRepository } from 'typeorm';

import CreateRatingService from '../services/CreateRatingService';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';
import EnsureEmployeeAuthenticated from '../middleware/ensureEmployeeAuthenticated';

import Rating from '../models/Rating';
import Meal from '../models/Meal';
import serializeMeal from '../utils/serializeMeal';
import AppError from '../errors/AppError';
import parseDateTimeZone from '../utils/parseDateTimeZone';

const ratingRouter = Router();

ratingRouter.get(
  '/',
  EnsureEmployeeAuthenticated,
  async (request, response) => {
    const ratingRepository = getRepository(Rating);

    const ratings = await ratingRepository.find();

    return response.json(ratings);
  }
);

ratingRouter.post('/', EnsureAuthenticated, async (request, response) => {
  const { grade, meal_id, menu_id, date } = request.body;
  const user_id = request.user.id;

  const createRatingService = new CreateRatingService();

  await createRatingService.execute({
    user_id,
    meal_id,
    grade,
    menu_id,
    date: parseDateTimeZone(date),
  });

  const mealsRepository = getRepository(Meal);

  const meal = await mealsRepository.findOne(meal_id);

  if (!meal) {
    throw new AppError('Refeição não encontrada.');
  }

  const serializedMeal = await serializeMeal({
    date: parseDateTimeZone(date),
    meal,
    menu_id,
    user_id,
  });

  response.json(serializedMeal);
});

export default ratingRouter;
