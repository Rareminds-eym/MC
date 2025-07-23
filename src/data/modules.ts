import type { Module } from '../types/module';

export const modules: Module[] = [
  { id: "1", status: 'available', title: 'Introduction to GMP', progress: 0 },
  { id: "2", status: 'available', title: 'Personal Hygiene' },
  { id: "3", status: 'available', title: 'Cleaning Validation' },
  { id: "4", status: 'available', title: 'Documentation' },
  { id: "HL1", status: 'locked', title: 'Hackathon Leve-1' },
  { id: "HL2", status: 'locked', title: 'Hackathon Leve-2' },
];