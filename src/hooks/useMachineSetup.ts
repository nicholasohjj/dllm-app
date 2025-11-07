import { Machine } from "@/types/machine.types";

const generateMachines = (): Machine[] => {
  // Generate washers
  const washers = Array.from({ length: 8 }, (_, i) => {
    const washerNumber = 8 - i;
    const machineID = `RVREB-W${washerNumber}`; // Full washer ID
    const shortName = `W${washerNumber}`; // Short washer name
    const status: Machine["status"] = "disabled"; // Set all washers to disabled

    return {
      machineID: machineID,
      shortName: shortName,
      type: "washer" as const,
      status,
      timeRemaining: 0, // Set timeRemaining to 0 for disabled machines
      position: { x: 20, y: 20 + i * 15 }, // Adjust spacing for 8 washers
    };
  });

  // Generate dryers
  const dryers = Array.from({ length: 6 }, (_, i) => {
    const dryerNumber = i + 1; // Dryer number starts from 1 and increments
    const machineID = `RVREB-D${dryerNumber}`; // Full dryer ID
    const shortName = `D${dryerNumber}`; // Short dryer name
    const status: Machine["status"] = "disabled"; // Set all dryers to disabled

    return {
      machineID: machineID,
      shortName: shortName,
      type: "dryer" as const,
      status,
      timeRemaining: 0, // Set timeRemaining to 0 for disabled machines
      position: { x: 80, y: 20 + i * 20 }, // Increment y position for each dryer
    };
  });

  return [...washers, ...dryers]; // Return combined array of machines
};

export function useMachineSetup() {
  return generateMachines();
}

