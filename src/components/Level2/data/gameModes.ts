import { GameMode } from '../../../types/Level2/types';

export const gameModes: GameMode[] = [
  {
    id: 'gmp-vs-non-gmp',
    title: '📂 GMP vs Non-GMP Sort',
    description: 'Sort items into GMP Requirements vs Non-GMP Related',
    moduleId: 1,
    type: 1,
    categories: [
      {
        id: 'gmp-requirement',
        name: 'GMP Requirement',
        description: 'Essential for Good Manufacturing Practice',
        color: 'bg-green-100 border-green-300'
      },
      {
        id: 'not-gmp-related',
        name: 'Not GMP Related',
        description: 'Not directly related to manufacturing quality',
        color: 'bg-gray-100 border-gray-300'
      }
    ],
    terms: [
      { id: 'sanitation-log', text: 'Sanitation Log', correctCategory: 'gmp-requirement' },
      { id: 'marketing-brochure', text: 'Product Marketing Brochure', correctCategory: 'not-gmp-related' },
      { id: 'equipment-maintenance', text: 'Equipment Maintenance Checklist', correctCategory: 'gmp-requirement' },
      { id: 'social-media', text: 'Social Media Post', correctCategory: 'not-gmp-related' },
      { id: 'batch-processing', text: 'Batch Processing Record', correctCategory: 'gmp-requirement' },
      { id: 'training-attendance', text: 'Training Attendance Sheet', correctCategory: 'gmp-requirement' },
      { id: 'sales-pitch', text: 'Sales Pitch Document', correctCategory: 'not-gmp-related' },
      { id: 'deviation-report', text: 'Deviation Report Form', correctCategory: 'gmp-requirement' }
    ]
  },
  {
    id: 'documentation-vs-production',
    title: '📋 Documentation vs Production Sort',
    description: 'Sort items into Documentation vs Production categories',
    moduleId: 2,
    type: 1,
    categories: [
      {
        id: 'documentation',
        name: 'Documentation',
        description: 'Records, logs, and documentation materials',
        color: 'bg-green-100 border-green-300'
      },
      {
        id: 'production',
        name: 'Production',
        description: 'Manufacturing processes and activities',
        color: 'bg-gray-100 border-gray-300'
      }
    ],
    terms: [
      { id: 'batch-manufacturing-record', text: 'Batch Manufacturing Record', correctCategory: 'documentation' },
      { id: 'cleaning-sanitation', text: 'Cleaning and Sanitation', correctCategory: 'production' },
      { id: 'equipment-usage-log', text: 'Equipment Usage Log', correctCategory: 'documentation' },
      { id: 'granulation-process', text: 'Granulation Process', correctCategory: 'production' }
    ]
  },
  {
    id: 'qa-vs-qc',
    title: '🔍 QA vs QC Sort',
    description: 'Sort items into Quality Assurance vs Quality Control categories',
    moduleId: 2,
    type: 2,
    categories: [
      {
        id: 'qa',
        name: 'QA (Quality Assurance)',
        description: 'Prevention-focused activities and systems',
        color: 'bg-blue-100 border-blue-300'
      },
      {
        id: 'qc',
        name: 'QC (Quality Control)',
        description: 'Detection-focused testing and inspection',
        color: 'bg-purple-100 border-purple-300'
      }
    ],
    terms: [
      { id: 'final-product-review', text: 'Final product review', correctCategory: 'qa' },
      { id: 'microbial-testing', text: 'Microbial testing', correctCategory: 'qc' },
      { id: 'deviation-approval', text: 'Deviation approval', correctCategory: 'qa' },
      { id: 'assay-test', text: 'Assay test', correctCategory: 'qc' }
    ]
  },
  {
    id: 'hygiene-vs-record-keeping',
    title: '🧼 Hygiene Practice vs Record Keeping Sort',
    description: 'Sort items into Hygiene Practice vs Record Keeping categories',
    moduleId: 2,
    type: 3,
    categories: [
      {
        id: 'hygiene-practice',
        name: 'Hygiene Practice',
        description: 'Physical cleanliness and safety procedures',
        color: 'bg-teal-100 border-teal-300'
      },
      {
        id: 'record-keeping',
        name: 'Record Keeping',
        description: 'Documentation and logging activities',
        color: 'bg-orange-100 border-orange-300'
      }
    ],
    terms: [
      { id: 'gowning-procedure', text: 'Gowning Procedure', correctCategory: 'hygiene-practice' },
      { id: 'entry-logbook', text: 'Entry Logbook', correctCategory: 'record-keeping' },
      { id: 'glove-disposal-sop', text: 'Glove Disposal SOP', correctCategory: 'hygiene-practice' },
      { id: 'equipment-usage-sheet', text: 'Equipment Usage Sheet', correctCategory: 'record-keeping' }
    ]
  },
  {
    id: 'gdocp-vs-data-integrity',
    title: '📋 GDocP Principles vs Data Integrity Controls',
    description: 'Sort items into GDocP Principles vs Data Integrity Controls',
    moduleId: 3,
    type: 1,
    categories: [
      {
        id: 'gdocp-principle',
        name: 'GDocP Principle',
        description: 'Good Documentation Practice principles',
        color: 'bg-green-100 border-green-300'
      },
      {
        id: 'data-integrity-control',
        name: 'Data Integrity Control',
        description: 'Controls for maintaining data integrity',
        color: 'bg-blue-100 border-blue-300'
      }
    ],
    terms: [
      { id: 'legible-entries', text: 'Legible Entries', correctCategory: 'gdocp-principle' },
      { id: 'audit-trail', text: 'Audit Trail', correctCategory: 'data-integrity-control' },
      { id: 'timely-documentation', text: 'Timely Documentation', correctCategory: 'gdocp-principle' },
      { id: 'user-role-access', text: 'User Role Access', correctCategory: 'data-integrity-control' }
    ]
  },
  {
    id: 'correct-vs-incorrect-practice',
    title: '✅ Correct Practice vs Incorrect Practice',
    description: 'Sort items into Correct Practice vs Incorrect Practice',
    moduleId: 3,
    type: 2,
    categories: [
      {
        id: 'correct-practice',
        name: 'Correct Practice',
        description: 'Proper documentation practices',
        color: 'bg-green-100 border-green-300'
      },
      {
        id: 'incorrect-practice',
        name: 'Incorrect Practice',
        description: 'Improper documentation practices',
        color: 'bg-red-100 border-red-300'
      }
    ],
    terms: [
      { id: 'backdating-records', text: 'Backdating records', correctCategory: 'incorrect-practice' },
      { id: 'recording-realtime-data', text: 'Recording real-time data', correctCategory: 'correct-practice' },
      { id: 'deleting-original-entry', text: 'Deleting original entry', correctCategory: 'incorrect-practice' },
      { id: 'using-permanent-ink', text: 'Using permanent ink', correctCategory: 'correct-practice' }
    ]
  },
  {
    id: 'electronic-vs-paper-record-control',
    title: '💻 Electronic Record Control vs Paper-Based Record Control',
    description: 'Sort items into Electronic Record Control vs Paper-Based Record Control',
    moduleId: 3,
    type: 3,
    categories: [
      {
        id: 'electronic-record-control',
        name: 'Electronic Record Control',
        description: 'Controls specific to electronic records',
        color: 'bg-purple-100 border-purple-300'
      },
      {
        id: 'paper-based-record-control',
        name: 'Paper-Based Record Control',
        description: 'Controls specific to paper-based records',
        color: 'bg-orange-100 border-orange-300'
      }
    ],
    terms: [
      { id: 'audit-trail-electronic', text: 'Audit Trail', correctCategory: 'electronic-record-control' },
      { id: 'initial-date-on-change', text: 'Initial & Date on Change', correctCategory: 'paper-based-record-control' },
      { id: 'password-protection', text: 'Password Protection', correctCategory: 'electronic-record-control' },
      { id: 'crossed-out-error-comment', text: 'Crossed-out error with comment', correctCategory: 'paper-based-record-control' }
    ]
  },
  {
    id: 'alcoa-vs-documentation-errors',
    title: '📊 ALCOA+ Principles vs Documentation Errors',
    description: 'Sort items into ALCOA+ Principles vs Documentation Errors',
    moduleId: 3,
    type: 4,
    categories: [
      {
        id: 'alcoa-principle',
        name: 'ALCOA+ Principle',
        description: 'ALCOA+ data integrity principles',
        color: 'bg-teal-100 border-teal-300'
      },
      {
        id: 'documentation-error',
        name: 'Documentation Error',
        description: 'Common documentation mistakes',
        color: 'bg-red-100 border-red-300'
      }
    ],
    terms: [
      { id: 'complete', text: 'Complete', correctCategory: 'alcoa-principle' },
      { id: 'omitted-entry', text: 'Omitted entry', correctCategory: 'documentation-error' },
      { id: 'consistent', text: 'Consistent', correctCategory: 'alcoa-principle' },
      { id: 'backdated-entry', text: 'Backdated entry', correctCategory: 'documentation-error' }
    ]
  },
  {
    id: 'internal-vs-external-audit',
    title: '🔍 Internal Audit vs External Audit Sort',
    description: 'Sort items into Internal Audit vs External Audit categories',
    moduleId: 4,
    type: 1,
    categories: [
      {
        id: 'internal-audit',
        name: 'Internal Audit',
        description: 'Self-conducted audits and inspections',
        color: 'bg-blue-100 border-blue-300'
      },
      {
        id: 'external-audit',
        name: 'External Audit',
        description: 'Third-party or regulatory audits',
        color: 'bg-purple-100 border-purple-300'
      }
    ],
    terms: [
      { id: 'self-inspection', text: 'Self-Inspection', correctCategory: 'internal-audit' },
      { id: 'regulatory-inspection', text: 'Regulatory Inspection', correctCategory: 'external-audit' },
      { id: 'mock-audit', text: 'Mock Audit', correctCategory: 'internal-audit' },
      { id: 'fda-audit', text: 'FDA Audit', correctCategory: 'external-audit' }
    ]
  },
  {
    id: 'audit-preparation-vs-followup',
    title: '📋 Audit Preparation vs Audit Follow-up Sort',
    description: 'Sort items into Audit Preparation vs Audit Follow-up categories',
    moduleId: 4,
    type: 2,
    categories: [
      {
        id: 'audit-preparation',
        name: 'Audit Preparation',
        description: 'Activities done before an audit',
        color: 'bg-green-100 border-green-300'
      },
      {
        id: 'audit-followup',
        name: 'Audit Follow-up',
        description: 'Activities done after an audit',
        color: 'bg-orange-100 border-orange-300'
      }
    ],
    terms: [
      { id: 'sop-review', text: 'SOP Review', correctCategory: 'audit-preparation' },
      { id: 'capa-implementation', text: 'CAPA Implementation', correctCategory: 'audit-followup' },
      { id: 'document-compilation', text: 'Document Compilation', correctCategory: 'audit-preparation' },
      { id: 'root-cause-analysis', text: 'Root Cause Analysis', correctCategory: 'audit-followup' }
    ]
  },
  {
    id: 'documentation-vs-observation',
    title: '📄 Documentation vs Observation Sort',
    description: 'Sort items into Documentation vs Observation categories',
    moduleId: 4,
    type: 3,
    categories: [
      {
        id: 'documentation',
        name: 'Documentation',
        description: 'Written records and reports',
        color: 'bg-teal-100 border-teal-300'
      },
      {
        id: 'observation',
        name: 'Observation',
        description: 'Findings and deviations noted during audit',
        color: 'bg-red-100 border-red-300'
      }
    ],
    terms: [
      { id: 'audit-report', text: 'Audit Report', correctCategory: 'documentation' },
      { id: 'major-deviation', text: 'Major Deviation', correctCategory: 'observation' },
      { id: 'audit-observation-form', text: 'Audit Observation Form', correctCategory: 'documentation' },
      { id: 'cleaning-log-not-updated', text: 'Cleaning log not updated', correctCategory: 'observation' }
    ]
  }
];


export const getGameModesByModule = (moduleId: number): GameMode[] => {
  return gameModes.filter(mode => mode.moduleId === moduleId);
};

// Get game modes by module and type
export const getGameModesByModuleAndType = (moduleId: number, type: number): GameMode[] => {
  return gameModes.filter(mode => mode.moduleId === moduleId && mode.type === type);
};

// Get all types available for a specific module
export const getTypesForModule = (moduleId: number): number[] => {
  const modes = getGameModesByModule(moduleId);
  return [...new Set(modes.map(mode => mode.type))].sort();
};

// Get game modes organized by type for a module
export const getGameModesGroupedByType = (moduleId: number) => {
  const modes = getGameModesByModule(moduleId);
  return modes.reduce((acc, mode) => {
    if (!acc[mode.type]) {
      acc[mode.type] = [];
    }
    acc[mode.type].push(mode);
    return acc;
  }, {} as Record<number, GameMode[]>);
};

// Flow configuration for different modules
export interface ModuleFlowConfig {
  moduleId: number;
  typeSequence: number[];
  requiresContinueButton: boolean;
  showResultsAfterEachType: boolean;
  description: string;
}

export const moduleFlowConfigs: ModuleFlowConfig[] = [
  {
    moduleId: 1,
    typeSequence: [1],
    requiresContinueButton: false,
    showResultsAfterEachType: false,
    description: 'Module 1: Only type 1 activities, direct to ResultsModal after completion'
  },
  {
    moduleId: 2,
    typeSequence: [1, 2, 3],
    requiresContinueButton: true,
    showResultsAfterEachType: false,
    description: 'Module 2: Sequential types 1→2→3 with Continue buttons between each'
  },
  {
    moduleId: 3,
    typeSequence: [1, 2, 3, 4],
    requiresContinueButton: true,
    showResultsAfterEachType: false,
    description: 'Module 3: Sequential types 1→2→3→4 with Continue buttons between each'
  },
  {
    moduleId: 4,
    typeSequence: [1, 2, 3],
    requiresContinueButton: true,
    showResultsAfterEachType: false,
    description: 'Module 4: Sequential types 1→2→3 with Continue buttons between each'
  }
];

// Get flow configuration for a specific module
export const getModuleFlowConfig = (moduleId: number): ModuleFlowConfig | undefined => {
  return moduleFlowConfigs.find(config => config.moduleId === moduleId);
};

// Check if a module requires continue buttons between types
export const moduleRequiresContinueButton = (moduleId: number): boolean => {
  const config = getModuleFlowConfig(moduleId);
  return config?.requiresContinueButton ?? false;
};

// Get the next type in the sequence for a module
export const getNextTypeInSequence = (moduleId: number, currentType: number): number | null => {
  const config = getModuleFlowConfig(moduleId);
  if (!config) return null;

  const currentIndex = config.typeSequence.indexOf(currentType);
  if (currentIndex === -1 || currentIndex === config.typeSequence.length - 1) {
    return null; // No next type
  }

  return config.typeSequence[currentIndex + 1];
};

// Check if a type is the last in the sequence for a module
export const isLastTypeInSequence = (moduleId: number, currentType: number): boolean => {
  const config = getModuleFlowConfig(moduleId);
  if (!config) return true;

  const lastType = config.typeSequence[config.typeSequence.length - 1];
  return currentType === lastType;
};

// Get the first type in the sequence for a module
export const getFirstTypeInSequence = (moduleId: number): number | null => {
  const config = getModuleFlowConfig(moduleId);
  return config?.typeSequence[0] ?? null;
};