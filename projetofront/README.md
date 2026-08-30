# Aprincar Frontend V1 — Implementation Kit

Este pacote contém os arquivos de contrato necessários para implementar o novo frontend do Aprincar sem depender do histórico de conversa.

## Onde colocar

Copie o conteúdo deste pacote para a raiz do repositório `platform`, preservando a estrutura:

```text
platform/
├── docs/
│   └── product/
│       ├── PRODUCT_HANDOFF.md
│       └── FRONTEND_V1_SPEC.md
├── prompts/
│   └── APRINCAR_FRONTEND_V1_AUTOPILOT.md
└── FRONTEND_V1_IMPLEMENTATION_CHECKLIST.md
```

## Ordem de leitura obrigatória para o agente

1. `docs/product/PRODUCT_HANDOFF.md`
2. `docs/product/FRONTEND_V1_SPEC.md`
3. arquitetura/código existente do Aprincar
4. `prompts/APRINCAR_FRONTEND_V1_AUTOPILOT.md`

## Como executar

Crie uma branch:

```bash
git switch -c feat/frontend-v1-redesign
```

Depois execute o agente em modo Agent/Autopilot, na raiz do `platform`, usando o conteúdo integral de:

```text
prompts/APRINCAR_FRONTEND_V1_AUTOPILOT.md
```

O agente deve produzir ao final:

```text
_validation/frontend-final-report.md
_validation/screenshots/
```

Não considere a implementação concluída sem os gates definidos no prompt e no checklist.
