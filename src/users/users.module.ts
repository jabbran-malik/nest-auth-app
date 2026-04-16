import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity'; // ✔ correct

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 🔥 MUST
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}