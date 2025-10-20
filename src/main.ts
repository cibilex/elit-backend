import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

console.log('node-env', process.env.NODE_ENV);

bootstrap()
  .then(() => {
    console.log('app is listening on ');
  })
  .catch((err) => {
    console.error(err);
  });
