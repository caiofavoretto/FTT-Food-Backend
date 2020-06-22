import { Router } from 'express';
import multer from 'multer';
import { getRepository, Raw } from 'typeorm';

import { isUuid } from 'uuidv4';
import uploadconfig from '../config/upload';

import Food from '../models/Food';
import AppError from '../errors/AppError';

import UpdateFoodService from '../services/UpdateFoodService';
import DeleteFoodService from '../services/DeleteFoodService';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';
import EnsureEmployeeAuthenticated from '../middleware/ensureEmployeeAuthenticated';

const foodsRouter = Router();
const upload = multer(uploadconfig);

foodsRouter.post(
  '/',
  EnsureEmployeeAuthenticated,
  upload.single('image'),
  async (request, response) => {
    const { name, description } = request.body;

    const imageFileName = request.file?.filename;

    const foodsRepository = getRepository(Food);

    const food = foodsRepository.create({
      name,
      description,
      image_url: imageFileName,
    });

    await foodsRepository.save(food);

    if (food.image_url) {
      food.image_url = `${process.env.APPLICATION_URL}/files/${food.image_url}`;
    }

    return response.json(food);
  }
);

foodsRouter.get('/', EnsureAuthenticated, async (request, response) => {
  const foodsRepository = getRepository(Food);
  const { name } = request.query;

  let foods: Food[];

  if (name) {
    foods = await foodsRepository.find({
      where: {
        name: Raw(alias => `${alias} ILIKE '%${name}%'`),
      },
      order: {
        name: 'ASC',
      },
    });
  } else {
    foods = await foodsRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  const serializedFoods = foods.map(food => {
    const serialidezFood = food;

    if (serialidezFood.image_url) {
      serialidezFood.image_url = `${process.env.APPLICATION_URL}/files/${serialidezFood.image_url}`;
    } else {
      delete serialidezFood.image_url;
    }

    return serialidezFood;
  });

  return response.json(serializedFoods);
});

foodsRouter.patch(
  '/:id',
  EnsureEmployeeAuthenticated,
  upload.single('image'),
  async (request, response) => {
    const { id } = request.params;

    if (!isUuid(id)) {
      throw new AppError('Id inválido');
    }

    const { name, description } = request.body;

    const imageFileName = request.file?.filename;

    const updateFoodService = new UpdateFoodService();

    const food = await updateFoodService.execute({
      id,
      name,
      description,
      imageFileName,
    });

    if (food.image_url) {
      food.image_url = `${process.env.APPLICATION_URL}/files/${food.image_url}`;
    }

    return response.json(food);
  }
);

foodsRouter.delete(
  '/:id',
  EnsureEmployeeAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    if (!isUuid(id)) {
      throw new AppError('Id inválido');
    }

    const deleteFoodService = new DeleteFoodService();

    deleteFoodService.execute(id);

    return response.status(204).send();
  }
);

export default foodsRouter;
