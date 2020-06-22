import { Router } from 'express';
import { parseISO } from 'date-fns';
import { isUuid } from 'uuidv4';
import AppError from '../errors/AppError';

import UpdateMenuService from '../services/UpdateMenuService';
import CreateMenuService from '../services/CreateMenuService';
import DeleteMenuService from '../services/DeleteMenuService';
import GetMenusService from '../services/GetMenusService';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';
import EnsureEmployeeAuthenticated from '../middleware/ensureEmployeeAuthenticated';

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

  const getMenusService = new GetMenusService();

  const menus = await getMenusService.execute({
    date: date ? parseISO(date) : null,
  });

  return response.json(menus);
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
