import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';

const environment = process.env.NODE_ENV || '.env';
const envFileName = environment === 'production' ? '.env' : '.env.development';

dotenv.config({ path: envFileName });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true,
  };
  app.enableCors(corsOptions);
  app.setGlobalPrefix('api');
  await app.listen(AppModule.port);
}
bootstrap();
