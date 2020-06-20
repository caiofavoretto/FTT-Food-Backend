import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  registry: string;
  password: string;
  type: 'mobile' | 'backoffice';
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({
    registry,
    password,
    type,
  }: Request): Promise<Response> {
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

    if (user.deleted_at) {
      throw new AppError(
        'Lamentamos, mas este usuário foi excluído. Solicite um novo cadastro.',
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

    if (type === 'backoffice' && user.role.description !== 'Funcionário') {
      throw new AppError(
        'Apenas funcionários podem acessar esta plataforma.',
        401
      );
    }

    const { expiresIn } = authConfig.jwt;

    let token;
    if (type === 'backoffice') {
      token = sign({}, `${process.env.SECRET_BACKOFFICE}`, {
        subject: user.id,
        expiresIn,
      });
    } else if (type === 'mobile') {
      token = sign({}, `${process.env.SECRET}`, {
        subject: user.id,
        expiresIn,
      });

      console.log(authConfig.jwt);
    } else {
      throw new AppError('Algo deu errado na autenticação.', 401);
    }

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
