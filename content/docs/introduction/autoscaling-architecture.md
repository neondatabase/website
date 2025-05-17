---
title: Autoscaling architecture
subtitle: Learn how Neon automatically scales compute resources on demand
enableTableOfContents: true
updatedOn: '2024-08-19T14:50:59.585Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How Neon's autoscaling architecture is structured</p>
<p>The role of key components like the autoscaler-agent and Kubernetes scheduler</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/autoscaling">Introduction to autoscaling</a>
<a href="/docs/guides/autoscaling-guide">Enabling autoscaling</a>
<a href="/docs/guides/autoscaling-algorithm">How the algorithm works</a>
</DocsList>
</InfoBlock>

**Plano de Tarefas Detalhado – Lançamento Ecossistema Afiliarev &

**Legenda de Responsáveis:**

* **AF:** Antonio Fonseca (Conteúdo Principal, Aprovações, Gravações Chave)
* **MKT:** Equipe de Marketing (Estratégia, Copy, Criativos, Ads, Redes Sociais, Email, SEO)
* **DEV:** Equipe de Desenvolvimento/Tecnologia (Plataforma, Website, Integrações)
* **CON:** Equipe de Conteúdo/Educação (Desenvolvimento Curricular, Materiais)
* **OP:** Equipe de Operações/Suporte (Logística, Financeiro, Atendimento)
* **LEG:** Equipe Legal/Compliance (Revisão Jurídica)
* **LID:** Liderança do Projeto (Decisões Estratégicas, Coordenação Geral)

---

**FASE 0: PLANEJAMENTO ESTRATÉGICO E DEFINIÇÕES FUNDAMENTAIS (Finalizar até 24/Maio)**

| ID  | Tarefa                                                                                                                               | Responsável(eis) | Prazo Ideal     |
| :-: | :----------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :-------------- |
| P01 | Revisar e aprovar formalmente todos os nomes de produtos (Afiliarev Start, Mastermind Legado iGaming, Método Connector Lucrativo etc.). | LID, AF, MKT     | 20/Maio         |
| P02 | Finalizar e aprovar os modelos de precificação para Afiliarev Start (R$197), Downsell (R$19,90), OTOs (R$97, R$497) e Mastermind.     | LID, MKT         | 22/Maio         |
| P03 | Consolidar o plano de negócios final, incluindo projeções financeiras detalhadas e KPIs para cada cenário (Ruim, Médio, Bom).       | LID, MKT, OP     | 24/Maio         |
| P04 | Definir e aprovar o orçamento detalhado para cada fase de lançamento e alocar recursos para as equipes.                               | LID, OP          | 24/Maio         |
| P05 | Confirmar a equipe chave e suas responsabilidades detalhadas para cada fase do lançamento.                                            | LID              | 24/Maio         |
| P06 | Formalizar os termos finais da parceria com a "Casa de Apostas Parceira Própria", incluindo aspectos técnicos de integração educacional. | LID, LEG, DEV    | 24/Maio         |

---

**FASE 1: DESENVOLVIMENTO DE PRODUTO E INFRAESTRUTURA (20/Maio - 04/Julho)**

**1.1 Plataforma Afiliarev Start (MVP)**

| ID   | Tarefa                                                                                                                                    | Responsável(eis) | Prazo Ideal     |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :-------------- |
| D01  | Selecionar, contratar e iniciar a configuração da plataforma LMS escolhida.                                                                 | DEV, LID         | 27/Maio         |
| D02  | Desenvolver o currículo final e detalhado dos módulos do Afiliarev Start (R$197), incluindo objetivos de aprendizagem para cada aula.     | CON, AF          | 10/Junho        |
| D03  | Roteirizar todas as videoaulas dos módulos do Afiliarev Start.                                                                              | CON, AF          | 17/Junho        |
| D04  | Gravar e editar todas as videoaulas dos módulos do Afiliarev Start.                                                                         | CON, AF, MKT     | 28/Junho        |
| D05  | Fazer upload e organizar todas as aulas e materiais na plataforma LMS.                                                                    | CON, DEV         | 01/Julho        |
| D06  | Criar todos os materiais de apoio (checklists, glossários de termos legais/iGaming, templates básicos de copy/anúncio) para o Afiliarev Start. | CON, AF          | 28/Junho        |
| D07  | Desenvolver e finalizar o conteúdo do produto Downsell ("Guia Rápido: Legalidade no iGaming: Seu Escudo").                                | CON, AF, LEG     | 20/Junho        |
| D08  | Desenvolver o conteúdo do Upsell 1 OTO (Kit de Implementação Rápida "Conector Lucrativo" - R$97).                                         | CON, MKT, AF     | 24/Junho        |
| D09  | Desenvolver o conteúdo inicial do Upsell 2 OTO (Afiliarev PRO Módulos Avançados Iniciais - R$497).                                          | CON, AF          | 30/Junho        |
| D10  | Configurar a estrutura e regras da comunidade online inicial para alunos do Afiliarev Start (Telegram/Discord).                             | MKT, OP          | 28/Junho        |
| D11  | Integrar e testar exaustivamente o sistema de processamento de pagamentos com LMS, página de vendas, OTOs e Downsell.                     | DEV, OP          | 30/Junho        |
| D12  | Desenvolver a FAQ inicial e os scripts de atendimento para o suporte do Afiliarev Start.                                                    | OP, CON          | 28/Junho        |
| D13  | Realizar simulação completa do fluxo do aluno: compra, acesso ao MVP, acesso aos OTOs, acesso à comunidade, primeiro contato com suporte. | DEV, CON, MKT, OP | 04/Julho        |

**1.2 Mastermind "Legado iGaming"**

| ID   | Tarefa                                                                                                                               | Responsável(eis) | Prazo Ideal     |
| :--- | :----------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :-------------- |
| M01  | Detalhar a estrutura curricular, a dinâmica das sessões (online/presenciais), e o cronograma annual do Mastermind.                     | AF, LID          | 30/Junho        |
| M02  | Criar o kit de apresentação premium do Mastermind (proposta de valor detalhada, benefícios, estrutura, investimento, processo seletivo). | AF, MKT          | 15/Julho        |
| M03  | Desenvolver o formulário de aplicação online e os critérios de avaliação para seleção dos membros do Mastermind.                          | AF, LID, OP      | 10/Julho        |
| M04  | Iniciar o planejamento logístico do primeiro retiro presencial do Mastermind (local, data, fornecedores, orçamento).                   | OP, LID          | 30/Julho        |

**1.3 Casa de Apostas Parceira (Integração Educacional)**

| ID   | Tarefa                                                                                                                                    | Responsável(eis) | Prazo Ideal     |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :-------------- |
| CP01 | Realizar reunião técnica com a Casa Parceira para definir os termos finais e o escopo da integração educacional com Afiliarev Start.     | LID, DEV         | 17/Junho        |
| CP02 | Desenvolver os tutoriais práticos e exemplos de aplicação do "Método Connector Lucrativo" utilizando a interface da casa parceira (vídeos/PDFs). | CON, AF          | 25/Julho        |
| CP03 | Validar com a Casa Parceira a criação (ou acesso a) um ambiente de teste/simulação para os alunos aplicarem o conhecimento sem risco.         | DEV, Casa Parceira | 05/Agosto       |

---

## FASE 2: BRANDING, POSICIONAMENTO E MARKETING (20/Maio - Lançamentos)

## 2.1 Definição de Branding e Criação de Materiais de Marketing Gerais

| ID   | Tarefa                                                                                                                                    | Responsável(eis) | Prazo Ideal     |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :-------------- |
| B01  | Desenvolver e aprovar a identidade visual completa (logo, paleta, tipografia) para o evento "Caixa Preta".                                | MKT              | 27/Maio         |
| B02  | Desenvolver e aprovar a identidade visual da plataforma "Afiliarev" (alinhada com AF e evento).                                            | MKT              | 03/Junho        |
| B03  | Desenvolver e aprovar a identidade visual premium para o "Mastermind Legado iGaming".                                                       | MKT              | 17/Junho        |
| B04  | Criar o manual de marca unificado (AF, Afiliarev, Mastermind) com diretrizes de tom de voz e comunicação.                                 | MKT              | 28/Junho        |
| B05  | Realizar sessão de fotos e vídeos profissionais de Antonio Fonseca para materiais de marketing dos lançamentos.                               | MKT, AF          | 07/Junho        |
| B06  | Desenvolver, aprovar e publicar a landing page principal do evento "Caixa Preta" (com VSL persuasivo e formulário de captura).             | MKT, DEV, AF     | 17/Junho        |
| B07  | Desenvolver e aprovar a landing page de interesse/aplicação para o "Mastermind Legado iGaming".                                             | MKT, DEV, AF     | 25/Julho        |
| B08  | Criar/otimizar perfis de Antonio Fonseca e Afiliarev no Instagram, Facebook, YouTube. Publicar os primeiros posts de "posicionamento".   | MKT              | 03/Junho        |
| B09  | Configurar a estrutura do Blog (Afiliarev ou pessoal AF) e publicar os primeiros 2-3 artigos de SEO sobre iGaming legal e oportunidades. | CON, AF, MKT, DEV | 10/Junho        |

**2.2 Aquecimento e Construção de Audiência para Evento "Caixa Preta" (Afiliarev MVP - *20/Maio - 17/Junho*)**

| ID    | Tarefa                                                                                                                                                                 | Responsável(eis) | Prazo Semanal/Diário      |
| :---- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------------------------ |
| AQ01  | Seguir o calendário editorial de aquecimento (Maio-Junho) com posts/vídeos diários de AF e MKT no IG/FB sobre "oportunidade iGaming", "segredos", "renda legal".         | AF, MKT          | Diário (Maio 20 - Jun 17) |
| AQ02  | Publicar 1 vídeo longo semanal de AF no YouTube (cortes para IG/FB) sobre "mercado bilionário", "bastidores éticos", "importância da legalidade".                         | AF, CON, MKT     | Semanal (Maio 20 - Jun 17) |
| AQ03  | Utilizar consistentemente a hashtag official do evento (Ex: #CaixaPretaRendaLegal) e CTAs para "Ficar de Olho" nas próximas revelações.                                   | MKT              | Diário (Maio 20 - Jun 17) |
| AQ04  | Criar e publicar posts segmentados (Jogadores, Afiliados, Agências, Donos de Casas) no IG/FB com linguagem de "oportunidade nos bastidores" e "legalidade".              | MKT, CON, AF     | 2-3x/semana (Junho)       |
| AQ05  | Realizar enquetes e caixas de perguntas semanais nos Stories de AF para coletar dores/desejos do público sobre renda extra, iGaming e conformidade.                      | AF, MKT          | Semanal (Maio 20 - Jun 17) |
| AQ06  | Gravar e postar vídeo de AF (1 min - 06/Junho) anunciando o evento "Caixa Preta" e a data de abertura das inscrições.                                                     | AF, MKT          | 06/Junho                  |
| AQ07  | Intensificar posts e stories de AF e MKT com contagem regressiva para abertura das inscrições do evento "Caixa Preta" (09/Junho - 17/Junho).                               | AF, MKT          | Diário (Jun 09 - Jun 17)  |
| AQ08  | Enviar email para a base de AF (se existir) anunciando o evento "Caixa Preta" e a data de abertura das inscrições (09/Junho).                                             | MKT              | 09/Junho                  |

**2.3 Captação de Leads para Evento "Caixa Preta" (Afiliarev MVP - *18/Junho - 05/Julho*)**

| ID    | Tarefa                                                                                                                                                 | Responsável(eis) | Prazo/Frequência         |
| :---- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :----------------------- |
| CAP01 | Lançar a página de captura do evento "Caixa Preta" com VSL de Antonio Fonseca (18/Junho).                                                                 | MKT, DEV, AF     | 18/Junho                 |
| CAP02 | Iniciar campanhas de tráfego pago (Meta Ads, Google Ads Discovery/YT) para a página de captura do evento.                                                | MKT              | 18/Junho (Contínuo)      |
| CAP03 | Publicar diariamente em todos os canais de AF (IG, FB, YT) conteúdo orgânico com CTA direto para inscrição no evento "Caixa Preta".                       | AF, MKT, CON     | Diário (18/Jun - 05/Jul) |
| CAP04 | Implementar sequência de emails automatizada de boas-vindas e aquecimento (dicas, prévias das aulas) para todos os inscritos no evento.                 | MKT              | Contínuo (18/Jun - 05/Jul) |
| CAP05 | Criar e gerenciar grupos VIP no WhatsApp/Telegram para inscritos, postando conteúdo exclusivo de AF (áudios, enquetes, bastidores) e fomentando interação. | MKT, OP          | Diário (18/Jun - 05/Jul) |
| CAP06 | Realizar 2 Lives semanais de Q&A com Antonio Fonseca no Instagram para aquecer os leads inscritos (temas relacionados às dores e ao evento).             | AF, MKT          | Semanal (18/Jun - 05/Jul) |
| CAP07 | Enviar emails e SMS (se aplicável) de lembrete intensivos nos dias 03, 04 e 05 de Julho para a Aula 01 do "Caixa Preta".                                   | MKT              | 03, 04, 05 de Julho      |

**2.4 Lançamento Afiliarev Start (Evento "Caixa Preta" - *06, 07, 08 de Julho*)**

| ID    | Tarefa                                                                                                                                                   | Responsável(eis) | Data/Horário         |
| :---- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------------------- |
| LEV01 | Revisar e testar tecnicamente todos os roteiros, materiais visuais e plataformas de transmissão para as 3 Aulas/Lives do evento "Caixa Preta".               | AF, CON, MKT, OP, DEV | Até 05 de Julho      |
| LEV02 | Enviar lembrete final (Email, SMS, Push Grupo VIP) 1 hora antes de cada aula do evento.                                                                   | MKT              | 06, 07, 08 de Julho  |
| LEV03 | **AULA 01 (06/Julho - 20h):** Realizar Live "A Mina de Ouro Escondida…" com Antonio Fonseca (YT/IG). Foco em oportunidade e legalidade. CTA para Aula 02. | AF, MKT, OP, DEV | 06/Julho - 20h       |
| LEV04 | Postar resumo dos principais insights da Aula 01 e reforçar convite para Aula 02 (IG, FB, Email).                                                         | MKT              | Noite de 06/Julho    |
| LEV05 | **AULA 02 (07/Julho - 20h):** Realizar Live "O Método 'Conector Lucrativo' Revelado…" com Antonio Fonseca. Revelar método, quebrar objeções. CTA para Aula 03. | AF, MKT, OP, DEV | 07/Julho - 20h       |
| LEV06 | Postar resumo da Aula 02 e gerar ENORME antecipação para a Aula 03 ("O Plano Completo + A CHAVE").                                                          | MKT, AF          | Noite de 07/Julho    |
| LEV07 | **AULA 03 (08/Julho - 20h):** Realizar Live "Seu Plano Detalhado e a Chave da 'Caixa Preta'…" com AF. Entregar plano, PITCH Afiliarev Start (R$197), OTOs. | AF, MKT, OP, DEV | 08/Julho - 20h       |
| LEV08 | **ABRIR CARRINHO AFILIAREV START:** Página de vendas no ar, links liberados no chat da live, email imediato para lista com oferta e bônus de ação rápida.   | MKT, DEV, OP     | Durante Aula 03     |

**2.5 Carrinho Aberto Afiliarev Start (08 de Julho - ~14 de Julho)**

| ID    | Tarefa                                                                                                                                                         | Responsável(eis) | Frequência/Prazo     |
| :---- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------------------- |
| CA01  | Disparar sequência de emails de vendas diária para a lista de leads (benefícios, quebra de objeções, prova social, escassez dos bônus de lançamento).           | MKT              | Diário               |
| CA02  | Realizar Lives curtas diárias de Antonio Fonseca (IG/FB) para tirar dúvidas sobre Afiliarev Start, mostrar a plataforma por dentro e reforçar a oferta.       | AF, MKT          | Diário               |
| CA03  | Publicar posts e stories diários no IG/FB com depoimentos (se surgirem rapidamente), benefícios do Afiliarev Start, e contagem regressiva para fim dos bônus/oferta. | MKT, AF          | Diário               |
| CA04  | Ativar campanhas de remarketing (Meta Ads, Google Ads) para visitantes da página de vendas que não compraram e para participantes do evento.                  | MKT              | Contínuo             |
| CA05  | Implementar a oferta do Downsell (Guia de Legalidade - R$19,90) na página de obrigado para quem tentou comprar o Afiliarev Start e não concluiu, OU via email para não compradores após 2-3 dias. | MKT, DEV         | A partir de ~10/Jul |
| CA06  | Monitorar vendas, ROI de anúncios, taxa de conversão da página de vendas e dos OTOs em tempo real. Ajustar campanhas se necessário.                          | MKT, OP          | Diário               |
| CA07  | Preparar e executar a comunicação de fechamento do carrinho (últimas 48h, últimas 24h, últimas horas) com forte senso de urgência e escassez.                 | MKT, AF          | ~12-14 de Julho      |
| CA08  | Realizar uma Live de Fechamento de Carrinho com Antonio Fonseca, oferecendo um último bônus ou tirando as últimas dúvidas.                                    | AF, MKT          | Último dia do carrinho|

**2.6 Pós-Lançamento Afiliarev Start e Pré-Lançamento Mastermind (Agosto - Início Setembro)**

| ID    | Tarefa                                                                                                                                                     | Responsável(eis) | Prazo Ideal         |
| :---- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------------------ |
| PLM01 | Iniciar o onboarding dos alunos do Afiliarev Start, com emails de boas-vindas, acesso à plataforma e à comunidade.                                          | OP, CON          | Imediato Pós-Compra |
| PLM02 | Coletar ativamente depoimentos em vídeo e texto dos primeiros alunos do Afiliarev Start, focando nas primeiras vitórias e na clareza do método.             | MKT, CON, OP     | A partir de Agosto  |
| PLM03 | AF iniciar produção de conteúdo no Blog/YT/IG/FB com temas mais estratégicos e de "Legado" ("Construindo Ativos no iGaming", "Mentalidade Empreendedora"). | AF, CON, MKT     | A partir de Agosto  |
| PLM04 | Criar e lançar a Isca Digital Premium para o Mastermind (Ex: Whitepaper/Webinar Exclusivo "O Framework do Legado iGaming por Antonio Fonseca").            | MKT, AF, CON     | 3ª Semana de Agosto |
| PLM05 | Desenvolver e executar sequência de emails para leads qualificados do Mastermind (capturados pela isca e segmentados da base Afiliarev).                 | MKT              | A partir de Agosto  |
| PLM06 | Planejar a participação estratégica de Antonio Fonseca no Conexão iGaming (ou evento similar em Setembro): definir tema da palestra, materiais, logística. | MKT, AF, LID     | Final de Agosto     |
| PLM07 | Identificar e agendar reuniões com VIPs, potenciais parceiros B2B e candidatos ao Mastermind para o evento de Setembro.                                      | AF, LID, MKT     | A partir de Agosto  |

**2.7 Lançamento Mastermind "Legado iGaming" (Setembro)**

| ID   | Tarefa                                                                                                                                               | Responsável(eis) | Prazo/Evento         |
| :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------------------- |
| LM01 | Finalizar e ensaiar a palestra de Antonio Fonseca para o Conexão iGaming, incluindo o anúncio e CTA para as aplicações do Mastermind.                     | AF, MKT          | Início de Setembro   |
| LM02 | Preparar o stand (se houver) ou material promocional específico do Mastermind para o evento.                                                            | MKT, OP          | Início de Setembro   |
| LM03 | Executar a palestra de AF no evento. Lançar a página de aplicação do Mastermind.                                                                        | AF, MKT, DEV     | Durante o Evento     |
| LM04 | Realizar encontros/jantares VIPs com leads ultra-qualificados para o Mastermind durante o evento.                                                        | AF, LID, OP      | Durante o Evento     |
| LM05 | Iniciar a divulgação da abertura das aplicações do Mastermind para a lista segmentada e canais de AF.                                                    | MKT              | Durante o Evento     |
| LM06 | Gerenciar o processo de análise de aplicações, agendamento e condução de entrevistas com os candidatos pré-selecionados ao Mastermind.                   | AF, LID, OP      | Pós-Evento          |
| LM07 | Enviar comunicados de aprovação e iniciar o processo de onboarding (contratos, pagamentos, acesso à comunidade) para os membros aceitos no Mastermind. | OP, AF, LEG      | Final de Setembro    |

---

**FASE 3: OPERAÇÕES, TECNOLOGIA E SUPORTE CONTÍNUO (A PARTIR DE JUNHO - CONTÍNUO)**

| ID   | Tarefa                                                                                                                                                     | Responsável(eis) | Frequência/Prazo    |
| :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------------------ |
| OT01 | Configurar, integrar e manter o sistema de CRM para gerenciamento de leads, clientes Afiliarev Start e candidatos/membros do Mastermind.                    | MKT, DEV, OP     | A partir de Junho   |
| OT02 | Garantir a segurança, backups diários, performance otimizada e atualizações da plataforma LMS e do website/blog Afiliarev.                                 | DEV              | Contínuo            |
| OT03 | Prover suporte técnico e pedagógico (dúvidas sobre conteúdo e plataforma) aos alunos do Afiliarev Start através dos canais definidos (FAQ, email, comunidade). | OP, CON          | Diário (Pós-Lanç.)  |
| OT04 | Moderar ativamente e diariamente as comunidades online (Afiliarev Start e, separadamente, Mastermind), fomentando engajamento, networking e respondendo dúvidas. | MKT, CON, OP     | Diário (Pós-Lanç.)  |
| OT05 | Gerenciar todo o ciclo financeiro: processamento de pagamentos (Afiliarev, OTOs, Downsell, Mastermind), emissão de NFs, controle de inadimplência, reembolsos. | OP, Financeiro   | Contínuo            |
| L01  | Elaborar, revisar e publicar Termos de Uso, Políticas de Privacidade e Contratos específicos para Afiliarev Start, OTOs, Downsell e Mastermind.              | LEG              | Até Final de Junho  |
| L02  | Realizar auditorias mensais da comunicação de marketing (anúncios, emails, posts) para garantir conformidade com Lei 14.790/2023 e CONAR.                   | LEG, MKT         | Mensal              |
| L03  | Agendar reuniões trimestrais com a consultoria legal para atualizações sobre a regulamentação iGaming e potenciais impactos no negócio.                     | LEG, LID         | Trimestral          |

---

**FASE 4: PÓS-LANÇAMENTO, CRESCIMENTO E EXPANSÃO B2B (A PARTIR DE OUTUBRO)**

| ID    | Tarefa                                                                                                                                                | Responsável(eis) | Prazo Ideal          |
| :---- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------------------- |
| PG01  | Implementar pesquisas de satisfação e canais formais de coleta de feedback para alunos Afiliarev e membros Mastermind. Analisar dados mensalmente.      | CON, AF, OP, MKT | A partir de Outubro  |
| PG02  | Com base no feedback e na evolução do mercado, planejar e produzir o primeiro lote de atualizações/novos módulos para a plataforma Afiliarev.          | CON, AF          | Q4 2025              |
| PG03  | Agendar e conduzir eventos online mensais (mentorias em grupo com AF/instrutores, Q&A temáticos, workshops práticos) para a comunidade Afiliarev.    | CON, AF, MKT     | Mensal (Pós-Lanç.)   |
| UPS01 | Desenvolver a estrutura completa do Upsell "Afiliarev PRO: Módulos Avançados de Tráfego e Funis" (conteúdo, página de vendas, oferta).                  | CON, MKT, AF     | Até Novembro 2025    |
| UPS02 | Realizar o primeiro lançamento interno do "Afiliarev PRO" para a base de alunos do Afiliarev Start.                                                      | MKT, AF          | Q4 2025 / Q1 2026    |
| B2B01 | Desenvolver o portfólio de serviços B2B da Afiliarev (Treinamento Corporativo, Consultoria, Conteúdo White-Label) com propostas comerciais claras.     | LID, AF, MKT     | Outubro - Novembro  |
| B2B02 | Iniciar a prospecção ativa (cold outreach, networking em eventos) para os serviços B2B, focando em operadores de iGaming e provedores de tecnologia.   | LID, AF          | A partir de Novembro |
| B2B03 | Estruturar o programa "Afiliado iGaming Certificado pela Afiliarev" (critérios, módulos de avaliação, benefícios da certificação).                       | CON, LID         | Q1 2026              |
| B2B04 | Agendar participação de AF/Afiliarev em pelo menos 2 eventos chave do setor iGaming no primeiro semestre de 2026 para promover os serviços B2B.        | LID, MKT         | Até Dezembro 2025    |
| KPI01 | Implementar e configurar dashboards de KPIs (Google Analytics, CRM, Plataforma de Pagamento, LMS) para monitoramento em tempo real.                     | MKT, OP, DEV     | Até final de Julho   |
| KPI02 | Realizar reuniões semanais de análise de KPIs de lançamento (Julho) e mensais para acompanhamento geral do negócio.                                       | LID, MKT, OP, AF | Contínuo             |

---

"Antonio, este é o mapa do caminho. É ambicioso, mas com sua expertise e uma equipe dedicada, é totalmente realizável. Vamos revisar juntos e ajustar o que for preciso para garantir que cada passo seja firme e estratégico!"
A Neon project can have one or more computes, each representing an individual Postgres instance. Storage is decoupled from these computes, meaning that the Postgres servers executing queries are physically separate from the data storage location. This separation offers numerous advantages, including enablement of Neon's autoscaling feature.

![High-level architecture diagram](/docs/introduction/autoscale-high-level-architecture.jpg)

Looking more closely, you can see that each Postgres instance operates within its own virtual machine inside a [Kubernetes cluster](/docs/reference/glossary#kubernetes-cluster), with multiple VMs hosted on each node of the cluster. Autoscaling is implemented by allocating and deallocating [vCPU](/docs/reference/glossary#vcpu) and [RAM](/docs/reference/glossary#ram) to each VM.

![Autoscaling diagram](/docs/introduction/autoscale-architecture.jpg)

## The autoscaler-agent

Each [Kubernetes node](/docs/reference/glossary#kubernetes-node) hosts a single instance of the [autoscaler-agent](/docs/reference/glossary#autoscaler-agent), which serves as the control mechanism for Neon's autoscaling system. The agent collects metrics from the VMs on its node, makes scaling decisions, and performs the necessary checks and requests to implement those decisions.

## The Kubernetes scheduler

A Neon-modified [Kubernetes scheduler](/docs/reference/glossary#kubernetes-scheduler) coordinates with the autoscaler-agent and is the single source of truth for resource allocation. The autoscaler-agent obtains approval for all upscaling from the scheduler. The scheduler maintains a global view of all resource usage changes and approves requests for additional resources from the autoscaler-agent or standard scheduling. In this way, the scheduler assumes responsibility for preventing overcommitting of memory resources. In the rare event that a node exhausts its resources, new pods are not scheduled on the node, and the autoscaler-agent is denied permission to allocate more resources.

## NeonVM

Kubernetes does not natively support the creation or management of VMs. To address this, Neon uses a tool called [NeonVM](/docs/reference/glossary#neonvm). This tool is a custom resource definition and controller for VMs, handling tasks such as adding or removing CPUs and memory. Internally, NeonVM utilizes [QEMU](/docs/reference/glossary#qemu) and [KVM](/docs/reference/glossary#kvm) (where available) to achieve near-native performance.

When an autoscaler-agent needs to modify a VM's resource allocation, it simply updates the corresponding NeonVM object in Kubernetes, and the VM controller then manages the rest of the process.

## Live migration

In cases where a Kubernetes node becomes saturated, NeonVM manages the process of [live migrating](/docs/reference/glossary#live-migration) a VM, transferring the VM from one machine to another with minimal interruptions (typically around 100ms). Live migration transmits the internal state of the original VM to a new one while the former continues to operate, swiftly transitioning to the new VM after most of the data is copied. From within the VM, the only indication that a migration occurred might be a temporary performance reduction. Importantly, the VM retains its IP address, ensuring that connections are preserved and queries remain uninterrupted.

The live migration process allows for the proactive reduction of node load by migrating VMs away before reaching capacity. Although it is still possible for the node to fill up in the interim, Neon's separation of storage and compute means that VMs typically use minimal disk space, resulting in fast migrations.

## Memory scaling

Postgres memory consumption can escalate rapidly in specific scenarios. Fortunately, Neon's autoscaling system is able to detect memory usage increases without constantly requesting metrics from the VM. This is accomplished by running Postgres within a [cgroups](/docs/reference/glossary#cgroups), which provides notifications when memory usage crosses a specified threshold. Using cgroups in this way requires running our [vm-monitor](/docs/reference/glossary#vm-monitor) in the VM alongside Postgres to request more resources from the autoscaler-agent when Postgres consumes too much memory. The vm-monitor also verifies that downscaling requests from an autoscaler-agent will leave sufficient memory leftover.

## Local File Cache

To expedite queries, the autoscaling system incorporates a Postgres extension that places a cache in front of the storage layer. Many queries benefit from this additional memory, particularly those requiring multiple database scans (such as creating an index). The [Local File Cache (LFC)](/docs/reference/glossary#local-file-cache) capitalizes on the additional memory allocated to the VM by dedicating a portion to the cache to itself. The cache is backed by disk and kept at a size intended to fit in the kernel page cache. Due to the storage model, writebacks are not required, resulting in near-instant evictions. The vm-monitor adjusts the LFC size when scaling occurs through the autoscaler-agent, ensuring seamless operation.

## Autoscaling source code

To further explore Neon's autoscaling implementation, visit Neon's [autoscaling](https://github.com/crialabs/autoscaling) GitHub repository. While not primarily designed for external use, Neon welcomes exploration and contributions.
