import { getRepository } from 'typeorm';
import { hash, compare } from 'bcryptjs';

import User from '../../models/User';

import AppError from '../../errors/AppError';

interface Request {
  id: string;
  password: string;
  old_password: string;
}

class UpdateUserPasswordService {
  public async execute({ id, password, old_password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(id);

    if (!user || user.deleted_at) {
      throw new AppError(
        'Somente usuários autenticados podem alterar a senha.'
      );
    }

    const passwordMatch = await compare(old_password, user.password_hash);

    if (!passwordMatch) {
      throw new AppError('Sua senha está incorreta.', 401);
    }

    const password_hash = await hash(password, 8);

    user.password_hash = password_hash;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserPasswordService;
