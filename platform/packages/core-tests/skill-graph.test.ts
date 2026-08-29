import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, getSkill } from '../skill-graph/src/index.ts';

test('ships a unique, internally consistent 46-skill starter graph', () => {
  assert.equal(SKILLS.length, 46);
  assert.equal(new Set(SKILLS.map((skill) => skill.id)).size, SKILLS.length);
  for (const skill of SKILLS)
    for (const prerequisite of skill.prerequisites)
      assert.ok(getSkill(prerequisite), `${skill.id} references missing ${prerequisite}`);
});
