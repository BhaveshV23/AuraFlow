"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useVenueAlerts, VenueAlert } from "@/hooks/useVenueAlerts";
import { useSimulation } from "@/context/SimulationContext";
import { BellRing, ShieldAlert, Info, Zap, Terminal, Activity, ArrowRight, Play } from "lucide-react";

export default function AlertsPage() {
  const { alerts, latestAlert, clearAlerts } = useVenueAlerts();
  const { zoneDensityMap, simulateSurge } = useSimulation();
  
  // System Uptime Timer
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getAlertStyle = (severity: string) => {
    switch(severity) {
      case "Critical": return { border: "border-destructive/50", bg: "bg-destructive/10", text: "text-destructive", icon: <ShieldAlert className="w-5 h-5 text-destructive" /> };
      case "Warning": return { border: "border-warning/50", bg: "bg-warning/10", text: "text-warning", icon: <BellRing className="w-5 h-5 text-warning" /> };
      case "Info": return { border: "border-primary/50", bg: "bg-primary/10", text: "text-primary", icon: <Info className="w-5 h-5 text-primary" /> };
      default: return { border: "border-border", bg: "bg-background", text: "text-foreground", icon: <Info className="w-5 h-5 text-muted-foreground" /> };
    }
  };

  // Cross-System Recommendation Banner logic
  const recommendation = useMemo(() => {
    if (!latestAlert) return "System nominal. All zones operating within standard capacity.";
    
    if (latestAlert.severity === "Critical") {
      const bestAlternative = Object.values(zoneDensityMap)
        .filter(z => z.id !== latestAlert.zone)
        .sort((a, b) => a.density - b.density)[0];
      return `Redirect attendees away from ${zoneDensityMap[latestAlert.zone]?.name}. Use ${bestAlternative?.name} for faster movement.`;
    }
    
    if (latestAlert.severity === "Warning") {
      return `Monitor ${zoneDensityMap[latestAlert.zone]?.name} closely. Prepare crowd diversion protocols.`;
    }
    
    return "Congestion resolved. Resuming standard routing operations.";
  }, [latestAlert, zoneDensityMap]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader 
        title="Command Hub" 
        subtitle="Automated Coordination" 
      />
      
      <div className="px-4 space-y-6 pb-24">
        
        {/* Real-Time System Status Indicator */}
        <div className="flex flex-col gap-2 p-3 glass rounded-xl border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
              </span>
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                WebSocket: <span className="text-success font-bold">Connected</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded border border-border/50">
              <Activity className="w-3 h-3 text-primary" />
              UPTIME: {formatUptime(uptime)}
            </div>
          </div>
        </div>

        {/* Cross-System Recommendation Banner */}
        <div className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-500
          ${latestAlert?.severity === "Critical" ? "bg-destructive/10 border-destructive/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : 
            latestAlert?.severity === "Warning" ? "bg-warning/10 border-warning/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]" : 
            "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Zap className={`w-5 h-5 ${
                latestAlert?.severity === "Critical" ? "text-destructive animate-pulse" : 
                latestAlert?.severity === "Warning" ? "text-warning" : "text-primary"
              }`} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80 flex items-center gap-2">
                Active Recommendation
              </h3>
              <p className="text-sm font-medium leading-snug">
                {recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Demo Control Panel */}
        <div className="glass rounded-xl border border-border/50 overflow-hidden">
          <div className="bg-secondary/30 px-3 py-2 border-b border-border/50 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Developer Demo Controls
            </span>
          </div>
          <div className="p-4">
            <button 
              onClick={() => simulateSurge("main_concourse", 95, 10000)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive font-bold uppercase tracking-widest text-sm hover:bg-destructive/20 active:scale-[0.98] transition-all"
            >
              <Play className="w-4 h-4" /> Simulate Sector Surge
            </button>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Forces Main Concourse to 95% density for 10s.
            </p>
          </div>
        </div>

        {/* Alert Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              Live Alert Feed
            </h2>
            <div className="flex items-center gap-2">
              {alerts.length > 0 && (
                <button onClick={clearAlerts} className="text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-wider mr-2">
                  Clear All
                </button>
              )}
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                {alerts.length} Active
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {alerts.length === 0 ? (
              <div className="p-8 border border-dashed border-border/50 rounded-xl text-center flex flex-col items-center justify-center text-muted-foreground glass">
                <Activity className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No active alerts</p>
              </div>
            ) : (
              alerts.map((alert) => {
                const style = getAlertStyle(alert.severity);
                return (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-xl border relative overflow-hidden transition-all hover:scale-[1.02] cursor-pointer ${style.bg} ${style.border}`}
                  >
                    <div className="flex gap-4 relative z-10">
                      <div className="mt-1">
                        {style.icon}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-foreground tracking-tight">{alert.title}</h3>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm opacity-80 leading-snug">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-current/10">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}>
                            {alert.severity}
                          </span>
                          <span className="text-[10px] opacity-50 uppercase tracking-widest">
                            • {zoneDensityMap[alert.zone]?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Left accent border */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      alert.severity === 'Critical' ? 'bg-destructive' : 
                      alert.severity === 'Warning' ? 'bg-warning' : 
                      'bg-primary'
                    }`} />
                  </div>
                );
              })
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
