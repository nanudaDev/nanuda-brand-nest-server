import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { AuthService } from './auth.service';

@Controller()
@ApiTags('ADMIN AUTH')
export class AdminAuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }
}
