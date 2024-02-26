import { Injectable } from '@nestjs/common';
import { Shipment } from './interfaces/shipment.interface';
import { OrdersService } from 'src/orders/orders.service';
import { AddressesService } from 'src/addresses/addresses.service';
import { CarriersService } from 'src/carriers/carriers.service';
import { BoxesService } from 'src/boxes/boxes.service';
import { Box } from 'src/boxes/interfaces/box.interface';

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

  computeBoxesDistribution(
    quantity: number,
    availableBoxes: Box[],
    bestDistributions: { [key: number]: Box[] } = {},
  ): Box[] {
    if (quantity === 0) return [];
    availableBoxes.forEach((box) => {
      const boxCapactity = Number(box.maxQuantity);
      let currentDistribution: Box[];
      if (quantity < boxCapactity) {
        currentDistribution = [box];
      } else {
        currentDistribution = Array(Math.floor(quantity / boxCapactity)).fill(
          box,
        );
        const remainder = quantity % boxCapactity;
        const remainderBoxes =
          bestDistributions[remainder] ||
          this.computeBoxesDistribution(
            remainder,
            availableBoxes,
            bestDistributions,
          );
        currentDistribution = currentDistribution.concat(remainderBoxes);
      }
      const bestDistribution = bestDistributions[quantity];
      if (
        !bestDistribution ||
        this.shouldReplaceBestDistribution(
          currentDistribution,
          bestDistribution,
        )
      )
        bestDistributions[quantity] = currentDistribution;
    });
    return bestDistributions[quantity];
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

  private shouldReplaceBestDistribution(
    currentDistribution: Box[],
    bestDistribution: Box[],
  ) {
    let currentCapacity = 0;
    currentDistribution.forEach(
      (box) => (currentCapacity += Number(box.maxQuantity)),
    );
    let bestCapacity = 0;
    bestDistribution.forEach(
      (box) => (bestCapacity += Number(box.maxQuantity)),
    );
    return (
      currentCapacity < bestCapacity ||
      (currentCapacity === bestCapacity &&
        currentDistribution.length < bestDistribution.length)
    );
  }
}
