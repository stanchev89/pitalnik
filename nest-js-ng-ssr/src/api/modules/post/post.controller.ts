import { Controller, Get } from '@nestjs/common';

@Controller()
export class PostController {
  @Get()
  getAll(): { message: string } {
    return { message: 'You get all posts!' };
  }
}
