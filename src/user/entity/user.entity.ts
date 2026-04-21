import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ unique: true })
  email!: string;
  @Column()
  @Exclude()
  password!: string;
  @Column({ default: "user" })
  role!: string
  @Column({ type: 'text', nullable: true })
  @Exclude()
  refreshToken!: string | null;
  @CreateDateColumn()
  createdAt!: Date;
}