import { MantineProvider } from "@mantine/core";
import { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from "~react-pages";

function AppContents() {
  return <Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>;
}

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router>
        <AppContents />
      </Router>
    </MantineProvider>
  );
}

export default App;
