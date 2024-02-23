import { Injectable } from '@nestjs/common';
import { Address } from './interfaces/address.interface';

@Injectable()
export class AddressesService {
  findAll(): Address[] {
    return [];
  }
}
