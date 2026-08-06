import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';

interface AdminTokenPayload {
  u: string;
  exp: number;
}

@Injectable()
export class AdminAuthService {
  private readonly tokenTtlSeconds = 60 * 60;

  constructor(private readonly configService: ConfigService) {}

  validateCredentials(username: string, password: string): boolean {
    const expectedUsername = this.configService.get<string>(
      'ADMIN_USERNAME',
      'admin',
    );
    const expectedPassword = this.configService.get<string>(
      'ADMIN_PASSWORD',
      'admin123',
    );

    return (
      this.safeEquals(username, expectedUsername) &&
      this.safeEquals(password, expectedPassword)
    );
  }

  issueToken(username: string): { token: string; expiresIn: number } {
    const payload: AdminTokenPayload = {
      u: username,
      exp: Math.floor(Date.now() / 1000) + this.tokenTtlSeconds,
    };

    const encodedPayload = Buffer.from(
      JSON.stringify(payload),
      'utf8',
    ).toString('base64url'  'utf8',
    ).toString('base64url');
    const signature = this.sign(encodedPayload);

    return {
      token: `${encodedPayload}.${signature}`,
      expiresIn: this.tokenTtlSeconds,
    };
  }

  verifyToken(token: string): boolean {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 2) {
      return false;
    }

    const [encodedPayload, signature] = tokenParts;
    const expectedSignature = this.sign(encodedPayload);
    if (!this.safeEquals(signature, expectedSignature)) {
      return false;
    }

    try {
      const payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      ) as AdminTokenPayload;

      if (!payload?.u || typeof payload.exp !== 'number') {
        return false;
      }

      const expectedUsername = this.configService.get<string>(
        'ADMIN_USERNAME',
        'admin',
      );

      return (
        payload.u === expectedUsername &&
        payload.exp > Math.floor(Date.now() / 1000)
      );
    } catch {
      return false;
    }
  }

  private sign(value: string): string {
    const secret = this.configService.get<string>(
      'ADMIN_TOKEN_SECRET',
      'change-this-admin-token-secret',
    );

    return createHmac('sha256', secret).update(value).digest('base64url');
  }

  private safeEquals(first: string, second: string): boolean {
    const firstBuffer = Buffer.from(first, 'utf8');
    const secondBuffer = Buffer.from(second, 'utf8');

    if (firstBuffer.length !== secondBuffer.length) {
      return false;
    }

    return timingSafeEqual(firstBuffer, secondBuffer);
  }
}
