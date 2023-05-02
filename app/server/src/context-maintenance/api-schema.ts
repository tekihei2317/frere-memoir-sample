import { z } from "zod";

export const CreateFlowerInput = z.object({
  flowerCode: z.string(),
  name: z.string(),
  deliveryDays: z.number(),
  purchaseQuantity: z.number(),
  maintanableDays: z.number(),
});

export const FlowerIdInput = z.object({
  flowerId: z.number(),
});

export const UpdateFlowerInput = FlowerIdInput.merge(CreateFlowerInput);

const BouquetDetail = z.object({
  flowerId: z.number(),
  flowerQuantity: z.number(),
});

export const CreateBouquetInput = z.object({
  bouquetCode: z.string(),
  name: z.string(),
  bouquetDetails: z.array(BouquetDetail).min(1),
});

export const BouquetIdInput = z.object({
  bouquetId: z.number(),
});
