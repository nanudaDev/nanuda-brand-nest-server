import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseController } from 'src/core';
import {
  AdminReservationCreateDto,
  AdminReservationUpdateDto,
  ReservationDeleteReasonDto,
} from './dto';
import { Reservation } from './reservation.entity';
import { ReservationService } from './reservation.service';

@Controller()
@ApiTags('ADMIN RESERVATION')
export class AdminReservationController extends BaseController {
  constructor(private readonly reservationService: ReservationService) {
    super();
  }

  /**
   * create for admin
   * @param adminReservationCreateDto
   */
  @Post('/admin/reservation')
  async createReservation(
    @Body() adminReservationCreateDto: AdminReservationCreateDto,
    @Req() req: Request,
  ): Promise<Reservation> {
    return await this.reservationService.createForAdmin(
      adminReservationCreateDto,
      req,
    );
  }

  /**
   * update for admin
   * @param id
   * @param adminReservationUpdateDto
   */
  @Patch('/admin/reservation/:id([0-9]+)')
  async updateForAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminReservationUpdateDto: AdminReservationUpdateDto,
    @Req() req: Request,
  ): Promise<Reservation> {
    return await this.reservationService.updateForAdmin(
      id,
      adminReservationUpdateDto,
      req,
    );
  }

  /**
   * delete for admi
   * @param id
   * @param reservationDeleteReasonDto
   * @param req
   */
  @Delete('/admin/reservation/:id([0-9]+)')
  async deleteForAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() reservationDeleteReasonDto: ReservationDeleteReasonDto,
    @Req() req: Request,
  ) {
    return await this.reservationService.deleteForAdmin(
      id,
      reservationDeleteReasonDto,
      req,
    );
  }
}
