import { getRepository } from 'typeorm';
import Meal from '../models/Meal';

import AppError from '../errors/AppError';

interface Request {
  id: string;
  description: string;
  date: Date;
}

class UpdateMealService {
  public async execute({ id, description, date }: Request): Promise<Meal> {
    const mealsRepository = getRepository(Meal);
    const mealExists = await mealsRepository.findOne({ id });

    if (!mealExists) {
      throw new AppError('Refeição não encontrada.', 404);
    }

    mealExists.description = description;
    mealExists.date = date;

    await mealsRepository.save(mealExists);

    return mealExists;
  }
}

export default UpdateMealService;
