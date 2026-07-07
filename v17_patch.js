/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v17.0 PATCH MODULE
   음정정밀교정기Canvas560x340(12음지판)+오케스트라발췌곡도서관Canvas580x320(12발췌)+
   스케일마스터리트리Canvas580x360(24스케일)+활접점시뮬레이터Canvas560x300(크라이슬러하이웨이)+
   앙상블유형매칭기Canvas480x400(6축Radar8앙상블)+레퍼토리달성맵Canvas600x380(20곡진행)+
   음악감정팔레트Canvas520x340(12감정)+바이올린올림피아드Canvas540x360(8인토너먼트)+
   10곡추가(134→144)+10레슨(160→170)+15퀴즈(105→120)+
   12업적(142→154)+SFX12종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V17Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V17_LOADED)return;window.__V17_LOADED=true;

/* ─── HELPERS ─── */
function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(p){var old=loadProgress();Object.assign(old,p);localStorage.setItem('violinProgress',JSON.stringify(old));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function unlockAch(id){
  var achs=loadAchievements();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  var info=V17_ACHS.find(function(a){return a.id===id;});
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
var actx17=null;
function v17Sfx(type){
  try{
    if(!actx17)actx17=new(window.AudioContext||window.webkitAudioContext)();
    var o=actx17.createOscillator(),g=actx17.createGain();
    o.connect(g);g.connect(actx17.destination);
    var now=actx17.currentTime;
    var presets={
      intonation_hit:{f:880,w:'sine',a:.12,d:.3},
      intonation_miss:{f:220,w:'sawtooth',a:.05,d:.25},
      excerpt_play:{f:659,w:'triangle',a:.1,d:.45},
      scale_complete:{f:784,w:'sine',a:.14,d:.5},
      bow_contact:{f:392,w:'triangle',a:.08,d:.35},
      ensemble_match:{f:523,w:'sine',a:.1,d:.4},
      repertoire_done:{f:698,w:'triangle',a:.12,d:.45},
      emotion_set:{f:554,w:'sine',a:.09,d:.35},
      olympiad_win:{f:1047,w:'triangle',a:.16,d:.6},
      quiz_v17:{f:740,w:'square',a:.06,d:.2},
      achieve_v17:{f:988,w:'triangle',a:.14,d:.6},
      feature_open17:{f:660,w:'triangle',a:.09,d:.25}
    };
    var p=presets[type]||presets.feature_open17;
    o.type=p.w;o.frequency.setValueAtTime(p.f,now);
    g.gain.setValueAtTime(p.a,now);g.gain.exponentialRampToValueAtTime(.001,now+p.d);
    o.start(now);o.stop(now+p.d);
  }catch(e){}
}

/* ─── 2. DATA: SONGS, LESSONS, QUIZ, ACHIEVEMENTS ─── */
var V17_SONGS=[
  {id:'s135',title:'브람스 바이올린 협주곡 1악장',diff:5,genre:'낭만주의'},
  {id:'s136',title:'생상스 서주와 론도 카프리치오소',diff:5,genre:'낭만주의'},
  {id:'s137',title:'프로코피에프 협주곡 1번',diff:5,genre:'현대'},
  {id:'s138',title:'비에니아프스키 폴로네즈 1번',diff:4,genre:'낭만주의'},
  {id:'s139',title:'이자이 무반주 소나타 3번 발라드',diff:5,genre:'현대'},
  {id:'s140',title:'라벨 치간느',diff:5,genre:'인상주의'},
  {id:'s141',title:'드보르작 유모레스크',diff:3,genre:'낭만주의'},
  {id:'s142',title:'마스네 타이스의 명상곡',diff:3,genre:'낭만주의'},
  {id:'s143',title:'몬티 차르다시',diff:4,genre:'민속'},
  {id:'s144',title:'글루크 정령의 춤',diff:2,genre:'고전'}
];
var V17_LESSONS=[
  {id:'l161',title:'음정 정밀 교정법',desc:'센트 단위 음정 보정 훈련'},
  {id:'l162',title:'오케스트라 발췌곡 연습',desc:'오디션용 핵심 발췌곡 공략'},
  {id:'l163',title:'24스케일 체계적 연습',desc:'장/단조 전조 스케일 마스터리'},
  {id:'l164',title:'활 접점 3존 활용',desc:'크라이슬러 하이웨이 보잉 기법'},
  {id:'l165',title:'앙상블 감각 기르기',desc:'실내악/오케스트라 합주 적응'},
  {id:'l166',title:'레퍼토리 구축 전략',desc:'연주 목록 체계적 확장법'},
  {id:'l167',title:'감정 표현 테크닉',desc:'감정을 음악적 기법으로 변환'},
  {id:'l168',title:'경연 준비 총정리',desc:'콩쿠르/오디션 무대 대비'},
  {id:'l169',title:'브람스 협주곡 분석',desc:'브람스 Vn 협주곡 구조와 연습법'},
  {id:'l170',title:'v17 졸업',desc:'v17 모든 과정 완료 인증'}
];
var V17_QUIZ=[
  {q:'브람스 바이올린 협주곡의 조성은?',a:['D장조','E단조','A장조','G단조'],c:0},
  {q:'생상스 &lsquo;서주와 론도 카프리치오소&rsquo; 작품번호는?',a:['Op.28','Op.14','Op.35','Op.42'],c:0},
  {q:'이자이 무반주 소나타는 총 몇 곡?',a:['6곡','4곡','8곡','3곡'],c:0},
  {q:'라벨 &lsquo;치간느&rsquo;의 음악적 배경은?',a:['집시 음악','스페인 음악','프랑스 민요','러시아 민요'],c:0},
  {q:'마스네 타이스의 명상곡은 어떤 작품의 간주곡인가?',a:['오페라 타이스','교향곡 3번','발레 백조의 호수','실내악 4번'],c:0},
  {q:'프로코피에프 Vn 협주곡 1번의 특징적 조성은?',a:['D장조','C단조','B플랫장조','F샤프단조'],c:0},
  {q:'몬티 &lsquo;차르다시&rsquo;의 원래 악기는?',a:['만돌린','바이올린','첼로','피아노'],c:0},
  {q:'비에니아프스키의 국적은?',a:['폴란드','러시아','체코','헝가리'],c:0},
  {q:'글루크 &lsquo;정령의 춤&rsquo;은 어떤 오페라의 곡인가?',a:['오르페오와 에우리디체','마술피리','피가로의 결혼','돈 조반니'],c:0},
  {q:'활의 접점에서 &lsquo;Sul Ponticello&rsquo;는 어디에서 연주하는가?',a:['브릿지 가까이','지판 위','현 중간','브릿지 뒤'],c:0},
  {q:'크라이슬러 하이웨이에서 &lsquo;존2&rsquo;는 어디인가?',a:['브릿지와 지판 중간','브릿지 바로 옆','지판 위','스크롤 쪽'],c:0},
  {q:'오케스트라에서 콘서트마스터의 역할이 아닌 것은?',a:['지휘자 대체','튜닝 리드','보잉 결정','솔로 연주'],c:0},
  {q:'스케일 연습에서 &lsquo;3옥타브 스케일&rsquo;의 최소 필요 포지션은?',a:['7포지션','5포지션','3포지션','9포지션'],c:0},
  {q:'비브라토에서 &lsquo;손목 비브라토&rsquo;와 &lsquo;팔 비브라토&rsquo;의 차이는?',a:['움직이는 관절','속도','음량','음색'],c:0},
  {q:'바이올린 콩쿠르 중 세계 3대 콩쿠르가 아닌 것은?',a:['파가니니 콩쿠르','차이코프스키 콩쿠르','엘리자베스 콩쿠르','비엔나필 콩쿠르'],c:0}
];
var V17_ACHS=[
  {id:'intonation_cent5',icon:'🎯',name:'음정 스나이퍼',desc:'5센트 이내 정확도 달성'},
  {id:'excerpt_master',icon:'🎼',name:'발췌곡 마스터',desc:'12개 오케스트라 발췌곡 완료'},
  {id:'scale_24',icon:'🎵',name:'24스케일 정복자',desc:'24개 장/단조 스케일 모두 완료'},
  {id:'bow_highway',icon:'🎻',name:'크라이슬러 하이웨이',desc:'활 접점 3존 마스터'},
  {id:'ensemble_fit',icon:'🤝',name:'앙상블 적응왕',desc:'모든 앙상블 유형 매칭 완료'},
  {id:'repertoire_20',icon:'📋',name:'레퍼토리 20곡',desc:'레퍼토리에 20곡 이상 등록'},
  {id:'emotion_artist',icon:'🎨',name:'감정 예술가',desc:'12가지 감정 팔레트 모두 사용'},
  {id:'olympiad_gold',icon:'🏅',name:'올림피아드 금메달',desc:'바이올린 올림피아드 우승'},
  {id:'olympiad_3win',icon:'🏆',name:'3연승 챔피언',desc:'올림피아드 3회 우승'},
  {id:'practice_300hr',icon:'⏱️',name:'300시간 연습',desc:'누적 연습시간 300시간 돌파'},
  {id:'songs_140',icon:'🎶',name:'140곡 마스터',desc:'140곡 이상 연주 완료'},
  {id:'v17_explorer',icon:'🚀',name:'v17 탐험가',desc:'v17 모든 기능 사용'}
];

/* ─── 3. CSS INJECTION ─── */
var sty17=document.createElement('style');
sty17.textContent=`
#intoPanel,#excerptPanel,#scaleTreePanel,#bowContactPanel,#ensemblePanel,#repMapPanel,#emotionPanel,#olympiadPanel,#quizV17Panel{
  display:none;position:fixed;inset:0;z-index:250;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#intoPanel.show,#excerptPanel.show,#scaleTreePanel.show,#bowContactPanel.show,#ensemblePanel.show,
#repMapPanel.show,#emotionPanel.show,#olympiadPanel.show,#quizV17Panel.show{display:flex;}
#intoPanel h3,#excerptPanel h3,#scaleTreePanel h3,#bowContactPanel h3,#ensemblePanel h3,
#repMapPanel h3,#emotionPanel h3,#olympiadPanel h3,#quizV17Panel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#intoCanvas,#excerptCanvas,#scaleTreeCanvas,#bowContactCanvas,#ensembleCanvas,#repMapCanvas,#emotionCanvas,#olympiadCanvas{
  border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.v17Info{width:100%;max-width:520px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;font-size:10px;color:rgba(240,230,200,.7);line-height:1.6;}
.v17Card{width:100%;max-width:480px;padding:10px 12px;margin:4px 0;
  background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.12);
  border-radius:8px;font-size:11px;color:rgba(240,230,200,.8);cursor:pointer;
  transition:background .2s,border-color .2s;}
.v17Card:hover{background:rgba(255,215,0,.08);border-color:rgba(255,215,0,.3);}
.v17Card.done{border-color:rgba(76,175,80,.4);background:rgba(76,175,80,.06);}
.v17Btn{display:inline-block;padding:6px 14px;margin:4px;border-radius:6px;
  background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.25);
  color:#ffd700;font-size:10px;cursor:pointer;transition:background .2s;}
.v17Btn:hover{background:rgba(255,215,0,.22);}
.v17Btn.active{background:rgba(255,215,0,.3);border-color:#ffd700;}
.v17Close{position:sticky;top:0;align-self:flex-end;font-size:18px;cursor:pointer;
  color:#888;z-index:10;padding:4px 8px;}
.v17Close:hover{color:#ffd700;}
.v17Nav{position:fixed;bottom:0;left:0;right:0;z-index:251;background:rgba(26,16,32,.95);
  border-top:1px solid rgba(255,215,0,.1);display:flex;overflow-x:auto;
  padding:6px 8px;gap:6px;-webkit-overflow-scrolling:touch;}
.v17NavBtn{flex:0 0 auto;padding:5px 10px;border-radius:12px;font-size:10px;
  background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.15);
  color:#c9a96e;white-space:nowrap;cursor:pointer;transition:all .2s;}
.v17NavBtn:hover,.v17NavBtn.active{background:rgba(255,215,0,.2);border-color:rgba(255,215,0,.4);color:#ffd700;}
.v17Grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:6px;width:100%;max-width:520px;}
.v17Progress{width:100%;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;margin:4px 0;}
.v17Progress .bar{height:100%;background:linear-gradient(90deg,#ffd700,#ff6644);border-radius:3px;transition:width .4s;}
.v17Badge{display:inline-block;padding:2px 6px;border-radius:4px;font-size:8px;font-weight:bold;margin-left:4px;}
.v17Badge.s{background:rgba(255,215,0,.2);color:#ffd700;}
.v17Badge.a{background:rgba(76,175,80,.2);color:#4caf50;}
.v17Badge.b{background:rgba(33,150,243,.2);color:#2196f3;}
.v17Badge.c{background:rgba(255,152,0,.2);color:#ff9800;}
.v17Badge.d{background:rgba(244,67,54,.2);color:#f44336;}
`;
document.head.appendChild(sty17);

/* ─── 4. INTONATION PRECISION TRAINER Canvas 560x340 ─── */
var INTONATION_NOTES=[
  {name:'G3',freq:196,string:'G',pos:0},{name:'A3',freq:220,string:'G',pos:1},
  {name:'B3',freq:247,string:'G',pos:2},{name:'C4',freq:262,string:'G',pos:3},
  {name:'D4',freq:294,string:'D',pos:0},{name:'E4',freq:330,string:'D',pos:1},
  {name:'F4',freq:349,string:'D',pos:2},{name:'G4',freq:392,string:'D',pos:3},
  {name:'A4',freq:440,string:'A',pos:0},{name:'B4',freq:494,string:'A',pos:1},
  {name:'C5',freq:523,string:'A',pos:2},{name:'D5',freq:587,string:'A',pos:3}
];
var intoState={current:0,score:0,total:0,cents:[],round:0,maxRound:12};
function createIntoPanel(){
  var d=document.createElement('div');d.id='intoPanel';
  d.innerHTML='<span class="v17Close" onclick="this.parentNode.classList.remove(&quot;show&quot;)">&times;</span>'+
    '<h3>&#127919; &#51020;&#51221; &#51221;&#48128; &#44368;&#51221;&#44592;</h3>'+
    '<canvas id="intoCanvas" width="560" height="340"></canvas>'+
    '<div class="v17Info" id="intoInfo">12&#51020; &#51648;&#54032; &#50948;&#52824;&#48324; &#51020;&#51221; &#51221;&#54869;&#46020;&#47484; &#52769;&#51221;&#54633;&#45768;&#45796;. &#44033; &#51020;&#51012; &#46308;&#44256; &#49468;&#53944; &#45800;&#50948;&#47196; &#50620;&#47560;&#45208; &#51221;&#54869;&#54620;&#51648; &#54217;&#44032;&#54633;&#45768;&#45796;.</div>'+
    '<div style="margin:6px"><span class="v17Btn" onclick="startIntoTraining()">&#9654; &#54984;&#47144; &#49884;&#51089;</span> '+
    '<span class="v17Btn" onclick="resetInto()">&#9850; &#52488;&#44592;&#54868;</span></div>';
  document.body.appendChild(d);
}
function drawIntoCanvas(noteIdx,centDev,isResult){
  var cv=document.getElementById('intoCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
  ctx.textAlign='center';ctx.fillText('Intonation Precision Trainer',W/2,28);
  ctx.font='10px sans-serif';ctx.fillStyle='#c9a96e';
  ctx.fillText('Round: '+(intoState.round+1)+'/'+intoState.maxRound+'  |  Score: '+intoState.score+'/'+intoState.total,W/2,48);
  var note=INTONATION_NOTES[noteIdx]||INTONATION_NOTES[0];
  ctx.font='bold 20px sans-serif';ctx.fillStyle='#ffd700';
  ctx.fillText(note.name+' ('+note.freq+'Hz)',W/2,85);
  ctx.font='11px sans-serif';ctx.fillStyle='#c9a96e';
  ctx.fillText(note.string+'  |  Position: '+note.pos,W/2,105);
  var meterX=80,meterW=W-160,meterY=140,meterH=40;
  ctx.fillStyle='rgba(255,255,255,.05)';
  ctx.fillRect(meterX,meterY,meterW,meterH);
  var centerX=meterX+meterW/2;
  ctx.strokeStyle='rgba(76,175,80,.6)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(centerX,meterY-5);ctx.lineTo(centerX,meterY+meterH+5);ctx.stroke();
  var zoneW=meterW*0.1;
  ctx.fillStyle='rgba(76,175,80,.1)';ctx.fillRect(centerX-zoneW/2,meterY,zoneW,meterH);
  for(var c=-50;c<=50;c+=10){
    var cx=centerX+(c/50)*(meterW/2);
    ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(cx,meterY);ctx.lineTo(cx,meterY+meterH);ctx.stroke();
    ctx.fillStyle='rgba(201,169,110,.4)';ctx.font='7px sans-serif';
    ctx.fillText(c>0?'+'+c:c+'',cx,meterY+meterH+12);
  }
  if(typeof centDev==='number'){
    var devX=centerX+(centDev/50)*(meterW/2);
    devX=Math.max(meterX,Math.min(meterX+meterW,devX));
    var col=Math.abs(centDev)<=5?'#4caf50':Math.abs(centDev)<=15?'#ff9800':'#f44336';
    ctx.fillStyle=col;ctx.beginPath();
    ctx.moveTo(devX,meterY-8);ctx.lineTo(devX-6,meterY-18);ctx.lineTo(devX+6,meterY-18);ctx.closePath();ctx.fill();
    ctx.font='bold 12px sans-serif';ctx.fillStyle=col;
    ctx.fillText((centDev>0?'+':'')+centDev+' cents',devX,meterY-22);
  }
  var gridY=210,cellW=42,cellH=28,strings=['G','D','A','E'];
  ctx.fillStyle='rgba(201,169,110,.5)';ctx.font='9px sans-serif';
  ctx.textAlign='center';
  for(var si=0;si<4;si++){
    ctx.fillStyle='rgba(201,169,110,.5)';
    ctx.fillText(strings[si],meterX-15,gridY+si*cellH+18);
    for(var pi=0;pi<4;pi++){
      var gx=meterX+20+pi*(cellW+8),gy=gridY+si*cellH;
      var ni=si*4+pi;
      var hist=intoState.cents[ni];
      if(typeof hist==='number'){
        var gc=Math.abs(hist)<=5?'rgba(76,175,80,.3)':Math.abs(hist)<=15?'rgba(255,152,0,.3)':'rgba(244,67,54,.3)';
        ctx.fillStyle=gc;
      }else{
        ctx.fillStyle='rgba(255,255,255,.04)';
      }
      ctx.fillRect(gx,gy,cellW,cellH-2);
      ctx.strokeStyle='rgba(255,215,0,.1)';ctx.lineWidth=0.5;ctx.strokeRect(gx,gy,cellW,cellH-2);
      var nn=INTONATION_NOTES[ni];
      if(nn){ctx.fillStyle=ni===noteIdx?'#ffd700':'#c9a96e';ctx.font='8px sans-serif';ctx.fillText(nn.name,gx+cellW/2,gy+12);
        if(typeof hist==='number'){ctx.font='7px sans-serif';ctx.fillStyle='rgba(240,230,200,.5)';ctx.fillText((hist>0?'+':'')+hist+'c',gx+cellW/2,gy+22);}
      }
    }
  }
  if(isResult){
    ctx.font='bold 13px sans-serif';ctx.fillStyle='#ffd700';ctx.textAlign='center';
    var avg=0,cnt=0;intoState.cents.forEach(function(c){if(typeof c==='number'){avg+=Math.abs(c);cnt++;}});
    avg=cnt?Math.round(avg/cnt):0;
    var grade=avg<=5?'S':avg<=10?'A':avg<=20?'B':avg<=35?'C':'D';
    ctx.fillText('Result: Avg '+avg+' cents | Grade: '+grade,W/2,H-20);
    if(avg<=5)unlockAch('intonation_cent5');
  }
  ctx.textAlign='start';
}
function startIntoTraining(){
  intoState={current:0,score:0,total:0,cents:new Array(12),round:0,maxRound:12};
  playIntoNote(0);
}
function playIntoNote(idx){
  if(idx>=12){drawIntoCanvas(0,0,true);v17Sfx('scale_complete');addHistory('intonation','Intonation training completed');return;}
  intoState.round=idx;intoState.current=idx;
  var note=INTONATION_NOTES[idx];
  try{
    if(!actx17)actx17=new(window.AudioContext||window.webkitAudioContext)();
    var dev=(Math.random()-0.5)*60;
    var playFreq=note.freq*Math.pow(2,dev/1200);
    var o=actx17.createOscillator(),g=actx17.createGain();
    o.connect(g);g.connect(actx17.destination);o.type='sine';
    o.frequency.setValueAtTime(playFreq,actx17.currentTime);
    g.gain.setValueAtTime(.12,actx17.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,actx17.currentTime+1.5);
    o.start(actx17.currentTime);o.stop(actx17.currentTime+1.5);
    var roundedDev=Math.round(dev);
    intoState.cents[idx]=roundedDev;
    intoState.total++;
    if(Math.abs(roundedDev)<=10){intoState.score++;v17Sfx('intonation_hit');}
    else{v17Sfx('intonation_miss');}
    drawIntoCanvas(idx,roundedDev,false);
    setTimeout(function(){playIntoNote(idx+1);},2000);
  }catch(e){intoState.cents[idx]=0;drawIntoCanvas(idx,0,false);setTimeout(function(){playIntoNote(idx+1);},1500);}
}
function resetInto(){intoState={current:0,score:0,total:0,cents:[],round:0,maxRound:12};drawIntoCanvas(0,null,false);}

/* ─── 5. ORCHESTRA EXCERPT LIBRARY Canvas 580x320 ─── */
var ORCH_EXCERPTS=[
  {title:'베토벤 교향곡 5번 - 2Vn 주제',orch:'베를린필',diff:6,period:'고전',bars:16,key:'C단조'},
  {title:'차이코프스키 교향곡 6번 비창 - 1Vn 멜로디',orch:'빈필',diff:7,period:'낭만',bars:24,key:'B단조'},
  {title:'브람스 교향곡 4번 - 1Vn 패시지',orch:'시카고심포니',diff:8,period:'낭만',bars:20,key:'E단조'},
  {title:'드보르작 신세계 교향곡 - 2악장 솔로',orch:'뉴욕필',diff:5,period:'낭만',bars:12,key:'D플랫장조'},
  {title:'모차르트 교향곡 40번 - 1Vn 주제',orch:'빈필',diff:5,period:'고전',bars:16,key:'G단조'},
  {title:'말러 교향곡 5번 아다지에토 - 1Vn',orch:'베를린필',diff:7,period:'후기낭만',bars:32,key:'F장조'},
  {title:'림스키코르사코프 세헤라자데 - Vn 솔로',orch:'런던심포니',diff:9,period:'낭만',bars:40,key:'E장조'},
  {title:'스트라빈스키 봄의 제전 - 1Vn 리듬',orch:'클리블랜드',diff:8,period:'현대',bars:18,key:'변박자'},
  {title:'시벨리우스 교향곡 2번 - 피날레 1Vn',orch:'헬싱키필',diff:7,period:'낭만',bars:24,key:'D장조'},
  {title:'베를리오즈 환상교향곡 - 왈츠 1Vn',orch:'파리관현악단',diff:6,period:'낭만',bars:20,key:'A장조'},
  {title:'바그너 트리스탄 전주곡 - 현악',orch:'바이로이트',diff:7,period:'낭만',bars:28,key:'A단조'},
  {title:'라벨 볼레로 - 2Vn 리듬',orch:'보스턴심포니',diff:5,period:'인상',bars:16,key:'C장조'}
];
var excerptState={completed:{}};
function createExcerptPanel(){
  var d=document.createElement('div');d.id='excerptPanel';
  var cards='';ORCH_EXCERPTS.forEach(function(ex,i){
    cards+='<div class="v17Card" onclick="selectExcerpt('+i+')"><b>'+ex.title+'</b><br><span style="font-size:9px;color:rgba(240,230,200,.5)">'+
      ex.orch+' | '+ex.period+' | '+ex.bars+'&#47560;&#46356; | '+ex.key+' | &#9733;'+ex.diff+'/10</span></div>';
  });
  d.innerHTML='<span class="v17Close" onclick="this.parentNode.classList.remove(&quot;show&quot;)">&times;</span>'+
    '<h3>&#127932; &#50724;&#52992;&#49828;&#53944;&#46972; &#48156;&#52684;&#44257; &#46020;&#49436;&#44288;</h3>'+
    '<canvas id="excerptCanvas" width="580" height="320"></canvas>'+
    '<div class="v17Info" id="excerptInfo">&#50724;&#46356;&#49496;/&#53080;&#53216;&#47476; &#54596;&#49688; &#48156;&#52684;&#44257; 12&#44257;. &#44033; &#48156;&#52684;&#44257;&#51032; &#45212;&#51060;&#46020;&#50752; &#50672;&#49845; &#54252;&#51064;&#53944;&#47484; &#54869;&#51064;&#54616;&#49464;&#50836;.</div>'+
    '<div style="width:100%;max-width:520px">'+cards+'</div>';
  document.body.appendChild(d);
}
function drawExcerptCanvas(selIdx){
  var cv=document.getElementById('excerptCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText('Orchestra Excerpt Difficulty Map',W/2,24);
  var barW=36,gap=6,sX=30,bY=260;
  var cols=['#f44336','#ff9800','#ffc107','#4caf50','#2196f3','#9c27b0','#e91e63','#00bcd4','#8bc34a','#ff5722','#607d8b','#795548'];
  ORCH_EXCERPTS.forEach(function(ex,i){
    var x=sX+i*(barW+gap),h=(ex.diff/10)*(bY-50);
    ctx.fillStyle=i===selIdx?cols[i]:'rgba(201,169,110,.3)';
    ctx.fillRect(x,bY-h,barW,h);
    if(excerptState.completed[i]){
      ctx.fillStyle='rgba(76,175,80,.6)';ctx.fillRect(x,bY-h,barW,4);
    }
    ctx.save();ctx.translate(x+barW/2,bY+8);ctx.rotate(-0.5);
    ctx.fillStyle=i===selIdx?'#ffd700':'#c9a96e';ctx.font='7px sans-serif';ctx.textAlign='start';
    var shortName=ex.title.split(' - ')[0].substring(0,12);
    ctx.fillText(shortName,0,0);ctx.restore();
    ctx.fillStyle='#ffd700';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
    ctx.fillText(ex.diff,x+barW/2,bY-h-6);
  });
  if(typeof selIdx==='number'&&ORCH_EXCERPTS[selIdx]){
    var sel=ORCH_EXCERPTS[selIdx];
    ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.textAlign='left';
    ctx.fillText(sel.title,20,H-40);
    ctx.fillText(sel.orch+' | '+sel.key+' | '+sel.bars+'bars',20,H-24);
    var completedCount=Object.keys(excerptState.completed).length;
    ctx.fillStyle='#ffd700';ctx.textAlign='right';ctx.fillText('Completed: '+completedCount+'/12',W-20,H-24);
  }
  ctx.textAlign='start';
}
function selectExcerpt(idx){
  excerptState.completed[idx]=true;
  var p=loadProgress();p['excerpt_'+idx]=true;saveProgress(p);
  drawExcerptCanvas(idx);v17Sfx('excerpt_play');
  addHistory('excerpt','Practiced: '+ORCH_EXCERPTS[idx].title);
  var cnt=Object.keys(excerptState.completed).length;
  if(cnt>=12)unlockAch('excerpt_master');
}

/* ─── 6. SCALE MASTERY TREE Canvas 580x360 ─── */
var SCALES_24=[
  {name:'C&#51109;&#51312;',key:'C',type:'major',notes:'C D E F G A B'},{name:'G&#51109;&#51312;',key:'G',type:'major',notes:'G A B C D E F#'},
  {name:'D&#51109;&#51312;',key:'D',type:'major',notes:'D E F# G A B C#'},{name:'A&#51109;&#51312;',key:'A',type:'major',notes:'A B C# D E F# G#'},
  {name:'E&#51109;&#51312;',key:'E',type:'major',notes:'E F# G# A B C# D#'},{name:'B&#51109;&#51312;',key:'B',type:'major',notes:'B C# D# E F# G# A#'},
  {name:'F&#51109;&#51312;',key:'F',type:'major',notes:'F G A Bb C D E'},{name:'Bb&#51109;&#51312;',key:'Bb',type:'major',notes:'Bb C D Eb F G A'},
  {name:'Eb&#51109;&#51312;',key:'Eb',type:'major',notes:'Eb F G Ab Bb C D'},{name:'Ab&#51109;&#51312;',key:'Ab',type:'major',notes:'Ab Bb C Db Eb F G'},
  {name:'Db&#51109;&#51312;',key:'Db',type:'major',notes:'Db Eb F Gb Ab Bb C'},{name:'Gb&#51109;&#51312;',key:'Gb',type:'major',notes:'Gb Ab Bb Cb Db Eb F'},
  {name:'A&#45800;&#51312;',key:'Am',type:'minor',notes:'A B C D E F G'},{name:'E&#45800;&#51312;',key:'Em',type:'minor',notes:'E F# G A B C D'},
  {name:'B&#45800;&#51312;',key:'Bm',type:'minor',notes:'B C# D E F# G A'},{name:'F#&#45800;&#51312;',key:'F#m',type:'minor',notes:'F# G# A B C# D E'},
  {name:'C#&#45800;&#51312;',key:'C#m',type:'minor',notes:'C# D# E F# G# A B'},{name:'G#&#45800;&#51312;',key:'G#m',type:'minor',notes:'G# A# B C# D# E F#'},
  {name:'D&#45800;&#51312;',key:'Dm',type:'minor',notes:'D E F G A Bb C'},{name:'G&#45800;&#51312;',key:'Gm',type:'minor',notes:'G A Bb C D Eb F'},
  {name:'C&#45800;&#51312;',key:'Cm',type:'minor',notes:'C D Eb F G Ab Bb'},{name:'F&#45800;&#51312;',key:'Fm',type:'minor',notes:'F G Ab Bb C Db Eb'},
  {name:'Bb&#45800;&#51312;',key:'Bbm',type:'minor',notes:'Bb C Db Eb F Gb Ab'},{name:'Eb&#45800;&#51312;',key:'Ebm',type:'minor',notes:'Eb F Gb Ab Bb Cb Db'}
];
var scaleProgress={};
function createScaleTreePanel(){
  var d=document.createElement('div');d.id='scaleTreePanel';
  d.innerHTML='<span class="v17Close" onclick="this.parentNode.classList.remove(&quot;show&quot;)">&times;</span>'+
    '<h3>&#127925; &#49828;&#52992;&#51068; &#47560;&#49828;&#53552;&#47532; &#53944;&#47532;</h3>'+
    '<canvas id="scaleTreeCanvas" width="580" height="360"></canvas>'+
    '<div class="v17Info">24&#44060; &#51109;/&#45800;&#51312; &#49828;&#52992;&#51068;&#51012; &#52404;&#44228;&#51201;&#51004;&#47196; &#50672;&#49845;&#54633;&#45768;&#45796;. &#45432;&#46300;&#47484; &#53364;&#47533;&#54616;&#50668; &#50756;&#47308; &#52376;&#47532;&#54616;&#49464;&#50836;.</div>'+
    '<div style="margin:6px"><span class="v17Btn" onclick="resetScales()">&#9850; &#52488;&#44592;&#54868;</span></div>';
  document.body.appendChild(d);
}
function drawScaleTreeCanvas(){
  var cv=document.getElementById('scaleTreeCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText('Scale Mastery Tree - 24 Scales',W/2,22);
  var completed=0;
  var nodeR=16,majY=80,minY=230;
  for(var i=0;i<12;i++){
    var x=35+i*46,y=majY;
    var sc=SCALES_24[i];
    var done=scaleProgress[sc.key];
    if(done)completed++;
    if(i>0){ctx.strokeStyle='rgba(255,215,0,.1)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x-46,y);ctx.lineTo(x,y);ctx.stroke();}
    ctx.fillStyle=done?'rgba(76,175,80,.3)':'rgba(255,255,255,.04)';
    ctx.beginPath();ctx.arc(x,y,nodeR,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=done?'rgba(76,175,80,.6)':'rgba(255,215,0,.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(x,y,nodeR,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle=done?'#4caf50':'#c9a96e';ctx.font='bold 8px sans-serif';
    ctx.fillText(sc.key,x,y+3);
    ctx.fillStyle='rgba(201,169,110,.4)';ctx.font='7px sans-serif';
    ctx.fillText(sc.name.replace(/&#\d+;/g,''),x,y+nodeR+10);
    ctx.strokeStyle='rgba(255,215,0,.06)';ctx.beginPath();ctx.moveTo(x,majY+nodeR);ctx.lineTo(x,minY-nodeR);ctx.stroke();
  }
  for(var j=0;j<12;j++){
    var mx=35+j*46,my=minY;
    var msc=SCALES_24[12+j];
    var mdone=scaleProgress[msc.key];
    if(mdone)completed++;
    if(j>0){ctx.strokeStyle='rgba(255,215,0,.1)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(mx-46,my);ctx.lineTo(mx,my);ctx.stroke();}
    ctx.fillStyle=mdone?'rgba(76,175,80,.3)':'rgba(255,255,255,.04)';
    ctx.beginPath();ctx.arc(mx,my,nodeR,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=mdone?'rgba(76,175,80,.6)':'rgba(255,215,0,.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(mx,my,nodeR,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle=mdone?'#4caf50':'#c9a96e';ctx.font='bold 8px sans-serif';
    ctx.fillText(msc.key,mx,my+3);
    ctx.fillStyle='rgba(201,169,110,.4)';ctx.font='7px sans-serif';
    ctx.fillText(msc.name.replace(/&#\d+;/g,''),mx,my+nodeR+10);
  }
  ctx.fillStyle='rgba(201,169,110,.6)';ctx.font='10px sans-serif';ctx.textAlign='left';
  ctx.fillText('Major Scales (12)',20,majY-25);ctx.fillText('Minor Scales (12)',20,minY-25);
  var pct=Math.round(completed/24*100);
  ctx.fillStyle='#ffd700';ctx.textAlign='right';ctx.font='11px sans-serif';
  ctx.fillText('Progress: '+completed+'/24 ('+pct+'%)',W-20,H-15);
  var barX=20,barY=H-10,barW=W-40;
  ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(barX,barY,barW,5);
  ctx.fillStyle='linear-gradient(90deg,#ffd700,#ff6644)';
  var grd=ctx.createLinearGradient(barX,0,barX+barW*pct/100,0);grd.addColorStop(0,'#ffd700');grd.addColorStop(1,'#ff6644');
  ctx.fillStyle=grd;ctx.fillRect(barX,barY,barW*pct/100,5);
  if(completed>=24)unlockAch('scale_24');
  ctx.textAlign='start';
  cv.onclick=function(e){
    var rect=cv.getBoundingClientRect();
    var cx=(e.clientX-rect.left)*(W/rect.width);
    var cy=(e.clientY-rect.top)*(H/rect.height);
    for(var k=0;k<24;k++){
      var nx=35+(k%12)*46,ny=k<12?majY:minY;
      if(Math.sqrt((cx-nx)*(cx-nx)+(cy-ny)*(cy-ny))<nodeR+4){
        scaleProgress[SCALES_24[k].key]=true;
        var sp=loadProgress();sp['scale_'+SCALES_24[k].key]=true;saveProgress(sp);
        v17Sfx('scale_complete');drawScaleTreeCanvas();break;
      }
    }
  };
}
function resetScales(){scaleProgress={};drawScaleTreeCanvas();}

/* ─── 7. BOW CONTACT POINT SIMULATOR Canvas 560x300 ─── */
var BOW_ZONES=[
  {name:'Sul Ponticello',zone:1,desc:'Bridge near - Metallic/glassy tone',color:'#f44336',techniques:['Harmonics','Special effects','Contemporary']},
  {name:'Normal (Kreisler)',zone:2,desc:'Sweet spot - Full/rich tone',color:'#4caf50',techniques:['Melody','Cantabile','Standard playing']},
  {name:'Sul Tasto',zone:3,desc:'Over fingerboard - Soft/airy tone',color:'#2196f3',techniques:['Piano passages','Ethereal sound','Flautando']}
];
var bowContactState={current:1,pressure:50,speed:50,sessions:0};
function createBowContactPanel(){
  var d=document.createElement('div');d.id='bowContactPanel';
  d.innerHTML='<span class="v17Close" onclick="this.parentNode.classList.remove(&quot;show&quot;)">&times;</span>'+
    '<h3>&#127931; &#54876; &#51217;&#51216; &#49884;&#48044;&#47112;&#51060;&#53552;</h3>'+
    '<canvas id="bowContactCanvas" width="560" height="300"></canvas>'+
    '<div class="v17Info">&#53356;&#46972;&#51060;&#49836;&#47084; &#54616;&#51060;&#50920;&#51060;: &#48652;&#47551;&#51648;(Sul Ponticello) ~ &#51648;&#54032;(Sul Tasto) &#49324;&#51060;&#51032; 3&#51316; &#54876; &#51217;&#51216;&#51012; &#50672;&#49845;&#54633;&#45768;&#45796;.</div>'+
    '<div style="margin:6px"><span class="v17Btn" onclick="setBowZone(1)">Zone 1 &#48652;&#47551;&#51648;</span> '+
    '<span class="v17Btn" onclick="setBowZone(2)">Zone 2 &#45432;&#47568;</span> '+
    '<span class="v17Btn" onclick="setBowZone(3)">Zone 3 &#51648;&#54032;</span></div>'+
    '<div style="margin:4px;font-size:10px;color:#c9a96e">Pressure: <input type="range" id="bowPressure" min="0" max="100" value="50" oninput="updateBowContact()" style="width:120px;vertical-align:middle"> '+
    'Speed: <input type="range" id="bowSpeed" min="0" max="100" value="50" oninput="updateBowContact()" style="width:120px;vertical-align:middle"></div>';
  document.body.appendChild(d);
}
function drawBowContactCanvas(){
  var cv=document.getElementById('bowContactCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText('Kreisler Highway - Bow Contact Simulator',W/2,24);
  var stringY=100,stringW=W-80,stringX=40;
  ctx.fillStyle='rgba(139,94,60,.3)';ctx.fillRect(stringX,stringY-30,stringW,60);
  ctx.strokeStyle='rgba(201,169,110,.8)';ctx.lineWidth=1.5;
  for(var s=0;s<4;s++){
    ctx.beginPath();ctx.moveTo(stringX,stringY-15+s*10);ctx.lineTo(stringX+stringW,stringY-15+s*10);ctx.stroke();
  }
  ctx.fillStyle='rgba(100,70,40,.8)';ctx.fillRect(stringX,stringY-35,8,70);
  ctx.fillStyle='rgba(60,40,25,.8)';ctx.fillRect(stringX+stringW-8,stringY-35,8,70);
  ctx.fillStyle='rgba(201,169,110,.3)';ctx.font='8px sans-serif';
  ctx.textAlign='left';ctx.fillText('Bridge',stringX+stringW-30,stringY+45);
  ctx.textAlign='right';ctx.fillText('Fingerboard',stringX+30,stringY+45);
  var zoneW=stringW/3;
  BOW_ZONES.forEach(function(z,i){
    var zx=stringX+i*zoneW;
    ctx.fillStyle=z.zone===bowContactState.current?z.color+'40':z.color+'15';
    ctx.fillRect(zx,stringY-30,zoneW,60);
    ctx.strokeStyle=z.zone===bowContactState.current?z.color:z.color+'40';
    ctx.lineWidth=z.zone===bowContactState.current?2:0.5;
    ctx.strokeRect(zx,stringY-30,zoneW,60);
    ctx.fillStyle=z.zone===bowContactState.current?'#ffd700':'#c9a96e';
    ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText(z.name,zx+zoneW/2,stringY+55);
  });
  var indicatorX=stringX+(bowContactState.current-1)*zoneW+zoneW/2;
  ctx.fillStyle=BOW_ZONES[bowContactState.current-1].color;
  ctx.beginPath();ctx.moveTo(indicatorX,stringY-38);ctx.lineTo(indicatorX-8,stringY-50);ctx.lineTo(indicatorX+8,stringY-50);ctx.closePath();ctx.fill();
  var gaugeY=180,gaugeH=30,gaugeW=200;
  ctx.fillStyle='rgba(201,169,110,.4)';ctx.font='10px sans-serif';ctx.textAlign='left';
  ctx.fillText('Pressure:',40,gaugeY+12);
  ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(120,gaugeY,gaugeW,gaugeH);
  var pg=ctx.createLinearGradient(120,0,120+gaugeW,0);pg.addColorStop(0,'#4caf50');pg.addColorStop(0.5,'#ffc107');pg.addColorStop(1,'#f44336');
  ctx.fillStyle=pg;ctx.fillRect(120,gaugeY,gaugeW*bowContactState.pressure/100,gaugeH);
  ctx.fillStyle='rgba(201,169,110,.4)';ctx.fillText('Speed:',340,gaugeY+12);
  ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(400,gaugeY,gaugeW-60,gaugeH);
  var sg=ctx.createLinearGradient(400,0,400+gaugeW-60,0);sg.addColorStop(0,'#2196f3');sg.addColorStop(1,'#ff9800');
  ctx.fillStyle=sg;ctx.fillRect(400,gaugeY,((gaugeW-60)*bowContactState.speed/100),gaugeH);
  var toneY=240;ctx.fillStyle='#ffd700';ctx.font='11px sans-serif';ctx.textAlign='center';
  var zone=BOW_ZONES[bowContactState.current-1];
  ctx.fillText('Tone: '+zone.desc,W/2,toneY);
  ctx.fillStyle='#c9a96e';ctx.font='9px sans-serif';
  ctx.fillText('Techniques: '+zone.techniques.join(', '),W/2,toneY+18);
  ctx.fillText('Sessions: '+bowContactState.sessions,W/2,H-15);
  ctx.textAlign='start';
}
function setBowZone(z){
  bowContactState.current=z;bowContactState.sessions++;
  var p=loadProgress();p.bow_sessions=(p.bow_sessions||0)+1;saveProgress(p);
  if(bowContactState.sessions>=9)unlockAch('bow_highway');
  v17Sfx('bow_contact');drawBowContactCanvas();
}
function updateBowContact(){
  var pr=document.getElementById('bowPressure');
  var sp=document.getElementById('bowSpeed');
  if(pr)bowContactState.pressure=parseInt(pr.value);
  if(sp)bowContactState.speed=parseInt(sp.value);
  drawBowContactCanvas();
}

/* ─── 8. ENSEMBLE TYPE MATCHER Canvas 480x400 6-axis Radar ─── */
var ENSEMBLE_TYPES=[
  {name:'Solo Recital',kr:'독주 리사이틀',axes:[9,5,3,8,9,7]},
  {name:'Duo Sonata',kr:'듀오 소나타',axes:[7,8,5,7,7,8]},
  {name:'String Trio',kr:'현악 3중주',axes:[6,8,7,6,6,8]},
  {name:'String Quartet',kr:'현악 4중주',axes:[5,9,8,5,5,9]},
  {name:'Chamber Orchestra',kr:'실내 오케스트라',axes:[4,9,9,4,4,8]},
  {name:'Symphony Orchestra',kr:'심포니 오케스트라',axes:[3,10,10,3,3,7]},
  {name:'Baroque Ensemble',kr:'바로크 앙상블',axes:[6,7,6,7,8,6]},
  {name:'Jazz Fusion',kr:'재즈 퓨전',axes:[7,6,4,9,8,5]}
];
var ENSEMBLE_AXES=['기교','협동','인원적응','즉흥','표현','인내'];
var ensembleState={selected:0,userAxes:[5,5,5,5,5,5]};
function createEnsemblePanel(){
  var d=document.createElement('div');d.id='ensemblePanel';
  var btns='';ENSEMBLE_TYPES.forEach(function(et,i){
    btns+='<span class="v17Btn" onclick="matchEnsemble('+i+')">'+et.kr+'</span> ';
  });
  d.innerHTML='<span class="v17Close" onclick="this.parentNode.classList.remove(&quot;show&quot;)">&times;</span>'+
    '<h3>&#129309; &#50521;&#49345;&#48660; &#50976;&#54805; &#47588;&#52845;&#44592;</h3>'+
    '<canvas id="ensembleCanvas" width="480" height="400"></canvas>'+
    '<div class="v17Info">&#45817;&#49888;&#51032; &#50672;&#51452; &#49828;&#53440;&#51068;&#50640; &#47582;&#45716; &#50521;&#49345;&#48660; &#50976;&#54805;&#51012; &#52286;&#50500;&#48372;&#49464;&#50836;. 6&#52629; &#47112;&#51060;&#45908; &#52264;&#53944;&#47196; &#48708;&#44368;&#54633;&#45768;&#45796;.</div>'+
    '<div style="margin:6px">'+btns+'</div>';
  document.body.appendChild(d);
}
function drawEnsembleCanvas(){
  var cv=document.getElementById('ensembleCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText('Ensemble Type Radar',W/2,22);
  var cx=W/2,cy=185,R=120,axes=ENSEMBLE_AXES.length;
  for(var ring=2;ring<=10;ring+=2){
    ctx.strokeStyle='rgba(255,215,0,.08)';ctx.lineWidth=0.5;ctx.beginPath();
    for(var a=0;a<axes;a++){
      var ang=-Math.PI/2+a*(2*Math.PI/axes);
      var rx=cx+Math.cos(ang)*R*(ring/10),ry=cy+Math.sin(ang)*R*(ring/10);
      if(a===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
    }
    ctx.closePath();ctx.stroke();
  }
  for(var la=0;la<axes;la++){
    var lang=-Math.PI/2+la*(2*Math.PI/axes);
    ctx.strokeStyle='rgba(255,215,0,.1)';ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(lang)*R,cy+Math.sin(lang)*R);ctx.stroke();
    ctx.fillStyle='#c9a96e';ctx.font='9px sans-serif';
    var lx=cx+Math.cos(lang)*(R+16),ly=cy+Math.sin(lang)*(R+16);
    ctx.fillText(ENSEMBLE_AXES[la],lx,ly+3);
  }
  var ens=ENSEMBLE_TYPES[ensembleState.selected];
  ctx.beginPath();ctx.strokeStyle='rgba(255,215,0,.7)';ctx.lineWidth=2;ctx.fillStyle='rgba(255,215,0,.12)';
  for(var ea=0;ea<axes;ea++){
    var eang=-Math.PI/2+ea*(2*Math.PI/axes);
    var ex=cx+Math.cos(eang)*R*(ens.axes[ea]/10),ey=cy+Math.sin(eang)*R*(ens.axes[ea]/10);
    if(ea===0)ctx.moveTo(ex,ey);else ctx.lineTo(ex,ey);
  }
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.strokeStyle='rgba(76,175,80,.6)';ctx.lineWidth=1.5;ctx.fillStyle='rgba(76,175,80,.08)';
  for(var ua=0;ua<axes;ua++){
    var uang=-Math.PI/2+ua*(2*Math.PI/axes);
    var ux=cx+Math.cos(uang)*R*(ensembleState.userAxes[ua]/10),uy=cy+Math.sin(uang)*R*(ensembleState.userAxes[ua]/10);
    if(ua===0)ctx.moveTo(ux,uy);else ctx.lineTo(ux,uy);
  }
  ctx.closePath();ctx.fill();ctx.stroke();
  var matchScore=0;
  for(var ma=0;ma<axes;ma++){matchScore+=(10-Math.abs(ens.axes[ma]-ensembleState.userAxes[ma]));}
  matchScore=Math.round(matchScore/60*100);
  ctx.fillStyle='#ffd700';ctx.font='bold 12px sans-serif';
  ctx.fillText(ens.kr+' | Match: '+matchScore+'%',W/2,H-30);
  ctx.fillStyle='#c9a96e';ctx.font='9px sans-serif';
  ctx.fillText('Gold = Ensemble / Green = Your Style',W/2,H-12);
  ctx.textAlign='start';
}
function matchEnsemble(idx){
  ensembleState.selected=idx;
  ensembleState.userAxes=ensembleState.userAxes.map(function(){return 3+Math.floor(Math.random()*7);});
  v17Sfx('ensemble_match');drawEnsembleCanvas();
  var p=loadProgress();p['ensemble_'+idx]=true;saveProgress(p);
  var allDone=ENSEMBLE_TYPES.every(function(_,i){return loadProgress()['ensemble_'+i];});
  if(allDone)unlockAch('ensemble_fit');
}

/* ─── 9. REPERTOIRE ACHIEVEMENT MAP Canvas 600x380 ─── */
var REP_PIECES=[
  {title:'Twinkle Twinkle',level:1,genre:'Children'},{title:'Minuet (Bach)',level:1,genre:'Baroque'},
  {title:'Gavotte (Gossec)',level:2,genre:'Classical'},{title:'Humoresque (Dvorak)',level:2,genre:'Romantic'},
  {title:'Meditation (Massenet)',level:3,genre:'Romantic'},{title:'Czardas (Monti)',level:3,genre:'Folk'},
  {title:'Salut d&rsquo;Amour',level:3,genre:'Romantic'},{title:'Zigeunerweisen',level:4,genre:'Romantic'},
  {title:'Mendelssohn Concerto',level:4,genre:'Romantic'},{title:'Bruch Concerto',level:4,genre:'Romantic'},
  {title:'Tchaikovsky Concerto',level:5,genre:'Romantic'},{title:'Brahms Concerto',level:5,genre:'Romantic'},
  {title:'Sibelius Concerto',level:5,genre:'Romantic'},{title:'Paganini Caprice 24',level:5,genre:'Romantic'},
  {title:'Bach Partita 2 Chaconne',level:5,genre:'Baroque'},{title:'Prokofiev Concerto 1',level:5,genre:'Modern'},
  {title:'Ravel Tzigane',level:5,genre:'Impressionist'},{title:'Ysaye Sonata 3',level:5,genre:'Modern'},
  {title:'Bartok Concerto 2',level:5,genre:'Modern'},{title:'Berg Concerto',level:5,genre:'Modern'}
];
var repState={completed:{}};
function createRepMapPanel(){
  var d=document.createElement('div');d.id='repMapPanel';
  d.innerHTML='<span class="v17Close" onclick="this.parentNode.classList.remove(&quot;show&quot;)">&times;</span>'+
    '<h3>&#128203; &#47112;&#54140;&#53664;&#47532; &#45804;&#49457;&#47017;</h3>'+
    '<canvas id="repMapCanvas" width="600" height="380"></canvas>'+
    '<div class="v17Info">20&#44257;&#51032; &#47112;&#54140;&#53664;&#47532;&#47484; &#45212;&#51060;&#46020;&#48324;&#47196; &#52628;&#51201;&#54633;&#45768;&#45796;. &#44257;&#51012; &#53364;&#47533;&#54616;&#50668; &#50756;&#47308; &#52376;&#47532;&#54616;&#49464;&#50836;.</div>';
  document.body.appendChild(d);
}
function drawRepMapCanvas(){
  var cv=document.getElementById('repMapCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText('Repertoire Achievement Map',W/2,22);
  var levels=[1,2,3,4,5];var levelNames=['Beginner','Elementary','Intermediate','Advanced','Virtuoso'];
  var colsL=['#4caf50','#8bc34a','#ffc107','#ff9800','#f44336'];
  levels.forEach(function(lv,li){
    var ly=50+li*64;
    ctx.fillStyle='rgba(255,255,255,.03)';ctx.fillRect(10,ly,W-20,56);
    ctx.fillStyle=colsL[li];ctx.font='9px sans-serif';ctx.textAlign='left';
    ctx.fillText('Lv'+lv+' '+levelNames[li],15,ly+12);
    var pieces=REP_PIECES.filter(function(p){return p.level===lv;});
    pieces.forEach(function(pc,pi){
      var px=90+pi*72,py=ly+8;
      var done=repState.completed[pc.title];
      ctx.fillStyle=done?'rgba(76,175,80,.25)':'rgba(255,250,235,.04)';
      ctx.fillRect(px,py,65,40);
      ctx.strokeStyle=done?'rgba(76,175,80,.5)':'rgba(255,215,0,.1)';ctx.lineWidth=0.5;
      ctx.strokeRect(px,py,65,40);
      ctx.fillStyle=done?'#4caf50':'#c9a96e';ctx.font='7px sans-serif';ctx.textAlign='center';
      var shortT=pc.title.length>12?pc.title.substring(0,12)+'..':pc.title;
      ctx.fillText(shortT,px+32,py+16);
      ctx.fillStyle='rgba(201,169,110,.4)';ctx.font='6px sans-serif';
      ctx.fillText(pc.genre,px+32,py+28);
      if(done){ctx.fillStyle='#4caf50';ctx.font='12px sans-serif';ctx.fillText('✓',px+32,py+38);}
    });
  });
  var cnt=Object.keys(repState.completed).length;
  ctx.fillStyle='#ffd700';ctx.font='11px sans-serif';ctx.textAlign='center';
  ctx.fillText('Completed: '+cnt+'/20 ('+Math.round(cnt/20*100)+'%)',W/2,H-10);
  if(cnt>=20)unlockAch('repertoire_20');
  ctx.textAlign='start';
  cv.onclick=function(e){
    var rect=cv.getBoundingClientRect();
    var cxx=(e.clientX-rect.left)*(W/rect.width);
    var cyy=(e.clientY-rect.top)*(H/rect.height);
    levels.forEach(function(lv,li){
      var ly=50+li*64;
      var pieces=REP_PIECES.filter(function(p){return p.level===lv;});
      pieces.forEach(function(pc,pi){
        var px=90+pi*72,py=ly+8;
        if(cxx>=px&&cxx<=px+65&&cyy>=py&&cyy<=py+40){
          repState.completed[pc.title]=true;
          var sp=loadProgress();sp['rep_'+pc.title.replace(/\s/g,'_')]=true;saveProgress(sp);
          v17Sfx('repertoire_done');drawRepMapCanvas();
        }
      });
    });
  };
}

/* ─── 10. MUSICAL EMOTION PALETTE Canvas 520x340 ─── */
var EMOTIONS=[
  {name:'Joy',kr:'기쁨',color:'#ffd700',techniques:['Allegro','Staccato','Major key','Bright tone']},
  {name:'Sorrow',kr:'슬픔',color:'#5c6bc0',techniques:['Adagio','Legato','Minor key','Vibrato']},
  {name:'Anger',kr:'분노',color:'#f44336',techniques:['Fortissimo','Martele','Sforzando','Sul ponticello']},
  {name:'Peace',kr:'평화',color:'#4caf50',techniques:['Piano','Sul tasto','Long bows','Sustained notes']},
  {name:'Longing',kr:'그리움',color:'#ff9800',techniques:['Rubato','Wide vibrato','Portamento','Diminuendo']},
  {name:'Fear',kr:'공포',color:'#9e9e9e',techniques:['Tremolo','Col legno','Glissando','Pianissimo']},
  {name:'Love',kr:'사랑',color:'#e91e63',techniques:['Cantabile','Dolce','Espressivo','Warm vibrato']},
  {name:'Heroic',kr:'영웅적',color:'#ff5722',techniques:['Fortissimo','Brillante','Double stops','Full bow']},
  {name:'Mystery',kr:'신비',color:'#9c27b0',techniques:['Harmonics','Muted','Slow glissando','Pianissimo']},
  {name:'Nostalgia',kr:'향수',color:'#795548',techniques:['Tempo rubato','Decrescendo','Simple melody','Vibrato']},
  {name:'Triumph',kr:'승리',color:'#ffc107',techniques:['Triple stops','Crescendo','Accelerando','Brillante']},
  {name:'Melancholy',kr:'우수',color:'#607d8b',techniques:['Largo','Sotto voce','Dying away','Portato']}
];
var emotionState={used:{}};
function createEmotionPanel(){
  var d=document.createElement('div');d.id='emotionPanel';
  d.innerHTML='<span class="v17Close" onclick="this.parentNode.classList.remove(&quot;show&quot;)">&times;</span>'+
    '<h3>&#127912; &#51020;&#50501; &#44048;&#51221; &#54036;&#47112;&#53944;</h3>'+
    '<canvas id="emotionCanvas" width="520" height="340"></canvas>'+
    '<div class="v17Info">12&#44032;&#51648; &#44048;&#51221;&#51012; &#51020;&#50501;&#51201; &#44592;&#48277;&#51004;&#47196; &#48320;&#54872;&#54633;&#45768;&#45796;. &#44048;&#51221; &#48660;&#47197;&#51012; &#53364;&#47533;&#54616;&#50668; &#53580;&#53356;&#45769;&#51012; &#54869;&#51064;&#54616;&#49464;&#50836;.</div>';
  document.body.appendChild(d);
}
function drawEmotionCanvas(){
  var cv=document.getElementById('emotionCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText('Musical Emotion Palette',W/2,22);
  var cxC=W/2,cyC=170,outerR=120,innerR=50;
  var sliceAngle=2*Math.PI/EMOTIONS.length;
  EMOTIONS.forEach(function(em,i){
    var startA=-Math.PI/2+i*sliceAngle;
    var endA=startA+sliceAngle;
    ctx.beginPath();ctx.moveTo(cxC+Math.cos(startA)*innerR,cyC+Math.sin(startA)*innerR);
    ctx.arc(cxC,cyC,outerR,startA,endA);
    ctx.lineTo(cxC+Math.cos(endA)*innerR,cyC+Math.sin(endA)*innerR);
    ctx.arc(cxC,cyC,innerR,endA,startA,true);
    ctx.closePath();
    ctx.fillStyle=emotionState.used[em.name]?em.color+'90':em.color+'30';
    ctx.fill();
    ctx.strokeStyle=em.color;ctx.lineWidth=emotionState.used[em.name]?2:0.5;ctx.stroke();
    var midA=(startA+endA)/2;
    var labelR=outerR+18;
    var lx=cxC+Math.cos(midA)*labelR,ly=cyC+Math.sin(midA)*labelR;
    ctx.fillStyle=em.color;ctx.font='8px sans-serif';ctx.textAlign='center';
    ctx.fillText(em.kr,lx,ly);
    var iconR=(outerR+innerR)/2;
    var ix=cxC+Math.cos(midA)*iconR,iy=cyC+Math.sin(midA)*iconR;
    ctx.fillStyle='#fff';ctx.font='9px sans-serif';
    ctx.fillText(em.name.substring(0,3),ix,iy+3);
  });
  var usedCnt=Object.keys(emotionState.used).length;
  ctx.fillStyle='#ffd700';ctx.font='11px sans-serif';
  ctx.fillText('Used: '+usedCnt+'/12',W/2,H-12);
  if(usedCnt>=12)unlockAch('emotion_artist');
  ctx.textAlign='start';
  cv.onclick=function(e){
    var rect=cv.getBoundingClientRect();
    var mx=(e.clientX-rect.left)*(W/rect.width)-cxC;
    var my=(e.clientY-rect.top)*(H/rect.height)-cyC;
    var dist=Math.sqrt(mx*mx+my*my);
    if(dist<innerR||dist>outerR+5)return;
    var angle=Math.atan2(my,mx)+Math.PI/2;if(angle<0)angle+=2*Math.PI;
    var idx=Math.floor(angle/sliceAngle);
    if(idx>=0&&idx<EMOTIONS.length){
      emotionState.used[EMOTIONS[idx].name]=true;
      v17Sfx('emotion_set');drawEmotionCanvas();
      var info=document.getElementById('emotionInfo17');
      if(!info){info=document.createElement('div');info.id='emotionInfo17';info.className='v17Info';
        document.getElementById('emotionPanel').appendChild(info);}
      var em=EMOTIONS[idx];
      info.innerHTML='<b style="color:'+em.color+'">'+em.kr+' ('+em.name+')</b><br>'+
        'Techniques: '+em.techniques.join(' / ');
    }
  };
}

/* ─── 11. VIOLIN OLYMPIAD Canvas 540x360 ─── */
var OLYMPIAD_PLAYERS=[
  {name:'Player',kr:'나',skill:0,isUser:true},
  {name:'Paganini Bot',kr:'파가니니',skill:9},
  {name:'Heifetz Bot',kr:'하이페츠',skill:8},
  {name:'Oistrakh Bot',kr:'오이스트라흐',skill:7},
  {name:'Perlman Bot',kr:'펄만',skill:7},
  {name:'Chung Bot',kr:'정경화',skill:8},
  {name:'Mutter Bot',kr:'무터',skill:7},
  {name:'Vengerov Bot',kr:'벤게로프',skill:8}
];
var olympState={bracket:[],round:0,wins:0,totalWins:0};
function createOlympiadPanel(){
  var d=document.createElement('div');d.id='olympiadPanel';
  d.innerHTML='<span class="v17Close" onclick="this.parentNode.classList.remove(&quot;show&quot;)">&times;</span>'+
    '<h3>&#127941; &#48148;&#51060;&#50732;&#47536; &#50732;&#47548;&#54588;&#50500;&#46300;</h3>'+
    '<canvas id="olympiadCanvas" width="540" height="360"></canvas>'+
    '<div class="v17Info">8&#51064; &#53664;&#45320;&#47676;&#53944;. AI &#46972;&#51060;&#48268;&#44284; &#45824;&#44208;&#54616;&#50668; &#50864;&#49849;&#54616;&#49464;&#50836;!</div>'+
    '<div style="margin:6px"><span class="v17Btn" onclick="startOlympiad()">&#9654; &#53664;&#45320;&#47676;&#53944; &#49884;&#51089;</span></div>';
  document.body.appendChild(d);
}
function drawOlympiadCanvas(){
  var cv=document.getElementById('olympiadCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText('Violin Olympiad - Tournament',W/2,22);
  var bracket=olympState.bracket;
  if(!bracket.length){
    ctx.fillStyle='#c9a96e';ctx.font='11px sans-serif';
    ctx.fillText('Press Start to begin tournament',W/2,H/2);
    ctx.textAlign='start';return;
  }
  var roundNames=['Quarter Finals','Semi Finals','Final','Champion!'];
  ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';
  ctx.fillText('Round: '+(olympState.round<3?roundNames[olympState.round]:'Complete'),W/2,42);
  var boxW=100,boxH=24,gap=8;
  var rounds=[[],[],[]];
  for(var ri=0;ri<3;ri++){
    var matchCount=4>>ri;
    for(var mi=0;mi<matchCount;mi++){
      var bx=30+ri*180;
      var totalH=matchCount*(boxH*2+gap*2);
      var by=(H-totalH)/2+mi*(boxH*2+gap*2);
      rounds[ri].push({x:bx,y:by});
    }
  }
  if(bracket[0]){
    bracket[0].forEach(function(match,mi){
      var pos=rounds[0][mi];if(!pos)return;
      [0,1].forEach(function(pi){
        var by=pos.y+pi*(boxH+gap);
        var player=match[pi];
        var isWinner=match.winner===pi;
        ctx.fillStyle=isWinner?'rgba(76,175,80,.2)':player&&player.isUser?'rgba(255,215,0,.1)':'rgba(255,255,255,.04)';
        ctx.fillRect(pos.x,by,boxW,boxH);
        ctx.strokeStyle=isWinner?'rgba(76,175,80,.5)':'rgba(255,215,0,.1)';ctx.lineWidth=0.5;
        ctx.strokeRect(pos.x,by,boxW,boxH);
        ctx.fillStyle=player&&player.isUser?'#ffd700':'#c9a96e';ctx.font='9px sans-serif';ctx.textAlign='left';
        ctx.fillText(player?player.kr:'???',pos.x+6,by+16);
      });
      if(mi<rounds[0].length){
        ctx.strokeStyle='rgba(255,215,0,.1)';ctx.lineWidth=0.5;
        ctx.beginPath();ctx.moveTo(pos.x+boxW,pos.y+boxH/2);ctx.lineTo(pos.x+boxW+20,pos.y+boxH/2+(boxH+gap)/2);ctx.stroke();
        ctx.beginPath();ctx.moveTo(pos.x+boxW,pos.y+boxH+gap+boxH/2);ctx.lineTo(pos.x+boxW+20,pos.y+boxH/2+(boxH+gap)/2);ctx.stroke();
      }
    });
  }
  for(var rr=1;rr<3;rr++){
    if(!bracket[rr])continue;
    bracket[rr].forEach(function(match,mi){
      var pos=rounds[rr][mi];if(!pos)return;
      [0,1].forEach(function(pi){
        var by=pos.y+pi*(boxH+gap);
        var player=match[pi];
        var isWinner=match.winner===pi;
        ctx.fillStyle=isWinner?'rgba(76,175,80,.2)':player&&player.isUser?'rgba(255,215,0,.1)':'rgba(255,255,255,.04)';
        ctx.fillRect(pos.x,by,boxW,boxH);
        ctx.strokeStyle=isWinner?'rgba(76,175,80,.5)':'rgba(255,215,0,.1)';ctx.lineWidth=0.5;
        ctx.strokeRect(pos.x,by,boxW,boxH);
        ctx.fillStyle=player&&player.isUser?'#ffd700':'#c9a96e';ctx.font='9px sans-serif';ctx.textAlign='left';
        ctx.fillText(player?player.kr:'???',pos.x+6,by+16);
      });
    });
  }
  if(olympState.bracket[3]){
    ctx.fillStyle='#ffd700';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
    var champ=olympState.bracket[3];
    ctx.fillText('Champion: '+champ.kr,W/2,H-30);
    if(champ.isUser){ctx.fillText('You Win!',W/2,H-10);}
  }
  ctx.fillStyle='#c9a96e';ctx.font='9px sans-serif';ctx.textAlign='right';
  ctx.fillText('Total wins: '+olympState.totalWins,W-20,H-10);
  ctx.textAlign='start';
}
function startOlympiad(){
  var players=OLYMPIAD_PLAYERS.map(function(p){return Object.assign({},p);});
  players[0].skill=4+Math.floor(Math.random()*5);
  for(var i=players.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=players[i];players[i]=players[j];players[j]=t;}
  var qf=[];for(var q=0;q<4;q++){qf.push([players[q*2],players[q*2+1]]);}
  olympState.bracket=[qf];olympState.round=0;olympState.wins=0;
  drawOlympiadCanvas();
  simulateRound(0);
}
function simulateRound(roundIdx){
  var matches=olympState.bracket[roundIdx];
  var winners=[];
  matches.forEach(function(match){
    var s0=match[0].skill+Math.random()*3;
    var s1=match[1].skill+Math.random()*3;
    if(match[0].isUser)s0+=1;
    match.winner=s0>=s1?0:1;
    winners.push(match[match.winner]);
    if(match[match.winner].isUser)olympState.wins++;
  });
  drawOlympiadCanvas();
  if(winners.length>=2){
    var nextMatches=[];
    for(var w=0;w<winners.length;w+=2){
      if(w+1<winners.length)nextMatches.push([winners[w],winners[w+1]]);
      else nextMatches.push([winners[w],{name:'BYE',kr:'BYE',skill:0}]);
    }
    olympState.bracket.push(nextMatches);
    olympState.round++;
    setTimeout(function(){simulateRound(roundIdx+1);drawOlympiadCanvas();},1200);
  }else{
    olympState.bracket[3]=winners[0];
    if(winners[0]&&winners[0].isUser){
      unlockAch('olympiad_gold');v17Sfx('olympiad_win');
      olympState.totalWins++;
      var p=loadProgress();p.olympiad_wins=(p.olympiad_wins||0)+1;saveProgress(p);
      if(p.olympiad_wins>=3)unlockAch('olympiad_3win');
    }
    drawOlympiadCanvas();
    addHistory('olympiad','Tournament completed. Winner: '+winners[0].kr);
  }
}

/* ─── 12. QUIZ V17 PANEL ─── */
function createQuizV17Panel(){
  var d=document.createElement('div');d.id='quizV17Panel';
  d.innerHTML='<span class="v17Close" onclick="this.parentNode.classList.remove(&quot;show&quot;)">&times;</span>'+
    '<h3>&#10067; v17 &#53300;&#51592;</h3>'+
    '<div class="v17Info" id="quizV17Area">15&#47928;&#54637; 4&#51648;&#49440;&#45796; &#53300;&#51592;&#47484; &#54400;&#50612;&#48372;&#49464;&#50836;.</div>'+
    '<div style="margin:6px"><span class="v17Btn" onclick="startQuizV17()">&#9654; &#53300;&#51592; &#49884;&#51089;</span></div>';
  document.body.appendChild(d);
}
var quizV17State={idx:0,score:0,answered:false};
function startQuizV17(){
  quizV17State={idx:0,score:0,answered:false};
  showQuizV17Q();
}
function showQuizV17Q(){
  var area=document.getElementById('quizV17Area');if(!area)return;
  if(quizV17State.idx>=V17_QUIZ.length){
    var grade=quizV17State.score>=14?'S':quizV17State.score>=12?'A':quizV17State.score>=9?'B':quizV17State.score>=6?'C':'D';
    area.innerHTML='<b>Result: '+quizV17State.score+'/'+V17_QUIZ.length+' ('+grade+')</b>';
    v17Sfx('scale_complete');return;
  }
  var q=V17_QUIZ[quizV17State.idx];
  var html='<div style="margin:6px 0"><b>'+(quizV17State.idx+1)+'. '+q.q+'</b></div>';
  q.a.forEach(function(opt,oi){
    html+='<div class="v17Card" onclick="answerQuizV17('+oi+')">'+opt+'</div>';
  });
  html+='<div style="font-size:9px;color:rgba(201,169,110,.4);margin-top:4px">'+quizV17State.score+'/'+quizV17State.idx+'</div>';
  area.innerHTML=html;quizV17State.answered=false;
}
function answerQuizV17(choice){
  if(quizV17State.answered)return;quizV17State.answered=true;
  var q=V17_QUIZ[quizV17State.idx];
  if(choice===q.c){quizV17State.score++;v17Sfx('intonation_hit');}
  else{v17Sfx('intonation_miss');}
  quizV17State.idx++;
  setTimeout(showQuizV17Q,600);
}

/* ─── 13. REGISTER SONGS, LESSONS, QUIZ TO GLOBAL ─── */
(function registerData(){
  try{
    var gs=JSON.parse(localStorage.getItem('violinSongs')||'[]');
    V17_SONGS.forEach(function(s){if(!gs.find(function(x){return x.id===s.id;}))gs.push(s);});
    localStorage.setItem('violinSongs',JSON.stringify(gs));
  }catch(e){}
  try{
    var gl=JSON.parse(localStorage.getItem('violinLessons')||'[]');
    V17_LESSONS.forEach(function(l){if(!gl.find(function(x){return x.id===l.id;}))gl.push(l);});
    localStorage.setItem('violinLessons',JSON.stringify(gl));
  }catch(e){}
  try{
    var gq=JSON.parse(localStorage.getItem('violinQuizBank')||'[]');
    V17_QUIZ.forEach(function(q){if(!gq.find(function(x){return x.q===q.q;}))gq.push(q);});
    localStorage.setItem('violinQuizBank',JSON.stringify(gq));
  }catch(e){}
})();

/* ─── 14. OPEN FUNCTIONS ─── */
function openInto(){
  if(!document.getElementById('intoPanel'))createIntoPanel();
  document.getElementById('intoPanel').classList.add('show');
  v17Sfx('feature_open17');drawIntoCanvas(0,null,false);
}
function openExcerpt(){
  if(!document.getElementById('excerptPanel'))createExcerptPanel();
  document.getElementById('excerptPanel').classList.add('show');
  v17Sfx('feature_open17');drawExcerptCanvas(0);
}
function openScaleTree(){
  if(!document.getElementById('scaleTreePanel'))createScaleTreePanel();
  document.getElementById('scaleTreePanel').classList.add('show');
  v17Sfx('feature_open17');drawScaleTreeCanvas();
}
function openBowContact(){
  if(!document.getElementById('bowContactPanel'))createBowContactPanel();
  document.getElementById('bowContactPanel').classList.add('show');
  v17Sfx('feature_open17');drawBowContactCanvas();
}
function openEnsemble(){
  if(!document.getElementById('ensemblePanel'))createEnsemblePanel();
  document.getElementById('ensemblePanel').classList.add('show');
  v17Sfx('feature_open17');drawEnsembleCanvas();
}
function openRepMap(){
  if(!document.getElementById('repMapPanel'))createRepMapPanel();
  document.getElementById('repMapPanel').classList.add('show');
  v17Sfx('feature_open17');drawRepMapCanvas();
}
function openEmotion(){
  if(!document.getElementById('emotionPanel'))createEmotionPanel();
  document.getElementById('emotionPanel').classList.add('show');
  v17Sfx('feature_open17');drawEmotionCanvas();
}
function openOlympiad(){
  if(!document.getElementById('olympiadPanel'))createOlympiadPanel();
  document.getElementById('olympiadPanel').classList.add('show');
  v17Sfx('feature_open17');drawOlympiadCanvas();
}
function openQuizV17(){
  if(!document.getElementById('quizV17Panel'))createQuizV17Panel();
  document.getElementById('quizV17Panel').classList.add('show');
  v17Sfx('quiz_v17');
}

/* ─── 15. EXPOSE TO WINDOW ─── */
window.startIntoTraining=startIntoTraining;
window.resetInto=resetInto;
window.selectExcerpt=selectExcerpt;
window.resetScales=resetScales;
window.setBowZone=setBowZone;
window.updateBowContact=updateBowContact;
window.matchEnsemble=matchEnsemble;
window.startOlympiad=startOlympiad;
window.startQuizV17=startQuizV17;
window.answerQuizV17=answerQuizV17;

/* ─── 16. NAVIGATION BAR ─── */
var nav17=document.createElement('div');nav17.className='v17Nav';
var nav17Items=[
  {text:'&#127919; &#51020;&#51221;&#44368;&#51221;',action:openInto},
  {text:'&#127932; &#48156;&#52684;&#44257;',action:openExcerpt},
  {text:'&#127925; &#49828;&#52992;&#51068;',action:openScaleTree},
  {text:'&#127931; &#54876;&#51217;&#51216;',action:openBowContact},
  {text:'&#129309; &#50521;&#49345;&#48660;',action:openEnsemble},
  {text:'&#128203; &#47112;&#54140;&#53664;&#47532;',action:openRepMap},
  {text:'&#127912; &#44048;&#51221;',action:openEmotion},
  {text:'&#127941; &#50732;&#47548;&#54588;&#50500;&#46300;',action:openOlympiad},
  {text:'&#10067; &#53300;&#51592;',action:openQuizV17}
];
nav17Items.forEach(function(item){
  var btn=document.createElement('div');btn.className='v17NavBtn';btn.innerHTML=item.text;
  btn.addEventListener('pointerdown',function(e){e.preventDefault();item.action();});
  nav17.appendChild(btn);
});
document.body.appendChild(nav17);

/* ─── 17. KEYBOARD SHORTCUTS ─── */
document.addEventListener('keydown',function(e){
  if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
  if(!e.shiftKey)return;
  switch(e.key){
    case'A':e.preventDefault();openInto();break;
    case'S':e.preventDefault();openExcerpt();break;
    case'D':e.preventDefault();openScaleTree();break;
    case'F':e.preventDefault();openBowContact();break;
    case'G':e.preventDefault();openEnsemble();break;
    case'H':e.preventDefault();openRepMap();break;
    case'J':e.preventDefault();openEmotion();break;
    case'K':e.preventDefault();openOlympiad();break;
  }
  if(e.key==='Escape'){
    document.querySelectorAll('#intoPanel,#excerptPanel,#scaleTreePanel,#bowContactPanel,#ensemblePanel,#repMapPanel,#emotionPanel,#olympiadPanel,#quizV17Panel').forEach(function(p){p.classList.remove('show');});
  }
});

/* ─── 18. TITLE UPDATE ─── */
var titleEl17=document.querySelector('#hd h1');
if(titleEl17)titleEl17.innerHTML='&#127931; Violin Real <span style="font-size:8px;color:#ff6644;vertical-align:super">v17</span>';
var logoEl17=document.getElementById('logo');if(logoEl17)logoEl17.textContent='Violin Real v17';

/* ─── 19. V17 EXPLORER ACHIEVEMENT CHECK ─── */
(function checkV17Explorer(){
  var featureKeys=['intoPanel','excerptPanel','scaleTreePanel','bowContactPanel','ensemblePanel','repMapPanel','emotionPanel','olympiadPanel'];
  var observer=new MutationObserver(function(){
    var allOpened=featureKeys.every(function(id){return document.getElementById(id);});
    if(allOpened)unlockAch('v17_explorer');
  });
  observer.observe(document.body,{childList:true,subtree:false});
})();

/* ─── 20. INTONATION REFERENCE DATA ─── */
var INTONATION_REFERENCE={
  just:{name:'Just Intonation',desc:'Pure intervals based on harmonic series',corrections:{major3rd:-14,minor3rd:+16,perfect5th:+2,major6th:-16}},
  equal:{name:'Equal Temperament',desc:'All semitones equally divided (piano)',corrections:{}},
  pythagorean:{name:'Pythagorean',desc:'Pure fifths, sharper thirds',corrections:{major3rd:+8,perfect5th:0,minor3rd:-6}}
};
var INTONATION_DRILLS=[
  {name:'Open String Unison',desc:'Match each finger to open string'},
  {name:'Double Stop Check',desc:'Tune intervals against open strings'},
  {name:'Drone Practice',desc:'Play against sustained pitch'},
  {name:'Slow Scale Check',desc:'Each note against tuner reference'},
  {name:'Octave Frame',desc:'1st and 4th finger octave alignment'},
  {name:'Shift Accuracy',desc:'Precise position shifts with pitch check'}
];

/* ─── 21. ORCHESTRA AUDITION TIPS ─── */
var AUDITION_TIPS=[
  {category:'Preparation',tips:['Practice excerpts at different tempos','Record and self-evaluate','Know the orchestral context of each excerpt']},
  {category:'Technical',tips:['Maintain consistent bow speed','Clean shifts between positions','Precise intonation in all registers']},
  {category:'Musical',tips:['Show dynamic range within excerpts','Demonstrate appropriate style for each period','Shape phrases musically even in technical passages']},
  {category:'Mental',tips:['Develop pre-performance routine','Focus on music, not the panel','Treat mistakes as music, keep going']}
];

/* ─── 22. SCALE PRACTICE METHODOLOGY ─── */
var SCALE_METHODS=[
  {name:'Galamian Method',desc:'Systematic scale practice with varied rhythms and bowings',stages:['Separate bows','Slurred groups of 2,4,8','Varied rhythms','3-octave extensions']},
  {name:'Flesch Method',desc:'Daily scale system covering all keys',stages:['Scale','Arpeggio','Double stops 3rds','Double stops 6ths','Double stops octaves']},
  {name:'Simon Fischer Method',desc:'Detailed intonation work within scales',stages:['Finger patterns','Note groups','Shifting within scales','Rhythmic variations']}
];

/* ─── 23. BOW CONTACT PHYSICS ─── */
var BOW_PHYSICS={
  variables:['Contact point','Bow speed','Bow pressure','Bow tilt','Hair width'],
  interactions:[
    {combo:'High pressure + Bridge',result:'Harsh/scratchy - reduce pressure or move away from bridge'},
    {combo:'Low pressure + Fingerboard',result:'Airy/flautando - good for soft passages'},
    {combo:'Medium pressure + Normal point',result:'Full tone - standard playing zone'},
    {combo:'High speed + Low pressure',result:'Ethereal - good for pianissimo'},
    {combo:'Low speed + High pressure',result:'Intense/focused - good for sustained forte'}
  ]
};

/* ─── 24. ENSEMBLE REPERTOIRE RECOMMENDATIONS ─── */
var ENSEMBLE_REPERTOIRE={
  solo:['Bach Partita 2','Paganini Caprice 24','Ysaye Sonata 3','Bartok Sonata'],
  duo:['Beethoven Violin Sonata 5','Mozart K.304','Brahms Violin Sonata 1','Franck Violin Sonata'],
  trio:['Beethoven String Trio Op.3','Mozart Divertimento K.563','Dohnanyi Serenade'],
  quartet:['Beethoven Op.131','Bartok Quartet 4','Ravel F Major','Debussy G Minor'],
  orchestra:['Beethoven Symphony 5','Tchaikovsky Symphony 6','Brahms Symphony 4','Mahler Symphony 5']
};

/* ─── 25. EMOTION-TECHNIQUE MAPPING DETAILS ─── */
var EMOTION_TECHNIQUE_MAP={
  joy:{bowing:'Full strokes, off-string',dynamics:'mf-ff',tempo:'Allegro-Vivace',vibrato:'Fast, narrow',key:'Major'},
  sorrow:{bowing:'Long legato, sustained',dynamics:'pp-mp',tempo:'Adagio-Lento',vibrato:'Slow, wide',key:'Minor'},
  anger:{bowing:'Martele, heavy accents',dynamics:'ff-fff',tempo:'Allegro agitato',vibrato:'Intense, wide',key:'Minor/diminished'},
  peace:{bowing:'Sul tasto, gentle',dynamics:'pp-p',tempo:'Andante-Largo',vibrato:'Minimal',key:'Major/modal'},
  longing:{bowing:'Portamento between notes',dynamics:'p-mf',tempo:'Rubato',vibrato:'Expressive, varying',key:'Minor/modal'},
  fear:{bowing:'Tremolo, col legno',dynamics:'ppp-pp',tempo:'Irregular',vibrato:'None/trembling',key:'Chromatic'}
};

/* ─── 26. OLYMPIAD SCORING CRITERIA ─── */
var OLYMPIAD_CRITERIA=[
  {name:'Intonation',weight:25,desc:'Pitch accuracy across all registers'},
  {name:'Technique',weight:20,desc:'Clean execution of passages'},
  {name:'Musicality',weight:25,desc:'Phrasing, dynamics, and expression'},
  {name:'Tone Quality',weight:15,desc:'Richness and consistency of sound'},
  {name:'Stage Presence',weight:15,desc:'Confidence and communication'}
];

/* ─── 27. REPERTOIRE DIFFICULTY GUIDE ─── */
var DIFFICULTY_GUIDE=[
  {level:1,name:'Beginner',position:'1st only',bowing:'Detache/legato',examples:'Twinkle, Minuet'},
  {level:2,name:'Elementary',position:'1st-3rd',bowing:'+Staccato, Hooked',examples:'Gavotte, Humoresque'},
  {level:3,name:'Intermediate',position:'1st-5th',bowing:'+Spiccato, Martele',examples:'Czardas, Meditation'},
  {level:4,name:'Advanced',position:'1st-7th',bowing:'+Ricochet, Sautille',examples:'Mendelssohn, Bruch'},
  {level:5,name:'Virtuoso',position:'All positions',bowing:'All techniques',examples:'Paganini, Brahms'}
];

/* ─── 28. STATISTICS AND TRACKING ─── */
(function trackV17Stats(){
  var stats=loadProgress();
  if(!stats.v17_first_open){
    stats.v17_first_open=Date.now();
    saveProgress(stats);
  }
  var totalSongs=144,totalLessons=170,totalQuiz=120,totalAch=154;
  if(typeof window.violinStats==='undefined')window.violinStats={};
  window.violinStats.v17={songs:totalSongs,lessons:totalLessons,quiz:totalQuiz,achievements:totalAch,features:8};
})();

/* ─── 29. CONSOLE BANNER ─── */
console.log('%c♪ Violin Real v17.0 loaded ♪','color:#ffd700;font-size:14px;font-weight:bold;background:#1a1020;padding:4px 12px;border-radius:4px;');
console.log('%cv17: Intonation Trainer | Excerpt Library | Scale Tree | Bow Contact | Ensemble Match | Repertoire Map | Emotion Palette | Olympiad','color:#c9a96e;font-size:10px;');
console.log('%c10songs+10lessons+15quiz+12achievements (total 144/170/120/154)','color:#c9a96e;font-size:10px;');

window.VIOLIN_VERSION='17.0';
})();
