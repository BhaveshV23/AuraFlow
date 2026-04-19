import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { SimulationProvider } from "@/context/SimulationContext";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SimulationProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
        <main className="flex-1 pb-16 relative overflow-x-hidden">
          {/* Glow effect background */}
          <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="fixed bottom-0 right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
          
          {children}
        </main>
        <BottomNav />
      </div>
    </SimulationProvider>
  );
}
