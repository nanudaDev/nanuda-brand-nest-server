import { BaseDto } from 'src/core';

export class MeetingsResponseDto extends BaseDto<MeetingsResponseDto> {
  title: string;
  start: string;
}
