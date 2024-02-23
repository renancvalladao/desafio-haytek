import { Injectable } from '@nestjs/common';
import { Box } from './interfaces/box.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BoxesService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Box[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Box[]>(
        'https://stg-api.haytek.com.br/api/v1/test-haytek-api/boxes',
      ),
    );
    return data;
  }
}
