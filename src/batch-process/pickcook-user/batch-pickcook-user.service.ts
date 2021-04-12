import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService } from 'src/core';
import { PickCookUserHistory } from 'src/modules/pickcook-user-history/pickcook-user-history.entity';
import { PickcookUser } from 'src/modules/pickcook-user/pickcook-user.entity';
import { ACCOUNT_STATUS } from 'src/shared';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class BatchPickcookUserService extends BaseService {
  constructor(
    @InjectRepository(PickcookUser)
    private readonly pickcookUserRepo: Repository<PickcookUser>,
    @InjectRepository(PickCookUserHistory)
    private readonly pickcookUserHistoryRepo: Repository<PickCookUserHistory>,
  ) {
    super();
  }

  //   warn 90 days
  async alertUsersInactiveAccount() {
    //   get active users that haven't logged in in 275 days
    const qb = await this.pickcookUserRepo
      .createQueryBuilder('pickcookUser')
      .where('pickcookUser.accountStatus = :accountStatus', {
        accountStatus: ACCOUNT_STATUS.ACCOUNT_STATUS_ACTIVE,
      })
      .andWhere(
        `DATE(pickcookUser.lastLoginAt) <= DATE(CURDATE(), INTERVAL 275 DAY)`,
      )
      .getMany();

    if (qb && qb.length) {
      //   send them warning message
      await getConnection()
        .createQueryBuilder()
        .update(PickcookUser)
        .set({
          sentDormantWarningYn: YN.YES,
          sentDormantWarningDate: new Date(),
        })
        .where('pickcookUser.accountStatus = :accountStatus', {
          accountStatus: ACCOUNT_STATUS.ACCOUNT_STATUS_ACTIVE,
        })
        .andWhere(
          `DATE(pickcookUser.lastLoginAt) <= DATE(CURDATE(), INTERVAL 275 DAY)`,
        )
        .execute();
    }
  }
}
