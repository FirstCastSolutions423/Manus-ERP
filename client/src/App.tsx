import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import Tickets from "./pages/Tickets";
import DataImports from "./pages/DataImports";
import Integrations from "./pages/Integrations";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/tasks"} component={Tasks} />
      <Route path={"/transactions"} component={Transactions} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/documents"} component={Documents} />
      <Route path={"/tickets"} component={Tickets} />
      <Route path={"/data-imports"} component={DataImports} />
      <Route path={"/integrations"} component={Integrations} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/notifications"} component={Notifications} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
