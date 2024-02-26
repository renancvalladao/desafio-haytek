import { PackedBox } from './packed-box.interface';

export interface Shipment {
  Id: string;
  shippingDate: string;
  carrier: string;
  address: string;
  boxes: PackedBox[];
}
