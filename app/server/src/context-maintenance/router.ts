import { router } from "../trpc/init-trpc";
import { createBouquet, getBouquet, getBouquets } from "./bouquet-procedure";
import { createFlower } from "./flower-procedure";

export const maintenanceRouter = router({
  createFlower,
  createBouquet,
  bouquets: getBouquets,
  bouquet: getBouquet,
});
