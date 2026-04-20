"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useQueuePrediction, PredictedStand } from "@/hooks/useQueuePrediction";
import { useSimulation } from "@/context/SimulationContext";
import { Coffee, Pizza, Timer, XCircle, CheckCircle2, Zap, Utensils } from "lucide-react";

export default function ConcessionsPage() {
  const { standsWithPredictions, recommendedStand } = useQueuePrediction();
  const { zoneDensityMap } = useSimulation();
  
  const [activeQueueId, setActiveQueueId] = useState<string | null>(null);
  
  const activeStand = activeQueueId 
    ? standsWithPredictions.find(s => s.id === activeQueueId) 
    : null;

  // Calculate time saved for the recommended stand
  const worstStand = recommendedStand 
    ? standsWithPredictions.filter(s => s.category === recommendedStand.category).pop() 
    : null;
  const timeSaved = (worstStand && recommendedStand) 
    ? Math.max(0, worstStand.dynamicWaitTime - recommendedStand.dynamicWaitTime) 
    : 0;

  if (activeStand) {
    return (
      <main className="flex flex-col min-h-screen">
        <PageHeader title="Virtual Queue" subtitle="Active Order" />
        
        <div className="px-4 space-y-6 flex-1 flex flex-col items-center justify-center pb-20">
          <div className="relative w-full max-w-sm glass rounded-3xl border border-primary/30 p-8 flex flex-col items-center text-center overflow-hidden">
            {/* Background pulsing effect */}
            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <div className="relative z-10 w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <Timer className="w-10 h-10 text-primary animate-bounce" />
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">{activeStand.name}</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
              {zoneDensityMap[activeStand.mappedZone]?.name || "Zone"}
            </p>
            
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-1 uppercase tracking-widest">Live Wait Time</p>
              <div className="text-6xl font-black text-primary tracking-tighter drop-shadow-md">
                {activeStand.dynamicWaitTime}
                <span className="text-2xl font-bold text-muted-foreground ml-2">min</span>
              </div>
              <p className="text-xs text-primary/70 mt-2 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> Adapting to crowd flow
              </p>
            </div>
            
            <button 
              onClick={() => setActiveQueueId(null)}
              aria-label="Cancel Virtual Order"
              className="w-full py-4 rounded-xl border border-destructive/50 bg-destructive/10 text-destructive font-bold uppercase tracking-widest hover:bg-destructive/20 transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <XCircle className="w-5 h-5" /> Cancel Order
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      <PageHeader 
        title="Smart Queues" 
        subtitle="Predictive Wait Times" 
        action={
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Live</span>
          </div>
        }
      />
      
      <div className="px-4 space-y-6 pb-24">
        
        {/* Recommendation Panel */}
        {recommendedStand && (
          <div aria-live="polite" className="glass rounded-2xl p-5 border border-primary/40 shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Zap className="w-24 h-24 text-primary" />
            </div>
            
            <h2 className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> System Recommendation
            </h2>
            
            <div className="flex justify-between items-end mb-4 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-foreground">{recommendedStand.name}</h3>
                <p className="text-sm text-muted-foreground">{zoneDensityMap[recommendedStand.mappedZone]?.name}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-primary">{recommendedStand.dynamicWaitTime}<span className="text-sm">m</span></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
              <div className="bg-background/50 rounded-lg p-2 border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Time Saved</p>
                <p className="text-sm font-bold text-success">~{timeSaved} mins</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Risk Level</p>
                <p className="text-sm font-bold text-success">Low</p>
              </div>
            </div>

            <button 
              onClick={() => setActiveQueueId(recommendedStand.id)}
              aria-label={`Join Virtual Queue for Recommended Stand ${recommendedStand.name}`}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Join Virtual Queue
            </button>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            All Concessions
          </h2>
          
          <div className="flex flex-col gap-3">
            {standsWithPredictions.map((stand) => (
              <div 
                key={stand.id}
                className={`p-4 rounded-xl border relative overflow-hidden transition-all ${stand.waitColor}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-background/50 border border-border/50 shadow-sm">
                      {stand.category === "food" ? <Pizza className="w-4 h-4" /> : 
                       stand.category === "beverage" ? <Coffee className="w-4 h-4" /> : 
                       <Utensils className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{stand.name}</h3>
                      <p className="text-xs opacity-70">
                        {zoneDensityMap[stand.mappedZone]?.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-black drop-shadow-sm">{stand.dynamicWaitTime}<span className="text-xs opacity-70 ml-0.5">m</span></div>
                    <div className="text-[9px] uppercase tracking-wider font-bold opacity-80">{stand.waitCategory}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-current/10">
                  <button 
                    onClick={() => setActiveQueueId(stand.id)}
                    aria-label={`Join Queue for ${stand.name}`}
                    className="w-full py-2 rounded-lg bg-foreground/10 text-xs font-bold uppercase tracking-widest hover:bg-foreground/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Join Queue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
