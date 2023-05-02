import { prisma } from "../database/prisma";
import { appRouter } from "../router";

const caller = appRouter.createCaller({ prisma });

describe("createFlower", () => {
  it("花を登録できること", async () => {
    await caller.createFlower({
      flowerCode: "test",
      name: "test",
      deliveryDays: 3,
      purchaseQuantity: 10,
      maintanableDays: 5,
    });

    expect(await prisma.flower.count()).toBe(1);
  });
});
