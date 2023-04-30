import { Box, Flex, Tabs, Title } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";

function rootPagePath(path: string): string {
  return path.split("/").slice(0, 2).join("/");
}

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = rootPagePath(location.pathname);

  return (
    <Box>
      <Flex py="xs" px="xs" justify="space-between">
        <Title order={1} size="h2">
          frere-memoir
        </Title>
      </Flex>
      <Tabs
        value={activeTab}
        onTabChange={(value) => navigate(`${value}`)}
        px="xs"
      >
        <Tabs.List>
          <Tabs.Tab value="/orders">注文</Tabs.Tab>
          <Tabs.Tab value="/purchases">仕入れ</Tabs.Tab>
          <Tabs.Tab value="/inventories">在庫</Tabs.Tab>
          <Tabs.Tab value="/bouquets">花束</Tabs.Tab>
          <Tabs.Tab value="/flowers">花</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Box px="xs" py="xs">
        {children}
      </Box>
    </Box>
  );
};
