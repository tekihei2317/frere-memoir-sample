import { AdminLayout } from "~/components/AdminLayout";
import { trpc } from "~/utils/trpc";
import { Anchor, Container, Table, Text } from "@mantine/core";
import { Link, useParams } from "react-router-dom";

export default function BouquetDetail() {
  const { bouquetId } = useParams();
  const { data: bouquet } = trpc.bouquet.useQuery({
    bouquetId: Number(bouquetId),
  });

  return (
    <AdminLayout>
      <Container size="lg">
        <Text size="lg">{bouquet?.name}</Text>
        <Table mt="md">
          <thead>
            <tr>
              <th>名前</th>
              <th>花コード</th>
              <th>本数</th>
            </tr>
          </thead>
          <tbody>
            {bouquet?.bouquetDetails.map((detail) => (
              <tr key={detail.id}>
                <td>
                  <Anchor component={Link} to={`/flowers/${detail.flower.id}`}>
                    {detail.flower.name}
                  </Anchor>
                </td>
                <td>{detail.flower.flowerCode}</td>
                <td>{detail.flowerQuantity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
}
