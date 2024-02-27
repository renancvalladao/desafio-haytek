import { Module } from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [CarriersService],
  exports: [CarriersService],
})
export class CarriersModule {}
