import { Module } from '@nestjs/common';
import { SSRController } from './ssr.controller';

@Module({
  controllers: [SSRController]
})
export class SSRModule {}
