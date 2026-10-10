
const TAU = Math.PI * 2;
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const f = n => n.toFixed(1);
const rect = (x0,y0,x1,y1) => [[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const ellPts = (cx,cy,rx,ry,n=40) => Array.from({length:n},(_,i)=>{const a=TAU*i/n;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)]});
function lowerArc(cx,cy,rx,ry,level){
  const s=Math.max(-1,Math.min(1,(level-cy)/ry)), a0=Math.asin(s), a1=Math.PI-a0, n=26;
  return Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)]});
}
function quad(a,b,w){const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L*w/2,ny=dx/L*w/2;
  return [[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]]}
function rotPts(pts,cx,cy,deg){const r=deg*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
  return pts.map(([x,y])=>[cx+(x-cx)*c-(y-cy)*s, cy+(x-cx)*s+(y-cy)*c])}
function bbox(pts){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const[x,y]of pts){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}return{x0,y0,x1,y1,w:x1-x0,h:y1-y0}}

/* ---------- the scene: same objects for every style, tagged by role ---------- */
function buildScene(v){
  const S=[], Y=218;
  const poly=(pts,role,extra={})=>S.push({t:'poly',pts,role,...extra});
  const line=(a,b,w,role)=>S.push({t:'line',a,b,w,role});
  const ell=(cx,cy,rx,ry,role)=>S.push({t:'ell',cx,cy,rx,ry,role});
  const ring=(cx,cy,rx,ry,w,role)=>S.push({t:'ring',cx,cy,rx,ry,w,role});
  const bottle=(x,base,h,role,labelRole,w=12)=>{
    poly([[x-4,base-h],[x+4,base-h],[x+4,base-h*.8],[x+w,base-h*.64],[x+w,base],[x-w,base],[x-w,base-h*.64],[x-4,base-h*.8]],role);
    poly(rect(x-w+3,base-h*.46,x+w-3,base-h*.2),labelRole);
  };
  S.push({t:'decor'});
  if(v==='A'){
    [110,148,184,226,262,334,370,406,448,488].forEach((x,i)=>bottle(x,96,[62,48,72,56,44,66,52,74,46,60][i],'backBottle','backLabel',[11,12,10,13,12,11,13,10,12,11][i]));
    poly(rect(80,96,520,104),'shelf');
  } else {
    [150,450].forEach(x=>{line([x,0],[x,58],2,'cord');poly([[x-34,96],[x-12,58],[x+12,58],[x+34,96]],'lamp');ell(x,98,30,4,'glow')});
  }
  poly([[0,400],[600,400],[600,450],[0,450]],'floor');
  poly(rect(70,236,530,402),'front');
  line([58,382],[542,382],6,'rail');
  poly(rect(50,218,550,236),'top');

  const drinks={
    martini(x){ell(x,Y-2,14,3,'foot');line([x,Y-2],[x,Y-40],3,'stem');
      poly([[x-34,Y-80],[x+34,Y-80],[x,Y-40]],'glass');poly([[x-28,Y-75],[x+28,Y-75],[x,Y-45]],'liquid');
      line([x-16,Y-50],[x+12,Y-98],2,'pick');ell(x-5,Y-63,7,7,'garnish');ell(x,Y-80,34,4,'rim')},
    highball(x){poly(rect(x-17,Y-84,x+17,Y),'glass');poly(rect(x-14,Y-66,x+14,Y-3),'liquid');
      poly(rotPts(rect(x-12,Y-60,x,Y-48),x-6,Y-54,14),'ice');poly(rotPts(rect(x,Y-46,x+12,Y-34),x+6,Y-40,-10),'ice');
      line([x+5,Y-58],[x+17,Y-112],3,'pick');ell(x-16,Y-84,13,13,'garnish');ell(x,Y-84,17,3,'rim')},
    wine(x){ell(x,Y-2,16,3,'foot');line([x,Y-2],[x,Y-38],3,'stem');
      poly(lowerArc(x,Y-96,24,58,Y-96),'glass');poly(lowerArc(x,Y-96,21,55,Y-68),'liquid');ell(x,Y-96,24,4,'rim')},
    coupe(x){ell(x,Y-2,16,3,'foot');line([x,Y-2],[x,Y-36],3,'stem');
      poly(lowerArc(x,Y-58,36,22,Y-58),'glass');poly(lowerArc(x,Y-58,32,19,Y-52),'liquid');
      line([x+18,Y-62],[x+26,Y-84],2,'pick');ell(x+18,Y-60,6,6,'garnish');ell(x,Y-58,36,4,'rim')},
    rocks(x){poly(rect(x-22,Y-50,x+22,Y),'glass');poly(rect(x-19,Y-34,x+19,Y-4),'liquid');
      poly(rotPts(rect(x-13,Y-36,x+9,Y-14),x-2,Y-25,8),'ice');
      poly([[x+6,Y-56],[x+30,Y-50],[x+29,Y-45],[x+6,Y-50]],'garnish');ell(x,Y-50,22,3,'rim')},
    bottle(x){bottle(x,Y,112,'bottle','label',14)}
  };
  const roundStool=x=>{
    ell(x,404,62,7,'shadow');
    line([x,302],[x,396],8,'post');ring(x,352,28,6,4,'ring');ell(x,398,38,6,'base');
    poly([...lowerArc(x,300,46,8,300),...lowerArc(x,286,46,8,286).reverse().map(([px,py])=>[px,2*286-py])],'seat');
    ell(x,286,46,8,'seatTop');
  };
  /* a seated patron seen from behind: elbows on the counter, feet on the rail */
  const sitter={
    bob:{shoulder:28,legX:16,legW:7,lean:7,
      torso:[[-6,182],[6,182],[20,190],[28,199],[28,212],[23,238],[22,256],[30,280],[36,298],[-36,298],[-30,280],[-22,256],[-23,238],[-28,212],[-28,199],[-20,190]],
      head:[13,15],
      hair:[[-16,158],[-14,147],[-7,142],[0,141],[7,142],[14,147],[16,158],[18,170],[19,177],[12,176],[0,173],[-12,176],[-19,177],[-18,170]]},
    fedora:{shoulder:35,legX:21,legW:10,lean:-6,
      torso:[[-7,180],[7,180],[24,188],[34,198],[35,212],[30,236],[27,262],[30,284],[28,294],[-28,294],[-30,284],[-27,262],[-30,236],[-35,212],[-34,198],[-24,188]],
      head:[13,16],
      crown:[[-15,150],[-14,136],[-10,128],[-3,131],[0,128],[3,131],[10,128],[14,136],[15,150]]}
  };
  const legs=(x,k)=>{const p=sitter[k];for(const s of[-1,1]){
    line([x+s*p.legX,292],[x+s*(p.legX+2),377],p.legW,'figure');ell(x+s*(p.legX+2),378,p.legW*.9+1,4,'figure')}};
  const body=(x,k,lean)=>{const p=sitter[k],at=pts=>spline(pts.map(([dx,y])=>[x+dx,y]));
    const tilt=pts=>rotPts(pts,x,184,lean??p.lean);
    poly(at(p.torso),'figure');
    for(const s of[-1,1]){const sh=[x+s*(p.shoulder-5),200],el=[x+s*(p.shoulder+17),213],hand=[x+s*(p.shoulder-8),213];
      const sip=lean!==undefined&&k==='fedora'&&s===1;
      line(sh,el,p.legW+4,'figure');
      if(sip)S.push({t:'open',cls:'sip-arm',pivot:el,target:rotPts([hand],el[0],el[1],70)[0]});
      line(el,hand,p.legW+1,'figure');
      if(sip)S.push({t:'close'});
      ell(el[0],el[1],(p.legW+4)/2,(p.legW+4)/2,'figure')}
    if(lean!==undefined)S.push({t:'open',cls:'head-'+k,pivot:[x,184]});
    poly(tilt(rect(x-5,166,x+5,188)),'figure');
    poly(tilt(ellPts(x,162,p.head[0],p.head[1],36)),'figure');
    if(p.hair)poly(tilt(at(p.hair)),'figure');
    if(p.crown){poly(tilt(ellPts(x,150,27,5.5,40)),'figure');poly(tilt(at(p.crown).filter(q=>q[1]<=150.5)),'figure');
      poly(tilt(rect(x-14.5,141,x+14.5,146.5)),'band')}
    if(lean!==undefined)S.push({t:'close'});
  };
  const backedStool=(x,who)=>{
    ell(x,404,66,7,'shadow');
    if(who)legs(x,who);
    line([x-12,300],[x-15,397],5,'post');line([x+12,300],[x+15,397],5,'post');
    line([x-34,300],[x-46,398],6,'post');line([x+34,300],[x+46,398],6,'post');
    line([x-40,358],[x+40,358],4,'ring');
    poly([...lowerArc(x,300,42,8,300),...lowerArc(x,286,42,8,286).reverse().map(([px,py])=>[px,2*286-py])],'seat');
    ell(x,286,42,8,'seatTop');
    if(who)body(x,who);
    if(who)return; // a seated stool loses its back so the figure reads whole
    line([x-30,284],[x-30,256],4,'upright');line([x+30,284],[x+30,256],4,'upright');
    poly([[x-44,244],[x+44,244],[x+40,260],[x-40,260]],'backrest');
  };
  if(v==='E'){S.length=0;photoBar();return S}
  function photoBar(){
    // camera at 1.25m, bar receding to the left like the reference photo; metres -> screen
    const F=520,CH=1.25,N0=[1.6,3.4],D=[-.55,.835],NN=[-.835,-.55],BAR=1.22;
    const zOf=(s,off)=>N0[1]+s*D[1]+off*NN[1];
    const P=(s,off,h)=>{const X=N0[0]+s*D[0]+off*NN[0],Z=zOf(s,off);return [300+F*X/Z,225-F*(h-CH)/Z]};
    const ppm=(s,off)=>F/zOf(s,off);
    const face=(s0,s1,off,h0,h1,role)=>poly([P(s0,off,h1),P(s1,off,h1),P(s1,off,h0),P(s0,off,h0)],role);
    const xf=(n0,map,k)=>{for(const o of S.slice(n0)){if(o.pts)o.pts=o.pts.map(map);if(o.pivot)o.pivot=map(o.pivot);if(o.target)o.target=map(o.target);
      if(o.a){o.a=map(o.a);o.b=map(o.b);o.w=Math.max(1.2,o.w*k)}
      if(o.t==='ell'||o.t==='ring'){[o.cx,o.cy]=map([o.cx,o.cy]);o.rx*=k;o.ry=Math.max(1,o.ry*k);if(o.t==='ring')o.w*=k}}};
    const hull=pts=>{pts=[...pts].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
      const lo=[],up=[];for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}
      for(const p of pts.reverse()){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
      return lo.slice(0,-1).concat(up.slice(0,-1))};
    // left wall window
    [[[18,112],[146,112]],[[146,112],[146,262]],[[146,262],[18,262]],[[18,262],[18,112]],[[82,112],[82,262]],[[18,187],[146,187]]].forEach(([a,b])=>line(a,b,3,'window'));
    ell(322,176,112,112,'sun');
    // backbar: shelves and bottles only right of the sun, a TV, all on the back wall 1.3m behind the bar front
    const BW=-1.3,clear=2.18,hs=[.3,.26,.33,.24,.28,.31,.25,.29];
    [1.48,1.9].forEach((h,j)=>{face(-1,clear,BW,h-.035,h,'shelf');
      let i=j*3;for(let q=-.9;q<clear-.1;q+=.17){if(j===1&&q>.15&&q<1.6)continue;const [bx,by]=P(q,BW,h),sc=ppm(q,BW);
        const gap=j===0&&q>.45&&q<1.2; // a clear patch of wall where the bartender stands
        bottle(bx,by,hs[i++%8]*sc,gap?'gapBottle':'backBottle',gap?'gapBottle':'backLabel',Math.max(1.6,.04*sc))}});
    face(.3,1.5,BW+.01,1.98,2.38,'tv');face(.36,1.44,BW+.02,2.02,2.34,'tvScreen');
    poly([P(.9,BW+.03,2.05),P(1.15,BW+.03,2.17),P(.9,BW+.03,2.29),P(.65,BW+.03,2.17)],'tvField');
    // the bartender: local units are centimetres, origin at his waist where the bar cuts him off.
    // CSS walks him in from the right, shakes a cocktail, and walks him back out (see the <style> below).
    const BT=-.95,btAt=q=>{const [X,Y]=P(q,BT,BAR);return `translate(${X.toFixed(1)}px,${Y.toFixed(1)}px) scale(${(ppm(q,BT)/100*1.2).toFixed(3)})`};
    S.push({t:'open',cls:'bartender',style:`transform:${btAt(-1.6)}`});
    poly(spline([[-17,4],[17,4],[19,-20],[21,-31],[13,-35],[5,-36],[-5,-36],[-13,-35],[-21,-31],[-19,-20]]),'btJacket');
    poly([[-5,-36],[5,-36],[0,-21]],'btShirt');poly([[-5,-35],[0,-32.5],[5,-35],[5,-30],[0,-32.5],[-5,-30]],'btBlack');
    poly(rect(-3.5,-41,3.5,-35),'btBlack');poly(ellPts(0,-47,9,11,30),'btBlack');
    S.push({t:'open',cls:'bt-down'});
    for(const d of[-1,1]){line([d*20,-30],[d*23,-12],8,'btJacket');line([d*23,-12],[d*15,2],7,'btJacket')}
    S.push({t:'close'});
    S.push({t:'open',cls:'bt-up',style:'opacity:0'});
    line([20,-30],[28,-20],8,'btJacket');line([28,-20],[17,-43],7,'btJacket');
    line([-20,-30],[-24,-19],8,'btJacket');line([-24,-19],[6,-36],7,'btJacket');
    S.push({t:'open',cls:'bt-shaker',pivot:[12,-46]});
    poly([[3,-32],[14.5,-29.5],[21,-56],[11,-60]],'btBlack');poly([[5,-34],[13,-32],[19,-56],[12,-58]],'btShaker');poly([[12,-58],[19,-56],[19,-62],[14,-63]],'btBlack');
    ell(17,-44,3.4,3.4,'btBlack');ell(7,-36,3.4,3.4,'btBlack');
    S.push({t:'close'},{t:'close'},{t:'close'});
    const walk=[[0,-1.6],[61,-1.6],[64,-.6],[67,.2],[69,.6],[86,.6],[88,.2],[91,-.6],[94,-1.6],[100,-1.6]];
    S.push({t:'style',css:`@keyframes bt-walk{${walk.map(([p,q])=>`${p}%{transform:${btAt(q)}}`).join('')}}`});
    // canopy over the bar
    face(-1.5,8.2,.25,2.45,3.4,'soffit');
    poly([P(-1.5,.25,2.45),P(8.2,.25,2.45),P(8.2,BW,2.45),P(-1.5,BW,2.45)],'soffit');
    // her name painted on the canopy like a bar sign, receding with it: 45cm capitals, cut-paper jitter
    {const W={C:.68,L:.56,A:.72,I:.3,R:.66,E:.6,J:.52,O:.78,B:.67,S:.62,' ':.34},cap=.45,fs=cap/.7,track=.07,base=2.53,off=.26;
      const text='CLAIRE JACOBS',total=[...text].reduce((t,ch)=>t+W[ch]*fs+track,0)-track;
      let q=1.85+total,i=0;const letters=[];
      for(const ch of text){const w=W[ch]*fs,mid=q-w/2;q-=w+track;i++;if(ch===' ')continue;
        const [x,y]=P(mid,off,base),[x2,y2]=P(mid-.01,off,base),top=P(mid,off,base+cap)[1];
        const m=(y2-y)/(x2-x),sx=(x2-x)/.01/ppm(mid,off),j=Math.sin(i*12.9898)*43758.5453,jr=j-Math.floor(j);
        letters.push({ch,x,y:y+(jr-.5)*1.6,fs:(y-top)/.7,sx,m,rot:(jr-.5)*4})}
      S.push({t:'sign',role:'sign',letters})}
    line(P(1.2,-.35,2.45),P(1.2,-.35,2.13),1.6,'cord');{const [gx,gy]=P(1.2,-.35,2.03),r=.11*ppm(1.2,-.35);ell(gx,gy,r+2,r+2,'globeRim');ell(gx,gy,r,r,'globe')}
    // the bar itself
    poly([P(-1.5,.04,BAR),P(8,.04,BAR),P(8,-.65,BAR),P(-1.5,-.65,BAR)],'top');
    face(-1.5,8,0,.1,1.14,'front');face(-1.5,8,-.06,0,.1,'kick');face(-1.5,8,.04,1.14,BAR,'top');
    [-.6,.6,1.8,3,4.2,5.4,6.6,7.8].forEach(q=>line(P(q,.005,1.08),P(q,.005,.16),Math.max(1.2,.02*ppm(q,0)),'panel'));
    for(let q=1;q<clear;q+=.14)line(P(q,-.55,BAR),P(q,-.55,1.44),Math.max(1.4,.03*ppm(q,-.55)),'tap');
    // drinks at 1.5x true size
    const drinkAt=(fn,q,off,realH,origH)=>{const [bx,by]=P(q,off,BAR),k=realH*1.5*ppm(q,off)/origH,n0=S.length;fn(bx);
      xf(n0,([px,py])=>[bx+(px-bx)*k,by+(py-Y)*k],k)};
    drinkAt(drinks.coupe,.98,-.22,.15,58);const gi=S.push({t:'open',cls:'sip-glass'})-1,gb=P(2.66,-.22,BAR),gh=.09*1.5*ppm(2.66,-.22);drinkAt(drinks.rocks,2.66,-.22,.09,50);S.push({t:'close'});drinkAt(drinks.bottle,3.2,-.3,.30,112);
    // a row of backless stools, far to near; two of them taken
    const who={1.4:['bob',-7],2.2:['fedora',6]};
    [6.2,5.4,4.6,3.8,3,2.2,1.4,.6,-.2].forEach(q=>{const sc=ppm(q,.5),a=.19,w=who[q];
      const [sx,sy]=P(q,.5,.78),k=sc/150,fig=fn=>{const n0=S.length;fn();xf(n0,([px,py])=>[sx+px*k,sy+(py-286)*k],k)};
      if(w)fig(()=>legs(0,w[0]));
      const C4=[[-1,-1],[1,-1],[1,1],[-1,1]];
      C4.forEach(([i,j])=>line(P(q+i*a*.85,.5+j*a*.85,.7),P(q+i*a*1.12,.5+j*a*1.12,0),Math.max(1.4,.035*sc),'post'));
      C4.forEach(([i,j],m)=>{const[n,o]=C4[(m+1)%4];line(P(q+i*a*1.05,.5+j*a*1.05,.28),P(q+n*a*1.05,.5+o*a*1.05,.28),Math.max(1.2,.025*sc),'ring')});
      poly(hull(C4.flatMap(([i,j])=>[P(q+i*a,.5+j*a,.78),P(q+i*a,.5+j*a,.69)])),'seat');
      if(w)fig(()=>body(0,w[0],w[1]));
    });
    {const arm=S.find(o=>o.cls==='sip-arm');S[gi].style=`--dx:${(arm.target[0]-gb[0]).toFixed(1)}px;--dy:${(arm.target[1]-gb[1]+gh*.45).toFixed(1)}px`}
  }
  if(v==='A'){drinks.martini(160);drinks.highball(292);drinks.wine(436);roundStool(200);roundStool(400)}
  else if(v==='C'){
    // drinks at true scale to the figures (~140px per metre): coupe ~15cm, rocks glass ~9cm, bottle ~30cm
    const sized=(fn,x,k=.42)=>{const n=S.length;fn(x);for(const o of S.slice(n)){const sc=([px,py])=>[x+(px-x)*k,Y+(py-Y)*k];
      if(o.pts)o.pts=o.pts.map(sc);if(o.a){o.a=sc(o.a);o.b=sc(o.b);o.w=Math.max(1.6,o.w*k)}
      if(o.t==='ell'){[o.cx,o.cy]=sc([o.cx,o.cy]);o.rx*=k;o.ry=Math.max(1.2,o.ry*k)}}};
    sized(drinks.coupe,262,.63);sized(drinks.rocks,336,.63);sized(drinks.bottle,478,.63);
    backedStool(195,'bob');backedStool(405,'fedora')}
  else{drinks.coupe(138);drinks.rocks(250);drinks.coupe(340);drinks.bottle(470);
    backedStool(195,v==='C'&&'bob');backedStool(405,v==='C'&&'fedora')}
  return S;
}

function spline(pts,k=5){const n=pts.length,P=i=>pts[(i+n)%n],out=[];
  for(let i=0;i<n;i++){const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2);
    for(let s=0;s<k;s++){const t=s/k,t2=t*t,t3=t2*t;
      out.push([0,1].map(j=>.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)))}}
  return out}
function shapeOf(o){
  if(o.t==='poly')return [o.pts];
  if(o.t==='line')return [quad(o.a,o.b,o.w)];
  if(o.t==='ell')return [ellPts(o.cx,o.cy,o.rx,o.ry,Math.max(16,Math.round((o.rx+o.ry)*1.2)))];
  if(o.t==='ring')return [ellPts(o.cx,o.cy,o.rx+o.w/2,o.ry+o.w/2,48),ellPts(o.cx,o.cy,o.rx-o.w/2,Math.max(1,o.ry-o.w/2),48)];
  return [];
}
function subdiv(pts,step){const out=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L/step));
  for(let k=0;k<n;k++)out.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n])}return out}
const jitter=(pts,amp,R)=>pts.map(([x,y])=>[x+(R()-.5)*2*amp,y+(R()-.5)*2*amp]);
const polyD=pts=>'M'+pts.map(p=>f(p[0])+' '+f(p[1])).join('L')+'Z';
function smoothD(pts,closed=true){
  const n=pts.length,P=i=>closed?pts[(i+n)%n]:pts[Math.max(0,Math.min(n-1,i))];
  let d=`M${f(pts[0][0])} ${f(pts[0][1])}`;const last=closed?n:n-1;
  for(let i=0;i<last;i++){const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2);
    d+=`C${f(p1[0]+(p2[0]-p0[0])/6)} ${f(p1[1]+(p2[1]-p0[1])/6)} ${f(p2[0]-(p3[0]-p1[0])/6)} ${f(p2[1]-(p3[1]-p1[1])/6)} ${f(p2[0])} ${f(p2[1])}`}
  return d+(closed?'Z':'');
}
const svgWrap=(inner,defs='')=>`<svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg" role="img"><defs>${defs}</defs>${inner}</svg>`;

/* ---------- Saul Bass: torn paper, flat, two or three colours ---------- */
function bass(S,v,R){const R0=R,R2=mulberry(99);
  const K='#151313',O='#e4572e',C='#f1e7d3',RD='#d7261e',DK='#b8361c';
  const map=v==='A'
    ?{bg:O,shelf:K,backBottle:K,backLabel:C,floor:DK,shadow:'#7e2412',front:K,rail:C,top:C,post:C,ring:C,base:C,seat:C,seatTop:O,
      glass:C,liquid:K,ice:C,garnish:O,pick:K,stem:K,foot:K}
    :{bg:C,cord:K,lamp:K,glow:RD,floor:C,shadow:'#cdbfa6',front:RD,rail:K,top:K,post:K,ring:K,base:K,seat:K,seatTop:C,backrest:K,upright:K,
      glass:K,liquid:RD,ice:C,garnish:C,pick:K,stem:K,foot:K,bottle:K,label:RD};
  let out='';
  if(v==='C')Object.assign(map,{figure:K,band:C,seatTop:K});
  if(v==='E')Object.assign(map,{window:K,sun:RD,shelf:K,backBottle:K,backLabel:C,tv:K,tvScreen:RD,tvField:C,soffit:K,cord:K,globeRim:K,globe:C,
    sign:C,gapBottle:C,btJacket:RD,btShirt:C,btBlack:K,btShaker:C,top:K,front:RD,kick:K,panel:'#b31d16',tap:K,post:K,ring:K,seat:K,figure:K,band:C,pool:K,felt:RD,lamp:K,lampStripe:C,lampGlow:RD});
  if('BCD'.includes(v)) out+=`<circle cx="470" cy="150" r="118" fill="${RD}" opacity=".9"/>`;
  for(const o of S){
    if(o.t==='open'){const st=[o.pivot&&`transform-origin:${f(o.pivot[0])}px ${f(o.pivot[1])}px`,o.style].filter(Boolean).join(';');
      out+=`<g class="${o.cls}"${st?` style="${st}"`:''}>`;continue}
    if(o.t==='close'){out+='</g>';continue}
    if(o.t==='style'){out+=`<style>${o.css}</style>`;continue}
    R=o.role&&o.role.startsWith('bt')?R2:R0;
    const col=map[o.role];if(!col)continue;
    if(o.t==='sign'){out+=`<g class="sign" fill="${col}" font-family="'Post Grotesk','Helvetica Neue',Arial,sans-serif" font-weight="700" text-anchor="middle">`+
      o.letters.map(l=>`<text transform="matrix(${f(l.sx)} ${(l.m*l.sx).toFixed(3)} 0 1 ${f(l.x)} ${f(l.y)}) rotate(${f(l.rot)})" font-size="${f(l.fs)}">${l.ch}</text>`).join('')+'</g>';continue}
    const sh=shapeOf(o).map(p=>{const bb=bbox(p),amp=Math.min(o.role==='figure'?.45:1.15,Math.min(bb.w,bb.h)*.07);return polyD(jitter(subdiv(p,o.role==='figure'?4:8),amp,R))});
    out+=`<path d="${sh.join('')}" fill="${col}" fill-rule="evenodd"/>`}
  if(v==='B') out=`<g transform="rotate(-3.5 300 225) translate(-12 -6) scale(1.05)">${out}</g>`;
  return svgWrap(`<rect width="600" height="450" fill="${map.bg}"/>${out}`);
}

/* ---------- Matisse: soft cut-paper shapes + fronds and stars ---------- */
function frond(cx,cy,len,ang,width,lobes,R){
  const n=60,L=[],Rt=[];
  for(let i=0;i<=n;i++){const t=i/n,w=width*Math.pow(Math.sin(Math.PI*Math.min(t*1.05,1)),.7),
      sway=Math.sin(t*3.1)*len*.06;
    const wl=w*(.42+.58*Math.abs(Math.sin(lobes*Math.PI*t))),wr=w*(.42+.58*Math.abs(Math.sin(lobes*Math.PI*t+1.2)));
    L.push([sway-wl,-t*len]);Rt.push([sway+wr,-t*len])}
  return rotPts([...L,...Rt.reverse()].map(([x,y])=>[cx+x,cy+y]),cx,cy,ang);
}
function star(cx,cy,r,n,R){const p=[];for(let i=0;i<n*2;i++){const a=TAU*i/(n*2)+R()*.2,rr=(i%2?r*.38:r)*(.8+R()*.35);p.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)])}return p}
function matisse(S,v,R){
  const B='#1f45a8',CO='#e8553e',Y='#f3c02e',G='#2f8a4e',PK='#f2a9b8',K='#171513',P='#f7f1e3',LB='#a9cfee';
  const map=v==='A'
    ?{bg:P,shelf:B,backLabel:P,floor:PK,front:B,rail:Y,top:K,post:K,ring:K,base:K,seat:CO,seatTop:Y,
      glass:LB,liquid:Y,ice:P,garnish:G,pick:K,stem:K,foot:K}
    :{bg:CO,cord:K,lamp:Y,glow:P,floor:B,front:Y,rail:K,top:K,post:K,ring:K,base:K,seat:B,seatTop:PK,backrest:B,upright:K,
      glass:P,liquid:G,ice:LB,garnish:PK,pick:K,stem:K,foot:K,bottle:G,label:P};
  const bottleCols=[CO,G,Y,B,PK,G,CO,Y,B,PK];let bi=0;
  const blob=(p,amp=2.2,step=9)=>{const bb=bbox(p);return smoothD(jitter(subdiv(p,step),Math.min(amp,Math.min(bb.w,bb.h)*.07),R))};
  let out='';
  for(const o of S){
    if(o.t==='decor'){
      const fr=v==='A'
        ?[[52,214,190,-8,30,3.5,G],[556,214,170,10,28,3,B],[300,128,70,0,18,2.5,PK]]
        :[[300,212,160,3,32,3.5,PK],[40,210,150,-12,26,3,P],[566,212,140,9,24,3,P]];
      fr.forEach(([x,y,l,a,w,lb,c])=>out+=`<path d="${smoothD(frond(x,y,l,a,w,lb,R))}" fill="${c}"/>`);
      const st=v==='A'?[[300,38,15,CO],[232,70,10,Y],[372,64,11,B],[150,30,8,G],[456,30,9,CO]]
                      :[[300,34,13,Y],[80,40,10,P],[528,46,11,Y],[226,110,7,P],[378,112,7,P]];
      st.forEach(([x,y,r,c])=>out+=`<path d="${smoothD(star(x,y,r,5+Math.floor(R()*2),R))}" fill="${c}"/>`);
      continue}
    let col=o.role==='backBottle'?bottleCols[bi++%10]:map[o.role];if(!col)continue;
    const sh=shapeOf(o).map(p=>blob(p,o.role==='front'||o.role==='floor'?3.2:2.2));
    out+=`<path d="${sh.join('')}" fill="${col}" fill-rule="evenodd"/>`}
  return svgWrap(`<rect width="600" height="450" fill="${map.bg}"/>${out}`);
}

/* ---------- Pen scratch: doubled overshooting lines, hatching, open glass ---------- */
function scratch(S,v,R,id){
  const INK='#1f1c1a',PAPER='#f4efe4';
  let defs='',body='',clipN=0;
  const strokes={main:[],light:[],hatch:[]};
  const sk=(a,b,layer='main',passes=2,j=1.1)=>{
    const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
    for(let p=0;p<passes;p++){const o0=Math.min(L*.18,1+R()*5),o1=Math.min(L*.18,1+R()*5);
      const A=[a[0]-ux*o0+(R()-.5)*2*j,a[1]-uy*o0+(R()-.5)*2*j],B=[b[0]+ux*o1+(R()-.5)*2*j,b[1]+uy*o1+(R()-.5)*2*j];
      const bow=(R()-.5)*Math.min(5,L*.04),M=[(A[0]+B[0])/2+nx*bow,(A[1]+B[1])/2+ny*bow];
      strokes[layer].push(`M${f(A[0])} ${f(A[1])}Q${f(M[0])} ${f(M[1])} ${f(B[0])} ${f(B[1])}`)}};
  const loop=(pts,layer='main',passes=2,j=1)=>{for(let p=0;p<passes;p++){
      const k=Math.floor(R()*pts.length),rot=[...pts.slice(k),...pts.slice(0,k)],extra=rot.slice(0,Math.ceil(pts.length*.15));
      strokes[layer].push(smoothD(jitter([...rot,...extra],j,R),false))}};
  const outline=(pts,layer,passes)=>pts.length>8?loop(pts,layer,passes):pts.forEach((a,i)=>sk(a,pts[(i+1)%pts.length],layer,passes));
  const flush=()=>{for(const[k,arr]of Object.entries(strokes)){if(!arr.length)continue;
      const st={main:'stroke-width="1.35" opacity=".92"',light:'stroke-width=".85" opacity=".6"',hatch:'stroke-width=".7" opacity=".55"'}[k];
      body+=`<path d="${arr.join('')}" fill="none" stroke="${INK}" stroke-linecap="round" ${st}/>`;arr.length=0}};
  const fill=pts=>{flush();body+=`<path d="${polyD(pts)}" fill="${PAPER}"/>`};
  const hatch=(pts,ang,gap,layer='hatch',cross=false)=>{
    flush();const cid=`${id}c${clipN++}`;defs+=`<clipPath id="${cid}"><path d="${polyD(pts)}"/></clipPath>`;
    const bb=bbox(pts),cx=(bb.x0+bb.x1)/2,cy=(bb.y0+bb.y1)/2,D=Math.hypot(bb.w,bb.h)/2+6;const ds=[];
    const go=a=>{const r=a*Math.PI/180,ux=Math.cos(r),uy=Math.sin(r),nx=-uy,ny=ux;
      for(let s=-D;s<=D;s+=gap*(.8+R()*.4)){if(R()<.08)continue;const t0=-D+R()*D*.3,t1=D-R()*D*.3;
        ds.push(`M${f(cx+ux*t0+nx*s)} ${f(cy+uy*t0+ny*s)}L${f(cx+ux*t1+nx*(s+(R()-.5)*2))} ${f(cy+uy*t1+ny*(s+(R()-.5)*2))}`)}};
    go(ang);if(cross)go(ang+80);
    const st={main:'stroke-width="1"',hatch:'stroke-width=".7" opacity=".6"',dense:'stroke-width=".8" opacity=".8"'}[layer]||'';
    body+=`<g clip-path="url(#${cid})"><path d="${ds.join('')}" fill="none" stroke="${INK}" stroke-linecap="round" ${st}/></g>`};
  let bottleI=0;
  for(const o of S){const [pts,inner]=shapeOf(o);switch(o.role){
    case 'shelf': fill(pts);hatch(pts,20,2.4,'dense');outline(pts,'main',2);break;
    case 'backBottle': if(bottleI++%3===0)hatch(pts,55,3.6);outline(pts,'light',2);break;
    case 'backLabel': fill(pts);outline(pts,'light',1);break;
    case 'cord': sk(o.a,o.b,'main',2,.6);break;
    case 'lamp': fill(pts);hatch(pts,40,2.6,'dense',true);outline(pts,'main',2);break;
    case 'glow': for(let i=0;i<7;i++){const x=o.cx-26+i*8.7;sk([x,o.cy+10],[x+(x-o.cx)*.25,o.cy+24+R()*10],'light',1,.6)}break;
    case 'floor': sk([14,400],[586,400],'main',2);for(let i=0;i<5;i++){const x=20+R()*560;sk([x,412+R()*30],[x+30+R()*60,412+R()*30],'light',1)}break;
    case 'shadow': hatch(pts,-4,2.6,'hatch');break;
    case 'front': fill(pts);for(let x=110;x<530;x+=40)sk([x,240],[x,398],'light',1,.8);
      hatch(rect(70,236,530,262),28,2.6,'dense');hatch(pts,62,8);outline(pts,'main',2);break;
    case 'top': fill(pts);outline(pts,'main',2);sk([90,226],[230,226],'light',1);sk([330,229],[500,228],'light',1);break;
    case 'rail': fill(pts);hatch(pts,80,3);sk(o.a.map((c,i)=>c+(i?-3:0)),o.b.map((c,i)=>c+(i?-3:0)),'main',2);sk(o.a.map((c,i)=>c+(i?3:0)),o.b.map((c,i)=>c+(i?3:0)),'main',1);break;
    case 'post': case 'upright': {fill(pts);const half=quad([o.a[0]+o.w*.2,o.a[1]],[o.b[0]+o.w*.2,o.b[1]],o.w*.6);hatch(half,80,2.2,'dense');
      const off=o.w/2;sk([o.a[0]-off,o.a[1]],[o.b[0]-off,o.b[1]],'main',2,.7);sk([o.a[0]+off,o.a[1]],[o.b[0]+off,o.b[1]],'main',2,.7);break}
    case 'ring': loop(ellPts(o.cx,o.cy,o.rx,o.ry,40),'main',2,.8);break;
    case 'base': fill(pts);hatch(pts,10,2.4,'dense');loop(pts,'main',2,.8);break;
    case 'seat': fill(pts);hatch(pts,72,2.8,'dense');outline(pts,'main',2);break;
    case 'seatTop': fill(pts);hatch(pts.filter(p=>p[0]>o.cx+o.rx*.3),60,4);loop(pts,'main',2,.8);break;
    case 'backrest': fill(pts);hatch(pts,70,2.6,'dense');outline(pts,'main',2);break;
    case 'glass': outline(pts,'main',2);break;
    case 'rim': loop(pts,'main',1,.5);break;
    case 'liquid': hatch(pts,45,3.4,'hatch');break;
    case 'ice': fill(pts);outline(pts,'light',2);break;
    case 'garnish': fill(pts);hatch(pts,35,1.8,'dense',true);outline(pts,'main',1);break;
    case 'pick': sk(o.a,o.b,'main',1,.4);break;
    case 'stem': sk(o.a,o.b,'main',2,.4);break;
    case 'foot': loop(pts,'main',2,.5);break;
    case 'bottle': fill(pts);hatch(pts,50,3.2,'dense');outline(pts,'main',2);break;
    case 'label': fill(pts);outline(pts,'light',1);break;
  }}
  flush();
  return svgWrap(`<rect width="600" height="450" fill="${PAPER}"/>${body}`,defs);
}

