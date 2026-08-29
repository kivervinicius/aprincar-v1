# Aprincar V1 challenge fuzz report

## Result

PASS for the shared procedural generators, with 20,000 deterministic seeds executed by the official test suite.

| Generator | Seeds | Assertions |
|---|---:|---|
| Counting | 10,000 | Correct option exactly once; unique distractors; rendered item count equals answer; valid options |
| Colors | 2,000 | Correct color exactly once; unique options |
| Patterns | 5,000 | Deterministic motif/sequence; next answer exists exactly once; valid sequence length |
| Letters | 2,000 | Correct letter exactly once; unique options |
| Memory | 1,000 | Every pair occurs exactly twice; card total equals pairs × 2 |
| **Total** | **20,000** | **0 failures** |

Command:

```text
games-official: npm run check
```

The command ran `node --test tests/*.test.mjs` and reported 5/5 passing generator tests, followed by build, syntax, manifest validation, and registry generation. Seed ranges are deterministic (`1..N`) and levels cover the declared test ranges.

## Scope limits

The fuzz suite validates generator invariants and solvability data. It does not replace browser interaction tests for every official game; browser evidence is recorded separately in `final-report.md`.
