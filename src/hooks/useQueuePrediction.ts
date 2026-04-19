import { useMemo } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { concessionsData, ConcessionStand } from "@/data/concessions";

export type WaitCategory = "Low" | "Moderate" | "High";

export interface PredictedStand extends ConcessionStand {
  dynamicWaitTime: number;
  waitCategory: WaitCategory;
  waitColor: string;
}

export function useQueuePrediction() {
  const { zoneDensityMap } = useSimulation();

  const standsWithPredictions = useMemo(() => {
    const calculated = concessionsData.map((stand) => {
      const density = zoneDensityMap[stand.mappedZone]?.density || 0;
      // Formula: dynamicWaitTime = baseWaitTime + (zoneDensity * 0.2)
      const dynamicWaitTime = Math.round(stand.baseWaitTime + (density * 0.2));
      
      let waitCategory: WaitCategory = "High";
      let waitColor = "text-destructive border-destructive/30 bg-destructive/5";
      
      if (dynamicWaitTime < 5) {
        waitCategory = "Low";
        waitColor = "text-success border-success/30 bg-success/5";
      } else if (dynamicWaitTime <= 15) {
        waitCategory = "Moderate";
        waitColor = "text-warning border-warning/30 bg-warning/5";
      }

      return {
        ...stand,
        dynamicWaitTime,
        waitCategory,
        waitColor,
      };
    });

    // Sort by fastest availability
    return calculated.sort((a, b) => a.dynamicWaitTime - b.dynamicWaitTime);
  }, [zoneDensityMap]);

  // Expose the recommended stand (fastest wait time, usually excluding restrooms or prioritizing food/beverage if preferred, but we'll just take the fastest food/bev)
  const recommendedStand = useMemo(() => {
    return standsWithPredictions.find(s => s.category !== "restroom") || standsWithPredictions[0];
  }, [standsWithPredictions]);

  return {
    standsWithPredictions,
    recommendedStand,
  };
}
