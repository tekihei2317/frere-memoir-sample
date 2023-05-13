import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma";
import { publicProcedure } from "../trpc/init-trpc";
import { RegisterArrivalInput } from "./api-schema";
import { PurchaseArrival } from "./core/types";
import { formatDate } from "../utils/date";

/**
 * 入荷情報を登録する
 */
async function persistArrival(
  tx: Prisma.TransactionClient,
  input: RegisterArrivalInput
): Promise<PurchaseArrival> {
  const arrival = await tx.purchaseArrival.create({
    data: {
      arrivedAt: new Date(),
      purchaseId: input.purchaseId,
    },
  });

  return arrival;
}

type ArrivalWithPurchaseDetails = PurchaseArrival & {
  purchaseDetails: { flowerId: number; orderQuantity: number }[];
};

async function loadPurchaseDetails(
  tx: Prisma.TransactionClient,
  arrival: PurchaseArrival
): Promise<ArrivalWithPurchaseDetails> {
  const purchaseDetails = await tx.purchaseDetail.findMany({
    where: { purchaseId: arrival.purchaseId },
  });
  return { ...arrival, purchaseDetails };
}

/**
 * 入荷に合わせて、在庫を更新または作成する
 */
async function updateOrCreateInventories(
  tx: Prisma.TransactionClient,
  arrival: ArrivalWithPurchaseDetails
): Promise<void> {
  const arrivalDate = new Date(formatDate(arrival.arrivedAt));
  await Promise.all(
    arrival.purchaseDetails.map((purchaseDetail) => {
      const increase = {
        arrivalId: arrival.id,
        quantity: purchaseDetail.orderQuantity,
      };

      return tx.flowerInventory.upsert({
        where: {
          flowerId_arrivalDate: {
            flowerId: purchaseDetail.flowerId,
            arrivalDate,
          },
        },
        // 在庫がある場合は更新する
        update: {
          currentQuantity: { increment: purchaseDetail.orderQuantity },
          increases: { create: increase },
        },
        // 在庫がなければ作成する
        create: {
          flowerId: purchaseDetail.flowerId,
          arrivalDate,
          currentQuantity: purchaseDetail.orderQuantity,
          increases: { create: increase },
        },
      });
    })
  );
}

export const registerArrival = publicProcedure
  .input(RegisterArrivalInput)
  .mutation(async ({ input }) => {
    const arrival = await prisma.$transaction(async (tx) => {
      const arrival = await persistArrival(tx, input);
      const arrivalWithPurchaseDetails = await loadPurchaseDetails(tx, arrival);
      await updateOrCreateInventories(tx, arrivalWithPurchaseDetails);

      return arrival;
    });

    return arrival;
  });
