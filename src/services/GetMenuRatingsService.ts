import { getRepository } from 'typeorm';
import User from '../models/User';
import Rating from '../models/Rating';
import Meal from '../models/Meal';
import AppError from '../errors/AppError';
import Menu from '../models/Menu';

interface Request {
  user_id: string;
  meal_id: string;
  menu_id: string;
  date: Date;
}

class GetMenuRatingService {
  public async execute({
    user_id,
    meal_id,
    menu_id,
    date,
  }: Request): Promise<number> {
    const ratingsRepository = getRepository(Rating);
    const usersRepository = getRepository(User);
    const mealsRepository = getRepository(Meal);
    const menusRepository = getRepository(Menu);

    const userExist = await usersRepository.findOne(user_id);

    if (!userExist) {
      throw new AppError('Usuário não encontrado.');
    }

    const mealExist = await mealsRepository.findOne(meal_id);

    if (!mealExist) {
      throw new AppError('Refeição não encontrada.');
    }

    const menuExist = await menusRepository.findOne(menu_id);

    if (!menuExist) {
      throw new AppError('Cardápio não encontrado.');
    }

    const rating = await ratingsRepository.findOne({
      where: {
        user_id,
        menu_id,
        meal_id,
        date,
      },
    });

    return rating?.grade || 0;
  }
}

export default GetMenuRatingService;
