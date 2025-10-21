import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ModuleRef } from '@nestjs/core';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/decorators/public.decorators';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { IEnvironment } from 'src/types/global';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly configService: ConfigService<IEnvironment, true>,
  ) {}

  private signUser(userId: string) {
    const secretKey = this.configService.get('JWT.JWT_SECRET_KEY', {
      infer: true,
    });
    const expiresIn = this.configService.get('JWT.JWT_EXPIRES_IN', {
      infer: true,
    });
    return sign({ userId }, secretKey, {
      algorithm: 'HS256',
      expiresIn: expiresIn,
    });
  }

  private async comparePassword(password?: string, hashedPassword?: string) {
    if (!password || !hashedPassword)
      throw new BadRequestException('Password are required.');
    const isValid = await compare(password, hashedPassword);
    if (!isValid) throw new BadRequestException('Invalid password');
  }

  @Public()
  async login({ username, password }: LoginDto) {
    const userService = this.moduleRef.get(UserService, { strict: false });

    const user = await userService.getUser({ username, isDeleted: false });
    if (!user) throw new BadRequestException('No user with given username');

    const { _id, password: hashedPassword } = user;

    await this.comparePassword(password, hashedPassword);

    const jwtToken = this.signUser(_id.toString());

    return {
      jwtToken,
    };
  }
}
