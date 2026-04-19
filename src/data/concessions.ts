import { ZoneId } from "@/context/SimulationContext";

export interface ConcessionStand {
  id: string;
  name: string;
  mappedZone: ZoneId;
  baseWaitTime: number; // base wait time in minutes
  category: "food" | "beverage" | "restroom";
}

export const concessionsData: ConcessionStand[] = [
  { id: "neon_burger", name: "Neon Burger", mappedZone: "sec_104", baseWaitTime: 5, category: "food" },
  { id: "hydration_hub", name: "Hydration Hub", mappedZone: "main_concourse", baseWaitTime: 2, category: "beverage" },
  { id: "pizza_planet", name: "Pizza Planet", mappedZone: "sec_105", baseWaitTime: 6, category: "food" },
  { id: "north_wing_restrooms", name: "North Wing Restrooms", mappedZone: "north_gate", baseWaitTime: 1, category: "restroom" },
  { id: "south_wing_restrooms", name: "South Wing Restrooms", mappedZone: "south_gate", baseWaitTime: 1, category: "restroom" },
  { id: "snack_shack", name: "Snack Shack", mappedZone: "main_concourse", baseWaitTime: 4, category: "food" },
];
