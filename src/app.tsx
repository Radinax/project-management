import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "@/views/dashboard";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Dashboard />
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
