import { prisma } from "./database/prisma";
import {
  Context,
  mergeRouters,
  publicProcedure,
  router,
} from "./trpc/init-trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import { maintenanceRouter } from "./context-maintenance/router";

export const appRouter = mergeRouters(maintenanceRouter);

export type AppRouter = typeof appRouter;

function createContext({}: trpcExpress.CreateExpressContextOptions): Context {
  return { prisma };
}

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});