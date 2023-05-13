import { Flower, Purchase } from "@prisma/client";
import { prisma } from "../database/prisma";
import { appRouter } from "../router";
import { addDays } from "date-fns";
import { formatDate } from "../utils/date";

const caller = appRouter.createCaller({ prisma });

describe("registerArival", () => {
  let flower!: Flower;
  let purchase!: Purchase;

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
    purchase = await prisma.purchase.create({
      data: {
        deliveryDate: addDays(new Date(), 5),
        purchaseDetails: {
          createMany: {
            data: [{ flowerId: flower.id, orderQuantity: 10 }],
          },
        },
      },
    });
  });

  test("入荷イベントが登録されること", async () => {
    await caller.registerArrival({ purchaseId: purchase.id });

    expect(await prisma.purchaseArrival.count()).toBe(1);
  });

  test("在庫が存在しない場合、在庫が登録されること", async () => {
    const arrival = await caller.registerArrival({ purchaseId: purchase.id });

    const inventory = await prisma.flowerInventory.findUniqueOrThrow({
      where: {
        flowerId_arrivalDate: {
          flowerId: flower.id,
          arrivalDate: new Date(formatDate(arrival.arrivedAt)),
        },
      },
    });
    expect(inventory).toMatchObject({ currentQuantity: 10 });
  });

  test("在庫が存在する場合、在庫数が入荷数のぶん増加すること", async () => {
    const today = new Date(formatDate(new Date()));
    await prisma.flowerInventory.create({
      data: {
        flowerId: flower.id,
        arrivalDate: today,
        currentQuantity: 5,
      },
    });

    await caller.registerArrival({ purchaseId: purchase.id });

    const inventory = await prisma.flowerInventory.findUniqueOrThrow({
      where: {
        flowerId_arrivalDate: {
          flowerId: flower.id,
          arrivalDate: today,
        },
      },
    });
    expect(inventory).toMatchObject({ currentQuantity: 15 });
  });
});
