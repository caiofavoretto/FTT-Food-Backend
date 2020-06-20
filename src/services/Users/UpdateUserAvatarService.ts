import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../../models/User';

import uploadConfig from '../../config/upload';
import AppError from '../../errors/AppError';

interface Request {
  id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(id);

    if (!user || user.deleted_at) {
      throw new AppError(
        'Somente usuários autenticados podem alterar o avatar.'
      );
    }

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

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
