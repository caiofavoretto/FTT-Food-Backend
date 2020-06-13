import { Router } from 'express';
import { getRepository } from 'typeorm';
import GetAttendancesService from '../services/GetAttendancesService';
import Attendance from '../models/Attendance';
import DeleteAttendanceService from '../services/DeleteAttendanceService';

const attendanceRouter = Router();

attendanceRouter.post('/', async (request, response) => {
  const user_id = request.user.id;
  const attendanceRepository = getRepository(Attendance);

  const attendance = attendanceRepository.create({
    user_id,
  });

  await attendanceRepository.save(attendance);

  return response.json(attendance);
});

attendanceRouter.get('/', async (request, response) => {
  const user_id = request.user.id;
  const date = request.query.date as string;

  const getAttendancesService = new GetAttendancesService();

  const attendances = getAttendancesService.execute({
    user_id,
    date: new Date(date),
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
