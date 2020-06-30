import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import Food from './Food';
import Rating from './Rating';

@Entity('meals')
class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @ManyToMany(() => Food, { eager: true })
  @JoinTable()
  foods: Food[];

  @OneToMany(() => Rating, rating => rating.meal, { eager: true })
  ratings: Rating[];

  rating: number;

  @Column()
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  dayOfTheWeek: string;

  date: string;

  today: boolean;

  attendant: string;

  rated: number | null;
}

export default Meal;
