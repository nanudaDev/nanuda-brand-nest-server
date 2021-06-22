import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { PickcookSmallCategoryInfo } from '../../entities';

export class AdminPickcookSmallCategoryInfoQueryDto
  implements Partial<PickcookSmallCategoryInfo> {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  sSmallCategoryCode: string;
}
