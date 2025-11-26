import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [UserModule, HealthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class V1Module {}
