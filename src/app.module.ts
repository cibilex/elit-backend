import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateENV } from './utils/validate-env';
import { MongooseModule } from '@nestjs/mongoose';
import { IEnvironment } from './types/global';
import { UserModule } from './user/user.module';

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
    UserModule,
  ],
})
export class AppModule {}
