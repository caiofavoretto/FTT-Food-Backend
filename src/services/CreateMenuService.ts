import { getRepository, Between, Equal } from 'typeorm';
import { differenceInCalendarDays } from 'date-fns';
import Menu from '../models/Menu';
import AppError from '../errors/AppError';

// import AppError from '../errors/AppError';

interface Request {
  description: string;
  initial_date: Date;
  end_date: Date;
  monday_meal_id: string;
  tuesday_meal_id: string;
  wednesday_meal_id: string;
  thursday_meal_id: string;
  friday_meal_id: string;
}

class CreateMenuService {
  public async execute({
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

    if (end_date < initial_date) {
      throw new AppError('A data inicial deve ser menor que data final.');
    }

    if (differenceInCalendarDays(end_date, initial_date) + 1 !== 5) {
      throw new AppError('O intervalo de datas deve ser de 5 dias.');
    }

    const menuExists = await menusRepository.findOne({
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

    if (menuExists) {
      throw new AppError(
        'Não é possível cadastrar dois menus para o mesmo intervalo de datas.'
      );
    }

    const menu = menusRepository.create({
      description,
      initial_date,
      end_date,
      monday_meal_id,
      tuesday_meal_id,
      wednesday_meal_id,
      thursday_meal_id,
      friday_meal_id,
    });

    await menusRepository.save(menu);

    return menu;
  }
}

export default CreateMenuService;
