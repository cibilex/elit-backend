import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateENV } from './utils/validate-env';
import { MongooseModule } from '@nestjs/mongoose';
import { IEnvironment } from './types/global';
import { V1Module } from './v1/v1.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateENV,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configservice: ConfigService<IEnvironment, true>) => {
        return {
          uri: configservice.get('DB_URL', { infer: true }),
          dbName: configservice.get('DB_NAME', { infer: true }),
        };
      },
      inject: [ConfigService],
    }),
    V1Module,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
