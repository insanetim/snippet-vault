import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export function ValidateObjectId(
  _target: any,
  _propertyName: string,
  descriptor: PropertyDescriptor,
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const id = args[0];

    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    return method.apply(this, args);
  };

  return descriptor;
}
