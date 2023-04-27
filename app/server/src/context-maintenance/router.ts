import { router } from "../trpc/init-trpc";
import { createFlower } from "./flower-procedure";

export const maintenanceRouter = router({
  createFlower,
});
