import { getRepository, In } from 'typeorm';
import Meal from '../models/Meal';
import Food from '../models/Food';

// import AppError from '../errors/AppError';

interface Request {
  description: string;
  foods: string[];
}

class CreateMealService {
  public async execute({ description, foods }: Request): Promise<Meal> {
    const mealsRepository = getRepository(Meal);
    const foodsRepository = getRepository(Food);

    const foodEntities = await foodsRepository.find({
      where: {
        id: In(foods),
      },
    });

    const meal = mealsRepository.create({
      description,
    });

    meal.foods = foodEntities;

    await mealsRepository.save(meal);

    return meal;
  }
}

export default CreateMealService;
