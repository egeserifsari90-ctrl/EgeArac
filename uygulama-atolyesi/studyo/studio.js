"use strict";
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const colors = {"#F08B68":"Mercan","#BCA9E2":"Lavanta","#A9C890":"Adaçayı","#86B7D9":"Gökyüzü","#EAC866":"Bal"};
const key = "ege-atolye-projeleri-v1";
const repo = "https://github.com/egeserifsari90-ctrl/EgeArac";
const branch = "uygulama-atolyesi";
const icons = {
  git:"M7 6v12m10-12v2c0 4-2.5 6-7 6H7 M9 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M19 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M9 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  export:"M12 3v12m-4-4 4 4 4-4 M4 15v5h16v-5",
  sliders:"M4 7h7m5 0h4M4 17h2m6 0h8 M11 4v6 M8 14v6",
  design:"m4 15 10-10 5 5L9 20H4v-5Zm8-8 5 5",
  code:"m7 7-5 5 5 5m10-10 5 5-5 5m-4-14-3 18",
  phone:"M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm3 17h4",
  reload:"M20 7v5h-5 M19 11a7 7 0 1 0-1 6"
};
for(const el of $$("i[data-icon]")){
  el.setAttribute("aria-hidden","true");
  el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + icons[el.dataset.icon] + '"/></svg>';
}
let active = "focus";
let lang = "html";
const drafts = {};
for(const [name, template] of Object.entries(TEMPLATES)){
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  drafts[name] = {...template, id:"p" + [...bytes].map(b=>b.toString(16).padStart(2,"0")).join("")};
}
try{
  const data = JSON.parse(localStorage.getItem(key));
  if(data && Object.hasOwn(drafts,data.active)) active = data.active;
  for(const [name, fallback] of Object.entries(drafts)){
    const draft = data?.drafts?.[name];
    if(!draft) continue;
    for(const field of ["name","sub","html","css","js"]) if(typeof draft[field] === "string") fallback[field] = draft[field];
    if(Object.hasOwn(colors,draft.color)) fallback.color = draft.color;
    if(Number.isInteger(draft.minutes) && draft.minutes >= 1 && draft.minutes <= 180) fallback.minutes = draft.minutes;
    if(/^p[a-z0-9]{6,40}$/.test(draft.id)) fallback.id = draft.id;
  }
}catch{}
const draft = () => drafts[active];
function save(){
  try{
    localStorage.setItem(key, JSON.stringify({active,drafts}));
    $("#saved").textContent = "Cihaza kaydedildi";
  }catch{ $("#saved").textContent = "Kayıt kapalı · Dışa aktar"; }
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]);
}
function renderApp(app){
  const name = app.name.trim() || "Uygulamam";
  const config = JSON.stringify({name,sub:app.sub,color:app.color,minutes:app.minutes,id:app.id}).replace(/</g,"\\u003c");
  return ['<!doctype html><html lang="tr"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="atolye-paket" content="studio.atolye.' + app.id + '">',
    '<title>' + escapeHtml(name) + '</title><style>:root{--accent:' + app.color + '}\n' + app.css.replace(/<\/style/gi,"<\\/style") + '</style></head><body>',
    '<header><h1>' + escapeHtml(name) + '</h1><p>' + escapeHtml(app.sub) + '</p></header><main>' + app.html + '</main>',
    '<script>const APP = ' + config + ';\n' + app.js.replace(/<\/script/gi,"<\\/script") + '\n</script></body></html>'].join("\n");
}
let previewTimer;
function preview(){
  clearTimeout(previewTimer);
  $("iframe").srcdoc = renderApp(draft());
}
function update(){save();clearTimeout(previewTimer);previewTimer = setTimeout(preview,250);}
function paintColors(){
  for(const btn of $$("#colors button")) btn.setAttribute("aria-pressed",btn.dataset.color === draft().color);
  $("#color-name").textContent = colors[draft().color];
}
for(const [color,name] of Object.entries(colors)){
  const btn = document.createElement("button");
  btn.dataset.color = color; btn.style.setProperty("--swatch",color);
  btn.setAttribute("aria-label",name); btn.title = name;
  btn.onclick = () => { draft().color = color; paintColors(); update(); };
  $("#colors").append(btn);
}
function paintCode(){
  $("#source").value = draft()[lang];
  for(const btn of $$("[data-lang]")) btn.setAttribute("aria-pressed",btn.dataset.lang === lang);
}
function loadDraft(){
  for(const btn of $$("[data-t]")) btn.setAttribute("aria-pressed",btn.dataset.t === active);
  for(const field of ["name","sub","minutes"]) $("#" + field).value = draft()[field];
  $("#minutes-row").hidden = active !== "focus";
  paintColors(); paintCode(); preview();
}
for(const btn of $$("[data-t]")) btn.onclick = () => {active = btn.dataset.t; loadDraft(); save();};
for(const field of ["name","sub"]) $("#" + field).oninput = e => {draft()[field] = e.target.value; update();};
$("#minutes").oninput = e => {if(e.target.value && e.target.validity.valid) {draft().minutes = e.target.valueAsNumber; update();}};
$("#minutes").onchange = e => {e.target.value = draft().minutes;};
function setTab(code){
  $("#design").hidden = code; $("#code").hidden = !code;
  $("#design-tab").setAttribute("aria-pressed",!code); $("#code-tab").setAttribute("aria-pressed",code);
}
$("#design-tab").onclick = () => setTab(false); $("#code-tab").onclick = () => setTab(true);
for(const btn of $$("[data-lang]")) btn.onclick = () => {lang = btn.dataset.lang; paintCode();};
$("#source").oninput = e => {draft()[lang] = e.target.value; update();};
$("#restart").onclick = preview;
$("#export").onclick = () => {$("#download-status").textContent = ""; $("#download").showModal();};
$("#close").onclick = () => $("#download").close();
$("#upload-link").href = repo + "/upload/" + branch + "/uygulama-atolyesi/girdi";
$("#actions-link").href = repo + "/actions?query=workflow%3A%22At%C3%B6lye+APK%22+branch%3A" + branch;
function downloadFile(blob,fileName){
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = fileName;
  document.body.append(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
$("#html-download").onclick = () => {
  downloadFile(new Blob([renderApp(draft())],{type:"text/html;charset=utf-8"}),"index.html");
  $("#download-status").textContent = "index.html hazır.";
};
$("#android-download").onclick = async () => {
  const status = $("#download-status");
  try{
    const response = await fetch("android-files.json");
    if(!response.ok) throw new Error("bundle");
    const files = await response.json();
    files["uygulama-atolyesi/girdi/index.html"] = renderApp(draft());
    downloadFile(makeZip(files),"atolye-android.zip");
    status.textContent = "Android projesi hazır. ZIP’i açtığında içindeki README dosyasını izleyebilirsin.";
  }catch {status.textContent = "Android proje dosyaları okunamadı. Sayfayı yenileyip tekrar dene.";}
};
loadDraft();
