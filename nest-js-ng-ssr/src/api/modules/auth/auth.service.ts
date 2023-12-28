import { HttpException, HttpStatus, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { ACCESS_TOKEN } from '../../constants/auth-token';
import { IUser } from '../../interfaces/entity/user.interface';
import { IJwtRefreshTokenPayload, IJwtTokenPayload } from '../../interfaces/jwt';
import configuration from '../../../../config/configuration';
import { ERROR_CODE } from '../../enums/error-code.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  validateUser(username: string, password: string): Promise<User | null> {
    return this.userService
      .findOne({ username })
      .then((user) => {
        if (!user) {
          throw new NotAcceptableException(ERROR_CODE.WRONG_CUSTOMER_CREDENTIALS);
        }
        return Promise.all([user, bcrypt.compare(password, user.password)]);
      })
      .then(([user, isValidPassword]) => (isValidPassword ? user : null));
  }

  login(user: IUser): { user: IUser; [ACCESS_TOKEN]: string; refreshToken: string } {
    const accessToken = this.generateAccessToken({ userId: user.id, username: user.username });
    const refreshToken = this.generateRefreshToken(user.id, accessToken);
    this.userService.updateOne({ username: user.username, refreshToken });
    return {
      user,
      accessToken,
      refreshToken
    };
  }

  refreshToken(
    accessToken: string,
    refreshToken: string
  ): Promise<{
    user: IUser;
    [ACCESS_TOKEN]: string;
  }> {
    return this.compareTokens(accessToken, refreshToken)
      .then((refreshTokenData) => {
        if (!refreshTokenData) {
          throw new UnauthorizedException();
        }
        return this.userService.findOne({ id: refreshTokenData.id });
      })
      .then((user) => {
        if (!user) {
          throw new HttpException(ERROR_CODE.NOT_ACCEPTABLE, HttpStatus.NOT_ACCEPTABLE);
        }
        const newAccessToken = this.generateAccessToken({ userId: user.id, username: user.username });
        const newRefreshToken = this.generateRefreshToken(user.id, newAccessToken);
        this.userService.updateOne({ username: user.username, refreshToken: newRefreshToken });

        return {
          user,
          accessToken: newAccessToken
        };
      });
  }

  private compareTokens(accessToken: string, refreshToken: string): Promise<IJwtRefreshTokenPayload> {
    if (!accessToken || !refreshToken) {
      throw new HttpException(ERROR_CODE.MISSING_TOKEN, HttpStatus.UNAUTHORIZED);
    }
    return Promise.all([
      this.jwtService.verify<Promise<IJwtRefreshTokenPayload | null>>(refreshToken),
      this.jwtService.verify<Promise<IJwtTokenPayload | null>>(accessToken)
    ]).then(([refreshTokenData, accessTokenData]) => {
      if (!refreshTokenData || !accessTokenData) {
        throw new UnauthorizedException();
      }
      if (refreshTokenData.substr === accessToken.slice(-5) && refreshTokenData.id == accessTokenData.userId) {
        return refreshTokenData;
      }
      throw new UnauthorizedException();
    });
  }

  private generateAccessToken(payload: IJwtTokenPayload): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(userId: number, accessToken: string): string {
    const refreshTokenData = { id: userId, substr: accessToken.slice(-5) };
    return this.jwtService.sign(refreshTokenData, { expiresIn: configuration().jwt.refreshTokenExp });
  }
}
