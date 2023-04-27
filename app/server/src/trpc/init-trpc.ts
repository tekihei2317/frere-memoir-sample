import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";

export type Context = {
  prisma: PrismaClient;
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const publicProcedure = t.procedure;
