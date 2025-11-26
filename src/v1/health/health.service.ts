import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IEnvironment } from 'src/types/global';

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService<IEnvironment, true>,
  ) {}

  getECSTaskId = async () => {
    try {
      const metadataUri = this.configService.get('ECS_CONTAINER_METADATA_URI', {
        infer: true,
      });
      if (!metadataUri) return null;

      const res = await axios.get(`${metadataUri}/task`);
      if (res.status !== 200) return null;

      const data = res.data as { TaskARN?: string };
      const taskARN = data?.TaskARN;
      if (!taskARN) return null;

      const taskId = taskARN.split('/').pop();
      return taskId || null;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  };
}
