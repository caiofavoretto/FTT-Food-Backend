import { getRepository } from 'typeorm';
import Meal from '../models/Meal';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteMealService {
  public async execute({ id }: Request): Promise<Meal> {
    const mealsRepository = getRepository(Meal);
    const mealExists = await mealsRepository.findOne({ id });

    if (!mealExists) {
      throw new AppError('Refeição não encontrada.', 404);
    }

    await mealsRepository.remove(mealExists);

    return mealExists;
  }
}

export default DeleteMealService;
