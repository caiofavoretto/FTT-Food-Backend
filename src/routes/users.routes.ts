import { Router } from 'express';
import multer from 'multer';
import uploadconfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';

const userRouter = Router();
const upload = multer(uploadconfig);

userRouter.post('/', upload.single('avatar'), async (request, response) => {
  const { name, last_name, email, role_id, registry, password } = request.body;

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({
    name,
    last_name,
    email,
    role_id,
    registry,
    password,
    avatarFileName: request.file.filename,
  });

  delete user.password_hash;

  user.avatar_url = `http://localhost:3333/files/${user.avatar_url}`;

  return response.json(user);
});

export default userRouter;
