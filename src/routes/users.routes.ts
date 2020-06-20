import { Router } from 'express';
import { getRepository, Not, Equal, IsNull } from 'typeorm';
import { isUuid } from 'uuidv4';

import multer from 'multer';
import uploadconfig from '../config/upload';

import CreateUserService from '../services/Users/CreateUserService';
import UpdateUserService from '../services/Users/UpdateUserService';
import UpdateUserAvatarService from '../services/Users/UpdateUserAvatarService';
import UpdateUserEmailService from '../services/Users/UpdateUserEmailService';
import UpdateUserPasswordService from '../services/Users/UpdateUserPasswordService';
import DeleteUserService from '../services/Users/DeleteUserService';

import EnsureAuthenticated from '../middleware/ensureAuthenticated';
import EnsureEmployeeAuthenticated from '../middleware/ensureEmployeeAuthenticated';

import AppError from '../errors/AppError';
import User from '../models/User';

const userRouter = Router();
const upload = multer(uploadconfig);

userRouter.post(
  '/',
  EnsureEmployeeAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const {
      name,
      last_name,
      email,
      role_id,
      registry,
      gender_id,
    } = request.body;

    const avatarFileName = request.file?.filename;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name,
      last_name,
      email,
      role_id,
      gender_id,
      registry,
      avatarFileName,
    });

    delete user.password_hash;

    if (user.avatar_url) {
      user.avatar_url = `${process.env.APPLICATION_URL}/files/${user.avatar_url}`;
    }

    return response.json(user);
  }
);

userRouter.get('/', EnsureEmployeeAuthenticated, async (request, response) => {
  const connectedUserId = request.user.id;

  const usersRepository = getRepository(User);

  const users = await usersRepository.find({
    where: {
      id: Not(Equal(connectedUserId)),
      deleted_at: IsNull(),
    },
    order: {
      registry: 'DESC',
    },
  });

  const serializedUsers = users.map(user => {
    const serializedUser = user;

    if (serializedUser.avatar_url) {
      serializedUser.avatar_url = `${process.env.APPLICATION_URL}/files/${serializedUser.avatar_url}`;
    } else {
      delete serializedUser.avatar_url;
    }

    delete serializedUser.password_hash;

    return serializedUser;
  });

  return response.json(serializedUsers);
});

userRouter.patch(
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

userRouter.patch('/email', EnsureAuthenticated, async (request, response) => {
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
});

userRouter.patch(
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

userRouter.patch(
  '/:id',
  EnsureEmployeeAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const { id } = request.params;

    if (!isUuid(id)) {
      throw new AppError('Id inválido');
    }

    const { name, last_name, email, role_id, gender_id } = request.body;

    const avatarFileName = request.file?.filename;

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({
      id,
      name,
      last_name,
      email,
      role_id,
      gender_id,
      avatarFileName,
    });

    delete user.password_hash;

    if (user.avatar_url) {
      user.avatar_url = `${process.env.APPLICATION_URL}/files/${user.avatar_url}`;
    }

    return response.json(user);
  }
);

userRouter.delete(
  '/:id',
  EnsureEmployeeAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    if (!isUuid(id)) {
      throw new AppError('Id inválido');
    }

    const deleteUserService = new DeleteUserService();

    deleteUserService.execute(id);

    return response.status(204).send();
  }
);

export default userRouter;
