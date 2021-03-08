import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  @Get('/code-hdong/sido')
  async findAllSido(): Promise<CodeHdong[]> {
    return await this.codeHdongService.findAllSido();
  }

  /**
   * find all
   * @param codeHdongListDto
   */
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
  @Get('/code-hdong/hdong-name')
  async findAllDongs(
    @Query() codeHdongListDto: CodeHdongListDto,
  ): Promise<CodeHdong[]> {
    return await this.codeHdongService.findAllDongs(codeHdongListDto);
  }
}
