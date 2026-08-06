import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthService } from './admin-auth.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing admin authorization token.');
    }

    const token = authorizationHeader.slice(7).trim();

    if (!this.adminAuthService.verifyToken(token)) {
      throw new UnauthorizedException('Invalid or expired admin token.');
    }

    return true;
  }
}
