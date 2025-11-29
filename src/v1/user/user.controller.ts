import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { GetUserDto } from './dto/get-users.dto';
import { Auth } from 'src/decorators/auth.decorators';
import { PERMISSIONS } from 'src/constants/permissions.constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth([PERMISSIONS.CREATE_USER])
  @Post()
  createUser(@Body() body: CreateUserDto) {
    console.log('hi');

    return this.userService.createUser(body);
  }

  @Auth([PERMISSIONS.LIST_USER])
  @Get()
  getUsers(@Query() query: GetUserDto) {
    return this.userService.getUsers(query);
  }
}
