import { Router } from 'express';
import { getRepository, Not, Equal, IsNull } from 'typeorm';
import { isUuid } from 'uuidv4';

import multer from 'multer';
import uploadconfig from '../config/upload';

import CreateUserService from '../services/Users/CreateUserService';
import UpdateUserService from '../services/Users/UpdateUserService';
import DeleteUserService from '../services/Users/DeleteUserService';

import AppError from '../errors/AppError';
import User from '../models/User';

const userRouter = Router();
const upload = multer(uploadconfig);

userRouter.post('/', upload.single('avatar'), async (request, response) => {
  const { name, last_name, email, role_id, registry, gender_id } = request.body;

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
});

userRouter.get('/', async (request, response) => {
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

userRouter.patch('/:id', upload.single('avatar'), async (request, response) => {
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
});

userRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    throw new AppError('Id inválido');
  }

  const deleteUserService = new DeleteUserService();

  deleteUserService.execute(id);

  return response.status(204).send();
});

export default userRouter;
