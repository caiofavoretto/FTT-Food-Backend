import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import Meal from './Meal';

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

  @ManyToOne(() => Meal, meal => meal.ratings)
  meal: Meal;

  @CreateDateColumn()
  created_at: Date;
}

export default Rating;
