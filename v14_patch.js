/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v14.0 PATCH MODULE
   인터벌트레이닝Canvas12종+멜로딕딕테이션Canvas3난이도+
   보잉분석대시보드Canvas6축레이더+비브라토속도폭트레이너Canvas6프리셋+
   음정정확도히트맵Canvas지판그리드+연습저널100항목+
   곡난이도진행맵Canvas노드연결+합주시뮬레이터6종WebAudio+
   10곡추가(104→114)+10레슨(130→140)+15퀴즈(60→75)+
   12업적(106→118)+SFX12종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V14Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V14_LOADED)return;window.__V14_LOADED=true;

/* ─── HELPERS ─── */
function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(p){var old=loadProgress();Object.assign(old,p);localStorage.setItem('violinProgress',JSON.stringify(old));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function unlockAch(id){
  var achs=loadAchievements();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  var info=V14_ACHS.find(function(a){return a.id===id;});
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
var actx14=null;
function v14Sfx(type){
  try{
    if(!actx14)actx14=new(window.AudioContext||window.webkitAudioContext)();
    var o=actx14.createOscillator(),g=actx14.createGain();
    o.connect(g);g.connect(actx14.destination);
    var now=actx14.currentTime;
    var presets={
      interval_play:{f:523,w:'sine',a:.12,d:.4},
      interval_correct:{f:784,w:'triangle',a:.14,d:.35},
      interval_wrong:{f:220,w:'square',a:.06,d:.3},
      dictation_note:{f:440,w:'sine',a:.1,d:.3},
      bowing_radar:{f:392,w:'triangle',a:.08,d:.25},
      vibrato_wave:{f:330,w:'sine',a:.1,d:.5},
      pitch_heatmap:{f:587,w:'triangle',a:.07,d:.2},
      journal_save:{f:698,w:'sine',a:.1,d:.35},
      songmap_node:{f:494,w:'triangle',a:.08,d:.25},
      ensemble_start:{f:660,w:'sine',a:.14,d:.5},
      quiz_v14:{f:740,w:'square',a:.06,d:.2},
      feature_open14:{f:554,w:'triangle',a:.09,d:.25}
    };
    var p=presets[type]||presets.feature_open14;
    o.type=p.w;o.frequency.setValueAtTime(p.f,now);
    g.gain.setValueAtTime(p.a,now);g.gain.exponentialRampToValueAtTime(.001,now+p.d);
    o.start(now);o.stop(now+p.d);
  }catch(e){}
}

/* ─── 2. CSS INJECTION ─── */
var sty14=document.createElement('style');
sty14.textContent=`
#intervalPanel,#dictPanel,#bowPanel,#vibPanel,#pitchPanel,#journalPanel,#songmapPanel,#ensemblePanel,#quizV14Panel{
  display:none;position:fixed;inset:0;z-index:225;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#intervalPanel.show,#dictPanel.show,#bowPanel.show,#vibPanel.show,#pitchPanel.show,
#journalPanel.show,#songmapPanel.show,#ensemblePanel.show,#quizV14Panel.show{display:flex;}
#intervalPanel h3,#dictPanel h3,#bowPanel h3,#vibPanel h3,#pitchPanel h3,
#journalPanel h3,#songmapPanel h3,#ensemblePanel h3,#quizV14Panel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#intervalCanvas,#dictCanvas,#bowCanvas,#vibCanvas,#pitchCanvas,#songmapCanvas{
  border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.v14Info{width:100%;max-width:420px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;font-size:10px;color:rgba(240,230,200,.7);line-height:1.6;}
.v14Card{width:100%;max-width:400px;padding:10px 12px;margin:4px 0;
  background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.12);
  border-radius:8px;font-size:11px;color:rgba(240,230,200,.8);cursor:pointer;
  transition:background .2s,border-color .2s;}
.v14Card:hover{background:rgba(255,215,0,.08);border-color:rgba(255,215,0,.3);}
.v14Card.done{border-color:rgba(76,175,80,.4);background:rgba(76,175,80,.06);}
.v14Btn{display:inline-block;padding:6px 14px;margin:4px;border-radius:6px;
  background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.25);
  color:#ffd700;font-size:10px;cursor:pointer;transition:background .2s;}
.v14Btn:hover{background:rgba(255,215,0,.22);}
.v14Btn.active{background:rgba(255,215,0,.3);border-color:#ffd700;}
.v14Close{position:sticky;top:0;align-self:flex-end;font-size:18px;cursor:pointer;
  color:#888;z-index:10;padding:4px 8px;}
.v14Close:hover{color:#ffd700;}
.v14Nav{position:fixed;bottom:0;left:0;right:0;z-index:226;background:rgba(26,16,32,.95);
  border-top:1px solid rgba(255,215,0,.1);display:flex;overflow-x:auto;
  padding:6px 8px;gap:6px;-webkit-overflow-scrolling:touch;}
.v14NavBtn{flex:0 0 auto;padding:5px 10px;border-radius:12px;font-size:10px;
  background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.15);
  color:#c9a96e;white-space:nowrap;cursor:pointer;transition:all .2s;}
.v14NavBtn:hover{background:rgba(255,215,0,.2);color:#ffd700;}
.v14Progress{width:100%;max-width:400px;height:6px;background:rgba(255,255,255,.08);
  border-radius:3px;margin:6px 0;overflow:hidden;}
.v14Progress .bar{height:100%;background:linear-gradient(90deg,#D4894A,#ffd700);
  border-radius:3px;transition:width .4s;}
.v14Select{padding:5px 10px;border-radius:6px;background:rgba(255,250,235,.06);
  border:1px solid rgba(255,215,0,.2);color:#c9a96e;font-size:10px;}
.v14Grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;width:100%;max-width:420px;}
.v14Grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;width:100%;max-width:420px;}
`;
document.head.appendChild(sty14);

/* ─── 3. INTERVAL TRAINING (인터벌 트레이닝) ─── */
var INTERVALS=[
  {name:'&#50976;&#45768;&#51316;',semitones:0,ratio:1},
  {name:'&#45800;2&#46020;',semitones:1,ratio:16/15},
  {name:'&#51109;2&#46020;',semitones:2,ratio:9/8},
  {name:'&#45800;3&#46020;',semitones:3,ratio:6/5},
  {name:'&#51109;3&#46020;',semitones:4,ratio:5/4},
  {name:'&#50756;&#51204;4&#46020;',semitones:5,ratio:4/3},
  {name:'&#51613;4&#46020;/&#44048;5&#46020;',semitones:6,ratio:Math.sqrt(2)},
  {name:'&#50756;&#51204;5&#46020;',semitones:7,ratio:3/2},
  {name:'&#45800;6&#46020;',semitones:8,ratio:8/5},
  {name:'&#51109;6&#46020;',semitones:9,ratio:5/3},
  {name:'&#45800;7&#46020;',semitones:10,ratio:9/5},
  {name:'&#51109;7&#46020;',semitones:11,ratio:15/8}
];
var intRound=0,intScore=0,intTotal=10,intAnswer=-1,intActive=false;
function createIntervalPanel(){
  var panel=document.createElement('div');panel.id='intervalPanel';
  panel.innerHTML='<span class="v14Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#127925; &#51064;&#53552;&#48268; &#53944;&#47112;&#51060;&#45789;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">12&#44060; &#51020;&#51221; &#44396;&#48324; &#50672;&#49845;. 10&#46972;&#50868;&#46300; &#54140;&#51592;!</p>'+
    '<canvas id="intervalCanvas" width="480" height="320"></canvas>'+
    '<div id="intBtns" class="v14Grid4" style="margin:8px 0;"></div>'+
    '<div style="margin-top:4px"><span class="v14Btn" id="intStartBtn">&#9654; &#49884;&#51089;</span> <span class="v14Btn" id="intReplayBtn">&#128264; &#45796;&#49884;&#46307;&#44592;</span></div>'+
    '<div class="v14Info" id="intInfo">&#49884;&#51089;&#51012; &#45572;&#47476;&#47732; &#51020;&#51221;&#51060; &#51116;&#49373;&#46121;&#45768;&#45796;. &#50612;&#46500; &#51064;&#53552;&#48268;&#51064;&#51648; &#47582;&#52628;&#49464;&#50836;!</div>';
  document.body.appendChild(panel);
  var btns=document.getElementById('intBtns');
  INTERVALS.forEach(function(iv,i){
    var btn=document.createElement('div');btn.className='v14Card';
    btn.style.textAlign='center';btn.style.padding='6px 4px';btn.style.fontSize='9px';
    btn.textContent=iv.name;
    btn.onclick=function(){answerInterval(i);};
    btns.appendChild(btn);
  });
  document.getElementById('intStartBtn').onclick=function(){startIntervalRound();};
  document.getElementById('intReplayBtn').onclick=function(){playIntervalSound(intAnswer);};
}
function drawIntervalCanvas(){
  var c=document.getElementById('intervalCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,480,320);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,480,320);
  ctx.fillStyle='#ffd700';ctx.font='bold 12px Georgia';ctx.textAlign='center';
  ctx.fillText('Interval Training',240,20);
  ctx.fillStyle='rgba(240,230,200,.5)';ctx.font='9px Georgia';
  ctx.fillText('Round '+intRound+'/'+intTotal+'  |  Score: '+intScore,240,38);
  for(var i=0;i<12;i++){
    var x=30+(i%6)*73,y=55+Math.floor(i/6)*110;
    var w=65,h=90;
    var hue=(i*30)%360;
    ctx.fillStyle='hsla('+hue+',40%,35%,.5)';ctx.fillRect(x,y,w,h);
    ctx.strokeStyle='hsla('+hue+',60%,60%,.4)';ctx.strokeRect(x,y,w,h);
    ctx.fillStyle='hsla('+hue+',70%,75%,.9)';ctx.font='bold 10px Georgia';ctx.textAlign='center';
    ctx.fillText(INTERVALS[i].name,x+w/2,y+35);
    ctx.fillStyle='rgba(240,230,200,.4)';ctx.font='8px monospace';
    ctx.fillText(INTERVALS[i].semitones+'st',x+w/2,y+55);
    var ratio=INTERVALS[i].ratio;
    var barH=ratio*25;
    ctx.fillStyle='hsla('+hue+',50%,50%,.4)';
    ctx.fillRect(x+10,y+h-barH-5,w-20,barH);
  }
  if(intRound>0&&intRound<=intTotal){
    ctx.fillStyle='rgba(255,215,0,.15)';ctx.fillRect(10,280,460,32);
    ctx.fillStyle='#ffd700';ctx.font='11px Georgia';ctx.textAlign='center';
    ctx.fillText('&#127911; &#51020;&#51221;&#51060; &#51116;&#49373;&#46104;&#50632;&#49845;&#45768;&#45796;. &#50500;&#47000;&#50640;&#49436; &#51064;&#53552;&#48268;&#51012; &#49440;&#53469;&#54616;&#49464;&#50836;!',240,300);
  }
  if(intRound>intTotal){
    var pct=Math.round(intScore/intTotal*100);
    var grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=50?'C':'D';
    ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(100,100,280,120);
    ctx.strokeStyle='#ffd700';ctx.strokeRect(100,100,280,120);
    ctx.fillStyle='#ffd700';ctx.font='bold 18px Georgia';
    ctx.fillText('&#44208;&#44284;: '+grade+' &#46321;&#44553;',240,140);
    ctx.fillStyle='rgba(240,230,200,.8)';ctx.font='14px Georgia';
    ctx.fillText(intScore+'/'+intTotal+' ('+pct+'%)',240,170);
    ctx.font='10px Georgia';ctx.fillText(pct>=80?'&#127942; &#50864;&#49688;&#54620; &#44480;!':'&#128170; &#45908; &#50672;&#49845;&#54644;&#48372;&#49464;&#50836;!',240,200);
  }
}
function playIntervalSound(idx){
  if(idx<0||idx>=INTERVALS.length)return;
  if(!actx14)actx14=new(window.AudioContext||window.webkitAudioContext)();
  var base=440,top=base*INTERVALS[idx].ratio;
  [base,top].forEach(function(f,i){
    var o=actx14.createOscillator(),g=actx14.createGain();
    o.connect(g);g.connect(actx14.destination);
    o.type='sine';o.frequency.setValueAtTime(f,actx14.currentTime+i*.6);
    g.gain.setValueAtTime(0,actx14.currentTime+i*.6);
    g.gain.linearRampToValueAtTime(.15,actx14.currentTime+i*.6+.05);
    g.gain.exponentialRampToValueAtTime(.001,actx14.currentTime+i*.6+.5);
    o.start(actx14.currentTime+i*.6);o.stop(actx14.currentTime+i*.6+.55);
  });
}
function startIntervalRound(){
  if(intRound>intTotal){intRound=0;intScore=0;}
  intRound++;
  if(intRound>intTotal){drawIntervalCanvas();return;}
  intAnswer=Math.floor(Math.random()*12);
  playIntervalSound(intAnswer);v14Sfx('interval_play');
  drawIntervalCanvas();
  document.getElementById('intInfo').textContent='Round '+intRound+': &#51116;&#49373;&#46108; &#51020;&#51221;&#51012; &#46307;&#44256; &#47582;&#52628;&#49464;&#50836;!';
}
function answerInterval(idx){
  if(!intActive&&intRound===0)return;
  if(intRound>intTotal)return;
  if(idx===intAnswer){
    intScore++;v14Sfx('interval_correct');
    document.getElementById('intInfo').textContent='&#9989; &#51221;&#45813;! '+INTERVALS[intAnswer].name;
  }else{
    v14Sfx('interval_wrong');
    document.getElementById('intInfo').textContent='&#10060; &#50724;&#45813;. &#51221;&#45813;: '+INTERVALS[intAnswer].name;
  }
  var prog=loadProgress();prog.intTrainCount=(prog.intTrainCount||0)+1;saveProgress(prog);
  if(prog.intTrainCount>=10)unlockAch('interval_student');
  setTimeout(function(){startIntervalRound();},1200);
}

/* ─── 4. MELODIC DICTATION (멜로딕 딕테이션) ─── */
var DICT_NOTES=['C4','D4','E4','F4','G4','A4','B4','C5'];
var DICT_FREQS={C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25};
var dictLevel=0,dictMelody=[],dictUserNotes=[],dictChecked=false;
var dictLevels=[{name:'&#52488;&#44553;',len:4},{name:'&#51473;&#44553;',len:6},{name:'&#44256;&#44553;',len:8}];
function createDictPanel(){
  var panel=document.createElement('div');panel.id='dictPanel';
  panel.innerHTML='<span class="v14Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#127911; &#47708;&#47196;&#46357; &#46357;&#53580;&#51060;&#49496;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">&#47708;&#47196;&#46356;&#47484; &#46307;&#44256; &#45432;&#53944;&#47484; &#51116;&#44396;&#49457;&#54616;&#49464;&#50836;</p>'+
    '<canvas id="dictCanvas" width="500" height="300"></canvas>'+
    '<div style="display:flex;gap:6px;margin:6px 0;justify-content:center;flex-wrap:wrap;">'+
    '<select class="v14Select" id="dictLevelSel"><option value="0">&#52488;&#44553; (4&#51020;)</option><option value="1">&#51473;&#44553; (6&#51020;)</option><option value="2">&#44256;&#44553; (8&#51020;)</option></select></div>'+
    '<div id="dictNoteGrid" class="v14Grid4" style="margin:6px 0;max-width:360px;"></div>'+
    '<div style="margin-top:4px"><span class="v14Btn" id="dictNewBtn">&#9654; &#49352; &#47928;&#51228;</span> '+
    '<span class="v14Btn" id="dictReplayBtn">&#128264; &#45796;&#49884;&#46307;&#44592;</span> '+
    '<span class="v14Btn" id="dictCheckBtn">&#10003; &#54869;&#51064;</span> '+
    '<span class="v14Btn" id="dictClearBtn">&#8634; &#51648;&#50864;&#44592;</span></div>'+
    '<div class="v14Info" id="dictInfo">&#45212;&#51060;&#46020;&#47484; &#49440;&#53469;&#54616;&#44256; &#49352; &#47928;&#51228;&#47484; &#49884;&#51089;&#54616;&#49464;&#50836;</div>';
  document.body.appendChild(panel);
  var grid=document.getElementById('dictNoteGrid');
  DICT_NOTES.forEach(function(n){
    var btn=document.createElement('div');btn.className='v14Card';
    btn.style.textAlign='center';btn.style.padding='8px 4px';
    btn.textContent=n;
    btn.onclick=function(){addDictNote(n);};
    grid.appendChild(btn);
  });
  document.getElementById('dictLevelSel').onchange=function(){dictLevel=parseInt(this.value);};
  document.getElementById('dictNewBtn').onclick=function(){newDictation();};
  document.getElementById('dictReplayBtn').onclick=function(){playDictMelody();};
  document.getElementById('dictCheckBtn').onclick=function(){checkDictation();};
  document.getElementById('dictClearBtn').onclick=function(){dictUserNotes=[];dictChecked=false;drawDictCanvas();};
}
function drawDictCanvas(){
  var c=document.getElementById('dictCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,500,300);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,500,300);
  ctx.fillStyle='#ffd700';ctx.font='bold 11px Georgia';ctx.textAlign='center';
  ctx.fillText('Melodic Dictation - '+dictLevels[dictLevel].name,250,18);
  ctx.strokeStyle='rgba(200,190,160,.2)';ctx.lineWidth=1;
  for(var i=0;i<5;i++){var y=70+i*25;ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(470,y);ctx.stroke();}
  ctx.fillStyle='rgba(240,230,200,.3)';ctx.font='8px monospace';ctx.textAlign='left';
  var staffNotes=['F5','D5','B4','G4','E4'];
  staffNotes.forEach(function(n,i){ctx.fillText(n,5,74+i*25);});
  var noteYMap={C4:195,D4:182.5,E4:170,F4:157.5,G4:145,A4:132.5,B4:120,C5:107.5};
  var targetLen=dictLevels[dictLevel].len;
  if(dictMelody.length>0){
    ctx.fillStyle='rgba(200,190,160,.25)';ctx.font='9px Georgia';ctx.textAlign='center';
    ctx.fillText('&#47785;&#54364; &#47708;&#47196;&#46356;: '+dictMelody.length+'&#51020;',250,48);
  }
  if(dictUserNotes.length>0){
    dictUserNotes.forEach(function(n,i){
      var x=60+i*(380/Math.max(targetLen,dictUserNotes.length));
      var y=noteYMap[n]||145;
      var correct=dictChecked&&dictMelody[i]===n;
      var wrong=dictChecked&&dictMelody[i]!==n;
      ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);
      ctx.fillStyle=wrong?'rgba(244,67,54,.7)':correct?'rgba(76,175,80,.7)':'rgba(255,215,0,.5)';
      ctx.fill();ctx.strokeStyle=wrong?'#f44336':correct?'#4caf50':'#ffd700';ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='bold 8px monospace';ctx.textAlign='center';
      ctx.fillText(n,x,y+3);
    });
  }
  if(dictChecked&&dictMelody.length>0){
    var score=0;
    dictMelody.forEach(function(n,i){if(dictUserNotes[i]===n)score++;});
    var pct=Math.round(score/dictMelody.length*100);
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(130,220,240,60);
    ctx.strokeStyle='#ffd700';ctx.strokeRect(130,220,240,60);
    ctx.fillStyle='#ffd700';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText(score+'/'+dictMelody.length+' &#51221;&#45813; ('+pct+'%)',250,248);
    ctx.fillStyle='rgba(240,230,200,.6)';ctx.font='10px Georgia';
    ctx.fillText(pct>=80?'&#127942; &#54984;&#47469;&#54644;&#50836;!':'&#128170; &#45796;&#49884; &#46020;&#51204;!',250,268);
  }
  ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='9px Georgia';ctx.textAlign='center';
  ctx.fillText('&#45236; &#51025;&#47141;: '+(dictUserNotes.length>0?dictUserNotes.join(' - '):'(&#50500;&#51649; &#50630;&#51020;)'),250,290);
}
function newDictation(){
  var len=dictLevels[dictLevel].len;
  dictMelody=[];dictUserNotes=[];dictChecked=false;
  for(var i=0;i<len;i++)dictMelody.push(DICT_NOTES[Math.floor(Math.random()*DICT_NOTES.length)]);
  playDictMelody();drawDictCanvas();v14Sfx('dictation_note');
  document.getElementById('dictInfo').textContent='&#47708;&#47196;&#46356;&#44032; &#51116;&#49373;&#46121;&#45768;&#45796;. &#46308;&#50612;&#48372;&#44256; &#45432;&#53944;&#47484; &#49440;&#53469;&#54616;&#49464;&#50836;!';
}
function playDictMelody(){
  if(dictMelody.length===0)return;
  if(!actx14)actx14=new(window.AudioContext||window.webkitAudioContext)();
  dictMelody.forEach(function(n,i){
    var f=DICT_FREQS[n]||440;
    var o=actx14.createOscillator(),g=actx14.createGain();
    o.connect(g);g.connect(actx14.destination);
    o.type='sine';o.frequency.setValueAtTime(f,actx14.currentTime+i*.5);
    g.gain.setValueAtTime(0,actx14.currentTime+i*.5);
    g.gain.linearRampToValueAtTime(.14,actx14.currentTime+i*.5+.05);
    g.gain.exponentialRampToValueAtTime(.001,actx14.currentTime+i*.5+.45);
    o.start(actx14.currentTime+i*.5);o.stop(actx14.currentTime+i*.5+.5);
  });
}
function addDictNote(n){
  if(dictChecked)return;
  var maxLen=dictLevels[dictLevel].len;
  if(dictUserNotes.length>=maxLen)return;
  dictUserNotes.push(n);drawDictCanvas();
  if(!actx14)actx14=new(window.AudioContext||window.webkitAudioContext)();
  var f=DICT_FREQS[n]||440;
  var o=actx14.createOscillator(),g=actx14.createGain();
  o.connect(g);g.connect(actx14.destination);o.type='sine';
  o.frequency.setValueAtTime(f,actx14.currentTime);
  g.gain.setValueAtTime(.1,actx14.currentTime);g.gain.exponentialRampToValueAtTime(.001,actx14.currentTime+.3);
  o.start();o.stop(actx14.currentTime+.35);
}
function checkDictation(){
  if(dictMelody.length===0||dictUserNotes.length===0)return;
  dictChecked=true;drawDictCanvas();
  var score=0;dictMelody.forEach(function(n,i){if(dictUserNotes[i]===n)score++;});
  var pct=Math.round(score/dictMelody.length*100);
  document.getElementById('dictInfo').textContent='&#44208;&#44284;: '+score+'/'+dictMelody.length+' ('+pct+'%)';
  var prog=loadProgress();prog.dictCount=(prog.dictCount||0)+1;saveProgress(prog);
  if(prog.dictCount>=5)unlockAch('dictation_student');
  if(pct>=80)unlockAch('dictation_ace');
  addHistory('dictation','&#47708;&#47196;&#46357; &#46357;&#53580;&#51060;&#49496;: '+score+'/'+dictMelody.length);
}

/* ─── 5. BOWING ANALYSIS DASHBOARD (보잉 분석 대시보드) ─── */
var bowAxes=['&#49549;&#46020;','&#50517;&#47141;','&#51068;&#44288;&#49457;','&#48169;&#54693;','&#51217;&#51216;','&#48516;&#48176;'];
function createBowPanel(){
  var panel=document.createElement('div');panel.id='bowPanel';
  panel.innerHTML='<span class="v14Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#127931; &#48372;&#51081; &#48516;&#49437; &#45824;&#49884;&#48372;&#46300;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">6&#52629; &#47112;&#51060;&#45908; &#52264;&#53944;&#47196; &#48372;&#51081; &#44592;&#49696;&#51012; &#48516;&#49437;&#54633;&#45768;&#45796;</p>'+
    '<canvas id="bowCanvas" width="400" height="400"></canvas>'+
    '<div style="margin-top:6px"><span class="v14Btn" id="bowRecordBtn">&#9679; &#49464;&#49496; &#44592;&#47197;</span> <span class="v14Btn" id="bowResetBtn">&#8634; &#52488;&#44592;&#54868;</span></div>'+
    '<div class="v14Info" id="bowInfo">&#49464;&#49496;&#51012; &#44592;&#47197;&#54616;&#47732; &#47112;&#51060;&#45908; &#52264;&#53944;&#44032; &#50629;&#45936;&#51060;&#53944;&#46121;&#45768;&#45796;</div>';
  document.body.appendChild(panel);
  document.getElementById('bowRecordBtn').onclick=function(){recordBowSession();};
  document.getElementById('bowResetBtn').onclick=function(){
    localStorage.removeItem('violinBowData');drawBowCanvas();
    document.getElementById('bowInfo').textContent='&#45936;&#51060;&#53552;&#44032; &#52488;&#44592;&#54868;&#46104;&#50632;&#49845;&#45768;&#45796;';
  };
}
function getBowData(){try{return JSON.parse(localStorage.getItem('violinBowData')||'[]');}catch(e){return [];}}
function recordBowSession(){
  var data=getBowData();
  var session=bowAxes.map(function(){return 40+Math.floor(Math.random()*55);});
  data.push({date:new Date().toISOString().slice(0,10),scores:session});
  if(data.length>30)data=data.slice(-30);
  localStorage.setItem('violinBowData',JSON.stringify(data));
  v14Sfx('bowing_radar');drawBowCanvas();
  var avg=Math.round(session.reduce(function(a,b){return a+b;},0)/6);
  var grade=avg>=90?'S':avg>=80?'A':avg>=70?'B':avg>=50?'C':'D';
  document.getElementById('bowInfo').textContent='&#49464;&#49496; &#44592;&#47197; &#50756;&#47308;! &#54217;&#44512;: '+avg+'&#51216; ('+grade+'&#46321;&#44553;)';
  var prog=loadProgress();prog.bowSessions=(prog.bowSessions||0)+1;saveProgress(prog);
  if(prog.bowSessions>=3)unlockAch('bow_analyst');
  if(prog.bowSessions>=10)unlockAch('bow_master');
  addHistory('bowing','&#48372;&#51081; &#48516;&#49437;: &#54217;&#44512; '+avg+'&#51216;');
}
function drawBowCanvas(){
  var c=document.getElementById('bowCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,400,400);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,400,400);
  ctx.fillStyle='#ffd700';ctx.font='bold 12px Georgia';ctx.textAlign='center';
  ctx.fillText('Bowing Radar Chart',200,20);
  var cx=200,cy=210,r=130;
  for(var ring=1;ring<=5;ring++){
    ctx.beginPath();
    for(var j=0;j<6;j++){
      var angle=-Math.PI/2+j*(Math.PI*2/6);
      var x=cx+Math.cos(angle)*(r*ring/5);
      var y=cy+Math.sin(angle)*(r*ring/5);
      if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.closePath();ctx.strokeStyle='rgba(200,190,160,'+(ring===5?.2:.08)+')';ctx.stroke();
  }
  for(var i=0;i<6;i++){
    var angle=-Math.PI/2+i*(Math.PI*2/6);
    var ex=cx+Math.cos(angle)*r,ey=cy+Math.sin(angle)*r;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);
    ctx.strokeStyle='rgba(200,190,160,.1)';ctx.stroke();
    var lx=cx+Math.cos(angle)*(r+18),ly=cy+Math.sin(angle)*(r+18);
    ctx.fillStyle='rgba(240,230,200,.7)';ctx.font='9px Georgia';ctx.textAlign='center';
    ctx.fillText(bowAxes[i],lx,ly+3);
  }
  var data=getBowData();
  if(data.length>0){
    var latest=data[data.length-1].scores;
    ctx.beginPath();
    latest.forEach(function(v,i){
      var angle=-Math.PI/2+i*(Math.PI*2/6);
      var x=cx+Math.cos(angle)*(r*v/100);
      var y=cy+Math.sin(angle)*(r*v/100);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.closePath();ctx.fillStyle='rgba(212,137,74,.2)';ctx.fill();
    ctx.strokeStyle='rgba(212,137,74,.8)';ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1;
    latest.forEach(function(v,i){
      var angle=-Math.PI/2+i*(Math.PI*2/6);
      var x=cx+Math.cos(angle)*(r*v/100);
      var y=cy+Math.sin(angle)*(r*v/100);
      ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='#D4894A';ctx.fill();
    });
    if(data.length>=2){
      var prev=data[data.length-2].scores;
      ctx.beginPath();
      prev.forEach(function(v,i){
        var angle=-Math.PI/2+i*(Math.PI*2/6);
        var x=cx+Math.cos(angle)*(r*v/100);
        var y=cy+Math.sin(angle)*(r*v/100);
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });
      ctx.closePath();ctx.strokeStyle='rgba(100,180,100,.3)';ctx.lineWidth=1;ctx.stroke();
    }
  }
  ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='9px Georgia';
  ctx.fillText('&#52509; '+data.length+'&#49464;&#49496; &#44592;&#47197;',200,390);
}

/* ─── 6. VIBRATO SPEED/WIDTH TRAINER (비브라토 속도/폭 트레이너) ─── */
var vibPresets=[
  {name:'&#51340;&#51008;-&#45712;&#47536;',speed:3,width:8,color:'#88aaee'},
  {name:'&#51340;&#51008;-&#48736;&#47480;',speed:7,width:8,color:'#66ccff'},
  {name:'&#51473;&#44036;-&#45712;&#47536;',speed:3,width:18,color:'#aacc66'},
  {name:'&#51473;&#44036;-&#48736;&#47480;',speed:7,width:18,color:'#ffcc44'},
  {name:'&#45331;&#51008;-&#45712;&#47536;',speed:3,width:30,color:'#ff9966'},
  {name:'&#45331;&#51008;-&#48736;&#47480;',speed:7,width:30,color:'#ff6688'}
];
var vibCurrent=0,vibAnimId=null,vibPracticeTime={};
function createVibPanel(){
  var panel=document.createElement('div');panel.id='vibPanel';
  panel.innerHTML='<span class="v14Close" onclick="this.parentElement.classList.remove(\'show\');stopVibAnim()">&times;</span>'+
    '<h3>&#12336; &#48708;&#48652;&#46972;&#53664; &#53944;&#47112;&#51060;&#45320;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">6&#44060; &#54532;&#47532;&#49483;&#51004;&#47196; &#48708;&#48652;&#46972;&#53664; &#49549;&#46020;/&#54253;&#51012; &#50672;&#49845;&#54616;&#49464;&#50836;</p>'+
    '<canvas id="vibCanvas" width="480" height="260"></canvas>'+
    '<div id="vibPresetBtns" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:8px 0;"></div>'+
    '<div style="margin-top:4px"><span class="v14Btn" id="vibStartBtn">&#9654; &#49884;&#51089;</span> <span class="v14Btn" id="vibStopBtn">&#9632; &#51221;&#51648;</span></div>'+
    '<div class="v14Info" id="vibInfo">&#54532;&#47532;&#49483;&#51012; &#49440;&#53469;&#54616;&#44256; &#49884;&#51089;&#51012; &#45572;&#47476;&#49464;&#50836;</div>';
  document.body.appendChild(panel);
  var preDiv=document.getElementById('vibPresetBtns');
  vibPresets.forEach(function(p,i){
    var btn=document.createElement('span');btn.className='v14Btn';
    btn.innerHTML='<span style="color:'+p.color+'">&#9679;</span> '+p.name;
    btn.onclick=function(){vibCurrent=i;drawVibCanvas();
      document.querySelectorAll('#vibPresetBtns .v14Btn').forEach(function(b,j){b.classList.toggle('active',j===i);});
      v14Sfx('vibrato_wave');};
    preDiv.appendChild(btn);
  });
  document.getElementById('vibStartBtn').onclick=function(){startVibAnim();};
  document.getElementById('vibStopBtn').onclick=function(){stopVibAnim();};
}
function drawVibCanvas(t){
  var c=document.getElementById('vibCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,480,260);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,480,260);
  var p=vibPresets[vibCurrent];
  ctx.fillStyle='#ffd700';ctx.font='bold 11px Georgia';ctx.textAlign='center';
  ctx.fillText('Vibrato Waveform: '+p.name,240,18);
  ctx.strokeStyle='rgba(200,190,160,.15)';
  ctx.beginPath();ctx.moveTo(20,130);ctx.lineTo(460,130);ctx.stroke();
  ctx.beginPath();ctx.moveTo(20,130-p.width*2);ctx.lineTo(460,130-p.width*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(20,130+p.width*2);ctx.lineTo(460,130+p.width*2);ctx.stroke();
  ctx.fillStyle='rgba(200,190,160,.3)';ctx.font='8px monospace';ctx.textAlign='left';
  ctx.fillText('+'+p.width+'ct',462,130-p.width*2+3);
  ctx.fillText('-'+p.width+'ct',462,130+p.width*2+3);
  ctx.fillText('0',462,133);
  var time=t||0;
  ctx.beginPath();
  for(var x=20;x<=460;x++){
    var phase=(x-20)/440*Math.PI*2*p.speed+time*p.speed*0.01;
    var y=130+Math.sin(phase)*p.width*2;
    if(x===20)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle=p.color;ctx.lineWidth=2.5;ctx.stroke();ctx.lineWidth=1;
  ctx.fillStyle='rgba(240,230,200,.5)';ctx.font='9px Georgia';ctx.textAlign='center';
  ctx.fillText('Speed: '+p.speed+'Hz | Width: ±'+p.width+' cents',240,250);
  var practiced=vibPracticeTime[vibCurrent]||0;
  ctx.fillText('&#50672;&#49845; &#49884;&#44036;: '+practiced+'&#52488;',240,238);
}
var vibStartTime=0;
function startVibAnim(){
  stopVibAnim();vibStartTime=Date.now();
  var animate=function(){
    var t=(Date.now()-vibStartTime)/16;
    drawVibCanvas(t);
    vibAnimId=requestAnimationFrame(animate);
    var elapsed=Math.floor((Date.now()-vibStartTime)/1000);
    vibPracticeTime[vibCurrent]=elapsed;
    if(elapsed>0&&elapsed%10===0){
      var prog=loadProgress();prog.vibSeconds=(prog.vibSeconds||0)+10;saveProgress(prog);
    }
  };
  animate();
  document.getElementById('vibInfo').textContent='&#48708;&#48652;&#46972;&#53664; &#50672;&#49845; &#51473;... &#49324;&#51064;&#54028;&#47484; &#46384;&#46972; &#49552;&#44032;&#46973;&#51012; &#50880;&#51649;&#51060;&#49464;&#50836;';
  var prog=loadProgress();prog.vibSessions=(prog.vibSessions||0)+1;saveProgress(prog);
  if(prog.vibSessions>=3)unlockAch('vibrato_student');
  if(prog.vibSessions>=12)unlockAch('vibrato_master');
  addHistory('vibrato','&#48708;&#48652;&#46972;&#53664; &#50672;&#49845;: '+vibPresets[vibCurrent].name);
}
function stopVibAnim(){if(vibAnimId){cancelAnimationFrame(vibAnimId);vibAnimId=null;}}

/* ─── 7. PITCH ACCURACY HEATMAP (음정 정확도 히트맵) ─── */
var pitchStrings=[
  {name:'G&#54788;',notes:['G3','A3','B3','C4','D4','E4','F#4','G4']},
  {name:'D&#54788;',notes:['D4','E4','F#4','G4','A4','B4','C#5','D5']},
  {name:'A&#54788;',notes:['A4','B4','C#5','D5','E5','F#5','G#5','A5']},
  {name:'E&#54788;',notes:['E5','F#5','G#5','A5','B5','C#6','D#6','E6']}
];
function createPitchPanel(){
  var panel=document.createElement('div');panel.id='pitchPanel';
  panel.innerHTML='<span class="v14Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#127912; &#51020;&#51221; &#51221;&#54869;&#46020; &#55176;&#53944;&#47605;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">4&#54788; x 8&#54252;&#51648;&#49496; &#51020;&#51221; &#51221;&#54869;&#46020;&#47484; &#49884;&#44033;&#54868;&#54633;&#45768;&#45796;</p>'+
    '<canvas id="pitchCanvas" width="560" height="320"></canvas>'+
    '<div style="margin-top:6px"><span class="v14Btn" id="pitchRecordBtn">&#9679; &#50672;&#49845; &#44592;&#47197;</span> <span class="v14Btn" id="pitchResetBtn">&#8634; &#52488;&#44592;&#54868;</span></div>'+
    '<div class="v14Info" id="pitchInfo">&#50672;&#49845;&#51012; &#44592;&#47197;&#54616;&#47732; &#44033; &#51020;&#51221;&#51032; &#51221;&#54869;&#46020;&#44032; &#54364;&#49884;&#46121;&#45768;&#45796;</div>';
  document.body.appendChild(panel);
  document.getElementById('pitchRecordBtn').onclick=function(){recordPitchSession();};
  document.getElementById('pitchResetBtn').onclick=function(){
    localStorage.removeItem('violinPitchData');drawPitchCanvas();
    document.getElementById('pitchInfo').textContent='&#45936;&#51060;&#53552;&#44032; &#52488;&#44592;&#54868;&#46104;&#50632;&#49845;&#45768;&#45796;';
  };
}
function getPitchData(){try{return JSON.parse(localStorage.getItem('violinPitchData')||'{}');}catch(e){return {};}}
function recordPitchSession(){
  var data=getPitchData();
  pitchStrings.forEach(function(s){
    s.notes.forEach(function(n){
      if(!data[n])data[n]={total:0,accurate:0};
      data[n].total++;
      if(Math.random()>.3)data[n].accurate++;
    });
  });
  localStorage.setItem('violinPitchData',JSON.stringify(data));
  v14Sfx('pitch_heatmap');drawPitchCanvas();
  var prog=loadProgress();prog.pitchSessions=(prog.pitchSessions||0)+1;saveProgress(prog);
  if(prog.pitchSessions>=5)unlockAch('pitch_tracker');
  document.getElementById('pitchInfo').textContent='&#50672;&#49845; &#44592;&#47197; &#50756;&#47308;! &#55176;&#53944;&#47605;&#51060; &#50629;&#45936;&#51060;&#53944;&#46104;&#50632;&#49845;&#45768;&#45796;.';
  addHistory('pitch','&#51020;&#51221; &#51221;&#54869;&#46020; &#44592;&#47197;');
}
function drawPitchCanvas(){
  var c=document.getElementById('pitchCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,560,320);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,560,320);
  ctx.fillStyle='#ffd700';ctx.font='bold 12px Georgia';ctx.textAlign='center';
  ctx.fillText('Pitch Accuracy Heatmap',280,20);
  var data=getPitchData();
  var cellW=55,cellH=55,startX=80,startY=45;
  ctx.fillStyle='rgba(240,230,200,.6)';ctx.font='9px Georgia';ctx.textAlign='center';
  for(var pos=0;pos<8;pos++){
    ctx.fillText((pos===0?'Open':pos+'pos'),startX+pos*cellW+cellW/2,startY-5);
  }
  pitchStrings.forEach(function(s,si){
    ctx.fillStyle='rgba(240,230,200,.7)';ctx.font='10px Georgia';ctx.textAlign='right';
    ctx.fillText(s.name,startX-10,startY+si*cellH+cellH/2+3);
    s.notes.forEach(function(n,ni){
      var x=startX+ni*cellW,y=startY+si*cellH;
      var accuracy=0;
      if(data[n]&&data[n].total>0)accuracy=data[n].accurate/data[n].total;
      var r=Math.round(255*(1-accuracy));
      var g=Math.round(200*accuracy);
      ctx.fillStyle='rgba('+r+','+g+',60,.6)';
      ctx.fillRect(x+2,y+2,cellW-4,cellH-4);
      ctx.strokeStyle='rgba(200,190,160,.15)';ctx.strokeRect(x+2,y+2,cellW-4,cellH-4);
      ctx.fillStyle='#fff';ctx.font='bold 8px monospace';ctx.textAlign='center';
      ctx.fillText(n,x+cellW/2,y+cellH/2-4);
      if(data[n]&&data[n].total>0){
        ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='8px monospace';
        ctx.fillText(Math.round(accuracy*100)+'%',x+cellW/2,y+cellH/2+10);
      }
    });
  });
  ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='9px Georgia';ctx.textAlign='center';
  var legend='&#127154;&#52488;&#47197;=&#51221;&#54869; | &#127153;&#45432;&#46993;=&#48372;&#53685; | &#127152;&#48736;&#44053;=&#50672;&#49845;&#54596;&#50836;';
  ctx.fillText(legend,280,305);
}

/* ─── 8. PRACTICE JOURNAL (연습 저널) ─── */
var journalMoods=['&#128522;','&#128170;','&#128148;','&#128564;','&#128545;'];
var journalMoodNames=['&#51600;&#44144;&#50880;','&#50676;&#51221;','&#50500;&#49772;&#50880;','&#54588;&#44260;','&#54868;&#45224;'];
function createJournalPanel(){
  var panel=document.createElement('div');panel.id='journalPanel';
  panel.innerHTML='<span class="v14Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#128221; &#50672;&#49845; &#51200;&#45328;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">&#50672;&#49845; &#44592;&#47197;&#51012; &#45224;&#44200;&#48372;&#49464;&#50836; (&#52572;&#45824; 100&#44148;)</p>'+
    '<div style="width:100%;max-width:420px;margin:8px 0;">'+
    '<div style="display:flex;gap:4px;margin-bottom:6px;">'+
    '<input type="number" id="jrnDuration" min="1" max="300" value="30" style="width:60px;padding:4px;border-radius:4px;border:1px solid rgba(255,215,0,.2);background:rgba(0,0,0,.3);color:#c9a96e;font-size:10px;" placeholder="&#48516;">'+
    '<span style="font-size:10px;color:rgba(200,190,160,.5);line-height:28px">&#48516;</span></div>'+
    '<input type="text" id="jrnGoal" maxlength="50" style="width:100%;padding:6px;border-radius:6px;border:1px solid rgba(255,215,0,.2);background:rgba(0,0,0,.3);color:#c9a96e;font-size:10px;margin-bottom:6px;box-sizing:border-box;" placeholder="&#50724;&#45720;&#51032; &#47785;&#54364;...">'+
    '<textarea id="jrnNote" maxlength="200" rows="2" style="width:100%;padding:6px;border-radius:6px;border:1px solid rgba(255,215,0,.2);background:rgba(0,0,0,.3);color:#c9a96e;font-size:10px;margin-bottom:6px;box-sizing:border-box;resize:none;" placeholder="&#47700;&#47784;..."></textarea>'+
    '<div id="jrnMoods" style="display:flex;gap:8px;margin-bottom:6px;justify-content:center;"></div>'+
    '<div style="text-align:center"><span class="v14Btn" id="jrnSaveBtn">&#128190; &#51200;&#51109;</span></div></div>'+
    '<div class="v14Info" id="jrnStats" style="text-align:center"></div>'+
    '<div id="jrnList" style="width:100%;max-width:420px;max-height:250px;overflow-y:auto;"></div>';
  document.body.appendChild(panel);
  var moodDiv=document.getElementById('jrnMoods');
  journalMoods.forEach(function(m,i){
    var btn=document.createElement('span');btn.style.cssText='cursor:pointer;font-size:20px;opacity:.4;transition:opacity .2s;';
    btn.innerHTML=m;btn.dataset.idx=i;
    btn.onclick=function(){
      document.querySelectorAll('#jrnMoods span').forEach(function(s){s.style.opacity='.4';});
      btn.style.opacity='1';btn.dataset.selected='1';
    };
    moodDiv.appendChild(btn);
  });
  document.getElementById('jrnSaveBtn').onclick=function(){saveJournalEntry();};
}
function getJournal(){try{return JSON.parse(localStorage.getItem('violinJournal')||'[]');}catch(e){return [];}}
function saveJournalEntry(){
  var dur=parseInt(document.getElementById('jrnDuration').value)||30;
  var goal=document.getElementById('jrnGoal').value.trim();
  var note=document.getElementById('jrnNote').value.trim();
  var moodIdx=-1;
  document.querySelectorAll('#jrnMoods span').forEach(function(s,i){if(s.dataset.selected==='1')moodIdx=i;});
  if(moodIdx<0){document.getElementById('jrnStats').textContent='&#44592;&#48516;&#51012; &#49440;&#53469;&#54644;&#51452;&#49464;&#50836;!';return;}
  var journal=getJournal();
  journal.push({date:new Date().toLocaleString('ko-KR'),duration:dur,goal:goal,note:note,mood:moodIdx});
  if(journal.length>100)journal=journal.slice(-100);
  localStorage.setItem('violinJournal',JSON.stringify(journal));
  v14Sfx('journal_save');
  document.getElementById('jrnGoal').value='';document.getElementById('jrnNote').value='';
  document.querySelectorAll('#jrnMoods span').forEach(function(s){s.style.opacity='.4';s.dataset.selected='';});
  renderJournal();
  var prog=loadProgress();prog.journalEntries=(prog.journalEntries||0)+1;saveProgress(prog);
  if(prog.journalEntries>=10)unlockAch('journal_keeper');
  if(prog.journalEntries>=50)unlockAch('journal_master');
  addHistory('journal','&#50672;&#49845; &#51200;&#45328; &#44592;&#47197;: '+dur+'&#48516;');
}
function renderJournal(){
  var journal=getJournal();
  var totalMin=journal.reduce(function(a,e){return a+e.duration;},0);
  var avgMin=journal.length>0?Math.round(totalMin/journal.length):0;
  var statsEl=document.getElementById('jrnStats');
  statsEl.textContent='&#52509; '+journal.length+'&#44148; | &#52509; '+(totalMin>=60?Math.floor(totalMin/60)+'&#49884;&#44036; '+(totalMin%60)+'&#48516;':totalMin+'&#48516;')+' | &#54217;&#44512; '+avgMin+'&#48516;/&#54924;';
  var list=document.getElementById('jrnList');list.innerHTML='';
  journal.slice().reverse().slice(0,20).forEach(function(e){
    var card=document.createElement('div');card.className='v14Card';
    card.innerHTML='<div style="display:flex;justify-content:space-between"><span>'+journalMoods[e.mood]+' '+e.date+'</span><span style="color:#ffd700">'+e.duration+'&#48516;</span></div>'+
      (e.goal?'<div style="font-size:9px;color:rgba(255,215,0,.6);margin-top:2px">&#47785;&#54364;: '+e.goal+'</div>':'')+
      (e.note?'<div style="font-size:9px;color:rgba(200,190,160,.5);margin-top:2px">'+e.note+'</div>':'');
    list.appendChild(card);
  });
}

/* ─── 9. SONG DIFFICULTY PROGRESSION MAP (곡 난이도 진행 맵) ─── */
function createSongmapPanel(){
  var panel=document.createElement('div');panel.id='songmapPanel';
  panel.innerHTML='<span class="v14Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#128506; &#44257; &#45212;&#51060;&#46020; &#51652;&#54665; &#47605;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">114&#44257;&#51012; &#45212;&#51060;&#46020;&#48324;&#47196; &#48176;&#52824;&#54620; &#51652;&#54665; &#47605;</p>'+
    '<canvas id="songmapCanvas" width="560" height="300"></canvas>'+
    '<div class="v14Info" id="songmapInfo">&#44257;&#51012; &#45212;&#51060;&#46020; &#49692;&#49436;&#45824;&#47196; &#50672;&#49845;&#54616;&#47732; &#54952;&#44284;&#51201;&#51077;&#45768;&#45796;</div>';
  document.body.appendChild(panel);
}
function drawSongmapCanvas(){
  var c=document.getElementById('songmapCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,560,300);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,560,300);
  ctx.fillStyle='#ffd700';ctx.font='bold 12px Georgia';ctx.textAlign='center';
  ctx.fillText('Song Difficulty Map',280,18);
  var songs=typeof window.SONG_DATA!=='undefined'?window.SONG_DATA:[];
  var diffGroups={1:[],2:[],3:[],4:[],5:[]};
  songs.forEach(function(s){
    var d=Math.min(5,Math.max(1,s.difficulty||1));
    diffGroups[d].push(s.title);
  });
  var diffLabels=['&#52488;&#44553;','&#52488;&#51473;&#44553;','&#51473;&#44553;','&#51473;&#44256;&#44553;','&#44256;&#44553;'];
  var diffColors=['#4caf50','#8bc34a','#ffc107','#ff9800','#f44336'];
  var prog=loadProgress();var mastered=prog.masteredSongs||{};
  var yStart=40;
  for(var d=1;d<=5;d++){
    var y=yStart+(d-1)*50;
    ctx.fillStyle=diffColors[d-1];ctx.font='bold 10px Georgia';ctx.textAlign='left';
    ctx.fillText('Lv.'+d+' '+diffLabels[d-1],10,y+14);
    var group=diffGroups[d];
    var maxShow=Math.min(group.length,12);
    for(var i=0;i<maxShow;i++){
      var x=90+i*38;
      var isMastered=mastered[group[i]];
      ctx.beginPath();ctx.arc(x,y+10,12,0,Math.PI*2);
      ctx.fillStyle=isMastered?diffColors[d-1]:'rgba(100,100,100,.3)';ctx.fill();
      ctx.strokeStyle=diffColors[d-1];ctx.lineWidth=1;ctx.stroke();
      if(i<maxShow-1){
        ctx.beginPath();ctx.moveTo(x+12,y+10);ctx.lineTo(x+26,y+10);
        ctx.strokeStyle='rgba(200,190,160,.15)';ctx.stroke();
      }
      ctx.fillStyle=isMastered?'#fff':'rgba(200,200,200,.4)';ctx.font='6px monospace';ctx.textAlign='center';
      ctx.fillText((i+1)+'',x,y+13);
    }
    if(group.length>maxShow){
      ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='8px Georgia';ctx.textAlign='left';
      ctx.fillText('+'+(group.length-maxShow)+'&#44257;',90+maxShow*38,y+13);
    }
  }
  var totalSongs=songs.length||114;
  var masteredCount=Object.keys(mastered).length;
  ctx.fillStyle='rgba(240,230,200,.5)';ctx.font='10px Georgia';ctx.textAlign='center';
  ctx.fillText('&#47560;&#49828;&#53552;: '+masteredCount+'/'+totalSongs+'&#44257; ('+Math.round(masteredCount/totalSongs*100)+'%)',280,290);
}

/* ─── 10. ENSEMBLE SIMULATOR (합주 시뮬레이터) ─── */
var ensembleTypes=[
  {name:'&#46272;&#50659;',desc:'2&#51064; &#54200;&#49457;',voices:2,baseFreqs:[440,554.37],pattern:[1,1.25,1.5,1.333]},
  {name:'&#53944;&#47532;&#50724;',desc:'3&#51064; &#54200;&#49457;',voices:3,baseFreqs:[261.63,329.63,392],pattern:[1,1.2,1.5,1.333,1]},
  {name:'&#49324;&#51473;&#51452;',desc:'4&#51064; &#54200;&#49457;',voices:4,baseFreqs:[196,261.63,329.63,440],pattern:[1,1.25,1.5,1.25,1]},
  {name:'&#54588;&#50500;&#45432;&#48152;&#51452;',desc:'&#54588;&#50500;&#45432;+&#48148;&#51060;&#50732;&#47536;',voices:2,baseFreqs:[261.63,523.25],pattern:[1,1.333,1.5,1.667,1.5,1.333,1]},
  {name:'&#50724;&#52992;&#49828;&#53944;&#46972;',desc:'&#50724;&#52992;&#49828;&#53944;&#46972; &#54200;&#49457;',voices:5,baseFreqs:[130.81,196,261.63,392,523.25],pattern:[1,1.125,1.25,1.333,1.5,1.333,1.25,1]},
  {name:'&#51116;&#51592;',desc:'&#51116;&#51592; &#50557;&#49885;&#51004;&#47196; &#54633;&#51452;',voices:3,baseFreqs:[220,277.18,349.23],pattern:[1,1.189,1.498,1.335,1.189,1]}
];
var ensembleCurrent=0,ensemblePlaying=false,ensembleTimers=[];
function createEnsemblePanel(){
  var panel=document.createElement('div');panel.id='ensemblePanel';
  panel.innerHTML='<span class="v14Close" onclick="this.parentElement.classList.remove(\'show\');stopEnsemble()">&times;</span>'+
    '<h3>&#127930; &#54633;&#51452; &#49884;&#48044;&#47112;&#51060;&#53552;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">6&#51333; &#54633;&#51452; &#54805;&#53468;&#47196; &#54632;&#44760; &#50672;&#51452;&#54616;&#49464;&#50836;</p>'+
    '<div id="ensembleList" style="width:100%;max-width:420px;"></div>'+
    '<div style="margin-top:8px"><span class="v14Btn" id="ensPlayBtn">&#9654; &#51116;&#49373;</span> <span class="v14Btn" id="ensStopBtn">&#9632; &#51221;&#51648;</span></div>'+
    '<div class="v14Info" id="ensInfo">&#54633;&#51452; &#50976;&#54805;&#51012; &#49440;&#53469;&#54616;&#44256; &#51116;&#49373;&#51012; &#45572;&#47476;&#49464;&#50836;</div>';
  document.body.appendChild(panel);
  var list=document.getElementById('ensembleList');
  ensembleTypes.forEach(function(e,i){
    var card=document.createElement('div');card.className='v14Card';
    card.innerHTML='<b>'+e.name+'</b> <span style="font-size:9px;color:rgba(200,190,160,.5)">('+e.voices+'&#49457;&#48512;)</span>'+
      '<div style="font-size:9px;color:rgba(200,190,160,.5);margin-top:2px">'+e.desc+'</div>';
    card.onclick=function(){ensembleCurrent=i;
      document.querySelectorAll('#ensembleList .v14Card').forEach(function(c,j){c.classList.toggle('active',j===i);});
      v14Sfx('feature_open14');};
    list.appendChild(card);
  });
  document.getElementById('ensPlayBtn').onclick=function(){playEnsemble();};
  document.getElementById('ensStopBtn').onclick=function(){stopEnsemble();};
}
function playEnsemble(){
  stopEnsemble();
  if(!actx14)actx14=new(window.AudioContext||window.webkitAudioContext)();
  ensemblePlaying=true;
  var ens=ensembleTypes[ensembleCurrent];
  var waveTypes=['sine','triangle','sine','triangle','sine'];
  ens.baseFreqs.forEach(function(baseF,vi){
    ens.pattern.forEach(function(ratio,ni){
      var o=actx14.createOscillator(),g=actx14.createGain();
      o.connect(g);g.connect(actx14.destination);
      o.type=waveTypes[vi%waveTypes.length];
      var t=actx14.currentTime+ni*.45;
      o.frequency.setValueAtTime(baseF*ratio,t);
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(.06/ens.voices,t+.04);
      g.gain.exponentialRampToValueAtTime(.001,t+.4);
      o.start(t);o.stop(t+.42);
    });
  });
  v14Sfx('ensemble_start');
  document.getElementById('ensInfo').textContent='&#54633;&#51452; &#51116;&#49373; &#51473;: '+ens.name+' ('+ens.voices+'&#49457;&#48512;)';
  var prog=loadProgress();prog.ensPlayed=(prog.ensPlayed||0)+1;saveProgress(prog);
  if(prog.ensPlayed>=3)unlockAch('ensemble_player');
  if(prog.ensPlayed>=6)unlockAch('ensemble_master');
  addHistory('ensemble','&#54633;&#51452; &#50672;&#49845;: '+ens.name);
}
function stopEnsemble(){ensemblePlaying=false;ensembleTimers.forEach(function(t){clearTimeout(t);});ensembleTimers=[];}
window.stopEnsemble=stopEnsemble;

/* ─── 11. QUIZ v14 (15문항) ─── */
var quizV14Questions=[
  {q:'&#51109;2&#46020; &#51064;&#53552;&#48268;&#51008; &#47751; &#48152;&#51020;&#51064;&#44032;&#50836;?',a:['2&#48152;&#51020;','1&#48152;&#51020;','5&#48152;&#51020;','7&#48152;&#51020;'],c:0},
  {q:'&#50756;&#51204;5&#46020; &#51064;&#53552;&#48268;&#51008; &#47751; &#48152;&#51020;&#51064;&#44032;&#50836;?',a:['7&#48152;&#51020;','5&#48152;&#51020;','3&#48152;&#51020;','12&#48152;&#51020;'],c:0},
  {q:'&#47708;&#47196;&#46357; &#46357;&#53580;&#51060;&#49496;&#51032; &#47785;&#51201;&#51008;?',a:['&#52397;&#51020; &#45733;&#47141; &#54693;&#49345;','&#49549;&#46020; &#54693;&#49345;','&#54252;&#51648;&#49496; &#50516;&#44592;','&#48372;&#51081; &#50672;&#49845;'],c:0},
  {q:'&#48708;&#48652;&#46972;&#53664;&#50640;&#49436; width&#45716; &#47924;&#50631;&#51012; &#51032;&#48120;&#54616;&#45208;&#50836;?',a:['&#51020;&#51221; &#48320;&#54868;&#51032; &#54253;','&#49552;&#44032;&#46973; &#44600;&#51060;','&#54876; &#50517;&#47141;','&#50672;&#51452; &#49549;&#46020;'],c:0},
  {q:'&#48372;&#51081; &#48516;&#49437;&#50640;&#49436; 6&#52629; &#51473; &#50506;&#45716; &#44163;&#51008;?',a:['&#49549;&#46020;/&#50517;&#47141;/&#51068;&#44288;&#49457;/&#48169;&#54693;/&#51217;&#51216;/&#48516;&#48176;','&#44600;&#51060;/&#45458;&#51060;/&#45320;&#48708;/&#44613;&#51060;/&#44033;&#46020;/&#48372;&#50976;','&#49324;&#46041;/&#54588;&#52824;/&#47532;&#46316;/&#53076;&#46300;/&#54616;&#47784;&#45768;/&#51020;&#49353;','&#46168;&#50556;/&#53356;&#44592;/&#48169;&#54693;/&#53076;&#46300;/&#52980;&#47084;/&#46300;&#46973;'],c:0},
  {q:'&#49324;&#51473;&#51452;&#45716; &#47751; &#47749;&#51060; &#50672;&#51452;&#54616;&#45208;&#50836;?',a:['4&#47749;','2&#47749;','6&#47749;','8&#47749;'],c:0},
  {q:'&#51020;&#51221; &#51221;&#54869;&#46020; &#55176;&#53944;&#47605;&#50640;&#49436; &#52488;&#47197;&#49353;&#51008;?',a:['&#51221;&#54869;&#54620; &#51020;&#51221;','&#45230;&#51008; &#51221;&#54869;&#46020;','&#51473;&#44036;','&#47588;&#50864; &#45208;&#49256;'],c:0},
  {q:'&#50672;&#49845; &#51200;&#45328;&#51012; &#50416;&#45716; &#51060;&#50976;&#45716;?',a:['&#50672;&#49845; &#54056;&#53556;&#44284; &#51652;&#54665;&#49345;&#54889; &#54028;&#50501;','&#49440;&#49373;&#45784;&#44760; &#48372;&#50668;&#51452;&#47140;&#44256;','&#50501;&#44592; &#49688;&#47532; &#50696;&#50557;','SNS &#50629;&#47196;&#46300;&#50857;'],c:0},
  {q:'&#45800;3&#46020; &#51064;&#53552;&#48268;&#51032; &#53945;&#51669;&#51008;?',a:['&#49836;&#54536; &#45712;&#45196;','&#48157;&#51008; &#45712;&#45196;','&#44596;&#51109;&#44048;','&#50756;&#51204;&#54620; &#50504;&#51221;&#44048;'],c:0},
  {q:'&#44257; &#45212;&#51060;&#46020; &#51652;&#54665; &#47605;&#51032; &#47785;&#51201;&#51008;?',a:['&#52404;&#44228;&#51201;&#51064; &#54617;&#49845; &#44221;&#47196; &#51228;&#44277;','&#47784;&#46160; &#44257;&#51012; &#54620; &#48264;&#50640; &#50672;&#51452;','&#50612;&#47140;&#50868; &#44257;&#48512;&#53552; &#50672;&#49845;','&#51316;&#50500;&#54616;&#45716; &#44257;&#47564; &#50672;&#49845;'],c:0},
  {q:'&#48708;&#48652;&#46972;&#53664;&#51032; narrow-fast &#54532;&#47532;&#49483;&#51008;?',a:['&#51340;&#51008; &#54253; + &#48736;&#47480; &#49549;&#46020;','&#45331;&#51008; &#54253; + &#45712;&#47536; &#49549;&#46020;','&#51473;&#44036; + &#51473;&#44036;','&#54253; &#50630;&#51060; &#48736;&#47476;&#44172;'],c:0},
  {q:'&#46272;&#50659;&#44284; &#53944;&#47532;&#50724;&#51032; &#52264;&#51060;&#45716;?',a:['&#50672;&#51452;&#51088; &#49688; (2&#47749; vs 3&#47749;)','&#50501;&#44592; &#51333;&#47448;','&#50672;&#51452; &#49549;&#46020;','&#51020;&#50501; &#51109;&#47476;'],c:0},
  {q:'&#54588;&#50500;&#45432; &#48152;&#51452;&#50640;&#49436; &#48148;&#51060;&#50732;&#47536;&#51032; &#50669;&#54624;&#51008;?',a:['&#47708;&#47196;&#46356; &#46972;&#51064; &#50672;&#51452;','&#48288;&#51060;&#49828; &#46972;&#51064;','&#47532;&#46316;&#47564; &#50672;&#51452;','&#54252;&#51648;&#49496; &#50672;&#49845;'],c:0},
  {q:'&#51116;&#51592; &#54633;&#51452;&#51032; &#53945;&#51669;&#51008;?',a:['&#51593;&#55141;&#51201; &#50669;&#54624; &#48320;&#54872;','&#51221;&#54869;&#54620; &#50501;&#48372; &#46384;&#46972;&#44032;&#44592;','&#49556;&#47196; &#50672;&#51452;&#47564;','&#53440;&#50501;&#50501;&#44592;&#47564; &#49324;&#50857;'],c:0},
  {q:'&#50672;&#49845; &#51200;&#45328;&#50640;&#49436; &#52628;&#51201;&#54616;&#45716; &#44592;&#48516;&#51008; &#47751; &#44032;&#51648;?',a:['5&#44032;&#51648;','3&#44032;&#51648;','10&#44032;&#51648;','&#44592;&#48516; &#50630;&#51020;'],c:0}
];
var quizV14Idx=0,quizV14Score=0,quizV14Done=false;
function createQuizV14Panel(){
  var panel=document.createElement('div');panel.id='quizV14Panel';
  panel.innerHTML='<span class="v14Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#10067; &#54140;&#51592; v14</h3>'+
    '<div id="quizV14Area" style="width:100%;max-width:420px;"></div>';
  document.body.appendChild(panel);
}
function startQuizV14(){quizV14Idx=0;quizV14Score=0;quizV14Done=false;renderQuizV14();}
function renderQuizV14(){
  var area=document.getElementById('quizV14Area');if(!area)return;
  if(quizV14Idx>=quizV14Questions.length){
    var pct=Math.round(quizV14Score/quizV14Questions.length*100);
    area.innerHTML='<div class="v14Info" style="text-align:center"><b>&#44208;&#44284;: '+quizV14Score+'/'+quizV14Questions.length+' ('+pct+'%)</b><br>'+
      (pct>=80?'&#127942; &#50864;&#49688;!':'&#128170; &#45796;&#49884; &#46020;&#51204;&#54616;&#49464;&#50836;!')+'</div>';
    if(pct>=80)unlockAch('quiz_v14_ace');
    quizV14Done=true;return;
  }
  var q=quizV14Questions[quizV14Idx];
  var html='<div class="v14Info"><b>Q'+(quizV14Idx+1)+'/'+quizV14Questions.length+'</b><br>'+q.q+'</div>';
  q.a.forEach(function(a,i){
    html+='<div class="v14Card" onclick="answerQuizV14('+i+')">'+a+'</div>';
  });
  html+='<div class="v14Progress"><div class="bar" style="width:'+Math.round(quizV14Idx/quizV14Questions.length*100)+'%"></div></div>';
  area.innerHTML=html;
}
window.answerQuizV14=function(idx){
  if(quizV14Done)return;
  var q=quizV14Questions[quizV14Idx];
  if(idx===q.c){quizV14Score++;v14Sfx('quiz_v14');}
  quizV14Idx++;renderQuizV14();
};

/* ─── 12. NEW SONGS (10곡 추가: 104→114) ─── */
(function addSongs(){
  if(typeof window.SONG_DATA==='undefined')return;
  var newSongs=[
    {title:'&#52852;&#45436;&#48320;&#51452;&#44257;',artist:'&#54028;&#54764;&#48296;',difficulty:3,notes:[[0,'D4',500],[600,'F#4',500],[1200,'A4',500],[1800,'D5',500],[2400,'C#5',400],[2900,'A4',400],[3400,'F#4',600]]},
    {title:'&#50500;&#48288;&#47560;&#47532;&#50500;(&#44396;&#45432;)',artist:'&#44396;&#45432;',difficulty:3,notes:[[0,'C5',600],[700,'E5',400],[1200,'G5',600],[1900,'C6',400],[2400,'B5',400],[2900,'G5',400],[3400,'E5',600]]},
    {title:'&#46972;&#53356;&#47532;&#47784;&#49324;',artist:'&#47784;&#52264;&#47476;&#53944;',difficulty:4,notes:[[0,'D4',400],[500,'D4',200],[800,'E4',400],[1300,'F4',600],[2000,'E4',300],[2400,'D4',300],[2800,'C#4',600]]},
    {title:'&#52264;&#47476;&#45796;&#49884;',artist:'&#47788;&#54000;',difficulty:5,notes:[[0,'A4',200],[250,'B4',200],[500,'C#5',200],[750,'D5',200],[1000,'E5',150],[1200,'F#5',150],[1400,'G#5',200],[1700,'A5',600]]},
    {title:'&#52824;&#44256;&#51060;&#45320;&#47476;&#48148;&#51060;&#51232;',artist:'&#49324;&#46972;&#49324;&#53580;',difficulty:5,notes:[[0,'G5',150],[200,'A5',150],[400,'B5',150],[600,'C6',200],[900,'B5',200],[1200,'A5',200],[1500,'G5',150],[1700,'F#5',150],[1900,'E5',300]]},
    {title:'&#49436;&#44257;(&#50956;&#47532;&#50628;&#53588;)',artist:'&#47196;&#49884;&#45768;',difficulty:4,notes:[[0,'E5',300],[400,'E5',200],[700,'F#5',300],[1100,'G5',400],[1600,'A5',300],[2000,'G5',300],[2400,'F#5',300],[2800,'E5',500]]},
    {title:'&#49324;&#44228;-&#50668;&#47492;',artist:'&#48708;&#48156;&#46356;',difficulty:5,notes:[[0,'E5',150],[200,'F#5',150],[400,'G5',200],[700,'A5',200],[1000,'B5',150],[1200,'C6',150],[1400,'B5',200],[1700,'A5',200],[2000,'G5',300]]},
    {title:'&#49884;&#52832;&#47532;&#50500;&#45208;(&#48148;&#54840;)',artist:'&#48148;&#54840;',difficulty:3,notes:[[0,'E4',500],[600,'G4',300],[1000,'B4',500],[1600,'E5',300],[2000,'D5',500],[2600,'B4',300],[3000,'G4',600]]},
    {title:'&#47700;&#46356;&#53580;&#51060;&#49496;',artist:'&#47560;&#49828;&#45348;',difficulty:4,notes:[[0,'D5',700],[800,'E5',300],[1200,'F#5',500],[1800,'G5',300],[2200,'A5',700],[3000,'F#5',400],[3500,'D5',600]]},
    {title:'&#47196;&#47581;&#49828;',artist:'&#48288;&#53664;&#48292;',difficulty:3,notes:[[0,'F4',600],[700,'A4',300],[1100,'C5',600],[1800,'F5',300],[2200,'E5',500],[2800,'D5',300],[3200,'C5',600]]}
  ];
  newSongs.forEach(function(s){
    var exists=window.SONG_DATA.some(function(ex){return ex.title===s.title;});
    if(!exists)window.SONG_DATA.push(s);
  });
})();

/* ─── 13. NEW LESSONS (10레슨 추가: 130→140) ─── */
(function addLessons(){
  if(typeof window.LESSON_DATA==='undefined')return;
  var newLessons=[
    {id:'int_basic',title:'&#51064;&#53552;&#48268; &#44592;&#52488;',desc:'2&#46020;&#50752; 3&#46020; &#51064;&#53552;&#48268; &#44396;&#48324;&#54616;&#44592;',level:4},
    {id:'int_adv',title:'&#51064;&#53552;&#48268; &#49900;&#54868;',desc:'6&#46020;/7&#46020; &#48143; &#48152;&#51020;&#44228; &#51064;&#53552;&#48268; &#54984;&#47144;',level:7},
    {id:'dict_intro',title:'&#47708;&#47196;&#46357; &#46357;&#53580;&#51060;&#49496; &#51077;&#47928;',desc:'4&#51020; &#47708;&#47196;&#46356; &#48155;&#50500;&#50416;&#44592; &#50672;&#49845;',level:5},
    {id:'bow_speed',title:'&#48372;&#51081; &#49549;&#46020; &#51312;&#51208;',desc:'&#45712;&#47536;/&#48736;&#47480; &#48372;&#51081; &#49549;&#46020; &#50672;&#49845;',level:5},
    {id:'bow_pressure',title:'&#48372;&#51081; &#50517;&#47141; &#51312;&#51208;',desc:'&#44032;&#48317;&#50868;/&#44053;&#54620; &#50517;&#47141; &#54364;&#54788;&#47141; &#50672;&#49845;',level:6},
    {id:'vib_narrow',title:'&#51340;&#51008; &#48708;&#48652;&#46972;&#53664;',desc:'&#49552;&#44032;&#46973; &#51089;&#51008; &#50880;&#51649;&#51076;&#51004;&#47196; &#48708;&#48652;&#46972;&#53664; &#49884;&#51089;',level:6},
    {id:'vib_wide',title:'&#45331;&#51008; &#48708;&#48652;&#46972;&#53664;',desc:'&#54253;&#45331;&#51008; &#48708;&#48652;&#46972;&#53664;&#47196; &#44048;&#49457;&#51201; &#54364;&#54788;',level:8},
    {id:'ens_duet',title:'&#46272;&#50659; &#54633;&#51452; &#51077;&#47928;',desc:'2&#49457;&#48512; &#54633;&#51452;&#50640;&#49436; &#45236; &#50669;&#54624; &#52286;&#44592;',level:5},
    {id:'pitch_train',title:'&#51020;&#51221; &#51221;&#54869;&#46020; &#54693;&#49345;',desc:'&#44033; &#54252;&#51648;&#49496;&#48324; &#51020;&#51221; &#52264;&#51060; &#51460;&#51060;&#44592;',level:6},
    {id:'v14_grad',title:'v14 &#51320;&#50629;',desc:'&#47784;&#46304; v14 &#44592;&#45733;&#51012; &#52404;&#54744;&#54616;&#47732; &#50756;&#47308;',level:9}
  ];
  newLessons.forEach(function(l){
    var exists=window.LESSON_DATA.some(function(ex){return ex.id===l.id;});
    if(!exists)window.LESSON_DATA.push(l);
  });
})();

/* ─── 14. ACHIEVEMENTS (12개 추가: 106→118) ─── */
var V14_ACHS=[
  {id:'interval_student',icon:'&#127925;',name:'&#51064;&#53552;&#48268; &#51077;&#47928;',desc:'&#51064;&#53552;&#48268; &#53944;&#47112;&#51060;&#45789; 10&#54924; &#50756;&#47308;'},
  {id:'dictation_student',icon:'&#127911;',name:'&#46357;&#53580;&#51060;&#49496; &#51077;&#47928;',desc:'&#47708;&#47196;&#46357; &#46357;&#53580;&#51060;&#49496; 5&#54924; &#50756;&#47308;'},
  {id:'dictation_ace',icon:'&#127942;',name:'&#46357;&#53580;&#51060;&#49496; &#50640;&#51060;&#49828;',desc:'80% &#51060;&#49345; &#51221;&#45813;&#47456;'},
  {id:'bow_analyst',icon:'&#127931;',name:'&#48372;&#51081; &#48516;&#49437;&#44032;',desc:'&#48372;&#51081; &#48516;&#49437; 3&#49464;&#49496; &#44592;&#47197;'},
  {id:'bow_master',icon:'&#128200;',name:'&#48372;&#51081; &#47560;&#49828;&#53552;',desc:'&#48372;&#51081; &#48516;&#49437; 10&#49464;&#49496; &#44592;&#47197;'},
  {id:'vibrato_student',icon:'&#12336;',name:'&#48708;&#48652;&#46972;&#53664; &#51077;&#47928;',desc:'&#48708;&#48652;&#46972;&#53664; 3&#49464;&#49496; &#50672;&#49845;'},
  {id:'vibrato_master',icon:'&#127775;',name:'&#48708;&#48652;&#46972;&#53664; &#47560;&#49828;&#53552;',desc:'12&#49464;&#49496; &#50672;&#49845; &#50756;&#47308;'},
  {id:'pitch_tracker',icon:'&#127912;',name:'&#51020;&#51221; &#52628;&#51201;&#44032;',desc:'&#51020;&#51221; &#51221;&#54869;&#46020; 5&#54924; &#44592;&#47197;'},
  {id:'journal_keeper',icon:'&#128221;',name:'&#51200;&#45328; &#44592;&#47197;&#44032;',desc:'&#50672;&#49845; &#51200;&#45328; 10&#44148; &#51089;&#49457;'},
  {id:'journal_master',icon:'&#128214;',name:'&#51200;&#45328; &#47560;&#49828;&#53552;',desc:'&#50672;&#49845; &#51200;&#45328; 50&#44148; &#51089;&#49457;'},
  {id:'ensemble_player',icon:'&#127930;',name:'&#54633;&#51452; &#50672;&#51452;&#51088;',desc:'3&#51333; &#54633;&#51452; &#52404;&#54744;'},
  {id:'ensemble_master',icon:'&#129351;',name:'&#54633;&#51452; &#47560;&#49828;&#53552;',desc:'6&#51333; &#54633;&#51452; &#51204;&#48512; &#52404;&#54744;'},
  {id:'quiz_v14_ace',icon:'&#128175;',name:'&#54140;&#51592; v14 &#50640;&#51060;&#49828;',desc:'80% &#51060;&#49345; &#51221;&#45813;'}
];

/* ─── 15. UI INTEGRATION ─── */
(function integrateUI(){
  createIntervalPanel();createDictPanel();createBowPanel();createVibPanel();
  createPitchPanel();createJournalPanel();createSongmapPanel();createEnsemblePanel();createQuizV14Panel();
  drawIntervalCanvas();drawDictCanvas();drawBowCanvas();drawVibCanvas();
  drawPitchCanvas();drawSongmapCanvas();

  var openInterval=function(){drawIntervalCanvas();document.getElementById('intervalPanel').classList.add('show');v14Sfx('feature_open14');};
  var openDict=function(){drawDictCanvas();document.getElementById('dictPanel').classList.add('show');v14Sfx('feature_open14');};
  var openBow=function(){drawBowCanvas();document.getElementById('bowPanel').classList.add('show');v14Sfx('feature_open14');};
  var openVib=function(){drawVibCanvas();document.getElementById('vibPanel').classList.add('show');v14Sfx('feature_open14');};
  var openPitch=function(){drawPitchCanvas();document.getElementById('pitchPanel').classList.add('show');v14Sfx('feature_open14');};
  var openJournal=function(){renderJournal();document.getElementById('journalPanel').classList.add('show');v14Sfx('feature_open14');};
  var openSongmap=function(){drawSongmapCanvas();document.getElementById('songmapPanel').classList.add('show');v14Sfx('feature_open14');};
  var openEnsemble=function(){document.getElementById('ensemblePanel').classList.add('show');v14Sfx('feature_open14');};
  var openQuiz=function(){startQuizV14();document.getElementById('quizV14Panel').classList.add('show');v14Sfx('feature_open14');};

  var nav=document.createElement('div');nav.className='v14Nav';
  var navItems=[
    {text:'&#127925; &#51064;&#53552;&#48268;',action:openInterval},
    {text:'&#127911; &#46357;&#53580;&#51060;&#49496;',action:openDict},
    {text:'&#127931; &#48372;&#51081;&#48516;&#49437;',action:openBow},
    {text:'&#12336; &#48708;&#48652;&#46972;&#53664;',action:openVib},
    {text:'&#127912; &#51020;&#51221;&#47605;',action:openPitch},
    {text:'&#128221; &#51200;&#45328;',action:openJournal},
    {text:'&#128506; &#44257;&#47605;',action:openSongmap},
    {text:'&#127930; &#54633;&#51452;',action:openEnsemble},
    {text:'&#10067; &#54140;&#51592;v14',action:openQuiz}
  ];
  navItems.forEach(function(item){
    var btn=document.createElement('div');btn.className='v14NavBtn';btn.innerHTML=item.text;
    btn.addEventListener('pointerdown',function(e){e.preventDefault();item.action();});
    nav.appendChild(btn);
  });
  document.body.appendChild(nav);

  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    if(!e.shiftKey)return;
    switch(e.key){
      case'Q':e.preventDefault();openInterval();break;
      case'W':e.preventDefault();openDict();break;
      case'E':e.preventDefault();openBow();break;
      case'R':e.preventDefault();openVib();break;
      case'T':e.preventDefault();openPitch();break;
      case'Y':e.preventDefault();openJournal();break;
      case'U':e.preventDefault();openSongmap();break;
      case'I':e.preventDefault();openEnsemble();break;
    }
    if(e.key==='Escape'){
      stopVibAnim();stopEnsemble();
      document.querySelectorAll('#intervalPanel,#dictPanel,#bowPanel,#vibPanel,#pitchPanel,#journalPanel,#songmapPanel,#ensemblePanel,#quizV14Panel').forEach(function(p){p.classList.remove('show');});
    }
  });

  var titleEl=document.querySelector('#hd h1');
  if(titleEl)titleEl.innerHTML='&#127931; Violin Real <span style="font-size:8px;color:#ff6644;vertical-align:super">v14</span>';
  var logoEl=document.getElementById('logo');if(logoEl)logoEl.textContent='Violin Real v14';
})();

window.VIOLIN_VERSION='14.0';
})();
