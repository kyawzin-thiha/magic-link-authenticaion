import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      process.env.WEB_URL_1,
      process.env.WEB_URL_2,
      process.env.WEB_URL_3,
    ],
    credentials: true,
  });

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
bootstrap();
