import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties not in the DTO
      forbidNonWhitelisted: true, // Throws an error for unknown properties
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
