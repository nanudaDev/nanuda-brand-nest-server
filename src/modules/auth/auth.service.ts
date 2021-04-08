import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { JwtConfigService } from 'src/config';
import { BaseService, BaseUserEntity, BrandAiException } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { AdminLoginDto } from './dto';
import { PasswordService } from './password.service';
import { UserSigninPayload, UserType } from './types';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(PlatformAdmin, 'platform')
    private readonly platformAdminRepo: Repository<PlatformAdmin>,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
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
   * validate by id for admin
   * @param id
   */
  async validateAdminById(id: number): Promise<Admin> {
    return await this.entityManager.getRepository(Admin).findOne(id);
  }

  async validatePlatforAdminById(id: number): Promise<PlatformAdmin> {
    return await this.platformAdminRepo.findOne(id);
  }

  /**
   * validate admin by token
   * @param token
   */
  async validateAdminByToken(token: string) {
    if (!token) {
      throw new BrandAiException('auth.noToken');
    }
    const payload = await this.jwtService.decode(token);
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
      userType: UserType.ADMIN || UserType.NON_REGISTERED_USER,
    };
    return this.jwtService.sign({ ...userSignInInfo, ...extend }, options);
  }
}
