import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, BrandAiException } from 'src/core';
import { ADMIN_STATUS } from 'src/shared';
import { Repository } from 'typeorm';
import { PasswordService } from '../auth';
import { Admin } from './admin.entity';
import { AdminModule } from './admin.module';
import { AdminCreateDto } from './dto';

@Injectable()
export class AdminService extends BaseService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    private readonly passwordService: PasswordService,
  ) {
    super();
  }

  /**
   * create new admin
   * @param adminCreateDto
   */
  async createAdmin(adminCreateDto: AdminCreateDto): Promise<Admin> {
    console.log(ADMIN_STATUS.WAITING);
    if (adminCreateDto.phone && adminCreateDto.phone.includes('-')) {
      adminCreateDto.phone = adminCreateDto.phone.replace(/-/g, '');
    }
    let newAdmin = new Admin(adminCreateDto);
    newAdmin.password = await this.passwordService.hashPassword(
      adminCreateDto.password,
    );
    console.log(newAdmin);
    newAdmin = await this.adminRepo.save(newAdmin);
    return newAdmin;
  }

  /**
   * find one admin
   */
  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepo.findOne(id);
    if (!admin) {
      throw new BrandAiException('admin.notFound');
    }
    return admin;
  }
}
