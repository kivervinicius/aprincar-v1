# Aprincar Curriculum — BNCC

Optional curriculum crosswalk. This repository does **not** redefine Aprincar skills and does not prove school mastery. It maps granular Aprincar Skill IDs to BNCC references using explicit `direct`, `partial`, `supports` or `prerequisite` relations.

The initial crosswalk is intentionally conservative and must be expanded only after pedagogical review. Source reference: Base Nacional Comum Curricular, MEC — https://basenacionalcomum.mec.gov.br/

Validation and the Skill → mapping → BNCC boundary are described in `docs/README.md`.

## Referential integrity

`mappings.json` is validated against two versioned local catalogs: `schemas/skill-ids.json` (the Aprincar V1 Skill Graph snapshot) and `references/bncc-v1.json` (only the BNCC references used by this conservative V1 crosswalk). A syntactically valid but unknown Skill ID or BNCC code is rejected, as are duplicate relations and invalid confidence values.

The BNCC catalog stores identifiers and structural metadata only; it does not reproduce BNCC text and does not imply that an Aprincar skill, game or progress state is equivalent to school assessment or complete mastery of a BNCC objective.
