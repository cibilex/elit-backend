import { FastifyRequest } from 'fastify';

export const getIpAddress = (req: FastifyRequest): string => {
  const aa = 'x-forwarded-for' in req.headers && req.headers['x-forwarded-for'];
  if (aa && typeof aa === 'string') {
    return aa.split(',').pop()?.trim() || '';
  }
  return req.socket.remoteAddress || '';
};
