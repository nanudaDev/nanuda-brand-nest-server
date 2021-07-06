import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from '../../../core/base.dto';
import { ConsultResultV3MessageLog } from '../../consult-result-v3-message-log/consult-result-v3-message-log.entity';
export class AdminConsultResultV3SendMessageDto
  extends BaseDto<AdminConsultResultV3SendMessageDto>
  implements Partial<ConsultResultV3MessageLog> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  message: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  googleMeetUrl?: string;
}
