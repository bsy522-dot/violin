(function V21Patch(){'use strict';
if(window.__V21_LOADED)return;window.__V21_LOADED=true;

function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress'))||{};}catch(e){return {};}}
function saveProgress(o){var p=loadProgress();Object.keys(o).forEach(function(k){p[k]=o[k];});localStorage.setItem('violinProgress',JSON.stringify(p));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements'))||{};}catch(e){return {};}}
function unlockAch(id){var a=loadAchievements();if(a[id])return;a[id]={ts:Date.now()};localStorage.setItem('violinAchievements',JSON.stringify(a));var t=document.getElementById('achToast');if(t){t.textContent='\u{1F3C6} '+id+' 획득!';t.style.display='block';setTimeout(function(){t.style.display='none';},2500);}if(window.showAchToast)window.showAchToast(id);}
function addHistory(type,text){try{var h=JSON.parse(localStorage.getItem('violinV10_history'))||[];h.unshift({type:type,text:text,ts:Date.now()});if(h.length>60)h.length=60;localStorage.setItem('violinV10_history',JSON.stringify(h));}catch(e){}}

var actx21=null;
function v21Sfx(type){
  try{
    if(!actx21)actx21=new(window.AudioContext||window.webkitAudioContext)();
    var presets={
      bow_speed:{f:523,w:'sine',a:0.18,d:0.2},
      bow_stroke:{f:659,w:'triangle',a:0.15,d:0.15},
      dynamic_pp:{f:330,w:'sine',a:0.08,d:0.3},
      dynamic_ff:{f:660,w:'sine',a:0.3,d:0.2},
      interval_play:{f:440,w:'sine',a:0.2,d:0.4},
      interval_correct:{f:784,w:'sine',a:0.22,d:0.2},
      crossing_hit:{f:550,w:'triangle',a:0.18,d:0.1},
      tone_color:{f:466,w:'sine',a:0.15,d:0.25},
      timer_tick:{f:1000,w:'square',a:0.12,d:0.04},
      timer_done:{f:880,w:'sine',a:0.25,d:0.5},
      chord_strum:{f:392,w:'triangle',a:0.2,d:0.3},
      anxiety_breathe:{f:294,w:'sine',a:0.1,d:0.6},
      quiz_v21:{f:698,w:'sine',a:0.2,d:0.25},
      quiz_wrong_v21:{f:196,w:'sawtooth',a:0.15,d:0.3},
      achieve_v21:{f:932,w:'sine',a:0.22,d:0.35}
    };
    var pr=presets[type]||presets.bow_speed;
    var osc=actx21.createOscillator();var g=actx21.createGain();
    osc.type=pr.w;osc.frequency.value=pr.f;
    g.gain.setValueAtTime(pr.a,actx21.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,actx21.currentTime+pr.d);
    osc.connect(g);g.connect(actx21.destination);
    osc.start();osc.stop(actx21.currentTime+pr.d+0.05);
  }catch(e){}
}

/* ===== SONGS s175-s184 (174->184) ===== */
var V21_SONGS=[
  {id:'s175',title:'파가니니 바이올린 협주곡 1번',diff:5,genre:'Virtuoso'},
  {id:'s176',title:'브라움스 헝가리 무곡 5번',diff:3,genre:'Romantic'},
  {id:'s177',title:'베토벤 바이올린 소나타 9번 크로이츠르',diff:5,genre:'Classical'},
  {id:'s178',title:'생상스 서주곡과 론도 카프리치오조',diff:4,genre:'Romantic'},
  {id:'s179',title:'엘가 사랑의 인사',diff:2,genre:'Romantic'},
  {id:'s180',title:'파헨벨 카논 D장조',diff:4,genre:'Baroque'},
  {id:'s181',title:'비발디 사계 겨울 Largo',diff:3,genre:'Baroque'},
  {id:'s182',title:'모차르트 바이올린 협주곡 3번',diff:4,genre:'Classical'},
  {id:'s183',title:'드부시 달빛',diff:2,genre:'Impressionist'},
  {id:'s184',title:'프로코피예프 바이올린 협주곡 1번',diff:5,genre:'Modern'}
];

/* ===== LESSONS l201-l210 (200->210) ===== */
var V21_LESSONS=[
  {id:'l201',title:'보잉 속도와 톤 품질의 관계',desc:'활 속도와 압력이 음색에 미치는 영향을 실험합니다'},
  {id:'l202',title:'다이내믹 표현의 기초',desc:'pp부터 ff까지 음량 조절과 크레셈도/디크레셈도 연습'},
  {id:'l203',title:'청음 훈련 입문',desc:'음정 간격을 귀로 구별하는 능력 기르기'},
  {id:'l204',title:'현 이동 패턴의 과학',desc:'G/D/A/E 현 간 부드러운 이동 테크닉'},
  {id:'l205',title:'톤 컬러의 세계',desc:'Sul Tasto, Sul Ponticello, Flautando 등 다양한 음색 탐구'},
  {id:'l206',title:'효율적인 연습 세션 설계',desc:'포모도로 기법을 활용한 집중력 유지 전략'},
  {id:'l207',title:'바이올린 음악 이론 기초',desc:'코드와 더블스톱 이해하기'},
  {id:'l208',title:'무대 불안 극복 전략',desc:'공연 불안을 관리하는 실용적 기법 8가지'},
  {id:'l209',title:'파가니니 협주곡 1번 분석',desc:'최고 난이도 비르투오조 협주곡의 테크닉 분석'},
  {id:'l210',title:'v21 종합 실력 평가',desc:'보잉속도/다이내믹/청음/현이동/톤컬러/코드 종합 평가'}
];

/* ===== QUIZ v21 +15 (165->180) ===== */
var V21_QUIZ=[
  {q:'보잉 속도가 빠르고 압력이 강할 때 나는 음색은?',a:['Dolce','Brillante','Flautando','Sul Tasto'],c:1},
  {q:'pp(피아니시모)의 의미는?',a:['매우 여리게','매우 크게','점점 크게','점점 여리게'],c:0},
  {q:'완전 5도 음정 간격의 반음 수는?',a:['5반음','7반음','12반음','3반음'],c:1},
  {q:'현 이동 시 큥의 경사를 유지해야 하는 이유는?',a:['빠른 연주를 위해','음색 일관성을 위해','손가락 보호를 위해','음량을 키우기 위해'],c:1},
  {q:'Sul Ponticello 주법은 활을 어디에 대고 연주하는 것인가요?',a:['지판 위','브릿지 근처','활의 끝','테일피스'],c:1},
  {q:'포모도로 테크닉에서 권장하는 집중 연습 시간은?',a:['25분','시간','10분','2시간'],c:0},
  {q:'바이올린의 더블스톱(Double Stop)이란?',a:['두 현을 동시에 연주','두 번 멈추는 것','상활을 두 번 켓는 것','두 곡을 연속 연주'],c:0},
  {q:'무대 불안 관리에서 호흡 조절이 중요한 이유는?',a:['심박수 조절과 근육 이완','음량을 키우기 위해','지휘자 신호 인식','악보를 넓기 위해'],c:0},
  {q:'크레셈도(crescendo)의 기호는?',a:['>','<','p','f'],c:1},
  {q:'보잉에서 Contact Point가 지판 쪽에 가까울수록?',a:['부드러운 음색','금속성 음색','날카로운 음색','큰 음량'],c:0},
  {q:'A장조 스케일의 샤프(♯) 음은?',a:['F#, C#, G#','F#, C#','F#','F#, C#, G#, D#'],c:0},
  {q:'파가니니 바이올린 협주곡 1번의 조성은?',a:['D장조','A단조','G단조','E장조'],c:0},
  {q:'Flautando 주법의 특징은?',a:['플루트처럼 부드러운 음색','매우 강한 음색','타악기처럼 튀기는 음색','떨림이 많은 음색'],c:0},
  {q:'G현과 D현 사이의 음정 간격은?',a:['완전 4도','완전 5도','장 3도','완전 8도'],c:1},
  {q:'Sforzando(sfz)의 의미는?',a:['갑자기 강하게','점점 여리게','갑자기 여리게','일정하게'],c:0}
];

/* ===== ACHIEVEMENTS v21 +12 (190->202) ===== */
var V21_ACHS=[
  {id:'bow_speed_analyst',title:'보잉 속도 분석가',desc:'보잉 속도 분석기에서 7종 전부 스캔'},
  {id:'dynamic_master',title:'다이내믹 마스터',desc:'다이내믹 표현 트레이너 S등급 달성'},
  {id:'interval_expert',title:'청음 전문가',desc:'인터벌 인식기 정확도 90% 이상'},
  {id:'crossing_pro',title:'현 이동 프로',desc:'현 이동 드릴 10회 완료'},
  {id:'tone_explorer',title:'톤 컬러 탐험가',desc:'톤 컬러 팔레트 8종 전부 체험'},
  {id:'practice_timer_guru',title:'연습 타이머 구루',desc:'연습 세션 타이머 10세션 완료'},
  {id:'chord_builder',title:'코드 빌더',desc:'음악 이론 코드 빌더 8종 전부 학습'},
  {id:'anxiety_manager',title:'무대 불안 관리자',desc:'공연 불안 관리기 8전략 전부 연습'},
  {id:'song_184',title:'184곡 마스터',desc:'184곡 라이브러리 달성'},
  {id:'quiz_v21_master',title:'퀀즈 v21 마스터',desc:'v21 퀀즈 전문 정답'},
  {id:'v21_explorer',title:'v21 탐험가',desc:'v21 기능 4개 이상 사용'},
  {id:'v21_complete',title:'v21 컴플리트',desc:'v21 전체 9개 기능 모두 사용'}
];

/* ===== PANEL STYLE ===== */
var st21=document.createElement('style');
st21.textContent='.v21-panel{position:fixed;inset:0;z-index:9000;background:rgba(10,8,6,.94);backdrop-filter:blur(6px);overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px;display:none;font-family:Georgia,serif;color:#e8dcc8;}'+
'.v21-panel.show{display:block;}'+
'.v21-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}'+
'.v21-hd h3{color:#ffd700;font-size:15px;letter-spacing:1px;}'+
'.v21Close{background:none;border:1px solid rgba(255,215,0,.3);color:#ffd700;border-radius:50%;width:28px;height:28px;font-size:16px;cursor:pointer;line-height:26px;text-align:center;}'+
'.v21Close:active{background:rgba(255,215,0,.2);}'+
'.v21-cv-wrap{display:flex;justify-content:center;margin:10px 0;overflow-x:auto;}'+
'.v21-btn{display:inline-block;padding:6px 12px;margin:3px;border-radius:6px;border:1px solid rgba(212,137,74,.3);background:rgba(212,137,74,.12);color:#D4894A;font-size:12px;cursor:pointer;font-family:Georgia,serif;transition:all .15s;}'+
'.v21-btn:active,.v21-btn.active{background:rgba(212,137,74,.3);border-color:#D4894A;color:#fff;}'+
'.v21-info{font-size:11px;color:rgba(232,220,200,.6);text-align:center;margin:6px 0;line-height:1.5;}'+
'.v21-grade{font-size:20px;font-weight:bold;text-align:center;margin:8px 0;text-shadow:0 0 12px currentColor;}'+
'.v21-grade.s{color:#ffd700;}.v21-grade.a{color:#44ee44;}.v21-grade.b{color:#44ddee;}.v21-grade.c{color:#cc55ff;}.v21-grade.d{color:#ff6644;}'+
'.v21-tabs{display:flex;gap:2px;flex-wrap:wrap;margin:8px 0;justify-content:center;}';
document.head.appendChild(st21);

function makePanel(id,title){
  var p=document.createElement('div');p.className='v21-panel';p.id=id;
  p.innerHTML='<div class="v21-hd"><h3>'+title+'</h3><button class="v21Close">×</button></div>';
  p.querySelector('.v21Close').onclick=function(){p.classList.remove('show');};
  document.body.appendChild(p);return p;
}
function mkCv(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;c.style.cssText='max-width:100%;height:auto;border-radius:8px;background:#141210;border:1px solid rgba(212,137,74,.15);';return c;}
function gradeFor(pct){if(pct>=90)return{g:'S',c:'s'};if(pct>=75)return{g:'A',c:'a'};if(pct>=60)return{g:'B',c:'b'};if(pct>=40)return{g:'C',c:'c'};return{g:'D',c:'d'};}

/* ===== 1. BOW SPEED ANALYZER Canvas 580x360 ===== */
function createBowSpeedPanel(){
  var panel=makePanel('bowSpeedPanel','\u{1F3BB} 보잉 속도 분석기');
  var cv=mkCv(580,360);
  var wrap=document.createElement('div');wrap.className='v21-cv-wrap';wrap.appendChild(cv);
  panel.appendChild(wrap);

  var strokes=[
    {name:'Detaché',speed:65,pressure:50,tone:'김고 부드러운 음색'},
    {name:'Legato',speed:45,pressure:35,tone:'부드럽고 연결된 음색'},
    {name:'Staccato',speed:80,pressure:70,tone:'짧고 날카로운 음색'},
    {name:'Spiccato',speed:90,pressure:25,tone:'튀기는 듯한 경쾌한 음색'},
    {name:'Martelé',speed:85,pressure:80,tone:'강하고 강조된 음색'},
    {name:'Tremolo',speed:95,pressure:40,tone:'빠른 반복의 떨리는 음색'},
    {name:'Col Legno',speed:30,pressure:15,tone:'나무 타격음 특수 효과'}
  ];
  var selIdx=0,scanCount=JSON.parse(localStorage.getItem('v21_bowscan')||'0');

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,580,360);
    ctx.fillStyle='#1a1612';ctx.fillRect(0,0,580,360);
    ctx.fillStyle='#ffd700';ctx.font='bold 13px Georgia';
    ctx.fillText('Bow Stroke Speed vs Pressure',170,22);

    ctx.strokeStyle='rgba(212,137,74,.2)';ctx.lineWidth=1;
    for(var i=0;i<=10;i++){
      var x=60+i*48,y=40+i*26;
      ctx.beginPath();ctx.moveTo(x,40);ctx.lineTo(x,310);ctx.stroke();
      ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(540,y);ctx.stroke();
    }
    ctx.fillStyle='rgba(232,220,200,.4)';ctx.font='10px Georgia';
    ctx.fillText('Speed →',270,335);
    ctx.save();ctx.translate(15,200);ctx.rotate(-Math.PI/2);ctx.fillText('Pressure →',0,0);ctx.restore();

    var colors=['#ffd700','#44ee44','#ff6644','#44ddee','#cc55ff','#ff9944','#88aaff'];
    strokes.forEach(function(s,i){
      var x=60+s.speed*4.8,y=310-s.pressure*2.7;
      var r=i===selIdx?14:10;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=i===selIdx?colors[i]:'rgba('+parseInt(colors[i].slice(1,3),16)+','+parseInt(colors[i].slice(3,5),16)+','+parseInt(colors[i].slice(5,7),16)+',0.5)';
      ctx.fill();ctx.strokeStyle=colors[i];ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle=i===selIdx?'#fff':'rgba(232,220,200,.7)';ctx.font=(i===selIdx?'bold ':'')+' 10px Georgia';
      ctx.textAlign='center';ctx.fillText(s.name,x,y-r-4);ctx.textAlign='left';
    });

    var sel=strokes[selIdx];
    ctx.fillStyle='rgba(26,22,18,.85)';ctx.fillRect(340,40,220,100);
    ctx.strokeStyle='rgba(212,137,74,.3)';ctx.strokeRect(340,40,220,100);
    ctx.fillStyle='#ffd700';ctx.font='bold 12px Georgia';ctx.fillText(sel.name,352,60);
    ctx.fillStyle='#e8dcc8';ctx.font='11px Georgia';
    ctx.fillText('Speed: '+sel.speed+'%',352,80);
    ctx.fillText('Pressure: '+sel.pressure+'%',352,95);
    ctx.fillStyle='rgba(212,137,74,.8)';ctx.font='10px Georgia';
    ctx.fillText(sel.tone,352,115);
    var cp=sel.pressure<30?'지판 쪽 (Sul Tasto)':sel.pressure>65?'브릿지 쪽 (Sul Pont.)':'중간 (Normal)';
    ctx.fillText('Contact: '+cp,352,132);
  }

  var tabs=document.createElement('div');tabs.className='v21-tabs';
  strokes.forEach(function(s,i){
    var b=document.createElement('button');b.className='v21-btn'+(i===0?' active':'');b.textContent=s.name;
    b.onclick=function(){selIdx=i;tabs.querySelectorAll('.v21-btn').forEach(function(x,j){x.classList.toggle('active',j===i);});
      v21Sfx('bow_stroke');draw();
      scanCount++;localStorage.setItem('v21_bowscan',scanCount);
      if(scanCount>=7)unlockAch('bow_speed_analyst');
    };tabs.appendChild(b);
  });
  panel.appendChild(tabs);
  var info=document.createElement('div');info.className='v21-info';info.textContent='각 보잉 스트로크의 속도와 압력 관계를 분석합니다. 탭하여 상세 정보를 확인하세요.';
  panel.appendChild(info);draw();
}

/* ===== 2. DYNAMIC EXPRESSION TRAINER Canvas 560x340 ===== */
function createDynamicPanel(){
  var panel=makePanel('dynamicPanel','\u{1F4CA} 다이내믹 표현 트레이너');
  var cv=mkCv(560,340);
  var wrap=document.createElement('div');wrap.className='v21-cv-wrap';wrap.appendChild(cv);
  panel.appendChild(wrap);

  var dynamics=['pp','p','mp','mf','f','ff'];
  var dynVals=[10,25,40,60,80,95];
  var exercises=[],exIdx=0,totalScore=0,rounds=0;

  function genEx(){
    var from=Math.floor(Math.random()*6),to;
    do{to=Math.floor(Math.random()*6);}while(to===from);
    return{from:from,to:to,userVal:null,done:false};
  }
  function resetEx(){exercises=[];for(var i=0;i<10;i++)exercises.push(genEx());exIdx=0;totalScore=0;rounds=0;}
  resetEx();

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,560,340);
    ctx.fillStyle='#1a1612';ctx.fillRect(0,0,560,340);
    ctx.fillStyle='#ffd700';ctx.font='bold 13px Georgia';
    ctx.fillText('Dynamic Expression Trainer',170,22);

    for(var i=0;i<6;i++){
      var x=50+i*82,h=30+dynVals[i]*2.2;
      ctx.fillStyle=i===exercises[exIdx].from?'rgba(255,215,0,.5)':i===exercises[exIdx].to?'rgba(68,238,68,.5)':'rgba(212,137,74,.15)';
      ctx.fillRect(x,280-h,60,h);
      ctx.strokeStyle=i===exercises[exIdx].from?'#ffd700':i===exercises[exIdx].to?'#44ee44':'rgba(212,137,74,.3)';
      ctx.lineWidth=1.5;ctx.strokeRect(x,280-h,60,h);
      ctx.fillStyle=i===exercises[exIdx].from||i===exercises[exIdx].to?'#fff':'rgba(232,220,200,.6)';
      ctx.font='bold 12px Georgia';ctx.textAlign='center';
      ctx.fillText(dynamics[i],x+30,298);
      ctx.font='10px Georgia';ctx.fillText(dynVals[i]+'%',x+30,280-h-6);
      ctx.textAlign='left';
    }

    var ex=exercises[exIdx];
    var dir=ex.to>ex.from?'↗ Crescendo':'↘ Diminuendo';
    ctx.fillStyle='#e8dcc8';ctx.font='12px Georgia';
    ctx.fillText('연습 '+(exIdx+1)+'/10: '+dynamics[ex.from]+' → '+dynamics[ex.to]+' ('+dir+')',50,318);

    if(rounds>0){
      var pct=Math.round(totalScore/rounds);
      var gr=gradeFor(pct);
      ctx.fillStyle='rgba(26,22,18,.85)';ctx.fillRect(360,30,180,55);
      ctx.strokeStyle='rgba(212,137,74,.3)';ctx.strokeRect(360,30,180,55);
      ctx.fillStyle='#ffd700';ctx.font='bold 11px Georgia';ctx.fillText('종합: '+pct+'%',372,50);
      ctx.fillStyle=gr.c==='s'?'#ffd700':gr.c==='a'?'#44ee44':'#e8dcc8';
      ctx.font='bold 16px Georgia';ctx.fillText(gr.g+' 등급',372,72);
    }

    if(ex.from<ex.to){
      ctx.strokeStyle='rgba(255,215,0,.3)';ctx.lineWidth=2;ctx.beginPath();
      ctx.moveTo(80+ex.from*82,280-30-dynVals[ex.from]*2.2);
      ctx.lineTo(80+ex.to*82,280-30-dynVals[ex.to]*2.2);ctx.stroke();
    }else{
      ctx.strokeStyle='rgba(68,238,68,.3)';ctx.lineWidth=2;ctx.beginPath();
      ctx.moveTo(80+ex.from*82,280-30-dynVals[ex.from]*2.2);
      ctx.lineTo(80+ex.to*82,280-30-dynVals[ex.to]*2.2);ctx.stroke();
    }
  }

  var btns=document.createElement('div');btns.className='v21-tabs';
  dynamics.forEach(function(d,i){
    var b=document.createElement('button');b.className='v21-btn';b.textContent=d;
    b.onclick=function(){
      var ex=exercises[exIdx];var target=ex.to;
      var diff=Math.abs(i-target);var sc=diff===0?100:diff===1?70:diff===2?40:10;
      totalScore+=sc;rounds++;
      v21Sfx(i<=2?'dynamic_pp':'dynamic_ff');
      if(exIdx<9)exIdx++;else{
        if(Math.round(totalScore/rounds)>=90)unlockAch('dynamic_master');
        addHistory('dynamic','Dynamic 트레이너 완료: '+Math.round(totalScore/rounds)+'%');
      }
      draw();
    };btns.appendChild(b);
  });
  panel.appendChild(btns);
  var resetBtn=document.createElement('button');resetBtn.className='v21-btn';resetBtn.textContent='\u{1F504} 새로 시작';
  resetBtn.onclick=function(){resetEx();draw();};btns.appendChild(resetBtn);
  draw();
}

/* ===== 3. EAR TRAINING INTERVAL RECOGNIZER Canvas 600x380 ===== */
function createIntervalPanel(){
  var panel=makePanel('intervalPanel','\u{1F442} 청음 인터벌 인식기');
  var cv=mkCv(600,380);
  var wrap=document.createElement('div');wrap.className='v21-cv-wrap';wrap.appendChild(cv);
  panel.appendChild(wrap);

  var intervals=[
    {name:'완전 1도',semi:0,en:'Unison'},
    {name:'단 2도',semi:1,en:'m2'},
    {name:'장 2도',semi:2,en:'M2'},
    {name:'단 3도',semi:3,en:'m3'},
    {name:'장 3도',semi:4,en:'M3'},
    {name:'완전 4도',semi:5,en:'P4'},
    {name:'증 4도/감 5도',semi:6,en:'TT'},
    {name:'완전 5도',semi:7,en:'P5'},
    {name:'단 6도',semi:8,en:'m6'},
    {name:'장 6도',semi:9,en:'M6'},
    {name:'단 7도',semi:10,en:'m7'},
    {name:'장 7도',semi:11,en:'M7'},
    {name:'완전 8도',semi:12,en:'P8'}
  ];
  var scores=new Array(13).fill(0),attempts=new Array(13).fill(0);
  var curQ=null,totalCorrect=0,totalAttempts=0;
  try{var saved=JSON.parse(localStorage.getItem('v21_interval'));if(saved){scores=saved.s;attempts=saved.a;totalCorrect=saved.tc||0;totalAttempts=saved.ta||0;}}catch(e){}

  function playInterval(semi){
    try{
      if(!actx21)actx21=new(window.AudioContext||window.webkitAudioContext)();
      var baseFreq=440;
      var osc1=actx21.createOscillator();var g1=actx21.createGain();
      osc1.type='sine';osc1.frequency.value=baseFreq;
      g1.gain.setValueAtTime(0.2,actx21.currentTime);g1.gain.exponentialRampToValueAtTime(0.001,actx21.currentTime+0.5);
      osc1.connect(g1);g1.connect(actx21.destination);osc1.start();osc1.stop(actx21.currentTime+0.55);
      var osc2=actx21.createOscillator();var g2=actx21.createGain();
      osc2.type='sine';osc2.frequency.value=baseFreq*Math.pow(2,semi/12);
      g2.gain.setValueAtTime(0,actx21.currentTime);
      g2.gain.setValueAtTime(0.2,actx21.currentTime+0.6);
      g2.gain.exponentialRampToValueAtTime(0.001,actx21.currentTime+1.1);
      osc2.connect(g2);g2.connect(actx21.destination);osc2.start();osc2.stop(actx21.currentTime+1.15);
    }catch(e){}
  }

  function newQuestion(){
    var idx=Math.floor(Math.random()*13);
    curQ={idx:idx,semi:intervals[idx].semi};
    playInterval(curQ.semi);
    draw();
  }

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='#1a1612';ctx.fillRect(0,0,600,380);
    ctx.fillStyle='#ffd700';ctx.font='bold 13px Georgia';ctx.fillText('Ear Training - Interval Recognition',160,22);

    var barW=38;
    for(var i=0;i<13;i++){
      var x=30+i*43;var pct=attempts[i]>0?Math.round(scores[i]/attempts[i]*100):0;
      var h=Math.max(4,pct*2.2);
      var col=pct>=90?'#ffd700':pct>=70?'#44ee44':pct>=50?'#44ddee':pct>=30?'#cc55ff':'#ff6644';
      ctx.fillStyle=pct>0?col:'rgba(212,137,74,.15)';
      ctx.fillRect(x,310-h,barW,h);
      ctx.strokeStyle='rgba(212,137,74,.3)';ctx.lineWidth=1;ctx.strokeRect(x,310-h,barW,h);
      ctx.fillStyle='rgba(232,220,200,.6)';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(intervals[i].en,x+barW/2,326);
      if(pct>0){ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.fillText(pct+'%',x+barW/2,310-h-4);}
      ctx.textAlign='left';
    }

    if(totalAttempts>0){
      var oPct=Math.round(totalCorrect/totalAttempts*100);var gr=gradeFor(oPct);
      ctx.fillStyle='rgba(26,22,18,.85)';ctx.fillRect(400,35,180,65);
      ctx.strokeStyle='rgba(212,137,74,.3)';ctx.strokeRect(400,35,180,65);
      ctx.fillStyle='#ffd700';ctx.font='11px Georgia';ctx.fillText('총 정확도: '+oPct+'%',412,55);
      ctx.fillText(totalCorrect+'/'+totalAttempts+' 정답',412,72);
      ctx.fillStyle=gr.c==='s'?'#ffd700':'#e8dcc8';ctx.font='bold 14px Georgia';ctx.fillText(gr.g,412,92);
    }

    if(curQ){
      ctx.fillStyle='#ffd700';ctx.font='14px Georgia';ctx.textAlign='center';
      ctx.fillText('\u{1F50A} 이 음정 간격은? (클릭하여 다시 들기)',300,356);ctx.textAlign='left';
    }

    ctx.fillStyle='rgba(232,220,200,.4)';ctx.font='10px Georgia';ctx.fillText('Accuracy %',10,345);
  }

  cv.onclick=function(){if(curQ)playInterval(curQ.semi);};

  var ansDiv=document.createElement('div');ansDiv.className='v21-tabs';
  intervals.forEach(function(iv,i){
    var b=document.createElement('button');b.className='v21-btn';b.textContent=iv.en;b.style.fontSize='10px';b.style.padding='4px 6px';
    b.onclick=function(){
      if(!curQ)return;
      attempts[curQ.idx]++;totalAttempts++;
      if(i===curQ.idx){scores[curQ.idx]++;totalCorrect++;v21Sfx('interval_correct');}
      else{v21Sfx('quiz_wrong_v21');}
      localStorage.setItem('v21_interval',JSON.stringify({s:scores,a:attempts,tc:totalCorrect,ta:totalAttempts}));
      if(totalAttempts>=20&&Math.round(totalCorrect/totalAttempts*100)>=90)unlockAch('interval_expert');
      newQuestion();
    };ansDiv.appendChild(b);
  });
  panel.appendChild(ansDiv);

  var startBtn=document.createElement('button');startBtn.className='v21-btn';startBtn.textContent='\u{1F50A} 새 문제';
  startBtn.onclick=function(){newQuestion();};
  var resetBtn=document.createElement('button');resetBtn.className='v21-btn';resetBtn.textContent='\u{1F504} 초기화';
  resetBtn.onclick=function(){scores=new Array(13).fill(0);attempts=new Array(13).fill(0);totalCorrect=0;totalAttempts=0;curQ=null;localStorage.removeItem('v21_interval');draw();};
  var btnRow=document.createElement('div');btnRow.className='v21-tabs';btnRow.appendChild(startBtn);btnRow.appendChild(resetBtn);
  panel.appendChild(btnRow);
  draw();
}

/* ===== 4. STRING CROSSING PATTERN VISUALIZER Canvas 580x360 ===== */
function createCrossingPanel(){
  var panel=makePanel('crossingPanel','\u{1F3BB} 현 이동 패턴 시각화');
  var cv=mkCv(580,360);
  var wrap=document.createElement('div');wrap.className='v21-cv-wrap';wrap.appendChild(cv);
  panel.appendChild(wrap);

  var strings=['G','D','A','E'];
  var strColors=['#44ee44','#cc55ff','#44ddee','#ffdd33'];
  var patterns=[
    {name:'G-D 교차',seq:[0,1,0,1,0,1,0,1]},
    {name:'D-A 교차',seq:[1,2,1,2,1,2,1,2]},
    {name:'A-E 교차',seq:[2,3,2,3,2,3,2,3]},
    {name:'G-A 도약',seq:[0,2,0,2,0,2,0,2]},
    {name:'D-E 도약',seq:[1,3,1,3,1,3,1,3]},
    {name:'G-E 전체',seq:[0,3,0,3,0,3,0,3]},
    {name:'순차 상행',seq:[0,1,2,3,0,1,2,3]},
    {name:'순차 하행',seq:[3,2,1,0,3,2,1,0]},
    {name:'아르페지오',seq:[0,1,2,3,2,1,0,1]},
    {name:'랜덤 패턴',seq:[]}
  ];
  var selPat=0,drillCount=JSON.parse(localStorage.getItem('v21_crossdrill')||'0'),step=0,playing=false;

  function genRandom(){var s=[];for(var i=0;i<8;i++)s.push(Math.floor(Math.random()*4));return s;}

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,580,360);
    ctx.fillStyle='#1a1612';ctx.fillRect(0,0,580,360);
    ctx.fillStyle='#ffd700';ctx.font='bold 13px Georgia';ctx.fillText('String Crossing Pattern',190,22);

    for(var i=0;i<4;i++){
      var y=70+i*55;
      ctx.strokeStyle=strColors[i];ctx.lineWidth=3-i*0.5;
      ctx.beginPath();ctx.moveTo(50,y);ctx.lineTo(530,y);ctx.stroke();
      ctx.fillStyle=strColors[i];ctx.font='bold 14px Georgia';ctx.fillText(strings[i],20,y+5);
    }

    var pat=patterns[selPat];var seq=pat.seq.length>0?pat.seq:genRandom();
    if(pat.seq.length===0&&!pat._cached){pat._cached=genRandom();seq=pat._cached;}
    else if(pat.seq.length===0){seq=pat._cached;}

    for(var j=0;j<seq.length;j++){
      var x=80+j*58,y=70+seq[j]*55;
      var isActive=playing&&j===step;
      ctx.beginPath();ctx.arc(x,y,isActive?12:8,0,Math.PI*2);
      ctx.fillStyle=isActive?'#fff':strColors[seq[j]];ctx.fill();
      if(isActive){ctx.strokeStyle='#ffd700';ctx.lineWidth=3;ctx.stroke();}
      ctx.fillStyle=isActive?'#ffd700':'rgba(232,220,200,.5)';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(j+1,x,y+25);ctx.textAlign='left';

      if(j<seq.length-1){
        var nx=80+(j+1)*58,ny=70+seq[j+1]*55;
        ctx.strokeStyle='rgba(212,137,74,.25)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(nx,ny);ctx.stroke();ctx.setLineDash([]);
      }
    }

    ctx.fillStyle='#e8dcc8';ctx.font='12px Georgia';
    ctx.fillText('패턴: '+pat.name,50,330);
    ctx.fillStyle='rgba(212,137,74,.6)';ctx.font='11px Georgia';
    ctx.fillText('완료 드릴: '+drillCount+'회',350,330);
    var gr=gradeFor(Math.min(drillCount*10,100));
    ctx.fillStyle=gr.c==='s'?'#ffd700':gr.c==='a'?'#44ee44':'#e8dcc8';ctx.font='bold 14px Georgia';ctx.fillText(gr.g,500,330);
  }

  function playDrill(){
    if(playing)return;playing=true;step=0;
    var pat=patterns[selPat];var seq=pat.seq.length>0?pat.seq:(pat._cached||genRandom());
    var iv=setInterval(function(){
      v21Sfx('crossing_hit');draw();step++;
      if(step>=seq.length){clearInterval(iv);playing=false;step=0;
        drillCount++;localStorage.setItem('v21_crossdrill',drillCount);
        if(drillCount>=10)unlockAch('crossing_pro');
        addHistory('crossing','현 이동 드릴 완료: '+pat.name);draw();}
    },400);
  }

  var tabs=document.createElement('div');tabs.className='v21-tabs';
  patterns.forEach(function(p,i){
    var b=document.createElement('button');b.className='v21-btn'+(i===0?' active':'');b.textContent=p.name;b.style.fontSize='10px';
    b.onclick=function(){selPat=i;if(i===9)patterns[9]._cached=genRandom();
      tabs.querySelectorAll('.v21-btn').forEach(function(x,j){if(j<10)x.classList.toggle('active',j===i);});draw();};
    tabs.appendChild(b);
  });
  var playBtn=document.createElement('button');playBtn.className='v21-btn';playBtn.textContent='▶ 드릴 시작';playBtn.style.background='rgba(68,238,68,.2)';
  playBtn.onclick=playDrill;tabs.appendChild(playBtn);
  panel.appendChild(tabs);draw();
}

/* ===== 5. TONE COLOR PALETTE Canvas 600x380 ===== */
function createToneColorPanel(){
  var panel=makePanel('toneColorPanel','\u{1F3A8} 톤 컬러 팔레트');
  var cv=mkCv(600,380);
  var wrap=document.createElement('div');wrap.className='v21-cv-wrap';wrap.appendChild(cv);
  panel.appendChild(wrap);

  var tones=[
    {name:'Brillante',speed:85,pressure:75,contact:80,desc:'밝고 화려한 음색. 브릿지 근처에서 빠른 보잉.',color:'#ffd700'},
    {name:'Dolce',speed:40,pressure:30,contact:30,desc:'부드럽고 달콤한 음색. 지판 쪽에서 느린 보잉.',color:'#44ee44'},
    {name:'Sul Tasto',speed:35,pressure:25,contact:15,desc:'지판 위에서 보입. 몭환적이고 부유하는 음색.',color:'#44ddee'},
    {name:'Sul Ponticello',speed:50,pressure:55,contact:95,desc:'브릿지 바로 옆에서 보입. 금속성이고 특이한 음색.',color:'#cc55ff'},
    {name:'Con Sordino',speed:45,pressure:35,contact:50,desc:'야음기 사용. 베일에 싸인 듯 부드럽고 먹먹한 음색.',color:'#88aaff'},
    {name:'Flautando',speed:30,pressure:20,contact:20,desc:'플루트처럼 부드러운 음색. 가벼운 압력, 지판 쪽.',color:'#aaffaa'},
    {name:'Espressivo',speed:60,pressure:55,contact:55,desc:'감정적이고 표현력 있는 음색. 비브라토와 함께.',color:'#ff9944'},
    {name:'Martellato',speed:80,pressure:85,contact:70,desc:'망치로 두드리듯 강하고 날카로운 음색.',color:'#ff6644'}
  ];
  var selTone=0,explored=JSON.parse(localStorage.getItem('v21_toneexp')||'[]');

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='#1a1612';ctx.fillRect(0,0,600,380);
    ctx.fillStyle='#ffd700';ctx.font='bold 13px Georgia';ctx.fillText('Tone Color Palette - Contact/Speed/Pressure Triangle',120,22);

    var cx=180,cy=200,r=120;
    ctx.strokeStyle='rgba(212,137,74,.2)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(cx,cy-r);ctx.lineTo(cx-r*0.87,cy+r*0.5);ctx.lineTo(cx+r*0.87,cy+r*0.5);ctx.closePath();ctx.stroke();
    ctx.fillStyle='rgba(232,220,200,.4)';ctx.font='10px Georgia';ctx.textAlign='center';
    ctx.fillText('Contact Point ↑',cx,cy-r-8);ctx.fillText('↙ Speed',cx-r*0.87-5,cy+r*0.5+15);ctx.fillText('Pressure ↘',cx+r*0.87+5,cy+r*0.5+15);ctx.textAlign='left';

    tones.forEach(function(t,i){
      var tx=cx+(t.contact-50)*r*0.87/50;
      var ty=cy-r*0.5+(100-t.speed)*r/100;
      var isActive=i===selTone;
      ctx.beginPath();ctx.arc(tx,ty,isActive?12:8,0,Math.PI*2);
      ctx.fillStyle=isActive?t.color:'rgba('+parseInt(t.color.slice(1,3),16)+','+parseInt(t.color.slice(3,5),16)+','+parseInt(t.color.slice(5,7),16)+',0.4)';
      ctx.fill();
      if(isActive){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();}
    });

    var sel=tones[selTone];
    ctx.fillStyle='rgba(26,22,18,.9)';ctx.fillRect(360,40,220,180);
    ctx.strokeStyle=sel.color;ctx.lineWidth=1.5;ctx.strokeRect(360,40,220,180);
    ctx.fillStyle=sel.color;ctx.font='bold 14px Georgia';ctx.fillText(sel.name,375,65);
    ctx.fillStyle='#e8dcc8';ctx.font='11px Georgia';
    var words=sel.desc.split(' ');var line='',ly=90;
    words.forEach(function(w){if((line+w).length>24){ctx.fillText(line.trim(),375,ly);ly+=16;line=w+' ';}else{line+=w+' ';}});
    if(line)ctx.fillText(line.trim(),375,ly);

    ly+=25;
    var metrics=[{label:'Speed',val:sel.speed},{label:'Pressure',val:sel.pressure},{label:'Contact',val:sel.contact}];
    metrics.forEach(function(m){
      ctx.fillStyle='rgba(232,220,200,.5)';ctx.font='10px Georgia';ctx.fillText(m.label+':',375,ly);
      ctx.fillStyle='rgba(212,137,74,.2)';ctx.fillRect(430,ly-8,120,10);
      ctx.fillStyle=sel.color;ctx.fillRect(430,ly-8,m.val*1.2,10);
      ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.fillText(m.val+'%',555,ly);
      ly+=18;
    });

    ctx.fillStyle='rgba(232,220,200,.4)';ctx.font='10px Georgia';
    ctx.fillText('탐험: '+explored.length+'/8',375,ly+5);
  }

  var tabs=document.createElement('div');tabs.className='v21-tabs';
  tones.forEach(function(t,i){
    var b=document.createElement('button');b.className='v21-btn'+(i===0?' active':'');b.textContent=t.name;b.style.fontSize='10px';b.style.borderColor=t.color;
    b.onclick=function(){selTone=i;tabs.querySelectorAll('.v21-btn').forEach(function(x,j){x.classList.toggle('active',j===i);});
      v21Sfx('tone_color');
      if(explored.indexOf(i)===-1){explored.push(i);localStorage.setItem('v21_toneexp',JSON.stringify(explored));}
      if(explored.length>=8)unlockAch('tone_explorer');
      draw();
    };tabs.appendChild(b);
  });
  panel.appendChild(tabs);draw();
}

/* ===== 6. PRACTICE SESSION TIMER Canvas 580x340 ===== */
function createTimerPanel(){
  var panel=makePanel('timerPanel','⏱ 연습 세션 타이머');
  var cv=mkCv(580,340);
  var wrap=document.createElement('div');wrap.className='v21-cv-wrap';wrap.appendChild(cv);
  panel.appendChild(wrap);

  var categories=['테크닉','레퍼토리','스케일','에튀드','초견'];
  var catColors=['#ffd700','#44ee44','#44ddee','#cc55ff','#ff9944'];
  var durations=[{label:'25분',sec:1500},{label:'15분',sec:900},{label:'10분',sec:600},{label:'5분',sec:300}];
  var selCat=0,selDur=0,timeLeft=1500,running=false,timerIv=null;
  var sessions=JSON.parse(localStorage.getItem('v21_timer_sessions')||'[]');
  var totalSessions=sessions.length;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,580,340);
    ctx.fillStyle='#1a1612';ctx.fillRect(0,0,580,340);
    ctx.fillStyle='#ffd700';ctx.font='bold 13px Georgia';ctx.fillText('Practice Session Timer',190,22);

    var cx=160,cy=175,r=100;
    var pct=timeLeft/durations[selDur].sec;
    ctx.strokeStyle='rgba(212,137,74,.15)';ctx.lineWidth=12;
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle=catColors[selCat];ctx.lineWidth=12;ctx.lineCap='round';
    ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+pct*Math.PI*2,false);ctx.stroke();ctx.lineCap='butt';

    var min=Math.floor(timeLeft/60),sec=timeLeft%60;
    ctx.fillStyle='#fff';ctx.font='bold 32px Georgia';ctx.textAlign='center';
    ctx.fillText((min<10?'0':'')+min+':'+(sec<10?'0':'')+sec,cx,cy+10);
    ctx.fillStyle=catColors[selCat];ctx.font='12px Georgia';
    ctx.fillText(categories[selCat],cx,cy+35);ctx.textAlign='left';

    ctx.fillStyle='rgba(26,22,18,.85)';ctx.fillRect(320,50,240,130);
    ctx.strokeStyle='rgba(212,137,74,.3)';ctx.strokeRect(320,50,240,130);
    ctx.fillStyle='#ffd700';ctx.font='bold 11px Georgia';ctx.fillText('세션 통계',335,72);
    var catCounts=[0,0,0,0,0];
    sessions.forEach(function(s){if(s.cat>=0&&s.cat<5)catCounts[s.cat]++;});
    categories.forEach(function(c,i){
      ctx.fillStyle=catColors[i];ctx.font='10px Georgia';ctx.fillText(c+': '+catCounts[i]+'회',335,92+i*16);
      ctx.fillStyle='rgba(212,137,74,.15)';ctx.fillRect(430,82+i*16,100,10);
      ctx.fillStyle=catColors[i];ctx.fillRect(430,82+i*16,Math.min(catCounts[i]*10,100),10);
    });
    ctx.fillStyle='#e8dcc8';ctx.font='11px Georgia';ctx.fillText('총 세션: '+totalSessions,335,170);

    ctx.fillStyle='rgba(232,220,200,.4)';ctx.font='10px Georgia';
    ctx.fillText(running?'■ 스페이스바로 정지':'▶ 시작하려면 탭하세요',180,320);
  }

  function startTimer(){
    if(running)return;running=true;timeLeft=durations[selDur].sec;
    v21Sfx('timer_tick');
    timerIv=setInterval(function(){
      timeLeft--;draw();
      if(timeLeft<=0){clearInterval(timerIv);running=false;
        v21Sfx('timer_done');
        sessions.push({cat:selCat,dur:durations[selDur].sec,ts:Date.now()});
        totalSessions=sessions.length;localStorage.setItem('v21_timer_sessions',JSON.stringify(sessions));
        if(totalSessions>=10)unlockAch('practice_timer_guru');
        addHistory('timer','연습 세션 완료: '+categories[selCat]+' '+durations[selDur].label);
        draw();
      }
    },1000);
  }
  function stopTimer(){if(!running)return;clearInterval(timerIv);running=false;draw();}

  var row1=document.createElement('div');row1.className='v21-tabs';
  categories.forEach(function(c,i){
    var b=document.createElement('button');b.className='v21-btn'+(i===0?' active':'');b.textContent=c;b.style.borderColor=catColors[i];
    b.onclick=function(){if(running)return;selCat=i;row1.querySelectorAll('.v21-btn').forEach(function(x,j){x.classList.toggle('active',j===i);});draw();};
    row1.appendChild(b);
  });
  panel.appendChild(row1);

  var row2=document.createElement('div');row2.className='v21-tabs';
  durations.forEach(function(d,i){
    var b=document.createElement('button');b.className='v21-btn'+(i===0?' active':'');b.textContent=d.label;
    b.onclick=function(){if(running)return;selDur=i;timeLeft=d.sec;row2.querySelectorAll('.v21-btn').forEach(function(x,j){if(j<4)x.classList.toggle('active',j===i);});draw();};
    row2.appendChild(b);
  });
  var startB=document.createElement('button');startB.className='v21-btn';startB.textContent='▶ 시작';startB.style.background='rgba(68,238,68,.2)';
  startB.onclick=startTimer;row2.appendChild(startB);
  var stopB=document.createElement('button');stopB.className='v21-btn';stopB.textContent='■ 정지';stopB.style.background='rgba(255,100,68,.2)';
  stopB.onclick=stopTimer;row2.appendChild(stopB);
  var resetB=document.createElement('button');resetB.className='v21-btn';resetB.textContent='\u{1F504}';
  resetB.onclick=function(){stopTimer();timeLeft=durations[selDur].sec;draw();};row2.appendChild(resetB);
  panel.appendChild(row2);draw();
}

/* ===== 7. MUSIC THEORY CHORD BUILDER Canvas 620x380 ===== */
function createChordPanel(){
  var panel=makePanel('chordPanel','\u{1F3B6} 음악 이론 코드 빌더');
  var cv=mkCv(620,380);
  var wrap=document.createElement('div');wrap.className='v21-cv-wrap';wrap.appendChild(cv);
  panel.appendChild(wrap);

  var chords=[
    {name:'Major',formula:'1-3-5',intervals:[0,4,7],desc:'Root + M3 + P5. 밝고 안정적.',ex:'C-E-G',dStop:'A현+E현 3도'},
    {name:'Minor',formula:'1-b3-5',intervals:[0,3,7],desc:'Root + m3 + P5. 슬프고 부드러운.',ex:'A-C-E',dStop:'D현+A현 3도'},
    {name:'Diminished',formula:'1-b3-b5',intervals:[0,3,6],desc:'Root + m3 + dim5. 긴장과 불안.',ex:'B-D-F',dStop:'A현+E현 감음'},
    {name:'Augmented',formula:'1-3-#5',intervals:[0,4,8],desc:'Root + M3 + aug5. 확장과 긴장.',ex:'C-E-G#',dStop:'D현+A현 증음'},
    {name:'Dom 7th',formula:'1-3-5-b7',intervals:[0,4,7,10],desc:'Major + m7. 해결로 끌리는 음.',ex:'G-B-D-F',dStop:'G현+D현 7도'},
    {name:'Maj 7th',formula:'1-3-5-7',intervals:[0,4,7,11],desc:'Major + M7. 저즈적 포근함.',ex:'C-E-G-B',dStop:'A현+E현 7도'},
    {name:'Min 7th',formula:'1-b3-5-b7',intervals:[0,3,7,10],desc:'Minor + m7. 평온하고 부드러운.',ex:'D-F-A-C',dStop:'D현+A현 7도'},
    {name:'Sus4',formula:'1-4-5',intervals:[0,5,7],desc:'3도 대신 4도. 잠시 멈춤 느낌.',ex:'C-F-G',dStop:'A현+E현 4도'}
  ];
  var selChord=0,learnedChords=JSON.parse(localStorage.getItem('v21_chords')||'[]');

  var noteNames=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var rootIdx=0;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,380);
    ctx.fillStyle='#1a1612';ctx.fillRect(0,0,620,380);
    ctx.fillStyle='#ffd700';ctx.font='bold 13px Georgia';ctx.fillText('Music Theory - Chord Builder',190,22);

    var ch=chords[selChord];
    ctx.fillStyle='rgba(26,22,18,.85)';ctx.fillRect(20,40,280,100);
    ctx.strokeStyle='rgba(212,137,74,.3)';ctx.strokeRect(20,40,280,100);
    ctx.fillStyle='#ffd700';ctx.font='bold 16px Georgia';ctx.fillText(noteNames[rootIdx]+' '+ch.name,35,65);
    ctx.fillStyle='#e8dcc8';ctx.font='12px Georgia';ctx.fillText('Formula: '+ch.formula,35,85);
    ctx.fillText('Example: '+ch.ex,35,102);
    ctx.fillStyle='rgba(212,137,74,.7)';ctx.font='11px Georgia';ctx.fillText('Double Stop: '+ch.dStop,35,120);

    var words=ch.desc.split(' ');var line='',ly=132;
    ctx.fillStyle='rgba(232,220,200,.5)';ctx.font='10px Georgia';

    for(var i=0;i<12;i++){
      var x=30+i*48,isInChord=ch.intervals.indexOf(i)!==-1;
      ctx.fillStyle=isInChord?'rgba(255,215,0,.2)':'rgba(212,137,74,.06)';
      ctx.fillRect(x,165,42,35);
      ctx.strokeStyle=isInChord?'#ffd700':'rgba(212,137,74,.15)';ctx.lineWidth=isInChord?2:1;ctx.strokeRect(x,165,42,35);
      ctx.fillStyle=isInChord?'#ffd700':'rgba(232,220,200,.4)';ctx.font=(isInChord?'bold ':'')+'11px Georgia';ctx.textAlign='center';
      ctx.fillText(noteNames[(rootIdx+i)%12],x+21,187);ctx.textAlign='left';
      if(isInChord){
        ctx.fillStyle='rgba(255,215,0,.6)';ctx.font='9px Georgia';ctx.textAlign='center';
        var deg=ch.intervals.indexOf(i);
        ctx.fillText(['R','b3/3','4/#5/5','b7/7'][deg]||'',x+21,210);ctx.textAlign='left';
      }
    }

    var staveY=240;
    ctx.strokeStyle='rgba(212,137,74,.3)';ctx.lineWidth=1;
    for(var s=0;s<5;s++){ctx.beginPath();ctx.moveTo(40,staveY+s*12);ctx.lineTo(580,staveY+s*12);ctx.stroke();}

    var notePositions=[0,0,1,1,2,3,3,4,4,5,5,6];
    var noteAccidentals=[0,1,0,1,0,0,1,0,1,0,1,0];
    ch.intervals.forEach(function(iv,ni){
      var noteIdx=(rootIdx+iv)%12;
      var pos=notePositions[noteIdx];
      var ny=staveY+48-pos*6;
      var nx=120+ni*130;

      if(ny>staveY+48||ny<staveY-12){
        ctx.strokeStyle='rgba(212,137,74,.3)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(nx-15,ny);ctx.lineTo(nx+15,ny);ctx.stroke();
      }

      ctx.beginPath();ctx.ellipse(nx,ny,8,6,-.2,0,Math.PI*2);
      ctx.fillStyle='#ffd700';ctx.fill();
      if(noteAccidentals[noteIdx]){
        ctx.fillStyle='#ff9944';ctx.font='14px Georgia';ctx.fillText('#',nx-20,ny+5);
      }
      ctx.fillStyle='#e8dcc8';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(noteNames[noteIdx],nx,ny+22);ctx.textAlign='left';
    });

    ctx.fillStyle='rgba(232,220,200,.4)';ctx.font='10px Georgia';
    ctx.fillText('학습한 코드: '+learnedChords.length+'/8',40,365);
  }

  function playChord(){
    try{
      if(!actx21)actx21=new(window.AudioContext||window.webkitAudioContext)();
      var ch=chords[selChord];var base=261.63*Math.pow(2,rootIdx/12);
      ch.intervals.forEach(function(iv,i){
        var osc=actx21.createOscillator();var g=actx21.createGain();
        osc.type='sine';osc.frequency.value=base*Math.pow(2,iv/12);
        g.gain.setValueAtTime(0.12,actx21.currentTime+i*0.1);
        g.gain.exponentialRampToValueAtTime(0.001,actx21.currentTime+i*0.1+0.8);
        osc.connect(g);g.connect(actx21.destination);
        osc.start(actx21.currentTime+i*0.1);osc.stop(actx21.currentTime+i*0.1+0.85);
      });
    }catch(e){}
  }

  var row1=document.createElement('div');row1.className='v21-tabs';
  chords.forEach(function(c,i){
    var b=document.createElement('button');b.className='v21-btn'+(i===0?' active':'');b.textContent=c.name;
    b.onclick=function(){selChord=i;row1.querySelectorAll('.v21-btn').forEach(function(x,j){if(j<8)x.classList.toggle('active',j===i);});
      if(learnedChords.indexOf(i)===-1){learnedChords.push(i);localStorage.setItem('v21_chords',JSON.stringify(learnedChords));}
      if(learnedChords.length>=8)unlockAch('chord_builder');
      v21Sfx('chord_strum');draw();
    };row1.appendChild(b);
  });
  panel.appendChild(row1);

  var row2=document.createElement('div');row2.className='v21-tabs';
  var rootBtn=document.createElement('button');rootBtn.className='v21-btn';rootBtn.textContent='Root: C';
  rootBtn.onclick=function(){rootIdx=(rootIdx+1)%12;rootBtn.textContent='Root: '+noteNames[rootIdx];draw();};
  row2.appendChild(rootBtn);
  var playB=document.createElement('button');playB.className='v21-btn';playB.textContent='\u{1F50A} 코드 재생';playB.style.background='rgba(68,238,68,.2)';
  playB.onclick=playChord;row2.appendChild(playB);
  panel.appendChild(row2);draw();
}

/* ===== 8. PERFORMANCE ANXIETY MANAGER Canvas 580x360 ===== */
function createAnxietyPanel(){
  var panel=makePanel('anxietyPanel','\u{1F9D8} 공연 불안 관리기');
  var cv=mkCv(580,360);
  var wrap=document.createElement('div');wrap.className='v21-cv-wrap';wrap.appendChild(cv);
  panel.appendChild(wrap);

  var strategies=[
    {name:'호흡 조절',desc:'4-7-8 호흡법: 4초 흡입 → 7초 유지 → 8초 배출',level:0,max:10,icon:'\u{1F32C}'},
    {name:'시각화',desc:'성공적인 공연 장면을 상상하며 자신감 고취',level:0,max:10,icon:'\u{1F3AF}'},
    {name:'점진적 이완',desc:'발끝부터 머리까지 근육 그룹별 긴장/이완',level:0,max:10,icon:'\u{1F4AA}'},
    {name:'긍정적 자기대화',desc:'부정적 생각을 긍정적 확언으로 교체',level:0,max:10,icon:'✨'},
    {name:'루틴 설정',desc:'공연 전 일정한 준비 루틴으로 안정감 확보',level:0,max:10,icon:'\u{1F4CB}'},
    {name:'마음챙김',desc:'현재 순간에 집중. 과거/미래 걱정 놓아보기',level:0,max:10,icon:'\u{1F9D8}'},
    {name:'철저한 준비',desc:'압보 숙지, 연습 반복으로 자신감 구축',level:0,max:10,icon:'\u{1F4DA}'},
    {name:'수용',desc:'불안은 자연스러운 것. 에너지로 전환하는 연습',level:0,max:10,icon:'\u{1F49A}'}
  ];
  try{var saved=JSON.parse(localStorage.getItem('v21_anxiety'));if(saved)strategies.forEach(function(s,i){s.level=saved[i]||0;});}catch(e){}

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,580,360);
    ctx.fillStyle='#1a1612';ctx.fillRect(0,0,580,360);
    ctx.fillStyle='#ffd700';ctx.font='bold 13px Georgia';ctx.fillText('Performance Anxiety Manager',170,22);

    var cx=290,cy=185,r=120;
    var n=8;
    strategies.forEach(function(s,i){
      var angle=-Math.PI/2+i*(Math.PI*2/n);
      var pct=s.level/s.max;
      var px=cx+Math.cos(angle)*r*pct,py=cy+Math.sin(angle)*r*pct;
      var lx=cx+Math.cos(angle)*r,ly=cy+Math.sin(angle)*r;

      ctx.strokeStyle='rgba(212,137,74,.15)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(lx,ly);ctx.stroke();

      for(var lv=0.25;lv<=1;lv+=0.25){
        var rx=cx+Math.cos(angle)*r*lv,ry=cy+Math.sin(angle)*r*lv;
        var nextAngle=-Math.PI/2+((i+1)%n)*(Math.PI*2/n);
        var rnx=cx+Math.cos(nextAngle)*r*lv,rny=cy+Math.sin(nextAngle)*r*lv;
        ctx.strokeStyle='rgba(212,137,74,.08)';ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rnx,rny);ctx.stroke();
      }

      ctx.beginPath();ctx.arc(px,py,6,0,Math.PI*2);
      ctx.fillStyle=pct>=0.8?'#44ee44':pct>=0.5?'#ffd700':pct>=0.3?'#ff9944':'#ff6644';ctx.fill();

      var tx=cx+Math.cos(angle)*(r+20),ty=cy+Math.sin(angle)*(r+20);
      ctx.fillStyle='rgba(232,220,200,.7)';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(s.icon+' '+s.name,tx,ty);ctx.textAlign='left';
    });

    ctx.strokeStyle='rgba(68,238,68,.3)';ctx.lineWidth=2;ctx.beginPath();
    strategies.forEach(function(s,i){
      var angle=-Math.PI/2+i*(Math.PI*2/n);
      var px=cx+Math.cos(angle)*r*(s.level/s.max);
      var py=cy+Math.sin(angle)*r*(s.level/s.max);
      if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    });ctx.closePath();ctx.stroke();
    ctx.fillStyle='rgba(68,238,68,.08)';ctx.fill();

    var total=0;strategies.forEach(function(s){total+=s.level;});
    var avg=Math.round(total/80*100);var gr=gradeFor(avg);
    ctx.fillStyle=gr.c==='s'?'#ffd700':gr.c==='a'?'#44ee44':'rgba(232,220,200,.7)';
    ctx.font='bold 18px Georgia';ctx.textAlign='center';ctx.fillText(gr.g+' ('+avg+'%)',cx,cy+5);ctx.textAlign='left';
    ctx.fillStyle='rgba(232,220,200,.4)';ctx.font='10px Georgia';ctx.fillText('각 전략을 클릭하여 연습하세요',180,345);
  }

  var tabs=document.createElement('div');tabs.className='v21-tabs';
  strategies.forEach(function(s,i){
    var b=document.createElement('button');b.className='v21-btn';b.textContent=s.icon+' '+s.name;b.style.fontSize='10px';
    b.onclick=function(){
      if(s.level<s.max)s.level++;
      var levels=strategies.map(function(x){return x.level;});
      localStorage.setItem('v21_anxiety',JSON.stringify(levels));
      v21Sfx('anxiety_breathe');
      var allDone=strategies.every(function(x){return x.level>=1;});
      if(allDone)unlockAch('anxiety_manager');
      addHistory('anxiety',s.name+' 연습 Lv.'+s.level);
      draw();
    };tabs.appendChild(b);
  });
  var resetBtn=document.createElement('button');resetBtn.className='v21-btn';resetBtn.textContent='\u{1F504} 초기화';
  resetBtn.onclick=function(){strategies.forEach(function(s){s.level=0;});localStorage.removeItem('v21_anxiety');draw();};
  tabs.appendChild(resetBtn);
  panel.appendChild(tabs);draw();
}

/* ===== QUIZ V21 PANEL ===== */
function createQuizV21Panel(){
  var panel=makePanel('quizV21Panel','\u{1F9E0} Quiz v21');
  var qIdx=0,score=0;
  var content=document.createElement('div');content.id='quizV21Content';
  panel.appendChild(content);

  function showQ(){
    if(qIdx>=V21_QUIZ.length){
      var pct=Math.round(score/V21_QUIZ.length*100);
      content.innerHTML='<div class="v21-grade '+gradeFor(pct).c+'">'+gradeFor(pct).g+' ('+pct+'%)</div><div class="v21-info">'+score+'/'+V21_QUIZ.length+' 정답</div>';
      if(pct===100)unlockAch('quiz_v21_master');
      addHistory('quiz','Quiz v21: '+pct+'%');
      var retry=document.createElement('button');retry.className='v21-btn';retry.textContent='\u{1F504} 다시 풀기';
      retry.onclick=function(){qIdx=0;score=0;showQ();};content.appendChild(retry);
      return;
    }
    var q=V21_QUIZ[qIdx];
    var html='<div class="v21-info" style="font-size:13px;color:#ffd700;margin:15px 0;">'+(qIdx+1)+'/'+V21_QUIZ.length+': '+q.q+'</div>';
    html+='<div class="v21-tabs">';
    q.a.forEach(function(a,i){html+='<button class="v21-btn v21-quiz-ans" data-i="'+i+'" style="display:block;width:90%;margin:4px auto;">'+a+'</button>';});
    html+='</div>';
    content.innerHTML=html;
    content.querySelectorAll('.v21-quiz-ans').forEach(function(b){
      b.onclick=function(){
        var chosen=parseInt(b.dataset.i);
        if(chosen===q.c){score++;v21Sfx('quiz_v21');}else{v21Sfx('quiz_wrong_v21');}
        qIdx++;showQ();
      };
    });
  }

  panel.addEventListener('click',function(e){if(e.target.classList.contains('v21Close')){qIdx=0;score=0;}});
  var obs=new MutationObserver(function(){if(panel.classList.contains('show')&&qIdx===0){showQ();}});
  obs.observe(panel,{attributes:true,attributeFilter:['class']});
}

/* ===== REGISTER SONGS/LESSONS ===== */
if(window.SONG_DB&&Array.isArray(window.SONG_DB)){V21_SONGS.forEach(function(s){window.SONG_DB.push(s);});}
if(window.LESSON_DB&&Array.isArray(window.LESSON_DB)){V21_LESSONS.forEach(function(l){window.LESSON_DB.push(l);});}

/* ===== NAVIGATION (append to existing nav - NO new bottom bar) ===== */
function addV21Nav(){
  var features=[
    {id:'bowSpeedPanel',label:'\u{1F3BB}보잉속도'},
    {id:'dynamicPanel',label:'\u{1F4CA}다이내믹'},
    {id:'intervalPanel',label:'\u{1F442}청음'},
    {id:'crossingPanel',label:'\u{1F3BB}현이동'},
    {id:'toneColorPanel',label:'\u{1F3A8}톤컬러'},
    {id:'timerPanel',label:'⏱타이머'},
    {id:'chordPanel',label:'\u{1F3B6}코드'},
    {id:'anxietyPanel',label:'\u{1F9D8}불안관리'},
    {id:'quizV21Panel',label:'\u{1F9E0}Quiz21'}
  ];

  var navTarget=document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){
    var allBtns=document.querySelectorAll('button');
    for(var i=allBtns.length-1;i>=0;i--){
      if(allBtns[i].parentNode&&allBtns[i].parentNode!==document.body){navTarget=allBtns[i].parentNode;break;}
    }
  }
  if(!navTarget)navTarget=document.body;

  var wrap=document.createElement('div');
  wrap.style.cssText='display:flex;gap:2px;flex-wrap:wrap;padding:2px;justify-content:center;';

  features.forEach(function(f){
    var btn=document.createElement('button');
    btn.style.cssText='background:linear-gradient(135deg,#8B5E3C,#5a3520);color:#fff;border:none;border-radius:6px;padding:4px 7px;font-size:11px;cursor:pointer;white-space:nowrap;touch-action:manipulation;';
    btn.textContent=f.label;
    btn.onclick=function(){
      var p=document.getElementById(f.id);if(p)p.classList.add('show');
      v21Sfx('bow_speed');
      var used=JSON.parse(localStorage.getItem('v21_used')||'[]');
      if(used.indexOf(f.id)===-1){used.push(f.id);localStorage.setItem('v21_used',JSON.stringify(used));}
      if(used.length>=4)unlockAch('v21_explorer');
      if(used.length>=9)unlockAch('v21_complete');
    };
    wrap.appendChild(btn);
  });

  navTarget.appendChild(wrap);
}

/* ===== KEYBOARD SHORTCUTS (Shift+A~H, Shift+0 for Quiz) ===== */
document.addEventListener('keydown',function(e){
  if(!e.shiftKey)return;
  var panels=['bowSpeedPanel','dynamicPanel','intervalPanel','crossingPanel','toneColorPanel','timerPanel','chordPanel','anxietyPanel','quizV21Panel'];
  var map={KeyA:0,KeyB:1,KeyC:2,KeyD:3,KeyE:4,KeyF:5,KeyG:6,KeyH:7,Digit9:8};
  if(map[e.code]!==undefined){
    e.preventDefault();
    var p=document.getElementById(panels[map[e.code]]);if(p)p.classList.add('show');
  }
});

/* ===== ACHIEVEMENT REGISTRATION ===== */
if(window.ACH_DB&&Array.isArray(window.ACH_DB)){V21_ACHS.forEach(function(a){window.ACH_DB.push(a);});}

/* ===== INIT ===== */
function initV21(){
  createBowSpeedPanel();
  createDynamicPanel();
  createIntervalPanel();
  createCrossingPanel();
  createToneColorPanel();
  createTimerPanel();
  createChordPanel();
  createAnxietyPanel();
  createQuizV21Panel();
  addV21Nav();
  saveProgress({v21_loaded:1});
  unlockAch('song_184');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initV21);}
else{initV21();}

})();
