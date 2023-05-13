import { prisma } from "../database/prisma";
import { appRouter } from "../router";

const caller = appRouter.createCaller({ prisma });

describe("createBouquet", () => {
  test("花束を登録できること", async () => {
    const flower = await prisma.flower.create({
      data: {
        name: "ローズ",
        flowerCode: "RO001",
        maintanableDays: 5,
        deliveryDays: 3,
        purchaseQuantity: 10,
      },
    });

    const bouquet = await caller.createBouquet({
      name: "薔薇の詰め合わせ",
      bouquetCode: "BA001",
      bouquetDetails: [{ flowerId: flower.id, flowerQuantity: 3 }],
    });

    expect(
      await Promise.all([
        prisma.bouquet.count(),
        prisma.bouquetDetail.count({ where: { bouquetId: bouquet.id } }),
      ])
    ).toStrictEqual([1, 1]);
  });
});
