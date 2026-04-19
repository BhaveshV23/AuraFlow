"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Clock, Bell } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Map",
      href: "/",
      icon: Map,
    },
    {
      label: "Queues",
      href: "/concessions",
      icon: Clock,
    },
    {
      label: "Hub",
      href: "/alerts",
      icon: Bell,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" : ""}`} />
              <span className="text-[10px] font-medium tracking-wide uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
