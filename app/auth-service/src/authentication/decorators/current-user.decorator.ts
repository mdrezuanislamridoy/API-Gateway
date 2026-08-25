import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../guards/jwt-auth.guard';

type AuthenticatedRequest = {
  user: JwtPayload;
};

export const CurrentUser = createParamDecorator(
  (property: keyof JwtPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return property ? request.user[property] : request.user;
  },
);
