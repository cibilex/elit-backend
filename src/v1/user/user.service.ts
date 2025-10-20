import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private getUserQuery({ username, isDeleted }: Partial<UserDocument>) {
    const q: FilterQuery<UserDocument> = {};
    if (username) q.username = username;
    else if (typeof isDeleted === 'boolean') q.isDeleted = isDeleted;
    return q;
  }

  async getUser(query: Partial<UserDocument>): Promise<User>;
  async getUser(
    query: Partial<UserDocument>,
    silent: true,
  ): Promise<User | undefined>;
  async getUser(
    query: Partial<UserDocument>,
    silent?: true,
  ): Promise<User | undefined> {
    const user = await this.userModel.findOne(this.getUserQuery(query)).lean();
    if (!user) {
      if (silent) return undefined;
      else throw new BadRequestException('User Not found');
    }
    return user;
  }

  async insertUser(body: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(body);
      console.log(createdUser, 'createdUser');
      const res = await createdUser.save();
      console.log(res, 'res');
      return createdUser;
    } catch (err) {
      Logger.error(err);
      throw new BadRequestException('An error accured while creating user');
    }
  }

  async createUser(body: CreateUserDto) {
    const existed = await this.getUser(
      {
        username: body.username,
        isDeleted: false,
      },
      true,
    );
    if (existed)
      throw new BadRequestException(
        'There is already an user with given username',
      );
    const createdUser = await this.insertUser(body);
    return createdUser;
  }

  async getUsers(query: GetUserDto) {
    const users = await this.userModel.find(this.getUserQuery(query)).lean();
    return users;
  }
}
