import { getRepository } from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';

import path from 'path';
import fs from 'fs';

import Food from '../models/Food';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  id: string;
  name: string;
  description: string;
  imageFileName: string;
}

class UpdateFoodService {
  public async execute({
    id,
    name,
    description,
    imageFileName,
  }: Request): Promise<Food> {
    const foodsRepository = getRepository(Food);

    const foodExists = await foodsRepository.findOne({ id });

    if (!foodExists) {
      throw new AppError('Comida não encontrada.', 404);
    }

    foodExists.name = name;
    foodExists.description = description;

    if (foodExists.image_url) {
      const foodImageFilePath = path.join(
        uploadConfig.directory,
        foodExists.image_url
      );

      const foodImageFileExists = fs.existsSync(foodImageFilePath);

      if (foodImageFileExists) {
        fs.promises.unlink(foodImageFilePath);
      }
    }

    foodExists.image_url = imageFileName;
    foodExists.updated_at = utcToZonedTime(new Date(), 'America/Sao_Paulo');

    await foodsRepository.save(foodExists);

    return foodExists;
  }
}
export default UpdateFoodService;
