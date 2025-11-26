import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorators';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  @Public()
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'Server is running',
    };
  }

  @Public()
  @Get('task')
  getTaskId() {
    return this.healthService.getECSTaskId();
  }
}
