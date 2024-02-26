import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentsService } from './shipments.service';
import { Box } from 'src/boxes/interfaces/box.interface';
import { Order } from 'src/orders/interfaces/order.interface';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AddressesService } from 'src/addresses/addresses.service';
import { Shipment } from './interfaces/shipment.interface';
import { PackedBox } from './interfaces/packed-box.interface';
import carriers from './mocks/carriers.mock';
import addresses from './mocks/addresses.mock';
import boxes from './mocks/boxes.mock';

describe('ShipmentsService', () => {
  let service: ShipmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipmentsService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ShipmentsService>(ShipmentsService);
    const addressesService =
      module.get<DeepMocked<AddressesService>>(AddressesService);
    addressesService.getFullAddress.mockImplementation(
      (address) => `${address.Id}`,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeShippingDate', () => {
    it('should return the same day when dateOrder is before cutOffTime', () => {
      const orderDate = new Date('2024-02-10T15:46:04.151Z');
      const cutOffTime = '16:00';
      const expectedShippingDate = new Date('2024-02-10T00:00:00.000Z');
      const shippingDate = service.computeShippingDate(orderDate, cutOffTime);
      expect(shippingDate).toStrictEqual(expectedShippingDate);
    });

    it('should return the next day when dateOrder is after cutOffTime', () => {
      const orderDate = new Date('2024-02-10T16:46:04.151Z');
      const cutOffTime = '16:00';
      const expectedShippingDate = new Date('2024-02-11T00:00:00.000Z');
      const shippingDate = service.computeShippingDate(orderDate, cutOffTime);
      expect(shippingDate).toStrictEqual(expectedShippingDate);
    });
  });

  describe('computeBoxesDistribution', () => {
    const boxes: Box[] = [
      { type: 'P', maxQuantity: '5' },
      { type: 'M', maxQuantity: '10' },
      { type: 'G', maxQuantity: '30' },
    ];

    it('should return an empty array when total quantity is zero', () => {
      const totalQuantity = 0;
      const expectedDistribution = [];
      const distribution = service.computeBoxesDistribution(
        totalQuantity,
        boxes,
      );
      expect(distribution).toStrictEqual(expectedDistribution);
    });

    it('should return the least maximum capacity', () => {
      const totalQuantity = 25;
      const expectedDistribution = [boxes[1], boxes[1], boxes[0]];
      const distribution = service.computeBoxesDistribution(
        totalQuantity,
        boxes,
      );
      expect(distribution).toStrictEqual(expectedDistribution);
    });

    it('should return the least number of boxes', () => {
      const totalQuantity = 30;
      const expectedDistribution = [boxes[2]];
      const distribution = service.computeBoxesDistribution(
        totalQuantity,
        boxes,
      );
      expect(distribution).toStrictEqual(expectedDistribution);
    });
  });

  describe('organizeOrdersInShipments', () => {
    const orderA = {
      Id: 'A',
      addressId: addresses[0].Id,
      carrierId: carriers[0].Id,
      createdAt: '2024-02-10T10:00:00.000Z',
      quantity: 5,
    };

    it('should organize orders from different dates in different shipments', () => {
      const orderB: Order = {
        ...orderA,
        Id: 'B',
        createdAt: '2024-02-11T10:00:00.000Z',
      };
      const [shipments, ordersByShipment] = service.organizeOrdersInShipments(
        [orderA, orderB],
        addresses,
        carriers,
      );
      expect(shipments.length).toBe(2);
      expect(ordersByShipment[shipments[0].Id]).toStrictEqual([orderA]);
      expect(ordersByShipment[shipments[1].Id]).toStrictEqual([orderB]);
    });

    it('should organize orders to different addresses in different shipments', () => {
      const orderB: Order = {
        ...orderA,
        Id: 'B',
        addressId: addresses[1].Id,
      };
      const [shipments, ordersByShipment] = service.organizeOrdersInShipments(
        [orderA, orderB],
        addresses,
        carriers,
      );
      expect(shipments.length).toBe(2);
      expect(ordersByShipment[shipments[0].Id]).toStrictEqual([orderA]);
      expect(ordersByShipment[shipments[1].Id]).toStrictEqual([orderB]);
    });

    it('should organize orders for different carriers in different shipments', () => {
      const orderB: Order = {
        ...orderA,
        Id: 'B',
        carrierId: carriers[1].Id,
      };
      const [shipments, ordersByShipment] = service.organizeOrdersInShipments(
        [orderA, orderB],
        addresses,
        carriers,
      );
      expect(shipments.length).toBe(2);
      expect(ordersByShipment[shipments[0].Id]).toStrictEqual([orderA]);
      expect(ordersByShipment[shipments[1].Id]).toStrictEqual([orderB]);
    });

    it('should organize orders from the same date, to the same address, and for the same carrier in the same shipment', () => {
      const orderB: Order = {
        ...orderA,
        Id: 'B',
      };
      const [shipments, ordersByShipment] = service.organizeOrdersInShipments(
        [orderA, orderB],
        addresses,
        carriers,
      );
      expect(shipments.length).toBe(1);
      expect(ordersByShipment[shipments[0].Id]).toStrictEqual([orderA, orderB]);
    });
  });

  describe('packShipmentBoxes', () => {
    const shipment: Shipment = {
      Id: 'S',
      address: 'Full Address',
      carrier: 'Carrier',
      shippingDate: '2024-02-10T00:00:00.000Z',
      boxes: [],
    };

    it('should pack an order into a box', () => {
      const order: Order = {
        Id: 'A',
        addressId: addresses[0].Id,
        carrierId: carriers[0].Id,
        createdAt: '2024-02-10T10:00:00.000Z',
        quantity: 5,
      };
      const expectedBoxes: PackedBox[] = [
        { type: 'P', quantity: 5, orderIds: ['A'] },
      ];
      const packedShipment = service.packShipmentBoxes(shipment, boxes, [
        order,
      ]);
      expect(packedShipment.boxes).toStrictEqual(expectedBoxes);
    });

    it('should split an order into more than one box', () => {
      const order: Order = {
        Id: 'A',
        addressId: addresses[0].Id,
        carrierId: carriers[0].Id,
        createdAt: '2024-02-10T10:00:00.000Z',
        quantity: 19,
      };
      const expectedBoxes: PackedBox[] = [
        { type: 'M', quantity: 10, orderIds: ['A'] },
        { type: 'M', quantity: 9, orderIds: ['A'] },
      ];
      const packedShipment = service.packShipmentBoxes(shipment, boxes, [
        order,
      ]);
      expect(packedShipment.boxes).toStrictEqual(expectedBoxes);
    });

    it('should packe many orders into the same box', () => {
      const orderA: Order = {
        Id: 'A',
        addressId: addresses[0].Id,
        carrierId: carriers[0].Id,
        createdAt: '2024-02-10T10:00:00.000Z',
        quantity: 5,
      };
      const orderB: Order = {
        ...orderA,
        Id: 'B',
      };
      const expectedBoxes: PackedBox[] = [
        { type: 'M', quantity: 10, orderIds: ['A', 'B'] },
      ];
      const packedShipment = service.packShipmentBoxes(shipment, boxes, [
        orderA,
        orderB,
      ]);
      expect(packedShipment.boxes).toStrictEqual(expectedBoxes);
    });
  });
});
