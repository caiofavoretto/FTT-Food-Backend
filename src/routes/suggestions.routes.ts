import { Router } from 'express';
import { getRepository, Between } from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns';

import { isUuid } from 'uuidv4';

import CreateSuggestionService from '../services/CreateSuggestionService';
import EnsureEmployeeAuthenticated from '../middleware/ensureEmployeeAuthenticated';
import EnsureAuthenticated from '../middleware/ensureAuthenticated';

import Suggestion from '../models/Suggestion';
import AppError from '../errors/AppError';
import parseDateTimeZone from '../utils/parseDateTimeZone';

const suggestionRouter = Router();

suggestionRouter.get(
  '/',
  EnsureEmployeeAuthenticated,
  async (request, response) => {
    const suggestionRepository = getRepository(Suggestion);

    const suggestions = await suggestionRepository.find();

    return response.json(suggestions);
  }
);

suggestionRouter.get(
  '/users',
  EnsureAuthenticated,
  async (request, response) => {
    const user_id = request.user.id;

    const suggestionRepository = getRepository(Suggestion);

    const parsedDate = parseDateTimeZone(new Date());

    const suggestion = await suggestionRepository.findOne({
      where: {
        user_id,
        created_at: Between(startOfDay(parsedDate), endOfDay(parsedDate)),
      },
    });

    return response.json(suggestion);
  }
);

suggestionRouter.post('/', EnsureAuthenticated, async (request, response) => {
  const { food_id } = request.body;
  const user_id = request.user.id;

  if (!isUuid(food_id)) {
    throw new AppError('Comida não encontrada.');
  }

  const createSuggestion = new CreateSuggestionService();

  const suggestion = await createSuggestion.execute({ user_id, food_id });

  return response.json(suggestion);
});

export default suggestionRouter;
