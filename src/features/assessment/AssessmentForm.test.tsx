import { render, screen, userEvent } from '@test-utils';
import { describe, expect, it, vi } from 'vite-plus/test';
import { AssessmentForm } from './AssessmentForm';
import { samplePatient } from './fixtures';
import { assessmentSchema } from './schema';

describe('Geriatric Assessment Form', () => {
  describe('Schema boundary', () => {
    it('safeParse: accepts patient who is exactly 60 years old on assessment date, rejects one day short', () => {
      const assessmentDate = '2026-08-07';

      // Exactly 60 years old on the assessment date
      const exactly60Patient = {
        ...samplePatient,
        assessmentDate,
        dateOfBirth: '1966-08-07',
      };

      const result60 = assessmentSchema.safeParse(exactly60Patient);
      expect(result60.success).toBe(true);

      // One day short of 60 years old on the assessment date
      const oneDayShortPatient = {
        ...samplePatient,
        assessmentDate,
        dateOfBirth: '1966-08-08',
      };

      const resultShort = assessmentSchema.safeParse(oneDayShortPatient);
      expect(resultShort.success).toBe(false);

      const dobIssue = resultShort.error?.issues.find((issue) => issue.path[0] === 'dateOfBirth');
      expect(dobIssue).toBeDefined();
      expect(dobIssue?.message).toBe('This pathway is for patients aged 60 and over');
    });
  });

  describe('Form rendering and submission', () => {
    it('loads sample patient, submits, and calls save handler with parsed values', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      render(<AssessmentForm onSave={onSave} />);

      // Load sample patient
      const loadButton = screen.getByRole('button', {
        name: /load sample patient/i,
      });
      await user.click(loadButton);

      // Assert fields are populated with the valid fixture
      expect(screen.getByLabelText(/medical record number/i)).toHaveValue(samplePatient.mrn);
      expect(screen.getByLabelText(/patient name/i)).toHaveValue(samplePatient.patientName);
      expect(screen.getByLabelText(/date of birth/i)).toHaveValue(samplePatient.dateOfBirth);
      expect(screen.getByLabelText(/assessment date/i)).toHaveValue(samplePatient.assessmentDate);
      expect(screen.getByLabelText(/barthel index/i)).toHaveValue(
        String(samplePatient.barthelIndex)
      );
      expect(screen.getByLabelText(/regular medications/i)).toHaveValue(
        String(samplePatient.medicationCount)
      );
      expect(screen.getByLabelText(/patient or representative has given consent/i)).toBeChecked();

      // Submit form
      const submitButton = screen.getByRole('button', {
        name: /save assessment/i,
      });
      await user.click(submitButton);

      // Assert onSave was called with the exact parsed values from Zod
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledWith(samplePatient);

      // Assert success alert is displayed with parsed values in code block
      expect(await screen.findByText(/assessment saved successfully/i)).toBeInTheDocument();
    });
  });
});
