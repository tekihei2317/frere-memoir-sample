jest.mock("./src/database/prisma", () => {
  return {
    prisma: jestPrisma.client,
  };
});
