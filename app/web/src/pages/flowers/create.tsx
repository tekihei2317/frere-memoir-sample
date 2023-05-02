import { z } from "zod";
import { Box, Button, Container, Stack, TextInput } from "@mantine/core";
import { trpc } from "~/utils/trpc";
import { useZodForm } from "~/components/Form";
import { useNavigate } from "react-router";
import { AdminLayout } from "~/components/AdminLayout";

const CreateFlowerInput = z.object({
  flowerCode: z.string(),
  name: z.string(),
  deliveryDays: z.number(),
  purchaseQuantity: z.number(),
  maintanableDays: z.number(),
});

type CreateFlowerInput = z.infer<typeof CreateFlowerInput>;

export default function CreateFlower() {
  const { Form, register } = useZodForm(CreateFlowerInput);
  const navigate = useNavigate();
  const createFlower = trpc.createFlower.useMutation({
    onSuccess: () => navigate("/flowers"),
  });

  return (
    <AdminLayout>
      <Container size="lg">
        <Form onSubmit={(values) => createFlower.mutate(values)}>
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
              <Button type="submit" loading={createFlower.isLoading}>
                登録
              </Button>
            </Box>
          </Stack>
        </Form>
      </Container>
    </AdminLayout>
  );
}
