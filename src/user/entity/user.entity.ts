import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ unique: true })
  email!: string;
  @Column()
  password!: string;
  @Column({ default: "user" })
  role!: string
  @Column({ nullable: true })
  refreshToken!: null | string;
  @CreateDateColumn()
  createdAt!: Date;
}