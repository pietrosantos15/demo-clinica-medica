/* Personalização por link: ?wa=5511999998888&nome=Nome%20da%20Clínica */
const params = new URLSearchParams(location.search);
const WA = (params.get("wa") || "5500900000000").replace(/\D/g, "");
const NOME = params.get("nome");
const waUrl = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const fmtPhone = n => {
  const d = n.replace(/^55/, "");
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
       : d.length === 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : n;
};

if (NOME) {
  document.querySelectorAll("[data-brand]").forEach(el => (el.textContent = NOME));
  document.title = NOME + " | Rede de clínicas com agendamento online";
}
document.querySelectorAll("a[data-wa]").forEach(a => (a.href = waUrl(a.dataset.wa)));
if (params.get("wa")) document.querySelectorAll("[data-phone]").forEach(el => (el.textContent = fmtPhone(WA)));

/* Especialidades: a ordem define o índice usado em ATENDE */
const ESPECIALIDADES = [
  { n: "Clínico geral", ic: "steth", d: "Avaliação geral, acompanhamento e encaminhamentos." },
  { n: "Cardiologia", ic: "heart", d: "Cuidado do coração e da pressão arterial." },
  { n: "Dermatologia", ic: "skin", d: "Pele, cabelos e unhas em todas as idades." },
  { n: "Pediatria", ic: "kid", d: "Acompanhamento de bebês, crianças e adolescentes." },
  { n: "Ginecologia", ic: "fem", d: "Saúde da mulher, prevenção e acompanhamento." },
  { n: "Ortopedia", ic: "bone", d: "Ossos, articulações e músculos." },
  { n: "Oftalmologia", ic: "eye", d: "Saúde dos olhos e da visão." },
  { n: "Endocrinologia", ic: "drop", d: "Hormônios, metabolismo e diabetes." }
];
const CONVS = ["Particular", "Plano Aurora", "Plano Horizonte", "Vale Vida Saúde", "Nacional Mais"];
const MEDICOS = [
  ["Dra. Helena Vasconcelos", 0, "Centro", [0, 1, 2, 3]],
  ["Dr. Otávio Lacerda", 0, "Jardim Norte", [0, 2, 4]],
  ["Dr. Rafael Moura", 1, "Centro", [0, 1, 3]],
  ["Dra. Beatriz Almeida", 1, "Jardim Norte", [0, 2, 3, 4]],
  ["Dra. Camila Duarte", 2, "Centro", [0, 1, 2]],
  ["Dra. Letícia Barros", 3, "Centro", [0, 1, 2, 3, 4]],
  ["Dr. Gustavo Pereira", 3, "Jardim Norte", [0, 3, 4]],
  ["Dra. Paula Sampaio", 4, "Centro", [0, 1, 4]],
  ["Dr. Marcos Teixeira", 5, "Jardim Norte", [0, 2, 3]],
  ["Dra. Inês Carvalho", 6, "Centro", [0, 1, 2, 4]],
  ["Dr. Henrique Toledo", 7, "Jardim Norte", [0, 1, 3]],
  ["Dra. Marina Figueiredo", 7, "Centro", [0, 2, 4]]
].map(([nome, esp, unidade, conv]) => ({ nome, esp, unidade, conv: conv.map(i => CONVS[i]) }));

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ico = n => `<svg aria-hidden="true"><use href="#i-${n}"/></svg>`;
const espEl = $("esp"), diasEl = $("dias"), slotsEl = $("slots"), confirmEl = $("confirm"), resumoEl = $("resumo");

ESPECIALIDADES.forEach((e, i) => {
  ["f-esp", "m-esp"].forEach(id => $(id).add(new Option(e.n, i)));
  espEl.add(new Option(e.n, e.n));
});

/* Agenda de exemplo: próximos 5 dias úteis com horários livres simulados */
const TIMES = ["08:00", "08:40", "09:20", "10:00", "14:00", "14:40", "15:20", "16:00"];

function proximosDias(n) {
  const out = [], d = new Date();
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
  }
  return out;
}
const DIAS = proximosDias(5);
const semana = d => new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(d).replace(".", "");
const dataLonga = d => new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(d);
/* dias da semana (0 = domingo) em que cada especialidade atende, na ordem de ESPECIALIDADES */
const ATENDE = [[1, 3, 5], [2, 4], [3, 5], [1, 2, 3, 4], [2, 5], [1, 4], [2, 3, 5], [1, 4, 5]];
const DIAS_TXT = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const atende = d => ATENDE[espEl.selectedIndex].includes(d.getDay());
const livre = (d, i) => atende(d) && (d.getDate() * 7 + i * 3 + espEl.selectedIndex) % 5 !== 0;

let diaSel = 0, horaSel = null;

function renderDias() {
  diasEl.innerHTML = "";
  DIAS.forEach((d, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "dia";
    b.setAttribute("aria-pressed", i === diaSel);
    b.classList.toggle("off", !atende(d));
    b.setAttribute("aria-label", dataLonga(d) + (atende(d) ? "" : ", sem atendimento"));
    b.innerHTML = `${semana(d)}<strong>${d.getDate()}</strong>`;
    b.onclick = () => { diaSel = i; horaSel = null; renderDias(); renderSlots(); atualizar(); };
    diasEl.appendChild(b);
  });
}
function renderSlots() {
  slotsEl.innerHTML = "";
  TIMES.forEach((t, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "slot"; b.textContent = t;
    b.disabled = !livre(DIAS[diaSel], i);
    b.setAttribute("aria-pressed", t === horaSel);
    b.onclick = () => { horaSel = t; renderSlots(); atualizar(); };
    slotsEl.appendChild(b);
  });
}
function atualizar() {
  const ok = !!horaSel;
  confirmEl.setAttribute("aria-disabled", !ok);
  if (!ok) { resumoEl.textContent = atende(DIAS[diaSel]) ? "Selecione um dia e um horário." : `${espEl.value} não atende neste dia. Escolha outro dia.`; confirmEl.href = waUrl("Olá! Gostaria de agendar uma consulta."); return; }
  const quando = `${dataLonga(DIAS[diaSel])}, às ${horaSel}`;
  resumoEl.textContent = `${espEl.value}: ${quando}`;
  confirmEl.href = waUrl(`Olá! Gostaria de agendar uma consulta de ${espEl.value} em ${quando}.`);
}
function escolherEsp(i) {
  espEl.selectedIndex = i;
  horaSel = null; diaSel = Math.max(0, DIAS.findIndex(atende));
  renderDias(); renderSlots(); atualizar();
}
espEl.onchange = () => escolherEsp(espEl.selectedIndex);
escolherEsp(0);

/* Busca de profissionais */
const docsEl = $("docs"), countEl = $("med-count");
const mEsp = $("m-esp"), mConv = $("m-conv");
function renderMedicos() {
  const e = mEsp.value, c = mConv.value;
  const lista = MEDICOS.filter(m => (e === "" || m.esp === +e) && (c === "" || m.conv.includes(c)));
  countEl.textContent = lista.length ? `${lista.length} ${lista.length === 1 ? "profissional encontrado" : "profissionais encontrados"}` : "Nenhum profissional encontrado";
  docsEl.innerHTML = lista.length ? "" : `<li class="empty">Nenhum profissional com esses filtros. Tente outro convênio ou chame a central no WhatsApp.</li>`;
  lista.forEach(m => {
    const esp = ESPECIALIDADES[m.esp];
    const ini = m.nome.replace(/^Dra?\.\s*/, "").split(" ").filter(Boolean).map(p => p[0]).slice(0, 2).join("");
    const li = document.createElement("li");
    li.className = "doc";
    li.innerHTML = `<div class="doc-top"><span class="avatar" aria-hidden="true">${esc(ini)}</span><div><h3>${esc(m.nome)}</h3><div class="esp">${esc(esp.n)}</div><div class="crm">CRM/UF 000000</div></div></div>
      <p class="meta">Unidade ${esc(m.unidade)} · ${ATENDE[m.esp].map(d => DIAS_TXT[d]).join(", ")}</p>
      <div class="conv">${m.conv.map(x => `<span>${esc(x)}</span>`).join("")}</div>
      <a class="btn" href="#agenda" data-esp="${m.esp}">Agendar consulta<span class="sr"> com ${esc(m.nome)}</span></a>`;
    docsEl.appendChild(li);
  });
}
mEsp.onchange = mConv.onchange = renderMedicos;
$("filters").onsubmit = e => e.preventDefault();
docsEl.addEventListener("click", ev => {
  const a = ev.target.closest("a[data-esp]");
  if (!a) return;
  ev.preventDefault();
  escolherEsp(+a.dataset.esp);
  $("agenda").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  $("agenda").focus({ preventScroll: true });
});
/* Busca do hero: aplica os filtros e leva à lista */
$("finder").onsubmit = ev => {
  ev.preventDefault();
  mEsp.value = $("f-esp").value; mConv.value = $("f-conv").value;
  renderMedicos();
  const s = $("medicos");
  s.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  s.focus({ preventScroll: true });
};
renderMedicos();

/* Centros de especialidade */
$("centers").innerHTML = ESPECIALIDADES.map((e, i) => `<li class="center"><span class="qi">${ico(e.ic)}</span><h3>${esc(e.n)}</h3><p>${esc(e.d)}</p><a href="#medicos" data-centro="${i}">Ver profissionais ${ico("arrow")}</a></li>`).join("");
$("centers").addEventListener("click", ev => {
  const a = ev.target.closest("a[data-centro]");
  if (!a) return;
  mEsp.value = a.dataset.centro; renderMedicos();
});
