import {
  Controller,
  UseGuards,
  Post,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CONST_ADMIN_ROLES } from 'src/shared';
import { PlatformAuthRolesGuard } from '../../core/guards/platform-auth-roles.guard';
import { BaseController } from '../../core/base.controller';
import { ConsultBaeminReport } from './consult-baemin-report.entity';
import { ConsultBaeminReportService } from './consult-baemin-report.service';
import { CONST_ADMIN_USER } from '../../shared/platform-common-code.type';
import { AdminConsultBaeminReportCreateDto } from './dto/admin-consult-baemin-report-create.dto';

@Controller('v3')
@ApiBearerAuth()
@UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
@ApiTags('ADMIN CONSULT BAEMIN REPORT')
export class AdminConsultBaeminReportController extends BaseController {
  constructor(
    private readonly consultBaeminReportService: ConsultBaeminReportService,
  ) {
    super();
  }

  /**
   * create for admin
   * @param consultId
   * @param adminConsultBaeminReportCreateDto
   * @returns
   */
  @Post('/admin/consult-result/:id([0-9]+)/consult-baemin-report')
  async createForAdmin(
    @Param('id', ParseIntPipe) consultId: number,
    @Body()
    adminConsultBaeminReportCreateDto: AdminConsultBaeminReportCreateDto,
  ): Promise<ConsultBaeminReport> {
    return await this.consultBaeminReportService.createReportForAdmin(
      consultId,
      adminConsultBaeminReportCreateDto,
    );
  }
}
