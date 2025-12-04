// server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Vite client URL
    credentials: true,
  });

  // Global Prefix to match client/src/lib/api.ts (http://.../api/...)
  app.setGlobalPrefix('api');

  // Listen on port 3001
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
