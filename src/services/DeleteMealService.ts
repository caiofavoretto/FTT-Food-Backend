import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import Meal from '../models/Meal';
import uploadConfig from '../config/upload';

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

    await mealsRepository.remove(mealExists);

    return mealExists;
  }
}

export default DeleteMealService;
