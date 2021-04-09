import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService, BrandAiException } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { SmsNotificationService } from '../sms-notification/sms-notification.service';
import { PickcookUserCreateDto, PickcookUserUpdateDto } from './dto';
import { PickcookUser } from './pickcook-user.entity';
import { Request } from 'express';
import { PickCookUserHistory } from '../pickcook-user-history/pickcook-user-history.entity';
import { YN } from 'src/common';
import { NanudaUser } from '../platform-module/nanuda-user/nanuda-user.entity';
import { PasswordService } from '../auth';

@Injectable()
export class PickcookUserService extends BaseService {
  constructor(
    @InjectRepository(PickcookUser)
    private readonly pickcookUserRepo: Repository<PickcookUser>,
    @InjectRepository(PickCookUserHistory)
    private readonly pickcookUserHistoryRepo: Repository<PickCookUserHistory>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(NanudaUser, 'platform')
    private readonly nanudaUserRepo: Repository<NanudaUser>,
    private readonly smsNotificationService: SmsNotificationService,
    private readonly passwordService: PasswordService,
  ) {
    super();
  }

  /**
   * create new pickcook user
   * @param pickcookUserCreateDto
   * @param req
   */
  async createPickcookUser(
    pickcookUserCreateDto: PickcookUserCreateDto,
    req?: Request,
  ): Promise<PickcookUser> {
    if (
      pickcookUserCreateDto.phone &&
      pickcookUserCreateDto.phone.includes('-')
    ) {
      pickcookUserCreateDto.phone = pickcookUserCreateDto.phone.replace(
        /-/g,
        '',
      );
    }
    pickcookUserCreateDto.password = await this.passwordService.hashPassword(
      pickcookUserCreateDto.password,
    );
    pickcookUserCreateDto = pickcookUserCreateDto.setAttribute(
      this.__create_new_dates_for_agreements(
        pickcookUserCreateDto.serviceAgreeYn,
        pickcookUserCreateDto.privacyAgreeYn,
        pickcookUserCreateDto.marketingAgreeYn,
      ),
    );
    console.log(pickcookUserCreateDto);
    if (pickcookUserCreateDto.username) {
      await this.checkUserName(pickcookUserCreateDto.username);
    }
    if (pickcookUserCreateDto.email) {
      await this.checkEmail(pickcookUserCreateDto.email);
    }
    if (pickcookUserCreateDto.phone) {
      await this.checkPhone(pickcookUserCreateDto.phone);
    }

    const user = await this.entityManager.transaction(async entityManager => {
      const checkIfNanudaUser = await this.nanudaUserRepo.findOne({
        where: { phone: pickcookUserCreateDto.phone },
      });
      let newUser = new PickcookUser(pickcookUserCreateDto);
      if (checkIfNanudaUser) {
        newUser.isNanudaUser = YN.YES;
      }
      newUser = await entityManager.save(newUser);
      //   create history
      await this.__create_user_history(newUser);
      return newUser;
    });
    return user;
  }

  /**
   * update user
   * @param id
   * @param pickcookUserUpdateDto
   */
  async updatePickcookUser(
    id: number,
    pickcookUserUpdateDto: PickcookUserUpdateDto,
  ): Promise<PickcookUser> {
    const pickcookUser = await this.pickcookUserRepo.findOne(id);
    if (!pickcookUser) {
      throw new BrandAiException('pickcookUser.notFound');
    }
    if (
      pickcookUserUpdateDto.username &&
      pickcookUser.username !== pickcookUserUpdateDto.username
    ) {
      await this.checkUserName(pickcookUserUpdateDto.username);
    }
    if (
      pickcookUserUpdateDto.email &&
      pickcookUser.email !== pickcookUserUpdateDto.email
    ) {
      await this.checkEmail(pickcookUserUpdateDto.email);
      // send email verification
    }
    if (
      pickcookUserUpdateDto.phone &&
      pickcookUser.phone !== pickcookUserUpdateDto.phone
    ) {
      await this.checkPhone(pickcookUserUpdateDto.phone);
      // send phone verification
    }
    const user = await this.entityManager.transaction(async entityManager => {
      let updatedUser = pickcookUser.set(pickcookUserUpdateDto);
      // needs refactoring
      if (
        updatedUser.serviceAgreeYn !== pickcookUser.serviceAgreeYn &&
        updatedUser.serviceAgreeYn === YN.NO
      ) {
        updatedUser.serviceDisagreeDate = new Date();
      }
      if (
        updatedUser.privacyAgreeYn !== pickcookUser.privacyAgreeYn &&
        updatedUser.privacyAgreeYn === YN.NO
      ) {
        updatedUser.privacyAgreeDate = new Date();
      }
      if (
        updatedUser.marketingAgreeYn !== pickcookUser.marketingAgreeYn &&
        updatedUser.marketingAgreeYn === YN.NO
      ) {
        updatedUser.marketingAgreeDate = new Date();
      }
      updatedUser = await entityManager.save(updatedUser);
      await this.__create_user_history(updatedUser);
      return updatedUser;
    });
    return user;
  }

  /**
   * check username for user
   * @param username
   */
  async checkUserName(username: string) {
    const checkIfAllowed = await this.pickcookUserRepo.findOne({
      where: { username: username },
    });
    if (checkIfAllowed) {
      throw new BrandAiException('pickcookUser.usernameTaken');
    }
  }

  /**
   * check user email
   * @param email
   */
  async checkEmail(email: string) {
    const checkIfAllowed = await this.pickcookUserRepo.findOne({
      where: { email: email },
    });
    if (checkIfAllowed) {
      throw new BrandAiException('pickcookUser.emailTaken');
    }
  }

  /**
   * check phone
   * @param phone
   */
  async checkPhone(phone: string) {
    if (phone && phone.includes('-')) {
      phone = phone.replace(/-/g, '');
    }
    const checkIfAllowed = await this.pickcookUserRepo.findOne({
      where: { phone: phone },
    });
    if (checkIfAllowed) {
      throw new BrandAiException('pickcookUser.phoneTaken');
    }

    return true;
  }

  /**
   * create new user history
   * @param pickcookUser
   */
  private async __create_user_history(pickcookUser: PickcookUser) {
    const newHistory = new PickCookUserHistory(pickcookUser);
    newHistory.pickcookUserId = pickcookUser.id;
    delete newHistory.id;
    await this.pickcookUserHistoryRepo.save(newHistory);
  }

  /**
   * create new dates for agreements
   * @param service
   * @param privacy
   * @param marketing
   */
  private __create_new_dates_for_agreements(
    service: YN,
    privacy: YN,
    marketing: YN,
  ) {
    const arrParams = [service, privacy, marketing];
    const arrDates = [];
    arrParams.map(arr => {
      if (arr === YN.YES) {
        arrDates.push(new Date());
      } else {
        arrDates.push(null);
      }
    });
    return {
      serviceAgreeDate: arrDates[0],
      privacyAgreeDate: arrDates[1],
      marketingAgreeDate: arrDates[2],
    };
  }
}
