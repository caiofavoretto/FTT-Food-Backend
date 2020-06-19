import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('ratings')
class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  grade: number;

  @Column()
  user_id: string;

  @Column()
  meal_id: string;

  @CreateDateColumn()
  created_at: Date;
}

export default Rating;
