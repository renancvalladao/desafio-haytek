import { PackedBox } from './packed-box.interface';

export interface Shipment {
  shippingDate: string;
  carrier: string;
  address: string;
  boxes: PackedBox[];
}
