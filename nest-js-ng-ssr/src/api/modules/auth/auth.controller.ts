import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import { ICreateUser, IUser } from '../../interfaces/entity/user.interface';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ACCESS_TOKEN } from '../../constants/auth-token';
import { JwtService } from '@nestjs/jwt';
import { ERROR_CODE } from '../../enums/error-code';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async authenticate(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('action') action: string,
    @Query('refreshToken') refreshToken: string
  ) {
    switch (action) {
      case 'authenticate':
        return req.user;
      case 'refreshToken':
        if (refreshToken) {
          const { accessToken, user } = await this.authService.refreshToken(req.cookies[ACCESS_TOKEN], refreshToken);
          res.cookie(ACCESS_TOKEN, accessToken);
          return user;
        }
        throw new HttpException(ERROR_CODE.MISSING_TOKEN, HttpStatus.UNAUTHORIZED);
      case 'logout':
        res.clearCookie(ACCESS_TOKEN);
        res.status(HttpStatus.OK);
        return null;
      default:
        throw new HttpException(ERROR_CODE.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<IUser> {
    const { accessToken, user, refreshToken } = await this.authService.login(req.user as IUser);
    res.cookie(ACCESS_TOKEN, accessToken, { httpOnly: true });
    return {
      ...user,
      refreshToken
    };
  }

  @Post('register')
  async registerUser(@Body() payload: ICreateUser) {
    return await this.userService.createOne(payload);
  }
}
