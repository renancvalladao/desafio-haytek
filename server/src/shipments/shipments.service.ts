import { Injectable } from '@nestjs/common';
import { Shipment } from './interfaces/shipment.interface';
import { OrdersService } from 'src/orders/orders.service';
import { AddressesService } from 'src/addresses/addresses.service';
import { CarriersService } from 'src/carriers/carriers.service';
import { BoxesService } from 'src/boxes/boxes.service';

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly addressesService: AddressesService,
    private readonly carriersService: CarriersService,
    private readonly boxesService: BoxesService,
  ) {}

  async findAll(): Promise<Shipment[]> {
    const orders = await this.ordersService.findAll();
    const addresses = await this.addressesService.findAll();
    const carriers = await this.carriersService.findAll();
    const boxes = await this.boxesService.findAll();
    console.log({ orders, addresses, carriers, boxes });
    return [];
  }

  computeShippingDate(orderDate: Date, cutOffTime: string): Date {
    const [cutOffHours, cutOffMinutes] = cutOffTime.split(':').map(Number);
    const cutOffDate = new Date(orderDate);
    cutOffDate.setUTCHours(cutOffHours, cutOffMinutes, 0, 0);
    const shippingDate = new Date(orderDate);
    shippingDate.setUTCHours(0, 0, 0, 0);
    if (orderDate >= cutOffDate) {
      shippingDate.setDate(shippingDate.getDate() + 1);
    }
    return shippingDate;
  }
}
