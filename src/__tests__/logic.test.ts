import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQueuePrediction } from "../hooks/useQueuePrediction";

// Mock the SimulationContext to control the density map input for our test
vi.mock("../context/SimulationContext", () => {
  return {
    useSimulation: vi.fn(),
  };
});

// Mock the concessions data to have a deterministic test case
vi.mock("../data/concessions", () => {
  return {
    concessionsData: [
      { id: "test_stand", name: "Test Stand", mappedZone: "sec_104", baseWaitTime: 5, category: "food" },
    ],
  };
});

import { useSimulation } from "../context/SimulationContext";

describe("useQueuePrediction Logic", () => {
  it("correctly calculates dynamicWaitTime for density 0", () => {
    // Setup mock context return value
    (useSimulation as any).mockReturnValue({
      zoneDensityMap: {
        sec_104: { density: 0 },
      },
    });

    const { result } = renderHook(() => useQueuePrediction());
    const predictedStand = result.current.standsWithPredictions.find(s => s.id === "test_stand");
    
    // Formula: Math.round(baseWaitTime + (density * 0.2))
    // Math.round(5 + (0 * 0.2)) = 5
    expect(predictedStand?.dynamicWaitTime).toBe(5);
    expect(predictedStand?.waitCategory).toBe("Moderate"); // 5 <= 15
  });

  it("correctly calculates dynamicWaitTime for density 50", () => {
    (useSimulation as any).mockReturnValue({
      zoneDensityMap: {
        sec_104: { density: 50 },
      },
    });

    const { result } = renderHook(() => useQueuePrediction());
    const predictedStand = result.current.standsWithPredictions.find(s => s.id === "test_stand");
    
    // Math.round(5 + (50 * 0.2)) = 5 + 10 = 15
    expect(predictedStand?.dynamicWaitTime).toBe(15);
    expect(predictedStand?.waitCategory).toBe("Moderate"); // 15 <= 15
  });

  it("correctly calculates dynamicWaitTime for density 100", () => {
    (useSimulation as any).mockReturnValue({
      zoneDensityMap: {
        sec_104: { density: 100 },
      },
    });

    const { result } = renderHook(() => useQueuePrediction());
    const predictedStand = result.current.standsWithPredictions.find(s => s.id === "test_stand");
    
    // Math.round(5 + (100 * 0.2)) = 5 + 20 = 25
    expect(predictedStand?.dynamicWaitTime).toBe(25);
    expect(predictedStand?.waitCategory).toBe("High"); // 25 > 15
  });
});
