jest.mock("./src/prisma", () => {
  return {
    prisma: jestPrisma.client,
  };
});
