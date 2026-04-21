import { ForbiddenException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin, Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';



export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }
    async onModuleInit() {
        const admin = await this.userRepo.findOne({
            where: { role: "admin" }
        })
        if (!admin) {
            const newAdmin = this.userRepo.create({
                email: "admin@gmail.com",
                password: await bcrypt.hash('admin123', 10),
                role: "admin",
            })

            await this.userRepo.save(newAdmin)
        }
    }
    async findAll(page: number, limit: number) {
      const skip=(page -1 )* limit

const [users, total] = await this.userRepo.findAndCount({
    skip,
    take: limit,
  });

  return {
    data: users,
    total,
    page,
    limit,
  };
}
async findOne(id: number, currentUser: any) {

  if (currentUser.role !== 'admin' && currentUser.sub !== id) {
    throw new ForbiddenException('You can only access your own data');
  }

  const user = await this.userRepo.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user;
}
async update(id: number, dto: any, currentUser: any) {
  const user = await this.userRepo.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // 🔥 Self access logic
  if (currentUser.role !== 'admin' && currentUser.sub !== id) {
    throw new ForbiddenException('You can only update your own profile');
  }

  // 🔥 Optional: user cannot change role
  if (currentUser.role !== 'admin' && dto.role) {
    throw new ForbiddenException('You cannot change role');
  }

  Object.assign(user, dto);

  return this.userRepo.save(user);
}
async remove(id: number) {
  const user = await this.userRepo.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  await this.userRepo.remove(user);

  return { message: 'User deleted successfully' };
}

}