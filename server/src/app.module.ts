import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [OrdersModule, AddressesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
