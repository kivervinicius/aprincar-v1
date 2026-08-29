# Community publication workflow

```mermaid
flowchart LR
  Author --> Template
  Template --> PR
  PR --> CI[Manifest and registry checks]
  CI --> Review[Technical / security / pedagogy review]
  Review --> Main
  Main --> Registry
```

Do not edit the generated registry by hand. The registry is rebuilt from accepted game directories. Community games must not access App IndexedDB, profile data, parent controls or another extension.

