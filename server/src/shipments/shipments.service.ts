import { Injectable } from '@nestjs/common';
import { Shipment } from './interfaces/shipment.interface';

@Injectable()
export class ShipmentsService {
  findAll(): Shipment[] {
    return [];
  }
}
