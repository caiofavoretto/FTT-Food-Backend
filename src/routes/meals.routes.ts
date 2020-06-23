import { Router } from 'express';
import multer from 'multer';
import { getRepository } from 'typeorm';

import { isUuid } from 'uuidv4';
import uploadconfig from '../config/upload';

import Meal from '../models/Meal';
import AppError from '../errors/AppError';

import UpdateMealService from '../services/UpdateMealService';
import CreateMealService from '../services/CreateMealService';
import DeleteMealService from '../services/DeleteMealService';

const mealsRouter = Router();
const upload = multer(uploadconfig);

mealsRouter.post('/', upload.single('image'), async (request, response) => {
  const { description, foods } = request.body;

  const imageFileName = request.file?.filename;

  const foodsArray = foods.split(',').map((food: string) => food.trim());

  const createMealService = new CreateMealService();

  const meal = await createMealService.execute({
    description,
    foods: foodsArray,
    imageFileName,
  });

  const serializedMeal = meal;

  serializedMeal.foods = meal.foods.map(food => {
    const serializedFood = food;

    if (serializedFood.image_url) {
      serializedFood.image_url = `${process.env.APPLICATION_URL}/files/${serializedFood.image_url}`;
    }
    return serializedFood;
  });

  if (serializedMeal.image_url) {
    serializedMeal.image_url = `${process.env.APPLICATION_URL}/files/${serializedMeal.image_url}`;
  }

  return response.json(serializedMeal);
});

mealsRouter.get('/', async (request, response) => {
  const mealsRepository = getRepository(Meal);

  const meals = await mealsRepository.find({
    order: {
      created_at: 'DESC',
    },
  });

  const serializedMeals = meals.map(meal => {
    const serializedMeal = meal;

    serializedMeal.foods = meal.foods.map(food => {
      const serializedFood = food;

      if (serializedFood.image_url) {
        serializedFood.image_url = `${process.env.APPLICATION_URL}/files/${serializedFood.image_url}`;
      }
      return serializedFood;
    });

    if (serializedMeal.image_url) {
      serializedMeal.image_url = `${process.env.APPLICATION_URL}/files/${serializedMeal.image_url}`;
    }

    serializedMeal.rating =
      serializedMeal.ratings.reduce((accumulator, current) => {
        return accumulator + current.grade;
      }, 0) / serializedMeal.ratings.length;

    delete serializedMeal.ratings;

    return serializedMeal;
  });

  return response.json(serializedMeals);
});

mealsRouter.patch('/:id', upload.single('image'), async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    throw new AppError('Id inválido.');
  }

  const { description, foods } = request.body;

  const imageFileName = request.file?.filename;

  const foodsArray = foods.split(',').map((food: string) => food.trim());

  const updateMealService = new UpdateMealService();

  const meal = await updateMealService.execute({
    id,
    description,
    foods: foodsArray,
    imageFileName,
  });

  const serializedMeal = meal;

  serializedMeal.foods = meal.foods.map(food => {
    const serializedFood = food;

    if (serializedFood.image_url) {
      serializedFood.image_url = `${process.env.APPLICATION_URL}/files/${serializedFood.image_url}`;
    }
    return serializedFood;
  });

  if (serializedMeal.image_url) {
    serializedMeal.image_url = `${process.env.APPLICATION_URL}/files/${serializedMeal.image_url}`;
  }

  return response.json(meal);

  serializedMeal.rating =
    serializedMeal.ratings.reduce((accumulator, current) => {
      return accumulator + current.grade;
    }, 0) / serializedMeal.ratings.length;

  delete serializedMeal.ratings;

  return response.json(serializedMeal);
});

mealsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    throw new AppError('Id inválido.');
  }

  const deleteMealService = new DeleteMealService();

  await deleteMealService.execute({
    id,
  });

  return response.status(204).send();
});

export default mealsRouter;
