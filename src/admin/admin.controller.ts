import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  login(@Body() adminLoginDto: AdminLoginDto) {
    const isValid = this.adminAuthService.validateCredentials(
      adminLoginDto.username,
      adminLoginDto.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid admin credentials.');
    }

    return this.adminAuthService.issueToken(adminLoginDto.username);
  }
}
