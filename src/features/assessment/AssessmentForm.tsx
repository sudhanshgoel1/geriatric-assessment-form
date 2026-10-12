import dayjs from 'dayjs';
import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { AssessmentFormValues, initialAssessmentValues, samplePatient } from './fixtures';
import { Assessment, assessmentSchema, MOBILITY } from './schema';

export function formatMobilityLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const mobilityOptions = MOBILITY.map((value) => ({
  value,
  label: formatMobilityLabel(value),
}));

export interface AssessmentFormProps {
  onSave?: (data: Assessment) => Promise<void> | void;
}

export function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<Assessment | null>(null);

  const form = useForm<AssessmentFormValues>({
    mode: 'uncontrolled',
    initialValues: initialAssessmentValues,
    validate: schemaResolver(assessmentSchema),
    validateInputOnBlur: true,
  });

  const handleLoadSample = () => {
    form.setValues(samplePatient);
    form.clearErrors();
    setSubmittedData(null);
  };

  const handleSubmit = async (values: AssessmentFormValues) => {
    setIsSubmitting(true);
    setSubmittedData(null);

    try {
      const parsed = assessmentSchema.parse(values);

      if (onSave) {
        await onSave(parsed);
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmittedData(parsed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <Title order={2} mb="lg">
          Geriatric Care Assessment
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack gap="md">
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              key={form.key('mrn')}
              {...form.getInputProps('mrn')}
            />

            <TextInput
              label="Patient name"
              key={form.key('patientName')}
              {...form.getInputProps('patientName')}
            />

            <DateInput
              label="Date of birth"
              valueFormat="YYYY-MM-DD"
              key={form.key('dateOfBirth')}
              {...form.getInputProps('dateOfBirth')}
            />

            <DateInput
              label="Assessment date"
              valueFormat="YYYY-MM-DD"
              maxDate={dayjs().format('YYYY-MM-DD')}
              key={form.key('assessmentDate')}
              {...form.getInputProps('assessmentDate')}
            />

            <Select
              label="Mobility"
              placeholder="Select mobility status"
              data={mobilityOptions}
              key={form.key('mobility')}
              {...form.getInputProps('mobility')}
            />

            <NumberInput
              label="Barthel Index"
              step={5}
              min={0}
              max={100}
              clampBehavior="none"
              key={form.key('barthelIndex')}
              {...form.getInputProps('barthelIndex')}
            />

            <NumberInput
              label="Regular medications"
              min={0}
              max={30}
              clampBehavior="none"
              key={form.key('medicationCount')}
              {...form.getInputProps('medicationCount')}
            />

            <Checkbox
              label="Pharmacist review requested"
              key={form.key('pharmacistReviewRequested')}
              {...form.getInputProps('pharmacistReviewRequested', {
                type: 'checkbox',
              })}
            />

            <DateInput
              label="Next review date"
              valueFormat="YYYY-MM-DD"
              key={form.key('followUpDate')}
              {...form.getInputProps('followUpDate')}
            />

            <Checkbox
              label="Patient or representative has given consent"
              aria-label="Consent"
              key={form.key('consentObtained')}
              {...form.getInputProps('consentObtained', { type: 'checkbox' })}
            />

            <Group justify="flex-start" mt="md">
              <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                Save assessment
              </Button>

              <Button
                type="button"
                variant="default"
                onClick={handleLoadSample}
                disabled={isSubmitting}
              >
                Load sample patient
              </Button>
            </Group>
          </Stack>
        </form>

        {submittedData && (
          <Alert
            color="green"
            title="Assessment saved successfully"
            mt="xl"
            withCloseButton
            onClose={() => setSubmittedData(null)}
          >
            <Code block mt="xs">
              {JSON.stringify(submittedData, null, 2)}
            </Code>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
