import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService, BrandAiException } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { ConsultResult } from '../consult-result/consult-result.entity';
import {
  AdminReservationCreateDto,
  AdminReservationUpdateDto,
  ReservationCreateDto,
} from './dto';
import { Reservation } from './reservation.entity';

@Injectable()
export class ReservationService extends BaseService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(ConsultResult)
    private readonly consultRepo: Repository<ConsultResult>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * create for user
   * @param reservationCreateDto
   */
  async createForUser(
    reservationCreateDto: ReservationCreateDto,
  ): Promise<Reservation> {
    const consult = await this.entityManager
      .getRepository(ConsultResult)
      .findOne({
        where: { reservationCode: reservationCreateDto.reservationCode },
      });

    if (!consult) {
      throw new BrandAiException('consultResult.notFound');
    }
    let reservation = new Reservation(reservationCreateDto);
    reservation.name = consult.name;
    reservation.phone = consult.phone;
    reservation.consultId = consult.id;
    const checkIfTimeSlotExceeded = await this.reservationRepo.find({
      where: {
        reservationDate: reservationCreateDto.reservationDate,
        reservationTime: reservationCreateDto.reservationTime,
      },
    });
    if (checkIfTimeSlotExceeded && checkIfTimeSlotExceeded.length > 1) {
      throw new BrandAiException('consultResult.exceedTimeSlot');
    }
    const checkIfAppliedToSameDateTwice = await this.reservationRepo.find({
      where: {
        reservationDate: reservationCreateDto.reservationDate,
        reservationCode: reservationCreateDto.reservationCode,
      },
    });
    if (
      checkIfAppliedToSameDateTwice &&
      checkIfAppliedToSameDateTwice.length > 2
    ) {
      throw new BrandAiException('consultResult.exceedMaxAlotted');
    }
    reservation = await this.reservationRepo.save(reservation);
    // send slack
    // send message
    return reservation;
  }

  /**
   * create for admin
   * @param adminReservationCreateDto
   */
  async createForAdmin(
    adminReservationCreateDto: AdminReservationCreateDto,
  ): Promise<Reservation> {
    const checkConsult = await this.consultRepo.findOne(
      adminReservationCreateDto.consultId,
    );
    if (!checkConsult) {
      throw new BrandAiException('consultResult.notFound');
    }
    let reservation = new Reservation(adminReservationCreateDto);
    const checkIfTimeSlotExceeded = await this.reservationRepo.find({
      where: {
        reservationDate: adminReservationCreateDto.reservationDate,
        reservationTime: adminReservationCreateDto.reservationTime,
      },
    });
    if (checkIfTimeSlotExceeded && checkIfTimeSlotExceeded.length > 1) {
      throw new BrandAiException('consultResult.exceedTimeSlot');
    }
    const checkIfAppliedToSameDateTwice = await this.reservationRepo.find({
      where: {
        reservationDate: adminReservationCreateDto.reservationDate,
        reservationCode: adminReservationCreateDto.reservationCode,
      },
    });
    if (
      checkIfAppliedToSameDateTwice &&
      checkIfAppliedToSameDateTwice.length > 2
    ) {
      throw new BrandAiException('consultResult.exceedMaxAlotted');
    }
    reservation = await this.reservationRepo.save(reservation);
    // send message
    // send slack
    return reservation;
  }

  /**
   * update reservation
   * @param reservationId
   * @param adminReservationUpdateDto
   */
  async updateForAdmin(
    reservationId: number,
    adminReservationUpdateDto: AdminReservationUpdateDto,
  ): Promise<Reservation> {
    let reservation = await this.reservationRepo.findOne({
      where: { id: reservationId, isCancelYn: YN.NO },
    });
    if (!reservation) {
      throw new BrandAiException('reservation.notFoundOrCancelled');
    }
    reservation = reservation.set(adminReservationUpdateDto);
    reservation = await this.reservationRepo.save(reservation);
    // send update slack
    // send update message

    return reservation;
  }
}
