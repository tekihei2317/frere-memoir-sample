import { z } from "zod";
import { TRPCError, initTRPC } from "@trpc/server";

type AdminUser = { type: "admin"; userId: number };
type CustomerUser = { type: "customer"; userId: number };
type User = AdminUser | CustomerUser;

type Context = {
  user?: User;
};

const t = initTRPC.context<Context>().create();
const middleware = t.middleware;
const router = t.router;

const isAdmin = middleware(async ({ ctx, next }) => {
  if (ctx.user === undefined) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (ctx.user.type !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const adminProcedure = t.procedure.use(isAdmin);

const createUser = adminProcedure.mutation(async ({ ctx }) => {
  // AdminUser
  const admin = ctx.user;
});

async function fetchArticle(articleId: number): Promise<{ articleId: number }> {
  return { articleId };
}

export const procedureWithArticle = t.procedure
  .input(z.object({ articleId: z.number() }))
  .use(async ({ ctx, next, input }) => {
    const article = await fetchArticle(input.articleId);
    return next({ ctx: { ...ctx, article } });
  });

export const getArticle = procedureWithArticle.query(({ ctx }) => ctx.article);
export const updateArticleTitle = procedureWithArticle
  .input(z.object({ title: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // 更新処理
    const updated = { articleId: ctx.article.articleId, title: input.title };

    return updated;
  });

const userRouter = router({ create: t.procedure.query(() => {}) });
const postRouter = router({ create: t.procedure.query(() => {}) });

export const appRouter = t.mergeRouters(userRouter, postRouter);
