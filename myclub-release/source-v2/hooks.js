(function(){
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const eo=p=>1-Math.pow(1-p,3);
const eio=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
const fmt=(v,dec)=>v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});
const hooks={
  journey(l,s){
    s.querySelectorAll('.step').forEach((el,i)=>{
      const on=l>=1.7+i*1.3;
      el.style.background=on?'#FBFAF7':'transparent';
      el.style.boxShadow=on?'0 14px 40px rgba(40,25,10,.10)':'none';
      const d=el.querySelector('.dot');
      d.style.background=on?'#D68A4A':'#E8E1D8'; d.style.color=on?'#fff':'#6E655C';
    });
  },
  redeem(l,s){
    const p=eio(clamp((l-2.3)/0.35));
    s.querySelector('#knob').style.left=(5+36*p)+'px';
    s.querySelector('#tog').style.background=p>.5?'#D68A4A':'#CFC6BB';
    s.querySelector('#disc').style.opacity=eo(clamp((l-2.5)/0.4));
    const q=eo(clamp((l-2.6)/1.0));
    const v=fmt(186-103.55*q,2);
    s.querySelector('#total').textContent=v; s.querySelector('#total2').textContent=v;
    const press=l>4.6&&l<4.9?0.96:1;
    s.querySelector('#paybtn').style.transform=`scale(${press})`;
  },
  dash(l,s){
    s.querySelector('#cliprect').setAttribute('width',920*eio(clamp((l-2.0)/1.8)));
  },
  winback(l,s){
    const msg='We miss you. Here’s 300 coins on us, good on any bill this month.';
    const n=Math.floor(msg.length*clamp((l-1.2)/2.2));
    s.querySelector('#typed').textContent=msg.slice(0,n);
    s.querySelector('#caret').style.opacity=(l>3.6)?0:((Math.floor(l*2.5)%2===0||n<msg.length)?1:0);
    const b=s.querySelector('#send');
    b.style.transform=`scale(${l>3.7&&l<3.95?0.92:1})`;
    b.textContent=l>=3.95?'Sent ✓':'Send now';
    b.style.background=l>=3.95?'#3F9A5B':'#D68A4A';
  }
};
window.HOOKS=hooks;
})();
