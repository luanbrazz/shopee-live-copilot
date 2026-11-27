// ========================================================================
// SHOPEE LIVE COPILOT — Padrões Compartilhados e Migração (defaults.js)
// ========================================================================

(function (globalScope) {
  'use strict';

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

  // --- Templates Padrão de Fechamento de Carrinho / Sacola (@usuario) ---
  const DEFAULT_CART_TEMPLATES = [
    '{user} Vi que você garantiu na sacola! Aproveite o cupom da live + Frete Grátis antes de finalizar no carrinho 🛒✨',
    '{user} Ótima escolha! Nossa mochila tem envio rápido de SP em até 24h e garantia de 30 dias. Qualquer dúvida só chamar 👇',
    '{user} Dica: resgate o cupom exclusivo da live na Sacola Laranja para garantir o melhor desconto no seu pedido! 🎟️',
    '{user} Parabéns pela escolha! A Romantic Crown original tem abertura 180° estilo mala e bolso antifurto ✈️',
    '{user} Excelente decisão! Lembre-se de conferir a cor escolhida e aplicar o cupom antes que o lote da live esgote ⏳',
    '{user} Vi que colocou no carrinho! Essa mochila não paga despacho na ANAC e protege notebook de até 17.3" 💻🧡',
    '{user} Show de bola! Qualquer dúvida sobre prazo de entrega ou medidas estamos ao vivo para te ajudar! 😊',
    '{user} Aproveite que estamos ao vivo para garantir com o cupom de frete grátis liberado na sacola! 🛍️',
    // Gatilhos V7 (Escassez, Urgência e Aversão à Perda)
    '{user} Boa! Quem sai sem finalizar paga o dobro amanhã — garanta o cupom de fábrica antes da live fechar no Produto 1! ⚠️',
    '{user} Excelente! Sai mais barato que UMA taxa de despacho (R$ 180+) e vai de graça na Gol, Latam e Azul. Finalize já! ✈️',
    '{user} Travou na hora certa! +80% do lote já foi reservado — finalize agora pra ninguém levar a última da sua cor! 🔥',
    '{user} Ótima escolha! Preto Executivo e Cinza Chumbo estão quase zerando ao vivo — garante a sua antes que acabe! 🚨',
    '{user} Vi no carrinho! Ficou alguma dúvida de tamanho, notebook, frete ou cor antes de pagar? Manda aqui que respondo já! 💬',
    '{user} Corre pra finalizar! O cupom de Frete Grátis + Desconto da Shopee Live pode expirar na sua tela a qualquer segundo ⏳',
    '{user} Acertou em cheio! Oxford Militar 100% impermeável pra nunca mais passar perrengue na chuva ou viagem. Conclua já! 🌧️',
    '{user} Boa! Cabe notebook até 17.3" + roupa pra 1 semana (expande de 33L pra 45L). Se quiser confirmar seu modelo, só falar! 🧳',
    '{user} Show! Seu pedido na live tem envio prioritário em 24h úteis + Risco Zero com Garantia Shopee de 7 dias. Finaliza lá! 📦',
    '{user} Últimos minutos desse lote de fábrica! Já tá no carrinho, agora conclui no botão laranja pra não perder o desconto ⚡'
  ];

  // --- Templates Padrão de Boas-Vindas (@usuario) ---
  const DEFAULT_WELCOME_TEMPLATES = [
    '{user} Seja muito bem-vindo(a)! Mochila Cabine ANAC 33L a 45L com cupom na Sacola Laranja 👇',
    '{user} Olá! Qualquer dúvida sobre medidas, cores ou notebook 17.3" é só mandar aqui no chat 😊',
    '{user} Bem-vindo(a) à nossa live! Aproveite o frete grátis e o cupom exclusivo no Produto 1 🧡',
    '{user} Oi! Estamos mostrando a Mochila Mala Romantic Crown original. Dúvidas sobre envio ou tecido só chamar!',
    '{user} Seja bem-vindo(a)! Chegou na melhor hora: cupons da live liberados na Sacola Laranja 🎟️✨',
    '{user} Olá! Procurando mochila para viagem ou trabalho? Essa cabe notebook até 17.3" e não paga despacho de bordo ✈️',
    '{user} Bem-vindo(a)! Nossas 4 cores (Preto, Off-White, Cinza e Rosa) têm envio rápido em 24h de SP 🚚',
    '{user} Oi! Fique à vontade para perguntar qualquer detalhe da mochila aqui no chat, respondemos na hora! 👇',
    // Gatilhos V7 (Escassez, Urgência e Engajamento)
    '{user} Bem-vindo(a)! Quem sair sem pôr no carrinho paga o dobro amanhã — cupom ativo no Produto 1 da Sacola Laranja! ⚠️',
    '{user} Olá! Uma taxa de despacho custa R$ 180+ e essa mochila ANAC vai de graça na Gol, Latam e Azul. Veja o Produto 1! ✈️',
    '{user} Bem-vindo(a)! +80% do lote promocional já foi reservado! Confira sua cor na 🛍️ Sacola Laranja -> Produto 1 🔥',
    '{user} Chegou na hora! Preto Executivo e Cinza Chumbo quase zerando ao vivo! Prefere qual cor? Comenta aqui e veja o Produto 1 🚨',
    '{user} Ei, bem-vindo(a)! Qual dúvida falta tirar: tamanho, notebook, frete ou cor? Manda no chat que respondo na hora! 💬',
    '{user} Bem-vindo(a)! Cupom de Frete Grátis + Desconto da live pode expirar a qualquer segundo! Confira no Produto 1 ⏳',
    '{user} Olá! Chega de mochila frágil que molha tudo: essa é Oxford Militar 100% impermeável! Garanta no Produto 1 🌧️',
    '{user} Bem-vindo(a)! Cabe notebook até 17.3" + roupa pra 1 semana (33L a 45L)! Quer confirmar o seu? Manda o modelo aqui 🧳',
    '{user} Olá! Pediu na live = envio prioritário em até 24h úteis + Garantia Shopee de 7 dias! Aproveite o cupom no Produto 1 📦',
    '{user} Chegou nos minutos finais desse lote de fábrica! Não saia sem garantir o Produto 1 na Sacola Laranja ⚡'
  ];

  // --- Mensagens Periódicas e Fixas (CTA / "Marcar") ---
  const DEFAULT_CTA_MESSAGES = [
    // 10 Gatilhos V7 MAIS AGRESSIVOS (Urgência, Escassez, Aversão à Perda e Perguntas de Alta Conversão)
    '⚠️ ATENÇÃO: Quem sair da live sem colocar no carrinho VAI PAGAR O DOBRO amanhã! O cupom de fábrica cai assim que a transmissão fechar. Toca na 🛍️ Sacola Laranja -> Produto 1 AGORA!',
    '✈️ Uma única taxa de despacho no aeroporto custa R$ 180+! Essa mochila cabine ANAC sai mais barato que UMA taxa e vai de graça na Gol, Latam e Azul. Garanta no Produto 1!',
    '🔥 ALERTA DE ESTOQUE: Mais de 80% do lote promocional já foi reservado! Se continuar só olhando, outro comprador leva a última unidade da sua cor. Corre na Sacola Laranja -> Produto 1!',
    '🚨 As cores PRETO EXECUTIVO e CINZA CHUMBO estão quase zerando ao vivo! Qual cor você prefere (Preto, Cinza, Off-White ou Rosa)? Comenta aqui e já trava a sua no Produto 1!',
    '💬 Ei, você que tá assistindo em silêncio: qual é a sua única dúvida para não garantir a sua hoje? Tamanho, notebook, frete ou cor? Manda aqui no chat que respondo na hora!',
    '⏳ CONTAGEM REGRESSIVA: O cupom de Frete Grátis + Desconto da Shopee Live pode expirar na sua tela a qualquer segundo! Clica no Produto 1 agora e confere na finalização antes que suma!',
    '🌧️ Quem aqui já rasgou mochila barata no meio da viagem ou molhou tudo na chuva? Comenta EU no chat! Para de gastar dinheiro 2x: essa tem Oxford Militar 100% impermeável. Garanta no Produto 1!',
    '🧳 Cabe notebook até 17.3" + roupa pra 1 semana inteira (expande de 33L pra 45L)! Tem dúvida se cabe o SEU notebook? Manda a marca/modelo aqui no chat que eu confirmo agora!',
    '📦 Pediu na live = envio prioritário em até 24h úteis + Risco Zero com Garantia Shopee de 7 dias! Não perde o cupom ativo agora no Produto 1 da Sacola Laranja!',
    '⚡ ÚLTIMOS MINUTOS desse lote de fábrica na Shopee! Se você fechar a live sem garantir o Produto 1 na Sacola Laranja, vai perder dinheiro na certa. Toca no botão laranja e garante já a sua!',
    // Gatilhos complementares
    '🔥 Toque no Produto 1 na Sacola Laranja para resgatar seu Cupom Exclusivo de Live + Frete Grátis!',
    '✈️ Padrão Cabine ANAC: viaje a bordo sem pagar taxa de despacho! Garanta a sua na Sacola Laranja 🎒',
    '💻 Bolso acolchoado para Notebook de até 17.3", saída USB e tecido impermeável! Confira no Produto 1 👇',
    '🔒 Segurança total: Bolso secreto antifurto nas costas e abertura 180° estilo mala de viagem! Veja na sacola 🧡',
    '⭐ Mais de 100 mil mochilas vendidas com nota 5.0! Qualidade comprovada e garantia de 30 dias ✨',
    '💼 Ideal para trabalho, faculdade e viagens: expande de 33L para 45L em segundos no zíper expansor!'
  ];

  function appendMissingDefaults(primaryList, secondaryList) {
    const list1 = Array.isArray(primaryList) ? primaryList.filter(Boolean) : [];
    const list2 = Array.isArray(secondaryList) ? secondaryList.filter(Boolean) : [];
    const seen = new Set();
    const merged = [];
    [...list1, ...list2].forEach(item => {
      if (!seen.has(item)) {
        seen.add(item);
        merged.push(item);
      }
    });
    return merged;
  }

  /**
   * Migra configurações salvas sem sobrescrever mensagens personalizadas pelo usuário.
   */
  function migrateCopilotConfig(cfg) {
    let changed = false;
    const next = { ...(cfg || {}) };

    if (!next.productContext || !next.productContext.includes('Reputação: Nota 5.0') || next.productContext.includes('R$ 94,99')) {
      next.productContext = DEFAULT_PRODUCT_CONTEXT;
      changed = true;
    }

    if (!Array.isArray(next.ctaMessages) || next.ctaMessages.length < 5) {
      next.ctaMessages = [...DEFAULT_CTA_MESSAGES];
      changed = true;
    } else if (!next.v7AgressivoMessagesMigrated) {
      next.ctaMessages = appendMissingDefaults(DEFAULT_CTA_MESSAGES, next.ctaMessages);
      changed = true;
    }

    if (!Array.isArray(next.proactiveWelcomeTemplates) || next.proactiveWelcomeTemplates.length < 5) {
      next.proactiveWelcomeTemplates = [...DEFAULT_WELCOME_TEMPLATES];
      changed = true;
    } else if (!next.v7MessagesMigrated) {
      next.proactiveWelcomeTemplates = appendMissingDefaults(next.proactiveWelcomeTemplates, DEFAULT_WELCOME_TEMPLATES);
      changed = true;
    }

    if (!Array.isArray(next.proactiveCartTemplates) || next.proactiveCartTemplates.length < 5) {
      next.proactiveCartTemplates = [...DEFAULT_CART_TEMPLATES];
      changed = true;
    } else if (!next.v7MessagesMigrated) {
      next.proactiveCartTemplates = appendMissingDefaults(next.proactiveCartTemplates, DEFAULT_CART_TEMPLATES);
      changed = true;
    }

    if (!next.v7MessagesMigrated) {
      next.v7MessagesMigrated = true;
      changed = true;
    }

    if (!next.v7AgressivoMessagesMigrated) {
      next.v7AgressivoMessagesMigrated = true;
      changed = true;
    }

    return { config: next, changed };
  }

  globalScope.SHOPEE_COPILOT_DEFAULTS = {
    DEFAULT_PRODUCT_CONTEXT,
    DEFAULT_CART_TEMPLATES,
    DEFAULT_WELCOME_TEMPLATES,
    DEFAULT_CTA_MESSAGES,
    migrateCopilotConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
