(function V30Patch(){
'use strict';
if(window.__V30_LOADED)return;
window.__V30_LOADED=true;

var LS_PRE='vn30_';
function lp(k,d){try{return JSON.parse(localStorage.getItem(LS_PRE+k))||d;}catch(e){return d;}}
function sp(k,v){try{localStorage.setItem(LS_PRE+k,JSON.stringify(v));}catch(e){}}

var achDB=window.ACH_DB||(window.ACH_DB=[]);
var songDB=window.SONG_DB||(window.SONG_DB=[]);
var lessonDB=window.LESSON_DB||(window.LESSON_DB=[]);

function loadAch(){return lp('ach',{});}
function saveAch(a){sp('ach',a);}
function unlockAch(id){
  var a=loadAch();
  if(a[id])return;
  a[id]=Date.now();
  saveAch(a);
  sfx('achieve');
  addHistory('v30','achievement',id);
  var total=V30_ACHS.filter(function(x){return a[x.id];}).length;
  if(total>=V30_ACHS.length){
    var self_id='v30_complete';
    if(!a[self_id]){a[self_id]=Date.now();saveAch(a);}
  }
}
function addHistory(ver,type,detail){
  var h=lp('history',[]);
  h.push({t:Date.now(),v:ver,type:type,d:detail});
  if(h.length>500)h=h.slice(-400);
  sp('history',h);
}

var audioCtx=null;
function getCtx(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();return audioCtx;}
function sfx(type){
  try{
    var ctx=getCtx();var o=ctx.createOscillator();var g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    var t=ctx.currentTime;
    var types={
      'bow_curve':{f:523,w:'sine',d:0.15,v:0.12},
      'tone_match':{f:659,w:'triangle',d:0.12,v:0.1},
      'orch_seat':{f:440,w:'sine',d:0.18,v:0.11},
      'finger_map':{f:587,w:'square',d:0.1,v:0.08},
      'tempo_pulse':{f:392,w:'sawtooth',d:0.13,v:0.09},
      'string_cross':{f:494,w:'triangle',d:0.14,v:0.1},
      'ear_train':{f:554,w:'sine',d:0.16,v:0.11},
      'stage_fright':{f:349,w:'sine',d:0.2,v:0.08},
      'quiz30':{f:698,w:'triangle',d:0.12,v:0.1},
      'achieve':{f:880,w:'sine',d:0.25,v:0.13},
      'panel_open':{f:523,w:'triangle',d:0.08,v:0.07},
      'panel_close':{f:415,w:'triangle',d:0.08,v:0.07},
      'btn_click':{f:620,w:'square',d:0.06,v:0.06},
      'nav_click':{f:466,w:'sine',d:0.07,v:0.06},
      'data_save':{f:740,w:'triangle',d:0.1,v:0.08},
      'grade_show':{f:784,w:'sine',d:0.18,v:0.11}
    };
    var s=types[type]||types['btn_click'];
    o.type=s.w;o.frequency.setValueAtTime(s.f,t);
    g.gain.setValueAtTime(s.v,t);g.gain.exponentialRampToValueAtTime(0.001,t+s.d);
    o.start(t);o.stop(t+s.d);
  }catch(e){}
}

var V30_SONGS=[
  {id:'s265',title:'Violin Concerto in A minor, Op.82',composer:'Glazunov',difficulty:5,key:'Am',bpm:120,duration:180,techniques:['legato','vibrato','double-stop','cadenza'],era:'Romantic'},
  {id:'s266',title:'Czardas',composer:'Monti',difficulty:4,key:'Dm',bpm:140,duration:150,techniques:['spiccato','glissando','vibrato','pizzicato'],era:'Romantic'},
  {id:'s267',title:'Violin Sonata No.9 "Kreutzer" - 1st',composer:'Beethoven',difficulty:5,key:'A',bpm:132,duration:200,techniques:['double-stop','tremolo','forte','legato'],era:'Classical'},
  {id:'s268',title:'Havanaise, Op.83',composer:'Saint-Saens',difficulty:5,key:'E',bpm:108,duration:170,techniques:['vibrato','harmonics','spiccato','rubato'],era:'Romantic'},
  {id:'s269',title:'Violin Concerto No.2 "La Campanella"',composer:'Paganini',difficulty:5,key:'Bm',bpm:144,duration:190,techniques:['harmonics','left-hand-pizz','ricochet','staccato'],era:'Romantic'},
  {id:'s270',title:'Meditation from Thais',composer:'Massenet',difficulty:3,key:'D',bpm:66,duration:140,techniques:['vibrato','legato','portamento','piano'],era:'Romantic'},
  {id:'s271',title:'Nocturne in C# minor',composer:'Chopin-Milstein',difficulty:4,key:'C#m',bpm:72,duration:160,techniques:['legato','vibrato','expression','rubato'],era:'Romantic'},
  {id:'s272',title:'Violin Partita No.2 - Sarabande',composer:'Bach',difficulty:4,key:'Dm',bpm:56,duration:130,techniques:['chords','baroque-bow','ornament','polyphony'],era:'Baroque'},
  {id:'s273',title:'Tzigane - Rapsodie de concert',composer:'Ravel',difficulty:5,key:'Dm',bpm:120,duration:200,techniques:['harmonics','pizzicato','glissando','tremolo'],era:'Modern'},
  {id:'s274',title:'Salut d\'Amour, Op.12',composer:'Elgar',difficulty:3,key:'E',bpm:76,duration:120,techniques:['legato','vibrato','expression','portamento'],era:'Romantic'}
];

var V30_LESSONS=[
  {id:'l291',title:'활 곡선 궤적과 음질의 관계',level:'advanced',duration:25,topics:['bow-curve','tone-production','contact-point']},
  {id:'l292',title:'음색 매칭 기법 - 작곡가별 톤 특성',level:'advanced',duration:30,topics:['tone-matching','composer-style','timbre']},
  {id:'l293',title:'오케스트라 좌석 배치와 음향 효과',level:'intermediate',duration:20,topics:['orchestra-seating','acoustics','ensemble']},
  {id:'l294',title:'포지션별 운지 최적화 전략',level:'advanced',duration:25,topics:['fingering','position','efficiency']},
  {id:'l295',title:'템포 변화와 루바토의 예술',level:'advanced',duration:30,topics:['tempo','rubato','expression']},
  {id:'l296',title:'현 교차 테크닉 고급 과정',level:'advanced',duration:25,topics:['string-crossing','bow-control','arpeggios']},
  {id:'l297',title:'절대음감 및 상대음감 훈련법',level:'beginner',duration:20,topics:['ear-training','pitch-recognition','intervals']},
  {id:'l298',title:'무대 불안 극복 - 실전 전략 8가지',level:'intermediate',duration:25,topics:['stage-fright','performance','mental']},
  {id:'l299',title:'Glazunov 협주곡 해석 가이드',level:'advanced',duration:35,topics:['glazunov','concerto','interpretation']},
  {id:'l300',title:'Ravel Tzigane 기법 분석',level:'advanced',duration:30,topics:['ravel','tzigane','virtuosity']}
];

var V30_QUIZZES=[
  {id:'q301',q:'활의 곡선 궤적에서 "직선 보잉"의 의미는?',a:['활이 브릿지와 완벽히 평행하게 움직이는 것','활을 최대한 빨리 움직이는 것','활을 짧게 사용하는 것','활을 지판 위에서 사용하는 것'],c:0,cat:'bowing'},
  {id:'q302',q:'톤 매칭에서 Stradivarius 음색의 특징은?',a:['밝고 투사력이 강한 톤','어둡고 묵직한 톤','금속적이고 날카로운 톤','부드럽고 울림이 약한 톤'],c:0,cat:'tone'},
  {id:'q303',q:'현대 오케스트라에서 콘서트마스터의 좌석 위치는?',a:['지휘자의 바로 왼쪽 앞','지휘자의 오른쪽 뒤','2바이올린 섹션 앞','비올라 섹션 옆'],c:0,cat:'orchestra'},
  {id:'q304',q:'3rd 포지션에서 A현의 첫째 손가락 음은?',a:['D','C#','E','B'],c:0,cat:'position'},
  {id:'q305',q:'루바토(Rubato)의 올바른 적용 원칙은?',a:['빌린 시간은 반드시 돌려주어야 한다','항상 느리게만 연주한다','메트로놈과 무관하게 연주한다','반주와 독립적으로 연주한다'],c:0,cat:'tempo'},
  {id:'q306',q:'3현 교차 아르페지오에서 팔꿈치 높이 조절의 핵심은?',a:['현 이동 전 미리 팔꿈치를 준비한다','팔꿈치를 고정하고 손목만 움직인다','팔꿈치를 최대한 높이 올린다','팔꿈치를 최대한 낮춘다'],c:0,cat:'technique'},
  {id:'q307',q:'완전5도 음정의 진동수 비율은?',a:['3:2','4:3','5:4','2:1'],c:0,cat:'ear-training'},
  {id:'q308',q:'무대 불안 시 심박수를 낮추는 효과적인 호흡법은?',a:['4-7-8 호흡법 (들숨4초-멈춤7초-날숨8초)','빠르고 얕은 호흡','호흡을 최대한 참는 것','입으로만 호흡하는 것'],c:0,cat:'performance'},
  {id:'q309',q:'Glazunov 바이올린 협주곡의 특징적인 형식은?',a:['단악장 구성으로 여러 섹션이 이어진다','전통적 3악장 구성','소나타-론도 형식','변주곡 형식'],c:0,cat:'repertoire'},
  {id:'q310',q:'Ravel Tzigane에서 사용되는 "왼손 피치카토" 기법의 표기는?',a:['+','o','x','sul pont.'],c:0,cat:'technique'},
  {id:'q311',q:'활의 접촉점(contact point)이 브릿지에 가까울수록?',a:['음색이 밝고 날카로워진다','음색이 부드럽고 따뜻해진다','음량이 작아진다','비브라토가 쉬워진다'],c:0,cat:'bowing'},
  {id:'q312',q:'오케스트라에서 "투티(tutti)"의 의미는?',a:['전체 합주','솔로 연주','1st 바이올린만','현악 파트만'],c:0,cat:'orchestra'},
  {id:'q313',q:'바이올린의 E현 개방현 주파수는 약 몇 Hz인가?',a:['659 Hz','440 Hz','523 Hz','392 Hz'],c:0,cat:'ear-training'},
  {id:'q314',q:'Monti Czardas의 느린 도입부 명칭은?',a:['Lassu','Friss','Adagio','Andante'],c:0,cat:'repertoire'},
  {id:'q315',q:'무대 위에서 활이 떨리는 현상의 주원인은?',a:['엄지의 과도한 긴장','활 무게가 너무 가벼워서','로진이 부족해서','현의 장력이 너무 높아서'],c:0,cat:'performance'}
];

var V30_ACHS=[
  {id:'v30_bow_curve_master',name:'활 곡선 마스터',desc:'활 곡선 분석기를 5회 이상 사용'},
  {id:'v30_tone_matcher',name:'음색 감별사',desc:'음색 매칭 도구에서 S등급 달성'},
  {id:'v30_concert_master',name:'콘서트마스터',desc:'오케스트라 좌석 배치를 완료'},
  {id:'v30_finger_optimizer',name:'운지 최적화가',desc:'포지션 운지 맵에서 7포지션 모두 확인'},
  {id:'v30_tempo_artist',name:'템포 아티스트',desc:'템포 루바토 분석기를 10회 사용'},
  {id:'v30_string_crosser',name:'현 교차 전문가',desc:'현 교차 트레이너에서 S등급 달성'},
  {id:'v30_ear_expert',name:'청음 전문가',desc:'이어 트레이닝에서 12음 모두 정답'},
  {id:'v30_stage_warrior',name:'무대 전사',desc:'무대 불안 관리에서 위험도 최소화'},
  {id:'v30_quiz_master',name:'v30 퀴즈왕',desc:'v30 퀴즈 15문 전체 정답'},
  {id:'v30_song_explorer',name:'v30 곡 탐험가',desc:'v30 신규 10곡 모두 플레이'},
  {id:'v30_lesson_student',name:'v30 열공생',desc:'v30 신규 10레슨 모두 수강'},
  {id:'v30_complete',name:'v30 완전 정복',desc:'v30 모든 업적 달성'}
];

function grade(pct){return pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';}
function gradeColor(g){return{S:'#FFD700',A:'#4CAF50',B:'#2196F3',C:'#FF9800',D:'#F44336'}[g]||'#999';}

function createPanel(id,title,w,h,color){
  var exist=document.getElementById(id);
  if(exist){exist.style.display=exist.style.display==='none'?'block':'none';sfx('panel_open');return null;}
  var d=document.createElement('div');d.id=id;
  d.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:#1a1020;border:2px solid '+color+';border-radius:12px;padding:14px;box-shadow:0 8px 32px rgba(0,0,0,0.7);max-width:95vw;max-height:90vh;overflow:auto;';
  var hdr=document.createElement('div');hdr.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;';
  var ttl=document.createElement('span');ttl.textContent=title;ttl.style.cssText='color:'+color+';font-weight:bold;font-size:0.95em;';
  var cls=document.createElement('button');cls.textContent='✕';cls.style.cssText='background:none;border:1px solid #666;color:#ccc;cursor:pointer;border-radius:50%;width:24px;height:24px;font-size:14px;line-height:1;';
  cls.onclick=function(){d.style.display='none';sfx('panel_close');};
  hdr.appendChild(ttl);hdr.appendChild(cls);d.appendChild(hdr);
  var c=document.createElement('canvas');c.width=w;c.height=h;c.style.cssText='display:block;margin:0 auto;max-width:100%;border-radius:8px;background:#12081a;';
  d.appendChild(c);document.body.appendChild(d);sfx('panel_open');
  return{panel:d,canvas:c,ctx:c.getContext('2d')};
}

// ===== TOOL 1: 활 곡선 궤적 분석기 (Bow Curve Trajectory Analyzer) =====
function createBowCurvePanel(){
  var r=createPanel('v30-bowCurve','활 곡선 궤적 분석기',620,400,'#E8A87C');
  if(!r)return;var ctx=r.ctx,cv=r.canvas;
  var curves=[
    {name:'Detache',pts:[{x:0,y:200},{x:155,y:120},{x:310,y:200},{x:465,y:280},{x:620,y:200}],color:'#FF6B6B'},
    {name:'Legato',pts:[{x:0,y:200},{x:155,y:160},{x:310,y:200},{x:465,y:240},{x:620,y:200}],color:'#4ECDC4'},
    {name:'Staccato',pts:[{x:0,y:200},{x:80,y:100},{x:160,y:200},{x:240,y:100},{x:320,y:200},{x:400,y:100},{x:480,y:200},{x:560,y:100},{x:620,y:200}],color:'#45B7D1'},
    {name:'Spiccato',pts:[{x:0,y:300},{x:60,y:120},{x:120,y:300},{x:180,y:120},{x:240,y:300},{x:300,y:120},{x:360,y:300},{x:420,y:120},{x:480,y:300},{x:540,y:120},{x:620,y:300}],color:'#96CEB4'},
    {name:'Martele',pts:[{x:0,y:200},{x:30,y:80},{x:100,y:200},{x:200,y:200},{x:230,y:80},{x:300,y:200},{x:400,y:200},{x:430,y:80},{x:500,y:200},{x:620,y:200}],color:'#FFEAA7'},
    {name:'Tremolo',pts:[{x:0,y:200},{x:40,y:140},{x:80,y:260},{x:120,y:140},{x:160,y:260},{x:200,y:140},{x:240,y:260},{x:280,y:140},{x:320,y:260},{x:360,y:140},{x:400,y:260},{x:440,y:140},{x:480,y:260},{x:520,y:140},{x:560,y:260},{x:620,y:200}],color:'#DDA0DD'},
    {name:'Col Legno',pts:[{x:0,y:280},{x:100,y:260},{x:200,y:280},{x:300,y:260},{x:400,y:280},{x:500,y:260},{x:620,y:280}],color:'#F0E68C'},
    {name:'Sul Pont.',pts:[{x:0,y:200},{x:155,y:170},{x:310,y:200},{x:465,y:230},{x:620,y:200}],color:'#FF7F50'}
  ];
  var sel=0;
  var usage=lp('bowCurveUse',0);
  function draw(){
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#12081a';ctx.fillRect(0,0,620,400);
    ctx.strokeStyle='#333';ctx.lineWidth=1;
    for(var i=0;i<5;i++){var y=60+i*70;ctx.beginPath();ctx.moveTo(40,y);ctx.lineTo(590,y);ctx.stroke();}
    ctx.fillStyle='#666';ctx.font='10px monospace';
    ctx.fillText('High',5,65);ctx.fillText('Mid',5,205);ctx.fillText('Low',5,345);
    ctx.fillStyle='#888';ctx.font='11px monospace';ctx.fillText('Frog',50,395);ctx.fillText('Mid',300,395);ctx.fillText('Tip',565,395);
    var c=curves[sel];
    ctx.strokeStyle=c.color;ctx.lineWidth=3;ctx.beginPath();
    ctx.moveTo(c.pts[0].x,c.pts[0].y);
    for(var i=1;i<c.pts.length;i++){
      var p0=c.pts[i-1],p1=c.pts[i];
      var cx1=(p0.x+p1.x)/2,cy1=p0.y,cx2=(p0.x+p1.x)/2,cy2=p1.y;
      ctx.bezierCurveTo(cx1,cy1,cx2,cy2,p1.x,p1.y);
    }
    ctx.stroke();
    for(var i=0;i<c.pts.length;i++){
      ctx.beginPath();ctx.arc(c.pts[i].x,c.pts[i].y,4,0,Math.PI*2);ctx.fillStyle=c.color;ctx.fill();
    }
    ctx.fillStyle=c.color;ctx.font='bold 16px monospace';ctx.fillText(c.name,250,30);
    var amp=0;for(var i=0;i<c.pts.length;i++)amp+=Math.abs(c.pts[i].y-200);amp/=c.pts.length;
    var smooth=100-amp;var sc=Math.max(0,Math.min(100,smooth));
    var g=grade(sc);
    ctx.fillStyle=gradeColor(g);ctx.font='bold 20px monospace';ctx.fillText(g,580,30);
    ctx.fillStyle='#aaa';ctx.font='11px monospace';
    ctx.fillText('진폭: '+amp.toFixed(1),430,55);
    ctx.fillText('안정도: '+sc.toFixed(0)+'%',430,72);
    ctx.fillStyle='#666';ctx.font='10px monospace';
    for(var i=0;i<curves.length;i++){
      ctx.fillStyle=i===sel?curves[i].color:'#555';
      ctx.fillText((i+1)+'.'+curves[i].name,40+i*72,380);
    }
  }
  draw();
  cv.onclick=function(){sel=(sel+1)%curves.length;sfx('bow_curve');draw();
    usage++;sp('bowCurveUse',usage);
    if(usage>=5)unlockAch('v30_bow_curve_master');
  };
}

// ===== TOOL 2: 음색 매칭 도구 (Tone Color Matching Tool) =====
function createToneMatchPanel(){
  var r=createPanel('v30-toneMatch','음색 매칭 도구',620,400,'#C39BD3');
  if(!r)return;var ctx=r.ctx,cv=r.canvas;
  var instruments=[
    {name:'Stradivarius',axes:[95,85,92,78,88,90],color:'#FFD700'},
    {name:'Guarneri del Gesu',axes:[88,92,85,90,82,86],color:'#FF6B6B'},
    {name:'Amati',axes:[80,75,88,82,90,78],color:'#4ECDC4'},
    {name:'Stainer',axes:[72,70,82,85,78,80],color:'#45B7D1'},
    {name:'Modern Italian',axes:[85,80,78,75,85,82],color:'#96CEB4'},
    {name:'Chinese Workshop',axes:[65,60,68,70,72,65],color:'#FFEAA7'}
  ];
  var labels=['Warmth','Brilliance','Projection','Depth','Clarity','Resonance'];
  var sel=0;
  function draw(){
    ctx.clearRect(0,0,620,400);ctx.fillStyle='#12081a';ctx.fillRect(0,0,620,400);
    var cx=220,cy=200,R=140;
    ctx.strokeStyle='#333';ctx.lineWidth=1;
    for(var r=1;r<=5;r++){
      ctx.beginPath();
      for(var i=0;i<=6;i++){var a=-Math.PI/2+i*(Math.PI*2/6);ctx.lineTo(cx+Math.cos(a)*R*r/5,cy+Math.sin(a)*R*r/5);}
      ctx.closePath();ctx.stroke();
    }
    for(var i=0;i<6;i++){
      var a=-Math.PI/2+i*(Math.PI*2/6);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);ctx.stroke();
      ctx.fillStyle='#aaa';ctx.font='10px monospace';
      var lx=cx+Math.cos(a)*(R+18)-20,ly=cy+Math.sin(a)*(R+18)+4;
      ctx.fillText(labels[i],lx,ly);
    }
    var ins=instruments[sel];
    ctx.beginPath();ctx.strokeStyle=ins.color;ctx.lineWidth=2;ctx.globalAlpha=0.3;ctx.fillStyle=ins.color;
    for(var i=0;i<=6;i++){
      var idx=i%6;var a=-Math.PI/2+idx*(Math.PI*2/6);var rv=ins.axes[idx]/100*R;
      if(i===0)ctx.moveTo(cx+Math.cos(a)*rv,cy+Math.sin(a)*rv);
      else ctx.lineTo(cx+Math.cos(a)*rv,cy+Math.sin(a)*rv);
    }
    ctx.closePath();ctx.fill();ctx.globalAlpha=1;ctx.stroke();
    var avg=0;for(var i=0;i<6;i++)avg+=ins.axes[i];avg/=6;
    var g=grade(avg);
    ctx.fillStyle=ins.color;ctx.font='bold 14px monospace';ctx.fillText(ins.name,450,30);
    ctx.fillStyle=gradeColor(g);ctx.font='bold 22px monospace';ctx.fillText(g,570,30);
    ctx.fillStyle='#aaa';ctx.font='11px monospace';
    for(var i=0;i<6;i++){
      ctx.fillStyle=labels[i]==='Warmth'?'#E8A87C':'#aaa';
      ctx.fillText(labels[i]+': '+ins.axes[i],450,60+i*22);
    }
    ctx.fillStyle='#888';ctx.font='11px monospace';ctx.fillText('평균: '+avg.toFixed(1)+'%',450,200);
    ctx.fillStyle='#666';ctx.font='10px monospace';
    for(var i=0;i<instruments.length;i++){
      ctx.fillStyle=i===sel?instruments[i].color:'#555';
      ctx.fillText(instruments[i].name,40+i*100,390);
    }
  }
  draw();
  cv.onclick=function(){sel=(sel+1)%instruments.length;sfx('tone_match');draw();
    if(sel===0){var avg=0;for(var i=0;i<6;i++)avg+=instruments[0].axes[i];avg/=6;if(grade(avg)==='S')unlockAch('v30_tone_matcher');}
  };
}

// ===== TOOL 3: 오케스트라 좌석 배치 시뮬레이터 (Orchestra Seating Simulator) =====
function createOrchSeatPanel(){
  var r=createPanel('v30-orchSeat','오케스트라 좌석 배치 시뮬레이터',640,400,'#5DADE2');
  if(!r)return;var ctx=r.ctx,cv=r.canvas;
  var sections=[
    {name:'1st Violin',x:160,y:180,w:120,h:50,color:'#FF6B6B',count:16,role:'멜로디 주도'},
    {name:'2nd Violin',x:360,y:180,w:120,h:50,color:'#FF9F43',count:14,role:'화성 보조'},
    {name:'Viola',x:360,y:250,w:120,h:50,color:'#4ECDC4',count:12,role:'내성부 담당'},
    {name:'Cello',x:160,y:250,w:120,h:50,color:'#45B7D1',count:10,role:'베이스+멜로디'},
    {name:'Bass',x:500,y:250,w:100,h:50,color:'#96CEB4',count:8,role:'저음부 기반'},
    {name:'Woodwind',x:260,y:110,w:120,h:40,color:'#FFEAA7',count:12,role:'음색 변화'},
    {name:'Brass',x:260,y:60,w:120,h:40,color:'#DDA0DD',count:10,role:'파워+팡파르'},
    {name:'Percussion',x:440,y:60,w:100,h:40,color:'#F0E68C',count:4,role:'리듬+효과'},
    {name:'Conductor',x:290,y:320,w:60,h:30,color:'#FFD700',count:1,role:'지휘'}
  ];
  var sel=0;var placed=lp('orchPlaced',[]);
  function draw(){
    ctx.clearRect(0,0,640,400);ctx.fillStyle='#12081a';ctx.fillRect(0,0,640,400);
    ctx.strokeStyle='#444';ctx.lineWidth=2;ctx.beginPath();
    ctx.ellipse(320,200,280,160,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#1a1a2e';ctx.fill();
    for(var i=0;i<sections.length;i++){
      var s=sections[i];
      ctx.fillStyle=i===sel?s.color+'99':s.color+'44';
      ctx.strokeStyle=s.color;ctx.lineWidth=i===sel?2:1;
      ctx.fillRect(s.x,s.y,s.w,s.h);ctx.strokeRect(s.x,s.y,s.w,s.h);
      ctx.fillStyle=i===sel?'#fff':'#ccc';ctx.font=(i===sel?'bold ':'')+('10px monospace');
      ctx.fillText(s.name,s.x+5,s.y+15);
      ctx.fillStyle='#aaa';ctx.font='9px monospace';
      ctx.fillText(s.count+'명',s.x+5,s.y+28);
      if(placed.indexOf(i)>=0){ctx.fillStyle='#4CAF50';ctx.fillText('✓',s.x+s.w-15,s.y+15);}
    }
    var cs=sections[sel];
    ctx.fillStyle='#ddd';ctx.font='bold 13px monospace';ctx.fillText(cs.name,20,30);
    ctx.fillStyle='#aaa';ctx.font='11px monospace';
    ctx.fillText('인원: '+cs.count+'명',20,50);
    ctx.fillText('역할: '+cs.role,20,68);
    ctx.fillText('배치 완료: '+placed.length+'/'+sections.length,20,390);
    if(placed.length>=sections.length){
      ctx.fillStyle='#FFD700';ctx.font='bold 14px monospace';ctx.fillText('전체 배치 완료!',450,390);
    }
  }
  draw();
  cv.onclick=function(e){
    var rect=cv.getBoundingClientRect();var mx=(e.clientX-rect.left)*(640/rect.width);var my=(e.clientY-rect.top)*(400/rect.height);
    for(var i=0;i<sections.length;i++){
      var s=sections[i];
      if(mx>=s.x&&mx<=s.x+s.w&&my>=s.y&&my<=s.y+s.h){sel=i;if(placed.indexOf(i)<0){placed.push(i);sp('orchPlaced',placed);}break;}
    }
    sfx('orch_seat');draw();
    if(placed.length>=sections.length)unlockAch('v30_concert_master');
  };
}

// ===== TOOL 4: 포지션별 운지 최적화 맵 (Position Fingering Optimizer) =====
function createFingerMapPanel(){
  var r=createPanel('v30-fingerMap','포지션별 운지 최적화 맵',620,400,'#48C9B0');
  if(!r)return;var ctx=r.ctx,cv=r.canvas;
  var strings=['G','D','A','E'];
  var positions=7;
  var notes=[
    ['G','A','B','C','D','E','F#'],
    ['D','E','F#','G','A','B','C#'],
    ['A','B','C#','D','E','F#','G#'],
    ['E','F#','G#','A','B','C#','D#']
  ];
  var checked=lp('fingerChecked',[]);
  var selPos=0;
  function draw(){
    ctx.clearRect(0,0,620,400);ctx.fillStyle='#12081a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#48C9B0';ctx.font='bold 14px monospace';ctx.fillText('Position '+(selPos+1),250,25);
    var startX=80,startY=60,cellW=70,cellH=70;
    for(var s=0;s<4;s++){
      ctx.fillStyle='#aaa';ctx.font='bold 12px monospace';
      ctx.fillText(strings[s]+'현',20,startY+s*cellH+40);
      for(var p=0;p<positions;p++){
        var x=startX+p*cellW,y=startY+s*cellH;
        var isSelected=p===selPos;
        var key=s+'_'+p;
        var isChecked=checked.indexOf(key)>=0;
        ctx.fillStyle=isSelected?'#48C9B044':'#1e1030';
        ctx.strokeStyle=isSelected?'#48C9B0':'#333';ctx.lineWidth=isSelected?2:1;
        ctx.fillRect(x,y,cellW-4,cellH-4);ctx.strokeRect(x,y,cellW-4,cellH-4);
        ctx.fillStyle=isSelected?'#fff':'#ccc';ctx.font='11px monospace';
        ctx.fillText(notes[s][p],x+22,y+30);
        ctx.fillStyle='#888';ctx.font='9px monospace';
        var finger=p===0?'Open':(p<=3?p:''+p);
        ctx.fillText('F'+finger,x+22,y+48);
        if(isChecked){ctx.fillStyle='#4CAF5088';ctx.fillRect(x,y,cellW-4,cellH-4);ctx.fillStyle='#4CAF50';ctx.fillText('✓',x+55,y+15);}
      }
    }
    ctx.fillStyle='#888';ctx.font='10px monospace';
    for(var p=0;p<positions;p++){ctx.fillText('Pos '+(p+1),startX+p*cellW+15,startY-8);}
    var uniquePos=[];
    for(var i=0;i<checked.length;i++){var pp=parseInt(checked[i].split('_')[1]);if(uniquePos.indexOf(pp)<0)uniquePos.push(pp);}
    ctx.fillStyle='#aaa';ctx.font='11px monospace';
    ctx.fillText('확인한 포지션: '+uniquePos.length+'/7',20,390);
  }
  draw();
  cv.onclick=function(e){
    var rect=cv.getBoundingClientRect();var mx=(e.clientX-rect.left)*(620/rect.width);var my=(e.clientY-rect.top)*(400/rect.height);
    var startX=80,startY=60,cellW=70,cellH=70;
    for(var s=0;s<4;s++){
      for(var p=0;p<positions;p++){
        var x=startX+p*cellW,y=startY+s*cellH;
        if(mx>=x&&mx<=x+cellW-4&&my>=y&&my<=y+cellH-4){
          selPos=p;var key=s+'_'+p;
          if(checked.indexOf(key)<0){checked.push(key);sp('fingerChecked',checked);}
          break;
        }
      }
    }
    sfx('finger_map');draw();
    var uniquePos=[];
    for(var i=0;i<checked.length;i++){var pp=parseInt(checked[i].split('_')[1]);if(uniquePos.indexOf(pp)<0)uniquePos.push(pp);}
    if(uniquePos.length>=7)unlockAch('v30_finger_optimizer');
  };
}

// ===== TOOL 5: 템포 루바토 분석기 (Tempo Rubato Analyzer) =====
function createTempoRubatoPanel(){
  var r=createPanel('v30-tempoRubato','템포 루바토 분석기',620,400,'#F1948A');
  if(!r)return;var ctx=r.ctx,cv=r.canvas;
  var styles=[
    {name:'Strict',data:[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],color:'#FF6B6B'},
    {name:'Romantic Rubato',data:[95,90,85,80,78,82,88,95,100,105,108,112,110,105,100,98],color:'#C39BD3'},
    {name:'Baroque Inegal',data:[110,90,110,90,110,90,110,90,110,90,110,90,110,90,110,90],color:'#F0E68C'},
    {name:'Accelerando',data:[70,75,78,82,85,88,92,95,98,100,103,106,110,115,120,125],color:'#4ECDC4'},
    {name:'Ritardando',data:[125,120,115,110,106,103,100,98,95,92,88,85,82,78,75,70],color:'#45B7D1'},
    {name:'Agogic Accent',data:[90,110,95,105,88,115,92,108,85,120,90,110,95,105,88,115],color:'#FF9F43'},
    {name:'Free Cadenza',data:[60,120,50,130,70,110,80,140,55,125,65,115,75,135,45,150],color:'#DDA0DD'},
    {name:'Viennese Waltz',data:[110,95,95,110,95,95,110,95,95,110,95,95,110,95,95,110],color:'#96CEB4'}
  ];
  var sel=0;var usage=lp('tempoUse',0);
  function draw(){
    ctx.clearRect(0,0,620,400);ctx.fillStyle='#12081a';ctx.fillRect(0,0,620,400);
    var s=styles[sel];
    ctx.strokeStyle='#333';ctx.lineWidth=1;
    for(var i=0;i<=4;i++){var y=50+i*70;ctx.beginPath();ctx.moveTo(50,y);ctx.lineTo(590,y);ctx.stroke();
      ctx.fillStyle='#666';ctx.font='9px monospace';ctx.fillText((150-i*25)+'%',10,y+4);
    }
    ctx.strokeStyle='#FFD70044';ctx.lineWidth=1;ctx.setLineDash([5,5]);
    ctx.beginPath();ctx.moveTo(50,190);ctx.lineTo(590,190);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle=s.color;ctx.lineWidth=2.5;ctx.beginPath();
    for(var i=0;i<s.data.length;i++){
      var x=50+i*(540/(s.data.length-1));var y=50+(150-s.data[i])*(280/150);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
    for(var i=0;i<s.data.length;i++){
      var x=50+i*(540/(s.data.length-1));var y=50+(150-s.data[i])*(280/150);
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle=s.color;ctx.fill();
    }
    var avg=0,variance=0;for(var i=0;i<s.data.length;i++)avg+=s.data[i];avg/=s.data.length;
    for(var i=0;i<s.data.length;i++)variance+=(s.data[i]-avg)*(s.data[i]-avg);variance=Math.sqrt(variance/s.data.length);
    var stability=Math.max(0,100-variance*2);var g=grade(stability);
    ctx.fillStyle=s.color;ctx.font='bold 14px monospace';ctx.fillText(s.name,250,25);
    ctx.fillStyle=gradeColor(g);ctx.font='bold 20px monospace';ctx.fillText(g,580,25);
    ctx.fillStyle='#aaa';ctx.font='11px monospace';
    ctx.fillText('평균: '+avg.toFixed(1)+'%',440,355);
    ctx.fillText('변동: ±'+variance.toFixed(1),440,372);
    ctx.fillText('안정도: '+stability.toFixed(0)+'%',440,389);
    ctx.fillStyle='#666';ctx.font='9px monospace';
    for(var i=0;i<styles.length;i++){
      ctx.fillStyle=i===sel?styles[i].color:'#555';
      ctx.fillText((i+1)+'.'+styles[i].name.substr(0,6),15+i*76,395);
    }
    ctx.fillStyle='#555';ctx.font='9px monospace';
    for(var i=0;i<s.data.length;i++){
      var x=50+i*(540/(s.data.length-1));
      ctx.fillText('B'+(i+1),x-6,365);
    }
  }
  draw();
  cv.onclick=function(){sel=(sel+1)%styles.length;sfx('tempo_pulse');draw();
    usage++;sp('tempoUse',usage);if(usage>=10)unlockAch('v30_tempo_artist');
  };
}

// ===== TOOL 6: 현 교차 패턴 트레이너 (String Crossing Pattern Trainer) =====
function createStringCrossPanel(){
  var r=createPanel('v30-stringCross','현 교차 패턴 트레이너',620,400,'#82E0AA');
  if(!r)return;var ctx=r.ctx,cv=r.canvas;
  var patterns=[
    {name:'인접 현 (G↔D)',seq:[0,1,0,1,0,1,0,1],diff:1,elbow:'Mid-Low'},
    {name:'인접 현 (D↔A)',seq:[1,2,1,2,1,2,1,2],diff:1,elbow:'Mid'},
    {name:'인접 현 (A↔E)',seq:[2,3,2,3,2,3,2,3],diff:1,elbow:'Mid-High'},
    {name:'1현 건너뛰기 (G↔A)',seq:[0,2,0,2,0,2,0,2],diff:3,elbow:'Varies'},
    {name:'1현 건너뛰기 (D↔E)',seq:[1,3,1,3,1,3,1,3],diff:3,elbow:'Varies'},
    {name:'2현 건너뛰기 (G↔E)',seq:[0,3,0,3,0,3,0,3],diff:5,elbow:'Full Swing'},
    {name:'아르페지오 상행',seq:[0,1,2,3,2,1,0,1],diff:4,elbow:'Progressive'},
    {name:'아르페지오 하행',seq:[3,2,1,0,1,2,3,2],diff:4,elbow:'Progressive'},
    {name:'랜덤 패턴',seq:[0,3,1,2,3,0,2,1],diff:5,elbow:'Complex'},
    {name:'바흐 파르티타',seq:[0,1,2,0,1,2,3,2],diff:5,elbow:'Baroque'}
  ];
  var sel=0;var scores=lp('stringCrossScores',{});
  var stringNames=['G','D','A','E'];
  var stringY=[320,240,160,80];
  function draw(){
    ctx.clearRect(0,0,620,400);ctx.fillStyle='#12081a';ctx.fillRect(0,0,620,400);
    for(var i=0;i<4;i++){
      ctx.strokeStyle=['#FF6B6B','#FFD700','#4ECDC4','#45B7D1'][i];ctx.lineWidth=3-i*0.5;
      ctx.beginPath();ctx.moveTo(60,stringY[i]);ctx.lineTo(560,stringY[i]);ctx.stroke();
      ctx.fillStyle='#aaa';ctx.font='11px monospace';ctx.fillText(stringNames[i],35,stringY[i]+4);
    }
    var p=patterns[sel];
    ctx.strokeStyle='#82E0AA';ctx.lineWidth=2;ctx.beginPath();
    for(var i=0;i<p.seq.length;i++){
      var x=80+i*(480/(p.seq.length-1));var y=stringY[p.seq[i]];
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      ctx.fillStyle='#82E0AA';ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='9px monospace';ctx.fillText(stringNames[p.seq[i]],x-3,y+3);
    }
    ctx.strokeStyle='#82E0AA';ctx.lineWidth=2;ctx.beginPath();
    for(var i=0;i<p.seq.length;i++){
      var x=80+i*(480/(p.seq.length-1));var y=stringY[p.seq[i]];
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
    ctx.fillStyle='#82E0AA';ctx.font='bold 13px monospace';ctx.fillText(p.name,180,25);
    ctx.fillStyle='#aaa';ctx.font='11px monospace';
    ctx.fillText('난이도: '+'★'.repeat(p.diff)+'☆'.repeat(5-p.diff),20,390);
    ctx.fillText('팔꼼치: '+p.elbow,300,390);
    var sc=scores[sel]||0;var g=grade(sc);
    ctx.fillStyle=gradeColor(g);ctx.font='bold 18px monospace';ctx.fillText(g,580,25);
    ctx.fillStyle='#888';ctx.font='10px monospace';ctx.fillText('점수: '+sc,540,45);
  }
  draw();
  cv.onclick=function(){
    var sc=(scores[sel]||0)+10;if(sc>100)sc=100;scores[sel]=sc;sp('stringCrossScores',scores);
    sel=(sel+1)%patterns.length;sfx('string_cross');draw();
    var hasS=false;for(var k in scores){if(scores[k]>=90)hasS=true;}
    if(hasS)unlockAch('v30_string_crosser');
  };
}

// ===== TOOL 7: 이어 트레이닝 음정 인식기 (Ear Training Pitch Recognizer) =====
function createEarTrainPanel(){
  var r=createPanel('v30-earTrain','이어 트레이닝 음정 인식기',640,400,'#F7DC6F');
  if(!r)return;var ctx=r.ctx,cv=r.canvas;
  var noteNames=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var freqs=[261.6,277.2,293.7,311.1,329.6,349.2,370.0,392.0,415.3,440.0,466.2,493.9];
  var correct=lp('earCorrect',{});
  var current=-1;var answered=false;var lastAnswer=-1;
  function playNote(idx){
    try{
      var ctx2=getCtx();var o=ctx2.createOscillator();var g=ctx2.createGain();
      o.connect(g);g.connect(ctx2.destination);o.type='sine';
      o.frequency.setValueAtTime(freqs[idx],ctx2.currentTime);
      g.gain.setValueAtTime(0.15,ctx2.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ctx2.currentTime+1.5);
      o.start(ctx2.currentTime);o.stop(ctx2.currentTime+1.5);
    }catch(e){}
  }
  function newRound(){
    current=Math.floor(lp('earSeed',Date.now())%12);
    sp('earSeed',lp('earSeed',0)+7);
    answered=false;lastAnswer=-1;
    playNote(current);
    draw();
  }
  function draw(){
    ctx.clearRect(0,0,640,400);ctx.fillStyle='#12081a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#F7DC6F';ctx.font='bold 14px monospace';ctx.fillText('음정 인식 트레이닝',220,25);
    ctx.fillStyle='#aaa';ctx.font='11px monospace';
    ctx.fillText(current>=0?'음을 듣고 맞는 음을 클릭하세요':'캔버스를 클릭해서 시작',180,50);
    for(var i=0;i<12;i++){
      var col=i<6?0:1;var row=i%6;
      var x=80+col*280;var y=80+row*48;
      var isCorrect=answered&&i===current;
      var isWrong=answered&&i===lastAnswer&&i!==current;
      ctx.fillStyle=isCorrect?'#4CAF5066':isWrong?'#F4433666':'#1e1030';
      ctx.strokeStyle=correct[noteNames[i]]?'#4CAF50':'#F7DC6F44';ctx.lineWidth=1;
      ctx.fillRect(x,y,240,38);ctx.strokeRect(x,y,240,38);
      ctx.fillStyle=isCorrect?'#4CAF50':isWrong?'#F44336':'#ddd';ctx.font='bold 13px monospace';
      ctx.fillText(noteNames[i],x+10,y+24);
      ctx.fillStyle='#888';ctx.font='10px monospace';
      ctx.fillText(freqs[i].toFixed(1)+' Hz',x+60,y+24);
      if(correct[noteNames[i]]){ctx.fillStyle='#4CAF50';ctx.fillText('✓',x+220,y+24);}
    }
    var totalCorrect=0;for(var k in correct)if(correct[k])totalCorrect++;
    ctx.fillStyle='#aaa';ctx.font='11px monospace';
    ctx.fillText('정답: '+totalCorrect+'/12',20,390);
    if(totalCorrect>=12){ctx.fillStyle='#FFD700';ctx.font='bold 12px monospace';ctx.fillText('완벽!',100,390);}
    ctx.fillStyle='#F7DC6F';ctx.font='10px monospace';ctx.fillText('클릭: 응답  |  다음 문제: 우측 하단',350,390);
  }
  draw();
  cv.onclick=function(e){
    var rect=cv.getBoundingClientRect();var mx=(e.clientX-rect.left)*(640/rect.width);var my=(e.clientY-rect.top)*(400/rect.height);
    if(current<0||answered){newRound();return;}
    for(var i=0;i<12;i++){
      var col=i<6?0:1;var row=i%6;
      var x=80+col*280;var y=80+row*48;
      if(mx>=x&&mx<=x+240&&my>=y&&my<=y+38){
        answered=true;lastAnswer=i;
        if(i===current){correct[noteNames[i]]=true;sp('earCorrect',correct);sfx('ear_train');}
        else{sfx('stage_fright');}
        draw();
        var totalCorrect=0;for(var k in correct)if(correct[k])totalCorrect++;
        if(totalCorrect>=12)unlockAch('v30_ear_expert');
        break;
      }
    }
  };
}

// ===== TOOL 8: 종합 연주자 성장 대시보드 (Comprehensive Performer Dashboard) =====
function createDashboardPanel(){
  var r=createPanel('v30-dashboard','종합 연주자 성장 대시보드',620,400,'#AF7AC5');
  if(!r)return;var ctx=r.ctx,cv=r.canvas;
  var kpis=[
    {name:'활 기법',key:'bowCurveUse',max:20,icon:'🎻'},
    {name:'음색 감별',key:'toneUse',max:15,icon:'🎨'},
    {name:'오케스트라',key:'orchUse',max:10,icon:'🎶'},
    {name:'운지법',key:'fingerUse',max:28,icon:'✋'},
    {name:'템포 감각',key:'tempoUse',max:20,icon:'⏱'},
    {name:'현 교차',key:'crossUse',max:30,icon:'⇄'},
    {name:'청음 능력',key:'earUse',max:12,icon:'👂'},
    {name:'무대 관리',key:'stageUse',max:10,icon:'🎭'}
  ];
  function getVal(key){
    if(key==='bowCurveUse')return lp('bowCurveUse',0);
    if(key==='toneUse')return Object.keys(lp('toneScores',{})).length;
    if(key==='orchUse')return lp('orchPlaced',[]).length;
    if(key==='fingerUse'){var c=lp('fingerChecked',[]);return c.length;}
    if(key==='tempoUse')return lp('tempoUse',0);
    if(key==='crossUse'){var s=lp('stringCrossScores',{});var t=0;for(var k in s)t+=s[k];return Math.min(t/10,30);}
    if(key==='earUse'){var c=lp('earCorrect',{});var t=0;for(var k in c)if(c[k])t++;return t;}
    if(key==='stageUse')return lp('stageUse',0);
    return 0;
  }
  function draw(){
    ctx.clearRect(0,0,620,400);ctx.fillStyle='#12081a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#AF7AC5';ctx.font='bold 13px monospace';ctx.fillText('종합 연주자 성장 대시보드',180,22);
    var total=0,maxTotal=0;
    for(var i=0;i<8;i++){
      var k=kpis[i];var val=Math.min(getVal(k.key),k.max);
      var pct=val/k.max*100;total+=pct;maxTotal+=100;
      var col=i%4;var row=Math.floor(i/4);
      var x=20+col*152;var y=40+row*185;
      ctx.fillStyle='#1e1030';ctx.fillRect(x,y,145,175);ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.strokeRect(x,y,145,175);
      var gcx=x+72,gcy=y+90,gr=50;
      var startA=Math.PI*0.8,endA=Math.PI*2.2;
      ctx.strokeStyle='#333';ctx.lineWidth=8;
      ctx.beginPath();ctx.arc(gcx,gcy,gr,startA,endA);ctx.stroke();
      var fillA=startA+(endA-startA)*pct/100;
      var gc=gradeColor(grade(pct));
      ctx.strokeStyle=gc;ctx.lineWidth=8;
      ctx.beginPath();ctx.arc(gcx,gcy,gr,startA,fillA);ctx.stroke();
      ctx.fillStyle=gc;ctx.font='bold 16px monospace';
      ctx.fillText(grade(pct),gcx-6,gcy+5);
      ctx.fillStyle='#ddd';ctx.font='10px monospace';
      ctx.fillText(k.name,x+10,y+155);
      ctx.fillStyle='#888';ctx.font='9px monospace';
      ctx.fillText(val.toFixed(0)+'/'+k.max,x+10,y+170);
      ctx.fillStyle='#aaa';ctx.font='16px monospace';
      ctx.fillText(k.icon,x+120,y+20);
    }
    var overallPct=total/maxTotal*100;var overallG=grade(overallPct);
    ctx.fillStyle='#1e1030';ctx.fillRect(420,320,180,70);ctx.strokeStyle=gradeColor(overallG);ctx.lineWidth=2;ctx.strokeRect(420,320,180,70);
    ctx.fillStyle=gradeColor(overallG);ctx.font='bold 20px monospace';ctx.fillText('종합: '+overallG,440,355);
    ctx.fillStyle='#aaa';ctx.font='11px monospace';ctx.fillText(overallPct.toFixed(1)+'%',440,375);
  }
  draw();
  cv.onclick=function(){sfx('grade_show');draw();};
}

function addV30Nav(){
  var navTarget=document.querySelector('.v19-nav-bar')||document.querySelector('nav')||document.querySelector('.bottom-nav')||document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){var allNav=document.querySelectorAll('div[style*="flex-wrap"]');if(allNav.length>0)navTarget=allNav[allNav.length-1];}
  if(!navTarget){navTarget=document.createElement('div');navTarget.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px;justify-content:center;margin:8px auto;max-width:600px;';document.body.appendChild(navTarget);}
  var btns=[
    {label:'활곡선분석',fn:createBowCurvePanel,key:'KeyQ',color:'#E8A87C',panel:'v30-bowCurve'},
    {label:'음색매칭',fn:createToneMatchPanel,key:'KeyW',color:'#C39BD3',panel:'v30-toneMatch'},
    {label:'오케좌석',fn:createOrchSeatPanel,key:'KeyE',color:'#5DADE2',panel:'v30-orchSeat'},
    {label:'운지최적화',fn:createFingerMapPanel,key:'KeyR',color:'#48C9B0',panel:'v30-fingerMap'},
    {label:'템포루바토',fn:createTempoRubatoPanel,key:'KeyT',color:'#F1948A',panel:'v30-tempoRubato'},
    {label:'현교차패턴',fn:createStringCrossPanel,key:'KeyY',color:'#82E0AA',panel:'v30-stringCross'},
    {label:'청음트레이닝',fn:createEarTrainPanel,key:'KeyU',color:'#F7DC6F',panel:'v30-earTrain'},
    {label:'성장대시보드',fn:createDashboardPanel,key:'KeyI',color:'#AF7AC5',panel:'v30-dashboard'},
    {label:'v30퀴즈',fn:openV30Quiz,key:'Digit0',color:'#E74C3C',panel:'v30-quiz'}
  ];
  btns.forEach(function(b){
    var btn=document.createElement('button');
    btn.textContent=b.label;
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid '+b.color+';background:transparent;color:'+b.color+';cursor:pointer;font-size:0.72em;margin:2px;';
    btn.onclick=function(){b.fn();};
    navTarget.appendChild(btn);
  });
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    btns.forEach(function(b){
      if(e.code===b.key){
        var p=document.getElementById(b.panel);
        if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('nav_click');}
        else{b.fn();}
      }
    });
  });
}

function openV30Quiz(){
  var exist=document.getElementById('v30-quiz');
  if(exist){exist.style.display=exist.style.display==='none'?'block':'none';sfx('panel_open');return;}
  var d=document.createElement('div');d.id='v30-quiz';
  d.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:#1a1020;border:2px solid #E74C3C;border-radius:12px;padding:16px;box-shadow:0 8px 32px rgba(0,0,0,0.7);max-width:95vw;max-height:90vh;overflow:auto;width:500px;';
  var qi=0;var score=0;
  function render(){
    if(qi>=V30_QUIZZES.length){
      d.innerHTML='<div style="text-align:center;color:#E74C3C;font-size:1.1em;font-weight:bold;">v30 퀴즈 결과</div><div style="text-align:center;color:#FFD700;font-size:2em;margin:20px;">'+score+'/'+V30_QUIZZES.length+'</div><div style="text-align:center;color:#aaa;">등급: <span style="color:'+gradeColor(grade(score/V30_QUIZZES.length*100))+'">'+grade(score/V30_QUIZZES.length*100)+'</span></div><button onclick="this.parentElement.style.display=\'none\'" style="display:block;margin:20px auto;padding:8px 24px;background:#E74C3C;color:#fff;border:none;border-radius:6px;cursor:pointer;">닫기</button>';
      if(score>=V30_QUIZZES.length)unlockAch('v30_quiz_master');
      return;
    }
    var q=V30_QUIZZES[qi];
    var html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><span style="color:#E74C3C;font-weight:bold;">Q'+(qi+1)+'/'+V30_QUIZZES.length+'</span><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="background:none;border:1px solid #666;color:#ccc;cursor:pointer;border-radius:50%;width:24px;height:24px;">✕</button></div>';
    html+='<div style="color:#ddd;margin-bottom:16px;font-size:0.95em;">'+q.q+'</div>';
    for(var i=0;i<q.a.length;i++){
      html+='<button class="v30qa" data-idx="'+i+'" style="display:block;width:100%;text-align:left;padding:10px 12px;margin:6px 0;background:#1e1030;border:1px solid #444;color:#ccc;border-radius:6px;cursor:pointer;font-size:0.9em;">'+q.a[i]+'</button>';
    }
    d.innerHTML=html;
    d.querySelectorAll('.v30qa').forEach(function(btn){
      btn.onclick=function(){
        var idx=parseInt(this.getAttribute('data-idx'));
        if(idx===q.c){score++;sfx('quiz30');}else{sfx('stage_fright');}
        qi++;render();
      };
    });
  }
  render();
  document.body.appendChild(d);sfx('panel_open');
}

function registerData(){
  V30_SONGS.forEach(function(s){songDB.push(s);});
  V30_LESSONS.forEach(function(l){lessonDB.push(l);});
  V30_ACHS.forEach(function(a){achDB.push(a);});
}

function init(){
  registerData();
  var retries=0;
  function tryNav(){
    var nav=document.querySelector('.v19-nav-bar')||document.querySelector('nav')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('div[style*="flex-wrap"]');
    if(nav||retries>=20){addV30Nav();}else{retries++;setTimeout(tryNav,500);}
  }
  tryNav();
  addHistory('v30','init','v30 patch loaded');
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
