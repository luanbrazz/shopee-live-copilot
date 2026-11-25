// ========================================================================
// SHOPEE LIVE COPILOT — Side Panel Script (sidepanel.js)
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos de Interface ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Stats Header
  const statAiCount = document.getElementById('statAiCount');
  const statCartCount = document.getElementById('statCartCount');
  const statSalesCount = document.getElementById('statSalesCount');
  const statProactiveCount = document.getElementById('statProactiveCount');
  const btnResetAll = document.getElementById('btnResetAll');

  // Tab IA
  const aiEnabled = document.getElementById('aiEnabled');
  const geminiApiKey = document.getElementById('geminiApiKey');
  const btnToggleApiKey = document.getElementById('btnToggleApiKey');
  const geminiModel = document.getElementById('geminiModel');
  const aiCooldown = document.getElementById('aiCooldown');
  const productContext = document.getElementById('productContext');
  const btnResetContext = document.getElementById('btnResetContext');
  const systemPrompt = document.getElementById('systemPrompt');

  // Tab Notificações
  const ntfyServer = document.getElementById('ntfyServer');
  const ntfyTopic = document.getElementById('ntfyTopic');
  const btnGenerateTopic = document.getElementById('btnGenerateTopic');
  const btnTestNtfy = document.getElementById('btnTestNtfy');
  const notifyPurchases = document.getElementById('notifyPurchases');
  const notifyCart = document.getElementById('notifyCart');
  const notifyWatchdog = document.getElementById('notifyWatchdog');
  const playChimes = document.getElementById('playChimes');

  // Tab Interação & Timer
  const proactiveCartEnabled = document.getElementById('proactiveCartEnabled');
  const proactiveWelcomeEnabled = document.getElementById('proactiveWelcomeEnabled');
  const proactiveCartCooldown = document.getElementById('proactiveCartCooldown');
  const proactiveWelcomeCooldown = document.getElementById('proactiveWelcomeCooldown');
  const proactiveCartTemplates = document.getElementById('proactiveCartTemplates');
  const proactiveWelcomeTemplates = document.getElementById('proactiveWelcomeTemplates');
  const btnResetCartTemplates = document.getElementById('btnResetCartTemplates');
  const btnResetWelcomeTemplates = document.getElementById('btnResetWelcomeTemplates');

  // Tab Timer & CTA
  const timerDigits = document.getElementById('timerDigits');
  const timerStatusLabel = document.getElementById('timerStatusLabel');
  const timerMinutes = document.getElementById('timerMinutes');
  const btnStartTimer = document.getElementById('btnStartTimer');
  const btnCancelTimer = document.getElementById('btnCancelTimer');
  const ctaEnabled = document.getElementById('ctaEnabled');
  const ctaIntervalMin = document.getElementById('ctaIntervalMin');
  const ctaPinEnabled = document.getElementById('ctaPinEnabled');
  const ctaMessages = document.getElementById('ctaMessages');
  const btnResetCtaMessages = document.getElementById('btnResetCtaMessages');

  // Tab Logs
  const logsList = document.getElementById('logsList');
  const btnClearLogs = document.getElementById('btnClearLogs');

  // Footer
  const saveStatus = document.getElementById('saveStatus');
  const btnForceSave = document.getElementById('btnForceSave');

  // --- Contexto Padrão da Mochila Romantic Crown 42L/45L Shopee (Ultra Robusto) ---
  const DEFAULT_PRODUCT_CONTEXT = `PRODUTO PRINCIPAL DA LIVE (ROMANTIC CROWN ORIGINAL):
- Nome Oficial: Mochila de Viagem Expansível Executiva Romantic Crown (Mochila Mala 45L Cabine ANAC).
- Reputação: Nota 5.0 estrelas, mais de 55 mil avaliações positivas e mais de 100 mil unidades vendidas!
- Padrão Cabine ANAC (Mala de Bordo): Medidas 45 x 32 x 22 cm (expandida) e 45 x 32 x 12 cm (compacta). 100% aprovada para viajar a bordo de avião como bagagem de mão/cabine sem pagar taxa de despacho! Cabe no bagageiro superior e abaixo do assento.
- Capacidade Expansível: De 33L para 45L pelo zíper expansor (+10cm de profundidade). Super espaçosa para roupas de 3 a 5 dias de viagem.
- Cores Disponíveis: Preto, Branco (Off-White), Cinza e Rosa. Todas a pronta entrega na Sacola Laranja.
- Compartimento para Notebook: Bolso acolchoado especial para notebook de até 17,3 polegadas e tablet/iPad, com trava de segurança elástica.
- Porta USB Externa: Conector USB lateral para carregar celular na rua (acompanha cabo interno para plugar no powerbank).
- Impermeabilidade e Material: Tecido Poliéster Oxford premium impermeável resistente à chuva, respingos e arranhões. Zíperes duplos de metal reforçados.
- Abertura 180° Estilo Mala: Abre completamente como mala de viagem para arrumar roupas com facilidade e passar no raio-X de aeroportos.
- Alça para Mala de Rodinhas: Faixa traseira resistente para acoplar no puxador da mala de viagem.
- Bolso Antifurto: Bolso oculto nas costas com zíper seguro para guardar passaporte, celular, carteira e dinheiro.
- Conforto Ergonômico: Costas e alças acolchoadas com tecido respirável antitranspirante (malha aerada) que alivia o peso nos ombros.
- Divisórias Internas: Bolsos organizadores para cabos, canetas, documentos e bolso impermeável para itens úmidos ou necessaire.
- Público e Uso: Unissex (masculino e feminino). Perfeita para trabalho executivo, faculdade, viagens de avião, negócios e passeios.
- Origem e Envio: Estoque próprio a pronta entrega no Brasil, envio ultra-rápido direto de São Paulo (SP) em até 24 horas úteis.
- Garantia: 30 dias de garantia do vendedor contra qualquer defeito + Garantia Shopee de recebimento seguro.
- REGRA CRÍTICA DE PREÇO: NUNCA informe valores fixos em R$. Oriente sempre o cliente a abrir a Sacola Laranja (Produto 1) para resgatar o Cupom Exclusivo da Live + Frete Grátis e ver o valor final com desconto no carrinho!`;

  // --- Templates Padrão de Interação Proativa ---
  const DEFAULT_CART_TEMPLATES = [
    '{user} Vi que você garantiu na sacola! Aproveite o cupom da live + Frete Grátis antes de finalizar no carrinho 🛒✨',
    '{user} Ótima escolha! Nossa mochila tem envio rápido de SP em até 24h e garantia de 30 dias. Qualquer dúvida só chamar 👇',
    '{user} Dica: resgate o cupom exclusivo da live na Sacola Laranja para garantir o melhor desconto no seu pedido! 🎟️',
    '{user} Parabéns pela escolha! A Romantic Crown original tem abertura 180° estilo mala e bolso antifurto ✈️',
    '{user} Excelente decisão! Lembre-se de conferir a cor escolhida e aplicar o cupom antes que o lote da live esgote ⏳',
    '{user} Vi que colocou no carrinho! Essa mochila não paga despacho na ANAC e protege notebook de até 17.3" 💻🧡',
    '{user} Show de bola! Qualquer dúvida sobre prazo de entrega ou medidas estamos ao vivo para te ajudar! 😊',
    '{user} Aproveite que estamos ao vivo para garantir com o cupom de frete grátis liberado na sacola! 🛍️'
  ];

  const DEFAULT_WELCOME_TEMPLATES = [
    '{user} Seja muito bem-vindo(a)! Mochila Cabine ANAC 33L a 45L com cupom na Sacola Laranja 👇',
    '{user} Olá! Qualquer dúvida sobre medidas, cores ou notebook 17.3" é só mandar aqui no chat 😊',
    '{user} Bem-vindo(a) à nossa live! Aproveite o frete grátis e o cupom exclusivo no Produto 1 🧡',
    '{user} Oi! Estamos mostrando a Mochila Mala Romantic Crown original. Dúvidas sobre envio ou tecido só chamar!',
    '{user} Seja bem-vindo(a)! Chegou na melhor hora: cupons da live liberados na Sacola Laranja 🎟️✨',
    '{user} Olá! Procurando mochila para viagem ou trabalho? Essa cabe notebook até 17.3" e não paga despacho de bordo ✈️',
    '{user} Bem-vindo(a)! Nossas 4 cores (Preto, Off-White, Cinza e Rosa) têm envio rápido em 24h de SP 🚚',
    '{user} Oi! Fique à vontade para perguntar qualquer detalhe da mochila aqui no chat, respondemos na hora! 👇'
  ];

  // --- Mensagens Periódicas (CTA) Padrão com Variedade ---
  const DEFAULT_CTA_MESSAGES = [
    '🔥 Toque no Produto 1 na Sacola Laranja para resgatar seu Cupom Exclusivo de Live + Frete Grátis!',
    '✈️ Padrão Cabine ANAC: viaje a bordo sem pagar taxa de despacho! Garanta a sua na Sacola Laranja 🎒',
    '💻 Bolso acolchoado para Notebook de até 17.3", saída USB e tecido impermeável! Confira no Produto 1 👇',
    '🎒 Qual cor você mais gostou: Preto, Branco (Off-White), Cinza ou Rosa? Digite aqui no chat! 😊',
    '⚡ Envio Imediato em até 24h direto de São Paulo para todo o Brasil! Aproveite o estoque a pronta entrega 🚚',
    '🔒 Segurança total: Bolso secreto antifurto nas costas e abertura 180° estilo mala de viagem! Veja na sacola 🧡',
    '⭐ Mais de 100 mil mochilas vendidas com nota 5.0! Qualidade comprovada e garantia de 30 dias ✨',
    '🎟️ Dica de ouro: resgate o cupom da live agora mesmo tocando no card do Produto 1 antes de acabar o estoque!',
    '🌧️ 100% Impermeável e resistente a arranhões! Protege seu notebook e roupas em qualquer viagem ✈️',
    '💼 Ideal para trabalho, faculdade e viagens: expande de 33L para 45L em segundos no zíper expansor!',
    '🛍️ Quem já garantiu a sua na Sacola Laranja avisa aqui no chat pra gente comemorar com vocês! 🎉',
    '⏳ Cupons de Frete Grátis liberados por tempo limitado na live! Não esqueça de aplicar no carrinho antes de finalizar 🛒'
  ];

  // Restaurar Templates de Carrinho
  if (btnResetCartTemplates) {
    btnResetCartTemplates.addEventListener('click', () => {
      proactiveCartTemplates.value = DEFAULT_CART_TEMPLATES.join('\n');
      if (proactiveCartEnabled) proactiveCartEnabled.checked = true;
      if (proactiveCartCooldown) proactiveCartCooldown.value = 20;
      triggerSave();
      showSaveToast('🛒 Fechamento de Carrinho restaurado para o padrão completo (Ativado, 20s).');
    });
  }

  // Restaurar Templates de Boas-Vindas
  if (btnResetWelcomeTemplates) {
    btnResetWelcomeTemplates.addEventListener('click', () => {
      proactiveWelcomeTemplates.value = DEFAULT_WELCOME_TEMPLATES.join('\n');
      if (proactiveWelcomeEnabled) proactiveWelcomeEnabled.checked = false;
      if (proactiveWelcomeCooldown) proactiveWelcomeCooldown.value = 60;
      triggerSave();
      showSaveToast('👋 Boas-Vindas restauradas para o padrão completo (Desativado, 60s).');
    });
  }

  // Restaurar Mensagens de CTA
  if (btnResetCtaMessages) {
    btnResetCtaMessages.addEventListener('click', () => {
      ctaMessages.value = DEFAULT_CTA_MESSAGES.join('\n');
      triggerSave();
      showSaveToast('📢 Mensagens de CTA restauradas para o padrão completo!');
    });
  }

  // --- Navegação por Abas ---
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetTab);
      if (targetPane) targetPane.classList.add('active');

      // Ao abrir a aba de logs, força recarregamento imediato do storage
      if (targetTab === 'tab-logs') {
        chrome.storage.local.get(['shopeeCopilotLogs'], res => {
          renderLogs(res.shopeeCopilotLogs || []);
        });
      }
    });
  });

  // Atualização em primeiro plano ao focar no sidepanel
  window.addEventListener('focus', () => {
    chrome.storage.local.get(['shopeeCopilotStats', 'shopeeCopilotLogs'], res => {
      if (res.shopeeCopilotStats) updateStatsUI(res.shopeeCopilotStats);
      if (res.shopeeCopilotLogs) renderLogs(res.shopeeCopilotLogs);
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      chrome.storage.local.get(['shopeeCopilotStats', 'shopeeCopilotLogs'], res => {
        if (res.shopeeCopilotStats) updateStatsUI(res.shopeeCopilotStats);
        if (res.shopeeCopilotLogs) renderLogs(res.shopeeCopilotLogs);
      });
    }
  });

  // Alternar Visibilidade da API Key
  btnToggleApiKey.addEventListener('click', () => {
    geminiApiKey.type = geminiApiKey.type === 'password' ? 'text' : 'password';
  });

  // Restaurar Contexto da Mochila
  btnResetContext.addEventListener('click', () => {
    productContext.value = DEFAULT_PRODUCT_CONTEXT;
    triggerSave();
  });

  // Gerar Tópico Aleatório ntfy
  btnGenerateTopic.addEventListener('click', () => {
    const randomTopic = 'shopee_live_' + Math.floor(100000 + Math.random() * 900000);
    ntfyTopic.value = randomTopic;
    triggerSave();
  });

  // Testar Notificação ntfy
  btnTestNtfy.addEventListener('click', async () => {
    const topic = ntfyTopic.value.trim();
    if (!topic) {
      alert('Por favor, informe ou gere um nome de tópico para o ntfy primeiro.');
      return;
    }

    btnTestNtfy.disabled = true;
    btnTestNtfy.textContent = '⏳ Enviando notificação...';

    chrome.runtime.sendMessage({
      type: 'SEND_NTFY',
      payload: {
        serverUrl: ntfyServer.value.trim() || 'https://ntfy.sh',
        topic: topic,
        title: '🔔 Teste Shopee Live Copilot',
        message: 'Conexão confirmada! Você receberá alertas de compras e sacolinha aqui instantaneamente.',
        priority: 'high',
        tags: ['white_check_mark', 'bell', 'rocket']
      }
    }, res => {
      btnTestNtfy.disabled = false;
      btnTestNtfy.textContent = '🔔 Disparar Notificação de Teste no Celular';

      if (res && res.success) {
        showSaveToast('✅ Notificação de teste enviada com sucesso ao tópico ' + topic + '!');
      } else {
        alert('Erro ao enviar notificação. Verifique sua conexão com a internet ou o servidor ntfy.');
      }
    });
  });

  // --- Carregamento de Configurações ---
  function loadAllData() {
    chrome.storage.local.get(['shopeeCopilotConfig', 'shopeeCopilotStats', 'shopeeCopilotLogs'], res => {
      let cfg = res.shopeeCopilotConfig || {};
      const stats = res.shopeeCopilotStats || {};
      const logs = res.shopeeCopilotLogs || [];

      // Migração automática de contexto e templates mais robustos
      let needsResave = false;
      if (!cfg.productContext || !cfg.productContext.includes('Reputação: Nota 5.0') || cfg.productContext.includes('R$ 94,99')) {
        cfg.productContext = DEFAULT_PRODUCT_CONTEXT;
        needsResave = true;
      }
      if (!Array.isArray(cfg.ctaMessages) || cfg.ctaMessages.length < 5) {
        cfg.ctaMessages = DEFAULT_CTA_MESSAGES;
        needsResave = true;
      }
      if (!Array.isArray(cfg.proactiveWelcomeTemplates) || cfg.proactiveWelcomeTemplates.length < 5) {
        cfg.proactiveWelcomeTemplates = DEFAULT_WELCOME_TEMPLATES;
        needsResave = true;
      }
      if (!Array.isArray(cfg.proactiveCartTemplates) || cfg.proactiveCartTemplates.length < 5) {
        cfg.proactiveCartTemplates = DEFAULT_CART_TEMPLATES;
        needsResave = true;
      }
      if (!cfg.geminiModel || cfg.geminiModel === 'gemini-2.5-flash-lite') {
        cfg.geminiModel = 'gemini-flash-lite-latest';
        needsResave = true;
      }
      if (cfg.ctaEnabled === undefined) {
        cfg.ctaEnabled = true;
        needsResave = true;
      }
      if (!cfg.ctaIntervalMin || cfg.ctaIntervalMin === 3) {
        cfg.ctaIntervalMin = 10;
        needsResave = true;
      }
      if (cfg.proactiveWelcomeEnabled === undefined) {
        cfg.proactiveWelcomeEnabled = false;
        needsResave = true;
      }
      if (cfg.proactiveCartEnabled === undefined) {
        cfg.proactiveCartEnabled = true;
        needsResave = true;
      }
      if (cfg.proactiveCartCooldown === undefined) {
        cfg.proactiveCartCooldown = 20;
        needsResave = true;
      }
      if (cfg.proactiveWelcomeCooldown === undefined) {
        cfg.proactiveWelcomeCooldown = 60;
        needsResave = true;
      }

      // Recupera chave de API: storage local > env.js local
      const localEnvKey = (typeof window !== 'undefined' && window.__ENV_GEMINI_KEY__) || '';
      if (!cfg.geminiApiKey && localEnvKey) {
        cfg.geminiApiKey = localEnvKey;
        needsResave = true;
      }

      if (needsResave) {
        chrome.storage.local.set({ shopeeCopilotConfig: cfg });
      }

      // Popula campos
      aiEnabled.checked = cfg.aiEnabled !== false;
      geminiApiKey.value = cfg.geminiApiKey || localEnvKey || '';
      geminiModel.value = cfg.geminiModel || 'gemini-flash-lite-latest';
      aiCooldown.value = cfg.aiCooldown || 8;
      productContext.value = cfg.productContext || DEFAULT_PRODUCT_CONTEXT;
      systemPrompt.value = cfg.systemPrompt || 'Seja simpática, rápida, persuasiva e direta ao ponto.';

      ntfyServer.value = cfg.ntfyServer || 'https://ntfy.sh';
      ntfyTopic.value = cfg.ntfyTopic || ('shopee_live_' + Math.floor(1000 + Math.random() * 9000));
      notifyPurchases.checked = cfg.notifyPurchases !== false;
      notifyCart.checked = cfg.notifyCart !== false;
      notifyWatchdog.checked = cfg.notifyWatchdog !== false;
      playChimes.checked = cfg.playChimes !== false;

      ctaEnabled.checked = !!cfg.ctaEnabled;
      ctaIntervalMin.value = cfg.ctaIntervalMin || 10;
      ctaPinEnabled.checked = cfg.ctaPinEnabled !== false;
      ctaMessages.value = Array.isArray(cfg.ctaMessages) ? cfg.ctaMessages.join('\n') : (cfg.ctaMessages || DEFAULT_CTA_MESSAGES.join('\n'));

      // Interação Proativa
      if (proactiveCartEnabled) proactiveCartEnabled.checked = cfg.proactiveCartEnabled !== false;
      if (proactiveWelcomeEnabled) proactiveWelcomeEnabled.checked = !!cfg.proactiveWelcomeEnabled;
      if (proactiveCartCooldown) proactiveCartCooldown.value = cfg.proactiveCartCooldown || 20;
      if (proactiveWelcomeCooldown) proactiveWelcomeCooldown.value = cfg.proactiveWelcomeCooldown || 60;
      if (proactiveCartTemplates) {
        proactiveCartTemplates.value = Array.isArray(cfg.proactiveCartTemplates) ? cfg.proactiveCartTemplates.join('\n') : (cfg.proactiveCartTemplates || DEFAULT_CART_TEMPLATES.join('\n'));
      }
      if (proactiveWelcomeTemplates) {
        proactiveWelcomeTemplates.value = Array.isArray(cfg.proactiveWelcomeTemplates) ? cfg.proactiveWelcomeTemplates.join('\n') : (cfg.proactiveWelcomeTemplates || DEFAULT_WELCOME_TEMPLATES.join('\n'));
      }

      // Stats
      updateStatsUI(stats);

      // Logs
      renderLogs(logs);

      // Timer UI
      updateTimerDisplay(cfg);
    });
  }

  // --- Atualização de Stats ---
  function updateStatsUI(stats) {
    if (statAiCount) statAiCount.textContent = stats.questionsAnswered || 0;
    if (statCartCount) statCartCount.textContent = stats.cartEvents || 0;
    if (statSalesCount) statSalesCount.textContent = stats.purchasesDetected || 0;
    if (statProactiveCount) statProactiveCount.textContent = stats.proactiveInteractions || 0;
  }

  // --- Renderização de Logs em Tempo Real ---
  let activeLogs = [];

  function renderLogs(logs) {
    if (!logsList) return;
    activeLogs = Array.isArray(logs) ? logs.filter(item => item && item.title) : [];

    if (activeLogs.length === 0) {
      logsList.innerHTML = '<div class="empty-logs">Nenhum evento registrado ainda. O monitoramento está ativo na Shopee Live.</div>';
      return;
    }

    logsList.innerHTML = activeLogs.map(item => {
      let typeClass = 'log-info';
      if (item.type === 'sale') typeClass = 'log-sale';
      else if (item.type === 'cart') typeClass = 'log-cart';
      else if (item.type === 'ai') typeClass = 'log-ai';
      else if (item.type === 'proactive') typeClass = 'log-proactive';
      else if (item.type === 'cta') typeClass = 'log-cta';
      else if (item.type === 'watchdog') typeClass = 'log-watchdog';
      else if (item.type === 'warning') typeClass = 'log-warning';
      else if (item.type === 'error') typeClass = 'log-error';
      else if (item.type === 'timer') typeClass = 'log-timer';

      return `
        <div class="log-item ${typeClass}">
          <div class="log-top">
            <span class="log-title">${escapeHtml(item.title)}</span>
            <span class="log-time">${escapeHtml(item.time)}</span>
          </div>
          <div class="log-detail">${escapeHtml(item.detail)}</div>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  // Limpar logs
  btnClearLogs.addEventListener('click', () => {
    activeLogs = [];
    chrome.storage.local.set({ shopeeCopilotLogs: [] }, () => {
      renderLogs([]);
      showSaveToast('Logs limpos.');
    });
  });

  // --- Coleta e Salvamento de Configurações ---
  function collectFormData() {
    const rawCta = ctaMessages.value.split('\n').map(s => s.trim()).filter(Boolean);
    const rawCartTemplates = proactiveCartTemplates ? proactiveCartTemplates.value.split('\n').map(s => s.trim()).filter(Boolean) : [];
    const rawWelcomeTemplates = proactiveWelcomeTemplates ? proactiveWelcomeTemplates.value.split('\n').map(s => s.trim()).filter(Boolean) : [];

    return {
      aiEnabled: aiEnabled.checked,
      geminiApiKey: geminiApiKey.value.trim() || ((typeof window !== 'undefined' && window.__ENV_GEMINI_KEY__) || ''),
      geminiModel: geminiModel.value,
      aiCooldown: parseInt(aiCooldown.value, 10) || 8,
      productContext: productContext.value.trim(),
      systemPrompt: systemPrompt.value.trim(),

      ntfyServer: ntfyServer.value.trim() || 'https://ntfy.sh',
      ntfyTopic: ntfyTopic.value.trim(),
      notifyPurchases: notifyPurchases.checked,
      notifyCart: notifyCart.checked,
      notifyWatchdog: notifyWatchdog.checked,
      playChimes: playChimes.checked,

      // Interação Proativa
      proactiveCartEnabled: proactiveCartEnabled ? proactiveCartEnabled.checked : true,
      proactiveWelcomeEnabled: proactiveWelcomeEnabled ? proactiveWelcomeEnabled.checked : false,
      proactiveCartCooldown: parseInt(proactiveCartCooldown.value, 10) || 20,
      proactiveWelcomeCooldown: parseInt(proactiveWelcomeCooldown.value, 10) || 60,
      proactiveCartTemplates: rawCartTemplates.length > 0 ? rawCartTemplates : DEFAULT_CART_TEMPLATES,
      proactiveWelcomeTemplates: rawWelcomeTemplates.length > 0 ? rawWelcomeTemplates : DEFAULT_WELCOME_TEMPLATES,

      ctaEnabled: ctaEnabled.checked,
      ctaIntervalMin: parseInt(ctaIntervalMin.value, 10) || 10,
      ctaPinEnabled: ctaPinEnabled.checked,
      ctaMessages: rawCta.length > 0 ? rawCta : DEFAULT_CTA_MESSAGES
    };
  }

  let saveTimeout = null;
  function triggerSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      const current = collectFormData();
      chrome.storage.local.get(['shopeeCopilotConfig'], res => {
        const merged = { ...(res.shopeeCopilotConfig || {}), ...current };
        chrome.storage.local.set({ shopeeCopilotConfig: merged }, () => {
          showSaveToast('💾 Alterações salvas com sucesso');
        });
      });
    }, 400);
  }

  function showSaveToast(msg) {
    if (!saveStatus) return;
    saveStatus.textContent = msg;
    saveStatus.style.color = '#10b981';
    setTimeout(() => {
      saveStatus.textContent = '💾 Configurações salvas automaticamente';
      saveStatus.style.color = '#9494a8';
    }, 2500);
  }

  btnForceSave.addEventListener('click', () => {
    const current = collectFormData();
    chrome.storage.local.get(['shopeeCopilotConfig'], res => {
      const merged = { ...(res.shopeeCopilotConfig || {}), ...current };
      chrome.storage.local.set({ shopeeCopilotConfig: merged }, () => {
        showSaveToast('✅ Configurações salvas agora!');
      });
    });
  });

  // Ouvintes de alteração em todos os inputs
  const allInputs = document.querySelectorAll('input, select, textarea');
  allInputs.forEach(el => {
    el.addEventListener('input', triggerSave);
    el.addEventListener('change', triggerSave);
  });

  // --- Lógica do Timer ---
  let timerInterval = null;

  function updateTimerDisplay(cfg) {
    if (cfg && cfg.timerRunning && cfg.timerEndTime > Date.now()) {
      btnStartTimer.style.display = 'none';
      btnCancelTimer.style.display = 'inline-block';
      timerStatusLabel.textContent = 'Transmissão será finalizada em:';
      timerStatusLabel.style.color = '#ee4d2d';

      if (!timerInterval) {
        timerInterval = setInterval(() => {
          chrome.storage.local.get(['shopeeCopilotConfig'], r => {
            const c = r.shopeeCopilotConfig;
            if (!c || !c.timerRunning || c.timerEndTime <= Date.now()) {
              clearInterval(timerInterval);
              timerInterval = null;
              timerDigits.textContent = '00:00:00';
              btnStartTimer.style.display = 'inline-block';
              btnCancelTimer.style.display = 'none';
              timerStatusLabel.textContent = 'Timer finalizado';
              timerStatusLabel.style.color = '#9494a8';
              return;
            }

            const diff = Math.floor((c.timerEndTime - Date.now()) / 1000);
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;
            timerDigits.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
          });
        }, 1000);
      }
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      timerDigits.textContent = '00:00:00';
      btnStartTimer.style.display = 'inline-block';
      btnCancelTimer.style.display = 'none';
      timerStatusLabel.textContent = 'Timer parado';
      timerStatusLabel.style.color = '#9494a8';
    }
  }

  btnStartTimer.addEventListener('click', () => {
    const mins = parseInt(timerMinutes.value, 10);
    if (!mins || mins <= 0) {
      alert('Informe uma duração válida em minutos.');
      return;
    }

    const endTime = Date.now() + mins * 60 * 1000;
    chrome.storage.local.get(['shopeeCopilotConfig'], res => {
      const cfg = res.shopeeCopilotConfig || {};
      cfg.timerRunning = true;
      cfg.timerEndTime = endTime;

      chrome.storage.local.set({ shopeeCopilotConfig: cfg }, () => {
        updateTimerDisplay(cfg);
        showSaveToast(`⏱️ Timer de ${mins} minutos iniciado!`);
      });
    });
  });

  btnCancelTimer.addEventListener('click', () => {
    chrome.storage.local.get(['shopeeCopilotConfig'], res => {
      const cfg = res.shopeeCopilotConfig || {};
      cfg.timerRunning = false;
      cfg.timerEndTime = 0;

      chrome.storage.local.set({ shopeeCopilotConfig: cfg }, () => {
        updateTimerDisplay(cfg);
        showSaveToast('⏹️ Timer cancelado.');
      });
    });
  });

  // --- Botão "Zerar Tudo" (Resetar Sessão para Nova Live) ---
  if (btnResetAll) {
    btnResetAll.addEventListener('click', () => {
      const confirmReset = confirm(
        '⚠️ DESEJA ZERAR TUDO PARA UMA NOVA LIVE?\n\n' +
        '• Contadores de Sacola e Carrinho voltarão a 0\n' +
        '• Métricas de Vendas e Respostas da IA voltarão a 0\n' +
        '• Histórico de Logs Ao Vivo será limpo\n' +
        '• Cronômetro será reiniciado\n\n' +
        'Clique em OK para confirmar.'
      );
      if (!confirmReset) return;

      const emptyStats = {
        questionsAnswered: 0,
        cartEvents: 0,
        purchasesDetected: 0,
        proactiveInteractions: 0,
        uptimeSeconds: 0
      };

      activeLogs = [];
      renderLogs(activeLogs);
      updateStatsUI(emptyStats);

      chrome.storage.local.get(['shopeeCopilotConfig'], res => {
        const cfg = res.shopeeCopilotConfig || {};
        cfg.timerRunning = false;
        cfg.timerEndTime = 0;
        cfg.proactiveWelcomeEnabled = false; // Garante anti-spam para nova live
        cfg.proactiveCartEnabled = true;     // Garante alta conversão ativa
        cfg.productContext = DEFAULT_PRODUCT_CONTEXT;
        cfg.ctaMessages = DEFAULT_CTA_MESSAGES;
        cfg.proactiveWelcomeTemplates = DEFAULT_WELCOME_TEMPLATES;
        cfg.proactiveCartTemplates = DEFAULT_CART_TEMPLATES;
        if (!cfg.ctaIntervalMin || cfg.ctaIntervalMin === 3) {
          cfg.ctaIntervalMin = 10;
        }
        updateTimerDisplay(cfg);

        // Atualiza controles na interface
        if (proactiveWelcomeEnabled) proactiveWelcomeEnabled.checked = false;
        if (proactiveCartEnabled) proactiveCartEnabled.checked = true;
        if (ctaIntervalMin) ctaIntervalMin.value = cfg.ctaIntervalMin;
        if (productContext) productContext.value = DEFAULT_PRODUCT_CONTEXT;
        if (ctaMessages) ctaMessages.value = DEFAULT_CTA_MESSAGES.join('\n');
        if (proactiveWelcomeTemplates) proactiveWelcomeTemplates.value = DEFAULT_WELCOME_TEMPLATES.join('\n');
        if (proactiveCartTemplates) proactiveCartTemplates.value = DEFAULT_CART_TEMPLATES.join('\n');

        chrome.storage.local.set({
          shopeeCopilotStats: emptyStats,
          shopeeCopilotLogs: [],
          shopeeCopilotConfig: cfg
        }, () => {
          showSaveToast('✨ Tudo zerado com sucesso! Pronto para nova live.');
        });
      });

      // Notifica as abas da Shopee para zerarem os contadores da página
      chrome.tabs.query({ url: '*://live.shopee.com.br/*' }, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { type: 'RESET_ALL' }, () => {
            if (chrome.runtime.lastError) { /* ignore */ }
          });
        });
      });

      chrome.runtime.sendMessage({ type: 'UPDATE_STATS', payload: emptyStats });
    });
  }

  // --- Ouvinte de Mensagens em Tempo Real da Extensão ---
  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === 'LOG_EVENT' && msg.payload) {
      const item = msg.payload;
      if (!activeLogs.some(l => l && l.id === item.id)) {
        activeLogs.unshift(item);
        if (activeLogs.length > 80) activeLogs.pop();
        renderLogs(activeLogs);
      }
    } else if (msg.type === 'UPDATE_STATS') {
      updateStatsUI(msg.payload || {});
    }
  });

  // Ouvinte de mudanças no storage
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.shopeeCopilotStats) {
        updateStatsUI(changes.shopeeCopilotStats.newValue || {});
      }
      if (changes.shopeeCopilotLogs) {
        renderLogs(changes.shopeeCopilotLogs.newValue || []);
      }
      if (changes.shopeeCopilotConfig) {
        updateTimerDisplay(changes.shopeeCopilotConfig.newValue);
      }
    }
  });

  // Carrega tudo no início
  loadAllData();
});
