
// src/data/level3Scenarios.ts

export interface PuzzlePiece {
  id: string;
  text: string;
  category: "violation" | "action";
  isCorrect: boolean;
}

export interface Scenario {
  title: string;
  description: string;
  pieces: PuzzlePiece[];
}

// Module 1 - Level 3 Scenarios
export const level3ScenariosModule1: Scenario[] = [
  {
    title: "Cleanroom Entry Violation",
    description:
      "A production worker enters the cleanroom without gloves and skips the entry logbook.",
    pieces: [
      {
        id: "v1",
        text: "Personnel Hygiene",
        category: "violation",
        isCorrect: true,
      },
      {
        id: "v2",
        text: "Documentation",
        category: "violation",
        isCorrect: true,
      },
      {
        id: "v3",
        text: "Quality Control",
        category: "violation",
        isCorrect: false,
      },
      {
        id: "v4",
        text: "Equipment Qualification",
        category: "violation",
        isCorrect: false,
      },
      {
        id: "a1",
        text: "Follow gowning SOP",
        category: "action",
        isCorrect: true,
      },
      {
        id: "a2",
        text: "Sign and verify entry in log",
        category: "action",
        isCorrect: true,
      },
      {
        id: "a3",
        text: "Use cleanroom air filters",
        category: "action",
        isCorrect: false,
      },
      {
        id: "a4",
        text: "Initiate audit trail",
        category: "action",
        isCorrect: false,
      },
    ],
  },
  {
    title: "Expired Balance Used",
    description:
      "An expired balance is used to weigh materials for a production batch.",
    pieces: [
      {
        id: "s2v1",
        text: "Equipment Calibration",
        category: "violation",
        isCorrect: true,
      },
      { id: "s2v2", text: "Training", category: "violation", isCorrect: false },
      {
        id: "s2v3",
        text: "Cleaning Validation",
        category: "violation",
        isCorrect: false,
      },
      {
        id: "s2v4",
        text: "Material Storage",
        category: "violation",
        isCorrect: false,
      },
      {
        id: "s2a1",
        text: "Stop use, recalibrate",
        category: "action",
        isCorrect: true,
      },
      {
        id: "s2a2",
        text: "Repeat training",
        category: "action",
        isCorrect: false,
      },
      { id: "s2a3", text: "Update MSDS", category: "action", isCorrect: false },
      {
        id: "s2a4",
        text: "Document deviation & assess risk",
        category: "action",
        isCorrect: true,
      },
    ],
  },
  {
    title: "Batch Record Not Reviewed by QA",
    description:
      "A batch record is signed only by Production Head. QA has not reviewed or signed.",
    pieces: [
      {
        id: "s3v1",
        text: "Documentation",
        category: "violation",
        isCorrect: true,
      },
      {
        id: "s3v2",
        text: "Root Cause Analysis",
        category: "violation",
        isCorrect: false,
      },
      {
        id: "s3v3",
        text: "Market Complaint Handling",
        category: "violation",
        isCorrect: false,
      },
      {
        id: "s3a1",
        text: "QA counter-sign required",
        category: "action",
        isCorrect: true,
      },
      {
        id: "s3a2",
        text: "Recall product",
        category: "action",
        isCorrect: false,
      },
      {
        id: "s3a3",
        text: "Skip QA review",
        category: "action",
        isCorrect: false,
      },
    ],
  },
];

// Module 2 - Level 3 Scenarios
export const level3ScenariosModule2: Scenario[] = [
  {
    title: "Backdated Entry by Technician",
    description: "A technician backdates an entry to make it look like it was recorded earlier.",
    pieces: [
      { id: "m2s1v1", text: "Contemporaneous", category: "violation", isCorrect: true },
      { id: "m2s1v2", text: "Accurate", category: "violation", isCorrect: false },
      { id: "m2s1v3", text: "Original", category: "violation", isCorrect: false },
      { id: "m2s1a1", text: "Record data at the time of activity", category: "action", isCorrect: true },
      { id: "m2s1a2", text: "Add duplicate entry", category: "action", isCorrect: false },
      { id: "m2s1a3", text: "Remove old record", category: "action", isCorrect: false },
    ],
  },
  {
    title: "Logbook Entry Scratched Out",
    description: "A logbook has two entries, one of which is completely scratched out with no initials.",
    pieces: [
      { id: "m2s2v1", text: "Improper Error Correction", category: "violation", isCorrect: true },
      { id: "m2s2v2", text: "Missing Signature", category: "violation", isCorrect: false },
      { id: "m2s2v3", text: "Data Retention Violation", category: "violation", isCorrect: false },
      { id: "m2s2a1", text: "Use single-line strike-through with initials & date", category: "action", isCorrect: true },
      { id: "m2s2a2", text: "Use white ink", category: "action", isCorrect: false },
      { id: "m2s2a3", text: "Delete the entry", category: "action", isCorrect: false },
    ],
  },
  {
    title: "Colleague's Password Used for Login",
    description: "A user logs into the software using their colleague's password to enter values.",
    pieces: [
      { id: "m2s3v1", text: "Attributable", category: "violation", isCorrect: true },
      { id: "m2s3v2", text: "Legible", category: "violation", isCorrect: false },
      { id: "m2s3v3", text: "Timely", category: "violation", isCorrect: false },
      { id: "m2s3a1", text: "Ensure unique login for each user", category: "action", isCorrect: true },
      { id: "m2s3a2", text: "Disable password requirements", category: "action", isCorrect: false },
      { id: "m2s3a3", text: "Re-enter data manually", category: "action", isCorrect: false },
    ],
  },
  {
    title: "Batch Number Missing in Cleaning Records",
    description: "Cleaning records are signed, but the batch number of the cleaning agent is missing.",
    pieces: [
      { id: "m2s4v1", text: "Incomplete Record", category: "violation", isCorrect: true },
      { id: "m2s4v2", text: "Unauthorized Access", category: "violation", isCorrect: false },
      { id: "m2s4v3", text: "Deviation Not Filed", category: "violation", isCorrect: false },
      { id: "m2s4a1", text: "Add note referencing batch number, assess if re-cleaning needed", category: "action", isCorrect: true },
      { id: "m2s4a2", text: "Ignore missing info", category: "action", isCorrect: false },
      { id: "m2s4a3", text: "Shred the form", category: "action", isCorrect: false },
    ],
  },
  {
    title: "System Audit Trail for pH Data",
    description: "A system automatically logs pH data changes with user and timestamp.",
    pieces: [
      { id: "m2s5v1", text: "Audit Trail", category: "violation", isCorrect: true },
      { id: "m2s5v2", text: "Manual Log", category: "violation", isCorrect: false },
      { id: "m2s5v3", text: "Real-time Editing", category: "violation", isCorrect: false },
      { id: "m2s5a1", text: "Data Integrity", category: "action", isCorrect: true },
      { id: "m2s5a2", text: "Training SOP", category: "action", isCorrect: false },
      { id: "m2s5a3", text: "Equipment Qualification", category: "action", isCorrect: false },
    ],
  },
];



// Module 3 - Level 3 Scenarios
export const level3ScenariosModule3: Scenario[] = [
  {
    title: "Backdated Entry by Technician",
    description: "A technician backdates an entry to make it look like it was recorded earlier.",
    pieces: [
      { id: "m3s1v1", text: "Contemporaneous", category: "violation", isCorrect: true },
      { id: "m3s1v2", text: "Accurate", category: "violation", isCorrect: false },
      { id: "m3s1v3", text: "Original", category: "violation", isCorrect: false },
      { id: "m3s1a1", text: "Record data at the time of activity", category: "action", isCorrect: true },
      { id: "m3s1a2", text: "Add duplicate entry", category: "action", isCorrect: false },
      { id: "m3s1a3", text: "Remove old record", category: "action", isCorrect: false },
    ],
  },
  {
    title: "Logbook Entry Scratched Out",
    description: "A logbook has two entries, one of which is completely scratched out with no initials.",
    pieces: [
      { id: "m3s2v1", text: "Improper Error Correction", category: "violation", isCorrect: true },
      { id: "m3s2v2", text: "Missing Signature", category: "violation", isCorrect: false },
      { id: "m3s2v3", text: "Data Retention Violation", category: "violation", isCorrect: false },
      { id: "m3s2a1", text: "Use single-line strike-through with initials & date", category: "action", isCorrect: true },
      { id: "m3s2a2", text: "Use white ink", category: "action", isCorrect: false },
      { id: "m3s2a3", text: "Delete the entry", category: "action", isCorrect: false },
    ],
  },
  {
    title: "Colleague's Password Used for Login",
    description: "A user logs into the software using their colleague's password to enter values.",
    pieces: [
      { id: "m3s3v1", text: "Attributable", category: "violation", isCorrect: true },
      { id: "m3s3v2", text: "Legible", category: "violation", isCorrect: false },
      { id: "m3s3v3", text: "Timely", category: "violation", isCorrect: false },
      { id: "m3s3a1", text: "Ensure unique login for each user", category: "action", isCorrect: true },
      { id: "m3s3a2", text: "Disable password requirements", category: "action", isCorrect: false },
      { id: "m3s3a3", text: "Re-enter data manually", category: "action", isCorrect: false },
    ],
  },
  {
    title: "Batch Number Missing in Cleaning Records",
    description: "Cleaning records are signed, but the batch number of the cleaning agent is missing.",
    pieces: [
      { id: "m3s4v1", text: "Incomplete Record", category: "violation", isCorrect: true },
      { id: "m3s4v2", text: "Unauthorized Access", category: "violation", isCorrect: false },
      { id: "m3s4v3", text: "Deviation Not Filed", category: "violation", isCorrect: false },
      { id: "m3s4a1", text: "Add note referencing batch number, assess if re-cleaning needed", category: "action", isCorrect: true },
      { id: "m3s4a2", text: "Ignore missing info", category: "action", isCorrect: false },
      { id: "m3s4a3", text: "Shred the form", category: "action", isCorrect: false },
    ],
  },
  {
    title: "System Audit Trail for pH Data",
    description: "A system automatically logs pH data changes with user and timestamp.",
    pieces: [
      { id: "m3s5v1", text: "Audit Trail", category: "violation", isCorrect: true },
      { id: "m3s5v2", text: "Manual Log", category: "violation", isCorrect: false },
      { id: "m3s5v3", text: "Real-time Editing", category: "violation", isCorrect: false },
      { id: "m3s5a1", text: "Data Integrity", category: "action", isCorrect: true },
      { id: "m3s5a2", text: "Training SOP", category: "action", isCorrect: false },
      { id: "m3s5a3", text: "Equipment Qualification", category: "action", isCorrect: false },
    ],
  },
];

// Default export for backward compatibility (Module 1 scenarios)
export const level3Scenarios = level3ScenariosModule1;
export default level3Scenarios;

/**
 * Utility to get Level 3 scenarios by module number.
 * @param moduleNumber 1 or 2
 */
export function getLevel3ScenariosByModule(moduleNumber: number): Scenario[] {
  if (moduleNumber === 3) return level3ScenariosModule3;
  if (moduleNumber === 2) return level3ScenariosModule2;
  return level3ScenariosModule1;
}

// Usage example for Module 2 - Level 3 Scenarios:
// import { getLevel3ScenariosByModule } from 'src/data/level3Scenarios';
// const scenarios = getLevel3ScenariosByModule(2);
