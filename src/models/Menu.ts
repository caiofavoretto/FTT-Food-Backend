import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Meal from './Meal';

@Entity('menus')
class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp with time zone' })
  initial_date: Date;

  @Column({ type: 'timestamp with time zone' })
  end_date: Date;

  @Column()
  monday_meal_id: string;

  @ManyToOne(() => Meal, { eager: true })
  @JoinColumn({ name: 'monday_meal_id' })
  monday_meal: Meal;

  @Column()
  tuesday_meal_id: string;

  @ManyToOne(() => Meal, { eager: true })
  @JoinColumn({ name: 'tuesday_meal_id' })
  tuesday_meal: Meal;

  @Column()
  wednesday_meal_id: string;

  @ManyToOne(() => Meal, { eager: true })
  @JoinColumn({ name: 'wednesday_meal_id' })
  wednesday_meal: Meal;

  @Column()
  thursday_meal_id: string;

  @ManyToOne(() => Meal, { eager: true })
  @JoinColumn({ name: 'thursday_meal_id' })
  thursday_meal: Meal;

  @Column()
  friday_meal_id: string;

  @ManyToOne(() => Meal, { eager: true })
  @JoinColumn({ name: 'friday_meal_id' })
  friday_meal: Meal;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Menu;
