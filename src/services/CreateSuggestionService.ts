import { getRepository, Between } from 'typeorm';
import { startOfDay, endOfDay, isWeekend } from 'date-fns';

import AppError from '../errors/AppError';
import Suggestion from '../models/Suggestion';
import Food from '../models/Food';
import parseDateTimeZone from '../utils/parseDateTimeZone';

interface Request {
  user_id: string;
  food_id: string;
}

class CreateSuggestionService {
  public async execute({ user_id, food_id }: Request): Promise<Suggestion> {
    const FoodRepository = getRepository(Food);

    const FoodExist = await FoodRepository.findOne(food_id);

    if (!FoodExist) {
      throw new AppError('Comida não encontrada.');
    }

    const suggestionRepository = getRepository(Suggestion);

    const parsedDate = parseDateTimeZone(new Date());

    const suggestionExist = await suggestionRepository.findOne({
      where: {
        user_id,
        created_at: Between(startOfDay(parsedDate), endOfDay(parsedDate)),
      },
    });

    if (suggestionExist) {
      throw new AppError('Você só pode sugerir uma comida por dia.');
    }
    if (isWeekend(parsedDate)) {
      throw new AppError('Você só pode sugerir uma comida em dias úteis.');
    }

    const suggestion = suggestionRepository.create({
      user_id,
      food_id,
    });

    await suggestionRepository.save(suggestion);

    return suggestion;
  }
}

export default CreateSuggestionService;
