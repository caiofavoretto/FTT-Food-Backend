import { Router } from 'express';
import multer from 'multer';
import { getRepository } from 'typeorm';

import { isUuid } from 'uuidv4';
import uploadconfig from '../config/upload';

import Food from '../models/Food';
import AppError from '../errors/AppError';

import UpdateFoodService from '../services/UpdateFoodService';
import DeleteFoodService from '../services/DeleteFoodService';

const foodsRouter = Router();
const upload = multer(uploadconfig);

foodsRouter.post('/', upload.single('image'), async (request, response) => {
  const { name, description } = request.body;

  console.log(name);
  console.log(description);

  const foodsRepository = getRepository(Food);

  const food = foodsRepository.create({
    name,
    description,
    image_url: request.file.filename,
  });

  await foodsRepository.save(food);

  food.image_url = `${process.env.APPLICATION_URL}/files/${food.image_url}`;

  return response.json(food);
});

foodsRouter.get('/', async (request, response) => {
  const foodsRepository = getRepository(Food);

  const foods = await foodsRepository.find();

  const foodsSerialized = foods.map(food => {
    return {
      id: food.id,
      name: food.name,
      description: food.description,
      image_url: `${process.env.APPLICATION_URL}/files/${food.image_url}`,
    };
  });

  return response.json(foodsSerialized);
});

foodsRouter.patch('/:id', upload.single('image'), async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    throw new AppError('Id inválido');
  }

  const { name, description } = request.body;

  const updateFoodService = new UpdateFoodService();

  const food = await updateFoodService.execute({
    id,
    name,
    description,
    imageFileName: request.file.filename,
  });

  food.image_url = `${process.env.APPLICATION_URL}/files/${food.image_url}`;

  return response.json(food);
});

foodsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    throw new AppError('Id inválido');
  }

  const deleteFoodService = new DeleteFoodService();

  deleteFoodService.execute(id);

  return response.status(204).send();
});

export default foodsRouter;
