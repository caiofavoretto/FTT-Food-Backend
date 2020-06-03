import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';

interface RequestDTO {
  registry: string;
  password: string;
}

interface ResponseDTO {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({
    registry,
    password,
  }: RequestDTO): Promise<ResponseDTO> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { registry },
    });

    if (!user) {
      throw new AppError('Incorrect registry / password combination.', 401);
    }

    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new AppError('Incorrect registry / password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
