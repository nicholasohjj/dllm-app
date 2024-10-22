import { Machine } from './types';

const generateMachines = (): Machine[] => {
  const washers = Array.from({ length: 8 }, (_, i) => {
    const washerNumber = 8 - i;
    const machineID = `RVREB-W${washerNumber}`; // Full washer ID
    const shortName = `W${washerNumber}`; // Short washer name
    const isFunctional = washerNumber <= 2; // Only washer 1 and 2 are functional
    const status: Machine['status'] = isFunctional ? (i % 2 === 0 ? "available" : "in-use") : "disabled"; // Only functional washers have available/in-use status
    return {
      machineID: machineID,
      shortName: shortName,
      type: "washer" as const,
      status,
      timeRemaining: isFunctional ? (i % 2 === 0 ? 0 : Math.floor(Math.random() * 60)) : 0,
      position: { x: 20, y: 20 + i * 15 }, // Adjust spacing for 8 washers
    };
  });

  const dryers = Array.from({ length: 6 }, (_, i) => {
    const dryerNumber = i + 1; // Dryer number starts from 1 and increments
    const machineID = `RVREB-D${dryerNumber}`; // Full dryer ID
    const shortName = `D${dryerNumber}`; // Short dryer name
    const isFunctional = dryerNumber >= 5; // Only dryer 5 and 6 are functional
    const status: Machine['status'] = isFunctional ? (i % 2 === 0 ? "available" : "in-use") : "disabled"; // Only functional dryers have available/in-use status
    return {
      machineID: machineID,
      shortName: shortName,
      type: "dryer" as const,
      status,
      timeRemaining: isFunctional ? (i % 2 === 0 ? 0 : Math.floor(Math.random() * 60)) : 0,
      position: { x: 80, y: 20 + i * 20 }, // Increment y position for each dryer
    };
  });

  return [...washers, ...dryers];
};

export function useMachineSetup() {
  return generateMachines();
}
