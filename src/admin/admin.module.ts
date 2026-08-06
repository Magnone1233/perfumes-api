import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminAuthService } from './admin-auth.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AdminController],
  providers: [AdminAuthService, AdminAuthGuard],
  exports: [AdminAuthService, AdminAuthGuard],
})
export class AdminModule {}
