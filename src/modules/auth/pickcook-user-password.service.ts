require('dotenv').config();
import Debug from 'debug';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { basename } from 'path';
import { BaseService, BrandAiException } from 'src/core';
import { ACCOUNT_STATUS } from 'src/shared';
import { Repository } from 'typeorm';
import {
  PickcookUserCheckPasswordDto,
  PickcookUserPasswordUpdateDto,
} from '../pickcook-user/dto';
import { PickcookUser } from '../pickcook-user/pickcook-user.entity';
import { PasswordService } from './password.service';
import { UserTempSigninPayload, UserType } from './types';
import { AES, enc } from 'crypto-js';
const debug = Debug(`app:${basename(__dirname)}:${basename(__filename)}`);

@Injectable()
export class PickcookUserPasswordService extends BaseService {
  constructor(
    @InjectRepository(PickcookUser)
    private readonly pickcookUserRepo: Repository<PickcookUser>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  //   change password while logged in
  // require original password first
  /**
   * update user password while logged in
   * @param id
   * @param pickcookUserPasswordUpdateDto
   */
  async updatePassword(
    id: number,
    pickcookUserPasswordUpdateDto: PickcookUserPasswordUpdateDto,
  ): Promise<PickcookUser> {
    const user = await this.pickcookUserRepo.findOne(id);
    //   if(user.accountStatus !== ACCOUNT_STATUS.ACCOUNT_STATUS_ACTIVE) {
    //       throw new BrandAiException('')
    //   }
    if (!user) {
      throw new BrandAiException('pickcookUser.notFound');
    }
    pickcookUserPasswordUpdateDto.password = await this.passwordService.hashPassword(
      pickcookUserPasswordUpdateDto.password,
    );
    user.password = pickcookUserPasswordUpdateDto.password;
    await this.pickcookUserRepo.save(user);

    return user;
  }

  /**
   * check if user's password is correct
   * @param id
   * @param pickcookUserCheckPasswordDto
   */
  async checkPassword(
    id: number,
    pickcookUserCheckPasswordDto: PickcookUserCheckPasswordDto,
  ) {
    const user = await this.pickcookUserRepo.findOne(id);
    if (!user) {
      throw new BrandAiException('pickcookUser.notFound');
    }
    const validatePassword = await this.passwordService.validatePassword(
      pickcookUserCheckPasswordDto.password,
      user.password,
    );
    if (!validatePassword) {
      throw new BrandAiException('auth.invalidPassword');
    }

    return user;
  }

  /**
   * user forgot password to login
   * @param email
   */
  async forgotPasswordPickcookUser(email: string) {
    const user = await this.pickcookUserRepo.findOne({ email });
    if (!user) throw new BrandAiException('pickcookUser.notFound');
    return await this.__temp_sign_in_token(user);
  }

  /**
   * encrypt temp token
   * @param user
   */
  private async __temp_sign_in_token(user: PickcookUser) {
    const tempPayload: UserTempSigninPayload = {
      id: user.id,
      email: user.email,
      userType: UserType.PICKCOOK_USER,
      expiresIn: '30m',
    };
    const token = this.jwtService.sign(tempPayload);
    const encryptedToken = encodeURIComponent(
      AES.encrypt(token, process.env.JWT_SECRET).toString(),
    );
    console.log(encryptedToken);
    //   send email to user
  }
}
