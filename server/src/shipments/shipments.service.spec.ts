import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentsService } from './shipments.service';
import { OrdersModule } from 'src/orders/orders.module';
import { AddressesModule } from 'src/addresses/addresses.module';
import { CarriersModule } from 'src/carriers/carriers.module';
import { BoxesModule } from 'src/boxes/boxes.module';

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
});
