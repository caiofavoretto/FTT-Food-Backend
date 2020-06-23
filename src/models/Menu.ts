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
  monday_meal_id: string | null;

  @ManyToOne(() => Meal, { eager: true })
  @JoinColumn({ name: 'monday_meal_id' })
  monday_meal: Meal | null;

  @Column()
  tuesday_meal_id: string | null;

  @ManyToOne(() => Meal, { eager: true })
  @JoinColumn({ name: 'tuesday_meal_id' })
  tuesday_meal: Meal | null;

  @Column()
  wednesday_meal_id: string | null;

  @ManyToOne(() => Meal, { eager: true })
  @JoinColumn({ name: 'wednesday_meal_id' })
  wednesday_meal: Meal | null;

  @Column()
  thursday_meal_id: string | null;

  @ManyToOne(() => Meal, { eager: true })
  @JoinColumn({ name: 'thursday_meal_id' })
  thursday_meal: Meal | null;

  @Column()
  friday_meal_id: string | null;

  @ManyToOne(() => Meal, { eager: true })
  @JoinColumn({ name: 'friday_meal_id' })
  friday_meal: Meal | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Menu;
