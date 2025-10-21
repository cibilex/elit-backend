import { ConfigService } from '@nestjs/config';
import { UserService } from './../v1/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { Public } from 'src/decorators/public.decorators';
import { IEnvironment } from 'src/types/global';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { IReqUser } from 'src/user.types';
import { Auth } from 'src/decorators/auth.decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService<IEnvironment, true>,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<true> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();

    if (this.checkPublicVisibility(ctx)) return true;

    const jwtToken = this.getBearerToken(req);
    if (!jwtToken) throw new UnauthorizedException();

    const userId = this.verifyJwtToken(jwtToken);

    const user = await this.getUserInfo(userId);

    this.validateUserPermissions(ctx, user.permissions);

    req.user = user;
    return true;
  }

  private validateUserPermissions(
    ctx: ExecutionContext,
    userPermissions: number,
  ) {
    const requiredPermissions =
      this.reflector.getAllAndOverride(Auth, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) || [];

    const hasPermission = requiredPermissions.every(
      (permission) => userPermissions & permission,
    );
    if (!hasPermission) throw new ForbiddenException(); // 401 değil 403 gönderecektir.
  }

  private async getUserInfo(id: string): Promise<IReqUser> {
    const userService = this.moduleRef.get(UserService, { strict: false });

    const user = await userService.getUser({ id });
    if (!user) throw new UnauthorizedException();

    const { userType, permissions, _id } = user;
    return {
      userType,
      permissions,
      _id,
    };
  }

  private verifyJwtToken(jwtToken: string): string {
    try {
      const decoded = verify(
        jwtToken,
        this.configService.get('JWT.JWT_SECRET_KEY', { infer: true }),
      ) as { userId: string };
      if (!decoded || !decoded.userId) throw new UnauthorizedException();

      return decoded.userId;
    } catch (err) {
      if (
        !(err instanceof JsonWebTokenError && err.name == 'TokenExpiredError')
      ) {
        Logger.error(err);
      }
      throw new UnauthorizedException();
    }
  }

  private getBearerToken(req: FastifyRequest) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.substring(7);
    if (token.length < 6) return false;
    return token;
  }

  private checkPublicVisibility(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride(Public, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    return isPublic;
  }
}
