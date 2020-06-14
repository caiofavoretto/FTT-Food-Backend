import { getRepository, Between } from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns';
import Attendance from '../models/Attendance';

interface Request {
  user_id: string;
  date: Date | null;
}

class GetAttendancesService {
  public async execute({ user_id, date }: Request): Promise<Attendance[]> {
    const attendanceRepository = getRepository(Attendance);

    let attendances: Attendance[];

    if (date) {
      attendances = await attendanceRepository.find({
        where: {
          user_id,
          date: Between(startOfDay(date), endOfDay(date)),
        },
      });
    } else {
      attendances = await attendanceRepository.find({
        where: {
          user_id,
        },
      });
    }
    return attendances;
  }
}

export default GetAttendancesService;
