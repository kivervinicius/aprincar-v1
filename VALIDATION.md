# Validation

The production gate is executable from the workspace root:

```bash
./validate-production.sh
```

The default gate is intentionally strict: it includes registry-backed dependency vulnerability auditing and all Playwright E2E/mobile acceptance tests.

See `_validation/production-readiness-report.md` for the latest verified status and `_validation/RUN_PRODUCTION_VALIDATION.md` for environment requirements.
