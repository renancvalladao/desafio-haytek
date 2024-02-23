import { Injectable } from '@nestjs/common';
import { Order } from './interfaces/order.interface';

@Injectable()
export class OrdersService {
  findAll(): Order[] {
    return [];
  }
}
