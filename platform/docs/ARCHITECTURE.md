# Architecture

## Principles

1. Local-first: IndexedDB is the source of truth even when a future account/cloud exists.
2. App is a platform kernel; games are independent extensions.
3. The Game SDK is the only supported bridge from a game to child/profile data.
4. Games emit evidence; only Progress Engine derives skill state.
5. Reward Engine is separate from pedagogical progress.
6. BNCC/curricula are external crosswalks over Skill IDs.
7. Sensitive permissions are denied by default.

## Extension lifecycle

```text
Registry -> resolve -> verify manifest/integrity -> cache if requested -> GameHost -> sandbox iframe/srcdoc
                                                       |-> MessageChannel -> host services
```

## Online/offline

A library item and local availability are separate. A game can be in the profile library without being cached. `Prepare offline` resolves and stores the immutable version locally. Future sync mirrors profiles/library/progress/game-state; game binary cache remains device-local.
