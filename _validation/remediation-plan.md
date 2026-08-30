# Plano de Remediação — Auditoria Mestre

## Ordem obrigatória

1. **Concluído: recuperar o gate Evidence/Progress.** Proprietários: `games-official` e `platform`.
   - `inputReady` explicita a transição “erro → pronto para nova tentativa”.
   - O E2E aguarda prontidão funcional, e o gate integral passou sem skips.

2. **P2: padronizar governança de publicação.** Proprietários: maintainers.
   - Incluir documentação mínima de CONTRIBUTING, SECURITY e SUPPORT nos roots que ainda só dependem do repositório organizacional.
   - Declarar política de dependências/CodeQL para jogos, currículo e templates, ou justificar a exceção em ADR.
   - Adicionar CODEOWNERS aos quatro templates e definir um formato de changelog/release notes por repositório.

3. **P2: executar a verificação externa no GitHub.** Proprietários: organização.
   - Confirmar ruleset de `main`, revisão por Code Owner, bloqueio de force-push/delete, secret scanning, push protection, Dependabot alerts e private vulnerability reporting.
   - Confirmar Pages, variáveis de base URL e marcação dos quatro templates como GitHub Template Repositories.
   - Critério: checklist assinado com links de configuração ou evidências do GitHub Actions; não substituir por alegação local.

## Risco e dependência

Não há mais bloqueador local de release. Os itens restantes são governança e verificação remota, que devem ser concluídos antes da promoção pública.
