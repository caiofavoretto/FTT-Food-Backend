import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../../models/User';

import AppError from '../../errors/AppError';

interface Request {
  name: string;
  last_name: string;
  email: string;
  role_id: number;
  gender_id: number;
  registry: string;
  avatarFileName: string;
}

class CreateUserService {
  public async execute({
    name,
    last_name,
    email,
    role_id,
    gender_id,
    registry,
    avatarFileName,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const userExists = await usersRepository.findOne({ where: { registry } });

    if (userExists && !userExists.deleted_at) {
      throw new AppError('O registro de usuário já existe.');
    }

    const firstLoginPassword = `${process.env.DEFAULT_PASSWORD}`;
    const password_hash = await hash(firstLoginPassword, 8);

    const user = usersRepository.create({
      name,
      last_name,
      email,
      role_id,
      gender_id,
      registry,
      password_hash,
      avatar_url: avatarFileName,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
