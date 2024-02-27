import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
