import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://danjin-bms.vercel.app/'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // format data json cho chuẩn dataDTO
      whitelist: true, // loại bỏ field không có trong DTO
      //forbidNonWhitelisted: true, // báo lỗi nếu gửi field lạ
    }),
  );

  app.use(cookieParser());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
