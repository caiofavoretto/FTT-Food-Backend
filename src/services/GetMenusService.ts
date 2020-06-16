import { getRepository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import Menu from '../models/Menu';

interface Request {
  date: Date | null;
}

class GetMenusService {
  public async execute({ date }: Request): Promise<Menu[]> {
    const menusRepository = getRepository(Menu);

    let menus: Menu[];

    if (date) {
      menus = await menusRepository.find({
        where: {
          initial_date: LessThanOrEqual(date),
          end_date: MoreThanOrEqual(date),
        },
      });
    } else {
      menus = await menusRepository.find();
    }

    return menus;
  }
}

export default GetMenusService;
