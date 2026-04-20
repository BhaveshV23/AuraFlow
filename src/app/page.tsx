"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusCard } from "@/components/ui/StatusCard";
import { Users, TrendingUp, Navigation, AlertTriangle, Clock } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { LiveHeatmap } from "@/components/LiveHeatmap";

export default function MapPage() {
  const { zoneDensityMap: zones, selectedZone: selectedZoneId, updateSelectedZone: setSelectedZoneId } = useSimulation();

  const selectedZoneData = selectedZoneId ? zones[selectedZoneId] : null;

  const routingIntelligence = useMemo(() => {
    const north = zones.north_gate;
    const south = zones.south_gate;
    
    const bestExit = north.density < south.density ? north : south;
    const worstExit = north.density < south.density ? south : north;
    
    const riskLevel = bestExit.density <= 40 ? "Low" : bestExit.density <= 75 ? "Moderate" : "High";
    const riskColor = bestExit.density <= 40 ? "text-success" : bestExit.density <= 75 ? "text-warning" : "text-destructive";
    
    const timeSaved = Math.max(1, Math.round((worstExit.density - bestExit.density) * 0.4));

    return {
      recommended: bestExit.name,
      riskLevel,
      riskColor,
      timeSaved: `${timeSaved} mins`
    };
  }, [zones]);

  return (
    <main className="flex flex-col min-h-screen">
      <PageHeader 
        title="Live Flow Intelligence" 
        subtitle="Sector Alpha" 
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
      
      <div className="px-4 space-y-6 pb-20">
        <div className="grid grid-cols-2 gap-4">
          {selectedZoneData ? (
            <>
              <StatusCard
                title={selectedZoneData.name}
                value={`${selectedZoneData.density}%`}
                description="Current Density"
                icon={<Users className="w-4 h-4 text-primary" />}
                status={selectedZoneData.density <= 40 ? "normal" : selectedZoneData.density <= 75 ? "warning" : "critical"}
              />
              <StatusCard
                title="Flow Rate"
                value={`${selectedZoneData.flowRate}/m`}
                description="People per minute"
                icon={<TrendingUp className="w-4 h-4 text-primary" />}
                status="info"
              />
            </>
          ) : (
            <>
              <StatusCard
                title="Select a Zone"
                value="--"
                description="Tap map to view"
                icon={<Users className="w-4 h-4 text-muted" />}
              />
              <StatusCard
                title="Flow Rate"
                value="--"
                description="Awaiting selection"
                icon={<TrendingUp className="w-4 h-4 text-muted" />}
              />
            </>
          )}
        </div>

        <LiveHeatmap 
          zones={zones} 
          selectedZone={selectedZoneId} 
          onSelectZone={setSelectedZoneId} 
        />

        {/* Routing Intelligence Panel */}
        <div className="glass rounded-2xl border border-border/50 overflow-hidden shadow-xl shadow-black/20">
          <div className="bg-secondary/30 px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-primary" />
              Routing Intelligence
            </h3>
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          </div>
          
          <div className="grid grid-cols-3 divide-x divide-border/50 p-4">
            <div className="flex flex-col items-center justify-center text-center px-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Optimum Exit</span>
              <span className="text-sm font-bold text-foreground">{routingIntelligence.recommended}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Risk Level</span>
              <div className={`flex items-center gap-1 ${routingIntelligence.riskColor}`}>
                <AlertTriangle className="w-3 h-3" />
                <span className="text-sm font-bold">{routingIntelligence.riskLevel}</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Time Saved</span>
              <div className="flex items-center gap-1 text-success">
                <Clock className="w-3 h-3" />
                <span className="text-sm font-bold">{routingIntelligence.timeSaved}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
