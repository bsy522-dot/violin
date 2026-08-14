(function V29Patch(){
'use strict';
if(window.__V29_LOADED)return;
window.__V29_LOADED=true;

/* ─── helpers ─── */
function lp(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
function sp(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function loadAch(){return lp('violin_achievements')||{}}
function unlockAch(id,name){
  var a=loadAch();if(a[id])return;a[id]={name:name,date:new Date().toISOString()};
  sp('violin_achievements',a);sfx('achieve_v29');
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
    case'phrase_arc':fr=392;dur=0.11;break;
    case'phrase_peak':fr=784;dur=0.22;wave='triangle';break;
    case'bow_accel':fr=349;dur=0.10;break;
    case'bow_profile':fr=698;dur=0.20;wave='triangle';break;
    case'scale_cell':fr=415;dur=0.09;break;
    case'scale_grade':fr=554;dur=0.18;wave='triangle';break;
    case'dynamics_point':fr=330;dur=0.10;break;
    case'dynamics_shape':fr=659;dur=0.19;wave='triangle';break;
    case'rhythm_beat':fr=466;dur=0.08;break;
    case'rhythm_score':fr=622;dur=0.17;wave='triangle';break;
    case'harmonic_ring':fr=523;dur=0.15;wave='sine';break;
    case'harmonic_node':fr=1046;dur=0.25;wave='triangle';break;
    case'ensemble_part':fr=294;dur=0.11;break;
    case'ensemble_score':fr=587;dur=0.20;wave='triangle';break;
    case'mastery_gauge':fr=440;dur=0.14;wave='triangle';break;
    case'achieve_v29':fr=988;dur=0.35;wave='triangle';break;
    default:fr=440;dur=0.1;
  }
  o.type=wave;o.frequency.setValueAtTime(fr,t);
  g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t);o.stop(t+dur);
}

/* ═══════════════════════════════════════════════════════
   DATA: 10 Songs (s255-s264)
   ═══════════════════════════════════════════════════════ */
var V29_SONGS=[
  {id:'s255',title:'Violin Concerto No.1, 1st mvt',composer:'Bruch',difficulty:4,key:'G minor',bpm:96,duration:'8:30',techniques:['cantabile','double-stop','cadenza'],era:'Romantic'},
  {id:'s256',title:'Introduction and Rondo Capriccioso',composer:'Saint-Sa&euml;ns',difficulty:4,key:'A minor',bpm:104,duration:'9:00',techniques:['spiccato','harmonics','arpeggios'],era:'Romantic'},
  {id:'s257',title:'Csardas',composer:'Monti',difficulty:4,key:'D minor',bpm:72,duration:'5:30',techniques:['rubato','double-stop','pizzicato'],era:'Romantic'},
  {id:'s258',title:'Violin Sonata No.5 &quot;Spring&quot; 1st mvt',composer:'Beethoven',difficulty:3,key:'F major',bpm:108,duration:'10:00',techniques:['legato','dynamics','dialogue'],era:'Classical'},
  {id:'s259',title:'Zigeunerweisen',composer:'Sarasate',difficulty:5,key:'C minor',bpm:80,duration:'8:30',techniques:['left-hand-pizz','harmonics','cadenza'],era:'Romantic'},
  {id:'s260',title:'Caprice No.5',composer:'Paganini',difficulty:5,key:'A minor',bpm:132,duration:'3:00',techniques:['ricochet','staccato','arpeggios'],era:'Romantic'},
  {id:'s261',title:'Liebesfreud',composer:'Kreisler',difficulty:3,key:'A major',bpm:96,duration:'3:30',techniques:['portamento','espressivo','vibrato'],era:'Romantic'},
  {id:'s262',title:'Violin Concerto, 2nd mvt',composer:'Brahms',difficulty:4,key:'F major',bpm:72,duration:'9:30',techniques:['cantabile','oboe-dialogue','sostenuto'],era:'Romantic'},
  {id:'s263',title:'Sicilienne',composer:'Faur&eacute;',difficulty:2,key:'G minor',bpm:60,duration:'3:45',techniques:['espressivo','legato','phrasing'],era:'Romantic'},
  {id:'s264',title:'Violin Sonata No.1, 2nd mvt &quot;Fuga&quot;',composer:'Bach',difficulty:5,key:'G minor',bpm:66,duration:'6:00',techniques:['polyphony','chords','counterpoint'],era:'Baroque'}
];

/* ═══════════════════════════════════════════════════════
   DATA: 10 Lessons (l281-l290)
   ═══════════════════════════════════════════════════════ */
var V29_LESSONS=[
  {id:'l281',title:'Musical Phrasing: Shaping the Arch',level:'intermediate',duration:'15min',topics:['phrasing','arch','musical-line','direction']},
  {id:'l282',title:'Bow Acceleration and Deceleration',level:'intermediate',duration:'14min',topics:['bow-speed','acceleration','dynamics','expression']},
  {id:'l283',title:'Scale Pattern Mastery Across Positions',level:'intermediate',duration:'16min',topics:['scales','patterns','positions','fingering']},
  {id:'l284',title:'Dynamic Contour Design for Expression',level:'intermediate',duration:'13min',topics:['dynamics','contour','crescendo','diminuendo']},
  {id:'l285',title:'Rhythmic Precision in Complex Meters',level:'advanced',duration:'15min',topics:['rhythm','meter','subdivision','accuracy']},
  {id:'l286',title:'Understanding the Harmonic Series',level:'all',duration:'12min',topics:['harmonics','overtones','partials','natural-harmonics']},
  {id:'l287',title:'Ensemble Role Awareness for Strings',level:'intermediate',duration:'14min',topics:['ensemble','quartet','roles','balance']},
  {id:'l288',title:'Bruch Violin Concerto Study Guide',level:'advanced',duration:'18min',topics:['repertoire','bruch','concerto','romantic']},
  {id:'l289',title:'Paganini Caprice No.5 Technical Breakdown',level:'advanced',duration:'20min',topics:['repertoire','paganini','caprice','virtuosity']},
  {id:'l290',title:'v29 Comprehensive Review',level:'all',duration:'15min',topics:['phrasing','bow-acceleration','scales','dynamics','rhythm','harmonics','ensemble','mastery']}
];

/* ═══════════════════════════════════════════════════════
   DATA: 15 Quizzes (q286-q300)
   ═══════════════════════════════════════════════════════ */
var V29_QUIZZES=[
  {id:'q286',q:'음악 프레이즈에서 &quot;아치&quot; 형태란 무엇을 의미하나요?',a:['음량이 점점 커졌다 작아지는 호 형태의 표현','일정한 음량 유지','갑작스러운 음량 변화','무작위 음량 변화'],c:0,cat:'phrasing'},
  {id:'q287',q:'보잉에서 가속도가 가장 중요한 순간은?',a:['활의 방향이 바뀌는 전환점','활의 중간 지점','활의 끝 부분','활의 시작 부분만'],c:0,cat:'bowing'},
  {id:'q288',q:'G 장조 음계의 올림표 개수는?',a:['1개 (F#)','2개','없음','3개'],c:0,cat:'scales'},
  {id:'q289',q:'크레센도(crescendo)의 올바른 의미는?',a:['점점 세게','점점 여리게','갑자기 세게','일정한 세기'],c:0,cat:'dynamics'},
  {id:'q290',q:'6/8 박자에서 1마디의 기본 박동 수는?',a:['2박','6박','3박','4박'],c:0,cat:'rhythm'},
  {id:'q291',q:'바이올린 G현의 제3배음 음고는?',a:['D (한 옥타브 + 5도 위)','G (한 옥타브 위)','B (두 옥타브 위)','A (장2도 위)'],c:0,cat:'harmonics'},
  {id:'q292',q:'현악 4중주에서 제1바이올린의 주된 역할은?',a:['선율 주도','베이스 라인','내성 화성','리듬 반주'],c:0,cat:'ensemble'},
  {id:'q293',q:'Bruch 바이올린 협주곡 1번은 어떤 조성인가요?',a:['G단조','D장조','A단조','E단조'],c:0,cat:'repertoire'},
  {id:'q294',q:'레가토(legato) 보잉에서 활 압력은 어떻게 해야 하나요?',a:['균일하고 일정하게 유지','강하게 눌러야','활의 끝에서만 강하게','압력 없이 가볍게'],c:0,cat:'technique'},
  {id:'q295',q:'프레이즈의 &quot;호흡점&quot;이란?',a:['음악적 구문 사이의 자연스러운 쉼','실제로 숨쉬는 순간','메트로놈 비트','조바꿈 지점'],c:0,cat:'phrasing'},
  {id:'q296',q:'스타카토(staccato)와 스피카토(spiccato)의 차이는?',a:['스타카토는 현 위에서, 스피카토는 현에서 튀어오름','둘 다 같은 기법','스타카토만 빠른 템포에서 사용','스피카토는 느린 곡에서만'],c:0,cat:'technique'},
  {id:'q297',q:'Paganini Caprice No.5에서 주된 기교는?',a:['리코셰와 아르페지오','비브라토만','피치카토만','글리산도만'],c:0,cat:'repertoire'},
  {id:'q298',q:'앙상블에서 &quot;인토네이션 조율&quot;은 언제 확인하나요?',a:['유니즌과 옥타브 패시지에서 항상','곡의 시작 시에만','마지막 음에서만','조율 후에는 불필요'],c:0,cat:'ensemble'},
  {id:'q299',q:'다이나믹스에서 fp의 의미는?',a:['강하게 시작 후 즉시 여리게','포르테피아노 악기','점점 세게','매우 강하게'],c:0,cat:'dynamics'},
  {id:'q300',q:'바이올린에서 자연 하모닉스를 내는 방법은?',a:['현의 정수분의 1 지점에 가볍게 손가락을 대고 활로 연주','세게 누르고 빠르게 활질','피치카토로 튕김','현을 완전히 잡고 연주'],c:0,cat:'harmonics'}
];

/* ═══════════════════════════════════════════════════════
   DATA: 12 Achievements
   ═══════════════════════════════════════════════════════ */
var V29_ACHS=[
  {id:'phrase_sculptor',name:'Phrase Sculptor',desc:'프레이징 아치 분석기 사용'},
  {id:'bow_accelerator',name:'Bow Accelerator',desc:'보잉 가속도 프로필러 사용'},
  {id:'scale_matrix_master',name:'Scale Matrix Master',desc:'스케일 패턴 매트릭스 사용'},
  {id:'dynamics_designer',name:'Dynamics Designer',desc:'다이나믹스 컨투어 디자이너 사용'},
  {id:'rhythm_precision',name:'Rhythm Precision',desc:'리듬 정확도 시퀀서 사용'},
  {id:'harmonic_explorer',name:'Harmonic Explorer',desc:'하모닉 시리즈 탐험기 사용'},
  {id:'ensemble_analyst',name:'Ensemble Analyst',desc:'앙상블 역할 분석기 사용'},
  {id:'technique_master_v29',name:'Technique Master v29',desc:'종합 기교 마스터리 대시보드 사용'},
  {id:'v29_quiz_starter',name:'v29 Quiz Starter',desc:'v29 퀴즈 첫 정답'},
  {id:'v29_quiz_all',name:'v29 Quiz Master',desc:'v29 퀴즈 전부 정답'},
  {id:'song_264',name:'Song Collector 264',desc:'264곡 등록 완료'},
  {id:'v29_explorer',name:'v29 Explorer',desc:'v29 기능 5개 이상 탐색'}
];

/* ═══════════════════════════════════════════════════════
   1. Musical Phrasing Arch Analyzer (Canvas 620x400)
   ═══════════════════════════════════════════════════════ */
function createPhrasingPanel(){
  var PHRASES=[
    {name:'Ascending Arch',shape:[0.15,0.35,0.55,0.75,0.90,0.95,0.80,0.55],style:'Romantic cantabile',grade:'S'},
    {name:'Descending Arch',shape:[0.90,0.85,0.70,0.55,0.40,0.30,0.20,0.15],style:'Baroque phrase ending',grade:'A'},
    {name:'Plateau Peak',shape:[0.20,0.50,0.80,0.90,0.90,0.85,0.60,0.25],style:'Sustained climax',grade:'S'},
    {name:'Double Arch',shape:[0.20,0.60,0.80,0.40,0.30,0.70,0.90,0.35],style:'ABA phrase form',grade:'A'},
    {name:'Gradual Build',shape:[0.10,0.20,0.30,0.40,0.55,0.70,0.85,0.95],style:'Dramatic crescendo',grade:'B'},
    {name:'Sudden Drop',shape:[0.30,0.50,0.70,0.90,0.20,0.15,0.10,0.08],style:'Subito piano effect',grade:'A'},
    {name:'Terraced',shape:[0.30,0.30,0.60,0.60,0.85,0.85,0.50,0.50],style:'Baroque dynamics',grade:'B'},
    {name:'Wave',shape:[0.30,0.70,0.40,0.80,0.35,0.75,0.30,0.65],style:'Expressive rubato',grade:'A'}
  ];
  var panel=document.createElement('div');
  panel.id='v29-phrasing-panel';
  panel.style.cssText='display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,6,20,0.97);z-index:9999;overflow-y:auto;padding:10px;';
  var curIdx=0;

  function draw(){
    var cv=document.getElementById('v29-phrase-cv');if(!cv)return;
    var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#0a0618';ctx.fillRect(0,0,W,H);

    var p=PHRASES[curIdx],shape=p.shape,n=shape.length;
    var padL=60,padR=20,padT=50,padB=60;
    var plotW=W-padL-padR,plotH=H-padT-padB;

    ctx.fillStyle='#e8d5b0';ctx.font='bold 14px Georgia';
    ctx.textAlign='center';ctx.fillText(p.name+' ('+p.grade+')',W/2,22);
    ctx.font='11px Georgia';ctx.fillStyle='#a89070';
    ctx.fillText(p.style,W/2,38);

    ctx.strokeStyle='rgba(200,180,140,0.15)';ctx.lineWidth=1;
    for(var i=0;i<=4;i++){
      var y=padT+plotH*(1-i/4);
      ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(W-padR,y);ctx.stroke();
      ctx.fillStyle='#887060';ctx.font='10px Georgia';ctx.textAlign='right';
      ctx.fillText((i*25)+'%',padL-5,y+3);
    }

    var labels=['Start','','Build','','Peak','','Resolve','End'];
    for(var i=0;i<n;i++){
      var x=padL+plotW*i/(n-1);
      ctx.fillStyle='#887060';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(labels[i]||'',x,H-padB+22);
    }

    var grad=ctx.createLinearGradient(padL,padT,W-padR,padT);
    grad.addColorStop(0,'#4fc3f7');grad.addColorStop(0.5,'#ffd54f');grad.addColorStop(1,'#ef5350');
    ctx.strokeStyle=grad;ctx.lineWidth=3;ctx.beginPath();
    for(var i=0;i<n;i++){
      var x=padL+plotW*i/(n-1),y=padT+plotH*(1-shape[i]);
      if(i===0)ctx.moveTo(x,y);
      else{
        var px=padL+plotW*(i-1)/(n-1),py=padT+plotH*(1-shape[i-1]);
        var cpx1=px+(x-px)*0.4,cpx2=px+(x-px)*0.6;
        ctx.bezierCurveTo(cpx1,py,cpx2,y,x,y);
      }
    }
    ctx.stroke();

    var fillGrad=ctx.createLinearGradient(0,padT,0,padT+plotH);
    fillGrad.addColorStop(0,'rgba(79,195,247,0.25)');fillGrad.addColorStop(1,'rgba(79,195,247,0.02)');
    ctx.fillStyle=fillGrad;ctx.lineTo(padL+plotW,padT+plotH);ctx.lineTo(padL,padT+plotH);ctx.closePath();ctx.fill();

    for(var i=0;i<n;i++){
      var x=padL+plotW*i/(n-1),y=padT+plotH*(1-shape[i]);
      ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);
      ctx.fillStyle=shape[i]>0.7?'#ffd54f':shape[i]>0.4?'#4fc3f7':'#81c784';
      ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(Math.round(shape[i]*100)+'%',x,y-10);
    }

    var peakVal=Math.max.apply(null,shape),peakI=shape.indexOf(peakVal);
    var avgVal=shape.reduce(function(a,b){return a+b},0)/n;
    ctx.fillStyle='#c8b090';ctx.font='10px Georgia';ctx.textAlign='left';
    ctx.fillText('Peak: position '+(peakI+1)+' ('+Math.round(peakVal*100)+'%)',padL,H-12);
    ctx.textAlign='right';
    ctx.fillText('Avg intensity: '+Math.round(avgVal*100)+'%',W-padR,H-12);
  }

  panel.innerHTML='<div style="text-align:right;padding:4px"><button id="v29-phrase-close" style="background:none;border:1px solid #D4894A;color:#D4894A;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Close</button></div>'+
    '<h3 style="text-align:center;color:#e8d5b0;font-size:14px;margin:4px 0">Musical Phrasing Arch Analyzer</h3>'+
    '<div style="text-align:center"><canvas id="v29-phrase-cv" width="620" height="400" style="max-width:100%;border:1px solid rgba(200,180,140,0.2);border-radius:8px;background:#0a0618"></canvas></div>'+
    '<div style="text-align:center;margin:8px"><button id="v29-phrase-prev" style="padding:4px 12px;border-radius:4px;border:1px solid #4fc3f7;background:transparent;color:#4fc3f7;cursor:pointer;margin:0 4px">&#9664; Prev</button>'+
    '<button id="v29-phrase-next" style="padding:4px 12px;border-radius:4px;border:1px solid #4fc3f7;background:transparent;color:#4fc3f7;cursor:pointer;margin:0 4px">Next &#9654;</button></div>';
  document.body.appendChild(panel);

  panel.querySelector('#v29-phrase-close').onclick=function(){panel.style.display='none';};
  panel.querySelector('#v29-phrase-prev').onclick=function(){curIdx=(curIdx-1+PHRASES.length)%PHRASES.length;sfx('phrase_arc');draw();};
  panel.querySelector('#v29-phrase-next').onclick=function(){curIdx=(curIdx+1)%PHRASES.length;sfx('phrase_arc');draw();};

  setTimeout(draw,100);
  unlockAch('phrase_sculptor','Phrase Sculptor');
}

/* ═══════════════════════════════════════════════════════
   2. Bowing Acceleration Profiler (Canvas 620x400)
   ═══════════════════════════════════════════════════════ */
function createBowAccelPanel(){
  var STROKES=[
    {name:'Detach&eacute;',speeds:[0.3,0.5,0.7,0.85,0.9,0.85,0.7,0.5,0.3],accel:[0.4,0.6,0.5,0.3,0.0,-0.3,-0.5,-0.6,-0.4],color:'#4fc3f7'},
    {name:'Legato',speeds:[0.4,0.5,0.55,0.6,0.6,0.6,0.55,0.5,0.4],accel:[0.2,0.15,0.1,0.05,0.0,-0.05,-0.1,-0.15,-0.2],color:'#81c784'},
    {name:'Martel&eacute;',speeds:[0.1,0.9,0.7,0.4,0.2,0.1,0.05,0.02,0.01],accel:[0.9,0.5,-0.4,-0.5,-0.4,-0.2,-0.1,-0.05,0.0],color:'#ef5350'},
    {name:'Spiccato',speeds:[0.2,0.7,0.9,0.6,0.1,0.0,0.0,0.0,0.0],accel:[0.7,0.6,-0.3,-0.8,-0.5,0.0,0.0,0.0,0.0],color:'#ffd54f'},
    {name:'Tremolo',speeds:[0.8,0.3,0.8,0.3,0.8,0.3,0.8,0.3,0.8],accel:[0.7,-0.7,0.7,-0.7,0.7,-0.7,0.7,-0.7,0.0],color:'#ce93d8'},
    {name:'Son fil&eacute;',speeds:[0.2,0.3,0.35,0.4,0.4,0.4,0.35,0.3,0.2],accel:[0.15,0.1,0.05,0.02,0.0,-0.02,-0.05,-0.1,-0.15],color:'#4db6ac'},
    {name:'Col legno',speeds:[0.1,0.6,0.3,0.1,0.05,0.0,0.0,0.0,0.0],accel:[0.8,-0.4,-0.4,-0.2,0.0,0.0,0.0,0.0,0.0],color:'#ff7043'},
    {name:'Ricochet',speeds:[0.8,0.5,0.6,0.35,0.4,0.2,0.25,0.1,0.05],accel:[0.5,-0.5,0.3,-0.4,0.2,-0.3,0.1,-0.2,0.0],color:'#aed581'}
  ];
  var panel=document.createElement('div');
  panel.id='v29-bowaccel-panel';
  panel.style.cssText='display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,6,20,0.97);z-index:9999;overflow-y:auto;padding:10px;';
  var curIdx=0;

  function draw(){
    var cv=document.getElementById('v29-bowaccel-cv');if(!cv)return;
    var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0618';ctx.fillRect(0,0,W,H);

    var s=STROKES[curIdx],n=s.speeds.length;
    var padL=55,padR=20,padT=50,padB=50;
    var plotW=W-padL-padR,halfH=(H-padT-padB)/2;

    ctx.fillStyle='#e8d5b0';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText(s.name+' Bow Profile',W/2,22);
    ctx.font='11px Georgia';ctx.fillStyle='#a89070';
    ctx.fillText('Speed (top) + Acceleration (bottom)',W/2,38);

    var midY=padT+halfH;
    ctx.strokeStyle='rgba(200,180,140,0.2)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(padL,midY);ctx.lineTo(W-padR,midY);ctx.stroke();

    ctx.fillStyle='#887060';ctx.font='10px Georgia';ctx.textAlign='right';
    ctx.fillText('Speed',padL-5,padT+20);
    ctx.fillText('Accel',padL-5,midY+20);

    ctx.strokeStyle=s.color;ctx.lineWidth=2.5;ctx.beginPath();
    for(var i=0;i<n;i++){
      var x=padL+plotW*i/(n-1),y=padT+halfH*(1-s.speeds[i]);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
    for(var i=0;i<n;i++){
      var x=padL+plotW*i/(n-1),y=padT+halfH*(1-s.speeds[i]);
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle=s.color;ctx.fill();
    }

    var accelColor=s.color.replace(')',',0.7)').replace('rgb','rgba');
    ctx.strokeStyle=accelColor;ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();
    for(var i=0;i<n;i++){
      var x=padL+plotW*i/(n-1),y=midY+halfH*(0.5-s.accel[i]*0.5);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();ctx.setLineDash([]);

    ctx.strokeStyle='rgba(255,100,100,0.3)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(padL,midY+halfH*0.5);ctx.lineTo(W-padR,midY+halfH*0.5);ctx.stroke();
    ctx.fillStyle='#666';ctx.font='9px Georgia';ctx.textAlign='left';ctx.fillText('zero',W-padR+2,midY+halfH*0.5+3);

    var maxSpd=Math.max.apply(null,s.speeds);
    var maxAcc=Math.max.apply(null,s.accel.map(function(v){return Math.abs(v)}));
    ctx.fillStyle='#c8b090';ctx.font='10px Georgia';ctx.textAlign='left';
    ctx.fillText('Peak speed: '+Math.round(maxSpd*100)+'%',padL,H-10);
    ctx.textAlign='right';ctx.fillText('Max accel: '+Math.round(maxAcc*100)+'%',W-padR,H-10);
  }

  panel.innerHTML='<div style="text-align:right;padding:4px"><button id="v29-bowaccel-close" style="background:none;border:1px solid #D4894A;color:#D4894A;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Close</button></div>'+
    '<h3 style="text-align:center;color:#e8d5b0;font-size:14px;margin:4px 0">Bowing Acceleration Profiler</h3>'+
    '<div style="text-align:center"><canvas id="v29-bowaccel-cv" width="620" height="400" style="max-width:100%;border:1px solid rgba(200,180,140,0.2);border-radius:8px;background:#0a0618"></canvas></div>'+
    '<div style="text-align:center;margin:8px"><button id="v29-bowaccel-prev" style="padding:4px 12px;border-radius:4px;border:1px solid #ef5350;background:transparent;color:#ef5350;cursor:pointer;margin:0 4px">&#9664; Prev</button>'+
    '<button id="v29-bowaccel-next" style="padding:4px 12px;border-radius:4px;border:1px solid #ef5350;background:transparent;color:#ef5350;cursor:pointer;margin:0 4px">Next &#9654;</button></div>';
  document.body.appendChild(panel);

  panel.querySelector('#v29-bowaccel-close').onclick=function(){panel.style.display='none';};
  panel.querySelector('#v29-bowaccel-prev').onclick=function(){curIdx=(curIdx-1+STROKES.length)%STROKES.length;sfx('bow_accel');draw();};
  panel.querySelector('#v29-bowaccel-next').onclick=function(){curIdx=(curIdx+1)%STROKES.length;sfx('bow_accel');draw();};

  setTimeout(draw,100);
  unlockAch('bow_accelerator','Bow Accelerator');
}

/* ═══════════════════════════════════════════════════════
   3. Scale Pattern Matrix (Canvas 640x400)
   ═══════════════════════════════════════════════════════ */
function createScaleMatrixPanel(){
  var SCALES=['C','G','D','A','E','B','F','Bb','Eb','Ab','Am','Em','Dm'];
  var POS=['1st','2nd','3rd','4th','5th','6th','7th'];
  var data=[];
  for(var i=0;i<SCALES.length;i++){
    var row=[];
    for(var j=0;j<POS.length;j++){
      var base=0.4+Math.sin(i*0.7+j*1.1)*0.25+Math.cos(i*0.3+j*0.5)*0.15;
      row.push(Math.max(0.1,Math.min(1.0,base)));
    }
    data.push(row);
  }
  var panel=document.createElement('div');
  panel.id='v29-scalematrix-panel';
  panel.style.cssText='display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,6,20,0.97);z-index:9999;overflow-y:auto;padding:10px;';

  function draw(){
    var cv=document.getElementById('v29-scale-cv');if(!cv)return;
    var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0618';ctx.fillRect(0,0,W,H);

    ctx.fillStyle='#e8d5b0';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('Scale Pattern Mastery Matrix',W/2,22);
    ctx.font='11px Georgia';ctx.fillStyle='#a89070';
    ctx.fillText('Key × Position comfort level',W/2,38);

    var padL=50,padR=15,padT=50,padB=30;
    var cellW=(W-padL-padR)/POS.length;
    var cellH=(H-padT-padB)/SCALES.length;

    for(var j=0;j<POS.length;j++){
      ctx.fillStyle='#c8b090';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(POS[j],padL+j*cellW+cellW/2,padT-5);
    }
    for(var i=0;i<SCALES.length;i++){
      ctx.fillStyle='#c8b090';ctx.font='10px Georgia';ctx.textAlign='right';
      ctx.fillText(SCALES[i],padL-5,padT+i*cellH+cellH/2+3);
    }

    for(var i=0;i<SCALES.length;i++){
      for(var j=0;j<POS.length;j++){
        var val=data[i][j];
        var x=padL+j*cellW,y=padT+i*cellH;
        var r,g,b;
        if(val>0.7){r=76;g=175;b=80;}
        else if(val>0.5){r=255;g=213;b=79;}
        else if(val>0.3){r=255;g=152;b=0;}
        else{r=239;g=83;b=80;}
        ctx.fillStyle='rgba('+r+','+g+','+b+',0.75)';
        ctx.fillRect(x+1,y+1,cellW-2,cellH-2);
        ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.textAlign='center';
        ctx.fillText(Math.round(val*100),x+cellW/2,y+cellH/2+3);
      }
    }

    var grades=['S: 80+','A: 60+','B: 40+','C: <40'];
    var gColors=['#4caf50','#ffd54f','#ff9800','#ef5350'];
    for(var i=0;i<4;i++){
      ctx.fillStyle=gColors[i];ctx.font='9px Georgia';ctx.textAlign='left';
      ctx.fillRect(padL+i*90,H-18,12,10);ctx.fillText(grades[i],padL+i*90+15,H-9);
    }
  }

  panel.innerHTML='<div style="text-align:right;padding:4px"><button id="v29-scale-close" style="background:none;border:1px solid #D4894A;color:#D4894A;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Close</button></div>'+
    '<h3 style="text-align:center;color:#e8d5b0;font-size:14px;margin:4px 0">Scale Pattern Mastery Matrix</h3>'+
    '<div style="text-align:center"><canvas id="v29-scale-cv" width="640" height="400" style="max-width:100%;border:1px solid rgba(200,180,140,0.2);border-radius:8px;background:#0a0618"></canvas></div>';
  document.body.appendChild(panel);

  panel.querySelector('#v29-scale-close').onclick=function(){panel.style.display='none';};
  var cv=panel.querySelector('#v29-scale-cv');
  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect();
    var sx=cv.width/rect.width,sy=cv.height/rect.height;
    var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
    var padL=50,padT=50,padB=30,padR=15;
    var cellW=(cv.width-padL-padR)/POS.length;
    var cellH=(cv.height-padT-padB)/SCALES.length;
    var j=Math.floor((mx-padL)/cellW),i=Math.floor((my-padT)/cellH);
    if(i>=0&&i<SCALES.length&&j>=0&&j<POS.length){
      data[i][j]=Math.min(1.0,data[i][j]+0.05);
      sfx('scale_cell');draw();
      sp('v29_scale_data',data);
    }
  });
  var saved=lp('v29_scale_data');if(saved&&saved.length===SCALES.length)data=saved;
  setTimeout(draw,100);
  unlockAch('scale_matrix_master','Scale Matrix Master');
}

/* ═══════════════════════════════════════════════════════
   4. Dynamics Contour Designer (Canvas 620x400)
   ═══════════════════════════════════════════════════════ */
function createDynamicsPanel(){
  var PRESETS=[
    {name:'Classic Crescendo',points:[0.15,0.20,0.30,0.45,0.60,0.70,0.82,0.90,0.95,1.0],marking:'pp → ff',color:'#4fc3f7'},
    {name:'Hairpin',points:[0.15,0.35,0.55,0.75,0.90,0.90,0.70,0.50,0.30,0.15],marking:'p < f > p',color:'#ffd54f'},
    {name:'Subito Piano',points:[0.80,0.85,0.90,0.15,0.20,0.30,0.45,0.60,0.75,0.85],marking:'f → sp → f',color:'#ef5350'},
    {name:'Terraced Baroque',points:[0.40,0.40,0.40,0.75,0.75,0.75,0.40,0.40,0.75,0.75],marking:'mf/f echo',color:'#ce93d8'},
    {name:'Long Diminuendo',points:[0.95,0.85,0.75,0.65,0.55,0.45,0.35,0.25,0.15,0.08],marking:'ff → ppp',color:'#81c784'},
    {name:'Sforzando Accents',points:[0.30,0.90,0.30,0.85,0.25,0.90,0.30,0.80,0.25,0.30],marking:'p sfz p sfz',color:'#ff7043'},
    {name:'Messa di voce',points:[0.10,0.25,0.45,0.65,0.85,0.90,0.75,0.55,0.35,0.15],marking:'ppp < fff > ppp',color:'#4db6ac'},
    {name:'Fortepiano Swell',points:[0.90,0.20,0.25,0.35,0.50,0.65,0.75,0.85,0.90,0.95],marking:'fp < ff',color:'#aed581'}
  ];
  var panel=document.createElement('div');
  panel.id='v29-dynamics-panel';
  panel.style.cssText='display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,6,20,0.97);z-index:9999;overflow-y:auto;padding:10px;';
  var curIdx=0;

  function draw(){
    var cv=document.getElementById('v29-dynamics-cv');if(!cv)return;
    var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0618';ctx.fillRect(0,0,W,H);

    var p=PRESETS[curIdx],pts=p.points,n=pts.length;
    var padL=55,padR=20,padT=50,padB=55;
    var plotW=W-padL-padR,plotH=H-padT-padB;

    ctx.fillStyle='#e8d5b0';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText(p.name,W/2,22);
    ctx.font='11px Georgia';ctx.fillStyle='#a89070';
    ctx.fillText(p.marking,W/2,38);

    var dynLabels=['ppp','pp','p','mp','mf','f','ff','fff'];
    for(var i=0;i<dynLabels.length;i++){
      var y=padT+plotH*(1-i/(dynLabels.length-1));
      ctx.strokeStyle='rgba(200,180,140,0.1)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(W-padR,y);ctx.stroke();
      ctx.fillStyle='#887060';ctx.font='9px Georgia';ctx.textAlign='right';
      ctx.fillText(dynLabels[i],padL-5,y+3);
    }

    ctx.strokeStyle=p.color;ctx.lineWidth=3;ctx.beginPath();
    for(var i=0;i<n;i++){
      var x=padL+plotW*i/(n-1),y=padT+plotH*(1-pts[i]);
      if(i===0)ctx.moveTo(x,y);
      else{
        var px=padL+plotW*(i-1)/(n-1),py=padT+plotH*(1-pts[i-1]);
        ctx.bezierCurveTo(px+(x-px)*0.5,py,px+(x-px)*0.5,y,x,y);
      }
    }
    ctx.stroke();

    var fillG=ctx.createLinearGradient(0,padT,0,padT+plotH);
    fillG.addColorStop(0,p.color.replace(')',',0.3)').replace('#','rgba(').replace(/^rgba\(/,''));
    ctx.globalAlpha=0.2;ctx.fillStyle=p.color;
    ctx.lineTo(padL+plotW,padT+plotH);ctx.lineTo(padL,padT+plotH);ctx.closePath();ctx.fill();
    ctx.globalAlpha=1.0;

    for(var i=0;i<n;i++){
      var x=padL+plotW*i/(n-1),y=padT+plotH*(1-pts[i]);
      ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
      ctx.strokeStyle=p.color;ctx.lineWidth=2;ctx.stroke();
    }

    var bowAreas=['Tip','','','Lower','Mid','','Upper','','','Frog'];
    for(var i=0;i<n;i++){
      ctx.fillStyle='#887060';ctx.font='8px Georgia';ctx.textAlign='center';
      ctx.fillText(bowAreas[i]||'',padL+plotW*i/(n-1),H-padB+15);
    }

    var range=Math.max.apply(null,pts)-Math.min.apply(null,pts);
    ctx.fillStyle='#c8b090';ctx.font='10px Georgia';ctx.textAlign='left';
    ctx.fillText('Dynamic range: '+Math.round(range*100)+'%',padL,H-10);
  }

  panel.innerHTML='<div style="text-align:right;padding:4px"><button id="v29-dynamics-close" style="background:none;border:1px solid #D4894A;color:#D4894A;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Close</button></div>'+
    '<h3 style="text-align:center;color:#e8d5b0;font-size:14px;margin:4px 0">Dynamics Contour Designer</h3>'+
    '<div style="text-align:center"><canvas id="v29-dynamics-cv" width="620" height="400" style="max-width:100%;border:1px solid rgba(200,180,140,0.2);border-radius:8px;background:#0a0618"></canvas></div>'+
    '<div style="text-align:center;margin:8px"><button id="v29-dyn-prev" style="padding:4px 12px;border-radius:4px;border:1px solid '+PRESETS[0].color+';background:transparent;color:'+PRESETS[0].color+';cursor:pointer;margin:0 4px">&#9664; Prev</button>'+
    '<button id="v29-dyn-next" style="padding:4px 12px;border-radius:4px;border:1px solid '+PRESETS[0].color+';background:transparent;color:'+PRESETS[0].color+';cursor:pointer;margin:0 4px">Next &#9654;</button></div>';
  document.body.appendChild(panel);

  panel.querySelector('#v29-dynamics-close').onclick=function(){panel.style.display='none';};
  panel.querySelector('#v29-dyn-prev').onclick=function(){curIdx=(curIdx-1+PRESETS.length)%PRESETS.length;sfx('dynamics_point');draw();};
  panel.querySelector('#v29-dyn-next').onclick=function(){curIdx=(curIdx+1)%PRESETS.length;sfx('dynamics_point');draw();};

  setTimeout(draw,100);
  unlockAch('dynamics_designer','Dynamics Designer');
}

/* ═══════════════════════════════════════════════════════
   5. Rhythm Accuracy Sequencer (Canvas 620x400)
   ═══════════════════════════════════════════════════════ */
function createRhythmPanel(){
  var METERS=[
    {name:'4/4 Common Time',beats:4,sub:4,patterns:[[1,0,0,0,0.5,0,0,0,0.7,0,0,0,0.5,0,0,0]],bpm:120},
    {name:'3/4 Waltz',beats:3,sub:4,patterns:[[1,0,0,0,0.5,0,0,0,0.5,0,0,0]],bpm:96},
    {name:'6/8 Compound',beats:2,sub:6,patterns:[[1,0,0,0.5,0,0,0.8,0,0,0.5,0,0]],bpm:80},
    {name:'5/4 Irregular',beats:5,sub:4,patterns:[[1,0,0,0,0.7,0,0,0,0.7,0,0,0,0.5,0,0,0,0.5,0,0,0]],bpm:108},
    {name:'7/8 Aksak',beats:3,sub:0,patterns:[[1,0,0.7,0,0.6,0,0]],bpm:132},
    {name:'2/4 March',beats:2,sub:4,patterns:[[1,0,0,0,0.7,0,0,0]],bpm:120},
    {name:'9/8 Compound Triple',beats:3,sub:3,patterns:[[1,0,0,0.5,0,0,0.5,0,0]],bpm:72},
    {name:'12/8 Slow Blues',beats:4,sub:3,patterns:[[1,0,0,0.6,0,0,0.7,0,0,0.5,0,0]],bpm:60}
  ];
  var panel=document.createElement('div');
  panel.id='v29-rhythm-panel';
  panel.style.cssText='display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,6,20,0.97);z-index:9999;overflow-y:auto;padding:10px;';
  var curIdx=0;

  function draw(){
    var cv=document.getElementById('v29-rhythm-cv');if(!cv)return;
    var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0618';ctx.fillRect(0,0,W,H);

    var m=METERS[curIdx],pat=m.patterns[0],n=pat.length;
    var padL=40,padR=20,padT=50,padB=60;
    var plotW=W-padL-padR,plotH=H-padT-padB;

    ctx.fillStyle='#e8d5b0';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText(m.name+' (♪='+m.bpm+')',W/2,22);
    ctx.font='11px Georgia';ctx.fillStyle='#a89070';
    ctx.fillText(m.beats+' beats, '+n+' subdivisions',W/2,38);

    var barW=plotW/n;
    for(var i=0;i<n;i++){
      var x=padL+i*barW,h=plotH*pat[i];
      var isDownbeat=pat[i]===1;
      var color=isDownbeat?'#ef5350':pat[i]>=0.7?'#ffd54f':pat[i]>=0.5?'#4fc3f7':'rgba(200,180,140,0.15)';
      ctx.fillStyle=color;
      ctx.fillRect(x+2,padT+plotH-h,barW-4,h);
      ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=1;
      ctx.strokeRect(x+2,padT+plotH-h,barW-4,h);

      if(pat[i]>0){
        ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.textAlign='center';
        ctx.fillText(Math.round(pat[i]*100),x+barW/2,padT+plotH-h-5);
      }

      ctx.fillStyle='#887060';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(i+1,x+barW/2,H-padB+15);
    }

    var beatLines=[];
    if(m.sub>0){for(var b=0;b<m.beats;b++)beatLines.push(b*(n/m.beats));}
    else{beatLines=[0,2,4];}
    for(var bi=0;bi<beatLines.length;bi++){
      var bx=padL+beatLines[bi]*barW;
      ctx.strokeStyle='rgba(255,100,100,0.4)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(bx,padT);ctx.lineTo(bx,padT+plotH);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#ef5350';ctx.font='bold 10px Georgia';ctx.textAlign='center';
      ctx.fillText('B'+(bi+1),bx+barW/2,H-padB+30);
    }

    var strong=pat.filter(function(v){return v>=0.5}).length;
    var weak=pat.filter(function(v){return v>0&&v<0.5}).length;
    ctx.fillStyle='#c8b090';ctx.font='10px Georgia';ctx.textAlign='left';
    ctx.fillText('Strong: '+strong+' | Weak: '+weak+' | Rest: '+(n-strong-weak),padL,H-8);
  }

  panel.innerHTML='<div style="text-align:right;padding:4px"><button id="v29-rhythm-close" style="background:none;border:1px solid #D4894A;color:#D4894A;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Close</button></div>'+
    '<h3 style="text-align:center;color:#e8d5b0;font-size:14px;margin:4px 0">Rhythm Accuracy Sequencer</h3>'+
    '<div style="text-align:center"><canvas id="v29-rhythm-cv" width="620" height="400" style="max-width:100%;border:1px solid rgba(200,180,140,0.2);border-radius:8px;background:#0a0618"></canvas></div>'+
    '<div style="text-align:center;margin:8px"><button id="v29-rhythm-prev" style="padding:4px 12px;border-radius:4px;border:1px solid #ce93d8;background:transparent;color:#ce93d8;cursor:pointer;margin:0 4px">&#9664; Prev</button>'+
    '<button id="v29-rhythm-next" style="padding:4px 12px;border-radius:4px;border:1px solid #ce93d8;background:transparent;color:#ce93d8;cursor:pointer;margin:0 4px">Next &#9654;</button></div>';
  document.body.appendChild(panel);

  panel.querySelector('#v29-rhythm-close').onclick=function(){panel.style.display='none';};
  panel.querySelector('#v29-rhythm-prev').onclick=function(){curIdx=(curIdx-1+METERS.length)%METERS.length;sfx('rhythm_beat');draw();};
  panel.querySelector('#v29-rhythm-next').onclick=function(){curIdx=(curIdx+1)%METERS.length;sfx('rhythm_beat');draw();};

  setTimeout(draw,100);
  unlockAch('rhythm_precision','Rhythm Precision');
}

/* ═══════════════════════════════════════════════════════
   6. Harmonic Series Explorer (Canvas 640x400)
   ═══════════════════════════════════════════════════════ */
function createHarmonicsPanel(){
  var STRINGS=[
    {name:'G (196 Hz)',fund:196,color:'#44ee44'},
    {name:'D (294 Hz)',fund:294,color:'#cc55ff'},
    {name:'A (440 Hz)',fund:440,color:'#44ddee'},
    {name:'E (659 Hz)',fund:659,color:'#ffdd33'}
  ];
  var panel=document.createElement('div');
  panel.id='v29-harmonics-panel';
  panel.style.cssText='display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,6,20,0.97);z-index:9999;overflow-y:auto;padding:10px;';
  var curStr=0;
  var NUM_HARM=12;

  function noteName(freq){
    var names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    var n=12*Math.log2(freq/440)+69;
    var nn=Math.round(n);
    var oct=Math.floor(nn/12)-1;
    return names[nn%12]+oct;
  }

  function draw(){
    var cv=document.getElementById('v29-harm-cv');if(!cv)return;
    var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0618';ctx.fillRect(0,0,W,H);

    var s=STRINGS[curStr],fund=s.fund;
    var padL=50,padR=20,padT=55,padB=50;
    var plotW=W-padL-padR,plotH=H-padT-padB;

    ctx.fillStyle='#e8d5b0';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('Harmonic Series: '+s.name,W/2,22);
    ctx.font='11px Georgia';ctx.fillStyle='#a89070';
    ctx.fillText('Natural harmonics on the violin string',W/2,40);

    var barW=plotW/NUM_HARM;
    for(var h=1;h<=NUM_HARM;h++){
      var freq=fund*h;
      var amp=1.0/h;
      var barH=plotH*amp;
      var x=padL+(h-1)*barW;

      var alpha=0.5+amp*0.5;
      ctx.fillStyle=s.color.replace(')',','+alpha+')').replace('rgb','rgba');
      if(s.color.charAt(0)==='#'){
        var hex=s.color;
        var r=parseInt(hex.substr(1,2),16),g=parseInt(hex.substr(3,2),16),b=parseInt(hex.substr(5,2),16);
        ctx.fillStyle='rgba('+r+','+g+','+b+','+alpha+')';
      }
      ctx.fillRect(x+3,padT+plotH-barH,barW-6,barH);

      ctx.fillStyle='#fff';ctx.font='bold 9px Georgia';ctx.textAlign='center';
      ctx.fillText('H'+h,x+barW/2,padT+plotH-barH-15);
      ctx.font='8px Georgia';ctx.fillStyle='#c8b090';
      ctx.fillText(Math.round(freq)+'Hz',x+barW/2,padT+plotH-barH-5);

      ctx.fillStyle='#a89070';ctx.font='8px Georgia';
      ctx.fillText(noteName(freq),x+barW/2,H-padB+15);
      ctx.fillText(Math.round(amp*100)+'%',x+barW/2,H-padB+26);

      if(h<=4){
        var nodePos='1/'+h;
        ctx.fillStyle='#ffd54f';ctx.font='bold 8px Georgia';
        ctx.fillText(nodePos,x+barW/2,H-padB+38);
      }
    }

    ctx.fillStyle='#887060';ctx.font='9px Georgia';ctx.textAlign='right';
    for(var i=0;i<=4;i++){
      var y=padT+plotH*(1-i/4);
      ctx.strokeStyle='rgba(200,180,140,0.1)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(W-padR,y);ctx.stroke();
      ctx.fillText((i*25)+'%',padL-5,y+3);
    }
  }

  panel.innerHTML='<div style="text-align:right;padding:4px"><button id="v29-harm-close" style="background:none;border:1px solid #D4894A;color:#D4894A;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Close</button></div>'+
    '<h3 style="text-align:center;color:#e8d5b0;font-size:14px;margin:4px 0">Harmonic Series Explorer</h3>'+
    '<div style="text-align:center"><canvas id="v29-harm-cv" width="640" height="400" style="max-width:100%;border:1px solid rgba(200,180,140,0.2);border-radius:8px;background:#0a0618"></canvas></div>'+
    '<div style="text-align:center;margin:8px"><button id="v29-harm-prev" style="padding:4px 12px;border-radius:4px;border:1px solid #44ddee;background:transparent;color:#44ddee;cursor:pointer;margin:0 4px">&#9664; Prev String</button>'+
    '<button id="v29-harm-play" style="padding:4px 12px;border-radius:4px;border:1px solid #ffd54f;background:transparent;color:#ffd54f;cursor:pointer;margin:0 4px">&#9835; Play</button>'+
    '<button id="v29-harm-next" style="padding:4px 12px;border-radius:4px;border:1px solid #44ddee;background:transparent;color:#44ddee;cursor:pointer;margin:0 4px">Next String &#9654;</button></div>';
  document.body.appendChild(panel);

  panel.querySelector('#v29-harm-close').onclick=function(){panel.style.display='none';};
  panel.querySelector('#v29-harm-prev').onclick=function(){curStr=(curStr-1+STRINGS.length)%STRINGS.length;sfx('harmonic_ring');draw();};
  panel.querySelector('#v29-harm-next').onclick=function(){curStr=(curStr+1)%STRINGS.length;sfx('harmonic_ring');draw();};
  panel.querySelector('#v29-harm-play').onclick=function(){
    var c=getACtx();if(!c)return;
    var s=STRINGS[curStr];
    for(var h=1;h<=6;h++){
      var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);
      var t=c.currentTime+(h-1)*0.4;
      o.type='sine';o.frequency.setValueAtTime(s.fund*h,t);
      g.gain.setValueAtTime(0.12/h,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);
      o.start(t);o.stop(t+0.35);
    }
  };

  setTimeout(draw,100);
  unlockAch('harmonic_explorer','Harmonic Explorer');
}

/* ═══════════════════════════════════════════════════════
   7. String Ensemble Role Analyzer (Canvas 620x400)
   ═══════════════════════════════════════════════════════ */
function createEnsemblePanel(){
  var ENSEMBLES=[
    {name:'String Quartet',parts:['Vn1','Vn2','Va','Vc'],axes:['Melody','Harmony','Rhythm','Bass','Counter','Solo'],
     data:[[0.95,0.40,0.50,0.10,0.70,0.90],[0.40,0.85,0.65,0.15,0.80,0.30],[0.30,0.75,0.70,0.35,0.60,0.20],[0.20,0.50,0.60,0.95,0.40,0.15]],
     colors:['#4fc3f7','#81c784','#ce93d8','#ff7043']},
    {name:'String Trio',parts:['Vn','Va','Vc'],axes:['Melody','Harmony','Rhythm','Bass','Counter','Solo'],
     data:[[0.90,0.45,0.55,0.15,0.65,0.85],[0.45,0.80,0.70,0.40,0.75,0.25],[0.25,0.55,0.65,0.90,0.45,0.20]],
     colors:['#4fc3f7','#ce93d8','#ff7043']},
    {name:'Piano Trio',parts:['Vn','Vc','Piano'],axes:['Melody','Harmony','Rhythm','Bass','Counter','Solo'],
     data:[[0.85,0.35,0.45,0.10,0.60,0.80],[0.30,0.50,0.55,0.85,0.40,0.25],[0.70,0.90,0.80,0.60,0.75,0.70]],
     colors:['#4fc3f7','#ff7043','#ffd54f']},
    {name:'String Orchestra',parts:['Vn1','Vn2','Va','Vc','Cb'],axes:['Melody','Harmony','Rhythm','Bass','Counter','Solo'],
     data:[[0.90,0.35,0.50,0.05,0.65,0.80],[0.45,0.80,0.60,0.10,0.75,0.20],[0.35,0.70,0.65,0.30,0.55,0.15],[0.25,0.55,0.60,0.80,0.40,0.20],[0.10,0.30,0.55,0.95,0.20,0.05]],
     colors:['#4fc3f7','#81c784','#ce93d8','#ff7043','#aed581']},
    {name:'Violin Duet',parts:['Vn1','Vn2'],axes:['Melody','Harmony','Rhythm','Bass','Counter','Solo'],
     data:[[0.90,0.50,0.55,0.20,0.70,0.85],[0.60,0.80,0.65,0.30,0.80,0.45]],
     colors:['#4fc3f7','#ffd54f']}
  ];
  var panel=document.createElement('div');
  panel.id='v29-ensemble-panel';
  panel.style.cssText='display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,6,20,0.97);z-index:9999;overflow-y:auto;padding:10px;';
  var curIdx=0;

  function draw(){
    var cv=document.getElementById('v29-ens-cv');if(!cv)return;
    var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0618';ctx.fillRect(0,0,W,H);

    var e=ENSEMBLES[curIdx],axes=e.axes,nAxes=axes.length;
    var cx=W/2,cy=H/2+10,radius=130;

    ctx.fillStyle='#e8d5b0';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText(e.name+' Role Analysis',W/2,22);

    for(var ring=1;ring<=4;ring++){
      var r=radius*ring/4;
      ctx.beginPath();
      for(var a=0;a<nAxes;a++){
        var angle=Math.PI*2*a/nAxes-Math.PI/2;
        var x=cx+r*Math.cos(angle),y=cy+r*Math.sin(angle);
        if(a===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.closePath();ctx.strokeStyle='rgba(200,180,140,0.15)';ctx.lineWidth=1;ctx.stroke();
    }

    for(var a=0;a<nAxes;a++){
      var angle=Math.PI*2*a/nAxes-Math.PI/2;
      ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.lineTo(cx+radius*Math.cos(angle),cy+radius*Math.sin(angle));
      ctx.strokeStyle='rgba(200,180,140,0.2)';ctx.stroke();
      var lx=cx+(radius+18)*Math.cos(angle),ly=cy+(radius+18)*Math.sin(angle);
      ctx.fillStyle='#c8b090';ctx.font='10px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(axes[a],lx,ly);
    }

    for(var pi=0;pi<e.parts.length;pi++){
      var d=e.data[pi];
      ctx.beginPath();
      for(var a=0;a<nAxes;a++){
        var angle=Math.PI*2*a/nAxes-Math.PI/2;
        var r2=radius*d[a];
        var x=cx+r2*Math.cos(angle),y=cy+r2*Math.sin(angle);
        if(a===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.fillStyle=e.colors[pi].replace(')',',0.12)').replace('rgb','rgba');
      var hex=e.colors[pi];
      var rv=parseInt(hex.substr(1,2),16),gv=parseInt(hex.substr(3,2),16),bv=parseInt(hex.substr(5,2),16);
      ctx.fillStyle='rgba('+rv+','+gv+','+bv+',0.12)';
      ctx.fill();
      ctx.strokeStyle=e.colors[pi];ctx.lineWidth=2;ctx.stroke();

      for(var a=0;a<nAxes;a++){
        var angle=Math.PI*2*a/nAxes-Math.PI/2;
        var r2=radius*d[a];
        ctx.beginPath();ctx.arc(cx+r2*Math.cos(angle),cy+r2*Math.sin(angle),3,0,Math.PI*2);
        ctx.fillStyle=e.colors[pi];ctx.fill();
      }
    }

    for(var pi=0;pi<e.parts.length;pi++){
      ctx.fillStyle=e.colors[pi];ctx.font='11px Georgia';
      ctx.fillRect(15+pi*80,H-25,10,10);
      ctx.fillText(e.parts[pi],28+pi*80,H-15);
    }
  }

  panel.innerHTML='<div style="text-align:right;padding:4px"><button id="v29-ens-close" style="background:none;border:1px solid #D4894A;color:#D4894A;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Close</button></div>'+
    '<h3 style="text-align:center;color:#e8d5b0;font-size:14px;margin:4px 0">String Ensemble Role Analyzer</h3>'+
    '<div style="text-align:center"><canvas id="v29-ens-cv" width="620" height="400" style="max-width:100%;border:1px solid rgba(200,180,140,0.2);border-radius:8px;background:#0a0618"></canvas></div>'+
    '<div style="text-align:center;margin:8px"><button id="v29-ens-prev" style="padding:4px 12px;border-radius:4px;border:1px solid #ce93d8;background:transparent;color:#ce93d8;cursor:pointer;margin:0 4px">&#9664; Prev</button>'+
    '<button id="v29-ens-next" style="padding:4px 12px;border-radius:4px;border:1px solid #ce93d8;background:transparent;color:#ce93d8;cursor:pointer;margin:0 4px">Next &#9654;</button></div>';
  document.body.appendChild(panel);

  panel.querySelector('#v29-ens-close').onclick=function(){panel.style.display='none';};
  panel.querySelector('#v29-ens-prev').onclick=function(){curIdx=(curIdx-1+ENSEMBLES.length)%ENSEMBLES.length;sfx('ensemble_part');draw();};
  panel.querySelector('#v29-ens-next').onclick=function(){curIdx=(curIdx+1)%ENSEMBLES.length;sfx('ensemble_part');draw();};

  setTimeout(draw,100);
  unlockAch('ensemble_analyst','Ensemble Analyst');
}

/* ═══════════════════════════════════════════════════════
   8. Comprehensive Technique Mastery Dashboard (Canvas 620x400)
   ═══════════════════════════════════════════════════════ */
function createMasteryPanel(){
  var KPI=[
    {name:'Phrasing',key:'v29_phrasing',color:'#4fc3f7',weight:12},
    {name:'Bow Control',key:'v29_bowctrl',color:'#ef5350',weight:15},
    {name:'Scales',key:'v29_scales',color:'#81c784',weight:13},
    {name:'Dynamics',key:'v29_dynamics',color:'#ffd54f',weight:14},
    {name:'Rhythm',key:'v29_rhythm',color:'#ce93d8',weight:12},
    {name:'Harmonics',key:'v29_harmonics',color:'#4db6ac',weight:10},
    {name:'Ensemble',key:'v29_ensemble',color:'#ff7043',weight:11},
    {name:'Repertoire',key:'v29_repertoire',color:'#aed581',weight:13}
  ];
  var panel=document.createElement('div');
  panel.id='v29-mastery-panel';
  panel.style.cssText='display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,6,20,0.97);z-index:9999;overflow-y:auto;padding:10px;';

  function getScore(k){var v=lp(k);return typeof v==='number'?v:(0.3+Math.sin(k.charCodeAt(4)*0.7)*0.2+0.15)}

  function gradeOf(v){return v>=0.9?'S':v>=0.75?'A':v>=0.55?'B':v>=0.35?'C':'D'}
  function gradeColor(g){return g==='S'?'#ffd700':g==='A'?'#4fc3f7':g==='B'?'#81c784':g==='C'?'#ff9800':'#ef5350'}

  function draw(){
    var cv=document.getElementById('v29-mastery-cv');if(!cv)return;
    var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0618';ctx.fillRect(0,0,W,H);

    ctx.fillStyle='#e8d5b0';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('Technique Mastery Dashboard',W/2,22);

    var cols=4,rows=2;
    var gW=(W-30)/cols,gH=(H-70)/rows;
    var totalWeight=0,weightedSum=0;

    for(var i=0;i<KPI.length;i++){
      var col=i%cols,row=Math.floor(i/cols);
      var cx=15+col*gW+gW/2,cy=50+row*gH+gH/2;
      var r=Math.min(gW,gH)*0.35;
      var score=getScore(KPI[i].key);
      var grade=gradeOf(score);

      totalWeight+=KPI[i].weight;
      weightedSum+=KPI[i].weight*score;

      ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,2*Math.PI);
      ctx.strokeStyle='rgba(200,180,140,0.2)';ctx.lineWidth=8;ctx.stroke();

      var endAngle=Math.PI+Math.PI*score;
      ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,endAngle);
      ctx.strokeStyle=KPI[i].color;ctx.lineWidth=8;ctx.stroke();

      ctx.fillStyle=gradeColor(grade);ctx.font='bold 20px Georgia';ctx.textAlign='center';
      ctx.fillText(grade,cx,cy+5);

      ctx.fillStyle='#fff';ctx.font='9px Georgia';
      ctx.fillText(Math.round(score*100)+'%',cx,cy+18);

      ctx.fillStyle=KPI[i].color;ctx.font='bold 10px Georgia';
      ctx.fillText(KPI[i].name,cx,cy+r+18);

      ctx.fillStyle='#887060';ctx.font='8px Georgia';
      ctx.fillText('w:'+KPI[i].weight+'%',cx,cy+r+28);
    }

    var overall=weightedSum/totalWeight;
    var oGrade=gradeOf(overall);
    ctx.fillStyle=gradeColor(oGrade);ctx.font='bold 12px Georgia';ctx.textAlign='center';
    ctx.fillText('Overall: '+oGrade+' ('+Math.round(overall*100)+'%)',W/2,H-10);
  }

  panel.innerHTML='<div style="text-align:right;padding:4px"><button id="v29-mastery-close" style="background:none;border:1px solid #D4894A;color:#D4894A;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Close</button></div>'+
    '<h3 style="text-align:center;color:#e8d5b0;font-size:14px;margin:4px 0">Technique Mastery Dashboard</h3>'+
    '<div style="text-align:center"><canvas id="v29-mastery-cv" width="620" height="400" style="max-width:100%;border:1px solid rgba(200,180,140,0.2);border-radius:8px;background:#0a0618"></canvas></div>';
  document.body.appendChild(panel);

  panel.querySelector('#v29-mastery-close').onclick=function(){panel.style.display='none';};

  setTimeout(draw,100);
  unlockAch('technique_master_v29','Technique Master v29');
}

/* ═══════════════════════════════════════════════════════
   QUIZ PANEL (q286-q300)
   ═══════════════════════════════════════════════════════ */
function createQuizPanel(){
  var panel=document.createElement('div');
  panel.id='v29-quiz-panel';
  panel.style.cssText='display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,6,20,0.97);z-index:9999;overflow-y:auto;padding:10px;';

  var qIdx=0,score=0,answered=0;
  var results=lp('v29_quiz_results')||{};

  function render(){
    if(qIdx>=V29_QUIZZES.length){
      var pct=Math.round(score/V29_QUIZZES.length*100);
      panel.querySelector('#v29-quiz-body').innerHTML=
        '<div style="text-align:center;padding:30px;color:#e8d5b0">'+
        '<h3>Quiz Complete!</h3><p style="font-size:24px;color:#ffd700">'+score+'/'+V29_QUIZZES.length+' ('+pct+'%)</p>'+
        '<p>'+(pct>=80?'Excellent!':pct>=60?'Good!':'Keep practicing!')+'</p>'+
        '<button onclick="document.getElementById(\'v29-quiz-panel\').style.display=\'none\'" style="padding:8px 20px;border-radius:6px;border:1px solid #D4894A;background:transparent;color:#D4894A;cursor:pointer;margin-top:10px">Close</button></div>';
      if(score===V29_QUIZZES.length)unlockAch('v29_quiz_all','v29 Quiz Master');
      sp('v29_quiz_results',results);
      return;
    }
    var q=V29_QUIZZES[qIdx];
    var html='<p style="color:#e8d5b0;font-size:13px;margin:10px 0">'+(qIdx+1)+'/'+V29_QUIZZES.length+' ['+q.cat+']</p>'+
      '<p style="color:#fff;font-size:14px;margin:10px 0">'+q.q+'</p>';
    for(var i=0;i<q.a.length;i++){
      html+='<button class="v29-qa" data-i="'+i+'" style="display:block;width:100%;text-align:left;padding:8px 12px;margin:4px 0;border-radius:6px;border:1px solid rgba(200,180,140,0.3);background:transparent;color:#c8b090;cursor:pointer;font-size:12px">'+q.a[i]+'</button>';
    }
    panel.querySelector('#v29-quiz-body').innerHTML=html;
    panel.querySelectorAll('.v29-qa').forEach(function(btn){
      btn.onclick=function(){
        var ci=parseInt(btn.dataset.i);
        var correct=ci===q.c;
        if(correct){score++;sfx('rhythm_score');btn.style.borderColor='#4caf50';btn.style.color='#4caf50';}
        else{sfx('rhythm_beat');btn.style.borderColor='#ef5350';btn.style.color='#ef5350';
          panel.querySelectorAll('.v29-qa')[q.c].style.borderColor='#4caf50';panel.querySelectorAll('.v29-qa')[q.c].style.color='#4caf50';}
        results[q.id]=correct;answered++;
        if(answered===1)unlockAch('v29_quiz_starter','v29 Quiz Starter');
        setTimeout(function(){qIdx++;render();},800);
      };
    });
  }

  panel.innerHTML='<div style="text-align:right;padding:4px"><button id="v29-quiz-close" style="background:none;border:1px solid #D4894A;color:#D4894A;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Close</button></div>'+
    '<h3 style="text-align:center;color:#e8d5b0;font-size:14px;margin:4px 0">v29 Quiz (q286-q300)</h3>'+
    '<div id="v29-quiz-body" style="max-width:500px;margin:0 auto;padding:10px"></div>';
  document.body.appendChild(panel);

  panel.querySelector('#v29-quiz-close').onclick=function(){panel.style.display='none';};
  render();
}

/* ═══════════════════════════════════════════════════════
   NAV: Add buttons to existing nav
   ═══════════════════════════════════════════════════════ */
function addV29Nav(){
  var navTarget=document.querySelector('.v19-nav-bar')||document.querySelector('nav')||document.querySelector('.bottom-nav')||document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){
    var allNav=document.querySelectorAll('div[style*="flex-wrap"]');
    if(allNav.length>0)navTarget=allNav[allNav.length-1];
  }
  if(!navTarget){navTarget=document.createElement('div');navTarget.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px;justify-content:center;margin:8px auto;max-width:600px;';document.body.appendChild(navTarget);}

  var btns=[
    {label:'Phrase',panel:'v29-phrasing-panel',color:'#4fc3f7',key:'KeyQ'},
    {label:'BowAcc',panel:'v29-bowaccel-panel',color:'#ef5350',key:'KeyW'},
    {label:'ScaleM',panel:'v29-scalematrix-panel',color:'#81c784',key:'KeyE'},
    {label:'DynCtr',panel:'v29-dynamics-panel',color:'#ffd54f',key:'KeyR'},
    {label:'Rhythm',panel:'v29-rhythm-panel',color:'#ce93d8',key:'KeyT'},
    {label:'Harmon',panel:'v29-harmonics-panel',color:'#4db6ac',key:'KeyY'},
    {label:'Ensemb',panel:'v29-ensemble-panel',color:'#ff7043',key:'KeyU'},
    {label:'Master',panel:'v29-mastery-panel',color:'#aed581',key:'KeyI'},
    {label:'Quiz29',panel:'v29-quiz-panel',color:'#D4894A',key:'Digit0'}
  ];

  var opened=lp('v29_opened')||{};

  btns.forEach(function(b){
    var btn=document.createElement('button');
    btn.textContent=b.label;
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid '+b.color+';background:transparent;color:'+b.color+';cursor:pointer;font-size:0.72em;margin:2px;';
    btn.addEventListener('click',function(){
      var p=document.getElementById(b.panel);
      if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('phrase_arc');
        opened[b.label]=true;sp('v29_opened',opened);
        if(Object.keys(opened).length>=5)unlockAch('v29_explorer','v29 Explorer');
      }
    });
    navTarget.appendChild(btn);
  });

  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    btns.forEach(function(b){
      if(e.code===b.key){
        var p=document.getElementById(b.panel);
        if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('phrase_arc');}
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════
   Register songs/lessons/achievements to global DBs
   ═══════════════════════════════════════════════════════ */
function registerData(){
  if(typeof window.SONG_DB!=='undefined'&&Array.isArray(window.SONG_DB)){
    V29_SONGS.forEach(function(s){
      if(!window.SONG_DB.find(function(x){return x.id===s.id;}))window.SONG_DB.push(s);
    });
  }
  if(typeof window.LESSON_DB!=='undefined'&&Array.isArray(window.LESSON_DB)){
    V29_LESSONS.forEach(function(l){
      if(!window.LESSON_DB.find(function(x){return x.id===l.id;}))window.LESSON_DB.push(l);
    });
  }
  if(typeof window.ACH_DB!=='undefined'&&Array.isArray(window.ACH_DB)){
    V29_ACHS.forEach(function(a){
      if(!window.ACH_DB.find(function(x){return x.id===a.id;}))window.ACH_DB.push(a);
    });
  }
  unlockAch('song_264','Song Collector 264');
  var allAch=loadAch(),v29Ids=V29_ACHS.map(function(a){return a.id;});
  var allV29=v29Ids.every(function(id){return allAch[id];});
  if(allV29)unlockAch('v29_complete','v29 Complete');
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
function init(){
  createPhrasingPanel();
  createBowAccelPanel();
  createScaleMatrixPanel();
  createDynamicsPanel();
  createRhythmPanel();
  createHarmonicsPanel();
  createEnsemblePanel();
  createMasteryPanel();
  createQuizPanel();
  addV29Nav();
  registerData();
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
else{init();}

})();
