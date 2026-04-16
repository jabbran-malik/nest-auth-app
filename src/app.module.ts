import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5433,
      username: 'postgres',
      password: 'pak786@A',
      database: 'nestdb',
     
      autoLoadEntities: true,
      synchronize: true, // IMPORTANT (migration use karni hai)
    }),
       UserModule,
       AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[AppService]

})
export class AppModule {}
