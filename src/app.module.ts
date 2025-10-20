import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateENV } from './utils/validate-env';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateENV,
    }),
  ],
  controllers: [UserController],
})
export class AppModule {}
