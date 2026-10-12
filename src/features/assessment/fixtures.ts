import type { Assessment } from './schema';

export type AssessmentFormValues = {
  [K in keyof Assessment]: Assessment[K] extends true ? boolean : Assessment[K] | '' | null;
};

export const samplePatient: Assessment = {
  mrn: 'MRN-004821',
  patientName: 'Sushila Deshpande',
  dateOfBirth: '1949-03-12',
  assessmentDate: '2026-08-07',
  mobility: 'cane',
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: '2026-09-04',
  consentObtained: true,
};

export const initialAssessmentValues: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: null,
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false,
};
