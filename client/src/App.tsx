import { useState } from 'react'
import { AppShell, Button, Card, List, Text } from '@mantine/core'
import config from './config'

const App = () => {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const clickHandler = async () => {
    setLoading(true)
    const response = await fetch(`${config.server}/shipments`)
    const data: Shipment[] = await response.json()
    data.sort(
      (a, b) =>
        new Date(a.shippingDate).getTime() - new Date(b.shippingDate).getTime()
    )
    setShipments(data)
    setLoading(false)
  }

  return (
    <AppShell padding="md">
      <AppShell.Main>
        <Button onClick={clickHandler} loading={loading} w={'100%'}>
          Consultar entregas
        </Button>
        {shipments.map((shipment) => (
          <Card
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            mt={'md'}
            key={shipment.Id}
          >
            <Text fw={500}>
              Id: <Text span>{shipment.Id}</Text>
            </Text>
            <Text fw={500}>
              Data de Envio:{' '}
              <Text span>{shipment.shippingDate.split('T')[0]}</Text>
            </Text>
            <Text fw={500}>
              Transportadora: <Text span>{shipment.carrier}</Text>
            </Text>
            <Text fw={500}>
              Endereço: <Text span>{shipment.address}</Text>
            </Text>
            <Text fw={500}>Caixas:</Text>
            <List type="ordered" ml={'md'}>
              {shipment.boxes.map((box, i) => (
                <List.Item key={i}>
                  <Text
                    span
                    fw={500}
                    mr={'sm'}
                    display={'inline-block'}
                    w={'80px'}
                  >
                    Tipo: <Text span>{box.type}</Text>
                  </Text>
                  <Text
                    span
                    fw={500}
                    mr={'sm'}
                    display={'inline-block'}
                    w={'140px'}
                  >
                    Quantidade: <Text span>{box.quantity}</Text>
                  </Text>
                  <Text span fw={500}>
                    Pedidos: <Text span>{`[${box.orderIds.toString()}]`}</Text>
                  </Text>
                </List.Item>
              ))}
            </List>
          </Card>
        ))}
      </AppShell.Main>
    </AppShell>
  )
}

export default App
