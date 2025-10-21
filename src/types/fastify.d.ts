import { IReqUser } from 'src/user.types';

declare module 'fastify' {
  export interface FastifyRequest {
    user: IReqUser;
  }
}
