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

  // Tab Logs
  const logsList = document.getElementById('logsList');
  const btnClearLogs = document.getElementById('btnClearLogs');

  // Footer
  const saveStatus = document.getElementById('saveStatus');
  const btnForceSave = document.getElementById('btnForceSave');

  // --- Contexto Padrão da Mochila Romantic Crown 42L/45L Shopee ---
  const DEFAULT_PRODUCT_CONTEXT = `PRODUTO PRINCIPAL DA LIVE (ROMANTIC CROWN ORIGINAL):
- Nome: Mochila de Viagem Expansível Executiva (Cabine ANAC)
- Capacidade: Expansível de 33L para 45L (zíper expansor que aumenta a profundidade de 12cm para 22cm)
- Padrão Cabine ANAC: Dimensões 45 x 32cm aprovadas para viajar a bordo de avião sem pagar taxa de despacho!
- Compartimento Notebook: Bolso acolchoado especial para notebook de até 17.3 polegadas
- Cores disponíveis: Preto, Branco (Off-White), Cinza e Rosa
- Recursos: Bolso impermeável para calçados/roupas úmidas, saída USB para carregar celular, zíperes reforçados antifurto, tecido resistente à água
- Envio: Pronta entrega com estoque direto de São Paulo (SP) e postagem rápida em até 24h
- Preço e Oferta: MEGA DESCONTO EXCLUSIVO DE LIVE! REGRA CRÍTICA: NUNCA mencione valores em reais (R$). Cada comprador tem cupons, moedas e frete personalizados. Oriente sempre o cliente a tocar na Sacola Laranja (Produto 1) para resgatar o cupom de live e ver o valor final com desconto no carrinho!`;

  // --- Templates Padrão de Interação Proativa ---
  const DEFAULT_CART_TEMPLATES = [
    '{user} Vi que você garantiu na sacola! Aproveite o cupom da live + Frete Grátis antes de finalizar no carrinho 🛒✨',
    '{user} Ótima escolha! Nossa mochila tem envio rápido de SP em até 24h e garantia de 30 dias. Qualquer dúvida só chamar 👇',
    '{user} Dica: resgate o cupom exclusivo da live na Sacola Laranja para garantir o melhor desconto no seu pedido! 🎟️'
  ];

  const DEFAULT_WELCOME_TEMPLATES = [
    '{user} Seja bem-vindo(a)! Mochila Cabine ANAC 33L a 45L com cupom e Frete Grátis na Sacola Laranja 👇',
    '{user} Olá! Qualquer dúvida sobre medidas, notebook 17.3" ou envio em 24h é só mandar aqui no chat 😊'
  ];

  // Restaurar Templates de Carrinho
  if (btnResetCartTemplates) {
    btnResetCartTemplates.addEventListener('click', () => {
      proactiveCartTemplates.value = DEFAULT_CART_TEMPLATES.join('\n');
      if (proactiveCartEnabled) proactiveCartEnabled.checked = true;
      if (proactiveCartCooldown) proactiveCartCooldown.value = 20;
      triggerSave();
      showSaveToast('🛒 Fechamento de Carrinho restaurado para o padrão (Ativado, 20s).');
    });
  }

  // Restaurar Templates de Boas-Vindas
  if (btnResetWelcomeTemplates) {
    btnResetWelcomeTemplates.addEventListener('click', () => {
      proactiveWelcomeTemplates.value = DEFAULT_WELCOME_TEMPLATES.join('\n');
      if (proactiveWelcomeEnabled) proactiveWelcomeEnabled.checked = false;
      if (proactiveWelcomeCooldown) proactiveWelcomeCooldown.value = 60;
      triggerSave();
      showSaveToast('👋 Boas-Vindas restauradas para o padrão seguro (Desativado, 60s).');
    });
  }

  // --- Navegação por Abas ---
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(btn.getAttribute('data-tab'));
      if (targetPane) targetPane.classList.add('active');
    });
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

      // Migração automática de valores legados (R$ 94,99 ou modelo 404)
      let needsResave = false;
      if (cfg.productContext && cfg.productContext.includes('R$ 94,99')) {
        cfg.productContext = DEFAULT_PRODUCT_CONTEXT;
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
      if (needsResave) {
        chrome.storage.local.set({ shopeeCopilotConfig: cfg });
      }

      // Popula campos
      aiEnabled.checked = cfg.aiEnabled !== false;
      geminiApiKey.value = cfg.geminiApiKey || '';
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
      ctaMessages.value = Array.isArray(cfg.ctaMessages) ? cfg.ctaMessages.join('\n') : (cfg.ctaMessages || '');

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
    activeLogs = Array.isArray(logs) ? logs : [];

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
      geminiApiKey: geminiApiKey.value.trim(),
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
      ctaMessages: rawCta.length > 0 ? rawCta : [
        '🔥 Aproveite o Cupom de Frete Grátis na Sacola Laranja no Produto 1!',
        '🎒 Mochila 45L Cabine ANAC com desconto de fábrica no carrinho!'
      ]
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
        if (!cfg.ctaIntervalMin || cfg.ctaIntervalMin === 3) {
          cfg.ctaIntervalMin = 10;
        }
        updateTimerDisplay(cfg);

        // Atualiza controles na interface
        if (proactiveWelcomeEnabled) proactiveWelcomeEnabled.checked = false;
        if (proactiveCartEnabled) proactiveCartEnabled.checked = true;
        if (ctaIntervalMin) ctaIntervalMin.value = cfg.ctaIntervalMin;

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
      // Adiciona o novo evento no topo da lista imediatamente (zero delay de I/O)
      activeLogs.unshift(msg.payload);
      if (activeLogs.length > 60) activeLogs.pop();
      renderLogs(activeLogs);
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
