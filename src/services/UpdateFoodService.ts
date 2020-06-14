import {getRepository} from 'typeorm';
import path from 'path';
import Food from '../models/Food';
import fs from 'fs';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';


interface Request {
    id: string;
    name: string;
    description: string;
    imageFileName: string;  
}

class UpdateFoodService {
  public async execute({id, name, description, imageFileName}: Request): Promise<Food>{
    const foodsRepository = getRepository(Food);
    //todo verificar usuário logado 

    const foodExists = await foodsRepository.findOne({ id });

    if (!foodExists) throw new AppError('Comida não existente', 404);

    foodExists.name = name;
    foodExists.description = description;

    if(foodExists.image_url)
    {
      const foodImageFilePath = path.join(uploadConfig.directory, foodExists.image_url);
      const foodImageFileExists = await fs.promises.stat(foodImageFilePath);
      if(foodImageFileExists)
      {
        fs.promises.unlink(foodImageFilePath);
      }
    }

    foodExists.image_url = imageFileName;

    await foodsRepository.save(foodExists);

    return foodExists;
  }
 
}
export default UpdateFoodService;