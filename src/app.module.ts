import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // 🔥 STEP 1: Load ENV FIRST (VERY IMPORTANT)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🔥 STEP 2: Database Config
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST as string,
      port: Number(process.env.DB_PORT), // ✅ number conversion
      username: process.env.DB_USER as string,
      password: process.env.DB_PASS as string,
      database: process.env.DB_NAME as string,
      autoLoadEntities: true,
      synchronize: true,
    }),

    // 🔥 Modules
    UsersModule,
    AuthModule,
    MailModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}