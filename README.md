# Geriatric Care Assessment Form

Take-Home Assessment for Frontend Developer role at Manufac Analytics. Built with **React 19**, **TypeScript**, **Mantine 9**, and **Zod 4**.

## Overview

A clinical assessment form used by visiting nurses when checking on elderly patients at home. It captures 10 distinct clinical and administrative fields, validated comprehensively using a strict Zod 4 schema wired directly through Mantine Form's `schemaResolver`.

Live Demo: [https://geriatric-assessment-form-eight.vercel.app](https://geriatric-assessment-form-eight.vercel.app)

---

## Key Requirements & Implementation

1. **10 Fields in Paper & Container**:
   - `mrn`: Medical record number (`MRN-\d{6}`)
   - `patientName`: Patient name (2–60 chars)
   - `dateOfBirth`: Date of birth (`YYYY-MM-DD`)
   - `assessmentDate`: Assessment date (`YYYY-MM-DD`, max date = today)
   - `mobility`: Select status dynamically formatted from `MOBILITY`
   - `barthelIndex`: NumberInput (0–100, step 5, `clampBehavior="none"`)
   - `medicationCount`: NumberInput (0–30, `clampBehavior="none"`)
   - `pharmacistReviewRequested`: Checkbox (required if medication count >= 5)
   - `followUpDate`: Next review date (`YYYY-MM-DD`, must be after assessment date)
   - `consentObtained`: Checkbox (`z.literal(true)`)
2. **Strict Schema-Driven Validation**:
   - Zero duplicated rules in JSX. Validation is driven strictly by `assessmentSchema` via `schemaResolver`.
   - Number inputs use `clampBehavior="none"` so that clinically invalid scores (such as 105 or 82) are rejected by Zod rather than silently clamped.
3. **Derived Input Typing Without Duplication**:
   - Types are derived directly from `Assessment = z.infer<typeof assessmentSchema>`.
   - Initial form input values use a mapped type (`[K in keyof Assessment]: Assessment[K] extends true ? boolean : Assessment[K] | '' | null`), eliminating any hand-written second interfaces or `any` casts.
4. **Validation UX**:
   - Validation runs on blur (`validateInputOnBlur: true`) and on submit.
   - Untouched fields stay quiet.
   - Built-in Mantine inline error rendering below each field (no error alert box at top).
   - An empty form produces exactly 9 errors with no cross-field noise.
5. **Async Save Simulation**:
   - On valid submit, shows loading indicator on submit button, disables it, simulates an ~800ms save delay, and displays a success `Alert` with formatted Zod-parsed output in a `<Code block>`.
6. **Fixture Loading**:
   - "Load sample patient" fills the form with the valid clinical fixture.

---

## Running Locally

### Prerequisites
- Node.js 20+ (Node 22 LTS recommended)
- Corepack / Yarn 4 (`corepack enable`)

### Commands

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Run full test suite (typecheck, lint, stylelint, vitest, and production build)
yarn test

# Run vitest test suite
yarn vitest
```

---

## Automated Tests

Tested using Vitest and React Testing Library:
1. **Schema Boundary Test**: Uses `safeParse` to verify acceptance of a patient who turns exactly 60 on the assessment date (`1966-08-07` for `2026-08-07`), and rejection of a patient who is one day short (`1966-08-08`).
2. **Rendered Form Test**: Renders `<AssessmentForm />`, clicks "Load sample patient", submits the form, and asserts the save handler was invoked with the parsed data.

---

## Time Spent & Reflections

- **Time Spent**: ~1.5 hours
- **Decisions & Nuances Handled**:
  - Derived form values mapped directly from `Assessment` to maintain a single source of truth without duplicating interfaces or using `any`.
  - Configured `clampBehavior="none"` on `NumberInput` to ensure clinical scores outside valid bounds trigger schema validation errors rather than being quietly rewritten.
  - Formatted `MOBILITY` values dynamically into title-cased labels (`cane` -> `Cane`, `home_visit` -> `Home Visit`) so any new enum members appear automatically.
