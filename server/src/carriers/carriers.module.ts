import { Module } from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CarriersService],
  exports: [CarriersService],
})
export class CarriersModule {}
