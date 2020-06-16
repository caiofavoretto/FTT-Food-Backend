import { Router } from 'express';
import { parseISO } from 'date-fns';

import GetAttendancesService from '../services/GetAttendancesService';
import CreateAttendanceSevice from '../services/CreateAttendanceService';
import DeleteAttendanceService from '../services/DeleteAttendanceService';

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

  const attendances = await getAttendancesService.execute({
    user_id,
    date: date ? parseISO(date) : null,
  });

  return response.json(attendances);
});

attendanceRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteAttendanceService = new DeleteAttendanceService();

  deleteAttendanceService.execute(id);

  return response.send();
});

export default attendanceRouter;
