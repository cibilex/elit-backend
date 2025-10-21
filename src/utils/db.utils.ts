import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export const validateObjectId = (id: string) => {
  const isValid = isValidObjectId(id);
  if (!isValid) throw new BadRequestException('Please enter a valid İD');
};
