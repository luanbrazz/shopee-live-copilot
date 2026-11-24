// ========================================================================
// SHOPEE LIVE COPILOT — Módulo de IA Gemini para Respostas Automáticas
// ========================================================================

const ShopeeLiveAI = (function () {
  // Chave padrão opcional via env.js local ou storage da extensão
  const DEFAULT_KEY = (typeof window !== 'undefined' && window.__ENV_GEMINI_KEY__) || '';

  /**
   * Chamada à API do Google Gemini com formatação adaptada para o chat da Shopee Live
   */
  async function generateAnswer({ apiKey, modelName, systemPrompt, productContext, author, question }) {
    const key = (apiKey || DEFAULT_KEY).trim();
    if (!key) {
      console.warn('[ShopeeCopilot AI] Nenhuma chave Gemini configurada. Por favor, insira sua chave no painel lateral.');
      return null;
    }
    const model = (modelName || 'gemini-flash-lite-latest').trim();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const instructions = [
      'Você é a assistente de vendas oficial no chat ao vivo da Shopee Live de uma loja de alta confiança (Vendedor Indicado).',
      'Sua missão é responder dúvidas de compradores rapidamente com foco em converter em vendas imediatas.',
      '',
      'INFORMAÇÕES OFICIAIS DO PRODUTO E REGRAS DA LIVE (SUA ÚNICA FONTE DE VERDADE):',
      productContext || 'Mochila de Viagem Executiva 42L/45L. Padrão Bordo ANAC. 4 Cores. Envio rápido em 24h de SP.',
      '',
      'DIRETRIZES DO VENDEDOR:',
      systemPrompt || 'Seja simpática, direta, prestativa e confiante.',
      '',
      'REGRAS OBRIGATÓRIAS DE FORMATAÇÃO NA SHOPEE LIVE:',
      '1. LIMITE ESTRITO: Responda em NO MÁXIMO 130 caracteres (a caixa de chat da Shopee trava em 150 caracteres). Seja curta e objetiva.',
      '2. REGRA CRÍTICA SOBRE PREÇO/VALOR: NUNCA informe valores monetários específicos ou números de reais (R$). Cada comprador tem cupons personalizados e moedas diferentes. Se perguntarem de preço, valor ou desconto, oriente sempre a tocar na "Sacola Laranja" (Produto 1) para ver o preço com cupom de live e frete grátis aplicados!',
      '3. Nunca invente dados técnicos que não estejam no Contexto do Produto.',
      '4. Sempre que fizer sentido, indique a "Sacola Laranja" ou "Produto 1" para resgate de cupom ou compra.',
      '5. Se a mensagem do usuário for apenas spam, xingamento ou incompreensível, responda EXATAMENTE E APENAS: IGNORE',
      '6. Use no máximo 1 ou 2 emojis amigáveis (ex: 😊, 🎒, 🧡, ✈️).'
    ].join('\n');

    const promptText = `O cliente @${author} perguntou: "${question}". Responda a dúvida dele em até 130 caracteres direcionando para a compra na sacola laranja. Lembrança: NUNCA diga valores em R$!`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${instructions}\n\n${promptText}` }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 60,
        temperature: 0.65
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.warn(`[ShopeeCopilot AI] Erro HTTP ${response.status} no modelo ${model}:`, errorBody);

        // Fallback automático para gemini-3.5-flash-lite
        if (model !== 'gemini-3.5-flash-lite') {
          console.log('[ShopeeCopilot AI] Tentando fallback para gemini-3.5-flash-lite...');
          return generateAnswer({
            apiKey,
            modelName: 'gemini-3.5-flash-lite',
            systemPrompt,
            productContext,
            author,
            question
          });
        }
        return null;
      }

      const data = await response.json();
      if (!data.candidates || data.candidates.length === 0) return null;

      let answer = data.candidates[0]?.content?.parts?.[0]?.text?.trim() || '';

      // Remove aspas extras se a IA colocar
      answer = answer.replace(/^["']|["']$/g, '').trim();

      // Se a IA decidiu ignorar
      if (answer.toUpperCase() === 'IGNORE' || answer.toUpperCase().startsWith('IGNORE')) {
        return null;
      }

      // Trunca para segurança máxima abaixo de 145 caracteres
      if (answer.length > 140) {
        answer = answer.substring(0, 137).trim() + '...';
      }

      return answer;
    } catch (err) {
      console.error('[ShopeeCopilot AI] Exceção ao chamar Gemini:', err);
      return null;
    }
  }

  return {
    generateAnswer
  };
})();

// Exportação global no contexto do Content Script
if (typeof window !== 'undefined') {
  window.ShopeeLiveAI = ShopeeLiveAI;
}
