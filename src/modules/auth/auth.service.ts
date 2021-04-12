import { Injectable, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { JwtConfigService } from 'src/config';
import { BaseService, BaseUserEntity, BrandAiException } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { PickcookUserCheckPasswordDto } from '../pickcook-user/dto';
import { PickcookUser } from '../pickcook-user/pickcook-user.entity';
import { AdminLoginDto, PickcookUserLoginDto } from './dto';
import { PasswordService } from './password.service';
import { PickcookUserPasswordService } from './pickcook-user-password.service';
import {
  PickcookUserSigninPayload,
  UserSigninPayload,
  UserType,
} from './types';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(PickcookUser)
    private readonly pickcookUserRepo: Repository<PickcookUser>,
    @InjectRepository(PlatformAdmin, 'platform')
    private readonly platformAdminRepo: Repository<PlatformAdmin>,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly pickcookUserPasswordService: PickcookUserPasswordService,
  ) {
    super();
  }

  /**
   * Login for admin
   * @param adminLoginDto
   */
  async adminLogin(adminLoginDto: AdminLoginDto): Promise<string> {
    // remove hyphen from login credentials

    if (adminLoginDto.phone && adminLoginDto.phone.includes('-')) {
      adminLoginDto.phone = adminLoginDto.phone.replace(/-/g, '');
    }
    const admin = await this.entityManager.getRepository(Admin).findOne({
      phone: adminLoginDto.phone,
    });
    if (!admin) {
      throw new BrandAiException('admin.notFound');
    }
    if (!adminLoginDto.password) {
      throw new BrandAiException('auth.noInputPassword');
    }
    // validate hashed password
    const validatePassword = await this.passwordService.validatePassword(
      adminLoginDto.password,
      admin.password,
    );
    if (!validatePassword) {
      throw new BrandAiException('auth.invalidPassword');
    }
    const loggedInAdmin = await this.entityManager
      .getRepository(Admin)
      .findOne({
        phone: adminLoginDto.phone,
      });
    if (!loggedInAdmin) {
      throw new BrandAiException('admin.notFound');
    }
    const token = await this.sign(loggedInAdmin, {}, adminLoginDto.rememberMe);

    await this.entityManager
      .getRepository(Admin)
      .createQueryBuilder('admin')
      .update()
      .set({ lastLoginAt: new Date() })
      .where('id = :id', { id: admin.id })
      .execute();
    return token;
  }

  /**
   * login pickcook user
   */
  async pickcookLogin(
    pickcookUserLoginDto: PickcookUserLoginDto,
  ): Promise<string> {
    let user: PickcookUser;
    if (pickcookUserLoginDto.loginCredential.includes('@')) {
      user = await this.pickcookUserRepo.findOne({
        email: pickcookUserLoginDto.loginCredential,
      });
    }
    if (pickcookUserLoginDto.loginCredential.startsWith('010')) {
      pickcookUserLoginDto.loginCredential = pickcookUserLoginDto.loginCredential.replace(
        /-/g,
        '',
      );
      user = await this.pickcookUserRepo.findOne({
        phone: pickcookUserLoginDto.loginCredential,
      });
    }
    if (pickcookUserLoginDto.isUsername) {
      user = await this.pickcookUserRepo.findOne({
        username: pickcookUserLoginDto.loginCredential,
      });
    }
    if (!user) throw new BrandAiException('pickcookUser.notFound');
    const passwordCheckDto = new PickcookUserCheckPasswordDto();
    passwordCheckDto.password = pickcookUserLoginDto.password;
    await this.pickcookUserPasswordService.checkPassword(
      user.id,
      passwordCheckDto,
    );

    const token = await this.signPickcookUser(
      user,
      {},
      pickcookUserLoginDto.rememberMe,
    );
    user.lastLoginAt = new Date();
    await this.pickcookUserRepo.save(user);
    return token;
  }

  /**
   * validate by id for admin
   * @param id
   */
  async validateAdminById(id: number): Promise<Admin> {
    return await this.entityManager.getRepository(Admin).findOne(id);
  }

  /**
   * validate platform admin by id
   * @param id
   */
  async validatePlatforAdminById(id: number): Promise<PlatformAdmin> {
    return await this.platformAdminRepo.findOne({ phone: id.toString() });
  }

  /**
   * validate pickcook user by id
   * @param id
   */
  async validatePickcookUserById(id: number): Promise<PickcookUser> {
    return await this.pickcookUserRepo.findOne(id);
  }

  /**
   * validate admin by token
   * @param token
   */
  async validateAdminByToken(token: string) {
    if (!token) {
      throw new BrandAiException('auth.noToken');
    }
    const payload = this.jwtService.decode(token);
    return payload;
  }

  async validatePickcookUserByToken(token: string) {
    if (!token) {
      throw new BrandAiException('auth.noToken');
    }
    const payload = this.jwtService.decode(token);
    return payload;
  }

  /**
   * sign to jwt payload
   * @param user
   * @param extend
   */
  async sign(user: Admin, extend?: any, rememberMe?: boolean) {
    const options = rememberMe
      ? { expiresIn: process.env.JWT_REMEMBER_ME_EXPIRED_IN }
      : {};
    const userSignInInfo: UserSigninPayload = {
      _id: user.id,
      name: user.name,
      userRoles: user.userRoles,
      userStatus: user.adminStatus,
      userType: UserType.ADMIN,
    };
    return this.jwtService.sign({ ...userSignInInfo, ...extend }, options);
  }

  /**
   * sign in pickcook user
   * @param user
   * @param extend
   * @param rememberMe
   */
  async signPickcookUser(
    user: PickcookUser,
    extend?: any,
    rememberMe?: boolean,
  ) {
    const options = rememberMe
      ? { expiresIn: process.env.JWT_REMEMBER_ME_EXPIRED_IN }
      : {};
    const userSigninPayload: PickcookUserSigninPayload = {
      _id: user.id,
      email: user.email,
      phone: user.phone,
      accountStatus: user.accountStatus,
      username: user.username,
      passwordUpdateDate: user.passwordUpdateDate,
      userType: UserType.PICKCOOK_USER,
    };

    return this.jwtService.sign({ ...userSigninPayload, ...extend }, options);
  }
}
