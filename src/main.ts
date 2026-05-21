import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cookies enable
  app.use(cookieParser());

  // CORS (frontend ko allow)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // (optional) response clean
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  await app.listen(5000);
}
bootstrap();