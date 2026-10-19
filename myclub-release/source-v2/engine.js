// Deterministic scene engine: render(t) poses every element for time t; renderAsync(t) also waits for footage frames.
(function(){
const FPS=30, XF=0.6, LEAD=0.7, TAIL=1.6;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const eo=p=>1-Math.pow(1-p,3);
const eio=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
const eback=p=>{const c=1.70158,c3=c+1;return 1+c3*Math.pow(p-1,3)+c*Math.pow(p-1,2);};
const fmt=(v,dec)=>v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');

// ---- footage playback schedule: frames advance at `speed`, with an optional freeze before each step change
function schedule(flow,speed,hold){
  const pieces=[]; let t=LEAD;
  const cuts=flow.steps.map(s=>s[0]).slice(1).concat([flow.n]);
  let f=0;
  cuts.forEach((end,i)=>{
    const len=(end-f)/(FPS*speed);
    pieces.push({t0:t,t1:t+len,f0:f,f1:end,step:i}); t+=len;
    if(hold&&i<cuts.length-1){pieces.push({t0:t,t1:t+hold,f0:end-1,f1:end-1,step:i});t+=hold;}
    f=end;
  });
  return {pieces,dur:t+TAIL};
}
function poseFlow(card,l){
  const sc=card._sched, flow=card._flow; let f=0, step=0;
  if(l>=LEAD){
    const p=sc.pieces.find(p=>l<p.t1)||sc.pieces[sc.pieces.length-1];
    f=p.f0===p.f1?p.f0:Math.floor(p.f0+(p.f1-p.f0)*clamp((l-p.t0)/(p.t1-p.t0)));
    step=p.step;
  }
  f=Math.min(flow.n-1,Math.max(0,f));
  const src=`flows/${card.dataset.flow}/${String(f).padStart(5,'0')}.jpg`;
  if(card._img.getAttribute('src')!==src){card._img.setAttribute('src',src);pending.push(card._img);}
  if(card._steps) card._steps.forEach((el,i)=>{
    el.classList.toggle('done',i<step); el.classList.toggle('now',i===step&&l>=LEAD-0.2);
  });
  if(card._bar) card._bar.style.transform=`scaleX(${clamp((l-LEAD)/(sc.dur-LEAD-TAIL))})`;
}
let pending=[];

// ---- build flow scenes from <section data-flow="F1" data-speed data-hold> and pair scenes data-pair="F8,F9"
function buildFlowScene(s){
  const key=s.dataset.flow, fl=FLOWS[key];
  const speed=parseFloat(s.dataset.speed||1), hold=parseFloat(s.dataset.hold||0);
  s.classList.add('dark','flowscene');
  s.innerHTML=`<div class="glow" data-drift="1" style="width:1300px;height:1300px;left:-500px;top:-500px"></div>
  <div class="stage">
    <div class="abs fpanel">
      <div class="row" style="gap:12px;align-items:center" data-in="0.05">
        <span class="fchip">${s.dataset.label||('Flow '+fl.num)}</span><span class="fwho">${esc(fl.who)}</span></div>
      <h2 class="ftitle" data-in="0.15">${esc(s.dataset.title||fl.title)}</h2>
      <div class="fsteps" data-in="0.35">${fl.steps.map(st=>`<div class="fstep"><span class="fdot"></span><span>${esc(st[1])}</span></div>`).join('')}</div>
      <div class="ftrack" data-in="0.35"><div class="fbar"></div></div>
      <div class="fdemo" data-in="0.5">Demo merchant: Cafe Bateel</div>
    </div>
    <div class="abs fcard" data-flow="${key}" data-in="0.1" data-y="60" data-d="0.8"><img></div>
  </div>`;
  const card=s.querySelector('.fcard');
  card._flow=fl; card._sched=schedule(fl,speed,hold); card._img=card.querySelector('img');
  card._steps=[...s.querySelectorAll('.fstep')]; card._bar=s.querySelector('.fbar');
  s.dataset.dur=card._sched.dur.toFixed(2);
}
function buildPairScene(s){
  const keys=s.dataset.pair.split(','), speed=parseFloat(s.dataset.speed||1);
  s.classList.add('dark','flowscene');
  s.innerHTML=`<div class="glow" data-drift="-1" style="width:1300px;height:1300px;right:-500px;top:-500px"></div>
  <div class="stage">
    <div class="abs" style="left:140px;top:90px;right:140px"><div class="eyebrow" data-in="0.05">${s.dataset.eyebrow||'Safeguards'}</div>
      <h2 data-in="0.15" style="margin-top:18px;font-size:64px">${esc(s.dataset.title)}</h2></div>
    ${keys.map((k,i)=>`<div class="abs pcol" style="left:${140+i*840}px">
      <div class="fcard pc" data-flow="${k}" data-in="${0.3+i*0.2}" data-y="60"><img></div>
      <div class="pcap" data-in="${0.5+i*0.2}"><span class="fchip">Flow ${FLOWS[k].num}</span> ${esc(FLOWS[k].title)}</div></div>`).join('')}
  </div>`;
  let dur=0;
  s.querySelectorAll('.fcard').forEach(card=>{
    card._flow=FLOWS[card.dataset.flow]; card._sched=schedule(card._flow,speed,0); card._img=card.querySelector('img');
    card._steps=null; dur=Math.max(dur,card._sched.dur);
  });
  s.dataset.dur=dur.toFixed(2);
}
document.querySelectorAll('section[data-flow]').forEach(buildFlowScene);
document.querySelectorAll('section[data-pair]').forEach(buildPairScene);

const scenes=[...document.querySelectorAll('.scene')];
let acc=0;
for(const s of scenes){s._start=acc;s._dur=parseFloat(s.dataset.dur);acc+=s._dur;}
window.TOTAL=acc;
window.SCENES=scenes.map(s=>({id:s.id||s.dataset.flow||s.dataset.pair,start:+s._start.toFixed(2),dur:s._dur}));
const hooks=window.HOOKS||{};

window.render=function(t){
  scenes.forEach((s,i)=>{
    const l=t-s._start, first=i===0, last=i===scenes.length-1;
    const vis=(first?l>=0:l>=-XF)&&(last?true:l<s._dur);
    s.style.visibility=vis?'visible':'hidden';
    if(!vis){s.style.opacity=0;return;}
    s.style.opacity=first?1:eio(clamp((l+XF)/XF));
    s.style.zIndex=i;
    const stage=s.querySelector('.stage');
    stage.style.transform=`scale(${1.035-0.035*eo(clamp((l+XF)/1.6))})`;
    s.querySelectorAll('.glow').forEach(g=>{
      const d=parseFloat(g.dataset.drift||1);
      g.style.transform=`translate(${d*Math.sin(t*0.35)*60}px,${d*Math.cos(t*0.27)*40}px)`;
    });
    s.querySelectorAll('[data-in]').forEach(el=>{
      const p=clamp((l-parseFloat(el.dataset.in))/parseFloat(el.dataset.d||0.75));
      const e=el.dataset.pop?eback(p):eo(p);
      el.style.opacity=clamp(p*1.6);
      const y=parseFloat(el.dataset.y||30);
      el.style.transform=el.dataset.pop?`translateY(${(1-e)*y}px) scale(${0.8+0.2*e})`:`translateY(${(1-e)*y}px)`;
    });
    s.querySelectorAll('[data-grow]').forEach(el=>{
      const e=eo(clamp((l-parseFloat(el.dataset.grow))/0.9));
      el.style.transform=el.dataset.axis==='x'?`scaleX(${e})`:`scaleY(${e})`;
      if(el.dataset.axis!=='x') [...el.children].forEach(c=>{ if(!c.dataset.in) c.style.opacity=clamp((e-0.6)/0.4); });
    });
    s.querySelectorAll('[data-count]').forEach(el=>{
      const v=parseFloat(el.dataset.count), dec=parseInt(el.dataset.dec||0);
      const e=eo(clamp((l-parseFloat(el.dataset.cin||0))/parseFloat(el.dataset.cd||1.4)));
      el.textContent=(el.dataset.pre||'')+fmt(v*e,dec)+(el.dataset.suf||'');
    });
    s.querySelectorAll('.fcard[data-flow]').forEach(c=>poseFlow(c,l));
    if(hooks[s.id]) hooks[s.id](l,s);
  });
  document.getElementById('fade').style.opacity=Math.max(clamp(1-t/0.6), clamp((t-(TOTAL-1.0))/1.0));
};
window.renderAsync=async function(t){
  pending=[]; render(t);
  await Promise.all(pending.map(img=>img.decode().catch(()=>{})));
};
render(parseFloat(new URLSearchParams(location.search).get('t')||'2'));
})();
