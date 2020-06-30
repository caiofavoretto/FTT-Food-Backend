import { getRepository, In } from 'typeorm';
import { isUuid } from 'uuidv4';

import Meal from '../models/Meal';
import Food from '../models/Food';
import AppError from '../errors/AppError';

// import AppError from '../errors/AppError';

interface Request {
  description: string;
  foods: string[];
  imageFileName: string;
}

class CreateMealService {
  public async execute({
    description,
    foods,
    imageFileName,
  }: Request): Promise<Meal> {
    const mealsRepository = getRepository(Meal);

    if (!foods.length) {
      throw new AppError('Informe ao menos uma comida.');
    }

    foods.forEach(food => {
      if (!isUuid(food)) {
        throw new AppError('Uma das comidas informadas não é válida.');
      }
    });

    const foodsRepository = getRepository(Food);

    const foodEntities = await foodsRepository.find({
      where: {
        id: In(foods),
      },
    });

    const meal = mealsRepository.create({
      description,
      image_url: imageFileName,
    });

    meal.foods = foodEntities;

    await mealsRepository.save(meal);

    return meal;
  }
}

export default CreateMealService;
