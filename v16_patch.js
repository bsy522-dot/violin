/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v16.0 PATCH MODULE
   보잉패턴생성기Canvas560x300(12패턴)+음악감성표현분석기Canvas480x400(6축Radar)+
   바이올린공방시뮬레이터Canvas560x340(8수리)+연습효율최적화기Canvas560x280(주간차트)+
   선율변주작곡기Canvas540x300(6변주)+공연녹화분석기Canvas600x380(6항목)+
   현악4중주파트배정기Canvas520x320(4파트)+음악사인물퀴즈Canvas480x280(20인물)+
   10곡추가(124→134)+10레슨(150→160)+15퀴즈(90→105)+
   12업적(130→142)+SFX12종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V16Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V16_LOADED)return;window.__V16_LOADED=true;

/* ─── HELPERS ─── */
function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(p){var old=loadProgress();Object.assign(old,p);localStorage.setItem('violinProgress',JSON.stringify(old));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function unlockAch(id){
  var achs=loadAchievements();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  var info=V16_ACHS.find(function(a){return a.id===id;});
  if(!info)return;
  if(typeof window.showAchToast==='function')window.showAchToast(id);
  else{var t=document.getElementById('achToast');if(t){
    t.querySelector('.at').textContent=info.icon+' '+info.name;t.querySelector('.as').textContent=info.desc;
    t.classList.add('show');setTimeout(function(){t.classList.remove('show');},3000);}}
}
function addHistory(type,text){
  try{var h=JSON.parse(localStorage.getItem('violinV10_history')||'[]');
  h.push({type:type,text:text,date:new Date().toLocaleString('ko-KR')});
  if(h.length>60)h=h.slice(-60);
  localStorage.setItem('violinV10_history',JSON.stringify(h));}catch(e){}
}

/* ─── 1. SFX ENGINE (12 types) ─── */
var actx16=null;
function v16Sfx(type){
  try{
    if(!actx16)actx16=new(window.AudioContext||window.webkitAudioContext)();
    var o=actx16.createOscillator(),g=actx16.createGain();
    o.connect(g);g.connect(actx16.destination);
    var now=actx16.currentTime;
    var presets={
      bow_pattern:{f:523,w:'triangle',a:.1,d:.35},
      expression:{f:659,w:'sine',a:.12,d:.4},
      luthier_tap:{f:294,w:'square',a:.06,d:.2},
      efficiency:{f:440,w:'sine',a:.08,d:.3},
      variation_play:{f:784,w:'sine',a:.12,d:.5},
      perf_record:{f:587,w:'triangle',a:.1,d:.35},
      quartet_assign:{f:698,w:'sine',a:.1,d:.4},
      history_correct:{f:880,w:'triangle',a:.14,d:.35},
      history_wrong:{f:196,w:'square',a:.05,d:.25},
      quiz_v16:{f:740,w:'square',a:.06,d:.2},
      achieve_v16:{f:932,w:'triangle',a:.14,d:.6},
      feature_open16:{f:622,w:'triangle',a:.09,d:.25}
    };
    var p=presets[type]||presets.feature_open16;
    o.type=p.w;o.frequency.setValueAtTime(p.f,now);
    g.gain.setValueAtTime(p.a,now);g.gain.exponentialRampToValueAtTime(.001,now+p.d);
    o.start(now);o.stop(now+p.d);
  }catch(e){}
}

/* ─── 2. DATA: SONGS, LESSONS, QUIZ, ACHIEVEMENTS ─── */
var V16_SONGS=[
  {id:'s125',title:'파가니니 카프리스 No.24',diff:5,genre:'로맨틱'},
  {id:'s126',title:'비탈리 샤콘느',diff:5,genre:'바로크'},
  {id:'s127',title:'사라사테 치고이너바이젠 전곡',diff:5,genre:'로맨틱'},
  {id:'s128',title:'바흐 무반주 소나타 1번',diff:5,genre:'바로크'},
  {id:'s129',title:'멘델스존 협주곡 1악장',diff:5,genre:'로맨틱'},
  {id:'s130',title:'시벨리우스 협주곡',diff:5,genre:'낭만주의'},
  {id:'s131',title:'차이코프스키 세레나데',diff:4,genre:'로맨틱'},
  {id:'s132',title:'엘가 사랑의 인사 전곡',diff:3,genre:'로맨틱'},
  {id:'s133',title:'크라이슬러 사랑의 기쁨',diff:3,genre:'로맨틱'},
  {id:'s134',title:'바르톡 루마니안 무곡',diff:4,genre:'민속'}
];
var V16_LESSONS=[
  {id:'l151',title:'고급 트릴 기법',desc:'빠른 트릴과 트릴 종류 연습'},
  {id:'l152',title:'하모닉스 응용',desc:'자연/인공 하모닉스 고급 활용'},
  {id:'l153',title:'포지션 7-9단',desc:'고음역 포지션 전환 마스터'},
  {id:'l154',title:'더블스톱 6도',desc:'6도 병진행 연습법'},
  {id:'l155',title:'왼손 피치카토',desc:'왼손으로 현을 튀기는 기법'},
  {id:'l156',title:'슈피겠 보잉',desc:'거울처럼 대칭되는 활 움직임'},
  {id:'l157',title:'카프리스 도입부',desc:'파가니니 카프리스 시작하기'},
  {id:'l158',title:'바흐 레가토',desc:'바흐 작품의 긴 활 연결 기법'},
  {id:'l159',title:'오케스트라 튜닝',desc:'A=440~442 오케스트라 조율 맞추기'},
  {id:'l160',title:'v16 졸업',desc:'v16 모든 과정 완료 인증'}
];
var V16_QUIZ=[
  {q:'파가니니의 국적은?',a:['이탈리아','독일','프랑스','오스트리아'],c:0},
  {q:'하이페츠가 데뷔한 나이는?',a:['7세','5세','10세','12세'],c:0},
  {q:'오이스트라흐가 수상한 대회는?',a:['엘리자베스 콩쿠르','파가니니 콩쿠르','차이코프스키 콩쿠르','비엔나필 콩쿠르'],c:0},
  {q:'펄만이 연주하는 악기의 이름은?',a:['스트라디바리우스 (그른 델 제수)','과르네리','스트라디바리우스 (아마티)','돈키호테'],c:0},
  {q:'정경화가 수상한 콩쿠르는?',a:['레벨티엔 콩쿠르','파가니니 콩쿠르','엘리자베스 콩쿠르','차이코프스키 콩쿠르'],c:0},
  {q:'사라사테의 대표작은?',a:['치고이너바이젠','사계','사랑의 인사','카논'],c:0},
  {q:'크라이슬러의 활동 시대는?',a:['19세기 말~20세기 초','바로크 시대','18세기','21세기'],c:0},
  {q:'바흐 무반주 소나타와 파르티타 총 곡수는?',a:['6곡','4곡','8곡','3곡'],c:0},
  {q:'멘델스존 바이올린 협주곡의 조성은?',a:['E단조','D장조','G단조','A장조'],c:0},
  {q:'시벨리우스 바이올린 협주곡은 몇 악장인가?',a:['3악장','4악장','2악장','1악장'],c:0},
  {q:'차이코프스키 세레나데의 작품번호는?',a:['Op.48','Op.35','Op.64','Op.72'],c:0},
  {q:'엘가의 &lsquo;사랑의 인사&rsquo; 작품번호는?',a:['Op.12','Op.9','Op.36','Op.49'],c:0},
  {q:'비탈리 샤콘느의 조성은?',a:['G단조','D단조','A단조','E단조'],c:0},
  {q:'쉘르라투쉘(Sul ponticello 반대)란?',a:['지판 쪽에서 연주','브릿지 쪽에서 연주','활 뒤집어 연주','활 들어올리기'],c:0},
  {q:'고급 하모닉스에서 손가락을 가볍게 대는 것은?',a:['자연 하모닉스','인공 하모닉스','플래진레','피치카토'],c:0}
];
var V16_ACHS=[
  {id:'bow_pattern_pro',icon:'🎵',name:'보잉 패턴 마스터',desc:'12가지 보잉 패턴 모두 연습'},
  {id:'expression_master',icon:'🎨',name:'감성 표현 마스터',desc:'감성 분석 S등급 획득'},
  {id:'luthier_apprentice',icon:'🛠️',name:'공방 견습생',desc:'8가지 수리 모두 완료'},
  {id:'efficiency_guru',icon:'📊',name:'효율 마스터',desc:'7일 연속 연습 기록'},
  {id:'variation_composer',icon:'🎼',name:'변주 작곡가',desc:'6가지 변주 모두 생성'},
  {id:'perf_analyst',icon:'📹',name:'공연 분석가',desc:'공연 분석 3회 완료'},
  {id:'quartet_leader',icon:'🎻',name:'쿠심테트 리더',desc:'파트 배정 5회 완료'},
  {id:'history_10',icon:'📚',name:'음악사 입문',desc:'음악사 퀴즈 10문제 정답'},
  {id:'history_20',icon:'🏆',name:'음악사 박사',desc:'음악사 퀴즈 20문제 정답'},
  {id:'practice_200hr',icon:'⌛',name:'200시간 연습',desc:'누적 연습시간 200시간 돌파'},
  {id:'songs_130',icon:'🎶',name:'130곡 마스터',desc:'130곡 이상 연주 완료'},
  {id:'v16_explorer',icon:'🚀',name:'v16 탐험가',desc:'v16 모든 기능 사용'}
];

/* ─── 3. CSS INJECTION ─── */
var sty16=document.createElement('style');
sty16.textContent=`
#bowPatPanel,#exprPanel,#luthierPanel,#effPanel,#variPanel,#perfPanel,#quartetPanel,#histQuizPanel,#quizV16Panel{
  display:none;position:fixed;inset:0;z-index:240;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#bowPatPanel.show,#exprPanel.show,#luthierPanel.show,#effPanel.show,#variPanel.show,
#perfPanel.show,#quartetPanel.show,#histQuizPanel.show,#quizV16Panel.show{display:flex;}
#bowPatPanel h3,#exprPanel h3,#luthierPanel h3,#effPanel h3,#variPanel h3,
#perfPanel h3,#quartetPanel h3,#histQuizPanel h3,#quizV16Panel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#bowPatCanvas,#exprCanvas,#luthierCanvas,#effCanvas,#variCanvas,#perfCanvas,#quartetCanvas,#histQuizCanvas{
  border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.v16Info{width:100%;max-width:520px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;font-size:10px;color:rgba(240,230,200,.7);line-height:1.6;}
.v16Card{width:100%;max-width:480px;padding:10px 12px;margin:4px 0;
  background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.12);
  border-radius:8px;font-size:11px;color:rgba(240,230,200,.8);cursor:pointer;
  transition:background .2s,border-color .2s;}
.v16Card:hover{background:rgba(255,215,0,.08);border-color:rgba(255,215,0,.3);}
.v16Card.done{border-color:rgba(76,175,80,.4);background:rgba(76,175,80,.06);}
.v16Btn{display:inline-block;padding:6px 14px;margin:4px;border-radius:6px;
  background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.25);
  color:#ffd700;font-size:10px;cursor:pointer;transition:background .2s;}
.v16Btn:hover{background:rgba(255,215,0,.22);}
.v16Btn.active{background:rgba(255,215,0,.3);border-color:#ffd700;}
.v16Close{position:sticky;top:0;align-self:flex-end;font-size:18px;cursor:pointer;
  color:#888;z-index:10;padding:4px 8px;}
.v16Close:hover{color:#ffd700;}
.v16Nav{position:fixed;bottom:0;left:0;right:0;z-index:241;background:rgba(26,16,32,.95);
  border-top:1px solid rgba(255,215,0,.1);display:flex;overflow-x:auto;
  padding:6px 8px;gap:6px;-webkit-overflow-scrolling:touch;}
.v16NavBtn{flex:0 0 auto;padding:5px 10px;border-radius:12px;font-size:10px;
  background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.15);
  color:#c9a96e;white-space:nowrap;cursor:pointer;transition:all .2s;}
.v16NavBtn:hover,.v16NavBtn.active{background:rgba(255,215,0,.2);border-color:rgba(255,215,0,.4);color:#ffd700;}
.v16Grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:6px;width:100%;max-width:520px;}
.v16Progress{width:100%;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;margin:4px 0;}
.v16Progress .bar{height:100%;background:linear-gradient(90deg,#ffd700,#ff6644);border-radius:3px;transition:width .4s;}
.v16Badge{display:inline-block;padding:2px 6px;border-radius:4px;font-size:8px;font-weight:bold;margin-left:4px;}
.v16Badge.s{background:rgba(255,215,0,.2);color:#ffd700;}
.v16Badge.a{background:rgba(76,175,80,.2);color:#4caf50;}
.v16Badge.b{background:rgba(33,150,243,.2);color:#2196f3;}
.v16Badge.c{background:rgba(255,152,0,.2);color:#ff9800;}
.v16Badge.d{background:rgba(244,67,54,.2);color:#f44336;}
`;
document.head.appendChild(sty16);

/* ─── 4. BOWING PATTERN GENERATOR (보잉 패턴 생성기) ─── */
var BOW_PATTERNS=[
  {id:'legato',name:'레가토',desc:'부드럽게 연결',arrow:'long',color:'#4caf50'},
  {id:'staccato',name:'스타카토',desc:'짧게 끊어서',arrow:'short',color:'#f44336'},
  {id:'spiccato',name:'스피카토',desc:'활을 튕기며',arrow:'bounce',color:'#ff9800'},
  {id:'martele',name:'마르텔레',desc:'강하게 끊어서',arrow:'accent',color:'#9c27b0'},
  {id:'tremolo',name:'트레몰로',desc:'빠른 반복',arrow:'zigzag',color:'#2196f3'},
  {id:'ricochet',name:'리코셰',desc:'활 튕기며 여러 음',arrow:'multi',color:'#00bcd4'},
  {id:'col_legno',name:'콜레뉴',desc:'활대로 연주',arrow:'tap',color:'#795548'},
  {id:'sautille',name:'소티예',desc:'가벼운 튕김',arrow:'light',color:'#e91e63'},
  {id:'portato',name:'포르타토',desc:'부드럽게 분리',arrow:'soft',color:'#8bc34a'},
  {id:'detache',name:'데타셰',desc:'한 음씩 분리',arrow:'separate',color:'#607d8b'},
  {id:'flautato',name:'플라우타토',desc:'플루트 음색',arrow:'gentle',color:'#cddc39'},
  {id:'sur_la_touche',name:'쉘르라투쉘',desc:'지판 위에서',arrow:'over',color:'#ff5722'}
];
var bowPracticed={},bowTimer=null,bowTimerSec=0;

function createBowPatPanel(){
  var p=document.createElement('div');p.id='bowPatPanel';
  p.innerHTML='<div class="v16Close" onclick="document.getElementById(&quot;bowPatPanel&quot;).classList.remove(&quot;show&quot;)">&times;</div>'+
    '<h3>🎵 보잉 패턴 생성기</h3>'+
    '<canvas id="bowPatCanvas" width="560" height="300"></canvas>'+
    '<div class="v16Info" id="bowPatInfo">패턴을 선택하거나 랜덤 연습을 시작하세요</div>'+
    '<div id="bowPatBtns" style="display:flex;flex-wrap:wrap;gap:4px;max-width:560px;justify-content:center;margin:6px 0"></div>'+
    '<div style="display:flex;gap:8px;margin:6px 0">'+
    '<div class="v16Btn" onclick="bowRandomExercise()">🎲 랜덤 연습</div>'+
    '<div class="v16Btn" id="bowTimerBtn" onclick="toggleBowTimer()">⏱ 타이머 시작</div></div>'+
    '<div class="v16Info" id="bowTimerDisp" style="text-align:center;font-size:14px;color:#ffd700">00:00</div>';
  document.body.appendChild(p);
  var btns=document.getElementById('bowPatBtns');
  BOW_PATTERNS.forEach(function(bp){
    var b=document.createElement('div');b.className='v16Btn';
    b.textContent=bp.name;b.style.borderColor=bp.color;
    b.onclick=function(){selectBowPattern(bp);};
    btns.appendChild(b);
  });
}

function selectBowPattern(bp){
  bowPracticed[bp.id]=true;
  v16Sfx('bow_pattern');
  document.getElementById('bowPatInfo').textContent=bp.name+': '+bp.desc;
  drawBowPatCanvas(bp);
  if(Object.keys(bowPracticed).length>=12)unlockAch('bow_pattern_pro');
  addHistory('bow',bp.name+' 패턴 연습');
}

function bowRandomExercise(){
  var seq=[];for(var i=0;i<4;i++)seq.push(BOW_PATTERNS[Math.floor(Math.random()*12)]);
  v16Sfx('bow_pattern');
  document.getElementById('bowPatInfo').textContent='랜덤 조합: '+seq.map(function(s){return s.name;}).join(' → ');
  drawBowPatSeq(seq);
}

function drawBowPatCanvas(bp){
  var c=document.getElementById('bowPatCanvas');if(!c)return;
  var ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var staffY=60,gap=14;
  ctx.strokeStyle='rgba(255,215,0,.3)';ctx.lineWidth=1;
  for(var i=0;i<5;i++){ctx.beginPath();ctx.moveTo(40,staffY+i*gap);ctx.lineTo(W-20,staffY+i*gap);ctx.stroke();}
  ctx.fillStyle='#ffd700';ctx.font='bold 28px serif';ctx.fillText('𝄞',10,staffY+3*gap);
  ctx.fillStyle=bp.color;ctx.font='bold 16px sans-serif';
  ctx.fillText(bp.name,W/2-30,staffY+6*gap+20);
  ctx.font='12px sans-serif';ctx.fillStyle='rgba(240,230,200,.7)';
  ctx.fillText(bp.desc,W/2-40,staffY+6*gap+45);
  drawBowArrow(ctx,100,staffY+2*gap,W-60,bp);
}

function drawBowArrow(ctx,x,y,w,bp){
  ctx.strokeStyle=bp.color;ctx.lineWidth=3;ctx.beginPath();
  if(bp.arrow==='long'){ctx.moveTo(x,y);ctx.lineTo(x+w,y);}
  else if(bp.arrow==='short'){for(var i=0;i<6;i++){ctx.moveTo(x+i*(w/6),y);ctx.lineTo(x+i*(w/6)+w/9,y);}}
  else if(bp.arrow==='bounce'){for(var i=0;i<5;i++){var sx=x+i*(w/5);ctx.moveTo(sx,y);ctx.quadraticCurveTo(sx+w/10,y-20,sx+w/5,y);}}
  else if(bp.arrow==='zigzag'){ctx.moveTo(x,y);for(var i=0;i<8;i++){ctx.lineTo(x+(i+0.5)*(w/8),y+(i%2?12:-12));}}
  else if(bp.arrow==='multi'){for(var i=0;i<4;i++){ctx.moveTo(x+i*(w/4),y-5);ctx.lineTo(x+i*(w/4)+w/6,y+5);}}
  else{ctx.moveTo(x,y);ctx.lineTo(x+w*0.7,y);}
  ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w-10,y-5);ctx.lineTo(x+w-10,y+5);ctx.closePath();
  ctx.fillStyle=bp.color;ctx.fill();
}

function drawBowPatSeq(seq){
  var c=document.getElementById('bowPatCanvas');if(!c)return;
  var ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var staffY=50,gap=14;
  ctx.strokeStyle='rgba(255,215,0,.3)';ctx.lineWidth=1;
  for(var i=0;i<5;i++){ctx.beginPath();ctx.moveTo(40,staffY+i*gap);ctx.lineTo(W-20,staffY+i*gap);ctx.stroke();}
  seq.forEach(function(bp,idx){
    var segW=(W-80)/4,sx=50+idx*segW;
    ctx.fillStyle=bp.color;ctx.font='bold 11px sans-serif';
    ctx.fillText(bp.name,sx+segW/2-15,staffY+6*gap+10);
    drawBowArrow(ctx,sx,staffY+2*gap,segW-10,bp);
  });
}

function toggleBowTimer(){
  if(bowTimer){clearInterval(bowTimer);bowTimer=null;document.getElementById('bowTimerBtn').textContent='⏱ 타이머 시작';return;}
  bowTimerSec=0;
  document.getElementById('bowTimerBtn').textContent='⏹ 정지';
  bowTimer=setInterval(function(){
    bowTimerSec++;var m=Math.floor(bowTimerSec/60),s=bowTimerSec%60;
    document.getElementById('bowTimerDisp').textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
  },1000);
}

/* ─── 5. MUSICAL EXPRESSION ANALYZER (음악 감성 표현 분석기) ─── */
var EXPR_AXES=['다이내믹','비브라토','포르테피아노','아고깅','아티큘레이션','프레이징'];
var exprRound=0,exprScores=[],exprTotal=0;

function createExprPanel(){
  var p=document.createElement('div');p.id='exprPanel';
  p.innerHTML='<div class="v16Close" onclick="document.getElementById(&quot;exprPanel&quot;).classList.remove(&quot;show&quot;)">&times;</div>'+
    '<h3>🎨 음악 감성 표현 분석기</h3>'+
    '<canvas id="exprCanvas" width="480" height="400"></canvas>'+
    '<div class="v16Info" id="exprInfo">6축 레이더 분석: 10라운드 평가 후 등급 부여</div>'+
    '<div style="display:flex;gap:8px;margin:6px 0">'+
    '<div class="v16Btn" onclick="startExprEval()">▶ 평가 시작</div>'+
    '<div class="v16Btn" onclick="resetExpr()">↺ 초기화</div></div>'+
    '<div id="exprSliders" style="display:none;width:100%;max-width:400px;margin:6px 0"></div>'+
    '<div class="v16Btn" id="exprSubmitBtn" style="display:none" onclick="submitExprRound()">✔ 제출</div>';
  document.body.appendChild(p);
}

function startExprEval(){
  exprRound=0;exprScores=[];exprTotal=0;
  nextExprRound();
}
function resetExpr(){exprRound=0;exprScores=[];drawExprRadar([0,0,0,0,0,0]);document.getElementById('exprInfo').textContent='초기화됨';}

function nextExprRound(){
  if(exprRound>=10){finishExpr();return;}
  exprRound++;
  document.getElementById('exprInfo').textContent='라운드 '+exprRound+'/10 - 각 항목을 1~10점으로 평가하세요';
  var sl=document.getElementById('exprSliders');sl.style.display='block';
  sl.innerHTML='';
  EXPR_AXES.forEach(function(ax,i){
    sl.innerHTML+='<div style="margin:4px 0;font-size:10px;color:#c9a96e">'+ax+
      ': <input type="range" min="1" max="10" value="5" id="exprSl'+i+'" style="width:200px;vertical-align:middle">'+
      ' <span id="exprSlV'+i+'">5</span></div>';
  });
  for(var i=0;i<6;i++){(function(idx){
    var inp=document.getElementById('exprSl'+idx);
    inp.oninput=function(){document.getElementById('exprSlV'+idx).textContent=inp.value;};
  })(i);}
  document.getElementById('exprSubmitBtn').style.display='inline-block';
}

function submitExprRound(){
  var scores=[];
  for(var i=0;i<6;i++)scores.push(parseInt(document.getElementById('exprSl'+i).value));
  exprScores.push(scores);
  v16Sfx('expression');
  var avg=scores.map(function(s,i){return (exprScores.reduce(function(a,r){return a+r[i];},0))/exprScores.length;});
  drawExprRadar(avg);
  nextExprRound();
}

function finishExpr(){
  document.getElementById('exprSliders').style.display='none';
  document.getElementById('exprSubmitBtn').style.display='none';
  var avg=[];for(var i=0;i<6;i++){
    var sum=exprScores.reduce(function(a,r){return a+r[i];},0);avg.push(sum/10);
  }
  var total=avg.reduce(function(a,b){return a+b;},0)/6;
  var grade=total>=9?'S':total>=7.5?'A':total>=6?'B':total>=4?'C':'D';
  document.getElementById('exprInfo').innerHTML='최종 등급: <span class="v16Badge '+grade.toLowerCase()+'">'+grade+'</span> (평균 '+total.toFixed(1)+'/10)';
  drawExprRadar(avg);
  if(grade==='S')unlockAch('expression_master');
  addHistory('expr','감성분석 '+grade+'등급');
}

function drawExprRadar(vals){
  var c=document.getElementById('exprCanvas');if(!c)return;
  var ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var cx=W/2,cy=H/2+10,r=130;
  for(var lev=2;lev<=10;lev+=2){
    ctx.beginPath();ctx.strokeStyle='rgba(255,215,0,'+(lev===10?.3:.1)+')';
    for(var i=0;i<=6;i++){var ang=-Math.PI/2+i*(Math.PI*2/6);var rr=r*lev/10;
      i===0?ctx.moveTo(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang)):ctx.lineTo(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang));}
    ctx.stroke();
  }
  for(var i=0;i<6;i++){var ang=-Math.PI/2+i*(Math.PI*2/6);
    ctx.beginPath();ctx.strokeStyle='rgba(255,215,0,.15)';ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(ang),cy+r*Math.sin(ang));ctx.stroke();
    ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';
    var tx=cx+(r+18)*Math.cos(ang)-15,ty=cy+(r+18)*Math.sin(ang)+4;
    ctx.fillText(EXPR_AXES[i],tx,ty);
  }
  ctx.beginPath();ctx.fillStyle='rgba(255,215,0,.15)';ctx.strokeStyle='#ffd700';ctx.lineWidth=2;
  for(var i=0;i<=6;i++){var idx=i%6;var ang=-Math.PI/2+idx*(Math.PI*2/6);var rr=r*((vals[idx]||0)/10);
    i===0?ctx.moveTo(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang)):ctx.lineTo(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang));}
  ctx.closePath();ctx.fill();ctx.stroke();
}

/* ─── 6. LUTHIER WORKSHOP SIMULATOR (바이올린 공방 시뮬레이터) ─── */
var LUTHIER_TASKS=[
  {id:'string_replace',name:'현 교체',steps:['구현 제거','새 현 끼우기','페그 감기','튜닝'],tools:['페그와인더','줄감개','튜너']},
  {id:'bow_rehair',name:'활모 교체',steps:['구모 제거','새 말총 준비','말총 끼우기','로진 도포'],tools:['핸드툴','말총','로진']},
  {id:'string_wind',name:'줄 감기',steps:['페그에 끼우기','돌리기','테스트 튕기기','미세조정'],tools:['페그와인더','튜너']},
  {id:'fingerboard_dress',name:'지판 정리',steps:['현 제거','사포로 다듬기','표면 매끄럴게','현 재장착'],tools:['사포','오일','클리너']},
  {id:'soundpost_adj',name:'사운드포스트 조정',steps:['현 느슨하게','포스트 세터로 조정','소리 확인','고정'],tools:['포스트세터','라이트']},
  {id:'peg_adj',name:'페그 조정',steps:['페그 빼기','페그 컴파운드 도포','재삽입','밀림 확인'],tools:['페그컴파운드','사포']},
  {id:'varnish_repair',name:'니스 수리',steps:['손상 부위 확인','샌딩','니스 도포','건조'],tools:['샌드페이퍼','니스빗','라이트']},
  {id:'bridge_align',name:'브릿지 정렬',steps:['현 느슨하게','브릿지 위치 확인','각도 조정','현 재조임'],tools:['라이트','자','튜너']}
];
var luthierDone={},luthierCurTask=null,luthierStep=0;

function createLuthierPanel(){
  var p=document.createElement('div');p.id='luthierPanel';
  p.innerHTML='<div class="v16Close" onclick="document.getElementById(&quot;luthierPanel&quot;).classList.remove(&quot;show&quot;)">&times;</div>'+
    '<h3>🛠️ 바이올린 공방 시뮬레이터</h3>'+
    '<canvas id="luthierCanvas" width="560" height="340"></canvas>'+
    '<div class="v16Info" id="luthierInfo">수리 작업을 선택하세요</div>'+
    '<div id="luthierTasks" style="display:flex;flex-wrap:wrap;gap:4px;max-width:560px;justify-content:center;margin:6px 0"></div>'+
    '<div id="luthierAction" style="display:flex;gap:8px;margin:6px 0"></div>';
  document.body.appendChild(p);
  var tDiv=document.getElementById('luthierTasks');
  LUTHIER_TASKS.forEach(function(task){
    var b=document.createElement('div');b.className='v16Btn'+(luthierDone[task.id]?' done':'');
    b.textContent=task.name;b.onclick=function(){startLuthierTask(task);};
    tDiv.appendChild(b);
  });
}

function startLuthierTask(task){
  luthierCurTask=task;luthierStep=0;
  v16Sfx('luthier_tap');
  drawLuthierCanvas();
  document.getElementById('luthierInfo').textContent=task.name+' - 단계 1/'+task.steps.length+': '+task.steps[0]+' (도구: '+task.tools.join(', ')+')';
  var actDiv=document.getElementById('luthierAction');
  actDiv.innerHTML='<div class="v16Btn" onclick="advanceLuthier()">✔ 다음 단계</div>';
}

function advanceLuthier(){
  if(!luthierCurTask)return;
  luthierStep++;
  if(luthierStep>=luthierCurTask.steps.length){
    luthierDone[luthierCurTask.id]=true;
    v16Sfx('achieve_v16');
    document.getElementById('luthierInfo').textContent=luthierCurTask.name+' 완료!';
    document.getElementById('luthierAction').innerHTML='';
    drawLuthierCanvas();
    if(Object.keys(luthierDone).length>=8)unlockAch('luthier_apprentice');
    addHistory('luthier',luthierCurTask.name+' 수리 완료');
    luthierCurTask=null;
  }else{
    v16Sfx('luthier_tap');
    document.getElementById('luthierInfo').textContent=luthierCurTask.name+' - 단계 '+(luthierStep+1)+'/'+luthierCurTask.steps.length+': '+luthierCurTask.steps[luthierStep];
    drawLuthierCanvas();
  }
}

function drawLuthierCanvas(){
  var c=document.getElementById('luthierCanvas');if(!c)return;
  var ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,215,0,.2)';ctx.lineWidth=2;
  ctx.beginPath();ctx.ellipse(W/2,H/2-20,60,100,0,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.ellipse(W/2,H/2-20,35,55,0,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(200,150,50,.4)';
  ctx.beginPath();ctx.moveTo(W/2,H/2-120);ctx.lineTo(W/2,H/2+80);ctx.stroke();
  for(var i=0;i<4;i++){ctx.beginPath();ctx.moveTo(W/2-15+i*10,H/2-110);ctx.lineTo(W/2-15+i*10,H/2+75);ctx.stroke();}
  ctx.fillStyle='#c9a96e';ctx.font='11px sans-serif';
  LUTHIER_TASKS.forEach(function(t,i){
    var x=20+(i%4)*140,y=H-60+Math.floor(i/4)*22;
    ctx.fillStyle=luthierDone[t.id]?'#4caf50':'#c9a96e';
    ctx.fillText((luthierDone[t.id]?'✓ ':'○ ')+t.name,x,y);
  });
  if(luthierCurTask){
    ctx.fillStyle='#ffd700';ctx.font='bold 12px sans-serif';
    ctx.fillText('현재: '+luthierCurTask.name+' (단계 '+(luthierStep+1)+'/'+luthierCurTask.steps.length+')',20,24);
    var pct=(luthierStep)/luthierCurTask.steps.length;
    ctx.fillStyle='rgba(255,215,0,.2)';ctx.fillRect(20,30,200,8);
    ctx.fillStyle='#ffd700';ctx.fillRect(20,30,200*pct,8);
  }
}

/* ─── 7. PRACTICE EFFICIENCY OPTIMIZER (연습 효율 최적화기) ─── */
var EFF_CATS=['음계','에튀드','곡연습','초견','이론'];
var effData=null;

function loadEffData(){
  try{effData=JSON.parse(localStorage.getItem('violinV16_eff')||'null');}catch(e){}
  if(!effData){effData={days:[]};for(var i=0;i<7;i++)effData.days.push([0,0,0,0,0]);}
}

function saveEffData(){localStorage.setItem('violinV16_eff',JSON.stringify(effData));}

function createEffPanel(){
  loadEffData();
  var p=document.createElement('div');p.id='effPanel';
  p.innerHTML='<div class="v16Close" onclick="document.getElementById(&quot;effPanel&quot;).classList.remove(&quot;show&quot;)">&times;</div>'+
    '<h3>📊 연습 효율 최적화기</h3>'+
    '<canvas id="effCanvas" width="560" height="280"></canvas>'+
    '<div class="v16Info" id="effInfo">오늘의 연습 시간을 기록하세요 (분 단위)</div>'+
    '<div id="effInputs" style="display:flex;flex-wrap:wrap;gap:6px;max-width:500px;justify-content:center;margin:6px 0"></div>'+
    '<div class="v16Btn" onclick="saveEffToday()">💾 오늘 저장</div>'+
    '<div class="v16Info" id="effSuggest" style="color:#ffd700"></div>';
  document.body.appendChild(p);
  var inp=document.getElementById('effInputs');
  EFF_CATS.forEach(function(cat,i){
    inp.innerHTML+='<label style="font-size:10px;color:#c9a96e">'+cat+': <input type="number" id="effIn'+i+'" value="'+effData.days[6][i]+'" min="0" max="180" style="width:40px;background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.2);color:#ffd700;border-radius:4px;padding:2px 4px;font-size:10px"></label>';
  });
}

function saveEffToday(){
  loadEffData();
  var vals=[];for(var i=0;i<5;i++)vals.push(parseInt(document.getElementById('effIn'+i).value)||0);
  effData.days.shift();effData.days.push(vals);
  saveEffData();v16Sfx('efficiency');
  drawEffCanvas();
  var total=vals.reduce(function(a,b){return a+b;},0);
  var weekTotal=effData.days.reduce(function(a,d){return a+d.reduce(function(x,y){return x+y;},0);},0);
  document.getElementById('effInfo').textContent='오늘 총 '+total+'분 | 주간 총 '+weekTotal+'분';
  var suggest='추천 배분: 음계 20% / 에튀드 25% / 곡연습 35% / 초견 10% / 이론 10%';
  if(total>0){
    var pcts=vals.map(function(v){return Math.round(v/total*100);});
    suggest+='\n현재: '+EFF_CATS.map(function(c,i){return c+' '+pcts[i]+'%';}).join(' / ');
  }
  document.getElementById('effSuggest').textContent=suggest;
  var allDays=effData.days.filter(function(d){return d.reduce(function(a,b){return a+b;},0)>0;});
  if(allDays.length>=7)unlockAch('efficiency_guru');
  addHistory('eff','연습기록 '+total+'분');
}

function drawEffCanvas(){
  loadEffData();
  var c=document.getElementById('effCanvas');if(!c)return;
  var ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var days=['월','화','수','목','금','토','일'];
  var colors=['#f44336','#ff9800','#4caf50','#2196f3','#9c27b0'];
  var maxVal=0;
  effData.days.forEach(function(d){var t=d.reduce(function(a,b){return a+b;},0);if(t>maxVal)maxVal=t;});
  if(maxVal===0)maxVal=60;
  var barW=50,gap=20,startX=70,chartH=H-80,baseY=H-40;
  ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=1;
  for(var i=0;i<=4;i++){var y=baseY-chartH*i/4;ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(W-20,y);ctx.stroke();
    ctx.fillStyle='rgba(200,190,160,.5)';ctx.font='9px sans-serif';ctx.fillText(Math.round(maxVal*i/4)+'분',20,y+3);}
  effData.days.forEach(function(d,di){
    var x=startX+di*(barW+gap);var cumY=0;
    d.forEach(function(v,ci){
      var h=chartH*(v/maxVal);ctx.fillStyle=colors[ci];
      ctx.fillRect(x,baseY-cumY-h,barW,h);cumY+=h;
    });
    ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.fillText(days[di],x+barW/2-6,baseY+14);
  });
  ctx.fillStyle='#c9a96e';ctx.font='9px sans-serif';
  colors.forEach(function(col,i){
    ctx.fillStyle=col;ctx.fillRect(W-120,10+i*14,10,10);
    ctx.fillStyle='#c9a96e';ctx.fillText(EFF_CATS[i],W-105,19+i*14);
  });
}

/* ─── 8. MELODY VARIATION COMPOSER (선율 변주 작곡기) ─── */
var VARI_TYPES=['박절변형','전위','역행','확대','축소','장식'];
var variTheme=[60,62,64,65,67,65,64,62];
var variGenerated=[];

function createVariPanel(){
  var p=document.createElement('div');p.id='variPanel';
  p.innerHTML='<div class="v16Close" onclick="document.getElementById(&quot;variPanel&quot;).classList.remove(&quot;show&quot;)">&times;</div>'+
    '<h3>🎼 선율 변주 작곡기</h3>'+
    '<canvas id="variCanvas" width="540" height="300"></canvas>'+
    '<div class="v16Info" id="variInfo">4마디 주제로 6가지 변주를 생성합니다</div>'+
    '<div style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0;justify-content:center">'+
    '<div class="v16Btn" onclick="generateAllVariations()">🎵 전체 변주 생성</div>'+
    '<div class="v16Btn" onclick="playVariTheme()">▶ 주제 재생</div></div>'+
    '<div id="variBtns" style="display:flex;flex-wrap:wrap;gap:4px;max-width:500px;justify-content:center;margin:4px 0"></div>';
  document.body.appendChild(p);
}

function midiToFreq(n){return 440*Math.pow(2,(n-69)/12);}

function playNotes(notes,dur){
  try{
    if(!actx16)actx16=new(window.AudioContext||window.webkitAudioContext)();
    var now=actx16.currentTime;
    notes.forEach(function(n,i){
      var o=actx16.createOscillator(),g=actx16.createGain();
      o.connect(g);g.connect(actx16.destination);
      o.type='sine';o.frequency.setValueAtTime(midiToFreq(n),now+i*dur);
      g.gain.setValueAtTime(.1,now+i*dur);g.gain.exponentialRampToValueAtTime(.001,now+i*dur+dur*0.9);
      o.start(now+i*dur);o.stop(now+i*dur+dur);
    });
  }catch(e){}
}

function playVariTheme(){v16Sfx('variation_play');playNotes(variTheme,.35);}

function generateVariation(type,theme){
  switch(type){
    case 0:return theme.map(function(n,i){return i%2===0?n:n;}).concat(theme.slice(0,4).map(function(n){return n+2;}));
    case 1:var base=theme[0];return theme.map(function(n){return base-(n-base);});
    case 2:return theme.slice().reverse();
    case 3:var ex=[];theme.forEach(function(n){ex.push(n);ex.push(n);});return ex.slice(0,theme.length);
    case 4:return theme.filter(function(n,i){return i%2===0;});
    case 5:return theme.map(function(n,i){return i%2===0?n:n+(Math.random()>.5?1:-1);});
    default:return theme;
  }
}

function generateAllVariations(){
  variGenerated=[];
  VARI_TYPES.forEach(function(t,i){variGenerated.push(generateVariation(i,variTheme));});
  v16Sfx('variation_play');
  drawVariCanvas();
  var btns=document.getElementById('variBtns');btns.innerHTML='';
  VARI_TYPES.forEach(function(t,i){
    var b=document.createElement('div');b.className='v16Btn';b.textContent='▶ '+t;
    b.onclick=function(){playNotes(variGenerated[i],.3);v16Sfx('variation_play');};
    btns.appendChild(b);
  });
  document.getElementById('variInfo').textContent='6가지 변주 생성 완료! 각 변주를 재생해보세요.';
  unlockAch('variation_composer');
  addHistory('vari','변주 6종 생성');
}

function drawVariCanvas(){
  var c=document.getElementById('variCanvas');if(!c)return;
  var ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 11px sans-serif';ctx.fillText('주제:',10,20);
  drawNoteRow(ctx,60,10,variTheme,W-80,'#ffd700');
  var colors=['#f44336','#ff9800','#4caf50','#2196f3','#9c27b0','#e91e63'];
  variGenerated.forEach(function(v,i){
    var y=50+i*40;
    ctx.fillStyle=colors[i];ctx.font='10px sans-serif';ctx.fillText(VARI_TYPES[i]+':',10,y+12);
    drawNoteRow(ctx,y,10,v,W-80,colors[i]);
  });
}

function drawNoteRow(ctx,y,x0,notes,w,color){
  var step=w/notes.length;
  ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.beginPath();
  notes.forEach(function(n,i){
    var nx=x0+70+i*step,ny=y+20-(n-60)*2;
    i===0?ctx.moveTo(nx,ny):ctx.lineTo(nx,ny);
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(nx,ny,3,0,Math.PI*2);ctx.fill();
  });
  ctx.stroke();
}

/* ─── 9. PERFORMANCE RECORDING ANALYZER (공연 녹화 분석기) ─── */
var PERF_CATS=['음정','리듬','표현','자세','무대매너','청중소통'];
var perfCount=0;

function createPerfPanel(){
  var p=document.createElement('div');p.id='perfPanel';
  p.innerHTML='<div class="v16Close" onclick="document.getElementById(&quot;perfPanel&quot;).classList.remove(&quot;show&quot;)">&times;</div>'+
    '<h3>📹 공연 녹화 분석기</h3>'+
    '<canvas id="perfCanvas" width="600" height="380"></canvas>'+
    '<div class="v16Info" id="perfInfo">공연을 시뮬레이션하고 6가지 항목으로 분석합니다</div>'+
    '<div style="display:flex;gap:8px;margin:6px 0">'+
    '<div class="v16Btn" onclick="simulatePerformance()">🎤 공연 시뮬레이션</div>'+
    '<div class="v16Btn" onclick="downloadPerfReport()">💾 PNG 리포트 다운로드</div></div>';
  document.body.appendChild(p);
}

function simulatePerformance(){
  v16Sfx('perf_record');
  var scores=PERF_CATS.map(function(){return Math.floor(Math.random()*40)+60;});
  perfCount++;
  drawPerfCanvas(scores);
  var avg=scores.reduce(function(a,b){return a+b;},0)/6;
  var grade=avg>=90?'S':avg>=80?'A':avg>=70?'B':avg>=55?'C':'D';
  document.getElementById('perfInfo').innerHTML='공연 분석 완료! 종합: <span class="v16Badge '+grade.toLowerCase()+'">'+grade+'</span> ('+avg.toFixed(1)+'점)';
  if(perfCount>=3)unlockAch('perf_analyst');
  addHistory('perf','공연분석 '+grade+'등급');
}

function drawPerfCanvas(scores){
  var c=document.getElementById('perfCanvas');if(!c)return;
  var ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.fillText('공연 분석 리포트',W/2-60,30);
  var barW=60,gap=25,startX=60,chartH=220,baseY=320;
  var colors=['#f44336','#ff9800','#4caf50','#2196f3','#9c27b0','#e91e63'];
  ctx.strokeStyle='rgba(255,215,0,.1)';
  for(var i=0;i<=4;i++){var y=baseY-chartH*i/4;ctx.beginPath();ctx.moveTo(50,y);ctx.lineTo(W-20,y);ctx.stroke();
    ctx.fillStyle='rgba(200,190,160,.5)';ctx.font='9px sans-serif';ctx.fillText((25*i)+'점',15,y+3);}
  scores.forEach(function(s,i){
    var x=startX+i*(barW+gap),h=chartH*(s/100);
    ctx.fillStyle=colors[i];ctx.fillRect(x,baseY-h,barW,h);
    ctx.fillStyle='#c9a96e';ctx.font='9px sans-serif';ctx.fillText(PERF_CATS[i],x+5,baseY+14);
    ctx.fillStyle='#ffd700';ctx.font='bold 11px sans-serif';ctx.fillText(s+'',x+barW/2-8,baseY-h-8);
  });
}

function downloadPerfReport(){
  var c=document.getElementById('perfCanvas');if(!c)return;
  try{
    var link=document.createElement('a');link.download='violin_perf_report.png';
    link.href=c.toDataURL('image/png');link.click();
    v16Sfx('perf_record');
  }catch(e){document.getElementById('perfInfo').textContent='다운로드 실패';}
}

/* ─── 10. STRING QUARTET PART ASSIGNER (현악 4중주 파트 배정기) ─── */
var QUARTET_PARTS=[
  {name:'1st Violin',kr:'1바이올린',diff:[9,7,8,6,9],color:'#f44336'},
  {name:'2nd Violin',kr:'2바이올린',diff:[7,8,6,7,7],color:'#ff9800'},
  {name:'Viola',kr:'비올라',diff:[6,7,7,8,6],color:'#4caf50'},
  {name:'Cello',kr:'체로',diff:[7,6,8,9,5],color:'#2196f3'}
];
var quartetCount=0;

function createQuartetPanel(){
  var p=document.createElement('div');p.id='quartetPanel';
  p.innerHTML='<div class="v16Close" onclick="document.getElementById(&quot;quartetPanel&quot;).classList.remove(&quot;show&quot;)">&times;</div>'+
    '<h3>🎻 현악 4중주 파트 배정기</h3>'+
    '<canvas id="quartetCanvas" width="520" height="320"></canvas>'+
    '<div class="v16Info" id="quartetInfo">파트 배정을 시작하세요</div>'+
    '<div style="display:flex;gap:8px;margin:6px 0">'+
    '<div class="v16Btn" onclick="assignQuartet()">🎵 파트 배정</div>'+
    '<div class="v16Btn" onclick="showQuartetSeating()">\ud83eꪑ 좌석 배치</div></div>';
  document.body.appendChild(p);
}

function assignQuartet(){
  v16Sfx('quartet_assign');quartetCount++;
  var scores=QUARTET_PARTS.map(function(p){
    return {part:p,score:Math.floor(Math.random()*30)+70,compat:Math.floor(Math.random()*20)+80};
  });
  drawQuartetCanvas(scores);
  var best=scores.sort(function(a,b){return b.score-a.score;})[0];
  document.getElementById('quartetInfo').textContent='추천 파트: '+best.part.kr+' (적합도 '+best.score+'%, 호환 '+best.compat+'%)';
  if(quartetCount>=5)unlockAch('quartet_leader');
  addHistory('quartet',best.part.kr+' 파트 배정');
}

function showQuartetSeating(){
  var c=document.getElementById('quartetCanvas');if(!c)return;
  var ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,215,0,.2)';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(W/2,H/2,100,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#ffd700';ctx.font='bold 12px sans-serif';ctx.fillText('무대',W/2-15,H/2+4);
  var positions=[{x:W/2-80,y:H/2-80},{x:W/2+60,y:H/2-80},{x:W/2-80,y:H/2+70},{x:W/2+60,y:H/2+70}];
  QUARTET_PARTS.forEach(function(p,i){
    ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(positions[i].x,positions[i].y,20,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='9px sans-serif';ctx.fillText(p.kr,positions[i].x-15,positions[i].y+30);
  });
  document.getElementById('quartetInfo').textContent='구성: 1Vn(좌상) - 2Vn(우상) - Va(좌하) - Vc(우하) | 시선: 첫째와 체로가 대각선';
}

function drawQuartetCanvas(scores){
  var c=document.getElementById('quartetCanvas');if(!c)return;
  var ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var axes=['멜로디','리듬','표현력','지구력','기교'];
  scores.forEach(function(s,si){
    var cx=80+si*120,cy=160,r=50;
    ctx.strokeStyle='rgba(255,215,0,.1)';
    for(var lev=2;lev<=10;lev+=2){ctx.beginPath();
      for(var i=0;i<=5;i++){var ang=-Math.PI/2+i*(Math.PI*2/5);var rr=r*lev/10;
        i===0?ctx.moveTo(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang)):ctx.lineTo(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang));}
      ctx.stroke();}
    ctx.beginPath();ctx.fillStyle=s.part.color+'33';ctx.strokeStyle=s.part.color;ctx.lineWidth=2;
    for(var i=0;i<=5;i++){var idx=i%5;var ang=-Math.PI/2+idx*(Math.PI*2/5);var rr=r*(s.part.diff[idx]/10);
      i===0?ctx.moveTo(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang)):ctx.lineTo(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang));}
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle=s.part.color;ctx.font='bold 10px sans-serif';ctx.fillText(s.part.kr,cx-15,cy+r+20);
    ctx.fillStyle='#c9a96e';ctx.font='9px sans-serif';ctx.fillText(s.score+'%',cx-10,cy+r+34);
  });
}

/* ─── 11. MUSIC HISTORY FIGURE QUIZ (음악사 인물 퀴즈) ─── */
var HIST_FIGURES=[
  {name:'파가니니',era:'1782-1840',nation:'이탈리아',fact:'악마의 바이올리니스트'},
  {name:'하이페츠',era:'1901-1987',nation:'리투아니아/미국',fact:'20세기 최고의 기교파'},
  {name:'오이스트라흐',era:'1908-1974',nation:'소련',fact:'엘리자베스 콩쿠르 우승'},
  {name:'펄만',era:'1945-',nation:'이스라엘/미국',fact:'소아마비 투병에도 세계적 연주'},
  {name:'정경화',era:'1948-',nation:'한국',fact:'레벨티엔 콩쿠르 우승'},
  {name:'힐러리 한',era:'1979-',nation:'미국',fact:'링컨센터 실황악 음악감독'},
  {name:'무터',era:'1963-',nation:'독일',fact:'카라얀 우승자'},
  {name:'크라이슬러',era:'1875-1962',nation:'오스트리아/미국',fact:'사랑의 기쁨 작곡자겨 연주자'},
  {name:'사라사테',era:'1844-1908',nation:'스페인',fact:'치고이너바이젠 작곡'},
  {name:'벨체르',era:'1980-',nation:'독일',fact:'베를린필 수석 콘서트마스터'},
  {name:'스턴',era:'1920-2001',nation:'미국',fact:'이스라엘필 공동창립'},
  {name:'미도리',era:'1971-',nation:'일본/미국',fact:'11세 데뷔 신동'},
  {name:'벤게로프',era:'1974-',nation:'러시아',fact:'차이코프스키 콩쿠르 우승'},
  {name:'레핀',era:'1971-',nation:'러시아',fact:'엘리자베스 콩쿠르 우승'},
  {name:'카바코스',era:'1967-',nation:'그리스',fact:'베를린필 수석 콘서트마스터'},
  {name:'다비드',era:'1906-1967',nation:'벨기에/미국',fact:'줄리아드 콩쿠르 창립'},
  {name:'자이델',era:'1918-2001',nation:'우크라이나/미국',fact:'하이페츠의 제자'},
  {name:'코간',era:'1924-1982',nation:'소련',fact:'엘리자베스 콩쿠르 1위'},
  {name:'밀스타인',era:'1904-1992',nation:'우크라이나/미국',fact:'아우어 제자'},
  {name:'엘만',era:'1891-1967',nation:'러시아/미국',fact:'마이스키 독립적 학습'}
];
var histRound=0,histCorrect=0,histTotalCorrect=0,histQuestions=[];

function createHistQuizPanel(){
  var p=document.createElement('div');p.id='histQuizPanel';
  p.innerHTML='<div class="v16Close" onclick="document.getElementById(&quot;histQuizPanel&quot;).classList.remove(&quot;show&quot;)">&times;</div>'+
    '<h3>📚 음악사 인물 퀴즈</h3>'+
    '<canvas id="histQuizCanvas" width="480" height="280"></canvas>'+
    '<div class="v16Info" id="histInfo">20인의 유명 바이올리니스트에 대한 10문제 퀴즈</div>'+
    '<div style="display:flex;gap:8px;margin:6px 0">'+
    '<div class="v16Btn" onclick="startHistQuiz()">▶ 퀴즈 시작</div></div>'+
    '<div id="histOptions" style="display:flex;flex-wrap:wrap;gap:6px;max-width:480px;justify-content:center;margin:6px 0"></div>';
  document.body.appendChild(p);
}

function startHistQuiz(){
  histRound=0;histCorrect=0;histQuestions=[];
  var shuffled=HIST_FIGURES.slice().sort(function(){return Math.random()-.5;});
  for(var i=0;i<10;i++){
    var fig=shuffled[i];
    var qType=Math.floor(Math.random()*3);
    var q,opts,correct;
    if(qType===0){q=fig.name+'의 활동 시대는?';correct=fig.era;
      opts=[fig.era];while(opts.length<4){var rnd=HIST_FIGURES[Math.floor(Math.random()*20)].era;if(opts.indexOf(rnd)===-1)opts.push(rnd);}
    }else if(qType===1){q=fig.name+'의 국적/출신지는?';correct=fig.nation;
      opts=[fig.nation];while(opts.length<4){var rnd=HIST_FIGURES[Math.floor(Math.random()*20)].nation;if(opts.indexOf(rnd)===-1)opts.push(rnd);}
    }else{q=fig.name+'의 업적은?';correct=fig.fact;
      opts=[fig.fact];while(opts.length<4){var rnd=HIST_FIGURES[Math.floor(Math.random()*20)].fact;if(opts.indexOf(rnd)===-1)opts.push(rnd);}
    }
    opts.sort(function(){return Math.random()-.5;});
    histQuestions.push({q:q,opts:opts,correct:correct});
  }
  nextHistRound();
}

function nextHistRound(){
  if(histRound>=10){finishHistQuiz();return;}
  var hq=histQuestions[histRound];
  document.getElementById('histInfo').textContent='문제 '+(histRound+1)+'/10: '+hq.q;
  var optDiv=document.getElementById('histOptions');optDiv.innerHTML='';
  hq.opts.forEach(function(opt){
    var b=document.createElement('div');b.className='v16Btn';b.textContent=opt;
    b.onclick=function(){answerHist(opt,hq.correct);};
    optDiv.appendChild(b);
  });
  drawHistCanvas();
}

function answerHist(ans,correct){
  histRound++;
  if(ans===correct){histCorrect++;histTotalCorrect++;v16Sfx('history_correct');}
  else{v16Sfx('history_wrong');}
  nextHistRound();
}

function finishHistQuiz(){
  document.getElementById('histOptions').innerHTML='';
  document.getElementById('histInfo').textContent='퀴즈 완료! '+histCorrect+'/10 정답';
  drawHistCanvas();
  if(histTotalCorrect>=10)unlockAch('history_10');
  if(histTotalCorrect>=20)unlockAch('history_20');
  addHistory('hist','음악사퀴즈 '+histCorrect+'/10');
}

function drawHistCanvas(){
  var c=document.getElementById('histQuizCanvas');if(!c)return;
  var ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.fillText('음악사 인물 퀴즈',W/2-60,24);
  ctx.font='11px sans-serif';ctx.fillText('정답: '+histCorrect+' / 현재: '+(histRound)+' 문제',W/2-60,46);
  var pct=histRound>0?histCorrect/histRound:0;
  ctx.fillStyle='rgba(255,215,0,.15)';ctx.fillRect(40,60,W-80,16);
  ctx.fillStyle=pct>=0.7?'#4caf50':'#ff9800';ctx.fillRect(40,60,(W-80)*pct,16);
  var startY=100;
  ctx.font='9px sans-serif';
  for(var i=0;i<Math.min(10,HIST_FIGURES.length);i++){
    var f=HIST_FIGURES[i];var x=i<5?20:W/2+10;var y=startY+(i%5)*34;
    ctx.fillStyle='#c9a96e';ctx.fillText(f.name+' ('+f.era+')',x,y);
    ctx.fillStyle='rgba(200,190,160,.5)';ctx.fillText(f.nation+' - '+f.fact,x,y+13);
  }
}

/* ─── 12. QUIZ V16 PANEL (종합 퀴즈) ─── */
var quizV16Idx=0,quizV16Score=0;

function createQuizV16Panel(){
  var p=document.createElement('div');p.id='quizV16Panel';
  p.innerHTML='<div class="v16Close" onclick="document.getElementById(&quot;quizV16Panel&quot;).classList.remove(&quot;show&quot;)">&times;</div>'+
    '<h3>❓ v16 종합 퀴즈</h3>'+
    '<div class="v16Info" id="quizV16Info">15문제 퀴즈를 시작하세요</div>'+
    '<div id="quizV16Opts" style="display:flex;flex-direction:column;gap:6px;max-width:420px;width:100%;margin:6px 0"></div>'+
    '<div class="v16Btn" onclick="startQuizV16()">▶ 퀴즈 시작</div>';
  document.body.appendChild(p);
}

function startQuizV16(){quizV16Idx=0;quizV16Score=0;nextQuizV16();}

function nextQuizV16(){
  if(quizV16Idx>=V16_QUIZ.length){
    document.getElementById('quizV16Info').textContent='퀴즈 완료! '+quizV16Score+'/'+V16_QUIZ.length+' 정답';
    document.getElementById('quizV16Opts').innerHTML='';
    addHistory('quiz','종합퀴즈 '+quizV16Score+'/'+V16_QUIZ.length);
    return;
  }
  var q=V16_QUIZ[quizV16Idx];
  document.getElementById('quizV16Info').textContent='문제 '+(quizV16Idx+1)+'/'+V16_QUIZ.length+': '+q.q;
  var optDiv=document.getElementById('quizV16Opts');optDiv.innerHTML='';
  q.a.forEach(function(ans,i){
    var b=document.createElement('div');b.className='v16Card';b.textContent=ans;
    b.onclick=function(){
      if(i===q.c){quizV16Score++;v16Sfx('quiz_v16');b.style.borderColor='#4caf50';}
      else{v16Sfx('history_wrong');b.style.borderColor='#f44336';}
      setTimeout(function(){quizV16Idx++;nextQuizV16();},600);
    };
    optDiv.appendChild(b);
  });
}

/* ─── 13. REGISTER SONGS, LESSONS, QUIZ TO GLOBAL ─── */
(function registerData(){
  try{
    var gs=JSON.parse(localStorage.getItem('violinSongs')||'[]');
    V16_SONGS.forEach(function(s){if(!gs.find(function(x){return x.id===s.id;}))gs.push(s);});
    localStorage.setItem('violinSongs',JSON.stringify(gs));
  }catch(e){}
  try{
    var gl=JSON.parse(localStorage.getItem('violinLessons')||'[]');
    V16_LESSONS.forEach(function(l){if(!gl.find(function(x){return x.id===l.id;}))gl.push(l);});
    localStorage.setItem('violinLessons',JSON.stringify(gl));
  }catch(e){}
  try{
    var gq=JSON.parse(localStorage.getItem('violinQuizBank')||'[]');
    V16_QUIZ.forEach(function(q){if(!gq.find(function(x){return x.q===q.q;}))gq.push(q);});
    localStorage.setItem('violinQuizBank',JSON.stringify(gq));
  }catch(e){}
})();

/* ─── 14. OPEN FUNCTIONS ─── */
function openBowPat(){
  if(!document.getElementById('bowPatPanel'))createBowPatPanel();
  document.getElementById('bowPatPanel').classList.add('show');
  v16Sfx('feature_open16');drawBowPatCanvas(BOW_PATTERNS[0]);
}
function openExpr(){
  if(!document.getElementById('exprPanel'))createExprPanel();
  document.getElementById('exprPanel').classList.add('show');
  v16Sfx('feature_open16');drawExprRadar([0,0,0,0,0,0]);
}
function openLuthier(){
  if(!document.getElementById('luthierPanel'))createLuthierPanel();
  document.getElementById('luthierPanel').classList.add('show');
  v16Sfx('feature_open16');drawLuthierCanvas();
}
function openEff(){
  if(!document.getElementById('effPanel'))createEffPanel();
  document.getElementById('effPanel').classList.add('show');
  v16Sfx('feature_open16');drawEffCanvas();
}
function openVari(){
  if(!document.getElementById('variPanel'))createVariPanel();
  document.getElementById('variPanel').classList.add('show');
  v16Sfx('feature_open16');drawVariCanvas();
}
function openPerf(){
  if(!document.getElementById('perfPanel'))createPerfPanel();
  document.getElementById('perfPanel').classList.add('show');
  v16Sfx('feature_open16');drawPerfCanvas([0,0,0,0,0,0]);
}
function openQuartet(){
  if(!document.getElementById('quartetPanel'))createQuartetPanel();
  document.getElementById('quartetPanel').classList.add('show');
  v16Sfx('feature_open16');drawQuartetCanvas(QUARTET_PARTS.map(function(p){return {part:p,score:0,compat:0};}));
}
function openHistQuiz(){
  if(!document.getElementById('histQuizPanel'))createHistQuizPanel();
  document.getElementById('histQuizPanel').classList.add('show');
  v16Sfx('feature_open16');drawHistCanvas();
}
function openQuizV16(){
  if(!document.getElementById('quizV16Panel'))createQuizV16Panel();
  document.getElementById('quizV16Panel').classList.add('show');
  v16Sfx('quiz_v16');
}

/* ─── 15. EXPOSE TO WINDOW (for onclick in innerHTML) ─── */
window.selectBowPattern=selectBowPattern;
window.bowRandomExercise=bowRandomExercise;
window.toggleBowTimer=toggleBowTimer;
window.startExprEval=startExprEval;
window.resetExpr=resetExpr;
window.submitExprRound=submitExprRound;
window.startLuthierTask=startLuthierTask;
window.advanceLuthier=advanceLuthier;
window.saveEffToday=saveEffToday;
window.generateAllVariations=generateAllVariations;
window.playVariTheme=playVariTheme;
window.simulatePerformance=simulatePerformance;
window.downloadPerfReport=downloadPerfReport;
window.assignQuartet=assignQuartet;
window.showQuartetSeating=showQuartetSeating;
window.startHistQuiz=startHistQuiz;
window.startQuizV16=startQuizV16;

/* ─── 16. NAVIGATION BAR ─── */
var nav=document.createElement('div');nav.className='v16Nav';
var navItems=[
  {text:'🎵 보잉패턴',action:openBowPat},
  {text:'🎨 감성분석',action:openExpr},
  {text:'🛠 공방',action:openLuthier},
  {text:'📊 효율',action:openEff},
  {text:'🎼 변주',action:openVari},
  {text:'📹 공연',action:openPerf},
  {text:'🎻 4중주',action:openQuartet},
  {text:'📚 음악사',action:openHistQuiz},
  {text:'❓ 퀴즈',action:openQuizV16}
];
navItems.forEach(function(item){
  var btn=document.createElement('div');btn.className='v16NavBtn';btn.innerHTML=item.text;
  btn.addEventListener('pointerdown',function(e){e.preventDefault();item.action();});
  nav.appendChild(btn);
});
document.body.appendChild(nav);

/* ─── 17. KEYBOARD SHORTCUTS ─── */
document.addEventListener('keydown',function(e){
  if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
  if(!e.shiftKey)return;
  switch(e.key){
    case'Q':e.preventDefault();openBowPat();break;
    case'W':e.preventDefault();openExpr();break;
    case'E':e.preventDefault();openLuthier();break;
    case'R':e.preventDefault();openEff();break;
    case'T':e.preventDefault();openVari();break;
    case'Y':e.preventDefault();openPerf();break;
    case'U':e.preventDefault();openQuartet();break;
    case'I':e.preventDefault();openHistQuiz();break;
  }
  if(e.key==='Escape'){
    if(bowTimer){clearInterval(bowTimer);bowTimer=null;}
    document.querySelectorAll('#bowPatPanel,#exprPanel,#luthierPanel,#effPanel,#variPanel,#perfPanel,#quartetPanel,#histQuizPanel,#quizV16Panel').forEach(function(p){p.classList.remove('show');});
  }
});

/* ─── 18. TITLE UPDATE ─── */
var titleEl=document.querySelector('#hd h1');
if(titleEl)titleEl.innerHTML='&#127931; Violin Real <span style="font-size:8px;color:#ff6644;vertical-align:super">v16</span>';
var logoEl=document.getElementById('logo');if(logoEl)logoEl.textContent='Violin Real v16';

/* ─── 19. V16 EXPLORER ACHIEVEMENT CHECK ─── */
(function checkV16Explorer(){
  var featureKeys=['bowPatPanel','exprPanel','luthierPanel','effPanel','variPanel','perfPanel','quartetPanel','histQuizPanel'];
  var observer=new MutationObserver(function(){
    var allOpened=featureKeys.every(function(id){return document.getElementById(id);});
    if(allOpened)unlockAch('v16_explorer');
  });
  observer.observe(document.body,{childList:true,subtree:false});
})();

window.VIOLIN_VERSION='16.0';
})();
