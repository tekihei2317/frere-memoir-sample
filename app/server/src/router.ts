import { publicProcedure, router } from "./trpc/init-trpc";
import * as trpcExpress from "@trpc/server/adapters/express";

export const appRouter = router({
  hello: publicProcedure.query(() => "Hello, tRPC!"),
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
});
