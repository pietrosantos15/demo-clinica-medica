# Clínica Vitta: site de demonstração para clínica médica

Site estático (HTML, CSS e JavaScript puro, sem build) para mostrar a clientes como ficaria a página da clínica deles. Conteúdo, nomes e horários são fictícios.

## Ver no ar
No GitHub: **Settings > Pages > Deploy from a branch > `main` / `/ (root)`**. O link fica em `https://SEU-USUARIO.github.io/demo-clinica-medica/`.

## Personalizar para um cliente sem editar código
Acrescente parâmetros ao link:

```
https://SEU-USUARIO.github.io/demo-clinica-medica/?wa=5515991234567&nome=Clinica%20da%20Cliente
```

- `wa`: número com código do país e DDD, só dígitos. Troca todos os botões, a agenda e o telefone exibido.
- `nome`: troca o nome da clínica no topo, no rodapé e na aba do navegador.

## Entregar de verdade ao cliente
Antes de publicar para o cliente, troque:

- [ ] Número do WhatsApp: busque `5500900000000` e `(00) 90000-0000` no `index.html`.
- [ ] Nome, endereço, horários e link do Google Maps.
- [ ] Especialidades, profissionais e **CRM de cada médico** (a tabela usa `CRM 00000/SP`).
- [ ] **Responsável técnico e CRM** no rodapé: é obrigatório em material de clínicas.
- [ ] Dias de atendimento: ficam na tabela do `index.html` **e** na constante `ATENDE` do `script.js`.
- [ ] Valor da consulta particular e política de retorno.
- [ ] Remova a frase "Site de demonstração" do rodapé.

A agenda mostra horários de exemplo gerados no navegador. Para uma agenda real, o cliente precisa de um sistema de agendamento: este site só monta a mensagem de WhatsApp.

## Arquivos
`index.html` (conteúdo) · `style.css` (visual) · `script.js` (agenda de exemplo, WhatsApp e parâmetros do link)
