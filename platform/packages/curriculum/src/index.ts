import type { SkillCurriculumMapping } from '../../extension-contracts/src/types.ts';
export interface CurriculumFramework {
  id: string;
  name: string;
  version: string;
  locale: string;
}
export function mappingsForSkill(mappings: SkillCurriculumMapping[], skillId: string) {
  return mappings.filter((m) => m.skillId === skillId);
}
export function mappingsForReference(mappings: SkillCurriculumMapping[], framework: string, code: string) {
  return mappings.filter((m) => m.reference.framework === framework && m.reference.code === code);
}
