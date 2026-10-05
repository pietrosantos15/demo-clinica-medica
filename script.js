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
  document.title = NOME + " | Consultas e exames com agendamento por WhatsApp";
}
document.querySelectorAll("a[data-wa]").forEach(a => (a.href = waUrl(a.dataset.wa)));
if (params.get("wa")) document.querySelectorAll("[data-phone]").forEach(el => (el.textContent = fmtPhone(WA)));

/* Especialidades: a ordem define o índice usado em ATENDE */
const ESPECIALIDADES = [
  { n: "Clínico geral", d: "Check-up, acompanhamento de rotina e encaminhamentos." },
  { n: "Pediatria", d: "Bebês, crianças e adolescentes: puericultura e consultas." },
  { n: "Ginecologia", d: "Saúde da mulher, prevenção e acompanhamento." },
  { n: "Cardiologia", d: "Pressão arterial, coração e avaliação para exercícios." },
  { n: "Dermatologia", d: "Pele, cabelos e unhas, com dermatoscopia." },
  { n: "Ortopedia", d: "Ossos, articulações, coluna e lesões esportivas." }
];
const ATENDE = [[1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5], [2, 4, 6], [1, 3, 5], [2, 4], [1, 5]];
const DIAS_TXT = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const ATENDIMENTOS = ["Particular", "Plano Aurora", "Plano Horizonte", "Vale Vida Saúde", "Nacional Mais", "Unimed Exemplo"];
const MEDICOS = [
  ["Dra. Helena Vasconcelos", 0], ["Dr. Rafael Moura", 3], ["Dra. Letícia Barros", 1],
  ["Dra. Paula Sampaio", 2], ["Dra. Camila Duarte", 4], ["Dr. Marcos Teixeira", 5]
];

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const espEl = $("esp"), convEl = $("conv"), pacEl = $("pac"), diasEl = $("dias"), slotsEl = $("slots"), confirmEl = $("confirm"), resumoEl = $("resumo");
ESPECIALIDADES.forEach(e => espEl.add(new Option(e.n, e.n)));
ATENDIMENTOS.forEach(c => convEl.add(new Option(c, c)));

/* Lista de especialidades */
const dias = i => ATENDE[i].map(d => DIAS_TXT[d].slice(0, 3)).join(", ");
$("esp-list").innerHTML = ESPECIALIDADES.map((e, i) =>
  `<li><button type="button" data-i="${i}"><b>${esc(e.n)}</b><span>${esc(e.d)}</span><em>Agendar</em></button></li>`).join("");

/* Equipe (nomes fictícios; trocar pelos dados reais) */
$("team").innerHTML = MEDICOS.map(([nome, i]) => {
  const ini = nome.replace(/^Dra?\.\s*/, "").split(" ").filter(Boolean).map(p => p[0]).slice(0, 2).join("");
  return `<li class="doc"><span class="avatar" aria-hidden="true">${esc(ini)}</span><div><h3>${esc(nome)}</h3><div class="e">${esc(ESPECIALIDADES[i].n)}</div><div class="crm">CRM/UF 000000</div></div></li>`;
}).join("");

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
  const nome = pacEl.value.trim();
  const base = `Olá! Gostaria de agendar uma consulta de ${espEl.value} (${convEl.value})`;
  const fim = nome ? `. Paciente: ${nome}.` : ".";
  if (!horaSel) {
    resumoEl.textContent = atende(DIAS[diaSel]) ? "Selecione um dia e um horário." : `${espEl.value} não atende neste dia. Escolha outro dia.`;
    confirmEl.href = waUrl(base + fim);
    return;
  }
  const quando = `${dataLonga(DIAS[diaSel])}, às ${horaSel}`;
  resumoEl.textContent = `${espEl.value}: ${quando}`;
  confirmEl.href = waUrl(`${base} em ${quando}${fim}`);
}
function escolherEsp(i) {
  espEl.selectedIndex = i;
  horaSel = null; diaSel = Math.max(0, DIAS.findIndex(atende));
  renderDias(); renderSlots(); atualizar();
}
espEl.onchange = () => escolherEsp(espEl.selectedIndex);
convEl.onchange = atualizar;
pacEl.oninput = atualizar;
escolherEsp(0);

$("esp-list").addEventListener("click", ev => {
  const b = ev.target.closest("button[data-i]");
  if (!b) return;
  escolherEsp(+b.dataset.i);
  const a = $("agenda");
  a.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  a.focus({ preventScroll: true });
});
