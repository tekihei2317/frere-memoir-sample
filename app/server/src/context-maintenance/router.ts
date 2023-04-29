import { router } from "../trpc/init-trpc";
import { createBouquet } from "./bouquet-procedure";
import { createFlower } from "./flower-procedure";

export const maintenanceRouter = router({
  createFlower,
  createBouquet,
});
