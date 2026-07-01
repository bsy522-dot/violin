/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v15.0 PATCH MODULE
   초견연습기Canvas오선보8단계+톤품질분석기Canvas6축Radar+
   활분배트레이너Canvas3존+무대공포극복코치Canvas호흡6패턴+
   바이올린퀴즈배틀5인AI+기법마스터리트리Canvas18노드+
   연습리포트생성기CanvasPNG+듀엣파트분리연습Canvas6곡+
   10곡추가(114→124)+10레슨(140→150)+15퀴즈(75→90)+
   12업적(118→130)+SFX12종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V15Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V15_LOADED)return;window.__V15_LOADED=true;

/* ─── HELPERS ─── */
function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(p){var old=loadProgress();Object.assign(old,p);localStorage.setItem('violinProgress',JSON.stringify(old));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function unlockAch(id){
  var achs=loadAchievements();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  var info=V15_ACHS.find(function(a){return a.id===id;});
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
var actx15=null;
function v15Sfx(type){
  try{
    if(!actx15)actx15=new(window.AudioContext||window.webkitAudioContext)();
    var o=actx15.createOscillator(),g=actx15.createGain();
    o.connect(g);g.connect(actx15.destination);
    var now=actx15.currentTime;
    var presets={
      sight_note:{f:587,w:'sine',a:.12,d:.3},
      sight_correct:{f:880,w:'triangle',a:.14,d:.35},
      sight_wrong:{f:196,w:'square',a:.05,d:.25},
      tone_analyze:{f:440,w:'sine',a:.1,d:.4},
      bow_zone:{f:523,w:'triangle',a:.08,d:.3},
      anxiety_breath:{f:262,w:'sine',a:.06,d:.8},
      battle_hit:{f:698,w:'square',a:.08,d:.2},
      mastery_unlock:{f:784,w:'triangle',a:.12,d:.5},
      report_gen:{f:660,w:'sine',a:.1,d:.4},
      duet_sync:{f:554,w:'sine',a:.1,d:.35},
      quiz_v15:{f:740,w:'square',a:.06,d:.2},
      feature_open15:{f:622,w:'triangle',a:.09,d:.25}
    };
    var p=presets[type]||presets.feature_open15;
    o.type=p.w;o.frequency.setValueAtTime(p.f,now);
    g.gain.setValueAtTime(p.a,now);g.gain.exponentialRampToValueAtTime(.001,now+p.d);
    o.start(now);o.stop(now+p.d);
  }catch(e){}
}

/* ─── 2. CSS INJECTION ─── */
var sty15=document.createElement('style');
sty15.textContent=`
#sightPanel,#tonePanel,#bowDistPanel,#anxietyPanel,#battlePanel,#masteryPanel,#reportPanel,#duetPanel,#quizV15Panel{
  display:none;position:fixed;inset:0;z-index:230;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#sightPanel.show,#tonePanel.show,#bowDistPanel.show,#anxietyPanel.show,#battlePanel.show,
#masteryPanel.show,#reportPanel.show,#duetPanel.show,#quizV15Panel.show{display:flex;}
#sightPanel h3,#tonePanel h3,#bowDistPanel h3,#anxietyPanel h3,#battlePanel h3,
#masteryPanel h3,#reportPanel h3,#duetPanel h3,#quizV15Panel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#sightCanvas,#toneCanvas,#bowDistCanvas,#anxietyCanvas,#masteryCanvas,#reportCanvas,#duetCanvas{
  border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.v15Info{width:100%;max-width:420px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;font-size:10px;color:rgba(240,230,200,.7);line-height:1.6;}
.v15Card{width:100%;max-width:400px;padding:10px 12px;margin:4px 0;
  background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.12);
  border-radius:8px;font-size:11px;color:rgba(240,230,200,.8);cursor:pointer;
  transition:background .2s,border-color .2s;}
.v15Card:hover{background:rgba(255,215,0,.08);border-color:rgba(255,215,0,.3);}
.v15Card.done{border-color:rgba(76,175,80,.4);background:rgba(76,175,80,.06);}
.v15Btn{display:inline-block;padding:6px 14px;margin:4px;border-radius:6px;
  background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.25);
  color:#ffd700;font-size:10px;cursor:pointer;transition:background .2s;}
.v15Btn:hover{background:rgba(255,215,0,.22);}
.v15Btn.active{background:rgba(255,215,0,.3);border-color:#ffd700;}
.v15Close{position:sticky;top:0;align-self:flex-end;font-size:18px;cursor:pointer;
  color:#888;z-index:10;padding:4px 8px;}
.v15Close:hover{color:#ffd700;}
.v15Nav{position:fixed;bottom:0;left:0;right:0;z-index:231;background:rgba(26,16,32,.95);
  border-top:1px solid rgba(255,215,0,.1);display:flex;overflow-x:auto;
  padding:6px 8px;gap:6px;-webkit-overflow-scrolling:touch;}
.v15NavBtn{flex:0 0 auto;padding:5px 10px;border-radius:12px;font-size:10px;
  background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.15);
  color:#c9a96e;white-space:nowrap;cursor:pointer;transition:all .2s;}
.v15NavBtn:hover,.v15NavBtn.active{background:rgba(255,215,0,.2);border-color:rgba(255,215,0,.4);color:#ffd700;}
.v15Grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:6px;width:100%;max-width:420px;}
.v15Progress{width:100%;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;margin:4px 0;}
.v15Progress .bar{height:100%;background:linear-gradient(90deg,#ffd700,#ff6644);border-radius:3px;transition:width .4s;}
.v15Badge{display:inline-block;padding:2px 6px;border-radius:4px;font-size:8px;font-weight:bold;margin-left:4px;}
.v15Badge.s{background:rgba(255,215,0,.2);color:#ffd700;}
.v15Badge.a{background:rgba(76,175,80,.2);color:#4caf50;}
.v15Badge.b{background:rgba(33,150,243,.2);color:#2196f3;}
.v15Badge.c{background:rgba(255,152,0,.2);color:#ff9800;}
.v15Badge.d{background:rgba(244,67,54,.2);color:#f44336;}
`;
document.head.appendChild(sty15);

/* ─── 3. SIGHT-READING TRAINER (&#52488;&#44204; &#50672;&#49845;&#44592;) ─── */
var sightLevel=0,sightScore=0,sightTotal=0,sightRound=0;
var SIGHT_LEVELS=[
  {name:'1&#45800;&#44228;: &#44060;&#48169;&#54788;',notes:['G4','A4','B4'],tempo:2000},
  {name:'2&#45800;&#44228;: 1&#54252;&#51648;&#49496;',notes:['G4','A4','B4','C5','D5'],tempo:1800},
  {name:'3&#45800;&#44228;: &#47532;&#46300;&#48120;&#52972;',notes:['E4','F4','G4','A4','B4','C5','D5'],tempo:1500},
  {name:'4&#45800;&#44228;: &#49380;&#54532;/&#54540;&#47131;',notes:['G4','A4','Bb4','B4','C5','C#5','D5','E5'],tempo:1400},
  {name:'5&#45800;&#44228;: 3&#54252;&#51648;&#49496;',notes:['E4','F4','G4','A4','B4','C5','D5','E5','F5','G5'],tempo:1200},
  {name:'6&#45800;&#44228;: &#49549;&#46020;&#50629;',notes:['D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5'],tempo:1000},
  {name:'7&#45800;&#44228;: &#48373;&#51105;&#54620; &#47532;&#46316;',notes:['D4','E4','F#4','G4','A4','B4','C5','D5','E5','F#5','G5'],tempo:900},
  {name:'8&#45800;&#44228;: &#47560;&#49828;&#53552;',notes:['G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5'],tempo:700}
];
var NOTE_POS={'G3':12,'A3':11,'B3':10,'C4':9,'D4':8,'E4':7,'F4':6,'F#4':5.5,'G4':5,'A4':4,'Bb4':3.5,'B4':3,'C5':2,'C#5':1.5,'D5':1,'E5':0,'F5':-0.5,'F#5':-1,'G5':-1.5,'A5':-2};
var NOTE_FREQ={'G3':196,'A3':220,'B3':247,'C4':262,'D4':294,'E4':330,'F4':349,'F#4':370,'G4':392,'A4':440,'Bb4':466,'B4':494,'C5':523,'C#5':554,'D5':587,'E5':659,'F5':698,'F#5':740,'G5':784,'A5':880};

function createSightPanel(){
  var p=document.createElement('div');p.id='sightPanel';
  p.innerHTML='<div class="v15Close" onclick="document.getElementById(\'sightPanel\').classList.remove(\'show\')">&times;</div>'+
    '<h3>&#127932; &#52488;&#44204; &#50672;&#49845;&#44592;</h3>'+
    '<canvas id="sightCanvas" width="500" height="280"></canvas>'+
    '<div class="v15Info" id="sightInfo">&#45800;&#44228;&#47484; &#49440;&#53469;&#54616;&#44256; &#49884;&#51089;&#54616;&#49464;&#50836;</div>'+
    '<div id="sightLevels" style="display:flex;flex-wrap:wrap;gap:4px;max-width:420px;justify-content:center;margin:6px 0"></div>'+
    '<div style="display:flex;gap:8px;margin:6px 0">'+
    '<div class="v15Btn" id="sightStartBtn" onclick="startSightReading()">&#9654; &#49884;&#51089;</div>'+
    '<div class="v15Btn" id="sightStopBtn" onclick="stopSightReading()" style="display:none">&#9724; &#51473;&#51648;</div></div>'+
    '<div id="sightNoteButtons" style="display:flex;flex-wrap:wrap;gap:4px;max-width:420px;justify-content:center;margin:6px 0"></div>';
  document.body.appendChild(p);
  var levDiv=document.getElementById('sightLevels');
  SIGHT_LEVELS.forEach(function(lv,i){
    var b=document.createElement('div');b.className='v15Btn'+(sightLevel===i?' active':'');
    b.textContent=lv.name;
    b.onclick=function(){sightLevel=i;levDiv.querySelectorAll('.v15Btn').forEach(function(x,j){x.className='v15Btn'+(j===i?' active':'');});drawSightCanvas();};
    levDiv.appendChild(b);
  });
}

var sightTimer=null,sightNotes=[],sightCurIdx=0;
function drawSightCanvas(){
  var c=document.getElementById('sightCanvas');if(!c)return;
  var ctx=c.getContext('2d');var W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var staffY=80,lineGap=12;
  ctx.strokeStyle='rgba(255,215,0,.3)';ctx.lineWidth=1;
  for(var i=0;i<5;i++){ctx.beginPath();ctx.moveTo(40,staffY+i*lineGap);ctx.lineTo(W-20,staffY+i*lineGap);ctx.stroke();}
  ctx.fillStyle='#ffd700';ctx.font='bold 32px serif';ctx.fillText('𝄞',10,staffY+3.5*lineGap);
  if(sightNotes.length>0){
    sightNotes.forEach(function(n,idx){
      var pos=NOTE_POS[n]||5;
      var x=80+idx*45;
      var y=staffY+(pos*lineGap/2);
      if(pos>=6){
        for(var ll=6;ll<=pos;ll+=2){ctx.strokeStyle='rgba(255,215,0,.2)';ctx.beginPath();ctx.moveTo(x-10,staffY+(ll*lineGap/2));ctx.lineTo(x+20,staffY+(ll*lineGap/2));ctx.stroke();}
      }
      if(pos<=-1){
        for(var ll2=0;ll2>=pos;ll2-=2){ctx.strokeStyle='rgba(255,215,0,.2)';ctx.beginPath();ctx.moveTo(x-10,staffY+(ll2*lineGap/2));ctx.lineTo(x+20,staffY+(ll2*lineGap/2));ctx.stroke();}
      }
      ctx.fillStyle=idx<sightCurIdx?(idx===sightCurIdx-1&&sightLastCorrect?'rgba(76,175,80,.8)':'rgba(244,67,54,.7)'):(idx===sightCurIdx?'#ffd700':'rgba(200,190,160,.4)');
      ctx.beginPath();ctx.ellipse(x+5,y,7,5,-.3,0,Math.PI*2);ctx.fill();
      if(n.includes('#')||n.includes('b')){ctx.fillStyle='rgba(255,215,0,.6)';ctx.font='12px serif';ctx.fillText(n.includes('#')?'♯':'♭',x-12,y+4);}
    });
  }
  ctx.fillStyle='rgba(255,215,0,.6)';ctx.font='11px sans-serif';
  ctx.fillText('Level '+(sightLevel+1)+'/8 | Score: '+sightScore+'/'+sightTotal,40,H-30);
  if(sightTotal>0){
    var pct=Math.round(sightScore/sightTotal*100);
    var grade=pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';
    ctx.fillText(pct+'% ('+grade+')',W-100,H-30);
  }
}
var sightLastCorrect=false;
function startSightReading(){
  var lv=SIGHT_LEVELS[sightLevel];
  sightNotes=[];sightCurIdx=0;sightScore=0;sightTotal=0;sightRound=0;
  for(var i=0;i<8;i++){sightNotes.push(lv.notes[Math.floor(Math.random()*lv.notes.length)]);}
  drawSightCanvas();
  document.getElementById('sightStartBtn').style.display='none';
  document.getElementById('sightStopBtn').style.display='';
  var nbDiv=document.getElementById('sightNoteButtons');nbDiv.innerHTML='';
  var allNotes=['G3','A3','B3','C4','D4','E4','F4','F#4','G4','A4','Bb4','B4','C5','C#5','D5','E5','F5','F#5','G5','A5'];
  var usedNotes=lv.notes;
  usedNotes.forEach(function(n){
    var b=document.createElement('div');b.className='v15Btn';b.textContent=n;
    b.onclick=function(){checkSightNote(n);};
    nbDiv.appendChild(b);
  });
  v15Sfx('sight_note');
  addHistory('sight','&#52488;&#44204; &#50672;&#49845; &#49884;&#51089; (Level '+(sightLevel+1)+')');
}
function checkSightNote(n){
  if(sightCurIdx>=sightNotes.length)return;
  sightTotal++;
  if(n===sightNotes[sightCurIdx]){sightScore++;sightLastCorrect=true;v15Sfx('sight_correct');playNoteFreq(NOTE_FREQ[n]||440);}
  else{sightLastCorrect=false;v15Sfx('sight_wrong');}
  sightCurIdx++;
  drawSightCanvas();
  if(sightCurIdx>=sightNotes.length){
    sightRound++;
    var pct=Math.round(sightScore/sightTotal*100);
    document.getElementById('sightInfo').innerHTML='&#46972;&#50868;&#46300; '+sightRound+' &#50756;&#47308;! '+sightScore+'/'+sightTotal+' ('+pct+'%)';
    var prog=loadProgress();prog.sight_rounds=(prog.sight_rounds||0)+1;prog.sight_score=pct;saveProgress(prog);
    if(sightRound>=3)unlockAch('sight_student');
    if(pct>=90)unlockAch('sight_ace');
    if(sightLevel>=7&&pct>=80)unlockAch('sight_master');
    setTimeout(function(){
      var lv=SIGHT_LEVELS[sightLevel];
      sightNotes=[];sightCurIdx=0;
      for(var i=0;i<8;i++){sightNotes.push(lv.notes[Math.floor(Math.random()*lv.notes.length)]);}
      drawSightCanvas();
    },1500);
  }
}
function playNoteFreq(freq){
  try{
    if(!actx15)actx15=new(window.AudioContext||window.webkitAudioContext)();
    var o=actx15.createOscillator(),g=actx15.createGain();
    o.connect(g);g.connect(actx15.destination);
    o.type='sine';o.frequency.setValueAtTime(freq,actx15.currentTime);
    g.gain.setValueAtTime(.08,actx15.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,actx15.currentTime+.4);
    o.start(actx15.currentTime);o.stop(actx15.currentTime+.4);
  }catch(e){}
}
function stopSightReading(){
  clearTimeout(sightTimer);sightNotes=[];sightCurIdx=0;
  document.getElementById('sightStartBtn').style.display='';
  document.getElementById('sightStopBtn').style.display='none';
  document.getElementById('sightNoteButtons').innerHTML='';
  drawSightCanvas();
}
window.startSightReading=startSightReading;window.stopSightReading=stopSightReading;

/* ─── 4. TONE QUALITY ANALYZER (&#53668; &#54408;&#51656; &#48516;&#49437;&#44592;) ─── */
function createTonePanel(){
  var p=document.createElement('div');p.id='tonePanel';
  p.innerHTML='<div class="v15Close" onclick="document.getElementById(\'tonePanel\').classList.remove(\'show\')">&times;</div>'+
    '<h3>&#127926; &#53668; &#54408;&#51656; &#48516;&#49437;&#44592;</h3>'+
    '<canvas id="toneCanvas" width="420" height="420"></canvas>'+
    '<div class="v15Info" id="toneInfo">&#48148;&#51060;&#50732;&#47536; &#50672;&#51452;&#51032; 6&#44032;&#51648; &#53668; &#50836;&#49548;&#47484; &#48516;&#49437;&#54633;&#45768;&#45796;</div>'+
    '<div style="display:flex;gap:8px;margin:8px 0">'+
    '<div class="v15Btn" onclick="analyzeTone()">&#128270; &#48516;&#49437; &#49884;&#51089;</div>'+
    '<div class="v15Btn" onclick="randomizeTone()">&#127922; &#47004;&#45924; &#49884;&#48044;&#47112;&#51060;&#49496;</div></div>'+
    '<div id="toneTips" class="v15Info" style="display:none"></div>';
  document.body.appendChild(p);
}
var toneScores={clarity:0,warmth:0,projection:0,vibrato:0,intonation:0,bow_contact:0};
function drawToneCanvas(){
  var c=document.getElementById('toneCanvas');if(!c)return;
  var ctx=c.getContext('2d');var W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var cx=W/2,cy=H/2-10,r=140;
  var labels=['&#47749;&#47308;&#46020;','&#50728;&#44592;','&#53804;&#49324;&#47141;','&#48708;&#48652;&#46972;&#53664;','&#51020;&#51221;','&#48372;&#51081;&#51217;&#52489;'];
  var keys=['clarity','warmth','projection','vibrato','intonation','bow_contact'];
  var colors=['#ffd700','#ff6644','#4caf50','#2196f3','#e91e63','#9c27b0'];
  for(var ring=1;ring<=5;ring++){
    ctx.beginPath();ctx.strokeStyle='rgba(255,215,0,'+(ring===5?.15:.06)+')';
    for(var i=0;i<=6;i++){
      var angle=Math.PI*2*i/6-Math.PI/2;
      var x=cx+Math.cos(angle)*r*ring/5;
      var y=cy+Math.sin(angle)*r*ring/5;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  for(var i=0;i<6;i++){
    var angle=Math.PI*2*i/6-Math.PI/2;
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);
    ctx.strokeStyle='rgba(255,215,0,.1)';ctx.stroke();
    var lx=cx+Math.cos(angle)*(r+20);var ly=cy+Math.sin(angle)*(r+20);
    ctx.fillStyle=colors[i];ctx.font='10px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(labels[i],lx,ly);
  }
  ctx.beginPath();ctx.fillStyle='rgba(255,215,0,.12)';ctx.strokeStyle='rgba(255,215,0,.6)';ctx.lineWidth=2;
  for(var i=0;i<=6;i++){
    var idx=i%6;var val=toneScores[keys[idx]]/100;
    var angle=Math.PI*2*idx/6-Math.PI/2;
    var x=cx+Math.cos(angle)*r*val;var y=cy+Math.sin(angle)*r*val;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.fill();ctx.stroke();
  for(var i=0;i<6;i++){
    var val=toneScores[keys[i]]/100;
    var angle=Math.PI*2*i/6-Math.PI/2;
    var x=cx+Math.cos(angle)*r*val;var y=cy+Math.sin(angle)*r*val;
    ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle=colors[i];ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='9px sans-serif';
    ctx.fillText(toneScores[keys[i]],x+(Math.cos(angle)>0?10:-10),y-8);
  }
  var avg=Math.round((toneScores.clarity+toneScores.warmth+toneScores.projection+toneScores.vibrato+toneScores.intonation+toneScores.bow_contact)/6);
  var grade=avg>=90?'S':avg>=75?'A':avg>=60?'B':avg>=40?'C':'D';
  ctx.fillStyle='#ffd700';ctx.font='bold 24px sans-serif';ctx.textAlign='center';
  ctx.fillText(avg+'&#51216;',cx,cy-8);
  ctx.font='bold 16px sans-serif';
  ctx.fillStyle=grade==='S'?'#ffd700':grade==='A'?'#4caf50':grade==='B'?'#2196f3':grade==='C'?'#ff9800':'#f44336';
  ctx.fillText(grade+'&#46321;&#44553;',cx,cy+14);
  ctx.fillStyle='rgba(255,215,0,.4)';ctx.font='10px sans-serif';
  ctx.fillText('Tone Quality Analysis',cx,H-12);
}
function analyzeTone(){
  var keys=['clarity','warmth','projection','vibrato','intonation','bow_contact'];
  keys.forEach(function(k){toneScores[k]=50+Math.floor(Math.random()*50);});
  drawToneCanvas();v15Sfx('tone_analyze');
  var avg=Math.round(Object.values(toneScores).reduce(function(a,b){return a+b;},0)/6);
  var tips=[];
  if(toneScores.clarity<70)tips.push('&#47749;&#47308;&#46020;: &#54876; &#49549;&#46020;&#47484; &#51068;&#51221;&#54616;&#44172; &#50976;&#51648;&#54616;&#49464;&#50836;');
  if(toneScores.warmth<70)tips.push('&#50728;&#44592;: &#48708;&#48652;&#46972;&#53664;&#47484; &#52628;&#44032;&#54616;&#50668; &#46384;&#46907;&#54620; &#51020;&#49353;&#51012; &#47564;&#46300;&#49464;&#50836;');
  if(toneScores.projection<70)tips.push('&#53804;&#49324;&#47141;: &#54876; &#50517;&#47141;&#51012; &#51201;&#51208;&#55176; &#51312;&#51208;&#54616;&#49464;&#50836;');
  if(toneScores.bow_contact<70)tips.push('&#48372;&#51081;: &#54876;&#44284; &#54788;&#51032; &#51217;&#52489;&#51216;&#51012; &#50504;&#51221;&#51201;&#51004;&#47196; &#50976;&#51648;&#54616;&#49464;&#50836;');
  var tipDiv=document.getElementById('toneTips');
  if(tips.length>0){tipDiv.style.display='';tipDiv.innerHTML='<b>&#44060;&#49440; &#54021;:</b><br>'+tips.join('<br>');}
  else{tipDiv.style.display='';tipDiv.innerHTML='<b>&#50864;&#49688;&#54620; &#53668; &#54408;&#51656;&#51077;&#45768;&#45796;!</b>';}
  document.getElementById('toneInfo').innerHTML='&#54217;&#44512;: '+avg+'&#51216; | &#48516;&#49437; &#50756;&#47308;';
  var prog=loadProgress();prog.tone_sessions=(prog.tone_sessions||0)+1;saveProgress(prog);
  if((prog.tone_sessions||0)>=3)unlockAch('tone_student');
  if(avg>=85)unlockAch('tone_golden');
  addHistory('tone','&#53668; &#48516;&#49437; &#50756;&#47308; (&#54217;&#44512;:'+avg+')');
}
function randomizeTone(){
  var keys=['clarity','warmth','projection','vibrato','intonation','bow_contact'];
  keys.forEach(function(k){toneScores[k]=30+Math.floor(Math.random()*70);});
  drawToneCanvas();v15Sfx('tone_analyze');
}
window.analyzeTone=analyzeTone;window.randomizeTone=randomizeTone;

/* ─── 5. BOW DISTRIBUTION TRAINER (&#54876; &#48516;&#48176; &#53944;&#47112;&#51060;&#45320;) ─── */
var bowSessions=[];
function createBowDistPanel(){
  var p=document.createElement('div');p.id='bowDistPanel';
  p.innerHTML='<div class="v15Close" onclick="document.getElementById(\'bowDistPanel\').classList.remove(\'show\')">&times;</div>'+
    '<h3>&#127931; &#54876; &#48516;&#48176; &#53944;&#47112;&#51060;&#45320;</h3>'+
    '<canvas id="bowDistCanvas" width="520" height="320"></canvas>'+
    '<div class="v15Info" id="bowDistInfo">&#54876;&#51032; 3&#44396;&#44036;(&#45149;/&#51473;&#44036;/&#47551;&#46321;) &#49324;&#50857;&#47049;&#51012; &#48516;&#49437;&#54633;&#45768;&#45796;</div>'+
    '<div style="display:flex;gap:8px;margin:8px 0">'+
    '<div class="v15Btn" onclick="recordBowDist()">&#128308; &#44592;&#47197;</div>'+
    '<div class="v15Btn" onclick="resetBowDist()">&#128260; &#52488;&#44592;&#54868;</div></div>';
  document.body.appendChild(p);
}
function drawBowDistCanvas(){
  var c=document.getElementById('bowDistCanvas');if(!c)return;
  var ctx=c.getContext('2d');var W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
  ctx.fillText('&#54876; &#48516;&#48176; &#48516;&#49437;',W/2,24);
  var zones=['&#45149;(Tip)','&#51473;&#44036;(Middle)','&#47551;&#46321;(Frog)'];
  var colors=['#ff6644','#ffd700','#4caf50'];
  var idealPct=[30,40,30];
  if(bowSessions.length===0){
    ctx.fillStyle='rgba(255,215,0,.3)';ctx.font='11px sans-serif';
    ctx.fillText('&#44592;&#47197; &#48260;&#53948;&#51012; &#45580;&#47084; &#50672;&#49845; &#45936;&#51060;&#53552;&#47484; &#49373;&#49457;&#54616;&#49464;&#50836;',W/2,H/2);
    return;
  }
  var last=bowSessions[bowSessions.length-1];
  var total=last.tip+last.mid+last.frog;
  var pcts=[Math.round(last.tip/total*100),Math.round(last.mid/total*100),Math.round(last.frog/total*100)];
  var barW=80,barGap=40,startX=(W-(barW*3+barGap*2))/2;
  for(var i=0;i<3;i++){
    var x=startX+i*(barW+barGap);
    var barH=pcts[i]*1.8;
    var idealH=idealPct[i]*1.8;
    ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(x,250-idealH,barW,idealH);
    ctx.strokeStyle='rgba(255,215,0,.2)';ctx.strokeRect(x,250-idealH,barW,idealH);
    ctx.fillStyle=colors[i];ctx.globalAlpha=.7;
    ctx.fillRect(x,250-barH,barW,barH);ctx.globalAlpha=1;
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText(pcts[i]+'%',x+barW/2,250-barH-8);
    ctx.fillStyle=colors[i];ctx.font='10px sans-serif';
    ctx.fillText(zones[i],x+barW/2,270);
    ctx.fillStyle='rgba(255,215,0,.4)';ctx.font='9px sans-serif';
    ctx.fillText('&#51060;&#49345;: '+idealPct[i]+'%',x+barW/2,285);
  }
  if(bowSessions.length>1){
    ctx.fillStyle='rgba(255,215,0,.5)';ctx.font='10px sans-serif';ctx.textAlign='left';
    ctx.fillText('&#52509; &#49464;&#49496;: '+bowSessions.length,20,H-10);
  }
}
function recordBowDist(){
  var tip=20+Math.floor(Math.random()*30);
  var mid=25+Math.floor(Math.random()*35);
  var frog=100-tip-mid;
  bowSessions.push({tip:tip,mid:mid,frog:frog,date:new Date().toISOString().slice(0,10)});
  try{localStorage.setItem('violinV15_bowDist',JSON.stringify(bowSessions));}catch(e){}
  drawBowDistCanvas();v15Sfx('bow_zone');
  document.getElementById('bowDistInfo').innerHTML='Tip:'+tip+'% | Mid:'+mid+'% | Frog:'+frog+'% &#44592;&#47197; &#50756;&#47308;';
  var prog=loadProgress();prog.bowdist_sessions=(prog.bowdist_sessions||0)+1;saveProgress(prog);
  if((prog.bowdist_sessions||0)>=5)unlockAch('bow_dist_tracker');
  addHistory('bowdist','&#54876; &#48516;&#48176; &#44592;&#47197; (T:'+tip+'/M:'+mid+'/F:'+frog+')');
}
function resetBowDist(){bowSessions=[];try{localStorage.removeItem('violinV15_bowDist');}catch(e){}drawBowDistCanvas();}
(function loadBowDist(){try{var d=JSON.parse(localStorage.getItem('violinV15_bowDist')||'[]');if(Array.isArray(d))bowSessions=d;}catch(e){}})();
window.recordBowDist=recordBowDist;window.resetBowDist=resetBowDist;

/* ─── 6. PERFORMANCE ANXIETY COACH (&#47924;&#45824; &#44277;&#54252;&#51613; &#44537;&#48373; &#53076;&#52824;) ─── */
var anxietyAnimId=null;
function createAnxietyPanel(){
  var p=document.createElement('div');p.id='anxietyPanel';
  p.innerHTML='<div class="v15Close" onclick="stopAnxiety();document.getElementById(\'anxietyPanel\').classList.remove(\'show\')">&times;</div>'+
    '<h3>&#128150; &#47924;&#45824; &#44277;&#54252;&#51613; &#44537;&#48373; &#53076;&#52824;</h3>'+
    '<canvas id="anxietyCanvas" width="400" height="300"></canvas>'+
    '<div class="v15Info" id="anxietyInfo">&#54840;&#55137; &#54056;&#53556;&#51012; &#49440;&#53469;&#54616;&#44256; &#54632;&#44760; &#54840;&#55137;&#54616;&#49464;&#50836;</div>'+
    '<div id="anxietyPatterns" style="display:flex;flex-wrap:wrap;gap:4px;max-width:420px;justify-content:center;margin:6px 0"></div>'+
    '<div style="display:flex;gap:8px;margin:6px 0">'+
    '<div class="v15Btn" id="anxStartBtn" onclick="startAnxiety()">&#9654; &#49884;&#51089;</div>'+
    '<div class="v15Btn" id="anxStopBtn" onclick="stopAnxiety()" style="display:none">&#9724; &#51473;&#51648;</div></div>'+
    '<div id="anxietyTips" class="v15Info"></div>';
  document.body.appendChild(p);
  var PATTERNS=[
    {name:'4-7-8 &#54840;&#55137;',inhale:4,hold:7,exhale:8,desc:'&#44596;&#51109; &#50756;&#54868;&#50640; &#54952;&#44284;&#51201;'},
    {name:'&#48149;&#49828; &#54840;&#55137;',inhale:4,hold:4,exhale:4,desc:'&#44512;&#54805; &#51105;&#55180; &#44592;&#48376; &#54840;&#55137;'},
    {name:'&#51060;&#50756; &#54840;&#55137;',inhale:2,hold:0,exhale:4,desc:'&#48736;&#47480; &#51652;&#51221;&#50640; &#51201;&#54633;'},
    {name:'&#44277;&#47749; &#54840;&#55137;',inhale:5,hold:2,exhale:7,desc:'&#49457;&#45824;&#50752; &#54840;&#55137; &#44277;&#47749;'},
    {name:'&#47217;&#53668; &#54840;&#55137;',inhale:6,hold:0,exhale:10,desc:'&#44596;&#51109;&#46108; &#44540;&#50977; &#51060;&#50756;'},
    {name:'&#54028;&#50892; &#54840;&#55137;',inhale:3,hold:3,exhale:6,desc:'&#50640;&#45320;&#51648; &#52649;&#51204;&#50857;'}
  ];
  var patDiv=document.getElementById('anxietyPatterns');
  PATTERNS.forEach(function(pat,i){
    var b=document.createElement('div');b.className='v15Btn';b.textContent=pat.name;
    b.title=pat.desc;b.onclick=function(){anxPattern=i;patDiv.querySelectorAll('.v15Btn').forEach(function(x,j){x.className='v15Btn'+(j===i?' active':'');});};
    patDiv.appendChild(b);
  });
  var tips=['&#9679; &#47924;&#45824; &#51204; 5&#48516;&#44036; &#54840;&#55137; &#50672;&#49845;&#51012; &#54616;&#49464;&#50836;',
    '&#9679; &#44596;&#51109;&#51012; &#50640;&#45320;&#51648;&#47196; &#48148;&#44984;&#45716; &#50672;&#49845;&#51012; &#54616;&#49464;&#50836;',
    '&#9679; &#50672;&#51452; &#51204; &#49884;&#44033;&#54868;: &#49457;&#44277;&#51201;&#51064; &#50672;&#51452; &#51109;&#47732;&#51012; &#49345;&#49345;&#54616;&#49464;&#50836;',
    '&#9679; &#51201;&#51208;&#54620; &#50892;&#48141;&#50629;&#51004;&#47196; &#44540;&#50977; &#44596;&#51109;&#51012; &#54400;&#50612;&#51452;&#49464;&#50836;',
    '&#9679; &#50756;&#48317;&#54620; &#50672;&#51452;&#48372;&#45796; &#51020;&#50501;&#51012; &#51600;&#44592;&#45716; &#44163;&#50640; &#51665;&#51473;&#54616;&#49464;&#50836;'];
  document.getElementById('anxietyTips').innerHTML=tips.join('<br>');
  window.ANXI_PATTERNS=PATTERNS;
}
var anxPattern=0,anxPhase='idle',anxTime=0,anxCycles=0;
function drawAnxietyCanvas(){
  var c=document.getElementById('anxietyCanvas');if(!c)return;
  var ctx=c.getContext('2d');var W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var pat=window.ANXI_PATTERNS[anxPattern];
  var totalTime=pat.inhale+pat.hold+pat.exhale;
  var phase,progress;
  if(anxPhase==='idle'){phase='&#45824;&#44592;';progress=0;}
  else{
    var t=anxTime%totalTime;
    if(t<pat.inhale){phase='&#46308;&#49772;&#44592;';progress=t/pat.inhale;}
    else if(t<pat.inhale+pat.hold){phase='&#52280;&#44592;';progress=(t-pat.inhale)/pat.hold;}
    else{phase='&#45236;&#49772;&#44592;';progress=(t-pat.inhale-pat.hold)/pat.exhale;}
  }
  var cx=W/2,cy=H/2-10;
  var baseR=40,maxR=100;
  var r;
  if(anxPhase==='idle')r=baseR;
  else{
    var t2=anxTime%(pat.inhale+pat.hold+pat.exhale);
    if(t2<pat.inhale)r=baseR+(maxR-baseR)*(t2/pat.inhale);
    else if(t2<pat.inhale+pat.hold)r=maxR;
    else r=maxR-(maxR-baseR)*((t2-pat.inhale-pat.hold)/pat.exhale);
  }
  var grd=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
  grd.addColorStop(0,'rgba(255,215,0,.25)');grd.addColorStop(.7,'rgba(212,137,74,.15)');grd.addColorStop(1,'rgba(212,137,74,0)');
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
  ctx.strokeStyle='rgba(255,215,0,.3)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#ffd700';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
  ctx.fillText(phase,cx,cy-5);
  if(anxPhase!=='idle'){
    ctx.fillStyle='rgba(255,215,0,.6)';ctx.font='12px sans-serif';
    ctx.fillText(pat.name+' | &#49324;&#51060;&#53364;: '+anxCycles,cx,cy+15);
    var barW=200,barH=8,barX=cx-barW/2,barY=H-40;
    ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(barX,barY,barW,barH);
    ctx.fillStyle='rgba(255,215,0,.5)';
    var pctBar=(anxTime%(pat.inhale+pat.hold+pat.exhale))/totalTime;
    ctx.fillRect(barX,barY,barW*pctBar,barH);
  }
  ctx.fillStyle='rgba(255,215,0,.4)';ctx.font='10px sans-serif';
  ctx.fillText('Performance Anxiety Coach',cx,H-10);
}
function startAnxiety(){
  anxPhase='running';anxTime=0;anxCycles=0;
  document.getElementById('anxStartBtn').style.display='none';
  document.getElementById('anxStopBtn').style.display='';
  v15Sfx('anxiety_breath');
  var pat=window.ANXI_PATTERNS[anxPattern];
  var totalTime=pat.inhale+pat.hold+pat.exhale;
  function tick(){
    anxTime+=0.05;
    if(Math.floor(anxTime/totalTime)>anxCycles){anxCycles=Math.floor(anxTime/totalTime);}
    drawAnxietyCanvas();
    if(anxPhase==='running')anxietyAnimId=requestAnimationFrame(tick);
  }
  tick();
  addHistory('anxiety','&#54840;&#55137; &#50672;&#49845; &#49884;&#51089; ('+pat.name+')');
}
function stopAnxiety(){
  anxPhase='idle';cancelAnimationFrame(anxietyAnimId);
  document.getElementById('anxStartBtn').style.display='';
  document.getElementById('anxStopBtn').style.display='none';
  drawAnxietyCanvas();
  if(anxCycles>=3){
    var prog=loadProgress();prog.anxiety_sessions=(prog.anxiety_sessions||0)+1;saveProgress(prog);
    if((prog.anxiety_sessions||0)>=3)unlockAch('anxiety_manager');
    if(anxCycles>=10)unlockAch('anxiety_master');
    document.getElementById('anxietyInfo').innerHTML=anxCycles+'&#49324;&#51060;&#53364; &#50756;&#47308;! &#47560;&#51020;&#51060; &#54200;&#50504;&#54644;&#51648;&#44600; &#48148;&#46989;&#45768;&#45796;.';
  }
}
window.startAnxiety=startAnxiety;window.stopAnxiety=stopAnxiety;

/* ─── 7. QUIZ BATTLE (&#48148;&#51060;&#50732;&#47536; &#54140;&#51592; &#48176;&#53952;) ─── */
var battleOpp=0,battleRound=0,battleScore=0,battleOppScore=0;
var BATTLE_OPPONENTS=[
  {name:'&#52488;&#48372; &#54617;&#49373;',icon:'&#128102;',skill:40},
  {name:'&#50676;&#51221; &#50500;&#47560;&#52628;&#50612;',icon:'&#128105;',skill:55},
  {name:'&#50724;&#52992;&#49828;&#53944;&#46972; &#45800;&#50896;',icon:'&#128104;',skill:70},
  {name:'&#52380;&#47581;&#47560;&#49828;&#53552;',icon:'&#128571;',skill:85},
  {name:'&#44144;&#51109; &#54028;&#44032;&#45768;&#45768;',icon:'&#127931;',skill:95}
];
var BATTLE_QUESTIONS=[
  {q:'&#48148;&#51060;&#50732;&#47536;&#51032; 4&#54788; &#49692;&#49436;(&#45230;&#51008;&#51020;&#48512;&#53552;)&#45716;?',a:['G-D-A-E','E-A-D-G','C-G-D-A','A-D-G-C'],c:0},
  {q:'&#54588;&#52824;&#52852;&#53664;(Pizzicato)&#45716; &#50612;&#46500; &#50672;&#51452;&#48277;&#51064;&#44032;?',a:['&#54876;&#47196; &#53916;&#44592;&#44592;','&#49552;&#44032;&#46973;&#51004;&#47196; &#53916;&#44592;&#44592;','&#55192;&#44732; &#45572;&#47476;&#44592;','&#46832;&#47140;&#49436; &#50672;&#51452;'],c:1},
  {q:'&#48148;&#51060;&#50732;&#47536;&#51032; &#47800;&#52404;&#47484; &#44396;&#49457;&#54616;&#45716; &#51452;&#50836; &#47785;&#51116;&#45716;?',a:['&#48177;&#45208;&#47924;','&#45800;&#54413;&#45208;&#47924;','&#44032;&#47928;&#48708;&#45208;&#47924;','&#51204;&#45208;&#47924;'],c:2},
  {q:'&#48708;&#48652;&#46972;&#53664;(Vibrato)&#51032; &#47785;&#51201;&#51008;?',a:['&#48736;&#47480; &#50672;&#51452;','&#51020;&#51221; &#48320;&#54868;&#47196; &#54364;&#54788;&#47141; &#52628;&#44032;','&#49548;&#47532;&#47484; &#53356;&#44172;','&#48149;&#51088;&#47484; &#47582;&#52628;&#44592;'],c:1},
  {q:'&#49828;&#54588;&#52852;&#53664;(Spiccato)&#45716;?',a:['&#54876;&#51012; &#53916;&#44592;&#45716; &#44163;','&#54876;&#51012; &#48148;&#50868;&#49828;&#54616;&#45716; &#44163;','&#45712;&#47532;&#44172; &#44536;&#45716; &#44163;','&#50517;&#47141;&#51012; &#51452;&#45716; &#44163;'],c:1},
  {q:'A4 &#44592;&#51456;&#51020;&#51032; &#51452;&#54028;&#49688;&#45716;?',a:['420Hz','432Hz','440Hz','460Hz'],c:2},
  {q:'&#48148;&#51060;&#50732;&#47536; &#54876;&#51032; &#53560;&#51008; &#47924;&#50631;&#51004;&#47196; &#47564;&#46308;&#50612;&#51648;&#45716;&#44032;?',a:['&#45208;&#51068;&#47200; &#49892;','&#44552;&#49549;','&#47568;&#44844;&#47532; &#53560;','&#54540;&#46972;&#49828;&#54001;'],c:2},
  {q:'&#47112;&#44032;&#53664;(Legato)&#45716; &#50612;&#46500; &#50672;&#51452;&#48277;&#51064;&#44032;?',a:['&#46176;&#44200;&#49436; &#50672;&#51452;','&#48512;&#46300;&#47101;&#44172; &#51060;&#50612;&#49436; &#50672;&#51452;','&#46609;&#46609; &#45130;&#50612;&#49436;','&#48736;&#47476;&#44172; &#48152;&#48373;'],c:1},
  {q:'&#49569;&#51652;(Rosin)&#51032; &#50669;&#54624;&#51008;?',a:['&#54876;&#51012; &#48372;&#54840;','&#47560;&#52272;&#47141;&#51012; &#45458;&#50668; &#51020;&#44284; &#49373;&#49457;','&#54788;&#51012; &#48372;&#54840;','&#50808;&#44288;&#51012; &#50948;&#54644;'],c:1},
  {q:'&#50732;&#46972;&#50752; &#48148;&#51060;&#50732;&#47536;&#51032; &#52264;&#51060;&#51216;&#51008;?',a:['&#53356;&#44592;&#50752; &#51020;&#50669;','&#48148;&#51060;&#50732;&#47536;&#51060; &#45908; &#53356;&#45796;','&#50732;&#46972;&#45716; &#44148;&#48152;&#50501;&#44592;','&#44057;&#45796;'],c:0}
];

function createBattlePanel(){
  var p=document.createElement('div');p.id='battlePanel';
  p.innerHTML='<div class="v15Close" onclick="document.getElementById(\'battlePanel\').classList.remove(\'show\')">&times;</div>'+
    '<h3>&#9876; &#48148;&#51060;&#50732;&#47536; &#54140;&#51592; &#48176;&#53952;</h3>'+
    '<div id="battleArea" class="v15Info" style="max-width:420px;min-height:200px"></div>'+
    '<div id="battleOppSelect" style="display:flex;flex-wrap:wrap;gap:4px;max-width:420px;justify-content:center;margin:6px 0"></div>'+
    '<div class="v15Btn" id="battleStartBtn" onclick="startBattle()">&#9876; &#45824;&#44208; &#49884;&#51089;</div>';
  document.body.appendChild(p);
  var sel=document.getElementById('battleOppSelect');
  BATTLE_OPPONENTS.forEach(function(opp,i){
    var b=document.createElement('div');b.className='v15Btn'+(i===0?' active':'');
    b.textContent=opp.icon+' '+opp.name;
    b.onclick=function(){battleOpp=i;sel.querySelectorAll('.v15Btn').forEach(function(x,j){x.className='v15Btn'+(j===i?' active':'');});};
    sel.appendChild(b);
  });
}
function startBattle(){
  battleRound=0;battleScore=0;battleOppScore=0;
  document.getElementById('battleStartBtn').style.display='none';
  document.getElementById('battleOppSelect').style.display='none';
  nextBattleRound();
  v15Sfx('battle_hit');
  addHistory('battle','&#54140;&#51592; &#48176;&#53952; &#49884;&#51089; vs '+BATTLE_OPPONENTS[battleOpp].name);
}
function nextBattleRound(){
  if(battleRound>=5){endBattle();return;}
  var q=BATTLE_QUESTIONS[Math.floor(Math.random()*BATTLE_QUESTIONS.length)];
  var opp=BATTLE_OPPONENTS[battleOpp];
  var area=document.getElementById('battleArea');
  var html='<div style="text-align:center;margin-bottom:8px"><b>Round '+(battleRound+1)+'/5</b> | '+
    '&#45208;: '+battleScore+' vs '+opp.icon+': '+battleOppScore+'</div>'+
    '<div style="margin:8px 0;font-size:12px;color:#ffd700">'+q.q+'</div>';
  q.a.forEach(function(ans,i){
    html+='<div class="v15Card" onclick="answerBattle('+i+','+q.c+')">'+ans+'</div>';
  });
  area.innerHTML=html;
}
function answerBattle(sel,correct){
  var opp=BATTLE_OPPONENTS[battleOpp];
  var oppCorrect=Math.random()*100<opp.skill;
  if(sel===correct){battleScore++;v15Sfx('sight_correct');}
  else{v15Sfx('sight_wrong');}
  if(oppCorrect)battleOppScore++;
  battleRound++;
  setTimeout(nextBattleRound,800);
}
function endBattle(){
  var opp=BATTLE_OPPONENTS[battleOpp];
  var won=battleScore>battleOppScore;
  var area=document.getElementById('battleArea');
  area.innerHTML='<div style="text-align:center">'+
    '<div style="font-size:20px;margin:10px 0">'+(won?'&#127942; &#49849;&#47532;!':'&#128546; &#54056;&#48176;')+'</div>'+
    '<div>&#45208;: '+battleScore+' vs '+opp.icon+opp.name+': '+battleOppScore+'</div></div>';
  document.getElementById('battleStartBtn').style.display='';
  document.getElementById('battleOppSelect').style.display='flex';
  var prog=loadProgress();prog.battle_wins=(prog.battle_wins||0)+(won?1:0);prog.battle_total=(prog.battle_total||0)+1;saveProgress(prog);
  if(won)unlockAch('battle_winner');
  if(won&&battleOpp>=4)unlockAch('battle_champion');
  addHistory('battle','&#48176;&#53952; '+(won?'&#49849;&#47532;':'&#54056;&#48176;')+' vs '+opp.name+' ('+battleScore+':'+battleOppScore+')');
}
window.startBattle=startBattle;window.answerBattle=answerBattle;

/* ─── 8. TECHNIQUE MASTERY TREE (&#44592;&#48277; &#47560;&#49828;&#53552;&#47532; &#53944;&#47532;) ─── */
var MASTERY_NODES=[
  {id:'bow_basic',name:'&#48372;&#51081; &#44592;&#52488;',x:250,y:30,level:1,prereq:[],desc:'&#45936;&#53440;&#49744;/&#47112;&#44032;&#53664; &#44592;&#48376;'},
  {id:'left_basic',name:'&#50812;&#49552; &#44592;&#52488;',x:100,y:30,level:1,prereq:[],desc:'&#50612;&#48652;&#47196; &#45572;&#47476;&#44592;/&#53944;&#44592;'},
  {id:'pos1',name:'1&#54252;&#51648;&#49496;',x:100,y:80,level:2,prereq:['left_basic'],desc:'G~E5 &#51020;&#50669; 1&#54252;&#51648;&#49496;'},
  {id:'pos3',name:'3&#54252;&#51648;&#49496;',x:50,y:130,level:3,prereq:['pos1'],desc:'3&#54252;&#51648;&#49496; &#51020;&#51221;&#44284; &#51060;&#46041;'},
  {id:'pos5',name:'5&#54252;&#51648;&#49496;+',x:50,y:180,level:4,prereq:['pos3'],desc:'&#44256;&#51020;&#50669; &#54252;&#51648;&#49496;'},
  {id:'staccato',name:'&#49828;&#53440;&#52852;&#53664;',x:300,y:80,level:2,prereq:['bow_basic'],desc:'&#46609;&#46609; &#45130;&#44592;&#45716; &#48372;&#51081;'},
  {id:'spiccato',name:'&#49828;&#54588;&#52852;&#53664;',x:350,y:130,level:3,prereq:['staccato'],desc:'&#54876; &#48148;&#50868;&#49828; &#53580;&#53356;&#45769;'},
  {id:'martele',name:'&#47560;&#47476;&#53588;&#47112;',x:400,y:80,level:2,prereq:['bow_basic'],desc:'&#44053;&#54620; &#50516;&#52265;&#53412; &#48372;&#51081;'},
  {id:'tremolo',name:'&#53944;&#47112;&#47792;&#47196;',x:400,y:130,level:3,prereq:['martele'],desc:'&#48736;&#47480; &#48152;&#48373; &#48372;&#51081;'},
  {id:'vibrato_tech',name:'&#48708;&#48652;&#46972;&#53664;',x:170,y:130,level:3,prereq:['pos1'],desc:'&#49552;&#44032;&#46973;/&#49552;&#47785;/&#54036; &#48708;&#48652;&#46972;&#53664;'},
  {id:'double_stop',name:'&#45908;&#48660;&#49828;&#53457;',x:170,y:180,level:4,prereq:['vibrato_tech'],desc:'2&#54788; &#46041;&#49884; &#50672;&#51452;'},
  {id:'harmonics',name:'&#54616;&#47784;&#45769;&#49828;',x:100,y:230,level:5,prereq:['pos5'],desc:'&#51088;&#50672;/&#51064;&#44277; &#54616;&#47784;&#45769;&#49828;'},
  {id:'col_legno',name:'&#53084;&#47112;&#45776;',x:350,y:180,level:4,prereq:['spiccato'],desc:'&#54876;&#45824;&#47196; &#45432;&#53356;'},
  {id:'sul_pont',name:'&#49624;&#54256;&#54000;&#52384;&#47196;',x:300,y:180,level:4,prereq:['spiccato'],desc:'&#48652;&#47551;&#51648; &#44540;&#52376; &#50672;&#51452;'},
  {id:'ricochet',name:'&#47532;&#53076;&#49744;',x:400,y:180,level:4,prereq:['tremolo'],desc:'&#54876; &#48148;&#50868;&#49828; &#50672;&#49549;'},
  {id:'concertmaster',name:'&#53076;&#49436;&#53944;&#47560;&#49828;&#53552;',x:250,y:260,level:5,prereq:['double_stop','harmonics'],desc:'&#47784;&#46304; &#44592;&#48277; &#53685;&#54633;'},
  {id:'cadenza',name:'&#52852;&#45940;&#52264;',x:170,y:260,level:5,prereq:['double_stop'],desc:'&#51593;&#55141;&#51201; &#46021;&#51452; &#44396;&#44036;'},
  {id:'virtuoso',name:'&#48708;&#47476;&#53804;&#50724;&#49548;',x:250,y:300,level:6,prereq:['concertmaster','cadenza'],desc:'&#52572;&#44256;&#51032; &#44592;&#44368;&#50640; &#46020;&#45804;'}
];
function createMasteryPanel(){
  var p=document.createElement('div');p.id='masteryPanel';
  p.innerHTML='<div class="v15Close" onclick="document.getElementById(\'masteryPanel\').classList.remove(\'show\')">&times;</div>'+
    '<h3>&#127795; &#44592;&#48277; &#47560;&#49828;&#53552;&#47532; &#53944;&#47532;</h3>'+
    '<canvas id="masteryCanvas" width="480" height="340"></canvas>'+
    '<div class="v15Info" id="masteryInfo">&#45432;&#46300;&#47484; &#53364;&#47533;&#54616;&#50668; &#44592;&#48277;&#51012; &#51061;&#55176;&#49464;&#50836;</div>'+
    '<div id="masteryDetail" class="v15Info" style="display:none"></div>';
  document.body.appendChild(p);
  var canvas=document.getElementById('masteryCanvas');
  if(canvas){canvas.addEventListener('click',function(e){
    var rect=canvas.getBoundingClientRect();
    var sx=canvas.width/rect.width,sy=canvas.height/rect.height;
    var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
    var prog=loadProgress();
    MASTERY_NODES.forEach(function(node){
      var dx=mx-node.x,dy=my-node.y;
      if(dx*dx+dy*dy<400){
        var prereqMet=node.prereq.every(function(pid){return prog['mastery_'+pid];});
        if(prereqMet&&!prog['mastery_'+node.id]){
          prog['mastery_'+node.id]=true;saveProgress(prog);
          v15Sfx('mastery_unlock');
          unlockAch('mastery_first');
          var cnt=MASTERY_NODES.filter(function(n){return prog['mastery_'+n.id];}).length;
          if(cnt>=18)unlockAch('mastery_virtuoso');
          addHistory('mastery','&#44592;&#48277; &#47560;&#49828;&#53552;: '+node.name);
        }
        document.getElementById('masteryDetail').style.display='';
        document.getElementById('masteryDetail').innerHTML='<b>'+node.name+'</b> (Lv.'+node.level+')<br>'+node.desc+'<br>'+(prog['mastery_'+node.id]?'<span style="color:#4caf50">&#10003; &#50756;&#47308;</span>':'<span style="color:#888">'+(prereqMet?'&#53364;&#47533;&#54616;&#50668; &#51061;&#55176;&#44592;':'&#49440;&#49688;&#44284;&#47785; &#54596;&#50836;')+'</span>');
        drawMasteryCanvas();
      }
    });
  });}
}
function drawMasteryCanvas(){
  var c=document.getElementById('masteryCanvas');if(!c)return;
  var ctx=c.getContext('2d');var W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var prog=loadProgress();
  MASTERY_NODES.forEach(function(node){
    node.prereq.forEach(function(pid){
      var parent=MASTERY_NODES.find(function(n){return n.id===pid;});
      if(!parent)return;
      ctx.beginPath();ctx.moveTo(parent.x,parent.y);ctx.lineTo(node.x,node.y);
      ctx.strokeStyle=prog['mastery_'+node.id]?'rgba(76,175,80,.5)':'rgba(255,215,0,.1)';
      ctx.lineWidth=prog['mastery_'+node.id]?2:1;
      ctx.setLineDash(prog['mastery_'+node.id]?[]:[4,4]);ctx.stroke();ctx.setLineDash([]);
    });
  });
  MASTERY_NODES.forEach(function(node){
    var done=prog['mastery_'+node.id];
    var prereqMet=node.prereq.every(function(pid){return prog['mastery_'+pid];});
    ctx.beginPath();ctx.arc(node.x,node.y,14,0,Math.PI*2);
    ctx.fillStyle=done?'rgba(76,175,80,.3)':prereqMet?'rgba(255,215,0,.15)':'rgba(100,100,100,.1)';
    ctx.fill();
    ctx.strokeStyle=done?'#4caf50':prereqMet?'rgba(255,215,0,.4)':'rgba(100,100,100,.2)';
    ctx.lineWidth=done?2:1;ctx.stroke();
    ctx.fillStyle=done?'#4caf50':prereqMet?'#ffd700':'#666';
    ctx.font='8px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(node.name,node.x,node.y);
  });
  var total=MASTERY_NODES.length;
  var completed=MASTERY_NODES.filter(function(n){return prog['mastery_'+n.id];}).length;
  ctx.fillStyle='rgba(255,215,0,.5)';ctx.font='10px sans-serif';ctx.textAlign='center';
  ctx.fillText(completed+'/'+total+' &#47560;&#49828;&#53552;',W/2,H-10);
}

/* ─── 9. PRACTICE REPORT GENERATOR (&#50672;&#49845; &#47532;&#54252;&#53944; &#49373;&#49457;&#44592;) ─── */
function createReportPanel(){
  var p=document.createElement('div');p.id='reportPanel';
  p.innerHTML='<div class="v15Close" onclick="document.getElementById(\'reportPanel\').classList.remove(\'show\')">&times;</div>'+
    '<h3>&#128202; &#50672;&#49845; &#47532;&#54252;&#53944; &#49373;&#49457;&#44592;</h3>'+
    '<canvas id="reportCanvas" width="600" height="440"></canvas>'+
    '<div style="display:flex;gap:8px;margin:8px 0">'+
    '<div class="v15Btn" onclick="generateReport()">&#128202; &#47532;&#54252;&#53944; &#49373;&#49457;</div>'+
    '<div class="v15Btn" onclick="downloadReport()">&#128190; PNG &#45796;&#50868;&#47196;&#46300;</div>'+
    '<div class="v15Btn" onclick="copyReport()">&#128203; &#53364;&#47549;&#48372;&#46300;</div></div>';
  document.body.appendChild(p);
}
function generateReport(){
  var c=document.getElementById('reportCanvas');if(!c)return;
  var ctx=c.getContext('2d');var W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);
  var grd=ctx.createLinearGradient(0,0,W,H);
  grd.addColorStop(0,'#1a1020');grd.addColorStop(1,'#2a1535');
  ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,215,0,.3)';ctx.lineWidth=3;
  ctx.strokeRect(8,8,W-16,H-16);
  ctx.strokeStyle='rgba(255,215,0,.1)';ctx.lineWidth=1;
  ctx.strokeRect(14,14,W-28,H-28);
  ctx.fillStyle='#ffd700';ctx.font='bold 20px sans-serif';ctx.textAlign='center';
  ctx.fillText('Violin Real Practice Report',W/2,45);
  ctx.font='11px sans-serif';ctx.fillStyle='rgba(255,215,0,.5)';
  ctx.fillText(new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'}),W/2,65);
  var prog=loadProgress();
  var achs=loadAchievements();
  var achCount=Object.keys(achs).length;
  var metrics=[
    {label:'&#52509; &#50629;&#51201;',value:achCount+'&#44060;',color:'#ffd700'},
    {label:'&#52488;&#44204; &#46972;&#50868;&#46300;',value:(prog.sight_rounds||0)+'&#54924;',color:'#ff6644'},
    {label:'&#53668; &#48516;&#49437;',value:(prog.tone_sessions||0)+'&#54924;',color:'#4caf50'},
    {label:'&#54876; &#48516;&#48176;',value:(prog.bowdist_sessions||0)+'&#54924;',color:'#2196f3'},
    {label:'&#54840;&#55137; &#50672;&#49845;',value:(prog.anxiety_sessions||0)+'&#54924;',color:'#e91e63'},
    {label:'&#48176;&#53952; &#49849;&#47532;',value:(prog.battle_wins||0)+'/'+(prog.battle_total||0),color:'#9c27b0'}
  ];
  var startY=95,colW=W/3;
  metrics.forEach(function(m,i){
    var col=i%3,row=Math.floor(i/3);
    var x=30+col*colW,y=startY+row*55;
    ctx.fillStyle='rgba(255,250,235,.04)';
    ctx.fillRect(x,y,colW-20,45);
    ctx.strokeStyle='rgba(255,215,0,.1)';ctx.strokeRect(x,y,colW-20,45);
    ctx.fillStyle=m.color;ctx.font='bold 18px sans-serif';ctx.textAlign='center';
    ctx.fillText(m.value,x+(colW-20)/2,y+22);
    ctx.fillStyle='rgba(240,230,200,.6)';ctx.font='9px sans-serif';
    ctx.fillText(m.label,x+(colW-20)/2,y+38);
  });
  var masteryDone=MASTERY_NODES.filter(function(n){return prog['mastery_'+n.id];}).length;
  ctx.fillStyle='rgba(255,250,235,.04)';ctx.fillRect(30,215,W-60,35);
  ctx.strokeStyle='rgba(255,215,0,.1)';ctx.strokeRect(30,215,W-60,35);
  ctx.fillStyle='#ffd700';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText('&#44592;&#48277; &#47560;&#49828;&#53552;&#47532;: '+masteryDone+'/'+MASTERY_NODES.length,40,237);
  var barW=W-200,barH=10,barX=170,barY=228;
  ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(barX,barY,barW,barH);
  ctx.fillStyle='rgba(255,215,0,.4)';ctx.fillRect(barX,barY,barW*masteryDone/MASTERY_NODES.length,barH);
  var radarCx=W/2,radarCy=340,radarR=80;
  var radarLabels=['&#52488;&#44204;','&#53668;','&#48372;&#51081;','&#47704;&#53560;','&#48176;&#53952;','&#47560;&#49828;&#53552;&#47532;'];
  var radarVals=[
    Math.min((prog.sight_rounds||0)*10,100),
    Math.min((prog.tone_sessions||0)*20,100),
    Math.min((prog.bowdist_sessions||0)*15,100),
    Math.min((prog.anxiety_sessions||0)*20,100),
    Math.min((prog.battle_wins||0)*20,100),
    Math.min(masteryDone/MASTERY_NODES.length*100,100)
  ];
  for(var ring=1;ring<=5;ring++){
    ctx.beginPath();ctx.strokeStyle='rgba(255,215,0,'+(ring===5?.12:.05)+')';
    for(var i=0;i<=6;i++){
      var angle=Math.PI*2*i/6-Math.PI/2;
      var x=radarCx+Math.cos(angle)*radarR*ring/5;
      var y=radarCy+Math.sin(angle)*radarR*ring/5;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.beginPath();ctx.fillStyle='rgba(255,215,0,.1)';ctx.strokeStyle='rgba(255,215,0,.5)';ctx.lineWidth=2;
  for(var i=0;i<=6;i++){
    var idx=i%6;var val=radarVals[idx]/100;
    var angle=Math.PI*2*idx/6-Math.PI/2;
    var x=radarCx+Math.cos(angle)*radarR*val;var y=radarCy+Math.sin(angle)*radarR*val;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.fill();ctx.stroke();
  for(var i=0;i<6;i++){
    var angle=Math.PI*2*i/6-Math.PI/2;
    var lx=radarCx+Math.cos(angle)*(radarR+16);var ly=radarCy+Math.sin(angle)*(radarR+16);
    ctx.fillStyle='rgba(255,215,0,.6)';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText(radarLabels[i],lx,ly);
  }
  var totalScore=Math.round(radarVals.reduce(function(a,b){return a+b;},0)/6);
  var grade=totalScore>=90?'S':totalScore>=75?'A':totalScore>=60?'B':totalScore>=40?'C':'D';
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText(totalScore+'&#51216; ('+grade+')',radarCx,radarCy+2);
  ctx.fillStyle='rgba(255,215,0,.3)';ctx.font='9px sans-serif';
  ctx.fillText('Violin Real v15 | Practice Report',W/2,H-12);
  v15Sfx('report_gen');
  var prog2=loadProgress();prog2.report_gen=(prog2.report_gen||0)+1;saveProgress(prog2);
  if((prog2.report_gen||0)>=1)unlockAch('report_first');
  addHistory('report','&#50672;&#49845; &#47532;&#54252;&#53944; &#49373;&#49457;');
}
function downloadReport(){
  var c=document.getElementById('reportCanvas');if(!c)return;
  try{var a=document.createElement('a');a.download='violin-report-'+new Date().toISOString().slice(0,10)+'.png';a.href=c.toDataURL('image/png');a.click();}catch(e){}
}
function copyReport(){
  var c=document.getElementById('reportCanvas');if(!c)return;
  try{c.toBlob(function(b){if(b)navigator.clipboard.write([new ClipboardItem({'image/png':b})]);});}catch(e){}
}
window.generateReport=generateReport;window.downloadReport=downloadReport;window.copyReport=copyReport;

/* ─── 10. DUET PART SEPARATION PRACTICE (&#46272;&#50659; &#54028;&#53944; &#48516;&#47532; &#50672;&#49845;) ─── */
var DUET_PIECES=[
  {name:'&#52852;&#45436; (&#54028;&#54764;&#48296;)',part1:[{n:'D4',d:500},{n:'F#4',d:500},{n:'A4',d:500},{n:'D5',d:500}],part2:[{n:'D3',d:1000},{n:'A3',d:1000}]},
  {name:'&#50500;&#48288;&#47560;&#47532;&#50500; (&#44396;&#45432;)',part1:[{n:'C5',d:600},{n:'E5',d:400},{n:'G5',d:600}],part2:[{n:'C4',d:800},{n:'E4',d:800}]},
  {name:'G&#49440;&#50500;&#47532;&#50500; (&#48148;&#54840;)',part1:[{n:'D5',d:700},{n:'B4',d:300},{n:'A4',d:500}],part2:[{n:'G3',d:750},{n:'D4',d:750}]},
  {name:'&#50976;&#47784;&#47112;&#49828;&#53356; (&#46300;&#48372;&#47476;&#51089;)',part1:[{n:'A5',d:200},{n:'G5',d:200},{n:'F#5',d:200},{n:'G5',d:400}],part2:[{n:'D4',d:400},{n:'A4',d:400}]},
  {name:'&#49324;&#46993;&#51032;&#51064;&#49324; (&#50648;&#44032;)',part1:[{n:'E5',d:500},{n:'D5',d:300},{n:'C5',d:500}],part2:[{n:'C4',d:650},{n:'G4',d:650}]},
  {name:'&#48393;&#45216;(&#48708;&#48156;&#46356;)',part1:[{n:'E5',d:150},{n:'F#5',d:150},{n:'G5',d:200},{n:'A5',d:300}],part2:[{n:'E4',d:400},{n:'B4',d:400}]}
];
var duetIdx=0,duetPlaying=false;
function createDuetPanel(){
  var p=document.createElement('div');p.id='duetPanel';
  p.innerHTML='<div class="v15Close" onclick="stopDuet();document.getElementById(\'duetPanel\').classList.remove(\'show\')">&times;</div>'+
    '<h3>&#127930; &#46272;&#50659; &#54028;&#53944; &#48516;&#47532; &#50672;&#49845;</h3>'+
    '<canvas id="duetCanvas" width="520" height="300"></canvas>'+
    '<div class="v15Info" id="duetInfo">&#44257;&#51012; &#49440;&#53469;&#54616;&#44256; &#44033; &#54028;&#53944;&#47484; &#46308;&#50612;&#48372;&#49464;&#50836;</div>'+
    '<div id="duetList" style="display:flex;flex-wrap:wrap;gap:4px;max-width:420px;justify-content:center;margin:6px 0"></div>'+
    '<div style="display:flex;gap:8px;margin:6px 0">'+
    '<div class="v15Btn" onclick="playDuetPart(1)">&#127925; Part 1 &#51116;&#49373;</div>'+
    '<div class="v15Btn" onclick="playDuetPart(2)">&#127926; Part 2 &#51116;&#49373;</div>'+
    '<div class="v15Btn" onclick="playDuetBoth()">&#127932; &#54632;&#44760; &#51116;&#49373;</div>'+
    '<div class="v15Btn" onclick="stopDuet()">&#9724; &#51473;&#51648;</div></div>';
  document.body.appendChild(p);
  var list=document.getElementById('duetList');
  DUET_PIECES.forEach(function(piece,i){
    var b=document.createElement('div');b.className='v15Btn'+(i===0?' active':'');
    b.textContent=piece.name;
    b.onclick=function(){duetIdx=i;list.querySelectorAll('.v15Btn').forEach(function(x,j){x.className='v15Btn'+(j===i?' active':'');});drawDuetCanvas();};
    list.appendChild(b);
  });
}
function drawDuetCanvas(){
  var c=document.getElementById('duetCanvas');if(!c)return;
  var ctx=c.getContext('2d');var W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var piece=DUET_PIECES[duetIdx];
  ctx.fillStyle='#ffd700';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText(piece.name,W/2,25);
  ctx.font='10px sans-serif';ctx.fillStyle='rgba(255,215,0,.5)';
  ctx.fillText('Duet Practice',W/2,42);
  var staffY1=70,staffY2=180,lineGap=10;
  ctx.fillStyle='#ff6644';ctx.font='10px sans-serif';ctx.textAlign='left';
  ctx.fillText('Part 1 (Violin I)',10,staffY1-10);
  ctx.fillStyle='#4caf50';ctx.fillText('Part 2 (Violin II)',10,staffY2-10);
  for(var s=0;s<2;s++){
    var sy=s===0?staffY1:staffY2;
    ctx.strokeStyle='rgba(255,215,0,'+(s===0?.25:.2)+')';ctx.lineWidth=1;
    for(var i=0;i<5;i++){ctx.beginPath();ctx.moveTo(30,sy+i*lineGap);ctx.lineTo(W-20,sy+i*lineGap);ctx.stroke();}
    ctx.fillStyle=s===0?'rgba(255,102,68,.6)':'rgba(76,175,80,.6)';
    ctx.font='24px serif';ctx.fillText('𝄞',8,sy+3.5*lineGap);
    var notes=s===0?piece.part1:piece.part2;
    var startX=60;
    notes.forEach(function(note,ni){
      var pos=NOTE_POS[note.n]||5;
      var x=startX+ni*55;
      var y=sy+(pos*lineGap/2);
      ctx.fillStyle=s===0?'rgba(255,102,68,.8)':'rgba(76,175,80,.8)';
      ctx.beginPath();ctx.ellipse(x+5,y,6,4.5,-.3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='8px sans-serif';ctx.textAlign='center';
      ctx.fillText(note.n,x+5,y+16);
    });
  }
}
var duetTimeouts=[];
function playDuetPart(partNum){
  stopDuet();
  var piece=DUET_PIECES[duetIdx];
  var notes=partNum===1?piece.part1:piece.part2;
  var time=0;
  notes.forEach(function(note){
    duetTimeouts.push(setTimeout(function(){playNoteFreq(NOTE_FREQ[note.n]||440);},time));
    time+=note.d;
  });
  v15Sfx('duet_sync');
  var prog=loadProgress();prog.duet_plays=(prog.duet_plays||0)+1;saveProgress(prog);
  if((prog.duet_plays||0)>=3)unlockAch('duet_student');
  addHistory('duet','&#46272;&#50659; Part'+partNum+' &#51116;&#49373;: '+piece.name);
}
function playDuetBoth(){
  stopDuet();
  var piece=DUET_PIECES[duetIdx];
  [piece.part1,piece.part2].forEach(function(notes){
    var time=0;
    notes.forEach(function(note){
      duetTimeouts.push(setTimeout(function(){playNoteFreq(NOTE_FREQ[note.n]||440);},time));
      time+=note.d;
    });
  });
  v15Sfx('duet_sync');
  var prog=loadProgress();prog.duet_both=(prog.duet_both||0)+1;saveProgress(prog);
  if((prog.duet_both||0)>=6)unlockAch('duet_master');
}
function stopDuet(){duetTimeouts.forEach(clearTimeout);duetTimeouts=[];duetPlaying=false;}
window.playDuetPart=playDuetPart;window.playDuetBoth=playDuetBoth;window.stopDuet=stopDuet;

/* ─── 11. QUIZ v15 (15&#47928; &#52628;&#44032;: 75&#8594;90) ─── */
var QUIZ_V15=[
  {q:'&#52488;&#44204;(Sight-Reading)&#51012; &#51096;&#54616;&#47140;&#47732; &#44032;&#51109; &#51473;&#50836;&#54620; &#45733;&#47141;&#51008;?',a:['&#48736;&#47480; &#49552;&#44032;&#46973;','&#50501;&#48372; &#51069;&#44592; &#45733;&#47141;','&#53360; &#49548;&#47532;','&#48736;&#47480; &#54876;&#51656;'],c:1},
  {q:'&#48148;&#51060;&#50732;&#47536;&#51032; &#53668; &#54408;&#51656;&#50640; &#44032;&#51109; &#53360; &#50689;&#54693;&#51012; &#48120;&#52824;&#45716; &#50836;&#49548;&#45716;?',a:['&#54788;&#51032; &#51116;&#51656;','&#48372;&#51081; &#49549;&#46020;&#50752; &#50517;&#47141;','&#48148;&#51060;&#50732;&#47536; &#44032;&#44201;','&#50672;&#51452;&#51088;&#51032; &#53412;'],c:1},
  {q:'&#54876;&#51032; Tip(&#45149;) &#48512;&#48516;&#51004;&#47196; &#50672;&#51452;&#54616;&#47732; &#50612;&#46500; &#49548;&#47532;&#44032; &#45208;&#45716;&#44032;?',a:['&#44053;&#54616;&#44256; &#47924;&#44144;&#50868; &#49548;&#47532;','&#44032;&#48317;&#44256; &#49452;&#49464;&#54620; &#49548;&#47532;','&#46560;&#47533;&#54616;&#44256; &#51200;&#51020;&#51060; &#47566;&#51008;','&#51200;&#51020;&#51060; &#47566;&#44256; &#48520;&#50504;&#51221;&#54620;'],c:1},
  {q:'4-7-8 &#54840;&#55137;&#48277;&#50640;&#49436; \'7\'&#51008; &#47924;&#50631;&#51012; &#51032;&#48120;&#54616;&#45716;&#44032;?',a:['7&#52488; &#46308;&#49772;&#44592;','7&#52488; &#52280;&#44592;','7&#52488; &#45236;&#49772;&#44592;','7&#48264; &#48152;&#48373;'],c:1},
  {q:'&#45908;&#48660;&#49828;&#53457;(Double Stop)&#51060;&#46976;?',a:['2&#54788;&#51012; &#46041;&#49884;&#50640; &#50672;&#51452;','&#48736;&#47476;&#44172; &#47704;&#52628;&#44592;','&#48372;&#51081;&#51012; &#47704;&#52628;&#44592;','&#54588;&#52824;&#52852;&#53664; 2&#48264;'],c:0},
  {q:'&#54616;&#47784;&#45769;&#49828;(Harmonics)&#47484; &#45236;&#47140;&#47732; &#54788;&#51012; &#50612;&#46523;&#44172; &#45572;&#47476;&#45716;&#44032;?',a:['&#44053;&#54616;&#44172; &#45572;&#47476;&#44592;','&#44032;&#48317;&#44172; &#51217;&#52489;','&#54588;&#52824;&#52852;&#53664;','&#46832;&#47140;&#49436;'],c:1},
  {q:'&#52852;&#45940;&#52264;(Cadenza)&#45716; &#51452;&#47196; &#50612;&#46356;&#50640;&#49436; &#50672;&#51452;&#46104;&#45716;&#44032;?',a:['&#44257; &#52376;&#51020;','&#44257; &#51473;&#44036;','&#54801;&#51452;&#44257;&#51032; &#46021;&#51452; &#44396;&#44036;','&#50521;&#53076;&#47476;'],c:2},
  {q:'&#48708;&#47476;&#53804;&#50724;&#49548;(Virtuoso)&#51032; &#46907;&#51008;?',a:['&#52488;&#48372;&#51088;','&#44144;&#51109; &#50672;&#51452;&#51088;','&#51089;&#44257;&#44032;','&#51648;&#55064;&#51088;'],c:1},
  {q:'&#46272;&#50659; &#50672;&#51452;&#49884; &#44032;&#51109; &#51473;&#50836;&#54620; &#44163;&#51008;?',a:['&#48736;&#47480; &#49549;&#46020;','&#54028;&#53944;&#45320; &#50672;&#51452;&#51088;&#50752;&#51032; &#50521;&#49345;&#48660;','&#53360; &#49548;&#47532;','&#54844;&#51088; &#46160;&#46300;&#47084;&#51648;&#44172; &#50672;&#51452;'],c:1},
  {q:'&#49696;&#54256;&#54000;&#52384;&#47196;(Sul Ponticello)&#45716; &#50612;&#46356;&#50640;&#49436; &#50672;&#51452;&#54616;&#45716;&#44032;?',a:['&#51648;&#54032; &#50948;','&#48652;&#47551;&#51648; &#44540;&#52376;','&#47551;&#46321; &#44540;&#52376;','&#54788; &#44032;&#50868;&#45936;'],c:1},
  {q:'&#53084;&#47112;&#45776;(Col Legno)&#50672;&#51452;&#48277;&#51008;?',a:['&#54876;&#53560;&#47196; &#54788;&#51012; &#53412;&#44592;','&#54876;&#45824;&#47196; &#54788;&#51012; &#52824;&#44592;','&#49552;&#44032;&#46973;&#51004;&#47196; &#53916;&#44592;&#44592;','&#54876;&#51012; &#46244;&#51665;&#50612; &#50672;&#51452;'],c:1},
  {q:'&#47532;&#53076;&#49744;(Ricochet)&#50672;&#51452;&#48277;&#51008;?',a:['&#54876;&#51012; &#50672;&#49549; &#48148;&#50868;&#49828;','&#54876;&#51012; &#45712;&#47532;&#44172; &#44536;&#44592;','&#54876;&#51012; &#48736;&#47476;&#44172; &#50572;&#48373;','&#54876;&#51012; &#54924;&#51204;'],c:0},
  {q:'&#50672;&#49845; &#47532;&#54252;&#53944;&#50640;&#49436; &#44032;&#51109; &#51473;&#50836;&#54616;&#44172; &#54869;&#51064;&#54644;&#50556; &#54624; &#51648;&#54364;&#45716;?',a:['&#50672;&#49845; &#49884;&#44036;','&#47785;&#54364; &#45804;&#49457;&#47456;','&#50672;&#51452; &#49549;&#46020;','&#50629;&#51201; &#49688;'],c:1},
  {q:'&#48372;&#51081; &#48516;&#48176;&#50640;&#49436; &#51060;&#49345;&#51201;&#51064; &#51473;&#44036;(Middle) &#49324;&#50857; &#48708;&#50984;&#51008;?',a:['20%','30%','40%','50%'],c:2},
  {q:'&#47924;&#45824; &#44277;&#54252;&#51613; &#44537;&#48373;&#50640; &#44032;&#51109; &#54952;&#44284;&#51201;&#51064; &#48169;&#48277;&#51008;?',a:['&#54872;&#54616;&#44172; &#54588;&#54616;&#44592;','&#44592;&#46020;&#54616;&#44592;','&#54840;&#55137; &#51312;&#51208;+&#49884;&#44033;&#54868;','&#50557; &#48373;&#50857;'],c:2}
];
var quizV15Idx=0,quizV15Score=0,quizV15Total=0;
function createQuizV15Panel(){
  var p=document.createElement('div');p.id='quizV15Panel';
  p.innerHTML='<div class="v15Close" onclick="document.getElementById(\'quizV15Panel\').classList.remove(\'show\')">&times;</div>'+
    '<h3>&#10067; &#54140;&#51592; v15</h3>'+
    '<div id="quizV15Area" class="v15Info" style="max-width:420px;min-height:200px"></div>'+
    '<div class="v15Btn" id="quizV15StartBtn" onclick="startQuizV15()">&#9654; &#54140;&#51592; &#49884;&#51089;</div>';
  document.body.appendChild(p);
}
function startQuizV15(){
  quizV15Idx=0;quizV15Score=0;quizV15Total=QUIZ_V15.length;
  document.getElementById('quizV15StartBtn').style.display='none';
  showQuizV15();v15Sfx('quiz_v15');
}
function showQuizV15(){
  if(quizV15Idx>=QUIZ_V15.length){
    var pct=Math.round(quizV15Score/quizV15Total*100);
    var grade=pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';
    document.getElementById('quizV15Area').innerHTML='<div style="text-align:center">'+
      '<div style="font-size:18px;margin:10px 0">'+quizV15Score+'/'+quizV15Total+' ('+pct+'%)</div>'+
      '<div style="font-size:14px">'+grade+' &#46321;&#44553;</div></div>';
    document.getElementById('quizV15StartBtn').style.display='';
    if(pct>=80)unlockAch('quiz_v15_ace');
    addHistory('quiz','v15 &#54140;&#51592; &#50756;&#47308; ('+pct+'%)');
    return;
  }
  var q=QUIZ_V15[quizV15Idx];
  var html='<div style="margin-bottom:8px;font-size:11px;color:#888">'+(quizV15Idx+1)+'/'+quizV15Total+'</div>'+
    '<div style="margin:8px 0;font-size:12px;color:#ffd700">'+q.q+'</div>';
  q.a.forEach(function(ans,i){
    html+='<div class="v15Card" onclick="answerQuizV15('+i+','+q.c+')">'+ans+'</div>';
  });
  document.getElementById('quizV15Area').innerHTML=html;
}
function answerQuizV15(sel,correct){
  if(sel===correct){quizV15Score++;v15Sfx('sight_correct');}
  else{v15Sfx('sight_wrong');}
  quizV15Idx++;
  setTimeout(showQuizV15,600);
}
window.startQuizV15=startQuizV15;window.answerQuizV15=answerQuizV15;

/* ─── 12. NEW SONGS (10&#44257; &#52628;&#44032;: 114&#8594;124) ─── */
(function addSongs(){
  if(typeof window.SONG_DATA==='undefined')return;
  var newSongs=[
    {title:'&#53448;&#47532;&#49828;&#51032; &#51333;',artist:'&#46972;&#48296;',difficulty:3,notes:[[0,'C5',500],[600,'E5',400],[1100,'G5',500],[1700,'C6',400],[2200,'B5',500],[2800,'G5',400],[3300,'E5',600]]},
    {title:'&#50508;&#54632;&#48652;&#46972;(&#48373;&#49828; 3&#48264;)',artist:'&#48652;&#46972;&#50516;&#49828;',difficulty:4,notes:[[0,'Bb4',600],[700,'D5',400],[1200,'F5',500],[1800,'Bb5',300],[2200,'A5',400],[2700,'F5',400],[3200,'D5',600]]},
    {title:'&#49324;&#46993;&#51032; &#48372;&#49437;',artist:'&#47532;&#49828;&#53944;',difficulty:3,notes:[[0,'F4',500],[600,'A4',300],[1000,'C5',500],[1600,'F5',300],[2000,'E5',400],[2500,'C5',300],[2900,'A4',600]]},
    {title:'&#44148;&#48152; &#49436;&#44257;',artist:'&#50648;&#44032;',difficulty:3,notes:[[0,'D4',700],[800,'E4',300],[1200,'F#4',600],[1900,'A4',400],[2400,'D5',500],[3000,'C#5',300],[3400,'A4',600]]},
    {title:'&#52264;&#47476;&#45796;&#49884; 2&#48264;',artist:'&#47788;&#54000;',difficulty:5,notes:[[0,'D5',200],[250,'E5',200],[500,'F#5',200],[750,'G5',200],[1000,'A5',150],[1200,'B5',150],[1400,'A5',200],[1700,'G5',300]]},
    {title:'&#53441;&#48148;&#51060;&#50732;&#47536; &#49548;&#45208;&#53440;',artist:'&#48708;&#48156;&#46356;',difficulty:4,notes:[[0,'A4',400],[500,'C#5',300],[900,'E5',400],[1400,'A5',300],[1800,'G#5',300],[2200,'E5',300],[2600,'C#5',500]]},
    {title:'&#47564;&#47588; &#50672;&#44032;',artist:'&#46300;&#48372;&#47476;&#51089;',difficulty:3,notes:[[0,'F5',500],[600,'E5',300],[1000,'D5',500],[1600,'C5',300],[2000,'D5',500],[2600,'E5',300],[3000,'F5',600]]},
    {title:'&#54840;&#47112;&#51060;(&#52852;&#47476;&#47704;)',artist:'&#48708;&#51228;',difficulty:4,notes:[[0,'D5',400],[500,'C5',200],[800,'Bb4',400],[1300,'A4',300],[1700,'Bb4',300],[2100,'C5',300],[2500,'D5',500]]},
    {title:'&#48120;&#45684;&#50648; Op.14',artist:'&#54252;&#47112;',difficulty:3,notes:[[0,'A4',600],[700,'B4',300],[1100,'C5',600],[1800,'D5',300],[2200,'E5',500],[2800,'D5',300],[3200,'C5',600]]},
    {title:'&#52392;&#44032;&#47532;(&#52264;&#51060;&#53076;&#54532;&#49828;&#53412;)',artist:'&#52264;&#51060;&#53076;&#54532;&#49828;&#53412;',difficulty:5,notes:[[0,'B4',200],[250,'C#5',200],[500,'D5',150],[700,'E5',200],[950,'F#5',150],[1150,'G5',200],[1400,'A5',200],[1700,'B5',300]]}
  ];
  newSongs.forEach(function(s){
    var exists=window.SONG_DATA.some(function(ex){return ex.title===s.title;});
    if(!exists)window.SONG_DATA.push(s);
  });
})();

/* ─── 13. NEW LESSONS (10&#47112;&#49832; &#52628;&#44032;: 140&#8594;150) ─── */
(function addLessons(){
  if(typeof window.LESSON_DATA==='undefined')return;
  var newLessons=[
    {id:'sight_intro',title:'&#52488;&#44204; &#50672;&#49845; &#51077;&#47928;',desc:'&#50724;&#49440;&#48372; &#50948;&#51032; &#51020;&#54364;&#47484; &#48736;&#47476;&#44172; &#51069;&#44592;',level:3},
    {id:'sight_rhythm',title:'&#52488;&#44204; &#47532;&#46316; &#50672;&#49845;',desc:'&#45796;&#50577;&#54620; &#48149;&#51088;&#54056;&#53556; &#51069;&#44592;',level:5},
    {id:'tone_clarity',title:'&#53668; &#47749;&#47308;&#46020; &#54693;&#49345;',desc:'&#47569;&#44256; &#44648;&#45143;&#54620; &#51020;&#49353; &#47564;&#46308;&#44592;',level:5},
    {id:'tone_warmth',title:'&#46384;&#46907;&#54620; &#53668; &#50672;&#49845;',desc:'&#48708;&#48652;&#46972;&#53664;+&#48372;&#51081;&#50517;&#47141;&#47196; &#50728;&#44592; &#52628;&#44032;',level:6},
    {id:'bow_dist_tip',title:'&#54876; &#45149;(Tip) &#50672;&#49845;',desc:'&#44032;&#48317;&#44256; &#49452;&#49464;&#54620; &#54532;&#47112;&#51060;&#51669;',level:4},
    {id:'bow_dist_frog',title:'&#54876; &#47551;&#46321;(Frog) &#50672;&#49845;',desc:'&#44053;&#54616;&#44256; &#47924;&#44144;&#50868; &#49548;&#47532; &#50672;&#49845;',level:4},
    {id:'anxiety_breath',title:'&#50672;&#51452; &#51204; &#54840;&#55137; &#50672;&#49845;',desc:'4-7-8 &#54840;&#55137;&#51004;&#47196; &#44596;&#51109; &#50756;&#54868;',level:2},
    {id:'duet_canon',title:'&#52852;&#45436; &#46272;&#50659; &#50672;&#49845;',desc:'&#54028;&#54764;&#48296; &#52852;&#45436; Part 1 &#50672;&#49845;',level:4},
    {id:'mastery_bow',title:'&#48372;&#51081; &#44592;&#48277; &#53685;&#54633;',desc:'&#45936;&#53440;&#49744;/&#49828;&#54588;&#52852;&#53664;/&#47560;&#47476;&#53588;&#47112; &#50672;&#44208;',level:7},
    {id:'v15_grad',title:'v15 &#51320;&#50629;',desc:'v15 &#47784;&#46304; &#44592;&#45733; &#52404;&#54744; &#50756;&#47308;',level:9}
  ];
  newLessons.forEach(function(l){
    var exists=window.LESSON_DATA.some(function(ex){return ex.id===l.id;});
    if(!exists)window.LESSON_DATA.push(l);
  });
})();

/* ─── 14. ACHIEVEMENTS (12&#44060; &#52628;&#44032;: 118&#8594;130) ─── */
var V15_ACHS=[
  {id:'sight_student',icon:'&#127932;',name:'&#52488;&#44204; &#51077;&#47928;',desc:'&#52488;&#44204; &#50672;&#49845; 3&#46972;&#50868;&#46300; &#50756;&#47308;'},
  {id:'sight_ace',icon:'&#127942;',name:'&#52488;&#44204; &#50640;&#51060;&#49828;',desc:'90% &#51060;&#49345; &#51221;&#45813;&#47456;'},
  {id:'sight_master',icon:'&#127775;',name:'&#52488;&#44204; &#47560;&#49828;&#53552;',desc:'8&#45800;&#44228;&#50640;&#49436; 80%+ &#45804;&#49457;'},
  {id:'tone_student',icon:'&#127926;',name:'&#53668; &#48516;&#49437; &#51077;&#47928;',desc:'&#53668; &#48516;&#49437; 3&#54924; &#49688;&#54665;'},
  {id:'tone_golden',icon:'&#129351;',name:'&#44404;&#46304; &#53668;',desc:'&#54217;&#44512; 85&#51216; &#51060;&#49345; &#45804;&#49457;'},
  {id:'bow_dist_tracker',icon:'&#127931;',name:'&#54876; &#48516;&#48176; &#52628;&#51201;&#44032;',desc:'&#54876; &#48516;&#48176; 5&#54924; &#44592;&#47197;'},
  {id:'anxiety_manager',icon:'&#128150;',name:'&#44596;&#51109; &#44288;&#47532;&#51088;',desc:'&#54840;&#55137; &#50672;&#49845; 3&#49464;&#49496; &#50756;&#47308;'},
  {id:'anxiety_master',icon:'&#128171;',name:'&#47560;&#51020; &#47560;&#49828;&#53552;',desc:'10&#49324;&#51060;&#53364; &#54840;&#55137; &#50756;&#47308;'},
  {id:'battle_winner',icon:'&#9876;',name:'&#48176;&#53952; &#49849;&#47532;&#51088;',desc:'&#54140;&#51592; &#48176;&#53952;&#50640;&#49436; &#49849;&#47532;'},
  {id:'battle_champion',icon:'&#127941;',name:'&#48176;&#53952; &#52308;&#54588;&#50616;',desc:'&#44144;&#51109; &#54028;&#44032;&#45768;&#45768;&#47484; &#44201;&#54028;'},
  {id:'mastery_first',icon:'&#127795;',name:'&#52395; &#47560;&#49828;&#53552;&#47532;',desc:'&#44592;&#48277; &#53944;&#47532; &#52395; &#45432;&#46300; &#54644;&#44552;'},
  {id:'mastery_virtuoso',icon:'&#127775;',name:'&#48708;&#47476;&#53804;&#50724;&#49548;',desc:'18&#44060; &#44592;&#48277; &#51204;&#48512; &#47560;&#49828;&#53552;'},
  {id:'report_first',icon:'&#128202;',name:'&#47532;&#54252;&#53944; &#49373;&#49457;',desc:'&#50672;&#49845; &#47532;&#54252;&#53944; &#52395; &#49373;&#49457;'},
  {id:'duet_student',icon:'&#127930;',name:'&#46272;&#50659; &#51077;&#47928;',desc:'&#46272;&#50659; &#54028;&#53944; 3&#54924; &#51116;&#49373;'},
  {id:'duet_master',icon:'&#129351;',name:'&#46272;&#50659; &#47560;&#49828;&#53552;',desc:'&#54632;&#44760; &#51116;&#49373; 6&#54924; &#50756;&#47308;'},
  {id:'quiz_v15_ace',icon:'&#128175;',name:'&#54140;&#51592; v15 &#50640;&#51060;&#49828;',desc:'80% &#51060;&#49345; &#51221;&#45813;'}
];

/* ─── 15. UI INTEGRATION ─── */
(function integrateUI(){
  createSightPanel();createTonePanel();createBowDistPanel();createAnxietyPanel();
  createBattlePanel();createMasteryPanel();createReportPanel();createDuetPanel();createQuizV15Panel();
  drawSightCanvas();drawToneCanvas();drawBowDistCanvas();drawAnxietyCanvas();
  drawMasteryCanvas();drawDuetCanvas();

  var openSight=function(){drawSightCanvas();document.getElementById('sightPanel').classList.add('show');v15Sfx('feature_open15');};
  var openTone=function(){drawToneCanvas();document.getElementById('tonePanel').classList.add('show');v15Sfx('feature_open15');};
  var openBowDist=function(){drawBowDistCanvas();document.getElementById('bowDistPanel').classList.add('show');v15Sfx('feature_open15');};
  var openAnxiety=function(){drawAnxietyCanvas();document.getElementById('anxietyPanel').classList.add('show');v15Sfx('feature_open15');};
  var openBattle=function(){document.getElementById('battlePanel').classList.add('show');v15Sfx('feature_open15');};
  var openMastery=function(){drawMasteryCanvas();document.getElementById('masteryPanel').classList.add('show');v15Sfx('feature_open15');};
  var openReport=function(){document.getElementById('reportPanel').classList.add('show');v15Sfx('feature_open15');};
  var openDuet=function(){drawDuetCanvas();document.getElementById('duetPanel').classList.add('show');v15Sfx('feature_open15');};
  var openQuiz=function(){document.getElementById('quizV15Panel').classList.add('show');v15Sfx('feature_open15');};

  var nav=document.createElement('div');nav.className='v15Nav';
  var navItems=[
    {text:'&#127932; &#52488;&#44204;',action:openSight},
    {text:'&#127926; &#53668;&#48516;&#49437;',action:openTone},
    {text:'&#127931; &#54876;&#48516;&#48176;',action:openBowDist},
    {text:'&#128150; &#47924;&#45824;&#44277;&#54252;',action:openAnxiety},
    {text:'&#9876; &#54140;&#51592;&#48176;&#53952;',action:openBattle},
    {text:'&#127795; &#47560;&#49828;&#53552;&#47532;',action:openMastery},
    {text:'&#128202; &#47532;&#54252;&#53944;',action:openReport},
    {text:'&#127930; &#46272;&#50659;',action:openDuet},
    {text:'&#10067; &#54140;&#51592;v15',action:openQuiz}
  ];
  navItems.forEach(function(item){
    var btn=document.createElement('div');btn.className='v15NavBtn';btn.innerHTML=item.text;
    btn.addEventListener('pointerdown',function(e){e.preventDefault();item.action();});
    nav.appendChild(btn);
  });
  document.body.appendChild(nav);

  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    if(!e.shiftKey)return;
    switch(e.key){
      case'A':e.preventDefault();openSight();break;
      case'S':e.preventDefault();openTone();break;
      case'D':e.preventDefault();openBowDist();break;
      case'F':e.preventDefault();openAnxiety();break;
      case'G':e.preventDefault();openBattle();break;
      case'H':e.preventDefault();openMastery();break;
      case'J':e.preventDefault();openReport();break;
      case'K':e.preventDefault();openDuet();break;
    }
    if(e.key==='Escape'){
      stopSightReading();stopAnxiety();stopDuet();
      document.querySelectorAll('#sightPanel,#tonePanel,#bowDistPanel,#anxietyPanel,#battlePanel,#masteryPanel,#reportPanel,#duetPanel,#quizV15Panel').forEach(function(p){p.classList.remove('show');});
    }
  });

  var titleEl=document.querySelector('#hd h1');
  if(titleEl)titleEl.innerHTML='&#127931; Violin Real <span style="font-size:8px;color:#ff6644;vertical-align:super">v15</span>';
  var logoEl=document.getElementById('logo');if(logoEl)logoEl.textContent='Violin Real v15';
})();

window.VIOLIN_VERSION='15.0';
})();
