import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Cấu hình CORS để chấp nhận request từ subdomain
  app.enableCors({
    origin: (origin, callback) => {
      // Cho phép tất cả subdomain của local.delifood.com và localhost
      if (!origin || origin.includes('local.delifood.com') || origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'tenant-id'], // Quan trọng: Thêm tenant-id vào đây
    credentials: true,
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();