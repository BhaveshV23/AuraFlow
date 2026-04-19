"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ZoneId = "north_gate" | "south_gate" | "main_concourse" | "sec_104" | "sec_105";

export interface ZoneData {
  id: ZoneId;
  name: string;
  density: number; // 0-100
  flowRate: number; // people per minute
}

export type DensityMap = Record<ZoneId, ZoneData>;

const initialZones: DensityMap = {
  north_gate: { id: "north_gate", name: "North Gate", density: 45, flowRate: 120 },
  south_gate: { id: "south_gate", name: "South Gate", density: 20, flowRate: 45 },
  main_concourse: { id: "main_concourse", name: "Main Concourse", density: 80, flowRate: 350 },
  sec_104: { id: "sec_104", name: "Section 104", density: 95, flowRate: 50 },
  sec_105: { id: "sec_105", name: "Section 105", density: 30, flowRate: 20 },
};

interface SimulationContextProps {
  zoneDensityMap: DensityMap;
  selectedZone: ZoneId | null;
  updateSelectedZone: (zoneId: ZoneId | null) => void;
  simulateSurge: (zoneId: ZoneId, targetDensity: number, durationMs: number) => void;
}

const SimulationContext = createContext<SimulationContextProps | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [zoneDensityMap, setZoneDensityMap] = useState<DensityMap>(initialZones);
  const [selectedZone, setSelectedZone] = useState<ZoneId | null>("main_concourse");
  
  // Track forced surge state
  const [surgeLocks, setSurgeLocks] = useState<Record<string, number>>({});

  const simulateSurge = (zoneId: ZoneId, targetDensity: number, durationMs: number) => {
    // Apply immediate surge
    setZoneDensityMap(prev => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId],
        density: targetDensity,
        flowRate: Math.min(500, prev[zoneId].flowRate + 150)
      }
    }));
    
    // Set lock to prevent random walk from dropping it for duration
    const unlockTime = Date.now() + durationMs;
    setSurgeLocks(prev => ({ ...prev, [zoneId]: unlockTime }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setZoneDensityMap((prevZones) => {
        const nextZones = { ...prevZones };
        const now = Date.now();
        
        Object.keys(nextZones).forEach((key) => {
          const zoneId = key as ZoneId;
          const currentZone = nextZones[zoneId];
          
          // Check if zone is currently locked by a surge
          if (surgeLocks[zoneId] && now < surgeLocks[zoneId]) {
            // Keep at high density with minor fluctuations
            const densityChange = Math.floor(Math.random() * 5) - 2;
            nextZones[zoneId] = {
              ...currentZone,
              density: Math.max(90, Math.min(100, currentZone.density + densityChange)),
            };
            return; // skip normal random walk
          }
          
          // Normal random walk for density
          const densityChange = Math.floor(Math.random() * 15) - 7; 
          let newDensity = currentZone.density + densityChange;
          newDensity = Math.max(0, Math.min(100, newDensity));
          
          // Flow rate roughly correlates with density
          const flowRateChange = Math.floor(Math.random() * 21) - 10;
          let newFlowRate = Math.max(0, currentZone.flowRate + flowRateChange);
          
          nextZones[zoneId] = {
            ...currentZone,
            density: newDensity,
            flowRate: newFlowRate,
          };
        });
        
        return nextZones;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [surgeLocks]);

  return (
    <SimulationContext.Provider value={{ zoneDensityMap, selectedZone, updateSelectedZone: setSelectedZone, simulateSurge }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}

