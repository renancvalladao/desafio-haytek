import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { AddressesModule } from './addresses/addresses.module';
import { CarriersModule } from './carriers/carriers.module';
import { BoxesModule } from './boxes/boxes.module';
import { ShipmentsModule } from './shipments/shipments.module';

@Module({
  imports: [
    OrdersModule,
    AddressesModule,
    CarriersModule,
    BoxesModule,
    ShipmentsModule,
  ],
})
export class AppModule {}
