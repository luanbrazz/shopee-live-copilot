# 🚀 Shopee Live Copilot

> **A ferramenta definitiva de automação inteligente e conversão em tempo real para transmissões na Shopee Live (`https://live.shopee.com.br/*`).**

Desenvolvida como uma extensão Google Chrome moderna (Manifest V3), o **Shopee Live Copilot** opera diretamente no painel de transmissão da Shopee Live, respondendo dúvidas de compradores com **Inteligência Artificial (Google Gemini)**, abordando quem coloca produtos no carrinho, fixando ofertas e enviando alertas sonoros e push no seu celular.

---

## 📋 Índice
1. [Recursos Principais](#-recursos-principais)
2. [Como Gerar a Chave de API Gratuita no Google Gemini](#-1-como-gerar-sua-chave-de-api-no-google-gemini-grátis)
3. [Como Instalar a Extensão no Google Chrome](#-2-como-instalar-a-extensão-no-google-chrome)
4. [Guia Passo a Passo: Montando a Live no OBS Studio](#-3-guia-completo-configuração-do-obs-studio-916)
5. [Como Colocar a Live no Ar na Shopee Live](#-4-iniciando-a-transmissão-na-shopee-live)
6. [Operando o Copilot para Qualquer Produto](#-5-operando-o-copilot-para-qualquer-produto)
7. [Segurança e Variáveis de Ambiente](#-6-segurança-e-privacidade)

---

## 🌟 Recursos Principais

- **🤖 Respostas com IA em Tempo Real (Google Gemini Flash Lite):** Detecta perguntas reais de compra no chat virtualizado (`ReactVirtualized`) e responde em menos de 130 caracteres direcionando para a **Sacola Laranja**.
- **🎯 Interação Proativa no Carrinho (`@usuario`):** Aborda automaticamente espectadores que adicionam o produto à sacola ou estão comprando, incentivando o fechamento com cupom e frete grátis.
- **🛡️ Tratamento de Mascaramento da Shopee:** Se o nome do usuário contiver `...` (privacidade da Shopee, ex: `marcos...`), o robô formata a frase naturalmente sem arroba quebrado.
- **⌨️ Proteção Inteligente de Digitação:** Se o apresentador estiver com o cursor focado no chat digitando um rascunho, o robô pausa e aguarda para não sobrescrever o texto humano.
- **📌 Mensagens Periódicas (CTA) com Fixação Automática:** Envia lembretes persuasivos em intervalos programados (ex: a cada 3 minutos) marcando a caixinha **"Marcar"** para fixar no chat.
- **🔔 Notificações Push no Celular (`ntfy.sh`):** Alertas sonoros instantâneos no seu celular quando alguém compra ou coloca produto na sacola.
- **⏱️ Timer de Encerramento Automático:** Programa a duração da live e clica automaticamente em *"Finalizar Transmissão"* ao zerar o cronômetro.
- **📡 Watchdog Anti-Queda:** Monitora o player de vídeo da Shopee. Se o OBS travar por mais de 30 segundos, dispara alerta de emergência.

---

## 🔑 1. Como Gerar sua Chave de API no Google Gemini (Grátis)

A extensão utiliza a API oficial do Google Gemini para responder dúvidas. O Google oferece uma cota gratuita generosa que atende com folga transmissões diárias.

1. Acesse o **Google AI Studio**:  
   👉 [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Faça login com a sua conta do **Google (Gmail)**.
3. Clique no botão azul **"Create API key"** (ou "Criar chave de API").
4. Selecione a opção **"Create API key in new project"** (Criar chave em novo projeto).
5. O Google gerará uma chave única que começa com `AIza...` (ou `AQ...`).
6. Clique no botão de **Copiar** (ícone de prancheta).
7. Guarde sua chave com segurança. Você irá colá-la na interface do **Shopee Live Copilot**.

---

## 💻 2. Como Instalar a Extensão no Google Chrome

1. Baixe ou clone este repositório no seu computador:
   ```bash
   git clone https://github.com/luanbrazz/shopee-live-copilot.git
   ```
2. Abra o **Google Chrome** e acesse a página de extensões:
   ```text
   chrome://extensions/
   ```
3. No canto superior direito da tela, ative a chave **"Modo do desenvolvedor"** (Developer mode).
4. No canto superior esquerdo, clique no botão **"Carregar sem compactação"** (Load unpacked).
5. Selecione a pasta do projeto clonado (`shopee-live-copilot`).
6. A extensão aparecerá na lista. Clique no ícone de "quebra-cabeça" na barra superior do Chrome e **fixe (📌)** o ícone do **Shopee Live Copilot**.
7. Clique no ícone da extensão para abrir o **Side Panel** lateral e cole a sua Chave de API do Gemini no campo correspondente!

---

## 🎥 3. Guia Completo: Configuração do OBS Studio (9:16)

Para transmitir com máxima estabilidade e qualidade profissional no formato mobile vertical da Shopee Live:

### A. Resolução de Tela (Formato Vertical 9:16)
1. No OBS Studio, vá em **Arquivo ➔ Configurações ➔ Vídeo**.
2. **Resolução de Base (Tela):** Digite manualmente `1080x1920`.
3. **Resolução de Saída (Escala):** Digite manualmente `1080x1920`.
4. **Filtro de Redução:** Bicúbico (16 amostras).
5. **FPS:** `30` (ideal para live commerce estável sem perda de pacotes).

### B. Encoder e Taxa de Bits (Transmissão Suave)
1. Vá em **Configurações ➔ Saída** e mude o *Modo de Saída* para **Avançado**.
2. Na aba **Transmissão**:
   - **Codificador de Vídeo:** `NVIDIA NVENC H.264` (ou `AMD / Intel QuickSync / x264`).
   - **Controle de Taxa:** `CBR`.
   - **Taxa de Bits:** `2500 kbps` a `3500 kbps`.
   - **Intervalo de Keyframe:** `2s` (obrigatório para plataformas RTMP como Shopee e TikTok).
   - **Predefinição:** `P5: Lento (Boa Qualidade)` ou `Qualidade`.
   - **Ajuste:** `Baixa Latência`.

### C. Áudio Nativamente Sincronizado
1. Vá em **Configurações ➔ Áudio**.
2. **Taxa de Amostragem:** `48 kHz`.
3. **Canais:** `Estéreo`.

### D. Montagem da Cena no OBS Studio
Crie uma cena chamada `Live Commerce Vertical` com 3 camadas organizadas (de baixo para cima):

1. **Fonte 1 - Vídeo de Demonstração (Fundo):**
   - Adicione uma **Fonte de Mídia**.
   - Selecione o arquivo `.mp4` do produto e marque a caixinha **Loop** (Repetir).
   - Enquadre o vídeo no centro da tela (`1080x1920`).
2. **Fonte 2 - Áudio Master da Apresentação:**
   - Adicione uma **Fonte de Mídia** com a narração/áudio master `.mp3` e marque **Loop**.
   - Em *Propriedades de Áudio Avançadas*, garanta que o áudio esteja roteado para a **Faixa 1** (que é enviada na transmissão RTMP).
3. **Fonte 3 - Banner Overlay (Camada Superior):**
   - Adicione uma fonte de **Imagem** com o seu banner transparente `1080x1920`.
   - O banner deve cobrir o topo (rosto do apresentador original, caso esteja usando vídeo de banco/demonstração) e ter chamadas visuais para a **Sacola Laranja (Produto 1)**.

---

## 🔴 4. Iniciando a Transmissão na Shopee Live

1. Abra o painel web da Shopee Live:  
   👉 [https://live.shopee.com.br/pc/setup](https://live.shopee.com.br/pc/setup)
2. Preencha os dados da transmissão:
   - **Imagem de capa:** Envie uma foto atraente em proporção 1:1.
   - **Título:** Título chamativo (ex: `🔥 MEGA OFERTA | Mochila 45L Cabine ANAC`).
   - **Produtos relacionados:** Adicione os produtos da sua loja que ficarão na Sacola Laranja. O produto principal deve ficar na posição **N° 1**.
3. Clique no botão vermelho **"Próximo"**.
4. Você entrará na tela de pré-visualização. A Shopee exibirá:
   - **URL do Servidor:** `rtmp://push-ws.lvb.shopee.com.br/livestreaming/`
   - **Chave de Transmissão (Stream Key):** Código alfanumérico longo com `wsSecret=...`.
5. No **OBS Studio**:
   - Vá em **Configurações ➔ Transmissão**.
   - Em *Serviço*, escolha **Personalizado...**.
   - Em *Servidor*, cole a URL da Shopee.
   - Em *Chave de transmissão*, cole a Chave gerada.
   - Clique em **Aplicar** e **OK**.
6. No OBS Studio, clique em **"Iniciar transmissão"**.
7. Volte na tela da Shopee Live, veja a imagem carregar no player de preview e clique no botão **"Entrar ao vivo"**!

---

## 🛠️ 5. Operando o Copilot para Qualquer Produto

Com a live rodando, abra o painel lateral do **Shopee Live Copilot** no Chrome:

### A. Regra de Ouro de Preço no Contexto do Produto
> ⚠️ **IMPORTANTE:** Nunca coloque preços fixos (ex: "R$ 94,99") no campo *Contexto Oficial do Produto*.  
> Na Shopee, cada comprador tem descontos diferentes baseados no CEP, cupons de frete grátis, moedas acumuladas e cupons da live.  
> Se o robô citar um valor fixo, clientes que veem outro preço podem reclamar.

**Exemplo de como descrever seu produto na extensão:**
```text
PRODUTO PRINCIPAL DA LIVE (LOJA OFICIAL):
- Nome: Fone de Ouvido Bluetooth Sem Fio com Cancelamento de Ruído
- Bateria: Até 30 horas de reprodução contínua com case recarregável
- Recursos: Bluetooth 5.3, microfone integrado para chamadas, resistente ao suor
- Cores: Preto e Branco
- Envio: Pronta entrega com estoque em São Paulo e envio em até 24h
- Preço e Desconto: MEGA OFERTA DE LIVE! REGRA: NUNCA diga valores em reais. Sempre oriente o cliente a tocar na Sacola Laranja (Produto 1) para resgatar o cupom de desconto exclusivo da live e ver o menor preço no carrinho!
```

### B. Interação Proativa no Carrinho
- Na aba **🎯 Interação & Timer**, mantenha ativado o switch **"Fechamento de Carrinho & Sacola"**.
- Sempre que alguém colocar o item na sacola, a extensão mandará uma mensagem personalizada automática:
  - `@usuario Vi que você garantiu na sacola! Aproveite o cupom da live + Frete Grátis antes de finalizar no carrinho 🛒✨`

### C. Mensagens Periódicas (CTA)
- Defina o intervalo desejado (ex: `3 minutos`).
- A extensão enviará mensagens alternadas e marcará automaticamente a caixinha **"Marcar"** para mantê-las fixadas no topo do chat.

### D. Alertas no Celular via ntfy (Opcional)
1. Instale o aplicativo gratuito **ntfy** no seu celular ([Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy) ou [iOS](https://apps.apple.com/app/ntfy/id1625396347)).
2. Crie um nome de tópico exclusivo (ex: `shopee_live_minhaloja_789`) e inscreva-se nele no app.
3. No painel da extensão, insira esse mesmo tópico e clique em *"Testar Notificação"*.
4. Você receberá notificações sonoras no celular a cada venda e sacola adicionada!

---

## 🔒 6. Segurança e Privacidade

- **Sem chaves expostas no Git:** O projeto utiliza `.gitignore` para impedir que arquivos `.env` ou credenciais sejam comitados publicamente.
- **Configurações Locais:** Todas as chaves e dados de produtos ficam armazenados exclusivamente no `chrome.storage.local` do seu navegador.
- **Proteção Anti-Spam:** A extensão respeita cooldowns rígidos de resposta e nunca dispara mensagens em massa para entradas genéricas de espectadores.

---

## 📄 Licença
Distribuído sob licença MIT. Livre para uso comercial e adaptação para qualquer loja ou produto na Shopee Live.
