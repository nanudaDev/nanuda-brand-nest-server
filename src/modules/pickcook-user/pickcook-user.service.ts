import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService, BrandAiException } from 'src/core';
import { EntityManager, getConnection, Repository } from 'typeorm';
import { SmsNotificationService } from '../sms-notification/sms-notification.service';
import {
  AdminPickcookUserCreateDto,
  AdminPickcookUserListDto,
  PickcookUserCreateDto,
  PickcookUserUpdateDto,
} from './dto';
import { PickcookUser } from './pickcook-user.entity';
import { Request } from 'express';
import { PickCookUserHistory } from '../pickcook-user-history/pickcook-user-history.entity';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { NanudaUser } from '../platform-module/nanuda-user/nanuda-user.entity';
import { PasswordService } from '../auth';
import { admin } from 'googleapis/build/src/apis/admin';

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
    pickcookUserCreateDto: PickcookUserCreateDto | AdminPickcookUserCreateDto,
    adminId?: number,
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
        phone: pickcookUserCreateDto.phone,
      });
      let newUser = new PickcookUser(pickcookUserCreateDto);
      if (checkIfNanudaUser) newUser.isNanudaUser = YN.YES;
      if (adminId) newUser.adminId = adminId;
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
    adminId?: number,
    req?: Request,
  ): Promise<PickcookUser> {
    const pickcookUser = await this.pickcookUserRepo.findOne(id);
    if (!pickcookUser) {
      throw new BrandAiException('pickcookUser.notFound');
    }
    if (
      pickcookUserUpdateDto.username &&
      pickcookUser.username !== pickcookUserUpdateDto.username
    ) {
      await this.__check_duplicate_property(
        pickcookUser.id,
        'username',
        pickcookUserUpdateDto.username,
      );
    }
    if (
      pickcookUserUpdateDto.email &&
      pickcookUser.email !== pickcookUserUpdateDto.email
    ) {
      await this.__check_duplicate_property(
        pickcookUser.id,
        'email',
        pickcookUserUpdateDto.email,
      );
      // send email verification
    }
    if (
      pickcookUserUpdateDto.phone &&
      pickcookUser.phone !== pickcookUserUpdateDto.phone
    ) {
      await this.__check_duplicate_property(
        pickcookUser.id,
        'phone',
        pickcookUserUpdateDto.phone,
      );
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
      if (adminId) updatedUser.adminId = adminId;
      updatedUser = await entityManager.save(updatedUser);
      await this.__create_user_history(updatedUser);
      return updatedUser;
    });
    return user;
  }

  /**
   * hard delete user
   * @param id
   */
  async hardDeleteUser(id: number) {
    await getConnection()
      .createQueryBuilder()
      .AndWhereHardDelete('PickcookUser', `id`, id);

    // delete user history
    await getConnection()
      .createQueryBuilder()
      .AndWhereHardDelete('PickcookUserHistory', 'pickcookUserId', id);
  }

  /**
   * check username for user
   * @param username
   */
  async checkUserName(username: string) {
    const checkIfAllowed = await this.pickcookUserRepo.findOne({
      username,
    });
    if (checkIfAllowed) {
      throw new BrandAiException('pickcookUser.usernameTaken');
    }
    return checkIfAllowed;
  }

  /**
   * check user email
   * @param email
   */
  async checkEmail(email: string) {
    const checkIfAllowed = await this.pickcookUserRepo.findOne({ email });
    if (checkIfAllowed) {
      throw new BrandAiException('pickcookUser.emailTaken');
    }

    return checkIfAllowed;
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
      phone,
    });
    if (checkIfAllowed) {
      throw new BrandAiException('pickcookUser.phoneTaken');
    }

    return checkIfAllowed;
  }

  /**
   * find all for admin
   * @param adminPickcookUserListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminPickcookUserListDto: AdminPickcookUserListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<PickcookUser>> {
    const qb = this.pickcookUserRepo
      .createQueryBuilder('pickcookUser')
      .AndWhereLike(
        'pickcookUser',
        'name',
        adminPickcookUserListDto.name,
        adminPickcookUserListDto.exclude('name'),
      )
      .AndWhereLike(
        'pickcookUser',
        'email',
        adminPickcookUserListDto.email,
        adminPickcookUserListDto.exclude('email'),
      )
      .AndWhereLike(
        'pickcookUser',
        'username',
        adminPickcookUserListDto.username,
        adminPickcookUserListDto.exclude('username'),
      )
      .AndWhereLike(
        'pickcookUser',
        'phone',
        adminPickcookUserListDto.phone,
        adminPickcookUserListDto.exclude('phone'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminPickcookUserListDto);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<PickcookUser> {
    const user = await this.pickcookUserRepo.findOne(id);
    if (!user) throw new BrandAiException('pickcookUser.notFound');
    return user;
  }

  /**
   * find all history for admin
   * @param id
   * @param pagination
   * @returns
   */
  async findAllHistories(
    id: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<PickCookUserHistory>> {
    const qb = this.pickcookUserHistoryRepo
      .createQueryBuilder('history')
      .where('history.pickcookUserId = :pickcookUserId', { pickcookUserId: id })
      .Paginate(pagination);
    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
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

  /**
   * check for duplicate property values when updating
   * @param id
   * @param property
   * @param value
   */
  private async __check_duplicate_property(
    id: number,
    property: string,
    value: string,
  ) {
    const qb = await this.pickcookUserRepo
      .createQueryBuilder('pickcookUser')
      .where(`pickcookUser.id <> ${id}`)
      .andWhere(`pickcookUser.${property} = :property`, {
        property: `${value}`,
      })
      .getMany();

    if (qb && qb.length > 0) {
      return false;
    }

    return true;
  }
}
