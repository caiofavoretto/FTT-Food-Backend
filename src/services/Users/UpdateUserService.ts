import { getRepository } from 'typeorm';

import path from 'path';
import fs from 'fs';

import User from '../../models/User';

import uploadConfig from '../../config/upload';
import AppError from '../../errors/AppError';
import parseDateTimeZone from '../../utils/parseDateTimeZone';

interface Request {
  id: string;
  name: string;
  last_name: string;
  email: string;
  role_id: number;
  gender_id: number;
  avatarFileName: string;
}

class UpdateUserService {
  public async execute({
    id,
    name,
    last_name,
    email,
    role_id,
    gender_id,
    avatarFileName,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(id);

    if (!user || user.deleted_at) {
      throw new AppError('Este usuário não existe ou foi removido do sistema.');
    }

    delete user.role;
    delete user.gender;

    user.name = name;
    user.last_name = last_name;
    user.email = email;
    user.role_id = role_id;
    user.gender_id = gender_id;

    if (user.avatar_url) {
      const userAvatarFilePath = path.join(
        uploadConfig.directory,
        user.avatar_url
      );

      const userAvatarFileExists = fs.existsSync(userAvatarFilePath);

      if (userAvatarFileExists) {
        fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar_url = avatarFileName;
    user.updated_at = parseDateTimeZone(new Date());

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
