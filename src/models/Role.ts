import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  description: string;
}

export default Role;
