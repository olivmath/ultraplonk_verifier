# Documentation Deployment Guide

Este projeto contém workflows CI/CD automatizados para build e deploy da documentação Docusaurus.

## Workflows Disponíveis

### 1. **docs-ci.yml** - Validação contínua
- Executa em: Pull requests + Push na branch main
- Ações:
  - Instala dependências
  - Valida tipos TypeScript
  - Faz build da documentação
  - Uploada artefatos (retenção: 1 dia)

### 2. **docs-deploy.yml** - Deploy em GitHub Pages
- Executa em: Push na branch main
- Ações:
  - Build da documentação
  - Deploy automático para GitHub Pages
- **Requisitos de configuração:**
  1. Habilitar GitHub Pages no repositório
  2. Configurar como source: "GitHub Actions"
  3. URL resultante: `https://{usuario}.github.io/{repo}/`

### 3. **docs-deploy-vercel.yml** - Deploy em Vercel (Alternativo)
- Executa em: Push na branch main
- Ações:
  - Build da documentação
  - Deploy automático para Vercel
- **Requisitos de configuração:**
  1. Criar conta em https://vercel.com
  2. Conectar repositório GitHub
  3. Adicionar secrets no repositório:
     - `VERCEL_TOKEN`: Token de autenticação
     - `VERCEL_ORG_ID`: ID da organização
     - `VERCEL_PROJECT_ID`: ID do projeto

## Como Usar

### GitHub Pages (Recomendado para repositórios públicos)

1. **Ativar GitHub Pages:**
   - Vá para Settings → Pages
   - Source: GitHub Actions
   - Clique em Save

2. **Fazer um commit** para ativar o workflow:
   ```bash
   git add .
   git commit -m "ci: add docs deployment workflows"
   git push origin main
   ```

3. A documentação será deployada automaticamente em:
   ```
   https://{seu-username}.github.io/{nome-repo}/
   ```

### Vercel (Alternativa)

1. **Configurar tokens:**
   - Acesse https://vercel.com/account/tokens
   - Crie um novo token e copie
   - Vá para Settings → Secrets and variables → Actions
   - Adicione `VERCEL_TOKEN`

2. **Obter IDs do Vercel:**
   - Link o repositório no Vercel
   - Execute `vercel --prod` localmente para obter os IDs
   - Adicione `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` como secrets

3. **Fazer um commit** e o deploy acontecerá automaticamente

## Monitoramento

- Acesse a aba "Actions" no repositório GitHub
- Veja o histórico de execuções
- Clique em cada workflow para ver detalhes
- Em caso de erro, revise os logs

## Estrutura de Arquivos

```
docs/ultraplonk-lib/
├── package.json
├── package-lock.json
├── docusaurus.config.ts
├── sidebars.ts
├── docs/                 # Documentação
├── blog/                 # Posts do blog
├── src/                  # Componentes customizados
└── build/                # Output (gerado após build)
```

## Troubleshooting

### Build falhando?
- Verifique se `npm run build` funciona localmente
- Revise os logs do workflow na aba Actions
- Confirme que Node.js >= 20.0 está sendo usado

### Deploy não aparecendo?
- **GitHub Pages:** Aguarde alguns minutos e vá para https://{user}.github.io/{repo}/
- **Vercel:** Confirme que VERCEL_TOKEN, VERCEL_ORG_ID e VERCEL_PROJECT_ID estão definidos

### Detectar mudanças na documentação?
- Os workflows monitoram mudanças em `docs/ultraplonk-lib/**`
- Apenas triggers em `main` fazem deploy automático
- PRs apenas fazem validação (CI)

## Customizações

### Mudar URL base
Se quiser servir documentação em um subpath:

```typescript
// docusaurus.config.ts
const config: Config = {
  url: 'https://your-domain.com',
  baseUrl: '/docs/',  // Mude aqui
  // ...
};
```

### Adicionar preview automático em PRs
Adicione um workflow extra para comentar link de preview em Pull Requests (requer Vercel Preview Deployments).

### Customizar branch de deploy
Edite `docs-deploy*.yml` e mude a branch em `on.push.branches`.

## Referências

- [Docusaurus Deployment](https://docusaurus.io/docs/deployment)
- [GitHub Pages with Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Vercel Deployments](https://vercel.com/docs/deployments/overview)
