import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attendances')
class Attendances {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  user_id: string;

  @Column('timestamp with time zone')
  date: Date;
}

export default Attendances;
