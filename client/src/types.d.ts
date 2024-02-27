type Shipment = {
  Id: string
  shippingDate: string
  carrier: string
  address: string
  boxes: PackedBox[]
}

type PackedBox = {
  type: string
  quantity: number
  orderIds: string[]
}
