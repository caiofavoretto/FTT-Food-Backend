import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  registry: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ registry, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { registry },
    });

    if (!user) {
      throw new AppError(
        'Ocorreu um erro ao fazer login, cheque as credenciais.',
        401
      );
    }

    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new AppError(
        'Ocorreu um erro ao fazer login, cheque as credenciais.',
        401
      );
    }

    if (user.role.description !== 'Funcionário') {
      throw new AppError(
        'Apenas funcionários podem acessar esta plataforma.',
        401
      );
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
