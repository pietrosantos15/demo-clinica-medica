# Clínica Lumiar: site de demonstração para clínica médica

Site estático (HTML, CSS e JavaScript puro, sem build) para mostrar a clientes como ficaria o site de uma clínica médica de pequeno/médio porte. Marca, equipe, convênios e endereço são fictícios. Estrutura inspirada em landing pages do ramo (Dr. Consulta e página de agendamento do Hospital Sírio-Libanês); nenhum logotipo, texto ou imagem foi copiado. Sem depoimentos, promessas de resultado ou preços promocionais (regras do CFM).

## Identidade
- Paleta: azul-petróleo `#0F4C5C` e `#0A3743`, gelo `#F3F7F6`, laranja discreto `#E58A4B` (foco e detalhes), verde WhatsApp `#15803D`.
- Fontes: Source Serif 4 (títulos) e Figtree (texto), Google Fonts.

## Seções
Hero com CTA de WhatsApp, faixa de fatos, especialidades, convênios, como funciona + agenda (próximos dias úteis, horários por especialidade, mensagem pronta no WhatsApp), equipe, exames, como chegar (endereço, horários, estacionamento), FAQ e rodapé com responsável técnico.

## Imagens (hotlink Unsplash, em `index.html`)
- Hero: médica sorrindo em consulta (photo-1631217868264-e5b90bb7e133).
- Especialidades: pediatra examinando criança (photo-1632053002928-1919605ee6f7).
- Exames: tubo de coleta em laboratório (photo-1639772823849-6efbd173043c).
- Como chegar: recepção de clínica (photo-1764727291644-5dcb0b1a0375).

Na entrega, troque por fotos reais do cliente (pasta `assets/`, basta alterar o `src`).

## Personalizar por link
`?wa=5515991234567&nome=Clinica%20da%20Cliente` troca WhatsApp, telefone exibido, nome e título da aba.

## Antes de entregar
- [ ] Nome, logotipo (`<symbol id="logo">`) e cores (`:root` no `style.css`).
- [ ] WhatsApp: busque `5500900000000` e `(00) 90000-0000`.
- [ ] Endereço, horários, CEP, mapa e CNPJ.
- [ ] Médicos e CRM reais (`MEDICOS` no `script.js`; hoje `CRM/UF 000000`) e responsável técnico no rodapé.
- [ ] Convênios (`ATENDIMENTOS` no `script.js` e seção de convênios) e dias por especialidade (`ATENDE`).
- [ ] Remova "Site de demonstração" do rodapé e a barra superior.

A agenda mostra horários de exemplo gerados no navegador; só monta a mensagem de WhatsApp.

## Arquivos
`index.html` · `style.css` · `script.js`
