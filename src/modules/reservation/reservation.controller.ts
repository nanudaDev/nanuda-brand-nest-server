import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { ReservationCreateDto } from './dto';
import { Reservation } from './reservation.entity';
import { ReservationService } from './reservation.service';

@Controller()
@ApiTags('RESERVATION')
export class ReservationController extends BaseController {
  constructor(private readonly reservationService: ReservationService) {
    super();
  }

  /**
   * create for user
   * @param reservationCreateDto
   */
  @Post('/reservation')
  async create(
    @Body() reservationCreateDto: ReservationCreateDto,
  ): Promise<Reservation> {
    return await this.reservationService.createForUser(reservationCreateDto);
  }
}
