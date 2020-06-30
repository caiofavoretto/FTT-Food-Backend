import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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

  @Column()
  menu_id: string;

  @ManyToOne(() => Meal, meal => meal.ratings)
  meal: Meal;

  @Column('timestamp with time zone')
  date: Date;
}

export default Rating;
