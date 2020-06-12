import { Router } from 'express';
import multer from 'multer';
import uploadconfig from '../config/upload';
import UpdateFoodService from '../services/UpdateFoodService';
import { getRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import Food from '../models/Food';
import AppError from '../errors/AppError';

const foodsRouter = Router();
const upload = multer(uploadconfig);

foodsRouter.post('/',upload.single('image'), async (request, response) => {
  const { name, description } = request.body;

  const foodsRepository = getRepository(Food);

  const food = foodsRepository.create({
    name,
    description,
    image_url: request.file.filename,
  });

  await foodsRepository.save(food);

  return response.json(food);
});

foodsRouter.get('/', async (request, response) => {
  const foodsRepository = getRepository(Food);

  const foods = await foodsRepository.find();

  return response.json(foods);
});

foodsRouter.patch('/:id', async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) throw new AppError('Id invalido');

  const { name, description } = request.body;

  const updateFoodService = new UpdateFoodService();

  const food = updateFoodService.execute({
    id,
    name,
    description,
    imageFileName: request.file.filename
  });

  return response.json(food);
});

foodsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) throw new AppError('Id invalido');

  const foodsRepository = getRepository(Food);
  const foodExists = await foodsRepository.findOne({ id });

  if (!foodExists) throw new AppError('Comida não existente', 404);

  await foodsRepository.remove(foodExists);

  return response.send();
});

export default foodsRouter;
