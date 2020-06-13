import { isUuid } from 'uuidv4';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Attendance from '../models/Attendance';

class DeleteAttendanceService {
  public async execute(id: string): Promise<void> {
    if (!isUuid(id)) throw new AppError('Id invalido');

    const attendanceRepository = getRepository(Attendance);
    const attendanceExists = await attendanceRepository.findOne({ id });

    if (!attendanceExists)
      throw new AppError('Presença do usuário não encontrado', 404);

    await attendanceRepository.remove(attendanceExists);
  }
}

export default DeleteAttendanceService;
