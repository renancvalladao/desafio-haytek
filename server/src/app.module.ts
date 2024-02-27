import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { AddressesModule } from './addresses/addresses.module';
import { CarriersModule } from './carriers/carriers.module';
import { BoxesModule } from './boxes/boxes.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    OrdersModule,
    AddressesModule,
    CarriersModule,
    BoxesModule,
    ShipmentsModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
