// ========================================================================
// SHOPEE LIVE COPILOT — Content Script (Injetado em live.shopee.com.br)
// ========================================================================

(function () {
  'use strict';

  console.log('[ShopeeCopilot] Inicializando Shopee Live Copilot v1.0...');

  // --- Estado Global e Configurações Padrão ---
  const state = {
    config: {
      aiEnabled: true,
      geminiApiKey: '',
      geminiModel: 'gemini-flash-lite-latest',
      systemPrompt: 'Seja simpática, rápida, persuasiva e direta ao ponto.',
      productContext: `PRODUTO PRINCIPAL DA LIVE (ROMANTIC CROWN ORIGINAL):
- Nome: Mochila de Viagem Expansível Executiva (Cabine ANAC)
- Capacidade: Expansível de 33L para 45L (zíper expansor que aumenta a profundidade de 12cm para 22cm)
- Padrão Cabine ANAC: Dimensões 45 x 32cm aprovadas para viajar a bordo de avião sem pagar taxa de despacho!
- Compartimento Notebook: Bolso acolchoado especial para notebook de até 17.3 polegadas
- Cores disponíveis: Preto, Branco (Off-White), Cinza e Rosa
- Recursos: Bolso impermeável para calçados/roupas úmidas, saída USB para carregar celular, zíperes reforçados antifurto, tecido resistente à água
- Envio: Pronta entrega com estoque direto de São Paulo (SP) e postagem rápida em até 24h
- Preço e Oferta: MEGA DESCONTO EXCLUSIVO DE LIVE! REGRA CRÍTICA: NUNCA mencione valores em reais (R$). Cada comprador tem cupons, moedas e frete personalizados. Oriente sempre o cliente a tocar na Sacola Laranja (Produto 1) para resgatar o cupom de live e ver o valor final com desconto no carrinho!`,
      aiCooldown: 8, // segundos
      ntfyServer: 'https://ntfy.sh',
      ntfyTopic: 'shopee_live_' + Math.floor(1000 + Math.random() * 9000),
      notifyPurchases: true,
      notifyCart: true,
      notifyWatchdog: true,
      playChimes: true,
      timerRunning: false,
      timerEndTime: 0,
      ctaIntervalMin: 3,
      ctaEnabled: true,
      ctaMessages: [
        '🔥 Toque no Produto 1 na Sacola Laranja para resgatar seu Cupom Exclusivo de Live!',
        '🎒 Qual cor vocês preferem: Preto, Off-White, Cinza ou Rosa? Digitem aqui! 👇',
        '✈️ Padrão Cabine ANAC: viagem sem pagar taxa de despacho! Garanta a sua na Sacola Laranja.',
        '⚡ Envio Imediato em até 24h direto de São Paulo! Aproveite o frete grátis na sacola.',
        '💻 Cabe notebook de até 17.3" com bolso antifurto e saída USB. Confira no Produto 1! 🧡'
      ],
      ctaPinEnabled: true,
      // Interação Proativa & Fechamento de Carrinho (@usuario)
      proactiveCartEnabled: true,
      proactiveProductEntryEnabled: true,
      proactiveWelcomeEnabled: false, // Anti-spam: desligado por padrão
      proactiveCartCooldown: 20, // segundos entre mensagens de carrinho
      proactiveWelcomeCooldown: 60, // limite rígido de 60s para boas-vindas
      proactiveCartTemplates: [
        '{user} Vi que você garantiu na sacola! Aproveite o cupom da live + Frete Grátis antes de finalizar no carrinho 🛒✨',
        '{user} Ótima escolha! Nossa mochila tem envio rápido de SP em até 24h e garantia de 30 dias. Qualquer dúvida só chamar 👇',
        '{user} Dica: resgate o cupom exclusivo da live na Sacola Laranja para garantir o melhor desconto no seu pedido! 🎟️'
      ],
      proactiveWelcomeTemplates: [
        '{user} Seja bem-vindo(a)! Mochila Cabine ANAC 33L a 45L com cupom e Frete Grátis na Sacola Laranja 👇',
        '{user} Olá! Qualquer dúvida sobre medidas, notebook 17.3" ou envio em 24h é só mandar aqui no chat 😊'
      ]
    },
    stats: {
      questionsAnswered: 0,
      cartEvents: 0,
      purchasesDetected: 0,
      proactiveInteractions: 0,
      uptimeSeconds: 0
    },
    processedComments: new Map(), // key -> timestamp
    processedEvents: new Set(),
    lastAiReplyTime: 0,
    lastCtaTime: Date.now() - (2.5 * 60 * 1000), // Dispara primeiro CTA em ~30 segundos após carregar
    watchdogStallCounter: 0,
    lastVideoTime: -1,
    currentHostUser: ''
  };

  // --- Carregamento de Configurações ---
  function loadSettings() {
    chrome.storage.local.get(['shopeeCopilotConfig', 'shopeeCopilotStats'], res => {
      if (res.shopeeCopilotConfig) {
        state.config = { ...state.config, ...res.shopeeCopilotConfig };
      } else {
        saveSettings();
      }
      if (res.shopeeCopilotStats) {
        state.stats = { ...state.stats, ...res.shopeeCopilotStats };
      }
      updateFloatingWidget();
    });
  }

  function saveSettings() {
    chrome.storage.local.set({
      shopeeCopilotConfig: state.config,
      shopeeCopilotStats: state.stats
    });
  }

  // Ouvinte de alterações do Storage em tempo real
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.shopeeCopilotConfig) {
        state.config = { ...state.config, ...changes.shopeeCopilotConfig.newValue };
        updateFloatingWidget();
      }
      if (changes.shopeeCopilotStats) {
        state.stats = { ...state.stats, ...(changes.shopeeCopilotStats.newValue || {
          questionsAnswered: 0,
          cartEvents: 0,
          purchasesDetected: 0,
          proactiveInteractions: 0,
          uptimeSeconds: 0
        }) };
        updateFloatingWidget();
      }
    }
  });

  // Função para reiniciar todos os dados e contadores da sessão
  function resetAllSessionData() {
    state.stats = {
      questionsAnswered: 0,
      cartEvents: 0,
      purchasesDetected: 0,
      proactiveInteractions: 0,
      uptimeSeconds: 0
    };
    state.processedComments.clear();
    state.processedEvents.clear();
    userInteractedMap.clear();
    lastCartInteractionTime = 0;
    lastWelcomeInteractionTime = 0;
    state.lastAiReplyTime = 0;
    state.lastCtaTime = Date.now() - (2.5 * 60 * 1000);

    chrome.storage.local.set({
      shopeeCopilotStats: state.stats
    }, () => {
      updateFloatingWidget();
      logEvent('info', '🔄 Sessão Reiniciada', 'Todas as métricas da live foram zeradas com sucesso.');
      chrome.runtime.sendMessage({ type: 'UPDATE_STATS', payload: state.stats });
    });
  }

  // Ouvinte de mensagens diretas do Side Panel
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'RESET_ALL') {
      resetAllSessionData();
      if (sendResponse) sendResponse({ success: true });
    }
  });

  // --- Web Audio Chime Sintetizador (Sons Nativos sem dependência externa) ---
  let audioCtx = null;
  function playChime(type) {
    if (!state.config.playChimes) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === 'sale') {
        // Acorde alegre de venda: Do - Mi - Sol ascendente
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else {
        // Som sutil de sacolinha: Bi-tom suave
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      console.debug('[ShopeeCopilot] Audio chime error:', e);
    }
  }

  // --- Despacho de Push Notification ntfy ---
  function sendPushNotification(title, message, priority = 'high', tags = ['bell']) {
    chrome.runtime.sendMessage({
      type: 'SEND_NTFY',
      payload: {
        serverUrl: state.config.ntfyServer,
        topic: state.config.ntfyTopic,
        title,
        message,
        priority,
        tags
      }
    });
  }

  // --- Registro de Logs para a Interface ---
  function logEvent(type, title, detail) {
    const logItem = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      time: new Date().toLocaleTimeString('pt-BR'),
      type, // 'ai', 'cart', 'sale', 'watchdog', 'timer', 'cta'
      title,
      detail
    };

    chrome.runtime.sendMessage({
      type: 'LOG_EVENT',
      payload: logItem
    }).catch(() => {});

    // Salva histórico recente no storage (máximo 50 itens)
    chrome.storage.local.get(['shopeeCopilotLogs'], res => {
      const logs = res.shopeeCopilotLogs || [];
      logs.unshift(logItem);
      if (logs.length > 50) logs.pop();
      chrome.storage.local.set({ shopeeCopilotLogs: logs });
    });
  }

  // --- Utilitários de DOM da Shopee Live ---
  function getChatContainer() {
    return document.querySelector('.ReactVirtualized__Grid__innerScrollContainer') ||
           document.querySelector('.ReactVirtualized__List') ||
           document.querySelector('[class*="innerScrollContainer"]');
  }

  function getTextarea() {
    return document.querySelector('div[contenteditable="true"][role="textbox"]') ||
           document.querySelector('[class*="divTextarea_"]');
  }

  function getSendButton() {
    return document.querySelector('button[class*="send-btn_"]') ||
           document.querySelector('.send-btn_bc73b') ||
           document.querySelector('button.shopee-react-button--small');
  }

  function getPinCheckbox() {
    // 1. Procura label contendo "Marcar"
    const labels = Array.from(document.querySelectorAll('label.shopee-react-checkbox, label'));
    const pinLabel = labels.find(l => l.textContent && l.textContent.trim().includes('Marcar'));
    if (pinLabel) {
      const input = pinLabel.querySelector('input[type="checkbox"]');
      if (input) return input;
      return pinLabel;
    }
    // 2. Seletores alternativos
    return document.querySelector('#comment-pin input[type="checkbox"]') ||
           document.querySelector('.shopee-react-checkbox__input');
  }

  function getEndStreamButton() {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.includes('Finalizar Transmissão')) ||
           document.querySelector('button.shopee-react-button--danger');
  }

  // Detecta o nome do vendedor/host logado para não responder a si próprio
  function detectHostUser() {
    const userEl = document.querySelector('.user-info_c8e96, [class*="user-name_"], [class*="header_"]');
    if (userEl && userEl.textContent) {
      state.currentHostUser = userEl.textContent.trim().toLowerCase();
    }
  }

  // --- Proteção Inteligente de Digitação Manual ---
  function isUserCurrentlyTyping() {
    const textarea = getTextarea();
    if (!textarea) return false;
    // O apresentador só está digitando se estiver ativamente focado NO campo do chat E tiver rascunho de texto
    const isFocused = (document.activeElement === textarea);
    const textDraft = (textarea.textContent || textarea.innerText || '').trim();
    return isFocused && textDraft.length > 0;
  }

  // --- Digitação e Envio no Campo ContentEditable da Shopee ---
  function typeAndSendMessage(text, shouldPin = false, retryCount = 0) {
    // 1. Se o apresentador estiver focado no chat com rascunho, aguarda 2s e tenta novamente
    if (isUserCurrentlyTyping()) {
      if (retryCount < 3) {
        console.log(`[ShopeeCopilot] Apresentador digitando no chat. Aguardando 2s para tentar novamente (${retryCount + 1}/3)...`);
        setTimeout(() => typeAndSendMessage(text, shouldPin, retryCount + 1), 2000);
      }
      return false;
    }

    const textarea = getTextarea();
    const sendBtn = getSendButton();

    if (!textarea || !sendBtn) {
      console.warn('[ShopeeCopilot] Campo de texto ou botão de envio não encontrado.');
      return false;
    }

    try {
      // 2. Sincroniza o estado do checkbox "Marcar" (Fixar comentário)
      const pinEl = getPinCheckbox();
      if (pinEl) {
        const isCurrentlyChecked = pinEl.checked !== undefined ? pinEl.checked : pinEl.classList.contains('shopee-react-checkbox--checked');
        if (shouldPin && !isCurrentlyChecked) {
          pinEl.click();
        } else if (!shouldPin && isCurrentlyChecked) {
          pinEl.click();
        }
      }

      // 3. Foca no textarea contenteditable
      textarea.focus();

      // 4. Insere o texto via Selection + Range + execCommand
      try {
        const sel = window.getSelection();
        sel.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(textarea);
        sel.addRange(range);
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, text);
      } catch (e) {}

      // 5. Fallback direto caso o execCommand não tenha preenchido o DOM
      if (!textarea.textContent || textarea.textContent.trim() !== text.trim()) {
        textarea.textContent = text;
        textarea.innerText = text;
      }

      // 6. Dispara cadeia completa de eventos para o React atualizar o state interno e o contador
      try {
        textarea.dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: text, bubbles: true, cancelable: true }));
        textarea.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: text, bubbles: true }));
      } catch (e) {}

      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      textarea.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }));

      // 7. Dispara o envio após pequeno intervalo para o React processar
      setTimeout(() => {
        // A) Dispara eventos completos de Mouse no botão Enviar e no span interno
        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(eventType => {
          const mouseEv = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            buttons: 1
          });
          sendBtn.dispatchEvent(mouseEv);
          const span = sendBtn.querySelector('span');
          if (span) span.dispatchEvent(mouseEv);
        });
        sendBtn.click();

        // B) Dispara tecla Enter no textarea (comportamento nativo de envio do chat da Shopee)
        ['keydown', 'keypress', 'keyup'].forEach(eventType => {
          textarea.dispatchEvent(new KeyboardEvent(eventType, {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            charCode: 13,
            bubbles: true,
            cancelable: true
          }));
        });

        console.log(`[ShopeeCopilot] Disparo efetuado (Fixado=${shouldPin}): "${text.substring(0, 35)}..."`);

        // C) Verificação após 400ms: se o texto ainda persistir no textarea, reforça o clique de confirmação
        setTimeout(() => {
          const remainingText = (textarea.textContent || textarea.innerText || '').trim();
          if (remainingText.length > 0 && remainingText === text.trim()) {
            sendBtn.click();
            textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, which: 13, bubbles: true }));
          }
        }, 400);

      }, 250);

      return true;
    } catch (err) {
      console.error('[ShopeeCopilot] Erro ao digitar/enviar mensagem:', err);
      return false;
    }
  }

  // --- Sistema de Interação Proativa & Fechamento de Carrinho (@usuario) ---
  const userInteractedMap = new Map(); // username -> timestamp (deduplicação por 30min)
  let lastCartInteractionTime = 0;
  let lastWelcomeInteractionTime = 0;

  function formatProactiveTemplate(template, user, isMasked) {
    if (!template) return '';
    let res = template;

    if (isMasked || !user) {
      // Se mascarado pela Shopee com "...", remove {user} e mantém frase limpa e natural
      res = res.replace(/\{user\}/gi, '').trim();
      res = res.replace(/\s+/g, ' ');
      if (res.length > 0) {
        res = res.charAt(0).toUpperCase() + res.slice(1);
      }
    } else {
      const cleanAt = user.replace(/^@+/, '');
      res = res.replace(/\{user\}/gi, `@${cleanAt}`).trim();
      res = res.replace(/\s+/g, ' ');
    }

    if (res.length > 140) {
      res = res.substring(0, 137).trim() + '...';
    }
    return res;
  }

  function trySendProactiveMessage(type, rawUser, contextText) {
    if (isUserCurrentlyTyping()) {
      console.log('[ShopeeCopilot Proativo] Apresentador digitando. Interação pausada.');
      return false;
    }

    let cleanUser = (rawUser || '').replace(/^[^\w\d_.-]+/, '').trim();
    if (!cleanUser && contextText) {
      const m = contextText.trim().match(/^([^\s]+)/);
      if (m) cleanUser = m[1];
    }

    const isMasked = !cleanUser || cleanUser.includes('...') || cleanUser.endsWith('.');
    const userKey = cleanUser.toLowerCase();
    const now = Date.now();

    // Deduplicação por usuário: máximo 1 interação a cada 30 minutos por espectador
    if (!isMasked && userKey) {
      if (userInteractedMap.has(userKey)) {
        if (now - userInteractedMap.get(userKey) < 30 * 60 * 1000) {
          return false;
        }
      }
    }

    let selectedTemplate = '';

    if (type === 'cart' || type === 'sale') {
      if (!state.config.proactiveCartEnabled) return false;
      const cooldownMs = (state.config.proactiveCartCooldown || 20) * 1000;
      if (now - lastCartInteractionTime < cooldownMs) {
        return false;
      }

      const templates = state.config.proactiveCartTemplates || [];
      if (templates.length === 0) return false;

      selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
      lastCartInteractionTime = now;

    } else if (type === 'product_entry' || type === 'welcome') {
      if (type === 'product_entry' && !state.config.proactiveProductEntryEnabled) return false;
      if (type === 'welcome' && !state.config.proactiveWelcomeEnabled) return false;

      const cooldownMs = (state.config.proactiveWelcomeCooldown || 60) * 1000;
      if (now - lastWelcomeInteractionTime < cooldownMs) {
        return false;
      }

      const templates = state.config.proactiveWelcomeTemplates || [];
      if (templates.length === 0) return false;

      selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
      lastWelcomeInteractionTime = now;
    }

    if (!selectedTemplate) return false;

    const finalMessage = formatProactiveTemplate(selectedTemplate, cleanUser, isMasked);
    if (!finalMessage) return false;

    const sent = typeAndSendMessage(finalMessage, false);
    if (sent) {
      if (!isMasked && userKey) {
        userInteractedMap.set(userKey, now);
        if (userInteractedMap.size > 1000) {
          const oldest = Array.from(userInteractedMap.keys()).slice(0, 200);
          oldest.forEach(k => userInteractedMap.delete(k));
        }
      }

      state.stats.proactiveInteractions = (state.stats.proactiveInteractions || 0) + 1;
      saveSettings();
      updateFloatingWidget();

      logEvent('proactive', `🎯 Interação Proativa (${type.toUpperCase()})`, finalMessage);
      return true;
    }
    return false;
  }

  // --- Filtro de Dúvidas de Compra ---
  function isPurchaseQuestion(text) {
    if (!text || typeof text !== 'string') return false;
    const clean = text.toLowerCase().trim();

    // Se contiver interrogação, é pergunta direta
    if (clean.includes('?')) return true;

    // Palavras-chave de intenção de compra e dúvidas de produto
    const intentRegex = /\b(tem|qual|quais|tamanho|cor|cores|cabe|notebook|laptop|litros|capacidade|medida|medidas|peso|dimens[oõ]es|bordo|anac|viagem|mala|imperme[aá]vel|chuva|resistente|garantia|prazo|envio|entrega|s[aã]o paulo|sp|brasil|cupom|desconto|pre[cç]o|valor|pix|sacola|produto|promo[cç][aã]o|preta|branca|rosa|cinza)\b/i;
    return intentRegex.test(clean);
  }

  // --- Processamento de Comentários em Tempo Real ---
  async function processCommentElement(el) {
    // 1. Ignora mensagens de sistema (entrou/entraram) e itens destacados de entrada
    if (el.querySelector('[class*="highlight-item_"]') ||
        el.getAttribute('data-comment-id') === 'false' ||
        (el.textContent && /e \d+ entraram!|entrou!/i.test(el.textContent))) {
      return;
    }

    // 2. Identifica Autor e Mensagem
    const authorEl = el.querySelector('[class*="user-name_"], .user-name_2fad3');
    const msgEl = el.querySelector('[class*="message-content_"], .message-content_3bb92');

    if (!authorEl || !msgEl) return;

    const author = authorEl.textContent.trim();
    const message = msgEl.textContent.trim();
    const commentId = el.getAttribute('data-comment-id') || (author + '_' + message);

    // 3. Deduplicação com cache de memória (evita duplicar ao rolar a lista virtualizada)
    const now = Date.now();
    if (state.processedComments.has(commentId)) {
      return;
    }
    state.processedComments.set(commentId, now);

    // Limpa cache se ultrapassar 500 itens
    if (state.processedComments.size > 500) {
      const oldestKeys = Array.from(state.processedComments.keys()).slice(0, 100);
      oldestKeys.forEach(k => state.processedComments.delete(k));
    }

    // 4. Ignora se for o próprio apresentador falando (tem selo Apresentador ou usuário idêntico)
    const isHostMessage = !!el.querySelector('[class*="host"], [class*="anchor"], [class*="seller"]') ||
                          (el.textContent && el.textContent.includes('Apresentador')) ||
                          (state.currentHostUser && author.toLowerCase() === state.currentHostUser);
    if (isHostMessage) {
      return;
    }

    // 5. Verifica se é um evento de Comércio (Compra ou Sacola)
    const lowerMsg = message.toLowerCase();
    const fullText = (el.textContent || '').toLowerCase();

    // Evento de Compra
    if (lowerMsg.includes('comprou') || fullText.includes('comprou') || fullText.includes('finalizou a compra')) {
      handleCommerceEvent('sale', author, message);
      trySendProactiveMessage('sale', author, message);
      return;
    }

    // Evento de Sacolinha / Carrinho
    if (lowerMsg.includes('adicionou') || lowerMsg.includes('carrinho') || lowerMsg.includes('sacola') || fullText.includes('está comprando')) {
      handleCommerceEvent('cart', author, message);
      trySendProactiveMessage('cart', author, message);
      return;
    }

    // 6. Se a IA estiver desativada, encerra por aqui
    if (!state.config.aiEnabled) return;

    // 7. Filtra apenas perguntas reais ou dúvidas de compra
    if (!isPurchaseQuestion(message)) {
      return;
    }

    // 8. Respeita Cooldown entre respostas automáticas
    const cooldownMs = (state.config.aiCooldown || 8) * 1000;
    if (now - state.lastAiReplyTime < cooldownMs) {
      console.log(`[ShopeeCopilot AI] Cooldown ativo. Aguardando intervalo de segurança (${state.config.aiCooldown}s).`);
      return;
    }

    console.log(`[ShopeeCopilot AI] Dúvida detectada de @${author}: "${message}"`);
    state.lastAiReplyTime = now;

    // 9. Chama a IA Gemini
    if (window.ShopeeLiveAI && window.ShopeeLiveAI.generateAnswer) {
      const answer = await window.ShopeeLiveAI.generateAnswer({
        apiKey: state.config.geminiApiKey,
        modelName: state.config.geminiModel,
        systemPrompt: state.config.systemPrompt,
        productContext: state.config.productContext,
        author,
        question: message
      });

      if (answer) {
        const fullResponse = `@${author} ${answer}`.substring(0, 145);
        typeAndSendMessage(fullResponse, false);

        state.stats.questionsAnswered++;
        saveSettings();
        updateFloatingWidget();

        logEvent('ai', `Resposta IA para @${author}`, `P: "${message}" ➔ R: "${answer}"`);
      }
    }
  }

  // --- Manipulação de Eventos de Conversão (Compra / Sacola) ---
  function handleCommerceEvent(type, user, details) {
    const eventKey = `${type}_${user}_${details.substring(0, 20)}`;
    if (state.processedEvents.has(eventKey)) return;
    state.processedEvents.add(eventKey);

    if (type === 'sale') {
      state.stats.purchasesDetected++;
      playChime('sale');
      logEvent('sale', `🎉 NOVA COMPRA CONFIRMADA!`, `@${user}: ${details}`);

      if (state.config.notifyPurchases) {
        sendPushNotification(
          '💰 NOVA VENDA NA SHOPEE LIVE!',
          `O comprador @${user} acabou de finalizar a compra da live!`,
          'urgent',
          ['moneybag', 'partying_face', 'tada']
        );
      }
    } else {
      state.stats.cartEvents++;
      playChime('cart');
      logEvent('cart', `🛒 Item Adicionado à Sacola`, `@${user}: ${details}`);

      if (state.config.notifyCart) {
        sendPushNotification(
          '🛒 PRODUTO NA SACOLA!',
          `O espectador @${user} adicionou um produto ao carrinho!`,
          'high',
          ['shopping_cart', 'fire']
        );
      }
    }

    saveSettings();
    updateFloatingWidget();
  }

  // --- Watchdog da Transmissão (Monitor de Saúde de Vídeo) ---
  function checkStreamHealth() {
    if (!state.config.notifyWatchdog) return;

    const video = document.querySelector('#ls-pc-tx-video-player video');
    const loadingSpinner = document.querySelector('#ls-pc-tx-video-player .splayer-global-loading');

    if (!video) return;

    const isStalled = video.paused || video.readyState < 2 || (loadingSpinner && loadingSpinner.offsetParent !== null);
    const timeUnchanged = video.currentTime === state.lastVideoTime && !video.paused;

    if (isStalled || timeUnchanged) {
      state.watchdogStallCounter += 5;
      if (state.watchdogStallCounter >= 30) {
        // Mais de 30 segundos travado!
        console.warn('[ShopeeCopilot Watchdog] Stream estagnada por mais de 30s!');
        logEvent('watchdog', '⚠️ ALERTA DE QUEDA DE STREAM', 'O player de transmissão da Shopee parece travado ou desconectado.');
        sendPushNotification(
          '⚠️ ALERTA: TRANSMISSÃO SHOPEE TRAVOU!',
          'A transmissão ao vivo no OBS ou na Shopee está travada há mais de 30 segundos! Verifique o OBS agora.',
          'urgent',
          ['warning', 'rotating_light', 'sos']
        );
        state.watchdogStallCounter = 0; // Evita loop contínuo de alertas
      }
    } else {
      state.watchdogStallCounter = 0;
    }

    state.lastVideoTime = video.currentTime;
  }

  // --- Timer Programado para Encerramento da Live ---
  function checkScheduledTimer() {
    if (!state.config.timerRunning || !state.config.timerEndTime) return;

    const now = Date.now();
    if (now >= state.config.timerEndTime) {
      state.config.timerRunning = false;
      saveSettings();
      updateFloatingWidget();

      console.log('[ShopeeCopilot Timer] Tempo esgotado! Finalizando transmissão automaticamente...');
      logEvent('timer', '⏱️ Timer Esgotado', 'Encerrando live automaticamente conforme programado.');

      const endBtn = getEndStreamButton();
      if (endBtn) {
        endBtn.click();

        // Aguarda a abertura do modal de confirmação
        setTimeout(() => {
          const confirmBtn = document.querySelector('.shopee-react-modal button.shopee-react-button--danger, .shopee-react-dialog button.shopee-react-button--danger, .shopee-react-modal button.shopee-react-button--primary');
          if (confirmBtn) {
            confirmBtn.click();
            console.log('[ShopeeCopilot Timer] Confirmação de encerramento efetuada com sucesso!');
          }
        }, 600);

        sendPushNotification(
          '🛑 LIVE ENCERRADA PELO TIMER',
          'A sua transmissão na Shopee Live foi finalizada automaticamente pelo Shopee Live Copilot conforme o timer programado.',
          'high',
          ['stop_sign', 'check']
        );
      }
    }
  }

  // --- Disparo Periódico de Mensagens de CTA ---
  function checkPeriodicCta() {
    if (!state.config.ctaEnabled || !state.config.ctaMessages || state.config.ctaMessages.length === 0) return;

    const intervalMs = (state.config.ctaIntervalMin || 10) * 60 * 1000;
    const now = Date.now();

    if (now - state.lastCtaTime >= intervalMs) {
      state.lastCtaTime = now;
      const msgIndex = Math.floor(Math.random() * state.config.ctaMessages.length);
      const ctaMsg = state.config.ctaMessages[msgIndex];

      if (ctaMsg) {
        typeAndSendMessage(ctaMsg, state.config.ctaPinEnabled);
        logEvent('cta', '📢 CTA Automático Enviado', ctaMsg);
      }
    }
  }

  // --- Processamento de Notificações Destacadas (Destaques/Sistema/Entrada/Sacola) ---
  function processHighlightElement(el) {
    const text = (el.textContent || '').trim();
    if (!text) return;

    const eventKey = 'hl_' + text;
    if (state.processedEvents.has(eventKey)) return;
    state.processedEvents.add(eventKey);

    if (state.processedEvents.size > 500) {
      const oldestKeys = Array.from(state.processedEvents.keys()).slice(0, 100);
      oldestKeys.forEach(k => state.processedEvents.delete(k));
    }

    const lower = text.toLowerCase();
    let user = '';
    const firstWordMatch = text.match(/^([^\s]+)/);
    if (firstWordMatch) user = firstWordMatch[1];

    // 1. Compra Detectada
    if (lower.includes('comprou') || lower.includes('compra realizada')) {
      handleCommerceEvent('sale', user, text);
      trySendProactiveMessage('sale', user, text);
      return;
    }

    // 2. Carrinho / Sacola Detectada
    if (lower.includes('adicionou') || lower.includes('carrinho') || lower.includes('sacola') || lower.includes('está comprando') || lower.includes('esta comprando')) {
      handleCommerceEvent('cart', user, text);
      trySendProactiveMessage('cart', user, text);
      return;
    }

    // 3. Entrada Direta pelo Produto (ex: "entrou na live por N° 1")
    const isFromItemAttr = el.getAttribute('data-is-from-item') === 'true' || !!el.closest('[data-is-from-item="true"]');
    if (lower.includes('entrou na live por') || isFromItemAttr) {
      trySendProactiveMessage('product_entry', user, text);
      return;
    }

    // 4. Entrada Comum (entrou! / entraram!)
    if (lower.includes('entrou!') || lower.includes('entraram!')) {
      trySendProactiveMessage('welcome', user, text);
      return;
    }
  }

  // --- Distribuidor Central de Elementos do Chat Virtualizado ---
  function processElement(el) {
    if (!el || el.nodeType !== 1) return;

    const isHighlight = el.classList.contains('highlight-item_246ff') ||
                        !!el.querySelector('[class*="highlight-item_"]') ||
                        el.getAttribute('data-comment-id') === 'false' ||
                        (el.textContent && /entrou!|entraram!|comprando|ao carrinho/i.test(el.textContent));

    if (isHighlight) {
      processHighlightElement(el);
      return;
    }

    processCommentElement(el);
  }

  // --- Widget Flutuante Compacto na Tela da Shopee Live ---
  let widgetEl = null;
  function createFloatingWidget() {
    if (document.getElementById('shopee-copilot-floating-widget')) return;

    widgetEl = document.createElement('div');
    widgetEl.id = 'shopee-copilot-floating-widget';
    widgetEl.innerHTML = `
      <div class="sc-badge">
        <span class="sc-dot"></span>
        <span class="sc-title">Shopee Copilot</span>
        <span class="sc-timer" id="sc-pill-timer">--:--</span>
        <span class="sc-metric" title="Itens na Sacola">🛒 <b id="sc-pill-cart">0</b></span>
        <span class="sc-metric" title="Vendas">💰 <b id="sc-pill-sales">0</b></span>
        <span class="sc-metric" title="Respostas IA">🤖 <b id="sc-pill-ai">0</b></span>
        <span class="sc-metric" title="Interações Proativas">🎯 <b id="sc-pill-proactive">0</b></span>
        <button type="button" class="sc-btn-reset" id="sc-btn-reset-session" title="Zerar métricas para nova live">🔄</button>
      </div>
    `;
    document.body.appendChild(widgetEl);

    const btnResetFloat = widgetEl.querySelector('#sc-btn-reset-session');
    if (btnResetFloat) {
      btnResetFloat.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('⚠️ Deseja zerar todas as métricas e contadores de sacola para iniciar uma nova live?')) {
          resetAllSessionData();
        }
      });
    }
    updateFloatingWidget();
  }

  function updateFloatingWidget() {
    if (!widgetEl) widgetEl = document.getElementById('shopee-copilot-floating-widget');
    if (!widgetEl) return;

    const dot = widgetEl.querySelector('.sc-dot');
    if (dot) {
      dot.className = state.config.aiEnabled ? 'sc-dot sc-dot-active' : 'sc-dot sc-dot-inactive';
    }

    const timerPill = widgetEl.querySelector('#sc-pill-timer');
    if (timerPill) {
      if (state.config.timerRunning && state.config.timerEndTime > Date.now()) {
        const diffSec = Math.floor((state.config.timerEndTime - Date.now()) / 1000);
        const m = Math.floor(diffSec / 60);
        const s = diffSec % 60;
        timerPill.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        timerPill.style.display = 'inline-block';
      } else {
        timerPill.style.display = 'none';
      }
    }

    const cartPill = widgetEl.querySelector('#sc-pill-cart');
    if (cartPill) cartPill.textContent = state.stats.cartEvents;

    const salesPill = widgetEl.querySelector('#sc-pill-sales');
    if (salesPill) salesPill.textContent = state.stats.purchasesDetected;

    const aiPill = widgetEl.querySelector('#sc-pill-ai');
    if (aiPill) aiPill.textContent = state.stats.questionsAnswered;

    const proactivePill = widgetEl.querySelector('#sc-pill-proactive');
    if (proactivePill) proactivePill.textContent = state.stats.proactiveInteractions || 0;
  }

  // --- MutationObserver para o Chat Virtualizado ---
  let chatObserver = null;
  function startChatMonitoring() {
    const container = getChatContainer();
    if (!container) {
      console.log('[ShopeeCopilot] Aguardando container de chat carregar...');
      setTimeout(startChatMonitoring, 1500);
      return;
    }

    if (chatObserver) chatObserver.disconnect();

    console.log('[ShopeeCopilot] Conectando MutationObserver ao chat da Shopee Live!');

    // Processa itens já presentes inicialmente
    container.childNodes.forEach(child => {
      if (child.nodeType === 1) processElement(child);
    });

    chatObserver = new MutationObserver(mutations => {
      mutations.forEach(mut => {
        mut.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            processElement(node);
          }
        });
      });
    });

    chatObserver.observe(container, {
      childList: true,
      subtree: true
    });
  }

  // --- Loop de Intervalos Regulares (Timer, Watchdog, CTA) ---
  setInterval(() => {
    checkScheduledTimer();
    checkStreamHealth();
    checkPeriodicCta();
    detectHostUser();
    updateFloatingWidget();
  }, 1000);

  // Inicialização geral após carregamento do DOM
  window.addEventListener('load', () => {
    loadSettings();
    detectHostUser();
    createFloatingWidget();
    startChatMonitoring();
  });

  // Fallback caso o evento load já tenha passado
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadSettings();
    detectHostUser();
    createFloatingWidget();
    startChatMonitoring();
  }
})();
