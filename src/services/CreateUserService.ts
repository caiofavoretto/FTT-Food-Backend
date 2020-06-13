import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

import AppError from '../errors/AppError';

interface Request {
  name: string;
  last_name: string;
  email: string;
  role_id: number;
  registry: string;
  password: string;
  avatarFileName: string;
}

class CreateUserService {
  public async execute({
    name,
    last_name,
    email,
    role_id,
    registry,
    password,
    avatarFileName,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const userExists = await usersRepository.findOne({ where: { registry } });

    if (userExists) {
      throw new AppError('User already exists');
    }

    const password_hash = await hash(password, 8);

    const user = usersRepository.create({
      name,
      last_name,
      email,
      role_id,
      registry,
      password_hash,
      avatar_url: avatarFileName,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
