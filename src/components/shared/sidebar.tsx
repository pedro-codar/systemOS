"use client";

import {
  LogOut,
  PanelLeft,
  PanelRight,
  Brain,
  MessagesSquare,
  UserPlus,
  SquareCheckBig,
  Plug2,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logout } from "@/lib/lib-auth";
import { toast } from "sonner";
import { useAppContext } from "@/context/app-context";

type SidebarItem = "chat" | "knowledge" | "collaborators" | "tasks" | "integrations";

type SidebarProps = {
  activeItem: SidebarItem;
};

const navItems: {
  id: SidebarItem;
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}[] = [
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
    adminOnly: true,
  },
  {
    id: "collaborators",
    label: "Colaboradores",
    href: "/collaborators",
    icon: UserPlus,
    adminOnly: true,
  },
  {
    id: "tasks",
    label: "Tarefas",
    href: "/tasks",
    icon: SquareCheckBig,
  },
  {
    id: "integrations",
    label: "Integrações",
    href: "/integrations",
    icon: Plug2,
  },
];

export function Sidebar({ activeItem }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { company, profile, isAdmin } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  async function handleLogout() {
    const { error } = await Logout();
    if (error) {
      toast.error(error.message);
      return;
    }

    router.refresh();
    router.push("/auth/login");
  }

  function closeMobile() {
    setIsMobileOpen(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={() => setIsMobileOpen(true)}
        className="bg-sidebar border-border text-foreground hover:bg-muted fixed top-3 left-3 z-40 rounded-lg border p-2 shadow-sm md:hidden"
      >
        <Menu className="size-5" />
      </button>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col border-r transition-all duration-200 md:static ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-16" : "w-72 md:w-64"}`}
      >
        <div
          className={`flex items-center py-5 ${
            isCollapsed ? "justify-center px-2 md:justify-center" : "justify-between px-5"
          }`}
        >
          {!isCollapsed && (
            <img
              src="https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/oratos_name.png"
              alt="Oratos"
              width={1170}
              height={213}
              className="h-auto w-full max-w-[80px]"
            />
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={closeMobile}
              className="text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg p-2 transition-colors md:hidden"
            >
              <X className="size-4" />
            </button>
            <button
              type="button"
              aria-label={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
              aria-expanded={!isCollapsed}
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent hidden rounded-lg p-2 transition-colors md:inline-flex"
            >
              {isCollapsed ? <PanelRight className="size-4" /> : <PanelLeft className="size-4" />}
            </button>
          </div>
        </div>

        <nav className={`flex-1 ${isCollapsed ? "px-2" : "px-3"}`}>
          <ul className="flex flex-col gap-1">
            {navItems
              .filter((item) => !item.adminOnly || isAdmin)
              .map((item) => {
                const isActive = item.id === activeItem;
                const Icon = item.icon;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      onClick={closeMobile}
                      className={`flex items-center rounded-lg text-sm transition-colors ${
                        isCollapsed ? "justify-center p-2.5 md:justify-center" : "gap-3 px-3 py-2"
                      } ${
                        isActive
                          ? "bg-popover text-foreground font-medium"
                          : "text-muted-foreground font-normal hover:bg-popover hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-[18px] shrink-0 text-foreground" />
                      <span className={isCollapsed ? "md:hidden" : undefined}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        <div className={`border-sidebar-border border-t ${isCollapsed ? "p-2" : "p-4"}`}>
          <div className={`flex items-center ${isCollapsed ? "flex-col gap-2" : "gap-3"}`}>
            <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
              {profile?.name?.slice(0, 2).toUpperCase() || "AD"}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sidebar-foreground truncate text-sm font-medium">
                  {profile?.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">{company?.name}</p>
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
    </>
  );
}
