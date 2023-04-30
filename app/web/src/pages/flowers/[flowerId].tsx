import { z } from "zod";
import { Box, Button, Container, Stack, TextInput } from "@mantine/core";
import { AdminLayout } from "~/components/AdminLayout";
import { trpc } from "~/utils/trpc";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useZodForm } from "~/components/Form";

const UpdateFlowerForm = z.object({
  flowerCode: z.string(),
  name: z.string(),
  deliveryDays: z.number(),
  purchaseQuantity: z.number(),
  maintanableDays: z.number(),
});

export default function FlowerDetail() {
  const { flowerId } = useParams();
  const navigate = useNavigate();
  const flowerQuery = trpc.flower.useQuery({ flowerId: Number(flowerId) });
  const { Form, register, reset } = useZodForm(UpdateFlowerForm);

  const updateFlower = trpc.updateFlower.useMutation({
    onSuccess: () => navigate("/flowers"),
  });

  useEffect(() => {
    if (!flowerQuery.data) return;
    reset(flowerQuery.data);
  }, [flowerQuery.data, reset]);

  return (
    <AdminLayout>
      <Container size="lg">
        {flowerQuery.data && (
          <Form
            onSubmit={(values) =>
              updateFlower.mutate({ ...values, flowerId: Number(flowerId) })
            }
          >
            <Stack>
              <TextInput label="花名" {...register("name")} />
              <TextInput label="花コード" {...register("flowerCode")} />
              <TextInput
                label="発注リードタイム"
                {...register("deliveryDays", { valueAsNumber: true })}
              />
              <TextInput
                label="購入単位数"
                {...register("purchaseQuantity", { valueAsNumber: true })}
              />
              <TextInput
                label="品質維持可能日数"
                {...register("maintanableDays", { valueAsNumber: true })}
              />
              <Box>
                <Button type="submit" loading={updateFlower.isLoading}>
                  更新
                </Button>
              </Box>
            </Stack>
          </Form>
        )}
      </Container>
    </AdminLayout>
  );
}
