# 🚀 Shopee Live Copilot — Guia de Instalação e Uso

Extensão Manifest V3 desenvolvida sob medida e com máxima eficiência para automação e gestão inteligente de transmissões ao vivo na **Shopee Live** (`https://live.shopee.com.br/*`).

---

## 🛠️ Como Atualizar ou Recarregar a Extensão no Google Chrome

1. No **Google Chrome**, acesse: `chrome://extensions/`
2. Localize o card do **Shopee Live Copilot**.
3. Clique no botão de **Recarregar / Atualizar** (ícone circular 🔄).
4. Volte para a aba da **Shopee Live** e aperte **F5** (Recarregar).
5. Abra o painel lateral da extensão: todas as novas configurações de **Interação Proativa** já estarão ativas!

---

## 🎯 Funcionalidades Integradas

### 1. 🎯 Interação Proativa & Fechamento de Carrinho (`@usuario`) — NOVO!
- **Gatilho de Carrinho & Compra (Alta Intenção):** Quando um cliente adiciona o produto à sacola ou compra, a extensão envia automaticamente uma mensagem personalizada incentivando o fechamento com cupom e frete grátis antes que o cliente saia da live.
- **Tratamento Inteligente de Mascaramento da Shopee:**
  - Se o nome do usuário estiver completo (ex: `adeilza201`), menciona como `@adeilza201 `.
  - Se o nome estiver mascarado pela privacidade da Shopee com `...` (ex: `fernando...`), a extensão remove automaticamente o `{user}` e ajusta a frase para começar com letra maiúscula de forma 100% natural, sem `@` quebrado.
- **Proteção de Digitação Manual:** Se o apresentador estiver com o cursor focado ou digitando no campo de texto, o envio automático pausa imediatamente por 10 segundos para nunca atrapalhar nem sobrescrever o texto humano.
- **Deduplicação de 30 Minutos:** Nunca aborda o mesmo usuário mais de 1 vez na mesma janela de 30 minutos.
- **Boas-Vindas Anti-Spam (`entrou!`):** Desativado por padrão para evitar flood, com limite rígido de 1 mensagem a cada 60s se ativado.

### 2. 🤖 Respostas Automáticas com IA (Google Gemini)
- **Deduplicação Inteligente:** Compatível com a rolagem virtualizada (`ReactVirtualized`), garantindo que perguntas nunca sejam respondidas duas vezes.
- **Regra de Ouro de Preço:** A IA nunca cita valores fixos em R$, direcionando o comprador para a **Sacola Laranja (Produto 1)** para resgatar cupons exclusivos de live, moedas e frete grátis.
- **Limite Estrito:** Respostas objetivas com menos de 130 caracteres (dentro da trava de 150 caracteres da Shopee).

### 3. 🔔 Notificações Push no Celular (ntfy.sh) + Avisos Sonoros
- **Notificação de Vendas (`comprou`):** Alerta urgente com som no celular via app ntfy.
- **Notificação de Sacola / Carrinho (`adicionou ao carrinho`):** Alerta em tempo real com nome do cliente.
- **Sons Sintetizados (Web Audio):** Toca acordes harmônicos elegantes no navegador para vendas e sacola.

### 4. 📌 Mensagens Periódicas (CTA) com Fixação Automática
- Envia lembretes persuasivos de compra em intervalos configuráveis (padrão: 10 minutos).
- Marca automaticamente a opção **"Marcar"** para fixar a mensagem no topo do chat da Shopee.

### 5. ⏱️ Timer de Encerramento Automático
- Configure a duração desejada da live (ex: 60 minutos).
- Ao zerar, a extensão clica no botão `"Finalizar Transmissão"`, confirma no modal da Shopee e notifica no seu celular.

### 6. 🛡️ Watchdog Anti-Queda da Transmissão
- Monitora o vídeo e o buffering da Shopee. Se o OBS travar por mais de 30 segundos, envia um alerta sonoro urgente para o celular.
