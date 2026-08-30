# Final production validation

From the extracted bundle root:

```bash
chmod +x validate-production.sh
./validate-production.sh
```

Requirements:

- Node.js 22+
- npm 10+
- network access for `npm ci`, the npm vulnerability audit and the first Playwright browser install
- a workstation/browser without an enterprise policy blocking `localhost`

The default command is the release gate. It validates all repositories, cross-repository parity, dependency-tree integrity, registry-backed `npm audit`, and the semantic/responsive Playwright suite.

If Chromium is already available outside Playwright, you can explicitly point the gate at it:

```bash
PLAYWRIGHT_EXECUTABLE_PATH=/path/to/chromium ./validate-production.sh
```

For diagnosing source/build gates in a restricted environment only:

```bash
SKIP_E2E=1 SKIP_NETWORK_AUDIT=1 ./validate-production.sh
```

Both skip flags are **diagnostic only**. A release is not approved until the normal command completes without either skip.
