import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Min } from 'class-validator';
import { Default } from '../decorators';

export class PaginatedResponse<Entity> {
  items: Entity[];
  totalCount: number;
}

export class PaginatedRequest {
  @ApiPropertyOptional()
  @Type(() => Number)
  @Min(0)
  @Expose()
  @Default(20)
  take?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @Expose()
  @Min(1)
  @Default(1)
  skip?: number;
}
