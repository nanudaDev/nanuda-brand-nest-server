import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { DateFormatter } from 'src/common/utils';
import { BaseService } from 'src/core';
import {
  Reservation,
  RESERVATION_DELETE_REASON,
} from 'src/modules/reservation/reservation.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class BatchReservationService extends BaseService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectEntityManager() private readonly entityManager: EntityManager, // private readonly logger = new Logger(BatchReservationService.name),
  ) {
    super();
  }

  //   @Cron(CronExpression.EVERY_HOUR)

  @Cron(CronExpression.EVERY_30_MINUTES_BETWEEN_10AM_AND_7PM)
  // @Cron(CronExpression.EVERY_5_SECONDS)
  async deleteAllReservations() {
    const date = DateFormatter(new Date());
    const time = new Date().toLocaleTimeString().substr(0, 2);
    const qb = await this.reservationRepo
      .createQueryBuilder('reservation')
      .where('reservation.formatReservationDate = :date', { date: date })
      .andWhere('reservation.isCancelYn = :isCancelYn', { isCancelYn: YN.NO })
      .andWhere('reservation.formatReservationTime like :time', {
        time: `${time}%`,
      })
      .getMany();

    if (qb && qb.length > 0) {
      await Promise.all(
        qb.map(async q => {
          q.isCancelYn = YN.YES;
          q.deleteReason = RESERVATION_DELETE_REASON.ETC;
          q.deleteReasonEtc = 'NO SHOW';
          await this.reservationRepo.save(q);
        }),
      );
    }
  }
}
