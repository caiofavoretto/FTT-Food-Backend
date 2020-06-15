import { getRepository, In } from 'typeorm';
import Meal from '../models/Meal';
import Food from '../models/Food';
import MealFoods from '../models/MealFoods';

// import AppError from '../errors/AppError';

interface Request {
  description: string;
  date: Date;
  foods: string[];
}

class CreateMealService {
  public async execute({ description, date, foods }: Request): Promise<Meal> {
    const mealsRepository = getRepository(Meal);
    const foodsRepository = getRepository(Food);
    const mealFoodsRepository = getRepository(MealFoods);

    const foodEntities = await foodsRepository.find({
      where: {
        id: In(foods),
      },
    });

    const meal = mealsRepository.create({
      description,
      date,
    });

    foods.map(food => {
      const mealFood = mealFoodsRepository.create({
        food_id: food,
        meal_id: meal.id,
      });

      mealFoodsRepository.save(mealFood);

      return mealFood;
    });

    await mealsRepository.save(meal);

    meal.foods = foodEntities;

    return meal;
  }
}

export default CreateMealService;
