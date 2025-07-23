import { Module, DraggableItem, DropZone } from '../types/game';

export const gameData = {
  modules: [
    {
      id: 1,
      title: "Personal Hygiene",
      description: "Learn about proper hygiene practices in manufacturing",
      isLocked: false,
      progress: 0,
      levels: [
        { id: "module1_level1", title: "Fix the Violation", description: "Identify hygiene violations", scenario: "A worker enters the production area without proper hand washing", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module1_level2", title: "SOP Rewrite", description: "Correct the standard operating procedure", scenario: "Review and fix the hand washing SOP", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 2,
      title: "Equipment Cleaning",
      description: "Master equipment sanitization procedures",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module2_level1", title: "Cleaning Protocol", description: "Learn proper cleaning sequences", scenario: "Equipment was not properly sanitized before use", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module2_level2", title: "Validation Check", description: "Verify cleaning effectiveness", scenario: "Validate the cleaning process", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 3,
      title: "Documentation",
      description: "Understand proper record keeping",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module3_level1", title: "Record Review", description: "Check documentation accuracy", scenario: "Batch records are incomplete", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module3_level2", title: "Deviation Handling", description: "Process documentation deviations", scenario: "Handle a documentation deviation", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 4,
      title: "Cross Contamination",
      description: "Prevent contamination between products",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module4_level1", title: "Area Segregation", description: "Maintain proper separation", scenario: "Different products processed in same area", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module4_level2", title: "Changeover Procedure", description: "Execute proper changeovers", scenario: "Perform line changeover", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 5,
      title: "Quality Control",
      description: "Implement quality control measures",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module5_level1", title: "Sampling Procedure", description: "Collect representative samples", scenario: "Improper sampling technique used", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module5_level2", title: "Test Method Validation", description: "Validate analytical methods", scenario: "Method validation requirements", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 6,
      title: "Environmental Controls",
      description: "Maintain proper environmental conditions",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module6_level1", title: "Temperature Control", description: "Monitor temperature conditions", scenario: "Temperature exceeded acceptable range", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module6_level2", title: "Humidity Management", description: "Control humidity levels", scenario: "Humidity control system failure", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 7,
      title: "Material Handling",
      description: "Proper handling of raw materials",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module7_level1", title: "Storage Conditions", description: "Maintain proper storage", scenario: "Materials stored in wrong conditions", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module7_level2", title: "First In First Out", description: "Implement FIFO system", scenario: "Expired materials used in production", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 8,
      title: "Training & Competency",
      description: "Ensure personnel competency",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module8_level1", title: "Training Records", description: "Maintain training documentation", scenario: "Untrained operator found working", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module8_level2", title: "Competency Assessment", description: "Evaluate personnel skills", scenario: "Assess operator competency", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 9,
      title: "Batch Records",
      description: "Complete accurate batch documentation",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module9_level1", title: "Record Completion", description: "Complete all required fields", scenario: "Batch record missing signatures", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module9_level2", title: "Data Integrity", description: "Ensure data accuracy", scenario: "Data integrity issue found", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 10,
      title: "Calibration",
      description: "Maintain equipment calibration",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module10_level1", title: "Calibration Schedule", description: "Follow calibration procedures", scenario: "Equipment past calibration date", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module10_level2", title: "Out of Spec Handling", description: "Handle calibration failures", scenario: "Equipment failed calibration", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 11,
      title: "Change Control",
      description: "Manage manufacturing changes",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module11_level1", title: "Change Documentation", description: "Document all changes", scenario: "Undocumented process change made", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module11_level2", title: "Impact Assessment", description: "Assess change impacts", scenario: "Change impact not evaluated", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
    {
      id: 12,
      title: "Complaints & Recalls",
      description: "Handle customer complaints and recalls",
      isLocked: true,
      progress: 0,
      levels: [
        { id: "module12_level1", title: "Complaint Investigation", description: "Investigate customer complaints", scenario: "Customer complaint received", isCompleted: false, score: 0, maxScore: 100 },
        { id: "module12_level2", title: "Recall Procedure", description: "Execute product recall", scenario: "Product recall initiated", isCompleted: false, score: 0, maxScore: 100 },
      ]
    },
  ] as Module[],
  
  levels: {
    "module1_level1": {
      items: [
        { id: "item1", text: "Worker didn't wash hands", category: "violation" as const, isCorrect: true },
        { id: "item2", text: "No hair net worn", category: "violation" as const, isCorrect: false },
        { id: "item3", text: "Jewelry worn in production", category: "violation" as const, isCorrect: false },
        { id: "item4", text: "Mandate 20-second hand washing", category: "correction" as const, isCorrect: true },
        { id: "item5", text: "Install additional sinks", category: "correction" as const, isCorrect: false },
        { id: "item6", text: "Provide sanitizer dispensers", category: "correction" as const, isCorrect: false },
        { id: "item7", text: "Retrain on hygiene SOP", category: "correction" as const, isCorrect: true },
        { id: "item8", text: "Post hygiene reminders", category: "correction" as const, isCorrect: false },
      ] as DraggableItem[],
      dropZones: [
        { id: "zone1", title: "Violated GMP Principle", category: "violation" as const, acceptedItems: ["item1"] },
        { id: "zone2", title: "Corrective Action", category: "correction" as const, acceptedItems: ["item4", "item7"] },
      ] as DropZone[],
    },
  },
};