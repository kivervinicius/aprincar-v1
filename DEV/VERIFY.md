# Verificação atual

## V1.1 (2026-08-30)

- 10/10 manifests com `experience` completo e fantasias/mecânicas únicas.
- Learning Engine: testes determinísticos de habilidade em desenvolvimento, expansão de contexto e não repetição imediata.
- 37/37 testes unitários, TypeScript, ESLint, build dos jogos, build App/Hub e snapshot oficial: PASS.
- Playwright: 31/32 no ciclo completo; o único caso falhou por timeout transitório durante onboarding e passou na execução isolada subsequente.

- `./validate-production.sh`: PASS em 2026-08-30, sem flags de skip.
- Testes unitários da plataforma: 32/32 PASS.
- Playwright: 28/28 PASS.
- Auditoria de dependências: PASS, sem vulnerabilidades de nível alto.
- Publicação Pages: PASS em 2026-08-30. O workflow remoto concluiu validação e deploy com sucesso em `https://kivervinicius.github.io/aprincar-v1/`; 33/33 testes unitários, TypeScript, lint, build e snapshot oficial também foram verificados localmente.
- Correção de rotas/PWA: testes de deep link do Pages e atualização automática do service worker adicionados; testes, TypeScript, lint, build, snapshot oficial e formatação executados antes da publicação.

O projeto está publicado pelo GitHub Actions. Restam somente controles opcionais de governança remota.
