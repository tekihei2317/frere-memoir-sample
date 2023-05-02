import { addDays, startOfDay } from "date-fns";
import { publicProcedure } from "../trpc/init-trpc";
import { CreatePurchaseInput } from "./api-schema";
import { TRPCError } from "@trpc/server";

function checkIfDeliverable({
  today,
  deliveryDate,
  maxDeliveryDays,
}: {
  today: Date;
  deliveryDate: Date;
  maxDeliveryDays: number;
}): boolean {
  if (maxDeliveryDays === null) return false;
  if (startOfDay(deliveryDate) < startOfDay(addDays(today, maxDeliveryDays)))
    return false;

  return true;
}

async function sendOrderEmail(): Promise<void> {}

export const createPurchase = publicProcedure
  .input(CreatePurchaseInput)
  .mutation(async ({ ctx, input }) => {
    const flowerIdList = input.details.map((detail) => detail.flowerId);
    const maxDeliveryDays = await ctx.prisma.flower.aggregate({
      _max: { deliveryDays: true },
      where: {
        id: { in: flowerIdList },
      },
    });
    if (maxDeliveryDays._max.deliveryDays === null) throw new Error();

    if (
      !checkIfDeliverable({
        today: new Date(),
        deliveryDate: new Date(input.deliveryDate),
        maxDeliveryDays: maxDeliveryDays._max.deliveryDays,
      })
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "納品希望日は、発注リードタイムより後の日付を入力してください",
      });
    }

    const purchase = await ctx.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          deliveryDate: new Date(input.deliveryDate),
          purchaseDetails: {
            createMany: {
              data: input.details,
            },
          },
        },
      });
      await sendOrderEmail();

      return purchase;
    });

    return purchase;
  });
