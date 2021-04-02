import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { YN } from 'src/common';
import { BaseService, BrandAiException } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { ConsultResult } from '../consult-result/consult-result.entity';
import {
  AdminReservationCreateDto,
  AdminReservationUpdateDto,
  ReservationCheckDto,
  ReservationCheckTimeDto,
  ReservationCreateDto,
  ReservationListDto,
  ReservationUpdateDto,
} from './dto';
import { Reservation } from './reservation.entity';
import Axios from 'axios';
import { RESERVATION_HOURS, RESERVATION_HOURS_JSON } from 'src/shared';
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
    req?: Request,
  ): Promise<Reservation> {
    const checkReservation = await this.reservationRepo.findOne({
      where: {
        reservationCode: reservationCreateDto.reservationCode,
        isCancelYn: YN.NO,
      },
    });
    if (checkReservation) {
      checkReservation.isCancelYn = YN.YES;
      await this.reservationRepo.save(checkReservation);
      let newReservation = new Reservation(reservationCreateDto);
      newReservation.name = checkReservation.name;
      newReservation.phone = checkReservation.phone;
      newReservation.consultId = checkReservation.consultId;
      newReservation = await this.reservationRepo.save(newReservation);
      return newReservation;
    } else {
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
  }

  /**
   * create for admin
   * @param adminReservationCreateDto
   */
  async createForAdmin(
    adminReservationCreateDto: AdminReservationCreateDto,
    req?: Request,
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
    req?: Request,
  ): Promise<Reservation> {
    const reservation = await this.reservationRepo.findOne({
      where: { id: reservationId, isCancelYn: YN.NO },
    });
    if (!reservation) {
      throw new BrandAiException('reservation.notFoundOrCancelled');
    }
    reservation.isCancelYn = YN.YES;
    await this.reservationRepo.save(reservation);
    // reservation = reservation.set(adminReservationUpdateDto);
    let newReservation = new Reservation(adminReservationUpdateDto);
    newReservation = await this.reservationRepo.save(newReservation);
    // send update slack
    // send update message - reservation from to when

    return newReservation;
  }

  /**
   * reservation update dto
   * @param reservationId
   * @param reservationUpdateDto
   */
  async updateForUser(
    reservationId: number,
    reservationUpdateDto: ReservationUpdateDto,
    req?: Request,
  ): Promise<Reservation> {
    const checkIfValid = await this.__check_reservation_code(
      reservationUpdateDto.phone,
      reservationUpdateDto.reservationCode,
    );
    if (!checkIfValid) {
      throw new BrandAiException('reservation.notFoundOrCancelled');
    }
    let reservation = await this.reservationRepo.findOne({
      where: {
        reservationCode: reservationUpdateDto.reservationCode,
        phone: reservationUpdateDto.phone,
        id: reservationId,
      },
    });
    if (!reservation) {
      throw new BrandAiException('reservation.notFound');
    }
    reservation.isCancelYn = YN.YES;
    reservation = await this.reservationRepo.save(reservation);
    let newReservation = new Reservation(reservationUpdateDto);
    newReservation = await this.reservationRepo.save(newReservation);
    // send slack
    // send message
    return newReservation;
  }

  /**
   * delete for admin
   * @param reservationId
   */
  async deleteForAdmin(
    reservationId: number,
    req?: Request,
  ): Promise<Reservation> {
    let reservation = await this.reservationRepo.findOne(reservationId);
    if (reservation.isCancelYn === YN.YES) {
      throw new BrandAiException('reservation.notFoundOrCancelled');
    }
    reservation.isCancelYn = YN.YES;
    reservation = await this.reservationRepo.save(reservation);
    // send slack and message about deleted
    return reservation;
  }

  /**
   * reservation delete for user
   * @param reservationId
   * @param reservationCheckDto
   */
  async deleteForUser(
    reservationId: number,
    reservationCheckDto: ReservationCheckDto,
    req?: Request,
  ): Promise<Reservation> {
    const checkIfValid = await this.__check_reservation_code(
      reservationCheckDto.phone,
      reservationCheckDto.reservationCode,
    );
    if (!checkIfValid) {
      throw new BrandAiException('reservation.notFoundOrCancelled');
    }
    let reservation = await this.reservationRepo.findOne(reservationId);
    reservation.isCancelYn = YN.YES;
    reservation = await this.reservationRepo.save(reservation);
    // send slack and message about deleted

    return reservation;
  }

  /**
   * find all for user
   * @param reservationListDto
   */
  async findAllForUser(
    reservationListDto: ReservationListDto,
  ): Promise<Reservation[] | BrandAiException> {
    const qb = await this.reservationRepo
      .createQueryBuilder('reservation')
      .CustomInnerJoinAndSelect(['consultResult'])
      .where('reservation.reservationCode = :reservationCode', {
        reservationCode: reservationListDto.reservationCode,
      })
      .andWhere('reservation.isCancelYn = :isCancelYn', { isCancelYn: YN.NO })
      .getMany();

    if (qb.length < 1) {
      throw new BrandAiException('reservation.notFound');
    } else {
      return qb;
    }
  }

  /**
   * get google calendar dates for Korean holiday
   */
  async getGoogleCalendarHolidays() {
    const thisYear = new Date().getFullYear();
    const dates = [];
    const events = await Axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/ko.south_korea%23holiday%40group.v.calendar.google.com/events?key=${process.env.GOOGLE_API_KEY}`,
    );
    events.data.items.map(item => {
      const firstFourDigit = item.id.substr(0, 4);
      // console.log(firstFourDigit, thisYear);
      if (firstFourDigit != thisYear) {
        const index = events.data.items.indexOf(item);
        events.data.items.splice(index, 1);
      } else {
        const date: any = {
          start: item.start.date,
          color: '#ff9f89',
          display: 'background',
        };
        dates.push(date);
      }
    });

    return dates;
  }

  /**
   * get available time for each reservation date
   * @param reservationCheckTimeDto
   */
  async checkAvailableTimeSlots(
    reservationCheckTimeDto: ReservationCheckTimeDto,
  ) {
    const resultArray = RESERVATION_HOURS_JSON;
    const availableTimeSlots: RESERVATION_HOURS[] = [];
    const reservations = await this.reservationRepo
      .createQueryBuilder('reservation')
      .where('reservation.reservationDate like :reservationDate', {
        reservationDate: `${reservationCheckTimeDto.reservationDate}%`,
      })
      .andWhere('reservation.isCancelYn = :isCancelYn', { isCancelYn: YN.NO })
      .getMany();
    reservations.map(reservation => {
      availableTimeSlots.push(reservation.reservationTime);
    });

    const count = {};
    availableTimeSlots.forEach(i => {
      count[i] = (count[i] || 0) + 1;
    });
    const returnArray = [];
    Object.keys(count).forEach(counted => {
      if (count[counted] >= 2) {
        returnArray.push({ value: counted, available: false });
      }
    });
    returnArray.map(array => {
      resultArray.map(arr => {
        if (array.value === arr.value) {
          const index = resultArray.indexOf(arr);
          resultArray[index].available = false;
        }
      });
    });
    return resultArray;
    // if (returnArray.length > 0) {
    //   returnArray.map(array => {
    //     const index = resultArray.indexOf(array);
    //     resultArray.splice(index, 1);
    //   });
    // }
    // if (returnArray.length === 0) {
    //   return { available: false, hours: [...CONST_RESERVATION_HOURS] };
    // } else {
    //   return resultArray;
    // }
  }

  /**
   * check if reservation is valid
   * @param name
   * @param phone
   * @param reservationCode
   */
  private async __check_reservation_code(
    phone: string,
    reservationCode: string,
  ): Promise<boolean> {
    const checkIfReservationCodeIsValid = await this.reservationRepo.find({
      where: {
        reservationCode: reservationCode,
        phone: phone,
        isCancelYn: YN.NO,
      },
    });
    if (
      checkIfReservationCodeIsValid &&
      checkIfReservationCodeIsValid.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }
}
