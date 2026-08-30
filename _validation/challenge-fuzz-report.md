# Aprincar Official Challenge Fuzz Report

The official generator suite executes deterministic property checks across **20,000 generated challenges** on every `games-official` test run:

| Generator | Seeds | Required invariants |
| --- | ---: | --- |
| Counting | 10,000 | target exists exactly once; rendered item count equals answer; challenge validates |
| Patterns | 5,000 | answer exists exactly once; sequence is long enough and solvable |
| Colors | 2,000 | correct color exists exactly once; challenge validates |
| Letters | 2,000 | requested letter exists exactly once; challenge validates |
| Memory | 1,000 | every pair occurs exactly twice; card count is `pairs × 2` |

Fresh execution in the final workspace: **PASS — 0 generator invariant failures**.
