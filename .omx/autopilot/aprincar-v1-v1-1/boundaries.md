# Boundaries

- NEVER: reset destrutivo, apagar alterações do usuário, expor segredos ou alterar APIs públicas sem necessidade.
- DANGER: publicação Pages; somente após gates locais/remotos aprovados.
- ROLLBACK: commits `8cef819`, `2018ce3`, `3703690`; revert explícito se necessário.
- VERIFY: testes, typecheck, lint, build, snapshot oficial, Playwright remoto e registry público.
