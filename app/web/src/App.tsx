import { MantineProvider } from "@mantine/core";
import { Suspense, useState } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from "~react-pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "~/utils/trpc";

function AppContents() {
  return <Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>;
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Router>
            <AppContents />
          </Router>
        </MantineProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
