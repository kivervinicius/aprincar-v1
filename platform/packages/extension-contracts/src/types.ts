export type ExtensionKind = 'game' | 'theme' | 'curriculum' | 'content';
export type TrustLevel = 'official' | 'curated' | 'community' | 'experimental';
export type Permission =
  | 'storage'
  | 'audio'
  | 'haptics'
  | 'fullscreen'
  | 'drawing'
  | 'handwriting'
  | 'camera'
  | 'microphone'
  | 'network'
  | 'geolocation';
export type SkillStateName = 'unknown' | 'exploring' | 'developing' | 'comfortable' | 'consolidated';
export type Assistance = 'none' | 'hint' | 'guided';

export interface LocalizedText {
  [locale: string]: string;
}
export interface AgeGuidance {
  min: number;
  max: number;
}

export interface ExtensionManifest {
  manifestVersion: 1;
  id: string;
  kind: ExtensionKind;
  version: string;
  publisher: string;
  name: LocalizedText;
  description?: LocalizedText;
  engines: { aprincar: string; sdkProtocol: number };
  entrypoints: { game?: string };
  permissions: Permission[];
  optionalPermissions: Permission[];
  contributes: {
    skills: string[];
    secondarySkills?: string[];
    ageGuidance?: AgeGuidance;
    interests?: string[];
    playType?: 'learning' | 'practice' | 'creative' | 'free-play';
  };
  offline: boolean;
  bundleMode: 'single-html';
}

export interface RegistryEntry {
  id: string;
  version: string;
  trust: TrustLevel;
  publisher: string;
  name: LocalizedText;
  description?: LocalizedText;
  skills: string[];
  ageGuidance?: AgeGuidance;
  manifestUrl: string;
  entryUrl: string;
  integrity: string;
  tags?: string[];
}

export interface ResolvedExtension {
  manifest: ExtensionManifest;
  html: string;
  source: 'cache' | 'remote' | 'bundled';
  resolvedAt: string;
}

export interface EvidenceEvent {
  id: string;
  profileId: string;
  gameId: string;
  sessionId: string;
  skillId: string;
  result: 'success' | 'failure' | 'observed';
  independent: boolean;
  assistance: Assistance;
  difficulty: number;
  confidence: number;
  attempts?: number;
  metadata?: Record<string, string | number | boolean>;
  trust?: TrustLevel;
  occurredAt: string;
}

export interface SkillDefinition {
  id: string;
  domain: string;
  area: string;
  label: LocalizedText;
  description: LocalizedText;
  prerequisites: string[];
  evidenceMode: 'assessable' | 'observational';
  ageGuidance?: AgeGuidance;
}

export interface SkillState {
  profileId: string;
  skillId: string;
  state: SkillStateName;
  confidence: number;
  evidenceCount: number;
  independentSuccesses: number;
  assistedSuccesses: number;
  failures: number;
  contextCount: number;
  updatedAt: string;
}

export interface RewardEvent {
  id: string;
  profileId: string;
  gameId: string;
  reason: string;
  amount: number;
  occurredAt: string;
}

export interface CurriculumReference {
  framework: string;
  version: string;
  code: string;
  stage?: string;
  grade?: string;
}

export interface SkillCurriculumMapping {
  skillId: string;
  reference: CurriculumReference;
  relation: 'direct' | 'partial' | 'supports' | 'prerequisite';
  confidence?: number;
  notes?: string;
}
