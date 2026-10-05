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
  document.title = NOME + " | Clínica médica com agendamento online";
}
document.querySelectorAll("a[data-wa]").forEach(a => (a.href = waUrl(a.dataset.wa)));
if (params.get("wa")) document.querySelectorAll("[data-phone]").forEach(el => (el.textContent = fmtPhone(WA)));

/* Agenda de exemplo: próximos 5 dias úteis com horários livres simulados */
const TIMES = ["08:00", "08:40", "09:20", "10:00", "14:00", "14:40", "15:20", "16:00"];
const $ = id => document.getElementById(id);
const espEl = $("esp"), diasEl = $("dias"), slotsEl = $("slots"), confirmEl = $("confirm"), resumoEl = $("resumo");

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
/* dias da semana (0 = domingo) em que cada especialidade atende, na ordem do select */
const ATENDE = [[1, 3, 5], [2, 4], [3, 5], [1, 2, 3, 4], [2, 5], [1, 4]];
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
    b.setAttribute("aria-label", dataLonga(d));
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
espEl.onchange = () => { horaSel = null; diaSel = Math.max(0, DIAS.findIndex(atende)); renderDias(); renderSlots(); atualizar(); };

diaSel = Math.max(0, DIAS.findIndex(atende));
renderDias(); renderSlots(); atualizar();
