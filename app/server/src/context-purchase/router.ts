import { router } from "../trpc/init-trpc";
import { createPurchase } from "./create-purchase";

export const purchaseRouter = router({
  createPurchase,
});
