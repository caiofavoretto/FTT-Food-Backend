import { getRepository, In } from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';

import path from 'path';
import fs from 'fs';

import Meal from '../models/Meal';
import Food from '../models/Food';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  id: string;
  description: string;
  foods: Food[];
  imageFileName: string;
}

class UpdateMealService {
  public async execute({
    id,
    description,
    foods,
    imageFileName,
  }: Request): Promise<Meal> {
    const mealsRepository = getRepository(Meal);

    const meal = await mealsRepository.findOne({ id });

    if (!meal) {
      throw new AppError('Refeição não encontrada.', 404);
    }

    if (!foods.length) {
      throw new AppError('Informe ao menos uma comida.');
    }

    const foodsRepository = getRepository(Food);

    const foodEntities = await foodsRepository.find({
      where: {
        id: In(foods),
      },
    });

    meal.description = description;
    meal.foods = foodEntities;
    meal.updated_at = utcToZonedTime(new Date(), 'America/Sao_Paulo');

    if (meal.image_url) {
      const mealImageFilePath = path.join(
        uploadConfig.directory,
        meal.image_url
      );

      const mealImageFileExists = fs.existsSync(mealImageFilePath);

      if (mealImageFileExists) {
        fs.promises.unlink(mealImageFilePath);
      }
    }

    meal.image_url = imageFileName;

    await mealsRepository.save(meal);

    return meal;
  }
}

export default UpdateMealService;
