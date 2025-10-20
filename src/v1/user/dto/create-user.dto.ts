import {
  IsEnum,
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { UserTypes } from 'src/user.types';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(200)
  password: string;

  @IsInt()
  @Min(0)
  permissions: number;

  @IsEnum(UserTypes)
  userType: UserTypes;
}
