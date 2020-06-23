import { getRepository, In } from 'typeorm';
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

    const mealExists = await mealsRepository.findOne({ id });

    if (!mealExists) {
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

    mealExists.description = description;
    mealExists.foods = foodEntities;

    if (mealExists.image_url) {
      const mealImageFilePath = path.join(
        uploadConfig.directory,
        mealExists.image_url
      );

      const mealImageFileExists = fs.existsSync(mealImageFilePath);

      if (mealImageFileExists) {
        fs.promises.unlink(mealImageFilePath);
      }
    }

    mealExists.image_url = imageFileName;

    await mealsRepository.save(mealExists);

    return mealExists;
  }
}

export default UpdateMealService;
