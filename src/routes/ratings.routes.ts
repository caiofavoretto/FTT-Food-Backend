import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateRatingService from '../services/CreateRatingService';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';
import EnsureEmployeeAuthenticated from '../middleware/ensureEmployeeAuthenticated';

import Rating from '../models/Rating';

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
  const { grade, meal_id } = request.body;
  const user_id = request.user.id;

  const createRatingService = new CreateRatingService();

  const rating = await createRatingService.execute({ user_id, meal_id, grade });

  response.json(rating);
});

export default ratingRouter;
