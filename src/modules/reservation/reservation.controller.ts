import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseController } from 'src/core';
import {
  ReservationCheckDto,
  ReservationCreateDto,
  ReservationListDto,
  ReservationUpdateDto,
} from './dto';
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
    @Req() req: Request,
  ): Promise<Reservation> {
    return await this.reservationService.createForUser(
      reservationCreateDto,
      req,
    );
  }

  /**
   * find all for user
   * @param reservationListDto
   */
  @Get('/reservation')
  async findAll(
    @Query() reservationListDto: ReservationListDto,
  ): Promise<Reservation[]> {
    return await this.reservationService.findAllForUser(reservationListDto);
  }

  /**
   * update for user
   * @param reservationId
   * @param reservationUpdateDto
   * @param req
   */
  @Patch('/reservation/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) reservationId: number,
    @Body() reservationUpdateDto: ReservationUpdateDto,
    @Req() req?: Request,
  ): Promise<Reservation> {
    return await this.reservationService.updateForUser(
      reservationId,
      reservationUpdateDto,
      req,
    );
  }

  /**
   * delete for user
   * @param reservationId
   * @param reservationCheckDto
   * @param req
   */
  @Delete('/reservation/:id([0-9]+)')
  async deleteReservation(
    @Param('id', ParseIntPipe) reservationId: number,
    @Query() reservationCheckDto: ReservationCheckDto,
    @Req() req: Request,
  ): Promise<Reservation> {
    return await this.reservationService.deleteForUser(
      reservationId,
      reservationCheckDto,
      req,
    );
  }
}
