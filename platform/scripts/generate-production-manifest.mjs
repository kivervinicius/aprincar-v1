#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const platformRoot = resolve(__dirname, '..');
const manifestPath = resolve(platformRoot, '_validation', 'production-manifest.json');

const repos = [
  { name: '.github', key: 'governance' },
  { name: 'curriculum-bncc', key: 'curriculum' },
  { name: 'community-games', key: 'community' },
  { name: 'game-template-vite', key: 'template-vite' },
  { name: 'game-template-react', key: 'template-react' },
  { name: 'game-template-phaser', key: 'template-phaser' },
  { name: 'game-template-threejs', key: 'template-threejs' },
  { name: 'games-official', key: 'games-official' },
  { name: 'platform', key: 'platform' },
];

console.log('Generating reproducible Aprincar Production Manifest...');

const manifest = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  organization: 'aprincar',
  productionEnvironment: {
    status: 'PRODUCTION_GO',
    portalUrl: 'https://aprincar.github.io/platform/',
    appUrl: 'https://aprincar.github.io/platform/app/',
    hubUrl: 'https://aprincar.github.io/platform/hub/',
  },
  repositories: {},
};

for (const repo of repos) {
  try {
    const repoInfo = JSON.parse(execSync(`gh api repos/aprincar/${repo.name}`).toString());
    const mainCommit = JSON.parse(
      execSync(`gh api repos/aprincar/${repo.name}/commits/${repoInfo.default_branch}`).toString(),
    );

    // Get last merged PR
    const pulls = JSON.parse(
      execSync(
        `gh api "repos/aprincar/${repo.name}/pulls?state=closed&sort=updated&direction=desc&per_page=5"`,
      ).toString(),
    );
    const lastMergedPr = pulls.find((p) => p.merged_at != null);

    manifest.repositories[repo.name] = {
      role: repo.key,
      defaultBranch: repoInfo.default_branch,
      currentMainSha: mainCommit.sha,
      lastCommitMessage: mainCommit.commit.message.split('\n')[0],
      lastCommitDate: mainCommit.commit.author.date,
      lastMergedPr: lastMergedPr
        ? {
            number: lastMergedPr.number,
            title: lastMergedPr.title,
            headSha: lastMergedPr.head.sha,
            mergeCommitSha: lastMergedPr.merge_commit_sha,
            mergedAt: lastMergedPr.merged_at,
          }
        : null,
      isTemplate: repoInfo.is_template,
      topics: repoInfo.topics || [],
    };
  } catch (err) {
    console.error(`Error querying aprincar/${repo.name}:`, err.message);
    throw err;
  }
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Production manifest generated at: ${manifestPath}`);

// Self-validation check
const generated = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (!generated.repositories.platform?.currentMainSha) {
  throw new Error('Manifest validation failed: platform currentMainSha missing');
}

console.log('Production manifest validation PASS.');
