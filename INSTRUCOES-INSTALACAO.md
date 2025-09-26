# 🚀 Instruções de Instalação - FIEC +IA

## 📁 Estrutura de Pastas Necessária

Crie esta estrutura exata na sua máquina:

\`\`\`
projeto-fiec-ia/
├── index-fixed.html          # Arquivo principal (use este!)
├── public/
│   └── images/
│       ├── fiec-ia-logo.png
│       ├── ai-fundamentals-new.png
│       ├── governance-risk.png
│       ├── tech-possibilities-new.png
│       ├── prompt-engineering.png
│       ├── ai-agents-automation-gradient.jpg
│       ├── corporate-ecosystem-gradient.jpg
│       ├── reliability-security-gradient.jpg
│       ├── productivity-collaboration-gradient.jpg
│       ├── padlock-blue.png
│       └── padlock-unlocked.png
└── INSTRUCOES-INSTALACAO.md  # Este arquivo
\`\`\`

## 🔧 Soluções para Problemas no VS Code

### Problema 1: Layout Quebrado
**Solução:** Use o arquivo `index-fixed.html` que tem:
- Configuração melhorada do Tailwind CSS
- Estilos de fallback para quando o Tailwind não carrega
- Caminhos de imagem corrigidos

### Problema 2: Imagens Não Aparecem
**Solução:** 
1. Certifique-se que todas as imagens estão na pasta `public/images/`
2. Use um servidor local (não abra direto no navegador)

### Problema 3: Tailwind CSS Não Carrega
**Solução:** O arquivo corrigido tem estilos de fallback que funcionam mesmo sem Tailwind

## 🚀 Como Executar (3 Opções)

### Opção 1: Live Server (VS Code) - RECOMENDADO
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito no `index-fixed.html`
3. Selecione "Open with Live Server"

### Opção 2: Python
\`\`\`bash
# No terminal, dentro da pasta do projeto:
python -m http.server 8000
# Depois abra: http://localhost:8000/index-fixed.html
\`\`\`

### Opção 3: Node.js
\`\`\`bash
# No terminal, dentro da pasta do projeto:
npx serve .
# Depois abra o link que aparecer
\`\`\`

## ✅ Verificação

Se tudo estiver correto, você deve ver:
- Layout responsivo e bem formatado
- Imagens carregando corretamente
- Animações funcionando
- Cadeados azuis nos módulos bloqueados
- Progresso funcionando ao clicar nos módulos

## 🆘 Problemas Comuns

**Imagens ainda não aparecem?**
- Verifique se os nomes dos arquivos estão exatos
- Certifique-se que está usando um servidor local
- Verifique se a pasta `public/images/` existe

**Layout ainda quebrado?**
- Use o `index-fixed.html` (não o `index.html`)
- Certifique-se que tem conexão com internet (para Tailwind CDN)
- Tente outro navegador

**Funcionalidades não funcionam?**
- Verifique se o JavaScript está habilitado no navegador
- Abra o Console do navegador (F12) para ver erros
