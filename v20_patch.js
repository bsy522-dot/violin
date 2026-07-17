(function V20Patch(){'use strict';
if(window.__V20_LOADED)return;window.__V20_LOADED=true;

function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress'))||{};}catch(e){return {};}}
function saveProgress(o){var p=loadProgress();Object.keys(o).forEach(function(k){p[k]=o[k];});localStorage.setItem('violinProgress',JSON.stringify(p));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements'))||{};}catch(e){return {};}}
function unlockAch(id){var a=loadAchievements();if(a[id])return;a[id]={ts:Date.now()};localStorage.setItem('violinAchievements',JSON.stringify(a));var t=document.getElementById('achToast');if(t){t.textContent='\u{1F3C6} '+id+' 획득!';t.style.display='block';setTimeout(function(){t.style.display='none';},2500);}if(window.showAchToast)window.showAchToast(id);}
function addHistory(type,text){try{var h=JSON.parse(localStorage.getItem('violinV10_history'))||[];h.unshift({type:type,text:text,ts:Date.now()});if(h.length>60)h.length=60;localStorage.setItem('violinV10_history',JSON.stringify(h));}catch(e){}}

var actx20=null;
function v20Sfx(type){
  try{
    if(!actx20)actx20=new(window.AudioContext||window.webkitAudioContext)();
    var presets={
      pitch_scan:{f:660,w:'sine',a:0.18,d:0.15},
      pitch_sharp:{f:880,w:'triangle',a:0.15,d:0.12},
      rhythm_tap:{f:440,w:'square',a:0.2,d:0.08},
      rhythm_good:{f:523,w:'sine',a:0.2,d:0.2},
      scale_note:{f:550,w:'sine',a:0.18,d:0.15},
      metro_tick:{f:1000,w:'square',a:0.25,d:0.05},
      posture_check:{f:392,w:'triangle',a:0.15,d:0.18},
      sight_note:{f:698,w:'sine',a:0.18,d:0.12},
      progress_log:{f:466,w:'sine',a:0.15,d:0.2},
      finger_tap:{f:587,w:'triangle',a:0.18,d:0.1},
      quiz_v20:{f:784,w:'sine',a:0.2,d:0.25},
      quiz_wrong_v20:{f:220,w:'sawtooth',a:0.15,d:0.3},
      achieve_v20:{f:880,w:'sine',a:0.22,d:0.35}
    };
    var pr=presets[type]||presets.pitch_scan;
    var osc=actx20.createOscillator();var g=actx20.createGain();
    osc.type=pr.w;osc.frequency.value=pr.f;
    g.gain.setValueAtTime(pr.a,actx20.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,actx20.currentTime+pr.d);
    osc.connect(g);g.connect(actx20.destination);
    osc.start();osc.stop(actx20.currentTime+pr.d+0.05);
  }catch(e){}
}

/* ===== SONGS s165-s174 (164->174) ===== */
var V20_SONGS=[
  {id:'s165',title:'비발디 사계 여름 Presto',diff:4,genre:'Baroque'},
  {id:'s166',title:'파가니니 카프리치오 24번',diff:5,genre:'Virtuoso'},
  {id:'s167',title:'차이코프스키 멜랑콜리 세레나데',diff:4,genre:'Romantic'},
  {id:'s168',title:'바흐 무반주 파르티타 2번 사라반드',diff:5,genre:'Baroque'},
  {id:'s169',title:'브루흐 바이올린 협주곡 1번',diff:4,genre:'Romantic'},
  {id:'s170',title:'생상스 서주곡과 론도',diff:4,genre:'Romantic'},
  {id:'s171',title:'모차르트 바이올린 소나타 K.304',diff:3,genre:'Classical'},
  {id:'s172',title:'크라이슬러 아름다운 로즈마린',diff:2,genre:'Romantic'},
  {id:'s173',title:'파라디스 칸타빌레',diff:3,genre:'Romantic'},
  {id:'s174',title:'비에니아프스키 전설 연합곡',diff:4,genre:'Romantic'}
];

/* ===== LESSONS l191-l200 (190->200) ===== */
var V20_LESSONS=[
  {id:'l191',title:'음정 편차 분석 기법',desc:'각 음정별 sharp/flat 경향을 파악하고 교정하는 방법을 배웁니다'},
  {id:'l192',title:'리듬 정확도 향상법',desc:'박자 정확도를 높이는 탭 연습과 세분화 훈련 방법'},
  {id:'l193',title:'스케일 체계적 연습법',desc:'장조/단조 스케일 포지션별 연습 전략'},
  {id:'l194',title:'메트로놘 활용 마스터클래스',desc:'비주얼 메트로놆으로 일정한 템포 유지하기'},
  {id:'l195',title:'올바른 자세의 과학',desc:'보잉/좌수/턴레스트/치즈 정렬의 중요성'},
  {id:'l196',title:'초견 연습의 기초',desc:'처음 보는 악보를 빠르게 읽는 훈련법'},
  {id:'l197',title:'장기 연습 계획 수립',desc:'주간/월간 연습 목표 설정과 추적 방법'},
  {id:'l198',title:'포지션별 핑거링 전략',desc:'1st~7th 포지션 전환과 손가락 배치 최적화'},
  {id:'l199',title:'비발디 Presto 분석',desc:'사계 여름 3악장 Presto의 테크닉 분석'},
  {id:'l200',title:'v20 종합 실력 평가',desc:'음정/리듬/스케일/초견/자세/포지션 종합 평가'}
];

/* ===== QUIZ v20 +15 (150->165) ===== */
var V20_QUIZ=[
  {q:'바이올린에서 음정이 지속적으로 낮아지는 경향을 뭐라고 하나요?',a:['Sharp tendency','Flat tendency','Neutral','Vibrato drift'],c:1},
  {q:'메트로놆의 표준 오케스트라 튜닝 A음의 주파수는?',a:['440Hz','432Hz','450Hz','420Hz'],c:0},
  {q:'G 장조 스케일의 샵♯ 음은 몇 개인가요?',a:['0개','1개(F#)','2개','3개'],c:1},
  {q:'바이올린 연주 시 보잉의 접촉점(Contact Point)이 브릿지에 가까울수록?',a:['음량이 커진다','음량이 작아진다','음색이 부드러워진다','변화 없다'],c:0},
  {q:'3rd 포지션에서 A현의 1번 손가락이 누르는 음은?',a:['C#','D','E','F'],c:1},
  {q:'초견(Sight-reading) 연습에서 가장 중요한 것은?',a:['빠른 속도','리듬 정확도','멈추지 않고 계속 연주','큰 소리로 연주'],c:2},
  {q:'바이올린 자세에서 턴레스트의 올바른 위치는?',a:['턱과 어깨 사이','턱 위','어깨 위','가슴 위'],c:0},
  {q:'파가니니 카프리치오 24번의 조성은?',a:['A단조','G단조','D단조','E단조'],c:0},
  {q:'리듬 연습에서 세분화(Subdivision)란?',a:['박자를 더 작은 단위로 나누는 것','빠르게 연주하는 것','박자를 무시하는 것','느리게 연주하는 것'],c:0},
  {q:'바이올린 연주 시 어깨의 올바른 위치는?',a:['올라간 상태','자연스럽게 내려오는 상태','뒤로 제쳐진 상태','앞으로 굿혀진 상태'],c:1},
  {q:'D 장조 스케일의 샵♯ 음은?',a:['F#, C#','F#','C#, G#','F#, C#, G#'],c:0},
  {q:'비발디 사계 중 &quot;여름&quot;의 3악장 템포 표시는?',a:['Allegro','Presto','Adagio','Andante'],c:1},
  {q:'스케일 연습 시 포지션 이동(Shifting)의 핵심은?',a:['빠른 속도','엄지의 가이드 역할','큰 압력','손목 고정'],c:1},
  {q:'메트로놆 템포 표시에서 BPM은 무엇의 약자인가요?',a:['Beats Per Minute','Bars Per Measure','Basic Playing Mode','Bow Per Motion'],c:0},
  {q:'바이올린에서 7th 포지션은 주로 어떤 현에서 사용되나요?',a:['G현','D현','A현','E현'],c:3}
];

/* ===== ACHIEVEMENTS +12 (178->190) ===== */
var V20_ACHS=[
  {id:'pitch_analyst',icon:'\u{1F3AF}',name:'음정 분석가',desc:'음정 편차 분석기 처음 사용'},
  {id:'rhythm_master_v20',icon:'\u{1F941}',name:'리듬 마스터',desc:'리듬 트레이닝 S등급 달성'},
  {id:'scale_scholar',icon:'\u{1F3B5}',name:'스케일 학자',desc:'스케일 빌더에서 5개 스케일 완성'},
  {id:'tempo_keeper',icon:'\u{23F1}',name:'템포 수호자',desc:'메트로놆 10세션 완료'},
  {id:'posture_perfect',icon:'\u{1F9D8}',name:'완벽한 자세',desc:'자세 가이드 12항목 전부 이수'},
  {id:'sight_reader',icon:'\u{1F4D6}',name:'초견 연주자',desc:'초견 연습기 20회 완료'},
  {id:'progress_tracker',icon:'\u{1F4C8}',name:'성장 기록가',desc:'연습 진도 30일 기록'},
  {id:'position_explorer',icon:'\u{1F5FA}',name:'포지션 탐험가',desc:'핑거링 맵 7포지션 모두 탐색'},
  {id:'quiz_v20_master',icon:'\u{1F9E0}',name:'v20 퀵즈 마스터',desc:'v20 퀵즈 전문 정답'},
  {id:'song_174',icon:'\u{1F3B6}',name:'174곡 도달',desc:'총 174곡 라이브러리 달성'},
  {id:'v20_explorer',icon:'\u{1F30D}',name:'v20 탐험가',desc:'v20 기능 4개 이상 사용'},
  {id:'v20_complete',icon:'\u{1F48E}',name:'v20 컴플리트',desc:'v20 모든 기능 체험 완료'}
];

/* ===== CSS ===== */
var st20=document.createElement('style');
st20.textContent=`
.v20Panel{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(20,12,30,0.97);z-index:9999;overflow-y:auto;display:none;padding:12px;box-sizing:border-box;color:#e8ddd0;}
.v20Panel.show{display:block;}
.v20Close{position:absolute;top:8px;right:14px;font-size:28px;cursor:pointer;color:#D4894A;z-index:10000;}
.v20Title{text-align:center;font-size:20px;font-weight:bold;color:#D4894A;margin:8px 0 12px;}
.v20SubTitle{text-align:center;font-size:13px;color:#b8a090;margin-bottom:10px;}
.v20Card{background:rgba(80,50,30,0.3);border:1px solid rgba(212,137,74,0.3);border-radius:10px;padding:10px;margin:8px 0;}
.v20Btn{background:linear-gradient(135deg,#D4894A,#a06030);color:#fff;border:none;border-radius:8px;padding:8px 14px;cursor:pointer;font-size:13px;margin:3px;touch-action:manipulation;}
.v20Btn:active{transform:scale(0.95);}
.v20Grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;margin:8px 0;}
.v20Info{font-size:12px;color:#b8a090;text-align:center;margin:4px 0;}
.v20Progress{height:8px;background:rgba(80,50,30,0.5);border-radius:4px;overflow:hidden;margin:4px 0;}
.v20Progress>div{height:100%;background:linear-gradient(90deg,#D4894A,#e8a060);border-radius:4px;transition:width 0.3s;}
.v20Badge{display:inline-block;background:rgba(212,137,74,0.2);color:#D4894A;padding:2px 8px;border-radius:10px;font-size:11px;margin:2px;}
.v20Tabs{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:8px 0;}
.v20Tab{padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;background:rgba(80,50,30,0.3);color:#b8a090;border:1px solid transparent;}
.v20Tab.active{background:rgba(212,137,74,0.3);color:#D4894A;border-color:#D4894A;}
`;
document.head.appendChild(st20);

/* ===== 1. PITCH DEVIATION ANALYZER (Canvas 580x360) ===== */
function createPitchDeviationPanel(){
  var panel=document.createElement('div');panel.id='pitchDeviationPanel';panel.className='v20Panel';
  panel.innerHTML='<span class="v20Close" onclick="this.parentNode.classList.remove(\'show\')">×</span>'+
    '<div class="v20Title">\u{1F3AF} 음정 편차 분석기</div>'+
    '<div class="v20SubTitle">각 음정별 Sharp/Flat 경향 추적 · 지문 히트맵</div>'+
    '<div style="text-align:center"><canvas id="pitchDevCv" width="580" height="360"></canvas></div>'+
    '<div class="v20Tabs" id="pitchDevTabs"></div>'+
    '<div style="text-align:center;margin:8px"><button class="v20Btn" id="pitchDevScan">\u{1F50D} 스캔 시작</button> '+
    '<button class="v20Btn" id="pitchDevReset">\u{1F504} 초기화</button></div>'+
    '<div class="v20Card" id="pitchDevStats"></div>';
  document.body.appendChild(panel);

  var notes=['G3','A3','B3','C4','D4','E4','F#4','G4','A4','B4','C5','D5','E5'];
  var strings=['G현','D현','A현','E현'];
  var stringNotes={'현':[0,1,2],'현':[3,4,5,6],'현':[7,8,9],'현':[10,11,12]};
  var data=JSON.parse(localStorage.getItem('v20_pitchDev')||'null')||{};
  notes.forEach(function(n){if(!data[n])data[n]={sharp:0,flat:0,perfect:0};});

  var tabsEl=document.getElementById('pitchDevTabs');
  var selString=0;
  strings.forEach(function(s,i){
    var t=document.createElement('span');t.className='v20Tab'+(i===0?' active':'');t.textContent=s;
    t.onclick=function(){selString=i;tabsEl.querySelectorAll('.v20Tab').forEach(function(x){x.classList.remove('active');});t.classList.add('active');drawPitchDev();};
    tabsEl.appendChild(t);
  });

  function drawPitchDev(){
    var cv=document.getElementById('pitchDevCv');if(!cv)return;var ctx=cv.getContext('2d');
    var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(20,12,30,0.9)';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText(strings[selString]+' 음정 편차 히트맵',W/2,25);

    var sNotes;
    if(selString===0)sNotes=notes.slice(0,4);
    else if(selString===1)sNotes=notes.slice(3,7);
    else if(selString===2)sNotes=notes.slice(6,10);
    else sNotes=notes.slice(9,13);

    var cellW=Math.floor((W-80)/sNotes.length);
    var categories=['Sharp','Flat','Perfect'];
    var cellH=Math.floor((H-100)/3);

    categories.forEach(function(cat,ci){
      ctx.fillStyle='#b8a090';ctx.font='11px sans-serif';ctx.textAlign='right';
      ctx.fillText(cat,55,75+ci*cellH+cellH/2);
    });

    sNotes.forEach(function(n,ni){
      ctx.fillStyle='#D4894A';ctx.font='12px sans-serif';ctx.textAlign='center';
      ctx.fillText(n,70+ni*cellW+cellW/2,52);

      var d=data[n]||{sharp:0,flat:0,perfect:0};
      var vals=[d.sharp,d.flat,d.perfect];
      var maxV=Math.max.apply(null,vals.concat([1]));

      vals.forEach(function(v,vi){
        var intensity=v/maxV;
        var r,g,b;
        if(vi===0){r=Math.floor(180+75*intensity);g=Math.floor(60+20*intensity);b=60;}
        else if(vi===1){r=60;g=Math.floor(100+80*intensity);b=Math.floor(180+75*intensity);}
        else{r=Math.floor(60+40*intensity);g=Math.floor(180+75*intensity);b=Math.floor(60+40*intensity);}
        ctx.fillStyle='rgba('+r+','+g+','+b+','+(0.2+0.8*intensity)+')';
        ctx.fillRect(62+ni*cellW,58+vi*cellH,cellW-4,cellH-4);
        ctx.fillStyle='#e8ddd0';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
        ctx.fillText(v,62+ni*cellW+(cellW-4)/2,58+vi*cellH+(cellH-4)/2+6);
      });
    });

    ctx.fillStyle='#b8a090';ctx.font='10px sans-serif';ctx.textAlign='center';
    var total=0,sharpT=0,flatT=0;
    notes.forEach(function(n){var d=data[n];total+=d.sharp+d.flat+d.perfect;sharpT+=d.sharp;flatT+=d.flat;});
    var grade=total<5?'D':sharpT+flatT<total*0.2?'S':sharpT+flatT<total*0.4?'A':sharpT+flatT<total*0.6?'B':'C';
    ctx.fillText('총 '+total+'회 측정 | Sharp '+sharpT+' | Flat '+flatT+' | 등급: '+grade,W/2,H-15);
  }

  document.getElementById('pitchDevScan').onclick=function(){
    v20Sfx('pitch_scan');
    var rn=notes[Math.floor(Math.random()*notes.length)];
    var r=Math.random();
    if(r<0.3)data[rn].sharp++;
    else if(r<0.6)data[rn].flat++;
    else data[rn].perfect++;
    localStorage.setItem('v20_pitchDev',JSON.stringify(data));
    drawPitchDev();unlockAch('pitch_analyst');addHistory('pitch',rn+' 음정 측정');
  };
  document.getElementById('pitchDevReset').onclick=function(){
    notes.forEach(function(n){data[n]={sharp:0,flat:0,perfect:0};});
    localStorage.setItem('v20_pitchDev',JSON.stringify(data));drawPitchDev();
  };
  drawPitchDev();
}

/* ===== 2. RHYTHM ACCURACY TRAINER (Canvas 560x340) ===== */
function createRhythmTrainerPanel(){
  var panel=document.createElement('div');panel.id='rhythmTrainerPanel';panel.className='v20Panel';
  panel.innerHTML='<span class="v20Close" onclick="this.parentNode.classList.remove(\'show\')">×</span>'+
    '<div class="v20Title">\u{1F941} 리듬 정확도 트레이너</div>'+
    '<div class="v20SubTitle">탭 타이밍으로 리듬 정확도 측정 · 세분화 훈련</div>'+
    '<div style="text-align:center"><canvas id="rhythmCv" width="560" height="340"></canvas></div>'+
    '<div class="v20Tabs" id="rhythmBpmTabs"></div>'+
    '<div style="text-align:center;margin:8px"><button class="v20Btn" id="rhythmStart">▶ 시작</button> '+
    '<button class="v20Btn" id="rhythmTap">\u{1F44F} TAP</button> '+
    '<button class="v20Btn" id="rhythmStop">⏹ 정지</button></div>'+
    '<div class="v20Card" id="rhythmStats"></div>';
  document.body.appendChild(panel);

  var bpmOptions=[60,80,100,120];
  var curBpm=80,running=false,beatTimer=null,beatCount=0;
  var taps=[],expectedBeats=[],startTime=0;
  var sessions=JSON.parse(localStorage.getItem('v20_rhythm')||'[]');

  var tabsEl=document.getElementById('rhythmBpmTabs');
  bpmOptions.forEach(function(b){
    var t=document.createElement('span');t.className='v20Tab'+(b===curBpm?' active':'');t.textContent=b+' BPM';
    t.onclick=function(){curBpm=b;tabsEl.querySelectorAll('.v20Tab').forEach(function(x){x.classList.remove('active');});t.classList.add('active');};
    tabsEl.appendChild(t);
  });

  function drawRhythm(){
    var cv=document.getElementById('rhythmCv');if(!cv)return;var ctx=cv.getContext('2d');
    var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(20,12,30,0.9)';ctx.fillRect(0,0,W,H);

    ctx.fillStyle='#D4894A';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('리듬 타이밍 분석 ('+curBpm+' BPM)',W/2,25);

    var maxShow=16;
    var barW=(W-60)/maxShow;
    ctx.strokeStyle='rgba(212,137,74,0.3)';ctx.lineWidth=1;
    for(var i=0;i<maxShow;i++){
      var x=35+i*barW;
      ctx.beginPath();ctx.moveTo(x,40);ctx.lineTo(x,H-60);ctx.stroke();
      if(i<expectedBeats.length){
        ctx.fillStyle='rgba(212,137,74,0.15)';ctx.fillRect(x,40,barW-2,H-100);
      }
    }

    taps.forEach(function(tap,ti){
      if(ti>=maxShow)return;
      var x=35+ti*barW;
      var deviation=0;
      if(ti<expectedBeats.length){
        deviation=tap-expectedBeats[ti];
        var ms=Math.abs(deviation);
        if(ms<50)ctx.fillStyle='#4CAF50';
        else if(ms<100)ctx.fillStyle='#FFC107';
        else if(ms<200)ctx.fillStyle='#FF9800';
        else ctx.fillStyle='#F44336';
      }else{
        ctx.fillStyle='#888';
      }
      var barH=Math.min(Math.abs(deviation)/5+10,H-110);
      ctx.fillRect(x+2,H-65-barH,barW-6,barH);
      ctx.fillStyle='#e8ddd0';ctx.font='9px sans-serif';ctx.textAlign='center';
      if(ti<expectedBeats.length){
        ctx.fillText((deviation>0?'+':'')+Math.round(deviation)+'ms',x+barW/2,H-55);
      }
    });

    if(sessions.length>0){
      ctx.fillStyle='#b8a090';ctx.font='11px sans-serif';ctx.textAlign='center';
      var last=sessions[sessions.length-1];
      ctx.fillText('최근: '+last.bpm+'BPM 정확도 '+last.accuracy+'% 등급 '+last.grade,W/2,H-20);
    }

    if(running){
      ctx.fillStyle='#4CAF50';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
      ctx.fillText('● REC  Beat #'+beatCount,10,H-10);
    }
  }

  document.getElementById('rhythmStart').onclick=function(){
    if(running)return;running=true;beatCount=0;taps=[];expectedBeats=[];
    startTime=Date.now();v20Sfx('rhythm_tap');
    var interval=60000/curBpm;
    beatTimer=setInterval(function(){
      expectedBeats.push(Date.now()-startTime);beatCount++;
      v20Sfx('metro_tick');drawRhythm();
      if(beatCount>=16){clearInterval(beatTimer);running=false;finishRhythm();}
    },interval);
    drawRhythm();
  };

  document.getElementById('rhythmTap').onclick=function(){
    if(!running)return;taps.push(Date.now()-startTime);v20Sfx('rhythm_tap');drawRhythm();
  };

  document.getElementById('rhythmStop').onclick=function(){
    if(beatTimer)clearInterval(beatTimer);running=false;if(taps.length>2)finishRhythm();drawRhythm();
  };

  function finishRhythm(){
    var matched=0;
    taps.forEach(function(t,i){
      if(i<expectedBeats.length&&Math.abs(t-expectedBeats[i])<200)matched++;
    });
    var acc=expectedBeats.length>0?Math.round(matched/expectedBeats.length*100):0;
    var grade=acc>=90?'S':acc>=75?'A':acc>=60?'B':acc>=40?'C':'D';
    sessions.push({bpm:curBpm,accuracy:acc,grade:grade,ts:Date.now()});
    if(sessions.length>30)sessions=sessions.slice(-30);
    localStorage.setItem('v20_rhythm',JSON.stringify(sessions));
    if(grade==='S')unlockAch('rhythm_master_v20');
    v20Sfx('rhythm_good');addHistory('rhythm',curBpm+'BPM 정확도 '+acc+'% '+grade);
    drawRhythm();
  }
  drawRhythm();
}

/* ===== 3. SCALE BUILDER (Canvas 600x380) ===== */
function createScaleBuilderPanel(){
  var panel=document.createElement('div');panel.id='scaleBuilderPanel';panel.className='v20Panel';
  panel.innerHTML='<span class="v20Close" onclick="this.parentNode.classList.remove(\'show\')">×</span>'+
    '<div class="v20Title">\u{1F3B5} 스케일 빌더</div>'+
    '<div class="v20SubTitle">포지션별 스케일 패턴 · 인터벌 시각화 · 지문 배치도</div>'+
    '<div style="text-align:center"><canvas id="scaleCv" width="600" height="380"></canvas></div>'+
    '<div class="v20Tabs" id="scaleTabs"></div>'+
    '<div style="text-align:center;margin:8px"><button class="v20Btn" id="scalePlay">\u{1F3B6} 스케일 재생</button> '+
    '<button class="v20Btn" id="scaleMaster">✅ 마스터</button></div>'+
    '<div class="v20Card" id="scaleStats"></div>';
  document.body.appendChild(panel);

  var scales=[
    {name:'G 장조',notes:['G','A','B','C','D','E','F#','G'],intervals:['W','W','H','W','W','W','H']},
    {name:'D 장조',notes:['D','E','F#','G','A','B','C#','D'],intervals:['W','W','H','W','W','W','H']},
    {name:'A 장조',notes:['A','B','C#','D','E','F#','G#','A'],intervals:['W','W','H','W','W','W','H']},
    {name:'E 단조',notes:['E','F#','G','A','B','C','D','E'],intervals:['W','H','W','W','H','W','W']},
    {name:'A 단조',notes:['A','B','C','D','E','F','G','A'],intervals:['W','H','W','W','H','W','W']},
    {name:'D 단조',notes:['D','E','F','G','A','Bb','C','D'],intervals:['W','H','W','W','H','W','W']},
    {name:'C 장조',notes:['C','D','E','F','G','A','B','C'],intervals:['W','W','H','W','W','W','H']},
    {name:'F 장조',notes:['F','G','A','Bb','C','D','E','F'],intervals:['W','W','H','W','W','W','H']}
  ];
  var selScale=0;
  var mastered=JSON.parse(localStorage.getItem('v20_scales')||'{}');

  var tabsEl=document.getElementById('scaleTabs');
  scales.forEach(function(s,i){
    var t=document.createElement('span');t.className='v20Tab'+(i===0?' active':'');t.textContent=s.name;
    t.onclick=function(){selScale=i;tabsEl.querySelectorAll('.v20Tab').forEach(function(x){x.classList.remove('active');});t.classList.add('active');drawScale();};
    tabsEl.appendChild(t);
  });

  function drawScale(){
    var cv=document.getElementById('scaleCv');if(!cv)return;var ctx=cv.getContext('2d');
    var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(20,12,30,0.9)';ctx.fillRect(0,0,W,H);
    var sc=scales[selScale];

    ctx.fillStyle='#D4894A';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
    ctx.fillText(sc.name+' 스케일'+(mastered[sc.name]?' ✅':''),W/2,28);

    var fbY=50,fbH=120,fbW=W-60;
    ctx.fillStyle='rgba(60,30,15,0.6)';ctx.fillRect(30,fbY,fbW,fbH);
    var positions=7;var posW=fbW/positions;
    for(var p=0;p<positions;p++){
      ctx.strokeStyle='rgba(200,180,160,0.4)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(30+p*posW,fbY);ctx.lineTo(30+p*posW,fbY+fbH);ctx.stroke();
      ctx.fillStyle='#b8a090';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText((p+1)+'pos',30+p*posW+posW/2,fbY+fbH+14);
    }

    var stringNames=['G','D','A','E'];
    var stringY=fbH/4;
    stringNames.forEach(function(sn,si){
      var y=fbY+si*stringY+stringY/2;
      ctx.strokeStyle='rgba(212,137,74,0.5)';ctx.lineWidth=si<2?2:1;
      ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(30+fbW,y);ctx.stroke();
      ctx.fillStyle='#D4894A';ctx.font='11px sans-serif';ctx.textAlign='right';
      ctx.fillText(sn,25,y+4);
    });

    sc.notes.forEach(function(n,ni){
      var x=45+ni*(fbW-30)/sc.notes.length;
      var y=fbY+fbH+40+Math.sin(ni*0.5)*15;
      ctx.fillStyle=ni===0||ni===sc.notes.length-1?'#D4894A':'#e8ddd0';
      ctx.beginPath();ctx.arc(x,y+20,14,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#1a1020';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
      ctx.fillText(n,x,y+24);
      if(ni<sc.intervals.length){
        ctx.fillStyle=sc.intervals[ni]==='H'?'#FF9800':'#4CAF50';ctx.font='10px sans-serif';
        ctx.fillText(sc.intervals[ni]==='H'?'반음':'온음',(x+45+(ni+1)*(fbW-30)/sc.notes.length)/2,y+40);
      }
    });

    var fingers=['0(개방)','1(검지)','2(중지)','3(약지)','4(새끼)'];
    ctx.fillStyle='#b8a090';ctx.font='11px sans-serif';ctx.textAlign='center';
    ctx.fillText('손가락: '+fingers.join(' · '),W/2,H-30);

    var mCount=Object.keys(mastered).length;
    ctx.fillText('마스터리: '+mCount+'/'+scales.length+' 스케일',W/2,H-12);
  }

  document.getElementById('scalePlay').onclick=function(){
    v20Sfx('scale_note');addHistory('scale',scales[selScale].name+' 스케일 연습');
  };
  document.getElementById('scaleMaster').onclick=function(){
    mastered[scales[selScale].name]=true;
    localStorage.setItem('v20_scales',JSON.stringify(mastered));
    v20Sfx('achieve_v20');drawScale();
    if(Object.keys(mastered).length>=5)unlockAch('scale_scholar');
  };
  drawScale();
}

/* ===== 4. VISUAL METRONOME (Canvas 560x340) ===== */
function createMetronomePanel(){
  var panel=document.createElement('div');panel.id='metronomePanel';panel.className='v20Panel';
  panel.innerHTML='<span class="v20Close" onclick="this.parentNode.classList.remove(\'show\')">×</span>'+
    '<div class="v20Title">\u{23F1} 비주얼 메트로놆</div>'+
    '<div class="v20SubTitle">애니메이션 펜듈럼 · 세분화 · 점진적 템포 증가</div>'+
    '<div style="text-align:center"><canvas id="metroCv" width="560" height="340"></canvas></div>'+
    '<div style="text-align:center;margin:8px">'+
    '<button class="v20Btn" id="metroMinus">−</button> '+
    '<span id="metroBpmDisplay" style="color:#D4894A;font-size:20px;font-weight:bold;margin:0 12px;">80 BPM</span> '+
    '<button class="v20Btn" id="metroPlus">+</button></div>'+
    '<div style="text-align:center"><button class="v20Btn" id="metroToggle">▶ 시작</button> '+
    '<button class="v20Btn" id="metroSubdiv">세분: 1</button></div>'+
    '<div class="v20Card" id="metroLog"></div>';
  document.body.appendChild(panel);

  var bpm=80,subdiv=1,running=false,metroTimer=null,beatIdx=0,angle=0,dir=1;
  var sessionCount=parseInt(localStorage.getItem('v20_metro_sessions')||'0');

  function drawMetro(){
    var cv=document.getElementById('metroCv');if(!cv)return;var ctx=cv.getContext('2d');
    var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(20,12,30,0.9)';ctx.fillRect(0,0,W,H);

    var cx=W/2,pivotY=30,pendLen=200;
    var maxAngle=Math.PI/6;
    var swing=Math.sin(angle)*maxAngle;
    var bobX=cx+Math.sin(swing)*pendLen;
    var bobY=pivotY+Math.cos(swing)*pendLen;

    ctx.strokeStyle='rgba(212,137,74,0.3)';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(cx,pivotY,pendLen,Math.PI/2-maxAngle,Math.PI/2+maxAngle);ctx.stroke();

    ctx.strokeStyle='#D4894A';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(cx,pivotY);ctx.lineTo(bobX,bobY);ctx.stroke();

    ctx.fillStyle='#D4894A';ctx.beginPath();ctx.arc(bobX,bobY,12,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#1a1020';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText(bpm,bobX,bobY+4);

    ctx.fillStyle='rgba(212,137,74,0.15)';ctx.beginPath();ctx.arc(cx,pivotY,6,0,Math.PI*2);ctx.fill();

    var beatBoxes=subdiv*4;
    var boxW=Math.min(30,(W-80)/beatBoxes);
    var startX=(W-beatBoxes*boxW)/2;
    for(var i=0;i<beatBoxes;i++){
      var isDown=i%subdiv===0;
      ctx.fillStyle=i===beatIdx%beatBoxes?(isDown?'#D4894A':'#e8a060'):(isDown?'rgba(212,137,74,0.3)':'rgba(212,137,74,0.1)');
      ctx.fillRect(startX+i*boxW+1,H-50,boxW-2,20);
    }

    ctx.fillStyle='#b8a090';ctx.font='11px sans-serif';ctx.textAlign='center';
    ctx.fillText('세션: '+(sessionCount)+'회 | 세분화: '+subdiv+'박',W/2,H-10);
  }

  function tick(){
    beatIdx++;angle+=Math.PI/8*dir;
    if(Math.abs(angle)>Math.PI)dir*=-1;
    v20Sfx('metro_tick');drawMetro();
  }

  document.getElementById('metroToggle').onclick=function(){
    if(running){clearInterval(metroTimer);running=false;this.textContent='▶ 시작';
      sessionCount++;localStorage.setItem('v20_metro_sessions',sessionCount);
      if(sessionCount>=10)unlockAch('tempo_keeper');
      addHistory('metronome',bpm+'BPM 세션 종료');
    }else{
      running=true;this.textContent='⏸ 정지';beatIdx=0;angle=0;dir=1;
      var interval=60000/(bpm*subdiv);
      metroTimer=setInterval(tick,interval);
    }
  };
  document.getElementById('metroMinus').onclick=function(){bpm=Math.max(40,bpm-5);document.getElementById('metroBpmDisplay').textContent=bpm+' BPM';if(running){clearInterval(metroTimer);metroTimer=setInterval(tick,60000/(bpm*subdiv));}};
  document.getElementById('metroPlus').onclick=function(){bpm=Math.min(200,bpm+5);document.getElementById('metroBpmDisplay').textContent=bpm+' BPM';if(running){clearInterval(metroTimer);metroTimer=setInterval(tick,60000/(bpm*subdiv));}};
  document.getElementById('metroSubdiv').onclick=function(){subdiv=subdiv>=4?1:subdiv+1;this.textContent='세분: '+subdiv;if(running){clearInterval(metroTimer);metroTimer=setInterval(tick,60000/(bpm*subdiv));}};
  drawMetro();
}

/* ===== 5. POSTURE GUIDE (Canvas 580x360) ===== */
function createPosturePanel(){
  var panel=document.createElement('div');panel.id='posturePanel';panel.className='v20Panel';
  panel.innerHTML='<span class="v20Close" onclick="this.parentNode.classList.remove(\'show\')">×</span>'+
    '<div class="v20Title">\u{1F9D8} 자세 가이드</div>'+
    '<div class="v20SubTitle">올바른 연주 자세 12항목 체크포인트 · 자가진단</div>'+
    '<div style="text-align:center"><canvas id="postureCv" width="580" height="360"></canvas></div>'+
    '<div class="v20Grid" id="postureChecks"></div>'+
    '<div class="v20Card" id="postureResult"></div>';
  document.body.appendChild(panel);

  var checks=[
    {id:'head',name:'머리 위치',desc:'자연스럽게 앞을 향함',x:290,y:30},
    {id:'chin',name:'턴 접촉',desc:'턴레스트에 가볍게 댓',x:270,y:60},
    {id:'lshoulder',name:'좌측 어깨',desc:'자연스럽게 내려옴',x:220,y:90},
    {id:'rshoulder',name:'우측 어깨',desc:'보잉 팔 어깨 자유롭게',x:360,y:90},
    {id:'lhand',name:'좌수 손목',desc:'손목 곧게, 엄지 자연스럽게',x:180,y:140},
    {id:'rhand',name:'우수 보잉',desc:'손가락 자연스럽게 휴어짐',x:400,y:140},
    {id:'elbow_l',name:'좌측 팔꽅치',desc:'소리괬치 아래 유지',x:200,y:170},
    {id:'elbow_r',name:'우측 팔꽅치',desc:'보잉 각도에 따라 유연',x:380,y:170},
    {id:'back',name:'등 자세',desc:'곧게 펴되 긴장 없이',x:290,y:180},
    {id:'hip',name:'골반 균형',desc:'양측 대칭으로 균형',x:290,y:230},
    {id:'knee',name:'무릅',desc:'살짝 굽혀 탄력적',x:290,y:280},
    {id:'feet',name:'발 배치',desc:'어깨 너비로 안정적',x:290,y:320}
  ];
  var checked=JSON.parse(localStorage.getItem('v20_posture')||'{}');

  function drawPosture(){
    var cv=document.getElementById('postureCv');if(!cv)return;var ctx=cv.getContext('2d');
    var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(20,12,30,0.9)';ctx.fillRect(0,0,W,H);

    ctx.strokeStyle='rgba(212,137,74,0.4)';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(290,45,20,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(290,65);ctx.lineTo(290,200);ctx.stroke();
    ctx.beginPath();ctx.moveTo(290,90);ctx.lineTo(200,160);ctx.stroke();
    ctx.beginPath();ctx.moveTo(290,90);ctx.lineTo(380,160);ctx.stroke();
    ctx.beginPath();ctx.moveTo(290,200);ctx.lineTo(250,300);ctx.stroke();
    ctx.beginPath();ctx.moveTo(290,200);ctx.lineTo(330,300);ctx.stroke();

    ctx.beginPath();ctx.moveTo(200,160);ctx.lineTo(170,130);ctx.stroke();
    ctx.beginPath();ctx.moveTo(380,160);ctx.lineTo(420,130);ctx.stroke();
    ctx.strokeStyle='rgba(160,96,48,0.5)';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(170,130);ctx.quadraticCurveTo(230,80,270,60);ctx.stroke();

    checks.forEach(function(c){
      var done=checked[c.id];
      ctx.fillStyle=done?'rgba(76,175,80,0.7)':'rgba(255,152,0,0.5)';
      ctx.beginPath();ctx.arc(c.x,c.y,8,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=done?'#4CAF50':'#FF9800';ctx.font='9px sans-serif';ctx.textAlign='left';
      ctx.fillText(c.name+(done?' ✓':''),c.x+12,c.y+3);
    });

    var doneCount=Object.keys(checked).length;
    ctx.fillStyle='#D4894A';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
    ctx.fillText('체크: '+doneCount+'/12 | 등급: '+(doneCount>=12?'S':doneCount>=9?'A':doneCount>=6?'B':doneCount>=3?'C':'D'),W/2,H-8);
  }

  var grid=document.getElementById('postureChecks');
  checks.forEach(function(c){
    var btn=document.createElement('button');btn.className='v20Btn';
    btn.textContent=(checked[c.id]?'✅':'⬜')+' '+c.name;
    btn.onclick=function(){
      checked[c.id]=!checked[c.id];if(!checked[c.id])delete checked[c.id];
      localStorage.setItem('v20_posture',JSON.stringify(checked));
      btn.textContent=(checked[c.id]?'✅':'⬜')+' '+c.name;
      v20Sfx('posture_check');drawPosture();
      if(Object.keys(checked).length>=12)unlockAch('posture_perfect');
    };
    grid.appendChild(btn);
  });
  drawPosture();
}

/* ===== 6. SIGHT-READING TRAINER (Canvas 580x340) ===== */
function createSightReadingPanel(){
  var panel=document.createElement('div');panel.id='sightReadPanel';panel.className='v20Panel';
  panel.innerHTML='<span class="v20Close" onclick="this.parentNode.classList.remove(\'show\')">×</span>'+
    '<div class="v20Title">\u{1F4D6} 초견 연습기</div>'+
    '<div class="v20SubTitle">무작위 악보 생성 · 난이도별 · 응답 시간 측정</div>'+
    '<div style="text-align:center"><canvas id="sightCv" width="580" height="340"></canvas></div>'+
    '<div class="v20Tabs" id="sightDiffTabs"></div>'+
    '<div style="text-align:center;margin:8px"><button class="v20Btn" id="sightGen">\u{1F3B2} 새 악보</button> '+
    '<button class="v20Btn" id="sightAnswer">✅ 정답 확인</button></div>'+
    '<div class="v20Card" id="sightStats"></div>';
  document.body.appendChild(panel);

  var allNotes=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5'];
  var difficulties=[{name:'입문',count:4,pool:5},{name:'초급',count:6,pool:7},{name:'중급',count:8,pool:10},{name:'고급',count:10,pool:12}];
  var selDiff=0,currentNotes=[],startTime=0;
  var sessions=JSON.parse(localStorage.getItem('v20_sight')||'[]');

  var tabsEl=document.getElementById('sightDiffTabs');
  difficulties.forEach(function(d,i){
    var t=document.createElement('span');t.className='v20Tab'+(i===0?' active':'');t.textContent=d.name;
    t.onclick=function(){selDiff=i;tabsEl.querySelectorAll('.v20Tab').forEach(function(x){x.classList.remove('active');});t.classList.add('active');};
    tabsEl.appendChild(t);
  });

  function genNotes(){
    var d=difficulties[selDiff];currentNotes=[];
    for(var i=0;i<d.count;i++){currentNotes.push(allNotes[Math.floor(Math.random()*d.pool)]);}
    startTime=Date.now();v20Sfx('sight_note');drawSight();
  }

  function drawSight(){
    var cv=document.getElementById('sightCv');if(!cv)return;var ctx=cv.getContext('2d');
    var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(20,12,30,0.9)';ctx.fillRect(0,0,W,H);

    ctx.fillStyle='#D4894A';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('초견 연습 - '+difficulties[selDiff].name,W/2,25);

    var staffY=80,staffGap=12;
    ctx.strokeStyle='rgba(212,137,74,0.5)';ctx.lineWidth=1;
    for(var l=0;l<5;l++){
      ctx.beginPath();ctx.moveTo(40,staffY+l*staffGap);ctx.lineTo(W-40,staffY+l*staffGap);ctx.stroke();
    }

    ctx.fillStyle='#D4894A';ctx.font='bold 24px serif';ctx.textAlign='left';
    ctx.fillText('\u{1D11E}',45,staffY+3.5*staffGap);

    var notePositions={C4:6,D4:5.5,E4:5,F4:4.5,G4:4,A4:3.5,B4:3,C5:2.5,D5:2,E5:1.5,F5:1,G5:0.5};
    if(currentNotes.length>0){
      var spacing=(W-140)/currentNotes.length;
      currentNotes.forEach(function(n,i){
        var x=100+i*spacing;
        var yPos=notePositions[n]||3;
        var y=staffY+yPos*staffGap;
        ctx.fillStyle='#e8ddd0';ctx.beginPath();
        ctx.ellipse(x,y,8,6,0,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#e8ddd0';ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(x+8,y);ctx.lineTo(x+8,y-35);ctx.stroke();

        if(yPos>=5.5){
          for(var ll=5;ll<=yPos;ll+=0.5){
            if(ll%1===0){
              ctx.strokeStyle='rgba(212,137,74,0.5)';ctx.lineWidth=1;
              ctx.beginPath();ctx.moveTo(x-12,staffY+ll*staffGap);ctx.lineTo(x+12,staffY+ll*staffGap);ctx.stroke();
            }
          }
        }
      });
    }

    if(sessions.length>0){
      var chartY=200,chartH=100,chartW=W-80;
      ctx.fillStyle='#b8a090';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText('최근 응답 시간 (ms)',W/2,chartY-5);

      var maxTime=Math.max.apply(null,sessions.map(function(s){return s.time;}).concat([3000]));
      var showSessions=sessions.slice(-20);
      var barW=(chartW-10)/showSessions.length;
      showSessions.forEach(function(s,i){
        var barH=s.time/maxTime*chartH;
        ctx.fillStyle=s.time<2000?'#4CAF50':s.time<4000?'#FFC107':'#F44336';
        ctx.fillRect(45+i*barW,chartY+chartH-barH,barW-2,barH);
      });
    }

    ctx.fillStyle='#b8a090';ctx.font='11px sans-serif';ctx.textAlign='center';
    ctx.fillText('총 '+sessions.length+'회 연습 | 평균 '+(sessions.length>0?Math.round(sessions.reduce(function(a,s){return a+s.time;},0)/sessions.length)+'ms':'--'),W/2,H-10);
  }

  document.getElementById('sightGen').onclick=genNotes;
  document.getElementById('sightAnswer').onclick=function(){
    if(currentNotes.length===0)return;
    var elapsed=Date.now()-startTime;
    sessions.push({time:elapsed,diff:selDiff,count:currentNotes.length,ts:Date.now()});
    if(sessions.length>50)sessions=sessions.slice(-50);
    localStorage.setItem('v20_sight',JSON.stringify(sessions));
    v20Sfx('rhythm_good');
    if(sessions.length>=20)unlockAch('sight_reader');
    addHistory('sight','초견 연습 '+elapsed+'ms '+difficulties[selDiff].name);
    currentNotes=[];drawSight();
  };
  drawSight();
}

/* ===== 7. PRACTICE PROGRESS GRAPH (Canvas 600x380) ===== */
function createProgressGraphPanel(){
  var panel=document.createElement('div');panel.id='progressGraphPanel';panel.className='v20Panel';
  panel.innerHTML='<span class="v20Close" onclick="this.parentNode.classList.remove(\'show\')">×</span>'+
    '<div class="v20Title">\u{1F4C8} 연습 진도 그래프</div>'+
    '<div class="v20SubTitle">장기 연습 추이 · 스킬 레이더 · 주간 분석</div>'+
    '<div style="text-align:center"><canvas id="progressCv" width="600" height="380"></canvas></div>'+
    '<div style="text-align:center;margin:8px"><button class="v20Btn" id="progLog">\u{1F4DD} 오늘 기록</button> '+
    '<button class="v20Btn" id="progRandom">\u{1F3B2} 예시 데이터</button></div>'+
    '<div class="v20Card" id="progSummary"></div>';
  document.body.appendChild(panel);

  var logs=JSON.parse(localStorage.getItem('v20_progress')||'[]');

  function drawProgress(){
    var cv=document.getElementById('progressCv');if(!cv)return;var ctx=cv.getContext('2d');
    var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(20,12,30,0.9)';ctx.fillRect(0,0,W,H);

    ctx.fillStyle='#D4894A';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('연습 진도 추이 ('+logs.length+'일)',W/2,25);

    if(logs.length<2){
      ctx.fillStyle='#b8a090';ctx.font='13px sans-serif';
      ctx.fillText('데이터를 축적하면 그래프가 표시됩니다',W/2,H/2);
      return;
    }

    var metrics=['accuracy','speed','expression','stamina','focus'];
    var colors=['#4CAF50','#2196F3','#FF9800','#E91E63','#9C27B0'];
    var names=['정확도','속도','표현력','지구력','집중력'];

    var chartX=60,chartY=50,chartW=W-100,chartH=180;
    ctx.strokeStyle='rgba(212,137,74,0.2)';ctx.lineWidth=1;
    for(var g=0;g<=4;g++){
      var gy=chartY+g*(chartH/4);
      ctx.beginPath();ctx.moveTo(chartX,gy);ctx.lineTo(chartX+chartW,gy);ctx.stroke();
      ctx.fillStyle='#b8a090';ctx.font='9px sans-serif';ctx.textAlign='right';
      ctx.fillText((100-g*25),chartX-5,gy+3);
    }

    var showLogs=logs.slice(-30);
    var stepX=chartW/(showLogs.length-1||1);

    metrics.forEach(function(m,mi){
      ctx.strokeStyle=colors[mi];ctx.lineWidth=1.5;ctx.beginPath();
      showLogs.forEach(function(log,li){
        var x=chartX+li*stepX;
        var y=chartY+chartH-(log[m]||0)/100*chartH;
        if(li===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });
      ctx.stroke();
    });

    var legendY=chartY+chartH+30;
    names.forEach(function(n,i){
      var lx=60+i*110;
      ctx.fillStyle=colors[i];ctx.fillRect(lx,legendY,12,12);
      ctx.fillStyle='#e8ddd0';ctx.font='11px sans-serif';ctx.textAlign='left';
      ctx.fillText(n,lx+16,legendY+10);
    });

    var radarCx=W/2,radarCy=legendY+80,radarR=50;
    if(showLogs.length>0){
      var last=showLogs[showLogs.length-1];
      metrics.forEach(function(m,mi){
        var a=-Math.PI/2+mi*(2*Math.PI/5);
        var ex=radarCx+Math.cos(a)*radarR;var ey=radarCy+Math.sin(a)*radarR;
        ctx.strokeStyle='rgba(212,137,74,0.3)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(radarCx,radarCy);ctx.lineTo(ex,ey);ctx.stroke();
        ctx.fillStyle='#b8a090';ctx.font='9px sans-serif';ctx.textAlign='center';
        ctx.fillText(names[mi],ex+(ex>radarCx?15:-15),ey+(ey>radarCy?12:-5));
      });
      ctx.fillStyle='rgba(212,137,74,0.2)';ctx.strokeStyle='#D4894A';ctx.lineWidth=1.5;
      ctx.beginPath();
      metrics.forEach(function(m,mi){
        var a=-Math.PI/2+mi*(2*Math.PI/5);var v=(last[m]||0)/100;
        var px=radarCx+Math.cos(a)*radarR*v;var py=radarCy+Math.sin(a)*radarR*v;
        if(mi===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      });
      ctx.closePath();ctx.fill();ctx.stroke();
    }
  }

  document.getElementById('progLog').onclick=function(){
    var entry={
      accuracy:60+Math.floor(Math.random()*40),
      speed:50+Math.floor(Math.random()*50),
      expression:40+Math.floor(Math.random()*60),
      stamina:50+Math.floor(Math.random()*50),
      focus:45+Math.floor(Math.random()*55),
      ts:Date.now()
    };
    logs.push(entry);if(logs.length>60)logs=logs.slice(-60);
    localStorage.setItem('v20_progress',JSON.stringify(logs));
    v20Sfx('progress_log');drawProgress();
    if(logs.length>=30)unlockAch('progress_tracker');
    addHistory('progress','연습 기록 추가 ('+logs.length+'일)');
  };

  document.getElementById('progRandom').onclick=function(){
    for(var i=0;i<10;i++){
      logs.push({
        accuracy:50+Math.floor(Math.random()*50),speed:40+Math.floor(Math.random()*60),
        expression:35+Math.floor(Math.random()*65),stamina:45+Math.floor(Math.random()*55),
        focus:40+Math.floor(Math.random()*60),ts:Date.now()-((10-i)*86400000)
      });
    }
    if(logs.length>60)logs=logs.slice(-60);
    localStorage.setItem('v20_progress',JSON.stringify(logs));
    v20Sfx('progress_log');drawProgress();
  };
  drawProgress();
}

/* ===== 8. FINGERING POSITION MAP (Canvas 620x380) ===== */
function createFingeringMapPanel(){
  var panel=document.createElement('div');panel.id='fingeringMapPanel';panel.className='v20Panel';
  panel.innerHTML='<span class="v20Close" onclick="this.parentNode.classList.remove(\'show\')">×</span>'+
    '<div class="v20Title">\u{1F5FA} 핑거링 포지션 맵</div>'+
    '<div class="v20SubTitle">1st~7th 포지션 · 4현 전체 음역 · 클릭 탐색</div>'+
    '<div style="text-align:center"><canvas id="fingerCv" width="620" height="380"></canvas></div>'+
    '<div class="v20Tabs" id="fingerPosTabs"></div>'+
    '<div style="text-align:center;margin:8px"><button class="v20Btn" id="fingerRandom">\u{1F3B2} 랜덤 음</button></div>'+
    '<div class="v20Card" id="fingerInfo"></div>';
  document.body.appendChild(panel);

  var positions=[
    {name:'1st',notes:{G:['G','A','B','C'],D:['D','E','F#','G'],A:['A','B','C#','D'],E:['E','F#','G#','A']}},
    {name:'2nd',notes:{G:['A','B','C','D'],D:['E','F#','G','A'],A:['B','C#','D','E'],E:['F#','G#','A','B']}},
    {name:'3rd',notes:{G:['B','C','D','E'],D:['F#','G','A','B'],A:['C#','D','E','F#'],E:['G#','A','B','C#']}},
    {name:'4th',notes:{G:['C','D','E','F'],D:['G','A','B','C'],A:['D','E','F#','G'],E:['A','B','C#','D']}},
    {name:'5th',notes:{G:['D','E','F','G'],D:['A','B','C','D'],A:['E','F#','G','A'],E:['B','C#','D','E']}},
    {name:'6th',notes:{G:['E','F','G','A'],D:['B','C','D','E'],A:['F#','G','A','B'],E:['C#','D','E','F#']}},
    {name:'7th',notes:{G:['F','G','A','B'],D:['C','D','E','F#'],A:['G','A','B','C#'],E:['D','E','F#','G#']}}
  ];
  var selPos=0,explored=JSON.parse(localStorage.getItem('v20_fingerPos')||'{}');
  var highlightNote=null;

  var tabsEl=document.getElementById('fingerPosTabs');
  positions.forEach(function(p,i){
    var t=document.createElement('span');t.className='v20Tab'+(i===0?' active':'');t.textContent=p.name;
    t.onclick=function(){selPos=i;highlightNote=null;
      tabsEl.querySelectorAll('.v20Tab').forEach(function(x){x.classList.remove('active');});t.classList.add('active');
      explored[p.name]=true;localStorage.setItem('v20_fingerPos',JSON.stringify(explored));
      drawFinger();
      if(Object.keys(explored).length>=7)unlockAch('position_explorer');
    };
    tabsEl.appendChild(t);
  });

  function drawFinger(){
    var cv=document.getElementById('fingerCv');if(!cv)return;var ctx=cv.getContext('2d');
    var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(20,12,30,0.9)';ctx.fillRect(0,0,W,H);
    var pos=positions[selPos];

    ctx.fillStyle='#D4894A';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText(pos.name+' Position 핑거링 맵',W/2,25);

    var fbX=50,fbY=50,fbW=W-100,fbH=220;
    ctx.fillStyle='rgba(60,30,15,0.5)';ctx.fillRect(fbX,fbY,fbW,fbH);

    var strings=['G','D','A','E'];
    var fingers=['0(개방현)','1(검지)','2(중지)','3(약지)'];
    var stringH=fbH/4;
    var fingerW=fbW/4;

    strings.forEach(function(s,si){
      var y=fbY+si*stringH+stringH/2;
      ctx.strokeStyle='rgba(212,137,74,'+(0.3+si*0.15)+')';ctx.lineWidth=3-si*0.5;
      ctx.beginPath();ctx.moveTo(fbX,y);ctx.lineTo(fbX+fbW,y);ctx.stroke();
      ctx.fillStyle='#D4894A';ctx.font='bold 13px sans-serif';ctx.textAlign='right';
      ctx.fillText(s+'현',fbX-8,y+5);

      var notes=pos.notes[s];
      notes.forEach(function(n,fi){
        var x=fbX+fi*fingerW+fingerW/2;
        var isHighlight=highlightNote&&highlightNote===n;
        ctx.fillStyle=isHighlight?'#FF9800':'rgba(212,137,74,0.6)';
        ctx.beginPath();ctx.arc(x,y,isHighlight?16:13,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#1a1020';ctx.font='bold '+(isHighlight?'13':'11')+'px sans-serif';ctx.textAlign='center';
        ctx.fillText(n,x,y+4);
      });
    });

    fingers.forEach(function(f,i){
      ctx.fillStyle='#b8a090';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(f,fbX+i*fingerW+fingerW/2,fbY+fbH+18);
    });

    var expCount=Object.keys(explored).length;
    ctx.fillStyle='#b8a090';ctx.font='11px sans-serif';ctx.textAlign='center';
    ctx.fillText('탐색: '+expCount+'/7 포지션'+(highlightNote?' | 하이라이트: '+highlightNote:''),W/2,H-15);
  }

  document.getElementById('fingerRandom').onclick=function(){
    var pos=positions[selPos];
    var allN=[];strings=['G','D','A','E'];
    strings.forEach(function(s){pos.notes[s].forEach(function(n){allN.push(n);});});
    highlightNote=allN[Math.floor(Math.random()*allN.length)];
    v20Sfx('finger_tap');drawFinger();
  };

  var fingerCv=document.getElementById('fingerCv');
  if(fingerCv){
    fingerCv.addEventListener('click',function(e){
      var rect=fingerCv.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(380/rect.height);
      var fbX=50,fbY=50,fbW=520,fbH=220;
      var stringH=fbH/4,fingerW=fbW/4;
      var pos=positions[selPos];var strs=['G','D','A','E'];
      strs.forEach(function(s,si){
        var notes=pos.notes[s];
        notes.forEach(function(n,fi){
          var x=fbX+fi*fingerW+fingerW/2;var y=fbY+si*stringH+stringH/2;
          if(Math.abs(mx-x)<18&&Math.abs(my-y)<18){highlightNote=n;v20Sfx('finger_tap');drawFinger();}
        });
      });
    });
  }
  drawFinger();
}

/* ===== QUIZ V20 PANEL ===== */
function createQuizV20Panel(){
  var panel=document.createElement('div');panel.id='quizV20Panel';panel.className='v20Panel';
  panel.innerHTML='<span class="v20Close" onclick="this.parentNode.classList.remove(\'show\')">×</span>'+
    '<div class="v20Title">\u{1F9E0} v20 퀵즈 (15문항)</div>'+
    '<div class="v20SubTitle">음정/리듬/스케일/초견/자세/포지션 종합 퀵즈</div>'+
    '<div id="quizV20Content" style="max-width:500px;margin:0 auto;padding:10px;"></div>'+
    '<div id="quizV20Result" class="v20Card" style="display:none;text-align:center;"></div>';
  document.body.appendChild(panel);

  var qIdx=0,score=0,answered=false;
  function showQ(){
    var el=document.getElementById('quizV20Content');if(!el)return;
    if(qIdx>=V20_QUIZ.length){
      var pct=Math.round(score/V20_QUIZ.length*100);
      var grade=pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';
      el.innerHTML='<div class="v20Card" style="text-align:center;font-size:18px;">\u{1F3C6} 결과: '+score+'/'+V20_QUIZ.length+' ('+pct+'%) 등급: '+grade+'</div>';
      if(pct===100)unlockAch('quiz_v20_master');
      addHistory('quiz','v20 퀵즈 '+score+'/'+V20_QUIZ.length+' '+grade);
      return;
    }
    var q=V20_QUIZ[qIdx];answered=false;
    var h='<div class="v20Card"><div style="color:#D4894A;font-weight:bold;margin-bottom:8px;">Q'+(qIdx+1)+'. '+q.q+'</div>';
    q.a.forEach(function(a,i){
      h+='<button class="v20Btn v20QuizOpt" data-idx="'+i+'" style="display:block;width:100%;margin:4px 0;text-align:left;">'+a+'</button>';
    });
    h+='</div>';el.innerHTML=h;
    el.querySelectorAll('.v20QuizOpt').forEach(function(btn){
      btn.onclick=function(){
        if(answered)return;answered=true;
        var chosen=parseInt(btn.getAttribute('data-idx'));
        if(chosen===q.c){score++;btn.style.background='#4CAF50';v20Sfx('quiz_v20');}
        else{btn.style.background='#F44336';v20Sfx('quiz_wrong_v20');
          el.querySelectorAll('.v20QuizOpt')[q.c].style.background='#4CAF50';}
        setTimeout(function(){qIdx++;showQ();},1200);
      };
    });
  }

  panel.addEventListener('click',function(e){if(e.target.classList.contains('v20Close')){qIdx=0;score=0;}});
  var obs=new MutationObserver(function(){if(panel.classList.contains('show')&&qIdx===0){showQ();}});
  obs.observe(panel,{attributes:true,attributeFilter:['class']});
}

/* ===== REGISTER SONGS/LESSONS ===== */
if(window.SONG_DB&&Array.isArray(window.SONG_DB)){V20_SONGS.forEach(function(s){window.SONG_DB.push(s);});}
if(window.LESSON_DB&&Array.isArray(window.LESSON_DB)){V20_LESSONS.forEach(function(l){window.LESSON_DB.push(l);});}

/* ===== NAVIGATION (append to existing nav - NO new bottom bar) ===== */
function addV20Nav(){
  var features=[
    {id:'pitchDeviationPanel',label:'\u{1F3AF}음정편차'},
    {id:'rhythmTrainerPanel',label:'\u{1F941}리듬'},
    {id:'scaleBuilderPanel',label:'\u{1F3B5}스케일'},
    {id:'metronomePanel',label:'\u{23F1}메트로놆'},
    {id:'posturePanel',label:'\u{1F9D8}자세'},
    {id:'sightReadPanel',label:'\u{1F4D6}초견'},
    {id:'progressGraphPanel',label:'\u{1F4C8}진도'},
    {id:'fingeringMapPanel',label:'\u{1F5FA}핑거링'},
    {id:'quizV20Panel',label:'\u{1F9E0}Quiz'}
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
    btn.style.cssText='background:linear-gradient(135deg,#D4894A,#a06030);color:#fff;border:none;border-radius:6px;padding:4px 7px;font-size:11px;cursor:pointer;white-space:nowrap;touch-action:manipulation;';
    btn.textContent=f.label;
    btn.onclick=function(){
      var p=document.getElementById(f.id);if(p)p.classList.add('show');
      v20Sfx('pitch_scan');
      var used=JSON.parse(localStorage.getItem('v20_used')||'[]');
      if(used.indexOf(f.id)===-1){used.push(f.id);localStorage.setItem('v20_used',JSON.stringify(used));}
      if(used.length>=4)unlockAch('v20_explorer');
      if(used.length>=9)unlockAch('v20_complete');
    };
    wrap.appendChild(btn);
  });

  navTarget.appendChild(wrap);
}

/* ===== KEYBOARD SHORTCUTS (Shift+1~8, Shift+0 for Quiz) ===== */
document.addEventListener('keydown',function(e){
  if(!e.shiftKey)return;
  var panels=['pitchDeviationPanel','rhythmTrainerPanel','scaleBuilderPanel','metronomePanel','posturePanel','sightReadPanel','progressGraphPanel','fingeringMapPanel','quizV20Panel'];
  var map={Digit1:0,Digit2:1,Digit3:2,Digit4:3,Digit5:4,Digit6:5,Digit7:6,Digit8:7,Digit0:8};
  if(map[e.code]!==undefined){
    e.preventDefault();
    var p=document.getElementById(panels[map[e.code]]);if(p)p.classList.add('show');
  }
});

/* ===== ACHIEVEMENT REGISTRATION ===== */
if(window.ACH_DB&&Array.isArray(window.ACH_DB)){V20_ACHS.forEach(function(a){window.ACH_DB.push(a);});}

/* ===== INIT ===== */
function initV20(){
  createPitchDeviationPanel();
  createRhythmTrainerPanel();
  createScaleBuilderPanel();
  createMetronomePanel();
  createPosturePanel();
  createSightReadingPanel();
  createProgressGraphPanel();
  createFingeringMapPanel();
  createQuizV20Panel();
  addV20Nav();
  saveProgress({v20_loaded:1});
  unlockAch('song_174');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initV20);}
else{initV20();}

})();
