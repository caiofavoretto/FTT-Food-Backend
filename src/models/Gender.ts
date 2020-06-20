import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genders')
class Gender {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  description: string;
}

export default Gender;
