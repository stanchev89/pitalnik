import common_1, { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TOKEN_EXPIRED_ERROR, TOKEN_EXPIRED_RESPONSE_MSG } from '../../constants/jwt.const';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest(err, user, info, context: ExecutionContext, status) {
    if (err || !user) {
      this.handleTokenExpired(info);
      throw err || new common_1.UnauthorizedException();
    }
    return user;
  }

  private handleTokenExpired(info: any) {
    // If we need to implement a logic related with token refresh based on the request
    // const req: Request = context.switchToHttp().getRequest();
    if (info && info.message === TOKEN_EXPIRED_ERROR) {
      throw new HttpException(TOKEN_EXPIRED_RESPONSE_MSG, HttpStatus.UNAUTHORIZED);
    }
  }
}
