import { Module } from '@nestjs/common';
import { CarriersService } from './carriers.service';

@Module({
  providers: [CarriersService],
})
export class CarriersModule {}
