import { Router } from 'express';

import multer from 'multer';
import uploadconfig from '../config/upload';

import UpdateUserAvatarService from '../services/Users/UpdateUserAvatarService';
import UpdateUserEmailService from '../services/Users/UpdateUserEmailService';
import UpdateUserPasswordService from '../services/Users/UpdateUserPasswordService';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';

const profileRouter = Router();
const upload = multer(uploadconfig);

profileRouter.patch(
  '/avatar',
  EnsureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const user_id = request.user.id;
    const avatarFileName = request.file?.filename;

    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
      id: user_id,
      avatarFileName,
    });

    delete user.password_hash;

    if (user.avatar_url) {
      user.avatar_url = `${process.env.APPLICATION_URL}/files/${user.avatar_url}`;
    }

    return response.json(user);
  }
);

profileRouter.patch(
  '/email',
  EnsureAuthenticated,
  async (request, response) => {
    const user_id = request.user.id;
    const { email } = request.body;

    const updateUserEmailService = new UpdateUserEmailService();

    const user = await updateUserEmailService.execute({
      id: user_id,
      email,
    });

    delete user.password_hash;

    if (user.avatar_url) {
      user.avatar_url = `${process.env.APPLICATION_URL}/files/${user.avatar_url}`;
    }

    return response.json(user);
  }
);

profileRouter.patch(
  '/password',
  EnsureAuthenticated,
  async (request, response) => {
    const user_id = request.user.id;
    const { old_password, password } = request.body;

    const updateUserPasswordService = new UpdateUserPasswordService();

    const user = await updateUserPasswordService.execute({
      id: user_id,
      old_password,
      password,
    });

    delete user.password_hash;

    if (user.avatar_url) {
      user.avatar_url = `${process.env.APPLICATION_URL}/files/${user.avatar_url}`;
    }

    return response.json(user);
  }
);

export default profileRouter;
