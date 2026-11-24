// ========================================================================
// SHOPEE LIVE COPILOT — Background Service Worker (Manifest V3)
// ========================================================================

// Abre o painel lateral ao clicar no ícone da extensão
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(err => {
    console.warn('[ShopeeCopilot BG] Erro ao configurar sidePanel:', err);
  });
}

// Alarme para manter o Service Worker ativo durante a transmissão ao vivo
chrome.alarms.create('shopee-copilot-keepalive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'shopee-copilot-keepalive') {
    // Keepalive ping
    console.debug('[ShopeeCopilot BG] Keepalive tick:', new Date().toLocaleTimeString());
  }
});

// Despacho de Notificação Push ntfy
async function sendNtfyPush({ serverUrl, topic, title, message, priority, tags }) {
  const base = (serverUrl || 'https://ntfy.sh').replace(/\/+$/, '');
  const t = (topic || 'shopee_live_copilot').trim();
  if (!t) return false;

  let prioNum = 3;
  if (priority === 'urgent' || priority === 5) prioNum = 5;
  else if (priority === 'high' || priority === 4) prioNum = 4;
  else if (priority === 'low' || priority === 2) prioNum = 2;
  else if (priority === 'min' || priority === 1) prioNum = 1;

  const tagsList = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(s => s.trim()) : ['bell']);

  try {
    const res = await fetch(`${base}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: t,
        title: title || 'Shopee Live Alerta',
        message: message || '',
        priority: prioNum,
        tags: tagsList
      })
    });
    return res.ok;
  } catch (err) {
    console.error('[ShopeeCopilot BG] Erro ao enviar ntfy:', err);
    return false;
  }
}

// Ouvinte de mensagens do Content Script e do SidePanel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SEND_NTFY') {
    sendNtfyPush(request.payload).then(ok => {
      sendResponse({ success: ok });
    });
    return true; // Retorno assíncrono
  }

  if (request.type === 'GET_SHOPEE_TAB') {
    chrome.tabs.query({ url: '*://live.shopee.com.br/*' }, tabs => {
      sendResponse({ tab: tabs && tabs.length > 0 ? tabs[0] : null });
    });
    return true;
  }
});
