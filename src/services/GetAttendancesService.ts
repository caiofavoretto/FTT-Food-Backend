import { getRepository, Between } from 'typeorm';
import { addDays } from 'date-fns';
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
      const initialDate = date;
      initialDate.setHours(0);
      initialDate.setMinutes(0);
      initialDate.setSeconds(0);

      const finalDate = addDays(initialDate, 1);

      attendances = await attendanceRepository.find({
        where: {
          user_id,
          date: Between(initialDate, finalDate),
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
