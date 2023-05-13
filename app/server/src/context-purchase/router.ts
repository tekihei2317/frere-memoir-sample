import { router } from "../trpc/init-trpc";
import { createPurchase } from "./create-purchase";
import { registerArrival } from "./register-arrival";

export const purchaseRouter = router({
  createPurchase,
  registerArrival,
});
