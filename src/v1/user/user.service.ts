import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-users.dto';
import { IUser, IUserDocument, UserTypes } from 'src/user.types';
import { validateObjectId } from 'src/utils/db.utils';
import { ConfigService } from '@nestjs/config';
import { IEnvironment } from 'src/types/global';
import { PREDEFINED_PERMISSIONS } from 'src/constants/permissions.constants';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService<IEnvironment, true>,
  ) {}

  private getUserQuery({
    username,
    isDeleted,
    userType,
    id,
  }: Partial<IUser<'api'>>) {
    const q: FilterQuery<IUser<'db'>> = {};
    if (username) q.username = username;
    if (typeof isDeleted === 'boolean') q.isDeleted = isDeleted;
    if (userType) q.userType = userType;
    if (id) {
      validateObjectId(id);
      q._id = id;
    }

    return q;
  }

  async getUser(query: Partial<IUser<'api'>>): Promise<IUser<'db'>>;
  async getUser(
    query: Partial<IUser<'api'>>,
    silent: true,
  ): Promise<IUser<'db'> | undefined>;
  async getUser(
    query: Partial<IUser<'api'>>,
    silent?: true,
  ): Promise<IUser<'db'> | undefined> {
    const user = await this.userModel.findOne(this.getUserQuery(query)).lean();
    if (!user) {
      if (silent) return undefined;
      else throw new BadRequestException('User Not found');
    }
    return user;
  }

  async insertUser(body: CreateUserDto): Promise<IUser<'api'>> {
    try {
      const newUser = new this.userModel(body);
      const createdUser = await newUser.save();

      return this.formatUserToRes(createdUser);
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
    return users.map((user) => this.formatUserToRes(user));
  }

  private formatUserToRes({
    _id,
    username,
    userType,
    isDeleted,
    permissions,
  }: IUserDocument | IUser<'db'>): IUser<'api'> {
    return {
      id: _id.toString(),
      username,
      userType,
      isDeleted,
      permissions,
    };
  }

  async onApplicationBootstrap() {
    const username = this.configService.get('ADMIN.ADMIN_NAME', {
      infer: true,
    });

    const existed = await this.getUser({ username }, true);
    if (existed) {
      Logger.warn('[onApplicationBootstrap] > Admin user is created already.');
      return;
    }

    try {
      await this.createUser({
        username,
        password: this.configService.get('ADMIN.ADMIN_PASSWORD', {
          infer: true,
        }),
        permissions: PREDEFINED_PERMISSIONS[UserTypes.ADMIN],
        userType: UserTypes.ADMIN,
      });
      Logger.warn(
        '[onApplicationBootstrap] > Admin user is created successfully.',
      );
    } catch (err) {
      Logger.error(err);
    }
  }
}
