import { BaseDto } from 'src/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserType } from 'src/modules/auth';
import { SmsAuth } from '../nanuda-sms-notification.entity';
import { Default } from 'src/common';

export class SmsAuthNotificationDto extends BaseDto<SmsAuthNotificationDto>
  implements Partial<SmsAuth> {
  @ApiProperty()
  @IsPhoneNumber('KR', { message: '휴대폰 번호를 정확히 입력해주세요.' })
  @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
  @Expose()
  phone: string;

  @Expose()
  @ApiPropertyOptional()
  @Default(UserType.PICKCOOK_USER)
  userType?: UserType;
}
