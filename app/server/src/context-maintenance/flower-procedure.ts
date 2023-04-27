import { publicProcedure } from "../trpc/init-trpc";
import { CreateFlowerInput } from "./api-schema";

export const createFlower = publicProcedure
  .input(CreateFlowerInput)
  .mutation(async ({ ctx, input }) => {
    const flower = await ctx.prisma.flower.create({ data: input });

    return flower;
  });
