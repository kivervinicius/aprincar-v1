# Verificação atual

- `./validate-production.sh`: PASS em 2026-08-30, sem flags de skip.
- Testes unitários da plataforma: 32/32 PASS.
- Playwright: 28/28 PASS.
- Auditoria de dependências: PASS, sem vulnerabilidades de nível alto.
- Publicação Pages: PASS em 2026-08-30. O workflow remoto concluiu validação e deploy com sucesso em `https://kivervinicius.github.io/aprincar-v1/`; 33/33 testes unitários, TypeScript, lint, build e snapshot oficial também foram verificados localmente.
- Correção de rotas/PWA: testes de deep link do Pages e atualização automática do service worker adicionados; testes, TypeScript, lint, build, snapshot oficial e formatação executados antes da publicação.

O projeto está publicado pelo GitHub Actions. Restam somente controles opcionais de governança remota.
