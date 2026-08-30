export type ActivityType =
  | 'sorting'
  | 'matching'
  | 'sequencing'
  | 'counting'
  | 'tracing'
  | 'drag-and-drop'
  | 'construction'
  | 'maze'
  | 'keyboard'
  | 'programming';

export type AssistanceLevel = 'none' | 'visual-cue' | 'reduced-complexity' | 'partial-demonstration';

export interface ActivityItem {
  id: string;
  label?: string;
  value: string | number | boolean;
  icon?: string;
  color?: string;
  attributes?: Record<string, string | number | boolean>;
}

export interface ActivityTarget {
  id: string;
  label: string;
  acceptsValue?: string | number | boolean;
  acceptsAttribute?: { key: string; value: string | number | boolean };
  icon?: string;
  color?: string;
}

export interface ActivityDefinition {
  id: string;
  type: ActivityType;
  skillId: string;
  title: string;
  prompt: string;
  items: ActivityItem[];
  targets?: ActivityTarget[];
  expectedSequence?: string[];
  expectedCount?: number;
  difficulty: number;
  theme?: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityPackManifest {
  id: string;
  version: string;
  kind: 'activity-pack';
  publisher: string;
  name: Record<string, string>;
  description: Record<string, string>;
  skills: string[];
  activities: ActivityDefinition[];
}

export interface ActivityAttempt {
  activityId: string;
  placements?: Record<string, string>; // itemId -> targetId
  sequence?: string[]; // itemIds in chosen order
  selectedCount?: number;
  selectedIds?: string[];
}

export interface EvaluationResult {
  valid: boolean;
  score: number; // 0..1
  assistanceLevel: AssistanceLevel;
  feedbackMessage: string;
  misplacedItemIds?: string[];
  correctItemIds?: string[];
  remainingAttemptsAllowed: boolean;
}

export interface ProgressiveHint {
  level: AssistanceLevel;
  message: string;
  highlightedTargetId?: string;
  highlightedItemId?: string;
  eliminatedItemIds?: string[];
  suggestedAction?: string;
}
