/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v13.0 PATCH MODULE
   다이내믹트레이너Canvas6단계+아르페지오연습기12종Canvas+
   튜닝도우미CanvasMeter+연습스트릭30일Canvas히트맵+
   바이올린관리가이드12종+음악장르탐험12종+기초자세클리닉8종+
   연습타이머포모도로Canvas+10곡추가(94→104)+10레슨(120→130)+
   15퀴즈추가(45→60)+12업적추가(94→106)+SFX12종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V13Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V13_LOADED)return;window.__V13_LOADED=true;

/* ─── HELPERS ─── */
function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(p){var old=loadProgress();Object.assign(old,p);localStorage.setItem('violinProgress',JSON.stringify(old));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function loadStats(){try{return JSON.parse(localStorage.getItem('violinStats')||'{}');}catch(e){return {};}}
function saveStats(s){localStorage.setItem('violinStats',JSON.stringify(s));}
function unlockAch(id){
  var achs=loadAchievements();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  var info=V13_ACHS.find(function(a){return a.id===id;});
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
var actx13=null;
function v13Sfx(type){
  try{
    if(!actx13)actx13=new(window.AudioContext||window.webkitAudioContext)();
    var o=actx13.createOscillator(),g=actx13.createGain();
    o.connect(g);g.connect(actx13.destination);
    var now=actx13.currentTime;
    var presets={
      dynamic_play:{f:440,w:'sine',a:.14,d:.5},
      arpeggio_note:{f:523,w:'triangle',a:.1,d:.3},
      tuner_ping:{f:440,w:'sine',a:.12,d:.6},
      streak_check:{f:698,w:'triangle',a:.08,d:.25},
      care_open:{f:392,w:'sine',a:.08,d:.3},
      genre_play:{f:587,w:'triangle',a:.12,d:.45},
      posture_view:{f:349,w:'sine',a:.07,d:.25},
      timer_tick:{f:1047,w:'square',a:.04,d:.08},
      timer_done:{f:784,w:'sine',a:.15,d:.6},
      quiz_v13:{f:660,w:'square',a:.06,d:.2},
      achieve_v13:{f:880,w:'sine',a:.16,d:.7},
      feature_open13:{f:494,w:'triangle',a:.09,d:.25}
    };
    var p=presets[type]||presets.feature_open13;
    o.type=p.w;o.frequency.setValueAtTime(p.f,now);
    g.gain.setValueAtTime(p.a,now);g.gain.exponentialRampToValueAtTime(.001,now+p.d);
    o.start(now);o.stop(now+p.d);
  }catch(e){}
}

/* ─── 2. CSS INJECTION ─── */
var sty13=document.createElement('style');
sty13.textContent=`
#dynPanel,#arpPanel,#tunerPanel,#streakPanel,#carePanel,#genrePanel,#posturePanel,#timerPanel,#quizV13Panel{
  display:none;position:fixed;inset:0;z-index:223;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#dynPanel.show,#arpPanel.show,#tunerPanel.show,#streakPanel.show,#carePanel.show,
#genrePanel.show,#posturePanel.show,#timerPanel.show,#quizV13Panel.show{display:flex;}
#dynPanel h3,#arpPanel h3,#tunerPanel h3,#streakPanel h3,#carePanel h3,
#genrePanel h3,#posturePanel h3,#timerPanel h3,#quizV13Panel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#dynCanvas,#arpCanvas,#tunerCanvas,#streakCanvas,#timerCanvas{
  border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.v13Info{width:100%;max-width:400px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;font-size:10px;color:rgba(240,230,200,.7);line-height:1.6;}
.v13Card{width:100%;max-width:380px;padding:10px 12px;margin:4px 0;
  background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.12);
  border-radius:8px;font-size:11px;color:rgba(240,230,200,.8);cursor:pointer;
  transition:background .2s,border-color .2s;}
.v13Card:hover{background:rgba(255,215,0,.08);border-color:rgba(255,215,0,.3);}
.v13Card.done{border-color:rgba(76,175,80,.4);background:rgba(76,175,80,.06);}
.v13Btn{display:inline-block;padding:6px 14px;margin:4px;border-radius:6px;
  background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.25);
  color:#ffd700;font-size:10px;cursor:pointer;transition:background .2s;}
.v13Btn:hover{background:rgba(255,215,0,.22);}
.v13Btn.active{background:rgba(255,215,0,.3);border-color:#ffd700;}
.v13Close{position:sticky;top:0;align-self:flex-end;font-size:18px;cursor:pointer;
  color:#888;z-index:10;padding:4px 8px;}
.v13Close:hover{color:#ffd700;}
.v13Nav{position:fixed;bottom:0;left:0;right:0;z-index:224;background:rgba(26,16,32,.95);
  border-top:1px solid rgba(255,215,0,.1);display:flex;overflow-x:auto;
  padding:6px 8px;gap:6px;-webkit-overflow-scrolling:touch;}
.v13NavBtn{flex:0 0 auto;padding:5px 10px;border-radius:12px;font-size:10px;
  background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.15);
  color:#c9a96e;white-space:nowrap;cursor:pointer;transition:all .2s;}
.v13NavBtn:hover{background:rgba(255,215,0,.2);color:#ffd700;}
.v13Progress{width:100%;max-width:380px;height:6px;background:rgba(255,255,255,.08);
  border-radius:3px;margin:6px 0;overflow:hidden;}
.v13Progress .bar{height:100%;background:linear-gradient(90deg,#D4894A,#ffd700);
  border-radius:3px;transition:width .4s;}
`;
document.head.appendChild(sty13);

/* ─── 3. DYNAMIC TRAINER (다이내믹 트레이너) ─── */
var dynLevels=[
  {name:'pp (피아니시모)',desc:'매우 여리게',vol:.08,color:'#6699cc'},
  {name:'p (피아노)',desc:'여리게',vol:.15,color:'#7799dd'},
  {name:'mp (메조피아노)',desc:'조금 여리게',vol:.25,color:'#88aaee'},
  {name:'mf (메조포르테)',desc:'조금 세게',vol:.4,color:'#ddaa44'},
  {name:'f (포르테)',desc:'세게',vol:.6,color:'#ee8833'},
  {name:'ff (포르티시모)',desc:'매우 세게',vol:.8,color:'#ff5533'}
];
var dynCurrent=0,dynPlaying=false,dynOsc=null,dynGain=null;
function createDynPanel(){
  var panel=document.createElement('div');panel.id='dynPanel';
  panel.innerHTML='<span class="v13Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#127925; &#45796;&#51060;&#45208;&#48121; &#53944;&#47112;&#51060;&#45320;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">&#44053;&#50557; &#54364;&#54788;&#51012; &#50672;&#49845;&#54616;&#49464;&#50836;. &#44033; &#45800;&#44228;&#47484; &#53944;&#47112;&#51060;&#45320;&#50640;&#49436; &#52404;&#54744;&#54633;&#45768;&#45796;.</p>'+
    '<canvas id="dynCanvas" width="400" height="200"></canvas>'+
    '<div id="dynLevels" style="width:100%;max-width:400px;"></div>'+
    '<div style="margin-top:8px"><span class="v13Btn" id="dynPlayBtn">&#9654; &#51116;&#49373;</span> <span class="v13Btn" id="dynStopBtn">&#9632; &#51221;&#51648;</span></div>'+
    '<div class="v13Info" id="dynInfo">&#45796;&#51060;&#45208;&#48121; &#45800;&#44228;&#47484; &#49440;&#53469;&#54616;&#44256; &#51116;&#49373;&#51012; &#45572;&#47476;&#49464;&#50836;</div>';
  document.body.appendChild(panel);
  var lvlDiv=document.getElementById('dynLevels');
  dynLevels.forEach(function(lv,i){
    var card=document.createElement('div');card.className='v13Card';
    card.innerHTML='<b style="color:'+lv.color+'">'+lv.name+'</b> - '+lv.desc+' (&#48380;&#47464;: '+Math.round(lv.vol*100)+'%)';
    card.onclick=function(){dynCurrent=i;drawDynCanvas();v13Sfx('dynamic_play');
      document.querySelectorAll('#dynLevels .v13Card').forEach(function(c,j){c.classList.toggle('active',j===i);});};
    lvlDiv.appendChild(card);
  });
  document.getElementById('dynPlayBtn').onclick=function(){playDyn();};
  document.getElementById('dynStopBtn').onclick=function(){stopDyn();};
}
function drawDynCanvas(){
  var c=document.getElementById('dynCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,400,200);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,400,200);
  ctx.strokeStyle='rgba(255,215,0,.1)';ctx.lineWidth=1;
  for(var i=0;i<6;i++){var y=30+i*28;ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(380,y);ctx.stroke();}
  dynLevels.forEach(function(lv,i){
    var x=50+i*58,h=lv.vol*140,y=190-h;
    var grd=ctx.createLinearGradient(x,y,x,190);
    grd.addColorStop(0,lv.color);grd.addColorStop(1,'rgba(0,0,0,.3)');
    ctx.fillStyle=grd;ctx.fillRect(x,y,36,h);
    if(i===dynCurrent){ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.strokeRect(x-2,y-2,40,h+4);ctx.lineWidth=1;}
    ctx.fillStyle='rgba(240,230,200,.7)';ctx.font='9px Georgia';ctx.textAlign='center';
    ctx.fillText(lv.name.split(' ')[0],x+18,198);
  });
  ctx.fillStyle='#ffd700';ctx.font='bold 11px Georgia';ctx.textAlign='center';
  ctx.fillText('Dynamic Level Meter',200,18);
}
function playDyn(){
  stopDyn();
  try{
    if(!actx13)actx13=new(window.AudioContext||window.webkitAudioContext)();
    dynOsc=actx13.createOscillator();dynGain=actx13.createGain();
    dynOsc.connect(dynGain);dynGain.connect(actx13.destination);
    dynOsc.type='sine';dynOsc.frequency.setValueAtTime(440,actx13.currentTime);
    dynGain.gain.setValueAtTime(dynLevels[dynCurrent].vol*.3,actx13.currentTime);
    dynOsc.start();dynPlaying=true;
    addHistory('dynamic','&#45796;&#51060;&#45208;&#48121; &#50672;&#49845;: '+dynLevels[dynCurrent].name);
    var prog=loadProgress();prog.dynPracticed=(prog.dynPracticed||0)+1;saveProgress(prog);
    if(prog.dynPracticed>=3)unlockAch('dyn_student');
    if(prog.dynPracticed>=6)unlockAch('dyn_master');
  }catch(e){}
}
function stopDyn(){
  if(dynOsc){try{dynOsc.stop();}catch(e){}dynOsc=null;dynPlaying=false;}
}

/* ─── 4. ARPEGGIO TRAINER (아르페지오 연습기) ─── */
var arpeggios=[
  {name:'C Major',notes:[261.63,329.63,392,523.25],color:'#88ccff'},
  {name:'G Major',notes:[392,493.88,587.33,784],color:'#99ddaa'},
  {name:'D Major',notes:[293.66,369.99,440,587.33],color:'#ffcc66'},
  {name:'A Major',notes:[440,554.37,659.25,880],color:'#ff9966'},
  {name:'E Major',notes:[329.63,415.3,493.88,659.25],color:'#ff7799'},
  {name:'F Major',notes:[349.23,440,523.25,698.46],color:'#aa88ff'},
  {name:'Am (단조)',notes:[440,523.25,659.25,880],color:'#7799bb'},
  {name:'Dm (단조)',notes:[293.66,349.23,440,587.33],color:'#889988'},
  {name:'Em (단조)',notes:[329.63,392,493.88,659.25],color:'#998877'},
  {name:'Cm (단조)',notes:[261.63,311.13,392,523.25],color:'#777799'},
  {name:'Diminished',notes:[261.63,311.13,369.99,440],color:'#aa6655'},
  {name:'Augmented',notes:[261.63,329.63,415.3,523.25],color:'#55aa88'}
];
var arpCurrent=0,arpPlaying=false;
function createArpPanel(){
  var panel=document.createElement('div');panel.id='arpPanel';
  panel.innerHTML='<span class="v13Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#127926; &#50500;&#47476;&#54168;&#51648;&#50724; &#50672;&#49845;&#44592;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">12&#51333; &#50500;&#47476;&#54168;&#51648;&#50724; &#54056;&#53556;&#51012; &#50672;&#49845;&#54616;&#49464;&#50836;</p>'+
    '<canvas id="arpCanvas" width="420" height="220"></canvas>'+
    '<div id="arpList" style="width:100%;max-width:420px;display:grid;grid-template-columns:1fr 1fr;gap:4px;"></div>'+
    '<div style="margin-top:8px"><span class="v13Btn" id="arpPlayBtn">&#9654; &#51116;&#49373;</span></div>';
  document.body.appendChild(panel);
  var list=document.getElementById('arpList');
  arpeggios.forEach(function(a,i){
    var card=document.createElement('div');card.className='v13Card';
    card.innerHTML='<span style="color:'+a.color+'">&#9835;</span> '+a.name;
    card.onclick=function(){arpCurrent=i;drawArpCanvas();v13Sfx('arpeggio_note');};
    list.appendChild(card);
  });
  document.getElementById('arpPlayBtn').onclick=function(){playArpeggio();};
}
function drawArpCanvas(){
  var c=document.getElementById('arpCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,420,220);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,420,220);
  var arp=arpeggios[arpCurrent];
  ctx.fillStyle='#ffd700';ctx.font='bold 11px Georgia';ctx.textAlign='center';
  ctx.fillText('Arpeggio: '+arp.name,210,18);
  ctx.strokeStyle='rgba(255,215,0,.08)';
  for(var i=0;i<5;i++){var y=40+i*35;ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(400,y);ctx.stroke();}
  arp.notes.forEach(function(freq,i){
    var x=60+i*90,h=Math.log2(freq/200)*60,y=180-h;
    ctx.beginPath();ctx.arc(x,y,16,0,Math.PI*2);
    ctx.fillStyle=arp.color;ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 10px monospace';ctx.textAlign='center';
    ctx.fillText(Math.round(freq)+'Hz',x,y+4);
    if(i<arp.notes.length-1){
      var nx=60+(i+1)*90,nh=Math.log2(arp.notes[i+1]/200)*60,ny=180-nh;
      ctx.beginPath();ctx.moveTo(x+16,y);ctx.lineTo(nx-16,ny);
      ctx.strokeStyle=arp.color;ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1;
    }
  });
  ctx.fillStyle='rgba(200,190,160,.5)';ctx.font='9px Georgia';
  ctx.fillText('&#8593; &#44033; &#45432;&#53944;&#47484; &#49692;&#49436;&#45824;&#47196; &#50672;&#51452;&#54616;&#49464;&#50836;',210,210);
}
function playArpeggio(){
  if(!actx13)actx13=new(window.AudioContext||window.webkitAudioContext)();
  var arp=arpeggios[arpCurrent];
  arp.notes.forEach(function(freq,i){
    var o=actx13.createOscillator(),g=actx13.createGain();
    o.connect(g);g.connect(actx13.destination);
    o.type='triangle';o.frequency.setValueAtTime(freq,actx13.currentTime+i*.4);
    g.gain.setValueAtTime(0,actx13.currentTime+i*.4);
    g.gain.linearRampToValueAtTime(.15,actx13.currentTime+i*.4+.05);
    g.gain.exponentialRampToValueAtTime(.001,actx13.currentTime+i*.4+.35);
    o.start(actx13.currentTime+i*.4);o.stop(actx13.currentTime+i*.4+.4);
  });
  var prog=loadProgress();prog.arpPlayed=(prog.arpPlayed||0)+1;saveProgress(prog);
  if(prog.arpPlayed>=3)unlockAch('arp_student');
  if(prog.arpPlayed>=12)unlockAch('arp_master');
  addHistory('arpeggio','&#50500;&#47476;&#54168;&#51648;&#50724; &#50672;&#49845;: '+arp.name);
}

/* ─── 5. TUNING HELPER (튜닝 도우미) ─── */
var tunerStrings=[
  {name:'G3',freq:196,color:'#ff6644'},
  {name:'D4',freq:293.66,color:'#ffaa33'},
  {name:'A4',freq:440,color:'#44cc66'},
  {name:'E5',freq:659.25,color:'#4488ff'}
];
var tunerCurrent=0,tunerOsc=null;
function createTunerPanel(){
  var panel=document.createElement('div');panel.id='tunerPanel';
  panel.innerHTML='<span class="v13Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#127931; &#53916;&#45789; &#46020;&#50864;&#48120;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">&#44033; &#54788;&#51032; &#44592;&#51456;&#51020;&#51012; &#46307;&#44256; &#53916;&#45789;&#54616;&#49464;&#50836;</p>'+
    '<canvas id="tunerCanvas" width="360" height="240"></canvas>'+
    '<div id="tunerBtns" style="display:flex;gap:8px;margin:8px 0;flex-wrap:wrap;justify-content:center;"></div>'+
    '<div style="margin-top:4px"><span class="v13Btn" id="tunerPlayBtn">&#9654; &#44592;&#51456;&#51020; &#51116;&#49373;</span> <span class="v13Btn" id="tunerStopBtn">&#9632; &#51221;&#51648;</span></div>';
  document.body.appendChild(panel);
  var btns=document.getElementById('tunerBtns');
  tunerStrings.forEach(function(s,i){
    var btn=document.createElement('span');btn.className='v13Btn';
    btn.innerHTML='<span style="color:'+s.color+'">&#9679;</span> '+s.name+' ('+s.freq+'Hz)';
    btn.onclick=function(){tunerCurrent=i;drawTunerCanvas();v13Sfx('tuner_ping');
      document.querySelectorAll('#tunerBtns .v13Btn').forEach(function(b,j){b.classList.toggle('active',j===i);});};
    btns.appendChild(btn);
  });
  document.getElementById('tunerPlayBtn').onclick=function(){playTuner();};
  document.getElementById('tunerStopBtn').onclick=function(){stopTuner();};
}
function drawTunerCanvas(){
  var c=document.getElementById('tunerCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,360,240);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,360,240);
  ctx.fillStyle='#ffd700';ctx.font='bold 12px Georgia';ctx.textAlign='center';
  ctx.fillText('Tuning Reference',180,20);
  var s=tunerStrings[tunerCurrent];
  ctx.beginPath();ctx.arc(180,120,60,0,Math.PI*2);
  ctx.strokeStyle=s.color;ctx.lineWidth=3;ctx.stroke();ctx.lineWidth=1;
  ctx.fillStyle=s.color;ctx.font='bold 22px Georgia';ctx.fillText(s.name,180,115);
  ctx.fillStyle='rgba(240,230,200,.8)';ctx.font='14px monospace';ctx.fillText(s.freq+' Hz',180,140);
  for(var i=-3;i<=3;i++){
    var x=180+i*35,cent=i*10;
    ctx.beginPath();ctx.moveTo(x,190);ctx.lineTo(x,200);
    ctx.strokeStyle=i===0?'#4caf50':'rgba(200,190,160,.3)';ctx.lineWidth=i===0?2:1;ctx.stroke();
    ctx.fillStyle=i===0?'#4caf50':'rgba(200,190,160,.4)';ctx.font='8px monospace';
    ctx.fillText((cent>=0?'+':'')+cent,x,212);
  }
  ctx.fillStyle='#4caf50';ctx.font='9px Georgia';ctx.fillText('&#9650; &#51221;&#54869;&#54620; &#53916;&#45789;',180,228);
  tunerStrings.forEach(function(ts,i){
    var x=60+i*80;
    ctx.beginPath();ctx.arc(x,50,8,0,Math.PI*2);
    ctx.fillStyle=i===tunerCurrent?ts.color:'rgba(100,100,100,.4)';ctx.fill();
    ctx.fillStyle=i===tunerCurrent?'#fff':'rgba(200,200,200,.4)';
    ctx.font='8px Georgia';ctx.textAlign='center';ctx.fillText(ts.name,x,68);
  });
}
function playTuner(){
  stopTuner();
  if(!actx13)actx13=new(window.AudioContext||window.webkitAudioContext)();
  tunerOsc=actx13.createOscillator();var g=actx13.createGain();
  tunerOsc.connect(g);g.connect(actx13.destination);
  tunerOsc.type='sine';tunerOsc.frequency.setValueAtTime(tunerStrings[tunerCurrent].freq,actx13.currentTime);
  g.gain.setValueAtTime(.12,actx13.currentTime);
  tunerOsc.start();
  var prog=loadProgress();prog.tunerUsed=(prog.tunerUsed||0)+1;saveProgress(prog);
  if(prog.tunerUsed>=4)unlockAch('tuner_user');
  addHistory('tuner','&#53916;&#45789;: '+tunerStrings[tunerCurrent].name);
}
function stopTuner(){if(tunerOsc){try{tunerOsc.stop();}catch(e){}tunerOsc=null;}}

/* ─── 6. PRACTICE STREAK TRACKER (연습 스트릭 30일) ─── */
function createStreakPanel(){
  var panel=document.createElement('div');panel.id='streakPanel';
  panel.innerHTML='<span class="v13Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#128293; &#50672;&#49845; &#49828;&#53944;&#47533; &#53944;&#47000;&#52964;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">&#50672;&#49549; &#50672;&#49845;&#51068;&#51012; &#52628;&#51201;&#54633;&#45768;&#45796;</p>'+
    '<canvas id="streakCanvas" width="380" height="260"></canvas>'+
    '<div class="v13Info" id="streakInfo"></div>'+
    '<div style="margin-top:8px"><span class="v13Btn" id="streakCheckBtn">&#10003; &#50724;&#45720; &#50672;&#49845; &#50756;&#47308;</span></div>';
  document.body.appendChild(panel);
  document.getElementById('streakCheckBtn').onclick=function(){checkStreak();};
}
function getStreakData(){
  try{return JSON.parse(localStorage.getItem('violinStreak')||'{}');}catch(e){return {};}
}
function checkStreak(){
  var data=getStreakData();
  var today=new Date().toISOString().slice(0,10);
  if(data[today]){document.getElementById('streakInfo').textContent='&#50724;&#45720;&#51008; &#51060;&#48120; &#52404;&#53356;&#46104;&#50632;&#49845;&#45768;&#45796;!';return;}
  data[today]=1;localStorage.setItem('violinStreak',JSON.stringify(data));
  v13Sfx('streak_check');drawStreakCanvas();
  var streak=calcStreak(data);
  document.getElementById('streakInfo').textContent='&#50672;&#49549; '+streak+'&#51068; &#50672;&#49845; &#51473;! &#52509; '+Object.keys(data).length+'&#51068; &#54876;&#46041;';
  var prog=loadProgress();prog.streakMax=Math.max(prog.streakMax||0,streak);saveProgress(prog);
  if(streak>=7)unlockAch('streak_7');
  if(streak>=30)unlockAch('streak_30');
  addHistory('streak','&#50672;&#49845; &#49828;&#53944;&#47533; '+streak+'&#51068;');
}
function calcStreak(data){
  var today=new Date();var streak=0;
  for(var i=0;i<365;i++){
    var d=new Date(today);d.setDate(d.getDate()-i);
    var key=d.toISOString().slice(0,10);
    if(data[key])streak++;else break;
  }
  return streak;
}
function drawStreakCanvas(){
  var c=document.getElementById('streakCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,380,260);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,380,260);
  ctx.fillStyle='#ffd700';ctx.font='bold 11px Georgia';ctx.textAlign='center';
  ctx.fillText('30-Day Practice Heatmap',190,16);
  var data=getStreakData();var today=new Date();
  for(var i=29;i>=0;i--){
    var d=new Date(today);d.setDate(d.getDate()-i);
    var key=d.toISOString().slice(0,10);
    var col=Math.floor((29-i)/7),row=(29-i)%7;
    var x=40+col*70,y=32+row*30;
    ctx.fillStyle=data[key]?'rgba(76,175,80,.7)':'rgba(100,100,100,.2)';
    ctx.fillRect(x,y,56,22);ctx.strokeStyle='rgba(255,215,0,.05)';ctx.strokeRect(x,y,56,22);
    ctx.fillStyle=data[key]?'#fff':'rgba(200,200,200,.3)';ctx.font='8px monospace';ctx.textAlign='center';
    ctx.fillText(d.getDate()+'&#51068;',x+28,y+14);
  }
  var streak=calcStreak(data),total=Object.keys(data).length;
  ctx.fillStyle='rgba(240,230,200,.7)';ctx.font='10px Georgia';ctx.textAlign='center';
  ctx.fillText('&#50672;&#49549; '+streak+'&#51068; | &#52509;&#54876;&#46041; '+total+'&#51068; | &#52572;&#45824; '+(loadProgress().streakMax||streak)+'&#51068;',190,250);
}

/* ─── 7. VIOLIN CARE GUIDE (바이올린 관리 가이드) ─── */
var careGuides=[
  {title:'&#54876; &#53560; &#44288;&#47532;',desc:'&#50672;&#51452; &#54980; &#54876;&#53560;&#51012; &#54400;&#50612;&#51452;&#44256;, 3&#44060;&#50900;&#47560;&#45796; &#51204;&#47928;&#44032;&#50640;&#44172; &#47532;&#54756;&#50612;&#47553; &#48155;&#51004;&#49464;&#50836;. &#53560;&#51060; &#49552;&#49345;&#46104;&#47732; &#51020;&#51656;&#51060; &#45208;&#48736;&#51665;&#45768;&#45796;.'},
  {title:'&#49569;&#51652; &#48148;&#47476;&#44592;',desc:'3~5&#48264; &#50773;&#48373; &#44512;&#51068;&#54616;&#44172; &#48148;&#47476;&#49464;&#50836;. &#45320;&#47924; &#47566;&#51060; &#48148;&#47476;&#47732; &#49548;&#47532;&#44032; &#53441;&#54644;&#51648;&#44256;, &#45320;&#47924; &#51201;&#51004;&#47732; &#48120;&#45124;&#47084;&#51665;&#45768;&#45796;.'},
  {title:'&#54788; &#44368;&#52404; &#49884;&#44592;',desc:'6&#44060;&#50900;~1&#45380; &#51452;&#44592;&#47196; &#44368;&#52404;. E&#54788;&#51008; &#44032;&#51109; &#51088;&#51452; &#45124;&#50612;&#51648;&#44256;, G&#54788;&#51008; &#50724;&#47000; &#44049;&#45768;&#45796;. &#45909;&#51008; &#54788;&#51008; &#51020;&#51656;&#51012; &#50504;&#51221;&#49884;&#53412;&#44256; &#49352; &#54788;&#51008; &#54364;&#54788;&#47141;&#51060; &#51339;&#49845;&#45768;&#45796;.'},
  {title:'&#50728;&#46020;/&#49845;&#46020; &#44288;&#47532;',desc:'15~25&#8451;, &#49845;&#46020; 40~60% &#50976;&#51648;. &#44553;&#44201;&#54620; &#50728;&#46020;&#48320;&#54868;&#45716; &#45208;&#47924;&#50640; &#44552;&#51060; &#44040; &#49688; &#51080;&#49845;&#45768;&#45796;. &#51649;&#49324;&#44305;&#49440;/&#55176;&#53552; &#51649;&#51217; &#45432;&#52636; &#54588;&#54616;&#49464;&#50836;.'},
  {title:'&#52992;&#51060;&#49828; &#48372;&#44288;',desc:'&#50672;&#51452; &#54980; &#48152;&#46300;&#49884; &#52992;&#51060;&#49828;&#50640; &#48372;&#44288;. &#54876;&#51012; &#54400;&#44256;, &#53560;&#50640;&#44592;&#47484; &#45150;&#50612;&#49464;&#50836;. &#51201;&#51208;&#54620; &#49845;&#46020;&#51032; &#49892;&#45236;&#50640; &#48372;&#44288;&#54616;&#49464;&#50836;.'},
  {title:'&#48652;&#47551;&#51648; &#44288;&#47532;',desc:'&#48652;&#47551;&#51648; &#50948;&#52824;&#44032; &#50612;&#44555;&#45208;&#47732; &#51020;&#49353;&#51060; &#48320;&#54633;&#45768;&#45796;. &#51204;&#47928;&#44032;&#50640;&#44172; &#51312;&#51221; &#48155;&#51004;&#49464;&#50836;. &#49828;&#49828;&#47196; &#44148;&#46300;&#47532;&#51648; &#47560;&#49464;&#50836;.'},
  {title:'&#54168;&#44536; &#51312;&#51221;',desc:'&#54168;&#44536; &#45458;&#51060;&#44032; &#45000;&#50640; &#50689;&#54693;&#51012; &#51469;&#45768;&#45796;. &#45000; &#53685;&#51613;&#51060; &#51080;&#45796;&#47732; &#54168;&#44536;&#47484; &#45230;&#52628;&#44256;, &#51020;&#49353;&#51060; &#50557;&#54616;&#47732; &#45458;&#51060;&#49464;&#50836;.'},
  {title:'&#50672;&#51452; &#54980; &#52397;&#49548;',desc:'&#48512;&#46300;&#47084;&#50868; &#52380;&#51004;&#47196; &#48148;&#46356;, &#45000;, &#54788;&#51012; &#45803;&#51004;&#49464;&#50836;. &#49569;&#51652; &#44032;&#47336;&#44032; &#49939;&#51060;&#47732; &#45208;&#47924;&#50640; &#49552;&#49345;&#51012; &#51460; &#49688; &#51080;&#49845;&#45768;&#45796;.'},
  {title:'&#54788; &#44048;&#44592; &#48169;&#48277;',desc:'&#49352; &#54788;&#51012; &#44048;&#51012; &#46412; &#54620; &#48264;&#50640; &#45458;&#51008; &#51020;&#44620;&#51648; &#50732;&#47532;&#51648; &#47568;&#44256;, &#48152;&#51020;&#50473; &#50732;&#47140;&#44032;&#47732;&#49436; &#50504;&#51221;&#49884;&#53412;&#49464;&#50836;.'},
  {title:'&#53580;&#51068;&#54588;&#49828; &#44288;&#47532;',desc:'&#53580;&#51068;&#54588;&#49828;(&#52636;&#48512;)&#50640; &#44048;&#44596;&#51012; &#48516;&#49328;&#49884;&#53412;&#45716; &#50669;&#54624;. &#45113;&#44144;&#45208; &#49828;&#53356;&#47000;&#52824;&#44032; &#51080;&#51004;&#47732; &#44368;&#52404;&#44032; &#54596;&#50836;&#54633;&#45768;&#45796;.'},
  {title:'&#54876; &#48372;&#44288;',desc:'&#54876;&#51012; &#54400;&#50612;&#49436; &#48372;&#44288;&#54616;&#49464;&#50836;. &#54016;&#51012; &#50948;&#54620; &#48324;&#46020; &#52992;&#51060;&#49828;&#45208; &#52860;&#51060; &#54200;&#54620; &#44277;&#44036;&#51012; &#47564;&#46308;&#50612;&#51452;&#49464;&#50836;.'},
  {title:'&#51221;&#44592;&#51216;&#44160;',desc:'6&#44060;&#50900;~1&#45380;&#47560;&#45796; &#51204;&#47928;&#44032; &#51216;&#44160;&#51012; &#48155;&#51004;&#49464;&#50836;. &#45000;/&#54168;&#44536;/&#48652;&#47551;&#51648;/&#51217;&#54633;&#48512;/&#54876;&#53560; &#49345;&#53468;&#47484; &#54869;&#51064;&#54633;&#45768;&#45796;.'}
];
function createCarePanel(){
  var panel=document.createElement('div');panel.id='carePanel';
  panel.innerHTML='<span class="v13Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#128295; &#48148;&#51060;&#50732;&#47536; &#44288;&#47532; &#44032;&#51060;&#46300;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">&#50501;&#44592;&#47484; &#50724;&#47000; &#50416;&#47140;&#47732; &#44288;&#47532;&#44032; &#54596;&#49688;&#51077;&#45768;&#45796;</p>'+
    '<div id="careList" style="width:100%;max-width:400px;"></div>';
  document.body.appendChild(panel);
  var list=document.getElementById('careList');
  var read=loadProgress().careRead||{};
  careGuides.forEach(function(g,i){
    var card=document.createElement('div');card.className='v13Card'+(read[i]?' done':'');
    card.innerHTML='<b>'+(i+1)+'. '+g.title+'</b><div style="margin-top:4px;font-size:9px;color:rgba(200,190,160,.6)">'+g.desc+'</div>';
    card.onclick=function(){
      if(!read[i]){read[i]=1;var prog=loadProgress();prog.careRead=read;saveProgress(prog);
        card.classList.add('done');v13Sfx('care_open');
        var cnt=Object.keys(read).length;
        if(cnt>=6)unlockAch('care_student');if(cnt>=12)unlockAch('care_master');
        addHistory('care','&#44288;&#47532;&#44032;&#51060;&#46300; &#51069;&#44592;: '+g.title);}
    };
    list.appendChild(card);
  });
}

/* ─── 8. MUSIC GENRE EXPLORER (음악 장르 탐험) ─── */
var genres=[
  {name:'&#53364;&#47000;&#49885; (Classical)',desc:'&#48148;&#47196;&#53356;~&#45229;&#47564;&#54028; &#50724;&#52992;&#49828;&#53944;&#46972; &#49556;&#47196; &#47112;&#54140;&#53664;&#47532;',freq:440,w:'sine'},
  {name:'&#48148;&#47196;&#53356; (Baroque)',desc:'&#48148;&#54840;/&#48708;&#48156;&#46356; &#49884;&#45824;. &#50500;&#47476;&#54168;&#51648;&#50724;&#50752; &#53944;&#47540;',freq:392,w:'sine'},
  {name:'&#47196;&#47564;&#54001; (Romantic)',desc:'&#52264;&#51060;&#53076;&#54532;&#49828;&#53412;/&#47708;&#45944;&#49828;&#51316;. &#44048;&#49457;&#51201; &#54364;&#54788;',freq:494,w:'triangle'},
  {name:'&#51116;&#51592; (Jazz)',desc:'&#51593;&#55141;&#44284; &#49828;&#50969;. &#47560;&#51060;&#45320; 7th &#53076;&#46300; &#51652;&#54665;',freq:466,w:'sawtooth'},
  {name:'&#53489;&#44256; (Tango)',desc:'&#50500;&#47476;&#54760;&#54000;&#45208; &#53489;&#44256;. &#49828;&#53440;&#52852;&#53664;&#50752; &#49436;&#51221;&#51201; &#47708;&#47196;&#46356;',freq:349,w:'triangle'},
  {name:'&#50500;&#51060;&#47532;&#49772; (Irish)',desc:'&#47540;/&#51648;&#44536; &#47532;&#46316;. &#48736;&#47480; &#54588;&#46308;&#53916;&#45789;',freq:587,w:'sine'},
  {name:'&#51665;&#49884; (Gypsy)',desc:'&#54756;&#44032;&#47532; &#51665;&#49884; &#51020;&#50501;. &#44368;&#45824;&#47196; &#48736;&#47476;&#44256; &#45712;&#47532;&#44172;',freq:415,w:'sawtooth'},
  {name:'&#54036; (Pop)',desc:'&#47784;&#45912; &#54036; &#50612;&#47112;&#51060;&#51648;. &#44036;&#44208;&#54620; &#47708;&#47196;&#46356; &#46972;&#51064;',freq:523,w:'triangle'},
  {name:'&#47197; (Rock)',desc:'&#51068;&#47113;&#53944;&#47533; &#48148;&#51060;&#50732;&#47536;. &#46356;&#49828;&#53664;&#49496; &#51060;&#54169;&#53944;',freq:330,w:'sawtooth'},
  {name:'&#52860;&#53944;/&#48124;&#49549; (Folk)',desc:'&#54620;&#44397; &#48124;&#50836;/&#52860;&#53944; &#51020;&#50501;. &#54168;&#53440;&#53664;&#45769; &#51020;&#44228;',freq:293,w:'sine'},
  {name:'&#50689;&#54868;&#51020;&#50501; (Film)',desc:'&#50689;&#54868; OST &#50672;&#51452;. &#44592;&#49849;&#51204;&#44208;&#51032; &#46300;&#46972;&#47560;',freq:370,w:'triangle'},
  {name:'&#54788;&#45824;&#51020;&#50501; (Contemporary)',desc:'20~21&#49464;&#44592; &#54788;&#45824;&#51020;&#50501;. &#53945;&#49688; &#51452;&#48277;&#44284; &#54869;&#51109;&#44592;&#48277;',freq:277,w:'square'}
];
function createGenrePanel(){
  var panel=document.createElement('div');panel.id='genrePanel';
  panel.innerHTML='<span class="v13Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#127758; &#51020;&#50501; &#51109;&#47476; &#53456;&#54744;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">12&#51333; &#51109;&#47476;&#51032; &#48148;&#51060;&#50732;&#47536; &#49828;&#53440;&#51068;&#51012; &#52404;&#54744;&#54616;&#49464;&#50836;</p>'+
    '<div id="genreList" style="width:100%;max-width:400px;"></div>';
  document.body.appendChild(panel);
  var list=document.getElementById('genreList');
  var explored=loadProgress().genreExplored||{};
  genres.forEach(function(g,i){
    var card=document.createElement('div');card.className='v13Card'+(explored[i]?' done':'');
    card.innerHTML='<b>'+(i+1)+'. '+g.name+'</b><div style="margin-top:3px;font-size:9px;color:rgba(200,190,160,.5)">'+g.desc+'</div>'+
      '<span class="v13Btn" style="margin-top:4px;font-size:9px">&#9654; &#49368;&#54540; &#46307;&#44592;</span>';
    card.querySelector('.v13Btn').onclick=function(e){e.stopPropagation();playGenreSample(g,i);};
    card.onclick=function(){
      if(!explored[i]){explored[i]=1;var prog=loadProgress();prog.genreExplored=explored;saveProgress(prog);
        card.classList.add('done');v13Sfx('genre_play');
        var cnt=Object.keys(explored).length;
        if(cnt>=6)unlockAch('genre_explorer');if(cnt>=12)unlockAch('genre_master');
        addHistory('genre','&#51109;&#47476; &#53456;&#54744;: '+g.name);}
    };
    list.appendChild(card);
  });
}
function playGenreSample(g,idx){
  if(!actx13)actx13=new(window.AudioContext||window.webkitAudioContext)();
  var notes=[g.freq,g.freq*1.25,g.freq*1.5,g.freq*1.333,g.freq];
  notes.forEach(function(f,i){
    var o=actx13.createOscillator(),ga=actx13.createGain();
    o.connect(ga);ga.connect(actx13.destination);
    o.type=g.w;o.frequency.setValueAtTime(f,actx13.currentTime+i*.3);
    ga.gain.setValueAtTime(0,actx13.currentTime+i*.3);
    ga.gain.linearRampToValueAtTime(.1,actx13.currentTime+i*.3+.05);
    ga.gain.exponentialRampToValueAtTime(.001,actx13.currentTime+i*.3+.28);
    o.start(actx13.currentTime+i*.3);o.stop(actx13.currentTime+i*.3+.3);
  });
}

/* ─── 9. POSTURE CLINIC (기초 자세 클리닉) ─── */
var postures=[
  {title:'&#50612;&#44648; &#50948;&#52824;',desc:'&#53553;&#51012; &#50612;&#44648;&#54144;&#50640; &#50504;&#51221;&#46104;&#44172; &#50732;&#47140;&#45459;&#49845;&#45768;&#45796;. &#53553;&#48155;&#52840;&#51008; &#50612;&#44648;&#54144; &#44032;&#51109;&#51088;&#47532;&#50640; &#50948;&#52824;&#54616;&#44256;, &#47785;&#51012; &#51088;&#50672;&#49828;&#47101;&#44172; &#46028;&#47549;&#45768;&#45796;.'},
  {title:'&#50812;&#49552; &#50948;&#52824;',desc:'&#50812;&#49552; &#49552;&#47785;&#51012; &#44278;&#51648; &#50506;&#44256;, &#49552;&#44032;&#46973;&#51060; &#54788;&#50640; &#49688;&#51649;&#51004;&#47196; &#45231;&#50612;&#51648;&#46020;&#47197; &#54633;&#45768;&#45796;. &#50628;&#51648;&#50752; &#47785;&#51060; &#47560;&#51452;&#48372;&#44172; &#50976;&#51648;&#54633;&#45768;&#45796;.'},
  {title:'&#54876; &#51105;&#44592;',desc:'&#50628;&#51648;~&#50557;&#51648;&#47196; &#54876;&#51012; &#44048;&#49901;&#45768;&#45796;. &#50557;&#51648;&#45716; &#54876; &#50948;&#50640; &#44032;&#48317;&#44172; &#50732;&#47140;&#45459;&#44256;, &#50628;&#51648;&#45716; &#47560;&#51452;&#48372;&#45716; &#47732;&#50640; &#50948;&#52824;&#49884;&#53421;&#45768;&#45796;.'},
  {title:'&#50724;&#47480;&#54036; &#51088;&#49464;',desc:'&#50724;&#47480;&#54036;&#51008; &#47581;&#50640;&#51004;&#47196; &#45824;&#44033;&#49440; &#48169;&#54693;&#51004;&#47196; &#54200;&#54616;&#44172; &#45804;&#50500;&#51452;&#49464;&#50836;. &#44596;&#51109;&#51060; &#50630;&#50612;&#50556; &#54616;&#44256;, &#47924;&#44172;&#47484; &#51648;&#53489;&#54616;&#45716; &#48148;&#47016; &#50669;&#54624;&#51077;&#45768;&#45796;.'},
  {title:'&#48156;/&#47924;&#47502; &#50504;&#51221;',desc:'&#50577;&#48156;&#51012; &#50612;&#44648; &#45320;&#48708;&#47196; &#48268;&#47532;&#44256;, &#47924;&#47502;&#51012; &#49332;&#51677; &#44396;&#48512;&#47549;&#45768;&#45796;. &#52404;&#51473;&#51012; &#44512;&#46321;&#54616;&#44172; &#48516;&#48176;&#54616;&#49464;&#50836;.'},
  {title:'&#47785;/&#47672;&#47532; &#44033;&#46020;',desc:'&#53553;&#48155;&#52840;&#50640;&#49436; &#47785;&#51012; &#49332;&#51677; &#50812;&#51901;&#51004;&#47196; &#46028;&#47549;&#45768;&#45796;. &#47672;&#47532;&#44032; &#50526;&#51004;&#47196; &#49693;&#50668;&#51648;&#51648; &#50506;&#46020;&#47197; &#51452;&#51032;&#54616;&#49464;&#50836;.'},
  {title:'&#54840;&#55137; &#54869;&#48372;',desc:'&#50672;&#51452; &#51473; &#44618;&#51008; &#54840;&#55137;&#51012; &#50976;&#51648;&#54616;&#49464;&#50836;. &#50612;&#44648;&#50752; &#44032;&#49844;&#51060; &#50564;&#47532;&#47732; &#54840;&#55137;&#51060; &#50620;&#50500;&#51648;&#44256; &#44596;&#51109;&#51060; &#51613;&#44032;&#54633;&#45768;&#45796;.'},
  {title:'&#55092;&#49885; &#51088;&#49464;',desc:'&#44596;&#51109;&#51012; &#54400;&#44592; &#50948;&#54644; 30&#48516;&#47560;&#45796; &#50501;&#44592;&#47484; &#45236;&#47140;&#45459;&#44256; &#49828;&#53944;&#47112;&#52845;&#51012; &#54616;&#49464;&#50836;. &#47785;/&#50612;&#44648;/&#49552;&#47785; &#49828;&#53944;&#47112;&#52845;&#51060; &#51473;&#50836;&#54633;&#45768;&#45796;.'}
];
function createPosturePanel(){
  var panel=document.createElement('div');panel.id='posturePanel';
  panel.innerHTML='<span class="v13Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#129506; &#44592;&#52488; &#51088;&#49464; &#53364;&#47532;&#45769;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">&#50732;&#48148;&#47480; &#51088;&#49464;&#47484; &#50061;&#55176;&#47732; &#53685;&#51613;&#50630;&#51060; &#50672;&#51452;&#54624; &#49688; &#51080;&#49845;&#45768;&#45796;</p>'+
    '<div id="postureList" style="width:100%;max-width:400px;"></div>';
  document.body.appendChild(panel);
  var list=document.getElementById('postureList');
  var viewed=loadProgress().postureViewed||{};
  postures.forEach(function(p,i){
    var card=document.createElement('div');card.className='v13Card'+(viewed[i]?' done':'');
    card.innerHTML='<b>&#9679; '+p.title+'</b><div style="margin-top:4px;font-size:9px;color:rgba(200,190,160,.5)">'+p.desc+'</div>';
    card.onclick=function(){
      if(!viewed[i]){viewed[i]=1;var prog=loadProgress();prog.postureViewed=viewed;saveProgress(prog);
        card.classList.add('done');v13Sfx('posture_view');
        var cnt=Object.keys(viewed).length;
        if(cnt>=4)unlockAch('posture_student');if(cnt>=8)unlockAch('posture_master');
        addHistory('posture','&#51088;&#49464; &#53364;&#47532;&#45769;: '+p.title);}
    };
    list.appendChild(card);
  });
}

/* ─── 10. PRACTICE TIMER (연습 타이머 - 포모도로) ─── */
var timerPresets=[
  {name:'&#54252;&#47784;&#46020;&#47196; 25/5',work:25,rest:5},
  {name:'&#51665;&#51473; 15/3',work:15,rest:3},
  {name:'&#47217; 45/10',work:45,rest:10},
  {name:'&#49800;&#53944; 10/2',work:10,rest:2}
];
var timerActive=false,timerInterval=null,timerSec=0,timerTotal=0,timerMode='work',timerPreset=0;
function createTimerPanel(){
  var panel=document.createElement('div');panel.id='timerPanel';
  panel.innerHTML='<span class="v13Close" onclick="this.parentElement.classList.remove(\'show\');stopTimer()">&times;</span>'+
    '<h3>&#9201; &#50672;&#49845; &#53440;&#51060;&#47672;</h3>'+
    '<p style="font-size:10px;color:rgba(200,190,160,.6);margin-bottom:8px">&#54252;&#47784;&#46020;&#47196; &#48169;&#49885;&#51004;&#47196; &#51665;&#51473; &#50672;&#49845;&#54616;&#49464;&#50836;</p>'+
    '<canvas id="timerCanvas" width="300" height="300"></canvas>'+
    '<div id="timerPresets" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:8px 0;"></div>'+
    '<div><span class="v13Btn" id="timerStartBtn">&#9654; &#49884;&#51089;</span> '+
    '<span class="v13Btn" id="timerPauseBtn">&#9646;&#9646; &#51068;&#49884;&#51221;&#51648;</span> '+
    '<span class="v13Btn" id="timerResetBtn">&#8634; &#52488;&#44592;&#54868;</span></div>'+
    '<div class="v13Info" id="timerInfo" style="margin-top:8px;text-align:center">&#53440;&#51060;&#47672;&#47484; &#49440;&#53469;&#54616;&#44256; &#49884;&#51089;&#54616;&#49464;&#50836;</div>';
  document.body.appendChild(panel);
  var preDiv=document.getElementById('timerPresets');
  timerPresets.forEach(function(p,i){
    var btn=document.createElement('span');btn.className='v13Btn';btn.textContent=p.name;
    btn.onclick=function(){timerPreset=i;resetTimer();
      document.querySelectorAll('#timerPresets .v13Btn').forEach(function(b,j){b.classList.toggle('active',j===i);});};
    preDiv.appendChild(btn);
  });
  document.getElementById('timerStartBtn').onclick=function(){startTimer();};
  document.getElementById('timerPauseBtn').onclick=function(){pauseTimer();};
  document.getElementById('timerResetBtn').onclick=function(){resetTimer();};
}
function drawTimerCanvas(){
  var c=document.getElementById('timerCanvas');if(!c)return;
  var ctx=c.getContext('2d');ctx.clearRect(0,0,300,300);
  ctx.fillStyle='rgba(26,16,32,.9)';ctx.fillRect(0,0,300,300);
  var preset=timerPresets[timerPreset];
  var totalSec=(timerMode==='work'?preset.work:preset.rest)*60;
  var progress=timerSec/totalSec;
  ctx.beginPath();ctx.arc(150,150,90,0,Math.PI*2);
  ctx.strokeStyle='rgba(100,100,100,.2)';ctx.lineWidth=12;ctx.stroke();
  ctx.beginPath();ctx.arc(150,150,90,-Math.PI/2,-Math.PI/2+progress*Math.PI*2);
  ctx.strokeStyle=timerMode==='work'?'#D4894A':'#4caf50';ctx.lineWidth=12;ctx.stroke();ctx.lineWidth=1;
  var mins=Math.floor(timerSec/60),secs=timerSec%60;
  ctx.fillStyle=timerMode==='work'?'#D4894A':'#4caf50';ctx.font='bold 28px monospace';ctx.textAlign='center';
  ctx.fillText((mins<10?'0':'')+mins+':'+(secs<10?'0':'')+secs,150,155);
  ctx.fillStyle='rgba(240,230,200,.6)';ctx.font='11px Georgia';
  ctx.fillText(timerMode==='work'?'&#50672;&#49845; &#51473;':'&#55092;&#49885; &#51473;',150,180);
  ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='9px Georgia';
  ctx.fillText(preset.name+' ('+preset.work+'&#48516; &#50672;&#49845; / '+preset.rest+'&#48516; &#55092;&#49885;)',150,280);
}
function startTimer(){
  if(timerActive)return;timerActive=true;
  var preset=timerPresets[timerPreset];
  if(timerSec===0)timerSec=(timerMode==='work'?preset.work:preset.rest)*60;
  timerInterval=setInterval(function(){
    timerSec--;
    if(timerSec%10===0)v13Sfx('timer_tick');
    if(timerSec<=0){
      v13Sfx('timer_done');
      if(timerMode==='work'){timerMode='rest';timerSec=preset.rest*60;
        timerTotal++;var prog=loadProgress();prog.timerSessions=(prog.timerSessions||0)+1;saveProgress(prog);
        if(prog.timerSessions>=3)unlockAch('timer_user');if(prog.timerSessions>=10)unlockAch('timer_master');
        addHistory('timer','&#54252;&#47784;&#46020;&#47196; &#50672;&#49845; &#50756;&#47308; ('+preset.work+'&#48516;)');
        document.getElementById('timerInfo').textContent='&#55092;&#49885; &#49884;&#44036;&#51077;&#45768;&#45796;! '+preset.rest+'&#48516; &#55092;&#49885;';
      }else{timerMode='work';timerSec=preset.work*60;
        document.getElementById('timerInfo').textContent='&#55092;&#49885; &#50756;&#47308;! &#45796;&#49884; &#50672;&#49845;&#51012; &#49884;&#51089;&#54616;&#49464;&#50836;';}
    }
    drawTimerCanvas();
  },1000);
  drawTimerCanvas();
}
function pauseTimer(){timerActive=false;if(timerInterval)clearInterval(timerInterval);timerInterval=null;}
function resetTimer(){pauseTimer();timerSec=0;timerMode='work';timerTotal=0;drawTimerCanvas();}
function stopTimer(){pauseTimer();timerSec=0;timerMode='work';}
window.stopTimer=stopTimer;

/* ─── 11. QUIZ v13 (15문항) ─── */
var quizV13Questions=[
  {q:'&#45796;&#51060;&#45208;&#48121;&#50640;&#49436; pp&#45716; &#47924;&#50631;&#51012; &#51032;&#48120;&#54616;&#45208;&#50836;?',a:['&#47588;&#50864; &#50668;&#47532;&#44172;','&#49464;&#44172;','&#51473;&#44036; &#49464;&#44592;','&#51216;&#51216; &#53356;&#44172;'],c:0},
  {q:'&#48148;&#51060;&#50732;&#47536; 4&#54788;&#51032; &#53916;&#45789; &#51020;&#51008;?',a:['G-D-A-E','A-D-G-C','E-A-D-G','D-A-E-B'],c:0},
  {q:'&#50500;&#47476;&#54168;&#51648;&#50724;&#46976; &#47924;&#50631;&#51064;&#44032;&#50836;?',a:['&#54868;&#51020;&#51012; &#48516;&#49328;&#54644;&#49436; &#50672;&#51452;','&#54620; &#51020;&#47564; &#44600;&#44172; &#50672;&#51452;','&#54876;&#51012; &#53916;&#44200;&#49436; &#50672;&#51452;','&#54788;&#51012; &#46321;&#44200;&#49436; &#50672;&#51452;'],c:0},
  {q:'&#49569;&#51652;&#51012; &#48148;&#47476;&#45716; &#51201;&#51221; &#54943;&#49688;&#45716;?',a:['3~5&#48264;','10~15&#48264;','1&#48264;','50&#48264; &#51060;&#49345;'],c:0},
  {q:'&#54252;&#47784;&#46020;&#47196; &#44592;&#48277;&#51032; &#44592;&#48376; &#50672;&#49845; &#49884;&#44036;&#51008;?',a:['25&#48516;','5&#48516;','60&#48516;','10&#52488;'],c:0},
  {q:'&#48652;&#47551;&#51648;(bridge)&#51032; &#50669;&#54624;&#51008;?',a:['&#54788;&#51032; &#51652;&#46041;&#51012; &#47800;&#52404;&#50640; &#51204;&#45804;','&#54788;&#51012; &#44256;&#51221;','&#49569;&#51652;&#51012; &#48372;&#44288;','&#53916;&#45789;&#54592; &#50669;&#54624;'],c:0},
  {q:'&#53364;&#47000;&#49885; &#51020;&#50501;&#50640;&#49436; &#48148;&#51060;&#50732;&#47536;&#51032; &#51452;&#50836; &#50669;&#54624;&#51008;?',a:['&#47708;&#47196;&#46356;&#50752; &#54868;&#49457;&#51012; &#45812;&#45817;','&#47532;&#46316;&#47564; &#45812;&#45817;','&#48288;&#51060;&#49828; &#46972;&#51064; &#50672;&#51452;','&#53440;&#50501;&#47564; &#50672;&#51452;'],c:0},
  {q:'&#50672;&#49845; &#49828;&#53944;&#47533;&#51060; &#51473;&#50836;&#54620; &#51060;&#50976;&#45716;?',a:['&#44540;&#50977;&#44592;&#50613;&#44284; &#49845;&#44288; &#54805;&#49457;','&#45224;&#50640;&#44172; &#51088;&#46993;&#54616;&#47140;&#44256;','&#48148;&#51060;&#50732;&#47536;&#51060; &#45231;&#50500;&#49436;','&#53440;&#51064;&#51060; &#49884;&#52404;&#49436;'],c:0},
  {q:'&#50508;&#47589;&#44172; &#48372;&#44288;&#54644;&#50556; &#54624; &#50728;&#46020;&#45716;?',a:['15~25&#8451;','0~5&#8451;','35~40&#8451;','-10~0&#8451;'],c:0},
  {q:'&#50500;&#51060;&#47532;&#49772; &#48148;&#51060;&#50732;&#47536; &#51020;&#50501;&#51032; &#53945;&#51669;&#51008;?',a:['&#48736;&#47480; &#54588;&#46308;&#53916;&#45789;&#44284; &#47540;','&#45712;&#47536; &#53588;&#54252;&#50752; &#44600;&#51020;','&#51204;&#51088;&#51020; &#54952;&#44284;','&#53440;&#50501;&#47564; &#49324;&#50857;'],c:0},
  {q:'&#50628;&#51648;&#50752; &#47785;&#51060; &#47560;&#51452;&#48372;&#45716; &#51088;&#49464;&#45716; &#50612;&#46356;&#50640; &#54644;&#45817;?',a:['&#50812;&#49552;(&#54532;&#47131;&#54021;)','&#50724;&#47480;&#49552;(&#48372;&#51081;)','&#48156;(&#49828;&#53472;&#49828;)','&#47785;(&#52841; &#47112;&#49828;&#53944;)'],c:0},
  {q:'&#53489;&#44256; &#48148;&#51060;&#50732;&#47536;&#51032; &#53945;&#51669;&#51201; &#44592;&#48277;&#51008;?',a:['&#49828;&#53440;&#52852;&#53664;&#50752; &#49436;&#51221;&#51201; &#47708;&#47196;&#46356;','&#54588;&#52824;&#52852;&#53664;&#47564; &#49324;&#50857;','&#54637;&#49345; &#47112;&#44032;&#53664;&#47564;','&#44368;&#45824;&#47196; &#48736;&#47476;&#44172;&#47564;'],c:0},
  {q:'&#48148;&#51060;&#50732;&#47536; &#54788; &#44368;&#52404; &#51452;&#44592;&#45716;?',a:['6&#44060;&#50900;~1&#45380;','&#47588;&#51452;','10&#45380;','&#54620; &#48264;&#46020; &#44368;&#52404; &#50504; &#54632;'],c:0},
  {q:'&#54788;&#45824;&#51020;&#50501;&#50640;&#49436; &#48148;&#51060;&#50732;&#47536;&#50640; &#49324;&#50857;&#46104;&#45716; &#53945;&#49688; &#44592;&#48277;&#51008;?',a:['&#54869;&#51109;&#44592;&#48277;(&#49696;&#54256;&#54000;&#52824;&#47196; &#46321;)','&#51060;&#51473;&#51221;&#51648;&#47564;','&#48708;&#48652;&#46972;&#53664;&#47564;','&#50500;&#47476;&#53076;&#47564;'],c:0},
  {q:'&#54252;&#47784;&#46020;&#47196;&#50640;&#49436; &#55092;&#49885; &#49884;&#44036;&#51032; &#47785;&#51201;&#51008;?',a:['&#44540;&#50977;&#54588;&#47196;&#47484; &#54400;&#44256; &#51665;&#51473;&#47141; &#54924;&#48373;','&#50756;&#51204;&#55176; &#45796;&#47480; &#44152;&#47196; &#51204;&#54872;','&#50501;&#44592;&#47484; &#52397;&#49548;&#54616;&#47140;&#44256;','&#49885;&#49324;&#47484; &#54616;&#47140;&#44256;'],c:0}
];
var quizV13Idx=0,quizV13Score=0,quizV13Done=false;
function createQuizV13Panel(){
  var panel=document.createElement('div');panel.id='quizV13Panel';
  panel.innerHTML='<span class="v13Close" onclick="this.parentElement.classList.remove(\'show\')">&times;</span>'+
    '<h3>&#10067; &#54140;&#51592; v13</h3>'+
    '<div id="quizV13Area" style="width:100%;max-width:400px;"></div>';
  document.body.appendChild(panel);
}
function startQuizV13(){
  quizV13Idx=0;quizV13Score=0;quizV13Done=false;renderQuizV13();
}
function renderQuizV13(){
  var area=document.getElementById('quizV13Area');if(!area)return;
  if(quizV13Idx>=quizV13Questions.length){
    var pct=Math.round(quizV13Score/quizV13Questions.length*100);
    area.innerHTML='<div class="v13Info" style="text-align:center"><b>&#44208;&#44284;: '+quizV13Score+'/'+quizV13Questions.length+' ('+pct+'%)</b><br>'+
      (pct>=80?'&#127942; &#50864;&#49688;!':'&#128170; &#45796;&#49884; &#46020;&#51204;&#54616;&#49464;&#50836;!')+'</div>';
    if(pct>=80)unlockAch('quiz_v13_ace');
    quizV13Done=true;return;
  }
  var q=quizV13Questions[quizV13Idx];
  var html='<div class="v13Info"><b>Q'+(quizV13Idx+1)+'/'+quizV13Questions.length+'</b><br>'+q.q+'</div>';
  q.a.forEach(function(a,i){
    html+='<div class="v13Card" onclick="answerQuizV13('+i+')">'+a+'</div>';
  });
  html+='<div class="v13Progress"><div class="bar" style="width:'+Math.round(quizV13Idx/quizV13Questions.length*100)+'%"></div></div>';
  area.innerHTML=html;
}
window.answerQuizV13=function(idx){
  if(quizV13Done)return;
  var q=quizV13Questions[quizV13Idx];
  if(idx===q.c){quizV13Score++;v13Sfx('quiz_v13');}
  quizV13Idx++;renderQuizV13();
};

/* ─── 12. NEW SONGS (10곡 추가: 94→104) ─── */
(function addSongs(){
  if(typeof window.SONG_DATA==='undefined')return;
  var newSongs=[
    {title:'&#48393;&#49688;&#49352;',artist:'&#49464;&#51064;&#49324;&#49688;',difficulty:2,notes:[[0,'D4',400],[500,'F#4',400],[1000,'A4',400],[1500,'D5',600],[2200,'A4',400],[2700,'F#4',400],[3200,'D4',600]]},
    {title:'&#50500;&#47532;&#46993; &#48320;&#51452;&#44257;',artist:'&#54620;&#44397;&#48124;&#50836;',difficulty:3,notes:[[0,'A4',300],[400,'A4',300],[800,'C5',400],[1300,'E5',400],[1800,'D5',400],[2300,'C5',400],[2800,'A4',600]]},
    {title:'&#54000;&#54616;&#50864;&#51200; &#47700;&#45572;&#50659;',artist:'&#47784;&#52264;&#47476;&#53944;',difficulty:2,notes:[[0,'G4',500],[600,'B4',300],[1000,'D5',500],[1600,'G5',300],[2000,'F#5',300],[2400,'E5',300],[2800,'D5',600]]},
    {title:'&#48148;&#51060;&#50732;&#47536; &#49548;&#45208;&#53440; &#48393;',artist:'&#47784;&#52264;&#47476;&#53944;',difficulty:4,notes:[[0,'A4',200],[300,'B4',200],[600,'C#5',200],[900,'D5',200],[1200,'E5',300],[1600,'F#5',300],[2000,'E5',600]]},
    {title:'&#49472;&#54001; &#50864;&#47676;',artist:'&#50500;&#51068;&#47004;&#46300;&#48124;&#50836;',difficulty:2,notes:[[0,'D4',500],[600,'D4',300],[1000,'F#4',500],[1600,'A4',500],[2200,'A4',300],[2600,'B4',500],[3200,'A4',600]]},
    {title:'&#52852;&#48148;&#47112;&#47532;&#50500; &#47084;&#49828;&#54001;&#52852;&#45208;',artist:'&#47560;&#49828;&#45348;',difficulty:3,notes:[[0,'E4',400],[500,'G#4',400],[1000,'B4',400],[1500,'E5',600],[2200,'D#5',400],[2700,'C#5',400],[3200,'B4',600]]},
    {title:'&#54764;&#44032;&#47532;&#47924;&#44257; 5&#48264; &#53580;&#47560;',artist:'&#48652;&#46988;&#49828;',difficulty:4,notes:[[0,'F#4',200],[250,'G4',200],[500,'A4',300],[900,'F#4',200],[1200,'D4',200],[1500,'A4',300],[1900,'D5',600]]},
    {title:'&#48393; &#45765;&#47196; &#50500;&#48260;&#51648;(&#51109;&#51312;)',artist:'&#48148;&#54840;',difficulty:3,notes:[[0,'G4',600],[700,'A4',300],[1100,'B4',600],[1800,'C5',300],[2200,'D5',600],[2900,'B4',300],[3300,'G4',600]]},
    {title:'&#47924;&#44417; &#46041;&#49328; &#48320;&#51452;&#44257;',artist:'&#54620;&#44397;&#48124;&#50836;',difficulty:2,notes:[[0,'C5',400],[500,'C5',200],[800,'D5',400],[1300,'E5',400],[1800,'E5',200],[2100,'D5',400],[2600,'C5',600]]},
    {title:'&#50500;&#48148;&#45348;&#46972;(&#44592;&#50689;)',artist:'&#44592;&#50689;',difficulty:3,notes:[[0,'E5',500],[600,'E5',300],[1000,'F5',500],[1600,'E5',300],[2000,'D5',500],[2600,'C5',300],[3000,'B4',600]]}
  ];
  newSongs.forEach(function(s){
    var exists=window.SONG_DATA.some(function(ex){return ex.title===s.title;});
    if(!exists)window.SONG_DATA.push(s);
  });
})();

/* ─── 13. NEW LESSONS (10레슨 추가: 120→130) ─── */
(function addLessons(){
  if(typeof window.LESSON_DATA==='undefined')return;
  var newLessons=[
    {id:'dyn_pp',title:'&#45796;&#51060;&#45208;&#48121; pp &#50672;&#49845;',desc:'&#47588;&#50864; &#50668;&#47536; &#49548;&#47532;&#47484; &#44512;&#51068;&#54616;&#44172; &#50976;&#51648;&#54616;&#44592;',level:6},
    {id:'dyn_ff',title:'&#45796;&#51060;&#45208;&#48121; ff &#50672;&#49845;',desc:'&#55192; &#51080;&#45716; &#54252;&#47476;&#53580; &#49548;&#47532;&#47484; &#44648;&#45143;&#54616;&#44172; &#50672;&#51452;',level:6},
    {id:'arp_cmaj',title:'C Major &#50500;&#47476;&#54168;&#51648;&#50724;',desc:'C-E-G-C &#49692;&#49436;&#47196; &#48516;&#49328;&#54868;&#51020; &#50672;&#51452;',level:5},
    {id:'arp_gmaj',title:'G Major &#50500;&#47476;&#54168;&#51648;&#50724;',desc:'G-B-D-G &#50500;&#47476;&#54168;&#51648;&#50724; &#50672;&#49845;',level:5},
    {id:'tuning_all',title:'4&#54788; &#53916;&#45789; &#50756;&#49457;',desc:'G-D-A-E &#47784;&#46160; &#51221;&#54869;&#54616;&#44172; &#53916;&#45789;&#54616;&#44592;',level:3},
    {id:'genre_tango',title:'&#53489;&#44256; &#49828;&#53440;&#52852;&#53664;',desc:'&#53489;&#44256; &#47532;&#46316;&#50640;&#49436; &#49828;&#53440;&#52852;&#53664; &#44592;&#48277; &#50672;&#49845;',level:7},
    {id:'posture_base',title:'&#44592;&#48376; &#51088;&#49464; &#51221;&#47549;',desc:'&#50612;&#44648;/&#50812;&#49552;/&#54876; &#50948;&#52824; &#52509;&#51221;&#47532;',level:2},
    {id:'arp_minor',title:'&#45800;&#51312; &#50500;&#47476;&#54168;&#51648;&#50724;',desc:'Am &#50500;&#47476;&#54168;&#51648;&#50724;&#47196; &#49836;&#54536; &#51020;&#49353; &#54364;&#54788;',level:6},
    {id:'dyn_cresc',title:'&#53356;&#47112;&#49472;&#46020; &#50672;&#49845;',desc:'pp&#50640;&#49436; ff&#44620;&#51648; &#51216;&#51652;&#51201;&#51004;&#47196; &#53412;&#50864;&#44592;',level:7},
    {id:'v13_grad',title:'v13 &#51320;&#50629;',desc:'&#47784;&#46304; v13 &#44592;&#45733;&#51012; &#52404;&#54744;&#54616;&#47732; &#50756;&#47308;',level:8}
  ];
  newLessons.forEach(function(l){
    var exists=window.LESSON_DATA.some(function(ex){return ex.id===l.id;});
    if(!exists)window.LESSON_DATA.push(l);
  });
})();

/* ─── 14. ACHIEVEMENTS (12개 추가: 94→106) ─── */
var V13_ACHS=[
  {id:'dyn_student',icon:'&#127925;',name:'&#45796;&#51060;&#45208;&#48121; &#51077;&#47928;',desc:'&#45796;&#51060;&#45208;&#48121; 3&#45800;&#44228; &#50672;&#49845;'},
  {id:'dyn_master',icon:'&#127926;',name:'&#45796;&#51060;&#45208;&#48121; &#47560;&#49828;&#53552;',desc:'6&#45800;&#44228; &#51204;&#48512; &#50672;&#49845;'},
  {id:'arp_student',icon:'&#9835;',name:'&#50500;&#47476;&#54168;&#51648;&#50724; &#51077;&#47928;',desc:'3&#51333; &#50500;&#47476;&#54168;&#51648;&#50724; &#50672;&#49845;'},
  {id:'arp_master',icon:'&#127929;',name:'&#50500;&#47476;&#54168;&#51648;&#50724; &#47560;&#49828;&#53552;',desc:'12&#51333; &#51204;&#48512; &#50672;&#49845;'},
  {id:'tuner_user',icon:'&#127931;',name:'&#53916;&#45789; &#49845;&#44288;',desc:'4&#54788; &#53916;&#45789; &#49324;&#50857;'},
  {id:'streak_7',icon:'&#128293;',name:'7&#51068; &#50672;&#49549;',desc:'7&#51068; &#50672;&#49549; &#50672;&#49845;'},
  {id:'streak_30',icon:'&#128170;',name:'30&#51068; &#52268;&#54588;&#50616;',desc:'30&#51068; &#50672;&#49549; &#50672;&#49845;'},
  {id:'care_student',icon:'&#128295;',name:'&#44288;&#47532; &#51077;&#47928;',desc:'6&#51333; &#44288;&#47532;&#48277; &#51069;&#44592;'},
  {id:'care_master',icon:'&#128736;',name:'&#44288;&#47532; &#51204;&#47928;&#44032;',desc:'12&#51333; &#51204;&#48512; &#51069;&#44592;'},
  {id:'genre_explorer',icon:'&#127758;',name:'&#51109;&#47476; &#53456;&#54744;&#44032;',desc:'6&#51333; &#51109;&#47476; &#52404;&#54744;'},
  {id:'genre_master',icon:'&#127775;',name:'&#51109;&#47476; &#47560;&#49828;&#53552;',desc:'12&#51333; &#51204;&#48512; &#52404;&#54744;'},
  {id:'posture_student',icon:'&#129506;',name:'&#51088;&#49464; &#51077;&#47928;',desc:'4&#51333; &#51088;&#49464; &#54617;&#49845;'},
  {id:'posture_master',icon:'&#129351;',name:'&#51088;&#49464; &#50756;&#49457;',desc:'8&#51333; &#51204;&#48512; &#54617;&#49845;'},
  {id:'timer_user',icon:'&#9201;',name:'&#53440;&#51060;&#47672; &#54876;&#50857;',desc:'3&#54924; &#54252;&#47784;&#46020;&#47196; &#50756;&#47308;'},
  {id:'timer_master',icon:'&#128200;',name:'&#50672;&#49845; &#47560;&#49828;&#53552;',desc:'10&#54924; &#54252;&#47784;&#46020;&#47196; &#50756;&#47308;'},
  {id:'quiz_v13_ace',icon:'&#128175;',name:'&#54140;&#51592; v13 &#50640;&#51060;&#49828;',desc:'80% &#51060;&#49345; &#51221;&#45813;'}
];

/* ─── 15. UI INTEGRATION ─── */
(function integrateUI(){
  createDynPanel();createArpPanel();createTunerPanel();createStreakPanel();
  createCarePanel();createGenrePanel();createPosturePanel();createTimerPanel();createQuizV13Panel();
  drawDynCanvas();drawArpCanvas();drawTunerCanvas();drawStreakCanvas();drawTimerCanvas();

  var openDyn=function(){drawDynCanvas();document.getElementById('dynPanel').classList.add('show');v13Sfx('feature_open13');};
  var openArp=function(){drawArpCanvas();document.getElementById('arpPanel').classList.add('show');v13Sfx('feature_open13');};
  var openTuner=function(){drawTunerCanvas();document.getElementById('tunerPanel').classList.add('show');v13Sfx('feature_open13');};
  var openStreak=function(){drawStreakCanvas();document.getElementById('streakPanel').classList.add('show');v13Sfx('feature_open13');};
  var openCare=function(){document.getElementById('carePanel').classList.add('show');v13Sfx('feature_open13');};
  var openGenre=function(){document.getElementById('genrePanel').classList.add('show');v13Sfx('feature_open13');};
  var openPosture=function(){document.getElementById('posturePanel').classList.add('show');v13Sfx('feature_open13');};
  var openTimer=function(){drawTimerCanvas();document.getElementById('timerPanel').classList.add('show');v13Sfx('feature_open13');};
  var openQuiz=function(){startQuizV13();document.getElementById('quizV13Panel').classList.add('show');v13Sfx('feature_open13');};

  var nav=document.createElement('div');nav.className='v13Nav';
  var navItems=[
    {text:'&#127925; &#45796;&#51060;&#45208;&#48121;',action:openDyn},
    {text:'&#9835; &#50500;&#47476;&#54168;&#51648;&#50724;',action:openArp},
    {text:'&#127931; &#53916;&#45789;',action:openTuner},
    {text:'&#128293; &#49828;&#53944;&#47533;',action:openStreak},
    {text:'&#128295; &#44288;&#47532;',action:openCare},
    {text:'&#127758; &#51109;&#47476;',action:openGenre},
    {text:'&#129506; &#51088;&#49464;',action:openPosture},
    {text:'&#9201; &#53440;&#51060;&#47672;',action:openTimer},
    {text:'&#10067; &#54140;&#51592;v13',action:openQuiz}
  ];
  navItems.forEach(function(item){
    var btn=document.createElement('div');btn.className='v13NavBtn';btn.innerHTML=item.text;
    btn.addEventListener('pointerdown',function(e){e.preventDefault();item.action();});
    nav.appendChild(btn);
  });
  document.body.appendChild(nav);

  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    if(!e.shiftKey)return;
    switch(e.key){
      case'!':e.preventDefault();openDyn();break;
      case'@':e.preventDefault();openArp();break;
      case'#':e.preventDefault();openTuner();break;
      case'$':e.preventDefault();openStreak();break;
      case'%':e.preventDefault();openCare();break;
      case'^':e.preventDefault();openGenre();break;
      case'&':e.preventDefault();openPosture();break;
      case'*':e.preventDefault();openTimer();break;
    }
    if(e.key==='Escape'){
      stopDyn();stopTuner();stopTimer();
      document.querySelectorAll('#dynPanel,#arpPanel,#tunerPanel,#streakPanel,#carePanel,#genrePanel,#posturePanel,#timerPanel,#quizV13Panel').forEach(function(p){p.classList.remove('show');});
    }
  });

  var titleEl=document.querySelector('#hd h1');
  if(titleEl)titleEl.innerHTML='&#127931; Violin Real <span style="font-size:8px;color:#ff6644;vertical-align:super">v13</span>';
  var logoEl=document.getElementById('logo');if(logoEl)logoEl.textContent='Violin Real v13';
})();

window.VIOLIN_VERSION='13.0';
})();
