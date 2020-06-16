import { getRepository, In } from 'typeorm';
import Meal from '../models/Meal';

import AppError from '../errors/AppError';
import Food from '../models/Food';

interface Request {
  id: string;
  description: string;
  foods: Food[];
}

class UpdateMealService {
  public async execute({ id, description, foods }: Request): Promise<Meal> {
    const mealsRepository = getRepository(Meal);
    const mealExists = await mealsRepository.findOne({ id });

    if (!mealExists) {
      throw new AppError('Refeição não encontrada.', 404);
    }

    const foodsRepository = getRepository(Food);

    const foodEntities = await foodsRepository.find({
      where: {
        id: In(foods),
      },
    });

    mealExists.description = description;
    mealExists.foods = foodEntities;

    await mealsRepository.save(mealExists);

    return mealExists;
  }
}

export default UpdateMealService;
