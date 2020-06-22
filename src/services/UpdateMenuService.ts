import { getRepository, Between, Equal, Not, In } from 'typeorm';
import { differenceInCalendarDays } from 'date-fns';
import Menu from '../models/Menu';
import Meal from '../models/Meal';

import AppError from '../errors/AppError';

interface Request {
  id: string;
  description: string;
  initial_date: Date;
  end_date: Date;
  monday_meal_id: string | null;
  tuesday_meal_id: string | null;
  wednesday_meal_id: string | null;
  thursday_meal_id: string | null;
  friday_meal_id: string | null;
}

class UpdateMenuService {
  public async execute({
    id,
    description,
    initial_date,
    end_date,
    monday_meal_id,
    tuesday_meal_id,
    wednesday_meal_id,
    thursday_meal_id,
    friday_meal_id,
  }: Request): Promise<Menu> {
    const menusRepository = getRepository(Menu);
    const menu = await menusRepository.findOne({ id });

    if (!menu) {
      throw new AppError('Menu não encontrado.', 404);
    }

    if (end_date < initial_date) {
      throw new AppError('A data inicial deve ser menor que data final.');
    }

    if (differenceInCalendarDays(end_date, initial_date) + 1 !== 5) {
      throw new AppError('O intervalo de datas deve ser de 5 dias.');
    }

    const dateExists = await menusRepository.findOne({
      where: [
        {
          initial_date: Between(initial_date, end_date),
          id: Not(Equal(id)),
        },
        {
          end_date: Between(initial_date, end_date),
          id: Not(Equal(id)),
        },
        {
          initial_date: Equal(initial_date),
          id: Not(Equal(id)),
        },
        {
          end_date: Equal(end_date),
          id: Not(Equal(id)),
        },
      ],
    });

    if (dateExists) {
      throw new AppError(
        'Não é possível atualizar dois menus para o mesmo intervalo de datas.'
      );
    }

    const mealsRepository = getRepository(Meal);

    menu.description = description;
    menu.initial_date = initial_date;
    menu.end_date = end_date;

    const mealIds = [
      monday_meal_id,
      tuesday_meal_id,
      wednesday_meal_id,
      thursday_meal_id,
      friday_meal_id,
    ];

    const meals = await mealsRepository.find({
      where: {
        id: In(mealIds),
      },
    });

    if (monday_meal_id) {
      menu.monday_meal = meals.find(meal => meal.id === monday_meal_id) || null;
    } else {
      menu.monday_meal = null;
    }

    if (tuesday_meal_id) {
      menu.tuesday_meal =
        meals.find(meal => meal.id === tuesday_meal_id) || null;
    } else {
      menu.tuesday_meal = null;
    }

    if (wednesday_meal_id) {
      menu.wednesday_meal =
        meals.find(meal => meal.id === wednesday_meal_id) || null;
    } else {
      menu.wednesday_meal = null;
    }

    if (thursday_meal_id) {
      menu.thursday_meal =
        meals.find(meal => meal.id === thursday_meal_id) || null;
    } else {
      menu.thursday_meal = null;
    }

    if (friday_meal_id) {
      menu.friday_meal = meals.find(meal => meal.id === friday_meal_id) || null;
    } else {
      menu.friday_meal = null;
    }

    menu.updated_at = new Date();

    await menusRepository.save(menu);

    return menu;
  }
}

export default UpdateMenuService;
