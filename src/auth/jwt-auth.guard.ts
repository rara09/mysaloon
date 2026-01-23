import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Log pour déboguer en production
    if (!authHeader) {
      console.error('JWT Guard Error: No authorization header');
      throw new UnauthorizedException('No authorization header');
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.error('JWT Guard Error: Invalid authorization format');
      throw new UnauthorizedException('Invalid authorization format');
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.error('JWT Guard Error:', {
        err: err?.message,
        info: info?.message,
        user: user ? 'exists' : 'missing'
      });
      throw err || new UnauthorizedException(info?.message || 'Authentication failed');
    }
    return user;
  }
}
