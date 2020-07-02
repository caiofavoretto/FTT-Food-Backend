import { Router } from 'express';
import { isUuid } from 'uuidv4';
import { parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import GetAttendancesService from '../services/GetAttendancesService';
import CreateAttendanceSevice from '../services/CreateAttendanceService';
import DeleteAttendanceService from '../services/DeleteAttendanceService';
import AppError from '../errors/AppError';

const attendanceRouter = Router();

attendanceRouter.post('/', async (request, response) => {
  const user_id = request.user.id;

  const createAttendanceSevice = new CreateAttendanceSevice();

  const attendance = await createAttendanceSevice.execute({ user_id });

  return response.json(attendance);
});

attendanceRouter.get('/', async (request, response) => {
  const user_id = request.user.id;
  const date = request.query.date as string;

  const getAttendancesService = new GetAttendancesService();

  const parsedDate = date
    ? utcToZonedTime(parseISO(date), 'America/Sao_Paulo')
    : null;

  const attendances = await getAttendancesService.execute({
    user_id,
    date: parsedDate,
  });

  return response.json(attendances);
});

attendanceRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    throw new AppError('Id invalido');
  }

  const deleteAttendanceService = new DeleteAttendanceService();

  deleteAttendanceService.execute(id);

  return response.send();
});

export default attendanceRouter;
