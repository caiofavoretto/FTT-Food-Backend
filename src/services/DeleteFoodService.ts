import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import Food from '../models/Food';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

class DeleteFoodService {
  public async execute(id: string): Promise<void> {
    const foodsRepository = getRepository(Food);

    const foodExists = await foodsRepository.findOne({ id });

    if (!foodExists) {
      throw new AppError('Comida não encontrada.', 404);
    }

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

    await foodsRepository.remove(foodExists);
  }
}
export default DeleteFoodService;
