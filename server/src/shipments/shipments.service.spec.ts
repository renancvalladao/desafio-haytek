import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentsService } from './shipments.service';
import { OrdersModule } from 'src/orders/orders.module';
import { AddressesModule } from 'src/addresses/addresses.module';
import { CarriersModule } from 'src/carriers/carriers.module';
import { BoxesModule } from 'src/boxes/boxes.module';
import { Box } from 'src/boxes/interfaces/box.interface';

describe('ShipmentsService', () => {
  let service: ShipmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrdersModule, AddressesModule, CarriersModule, BoxesModule],
      providers: [ShipmentsService],
    }).compile();

    service = module.get<ShipmentsService>(ShipmentsService);
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
});
