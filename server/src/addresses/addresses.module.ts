import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
