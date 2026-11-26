'use strict';
const templates={
starter:{name:'Benim Uygulamam',html:'<main><h1>Merhaba Dünya! 🚀</h1><p>Bu uygulama Ege App Builder ile oluşturuldu.</p><button id="hello">Tıkla</button><p id="result"></p></main>',css:'body{font-family:system-ui;text-align:center;padding:35px;background:#edf4ff;color:#123}button{border:0;border-radius:10px;background:#2563eb;color:white;padding:12px 18px}',js:"document.querySelector('#hello').addEventListener('click',()=>document.querySelector('#result').textContent='Çalışıyor!');"},
notes:{name:'Not Defteri',html:'<h1>📝 Not Defteri</h1><textarea id="note" placeholder="Notunu yaz..." rows="10"></textarea><p id="status"></p>',css:'body{font-family:system-ui;max-width:600px;margin:auto;padding:25px;background:#f7f9ff;color:#123}textarea{width:100%;box-sizing:border-box;padding:15px;font:inherit;border-radius:12px;border:1px solid #bbb}',js:"const note=document.querySelector('#note');note.value=localStorage.getItem('my-note')||'';note.addEventListener('input',()=>{localStorage.setItem('my-note',note.value);document.querySelector('#status').textContent='Kaydedildi';});"},
counter:{name:'Sayaç',html:'<h1>🔢 Sayaç</h1><p id="count">0</p><button id="minus">−</button><button id="plus">+</button>',css:'body{font-family:system-ui;text-align:center;padding:45px;background:#eef2ff;color:#14213d}#count{font-size:70px}button{font-size:25px;padding:10px 24px;margin:5px;border:0;border-radius:10px;background:#345cdb;color:white}',js:"let value=0;const display=document.querySelector('#count');document.querySelector('#plus').onclick=()=>display.textContent=++value;document.querySelector('#minus').onclick=()=>display.textContent=--value;"}
};
const els={name:document.querySelector('#name'),code:document.querySelector('#code'),frame:document.querySelector('#frame'),msg:document.querySelector('#message'),file:document.querySelector('#file')};
const valid=p=>p&&['name','html','css','js'].every(k=>typeof p[k]==='string')&&p.name.length<=60;
let project={...templates.starter};try{const saved=JSON.parse(localStorage.getItem('ege-app-builder-v2'));if(valid(saved))project=saved;}catch(_){}
let active='html';els.name.value=project.name;els.code.value=project[active];
function sync(){project[active]=els.code.value;project.name=els.name.value.trim()||'Uygulamam';}
const safeTitle=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const esc=(s,t)=>s.replace(new RegExp('</'+t,'gi'),'<\\/'+t);
function compose(){return '<!doctype html>\n<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+safeTitle(project.name)+'</title><style>'+esc(project.css,'style')+'</style></head><body>'+project.html+'<script>'+esc(project.js,'script')+'</scr'+'ipt></body></html>';}
function show(s){els.msg.textContent=s;}
function render(){sync();els.frame.srcdoc=compose();show('Önizleme güncellendi.');}
function switchTab(t){sync();active=t;els.code.value=project[t];document.querySelectorAll('.tab').forEach(b=>{const yes=b.dataset.tab===t;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});}
function download(content,filename,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function filename(){return project.name.normalize('NFKD').replace(/[^a-zA-Z0-9-_]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50)||'uygulama';}
function load(p){project={name:p.name,html:p.html,css:p.css,js:p.js};els.name.value=p.name;switchTab('html');render();}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
document.querySelector('#run').onclick=render;
document.querySelector('#apply').onclick=()=>{if(!confirm('Mevcut düzenleme seçilen şablonla değiştirilsin mi?'))return;load(templates[document.querySelector('#template').value]);show('Şablon yüklendi.');};
document.querySelector('#download').onclick=()=>{sync();download(compose(),filename()+'.html','text/html;charset=utf-8');show('HTML dosyası hazırlandı.');};
document.querySelector('#export').onclick=()=>{sync();download(JSON.stringify({format:'ege-app-builder',version:2,...project},null,2),filename()+'.json','application/json;charset=utf-8');show('Proje dosyası hazırlandı.');};
document.querySelector('#import').onclick=()=>els.file.click();
els.file.addEventListener('change',async()=>{const f=els.file.files?.[0];if(!f)return;try{if(f.size>1024*1024)throw Error('Dosya 1 MB sınırını aşıyor.');const p=JSON.parse(await f.text());if(!valid(p))throw Error('Geçersiz proje dosyası.');load(p);show('Proje içe aktarıldı.');}catch(e){show('İçe aktarma başarısız: '+e.message);}finally{els.file.value='';}});
document.querySelector('#save').onclick=()=>{sync();try{localStorage.setItem('ege-app-builder-v2',JSON.stringify(project));show('Proje tarayıcıya kaydedildi.');}catch(e){show('Kaydetme başarısız: depolama dolu veya kapalı.');}};
document.querySelector('#reset').onclick=()=>{if(!confirm('Başlangıç şablonuna dönülsün mü?'))return;localStorage.removeItem('ege-app-builder-v2');load(templates.starter);show('Sıfırlandı.');};
render();