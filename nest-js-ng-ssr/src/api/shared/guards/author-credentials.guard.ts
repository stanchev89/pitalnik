import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { ERROR_CODE } from '../../enums/error-code.enum';
import { Request } from 'express';
import { IUser } from '../../interfaces/entity/user.interface';

@Injectable()
export class AuthorCredentialsGuard implements CanActivate {
  constructor(private readonly repository: Repository<any>) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const id = req.params['id'];
    const user: IUser = req.user as IUser;
    return this.repository.findOne({ where: { id: +id }, relations: { user: true } }).then((entity) => {
      if (!entity) {
        throw new NotFoundException(ERROR_CODE.NOT_FOUND);
      }
      if (!entity.user || entity.user.id !== user.id) {
        throw new UnauthorizedException(ERROR_CODE.WRONG_CUSTOMER_CREDENTIALS);
      }
      return true;
    });
  }
}
