import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, Max, Min, validateSync } from 'class-validator';
import { AppModes } from 'src/types/global';

export class EnvironmentVariables {
  @IsEnum(AppModes)
  NODE_ENV: AppModes;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;
}

export function validateENV(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
