import { validateExtensionManifest, type ExtensionManifest } from '@aprincar/extension-contracts';
import { hasSkill } from '@aprincar/skill-graph';
export function validateGamePackage(manifest: unknown, html: string) {
  const base = validateExtensionManifest(manifest);
  const errors = [...base.errors];
  if (base.ok && base.manifest) {
    for (const skill of [
      ...base.manifest.contributes.skills,
      ...(base.manifest.contributes.secondarySkills ?? []),
    ])
      if (!hasSkill(skill)) errors.push(`unknown skill: ${skill}`);
    if (
      /<script[^>]+src=["']https?:\/\//i.test(html) ||
      /import\s*\([^)]*https?:\/\//i.test(html) ||
      /eval\s*\(/.test(html)
    )
      errors.push('remote or dynamic executable code is forbidden');
  }
  return { ok: errors.length === 0, errors, manifest: base.manifest as ExtensionManifest | undefined };
}
