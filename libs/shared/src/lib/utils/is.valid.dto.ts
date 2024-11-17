import { HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export async function isValidDto<T extends object>(
  dto: ClassConstructor<T>,
  data: unknown,
): Promise<boolean> {
  const instance = plainToInstance(dto, data);
  const errors = await validate(instance);

  if (errors.length > 0) {
    throw new HttpException(
      {
        errorType: 'Validation Error',
        details: errors.map((error) => ({
          property: error.property,
          constraints: Object.values(error.constraints || {}),
        })),
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  return true;
}
