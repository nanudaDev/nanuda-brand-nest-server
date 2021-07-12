import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { PlatformAuthRolesGuard } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { BaseController } from '../../core/base.controller';
import { AdminConsultResultV3ListDto } from './dto/admin-consult-result-v3-list.dto';
import {
  PaginatedRequest,
  PaginatedResponse,
} from '../../common/interfaces/pagination.type';
import { ConsultResultV3 } from './consult-result-v3.entity';
import { ConsultResultV3Service } from './consult-result-v3.service';
import { Patch, Post } from '@nestjs/common';
import { UserInfo } from 'src/common';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { AdminConsultResultV3UpdateDto } from './dto/admin-consult-result-v3-update.dto';
import { AdminConsultResultV3CreateDto } from './dto/admin-consult-result-v3-create.dto';
import { Request } from 'express';
import { AdminConsultResultV3SendMessageDto } from './dto/admin-consult-result-v3-send-message.dto';
import {
  AdminConsultResultV3BetweenDto,
  MeetingsResponseDto,
  MonthlyRequestDto,
} from './dto';

@Controller('v3')
@ApiTags('ADMIN CONSULT RESULT V3')
@ApiBearerAuth()
@UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
export class AdminConsultResultV3Controller extends BaseController {
  constructor(private readonly consultService: ConsultResultV3Service) {
    super();
  }

  /**
   * find all for admin
   * @param adminConsultResultV3ListDto
   * @param pagination
   * @returns
   */
  @ApiOperation({ description: '관리자 상담 신청서 검색/리스트' })
  @Get('/admin/consult-response')
  async findAll(
    @Query() adminConsultResultV3ListDto: AdminConsultResultV3ListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ConsultResultV3>> {
    return await this.consultService.findAllForAdmin(
      adminConsultResultV3ListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param id
   * @returns
   */
  @ApiOperation({ description: '관리자 상담 신청서 찾기' })
  @Get('/admin/consult-response/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ConsultResultV3> {
    return await this.consultService.findOneForAdmin(id);
  }

  /**
   * 본인으로 정하기
   * @param admin
   * @param id
   * @returns
   */
  @ApiOperation({ description: '관리자 담당자 본인으로 ' })
  @Patch('/admin/consult-response/:id([0-9]+)/assign-myself')
  async assignMyself(
    @UserInfo() admin: PlatformAdmin,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ConsultResultV3> {
    return await this.consultService.assignMyself(id, admin.no);
  }

  /**
   * update consult for admin
   * @param id
   * @param adminConsultResultV3UpdateDto
   * @returns
   */
  @ApiOperation({ description: '관리자 상담 업데이트' })
  @Patch('/admin/consult-response/:id([0-9]+)')
  async updateForAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminConsultResultV3UpdateDto: AdminConsultResultV3UpdateDto,
  ): Promise<ConsultResultV3> {
    return await this.consultService.updateForAdmin(
      id,
      adminConsultResultV3UpdateDto,
    );
  }

  /**
   * create for admin
   * @param adminConsultResultV3CreateDto
   * @param admin
   * @returns
   */
  @ApiOperation({ description: '관리자 상담 생성' })
  @Post('/admin/consult-response')
  async createForAdmin(
    @Body() adminConsultResultV3CreateDto: AdminConsultResultV3CreateDto,
    @UserInfo() admin: PlatformAdmin,
    @Req() req: Request,
  ): Promise<ConsultResultV3> {
    return await this.consultService.createForAdmin(
      adminConsultResultV3CreateDto,
      admin.no,
    );
  }

  /**
   * send message to users
   * @param id
   * @param adminConsultResultV3MessageLogDto
   * @param admin
   * @param req
   * @returns
   */
  @ApiOperation({ description: '관리자가 사용자한테 문자 보내기' })
  @Post('/admin/consult-response/:id([0-9]+)/send-message')
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    adminConsultResultV3MessageLogDto: AdminConsultResultV3SendMessageDto,
    @UserInfo() admin: PlatformAdmin,
    @Req() req: Request,
  ): Promise<ConsultResultV3> {
    return await this.consultService.sendMessageForAdmin(
      id,
      admin.no,
      adminConsultResultV3MessageLogDto,
      req,
    );
  }

  /**
   *
   * @param meetingsRequestDto
   * @returns
   */
  @ApiOperation({ description: '해당 년, 월 미팅 리스트' })
  @Get('/admin/consult-response/get-meetings-monthly')
  async getMeetingsMonthly(
    @Query() monthlyRequestDto: MonthlyRequestDto,
  ): Promise<MeetingsResponseDto[]> {
    console.log('query date', monthlyRequestDto);
    return await this.consultService.getMeetingsMonthly(monthlyRequestDto);
  }

  @ApiOperation({ description: '해당 년, 월 상담 리스트' })
  @Get('/admin/consult-response/get-consults-monthly')
  async getConsultsMonthly(
    @Query() monthlyRequestDto: MonthlyRequestDto,
  ): Promise<ConsultResultV3[]> {
    console.log('query date', monthlyRequestDto);
    return await this.consultService.getConsultsMonthly(monthlyRequestDto);
  }

  @ApiOperation({ description: '시작일부터 종료일까지 상담 리스트' })
  @Get('/admin/consult-response/get-consults-between')
  async getConsultsBetweenDates(
    @Query() adminConsultResultV3BetweenDto: AdminConsultResultV3BetweenDto,
  ): Promise<ConsultResultV3[]> {
    console.log('query date', adminConsultResultV3BetweenDto);
    return await this.consultService.getConsultsBetweenDates(
      adminConsultResultV3BetweenDto,
    );
  }
}
