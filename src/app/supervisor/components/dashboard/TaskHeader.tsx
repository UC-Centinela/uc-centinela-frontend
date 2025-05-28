"use client";

import { useState } from "react";
import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/services/users";

interface HeaderProps {
  children: React.ReactNode;
  onTabChange?: (value: string) => void;
}

export function Header({ children, onTabChange }: HeaderProps) {
  const [currentTab, setCurrentTab] = useState("all-tasks");
  const router = useRouter();

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  const tabStyles =
    "transition-all duration-200 data-[state=active]:border-b-2 data-[state=active]:border-[#176170] data-[state=active]:text-[#176170] data-[state=active]:font-medium rounded-none bg-transparent px-4 py-2 text-[#666666] hover:text-[#176170] relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#176170] after:opacity-0 hover:after:opacity-50 after:transition-opacity";

  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h6 className="text-xs text-[#666666] font-medium">
              Supervisor de evaluación de riesgo
            </h6>
            <h1 className="text-[#176170] font-semibold text-xl">
              Tareas Minera Centinela
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <User className="h-5 w-5 text-teal-700" />
            </button>
            <a
              href="/auth/logout"
              className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center"
              onClick={() => handleLogout()}
            >
              <LogOut className="h-5 w-5 text-teal-700" />
            </a>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="bg-transparent border-b w-full justify-start gap-4 h-auto p-0">
            <TabsTrigger value="all-tasks" className={tabStyles}>
              Todas las tareas
            </TabsTrigger>
            <TabsTrigger value="assigned" className={tabStyles}>
              Asignadas
            </TabsTrigger>
            <TabsTrigger value="review" className={tabStyles}>
              En Revisión
            </TabsTrigger>
            <TabsTrigger value="approved" className={tabStyles}>
              Aprobadas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-tasks" className="mt-4">
            {children}
          </TabsContent>
          <TabsContent value="assigned" className="mt-4">
            {children}
          </TabsContent>
          <TabsContent value="review" className="mt-4">
            {children}
          </TabsContent>
          <TabsContent value="approved" className="mt-4">
            {children}
          </TabsContent>
        </Tabs>
      </div>
    </header>
  );
}
