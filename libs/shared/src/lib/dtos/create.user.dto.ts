import { BaseUserDto } from './base.user.dto';
import { IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends BaseUserDto {
  @ApiProperty({
    example: 'StrongP@ssword123',
    required: true,
  })
  @IsStrongPassword()
  readonly password!: string;
}
