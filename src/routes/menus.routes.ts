import { Router } from 'express';
import { addDays, parseISO } from 'date-fns';
import { isUuid } from 'uuidv4';
import AppError from '../errors/AppError';

import UpdateMenuService from '../services/UpdateMenuService';
import CreateMenuService from '../services/CreateMenuService';
import DeleteMenuService from '../services/DeleteMenuService';
import GetMenusService from '../services/GetMenusService';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';
import EnsureEmployeeAuthenticated from '../middleware/ensureEmployeeAuthenticated';
import serializeMeal from '../utils/serializeMeal';

const menusRouter = Router();

menusRouter.post(
  '/',
  EnsureEmployeeAuthenticated,
  async (request, response) => {
    const {
      description,
      initial_date,
      end_date,
      monday_meal_id,
      tuesday_meal_id,
      wednesday_meal_id,
      thursday_meal_id,
      friday_meal_id,
    } = request.body;

    const createMenuService = new CreateMenuService();

    const menu = await createMenuService.execute({
      description,
      initial_date: parseISO(initial_date),
      end_date: parseISO(end_date),
      monday_meal_id,
      tuesday_meal_id,
      wednesday_meal_id,
      thursday_meal_id,
      friday_meal_id,
    });

    return response.json(menu);
  }
);

menusRouter.get('/', EnsureAuthenticated, async (request, response) => {
  const date = request.query.date as string;

  const user_id = request.user.id;

  const getMenusService = new GetMenusService();

  const menus = await getMenusService.execute({
    date: date ? parseISO(date) : null,
  });

  const serializedmenusPromise = menus.map(async menu => {
    const serializedMenu = menu;

    if (serializedMenu.monday_meal) {
      serializedMenu.monday_meal = await serializeMeal({
        meal: serializedMenu.monday_meal,
        date: serializedMenu.initial_date,
        user_id,
      });
    }

    if (serializedMenu.tuesday_meal) {
      serializedMenu.tuesday_meal = await serializeMeal({
        meal: serializedMenu.tuesday_meal,
        date: addDays(serializedMenu.initial_date, 1),
        user_id,
      });
    }

    if (serializedMenu.wednesday_meal) {
      serializedMenu.wednesday_meal = await serializeMeal({
        meal: serializedMenu.wednesday_meal,
        date: addDays(serializedMenu.initial_date, 2),
        user_id,
      });
    }

    if (serializedMenu.thursday_meal) {
      serializedMenu.thursday_meal = await serializeMeal({
        meal: serializedMenu.thursday_meal,
        date: addDays(serializedMenu.initial_date, 3),
        user_id,
      });
    }

    if (serializedMenu.friday_meal) {
      serializedMenu.friday_meal = await serializeMeal({
        meal: serializedMenu.friday_meal,
        date: addDays(serializedMenu.initial_date, 4),
        user_id,
      });
    }

    return serializedMenu;
  });

  const serializedmenus = await Promise.all(serializedmenusPromise);

  return response.json(serializedmenus);
});

menusRouter.patch(
  '/:id',
  EnsureEmployeeAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    if (!isUuid(id)) {
      throw new AppError('Id inválido.');
    }

    const {
      description,
      initial_date,
      end_date,
      monday_meal_id,
      tuesday_meal_id,
      wednesday_meal_id,
      thursday_meal_id,
      friday_meal_id,
    } = request.body;

    const updateMenuService = new UpdateMenuService();

    const menu = await updateMenuService.execute({
      id,
      description,
      initial_date: parseISO(initial_date),
      end_date: parseISO(end_date),
      monday_meal_id,
      tuesday_meal_id,
      wednesday_meal_id,
      thursday_meal_id,
      friday_meal_id,
    });

    return response.json(menu);
  }
);

menusRouter.delete(
  '/:id',
  EnsureEmployeeAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    if (!isUuid(id)) {
      throw new AppError('Id inválido.');
    }

    const deleteMenuService = new DeleteMenuService();

    await deleteMenuService.execute({
      id,
    });

    return response.status(204).send();
  }
);

export default menusRouter;
