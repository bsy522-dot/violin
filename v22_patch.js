(function V22Patch(){'use strict';
if(window.__V22_LOADED)return;window.__V22_LOADED=true;

function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(o){var p=loadProgress();for(var k in o)p[k]=o[k];localStorage.setItem('violinProgress',JSON.stringify(p));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'[]');}catch(e){return [];}}
function unlockAch(id){var a=loadAchievements();if(a.indexOf(id)!==-1)return;a.push(id);localStorage.setItem('violinAchievements',JSON.stringify(a));var t=document.getElementById('achToast');if(t){t.textContent='🏆 '+id+' 업적 해제!';t.style.display='block';setTimeout(function(){t.style.display='none';},2500);}}
function addHistory(type,text){try{var h=JSON.parse(localStorage.getItem('violinV10_history')||'[]');h.unshift({type:type,text:text,ts:Date.now()});if(h.length>60)h=h.slice(0,60);localStorage.setItem('violinV10_history',JSON.stringify(h));}catch(e){}}

var actx22=null;
function v22Sfx(type){
  try{
    if(!actx22)actx22=new(window.AudioContext||window.webkitAudioContext)();
    var presets={
      bow_press:{f:440,w:'sine',a:0.15,d:0.25},
      bow_zone:{f:523,w:'triangle',a:0.12,d:0.2},
      vib_wave:{f:659,w:'sine',a:0.14,d:0.3},
      vib_type:{f:784,w:'triangle',a:0.13,d:0.22},
      inton_scan:{f:392,w:'sine',a:0.15,d:0.2},
      inton_sharp:{f:880,w:'sawtooth',a:0.08,d:0.15},
      streak_day:{f:587,w:'triangle',a:0.12,d:0.18},
      streak_goal:{f:698,w:'sine',a:0.16,d:0.35},
      reper_level:{f:494,w:'triangle',a:0.13,d:0.2},
      reper_clear:{f:988,w:'sine',a:0.18,d:0.4},
      phrase_draw:{f:554,w:'sine',a:0.1,d:0.2},
      ensemble_hit:{f:622,w:'triangle',a:0.14,d:0.18},
      ensemble_miss:{f:311,w:'sawtooth',a:0.08,d:0.15},
      tech_compare:{f:740,w:'sine',a:0.13,d:0.22},
      quiz_v22:{f:831,w:'triangle',a:0.15,d:0.25},
      quiz_wrong_v22:{f:247,w:'sawtooth',a:0.1,d:0.3},
      achieve_v22:{f:1047,w:'sine',a:0.18,d:0.45},
      nav_v22:{f:466,w:'triangle',a:0.1,d:0.12}
    };
    var pr=presets[type]||presets.nav_v22;
    var osc=actx22.createOscillator();var g=actx22.createGain();
    osc.type=pr.w;osc.frequency.value=pr.f;
    g.gain.setValueAtTime(pr.a,actx22.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,actx22.currentTime+pr.d);
    osc.connect(g);g.connect(actx22.destination);
    osc.start();osc.stop(actx22.currentTime+pr.d+0.05);
  }catch(e){}
}

var V22_SONGS=[
  {id:'s185',title:'파가니니 라 캄파네라',diff:5,genre:'Virtuoso'},
  {id:'s186',title:'브라앨스 바이올린 소나타 3번',diff:4,genre:'Romantic'},
  {id:'s187',title:'프로코피에프 바이올린 협주곡 2번',diff:4,genre:'Russian'},
  {id:'s188',title:'생상스 서주곡과 론도 카프리치오조',diff:5,genre:'Virtuoso'},
  {id:'s189',title:'시벨리우스 바이올린 협주곡',diff:4,genre:'Romantic'},
  {id:'s190',title:'바흐 무반주 파르티타 3번 사라반드',diff:3,genre:'Baroque'},
  {id:'s191',title:'비에니아프스키 폴로네즈 7번',diff:4,genre:'Polish'},
  {id:'s192',title:'비발디 사계 - 여름 Presto',diff:5,genre:'Baroque'},
  {id:'s193',title:'엘가 사랑의 인사',diff:3,genre:'Romantic'},
  {id:'s194',title:'크라이슬러 사랑의 기쁘',diff:3,genre:'Romantic'}
];

var V22_LESSONS=[
  {id:'l211',title:'활 압력 분배의 기초',desc:'활의 상/중/하 구간별 적절한 압력 배분 방법을 학습합니다'},
  {id:'l212',title:'비브라토 파형 이해하기',desc:'손목/팔/손가락 비브라토의 차이와 파형 특성을 분석합니다'},
  {id:'l213',title:'음정 경향 자가진단',desc:'자신의 음정 경향(sharp/flat)을 파악하고 교정하는 방법'},
  {id:'l214',title:'연습 습관 만들기',desc:'꾸준한 연습 습관을 만드는 전략과 모티베이션 유지법'},
  {id:'l215',title:'레퍼토리 확장 전략',desc:'난이도 단계별 곡 선택과 효과적인 레퍼토리 확장 방법'},
  {id:'l216',title:'프레이징과 음악적 표현',desc:'프레이즈 구조를 이해하고 음악적으로 표현하는 방법'},
  {id:'l217',title:'앙상블 연주 기초',desc:'다른 연주자와 함께 연주할 때 타이밍과 밸런스 맞추기'},
  {id:'l218',title:'보잉 테크닉 비교 분석',desc:'10종 보잉법의 특성을 비교 분석하고 적절한 사용법을 학습합니다'},
  {id:'l219',title:'파가니니 라 캄파네라 분석',desc:'파가니니의 대표 협주곡 기법과 음악적 특징 분석'},
  {id:'l220',title:'v22 종합 리뷰',desc:'v22에서 배운 모든 기능을 종합적으로 복습합니다'}
];

var V22_QUIZ=[
  {q:'활의 압력을 가장 많이 주어야 하는 구간은?',a:['활 끝(tip)','활 중간(middle)','활 밑(frog)','모든 구간 동일'],c:2},
  {q:'손목 비브라토의 특징은?',a:['느리고 넓은 진폭','빠르고 좋은 진폭','팔 전체를 사용','손가락만 사용'],c:1},
  {q:'음정이 반복적으로 sharp하다면 어떻게 교정하는가?',a:['손가락을 약간 낮춰 짚는다','활 압력을 높인다','비브라토를 넣는다','템포를 늘린다'],c:0},
  {q:'연습 스트릭을 유지하는 가장 좋은 방법은?',a:['하루 5시간 연습','매일 일정한 시간 조금씩','주말에 몰아서','기분이 날 때만'],c:1},
  {q:'Detaché 보잉의 특징은?',a:['활을 튀기는 주법','한 활에 한 음씩 분리','빠른 트레몰로','활을 누르며 느리게'],c:1},
  {q:'앙상블 연주에서 가장 중요한 것은?',a:['자신의 소리만 듣기','다른 파트 경청과 타이밍 맞추기','가능한 크게 연주','빠르게 연주'],c:1},
  {q:'프레이즈(phrase)의 끝에서 일반적으로 하는 것은?',a:['점점 세게(diminuendo)','갑자기 멈춤','빈 박자 추가','가장 크게 연주'],c:0},
  {q:'Spiccato 보잉에서 활의 바운스 포인트는 주로 어디인가?',a:['활 끝(tip)','활 밑(frog)','활 중간에서 약간 아래','활 전체'],c:2},
  {q:'레퍼토리를 확장할 때 권장되는 방법은?',a:['한번에 가장 어려운 곡부터','현재 레벨보다 약간 어려운 곡','쉾운 곡만 반복','무작위 선택'],c:1},
  {q:'Col legno 주법은 무엇을 사용하는가?',a:['활털로 현을 친다','활나무(목부)로 현을 친다','손가락으로 타격','활을 뒤집어 사용'],c:1},
  {q:'비브라토의 속도가 느릴 때 어떤 효과가 나는가?',a:['따뜻하고 리리컬한 음색','날카로운 음색','음정이 불안정해진다','소리가 더 커진다'],c:0},
  {q:'앙상블에서 “인토네이션 매칭”이란?',a:['음정을 파트너와 일치시키는 것','동일한 악보 사용','같은 활을 사용','같은 속도로 연주'],c:0},
  {q:'Martelé 보잉의 특징적인 음색은?',a:['부드럽고 따뜻한','날카롭고 강조된 어택','빠른 트레몰로','가벼운 튰김'],c:1},
  {q:'연습 캘린더의 주요 목적은?',a:['남에게 보여주기','연습의 꾸준함과 패턴을 시각화','시험 준비','선생님 보고용'],c:1},
  {q:'Legato 보잉에서 활 전환 시 가장 중요한 것은?',a:['빠른 속도','큰 압력','끊김 없는 부드러운 연결','활 바운스'],c:2}
];

var V22_ACHS=[
  {id:'bow_pressure_analyst',title:'활 압력 분석가',desc:'활 압력 분배 분석기 처음 사용'},
  {id:'vibrato_wave_master',title:'비브라토 파형 마스터',desc:'비브라토 파형 분석기에서 4유형 전부 스캔'},
  {id:'intonation_tracker',title:'음정 경향 추적자',desc:'음정 경향 히트맵에서 전체 스캔 완료'},
  {id:'streak_7days',title:'7일 연속 연습',desc:'연습 스트릭 7일 달성'},
  {id:'streak_30days',title:'30일 연속 연습',desc:'연습 스트릭 30일 달성'},
  {id:'repertoire_climber',title:'레퍼토리 등반가',desc:'레퍼토리 래더에서 레벨 5 도달'},
  {id:'phrasing_artist',title:'프레이징 예술가',desc:'프레이징 분석기에서 S등급 획득'},
  {id:'ensemble_sync',title:'앙상블 동기화',desc:'앙상블 트레이너에서 90% 이상 정확도'},
  {id:'bow_tech_scholar',title:'보입 학자',desc:'보잉 테크닉 비교에서 10종 전부 비교'},
  {id:'quiz_v22_master',title:'퀴즈 v22 마스터',desc:'v22 퀴즈 전부 정답'},
  {id:'v22_explorer',title:'v22 탐험가',desc:'v22 기능 4개 이상 사용'},
  {id:'v22_complete',title:'v22 완전 정복',desc:'v22 모든 기능 사용 완료'}
];

var css22=document.createElement('style');
css22.textContent='.v22-panel{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:94vw;max-width:680px;max-height:88vh;overflow-y:auto;background:linear-gradient(135deg,#1a1020 0%,#2d1b3d 100%);border:1px solid rgba(212,137,74,.3);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.6);z-index:5200;padding:0;}'
+'.v22-panel.show{display:block;}'
+'.v22-hd{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid rgba(212,137,74,.15);}'
+'.v22-hd h3{margin:0;color:#D4894A;font-size:15px;font-family:Georgia,serif;}'
+'.v22Close{background:none;border:none;color:#D4894A;font-size:20px;cursor:pointer;padding:4px 8px;}'
+'.v22-body{padding:14px 18px;}'
+'.v22-btn{background:linear-gradient(135deg,rgba(212,137,74,.15),rgba(212,137,74,.08));border:1px solid rgba(212,137,74,.25);color:#D4894A;padding:8px 14px;border-radius:10px;cursor:pointer;font-size:13px;margin:4px;transition:all .2s;font-family:Georgia,serif;}'
+'.v22-btn:hover{background:linear-gradient(135deg,rgba(212,137,74,.3),rgba(212,137,74,.15));transform:translateY(-1px);}'
+'.v22-grade{display:inline-block;padding:3px 10px;border-radius:8px;font-weight:bold;font-size:14px;margin:6px 0;}'
+'.v22-info{color:rgba(212,137,74,.7);font-size:12px;margin:6px 0;line-height:1.5;font-family:Georgia,serif;}'
+'.v22-quiz-opt{display:block;width:90%;margin:6px auto;padding:10px 14px;background:rgba(212,137,74,.08);border:1px solid rgba(212,137,74,.2);border-radius:10px;color:#D4894A;cursor:pointer;text-align:left;font-size:13px;transition:all .2s;font-family:Georgia,serif;}'
+'.v22-quiz-opt:hover{background:rgba(212,137,74,.18);}';
document.head.appendChild(css22);

function makePanel22(id,title){
  var p=document.createElement('div');p.className='v22-panel';p.id=id;
  p.innerHTML='<div class="v22-hd"><h3>'+title+'</h3><button class="v22Close">x</button></div><div class="v22-body"></div>';
  p.querySelector('.v22Close').onclick=function(){p.classList.remove('show');};
  document.body.appendChild(p);return p;
}
function mkCv22(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;c.style.cssText='width:100%;max-width:'+w+'px;height:auto;border-radius:10px;display:block;margin:10px auto;background:rgba(0,0,0,.2);';return c;}

// ===== FEATURE 1: 활 압력 분배 분석기 =====
function createBowPressurePanel(){
  var panel=makePanel22('v22BowPressure','🎻 활 압력 분배 분석기');
  var body=panel.querySelector('.v22-body');
  var cv=mkCv22(600,380);body.appendChild(cv);
  var info=document.createElement('div');info.className='v22-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var scanBtn=document.createElement('button');scanBtn.className='v22-btn';scanBtn.textContent='스캔 시작';
  var resetBtn=document.createElement('button');resetBtn.className='v22-btn';resetBtn.textContent='초기화';
  btnRow.appendChild(scanBtn);btnRow.appendChild(resetBtn);body.appendChild(btnRow);
  var segments=10;var data=[];var ideal=[0.06,0.07,0.09,0.10,0.11,0.12,0.12,0.11,0.11,0.11];
  function randomScan(){data=[];for(var i=0;i<segments;i++){data.push(Math.random()*0.15+0.03);}var sum=0;for(var i=0;i<data.length;i++)sum+=data[i];for(var i=0;i<data.length;i++)data[i]=data[i]/sum;}
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='rgba(212,137,74,.05)';ctx.fillRect(0,0,600,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('활 압력 분배 분석기',300,25);
    var labels=['끝(Tip)','','','','중간','','','','','밑(Frog)'];
    var barW=42,gap=10,startX=40,startY=50,maxH=120;
    ctx.font='11px Georgia';ctx.fillStyle='rgba(212,137,74,.6)';ctx.textAlign='center';
    for(var i=0;i<segments;i++){
      var x=startX+i*(barW+gap);
      if(data.length>0){
        var h1=data[i]*maxH/0.2;ctx.fillStyle='rgba(212,137,74,.7)';ctx.fillRect(x,startY+maxH-h1,barW/2-1,h1);
        ctx.fillStyle='rgba(100,180,255,.5)';var h2=ideal[i]*maxH/0.2;ctx.fillRect(x+barW/2+1,startY+maxH-h2,barW/2-1,h2);
      }
      ctx.fillStyle='rgba(212,137,74,.5)';ctx.fillText(labels[i]||(i+1)+'',x+barW/2,startY+maxH+15);
    }
    if(data.length>0){
      ctx.font='11px Georgia';ctx.fillStyle='rgba(212,137,74,.7)';ctx.fillText('■ 실제',150,startY+maxH+35);
      ctx.fillStyle='rgba(100,180,255,.5)';ctx.fillText('■ 이상적',250,startY+maxH+35);
    }
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='left';
    ctx.fillText('구간별 압력 무게중심',40,230);
    var zones=['상부(Tip 측)','중부','하부(Frog 측)'];
    var zoneColors=['rgba(100,200,150,.6)','rgba(212,137,74,.6)','rgba(200,100,100,.6)'];
    if(data.length>0){
      var zoneVals=[0,0,0];
      for(var i=0;i<3;i++)zoneVals[0]+=data[i];for(var i=3;i<7;i++)zoneVals[1]+=data[i];for(var i=7;i<10;i++)zoneVals[2]+=data[i];
      for(var z=0;z<3;z++){
        var y=250+z*35;ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='12px Georgia';
        ctx.fillText(zones[z],40,y+12);
        var bw=zoneVals[z]*400/0.5;ctx.fillStyle=zoneColors[z];
        ctx.beginPath();ctx.roundRect(160,y,Math.min(bw,350),20,6);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='11px Georgia';ctx.textAlign='right';
        ctx.fillText((zoneVals[z]*100).toFixed(1)+'%',160+Math.min(bw,350)-5,y+14);ctx.textAlign='left';
      }
      var totalDev=0;for(var i=0;i<segments;i++)totalDev+=Math.abs(data[i]-ideal[i]);
      var score=Math.max(0,100-totalDev*500);
      var grade=score>=90?'S':score>=80?'A':score>=70?'B':score>=60?'C':'D';
      var gc=grade==='S'?'#FFD700':grade==='A'?'#4CAF50':grade==='B'?'#2196F3':grade==='C'?'#FF9800':'#F44336';
      ctx.fillStyle=gc;ctx.font='bold 18px Georgia';ctx.textAlign='center';
      ctx.fillText(grade+' 등급 ('+score.toFixed(0)+'점)',300,365);
      info.textContent='압력 분배 점수: '+score.toFixed(0)+'점 ('+grade+'등급) - 이상적 분배와의 편차: '+(totalDev*100).toFixed(1)+'%';
    }else{
      ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='14px Georgia';ctx.textAlign='center';
      ctx.fillText('‘스캔 시작’을 눌러 활 압력을 분석하세요',300,200);
    }
  }
  draw();
  scanBtn.onclick=function(){v22Sfx('bow_press');randomScan();draw();saveProgress({v22_bow_pressure:1});unlockAch('bow_pressure_analyst');addHistory('feature','활 압력 분배 분석');trackV22Use('bowpressure');};
  resetBtn.onclick=function(){data=[];draw();info.textContent='';};
}

// ===== FEATURE 2: 비브라토 파형 분석기 =====
function createVibratoWavePanel(){
  var panel=makePanel22('v22VibratoWave','🌊 비브라토 파형 분석기');
  var body=panel.querySelector('.v22-body');
  var cv=mkCv22(580,360);body.appendChild(cv);
  var info=document.createElement('div');info.className='v22-info';body.appendChild(info);
  var types=[
    {name:'손목 비브라토',freq:5.5,amp:0.3,reg:0.92,desc:'빠르고 좋은 진폭, 균일한 파형'},
    {name:'팔 비브라토',freq:4.0,amp:0.6,reg:0.85,desc:'느리고 넓은 진폭, 풍부한 음색'},
    {name:'손가락 비브라토',freq:7.0,amp:0.2,reg:0.88,desc:'매우 빠르고 좋은 진폭, 고음용'},
    {name:'복합 비브라토',freq:5.0,amp:0.45,reg:0.78,desc:'손목+팔 복합, 표현력 풍부'}
  ];
  var curType=0;var scanned=new Set();
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,580,360);
    ctx.fillStyle='rgba(212,137,74,.05)';ctx.fillRect(0,0,580,360);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('비브라토 파형 분석기 - '+types[curType].name,290,22);
    var t=types[curType];
    ctx.strokeStyle='rgba(212,137,74,.7)';ctx.lineWidth=2;ctx.beginPath();
    for(var x=40;x<540;x++){
      var phase=(x-40)/500*Math.PI*2*t.freq;
      var y=120+Math.sin(phase)*50*t.amp+(1-t.reg)*Math.sin(phase*3.7)*15;
      if(x===40)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }ctx.stroke();
    ctx.strokeStyle='rgba(100,180,255,.3)';ctx.setLineDash([5,5]);ctx.beginPath();
    ctx.moveTo(40,120);ctx.lineTo(540,120);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(212,137,74,.6)';ctx.font='11px Georgia';ctx.textAlign='left';
    ctx.fillText('↑ 진폭: '+(t.amp*100).toFixed(0)+'%',40,175);
    ctx.fillText('→ 속도: '+t.freq.toFixed(1)+' Hz',200,175);
    ctx.fillText('○ 규칙성: '+(t.reg*100).toFixed(0)+'%',380,175);
    var metrics=['진폭','속도','규칙성','온기','표현력','제어력'];
    var vals=[[30,55,92,40,45,88],[60,40,85,75,80,60],[20,70,88,30,35,82],[45,50,78,65,90,55]];
    var cx=440,cy=280,r=70;
    for(var i=0;i<6;i++){
      var angle=Math.PI*2*i/6-Math.PI/2;
      var ex=cx+Math.cos(angle)*r,ey=cy+Math.sin(angle)*r;
      ctx.strokeStyle='rgba(212,137,74,.15)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);ctx.stroke();
      ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(metrics[i],cx+Math.cos(angle)*(r+15),cy+Math.sin(angle)*(r+15)+4);
    }
    ctx.fillStyle='rgba(212,137,74,.2)';ctx.strokeStyle='rgba(212,137,74,.6)';ctx.lineWidth=1.5;ctx.beginPath();
    for(var i=0;i<6;i++){
      var angle=Math.PI*2*i/6-Math.PI/2;var v=vals[curType][i]/100*r;
      var px=cx+Math.cos(angle)*v,py=cy+Math.sin(angle)*v;
      if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='11px Georgia';ctx.textAlign='left';
    ctx.fillText(t.desc,30,210);
    for(var ti=0;ti<4;ti++){
      var bx=30+ti*135,by=230;
      ctx.fillStyle=ti===curType?'rgba(212,137,74,.3)':'rgba(212,137,74,.08)';
      ctx.strokeStyle=ti===curType?'rgba(212,137,74,.6)':'rgba(212,137,74,.2)';ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(bx,by,125,28,8);ctx.fill();ctx.stroke();
      ctx.fillStyle=ti===curType?'#D4894A':'rgba(212,137,74,.5)';ctx.font='11px Georgia';ctx.textAlign='center';
      ctx.fillText(types[ti].name,bx+62,by+18);
    }
  }
  draw();
  cv.onclick=function(e){
    var rect=cv.getBoundingClientRect();var sx=(e.clientX-rect.left)*(580/rect.width);var sy=(e.clientY-rect.top)*(360/rect.height);
    if(sy>=230&&sy<=258){var idx=Math.floor((sx-30)/135);if(idx>=0&&idx<4){curType=idx;scanned.add(idx);v22Sfx('vib_type');draw();
    if(scanned.size>=4){unlockAch('vibrato_wave_master');}trackV22Use('vibwave');saveProgress({v22_vib_wave:1});addHistory('feature','비브라토 파형 분석: '+types[idx].name);}}
  };
  info.textContent='탭을 클릭하여 4종 비브라토 파형을 비교 분석하세요';
}

// ===== FEATURE 3: 음정 경향 히트맵 =====
function createIntonationTendencyPanel(){
  var panel=makePanel22('v22IntonationTrend','🎯 음정 경향 히트맵');
  var body=panel.querySelector('.v22-body');
  var cv=mkCv22(620,400);body.appendChild(cv);
  var info=document.createElement('div');info.className='v22-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var scanBtn=document.createElement('button');scanBtn.className='v22-btn';scanBtn.textContent='전체 스캔';
  var resetBtn=document.createElement('button');resetBtn.className='v22-btn';resetBtn.textContent='초기화';
  btnRow.appendChild(scanBtn);btnRow.appendChild(resetBtn);body.appendChild(btnRow);
  var notes=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var octaves=['3','4','5','6'];
  var heatData=null;
  function genData(){heatData=[];for(var o=0;o<4;o++){heatData[o]=[];for(var n=0;n<12;n++){heatData[o][n]=(Math.random()-0.5)*40;}}}
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='rgba(212,137,74,.05)';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('음정 경향 히트맵 (Sharp/Flat 분석)',310,22);
    var cellW=40,cellH=55,startX=65,startY=55;
    ctx.font='11px Georgia';ctx.fillStyle='rgba(212,137,74,.6)';ctx.textAlign='center';
    for(var n=0;n<12;n++){ctx.fillText(notes[n],startX+n*cellW+cellW/2,startY-8);}
    ctx.textAlign='right';
    for(var o=0;o<4;o++){ctx.fillText(octaves[o],startX-8,startY+o*cellH+cellH/2+4);}
    if(heatData){
      for(var o=0;o<4;o++){for(var n=0;n<12;n++){
        var val=heatData[o][n];
        var r,g,b;
        if(val>0){r=Math.min(255,100+val*4);g=80;b=80;}
        else{r=80;g=80;b=Math.min(255,100+Math.abs(val)*4);}
        ctx.fillStyle='rgba('+r+','+g+','+b+',0.6)';
        ctx.fillRect(startX+n*cellW+1,startY+o*cellH+1,cellW-2,cellH-2);
        ctx.fillStyle='#fff';ctx.font='10px Georgia';ctx.textAlign='center';
        var sign=val>0?'+':'';ctx.fillText(sign+val.toFixed(0)+'\xA2',startX+n*cellW+cellW/2,startY+o*cellH+cellH/2+4);
      }}
      ctx.fillStyle='rgba(200,100,100,.6)';ctx.fillRect(startX,startY+4*cellH+20,80,16);
      ctx.fillStyle='#fff';ctx.font='11px Georgia';ctx.textAlign='center';ctx.fillText('Sharp (+)',startX+40,startY+4*cellH+33);
      ctx.fillStyle='rgba(80,80,200,.6)';ctx.fillRect(startX+100,startY+4*cellH+20,80,16);
      ctx.fillStyle='#fff';ctx.fillText('Flat (-)',startX+140,startY+4*cellH+33);
      ctx.fillStyle='rgba(212,137,74,.5)';ctx.fillText('단위: cent (\xB1)',startX+250,startY+4*cellH+33);
      var sharpCount=0,flatCount=0;
      for(var o=0;o<4;o++)for(var n=0;n<12;n++){if(heatData[o][n]>5)sharpCount++;else if(heatData[o][n]<-5)flatCount++;}
      ctx.fillStyle='#D4894A';ctx.font='13px Georgia';ctx.textAlign='center';
      var tendency=sharpCount>flatCount?'Sharp 경향':flatCount>sharpCount?'Flat 경향':'균형';
      ctx.fillText('종합 경향: '+tendency+' (Sharp:'+sharpCount+' / Flat:'+flatCount+')',310,385);
    }else{
      ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='14px Georgia';ctx.textAlign='center';
      ctx.fillText('‘전체 스캔’을 눌러 음정 경향을 분석하세요',310,200);
    }
  }
  draw();
  scanBtn.onclick=function(){v22Sfx('inton_scan');genData();draw();saveProgress({v22_inton:1});unlockAch('intonation_tracker');addHistory('feature','음정 경향 히트맵 스캔');trackV22Use('intonation');};
  resetBtn.onclick=function(){heatData=null;draw();};
}

// ===== FEATURE 4: 연습 스트릭 캘린더 =====
function createPracticeStreakPanel(){
  var panel=makePanel22('v22PracticeStreak','🔥 연습 스트릭 캘린더');
  var body=panel.querySelector('.v22-body');
  var cv=mkCv22(620,380);body.appendChild(cv);
  var info=document.createElement('div');info.className='v22-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var todayBtn=document.createElement('button');todayBtn.className='v22-btn';todayBtn.textContent='오늘 연습 기록';
  var weekBtn=document.createElement('button');weekBtn.className='v22-btn';weekBtn.textContent='주간 목표 설정';
  btnRow.appendChild(todayBtn);btnRow.appendChild(weekBtn);body.appendChild(btnRow);
  var streakData=JSON.parse(localStorage.getItem('v22_streak')||'{}');
  function getDateStr(d){return d.getFullYear()+'-'+(d.getMonth()+1<10?'0':'')+(d.getMonth()+1)+'-'+(d.getDate()<10?'0':'')+d.getDate();}
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,380);
    ctx.fillStyle='rgba(212,137,74,.05)';ctx.fillRect(0,0,620,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('연습 스트릭 캘린더 (90일)',310,22);
    var days=90,cols=13,cellSize=18,gap=3,startX=65,startY=55;
    var dayLabels=['일','월','화','수','목','금','토'];
    ctx.font='10px Georgia';ctx.fillStyle='rgba(212,137,74,.4)';ctx.textAlign='right';
    for(var d=0;d<7;d++){ctx.fillText(dayLabels[d],startX-8,startY+d*(cellSize+gap)+cellSize-3);}
    var today=new Date();var streak=0,maxStreak=0,totalDays=0,curStreak=0;
    for(var i=days-1;i>=0;i--){
      var date=new Date(today);date.setDate(date.getDate()-i);
      var ds=getDateStr(date);var dow=date.getDay();var week=Math.floor((days-1-i+((new Date(today.getFullYear(),today.getMonth(),today.getDate()-days+1)).getDay()))/7);
      var practiced=streakData[ds]||0;
      if(practiced>0){totalDays++;curStreak++;if(curStreak>maxStreak)maxStreak=curStreak;}else{curStreak=0;}
      var intensity=practiced===0?0:Math.min(4,practiced);
      var colors=['rgba(212,137,74,.06)','rgba(212,137,74,.2)','rgba(212,137,74,.4)','rgba(212,137,74,.6)','rgba(212,137,74,.85)'];
      ctx.fillStyle=colors[intensity];
      var x=startX+week*(cellSize+gap);var y=startY+dow*(cellSize+gap);
      ctx.beginPath();ctx.roundRect(x,y,cellSize,cellSize,3);ctx.fill();
    }
    streak=curStreak;
    ctx.fillStyle='#D4894A';ctx.font='bold 16px Georgia';ctx.textAlign='center';
    ctx.fillText('현재 스트릭: '+streak+'일',160,240);
    ctx.fillText('최대 스트릭: '+maxStreak+'일',460,240);
    ctx.font='13px Georgia';ctx.fillStyle='rgba(212,137,74,.6)';
    ctx.fillText('총 연습일: '+totalDays+'/90일',160,265);
    ctx.fillText('연습률: '+(totalDays/90*100).toFixed(1)+'%',460,265);
    var weekGoal=parseInt(localStorage.getItem('v22_week_goal')||'5');
    var thisWeekDays=0;
    for(var i=0;i<7;i++){var d=new Date(today);d.setDate(d.getDate()-today.getDay()+i);if(streakData[getDateStr(d)])thisWeekDays++;}
    ctx.fillStyle='rgba(212,137,74,.1)';ctx.beginPath();ctx.roundRect(120,285,380,60,10);ctx.fill();
    ctx.fillStyle='rgba(212,137,74,.3)';ctx.beginPath();ctx.roundRect(140,300,320,20,6);ctx.fill();
    var prog=Math.min(1,thisWeekDays/weekGoal);
    ctx.fillStyle=prog>=1?'rgba(100,200,150,.7)':'rgba(212,137,74,.6)';ctx.beginPath();ctx.roundRect(140,300,320*prog,20,6);ctx.fill();
    ctx.fillStyle='#D4894A';ctx.font='12px Georgia';ctx.textAlign='center';
    ctx.fillText('주간 목표: '+thisWeekDays+'/'+weekGoal+'일'+(prog>=1?' ✅':''),310,295);
    ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='10px Georgia';
    ctx.fillText('■ 없음  ■ 1회  ■ 2회  ■ 3회  ■ 4회+',310,365);
  }
  draw();
  todayBtn.onclick=function(){
    var ds=getDateStr(new Date());streakData[ds]=(streakData[ds]||0)+1;
    localStorage.setItem('v22_streak',JSON.stringify(streakData));v22Sfx('streak_day');draw();
    var streak=0;var d=new Date();
    while(streakData[getDateStr(d)]){streak++;d.setDate(d.getDate()-1);}
    if(streak>=7)unlockAch('streak_7days');if(streak>=30)unlockAch('streak_30days');
    saveProgress({v22_streak:streak});addHistory('practice','오늘 연습 기록 ('+streak+'일 연속)');trackV22Use('streak');
  };
  weekBtn.onclick=function(){
    var cur=parseInt(localStorage.getItem('v22_week_goal')||'5');
    var next=cur>=7?3:cur+1;localStorage.setItem('v22_week_goal',next+'');
    v22Sfx('streak_goal');draw();info.textContent='주간 목표: '+next+'일로 변경';
  };
}

// ===== FEATURE 5: 레퍼토리 진행 래더 =====
function createRepertoireLadderPanel(){
  var panel=makePanel22('v22RepertoireLadder','🪜 레퍼토리 진행 래더');
  var body=panel.querySelector('.v22-body');
  var cv=mkCv22(600,380);body.appendChild(cv);
  var info=document.createElement('div');info.className='v22-info';body.appendChild(info);
  var levels=[
    {lv:1,name:'입문',songs:['반짝반짝','가을 슬픈'],color:'rgba(100,200,150,.7)'},
    {lv:2,name:'초급',songs:['사랑의 인사','칸치였네'],color:'rgba(120,200,140,.7)'},
    {lv:3,name:'초중급',songs:['칸치네','모차르트 K.304'],color:'rgba(140,190,130,.7)'},
    {lv:4,name:'중급',songs:['바흐 파르티타','비발디 사계'],color:'rgba(160,180,120,.7)'},
    {lv:5,name:'중상급',songs:['브라온스 소나타','엘가 협주곡'],color:'rgba(180,170,110,.7)'},
    {lv:6,name:'상급',songs:['브루흐 협주곡','멘델스존'],color:'rgba(200,160,100,.7)'},
    {lv:7,name:'고급',songs:['차이코프스키','시벨리우스'],color:'rgba(212,137,74,.7)'},
    {lv:8,name:'전문',songs:['프로코피에프','생상스 론도'],color:'rgba(220,120,60,.7)'},
    {lv:9,name:'연주가',songs:['파가니니 카프리치오','이자이'],color:'rgba(230,100,50,.7)'},
    {lv:10,name:'비르투오소',songs:['파가니니 라캄파네라','엘가 В мажоре'],color:'rgba(255,80,40,.7)'}
  ];
  var progress=JSON.parse(localStorage.getItem('v22_reper_prog')||'{}');
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='rgba(212,137,74,.05)';ctx.fillRect(0,0,600,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('레퍼토리 진행 래더',300,22);
    for(var i=levels.length-1;i>=0;i--){
      var lv=levels[i];var y=40+(9-i)*33;
      var done=progress['lv'+lv.lv]||0;
      ctx.fillStyle=done>=2?lv.color:'rgba(212,137,74,.08)';ctx.strokeStyle=lv.color;ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(30,y,540,28,6);ctx.fill();ctx.stroke();
      ctx.fillStyle=done>=2?'#fff':'rgba(212,137,74,.6)';ctx.font='12px Georgia';ctx.textAlign='left';
      ctx.fillText('Lv.'+lv.lv+' '+lv.name,40,y+18);
      ctx.textAlign='center';ctx.fillText(lv.songs[0],230,y+18);
      ctx.fillText(lv.songs[1],400,y+18);
      ctx.textAlign='right';
      var status=done>=2?'✅ 완료':done>=1?'🔶 진행중':'⚪ 미도전';
      ctx.fillText(status,560,y+18);
    }
    var maxLv=0;for(var k in progress){var l=parseInt(k.replace('lv',''));if(progress[k]>=2&&l>maxLv)maxLv=l;}
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('현재 레벨: '+(maxLv+1)+'/10',300,375);
  }
  draw();
  cv.onclick=function(e){
    var rect=cv.getBoundingClientRect();var sy=(e.clientY-rect.top)*(380/rect.height);
    for(var i=levels.length-1;i>=0;i--){
      var y=40+(9-i)*33;if(sy>=y&&sy<=y+28){
        var key='lv'+levels[i].lv;progress[key]=Math.min(2,(progress[key]||0)+1);
        localStorage.setItem('v22_reper_prog',JSON.stringify(progress));v22Sfx('reper_level');draw();
        var maxLv=0;for(var k in progress){var l=parseInt(k.replace('lv',''));if(progress[k]>=2&&l>maxLv)maxLv=l;}
        if(maxLv>=5)unlockAch('repertoire_climber');
        saveProgress({v22_reper:maxLv});addHistory('feature','레퍼토리 래더 Lv.'+levels[i].lv+' 진행');trackV22Use('repertoire');
        break;
      }
    }
  };
  info.textContent='레벨을 클릭하여 진행상태를 업데이트하세요 (미도전 → 진행중 → 완료)';
}

// ===== FEATURE 6: 뮤지컬 프레이징 분석기 =====
function createPhrasingPanel(){
  var panel=makePanel22('v22Phrasing','🎵 뮤지컬 프레이징 분석기');
  var body=panel.querySelector('.v22-body');
  var cv=mkCv22(620,380);body.appendChild(cv);
  var info=document.createElement('div');info.className='v22-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var genBtn=document.createElement('button');genBtn.className='v22-btn';genBtn.textContent='프레이즈 생성';
  var evalBtn=document.createElement('button');evalBtn.className='v22-btn';evalBtn.textContent='평가';
  btnRow.appendChild(genBtn);btnRow.appendChild(evalBtn);body.appendChild(btnRow);
  var phraseData=null;var evalDone=false;
  function genPhrase(){
    phraseData={dynamic:[],tension:[],release:[]};
    var pts=20;
    for(var i=0;i<pts;i++){
      var t=i/(pts-1);
      phraseData.dynamic.push(Math.sin(t*Math.PI)*0.7+Math.random()*0.2+0.1);
      phraseData.tension.push(Math.sin(t*Math.PI*0.8)*0.6+Math.random()*0.15+0.2);
      phraseData.release.push(t>0.7?1-(t-0.7)/0.3+Math.random()*0.1:0.1+Math.random()*0.1);
    }
  }
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,380);
    ctx.fillStyle='rgba(212,137,74,.05)';ctx.fillRect(0,0,620,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('뮤지컬 프레이징 분석기',310,22);
    if(!phraseData){
      ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='14px Georgia';
      ctx.fillText('‘프레이즈 생성’을 눌러 분석을 시작하세요',310,190);return;
    }
    var axes=[{name:'다이내믹',data:phraseData.dynamic,color:'rgba(212,137,74,.8)'},
              {name:'텐션',data:phraseData.tension,color:'rgba(100,180,255,.7)'},
              {name:'릴리즈',data:phraseData.release,color:'rgba(100,200,150,.7)'}];
    var startX=60,endX=580,startY=50,h=80;
    for(var a=0;a<3;a++){
      var baseY=startY+a*100;
      ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='11px Georgia';ctx.textAlign='right';
      ctx.fillText(axes[a].name,55,baseY+h/2+4);
      ctx.strokeStyle='rgba(212,137,74,.1)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(startX,baseY+h);ctx.lineTo(endX,baseY+h);ctx.stroke();
      ctx.strokeStyle=axes[a].color;ctx.lineWidth=2;ctx.beginPath();
      var pts=axes[a].data;
      for(var i=0;i<pts.length;i++){
        var x=startX+i*(endX-startX)/(pts.length-1);var y=baseY+h-pts[i]*h;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }ctx.stroke();
      ctx.fillStyle=axes[a].color.replace('0.8','0.1').replace('0.7','0.1');ctx.lineTo(endX,baseY+h);ctx.lineTo(startX,baseY+h);ctx.fill();
    }
    if(evalDone){
      var dynPeak=0,tensPeak=0;
      for(var i=0;i<phraseData.dynamic.length;i++){if(phraseData.dynamic[i]>dynPeak)dynPeak=phraseData.dynamic[i];}
      for(var i=0;i<phraseData.tension.length;i++){if(phraseData.tension[i]>tensPeak)tensPeak=phraseData.tension[i];}
      var score=Math.round((dynPeak*40+tensPeak*30+phraseData.release[phraseData.release.length-1]*10+20)*1.1);
      score=Math.min(100,score);
      var grade=score>=90?'S':score>=80?'A':score>=70?'B':score>=60?'C':'D';
      var gc=grade==='S'?'#FFD700':grade==='A'?'#4CAF50':grade==='B'?'#2196F3':grade==='C'?'#FF9800':'#F44336';
      ctx.fillStyle=gc;ctx.font='bold 18px Georgia';ctx.textAlign='center';
      ctx.fillText('프레이징 '+grade+'등급 ('+score+'점)',310,370);
      if(grade==='S')unlockAch('phrasing_artist');
    }
  }
  draw();
  genBtn.onclick=function(){v22Sfx('phrase_draw');genPhrase();evalDone=false;draw();saveProgress({v22_phrasing:1});addHistory('feature','프레이징 분석 생성');trackV22Use('phrasing');};
  evalBtn.onclick=function(){if(!phraseData)return;v22Sfx('phrase_draw');evalDone=true;draw();};
}

// ===== FEATURE 7: 앙상블 타이밍 트레이너 =====
function createEnsembleTimingPanel(){
  var panel=makePanel22('v22EnsembleTiming','🤝 앙상블 타이밍 트레이너');
  var body=panel.querySelector('.v22-body');
  var cv=mkCv22(600,380);body.appendChild(cv);
  var info=document.createElement('div');info.className='v22-info';body.appendChild(info);
  var btnRow=document.createElement('div');btnRow.style.textAlign='center';
  var startBtn=document.createElement('button');startBtn.className='v22-btn';startBtn.textContent='훈련 시작';
  var resetBtn=document.createElement('button');resetBtn.className='v22-btn';resetBtn.textContent='초기화';
  btnRow.appendChild(startBtn);btnRow.appendChild(resetBtn);body.appendChild(btnRow);
  var parts=['바이올린 1','바이올린 2','비올라','첼로'];
  var beats=16;var results=null;
  function genResults(){
    results=[];for(var p=0;p<4;p++){results[p]=[];for(var b=0;b<beats;b++){
      results[p][b]=p===0?0:(Math.random()-0.5)*60;
    }}
  }
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='rgba(212,137,74,.05)';ctx.fillRect(0,0,600,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('앙상블 타이밍 트레이너',300,22);
    if(!results){
      ctx.fillStyle='rgba(212,137,74,.4)';ctx.font='14px Georgia';
      ctx.fillText('‘훈련 시작’을 눌러 앙상블 타이밍을 훈련하세요',300,190);return;
    }
    var startX=100,barW=28,gap=2,startY=50;
    ctx.font='11px Georgia';ctx.fillStyle='rgba(212,137,74,.5)';ctx.textAlign='right';
    for(var p=0;p<4;p++){ctx.fillText(parts[p],90,startY+p*75+35);}
    var partColors=['rgba(212,137,74,.7)','rgba(100,180,255,.6)','rgba(100,200,150,.6)','rgba(200,100,150,.6)'];
    for(var p=0;p<4;p++){
      var baseY=startY+p*75;
      ctx.strokeStyle='rgba(212,137,74,.1)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(startX,baseY+30);ctx.lineTo(startX+beats*(barW+gap),baseY+30);ctx.stroke();
      for(var b=0;b<beats;b++){
        var dev=results[p][b];var h=Math.abs(dev)*0.8;
        ctx.fillStyle=Math.abs(dev)<10?'rgba(100,200,150,.6)':Math.abs(dev)<25?'rgba(212,137,74,.6)':'rgba(200,100,100,.6)';
        var x=startX+b*(barW+gap);
        if(dev>=0){ctx.fillRect(x,baseY+30-h,barW,h);}
        else{ctx.fillRect(x,baseY+30,barW,h);}
      }
    }
    var totalDev=0,count=0;
    for(var p=1;p<4;p++)for(var b=0;b<beats;b++){totalDev+=Math.abs(results[p][b]);count++;}
    var avgDev=totalDev/count;var accuracy=Math.max(0,100-avgDev*2);
    var grade=accuracy>=90?'S':accuracy>=80?'A':accuracy>=70?'B':accuracy>=60?'C':'D';
    var gc=grade==='S'?'#FFD700':grade==='A'?'#4CAF50':grade==='B'?'#2196F3':grade==='C'?'#FF9800':'#F44336';
    ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='10px Georgia';ctx.textAlign='center';
    ctx.fillText('■ 정확(<10ms)  ■ 보통(10-25ms)  ■ 불일치(>25ms)',300,340);
    ctx.fillStyle=gc;ctx.font='bold 16px Georgia';
    ctx.fillText('동기화 정확도: '+accuracy.toFixed(1)+'% ('+grade+'등급)',300,370);
    if(accuracy>=90)unlockAch('ensemble_sync');
    info.textContent='평균 편차: '+avgDev.toFixed(1)+'ms | 기준: 바이올린 1 | 단위: ms';
  }
  draw();
  startBtn.onclick=function(){v22Sfx('ensemble_hit');genResults();draw();saveProgress({v22_ensemble:1});addHistory('feature','앙상블 타이밍 훈련');trackV22Use('ensemble');};
  resetBtn.onclick=function(){results=null;draw();info.textContent='';};
}

// ===== FEATURE 8: 보잉 테크닉 듀얼 레이더 =====
function createBowTechRadarPanel(){
  var panel=makePanel22('v22BowTechRadar','⚔️ 보잉 테크닉 비교 레이더');
  var body=panel.querySelector('.v22-body');
  var cv=mkCv22(620,400);body.appendChild(cv);
  var info=document.createElement('div');info.className='v22-info';body.appendChild(info);
  var techniques=[
    {name:'Detaché',vals:[85,60,70,50,80,75]},
    {name:'Legato',vals:[70,90,85,80,60,65]},
    {name:'Staccato',vals:[90,40,50,30,85,80]},
    {name:'Spiccato',vals:[95,35,45,35,90,85]},
    {name:'Martelé',vals:[88,45,55,40,82,78]},
    {name:'Tremolo',vals:[80,30,40,25,92,70]},
    {name:'Col Legno',vals:[60,50,35,45,70,55]},
    {name:'Sul Tasto',vals:[40,85,90,88,35,50]},
    {name:'Sul Ponticello',vals:[50,60,30,55,65,60]},
    {name:'Ricochet',vals:[92,30,40,30,95,88]}
  ];
  var axes=['속도','부드러움','표현력','따뜻함','기술난이도','에너지'];
  var sel1=0,sel2=1;var compared=new Set();
  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='rgba(212,137,74,.05)';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('보잉 테크닉 비교 레이더',310,22);
    var cx=310,cy=195,r=120;
    for(var ring=1;ring<=4;ring++){
      ctx.strokeStyle='rgba(212,137,74,'+(.05+ring*.03)+')';ctx.lineWidth=1;ctx.beginPath();
      for(var i=0;i<6;i++){
        var angle=Math.PI*2*i/6-Math.PI/2;var rr=r*ring/4;
        var px=cx+Math.cos(angle)*rr,py=cy+Math.sin(angle)*rr;
        if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }ctx.closePath();ctx.stroke();
    }
    for(var i=0;i<6;i++){
      var angle=Math.PI*2*i/6-Math.PI/2;
      ctx.strokeStyle='rgba(212,137,74,.1)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);ctx.stroke();
      ctx.fillStyle='rgba(212,137,74,.6)';ctx.font='11px Georgia';ctx.textAlign='center';
      ctx.fillText(axes[i],cx+Math.cos(angle)*(r+18),cy+Math.sin(angle)*(r+18)+4);
    }
    var drawRadar=function(vals,color,fillColor){
      ctx.strokeStyle=color;ctx.fillStyle=fillColor;ctx.lineWidth=2;ctx.beginPath();
      for(var i=0;i<6;i++){
        var angle=Math.PI*2*i/6-Math.PI/2;var v=vals[i]/100*r;
        var px=cx+Math.cos(angle)*v,py=cy+Math.sin(angle)*v;
        if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }ctx.closePath();ctx.fill();ctx.stroke();
    };
    drawRadar(techniques[sel1].vals,'rgba(212,137,74,.8)','rgba(212,137,74,.15)');
    drawRadar(techniques[sel2].vals,'rgba(100,180,255,.8)','rgba(100,180,255,.12)');
    ctx.fillStyle='rgba(212,137,74,.7)';ctx.font='12px Georgia';ctx.textAlign='left';
    ctx.fillText('■ '+techniques[sel1].name,40,345);
    ctx.fillStyle='rgba(100,180,255,.7)';ctx.fillText('■ '+techniques[sel2].name,200,345);
    for(var t=0;t<techniques.length;t++){
      var col=t<5?0:1;var row=t<5?t:t-5;
      var bx=20+col*310,by=360+row*0;
    }
    ctx.font='10px Georgia';ctx.textAlign='center';
    for(var t=0;t<10;t++){
      var bx=20+t*60,by=370;
      ctx.fillStyle=t===sel1?'rgba(212,137,74,.4)':t===sel2?'rgba(100,180,255,.3)':'rgba(212,137,74,.08)';
      ctx.beginPath();ctx.roundRect(bx,by,56,22,5);ctx.fill();
      ctx.fillStyle=t===sel1?'#D4894A':t===sel2?'rgba(100,180,255,.8)':'rgba(212,137,74,.5)';
      ctx.fillText(techniques[t].name.substring(0,6),bx+28,by+15);
    }
  }
  draw();
  cv.onclick=function(e){
    var rect=cv.getBoundingClientRect();var sx=(e.clientX-rect.left)*(620/rect.width);var sy=(e.clientY-rect.top)*(400/rect.height);
    if(sy>=370&&sy<=392){
      var idx=Math.floor((sx-20)/60);
      if(idx>=0&&idx<10){
        if(idx!==sel2)sel1=idx;else{var tmp=sel1;sel1=sel2;sel2=tmp;}
        if(idx!==sel1)sel2=idx;
        compared.add(sel1);compared.add(sel2);
        v22Sfx('tech_compare');draw();
        if(compared.size>=10)unlockAch('bow_tech_scholar');
        saveProgress({v22_bow_tech:compared.size});addHistory('feature','보잉 비교: '+techniques[sel1].name+' vs '+techniques[sel2].name);trackV22Use('bowtech');
      }
    }
  };
  info.textContent='하단 탭을 클릭하여 보잉 테크닉을 비교하세요';
}

// ===== QUIZ PANEL =====
function createQuizV22Panel(){
  var panel=makePanel22('v22QuizPanel','📝 퀴즈 v22 (15문항)');
  var body=panel.querySelector('.v22-body');
  var qIdx=0,correct=0;
  var qDiv=document.createElement('div');body.appendChild(qDiv);
  function showQ(){
    if(qIdx>=V22_QUIZ.length){
      var pct=Math.round(correct/V22_QUIZ.length*100);
      var grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
      qDiv.innerHTML='<div style="text-align:center;padding:20px;"><div class="v22-grade" style="background:rgba(212,137,74,.2);color:#D4894A;font-size:24px;">퀴즈 완료!</div><br><div style="color:#D4894A;font-size:18px;margin:10px 0;">'+correct+'/'+V22_QUIZ.length+' 정답 ('+pct+'%) - '+grade+'등급</div><button class="v22-btn" id="v22QuizRetry">다시 풀기</button></div>';
      document.getElementById('v22QuizRetry').onclick=function(){qIdx=0;correct=0;showQ();};
      if(pct===100)unlockAch('quiz_v22_master');
      saveProgress({v22_quiz_score:pct});addHistory('quiz','v22 퀴즈 '+correct+'/'+V22_QUIZ.length+' ('+grade+')');
      return;
    }
    var q=V22_QUIZ[qIdx];
    var html='<div class="v22-info" style="margin-bottom:8px;">Q'+(qIdx+1)+'/'+V22_QUIZ.length+'</div><div style="color:#D4894A;font-size:14px;margin:10px 0;font-family:Georgia,serif;">'+q.q+'</div>';
    for(var i=0;i<q.a.length;i++){html+='<button class="v22-quiz-opt" data-idx="'+i+'">'+q.a[i]+'</button>';}
    qDiv.innerHTML=html;
    var opts=qDiv.querySelectorAll('.v22-quiz-opt');
    for(var i=0;i<opts.length;i++){
      opts[i].onclick=function(){
        var chosen=parseInt(this.getAttribute('data-idx'));
        if(chosen===q.c){correct++;v22Sfx('quiz_v22');this.style.background='rgba(100,200,150,.3)';this.style.borderColor='rgba(100,200,150,.6)';}
        else{v22Sfx('quiz_wrong_v22');this.style.background='rgba(200,100,100,.3)';this.style.borderColor='rgba(200,100,100,.6)';opts[q.c].style.background='rgba(100,200,150,.3)';}
        var allOpts=qDiv.querySelectorAll('.v22-quiz-opt');for(var j=0;j<allOpts.length;j++)allOpts[j].onclick=null;
        setTimeout(function(){qIdx++;showQ();},1200);
      };
    }
  }
  showQ();
}

// ===== NAV + TRACKING =====
var v22Used=JSON.parse(localStorage.getItem('v22_used')||'[]');
function trackV22Use(id){if(v22Used.indexOf(id)===-1){v22Used.push(id);localStorage.setItem('v22_used',JSON.stringify(v22Used));}if(v22Used.length>=4)unlockAch('v22_explorer');if(v22Used.length>=9)unlockAch('v22_complete');}

function addV22Nav(){
  var navTarget=document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){var allBtns=document.querySelectorAll('button');if(allBtns.length>0)navTarget=allBtns[allBtns.length-1].parentElement;else navTarget=document.body;}
  var wrap=document.createElement('div');
  wrap.style.cssText='display:flex;gap:2px;flex-wrap:wrap;padding:2px;justify-content:center;';
  var panels=[
    {id:'v22BowPressure',label:'🎻압력'},
    {id:'v22VibratoWave',label:'🌊파형'},
    {id:'v22IntonationTrend',label:'🎯음정'},
    {id:'v22PracticeStreak',label:'🔥스트릭'},
    {id:'v22RepertoireLadder',label:'🪜래더'},
    {id:'v22Phrasing',label:'🎵프레이징'},
    {id:'v22EnsembleTiming',label:'🤝앙상블'},
    {id:'v22BowTechRadar',label:'⚔️보잉'},
    {id:'v22QuizPanel',label:'📝퀴즈v22'}
  ];
  panels.forEach(function(p){
    var btn=document.createElement('button');
    btn.style.cssText='background:linear-gradient(135deg,rgba(212,137,74,.12),rgba(150,80,40,.08));border:1px solid rgba(212,137,74,.2);color:#D4894A;padding:5px 8px;border-radius:8px;font-size:11px;cursor:pointer;font-family:Georgia,serif;white-space:nowrap;';
    btn.textContent=p.label;
    btn.onclick=function(){var el=document.getElementById(p.id);if(el){el.classList.add('show');v22Sfx('nav_v22');}};
    wrap.appendChild(btn);
  });
  navTarget.appendChild(wrap);
}

// ===== KEYBOARD =====
document.addEventListener('keydown',function(e){
  if(!e.shiftKey)return;
  var panelIds=['v22BowPressure','v22VibratoWave','v22IntonationTrend','v22PracticeStreak','v22RepertoireLadder','v22Phrasing','v22EnsembleTiming','v22BowTechRadar','v22QuizPanel'];
  var map={KeyI:0,KeyO:1,KeyP:2,BracketLeft:3,KeyJ:4,KeyK:5,KeyL:6,Semicolon:7,Digit0:8};
  if(map[e.code]!==undefined){e.preventDefault();var p=document.getElementById(panelIds[map[e.code]]);if(p){p.classList.add('show');v22Sfx('nav_v22');}}
});

// ===== REGISTER SONGS/LESSONS =====
if(window.SONG_DB&&Array.isArray(window.SONG_DB)){V22_SONGS.forEach(function(s){window.SONG_DB.push(s);});}
if(window.LESSON_DB&&Array.isArray(window.LESSON_DB)){V22_LESSONS.forEach(function(l){window.LESSON_DB.push(l);});}
if(window.ACH_DB&&Array.isArray(window.ACH_DB)){V22_ACHS.forEach(function(a){window.ACH_DB.push(a);});}

// ===== INIT =====
function initV22(){
  createBowPressurePanel();
  createVibratoWavePanel();
  createIntonationTendencyPanel();
  createPracticeStreakPanel();
  createRepertoireLadderPanel();
  createPhrasingPanel();
  createEnsembleTimingPanel();
  createBowTechRadarPanel();
  createQuizV22Panel();
  addV22Nav();
  saveProgress({v22_loaded:1});
  unlockAch('song_194');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initV22);}
else{initV22();}

})();
