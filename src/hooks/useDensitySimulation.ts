import { useState, useEffect } from "react";

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

export function useDensitySimulation() {
  const [zones, setZones] = useState<DensityMap>(initialZones);

  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prevZones) => {
        const nextZones = { ...prevZones };
        
        Object.keys(nextZones).forEach((key) => {
          const zoneId = key as ZoneId;
          const currentZone = nextZones[zoneId];
          
          // Random walk for density, constrained 0-100
          const densityChange = Math.floor(Math.random() * 15) - 7; 
          let newDensity = currentZone.density + densityChange;
          newDensity = Math.max(0, Math.min(100, newDensity));
          
          // Flow rate roughly correlates with density but has its own variance
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
  }, []);

  return { zones };
}
