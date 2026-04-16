import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}