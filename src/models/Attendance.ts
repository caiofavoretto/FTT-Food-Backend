import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('attendances')
class Attendances {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  user_id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  date: Date;
}

export default Attendances;
