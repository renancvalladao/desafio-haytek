import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
