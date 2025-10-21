import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';
import { AppModes } from 'src/types/global';

class EnvironmentVariables {
  @IsEnum(AppModes)
  NODE_ENV: AppModes;

  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  @MinLength(10)
  DB_URL: string;

  @IsString()
  @MinLength(2)
  DB_NAME: string;

  @IsInt()
  @Min(0)
  SALT_WORK_FACTOR: number;

  @IsString()
  @MinLength(10)
  JWT_SECRET_KEY: string;

  @IsInt()
  JWT_EXPIRES_IN: number;
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

  const {
    NODE_ENV,
    PORT,
    DB_URL,
    DB_NAME,
    SALT_WORK_FACTOR,
    JWT_SECRET_KEY,
    JWT_EXPIRES_IN,
  } = validatedConfig;
  return {
    MODE: NODE_ENV,
    PORT,
    DB_URL,
    DB_NAME,
    SALT_WORK_FACTOR,
    JWT: {
      JWT_EXPIRES_IN,
      JWT_SECRET_KEY,
    },
  };
}
