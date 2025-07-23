import { Case } from '../types';

export const casesByModule: Record<number, Case[]> = {
  1: [
    {
      id: 1,
      title: "Cleaning Record Missing",
      scenario: "QA discovers that cleaning records for a mixer used in 3 batches were not filled. All batches passed QC visually.",
      productName: "Paracetamol Syrup",
      batchNumber: "BATCH-001",
      imageSrc: "/Level4/product1.webp",
      deviationType: "Documentation",
      questions: {
        violation: {
          question: "What GMP principle is violated?",
          options: [
            "Calibration",
            "Documentation",
            "Quality Control",
            "Personnel Hygiene"
          ],
          correct: 1
        },
        rootCause: {
          question: "What is the most likely root cause?",
          options: [
            "Inadequate training",
            "Negligence in recording",
            "Faulty equipment",
            "Lack of SOP"
          ],
          correct: 1
        },
        impact: {
          question: "What is the potential risk?",
          options: [
            "Product contamination due to unverified cleaning",
            "Delay in supply chain",
            "Labeling error",
            "Regulatory marketing delay"
          ],
          correct: 0
        }
      }
    },
    {
      id: 2,
      title: "Uncalibrated Equipment Used",
      scenario: "A batch was processed using a balance that had expired calibration. QA caught the error post-batch completion.",
      productName: "Cough Syrup",
      batchNumber: "BATCH-002",
      imageSrc: "/Level4/product2.webp",
      deviationType: "Equipment Calibration",
      questions: {
        violation: {
          question: "What GMP aspect failed?",
          options: [
            "Equipment Calibration",
            "Vendor Qualification",
            "Training",
            "Documentation"
          ],
          correct: 0
        },
        rootCause: {
          question: "Likely root cause?",
          options: [
            "Missed verification of calibration schedule",
            "Operator fatigue",
            "Machine error",
            "Delayed batch release"
          ],
          correct: 0
        },
        impact: {
          question: "Immediate impact?",
          options: [
            "Potential inaccurate batch weight → risk of under/over potency",
            "Cold chain failure",
            "Wrong primary packaging",
            "Missing artwork"
          ],
          correct: 0
        }
      }
    }
  ],
 4: [
    {
      id: 1,
      title: "Missing Calibration Logs",
      scenario: "Calibration logs for pH meters are missing for the past three batches.",
      productName: "General QC Batch",
      batchNumber: "BATCH-401",
      imageSrc: "/Level4/product1.webp",
      deviationType: "Equipment Calibration",
      questions: {
        rootCause: {
          question: "Root Cause?",
          options: [
            "Poor adherence to equipment maintenance SOP",
            "Power outage",
            "Supplier error"
          ],
          correct: 0
        },
        impact: {
          question: "Potential consequence?",
          options: [
            "Invalid test results; product release may be impacted",
            "Label mix-up",
            "Regulatory delay due to artwork"
          ],
          correct: 0
        }
      }
    },
    {
      id: 2,
      title: "CAPA Audit Trail Issue",
      scenario: "Audit trail reveals multiple CAPAs closed by the same person who raised them.",
      productName: "Compliance Records",
      batchNumber: "BATCH-402",
      imageSrc: "/Level4/product2.webp",
      deviationType: "QA Process Deviation",
      questions: {
        rootCause: {
          question: "Root Cause?",
          options: [
            "Lack of segregation of duties in QA",
            "Training non-compliance",
            "Vendor error"
          ],
          correct: 0
        },
        impact: {
          question: "Potential consequence?",
          options: [
            "Potential bias; non-objective audit closures",
            "Poor environmental monitoring",
            "Delayed batch manufacturing"
          ],
          correct: 0
        }
      }
    },
    {
      id: 3,
      title: "Cleaning Log Gaps at Night",
      scenario: "Repeated cleaning log gaps during night shifts across departments.",
      productName: "Facility Logs",
      batchNumber: "BATCH-403",
      imageSrc: "/Level4/product3.webp",
      deviationType: "Documentation Deviation",
      questions: {
        rootCause: {
          question: "Root Cause?",
          options: [
            "Lack of supervision during non-peak hours",
            "Contaminated raw materials",
            "Uncalibrated thermometers"
          ],
          correct: 0
        },
        impact: {
          question: "Potential consequence?",
          options: [
            "Non-compliance risk; possible microbial contamination",
            "Labeling issue",
            "Excess stock holding"
          ],
          correct: 0
        }
      }
    },
    {
      id: 4,
      title: "Expired SOP Still in Use",
      scenario: "Vendor audit reveals expired cleaning SOP still in active use.",
      productName: "Cleaning Records",
      batchNumber: "BATCH-404",
      imageSrc: "/Level4/product4.webp",
      deviationType: "SOP Deviation",
      questions: {
        rootCause: {
          question: "Root Cause?",
          options: [
            "Ineffective SOP review process",
            "QA short-staffing",
            "Equipment overload"
          ],
          correct: 0
        },
        impact: {
          question: "Potential consequence?",
          options: [
            "Audit failure; product risk due to outdated procedure",
            "Missing training records",
            "Pricing error"
          ],
          correct: 0
        }
      }
    }
  ]
};