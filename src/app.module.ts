import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateENV } from './utils/validate-env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateENV,
    }),
  ],
})
export class AppModule {}
