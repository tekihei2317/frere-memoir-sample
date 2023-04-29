import { publicProcedure } from "../trpc/init-trpc";
import { notFoundError } from "../utils/trpc";
import { BouquetIdInput, CreateBouquetInput } from "./api-schema";

export const createBouquet = publicProcedure
  .input(CreateBouquetInput)
  .mutation(async ({ ctx, input }) => {
    const bouquet = await ctx.prisma.bouquet.create({
      data: {
        bouquetCode: input.bouquetCode,
        name: input.name,
        bouquetDetails: {
          createMany: {
            data: input.bouquetDetails,
          },
        },
      },
    });

    return bouquet;
  });

export const getBouquets = publicProcedure.query(({ ctx }) => {
  return ctx.prisma.bouquet.findMany({
    select: { id: true, bouquetCode: true, name: true },
  });
});

export const getBouquet = publicProcedure
  .input(BouquetIdInput)
  .query(async ({ ctx, input }) => {
    const flower = await ctx.prisma.bouquet.findUnique({
      where: { id: input.bouquetId },
      include: {
        bouquetDetails: {
          include: {
            flower: {
              select: { id: true, name: true, flowerCode: true },
            },
          },
        },
      },
    });
    if (flower === null) throw notFoundError;

    return flower;
  });
