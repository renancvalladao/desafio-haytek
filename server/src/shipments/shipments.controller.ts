import { Controller, Get } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { Shipment } from './interfaces/shipment.interface';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  findAll(): Promise<Shipment[]> {
    return this.shipmentsService.findAll();
  }
}
