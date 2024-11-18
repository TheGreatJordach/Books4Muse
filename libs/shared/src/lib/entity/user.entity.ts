import { IModelUser } from '../models/model.user.interface';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
@Index('idx_email', ['email'], { unique: true }) // Index the email column to speed up queries:
export class EUser implements IModelUser {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @Column({ unique: true })
  email!: string;
  @Column()
  password!: string;
}
