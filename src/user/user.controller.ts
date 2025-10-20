import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const users = await this.userModel.find({}).lean();
    console.log(users.length, 'users');

    return 'hi world' + body.username;
  }
}
