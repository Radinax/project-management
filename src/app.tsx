import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "@/views/dashboard";

function App() {
  return (
    <SidebarProvider>
      <Dashboard />
    </SidebarProvider>
  );
}

export default App;
