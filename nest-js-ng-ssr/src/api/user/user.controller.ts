import { Controller, Get } from '@nestjs/common';

@Controller()
export class UserController {
  @Get()
  test() {
    return { message: 'User controller works' };
  }
}
