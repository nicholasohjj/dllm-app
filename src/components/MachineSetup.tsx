import { Machine } from "./types";

const generateMachines = (): Machine[] => {
  const washers = Array.from({ length: 8 }, (_, i) => {
    const washerNumber = 8 - i;
    const machineId = `RVREB-W${washerNumber}`; // Full washer ID
    const shortName = `W${washerNumber}`; // Short washer name
    const isFunctional = washerNumber <= 2; // Only washer 1 and 2 are functional
    const status: Machine["status"] = isFunctional
      ? i % 2 === 0
        ? "available"
        : "in-use"
      : "complete"; // Explicitly typed status
    return {
      id: machineId,
      shortName: shortName,
      type: "washer" as const,
      status,
      timeRemaining: isFunctional
        ? i % 2 === 0
          ? 0
          : Math.floor(Math.random() * 60)
        : 0,
      position: { x: 20, y: 20 + i * 15 }, // Adjust spacing for 8 washers
    };
  });

  const dryers = Array.from({ length: 6 }, (_, i) => {
    const dryerNumber = 6 - i;
    const machineId = `RVREB-D${dryerNumber}`; // Full dryer ID
    const shortName = `D${dryerNumber}`; // Short dryer name
    const isFunctional = dryerNumber <= 2; // Only dryer 1 and 2 are functional
    const status: Machine["status"] = isFunctional
      ? i % 2 === 0
        ? "available"
        : "in-use"
      : "disabled"; // Explicitly typed status
    return {
      id: machineId,
      shortName: shortName,
      type: "dryer" as const,
      status,
      timeRemaining: isFunctional
        ? i % 2 === 0
          ? 0
          : Math.floor(Math.random() * 60)
        : 0,
      position: { x: 80, y: 20 + i * 20 }, // Adjust spacing for 6 dryers
    };
  });

  return [...washers, ...dryers];
};

export function useMachineSetup() {
  return generateMachines();
}
