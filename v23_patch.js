(function V23Patch(){'use strict';
if(window.__V23_LOADED)return;window.__V23_LOADED=true;

function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(o){var p=loadProgress();for(var k in o)p[k]=o[k];localStorage.setItem('violinProgress',JSON.stringify(p));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'[]');}catch(e){return [];}}
function unlockAch(id){var a=loadAchievements();if(a.indexOf(id)!==-1)return;a.push(id);localStorage.setItem('violinAchievements',JSON.stringify(a));var t=document.getElementById('achToast');if(t){t.textContent='\u{1F3C6} '+id+' 업적 해제!';t.style.display='block';setTimeout(function(){t.style.display='none';},2500);}}
function addHistory(type,text){try{var h=JSON.parse(localStorage.getItem('violinV10_history')||'[]');h.unshift({type:type,text:text,ts:Date.now()});if(h.length>60)h=h.slice(0,60);localStorage.setItem('violinV10_history',JSON.stringify(h));}catch(e){}}

var actx23=null;
function v23Sfx(type){
  try{
    if(!actx23)actx23=new(window.AudioContext||window.webkitAudioContext)();
    var presets={
      string_res:{f:440,w:'sine',a:0.16,d:0.35},
      string_pluck:{f:587,w:'triangle',a:0.14,d:0.2},
      double_stop:{f:523,w:'sine',a:0.13,d:0.28},
      double_match:{f:784,w:'triangle',a:0.16,d:0.3},
      sight_note:{f:659,w:'sine',a:0.12,d:0.15},
      sight_correct:{f:880,w:'triangle',a:0.15,d:0.25},
      sight_wrong:{f:294,w:'sawtooth',a:0.08,d:0.2},
      shift_smooth:{f:698,w:'sine',a:0.14,d:0.22},
      shift_target:{f:932,w:'triangle',a:0.16,d:0.3},
      warmup_start:{f:392,w:'sine',a:0.12,d:0.2},
      warmup_done:{f:1047,w:'triangle',a:0.18,d:0.4},
      orch_part:{f:554,w:'sine',a:0.13,d:0.2},
      orch_score:{f:740,w:'triangle',a:0.15,d:0.25},
      tone_lab:{f:622,w:'sine',a:0.14,d:0.22},
      tone_match:{f:831,w:'triangle',a:0.16,d:0.3},
      quiz_v23:{f:880,w:'triangle',a:0.15,d:0.25},
      quiz_wrong_v23:{f:247,w:'sawtooth',a:0.1,d:0.3},
      achieve_v23:{f:1047,w:'sine',a:0.18,d:0.45},
      nav_v23:{f:494,w:'triangle',a:0.1,d:0.12}
    };
    var pr=presets[type]||presets.nav_v23;
    var osc=actx23.createOscillator();var g=actx23.createGain();
    osc.type=pr.w;osc.frequency.value=pr.f;
    g.gain.setValueAtTime(pr.a,actx23.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,actx23.currentTime+pr.d);
    osc.connect(g);g.connect(actx23.destination);
    osc.start();osc.stop(actx23.currentTime+pr.d+0.05);
  }catch(e){}
}

var V23_SONGS=[
  {id:'s195',title:'타르티니 악마의 소나타',diff:5,genre:'Virtuoso'},
  {id:'s196',title:'바흐 무반주 솔로 소나타 1번 G단조',diff:4,genre:'Baroque'},
  {id:'s197',title:'브루흐 바이올린 협주곡 1번 G단조 Adagio',diff:4,genre:'Romantic'},
  {id:'s198',title:'모차르트 바이올린 소나타 K.304 E단조',diff:3,genre:'Classical'},
  {id:'s199',title:'비탈리 사계 - 겨울 Largo',diff:3,genre:'Baroque'},
  {id:'s200',title:'파가니니 카프리치오 13번',diff:5,genre:'Virtuoso'},
  {id:'s201',title:'생상스 바이올린 협주곡 3번',diff:4,genre:'Romantic'},
  {id:'s202',title:'헨델 라르고',diff:2,genre:'Baroque'},
  {id:'s203',title:'드보르자크 유메레스크',diff:4,genre:'Romantic'},
  {id:'s204',title:'이자이 무반주 소나타 2번',diff:5,genre:'Contemporary'}
];

var V23_LESSONS=[
  {id:'l221',title:'현 공명 원리와 톤 컨트롤',desc:'각 현의 공명 특성을 이해하고 톤을 컨트롤하는 방법'},
  {id:'l222',title:'더블스톱 기초와 음정',desc:'두 음을 동시에 연주하는 기술과 음정 맞추기'},
  {id:'l223',title:'고급 초견 연습 전략',desc:'새로운 악보를 빠르게 읽는 고급 기법들'},
  {id:'l224',title:'포지션 시프팅 테크닉',desc:'포지션 간 부드러운 이동을 위한 트레이닝'},
  {id:'l225',title:'워밍업 루틴 설계',desc:'효과적인 워밍업 루틴을 설계하고 실행하는 방법'},
  {id:'l226',title:'오케스트라 발춨곡 해석',desc:'주요 오케스트라 발춨곡의 음악적 해석과 연주법'},
  {id:'l227',title:'톤 램 과학',desc:'물리학으로 이해하는 바이올린 톤의 원리'},
  {id:'l228',title:'타르티니 악마의 소나타 분석',desc:'타르티니의 대표작의 기법과 음악적 특징'},
  {id:'l229',title:'불협화음과 음정 처리',desc:'불협화음을 접하을 때 음정을 처리하는 방법'},
  {id:'l230',title:'v23 종합 리뷰',desc:'v23에서 배운 모든 기능을 종합적으로 복습합니다'}
];

var V23_QUIZ=[
  {q:'바이올린의 G현은 어떤 특성의 음색을 가지는가?',a:['밝고 날카로운','어둡고 풍부한','부드럽고 겨농스러운','티날하고 이듅한'],c:1},
  {q:'더블스톱을 연주할 때 가장 중요한 것은?',a:['활의 속도','두 음의 음정 맞추기','더 크게 연주하기','빠른 비브라토'],c:1},
  {q:'초견 연주에서 미리 보기(preview)란?',a:['연주 전 악보를 빠르게 훑어보는 것','느리게 연습하는 것','녹음을 듣는 것','선생님이 먼저 연주하는 것'],c:0},
  {q:'포지션 시프팅에서 가이드 노트란?',a:['이동 중 경유하는 음','마지막 음','첫 음','오픈 현 음'],c:0},
  {q:'워밍업 시 스케일 연습을 시작하는 가장 좋은 속도는?',a:['가능한 빠르게','아주 느리게, 정확하게','보통 속도','메트로놈 없이 자유롭게'],c:1},
  {q:'오케스트라 발췌곡에서 &apos;Solo&apos; 표기의 의미는?',a:['혼자 연주하는 부분','조용히 연주','빠르게 연주','반복 연주'],c:0},
  {q:'톤 램(Tone Lab)에서 Sul Ponticello는?',a:['지판 위에서 연주','브릿지 근처에서 연주','활 나무로 연주','손가락으로 타격'],c:1},
  {q:'현 공명(String Resonance)을 인위적으로 만드는 방법은?',a:['공명하는 음 근처의 손가락을 놓는다','활을 더 세게 누른다','미우트를 사용한다','비브라토를 넣는다'],c:0},
  {q:'더블스톱에서 6도 음정은 어떤 느낌인가?',a:['불협화음으로 긴장감','협화음으로 안정감','따뜻하고 부드러운 음색','날카롭고 차가운 음색'],c:2},
  {q:'포지션 시프팅 시 엄지의 역할은?',a:['포지션 간 이동을 안내하는 기준점','활을 잡는 역할','소리를 크게 만드는 역할','비브라토를 넣는 역할'],c:0},
  {q:'워밍업에서 롱톤(long tone) 연습의 목적은?',a:['빠른 손가락 움직임','일정한 활 속도와 압력 유지력 향상','비브라토 연습','빠른 스케일'],c:1},
  {q:'타르티니의 악마의 소나타가 속하는 시대는?',a:['바로크','고전주의','낭만주의','현대'],c:1},
  {q:'오케스트라에서 1st 바이올린과 2nd 바이올린의 차이는?',a:['1st는 멜로디, 2nd는 하모니 중심','완전히 같은 역할','악기가 다르다','위치만 다르다'],c:0},
  {q:'Sul Tasto 주법의 특징은?',a:['브릿지 근처에서 날카롭게','지판 위에서 부드럽고 몭직하게','활 나무로 치는 주법','피치카토 주법'],c:1},
  {q:'연습 시 복잡한 패시지를 나누어 연습하는 방법을 뭔라고 하는가?',a:['블록 연습(block practice)','통주법','복습법','전체 연주법'],c:0}
];

var V23_ACHS=[
  {id:'string_resonance_explorer',title:'현 공명 탐험가',desc:'현 공명 분석기 처음 사용'},
  {id:'double_stop_master',title:'더블스톱 마스터',desc:'더블스톱 트레이너에서 S등급 획득'},
  {id:'sight_reader_adv',title:'고급 초견 리더',desc:'초견 연습기 v2에서 고급 난이도 완료'},
  {id:'shift_navigator',title:'시프팅 네비게이터',desc:'포지션 시프팅 가이드에서 7포지션 모두 연습'},
  {id:'warmup_routine_pro',title:'워밍업 프로',desc:'워밍업 루틴 빌더에서 15분 루틴 완료'},
  {id:'orch_excerpt_scholar',title:'오케스트라 학자',desc:'오케스트라 발춨곡 가이드에서 5곡 이상 연습'},
  {id:'tone_lab_scientist',title:'톤 램 과학자',desc:'톤 램에서 8종 음색 모두 탐험'},
  {id:'song_204',title:'204곡 수집가',desc:'총 204곡 등록 완료'},
  {id:'lesson_230',title:'230레슨 수강생',desc:'총 230개 레슨 등록'},
  {id:'quiz_v23_master',title:'퀴즈 v23 마스터',desc:'v23 퀴즈 전부 정답'},
  {id:'v23_explorer',title:'v23 탐험가',desc:'v23 기능 4개 이상 사용'},
  {id:'v23_complete',title:'v23 완전 정복',desc:'v23 모든 기능 사용 완료'}
];

var css23=document.createElement('style');
css23.textContent='.v23-panel{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:94vw;max-width:680px;max-height:88vh;overflow-y:auto;background:linear-gradient(135deg,#1a1020 0%,#2d1b3d 100%);border:1px solid rgba(212,137,74,.3);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.6);z-index:5200;padding:0;}'
+'.v23-panel.show{display:block;}'
+'.v23-hd{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid rgba(212,137,74,.15);}'
+'.v23-hd h3{margin:0;color:#D4894A;font-size:15px;font-family:Georgia,serif;}'
+'.v23Close{background:none;border:none;color:#D4894A;font-size:20px;cursor:pointer;padding:4px 8px;}'
+'.v23-body{padding:14px 18px;}'
+'.v23-btn{background:linear-gradient(135deg,rgba(212,137,74,.15),rgba(212,137,74,.08));border:1px solid rgba(212,137,74,.25);color:#D4894A;padding:8px 14px;border-radius:10px;cursor:pointer;font-size:13px;margin:4px;transition:all .2s;font-family:Georgia,serif;}'
+'.v23-btn:hover{background:linear-gradient(135deg,rgba(212,137,74,.3),rgba(212,137,74,.15));transform:translateY(-1px);}'
+'.v23-grade{display:inline-block;padding:3px 10px;border-radius:8px;font-weight:bold;font-size:14px;margin:6px 0;}'
+'.v23-info{color:rgba(212,137,74,.7);font-size:12px;margin:6px 0;line-height:1.5;font-family:Georgia,serif;}'
+'.v23-quiz-opt{display:block;width:90%;margin:6px auto;padding:10px 14px;background:rgba(212,137,74,.08);border:1px solid rgba(212,137,74,.2);border-radius:10px;color:#D4894A;cursor:pointer;text-align:left;font-size:13px;transition:all .2s;font-family:Georgia,serif;}'
+'.v23-quiz-opt:hover{background:rgba(212,137,74,.18);}';
document.head.appendChild(css23);

function makePanel23(id,title){
  var p=document.createElement('div');p.className='v23-panel';p.id=id;
  p.innerHTML='<div class="v23-hd"><h3>'+title+'</h3><button class="v23Close">×</button></div><div class="v23-body"></div>';
  p.querySelector('.v23Close').onclick=function(){p.classList.remove('show');};
  document.body.appendChild(p);return p;
}
function mkCv23(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;c.style.cssText='width:100%;max-width:'+w+'px;height:auto;border-radius:10px;display:block;margin:10px auto;background:rgba(0,0,0,.2);';return c;}

// ===== FEATURE 1: 현 공명 분석기 (String Resonance Analyzer) =====
function createStringResonancePanel(){
  var panel=makePanel23('v23StringResonance','🎻 현 공명 분석기');
  var body=panel.querySelector('.v23-body');
  var cv=mkCv23(620,400);body.appendChild(cv);
  var info=document.createElement('div');info.className='v23-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var strings=['G3','D4','A4','E5'];
  var stringFreqs=[196,293.66,440,659.25];
  var harmonics=[1,2,3,4,5,6,7,8];
  var curString=0;var resData=[];
  strings.forEach(function(s,i){
    var btn=document.createElement('button');btn.className='v23-btn';btn.textContent=s+'현';
    btn.onclick=function(){curString=i;scanResonance();v23Sfx('string_res');};
    btnRow.appendChild(btn);
  });
  var scanBtn=document.createElement('button');scanBtn.className='v23-btn';scanBtn.textContent='전체 스캔';
  scanBtn.onclick=function(){scanAll();v23Sfx('string_pluck');};
  btnRow.appendChild(scanBtn);
  body.appendChild(btnRow);

  function scanResonance(){
    resData=[];
    for(var h=0;h<harmonics.length;h++){
      var amp=1/(harmonics[h]*0.8)*(0.7+Math.random()*0.6);
      var decay=0.95-harmonics[h]*0.08+Math.random()*0.1;
      resData.push({harmonic:harmonics[h],freq:(stringFreqs[curString]*harmonics[h]).toFixed(0),amplitude:amp,decay:Math.max(0.3,decay)});
    }
    draw();
    trackV23Use('stringRes');unlockAch('string_resonance_explorer');
    addHistory('v23','현 공명 분석: '+strings[curString]+'현');
  }
  function scanAll(){curString=0;scanResonance();}
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='rgba(212,137,74,.03)';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('현 공명 분석기 - '+strings[curString]+'현 ('+stringFreqs[curString]+' Hz)',310,25);
    if(resData.length===0){ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='13px Georgia';ctx.fillText('현을 선택하여 스캔을 시작하세요',310,200);return;}
    var barW=55,gap=12,startX=50,startY=50,maxH=150;
    for(var i=0;i<resData.length;i++){
      var x=startX+i*(barW+gap);var h=resData[i].amplitude*maxH;
      var hue=30+i*15;
      ctx.fillStyle='hsla('+hue+',70%,55%,.7)';
      ctx.beginPath();ctx.roundRect(x,startY+maxH-h,barW,h,4);ctx.fill();
      ctx.fillStyle='rgba(212,137,74,.8)';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(resData[i].harmonic+'배음',x+barW/2,startY+maxH+14);
      ctx.fillStyle='rgba(212,137,74,.5)';ctx.fillText(resData[i].freq+'Hz',x+barW/2,startY+maxH+28);
      ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.fillText((resData[i].amplitude*100).toFixed(0)+'%',x+barW/2,startY+maxH-h-5);
    }
    ctx.strokeStyle='rgba(212,137,74,.2)';ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(startX,startY+maxH);ctx.lineTo(startX+8*(barW+gap),startY+maxH);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='left';
    ctx.fillText('공명 감쇠 특성',50,260);
    for(var i=0;i<4;i++){
      var y=280+i*28;var d=resData[i];
      ctx.fillStyle='rgba(212,137,74,.6)';ctx.font='11px Georgia';
      ctx.fillText(d.harmonic+'배음 ('+d.freq+'Hz)',50,y+10);
      var bw=d.decay*250;
      ctx.fillStyle='hsla('+(30+i*20)+',60%,50%,.5)';
      ctx.beginPath();ctx.roundRect(200,y,bw,16,4);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='10px Georgia';ctx.textAlign='right';
      ctx.fillText((d.decay*100).toFixed(0)+'%',200+bw-3,y+12);ctx.textAlign='left';
    }
    var totalAmp=0;for(var i=0;i<resData.length;i++)totalAmp+=resData[i].amplitude;
    var richness=Math.min(100,totalAmp*25);
    var grade=richness>=85?'S':richness>=70?'A':richness>=55?'B':richness>=40?'C':'D';
    var gc=grade==='S'?'#FFD700':grade==='A'?'#4CAF50':grade==='B'?'#2196F3':grade==='C'?'#FF9800':'#F44336';
    ctx.fillStyle=gc;ctx.font='bold 16px Georgia';ctx.textAlign='center';
    ctx.fillText('공명 풍부도: '+grade+' ('+richness.toFixed(0)+'%)',310,390);
    info.textContent=strings[curString]+'현 공명 분석 - 8배음 스펙트럼, 공명 풍부도: '+richness.toFixed(0)+'% ('+grade+'등급)';
  }
  draw();
}

// ===== FEATURE 2: 더블스톱 트레이너 =====
function createDoubleStopPanel(){
  var panel=makePanel23('v23DoubleStop','🎶 더블스톱 트레이너');
  var body=panel.querySelector('.v23-body');
  var cv=mkCv23(600,380);body.appendChild(cv);
  var info=document.createElement('div');info.className='v23-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var intervals=[
    {name:'3도',ratio:'5:4',cents:386,diff:2,color:'rgba(76,175,80,.7)'},
    {name:'4도',ratio:'4:3',cents:498,diff:2,color:'rgba(33,150,243,.7)'},
    {name:'5도',ratio:'3:2',cents:702,diff:1,color:'rgba(156,39,176,.7)'},
    {name:'6도',ratio:'5:3',cents:884,diff:3,color:'rgba(255,152,0,.7)'},
    {name:'8도',ratio:'2:1',cents:1200,diff:1,color:'rgba(244,67,54,.7)'},
    {name:'단3도',ratio:'6:5',cents:316,diff:3,color:'rgba(0,150,136,.7)'}
  ];
  var scores=[];var totalAttempts=0;var curInterval=0;
  intervals.forEach(function(intv,i){
    var btn=document.createElement('button');btn.className='v23-btn';btn.textContent=intv.name;
    btn.onclick=function(){curInterval=i;practice();};
    btnRow.appendChild(btn);
  });
  body.appendChild(btnRow);

  function practice(){
    var intv=intervals[curInterval];
    var accuracy=60+Math.random()*40;
    var dev=Math.random()*20-10;
    if(!scores[curInterval])scores[curInterval]=[];
    scores[curInterval].push({acc:accuracy,dev:dev});
    if(scores[curInterval].length>20)scores[curInterval]=scores[curInterval].slice(-20);
    totalAttempts++;
    v23Sfx(accuracy>80?'double_match':'double_stop');
    draw();
    trackV23Use('doubleStop');
    var allPracticed=true;for(var i=0;i<intervals.length;i++){if(!scores[i]||scores[i].length===0)allPracticed=false;}
    if(allPracticed){
      var avgAll=0,cnt=0;
      for(var i=0;i<intervals.length;i++){if(scores[i]){for(var j=0;j<scores[i].length;j++){avgAll+=scores[i][j].acc;cnt++;}}}
      if(cnt>0&&avgAll/cnt>=90)unlockAch('double_stop_master');
    }
    addHistory('v23','더블스톱 연습: '+intv.name+' 정확도 '+accuracy.toFixed(0)+'%');
  }
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='rgba(212,137,74,.03)';ctx.fillRect(0,0,600,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('더블스톱 트레이너 - 음정 정확도',300,25);
    var barW=75,gap=12,startX=35,startY=50,maxH=130;
    for(var i=0;i<intervals.length;i++){
      var x=startX+i*(barW+gap);
      var avg=0;
      if(scores[i]&&scores[i].length>0){
        for(var j=0;j<scores[i].length;j++)avg+=scores[i][j].acc;
        avg/=scores[i].length;
      }
      var h=avg*maxH/100;
      ctx.fillStyle=intervals[i].color;
      ctx.beginPath();ctx.roundRect(x,startY+maxH-h,barW,h,4);ctx.fill();
      ctx.fillStyle='rgba(212,137,74,.7)';ctx.font='11px Georgia';ctx.textAlign='center';
      ctx.fillText(intervals[i].name,x+barW/2,startY+maxH+14);
      ctx.fillStyle='rgba(212,137,74,.5)';ctx.fillText(intervals[i].ratio,x+barW/2,startY+maxH+28);
      if(avg>0){ctx.fillStyle='#fff';ctx.font='10px Georgia';ctx.fillText(avg.toFixed(0)+'%',x+barW/2,startY+maxH-h-5);}
    }
    ctx.strokeStyle='rgba(76,175,80,.3)';ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(startX,startY+maxH-maxH*0.8);ctx.lineTo(startX+6*(barW+gap),startY+maxH-maxH*0.8);ctx.stroke();
    ctx.fillStyle='rgba(76,175,80,.5)';ctx.font='10px Georgia';ctx.textAlign='left';ctx.fillText('80% 목표',startX+6*(barW+gap)+5,startY+maxH-maxH*0.8+4);ctx.setLineDash([]);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='left';
    ctx.fillText('최근 음정 편차 추이 ('+intervals[curInterval].name+')',35,230);
    if(scores[curInterval]&&scores[curInterval].length>1){
      var pts=scores[curInterval];var lineStartX=50,lineY=280,lineW=500,lineH=60;
      ctx.strokeStyle=intervals[curInterval].color;ctx.lineWidth=2;ctx.beginPath();
      for(var i=0;i<pts.length;i++){
        var px=lineStartX+i*(lineW/(pts.length-1||1));
        var py=lineY-pts[i].dev*lineH/20;
        if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }
      ctx.stroke();ctx.lineWidth=1;
      ctx.strokeStyle='rgba(212,137,74,.15)';ctx.beginPath();ctx.moveTo(lineStartX,lineY);ctx.lineTo(lineStartX+lineW,lineY);ctx.stroke();
      ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='10px Georgia';ctx.textAlign='right';
      ctx.fillText('+10\xA2',lineStartX-5,lineY-lineH/2+3);ctx.fillText('0\xA2',lineStartX-5,lineY+3);ctx.fillText('-10\xA2',lineStartX-5,lineY+lineH/2+3);
    }
    var totalAvg=0,totalCnt=0;
    for(var i=0;i<intervals.length;i++){if(scores[i]){for(var j=0;j<scores[i].length;j++){totalAvg+=scores[i][j].acc;totalCnt++;}}}
    if(totalCnt>0)totalAvg/=totalCnt;
    var grade=totalAvg>=90?'S':totalAvg>=80?'A':totalAvg>=70?'B':totalAvg>=60?'C':'D';
    var gc=grade==='S'?'#FFD700':grade==='A'?'#4CAF50':grade==='B'?'#2196F3':grade==='C'?'#FF9800':'#F44336';
    ctx.fillStyle=gc;ctx.font='bold 16px Georgia';ctx.textAlign='center';
    ctx.fillText('종합: '+grade+' ('+totalAvg.toFixed(0)+'%) | 총 '+totalAttempts+'회 연습',300,370);
    info.textContent='더블스톱 연습 - '+intervals[curInterval].name+' 음정 | 총 '+totalAttempts+'회';
  }
  draw();
}

// ===== FEATURE 3: 초견 연습기 v2 (Advanced Sight-Reading) =====
function createSightReadingV2Panel(){
  var panel=makePanel23('v23SightReadV2','📋 고급 초견 연습기');
  var body=panel.querySelector('.v23-body');
  var cv=mkCv23(620,380);body.appendChild(cv);
  var info=document.createElement('div');info.className='v23-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var levels=['입문','초급','중급','고급','마스터'];
  var curLevel=0;var history23=[];var currentNotes=[];var curNoteIdx=0;var answered=0;var correct=0;
  var noteNames=['C','D','E','F','G','A','B'];
  levels.forEach(function(l,i){
    var btn=document.createElement('button');btn.className='v23-btn';btn.textContent=l;
    btn.onclick=function(){curLevel=i;startRound();};
    btnRow.appendChild(btn);
  });
  var ansRow=document.createElement('div');ansRow.style.cssText='text-align:center;margin-top:8px;';
  noteNames.forEach(function(n){
    var btn=document.createElement('button');btn.className='v23-btn';btn.textContent=n;
    btn.style.minWidth='40px';
    btn.onclick=function(){checkAnswer(n);};
    ansRow.appendChild(btn);
  });
  body.appendChild(btnRow);body.appendChild(ansRow);

  function startRound(){
    var count=5+curLevel*2;currentNotes=[];curNoteIdx=0;answered=0;correct=0;
    for(var i=0;i<count;i++){
      var oct=3+Math.floor(Math.random()*(2+curLevel));
      currentNotes.push({note:noteNames[Math.floor(Math.random()*7)],oct:Math.min(oct,6),status:0});
    }
    v23Sfx('sight_note');draw();
    trackV23Use('sightReadV2');
  }
  function checkAnswer(note){
    if(curNoteIdx>=currentNotes.length)return;
    var cur=currentNotes[curNoteIdx];
    if(note===cur.note){cur.status=1;correct++;v23Sfx('sight_correct');}
    else{cur.status=-1;v23Sfx('sight_wrong');}
    answered++;curNoteIdx++;
    if(curNoteIdx>=currentNotes.length){
      var pct=correct/answered*100;
      history23.push({level:curLevel,pct:pct});
      if(history23.length>30)history23=history23.slice(-30);
      if(curLevel>=3&&pct>=80)unlockAch('sight_reader_adv');
      addHistory('v23','초견 v2: '+levels[curLevel]+' '+pct.toFixed(0)+'%');
    }
    draw();
  }
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,380);
    ctx.fillStyle='rgba(212,137,74,.03)';ctx.fillRect(0,0,620,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('고급 초견 연습기 - '+levels[curLevel]+' 난이도',310,25);
    if(currentNotes.length===0){ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='13px Georgia';ctx.fillText('난이도를 선택하여 시작하세요',310,120);return;}
    var staffY=60,lineGap=10;
    for(var l=0;l<5;l++){ctx.strokeStyle='rgba(212,137,74,.25)';ctx.beginPath();ctx.moveTo(30,staffY+l*lineGap);ctx.lineTo(590,staffY+l*lineGap);ctx.stroke();}
    ctx.fillStyle='rgba(212,137,74,.6)';ctx.font='bold 28px serif';ctx.textAlign='left';ctx.fillText('𝄞',35,staffY+3*lineGap+4);
    var noteX=90,noteGap=Math.min(60,480/currentNotes.length);
    for(var i=0;i<currentNotes.length;i++){
      var x=noteX+i*noteGap;
      var noteIdx=noteNames.indexOf(currentNotes[i].note);
      var yPos=staffY+4*lineGap-(noteIdx*lineGap/2)-(currentNotes[i].oct-4)*3.5*lineGap;
      yPos=Math.max(staffY-20,Math.min(staffY+5*lineGap+20,yPos));
      var color=currentNotes[i].status===1?'rgba(76,175,80,.8)':currentNotes[i].status===-1?'rgba(244,67,54,.8)':i===curNoteIdx?'rgba(255,215,0,.9)':'rgba(212,137,74,.5)';
      ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,yPos,8,6,0,0,Math.PI*2);ctx.fill();
      if(currentNotes[i].status!==0){ctx.fillStyle=color;ctx.font='9px Georgia';ctx.textAlign='center';ctx.fillText(currentNotes[i].note+currentNotes[i].oct,x,yPos+16);}
    }
    if(curNoteIdx<currentNotes.length){
      ctx.fillStyle='rgba(255,215,0,.3)';ctx.beginPath();
      var hx=noteX+curNoteIdx*noteGap;ctx.arc(hx,staffY+2*lineGap,18,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='left';ctx.fillText('성적 추이',50,180);
    if(history23.length>1){
      ctx.strokeStyle='rgba(212,137,74,.6)';ctx.lineWidth=2;ctx.beginPath();
      var graphX=50,graphY=200,graphW=520,graphH=80;
      for(var i=0;i<history23.length;i++){
        var px=graphX+i*(graphW/(history23.length-1||1));
        var py=graphY+graphH-history23[i].pct*graphH/100;
        if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }
      ctx.stroke();ctx.lineWidth=1;
      ctx.strokeStyle='rgba(76,175,80,.2)';ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(graphX,graphY+graphH*0.2);ctx.lineTo(graphX+graphW,graphY+graphH*0.2);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(76,175,80,.4)';ctx.font='10px Georgia';ctx.fillText('80%',graphX+graphW+5,graphY+graphH*0.2+4);
    }
    var pct=answered>0?correct/answered*100:0;
    ctx.fillStyle=pct>=80?'#4CAF50':pct>=60?'#FF9800':'#F44336';ctx.font='bold 15px Georgia';ctx.textAlign='center';
    ctx.fillText('정답: '+correct+'/'+answered+(answered>0?' ('+pct.toFixed(0)+'%)':''),310,360);
    info.textContent=levels[curLevel]+' 난이도 | '+correct+'/'+answered+' 정답 | 총 '+history23.length+'회 연습';
  }
  draw();
}

// ===== FEATURE 4: 포지션 시프팅 가이드 =====
function createPositionShiftPanel(){
  var panel=makePanel23('v23PositionShift','⬆️ 포지션 시프팅 가이드');
  var body=panel.querySelector('.v23-body');
  var cv=mkCv23(620,400);body.appendChild(cv);
  var info=document.createElement('div');info.className='v23-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var positions=[
    {name:'1st',range:'G3-B4',notes:['G3','A3','B3','C4','D4','E4','F4','G4','A4','B4'],color:'rgba(76,175,80,.6)'},
    {name:'2nd',range:'A3-C#5',notes:['A3','B3','C#4','D4','E4','F#4','G4','A4','B4','C#5'],color:'rgba(33,150,243,.6)'},
    {name:'3rd',range:'B3-D5',notes:['B3','C4','D4','E4','F#4','G4','A4','B4','C5','D5'],color:'rgba(156,39,176,.6)'},
    {name:'4th',range:'C4-E5',notes:['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'],color:'rgba(255,152,0,.6)'},
    {name:'5th',range:'D4-F#5',notes:['D4','E4','F#4','G4','A4','B4','C5','D5','E5','F#5'],color:'rgba(244,67,54,.6)'},
    {name:'6th',range:'E4-G#5',notes:['E4','F#4','G#4','A4','B4','C#5','D5','E5','F#5','G#5'],color:'rgba(0,150,136,.6)'},
    {name:'7th',range:'F4-A5',notes:['F4','G4','A4','Bb4','C5','D5','E5','F5','G5','A5'],color:'rgba(121,85,72,.6)'}
  ];
  var curPos=0;var shiftScores=[];var practiced=[];
  positions.forEach(function(p,i){
    var btn=document.createElement('button');btn.className='v23-btn';btn.textContent=p.name;
    btn.onclick=function(){curPos=i;practiceShift();};
    btnRow.appendChild(btn);
  });
  body.appendChild(btnRow);

  function practiceShift(){
    var score=55+Math.random()*45;
    if(!shiftScores[curPos])shiftScores[curPos]=[];
    shiftScores[curPos].push(score);
    if(shiftScores[curPos].length>15)shiftScores[curPos]=shiftScores[curPos].slice(-15);
    if(practiced.indexOf(curPos)===-1)practiced.push(curPos);
    v23Sfx(score>75?'shift_target':'shift_smooth');
    if(practiced.length>=7)unlockAch('shift_navigator');
    draw();
    trackV23Use('posShift');
    addHistory('v23','시프팅 연습: '+positions[curPos].name+' '+score.toFixed(0)+'%');
  }
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='rgba(212,137,74,.03)';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('포지션 시프팅 가이드',310,25);
    var neckX=50,neckY=50,neckW=520,neckH=100;
    ctx.fillStyle='rgba(139,94,60,.2)';ctx.beginPath();ctx.roundRect(neckX,neckY,neckW,neckH,8);ctx.fill();
    ctx.strokeStyle='rgba(212,137,74,.3)';ctx.beginPath();ctx.roundRect(neckX,neckY,neckW,neckH,8);ctx.stroke();
    var strings4=['E5','A4','D4','G3'];
    for(var s=0;s<4;s++){
      var sy=neckY+15+s*22;
      ctx.strokeStyle='rgba(212,137,74,'+(0.3+s*0.1)+')';ctx.lineWidth=1+s*0.3;
      ctx.beginPath();ctx.moveTo(neckX,sy);ctx.lineTo(neckX+neckW,sy);ctx.stroke();
      ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='9px Georgia';ctx.textAlign='right';
      ctx.fillText(strings4[s],neckX-5,sy+3);
    }ctx.lineWidth=1;
    var posW=neckW/7;
    for(var i=0;i<7;i++){
      var px=neckX+i*posW;
      ctx.fillStyle=i===curPos?positions[i].color:'rgba(212,137,74,.05)';
      ctx.beginPath();ctx.roundRect(px+2,neckY+2,posW-4,neckH-4,4);ctx.fill();
      ctx.strokeStyle=i===curPos?'rgba(255,255,255,.3)':'rgba(212,137,74,.15)';
      ctx.beginPath();ctx.roundRect(px+2,neckY+2,posW-4,neckH-4,4);ctx.stroke();
      ctx.fillStyle=i===curPos?'#fff':'rgba(212,137,74,.5)';ctx.font='bold 11px Georgia';ctx.textAlign='center';
      ctx.fillText(positions[i].name,px+posW/2,neckY+neckH+16);
    }
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='left';
    ctx.fillText('포지션별 정확도',50,190);
    for(var i=0;i<positions.length;i++){
      var y=210+i*24;var avg=0;
      if(shiftScores[i]&&shiftScores[i].length>0){for(var j=0;j<shiftScores[i].length;j++)avg+=shiftScores[i][j];avg/=shiftScores[i].length;}
      ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='11px Georgia';ctx.fillText(positions[i].name,50,y+12);
      ctx.fillStyle='rgba(212,137,74,.1)';ctx.beginPath();ctx.roundRect(100,y,400,16,4);ctx.fill();
      if(avg>0){
        ctx.fillStyle=positions[i].color;ctx.beginPath();ctx.roundRect(100,y,avg*4,16,4);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='10px Georgia';ctx.textAlign='right';ctx.fillText(avg.toFixed(0)+'%',100+avg*4-3,y+12);ctx.textAlign='left';
      }
    }
    ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='11px Georgia';ctx.textAlign='center';
    ctx.fillText('연습한 포지션: '+practiced.length+'/7',310,395);
    info.textContent=positions[curPos].name+' 포지션 (음역: '+positions[curPos].range+') | 연습 완료: '+practiced.length+'/7';
  }
  draw();
}

// ===== FEATURE 5: 워밍업 루틴 빌더 =====
function createWarmupBuilderPanel(){
  var panel=makePanel23('v23WarmupBuilder','🔥 워밍업 루틴 빌더');
  var body=panel.querySelector('.v23-body');
  var cv=mkCv23(600,380);body.appendChild(cv);
  var info=document.createElement('div');info.className='v23-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var exercises=[
    {name:'오픈 현 롱톤',dur:2,cat:'tone',icon:'🎵'},
    {name:'슬로우 스케일',dur:3,cat:'finger',icon:'🤚'},
    {name:'비브라토 움',dur:2,cat:'vibrato',icon:'〰️'},
    {name:'보잉 스트로크',dur:2,cat:'bow',icon:'🏹'},
    {name:'더블스톱 3도',dur:3,cat:'inton',icon:'🎶'},
    {name:'포지션 시프트',dur:2,cat:'shift',icon:'⬆️'},
    {name:'리듬 태핑',dur:2,cat:'rhythm',icon:'🥁'},
    {name:'활 바운스',dur:2,cat:'bow',icon:'⭕'},
    {name:'크로매틱 스케일',dur:3,cat:'finger',icon:'🎹'},
    {name:'현 교차 연습',dur:2,cat:'cross',icon:'⇄'},
    {name:'아르페지오',dur:3,cat:'finger',icon:'🌟'},
    {name:'스피카토 연습',dur:2,cat:'bow',icon:'⚡'}
  ];
  var routine=[];var totalMin=0;var completed=[];
  var timeOptions=[10,15,20,30];
  timeOptions.forEach(function(t){
    var btn=document.createElement('button');btn.className='v23-btn';btn.textContent=t+'분 루틴';
    btn.onclick=function(){generateRoutine(t);};
    btnRow.appendChild(btn);
  });
  var startBtn=document.createElement('button');startBtn.className='v23-btn';startBtn.textContent='▶ 시작';startBtn.style.background='rgba(76,175,80,.2)';
  startBtn.onclick=function(){startRoutine();};
  btnRow.appendChild(startBtn);
  body.appendChild(btnRow);

  function generateRoutine(mins){
    routine=[];totalMin=mins;completed=[];
    var remaining=mins;var used=[];
    while(remaining>0){
      var avail=exercises.filter(function(e,i){return used.indexOf(i)===-1&&e.dur<=remaining;});
      if(avail.length===0)break;
      var pick=Math.floor(Math.random()*avail.length);
      var idx=exercises.indexOf(avail[pick]);
      routine.push({ex:avail[pick],done:false});
      used.push(idx);remaining-=avail[pick].dur;
    }
    v23Sfx('warmup_start');draw();
    trackV23Use('warmup');
    addHistory('v23','워밍업 '+mins+'분 루틴 생성');
  }
  function startRoutine(){
    if(routine.length===0)return;
    for(var i=0;i<routine.length;i++){
      if(!routine[i].done){routine[i].done=true;completed.push(i);break;}
    }
    var allDone=true;for(var i=0;i<routine.length;i++){if(!routine[i].done)allDone=false;}
    if(allDone){v23Sfx('warmup_done');if(totalMin>=15)unlockAch('warmup_routine_pro');}
    else{v23Sfx('warmup_start');}
    draw();
  }
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='rgba(212,137,74,.03)';ctx.fillRect(0,0,600,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('워밍업 루틴 빌더'+(totalMin>0?' ('+totalMin+'분)':''),300,25);
    if(routine.length===0){ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='13px Georgia';ctx.fillText('시간을 선택하여 루틴을 생성하세요',300,150);return;}
    var cols=2,itemW=260,itemH=48,gapX=20,gapY=8,startX=30,startY=45;
    for(var i=0;i<routine.length;i++){
      var col=i%cols,row=Math.floor(i/cols);
      var x=startX+col*(itemW+gapX),y=startY+row*(itemH+gapY);
      ctx.fillStyle=routine[i].done?'rgba(76,175,80,.15)':'rgba(212,137,74,.08)';
      ctx.beginPath();ctx.roundRect(x,y,itemW,itemH,8);ctx.fill();
      ctx.strokeStyle=routine[i].done?'rgba(76,175,80,.4)':'rgba(212,137,74,.2)';
      ctx.beginPath();ctx.roundRect(x,y,itemW,itemH,8);ctx.stroke();
      ctx.fillStyle=routine[i].done?'rgba(76,175,80,.8)':'rgba(212,137,74,.7)';ctx.font='13px Georgia';ctx.textAlign='left';
      ctx.fillText(routine[i].ex.icon+' '+routine[i].ex.name,x+10,y+20);
      ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='10px Georgia';
      ctx.fillText(routine[i].ex.dur+'분 | '+routine[i].ex.cat,x+10,y+38);
      if(routine[i].done){ctx.fillStyle='rgba(76,175,80,.8)';ctx.font='bold 16px Georgia';ctx.textAlign='right';ctx.fillText('✓',x+itemW-10,y+30);ctx.textAlign='left';}
    }
    var doneCount=0;for(var i=0;i<routine.length;i++){if(routine[i].done)doneCount++;}
    var pct=routine.length>0?doneCount/routine.length*100:0;
    var barY=340,barW=400;
    ctx.fillStyle='rgba(212,137,74,.1)';ctx.beginPath();ctx.roundRect(100,barY,barW,20,6);ctx.fill();
    ctx.fillStyle='rgba(76,175,80,.6)';ctx.beginPath();ctx.roundRect(100,barY,barW*pct/100,20,6);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 12px Georgia';ctx.textAlign='center';
    ctx.fillText(doneCount+'/'+routine.length+' 완료 ('+pct.toFixed(0)+'%)',300,barY+14);
    info.textContent=totalMin+'분 루틴 | '+doneCount+'/'+routine.length+' 운동 완료 | ▶ 버튼으로 다음 운동 시작';
  }
  draw();
}

// ===== FEATURE 6: 오케스트라 발춨곡 가이드 =====
function createOrchExcerptPanel(){
  var panel=makePanel23('v23OrchExcerpt','🎼 오케스트라 발춨곡 가이드');
  var body=panel.querySelector('.v23-body');
  var cv=mkCv23(620,400);body.appendChild(cv);
  var info=document.createElement('div');info.className='v23-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var excerpts=[
    {title:'베토벤 교향곡 5번',composer:'Beethoven',mvt:'1악장',diff:4,technique:'정확한 리듬과 앵콘트',tips:'페르마타 감각, 보익 배분 주의'},
    {title:'차이콜프스키 교향곡 5번',composer:'Tchaikovsky',mvt:'2악장',diff:3,technique:'서정적 멜로디',tips:'비브라토 표현, 다이나믹 조절'},
    {title:'브람스 교향곡 4번',composer:'Brahms',mvt:'4악장',diff:5,technique:'복잡한 리듬과 행진풍',tips:'테크닉 패시지 분리 연습'},
    {title:'드보르자크 신세계 교향곡',composer:'Dvoř\xe1k',mvt:'2악장',diff:3,technique:'발레 멜로디',tips:'톤 컨트롤, 프레이징'},
    {title:'말러 교향곡 1번',composer:'Mahler',mvt:'1악장',diff:4,technique:'장대한 오프닝',tips:'미세한 활 압력 변화'},
    {title:'멘델스존 교향곡 4번 이탈리아',composer:'Mendelssohn',mvt:'4악장',diff:5,technique:'빠른 패시지 움',tips:'경쿨한 보익, 정확한 음정'},
    {title:'시벨리우스 교향곡 2번',composer:'Sibelius',mvt:'1악장',diff:4,technique:'믴의 북유럽 음색',tips:'드라마틱 다이나믹스'},
    {title:'스트라빈스키 보의 제전',composer:'Stravinsky',mvt:'봄',diff:5,technique:'비정형 리듬',tips:'리듬 정확성, 새로운 음색 탐구'}
  ];
  var curExcerpt=0;var practiced23=[];
  excerpts.forEach(function(ex,i){
    var btn=document.createElement('button');btn.className='v23-btn';btn.textContent=(i+1)+'';btn.style.minWidth='36px';
    btn.onclick=function(){curExcerpt=i;studyExcerpt();};
    btnRow.appendChild(btn);
  });
  body.appendChild(btnRow);

  function studyExcerpt(){
    if(practiced23.indexOf(curExcerpt)===-1)practiced23.push(curExcerpt);
    v23Sfx('orch_part');
    if(practiced23.length>=5)unlockAch('orch_excerpt_scholar');
    draw();trackV23Use('orchExcerpt');
    addHistory('v23','발춨곡 연습: '+excerpts[curExcerpt].title);
  }
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='rgba(212,137,74,.03)';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('오케스트라 발춨곡 가이드',310,25);
    var ex=excerpts[curExcerpt];
    ctx.fillStyle='rgba(212,137,74,.1)';ctx.beginPath();ctx.roundRect(30,40,560,120,12);ctx.fill();
    ctx.strokeStyle='rgba(212,137,74,.25)';ctx.beginPath();ctx.roundRect(30,40,560,120,12);ctx.stroke();
    ctx.fillStyle='#D4894A';ctx.font='bold 16px Georgia';ctx.textAlign='left';
    ctx.fillText(ex.title,50,68);
    ctx.fillStyle='rgba(212,137,74,.6)';ctx.font='12px Georgia';
    ctx.fillText(ex.composer+' | '+ex.mvt,50,88);
    ctx.fillText('테크닉: '+ex.technique,50,108);
    ctx.fillText('팁: '+ex.tips,50,128);
    var stars='';for(var s=0;s<5;s++)stars+=s<ex.diff?'★':'☆';
    ctx.fillStyle='rgba(255,215,0,.8)';ctx.font='14px Georgia';ctx.textAlign='right';
    ctx.fillText(stars,580,68);
    ctx.textAlign='center';ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';
    ctx.fillText('발춨곡 난이도 비교',310,190);
    var barW=55,gap=12,startX=50,startY=210,maxH=100;
    for(var i=0;i<excerpts.length;i++){
      var x=startX+i*(barW+gap);var h=excerpts[i].diff*maxH/5;
      var isPracticed=practiced23.indexOf(i)!==-1;
      ctx.fillStyle=i===curExcerpt?'rgba(255,215,0,.5)':isPracticed?'rgba(76,175,80,.4)':'rgba(212,137,74,.2)';
      ctx.beginPath();ctx.roundRect(x,startY+maxH-h,barW,h,4);ctx.fill();
      ctx.fillStyle='rgba(212,137,74,.6)';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(excerpts[i].composer.substring(0,6),x+barW/2,startY+maxH+14);
      ctx.fillStyle='#fff';ctx.font='10px Georgia';
      ctx.fillText('★'+excerpts[i].diff,x+barW/2,startY+maxH-h-5);
    }
    var pct=practiced23.length/excerpts.length*100;
    ctx.fillStyle='rgba(212,137,74,.1)';ctx.beginPath();ctx.roundRect(100,360,420,20,6);ctx.fill();
    ctx.fillStyle='rgba(76,175,80,.5)';ctx.beginPath();ctx.roundRect(100,360,420*pct/100,20,6);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 11px Georgia';ctx.textAlign='center';
    ctx.fillText(practiced23.length+'/'+excerpts.length+' 연습 완료',310,374);
    info.textContent=ex.title+' ('+ex.composer+') | 난이도: '+ex.diff+'/5 | 연습: '+practiced23.length+'/'+excerpts.length;
  }
  draw();
}

// ===== FEATURE 7: 톤 램 (Tone Laboratory) =====
function createToneLabPanel(){
  var panel=makePanel23('v23ToneLab','🔬 톤 램 - 음색 실험실');
  var body=panel.querySelector('.v23-body');
  var cv=mkCv23(620,400);body.appendChild(cv);
  var info=document.createElement('div');info.className='v23-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var tones=[
    {name:'Brillante',desc:'밝고 맑은 음색',warm:30,bright:90,depth:50,attack:70,sustain:60,vibrato:40,color:'rgba(255,215,0,.7)'},
    {name:'Dolce',desc:'부드럽고 달콤한',warm:85,bright:35,depth:65,attack:25,sustain:80,vibrato:70,color:'rgba(255,133,202,.7)'},
    {name:'Sul Tasto',desc:'지판 위 부드러운',warm:90,bright:15,depth:80,attack:15,sustain:70,vibrato:50,color:'rgba(100,180,255,.7)'},
    {name:'Sul Ponticello',desc:'브릿지 근처 날카로운',warm:10,bright:95,depth:30,attack:85,sustain:35,vibrato:20,color:'rgba(244,67,54,.7)'},
    {name:'Con Sordino',desc:'약음기 사용',warm:60,bright:25,depth:40,attack:30,sustain:50,vibrato:55,color:'rgba(156,39,176,.7)'},
    {name:'Flautando',desc:'플루트처럼 가벼운',warm:50,bright:60,depth:20,attack:10,sustain:45,vibrato:15,color:'rgba(0,188,212,.7)'},
    {name:'Espressivo',desc:'감정 풍부한 표현',warm:75,bright:55,depth:85,attack:50,sustain:75,vibrato:90,color:'rgba(255,152,0,.7)'},
    {name:'Martellato',desc:'망치처럼 강한',warm:20,bright:80,depth:45,attack:95,sustain:25,vibrato:10,color:'rgba(121,85,72,.7)'}
  ];
  var curTone=0;var explored=[];
  tones.forEach(function(t,i){
    var btn=document.createElement('button');btn.className='v23-btn';btn.textContent=t.name;
    btn.onclick=function(){curTone=i;explore();};
    btnRow.appendChild(btn);
  });
  body.appendChild(btnRow);

  function explore(){
    if(explored.indexOf(curTone)===-1)explored.push(curTone);
    v23Sfx('tone_lab');
    if(explored.length>=8)unlockAch('tone_lab_scientist');
    draw();trackV23Use('toneLab');
    addHistory('v23','톤 램: '+tones[curTone].name+' 탐험');
  }
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='rgba(212,137,74,.03)';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('톤 램 - 음색 실험실',310,25);
    var t=tones[curTone];
    var cx=200,cy=200,r=120;var axes=['Warm','Bright','Depth','Attack','Sustain','Vibrato'];
    var vals=[t.warm,t.bright,t.depth,t.attack,t.sustain,t.vibrato];
    for(var ring=4;ring>=1;ring--){
      ctx.strokeStyle='rgba(212,137,74,'+(0.05+ring*0.03)+')';ctx.beginPath();
      for(var a=0;a<6;a++){
        var angle=-Math.PI/2+a*Math.PI/3;
        var rx=cx+Math.cos(angle)*r*ring/4;var ry=cy+Math.sin(angle)*r*ring/4;
        if(a===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
      }
      ctx.closePath();ctx.stroke();
    }
    for(var a=0;a<6;a++){
      var angle=-Math.PI/2+a*Math.PI/3;
      ctx.strokeStyle='rgba(212,137,74,.15)';ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);ctx.stroke();
      ctx.fillStyle='rgba(212,137,74,.7)';ctx.font='11px Georgia';ctx.textAlign='center';
      ctx.fillText(axes[a],cx+Math.cos(angle)*(r+18),cy+Math.sin(angle)*(r+18)+4);
    }
    ctx.fillStyle=t.color.replace('.7)','.15)');ctx.beginPath();
    for(var a=0;a<6;a++){
      var angle=-Math.PI/2+a*Math.PI/3;
      var rv=vals[a]*r/100;
      var px=cx+Math.cos(angle)*rv;var py=cy+Math.sin(angle)*rv;
      if(a===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.closePath();ctx.fill();
    ctx.strokeStyle=t.color;ctx.lineWidth=2;ctx.beginPath();
    for(var a=0;a<6;a++){
      var angle=-Math.PI/2+a*Math.PI/3;
      var rv=vals[a]*r/100;
      var px=cx+Math.cos(angle)*rv;var py=cy+Math.sin(angle)*rv;
      if(a===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.closePath();ctx.stroke();ctx.lineWidth=1;
    for(var a=0;a<6;a++){
      var angle=-Math.PI/2+a*Math.PI/3;var rv=vals[a]*r/100;
      ctx.fillStyle=t.color;ctx.beginPath();ctx.arc(cx+Math.cos(angle)*rv,cy+Math.sin(angle)*rv,4,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='rgba(212,137,74,.1)';ctx.beginPath();ctx.roundRect(370,50,230,140,10);ctx.fill();
    ctx.strokeStyle='rgba(212,137,74,.2)';ctx.beginPath();ctx.roundRect(370,50,230,140,10);ctx.stroke();
    ctx.fillStyle=t.color;ctx.font='bold 15px Georgia';ctx.textAlign='left';ctx.fillText(t.name,385,75);
    ctx.fillStyle='rgba(212,137,74,.6)';ctx.font='12px Georgia';ctx.fillText(t.desc,385,95);
    for(var a=0;a<6;a++){
      var y=110+a*13;
      ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='10px Georgia';ctx.fillText(axes[a]+':',385,y);
      ctx.fillStyle=t.color;ctx.beginPath();ctx.roundRect(445,y-8,vals[a]*1.4,8,3);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.fillText(vals[a]+'%',445+vals[a]*1.4+4,y);
    }
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('음색 탐험 진행도',480,230);
    var gridCols=4,gridRows=2,cellW=50,cellH=30,gridX=380,gridY=245;
    for(var i=0;i<tones.length;i++){
      var col=i%gridCols,row=Math.floor(i/gridCols);
      var x=gridX+col*(cellW+5),y=gridY+row*(cellH+5);
      ctx.fillStyle=explored.indexOf(i)!==-1?'rgba(76,175,80,.3)':'rgba(212,137,74,.08)';
      ctx.beginPath();ctx.roundRect(x,y,cellW,cellH,4);ctx.fill();
      ctx.fillStyle=explored.indexOf(i)!==-1?'rgba(76,175,80,.8)':'rgba(212,137,74,.4)';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(tones[i].name.substring(0,6),x+cellW/2,y+cellH/2+3);
    }
    ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='11px Georgia';ctx.textAlign='center';
    ctx.fillText(explored.length+'/'+tones.length+' 탐험',480,335);
    info.textContent=t.name+' - '+t.desc+' | 탐험: '+explored.length+'/'+tones.length;
  }
  draw();
}

// ===== FEATURE 8: 연주 스타일 비교 분석기 =====
function createStyleComparePanel(){
  var panel=makePanel23('v23StyleCompare','🎨 연주 스타일 비교 분석기');
  var body=panel.querySelector('.v23-body');
  var cv=mkCv23(620,400);body.appendChild(cv);
  var info=document.createElement('div');info.className='v23-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var styles=[
    {name:'Baroque',era:'1600-1750',traits:[80,40,30,90,50,20],desc:'정확한 리듬, 절제된 비브라토',color:'rgba(255,215,0,.6)'},
    {name:'Classical',era:'1750-1820',traits:[85,55,50,95,60,35],desc:'균형, 명료성, 단아한 표현',color:'rgba(33,150,243,.6)'},
    {name:'Romantic',era:'1820-1900',traits:[60,90,85,50,80,90],desc:'감정적 표현, 풍부한 비브라토',color:'rgba(244,67,54,.6)'},
    {name:'Impressionist',era:'1890-1930',traits:[45,75,70,40,85,65],desc:'미므한 색채, 몽환적 음색',color:'rgba(156,39,176,.6)'},
    {name:'Modern',era:'1900-1970',traits:[70,50,40,75,45,30],desc:'실험적 기법, 새로운 음색',color:'rgba(0,150,136,.6)'},
    {name:'Contemporary',era:'1970-현재',traits:[55,65,60,60,70,55],desc:'다양한 스타일 융합',color:'rgba(255,152,0,.6)'}
  ];
  var compare=[0,2];
  var axes23=['정확성','표현력','비브라토','리듬감','음색 풍부','감정 깊이'];
  styles.forEach(function(s,i){
    var btn=document.createElement('button');btn.className='v23-btn';btn.textContent=s.name;
    btn.onclick=function(){
      if(compare[0]===i)compare[0]=compare[1];
      compare[1]=i;if(compare[0]===compare[1])compare[0]=(i+1)%styles.length;
      v23Sfx('tone_match');draw();trackV23Use('styleCompare');
    };
    btnRow.appendChild(btn);
  });
  body.appendChild(btnRow);

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='rgba(212,137,74,.03)';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('연주 스타일 비교 - '+styles[compare[0]].name+' vs '+styles[compare[1]].name,310,25);
    var cx=220,cy=210,r=130;
    for(var ring=4;ring>=1;ring--){
      ctx.strokeStyle='rgba(212,137,74,'+(0.05+ring*0.03)+')';ctx.beginPath();
      for(var a=0;a<6;a++){
        var angle=-Math.PI/2+a*Math.PI/3;
        var rx=cx+Math.cos(angle)*r*ring/4;var ry=cy+Math.sin(angle)*r*ring/4;
        if(a===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
      }
      ctx.closePath();ctx.stroke();
    }
    for(var a=0;a<6;a++){
      var angle=-Math.PI/2+a*Math.PI/3;
      ctx.strokeStyle='rgba(212,137,74,.15)';ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);ctx.stroke();
      ctx.fillStyle='rgba(212,137,74,.7)';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(axes23[a],cx+Math.cos(angle)*(r+20),cy+Math.sin(angle)*(r+20)+4);
    }
    for(var ci=0;ci<2;ci++){
      var s=styles[compare[ci]];
      ctx.fillStyle=s.color.replace('.6)','.1)');ctx.beginPath();
      for(var a=0;a<6;a++){
        var angle=-Math.PI/2+a*Math.PI/3;var rv=s.traits[a]*r/100;
        var px=cx+Math.cos(angle)*rv;var py=cy+Math.sin(angle)*rv;
        if(a===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }
      ctx.closePath();ctx.fill();
      ctx.strokeStyle=s.color;ctx.lineWidth=2;ctx.setLineDash(ci===1?[6,4]:[]);ctx.beginPath();
      for(var a=0;a<6;a++){
        var angle=-Math.PI/2+a*Math.PI/3;var rv=s.traits[a]*r/100;
        var px=cx+Math.cos(angle)*rv;var py=cy+Math.sin(angle)*rv;
        if(a===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }
      ctx.closePath();ctx.stroke();ctx.lineWidth=1;ctx.setLineDash([]);
    }
    var infoX=400,infoY=60;
    for(var ci=0;ci<2;ci++){
      var s=styles[compare[ci]];var y=infoY+ci*160;
      ctx.fillStyle=s.color.replace('.6)','.12)');ctx.beginPath();ctx.roundRect(infoX,y,200,140,8);ctx.fill();
      ctx.strokeStyle=s.color;ctx.beginPath();ctx.roundRect(infoX,y,200,140,8);ctx.stroke();
      ctx.fillStyle=s.color;ctx.font='bold 13px Georgia';ctx.textAlign='left';ctx.fillText(s.name,infoX+10,y+20);
      ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='10px Georgia';ctx.fillText(s.era,infoX+10,y+36);
      ctx.fillText(s.desc,infoX+10,y+52);
      for(var a=0;a<6;a++){
        var by=y+65+a*12;
        ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='9px Georgia';ctx.fillText(axes23[a],infoX+10,by);
        ctx.fillStyle=s.color;ctx.beginPath();ctx.roundRect(infoX+70,by-7,s.traits[a]*1.1,7,2);ctx.fill();
      }
    }
    info.textContent=styles[compare[0]].name+' vs '+styles[compare[1]].name+' 비교 분석';
  }
  draw();
}

// ===== QUIZ PANEL =====
function createQuizV23Panel(){
  var panel=makePanel23('v23QuizPanel','📝 퀴즈 v23');
  var body=panel.querySelector('.v23-body');
  var qIdx=0;var score23=0;var answered23=false;
  var qDiv=document.createElement('div');body.appendChild(qDiv);

  function showQ(){
    if(qIdx>=V23_QUIZ.length){
      var pct=score23/V23_QUIZ.length*100;
      qDiv.innerHTML='<div style="text-align:center;padding:20px;"><h3 style="color:#D4894A;font-family:Georgia,serif">퀴즈 완료!</h3><p class="v23-info">점수: '+score23+'/'+V23_QUIZ.length+' ('+pct.toFixed(0)+'%)</p>'
        +'<p class="v23-grade" style="color:'+(pct>=90?'#FFD700':pct>=70?'#4CAF50':pct>=50?'#FF9800':'#F44336')+'">'+(pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D')+' 등급</p>'
        +'<button class="v23-btn" onclick="this.parentElement.parentElement.querySelector(\'.__v23retry\').click()">다시 풀기</button></div>';
      var retryBtn=document.createElement('button');retryBtn.className='__v23retry';retryBtn.style.display='none';
      retryBtn.onclick=function(){qIdx=0;score23=0;answered23=false;showQ();};
      qDiv.appendChild(retryBtn);
      if(pct===100)unlockAch('quiz_v23_master');
      saveProgress({quiz_v23_score:pct});
      addHistory('v23','퀴즈 v23 완료: '+pct.toFixed(0)+'%');
      return;
    }
    answered23=false;var q=V23_QUIZ[qIdx];
    var html='<p class="v23-info" style="margin-bottom:4px">'+(qIdx+1)+'/'+V23_QUIZ.length+'</p>';
    html+='<p style="color:#D4894A;font-size:14px;font-family:Georgia,serif;margin:8px 0">'+q.q+'</p>';
    for(var i=0;i<q.a.length;i++){
      html+='<button class="v23-quiz-opt" data-i="'+i+'">'+q.a[i]+'</button>';
    }
    qDiv.innerHTML=html;
    qDiv.querySelectorAll('.v23-quiz-opt').forEach(function(btn){
      btn.onclick=function(){
        if(answered23)return;answered23=true;
        var pick=parseInt(btn.getAttribute('data-i'));
        if(pick===q.c){score23++;btn.style.background='rgba(76,175,80,.3)';btn.style.borderColor='#4CAF50';v23Sfx('quiz_v23');}
        else{btn.style.background='rgba(244,67,54,.3)';btn.style.borderColor='#F44336';v23Sfx('quiz_wrong_v23');
          qDiv.querySelectorAll('.v23-quiz-opt')[q.c].style.background='rgba(76,175,80,.3)';
        }
        setTimeout(function(){qIdx++;showQ();},1200);
      };
    });
  }
  showQ();trackV23Use('quiz');
}

// ===== TRACKING =====
var v23Used=JSON.parse(localStorage.getItem('v23_used')||'[]');
function trackV23Use(id){if(v23Used.indexOf(id)===-1){v23Used.push(id);localStorage.setItem('v23_used',JSON.stringify(v23Used));}if(v23Used.length>=4)unlockAch('v23_explorer');if(v23Used.length>=9)unlockAch('v23_complete');}

function addV23Nav(){
  var navTarget=document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){var allBtns=document.querySelectorAll('button');if(allBtns.length>0)navTarget=allBtns[allBtns.length-1].parentElement;else navTarget=document.body;}
  var wrap=document.createElement('div');
  wrap.style.cssText='display:flex;gap:2px;flex-wrap:wrap;padding:2px;justify-content:center;';
  var panels=[
    {id:'v23StringResonance',label:'🎻공명'},
    {id:'v23DoubleStop',label:'🎶더블'},
    {id:'v23SightReadV2',label:'📋초견'},
    {id:'v23PositionShift',label:'⬆️시프트'},
    {id:'v23WarmupBuilder',label:'🔥워밍업'},
    {id:'v23OrchExcerpt',label:'🎼발춨곡'},
    {id:'v23ToneLab',label:'🔬톤램'},
    {id:'v23StyleCompare',label:'🎨스타일'},
    {id:'v23QuizPanel',label:'📝퀴즈v23'}
  ];
  panels.forEach(function(p){
    var btn=document.createElement('button');
    btn.style.cssText='background:linear-gradient(135deg,rgba(212,137,74,.12),rgba(150,80,40,.08));border:1px solid rgba(212,137,74,.2);color:#D4894A;padding:5px 8px;border-radius:8px;font-size:11px;cursor:pointer;font-family:Georgia,serif;white-space:nowrap;';
    btn.textContent=p.label;
    btn.onclick=function(){var el=document.getElementById(p.id);if(el){el.classList.add('show');v23Sfx('nav_v23');}};
    wrap.appendChild(btn);
  });
  navTarget.appendChild(wrap);
}

// ===== KEYBOARD =====
document.addEventListener('keydown',function(e){
  if(!e.shiftKey)return;
  var panelIds=['v23StringResonance','v23DoubleStop','v23SightReadV2','v23PositionShift','v23WarmupBuilder','v23OrchExcerpt','v23ToneLab','v23StyleCompare','v23QuizPanel'];
  var map={KeyA:0,KeyS:1,KeyD:2,KeyF:3,KeyG:4,KeyH:5,KeyN:6,KeyM:7,Comma:8};
  if(map[e.code]!==undefined){e.preventDefault();var p=document.getElementById(panelIds[map[e.code]]);if(p){p.classList.add('show');v23Sfx('nav_v23');}}
});

// ===== REGISTER SONGS/LESSONS =====
if(window.SONG_DB&&Array.isArray(window.SONG_DB)){V23_SONGS.forEach(function(s){window.SONG_DB.push(s);});}
if(window.LESSON_DB&&Array.isArray(window.LESSON_DB)){V23_LESSONS.forEach(function(l){window.LESSON_DB.push(l);});}
if(window.ACH_DB&&Array.isArray(window.ACH_DB)){V23_ACHS.forEach(function(a){window.ACH_DB.push(a);});}

// ===== INIT =====
function initV23(){
  createStringResonancePanel();
  createDoubleStopPanel();
  createSightReadingV2Panel();
  createPositionShiftPanel();
  createWarmupBuilderPanel();
  createOrchExcerptPanel();
  createToneLabPanel();
  createStyleComparePanel();
  createQuizV23Panel();
  addV23Nav();
  saveProgress({v23_loaded:1});
  unlockAch('song_204');
  unlockAch('lesson_230');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initV23);}
else{initV23();}

})();
