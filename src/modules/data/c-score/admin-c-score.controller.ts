import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CONST_ADMIN_USER } from 'src/shared';
import { AuthRolesGuard } from '../../../core/guards/auth-role.guard';
import { PlatformAuthRolesGuard } from '../../../core/guards/platform-auth-roles.guard';
import { BaseController } from '../../../core/base.controller';
import { CScoreService } from './c-score.service';
import { AdminCScoreAttributeCreateDto } from './dto';
import { CScoreAttribute } from '../entities';
import { AdminCScoreAttributeListDto } from './dto/admin-c-score-attribute-list.dto';
import {
  PaginatedRequest,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.type';

@Controller()
@ApiTags('ADMIN C-SCORE')
@ApiBearerAuth()
@UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
export class AdminCScoreController extends BaseController {
  constructor(private readonly cScoreService: CScoreService) {
    super();
  }

  /**
   * create new c score attribute
   * @param adminCScoreCreateDto
   * @returns
   */
  @Post('/admin/c-score')
  @ApiOperation({ description: '새로운 C-Score 생성' })
  async createForAdmin(
    @Body() adminCScoreCreateDto: AdminCScoreAttributeCreateDto,
  ): Promise<CScoreAttribute> {
    return await this.cScoreService.createCScoreAttribute(adminCScoreCreateDto);
  }

  /**
   * find all for admin
   * @param adminCScoreListdto
   * @param pagination
   * @returns
   */
  @Get('/admin/c-score')
  @ApiOperation({ description: 'C-Score 리스트' })
  async findAllForAdmin(
    @Query() adminCScoreListdto: AdminCScoreAttributeListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CScoreAttribute>> {
    return await this.cScoreService.findAllForAdmin(
      adminCScoreListdto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param id
   * @returns
   */
  @Get('/admin/c-score/:id([0-9]+)')
  @ApiOperation({ description: 'C-Score 아이디로 불러오기' })
  async findOneForAdmin(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CScoreAttribute> {
    return await this.cScoreService.findOneForAdmin(id);
  }
}
