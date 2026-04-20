"use client";

import { DensityMap, ZoneId } from "@/context/SimulationContext";

interface LiveHeatmapProps {
  zones: DensityMap;
  selectedZone: ZoneId | null;
  onSelectZone: (zoneId: ZoneId) => void;
}

export function LiveHeatmap({ zones, selectedZone, onSelectZone }: LiveHeatmapProps) {
  const getZoneColorClass = (density: number) => {
    if (density <= 40) return "fill-success/20 stroke-success hover:fill-success/40";
    if (density <= 75) return "fill-warning/20 stroke-warning hover:fill-warning/40";
    return "fill-destructive/20 stroke-destructive hover:fill-destructive/40";
  };

  const getStrokeClass = (density: number, isSelected: boolean) => {
    if (isSelected) {
      if (density <= 40) return "stroke-success stroke-[4px] drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]";
      if (density <= 75) return "stroke-warning stroke-[4px] drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]";
      return "stroke-destructive stroke-[4px] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]";
    }
    return "stroke-[2px]";
  };

  const renderZone = (id: ZoneId, d: string, label: string, x: number, y: number) => {
    const zoneData = zones[id];
    const isSelected = selectedZone === id;
    const congestionLevel = zoneData.density <= 40 ? 'Low' : zoneData.density <= 75 ? 'Moderate' : 'High';
    
    return (
      <g 
        key={id}
        onClick={() => onSelectZone(id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectZone(id);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Map Zone: ${zoneData.name}, ${zoneData.density}% density, ${congestionLevel} Congestion`}
        className="cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <path
          d={d}
          className={`transition-all duration-700 ${getZoneColorClass(zoneData.density)} ${getStrokeClass(zoneData.density, isSelected)}`}
          vectorEffect="non-scaling-stroke"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground font-mono text-[10px] uppercase font-bold tracking-widest pointer-events-none drop-shadow-md"
        >
          {label}
        </text>
        <text
          x={x}
          y={y + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground/80 font-mono text-[8px] pointer-events-none drop-shadow-md"
        >
          {zoneData.density}%
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full aspect-square rounded-2xl glass overflow-hidden border border-border/50 shadow-2xl shadow-primary/5 p-4 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
      
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full drop-shadow-2xl z-10"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Live Stadium Crowd Density Heatmap"
      >
        <title>Live Stadium Crowd Density Heatmap</title>
        {/* Background Base */}
        <rect x="10" y="10" width="380" height="380" rx="40" className="fill-black/40 stroke-border stroke-[1px]" />
        
        {/* North Gate */}
        {renderZone(
          "north_gate", 
          "M 120 10 L 280 10 L 260 70 L 140 70 Z", 
          "N GATE", 
          200, 
          40
        )}
        
        {/* South Gate */}
        {renderZone(
          "south_gate", 
          "M 140 330 L 260 330 L 280 390 L 120 390 Z", 
          "S GATE", 
          200, 
          360
        )}
        
        {/* Main Concourse */}
        {renderZone(
          "main_concourse", 
          "M 60 70 L 340 70 L 340 330 L 60 330 Z M 140 120 L 260 120 L 260 280 L 140 280 Z", 
          "CONCOURSE", 
          200, 
          100
        )}
        
        {/* Section 104 (Left) */}
        {renderZone(
          "sec_104", 
          "M 10 120 L 140 120 L 140 280 L 10 280 Z", 
          "SEC 104", 
          75, 
          200
        )}
        
        {/* Section 105 (Right) */}
        {renderZone(
          "sec_105", 
          "M 260 120 L 390 120 L 390 280 L 260 280 Z", 
          "SEC 105", 
          325, 
          200
        )}
        
        {/* Field / Pitch (Center) */}
        <rect 
          x="140" 
          y="120" 
          width="120" 
          height="160" 
          rx="20" 
          className="fill-zinc-900/50 stroke-zinc-700 stroke-[2px]" 
        />
        <text
          x="200"
          y="200"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-zinc-500 font-mono text-[10px] uppercase tracking-widest pointer-events-none"
        >
          FIELD
        </text>
      </svg>
    </div>
  );
}
