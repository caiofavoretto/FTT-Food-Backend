import { getRepository, Between, Equal } from 'typeorm';
import { differenceInCalendarDays } from 'date-fns';
import Menu from '../models/Menu';

import AppError from '../errors/AppError';

interface Request {
  id: string;
  description: string;
  initial_date: Date;
  end_date: Date;
  monday_meal_id: string;
  tuesday_meal_id: string;
  wednesday_meal_id: string;
  thursday_meal_id: string;
  friday_meal_id: string;
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
    const menuExists = await menusRepository.findOne({ id });

    if (!menuExists) {
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
        },
        {
          end_date: Between(initial_date, end_date),
        },
        {
          initial_date: Equal(initial_date),
        },
        {
          end_date: Equal(end_date),
        },
      ],
    });

    if (dateExists) {
      throw new AppError(
        'Não é possível atualizar dois menus para o mesmo intervalo de datas.'
      );
    }

    menuExists.description = description;
    menuExists.initial_date = initial_date;
    menuExists.end_date = end_date;
    menuExists.monday_meal_id = monday_meal_id;
    menuExists.tuesday_meal_id = tuesday_meal_id;
    menuExists.wednesday_meal_id = wednesday_meal_id;
    menuExists.thursday_meal_id = thursday_meal_id;
    menuExists.friday_meal_id = friday_meal_id;

    await menusRepository.save(menuExists);

    return menuExists;
  }
}

export default UpdateMenuService;
