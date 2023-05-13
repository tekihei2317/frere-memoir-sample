import { addDays, startOfDay } from "date-fns";
import { publicProcedure } from "../trpc/init-trpc";
import { CreatePurchaseInput } from "./api-schema";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { Purchase, CreatedPurchase, PurchaseDetail } from "./core/types";
import { prisma } from "../database/prisma";

function checkIfDeliverable({
  purchase,
  today,
}: {
  purchase: Purchase;
  today: Date;
}): boolean {
  const maxDeliveryDays = Math.max(
    ...purchase.purchaseDetails.map((detail) => detail.flower.deliveryDays)
  );
  if (
    startOfDay(purchase.deliveryDate) <
    startOfDay(addDays(today, maxDeliveryDays))
  )
    return false;

  return true;
}

async function validatePurchase(input: CreatePurchaseInput): Promise<Purchase> {
  const flowerIdList = input.details.map((detail) => detail.flowerId);
  const flowers = await prisma.flower.findMany({
    where: { id: { in: flowerIdList } },
  });
  const flowerMap = new Map(flowers.map((flower) => [flower.id, flower]));

  const purchaseDetails: PurchaseDetail[] = input.details.map((detail) => {
    const flower = flowerMap.get(detail.flowerId);
    if (flower === undefined) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "花IDが正しくありません",
      });
    }
    return { ...detail, flower };
  });
  const purchase: Purchase = {
    deliveryDate: new Date(input.deliveryDate),
    purchaseDetails,
  };

  if (!checkIfDeliverable({ today: new Date(), purchase })) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "納品希望日は、発注リードタイムより後の日付を入力してください",
    });
  }

  return purchase;
}

async function persistPurchase(
  tx: Prisma.TransactionClient,
  validatedPurchase: Purchase
): Promise<CreatedPurchase> {
  const purchase = await tx.purchase.create({
    data: {
      deliveryDate: new Date(validatedPurchase.deliveryDate),
      purchaseDetails: {
        createMany: {
          data: validatedPurchase.purchaseDetails.map((detail) => ({
            flowerId: detail.flower.id,
            orderQuantity: detail.orderQuantity,
          })),
        },
      },
    },
    include: {
      purchaseDetails: { include: { flower: true } },
    },
  });
  return purchase;
}

async function sendOrderEmail(purchase: CreatedPurchase): Promise<void> {}

export const createPurchase = publicProcedure
  .input(CreatePurchaseInput)
  .mutation(async ({ ctx, input }) => {
    const validatedPurchase = await validatePurchase(input);
    const purchase = await ctx.prisma.$transaction(async (tx) => {
      const purchase = await persistPurchase(tx, validatedPurchase);
      await sendOrderEmail(purchase);

      return purchase;
    });

    return purchase;
  });
