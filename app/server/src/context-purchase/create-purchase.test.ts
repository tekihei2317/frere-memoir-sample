import { Flower } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "../database/prisma";
import { appRouter } from "../router";
import { formatDate } from "../utils/date";
import { addDays } from "date-fns";

const caller = appRouter.createCaller({ prisma });

describe("createPurchase", () => {
  let flower!: Flower;

  beforeEach(async () => {
    flower = await prisma.flower.create({
      data: {
        name: "ローズ",
        flowerCode: "RO001",
        maintanableDays: 5,
        deliveryDays: 3,
        purchaseQuantity: 10,
      },
    });
  });

  test("希望納品日が早すぎる場合、エラーになること", async () => {
    const createPurchase = caller.createPurchase({
      deliveryDate: formatDate(new Date()),
      details: [{ flowerId: flower.id, orderQuantity: 10 }],
    });

    await expect(createPurchase).rejects.toThrow(
      new TRPCError({
        code: "BAD_REQUEST",
        message: "納品希望日は、発注リードタイムより後の日付を入力してください",
      })
    );
  });

  test("仕入れを登録できること", async () => {
    const purchase = await caller.createPurchase({
      deliveryDate: formatDate(addDays(new Date(), 5)),
      details: [{ flowerId: flower.id, orderQuantity: 10 }],
    });

    const counts = await Promise.all([
      prisma.purchase.count({ where: { id: purchase.id } }),
      prisma.purchaseDetail.count({ where: { purchaseId: purchase.id } }),
    ]);
    expect(counts).toStrictEqual([1, 1]);
  });
});
