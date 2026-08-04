(function V26Patch(){
'use strict';
if(window.__V26_LOADED)return;
window.__V26_LOADED=true;

/* ─── helpers ─── */
function lp(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
function sp(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function loadAch(){return lp('violin_achievements')||{}}
function unlockAch(id,name){
  var a=loadAch();if(a[id])return;a[id]={name:name,date:new Date().toISOString()};
  sp('violin_achievements',a);sfx('achieve_v26');
  if(typeof window.showToast==='function')window.showToast('Achievement: '+name);
}
function addHistory(key,val,max){
  var h=lp(key)||[];h.push(val);if(h.length>(max||50))h=h.slice(-max||-50);sp(key,h);return h;
}

/* ─── SFX 16 types ─── */
var actx=null;
function getACtx(){if(!actx)try{actx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}return actx}
function sfx(type){
  var c=getACtx();if(!c)return;var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);
  var t=c.currentTime,fr=440,dur=0.12,wave='sine';
  switch(type){
    case'bow_weight':fr=330;dur=0.15;wave='triangle';break;
    case'bow_optimal_v26':fr=660;dur=0.25;wave='triangle';break;
    case'inton_tap':fr=494;dur=0.1;break;
    case'inton_session':fr=587;dur=0.18;wave='triangle';break;
    case'vib_spectrum':fr=523;dur=0.12;break;
    case'vib_compare':fr=698;dur=0.2;wave='triangle';break;
    case'burnout_check':fr=392;dur=0.1;break;
    case'burnout_alert':fr=262;dur=0.3;wave='sawtooth';break;
    case'sight_level':fr=440;dur=0.12;break;
    case'sight_advance':fr=784;dur=0.2;wave='triangle';break;
    case'cross_pattern':fr=349;dur=0.1;break;
    case'cross_drill':fr=587;dur=0.15;wave='triangle';break;
    case'stage_breath':fr=294;dur=0.2;wave='sine';break;
    case'stage_calm':fr=440;dur=0.25;wave='triangle';break;
    case'wellness_check':fr=523;dur=0.15;wave='triangle';break;
    case'achieve_v26':fr=880;dur=0.3;wave='triangle';break;
    default:fr=440;dur=0.1;
  }
  o.type=wave;o.frequency.setValueAtTime(fr,t);
  g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t);o.stop(t+dur);
}

/* ═══════════════════════════════════════════════════════
   DATA: 10 Songs (s225-s234)
   ═══════════════════════════════════════════════════════ */
var V26_SONGS=[
  {id:'s225',title:'Violin Concerto in E minor 1st mvt',composer:'Mendelssohn',difficulty:5,key:'E minor',bpm:108,duration:'12:30',techniques:['octaves','ricochet','cadenza'],era:'Romantic'},
  {id:'s226',title:'Liebesleid',composer:'Kreisler',difficulty:3,key:'A minor',bpm:60,duration:'3:40',techniques:['portamento','rubato','vibrato'],era:'Romantic'},
  {id:'s227',title:'Zigeunerweisen Op.20',composer:'Sarasate',difficulty:5,key:'C minor',bpm:92,duration:'8:30',techniques:['left-hand-pizz','harmonics','spiccato'],era:'Romantic'},
  {id:'s228',title:'Salut d&apos;Amour Op.12',composer:'Elgar',difficulty:2,key:'E major',bpm:72,duration:'3:00',techniques:['cantabile','legato','dynamics'],era:'Romantic'},
  {id:'s229',title:'M&eacute;ditation from Tha&iuml;s',composer:'Massenet',difficulty:3,key:'D major',bpm:56,duration:'5:30',techniques:['vibrato','espressivo','portamento'],era:'Romantic'},
  {id:'s230',title:'Violin Concerto No.1 1st mvt',composer:'Prokofiev',difficulty:5,key:'D major',bpm:100,duration:'9:00',techniques:['glissando','harmonics','col-legno'],era:'Modern'},
  {id:'s231',title:'Violin Concerto 1st mvt',composer:'Sibelius',difficulty:5,key:'D minor',bpm:88,duration:'15:00',techniques:['double-stop','cadenza','tremolo'],era:'Romantic'},
  {id:'s232',title:'Violin Concerto in A minor',composer:'Glazunov',difficulty:4,key:'A minor',bpm:96,duration:'20:00',techniques:['arpeggios','cantabile','octaves'],era:'Romantic'},
  {id:'s233',title:'Symphonie Espagnole 1st mvt',composer:'Lalo',difficulty:4,key:'D minor',bpm:104,duration:'8:40',techniques:['spiccato','double-stop','ricochet'],era:'Romantic'},
  {id:'s234',title:'Violin Concerto 1st mvt',composer:'Barber',difficulty:4,key:'A major',bpm:84,duration:'10:00',techniques:['legato','arpeggios','espressivo'],era:'Modern'}
];

/* ═══════════════════════════════════════════════════════
   DATA: 10 Lessons (l251-l260)
   ═══════════════════════════════════════════════════════ */
var V26_LESSONS=[
  {id:'l251',title:'Bow Weight and Gravity Fundamentals',level:'intermediate',duration:'14min',topics:['bow-control','physics','arm-weight']},
  {id:'l252',title:'Tracking Intonation Across Sessions',level:'intermediate',duration:'12min',topics:['intonation','pitch-accuracy','self-assessment']},
  {id:'l253',title:'Understanding Vibrato Spectrum',level:'advanced',duration:'16min',topics:['vibrato','types','spectral-analysis']},
  {id:'l254',title:'Preventing Practice Burnout',level:'beginner',duration:'10min',topics:['practice-strategy','mental-health','recovery']},
  {id:'l255',title:'Adaptive Sight-Reading Strategies',level:'intermediate',duration:'15min',topics:['sight-reading','difficulty-levels','ABRSM']},
  {id:'l256',title:'Optimizing String Crossings',level:'intermediate',duration:'13min',topics:['bow-technique','string-crossing','elbow-height']},
  {id:'l257',title:'Managing Performance Anxiety',level:'all',duration:'18min',topics:['performance','anxiety','coping-strategies']},
  {id:'l258',title:'Musician Wellness and Self-Care',level:'all',duration:'12min',topics:['wellness','health','injury-prevention']},
  {id:'l259',title:'Mendelssohn Concerto Deep Dive',level:'advanced',duration:'20min',topics:['repertoire','romantic','concerto']},
  {id:'l260',title:'v26 Comprehensive Review',level:'all',duration:'15min',topics:['bow-weight','intonation','vibrato','burnout','sight-reading','crossing','anxiety','wellness']}
];

/* ═══════════════════════════════════════════════════════
   DATA: 15 Quiz (q241-q255)
   ═══════════════════════════════════════════════════════ */
var V26_QUIZ=[
  {q:'표준 바이올린 활의 무게는 대략 얼마인가?',a:['약 30g','약 60g','약 90g','약 120g'],c:1},
  {q:'활을 45도 기울였을 때 팁(tip) 쪽에 가해지는 중력 효과는?',a:['증가한다','감소한다','변화 없다','진동한다'],c:1},
  {q:'음정이 지속적으로 샤프(#) 경향을 보이면 어떻게 교정하는가?',a:['손가락을 약간 위로 이동','손가락을 약간 아래로 이동','활 압력 증가','활 속도 감소'],c:1},
  {q:'1센트(cent)는 반음의 몇 분의 1인가?',a:['1/10','1/50','1/100','1/200'],c:2},
  {q:'팔 비브라토(Arm vibrato)의 특징은?',a:['폭이 좁고 빠르다','폭이 넓고 따뜻하다','손가락만 사용한다','손목만 사용한다'],c:1},
  {q:'연습 번아웃의 초기 징후로 가장 대표적인 것은?',a:['연습시간 증가','음정 정확도 점진적 하락','연습 속도 향상','새 곡에 대한 흥미 증가'],c:1},
  {q:'ABRSM Grade 1 초견에서 주로 사용되는 조성은?',a:['C장조/A단조','모든 장조','샤프 4개 이상','플랫 4개 이상'],c:0},
  {q:'인접한 현 이동(예: G→D)에서 가장 중요한 신체 부위는?',a:['손가락','손목','팔꿈치','어깨'],c:2},
  {q:'무대 불안 시 심박수가 상승하면 가장 효과적인 대처법은?',a:['빠르게 연주 시작','깊은 복식호흡','관객을 무시','연주를 멈춤'],c:1},
  {q:'음악가의 청력 보호를 위한 권장 연습 볼륨 상한은?',a:['60dB','75dB','85dB','100dB'],c:2},
  {q:'멘델스존 바이올린 협주곡의 조성은?',a:['D장조','E단조','A단조','G단조'],c:1},
  {q:'사라사테 &quot;지고이네르바이젠&quot;의 뜻은?',a:['스페인 춤곡','집시의 선율','헝가리 광시곡','보헤미안 노래'],c:1},
  {q:'시벨리우스 바이올린 협주곡의 조성은?',a:['A단조','E단조','D단조','G단조'],c:2},
  {q:'활의 프로그(frog) 쪽에서 연주할 때 자연스러운 음량은?',a:['피아니시모(pp)','피아노(p)','포르테(f)','포르테시모(ff)'],c:2},
  {q:'효과적인 연습 세션 사이 권장 휴식 시간은?',a:['5분','10-15분','30분','1시간'],c:1}
];

/* ═══════════════════════════════════════════════════════
   DATA: 12 Achievements
   ═══════════════════════════════════════════════════════ */
var V26_ACHS=[
  {id:'bow_physicist',name:'Bow Physicist',desc:'Explored bow weight distribution across all 9 zones'},
  {id:'inton_tracker',name:'Intonation Tracker',desc:'Analyzed intonation trends across 5+ sessions'},
  {id:'vib_spectral',name:'Vibrato Spectral Analyst',desc:'Compared 3+ vibrato types on the spectrum'},
  {id:'burnout_detective',name:'Burnout Detective',desc:'Checked all 8 fatigue indicators'},
  {id:'sight_adaptor',name:'Sight-Reading Adaptor',desc:'Advanced through 3+ sight-reading levels'},
  {id:'crossing_master',name:'String Crossing Master',desc:'Optimized 4+ crossing patterns'},
  {id:'stage_manager',name:'Stage Manager',desc:'Completed all 4 pre-performance routine phases'},
  {id:'wellness_guru',name:'Wellness Guru',desc:'Achieved A+ in 5+ wellness dimensions'},
  {id:'quiz_v26_master',name:'Quiz v26 Master',desc:'Scored 80%+ on v26 quiz'},
  {id:'song_234',name:'Song Collector 234',desc:'234 songs in the library'},
  {id:'v26_explorer',name:'v26 Explorer',desc:'Explored 5+ v26 features'},
  {id:'v26_complete',name:'v26 Complete',desc:'Completed all v26 achievements'}
];

/* ═══════════════════════════════════════════════════════
   PANEL STYLES
   ═══════════════════════════════════════════════════════ */
var PNL='position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(10,8,5,0.96);overflow-y:auto;display:none;padding:12px;box-sizing:border-box;';
var HDR='font-size:15px;font-weight:700;color:#D4894A;text-align:center;margin:8px 0;';
var SUB='font-size:11px;color:#a08060;text-align:center;margin:4px 0 10px;';
var CLOSE='position:absolute;top:8px;right:12px;font-size:22px;color:#D4894A;cursor:pointer;background:none;border:none;z-index:10;';

function mkPanel(id){
  var p=document.createElement('div');p.id=id;p.style.cssText=PNL;
  var cb=document.createElement('button');cb.textContent='×';cb.style.cssText=CLOSE;
  cb.onclick=function(){p.style.display='none';};
  p.appendChild(cb);return p;
}
function mkCanvas(w,h){
  var c=document.createElement('canvas');c.width=w;c.height=h;
  c.style.cssText='display:block;margin:8px auto;max-width:100%;border-radius:8px;background:#1a1020;border:1px solid #3a2a1a;';
  return c;
}

/* ═══════════════════════════════════════════════════════
   1. BOW WEIGHT GRAVITY SIMULATOR (활무게중력시뮬레이터)
   Canvas 620x400 — 9 zones tip-to-frog weight distribution
   ═══════════════════════════════════════════════════════ */
function createBowWeightPanel(){
  var panel=mkPanel('v26-bowweight-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎻 활무게 중력 시뮬레이터';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='9접점 자연중력 vs 적용압력 분석 · 5역할존(pp~ff)';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var zones=['Tip','Z2','Z3','Z4','Mid','Z6','Z7','Z8','Frog'];
  var naturalWeight=[0.12,0.18,0.25,0.33,0.42,0.52,0.63,0.75,0.88];
  var appliedPressure=[0.55,0.50,0.48,0.45,0.42,0.40,0.38,0.35,0.30];
  var dynZones=[{name:'pp',from:0,to:0.2,color:'rgba(100,149,237,0.15)'},{name:'p',from:0.2,to:0.35,color:'rgba(144,238,144,0.15)'},{name:'mf',from:0.35,to:0.55,color:'rgba(255,215,0,0.15)'},{name:'f',from:0.55,to:0.75,color:'rgba(255,165,0,0.15)'},{name:'ff',from:0.75,to:1.0,color:'rgba(255,100,100,0.15)'}];
  var selAngle=0;
  var angles=[0,10,20,30,45];
  var angleIdx=0;

  function calcGravity(base,angle){return base*Math.cos(angle*Math.PI/180)+0.05*Math.sin(angle*Math.PI/180);}

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,620,400);
    var angle=angles[angleIdx];

    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('Bow Weight Distribution (Tilt: '+angle+'°)',310,25);

    var ox=65,oy=340,w=490,ht=270;
    dynZones.forEach(function(dz){
      var y1=oy-dz.from*ht,y2=oy-dz.to*ht;
      ctx.fillStyle=dz.color;ctx.fillRect(ox,y2,w,y1-y2);
      ctx.fillStyle='#6a5a4a';ctx.font='9px Georgia';ctx.textAlign='left';
      ctx.fillText(dz.name,(ox+w+4),(y1+y2)/2+3);
    });

    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=1;
    for(var i=0;i<=5;i++){var y=oy-i*(ht/5);ctx.beginPath();ctx.moveTo(ox,y);ctx.lineTo(ox+w,y);ctx.stroke();
      ctx.fillStyle='#6a5a4a';ctx.font='10px Georgia';ctx.textAlign='right';ctx.fillText((i*20)+'%',ox-6,y+4);}

    zones.forEach(function(z,i){
      var x=ox+i*(w/(zones.length-1));
      ctx.fillStyle='#8a7a6a';ctx.font='10px Georgia';ctx.textAlign='center';ctx.fillText(z,x,oy+18);
    });

    ctx.beginPath();ctx.strokeStyle='#4fc3f7';ctx.lineWidth=2.5;
    zones.forEach(function(z,i){
      var x=ox+i*(w/(zones.length-1));
      var y=oy-calcGravity(naturalWeight[i],angle)*ht;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.stroke();
    zones.forEach(function(z,i){
      var x=ox+i*(w/(zones.length-1));
      var y=oy-calcGravity(naturalWeight[i],angle)*ht;
      ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='#4fc3f7';ctx.fill();
    });

    ctx.beginPath();ctx.strokeStyle='#ff7043';ctx.lineWidth=2.5;
    zones.forEach(function(z,i){
      var x=ox+i*(w/(zones.length-1));
      var y=oy-appliedPressure[i]*ht;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.stroke();
    zones.forEach(function(z,i){
      var x=ox+i*(w/(zones.length-1));
      var y=oy-appliedPressure[i]*ht;
      ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='#ff7043';ctx.fill();
    });

    ctx.font='11px Georgia';
    ctx.fillStyle='#4fc3f7';ctx.fillText('● Natural Weight',170,380);
    ctx.fillStyle='#ff7043';ctx.fillText('● Applied Pressure',340,380);
    ctx.fillStyle='#a08060';ctx.fillText('Click to change angle',500,380);

    ctx.fillStyle='#D4894A';ctx.font='bold 12px Georgia';ctx.textAlign='right';
    ctx.fillText('Angle: '+angle+'°',600,395);

    addHistory('v26_bowweight_hist',{angle:angle,ts:Date.now()},30);
  }

  cv.addEventListener('click',function(){
    angleIdx=(angleIdx+1)%angles.length;sfx('bow_weight');draw();
    if(angleIdx>=4)unlockAch('bow_physicist','Bow Physicist');
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   2. INTONATION TENDENCY SESSION ANALYZER (음정경향세션분석기)
   Canvas 640x400 — 4 strings x 7 positions heatmap
   ═══════════════════════════════════════════════════════ */
function createIntonPanel(){
  var panel=mkPanel('v26-inton-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎵 음정 경향 세션 분석기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='4현×7포지션 센트편차 히트맵 + 30세션 트렌드';panel.appendChild(s);
  var cv=mkCanvas(640,400);panel.appendChild(cv);

  var strings=['G','D','A','E'];
  var positions=['1st','2nd','3rd','4th','5th','6th','7th'];
  var deviations=[];
  for(var si=0;si<4;si++){var row=[];for(var pi=0;pi<7;pi++){row.push(Math.round((Math.random()-0.5)*30));}deviations.push(row);}

  var sessions=lp('v26_inton_sessions')||[];
  if(sessions.length===0){for(var ss=0;ss<30;ss++){sessions.push(Math.round((Math.random()-0.45)*20));}}

  function centColor(c){
    var a=Math.abs(c);
    if(a<=5)return'rgba(76,175,80,0.7)';
    if(a<=10)return'rgba(255,235,59,0.7)';
    if(a<=15)return'rgba(255,152,0,0.7)';
    return'rgba(244,67,54,0.7)';
  }

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,640,400);

    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('Intonation Tendency Heatmap',320,25);

    var ox=70,oy=50,cw=55,ch=35;
    positions.forEach(function(p,i){
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(p,ox+i*cw+cw/2,oy-5);
    });
    strings.forEach(function(st,si){
      ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='right';
      ctx.fillText(st+' str',ox-8,oy+si*ch+ch/2+4);
      positions.forEach(function(p,pi){
        var val=deviations[si][pi];
        ctx.fillStyle=centColor(val);
        ctx.fillRect(ox+pi*cw+2,oy+si*ch+2,cw-4,ch-4);
        ctx.fillStyle='#fff';ctx.font='bold 10px Georgia';ctx.textAlign='center';
        ctx.fillText((val>0?'+':'')+val+'¢',ox+pi*cw+cw/2,oy+si*ch+ch/2+4);
      });
    });

    ctx.fillStyle='#6a5a4a';ctx.font='10px Georgia';ctx.textAlign='left';
    var legendY=oy+4*ch+20;
    [{c:'rgba(76,175,80,0.7)',t:'±5¢ Good'},{c:'rgba(255,235,59,0.7)',t:'±10¢ OK'},{c:'rgba(255,152,0,0.7)',t:'±15¢ Caution'},{c:'rgba(244,67,54,0.7)',t:'>15¢ Fix'}].forEach(function(l,i){
      ctx.fillStyle=l.c;ctx.fillRect(ox+i*120,legendY,14,14);
      ctx.fillStyle='#a08060';ctx.fillText(l.t,ox+i*120+18,legendY+11);
    });

    var tx=70,ty=230,tw=530,th=140;
    ctx.fillStyle='#D4894A';ctx.font='bold 12px Georgia';ctx.textAlign='center';
    ctx.fillText('30-Session Trend (cents)',tx+tw/2,ty-5);

    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=1;
    for(var i=0;i<=4;i++){
      var y=ty+th-i*(th/4);
      ctx.beginPath();ctx.moveTo(tx,y);ctx.lineTo(tx+tw,y);ctx.stroke();
      ctx.fillStyle='#6a5a4a';ctx.font='9px Georgia';ctx.textAlign='right';
      ctx.fillText((-15+i*7.5).toFixed(0),tx-5,y+3);
    }

    ctx.strokeStyle='rgba(255,215,0,0.3)';ctx.setLineDash([4,4]);
    var zeroY=ty+th/2;ctx.beginPath();ctx.moveTo(tx,zeroY);ctx.lineTo(tx+tw,zeroY);ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();ctx.strokeStyle='#4fc3f7';ctx.lineWidth=2;
    sessions.forEach(function(v,i){
      var x=tx+i*(tw/(sessions.length-1));
      var y=zeroY-v*(th/30);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.stroke();

    sessions.forEach(function(v,i){
      var x=tx+i*(tw/(sessions.length-1));
      var y=zeroY-v*(th/30);
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle='#4fc3f7';ctx.fill();
    });

    if(sessions.length>=5){
      ctx.beginPath();ctx.strokeStyle='#ff7043';ctx.lineWidth=1.5;ctx.setLineDash([6,3]);
      for(var i=2;i<sessions.length-2;i++){
        var avg=(sessions[i-2]+sessions[i-1]+sessions[i]+sessions[i+1]+sessions[i+2])/5;
        var x=tx+i*(tw/(sessions.length-1));
        var y=zeroY-avg*(th/30);
        if(i===2)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.stroke();ctx.setLineDash([]);
    }

    ctx.font='10px Georgia';
    ctx.fillStyle='#4fc3f7';ctx.fillText('● Session',tx+80,ty+th+18);
    ctx.fillStyle='#ff7043';ctx.fillText('--- Moving Avg',tx+200,ty+th+18);

    sp('v26_inton_sessions',sessions);
  }

  var sessionCount=lp('v26_inton_views')||0;
  cv.addEventListener('click',function(){
    sessionCount++;sp('v26_inton_views',sessionCount);sfx('inton_tap');
    deviations.forEach(function(row){row.forEach(function(v,i,a){a[i]=Math.round((Math.random()-0.5)*30);});});
    sessions.push(Math.round((Math.random()-0.45)*20));
    if(sessions.length>30)sessions=sessions.slice(-30);
    draw();
    if(sessionCount>=5)unlockAch('inton_tracker','Intonation Tracker');
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   3. VIBRATO SPECTRUM ANALYZER (비브라토스펙트럼분석기)
   Canvas 620x400 — 6 types, 6-axis Radar, waveform
   ═══════════════════════════════════════════════════════ */
function createVibSpectrumPanel(){
  var panel=mkPanel('v26-vibspectrum-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎶 비브라토 스펙트럼 분석기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='6종 비브라토 · 6축 Radar · 파형 시각화 · S~D등급';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var types=['Arm','Wrist','Finger','Mixed','Wide','Narrow'];
  var axes=['Speed','Width','Regular','Intensity','Warmth','Control'];
  var data={
    'Arm':{vals:[0.5,0.85,0.7,0.75,0.9,0.65],grade:'A',wave:'smooth'},
    'Wrist':{vals:[0.8,0.5,0.75,0.6,0.7,0.8],grade:'A',wave:'quick'},
    'Finger':{vals:[0.9,0.3,0.65,0.45,0.5,0.85],grade:'B',wave:'tight'},
    'Mixed':{vals:[0.7,0.65,0.8,0.7,0.8,0.75],grade:'S',wave:'balanced'},
    'Wide':{vals:[0.4,0.95,0.6,0.85,0.85,0.5],grade:'B',wave:'broad'},
    'Narrow':{vals:[0.85,0.25,0.8,0.4,0.55,0.9],grade:'A',wave:'precise'}
  };
  var selIdx=0;
  var compareIdx=-1;
  var compared=lp('v26_vib_compared')||{};

  function drawRadar(ctx,cx,cy,r,vals,color,alpha){
    var n=vals.length;ctx.beginPath();
    vals.forEach(function(v,i){
      var angle=-Math.PI/2+i*(2*Math.PI/n);
      var x=cx+v*r*Math.cos(angle),y=cy+v*r*Math.sin(angle);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.closePath();ctx.fillStyle=color.replace('1)',alpha+')');ctx.fill();
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();
  }

  function drawWave(ctx,x,y,w,h,type){
    ctx.beginPath();ctx.strokeStyle='#D4894A';ctx.lineWidth=1.5;
    var freq=type==='quick'?12:type==='tight'?16:type==='broad'?5:type==='precise'?14:type==='balanced'?9:7;
    var amp=type==='broad'?0.9:type==='tight'?0.3:type==='precise'?0.25:type==='quick'?0.5:0.6;
    for(var i=0;i<=w;i++){
      var px=x+i;var py=y+h/2-Math.sin(i*freq*Math.PI/w)*amp*h/2;
      if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.stroke();
  }

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,620,400);
    var t=types[selIdx],d=data[t];

    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText(t+' Vibrato Spectrum',310,25);

    var gradeColors={S:'#ffd700',A:'#4caf50',B:'#2196f3',C:'#ff9800',D:'#f44336'};
    ctx.fillStyle=gradeColors[d.grade]||'#fff';ctx.font='bold 22px Georgia';
    ctx.fillText(d.grade,580,35);

    var cx=200,cy=195,r=120;
    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=1;
    for(var ring=1;ring<=5;ring++){
      ctx.beginPath();
      for(var a=0;a<6;a++){
        var angle=-Math.PI/2+a*(Math.PI/3);
        var x=cx+(ring*r/5)*Math.cos(angle),y=cy+(ring*r/5)*Math.sin(angle);
        if(a===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.closePath();ctx.stroke();
    }
    axes.forEach(function(ax,i){
      var angle=-Math.PI/2+i*(Math.PI/3);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(angle),cy+r*Math.sin(angle));ctx.stroke();
      var lx=cx+(r+18)*Math.cos(angle),ly=cy+(r+18)*Math.sin(angle);
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';ctx.fillText(ax,lx,ly+4);
    });

    if(compareIdx>=0&&compareIdx!==selIdx){
      var cd=data[types[compareIdx]];
      drawRadar(ctx,cx,cy,r,cd.vals,'rgba(100,149,237,1)',0.15);
    }
    drawRadar(ctx,cx,cy,r,d.vals,'rgba(255,152,0,1)',0.25);

    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='center';
    ctx.fillText('Waveform',480,90);
    ctx.strokeStyle='#3a2a1a';ctx.strokeRect(390,100,200,60);
    drawWave(ctx,392,100,196,60,d.wave);

    d.vals.forEach(function(v,i){
      var bx=390,by=175+i*28,bw=200,bh=18;
      ctx.fillStyle='#2a1a10';ctx.fillRect(bx,by,bw,bh);
      ctx.fillStyle=gradeColors[d.grade]||'#D4894A';ctx.globalAlpha=0.6;
      ctx.fillRect(bx,by,bw*v,bh);ctx.globalAlpha=1;
      ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.textAlign='left';
      ctx.fillText(axes[i]+': '+Math.round(v*100)+'%',bx+4,by+13);
    });

    var ty=360;
    types.forEach(function(tp,i){
      var tx=40+i*95;
      var isSel=i===selIdx,isCmp=i===compareIdx;
      ctx.fillStyle=isSel?'rgba(255,152,0,0.3)':isCmp?'rgba(100,149,237,0.3)':'rgba(60,50,40,0.5)';
      ctx.fillRect(tx,ty,85,28);ctx.strokeStyle=isSel?'#ff9800':isCmp?'#6495ed':'#3a2a1a';ctx.strokeRect(tx,ty,85,28);
      ctx.fillStyle=isSel?'#ff9800':isCmp?'#6495ed':'#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(tp,tx+42,ty+18);
    });
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect();
    var mx=(e.clientX-rect.left)*(620/rect.width);
    var my=(e.clientY-rect.top)*(400/rect.height);
    if(my>=360&&my<=388){
      var idx=Math.floor((mx-40)/95);
      if(idx>=0&&idx<types.length){
        if(idx===selIdx){compareIdx=compareIdx>=0?-1:((selIdx+1)%types.length);sfx('vib_compare');
          compared[types[selIdx]+'_'+types[compareIdx]]=true;sp('v26_vib_compared',compared);
          if(Object.keys(compared).length>=3)unlockAch('vib_spectral','Vibrato Spectral Analyst');
        }else{selIdx=idx;sfx('vib_spectrum');}
        draw();
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   4. PRACTICE BURNOUT DETECTOR (연습번아웃감지기)
   Canvas 600x380 — 8 fatigue indicators, 30-day trend
   ═══════════════════════════════════════════════════════ */
function createBurnoutPanel(){
  var panel=mkPanel('v26-burnout-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='⚠️ 연습 번아웃 감지기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8피로지표 · 30일 트렌드 · 번아웃위험도 게이지';panel.appendChild(s);
  var cv=mkCanvas(600,380);panel.appendChild(cv);

  var indicators=['Tension','MentalFat','PitchDrop','TempoVar','DynNarrow','ToneDrop','ErrorRate','Motivation'];
  var labels=['Physical Tension','Mental Fatigue','Pitch Accuracy↓','Tempo Instability','Dynamics Narrow','Tone Quality↓','Error Rate↑','Motivation'];
  var values=[0.3,0.4,0.25,0.35,0.2,0.3,0.28,0.75];
  var history30=[];for(var d=0;d<30;d++){history30.push(0.2+Math.random()*0.5);}
  var checkedCount=lp('v26_burnout_checked')||0;

  function riskColor(v){
    if(v<=0.3)return'#4caf50';if(v<=0.5)return'#ffeb3b';if(v<=0.7)return'#ff9800';return'#f44336';
  }
  function riskLabel(v){
    if(v<=0.3)return'OK';if(v<=0.5)return'Caution';if(v<=0.7)return'Rest';return'Burnout!';
  }

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,600,380);

    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Fatigue Indicators',160,22);

    indicators.forEach(function(ind,i){
      var bx=20,by=35+i*36,bw=280,bh=26;
      ctx.fillStyle='#2a1a10';ctx.fillRect(bx,by,bw,bh);
      var v=values[i];
      var inv=ind==='Motivation'?1-v:v;
      ctx.fillStyle=riskColor(inv);ctx.globalAlpha=0.6;
      ctx.fillRect(bx,by,bw*(ind==='Motivation'?v:v),bh);ctx.globalAlpha=1;
      ctx.fillStyle='#fff';ctx.font='10px Georgia';ctx.textAlign='left';
      ctx.fillText(labels[i]+': '+Math.round((ind==='Motivation'?v:v)*100)+'%',bx+6,by+17);
      var tag=ind==='Motivation'?riskLabel(1-v):riskLabel(v);
      ctx.fillStyle=riskColor(inv);ctx.font='bold 9px Georgia';ctx.textAlign='right';
      ctx.fillText(tag,bx+bw-4,by+17);
    });

    var avg=values.reduce(function(a,b,i){return a+(indicators[i]==='Motivation'?1-b:b);},0)/values.length;
    var gx=380,gy=50,gr=55;
    ctx.fillStyle='#D4894A';ctx.font='bold 12px Georgia';ctx.textAlign='center';
    ctx.fillText('Burnout Risk',gx+60,35);

    ctx.beginPath();ctx.arc(gx+60,gy+gr,gr,Math.PI,0);
    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=15;ctx.stroke();

    var startA=Math.PI,endA=Math.PI+avg*Math.PI;
    ctx.beginPath();ctx.arc(gx+60,gy+gr,gr,startA,endA);
    ctx.strokeStyle=riskColor(avg);ctx.lineWidth=15;ctx.stroke();

    ctx.fillStyle=riskColor(avg);ctx.font='bold 18px Georgia';
    ctx.fillText(Math.round(avg*100)+'%',gx+60,gy+gr-5);
    ctx.font='10px Georgia';ctx.fillText(riskLabel(avg),gx+60,gy+gr+12);

    var tx=330,ty=170,tw=250,th=120;
    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='center';
    ctx.fillText('30-Day Trend',tx+tw/2,ty-5);

    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=1;
    ctx.strokeRect(tx,ty,tw,th);

    [{v:0.3,c:'rgba(76,175,80,0.1)'},{v:0.5,c:'rgba(255,235,59,0.1)'},{v:0.7,c:'rgba(255,152,0,0.1)'},{v:1.0,c:'rgba(244,67,54,0.1)'}].forEach(function(z,i){
      var prev=i===0?0:[0.3,0.5,0.7][i-1];
      ctx.fillStyle=z.c;ctx.fillRect(tx,ty+th-(z.v*th),tw,(z.v-prev)*th);
    });

    ctx.beginPath();ctx.strokeStyle='#ff7043';ctx.lineWidth=2;
    history30.forEach(function(v,i){
      var x=tx+i*(tw/(history30.length-1));
      var y=ty+th-v*th;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.stroke();

    var recY=310;
    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='left';
    ctx.fillText('Recovery Tips:',20,recY);
    var tips=avg>0.7?['Take 1-2 days off','Light stretching only','Listen to music passively']:
             avg>0.5?['Reduce session to 20min','Focus on easy pieces','Add 10min breaks']:
             avg>0.3?['Maintain current pace','Vary repertoire','Stay hydrated']:
             ['Great condition!','Keep balanced practice','Consider new challenges'];
    tips.forEach(function(tip,i){
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';
      ctx.fillText('• '+tip,30,recY+16+i*14);
    });
  }

  cv.addEventListener('click',function(){
    values=values.map(function(v,i){return indicators[i]==='Motivation'?Math.min(1,v+0.05*(Math.random()-0.3)):Math.max(0,v+0.1*(Math.random()-0.4));});
    history30.push(values.reduce(function(a,b,i){return a+(indicators[i]==='Motivation'?1-b:b);},0)/values.length);
    if(history30.length>30)history30=history30.slice(-30);
    checkedCount++;sp('v26_burnout_checked',checkedCount);
    if(checkedCount>=8)unlockAch('burnout_detective','Burnout Detective');
    sfx('burnout_check');draw();
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   5. ADAPTIVE SIGHT-READING ENGINE (적응형초견난이도엔진)
   Canvas 620x400 — 8 grades, 6 params, stacked bars
   ═══════════════════════════════════════════════════════ */
function createSightReadPanel(){
  var panel=mkPanel('v26-sightread-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='📚 적응형 초견 난이도 엔진';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='ABRSM 1~8등급 · 6파라미터 · 자동보정 · 마일스톤 로드맵';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var grades=['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8'];
  var params=['Key','Rhythm','Range','Accid.','Artic.','Express.'];
  var paramColors=['#e57373','#ffb74d','#fff176','#81c784','#64b5f6','#ce93d8'];
  var gradeData=[
    [0.15,0.1,0.15,0.05,0.05,0.05],
    [0.25,0.2,0.25,0.1,0.1,0.1],
    [0.35,0.3,0.35,0.2,0.2,0.15],
    [0.5,0.45,0.45,0.3,0.3,0.25],
    [0.6,0.55,0.55,0.45,0.4,0.35],
    [0.75,0.7,0.7,0.6,0.55,0.5],
    [0.85,0.8,0.8,0.75,0.7,0.65],
    [0.95,0.9,0.9,0.85,0.85,0.8]
  ];
  var currentLevel=lp('v26_sight_level')||0;
  var accuracy=lp('v26_sight_accuracy')||[60,65,70,55,50,45,40,35];

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,620,400);

    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('Adaptive Sight-Reading Difficulty',310,25);

    ctx.fillStyle='#ffd700';ctx.font='bold 12px Georgia';
    ctx.fillText('Current: '+grades[currentLevel],310,45);

    var ox=80,oy=60,bw=60,bh=200,gap=6;
    grades.forEach(function(gr,gi){
      var bx=ox+gi*(bw+gap);
      var isCurrent=gi===currentLevel;

      if(isCurrent){ctx.fillStyle='rgba(255,215,0,0.1)';ctx.fillRect(bx-2,oy-5,bw+4,bh+35);
        ctx.strokeStyle='#ffd700';ctx.lineWidth=1;ctx.strokeRect(bx-2,oy-5,bw+4,bh+35);}

      var cumH=0;
      gradeData[gi].forEach(function(v,pi){
        var segH=v*bh*0.16;
        ctx.fillStyle=paramColors[pi];ctx.globalAlpha=isCurrent?0.8:0.4;
        ctx.fillRect(bx,oy+bh-cumH-segH,bw,segH);
        cumH+=segH;
      });
      ctx.globalAlpha=1;

      ctx.fillStyle=isCurrent?'#ffd700':'#a08060';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(gr,bx+bw/2,oy+bh+14);

      var acc=accuracy[gi];
      ctx.fillStyle=acc>=70?'#4caf50':acc>=50?'#ffeb3b':'#f44336';
      ctx.font='bold 10px Georgia';ctx.fillText(acc+'%',bx+bw/2,oy+bh+26);
    });

    var lx=80,ly=300;
    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='left';
    ctx.fillText('Parameters:',lx,ly);
    params.forEach(function(p,i){
      ctx.fillStyle=paramColors[i];ctx.fillRect(lx+i*90,ly+8,12,12);
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='left';
      ctx.fillText(p,lx+i*90+16,ly+18);
    });

    var ry=345;
    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='center';
    ctx.fillText('Progression Roadmap',310,ry);
    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(80,ry+20);ctx.lineTo(560,ry+20);ctx.stroke();

    grades.forEach(function(gr,i){
      var mx=80+i*((560-80)/7);
      var passed=i<currentLevel,current=i===currentLevel;
      ctx.beginPath();ctx.arc(mx,ry+20,6,0,Math.PI*2);
      ctx.fillStyle=passed?'#4caf50':current?'#ffd700':'#3a2a1a';ctx.fill();
      ctx.strokeStyle=passed?'#4caf50':current?'#ffd700':'#6a5a4a';ctx.stroke();
    });

    if(currentLevel<7){
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText('Need 70%+ accuracy to advance',310,ry+40);
    }else{
      ctx.fillStyle='#ffd700';ctx.font='bold 10px Georgia';ctx.textAlign='center';
      ctx.fillText('Maximum level reached!',310,ry+40);
    }
  }

  cv.addEventListener('click',function(){
    accuracy[currentLevel]=Math.min(100,accuracy[currentLevel]+Math.round(Math.random()*8+2));
    sp('v26_sight_accuracy',accuracy);
    if(accuracy[currentLevel]>=70&&currentLevel<7){
      currentLevel++;sp('v26_sight_level',currentLevel);sfx('sight_advance');
      if(currentLevel>=3)unlockAch('sight_adaptor','Sight-Reading Adaptor');
    }else{sfx('sight_level');}
    draw();
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   6. STRING CROSSING PATTERN OPTIMIZER (현이동패턴최적화기)
   Canvas 620x380 — 6 patterns, speed/accuracy matrix
   ═══════════════════════════════════════════════════════ */
function createCrossingPanel(){
  var panel=mkPanel('v26-crossing-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎻 현이동 패턴 최적화기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='6패턴 속도/정확도 매트릭스 · 팔꾼치높이 · 드릴 추천';panel.appendChild(s);
  var cv=mkCanvas(620,380);panel.appendChild(cv);

  var patterns=[
    {name:'G↔D',type:'Adjacent',speed:0.82,accuracy:0.88,difficulty:1,elbow:'Low-Mid'},
    {name:'D↔A',type:'Adjacent',speed:0.85,accuracy:0.90,difficulty:1,elbow:'Mid'},
    {name:'A↔E',type:'Adjacent',speed:0.80,accuracy:0.86,difficulty:1,elbow:'Mid-High'},
    {name:'G↔A',type:'Skip-one',speed:0.65,accuracy:0.72,difficulty:3,elbow:'Low→Mid'},
    {name:'D↔E',type:'Skip-one',speed:0.68,accuracy:0.75,difficulty:3,elbow:'Mid→High'},
    {name:'G↔E',type:'Skip-two',speed:0.45,accuracy:0.55,difficulty:5,elbow:'Full sweep'}
  ];
  var optimized=lp('v26_crossing_opt')||{};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,380);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,620,380);

    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('String Crossing Pattern Optimizer',310,25);

    var ox=30,oy=50,rw=560,rh=35;
    ['Pattern','Type','Speed','Accuracy','Difficulty','Elbow'].forEach(function(col,i){
      var cw=[80,80,120,120,80,100][i];
      var cx=ox+[0,80,160,280,400,480][i];
      ctx.fillStyle='#D4894A';ctx.font='bold 10px Georgia';ctx.textAlign='center';
      ctx.fillText(col,cx+cw/2,oy);
    });

    patterns.forEach(function(p,pi){
      var ry=oy+12+pi*rh;
      var isWeak=p.accuracy<0.75;
      if(isWeak){ctx.fillStyle='rgba(244,67,54,0.08)';ctx.fillRect(ox,ry-2,rw,rh-2);}

      ctx.fillStyle='#fff';ctx.font='11px Georgia';ctx.textAlign='center';
      ctx.fillText(p.name,ox+40,ry+20);

      ctx.fillStyle='#a08060';ctx.font='10px Georgia';
      ctx.fillText(p.type,ox+120,ry+20);

      var sw=100;
      ctx.fillStyle='#2a1a10';ctx.fillRect(ox+165,ry+6,sw,14);
      ctx.fillStyle=p.speed>0.8?'#4caf50':p.speed>0.6?'#ffeb3b':'#f44336';
      ctx.fillRect(ox+165,ry+6,sw*p.speed,14);
      ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.fillText(Math.round(p.speed*100)+'%',ox+215,ry+17);

      ctx.fillStyle='#2a1a10';ctx.fillRect(ox+285,ry+6,sw,14);
      ctx.fillStyle=p.accuracy>0.85?'#4caf50':p.accuracy>0.7?'#ffeb3b':'#f44336';
      ctx.fillRect(ox+285,ry+6,sw*p.accuracy,14);
      ctx.fillStyle='#fff';ctx.fillText(Math.round(p.accuracy*100)+'%',ox+335,ry+17);

      var stars='';for(var d=0;d<5;d++)stars+=d<p.difficulty?'★':'☆';
      ctx.fillStyle='#ffd700';ctx.font='10px Georgia';ctx.fillText(stars,ox+440,ry+20);

      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.fillText(p.elbow,ox+530,ry+20);
    });

    var ey=280;
    ctx.fillStyle='#D4894A';ctx.font='bold 12px Georgia';ctx.textAlign='center';
    ctx.fillText('Elbow Height Visualization',310,ey);

    var elbowPositions=['Low','Low-Mid','Mid','Mid-High','High','Full'];
    elbowPositions.forEach(function(ep,i){
      var ex=50+i*90,eh=ey+15;
      var height=20+i*15;
      ctx.fillStyle='rgba(212,137,74,0.3)';ctx.fillRect(ex,eh+60-height,70,height);
      ctx.strokeStyle='#D4894A';ctx.strokeRect(ex,eh+60-height,70,height);
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(ep,ex+35,eh+75);
    });

    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='left';
    ctx.fillText('Weak Pattern Drills:',30,365);
    var weakPatterns=patterns.filter(function(p){return p.accuracy<0.75;});
    if(weakPatterns.length===0){ctx.fillStyle='#4caf50';ctx.fillText('All patterns strong!',200,365);}
    else{weakPatterns.forEach(function(wp,i){
      ctx.fillStyle='#ff7043';ctx.font='10px Georgia';
      ctx.fillText('• '+wp.name+': Slow practice at 50% tempo',200+i*200,365);
    });}
  }

  cv.addEventListener('click',function(){
    patterns.forEach(function(p){
      p.speed=Math.min(1,p.speed+Math.random()*0.05);
      p.accuracy=Math.min(1,p.accuracy+Math.random()*0.05);
    });
    var optCount=patterns.filter(function(p){return p.accuracy>=0.8;}).length;
    optimized.count=optCount;sp('v26_crossing_opt',optimized);
    if(optCount>=4)unlockAch('crossing_master','String Crossing Master');
    sfx('cross_pattern');draw();
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   7. PERFORMANCE ANXIETY MANAGEMENT (무대불안관리시뮬레이터)
   Canvas 600x380 — 8 anxiety factors, biofeedback gauges
   ═══════════════════════════════════════════════════════ */
function createStageAnxPanel(){
  var panel=mkPanel('v26-stageanx-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎭 무대 불안 관리 시뮬레이터';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8불안요소 · 대처전략 Radar · 4단계 사전루틴';panel.appendChild(s);
  var cv=mkCanvas(600,380);panel.appendChild(cv);

  var factors=['Heart Rate','Breathing','Muscle Tens.','Mental Focus','Memory Conf.','Audience Aw.','Self-Crit.','Time Percep.'];
  var levels=[0.7,0.6,0.5,0.4,0.45,0.65,0.55,0.5];
  var strategies=['Deep Breathing','Visualization','Progressive Relax','Positive Self-talk','Routine Focus'];
  var stratEffect=[0.85,0.7,0.75,0.65,0.8];
  var phases=['Physical','Mental','Musical','Social'];
  var phaseComplete=lp('v26_stage_phases')||[false,false,false,false];

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,600,380);

    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Anxiety Factors',150,22);

    factors.forEach(function(f,i){
      var bx=15,by=35+i*38,bw=270,bh=28;
      ctx.fillStyle='#2a1a10';ctx.fillRect(bx,by,bw,bh);

      var v=levels[i];
      var col=v>0.7?'#f44336':v>0.5?'#ff9800':v>0.3?'#ffeb3b':'#4caf50';
      ctx.fillStyle=col;ctx.globalAlpha=0.5;
      ctx.fillRect(bx,by,bw*v,bh);ctx.globalAlpha=1;

      ctx.fillStyle='#fff';ctx.font='10px Georgia';ctx.textAlign='left';
      ctx.fillText(f,bx+6,by+18);
      ctx.textAlign='right';ctx.fillText(Math.round(v*100)+'%',bx+bw-6,by+18);

      var pulseR=3+v*5;
      ctx.beginPath();ctx.arc(bx+bw+15,by+bh/2,pulseR,0,Math.PI*2);
      ctx.fillStyle=col;ctx.globalAlpha=0.4+v*0.6;ctx.fill();ctx.globalAlpha=1;
    });

    var cx=430,cy=120,cr=70;
    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='center';
    ctx.fillText('Coping Strategies',cx,30);

    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=1;
    for(var ring=1;ring<=5;ring++){
      ctx.beginPath();
      for(var a=0;a<5;a++){
        var angle=-Math.PI/2+a*(2*Math.PI/5);
        var x=cx+(ring*cr/5)*Math.cos(angle),y=cy+(ring*cr/5)*Math.sin(angle);
        if(a===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.closePath();ctx.stroke();
    }

    strategies.forEach(function(st,i){
      var angle=-Math.PI/2+i*(2*Math.PI/5);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+cr*Math.cos(angle),cy+cr*Math.sin(angle));ctx.strokeStyle='#3a2a1a';ctx.stroke();
      var lx=cx+(cr+20)*Math.cos(angle),ly=cy+(cr+20)*Math.sin(angle);
      ctx.fillStyle='#a08060';ctx.font='8px Georgia';ctx.textAlign='center';ctx.fillText(st,lx,ly+3);
    });

    ctx.beginPath();
    stratEffect.forEach(function(v,i){
      var angle=-Math.PI/2+i*(2*Math.PI/5);
      var x=cx+v*cr*Math.cos(angle),y=cy+v*cr*Math.sin(angle);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.closePath();ctx.fillStyle='rgba(76,175,80,0.25)';ctx.fill();
    ctx.strokeStyle='#4caf50';ctx.lineWidth=2;ctx.stroke();

    var py=230;
    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='center';
    ctx.fillText('Pre-Performance Routine',300,py);

    phases.forEach(function(ph,i){
      var px=30+i*142,pw=130,pph=50;
      ctx.fillStyle=phaseComplete[i]?'rgba(76,175,80,0.15)':'rgba(60,50,40,0.3)';
      ctx.fillRect(px,py+10,pw,pph);
      ctx.strokeStyle=phaseComplete[i]?'#4caf50':'#3a2a1a';ctx.strokeRect(px,py+10,pw,pph);

      ctx.fillStyle=phaseComplete[i]?'#4caf50':'#a08060';ctx.font='bold 10px Georgia';ctx.textAlign='center';
      ctx.fillText('Phase '+(i+1)+': '+ph,px+pw/2,py+30);
      ctx.fillText(phaseComplete[i]?'✓ Done':'Click to complete',px+pw/2,py+48);

      if(i<3){ctx.fillStyle='#3a2a1a';ctx.fillText('→',px+pw+6,py+35);}
    });

    var avgAnx=levels.reduce(function(a,b){return a+b;},0)/levels.length;
    ctx.fillStyle='#D4894A';ctx.font='bold 12px Georgia';ctx.textAlign='center';
    ctx.fillText('Overall Anxiety: '+Math.round(avgAnx*100)+'% '+(avgAnx>0.6?'⚠️':avgAnx>0.4?'ℹ️':'✅'),300,345);

    var tips=avgAnx>0.6?'Try deep breathing before performing':avgAnx>0.4?'Practice visualization techniques':'You are well prepared!';
    ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.fillText(tips,300,365);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect();
    var mx=(e.clientX-rect.left)*(600/rect.width);
    var my=(e.clientY-rect.top)*(380/rect.height);

    if(my>=240&&my<=290){
      var phIdx=Math.floor((mx-30)/142);
      if(phIdx>=0&&phIdx<4){
        phaseComplete[phIdx]=true;sp('v26_stage_phases',phaseComplete);
        levels=levels.map(function(v){return Math.max(0.1,v-0.08);});
        sfx('stage_calm');
        if(phaseComplete.every(function(p){return p;}))unlockAch('stage_manager','Stage Manager');
        draw();return;
      }
    }
    levels=levels.map(function(v){return Math.max(0.1,v-0.05*(Math.random()+0.5));});
    sfx('stage_breath');draw();
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   8. MUSICIAN WELLNESS DASHBOARD (음악가웰니스종합대시보드)
   Canvas 620x400 — 8 dimensions, semi-circle gauges
   ═══════════════════════════════════════════════════════ */
function createWellnessPanel(){
  var panel=mkPanel('v26-wellness-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🌿 음악가 웰니스 종합 대시보드';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8차원 반원게이지 4x2 · 종합 S~D등급 · 20세션 히스토리';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var dims=['Physical','Hearing','Hand/Wrist','Posture','Mental','Practice Bal.','Perf. Conf.','Growth'];
  var values=[0.72,0.85,0.68,0.6,0.75,0.7,0.55,0.8];
  var weights=[0.15,0.15,0.15,0.1,0.1,0.1,0.1,0.15];
  var history20=lp('v26_wellness_hist')||[];
  if(history20.length===0){for(var hh=0;hh<20;hh++){history20.push(0.5+Math.random()*0.35);}}
  var wellnessViews=lp('v26_wellness_views')||0;

  function gradeFromVal(v){return v>=0.9?'S':v>=0.75?'A':v>=0.6?'B':v>=0.4?'C':'D';}
  function gradeColor(g){return{S:'#ffd700',A:'#4caf50',B:'#2196f3',C:'#ff9800',D:'#f44336'}[g]||'#fff';}

  function drawGauge(ctx,cx,cy,r,val,label){
    ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,0);
    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=10;ctx.stroke();

    var endA=Math.PI+val*Math.PI;
    ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,endA);
    var g=gradeFromVal(val);ctx.strokeStyle=gradeColor(g);ctx.lineWidth=10;ctx.stroke();

    ctx.fillStyle=gradeColor(g);ctx.font='bold 16px Georgia';ctx.textAlign='center';
    ctx.fillText(g,cx,cy-5);
    ctx.font='9px Georgia';ctx.fillText(Math.round(val*100)+'%',cx,cy+10);
    ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.fillText(label,cx,cy+r+15);
  }

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,620,400);

    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('Musician Wellness Dashboard',310,25);

    var gw=140,gh=80,cols=4,startX=25,startY=45;
    dims.forEach(function(d,i){
      var col=i%cols,row=Math.floor(i/cols);
      var cx=startX+col*(gw+8)+gw/2;
      var cy=startY+row*(gh+45)+gh/2;
      drawGauge(ctx,cx,cy,32,values[i],d);
    });

    var composite=values.reduce(function(a,v,i){return a+v*weights[i];},0);
    var cg=gradeFromVal(composite);
    var compX=510,compY=115;
    ctx.fillStyle='rgba(40,30,20,0.5)';ctx.fillRect(compX-55,compY-50,110,90);
    ctx.strokeStyle=gradeColor(cg);ctx.strokeRect(compX-55,compY-50,110,90);
    ctx.fillStyle=gradeColor(cg);ctx.font='bold 28px Georgia';ctx.textAlign='center';
    ctx.fillText(cg,compX,compY);
    ctx.font='10px Georgia';ctx.fillText('Overall: '+Math.round(composite*100)+'%',compX,compY+18);
    ctx.fillStyle='#D4894A';ctx.font='bold 9px Georgia';ctx.fillText('Composite',compX,compY-35);

    var tx=40,ty=250,tw=540,th=100;
    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='center';
    ctx.fillText('20-Session Wellness History',tx+tw/2,ty-5);

    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=1;
    for(var i=0;i<=4;i++){var y=ty+th-i*(th/4);ctx.beginPath();ctx.moveTo(tx,y);ctx.lineTo(tx+tw,y);ctx.stroke();}

    ctx.beginPath();ctx.strokeStyle='#4caf50';ctx.lineWidth=2;
    history20.forEach(function(v,i){
      var x=tx+i*(tw/(history20.length-1));
      var y=ty+th-v*th;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.stroke();

    history20.forEach(function(v,i){
      var x=tx+i*(tw/(history20.length-1));
      var y=ty+th-v*th;
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle='#4caf50';ctx.fill();
    });

    var alertY=375;
    var lowDims=dims.filter(function(d,i){return values[i]<0.6;});
    if(lowDims.length>0){
      ctx.fillStyle='#f44336';ctx.font='bold 10px Georgia';ctx.textAlign='center';
      ctx.fillText('⚠ Attention: '+lowDims.join(', ')+' need improvement',310,alertY);
    }else{
      ctx.fillStyle='#4caf50';ctx.font='bold 10px Georgia';ctx.textAlign='center';
      ctx.fillText('✅ All wellness dimensions are healthy!',310,alertY);
    }
  }

  cv.addEventListener('click',function(){
    values=values.map(function(v){return Math.min(1,Math.max(0.2,v+0.06*(Math.random()-0.3)));});
    var composite=values.reduce(function(a,v,i){return a+v*weights[i];},0);
    history20.push(composite);if(history20.length>20)history20=history20.slice(-20);
    sp('v26_wellness_hist',history20);
    wellnessViews++;sp('v26_wellness_views',wellnessViews);
    var highCount=values.filter(function(v){return v>=0.75;}).length;
    if(highCount>=5)unlockAch('wellness_guru','Wellness Guru');
    sfx('wellness_check');draw();
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   9. QUIZ v26
   ═══════════════════════════════════════════════════════ */
function createQuizPanel(){
  var panel=mkPanel('v26-quiz-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='📝 퀴즈 v26';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='15문항 · 활무게/음정/비브라토/번아웃/초견/현이동/무대불안/웰니스';panel.appendChild(s);
  var wrap=document.createElement('div');wrap.style.cssText='max-width:560px;margin:0 auto;';panel.appendChild(wrap);

  var score=0,answered=0,total=V26_QUIZ.length;

  V26_QUIZ.forEach(function(qq,qi){
    var qd=document.createElement('div');qd.style.cssText='margin:10px 0;padding:10px;border:1px solid #3a2a1a;border-radius:8px;background:#1a1020;';
    var qt=document.createElement('div');qt.style.cssText='font-size:12px;color:#D4894A;margin-bottom:6px;font-weight:600;';
    qt.innerHTML='Q'+(qi+1)+'. '+qq.q;qd.appendChild(qt);

    qq.a.forEach(function(ans,ai){
      var ab=document.createElement('button');
      ab.style.cssText='display:block;width:100%;text-align:left;padding:6px 10px;margin:3px 0;border:1px solid #3a2a1a;border-radius:6px;background:transparent;color:#a08060;cursor:pointer;font-size:11px;font-family:Georgia,serif;';
      ab.textContent=ans;
      ab.addEventListener('click',function(){
        if(qd.dataset.done)return;qd.dataset.done='1';answered++;
        if(ai===qq.c){score++;ab.style.borderColor='#4caf50';ab.style.color='#4caf50';ab.style.background='rgba(76,175,80,0.1)';sfx('sight_advance');}
        else{ab.style.borderColor='#f44336';ab.style.color='#f44336';
          qd.querySelectorAll('button')[qq.c].style.borderColor='#4caf50';qd.querySelectorAll('button')[qq.c].style.color='#4caf50';sfx('burnout_alert');}
        if(answered===total){
          var pct=Math.round(score/total*100);
          var res=document.createElement('div');res.style.cssText='text-align:center;padding:12px;margin:10px 0;border:2px solid '+(pct>=80?'#ffd700':'#ff9800')+';border-radius:8px;color:'+(pct>=80?'#ffd700':'#ff9800')+';font-size:14px;font-weight:bold;';
          res.textContent='결과: '+score+'/'+total+' ('+pct+'%)';wrap.appendChild(res);
          if(pct>=80)unlockAch('quiz_v26_master','Quiz v26 Master');
        }
      });
      qd.appendChild(ab);
    });
    wrap.appendChild(qd);
  });
  document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════ */
function addV26Nav(){
  var navTarget=document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){
    var allNav=document.querySelectorAll('div[style*="flex-wrap"]');
    if(allNav.length>0)navTarget=allNav[allNav.length-1];
  }
  if(!navTarget){navTarget=document.createElement('div');navTarget.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px;justify-content:center;';document.body.appendChild(navTarget);}

  var btns=[
    {label:'BowWt',panel:'v26-bowweight-panel',color:'#4fc3f7',key:'KeyQ'},
    {label:'IntonTr',panel:'v26-inton-panel',color:'#81c784',key:'KeyW'},
    {label:'VibSpec',panel:'v26-vibspectrum-panel',color:'#ce93d8',key:'KeyE'},
    {label:'Burnout',panel:'v26-burnout-panel',color:'#ff7043',key:'KeyR'},
    {label:'SightRd',panel:'v26-sightread-panel',color:'#ffd54f',key:'KeyT'},
    {label:'StrCros',panel:'v26-crossing-panel',color:'#4db6ac',key:'KeyY'},
    {label:'StgAnx',panel:'v26-stageanx-panel',color:'#ef5350',key:'KeyU'},
    {label:'Wellnes',panel:'v26-wellness-panel',color:'#aed581',key:'KeyI'},
    {label:'Quiz26',panel:'v26-quiz-panel',color:'#D4894A',key:'Digit0'}
  ];

  var opened=lp('v26_opened')||{};

  btns.forEach(function(b){
    var btn=document.createElement('button');
    btn.textContent=b.label;
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid '+b.color+';background:transparent;color:'+b.color+';cursor:pointer;font-size:0.72em;margin:2px;';
    btn.addEventListener('click',function(){
      var p=document.getElementById(b.panel);
      if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('bow_weight');
        opened[b.label]=true;sp('v26_opened',opened);
        if(Object.keys(opened).length>=5)unlockAch('v26_explorer','v26 Explorer');
      }
    });
    navTarget.appendChild(btn);
  });

  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    btns.forEach(function(b){
      if(e.code===b.key){
        e.preventDefault();
        var p=document.getElementById(b.panel);
        if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('bow_weight');
          opened[b.label]=true;sp('v26_opened',opened);
          if(Object.keys(opened).length>=5)unlockAch('v26_explorer','v26 Explorer');
        }
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════
   REGISTER DATA
   ═══════════════════════════════════════════════════════ */
function registerData(){
  if(typeof window.SONG_DB!=='undefined'&&Array.isArray(window.SONG_DB)){
    V26_SONGS.forEach(function(s){
      if(!window.SONG_DB.find(function(x){return x.id===s.id;}))window.SONG_DB.push(s);
    });
  }
  if(typeof window.LESSON_DB!=='undefined'&&Array.isArray(window.LESSON_DB)){
    V26_LESSONS.forEach(function(l){
      if(!window.LESSON_DB.find(function(x){return x.id===l.id;}))window.LESSON_DB.push(l);
    });
  }
  if(typeof window.ACH_DB!=='undefined'&&Array.isArray(window.ACH_DB)){
    V26_ACHS.forEach(function(a){
      if(!window.ACH_DB.find(function(x){return x.id===a.id;}))window.ACH_DB.push(a);
    });
  }
  unlockAch('song_234','Song Collector 234');
  var allAch=loadAch(),v26Ids=V26_ACHS.map(function(a){return a.id;});
  var allV26=v26Ids.every(function(id){return allAch[id];});
  if(allV26)unlockAch('v26_complete','v26 Complete');
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
function init(){
  createBowWeightPanel();
  createIntonPanel();
  createVibSpectrumPanel();
  createBurnoutPanel();
  createSightReadPanel();
  createCrossingPanel();
  createStageAnxPanel();
  createWellnessPanel();
  createQuizPanel();
  addV26Nav();
  registerData();
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
else{init();}

})();
