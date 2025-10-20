import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { GetUserDto } from './dto/get-users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Get()
  getUsers(@Query() query: GetUserDto) {
    return this.userService.getUsers(query);
  }
}
