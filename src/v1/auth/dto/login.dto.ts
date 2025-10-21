import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/v1/user/dto/create-user.dto';

export class LoginDto extends PickType(CreateUserDto, [
  'username',
  'password',
]) {}
