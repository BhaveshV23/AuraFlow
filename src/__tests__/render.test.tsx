import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { LiveHeatmap } from "../components/LiveHeatmap";
import { DensityMap } from "../context/SimulationContext";

const mockZones: DensityMap = {
  north_gate: { id: "north_gate", name: "North Gate", density: 45, flowRate: 120 },
  south_gate: { id: "south_gate", name: "South Gate", density: 20, flowRate: 45 },
  main_concourse: { id: "main_concourse", name: "Main Concourse", density: 80, flowRate: 350 },
  sec_104: { id: "sec_104", name: "Section 104", density: 95, flowRate: 50 },
  sec_105: { id: "sec_105", name: "Section 105", density: 30, flowRate: 20 },
};

describe("LiveHeatmap Component", () => {
  it("renders the SVG without crashing", () => {
    const { container } = render(
      <LiveHeatmap 
        zones={mockZones} 
        selectedZone="main_concourse" 
        onSelectZone={vi.fn()} 
      />
    );

    // Verify that the svg element is correctly mounted
    const svgElement = container.querySelector("svg");
    expect(svgElement).not.toBeNull();
  });
});
