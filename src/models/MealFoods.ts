import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import Food from './Food';
import Meal from './Meal';

@Entity('meal_foods')
class MealFoods {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Meal)
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @OneToOne(() => Food)
  @JoinColumn({ name: 'food_id' })
  food: Food;

  @Column()
  meal_id: string;

  @Column()
  food_id: string;
}

export default MealFoods;
