import { getRepository } from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';

import User from '../../models/User';

import AppError from '../../errors/AppError';

interface Request {
  id: string;
  email: string;
}

class UpdateUserEmailService {
  public async execute({ id, email }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(id);

    if (!user || user.deleted_at) {
      throw new AppError(
        'Somente usuários autenticados podem alterar o e-mail.'
      );
    }

    user.email = email;
    user.updated_at = utcToZonedTime(new Date(), 'America/Sao_Paulo');

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserEmailService;
