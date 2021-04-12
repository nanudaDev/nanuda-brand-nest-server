import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class PickcookUserEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsEmail()
  email: string;
}
