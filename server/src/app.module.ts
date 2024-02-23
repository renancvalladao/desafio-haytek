import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { AddressesModule } from './addresses/addresses.module';
import { CarriersModule } from './carriers/carriers.module';
import { BoxesModule } from './boxes/boxes.module';

@Module({
  imports: [OrdersModule, AddressesModule, CarriersModule, BoxesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
