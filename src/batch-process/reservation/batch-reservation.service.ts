import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { Reservation } from 'src/modules/reservation/reservation.entity';
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

  // @Cron(CronExpression.EVERY_5_SECONDS)
  async deleteAllReservations() {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
  }
}
