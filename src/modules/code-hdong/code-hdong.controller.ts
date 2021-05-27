import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { CodeHdong } from './code-hdong.entity';
import { CodeHdongService } from './code-hdong.service';
import { CodeHdongListDto } from './dto';

@Controller()
@ApiTags('CODE HDONG')
export class CodeHdongController extends BaseController {
  constructor(private readonly codeHdongService: CodeHdongService) {
    super();
  }

  /**
   * find all sido
   */
  @ApiOperation({ description: '도시별로 행정동 검색' })
  @Get('/code-hdong/sido')
  async findAllSido(): Promise<CodeHdong[]> {
    return await this.codeHdongService.findAllSido();
  }

  /**
   * find all
   * @param codeHdongListDto
   */
  @ApiOperation({ description: '구별로 행정동 검색' })
  @Get('/code-hdong/gu-name')
  async findAll(
    @Query() codeHdongListDto: CodeHdongListDto,
  ): Promise<CodeHdong[]> {
    return await this.codeHdongService.findAllGuNames(codeHdongListDto);
  }

  /**
   * find all
   * @param codeHdongListDto
   */
  @ApiOperation({ description: '구별로 행정동 검색' })
  @Get('/code-hdong/hdong-name')
  async findAllDongs(
    @Query() codeHdongListDto: CodeHdongListDto,
  ): Promise<CodeHdong[]> {
    return await this.codeHdongService.findAllDongs(codeHdongListDto);
  }
}
