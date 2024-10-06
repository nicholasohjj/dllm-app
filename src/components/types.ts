// types.ts

export type Machine = {
    id: string; // Full ID (e.g., RVREB-W1)
    shortName: string; // Short name (e.g., W1)
    type: "washer" | "dryer";
    status: "available" | "in-use" | "finishing-soon" | "complete" | "disabled";
    timeRemaining: number;
    position: { x: number; y: number };
  };
  