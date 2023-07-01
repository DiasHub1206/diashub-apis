import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserInterceptor } from '../interceptor/tenant.interceptor';

export function UserAuth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    UseInterceptors(UserInterceptor),
  );
}
