import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-jwt';
import configuration from '../../../../config/configuration';
import { Request } from 'express';
import { ACCESS_TOKEN } from '../../constants/auth-token';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../../interfaces/entity/user.interface';
import { UserService } from '../../user/user.service';
import { IJwtTokenPayload } from '../../interfaces/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: JwtStrategy.cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.secretKey
    });
  }

  static cookieExtractor(req: Request) {
    return req.cookies[ACCESS_TOKEN] || null;
  }

  async validate(payload: IJwtTokenPayload): Promise<IUser> {
    return this.userService.findOne({ id: payload.userId });
  }
}
