import { getRepository } from 'typeorm';
import User from '../models/User';
import Rating from '../models/Rating';
import Meal from '../models/Meal';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  meal_id: string;
  grade: number;
}

class CreateRatingService {
  public async execute({ user_id, meal_id, grade }: Request): Promise<Rating> {
    const ratingsRepository = getRepository(Rating);
    const usersRepository = getRepository(User);
    const mealsRepository = getRepository(Meal);

    const userExist = await usersRepository.findOne(user_id);

    if (!userExist) {
      throw new AppError('Usuário não encontrado.');
    }
    const mealExist = await mealsRepository.findOne(meal_id);

    if (!mealExist) {
      throw new AppError('Refeição não encontrada.');
    }

    if (grade < 1 || grade > 5) {
      throw new AppError('A nota da avaliação deve estar entre 1 e 5.');
    }

    const rating = ratingsRepository.create({
      user_id,
      meal_id,
      grade,
    });

    await ratingsRepository.save(rating);

    return rating;
  }
}

export default CreateRatingService;
