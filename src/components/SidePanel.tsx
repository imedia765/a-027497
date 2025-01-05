import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings, Users, UserCheck, Menu, X } from "lucide-react";
import { UserRole } from "@/hooks/useRoleAccess";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidePanelProps {
  onTabChange: (value: string) => void;
  userRole: UserRole;
}

const SidePanel = ({ onTabChange, userRole }: SidePanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getTabs = () => {
    const tabs = [
      {
        value: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        roles: ['member', 'collector', 'admin']
      },
      {
        value: 'users',
        label: 'Members',
        icon: Users,
        roles: ['collector', 'admin']
      },
      {
        value: 'collectors',
        label: 'Collectors',
        icon: UserCheck,
        roles: ['admin']
      },
      {
        value: 'settings',
        label: 'Settings',
        icon: Settings,
        roles: ['admin']
      }
    ];

    return tabs.filter(tab => {
      if (!userRole) return false;
      return tab.roles.includes(userRole);
    });
  };

  const toggleSidePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidePanel}
        className="fixed top-24 left-4 z-50 p-2 rounded-md bg-dashboard-card md:hidden text-dashboard-text hover:text-white transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidePanel}
        />
      )}

      {/* Side Panel */}
      <div className={cn(
        "fixed left-0 top-0 h-screen w-64 glass-card border-r border-white/10 z-40 transition-transform duration-300 ease-in-out mt-[88px]",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4">
          <h2 className="text-xl font-medium mb-6 text-dashboard-text">Navigation</h2>
          <Tabs 
            defaultValue="dashboard" 
            orientation="vertical" 
            className="w-full"
            onValueChange={(value) => {
              onTabChange(value);
              if (window.innerWidth < 768) {
                setIsOpen(false);
              }
            }}
          >
            <TabsList className="flex flex-col h-auto bg-transparent text-white">
              {getTabs().map(({ value, label, icon: Icon }) => (
                <TabsTrigger 
                  key={value}
                  value={value} 
                  className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white px-4 py-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SidePanel;