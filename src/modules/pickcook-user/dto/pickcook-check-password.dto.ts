import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MinLength } from 'class-validator';
import { IsPassword } from 'src/common';

export class PickcookUserCheckPasswordDto {
  @ApiProperty()
  @IsPassword()
  @MinLength(8)
  @Expose()
  password: string;
}
