import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Food from './Food';

@Entity('meals')
class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @ManyToMany(() => Food, { eager: true })
  @JoinTable()
  foods: Food[];

  // @Column()
  // meal_type_id: string;

  // @ManyToOne(() => Meal_type)
  // @JoinColumn({ name: 'meal_type_id' })
  // meal_type_id: Meal_type;

  @Column()
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: string;
}

export default Meal;
