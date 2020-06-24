import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Food from './Food';

@Entity('suggestions')
class Suggestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  food_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Food, { eager: true })
  @JoinColumn({ name: 'food_id' })
  food: Food;
}

export default Suggestion;
