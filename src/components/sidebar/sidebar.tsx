import ComingSoonTooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import {
  SheetTitle,
  SheetTrigger,
  SheetContent,
  Sheet,
} from "@/components/ui/sheet";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarL,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  FileText,
  HelpCircle,
  Home,
  Menu,
  Settings,
  Shield,
  Users,
  type LucideProps,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type MenuItem = {
  id: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
};

const MENU_ITEMS_CONTENT: MenuItem[] = [
  { id: "dashboard", icon: Home, label: "Dashboard", url: "#" },
  { id: "stats", icon: BarChart3, label: "Stats", url: "#" },
  { id: "community", icon: Users, label: "Community", url: "#" },
  { id: "reports", icon: FileText, label: "Reports", url: "#" },
  { id: "admin", icon: Shield, label: "Admin", url: "#" },
];
const MENU_ITEMS_FOOTER: MenuItem[] = [
  { id: "support", icon: HelpCircle, label: "Support", url: "#" },
  { id: "settings", icon: Settings, label: "Settings", url: "#" },
];

interface AppSidebarProps {
  activeItem: string;
  onItemSelect: (item: string) => void;
  inProgressQty?: number;
}

function AppSidebar({
  activeItem,
  onItemSelect,
  inProgressQty,
}: AppSidebarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleItemClick = (itemId: string) => {
    onItemSelect(itemId);
    setIsSheetOpen(false);
  };

  const sidebarContent = (
    <>
      <SidebarHeader className="bg-white">
        <div className="px-3 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Taskflow</h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="scroll-m-0 bg-white">
        <SidebarGroup className="flex flex-col justify-between h-full my-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {MENU_ITEMS_CONTENT.map((item) => (
                <SidebarMenuItem key={item.id} className="relative">
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`w-full flex items-center justify-start px-3 py-6 rounded-lg mb-1 transition-all duration-200 ${
                        activeItem === item.id
                          ? "text-indigo-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      {activeItem === item.id && (
                        <div className="h-12 w-2 bg-indigo-700 rounded-r-3xl absolute top-0 -left-2" />
                      )}
                      <item.icon
                        style={{
                          width: "20px",
                          height: "20px",
                        }}
                        className={`${
                          activeItem === item.id
                            ? "text-indigo-700"
                            : "text-indigo-400"
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                      {activeItem === item.id && inProgressQty && (
                        <div className="h-5 w-5 bg-indigo-700 rounded-r-3xl absolute top-0 right-0 text-white">
                          {inProgressQty}
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarFooter>
            {MENU_ITEMS_FOOTER.map((item) => (
              <ComingSoonTooltip key={item.id}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.url}
                    className="w-full flex items-center justify-start px-3 py-2.5 rounded-lg mb-1 text-gray-400 hover:text-gray-400 cursor-default"
                  >
                    <item.icon
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </ComingSoonTooltip>
            ))}
          </SidebarFooter>
        </SidebarGroup>
      </SidebarContent>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white">
        <SidebarL
          collapsible="icon"
          className="bg-white text-gray-600 border-0 border-r-0 border-zinc-200"
        >
          {sidebarContent}
        </SidebarL>
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <div className="relative lg:hidden !bg-transparent">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTitle className="sr-only">menu</SheetTitle>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 mt-2 !bg-white border border-zinc-200 absolute top-2"
            >
              <Menu className="h-6 w-6 bg-white text-gray-500" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 sm:max-w-xs">
            {/* The SheetContent will contain the sidebar content */}
            <SidebarL
              collapsible="none"
              className="bg-white text-gray-600 w-full h-full"
            >
              {sidebarContent}
            </SidebarL>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default AppSidebar;
