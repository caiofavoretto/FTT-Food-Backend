import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateRatingService from '../services/CreateRatingService';

import Rating from '../models/Rating';

const ratingRouter = Router();

ratingRouter.get('/', async (request, response) => {
  const ratingRepository = getRepository(Rating);

  const ratings = await ratingRepository.find();

  return response.json(ratings);
});

ratingRouter.post('/', async (request, response) => {
  const { grade, meal_id } = request.body;
  const user_id = request.user.id;

  const createRatingService = new CreateRatingService();

  const rating = await createRatingService.execute({ user_id, meal_id, grade });

  response.json(rating);
});

export default ratingRouter;
