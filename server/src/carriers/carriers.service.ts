import { Injectable } from '@nestjs/common';
import { Carrier } from './interfaces/carrier.interface';

@Injectable()
export class CarriersService {
  findAll(): Carrier[] {
    return [];
  }
}
