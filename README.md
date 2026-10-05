# Meridiano Saúde: site de demonstração para rede de clínicas

Site estático (HTML, CSS e JavaScript puro, sem build) para mostrar a clientes como ficaria o site de uma rede de saúde. Nome, profissionais, unidades, convênios e conteúdo são fictícios. A identidade é **inspirada em** redes de saúde institucionais (referência de estrutura: home do Hospital Sírio-Libanês e o universo de redes como Dr. Consulta e Dasa). Nenhum logotipo, texto, imagem ou nome de marca real foi copiado: o logotipo "Meridiano" é original, em SVG inline.

## Identidade
- Paleta: azul institucional `#0B3C7D`, azul profundo `#082C5C`, turquesa saúde `#00A38C` (texto/botões em `#007A69`), cinza-gelo `#F2F6FA`, branco. Laranja `#C2410C` apenas para pronto atendimento.
- Fonte: Figtree (Google Fonts), com fallback para fontes do sistema.
- Cantos de 10 a 14 px, ícones e ilustração em SVG/CSS, sem imagens externas.

## Ver no ar
No GitHub: **Settings > Pages > Deploy from a branch > `main` / `/ (root)`**. O link fica em `https://SEU-USUARIO.github.io/demo-clinica-medica/`.

## Personalizar para um cliente sem editar código
```
https://SEU-USUARIO.github.io/demo-clinica-medica/?wa=5515991234567&nome=Clinica%20da%20Cliente
```
- `wa`: número com código do país e DDD, só dígitos. Troca todos os botões, a agenda e o telefone exibido.
- `nome`: troca o nome da marca no topo, no rodapé e na aba do navegador.

## Entregar de verdade ao cliente
- [ ] Nome, logotipo (`<symbol id="logo">` no `index.html`) e paleta (variáveis `:root` no `style.css`).
- [ ] Número do WhatsApp: busque `5500900000000` e `(00) 90000-0000` no `index.html`.
- [ ] Endereços, horários e links de mapa das unidades.
- [ ] Profissionais e **CRM de cada médico** (lista `MEDICOS` no `script.js`; hoje todos usam `CRM/UF 000000`).
- [ ] **Responsável técnico e CRM** no rodapé (hoje `Dr(a). Nome Sobrenome, CRM/UF 000000`): obrigatório em material de clínicas.
- [ ] Convênios reais (lista `CONVS` no `script.js` e os selects do `index.html`).
- [ ] Dias de atendimento: constante `ATENDE` do `script.js`, na mesma ordem de `ESPECIALIDADES`.
- [ ] Portal do paciente e telemedicina: apontar para os sistemas reais.
- [ ] Artigos do blog: substituir por conteúdo revisado pela clínica.
- [ ] Remova a frase "Site de demonstração" do rodapé.

A agenda mostra horários de exemplo gerados no navegador. Para uma agenda real, o cliente precisa de um sistema de agendamento: este site só monta a mensagem de WhatsApp.

## Arquivos
`index.html` (conteúdo) · `style.css` (visual) · `script.js` (busca de médicos, agenda, WhatsApp e parâmetros do link)
