import { getRepository } from 'typeorm';
import Menu from '../models/Menu';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteMenuService {
  public async execute({ id }: Request): Promise<Menu> {
    const menusRepository = getRepository(Menu);
    const menuExists = await menusRepository.findOne({ id });

    if (!menuExists) {
      throw new AppError('Menu não encontrado.', 404);
    }

    await menusRepository.remove(menuExists);

    return menuExists;
  }
}

export default DeleteMenuService;
