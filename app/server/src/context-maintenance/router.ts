import { router } from "../trpc/init-trpc";
import { createBouquet, getBouquet, getBouquets } from "./bouquet-procedure";
import {
  createFlower,
  getFlower,
  getFlowers,
  updateFlower,
} from "./flower-procedure";

export const maintenanceRouter = router({
  createFlower,
  updateFlower,
  flowers: getFlowers,
  flower: getFlower,
  createBouquet,
  bouquets: getBouquets,
  bouquet: getBouquet,
});
