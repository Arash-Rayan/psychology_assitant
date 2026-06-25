import type { PsychTestDefinition } from './types';
import { BDI2_TEST } from './bdi2';
import { NEO_FFI_TEST } from './neoFfi';

export type { PsychTestDefinition, PsychTestResult } from './types';

export const PSYCH_TESTS: PsychTestDefinition[] = [BDI2_TEST, NEO_FFI_TEST];

export function getPsychTestById(id: string): PsychTestDefinition | undefined {
  return PSYCH_TESTS.find((t) => t.id === id);
}
