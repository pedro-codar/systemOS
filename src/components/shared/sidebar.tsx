"use client";

import { LogOut, PanelLeft, PanelRight, Brain, MessagesSquare, UserPlus, SquareCheckBig, Calendar, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logout } from "@/lib/lib-auth";
import { toast } from "sonner";

type SidebarItem = "chat" | "knowledge" | "collaborators" | "tasks" | "calendar" | "skills";

type SidebarProps = {
  activeItem: SidebarItem;
};

const navItems: { id: SidebarItem; label: string; href: string; icon: LucideIcon }[] = [
  {
    id: "chat",
    label: "Chat",
    href: "/chat",
    icon: MessagesSquare,
  },
  {
    id: "knowledge",
    label: "Base de conhecimento",
    href: "/knowledge",
    icon: Brain,
  },
  {
    id: "collaborators",
    label: "Colaboradores",
    href: "/collaborators",
    icon: UserPlus,
  },
  {
    id: "tasks",
    label: "Tarefas",
    href: "/tasks",
    icon: SquareCheckBig,
  },
  {
    id: "calendar",
    label: "Calendário",
    href: "/calendar",
    icon: Calendar,
  },
  {
    id: "skills",
    label: "Skills",
    href: "/skills",
    icon: Zap,
  },
];

export function Sidebar({ activeItem }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter()

  async function handleLogout(){
    const {error} = await Logout()
    if (error) {
      toast.error(error.message)
      return
    }

    router.refresh()
    router.push('/auth/login')
  }

  return (
    <aside
      className={`border-sidebar-border flex h-full shrink-0 flex-col border-r transition-all duration-200 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`flex items-center py-5 ${
          isCollapsed ? "justify-center px-2" : "justify-between px-5"
        }`}
      >
        {!isCollapsed && (
          <span className="text-sidebar-foreground text-lg font-semibold tracking-tight">
            SystemOS
          </span>
        )}
        <button
          type="button"
          aria-label={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
          aria-expanded={!isCollapsed}
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg p-2 transition-colors"
        >
          {isCollapsed ? <PanelRight className="size-4" /> : <PanelLeft className="size-4" />}
        </button>
      </div>

      <nav className={`flex-1 ${isCollapsed ? "px-2" : "px-3"}`}>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.id === activeItem;
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center rounded-lg text-sm transition-colors ${
                    isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                  } ${
                    isActive
                      ? "bg-popover text-foreground font-medium"
                      : "text-muted-foreground font-normal hover:bg-popover hover:text-foreground"
                  }`}
                >
                  <Icon className="size-[18px] shrink-0 text-foreground" />
                  {!isCollapsed && item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={`border-sidebar-border border-t ${isCollapsed ? "p-2" : "p-4"}`}>
        <div
          className={`flex items-center ${isCollapsed ? "flex-col gap-2" : "gap-3"}`}
        >
          <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
            AD
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground truncate text-sm font-medium">
                Administrador
              </p>
              <p className="text-muted-foreground truncate text-xs">
                Foco em Layout Inc.
              </p>
            </div>
          )}
          <button
            type="button"
            aria-label="Sair"
            className="text-muted-foreground hover:text-sidebar-foreground shrink-0 rounded-lg p-2 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
