# First GitHub publication

For each repository folder:
```bash
git init -b main
git add .
git commit -m "chore: bootstrap Aprincar V1"
git remote add origin git@github.com:aprincar/<repository>.git
git push -u origin main
```

Then configure branch protection/rulesets on `main`: require pull requests, require CI checks, require conversation resolution, block force pushes, require Code Owner review for protected paths, enable private vulnerability reporting and Dependabot alerts.

For `community-games`, do not allow direct pushes to main. Publication workflow should deploy only merged, immutable outputs to the games CDN/registry.
