import { useState, useEffect, useRef } from "react";
import { useSimulation, ZoneId } from "@/context/SimulationContext";

export type AlertSeverity = "Critical" | "Warning" | "Info";
export type AlertCategory = "congestion" | "routing" | "recovery";

export interface VenueAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  zone: ZoneId;
  timestamp: Date;
}

export function useVenueAlerts() {
  const { zoneDensityMap } = useSimulation();
  const [alerts, setAlerts] = useState<VenueAlert[]>([]);
  
  // Track previous densities to calculate surges
  const prevDensityRef = useRef<Record<ZoneId, number>>({} as Record<ZoneId, number>);
  // Track if a zone is currently in a congested state to trigger recovery
  const congestedZonesRef = useRef<Set<ZoneId>>(new Set());

  useEffect(() => {
    const newAlerts: VenueAlert[] = [];
    const now = new Date();

    Object.entries(zoneDensityMap).forEach(([key, zoneData]) => {
      const zoneId = key as ZoneId;
      const currentDensity = zoneData.density;
      const prevDensity = prevDensityRef.current[zoneId];
      const isCongested = congestedZonesRef.current.has(zoneId);

      // 1. Surge Detection (Warning)
      if (prevDensity !== undefined && (currentDensity - prevDensity) > 20) {
        newAlerts.push({
          id: `surge-${zoneId}-${now.getTime()}`,
          title: "Sudden Surge Detected",
          message: `Rapid crowd influx detected at ${zoneData.name}. Monitor flow rate.`,
          severity: "Warning",
          category: "routing",
          zone: zoneId,
          timestamp: now,
        });
      }

      // 2. Congestion Detection (Critical)
      if (currentDensity > 80 && !isCongested) {
        congestedZonesRef.current.add(zoneId);
        newAlerts.push({
          id: `congest-${zoneId}-${now.getTime()}`,
          title: "Critical Congestion",
          message: `${zoneData.name} has exceeded 80% capacity. Redirecting traffic.`,
          severity: "Critical",
          category: "congestion",
          zone: zoneId,
          timestamp: now,
        });
      }

      // 3. Recovery Detection (Info)
      if (currentDensity < 60 && isCongested) {
        congestedZonesRef.current.delete(zoneId);
        newAlerts.push({
          id: `recover-${zoneId}-${now.getTime()}`,
          title: "Flow Restored",
          message: `${zoneData.name} congestion cleared. Normal operations resumed.`,
          severity: "Info",
          category: "recovery",
          zone: zoneId,
          timestamp: now,
        });
      }

      // Update ref for next cycle
      prevDensityRef.current[zoneId] = currentDensity;
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev]);
    }
  }, [zoneDensityMap]);

  const clearAlerts = () => setAlerts([]);

  return {
    alerts,
    latestAlert: alerts[0] || null,
    clearAlerts
  };
}
