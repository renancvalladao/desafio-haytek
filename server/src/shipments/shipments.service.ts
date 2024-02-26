import { Injectable } from '@nestjs/common';
import { Shipment } from './interfaces/shipment.interface';
import { OrdersService } from 'src/orders/orders.service';
import { AddressesService } from 'src/addresses/addresses.service';
import { CarriersService } from 'src/carriers/carriers.service';
import { BoxesService } from 'src/boxes/boxes.service';
import { Box } from 'src/boxes/interfaces/box.interface';
import { Order } from 'src/orders/interfaces/order.interface';
import { Address } from 'src/addresses/interfaces/address.interface';
import { Carrier } from 'src/carriers/interfaces/carrier.interface';
import { randomUUID } from 'crypto';
import { PackedBox } from './interfaces/packed-box.interface';

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly addressesService: AddressesService,
    private readonly carriersService: CarriersService,
    private readonly boxesService: BoxesService,
  ) {}

  async computeAll(): Promise<Shipment[]> {
    const orders = await this.ordersService.findAll();
    const addresses = await this.addressesService.findAll();
    const carriers = await this.carriersService.findAll();
    const boxes = await this.boxesService.findAll();
    const [shipments, ordersByShipment] = this.organizeOrdersInShipments(
      orders,
      addresses,
      carriers,
    );
    const packedShipments = shipments.map((shipment) => {
      const shipmentOrders = ordersByShipment[shipment.Id];
      return this.packShipmentBoxes(shipment, boxes, shipmentOrders);
    });

    return packedShipments;
  }

  packShipmentBoxes(
    shipment: Shipment,
    boxes: Box[],
    shipmentOrders: Order[],
  ): Shipment {
    let totalQuantity = 0;
    shipmentOrders.forEach((order) => (totalQuantity += order.quantity));

    const boxesDistribution = this.computeBoxesDistribution(
      totalQuantity,
      boxes,
    );
    let currentOrderIndex = 0;
    const packedBoxes: PackedBox[] = boxesDistribution.map((box) => {
      const boxCapactity = Number(box.maxQuantity);
      const packedBox = { type: box.type, quantity: 0, orderIds: [] };
      while (
        packedBox.quantity < boxCapactity &&
        currentOrderIndex < shipmentOrders.length
      ) {
        const currentOrder = shipmentOrders[currentOrderIndex];
        const quantityTaken = Math.min(
          currentOrder.quantity,
          boxCapactity - packedBox.quantity,
        );
        packedBox.quantity += quantityTaken;
        packedBox.orderIds.push(currentOrder.Id);
        currentOrder.quantity -= quantityTaken;
        if (currentOrder.quantity === 0) currentOrderIndex++;
      }
      return packedBox;
    });
    return { ...shipment, boxes: packedBoxes };
  }

  organizeOrdersInShipments(
    orders: Order[],
    addresses: Address[],
    carriers: Carrier[],
  ): [Shipment[], { [key: string]: Order[] }] {
    const shipments: Shipment[] = [];
    const ordersByShipment: { [key: string]: Order[] } = {};
    const addressesMap: { [key: string]: Address } = {};
    addresses.forEach((address) => (addressesMap[address.Id] = address));
    const carriersMap: { [key: string]: Carrier } = {};
    carriers.forEach((carrier) => (carriersMap[carrier.Id] = carrier));

    orders.forEach((order) => {
      const address = addressesMap[order.addressId];
      const carrier = carriersMap[order.carrierId];
      const fullAddress = this.addressesService.getFullAddress(address);

      const shippingDate = this.computeShippingDate(
        new Date(order.createdAt),
        carrier.cutOffTime,
      );

      let currentShipment = shipments.find(
        (shipment) =>
          shipment.carrier === carrier.name &&
          new Date(shipment.shippingDate).getTime() ===
            shippingDate.getTime() &&
          shipment.address === fullAddress,
      );

      if (!currentShipment) {
        currentShipment = {
          Id: randomUUID(),
          shippingDate: shippingDate.toISOString(),
          carrier: carrier.name,
          address: fullAddress,
          boxes: [],
        };
        shipments.push(currentShipment);
        ordersByShipment[currentShipment.Id] = [];
      }
      ordersByShipment[currentShipment.Id].push({ ...order });
    });

    return [shipments, ordersByShipment];
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
