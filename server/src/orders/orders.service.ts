import { Injectable } from '@nestjs/common';
import { Order } from './interfaces/order.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Order[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Order[]>(
        'https://stg-api.haytek.com.br/api/v1/test-haytek-api/orders',
      ),
    );
    return data;
  }
}
