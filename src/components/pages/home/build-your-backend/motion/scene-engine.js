/* eslint-disable */
// Generated from the motion prototype of the Build your backend section (Pixel Point). Do not edit by hand:
// the scene is drawn at 1280 × 694 by `new Stage(VARS[0])` and rendered with `stage.render(seconds)`.
/* ================= stage ================= */
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,u)=>a+(b-a)*u,seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const E={io:u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2,out:u=>1-Math.pow(1-u,3),sine:u=>.5-.5*Math.cos(Math.PI*u),back:u=>{const c=1.5,d=c+1;return 1+d*Math.pow(u-1,3)+c*Math.pow(u-1,2)}};
const W=1280,CX=640,CY=345,LY=390,fmt=n=>n.toLocaleString('en-US');
const PR={P:{lab:'Postgres',cap:['Postgres Database.','Serverless Postgres that scales and branches with your app.']},
  A:{lab:'Auth',cap:['Auth.','Sign-up, sessions and users, stored in your database.']},
  S:{lab:'Storage',cap:['Storage.','Files and buckets that branch together with your data.']},
  C:{lab:'Compute',cap:['Compute.','Background jobs and functions that run next to your data.']},
  G:{lab:'AI Gateway',cap:['AI Gateway.','One endpoint for every model, with keys, limits and logs.']},
  R:{lab:'Realtime',cap:['Realtime.','Live queries that push every change to every client.']}};
const names=cs=>cs.map(c=>PR[c.p].lab).join(' + ')+'.';

/* ---------- twelve reels: two per product, each builds its DOM and returns update(t) ---------- */
const REEL={
P1:{w:205,h:205,poster:1.2,build(r){r.innerHTML='<div class="grid">'+'<i></i>'.repeat(16)+'</div><div class="leg"><span><b class="g"></b>Autoscaling</span><span><b></b>DB load</span></div>';
  const cols=[...r.querySelectorAll('.grid i')],last=[];
  return t=>cols.forEach((c,k)=>{const ld=.36+.2*Math.sin(t*1.5+k*.45)+.1*Math.sin(t*3.1+k*1.2),cp=ld+.18+.07*Math.sin(t*.9+k*.35);
    const a=clamp(Math.round(ld*12),1,11),b=clamp(Math.round(cp*12),a+1,12),key=a*13+b;
    if(last[k]!==key){last[k]=key;c.style.setProperty('--a',(a/12*100).toFixed(3)+'%');c.style.setProperty('--b',(b/12*100).toFixed(3)+'%')}})}},
P2:{w:205,h:205,poster:3.4,period:5,build(r){r.innerHTML='<svg class="sv" viewBox="0 0 205 205"><path class="mn" d="M46 42V188" pathLength="1"/><path class="br" d="M46 86C46 118 130 104 130 138V188" pathLength="1"/><rect x="42" y="118" width="8" height="8"/><rect x="42" y="152" width="8" height="8"/><rect class="w" x="126" y="152" width="8" height="8"/><rect class="w" x="126" y="170" width="8" height="8"/></svg><div class="pill pw" style="left:24px;top:20px"><i class="db"></i>main</div><div class="pill pg" style="left:98px;top:118px">preview/pr-42</div><div class="note">branch ready in <b>1.1 s</b></div>';
  const sv=r.querySelector('svg'),mn=r.querySelector('.mn'),br=r.querySelector('.br'),ws=r.querySelectorAll('.w'),pg=r.querySelector('.pg'),nt=r.querySelector('.note');
  return t=>{const T=t%5,fo=1-seg(T,4.55,4.95);mn.style.strokeDashoffset=(1-E.out(seg(T,0,.6))).toFixed(3);br.style.strokeDashoffset=(1-E.io(seg(T,.7,1.5))).toFixed(3);
    pg.style.opacity=seg(T,1.35,1.65)*fo;nt.style.opacity=seg(T,1.8,2.1)*fo;sv.style.opacity=fo;ws[0].classList.toggle('on',T>2.5);ws[1].classList.toggle('on',T>3.1)}}},
A1:{w:212,h:118,poster:2.9,period:4.8,build(r){r.innerHTML='<div class="hdr"><b class="logo"></b>ACME</div><div class="bd"><div class="t1">Sign up</div><div class="lbl">Email</div><div class="inp"><span class="tx"></span><i class="cr"></i></div><div class="bt">Continue</div></div>';
  const tx=r.querySelector('.tx'),cr=r.querySelector('.cr'),bt=r.querySelector('.bt'),S='ana@acme.dev';let ln=-1,st=-1;
  return t=>{const T=t%4.8,n=Math.floor(clamp((T-.35)/1.5,0,1)*S.length);
    if(n!==ln){ln=n;tx.textContent=n?S.slice(0,n):'you@company.com';tx.classList.toggle('ph',!n)}
    cr.style.opacity=T<2.2?((T*2.6|0)%2?0:1):0;
    const s=T<2.15?0:T<2.45?1:T<4.5?2:0;if(s!==st){st=s;bt.className='bt'+(s===1?' pr':s===2?' ok':'');bt.textContent=s===2?'✓ Account created':'Continue'}}}},
A2:{w:212,h:130,poster:.9,build(r){const D=[['M','mila@north.io','Google'],['J','jon@acme.dev','GitHub'],['S','sara@lumen.app','Email'],['K','kai@orbit.so','Google'],['L','leo@paper.co','GitHub'],['N','nia@fold.dev','Email']];
  r.innerHTML='<div class="hdr2"><span>Users</span><span class="cnt"></span></div><div class="rw"><div class="rwi">'+'<div class="row"><i class="av"></i><span class="em"></span><span class="pv"></span></div>'.repeat(6)+'</div></div>';
  const rwi=r.querySelector('.rwi'),rows=[...r.querySelectorAll('.row')],cnt=r.querySelector('.cnt');let ln=null;
  return t=>{const n=Math.floor(t/1.3),u=E.out(seg(t-n*1.3,0,.4));
    if(n!==ln){ln=n;rows.forEach((row,k)=>{const d=D[((n-k)%6+6)%6];row.children[0].textContent=d[0];row.children[1].textContent=d[1];row.children[2].textContent=d[2];row.classList.toggle('nw',k===0)});cnt.textContent=fmt(1204+n)}
    rwi.style.transform=`translateY(${((u-1)*22).toFixed(2)}px)`;rows[0].style.opacity=u.toFixed(3)}}},
S1:{w:158,h:182,poster:3.5,period:4.8,build(r){const F=['/avatar.png','/product-img.webp','/invoice-042.pdf'];
  r.innerHTML='<div class="cw" style="top:13px"><div class="pill pw"><i class="db"></i>main</div></div><div class="vl"></div>'+F.map((f,i)=>`<i class="nd" style="top:${52+i*46}px"></i><div class="cw" style="top:${62+i*46}px"><div class="fc"><i class="fi"></i>${f}</div></div>`).join('');
  const vl=r.querySelector('.vl'),nds=r.querySelectorAll('.nd'),fcs=r.querySelectorAll('.fc');
  return t=>{const T=t%4.8,fo=1-seg(T,4.4,4.8);vl.style.transform=`scaleY(${E.out(seg(T,0,.8)).toFixed(3)})`;vl.style.opacity=fo;
    fcs.forEach((f,i)=>{const a=.6+i*.75,u=E.out(seg(T,a,a+.35));f.style.opacity=(u*fo).toFixed(3);f.style.transform=`translateY(${((1-u)*5).toFixed(2)}px)`;
      nds[i].style.opacity=(u*fo).toFixed(3);nds[i].style.transform=`scale(${(1+(u>0?.9*(1-seg(T,a,a+.6)):0)).toFixed(3)})`})}}},
S2:{w:212,h:130,poster:3.1,period:5,build(r){const tl='<i class="tl"><b></b></i>'.repeat(4);
  r.innerHTML=`<div class="pill pw" style="left:10px;top:14px"><i class="db"></i>main</div><div class="tr" style="top:12px">${tl}</div><div class="cn"></div><div class="pill pg pv" style="left:10px;top:72px">preview</div><div class="tr t2" style="top:70px">${tl}</div><div class="note">copied in <b>0.4 s</b> · 0 bytes moved</div>`;
  const cn=r.querySelector('.cn'),pv=r.querySelector('.pv'),t2=r.querySelectorAll('.t2 .tl'),nt=r.querySelector('.note');
  return t=>{const T=t%5,fo=1-seg(T,4.6,5);cn.style.transform=`scaleY(${E.out(seg(T,.3,.8)).toFixed(3)})`;cn.style.opacity=fo;pv.style.opacity=seg(T,.7,.95)*fo;
    t2.forEach((e,i)=>{e.style.opacity=(seg(T,1+i*.15,1.2+i*.15)*fo).toFixed(3);e.classList.toggle('md',i===2&&T>2.4)});nt.style.opacity=seg(T,2.7,3)*fo}}},
C1:{w:158,h:82,poster:2.7,period:5.2,build(r){r.innerHTML='<div class="r1"><span class="tg">Running</span><span class="bt"><b>0</b>/48 batches</span></div><div class="sg">'+'<i></i>'.repeat(24)+'</div><div class="ck"><span><i class="bx on"></i>Reading data</span><span><i class="bx b2"></i><em>Processing request…</em></span></div>';
  const b=r.querySelector('.bt b'),sg=[...r.querySelectorAll('.sg i')],b2=r.querySelector('.b2'),em=r.querySelector('em'),tg=r.querySelector('.tg');let lc=-1,ld=null;
  return t=>{const T=t%5.2,c=Math.floor(E.sine(clamp(T/3.8,0,1))*48),done=T>3.9;
    if(c!==lc){lc=c;b.textContent=c;sg.forEach((e,i)=>e.classList.toggle('on',i<Math.round(c/2)))}
    if(done!==ld){ld=done;b2.classList.toggle('on',done);em.textContent=done?'Request processed':'Processing request…';tg.textContent=done?'Done':'Running';tg.classList.toggle('dn',done)}}}},
C2:{w:212,h:110,poster:2.2,build(r){r.innerHTML='<div class="hdr2"><span>Workers</span><span class="sc"></span></div><div class="wk">'+'<i></i>'.repeat(16)+'</div><div class="ft"><span><b class="na"></b> / 16 active</span><span>queue <b class="qu"></b> jobs</span></div>';
  const wk=[...r.querySelectorAll('.wk i')],na=r.querySelector('.na'),qu=r.querySelector('.qu'),sc=r.querySelector('.sc');let ln=-1,lq=-1,lu=null;
  return t=>{const ph=2*Math.PI*t/6,ld=.5-.5*Math.cos(ph),n=2+Math.round(ld*12),q=Math.round(30+220*ld),up=Math.sin(ph)>=0;
    if(n!==ln){ln=n;wk.forEach((e,i)=>e.classList.toggle('on',i<n));na.textContent=n}
    if(q!==lq){lq=q;qu.textContent=q}
    if(up!==lu){lu=up;sc.textContent=up?'▲ scaling up':'▼ scaling down';sc.classList.toggle('up',up)}}}},
G1:{w:158,h:70,poster:3.5,period:4.4,build(r){const S='Summary: 12 new orders this week, 3 refunds.';
  r.innerHTML='<div class="rq"><i class="dt"></i>POST <span>/v1/chat/completions</span></div><div class="sm"></div><div class="mt">200 OK · <b>412</b> ms</div>';
  const sm=r.querySelector('.sm'),mt=r.querySelector('.mt'),dt=r.querySelector('.dt');let ln=-1;
  return t=>{const T=t%4.4,n=Math.floor(clamp((T-.3)/2.4,0,1)*S.length),typing=T>.3&&n<S.length,k=n*2+(typing?1:0),fo=1-seg(T,4.1,4.4);
    if(k!==ln){ln=k;sm.textContent=S.slice(0,n)+(typing?'▍':'')}
    sm.style.opacity=fo;mt.style.opacity=seg(T,2.8,3.1)*fo;dt.style.opacity=(.45+.55*Math.abs(Math.sin(T*4))).toFixed(2)}}},
G2:{w:212,h:118,poster:1.2,period:4.5,build(r){const M=[['openai/gpt-5','380'],['anthropic/claude','412'],['google/gemini','296']],Y=[44,70,96];
  r.innerHTML='<div class="hdr2"><span>Routing</span><span>fallback on</span></div><div class="src">request</div><svg class="sv" viewBox="0 0 212 118">'+Y.map(y=>`<path d="M66 70C84 70 82 ${y} 100 ${y}"/>`).join('')+'</svg>'+M.map((m,i)=>`<div class="m" style="top:${Y[i]-9}px"><span>${m[0]}</span><b>${m[1]} ms</b></div>`).join('')+'<i class="pk"></i>';
  const ps=[...r.querySelectorAll('.sv path')],ms=[...r.querySelectorAll('.m')],pk=r.querySelector('.pk'),SEQ=[1,0,2];let lm=-2;
  return t=>{const k=Math.floor(t/1.5)%3,f=(t%1.5)/1.5,m=SEQ[k],u=E.io(seg(f,0,.5)),y=Y[m],o=1-u;
    const bx=o*o*o*66+3*o*o*u*84+3*o*u*u*82+u*u*u*100,by=o*o*o*70+3*o*o*u*70+3*o*u*u*y+u*u*u*y;
    pk.style.transform=`translate(${(bx-2.5).toFixed(1)}px,${(by-2.5).toFixed(1)}px)`;pk.style.opacity=f<.52?1:0;
    const on=f>=.5?m:-1;if(on!==lm){lm=on;ms.forEach((e,i)=>e.classList.toggle('on',i===on));ps.forEach((e,i)=>e.classList.toggle('on',i===on))}}}},
R1:{w:212,h:118,poster:1.2,period:2,build(r){const ST=['paid','shipped','paid','refund','paid','shipped'];
  r.innerHTML='<div class="hdr2"><span>1 live query</span><span>3 clients</span></div><div class="cl">'+('<div class="pn"><div class="tb"><i></i><i></i><i></i></div><div class="ls"><div class="lsi">'+'<div class="it"></div>'.repeat(6)+'</div></div></div>').repeat(3)+'</div>';
  const lsis=[...r.querySelectorAll('.lsi')],its=lsis.map(l=>[...l.children]);let ln=null;
  return t=>{const n=Math.floor(t/2),tt=t-n*2,u=E.out(seg(tt,0,.35)),fl=(1-seg(tt,.5,1.7))*.16;
    if(n!==ln){ln=n;its.forEach(col=>col.forEach((e,k)=>{const id=1043+n-k;e.textContent='#'+id+' '+ST[((id%6)+6)%6];e.classList.toggle('nw',k===0);if(k)e.style.background='';e.style.opacity=''}))}
    lsis.forEach(l=>l.style.transform=`translateY(${((u-1)*15).toFixed(2)}px)`);its.forEach(col=>{col[0].style.opacity=u.toFixed(3);col[0].style.background=`rgba(63,216,148,${fl.toFixed(3)})`})}}},
R2:{w:212,h:118,poster:3.1,period:4.6,build(r){const L=['Insert','Committed to Postgres','Pushed to all clients','In sync · 3 of 3'];
  r.innerHTML='<div class="sq"><span>INSERT INTO</span> orders <span>VALUES</span> (1044, …)</div><div class="sp"><div class="vl"><b></b></div>'+L.map(l=>`<div class="st"><i></i><span>${l}</span></div>`).join('')+'</div>';
  const st=[...r.querySelectorAll('.st')],vb=r.querySelector('.vl b');let la=-2;
  return t=>{const T=t%4.6,a=T<.25||T>4.3?-1:Math.min(3,Math.floor((T-.25)/.8));vb.style.transform=`scaleY(${(a<0?0:clamp((T-.25)/2.4,0,1)).toFixed(3)})`;
    if(a!==la){la=a;st.forEach((e,i)=>e.classList.toggle('on',i<=a))}}}}};

/* ---------- cluster slots, from the Figma composition (offsets from the cluster centre) ---------- */
const SL={C:(w,h)=>[0,0,'t'],L:(w,h)=>[-37-w/2,-60+h/2,'t'],TR:(w,h)=>[85+w/2,-153+h/2,'t'],BR:(w,h)=>[85+w/2,47+h/2,'b'],BL:(w,h)=>[-48-w/2,85+h/2,'b']};
const LAYOUT={1:['C'],2:['C','L'],3:['C','L','BR'],4:['C','L','TR','BR'],5:['C','L','TR','BR','BL']};
// background strip, read outer-left → inner-left, then inner-right → outer-right
const STRIP=['R2','C2','S1','G2','P2','A1','C1','R1','S2','A2','P1','G1','S1','R2','C1','P2','A1','G2'];
const lp=(a,b,u)=>({x:lerp(a.x,b.x,u),y:lerp(a.y,b.y,u),s:Math.exp(lerp(Math.log(a.s),Math.log(b.s),u)),o:lerp(a.o,b.o,u),f:lerp(a.f,b.f,u),z:u>0?b.z:a.z,lb:u<.5?a.lb:b.lb,fl:0});
const arcp=(a,b,u,cx,cy)=>{const p=lp(a,b,u),m=1-u;p.x=m*m*a.x+2*m*u*cx+u*u*b.x;p.y=m*m*a.y+2*m*u*cy+u*u*b.y;return p};
const bez=(a,c1,c2,b,u)=>{const p=lp(a,b,u),m=1-u;p.x=m*m*m*a.x+3*m*m*u*c1.x+3*m*u*u*c2.x+u*u*u*b.x;p.y=m*m*m*a.y+3*m*m*u*c1.y+3*m*u*u*c2.y+u*u*u*b.y;return p};
function flatHomes(S,le=352,re=928){const n=S.cards.length,h=Math.ceil(n/2),Lc=S.cards.slice(0,h),Rc=S.cards.slice(h);let e=le;
  for(let d=0;d<Lc.length;d++){const c=Lc[Lc.length-1-d],th=30-d*2.2,s=th/c.h,tw=c.w*s;c.home={x:e-tw/2,y:LY,s,o:1,f:.3,z:2,lb:'t'};e-=tw+8-d*.3}
  e=re;for(let d=0;d<Rc.length;d++){const c=Rc[d],th=30-d*2.2,s=th/c.h,tw=c.w*s;c.home={x:e+tw/2,y:LY,s,o:1,f:.3,z:2,lb:'t'};e+=tw+8-d*.3}}

class Stage{
  constructor(v,still=false){this.v=v;this.still=still;const el=this.el=document.createElement('div');el.className='stg'+(still?' still':'');
    el.innerHTML='<div class="eb"><i></i>Build your backend</div><div class="num">01</div><h3 class="hd">Pick the services you need. Build the application you want. <span>Use only the services you need—or combine them into a complete platform.</span></h3><div class="ln"></div><div class="lay"></div><div class="cap"><div class="c"></div><div class="c off"></div></div>';
    this.lay=el.querySelector('.lay');this.ln=el.querySelector('.ln');this.capEl=el.querySelector('.cap');this.caps=[...el.querySelectorAll('.cap .c')];this.ci=0;this.capKey=null;
    this.cards=(v.strip||STRIP).map((k,i)=>this.card(k,i));(v.homes||flatHomes)(this);this.fc=null;this.lt=null;this.t=0;if(v.init)v.init(this)}
  card(kind,i){const R=REEL[kind],el=document.createElement('div');el.className='cd';el.style.width=R.w+'px';el.style.height=R.h+'px';
    const inn=document.createElement('div');inn.className='in r-'+kind.toLowerCase();const dm=document.createElement('div');dm.className='dm';const lb=document.createElement('div');lb.className='lb';lb.textContent=PR[kind[0]].lab;
    const fxe=cardFx(this.v.fx,kind,i,R);el.append(fxe.bgx,inn,fxe.fx,dm,lb);this.lay.appendChild(el);const up=R.build(inn);up(R.poster);return{kind,p:kind[0],i,w:R.w,h:R.h,el,dm,lb,up,lt:R.poster,home:null,n:null,c:{},fxl:fxe.layers,gn:fxe.gn,tv:fxe.tv}}
  find(k,side){const cs=this.cards.filter(c=>c.kind===k),ix=c=>c.home?Math.abs(c.home.x-CX):0,pref=side&&cs[0]&&cs[0].home?cs.filter(c=>(c.home.x<CX)===(side==='L')):[];return(pref.length?pref:cs).sort((a,b)=>ix(a)-ix(b))[0]}
  home(c){return this.v.homePose?this.v.homePose(this,c,this.t):{...c.home}}
  at(c,name,x){const[dx,dy0,lb]=SL[name](c.w,c.h),dy=Math.min(dy0,196-c.h/2);return Object.assign({x:CX+dx,y:CY+dy,s:1,o:1,f:1,z:12,lb,fl:0},x)}
  put(c,p){c.n=p}
  focus(c){this.nf=c;this.ncap=PR[c.p].cap}
  cap(a){this.ncap=a}
  render(t){this.t=t;for(const c of this.cards)c.n=this.home(c);this.nf=null;this.ncap=null;this.nplay=null;this.v.frame(this,t);
    const dt=this.lt==null?0:clamp(t-this.lt,0,.1);this.lt=t;if(this.nf!==this.fc)this.fc=this.nf;
    if(!this.still){const pl=new Set(this.nplay||[]);if(this.fc)pl.add(this.fc);for(const c of pl){c.lt+=dt;c.up(c.lt);c.settle=true}for(const c of this.cards){if(pl.has(c)||!c.settle)continue;const P=REEL[c.kind].period;if(!P){c.settle=false;continue}const P0=REEL[c.kind].poster,b0=((c.lt-P0)%P+P)%P;c.lt+=dt;const b1=((c.lt-P0)%P+P)%P;if(b1<b0){c.lt-=b1;c.settle=false}c.up(c.lt)}}
    for(const c of this.cards){const p=c.n,k=c.c;
      const tr=`translate(${(p.x-c.w/2).toFixed(1)}px,${(p.y-c.h/2).toFixed(1)}px) scale(${(p.s*(p.k||1)).toFixed(4)},${p.s.toFixed(4)})`;if(tr!==k.tr)c.el.style.transform=k.tr=tr;
      const o=clamp(p.o,0,1).toFixed(3);if(o!==k.o){c.el.style.opacity=k.o=o;c.el.style.visibility=p.o<.005?'hidden':''}
      const z=String(Math.round(p.z));if(z!==k.z)c.el.style.zIndex=k.z=z;const nx=p.s<.4;if(nx!==k.nx){k.nx=nx;c.el.classList.toggle('nofx',nx)}
      if(c.tv&&!nx){const T=c.tv.T,S=c.tv.S,q=(Math.floor(this.t*(T.fps||12))+c.tv.o)%T.n;if(q!==k.tq){k.tq=q;c.tv.style.backgroundPosition=S?`${-(q%T.cols)*S}px ${-Math.floor(q/T.cols)*S}px`:`${((q%T.cols)/(T.cols-1)*100).toFixed(3)}% ${(Math.floor(q/T.cols)/(T.rows-1)*100).toFixed(3)}%`}}
      if(c.gn&&!nx){const q=Math.floor(this.t*24);if(q!==k.gq){k.gq=q;const h=(q*92821+c.i*1237)%4096;c.gn.style.backgroundPosition=`${h%64}px ${(h>>6)%64}px`}}
      if(this.v.fx&&this.v.fx.drift&&!nx){const T=this.t,dr=`translate(${(Math.sin(T*.35+c.i*1.7)*7).toFixed(2)}%,${(Math.cos(T*.27+c.i*2.3)*6).toFixed(2)}%)`;if(dr!==k.dr){k.dr=dr;for(const e of c.fxl)e.style.transform=dr}}
      const d=((1-clamp(p.f,0,1))*.62).toFixed(3);if(d!==k.d)c.dm.style.opacity=k.d=d;const gy=clamp(p.gr||0,0,1).toFixed(2),rf=this.v.fx&&/rack|both/.test(this.v.fx.blur)&&p.s>.6?(1-clamp(p.hb||0,0,1))*1.4*clamp((p.s-.6)/.25,0,1):0,gk=gy+'|'+rf.toFixed(2);
      if(gk!==k.gy){k.gy=gk;c.el.style.filter=[+gy>0?`grayscale(${gy})`:'',rf>.04?`blur(${rf.toFixed(2)}px)`:''].join(' ').trim()}
      const lo=(p.lb==='x'?0:clamp((p.s-.5)/.3,0,1)).toFixed(2);if(lo!==k.lo)c.lb.style.opacity=k.lo=lo;
      if(p.lb!==k.lb){c.el.classList.toggle('lbb',p.lb==='b');k.lb=p.lb}
      const fl=clamp(p.fl||0,0,1).toFixed(2)+'|'+clamp(p.hb||0,0,1).toFixed(2);if(fl!==k.fl){k.fl=fl;const f=clamp(p.fl||0,0,1),hg=Math.round(lerp(37,84,clamp(p.hb||0,0,1)));c.el.style.borderColor=f>0?`rgb(${Math.round(lerp(37,63,f))},${Math.round(lerp(37,216,f))},${Math.round(lerp(37,148,f))})`:hg>37?`rgb(${hg},${hg},${hg})`:''}}
    const key=this.ncap?this.ncap.join('|'):'',cs=this.v.cap||'cross';if(key!==this.capKey){const first=this.capKey===null,cur=this.caps[this.ci],nx=this.caps[1-this.ci];this.capKey=key;
      capFill(nx,this.ncap,cs);cur.classList.add('off');nx.classList.remove('off');this.capOld=first?null:cur;this.capNew=nx;this.capT=first?-99:t;this.ci=1-this.ci}
    if(this.capNew&&this.ncap){const u=this.still||t<this.capT?99:t-this.capT;CAPFX[cs](u,this.capOld,this.capNew,this)}}
}

// the caption under the scene runs on the scene's own clock: u is seconds since it changed, A the caption leaving, B the one arriving
function capFill(el,cap,st){el.style.cssText='';el.textContent='';el.className=el.className.replace(' cw','');if(!cap)return;
  if(st==='rollw'||st==='cascade'){const ws=[];if(st==='cascade')el.classList.add('cw');
    const add=(txt,t)=>txt.split(' ').filter(Boolean).forEach(w=>{const o=document.createElement('span');o.className='cpw'+(t?' cpt':'');const i=document.createElement('span');i.className='cpi';i.textContent=w;o.append(i);if(el.childNodes.length)el.append(' ');el.append(o);ws.push(i)});
    add(cap[0],1);add(cap[1],0);el._w=ws}
  else if(st==='type'){const cs=[],add=(txt,t)=>{for(const ch of txt){const s=document.createElement('span');s.textContent=ch;if(t)s.className='cpt';el.append(s);cs.push(s)}};add(cap[0],1);el.append(' ');add(cap[1],0);el._c=cs}
  else if(st==='title'){const b=document.createElement('b');b.textContent=cap[0];const d=document.createElement('span');d.textContent=cap[1];el.append(b,' ',d);el._b=b;el._d=d}
  else{const b=document.createElement('b');b.textContent=cap[0];el.append(b,' '+cap[1])}}
// a whole caption moves by transform; a piece of running text (inline) moves by relative offset so it keeps its line breaks
const lay=(el,o,y=0,x=0,bl=0)=>{if(!el)return;el.style.opacity=o.toFixed(3);el.style.transform=`translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;el.style.filter=bl>.05?`blur(${bl.toFixed(2)}px)`:''};
const inl=(el,o,y=0)=>{el.style.opacity=o.toFixed(3);el.style.position='relative';el.style.top=y.toFixed(2)+'px'};
const mixc=(a,b,u)=>`rgb(${a.map((v,i)=>Math.round(lerp(v,b[i],u))).join(',')})`;
const CAPFX={
  // today: both at once, the old caption sinks 6 px and fades, the new one rises 6 px
  cross(u,A,B){const e=E.out(seg(u,0,.35));lay(A,1-e,6*e);lay(B,e,6*(1-e))},
  seq(u,A,B){const a=seg(u,0,.16),e=E.out(seg(u,.16,.46));lay(A,1-a,-4*a);lay(B,e,8*(1-e))},
  title(u,A,B){const a=seg(u,0,.16),e1=E.out(seg(u,.14,.42)),e2=E.out(seg(u,.28,.6));lay(A,1-a,-4*a);lay(B,1);inl(B._b,e1,7*(1-e1));inl(B._d,e2,7*(1-e2))},
  roll(u,A,B,S){S.capEl.classList.add('clip');const e=E.io(seg(u,0,.5));lay(A,1,-46*e);lay(B,1,46*(1-e))},
  rollw(u,A,B){lay(A,1);lay(B,1);if(A&&A._w)A._w.forEach((w,i)=>{const e=E.io(seg(u,i*.015,i*.015+.3));w.style.transform=`translateY(${(-110*e).toFixed(1)}%)`});
    B._w.forEach((w,i)=>{const s=.08+i*.02,e=E.out(seg(u,s,s+.4));w.style.transform=`translateY(${(110*(1-e)).toFixed(1)}%)`})},
  focus(u,A,B){const a=E.out(seg(u,0,.26)),e=E.out(seg(u,.1,.48));lay(A,1-a,0,0,7*a);lay(B,e,0,0,7*(1-e))},
  cascade(u,A,B){const a=seg(u,0,.14);lay(A,1-a);lay(B,1);B._w.forEach((w,i)=>{const s=.08+i*.032,e=E.out(seg(u,s,s+.3));w.style.opacity=e.toFixed(3);w.style.transform=`translateY(${(5*(1-e)).toFixed(2)}px)`;w.style.filter=e<.98?`blur(${(3*(1-e)).toFixed(2)}px)`:''})},
  wipe(u,A,B){const po=112*E.io(seg(u,0,.34)),pn=112*E.io(seg(u,.06,.46));lay(A,1);lay(B,1);
    if(A)A.style.webkitMaskImage=A.style.maskImage=`linear-gradient(90deg,transparent ${(po-12).toFixed(1)}%,#000 ${po.toFixed(1)}%)`;
    B.style.webkitMaskImage=B.style.maskImage=`linear-gradient(90deg,#000 ${(pn-12).toFixed(1)}%,transparent ${pn.toFixed(1)}%)`},
  // each letter lights up green for a moment as it types in, then settles to its colour
  type(u,A,B){lay(A,1-seg(u,0,.12));lay(B,1);const n=B._c.length,T=.42;B._c.forEach((c,i)=>{const s=.1+i*T/n,on=u>=s,g=on?1-seg(u,s,s+.22):0,k=(on?1:0)+'|'+g.toFixed(2);if(k===c._k)return;c._k=k;
    c.style.opacity=on?1:0;c.style.color=g>0?mixc(c.className==='cpt'?[243,243,243]:[126,126,126],[63,216,148],g):''})},
  // the sets travel left to right, so the caption does too
  slide(u,A,B){const a=E.io(seg(u,0,.24)),e=E.out(seg(u,.12,.5));lay(A,1-E.out(seg(u,0,.2)),0,24*a);lay(B,e,0,-28*(1-e))}};

// the card finish (sys.fx): blur 'edge' | 'spots' | 'rack' | 'both' (spots + rack); noise 'grid' | 'dither' | 'asset' | 'grain'; drift: the spots float
const FXR=seed=>{let a=seed>>>0||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
const TEX={};
// 'chk' is the 2 × 2 checker of noise.png; 'grain' a tile of film grain, one texel a device pixel in the 4K video
const tex=k=>{if(TEX[k])return TEX[k];const c=document.createElement('canvas'),g=c.getContext('2d');
  if(k==='chk'){c.width=c.height=2;g.fillStyle='#000';g.fillRect(0,0,2,2);g.fillStyle='#fff';g.fillRect(0,0,1,1);g.fillRect(1,1,1,1)}
  else{c.width=c.height=192;const d=g.createImageData(192,192),r=FXR(7);for(let i=0;i<d.data.length;i+=4){const v=Math.round(clamp(128+(r()+r()+r()-1.5)*150,0,255));d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}g.putImageData(d,0,0)}
  return TEX[k]=`url(${c.toDataURL()})`};
// soft elliptical spots, kept off the middle of the card so what it shows stays readable: right edge, bottom, left edge or top right
const spots=(rnd,n,big)=>[...Array(n)].map(()=>{const q=rnd();let x,y;
  if(q<.35){x=.82+rnd()*.28;y=.2+rnd()*.7}else if(q<.7){x=.15+rnd()*.75;y=.84+rnd()*.24}else if(q<.85){x=-.06+rnd()*.18;y=.3+rnd()*.6}else{x=.62+rnd()*.4;y=-.06+rnd()*.22}
  return{x,y,rx:(.22+rnd()*.2)*big,ry:(.26+rnd()*.3)*big}});
const spotMask=(ss,k)=>ss.map(s=>`radial-gradient(${(s.rx*k*100).toFixed(1)}% ${(s.ry*k*100).toFixed(1)}% at ${(s.x*100).toFixed(1)}% ${(s.y*100).toFixed(1)}%,#000 0,rgba(0,0,0,.55) 45%,transparent 100%)`).join(',');
const NZ={"g":{"src":"/images/pages/home/build-your-backend/noise-gateway.png","w":800,"h":506},"s":{"src":"/images/pages/home/build-your-backend/noise-storage.png","w":904,"h":1254},"c":{"src":"/images/pages/home/build-your-backend/noise-compute.png","w":442,"h":462}},NZK={G:'g',A:'g',S:'s',C:'c',R:'g'};
// where each reel may go out of focus: only its empty or secondary parts, never the numbers, names, the lit row or the button
// (x, y: spot centre; rx, ry: radii; all in fractions of the card)
const BLUR_SPOTS={
  P1:[{x:1,y:1,rx:.32,ry:.24},{x:-.02,y:0,rx:.22,ry:.2}],            // the corner past the legend; the empty top-left tiles
  P2:[{x:1.02,y:.12,rx:.38,ry:.32},{x:1,y:1,rx:.26,ry:.2}],          // the empty top right; the bottom-right corner
  A1:[{x:1,y:.18,rx:.42,ry:.5}],                                     // the empty space right of ACME and Sign up
  A2:[{x:.45,y:1.06,rx:.6,ry:.2},{x:1.04,y:.62,rx:.14,ry:.28}],      // the cut-off last row; the provider pills
  S1:[{x:1.05,y:.35,rx:.22,ry:.35},{x:-.05,y:.7,rx:.2,ry:.35}],      // the margins either side of the files
  S2:[{x:1.02,y:.5,rx:.2,ry:.55}],                                   // the empty right edge
  C1:[{x:1.02,y:.88,rx:.35,ry:.45}],                                 // the empty bottom right
  C2:[{x:.95,y:.56,rx:.3,ry:.2}],                                    // the empty worker slots
  G1:[{x:1.04,y:.95,rx:.34,ry:.42}],                                 // the empty bottom right, below the summary
  G2:[{x:.15,y:.97,rx:.3,ry:.24}],                                   // the empty space under request
  R1:[{x:.5,y:1.08,rx:.6,ry:.2}],                                    // the oldest rows at the bottom
  R2:[{x:1.02,y:.7,rx:.36,ry:.45}]};                                 // the empty right side of the steps
// the analogue interference from the reels' After Effects comps (the stock clip in ai-gateway/assets), as a sprite of frames
const TVS={"b":{"src":"/images/pages/home/build-your-backend/interference.jpg","cols":6,"rows":4,"n":24,"fps":15,"sq":true}};
function cardFx(F,kind,i,R){F=F||{blur:'edge',noise:'grid'};const rnd=FXR(i*7919+kind.charCodeAt(0)*131+kind.charCodeAt(1)),layers=[];let gn=null,tv=null;
  const bgx=document.createElement('div');bgx.className='bgx';const fx=document.createElement('div');fx.className='fx';
  const add=(cls,set)=>{const e=document.createElement('i');e.className=cls;set(e.style);fx.append(e);layers.push(e);return e};
  // noise first, under the blur: inside a blur spot the noise softens too, so the depth reads even where the card is empty
  if(F.noise==='grid')add('dt',()=>{});
  if(F.noise==='dither'){const ns=spots(rnd,1+Math.floor(rnd()*3),1.25);add('nz',st=>{st.backgroundImage=tex('chk');st.webkitMaskImage=st.maskImage=spotMask(ns,1)})}
  // noise.png as laid in the comps: at 100 %, one of its pixels a device pixel of the 4K video; nzb is its blend mode (the comps use Overlay)
  if(F.noise==='asset'&&NZK[kind[0]]){const a=NZ[NZK[kind[0]]],w=a.w/3,h=a.h/3;add('na',st=>{st.backgroundImage=`url(${a.src})`;st.backgroundSize=`${w.toFixed(2)}px ${h.toFixed(2)}px`;
    st.backgroundPosition=`${((R.w-w)*rnd()).toFixed(1)}px ${((R.h-h)*rnd()).toFixed(1)}px`;if(F.nzb)st.mixBlendMode=F.nzb})}
  if(F.noise==='grain')gn=add('gn',st=>{st.backgroundImage=tex('grain')});
  // tv: 'h' as shot or 'v' turned upright into streaks; screened over the card, on the whole card or only in soft spots (tvs)
  // a square sprite (sq) keeps its pixels square on every card: each frame is shown at the card's longer side and cropped
  if(F.tv){const T=TVS[F.tv],S=T.sq?Math.max(R.w,R.h):0;tv=add('tv',st=>{st.backgroundImage=`url(${T.src})`;st.backgroundSize=S?`${T.cols*S}px ${T.rows*S}px`:`${T.cols*100}% ${T.rows*100}%`;
    st.opacity=F.tva||.3;if(F.tvb)st.mixBlendMode=F.tvb;if(F.tvs)st.webkitMaskImage=st.maskImage=spotMask(spots(rnd,2,1.5),1)});tv.T=T;tv.S=S;tv.o=Math.floor(rnd()*T.n)}
  if(F.blur==='edge'){add('b1',()=>{});add('b2',()=>{})}
  // three blur strengths inside the same spots, each one tighter, so the defocus ramps smoothly like Camera Lens Blur through a blur map
  if(F.blur==='spots'||F.blur==='both'){const ss=BLUR_SPOTS[kind];(F.bl||[[.7,1.35],[1.6,1],[3.2,.62]]).forEach(([b,k])=>add('ls',st=>{st.setProperty('--bf',`blur(${b}px) brightness(1.04)`);st.webkitMaskImage=st.maskImage=spotMask(ss,k)}))}
  return{bgx,fx,layers,gn,tv}}
const seq=durs=>t=>{let i=0;while(i<durs.length-1&&t>=durs[i]){t-=durs[i];i++}return[i,t]};
const SETS=[['P1','A1','S1','C1','G1'],['P2','A2','R1','G2'],['P1','S2','C2']];

/* ================= bunch carousel: the background strip is a row of small sets; the one in the middle is shown full size ================= */
// seven sets, each a different mix; the carousel moves left → right, so the small set on the left grows into the centre and the centre set shrinks off to the right
const BUN=[['P1','A1','S1','C1','G1'],['P2','A2','R1','G2'],['P1','S2','C2'],['P2','G1','R2','A1'],['P1','A2','S1','R1','C2'],['P2','S2','G2'],['P1','R2','C1','A2']],NB=BUN.length;
const MODE={rigid:'Whole set scales',unfold:'Folds and fans out',stagger:'Cards one after another',creep:'Rigid, never fully stops',flow:'Cover flow'};
// the service count on the outline: old → new, driven by p (0..1); `since` is seconds from the moment the outline switches sets
function digit(S,old,nw,p,since,oPs,nPs){const ds=S.ds,d=nw-old,key=old+'>'+nw,live=since>-.05&&since<1.4,blink=Math.floor((since+5)*3.2)%2===0;
  const fl=since<0?0:since<.6?1:1-seg(since,.6,1.3),col=`rgb(${Math.round(lerp(255,63,fl))},${Math.round(lerp(255,216,fl))},${Math.round(lerp(255,148,fl))})`;
  if(ds==='label'){const A=old+' services',B=nw+' services',txt=p<=0?A:p<.45?A.slice(0,Math.round(A.length*(1-p/.45))):p<.5?'':B.slice(0,Math.round(B.length*seg(p,.5,1)));
    const k=txt+(live&&blink?'▍':'');if(k!==S.dk){S.dk=k;S.rt.textContent=k}S.rt.style.color=col;return}
  if(key!==S.dk){S.dk=key;S.dgo.textContent=old;S.dgn.textContent=nw;S.dgl.textContent=d>0?'+'+d:d<0?'−'+(-d):''}
  S.dg.style.color=col;const o=S.dgo.style,n=S.dgn.style;
  if(ds==='count'){const m=Math.abs(d),i=p>=1?m:p<=0?0:Math.min(m,Math.floor(p*m)+1),ph=p>0&&p<1?(p*m)%1:1;S.dgo.textContent=old+Math.sign(d)*i;o.transform=`scale(${(1+.22*(1-E.out(ph))).toFixed(3)})`;n.opacity=0}
  else if(ds==='retype'){const v=String(p<.25?old:p<.55?'':nw);if(S.dgo.textContent!==v)S.dgo.textContent=v;o.transform='none';S.dgn.textContent='▍';n.transform='none';n.opacity=live&&blink?1:0}
  else if(ds==='scramble'){const v=String(p<=0?old:p>=1?nw:((Math.floor(since*24)*7+3)%10+10)%10);if(S.dgo.textContent!==v)S.dgo.textContent=v;o.transform='none';n.opacity=0}
  else{const u=E.io(p);o.transform=`translateY(${(-u*100).toFixed(1)}%)`;n.transform=`translateY(${((1-u)*100).toFixed(1)}%)`;o.opacity=1;n.opacity=1}
  const L=S.dgl.style;if(ds==='delta'){const q=seg(since,0,1.6);L.opacity=(since<0||!d?0:q<.12?q/.12:q<.7?1:1-(q-.7)/.3).toFixed(3);L.color=d>0?'#3fd894':'#e0a556';L.background=d>0?'#0f2a1e':'#3a2a12'}else L.opacity=0;
  if(S.tly)[...'PASCGR'].forEach((x,i)=>{const a=oPs.includes(x),b=nPs.includes(x),on=a&&b?true:!a&&!b?false:p>=.15+i*.12?b:a;S.tly[i].classList.toggle('on',on)})}
// set-change timings, in fractions of the move (MV): L/A/M = when the leaving set, the arriving set and the small sets travel;
// Lc/Le = leaving set folds / opens back up as a small set; Ac/Ae = arriving set folds into a stack / fans out at the centre
const CH={overlap:{L:[.2,1],A:[.2,1],M:[.2,1],Lc:[0,.35],Le:[.7,1],Ac:[0,.35],Ae:[.8,1.3]},
  fold:{L:[.3,1],A:[.3,1],M:[.3,1],Lc:[0,.3],Le:[.85,1],Ac:[0,.3],Ae:[1,1.35]},
  train:{L:[.15,.75],A:[.4,1],M:[.25,.9],Lc:[0,.25],Le:[.7,.95],Ac:[0,.35],Ae:[1,1.35]},
  serial:{L:[.12,.55],A:[.5,1],M:[.3,.85],Lc:[0,.2],Le:[.45,.65],Ac:[.3,.5],Ae:[1,1.35]}};
CH.depth={...CH.overlap,depth:true};CH.dip={...CH.overlap,dip:true};CH.rigid={...CH.overlap,rigid:true};
function bunches({name,desc,mode,inner,sys={}}){const MV=mode==='unfold'?1.25:1.2,FOC=1.1,SP=sys.spread||1,CHO=sys.ch?CH[sys.ch]:null;
  const order=[...Array(NB)].map((_,s)=>((-s)%NB+NB)%NB),durs=order.map(b=>MV+BUN[b].length*FOC),pick=seq(durs);
  const G=mode==='flow'?{m1:.27,d0:330,dd:112,kk:.5}:{m1:.2,d0:sys.d0||400,dd:135,kk:1};
  // a set fades out before it reaches the wrap point, so its jump to the far side is never seen
  const place=j=>{const a=Math.abs(j),sg=j<0?-1:1,m=a>=1?G.m1*Math.pow(.86,a-1):Math.exp(Math.log(G.m1)*a);
    return{x:a>=1?CX+sg*(G.d0+(a-1)*G.dd):CX+j*G.d0,y:lerp(CY,LY,Math.min(1,a)),m,o:clamp((3.3-a)*3,0,1),k:a>=1?G.kk:lerp(1,G.kk,a),a}};
  const wrapj=j=>(((j+3.5)%NB)+NB)%NB-3.5;
  const rect=c=>{const p=c.n;return{x:p.x,y:p.y,hw:c.w*p.s*(p.k||1)/2,hh:c.h*p.s/2}};
  // the stretch of the centre-to-centre line that lies between two cards; a single point where they overlap
  const gap=(P,C)=>{const dx=C.x-P.x,dy=C.y-P.y,ex=(hw,hh)=>Math.min(Math.abs(dx)>1e-6?hw/Math.abs(dx):9,Math.abs(dy)>1e-6?hh/Math.abs(dy):9);
    const tP=ex(P.hw,P.hh),tC=1-ex(C.hw,C.hh),at=u=>({x:P.x+dx*u,y:P.y+dy*u});return tC>tP+.01?[at(tP),at(tC)]:[at(tP),at(tP)]};
  return{name,desc,parts:sys.parts,cap:sys.cap,fx:sys.fx,
  D:durs.reduce((a,b)=>a+b,0),moments:order.map((_,s)=>{const T=durs.slice(0,s).reduce((a,b)=>a+b,0);return[T-.3,T+MV+.9]}),stillT:MV+FOC*.5+(sys.pulse||sys.chain?.4:0),strip:BUN.flat(),homes(){},
  init(S){let i=0;S.bk=BUN.map((set,b)=>{const lay=LAYOUT[set.length],cs=set.map((_,bi)=>{const c=S.cards[i++];c.b=b;c.bi=bi;return c});
    const steps=cs.map((_,k)=>lay.map((sl,ci)=>!k?sl:ci===k?'C':ci===0?lay[k]:sl));
    cs.forEach((c,ci)=>{c.offs=steps.map(st=>{const sl=st[ci],p=S.at(c,sl);return{dx:p.x-CX,dy:p.y-CY,lb:p.lb,sl,big:sl==='C'&&c.p!=='P'&&inner==='swap'?1.15:1}})});return cs});

    // Spread: open the Figma composition up until no two cards touch (12 px apart); Postgres stays where it is
    if(sys.lay==='spread')S.bk.forEach(cs=>{const g=12,R=cs.map(c=>({c,x:c.offs[0].dx,y:c.offs[0].dy,hw:c.w/2,hh:c.h/2,fix:c.bi===0}));
      for(let it=0;it<200;it++){let moved=false;for(let i=0;i<R.length;i++)for(let j=i+1;j<R.length;j++){const a=R[i],b=R[j],ox=a.hw+b.hw+g-Math.abs(a.x-b.x),oy=a.hh+b.hh+g-Math.abs(a.y-b.y);
        // sideways away from Postgres; up and down only between two cards in the same column, and never past the heading or the caption
        if(ox>0&&oy>0){moved=true;const wa=a.fix?0:b.fix?1:.5,wb=1-wa,col=!a.fix&&!b.fix&&Math.sign(a.x)===Math.sign(b.x);
          if(!col){const sg=Math.sign(b.x-a.x)||1;a.x-=sg*ox*wa;b.x+=sg*ox*wb}else{const sg=Math.sign(b.y-a.y)||1;a.y-=sg*oy*wa;b.y+=sg*oy*wb}
          for(const r of[a,b])r.y=clamp(r.y,-175+r.hh,196-r.hh)}}if(!moved)break}
      R.forEach(r=>{r.c.offs[0]={...r.c.offs[0],dx:r.x,dy:r.y}})});
    // Group shift: to show card X, every other card (Postgres included) moves together, as one piece, away from X,
    // always at least sys.min px (so every card visibly gets its moment), and further if needed until X shows at least sys.vis of itself. X keeps its place (or meets them part of the way), nobody shrinks, the layer order never changes
    if(sys.pile==='nudge')S.bk.forEach(cs=>{const base=cs.map(c=>({x:c.offs[0].dx,y:c.offs[0].dy,hw:c.w/2,hh:c.h/2})),TOP=-158,BOT=196;cs.forEach(c=>c.nud=[]);
      cs.forEach((act,k)=>{const A=base[k],oth=base.filter((_,i)=>i!==k);let g={x:0,y:0},a={x:0,y:0};
        if(k>0){let dx=oth.reduce((q,r)=>q+r.x,0)/oth.length-A.x,dy=oth.reduce((q,r)=>q+r.y,0)/oth.length-A.y;const L=Math.hypot(dx,dy)||1;dx/=L;dy/=L;
          const up=Math.max(0,Math.min(...oth.map(r=>r.y-r.hh-TOP))),down=Math.max(0,Math.min(...oth.map(r=>BOT-r.y-r.hh))),own=sys.share||0;
          const aUp=Math.max(0,A.y-A.hh-TOP),aDown=Math.max(0,BOT-A.y-A.hh);
          for(let t=0;t<400;t++){g={x:dx*t*(1-own),y:clamp(dy*t*(1-own),-up,down)};a={x:-dx*t*own,y:clamp(-dy*t*own,-aUp,aDown)};let cov=0;
            for(const r of oth)cov+=Math.max(0,Math.min(A.x+a.x+A.hw,r.x+g.x+r.hw)-Math.max(A.x+a.x-A.hw,r.x+g.x-r.hw))*Math.max(0,Math.min(A.y+a.y+A.hh,r.y+g.y+r.hh)-Math.max(A.y+a.y-A.hh,r.y+g.y-r.hh));
            if(cov<=(1-sys.vis)*4*A.hw*A.hh+.5&&t>=(sys.min||0))break}}
        cs.forEach((c,i)=>{const m=i===k?a:g;c.nud[k]={dx:base[i].x+m.x,dy:base[i].y+m.y}})})});
    // LEGO block: Postgres in the middle, the other pieces stacked edge to edge in a column on each side of it
    if(sys.snap||sys.block)S.bk.forEach(cs=>{const lay=LAYOUT[cs.length],g=sys.block?10:6,P=cs[0];P.blk={dx:0,dy:0,lb:'t'};
      for(const side of[-1,1]){const cc=cs.filter((c,ci)=>ci&&(side<0?['L','BL']:['TR','BR']).includes(lay[ci])),H=cc.reduce((a,c)=>a+c.h,0)+g*(cc.length-1);let y=-H/2;
        cc.forEach((c,i)=>{c.blk={dx:side*(P.w/2+g+c.w/2),dy:y+c.h/2,lb:i?'b':'t'};y+=c.h+g})}
      let x0=1e9,x1=-1e9;cs.forEach(c=>{x0=Math.min(x0,c.blk.dx-c.w/2);x1=Math.max(x1,c.blk.dx+c.w/2)});const ox=-(x0+x1)/2;
      cs.forEach(c=>{c.blk={...c.blk,dx:c.blk.dx+ox,sl:c===P?'C':'s',big:1}})});
    if(sys.wires){const ns='http://www.w3.org/2000/svg',sv=document.createElementNS(ns,'svg');sv.setAttribute('class','wr');sv.setAttribute('viewBox','0 0 1280 694');
      const mk=(tag,cls,r)=>{const e=document.createElementNS(ns,tag);if(cls)e.setAttribute('class',cls);if(r)e.setAttribute('r',r);sv.appendChild(e);return e};
      S.wl=[...Array(4)].map(()=>({l:mk('line'),a:mk('circle','',2.2),b:mk('circle','',2.2),d:mk('circle','pd',3)}));S.el.appendChild(sv)}
    if(sys.frame){const fs=S.fs=sys.fs||'line',fr=document.createElement('div');fr.className='sysf st-'+fs;
      fr.innerHTML='<span class="fl"></span>'+(fs==='corners'?'<i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i>':'')+(fs==='draw'?'<svg class="fd"><rect x=".5" y=".5" rx="8" pathLength="1"/></svg>':'')+(fs==='chips'||fs==='score'?'<div class="fb"></div>':'');
      S.el.appendChild(fr);S.fr=fr;S.frl=fr.querySelector('.fl');S.frb=fr.querySelector('.fb');S.frr=fr.querySelector('rect');S.frs=fr.querySelector('svg');S.frk='';S.frn=-1;S.frc='';
      S.capEl.style.top=fs==='chips'||fs==='score'?'596px':'584px';
      if(sys.ds){const ds=S.ds=sys.ds;fr.classList.add('ds-'+ds);
        if(ds==='label'){S.frl.innerHTML='Your backend · <span class="rt"></span>';S.rt=S.frl.querySelector('.rt');S.dk=''}
        else{S.frl.innerHTML='Your backend · <span class="dgw"><span class="dg"><i class="o"></i><i class="n"></i></span></span> services<em class="dl"></em>';
          const w=fr.querySelector('.dgw');S.dg=w.querySelector('.dg');S.dgo=S.dg.children[0];S.dgn=S.dg.children[1];S.dgl=S.frl.querySelector('.dl');S.dk=''}
        if(ds==='tally'){fr.insertAdjacentHTML('beforeend','<div class="tly">'+'<i></i>'.repeat(6)+'</div>');S.tly=[...fr.querySelectorAll('.tly i')]}}
      // each set's outline is fixed: measured once from its resting layout, never from the moving cards
      S.fbb=S.bk.map(cs=>{let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const c of cs)for(const o of(c.nud?[c.offs[0],...c.nud]:[sys.snap||sys.block?c.blk:c.offs[0]])){const cx=o.dx*(sys.snap||sys.block?1:SP),cy=o.dy;
        x0=Math.min(x0,cx-c.w/2);x1=Math.max(x1,cx+c.w/2);y0=Math.min(y0,cy-c.h/2);y1=Math.max(y1,cy+c.h/2)}return[x0,x1,y0,y1]});S.ftop=Math.min(...S.fbb.map(q=>q[2]));if(S.ds){S.el.appendChild(S.frl);S.frl.classList.add('fixl');S.frl.style.top=(CY+S.ftop-30-6)+'px'}}},
  frame(S,t){const[s,f]=pick(t),cb=order[s],pb=order[(s+NB-1)%NB],n=BUN[cb].length,hold=f>=MV;
    const k=hold?Math.min(n-1,Math.floor((f-MV)/FOC)):-1,fc=hold?S.bk[cb][k]:null,kt=hold?f-MV-k*FOC:0;
    const mv=mode==='creep'?.9*E.io(seg(f,0,MV))+.1*seg(f,MV,durs[s]):mode==='unfold'?E.io(seg(f,.2*MV,MV)):E.io(seg(f,0,MV));
    // how much a card is in focus, 0..1, eased, and always handed on: mid-move the last card of the leaving set passes the light to the new set's Postgres, then each next card takes over in .35 s
    const hIn=E.io(seg(f,.35*MV,.6*MV)),hOut=E.io(seg(f,.5*MV,.75*MV)),fw=c=>{if(c.b===cb&&hold){if(c.bi===k)return k?E.io(seg(kt,0,.3)):1;if(c.bi===k-1)return 1-E.io(seg(kt,.15,.45));return 0}
      if(!hold&&c.b===cb&&c.bi===0)return hIn;return !hold&&c.b===pb&&c.bi===BUN[pb].length-1?1-hOut:0};
    // where each card of set b goes while card kk is the lit one: the lit card whole, the rest small and out of its way
    const pileT=(b,kk,c)=>{if(sys.pile==='nudge')return{dx:c.nud[kk].dx,dy:c.nud[kk].dy,s:1,z:null};const cs=S.bk[b],act=cs[kk],home=act.offs[0],bb=S.fbb[b],X=Math.max(-bb[0],bb[1]),pad=14,rest=cs.filter(x=>x!==act),i=rest.indexOf(c),pm=sys.pile;
      if(c===act)return pm==='inplace'?{dx:home.dx,dy:home.dy,s:1,z:40}:{dx:0,dy:pm==='dock'?-28:0,s:1,z:40};
      if(pm==='dock'){const PS=.36,ws=rest.map(x=>x.w*PS),tot=ws.reduce((a,v)=>a+v,0)+12*(rest.length-1);let x=-tot/2;for(let j=0;j<i;j++)x+=ws[j]+12;return{dx:x+ws[i]/2,dy:bb[3]-pad-c.h*PS/2,s:PS,z:20}}
      const PS=.42;let sx=1,sy=1;
      // in place: the corner farthest from the lit card; centre stage: always the bottom-right corner, so the pile never crosses the middle
      if(pm==='inplace'){let bd=-1;for(const[ax,ay]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const d=Math.hypot(ax*X-home.dx,(ay<0?bb[2]:bb[3])-home.dy);if(d>bd){bd=d;sx=ax;sy=ay}}}
      const mw=Math.max(...rest.map(x=>x.w))*PS,mh=Math.max(...rest.map(x=>x.h))*PS,st=9,ax=sx*(X-pad-mw/2),ay=sy<0?bb[2]+pad+mh/2:bb[3]-pad-mh/2;
      return{dx:ax-sx*st*i,dy:ay-sy*st*i,s:PS,z:30-i}};
    for(const c of S.cards){let u=mv;if(mode==='stagger'){const d=c.bi*.08;u=E.io(seg(f,d,d+MV-.35))}if(CHO){const W=c.b===pb?CHO.L:c.b===cb?CHO.A:wrapj(c.b+s-1)>0?CHO.L:CHO.A;u=E.io(seg(f,W[0]*MV,W[1]*MV))}
      const j=wrapj(c.b+s-1+u+(mode==='creep'?.05:0)),P=place(j);
      let off=c.offs[0];
      if(inner==='swap'){const kk=c.b===cb&&hold?k:c.b===pb&&!hold?BUN[pb].length-1:0,prv=c.b===cb&&hold?Math.max(0,k-1):kk,
        uu=c.b===cb&&hold?(k?E.io(seg(kt,0,.6)):1):c.b===pb&&!hold?0:1,A=c.offs[prv],B=c.offs[kk];
        off=c.b===pb&&!hold?(()=>{const w=E.io(seg(f,0,MV*.6)),L=c.offs[kk],C0=c.offs[0];return{dx:lerp(L.dx,C0.dx,w),dy:lerp(L.dy,C0.dy,w),lb:w<.5?L.lb:C0.lb,big:lerp(L.big,C0.big,w)}})():{dx:lerp(A.dx,B.dx,uu),dy:lerp(A.dy,B.dy,uu),lb:uu<.5?A.lb:B.lb,big:lerp(A.big,B.big,uu)}}
      if(sys.snap||sys.block)off=c.blk;
      let sp=1;if(mode==='unfold'){if(c.b===cb)sp=sys.snap?(hold?lerp(.3,1,E.back(seg(f,MV+.1+c.bi*.14,MV+.52+c.bi*.14))):lerp(1,.3,E.io(seg(f,0,.35*MV)))):f<.8*MV?lerp(1,.3,E.io(seg(f,0,.35*MV))):lerp(.3,SP,E.io(seg(f,.8*MV,MV+.45)));
        else if(c.b===pb&&!hold)sp=f<.7*MV?lerp(SP,.3,E.io(seg(f,0,.35*MV))):lerp(.3,1,E.io(seg(f,.7*MV,MV)))}
      if(CHO&&mode==='unfold'){if(CHO.rigid)sp=1;else if(c.b===cb)sp=f<CHO.Ae[0]*MV?lerp(1,.3,E.io(seg(f,CHO.Ac[0]*MV,CHO.Ac[1]*MV))):lerp(.3,SP,E.io(seg(f,CHO.Ae[0]*MV,CHO.Ae[1]*MV)));
        else if(c.b===pb&&!hold)sp=f<CHO.Le[0]*MV?lerp(SP,.3,E.io(seg(f,CHO.Lc[0]*MV,CHO.Lc[1]*MV))):lerp(.3,1,E.io(seg(f,CHO.Le[0]*MV,CHO.Le[1]*MV)))}
      // Depth: the leaving set sinks back, dims and drops behind; Dip: it ducks under the line on its way out
      const ADJ={dy:0,s:1,f:1,z:null};if(CHO&&c.b===pb&&!hold){const q=Math.sin(Math.PI*seg(f,0,MV));if(CHO.depth){ADJ.s=1-.18*q;ADJ.f=1-.6*q;ADJ.z=3}if(CHO.dip)ADJ.dy=80*Math.sin(Math.PI*seg(f,.15*MV,MV))}
      const w=fw(c),big=off.big||1,sc=P.m*lerp(1,big,clamp(1-P.a*2,0,1))*(inner!=='swap'?1+.04*w:1);
      const ph=c.b===cb?E.io(seg(f,MV+.45,MV+.9)):c.b===pb&&!hold?1-E.io(seg(f,0,.35*MV)):0,fv=lerp(lerp(.72,.5,Math.min(1,P.a)),1,w);
      // the extra spread for connectors is horizontal only, so the set never reaches the caption
      let X0=P.x+off.dx*P.m*sp*P.k,Y0=P.y+off.dy*P.m*Math.min(sp,1)+ADJ.dy,S0=sc*ADJ.s,Z0=null;
      if(sys.pile&&mode==='unfold'){let G=null,e=0;
        if(c.b===cb){e=E.io(seg(f,.8*MV,MV+.45));if(e>0){const B=pileT(cb,hold?k:0,c);if(hold&&k>0){const A=pileT(cb,k-1,c),uu=E.io(seg(kt,0,.7));G={dx:lerp(A.dx,B.dx,uu),dy:lerp(A.dy,B.dy,uu),s:Math.exp(lerp(Math.log(A.s),Math.log(B.s),uu)),z:uu<.5?A.z:B.z}}else G=B}}
        else if(c.b===pb&&!hold){e=1-E.io(seg(f,0,.35*MV));if(e>0)G=pileT(pb,BUN[pb].length-1,c)}
        if(G){X0=lerp(X0,P.x+G.dx*P.m,e);Y0=lerp(Y0,P.y+G.dy*P.m,e);S0=Math.exp(lerp(Math.log(S0),Math.log(G.s*P.m),e));if(e>.5)Z0=G.z}}
      S.put(c,{x:X0,y:Y0,s:S0,k:P.k,o:P.o,f:fv*ADJ.f,z:Z0!==null?Z0:ADJ.z!==null?ADJ.z:w>.01&&!sys.zfix?30+Math.round(w*10):20-Math.round(P.a*4)+(off.sl==='C'?2:1),lb:P.a<.5?off.lb:'x',fl:0,hb:w,gr:0})}
    if(fc)S.focus(fc);else S.focus(f<.55*MV?S.bk[pb][BUN[pb].length-1]:S.bk[cb][0]);
    if(sys.all&&hold)S.nplay=S.bk[cb];
    // each piece clicks into the block: its border and Postgres's flash green on contact
    if(sys.snap&&hold){const set=S.bk[cb];for(const c of set){if(!c.bi)continue;const tc=MV+.4+c.bi*.14,fl=f>=tc?1-seg(f,tc,tc+.45):0;c.n.fl=Math.max(c.n.fl,fl);set[0].n.fl=Math.max(set[0].n.fl,fl)}}
    // the set that shows the system: the centre set while it plays, the previous one while it folds away
    const act=hold?cb:f<.3*MV?pb:-1,set=act<0?null:S.bk[act],pg=set&&set[0],oth=set?set.slice(1):[];
    // a reaction: the card that plays → Postgres → the rest
    let pP=null,pO=null;if(hold&&(sys.pulse||sys.chain)){const fromP=fc===pg;
      if(fromP){pO=seg(kt,.2,.6);pg.n.fl=Math.max(pg.n.fl,1-seg(kt,.2,.65));for(const c of oth)c.n.fl=Math.max(c.n.fl,kt>=.6?1-seg(kt,.6,1.05):0)}
      else{pP=seg(kt,.2,.6);fc.n.fl=Math.max(fc.n.fl,1-seg(kt,.05,.5));pg.n.fl=Math.max(pg.n.fl,kt>=.6?1-seg(kt,.6,1.05):0);pO=seg(kt,.6,1);
        for(const c of oth)if(c!==fc)c.n.fl=Math.max(c.n.fl,kt>=1?1-seg(kt,1,1.45):0)}}
    if(S.wl){const wv=act<0?0:hold?E.out(seg(f,MV+.4,MV+.85)):1-seg(f,0,.25*MV),R0=pg?rect(pg):null;
      S.wl.forEach((w,i)=>{const c=oth[i];if(!c||wv<=0){w.l.style.opacity=0;w.a.style.opacity=0;w.b.style.opacity=0;w.d.style.opacity=0;return}
        const[A,B]=gap(R0,rect(c)),e={x:lerp(A.x,B.x,wv),y:lerp(A.y,B.y,wv)};
        w.l.setAttribute('x1',A.x.toFixed(1));w.l.setAttribute('y1',A.y.toFixed(1));w.l.setAttribute('x2',e.x.toFixed(1));w.l.setAttribute('y2',e.y.toFixed(1));
        w.a.setAttribute('cx',A.x.toFixed(1));w.a.setAttribute('cy',A.y.toFixed(1));w.b.setAttribute('cx',B.x.toFixed(1));w.b.setAttribute('cy',B.y.toFixed(1));
        w.l.style.opacity=.8*wv;w.a.style.opacity=wv;w.b.style.opacity=wv>.98?1:0;
        // pulse dot: travels card → Postgres for the card that plays, then Postgres → every other card
        let u=-1;if(sys.pulse&&hold){if(c===fc&&pP!==null&&pP>0&&pP<1)u=1-pP;else if(c!==fc&&pO!==null&&pO>0&&pO<1)u=pO}
        if(u>=0){w.d.setAttribute('cx',lerp(A.x,B.x,u).toFixed(1));w.d.setAttribute('cy',lerp(A.y,B.y,u).toFixed(1));w.d.style.opacity=1}else w.d.style.opacity=0})}
    if(S.fr){const fs=S.fs;let b,bb,fo,dp=1;
      // Morph keeps one outline on screen and reshapes it from the set that leaves to the set that arrives
      if(fs==='morph'){const u=E.io(seg(f,.1*MV,MV+.3)),sym=q=>{const h=Math.max(-q[0],q[1]);return[-h,h,S.ftop,q[3]]},A=sym(S.fbb[pb]),B=sym(S.fbb[cb]);bb=A.map((v,i)=>lerp(v,B[i],u));b=u<.5?pb:cb;fo=1}
      else{const near=[cb,pb].map(x=>({b:x,a:Math.abs(place(wrapj(x+s-1+mv)).a)})).sort((x,y)=>x.a-y.a)[0];b=near.b;bb=S.fbb[b];
        fo=hold&&b===cb?E.out(seg(f,MV+.3,MV+.8)):b===pb&&!hold?1-seg(f,0,.25*MV):0;
        if(fs==='draw'){dp=hold&&b===cb?E.io(seg(f,MV+.15,MV+1.05)):b===pb&&!hold?1-E.io(seg(f,0,.3*MV)):0;fo=dp>0?1:0}}
      if(fo>0){const x0=CX+bb[0],x1=CX+bb[1],y0=CY+bb[2],y1=CY+bb[3],pd=24,K=[x0-pd,y0-pd-6,x1-x0+2*pd,y1-y0+2*pd+8].map(v=>Math.round(v));if(fs==='morph'){const hw=Math.round(bb[1]+pd);K[0]=CX-hw;K[2]=2*hw}const key=K.join(',');
        if(key!==S.frk){S.frk=key;const[l,tp,w,h]=key.split(',');Object.assign(S.fr.style,{left:l+'px',top:tp+'px',width:w+'px',height:h+'px'});
          if(S.frs){S.frs.setAttribute('width',w);S.frs.setAttribute('height',h);S.frr.setAttribute('width',w-1);S.frr.setAttribute('height',h-1)}}
        if(S.frn!==b){S.frn=b;const cs=S.bk[b],ps=cs.map(c=>c.p);if(!S.ds)S.frl.textContent=fs==='chips'||fs==='score'||fs==='tab'?'Your backend':'Your backend · '+cs.length+' services';
          if(fs==='chips')S.frb.innerHTML=cs.map(c=>`<b data-p="${c.p}">${PR[c.p].lab}</b>`).join('');
          if(fs==='score')S.frb.innerHTML=`<span>${cs.length} of 6 services</span>`+[...'PASCGR'].map(p=>`<i class="${ps.includes(p)?'on':''}"></i>`).join('');S.frc=''}
        if(fs==='chips'){const lit=hold&&b===cb&&fc?fc.p:'';if(lit!==S.frc){S.frc=lit;S.frb.querySelectorAll('b').forEach(e=>e.classList.toggle('on',e.dataset.p===lit))}}
        if(fs==='draw'){S.frr.style.strokeDashoffset=(1-dp).toFixed(3);S.frl.style.opacity=seg(dp,.75,1).toFixed(3)}
        if(fs==='glow')S.fr.style.setProperty('--gl',(hold&&b===cb?.3+.7*(1-seg(kt,0,.8)):.3).toFixed(3))
        if(S.ds)digit(S,BUN[pb].length,BUN[cb].length,hold?1:seg(f,.55*MV-.2,.55*MV+.4),f-.55*MV,BUN[pb].map(k=>k[0]),BUN[cb].map(k=>k[0]))}
      S.fr.style.opacity=fo.toFixed(3)}}}}

const VARS=[bunches({name:'Build your backend',desc:'',mode:'unfold',inner:'spot',sys:{frame:true,fs:'morph',ds:'roll',ch:'overlap',cap:'seq',fx:{blur:'spots',bl:[[.45,1.35],[.8,1],[1.25,.62]],tv:'b',tva:.02,tvb:'normal',noise:'asset',nzb:'overlay'},parts:{}}})];

export { Stage, VARS };
