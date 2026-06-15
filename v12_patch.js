/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v12.0 PATCH MODULE
   오케스트라석배치Canvas+음악감상실12곡+포지션맵Canvas+
   바이올린역사관12시대+일일워밍업8과제+연습분석대시보드Canvas+
   마스터클래스12강+앙상블파트연습6곡+10곡추가(84→94)+
   10레슨(110→120)+15퀴즈추가(30→45)+12업적추가(82→94)+
   SFX12종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V12Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V12_LOADED)return;window.__V12_LOADED=true;

/* ─── HELPERS ─── */
function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(p){var old=loadProgress();Object.assign(old,p);localStorage.setItem('violinProgress',JSON.stringify(old));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function loadStats(){try{return JSON.parse(localStorage.getItem('violinStats')||'{}');}catch(e){return {};}}
function saveStats(s){localStorage.setItem('violinStats',JSON.stringify(s));}
function unlockAch(id){
  var achs=loadAchievements();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  var info=V12_ACHS.find(function(a){return a.id===id;});
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
var actx12=null;
function v12Sfx(type){
  try{
    if(!actx12)actx12=new(window.AudioContext||window.webkitAudioContext)();
    var o=actx12.createOscillator(),g=actx12.createGain();
    o.connect(g);g.connect(actx12.destination);
    var now=actx12.currentTime;
    var presets={
      orch_open:{f:523,w:'sine',a:.12,d:.4},
      listen_play:{f:659,w:'triangle',a:.1,d:.5},
      pos_tap:{f:440,w:'square',a:.06,d:.15},
      history_open:{f:392,w:'sine',a:.08,d:.3},
      warmup_done:{f:784,w:'triangle',a:.12,d:.25},
      analysis_open:{f:349,w:'sine',a:.08,d:.35},
      master_open:{f:587,w:'triangle',a:.1,d:.3},
      ensemble_start:{f:523,w:'sine',a:.14,d:.5},
      quiz_v12:{f:698,w:'square',a:.06,d:.2},
      achieve_v12:{f:880,w:'sine',a:.15,d:.6},
      feature_open:{f:466,w:'triangle',a:.08,d:.2},
      warmup_tick:{f:1047,w:'square',a:.04,d:.1}
    };
    var p=presets[type]||presets.feature_open;
    o.type=p.w;o.frequency.setValueAtTime(p.f,now);
    g.gain.setValueAtTime(p.a,now);g.gain.exponentialRampToValueAtTime(.001,now+p.d);
    o.start(now);o.stop(now+p.d);
  }catch(e){}
}

/* ─── 2. CSS INJECTION ─── */
var sty=document.createElement('style');
sty.textContent=`
#orchPanel,#listenPanel,#posPanel,#histPanel,#warmupPanel,#analysisPanel,#masterPanel,#ensemblePanel,#quizV12Panel{
  display:none;position:fixed;inset:0;z-index:222;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#orchPanel.show,#listenPanel.show,#posPanel.show,#histPanel.show,#warmupPanel.show,
#analysisPanel.show,#masterPanel.show,#ensemblePanel.show,#quizV12Panel.show{display:flex;}
#orchPanel h3,#listenPanel h3,#posPanel h3,#histPanel h3,#warmupPanel h3,
#analysisPanel h3,#masterPanel h3,#ensemblePanel h3,#quizV12Panel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#orchCanvas,#posCanvas,#analysisCanvas{border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.orchInfo,.posInfo{width:100%;max-width:380px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;font-size:10px;color:rgba(240,230,200,.7);line-height:1.6;}
.orchSect{display:inline-block;padding:2px 8px;border-radius:8px;font-size:9px;
  margin:2px;cursor:pointer;border:1px solid rgba(255,215,0,.15);
  color:rgba(240,230,200,.5);background:rgba(255,250,235,.04);transition:all .15s;}
.orchSect:active,.orchSect.active{border-color:rgba(255,215,0,.5);color:#ffd700;background:rgba(255,215,0,.1);}
.listenCard,.histCard,.masterCard,.ensCard{width:100%;max-width:380px;padding:12px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:12px;cursor:pointer;transition:all .15s;}
.listenCard:active,.histCard:active,.masterCard:active,.ensCard:active{background:rgba(255,215,0,.12);}
.listenCard.playing,.ensCard.playing{border-color:rgba(68,238,68,.4);background:rgba(68,238,68,.03);}
.listenTitle,.histTitle,.ensTitle{font-size:12px;color:#ffd700;font-weight:700;}
.listenComposer,.histYear,.ensParts{font-size:9px;color:rgba(201,169,110,.4);margin-top:2px;}
.listenDesc{font-size:9px;color:rgba(240,230,200,.5);margin-top:4px;line-height:1.5;}
.listenPlayBtn{position:absolute;top:12px;right:12px;width:28px;height:28px;
  border-radius:50%;border:1px solid rgba(68,238,68,.3);background:rgba(68,238,68,.05);
  display:flex;align-items:center;justify-content:center;font-size:12px;color:#44ee44;}
.listenCard{position:relative;}
.histCard.expanded,.masterCard.expanded{background:rgba(255,250,235,.08);border-color:rgba(255,215,0,.2);}
.histEra{font-size:8px;padding:1px 8px;border-radius:8px;display:inline-block;
  border:1px solid rgba(255,215,0,.15);color:rgba(240,230,200,.5);margin-bottom:4px;}
.histBody,.masterBody{display:none;font-size:10px;color:rgba(240,230,200,.7);margin-top:8px;
  line-height:1.7;padding-top:6px;border-top:1px solid rgba(255,215,0,.06);}
.histCard.expanded .histBody,.masterCard.expanded .masterBody{display:block;}
.masterCard.completed{border-left:3px solid #44ee44;}
.masterNum{display:inline-block;width:22px;height:22px;border-radius:50%;
  background:rgba(255,215,0,.1);color:#ffd700;font-size:10px;font-weight:700;
  text-align:center;line-height:22px;margin-right:6px;}
.masterTitle{font-size:12px;color:#ffd700;font-weight:700;display:inline;}
.masterTeacher{font-size:9px;color:rgba(201,169,110,.4);display:block;margin-top:2px;}
.masterTip{background:rgba(255,250,235,.06);border-radius:6px;padding:6px 10px;margin:6px 0;
  font-size:9px;color:rgba(201,169,110,.6);border:1px solid rgba(200,190,160,.06);}
.warmupCard{width:100%;max-width:380px;padding:10px 14px;margin:3px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:all .15s;}
.warmupCard:active{background:rgba(255,215,0,.12);}
.warmupCard.done{border-color:rgba(68,238,68,.3);background:rgba(68,238,68,.03);}
.warmupChk{width:22px;height:22px;border-radius:50%;border:2px solid rgba(255,215,0,.2);
  display:flex;align-items:center;justify-content:center;font-size:12px;color:#44ee44;
  transition:all .15s;flex-shrink:0;background:rgba(255,250,235,.04);}
.warmupCard.done .warmupChk{border-color:rgba(68,238,68,.4);background:rgba(68,238,68,.1);}
.warmupText{font-size:11px;color:rgba(240,230,200,.7);}
.warmupTime{font-size:8px;color:rgba(201,169,110,.3);margin-top:2px;}
.warmupProg{width:100%;max-width:380px;height:8px;background:rgba(255,250,235,.06);
  border-radius:4px;margin:8px 0;overflow:hidden;}
.warmupPFill{height:100%;background:linear-gradient(90deg,#44ee44,#ffd700);border-radius:4px;transition:width .3s;}
.anCards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;width:100%;max-width:380px;margin:6px 0;}
.anCard{background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.08);
  border-radius:8px;padding:8px;text-align:center;}
.anVal{font-size:18px;color:#ffd700;font-weight:700;}
.anLbl{font-size:8px;color:rgba(201,169,110,.4);margin-top:2px;}
.ensPlayBtn{display:inline-block;margin-top:6px;padding:5px 16px;border-radius:14px;
  font-size:10px;cursor:pointer;border:1px solid rgba(68,238,68,.3);
  color:#44ee44;background:rgba(68,238,68,.05);transition:all .15s;font-family:Georgia,serif;}
.ensPlayBtn:active{transform:scale(.95);background:rgba(68,238,68,.12);}
.v12Close{position:absolute;top:12px;right:16px;font-size:22px;color:#ffd700;
  cursor:pointer;z-index:5;width:28px;height:28px;display:flex;align-items:center;
  justify-content:center;border-radius:50%;border:1px solid rgba(255,215,0,.2);
  background:rgba(0,0,0,.4);transition:all .15s;}
.v12Close:active{transform:scale(.9);background:rgba(255,215,0,.1);}
.v12Fab{position:fixed;left:4px;top:50%;transform:translateY(-50%);z-index:200;
  display:flex;flex-direction:column;gap:3px;}
.v12FabBtn{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:14px;cursor:pointer;
  background:rgba(0,0,0,.7);border:1px solid rgba(255,215,0,.2);
  transition:all .15s;backdrop-filter:blur(4px);}
.v12FabBtn:active{transform:scale(.9);background:rgba(255,215,0,.15);}
@media(max-width:480px){.v12Fab{position:fixed;left:0;right:0;bottom:56px;top:auto;
  transform:none;flex-direction:row;justify-content:center;padding:4px;
  background:rgba(0,0,0,.85);border-top:1px solid rgba(255,215,0,.1);}}
`;
document.head.appendChild(sty);

/* ─── 3. ORCHESTRA SEATING CHART ─── */
var ORCH_SECTIONS=[
  {name:'1st Vn',nameEN:'1st Violin',color:'#ff6644',x:.25,y:.65,r:30,seats:16,desc:'멜로디를 주도하는 핵심 파트. 지휘자 왼쪽에 위치.'},
  {name:'2nd Vn',nameEN:'2nd Violin',color:'#44ddee',x:.45,y:.65,r:28,seats:14,desc:'화성을 보강하고 제1 바이올린과 대화.'},
  {name:'비올라',nameEN:'Viola',color:'#cc55ff',x:.6,y:.55,r:22,seats:12,desc:'중음역 파트. 바이올린과 첼로 사이의 따뜻한 음색.'},
  {name:'첼로',nameEN:'Cello',color:'#ffdd33',x:.75,y:.6,r:22,seats:10,desc:'저음역 멜로디와 베이스라인.'},
  {name:'베이스',nameEN:'Double Bass',color:'#88cc44',x:.85,y:.45,r:18,seats:8,desc:'가장 낮은 현악기. 오케스트라의 토대.'},
  {name:'플루트',nameEN:'Flute',color:'#aaddff',x:.3,y:.35,r:14,seats:3,desc:'높고 맑은 목관악기.'},
  {name:'오보에',nameEN:'Oboe',color:'#ffaa44',x:.45,y:.32,r:14,seats:3,desc:'튜닝 기준 악기.'},
  {name:'클라리넷',nameEN:'Clarinet',color:'#77bbff',x:.55,y:.28,r:14,seats:3,desc:'넓은 음역의 목관악기.'},
  {name:'바순',nameEN:'Bassoon',color:'#cc8844',x:.7,y:.3,r:14,seats:3,desc:'목관 저음역.'},
  {name:'호른',nameEN:'Horn',color:'#ddbb44',x:.3,y:.2,r:16,seats:4,desc:'금관악기의 꽃.'},
  {name:'트럼펫',nameEN:'Trumpet',color:'#ff4466',x:.5,y:.18,r:14,seats:3,desc:'화려한 금관악기.'},
  {name:'트롬본',nameEN:'Trombone',color:'#ee8844',x:.65,y:.15,r:14,seats:3,desc:'슬라이드 금관악기.'},
  {name:'타악기',nameEN:'Percussion',color:'#ff88cc',x:.8,y:.12,r:18,seats:4,desc:'팀파니, 심벌즈 등.'},
  {name:'하프',nameEN:'Harp',color:'#aaeeff',x:.15,y:.4,r:12,seats:1,desc:'47개 줄의 천상의 음색.'},
  {name:'지휘',nameEN:'Conductor',color:'#ffd700',x:.5,y:.8,r:10,seats:1,desc:'음악적 해석과 지시.'}
];

function createOrchPanel(){
  var panel=document.createElement('div');panel.id='orchPanel';
  panel.innerHTML='<span class="v12Close" id="orchClose">&times;</span>'+
    '<h3>&#127932; 오케스트라 배치도</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:6px;">15개 악기 섹션 인터랙티브 배치도</div>'+
    '<canvas id="orchCanvas" width="400" height="320"></canvas>'+
    '<div id="orchInfoArea" class="orchInfo">악기 섹션을 터치하세요.</div>'+
    '<div id="orchSections" style="text-align:center;margin:6px 0;"></div>';
  document.body.appendChild(panel);
  document.getElementById('orchClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  var secDiv=document.getElementById('orchSections');
  ORCH_SECTIONS.forEach(function(s,i){
    var el=document.createElement('span');el.className='orchSect';el.textContent=s.name;
    el.addEventListener('pointerdown',function(e){e.preventDefault();highlightOrch(i);});
    secDiv.appendChild(el);
  });
}

var orchSelected=-1;
function drawOrchCanvas(hl){
  var cv=document.getElementById('orchCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);
  ctx.beginPath();ctx.ellipse(w*.5,h*.75,w*.45,h*.35,0,Math.PI,0);
  ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=2;ctx.stroke();
  ORCH_SECTIONS.forEach(function(s,i){
    var cx=s.x*w,cy=(1-s.y)*h,r=s.r;
    var hex=s.color;
    var rr=parseInt(hex.slice(1,3),16),gg=parseInt(hex.slice(3,5),16),bb=parseInt(hex.slice(5,7),16);
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle='rgba('+rr+','+gg+','+bb+','+(hl===i?.35:.1)+')';ctx.fill();
    ctx.strokeStyle='rgba('+rr+','+gg+','+bb+','+(hl===i?.8:.3)+')';
    ctx.lineWidth=hl===i?2:1;ctx.stroke();
    ctx.fillStyle='rgba('+rr+','+gg+','+bb+','+(hl===i?1:.6)+')';
    ctx.font=(hl===i?'bold ':'')+'9px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(s.name,cx,cy);
  });
}

function highlightOrch(idx){
  orchSelected=idx;drawOrchCanvas(idx);
  var s=ORCH_SECTIONS[idx];
  var info=document.getElementById('orchInfoArea');
  if(info)info.innerHTML='<b style="color:'+s.color+'">'+s.name+'</b> ('+s.nameEN+') '+s.seats+'석<br>'+s.desc;
  document.querySelectorAll('.orchSect').forEach(function(el,i){el.classList.toggle('active',i===idx);});
  v12Sfx('orch_open');addHistory('general','오케스트라: '+s.name);
}

/* ─── 4. LISTENING ROOM (12 masterpieces) ─── */
var LISTEN_TRACKS=[
  {title:'사계 - 봄',composer:'비발디',year:1725,desc:'밝고 경쾌한 봄의 도래.',notes:[{n:'E5',d:.3},{n:'E5',d:.3},{n:'F#5',d:.3},{n:'G#5',d:.6},{n:'G#5',d:.3},{n:'F#5',d:.3},{n:'E5',d:.6}]},
  {title:'사계 - 겨울',composer:'비발디',year:1725,desc:'추위를 트레몰로로 표현.',notes:[{n:'F4',d:.15},{n:'F4',d:.15},{n:'F4',d:.15},{n:'F4',d:.15},{n:'Ab4',d:.3},{n:'G4',d:.3},{n:'F4',d:.6}]},
  {title:'바이올린 소나타 봄',composer:'베토벤',year:1801,desc:'밝고 서정적인 소나타.',notes:[{n:'F5',d:.5},{n:'A5',d:.25},{n:'C6',d:.25},{n:'A5',d:.5},{n:'F5',d:.5},{n:'C5',d:.5}]},
  {title:'치고이네르바이젠',composer:'사라사테',year:1878,desc:'집시풍 초절기교 명곡.',notes:[{n:'C5',d:.4},{n:'D5',d:.2},{n:'Eb5',d:.4},{n:'D5',d:.2},{n:'C5',d:.4},{n:'B4',d:.2},{n:'C5',d:.6}]},
  {title:'타이스의 명상곡',composer:'마스네',year:1894,desc:'명상적이고 아름다운 선율.',notes:[{n:'D5',d:.8},{n:'E5',d:.4},{n:'F#5',d:.4},{n:'G5',d:.8},{n:'A5',d:.4},{n:'G5',d:.8}]},
  {title:'서주와 론도 카프리치오소',composer:'생상스',year:1863,desc:'스페인풍 화려한 기교.',notes:[{n:'A4',d:.3},{n:'C#5',d:.3},{n:'E5',d:.3},{n:'A5',d:.6},{n:'G#5',d:.3},{n:'E5',d:.6}]},
  {title:'바이올린 협주곡',composer:'멘델스존',year:1845,desc:'3대 협주곡 중 하나.',notes:[{n:'E5',d:.2},{n:'F#5',d:.2},{n:'G5',d:.4},{n:'B5',d:.4},{n:'A5',d:.2},{n:'G5',d:.4}]},
  {title:'사랑의 기쁨',composer:'크라이슬러',year:1905,desc:'비엔나 왈츠풍 앙코르.',notes:[{n:'C5',d:.5},{n:'E5',d:.25},{n:'G5',d:.25},{n:'C6',d:.5},{n:'B5',d:.5},{n:'G5',d:.5}]},
  {title:'바이올린 협주곡',composer:'차이콥스키',year:1878,desc:'러시아 낭만주의의 정수.',notes:[{n:'D5',d:.4},{n:'F#5',d:.4},{n:'A5',d:.2},{n:'D6',d:.6},{n:'C#6',d:.2},{n:'A5',d:.4}]},
  {title:'아베 마리아',composer:'구노/바흐',year:1853,desc:'불멸의 명곡.',notes:[{n:'E5',d:.8},{n:'G5',d:.4},{n:'C6',d:.4},{n:'B5',d:.8},{n:'A5',d:.4},{n:'G5',d:.8}]},
  {title:'유머레스크',composer:'드보르자크',year:1894,desc:'경쾌하면서도 애잔한 소품.',notes:[{n:'Gb5',d:.3},{n:'Ab5',d:.15},{n:'Gb5',d:.15},{n:'Eb5',d:.3},{n:'Db5',d:.3},{n:'Eb5',d:.6}]},
  {title:'G선상의 아리아',composer:'바흐',year:1731,desc:'G선 하나로 연주 가능한 명곡.',notes:[{n:'D5',d:.8},{n:'C#5',d:.4},{n:'D5',d:.4},{n:'E5',d:.4},{n:'F#5',d:.8},{n:'E5',d:.4},{n:'D5',d:.8}]}
];
var listenPlaying=-1,listenTimeout=null;
function createListenPanel(){
  var panel=document.createElement('div');panel.id='listenPanel';
  var html='<span class="v12Close" id="listenClose">&times;</span><h3>&#127911; 음악 감상실</h3><div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">12곡 명곡 감상</div>';
  LISTEN_TRACKS.forEach(function(t,i){
    html+='<div class="listenCard" data-idx="'+i+'"><div class="listenPlayBtn">&#9654;</div><div class="listenTitle">'+t.title+'</div><div class="listenComposer">'+t.composer+' ('+t.year+')</div><div class="listenDesc">'+t.desc+'</div></div>';
  });
  panel.innerHTML=html;document.body.appendChild(panel);
  document.getElementById('listenClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');stopListen();});
  panel.querySelectorAll('.listenCard').forEach(function(card){
    card.addEventListener('pointerdown',function(e){e.preventDefault();var idx=parseInt(card.dataset.idx);if(listenPlaying===idx){stopListen();}else{playListen(idx);}});
  });
}
function playListen(idx){
  stopListen();
  var actx=new(window.AudioContext||window.webkitAudioContext)();
  listenPlaying=idx;
  document.querySelectorAll('.listenCard').forEach(function(c,i){c.classList.toggle('playing',i===idx);});
  var track=LISTEN_TRACKS[idx];v12Sfx('listen_play');addHistory('general','감상실: '+track.title);
  var noteMap={'C4':261.63,'D4':293.66,'Eb4':311.13,'E4':329.63,'F4':349.23,'F#4':369.99,'G4':392,'G#4':415.3,'Ab4':415.3,'A4':440,'Bb4':466.16,'B4':493.88,'C5':523.25,'C#5':554.37,'D5':587.33,'Db5':554.37,'Eb5':622.25,'E5':659.26,'F5':698.46,'F#5':739.99,'Gb5':739.99,'G5':783.99,'G#5':830.61,'Ab5':830.61,'A5':880,'Bb5':932.33,'B5':987.77,'C6':1046.5,'C#6':1108.73,'D6':1174.66};
  var t=actx.currentTime+.1;
  track.notes.forEach(function(n){
    var freq=noteMap[n.n]||440;var osc=actx.createOscillator(),gain=actx.createGain();
    osc.connect(gain);gain.connect(actx.destination);osc.type='sine';osc.frequency.setValueAtTime(freq,t);
    gain.gain.setValueAtTime(.12,t);gain.gain.exponentialRampToValueAtTime(.001,t+n.d*1.5-.01);
    osc.start(t);osc.stop(t+n.d*1.5);t+=n.d*1.5;
  });
  var totalDur=0;track.notes.forEach(function(n){totalDur+=n.d*1.5;});
  listenTimeout=setTimeout(function(){stopListen();},totalDur*1000+500);
  var prog=loadProgress();if(!prog['listen_'+idx]){prog['listen_'+idx]=true;saveProgress(prog);
    var cnt=0;for(var k in prog){if(k.startsWith('listen_'))cnt++;}
    if(cnt>=3)unlockAch('listen_3');if(cnt>=12)unlockAch('listen_all');}
}
function stopListen(){listenPlaying=-1;if(listenTimeout){clearTimeout(listenTimeout);listenTimeout=null;}
  document.querySelectorAll('.listenCard').forEach(function(c){c.classList.remove('playing');});}

/* ─── 5. POSITION MAP ─── */
var POS_DATA=[
  {pos:'1st',range:'G3-B5',desc:'기본 포지션. 대부분의 초급~중급 레퍼토리.',fingers:['G3-A3-B3','D4-E4-F#4','A4-B4-C#5','E5-F#5-G#5']},
  {pos:'2nd',range:'A3-C#6',desc:'1st에서 반음~온음 위. 연결 패시지.',fingers:['A3-B3-C4','E4-F#4-G4','B4-C#5-D5','F#5-G#5-A5']},
  {pos:'3rd',range:'B3-E6',desc:'멜로디 연주에 자주 사용. 중급 필수.',fingers:['B3-C4-D4','F#4-G4-A4','C#5-D5-E5','G#5-A5-B5']},
  {pos:'4th',range:'C4-F#6',desc:'높은 음역 연결.',fingers:['C4-D4-E4','G4-A4-B4','D5-E5-F#5','A5-B5-C#6']},
  {pos:'5th',range:'D4-A6',desc:'고음역 진입.',fingers:['D4-E4-F#4','A4-B4-C#5','E5-F#5-G#5','B5-C#6-D6']},
  {pos:'6th',range:'E4-B6',desc:'고급 레퍼토리 필수.',fingers:['E4-F#4-G4','B4-C#5-D5','F#5-G#5-A5','C#6-D6-E6']},
  {pos:'7th',range:'F#4-D7',desc:'솔로 카덴차에 빈번.',fingers:['F#4-G4-A4','C#5-D5-E5','G#5-A5-B5','D6-E6-F#6']}
];
function createPosPanel(){
  var panel=document.createElement('div');panel.id='posPanel';
  panel.innerHTML='<span class="v12Close" id="posClose">&times;</span><h3>&#128204; 포지션 맵</h3><div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:6px;">7개 포지션 지판 시각화</div><div style="text-align:center;margin:4px 0;" id="posSelectArea"></div><canvas id="posCanvas" width="380" height="260"></canvas><div id="posInfoArea" class="posInfo">포지션을 선택하세요.</div>';
  document.body.appendChild(panel);
  document.getElementById('posClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  var sel=document.getElementById('posSelectArea');
  POS_DATA.forEach(function(p,i){
    var btn=document.createElement('span');btn.className='orchSect';btn.textContent=p.pos;
    btn.addEventListener('pointerdown',function(e){e.preventDefault();drawPosCanvas(i);});sel.appendChild(btn);
  });
}
function drawPosCanvas(idx){
  var cv=document.getElementById('posCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
  var p=POS_DATA[idx];var strNames=['G','D','A','E'];var strColors=['#44ee44','#cc55ff','#44ddee','#ffdd33'];
  for(var si=0;si<4;si++){
    var sy=50+si*52;ctx.strokeStyle=strColors[si];ctx.lineWidth=4-si;
    ctx.beginPath();ctx.moveTo(40,sy);ctx.lineTo(w-20,sy);ctx.stroke();
    ctx.fillStyle=strColors[si];ctx.font='10px Georgia';ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillText(strNames[si],30,sy);
    var fingers=p.fingers[si].split('-');
    fingers.forEach(function(note,fi){
      var fx=80+fi*90;ctx.beginPath();ctx.arc(fx,sy,14,0,Math.PI*2);
      ctx.fillStyle='rgba(255,215,0,.15)';ctx.fill();ctx.strokeStyle='rgba(255,215,0,.4)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='#ffd700';ctx.font='9px Georgia';ctx.textAlign='center';ctx.fillText(note,fx,sy);
    });
  }
  ctx.fillStyle='rgba(255,215,0,.6)';ctx.font='bold 14px Georgia';ctx.textAlign='center';ctx.fillText(p.pos+' Position',w/2,25);
  ctx.fillStyle='rgba(201,169,110,.4)';ctx.font='10px Georgia';ctx.fillText(p.range,w/2,h-10);
  document.getElementById('posInfoArea').innerHTML='<b style="color:#ffd700">'+p.pos+'</b> ('+p.range+') '+p.desc;
  v12Sfx('pos_tap');addHistory('general','포지션맵: '+p.pos);
  var prog=loadProgress();if(!prog['pos_'+idx]){prog['pos_'+idx]=true;saveProgress(prog);
    var cnt=0;for(var k in prog){if(k.startsWith('pos_'))cnt++;}
    if(cnt>=3)unlockAch('pos_3');if(cnt>=7)unlockAch('pos_all');}
}

/* ─── 6. VIOLIN HISTORY MUSEUM ─── */
var HIST_DATA=[
  {era:'태동기',year:'1520-1550',title:'바이올린의 탄생',body:'이탈리아 북부에서 비올, 레벡, 리라 다 브라치오의 특징을 결합하여 현대 바이올린의 원형이 탄생.'},
  {era:'아마티',year:'1550-1640',title:'안드레아 아마티의 공방',body:'크레모나의 안드레아 아마티가 현대 바이올린 형태를 확립. 프랑스 왕실 의뢰로 바이올린 세트 제작.'},
  {era:'황금기I',year:'1640-1700',title:'니콜로 아마티와 제자들',body:'니콜로 아마티가 음색을 개량. 그의 제자 스트라디바리와 과르네리가 탄생.'},
  {era:'황금기II',year:'1700-1740',title:'스트라디바리의 전성기',body:'안토니오 스트라디바리가 약 1,100대의 악기를 제작. 골든 피리어드에 최고의 바이올린 탄생.'},
  {era:'과르네리',year:'1720-1745',title:'과르네리 델 제수',body:'주세페 과르네리가 강렬하고 파워풀한 음색의 바이올린 제작. 파가니니가 애용.'},
  {era:'전환기',year:'1750-1800',title:'현대적 개량',body:'활의 길이 증가, 턱받침 도입, 현 장력 강화. 콘서트홀 규모 확대에 대응.'},
  {era:'파가니니',year:'1800-1840',title:'악마의 바이올리니스트',body:'니콜로 파가니니가 초절기교를 개척. 24 카프리스, 왼손 피치카토 등 기법 혁신.'},
  {era:'낭만주의',year:'1840-1900',title:'위대한 협주곡의 시대',body:'멘델스존/차이콥스키/브람스/브루흐의 협주곡 탄생. 요아힘, 사라사테가 활약.'},
  {era:'러시안',year:'1900-1950',title:'아우어와 러시안 스쿨',body:'레오폴트 아우어의 제자들이 세계를 석권. 러시안 바이올린 학파 전성기.'},
  {era:'현대I',year:'1950-1980',title:'다양한 악파의 공존',body:'오이스트라흐, 스턴, 그뤼미오, 셰링 등 다양한 국적의 거장 활약.'},
  {era:'현대II',year:'1980-2010',title:'기교와 해석의 융합',body:'무터/정경화/펄만/크레머/힐러리 한 등이 기교와 음악적 깊이를 결합.'},
  {era:'21세기',year:'2010-현재',title:'디지털 시대의 바이올린',body:'레이 첸/양인모 등 신세대 활약. 전자바이올린, 온라인 교육, AI 연습 도구 등 혁신.'}
];
function createHistPanel(){
  var panel=document.createElement('div');panel.id='histPanel';
  var html='<span class="v12Close" id="histClose">&times;</span><h3>&#127963; 바이올린 역사관</h3><div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">500년의 바이올린 역사 12시대</div>';
  HIST_DATA.forEach(function(h,i){
    html+='<div class="histCard" data-idx="'+i+'"><div class="histEra">'+h.era+'</div><div class="histTitle">'+h.title+'</div><div class="histYear">'+h.year+'</div><div class="histBody">'+h.body+'</div></div>';
  });
  panel.innerHTML=html;document.body.appendChild(panel);
  document.getElementById('histClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  panel.querySelectorAll('.histCard').forEach(function(card){
    card.addEventListener('pointerdown',function(e){e.preventDefault();
      var was=card.classList.contains('expanded');
      panel.querySelectorAll('.histCard').forEach(function(c){c.classList.remove('expanded');});
      if(!was){card.classList.add('expanded');v12Sfx('history_open');
        var idx=parseInt(card.dataset.idx);var prog=loadProgress();
        if(!prog['hist_'+idx]){prog['hist_'+idx]=true;saveProgress(prog);
          var cnt=0;for(var k in prog){if(k.startsWith('hist_'))cnt++;}
          if(cnt>=6)unlockAch('hist_scholar');if(cnt>=12)unlockAch('hist_master');}
        addHistory('general','역사관: '+HIST_DATA[idx].title);}
    });
  });
}

/* ─── 7. DAILY WARMUP ─── */
var WARMUP_TASKS=[
  {text:'개방현 롱톤 (각 현 4회)',time:'2분',icon:'&#127931;'},
  {text:'G 장조 스케일 상행+하행',time:'2분',icon:'&#127932;'},
  {text:'활 분배 연습 (전활/반활)',time:'2분',icon:'&#127935;'},
  {text:'비브라토 워밍업 (느린 속도)',time:'2분',icon:'&#127925;'},
  {text:'음정 확인 튜너 체크',time:'1분',icon:'&#127908;'},
  {text:'현 이동 연습 (인접현)',time:'2분',icon:'&#127926;'},
  {text:'손가락 독립 운동',time:'1분',icon:'&#128170;'},
  {text:'오늘의 연습곡 1절 시주',time:'3분',icon:'&#127911;'}
];
function createWarmupPanel(){
  var panel=document.createElement('div');panel.id='warmupPanel';
  panel.innerHTML='<span class="v12Close" id="warmupClose">&times;</span><h3>&#9728;&#65039; 일일 워밍업</h3><div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:6px;">8과제 워밍업 체크리스트</div><div class="warmupProg"><div class="warmupPFill" id="warmupProgFill" style="width:0%"></div></div><div id="warmupList"></div><div style="text-align:center;margin-top:8px;font-size:10px;color:rgba(201,169,110,.3);" id="warmupStatus"></div>';
  document.body.appendChild(panel);
  document.getElementById('warmupClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}
function renderWarmup(){
  var list=document.getElementById('warmupList');if(!list)return;
  var today=new Date().toISOString().slice(0,10);var prog=loadProgress();var ws=prog['warmup_'+today]||{};
  var html='';WARMUP_TASKS.forEach(function(t,i){var done=ws[i]||false;
    html+='<div class="warmupCard'+(done?' done':'')+'" data-idx="'+i+'"><div class="warmupChk">'+(done?'&#10003;':'')+'</div><div><div class="warmupText">'+t.icon+' '+t.text+'</div><div class="warmupTime">'+t.time+'</div></div></div>';
  });
  list.innerHTML=html;
  var dc=0;WARMUP_TASKS.forEach(function(t,i){if(ws[i])dc++;});
  var fill=document.getElementById('warmupProgFill');if(fill)fill.style.width=Math.round(dc/WARMUP_TASKS.length*100)+'%';
  var st=document.getElementById('warmupStatus');if(st)st.textContent=dc===WARMUP_TASKS.length?'&#10024; 오늘 워밍업 완료!':dc+'/'+WARMUP_TASKS.length+' 완료';
  list.querySelectorAll('.warmupCard').forEach(function(card){
    card.addEventListener('pointerdown',function(e){e.preventDefault();
      var idx=parseInt(card.dataset.idx);ws[idx]=!ws[idx];prog['warmup_'+today]=ws;saveProgress(prog);
      v12Sfx(ws[idx]?'warmup_done':'warmup_tick');renderWarmup();
      var c=0;WARMUP_TASKS.forEach(function(t,i){if(ws[i])c++;});
      if(c>=4)unlockAch('warmup_half');if(c>=8)unlockAch('warmup_all');
    });
  });
}

/* ─── 8. PRACTICE ANALYSIS DASHBOARD ─── */
function createAnalysisPanel(){
  var panel=document.createElement('div');panel.id='analysisPanel';
  panel.innerHTML='<span class="v12Close" id="analysisClose">&times;</span><h3>&#128202; 연습 분석 대시보드</h3><div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:6px;">6축 레이더 + 통계</div><div class="anCards" id="anCards"></div><canvas id="analysisCanvas" width="380" height="380"></canvas>';
  document.body.appendChild(panel);
  document.getElementById('analysisClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}
function drawAnalysis(){
  var stats=loadStats();var prog=loadProgress();var achs=loadAchievements();
  var tn=stats.totalNotes||0,pf=stats.perfects||0,ts=stats.songsCompleted||0;
  var tl=0;for(var k in prog){if(k.startsWith('lessonDone'))tl++;}
  var ac=Object.keys(achs).length,str=stats.streak||0;
  var cards=document.getElementById('anCards');
  if(cards)cards.innerHTML='<div class="anCard"><div class="anVal">'+tn+'</div><div class="anLbl">총 노트</div></div><div class="anCard"><div class="anVal">'+pf+'</div><div class="anLbl">Perfect</div></div><div class="anCard"><div class="anVal">'+ts+'</div><div class="anLbl">완주 곡</div></div><div class="anCard"><div class="anVal">'+tl+'</div><div class="anLbl">레슨</div></div><div class="anCard"><div class="anVal">'+ac+'</div><div class="anLbl">업적</div></div><div class="anCard"><div class="anVal">'+str+'</div><div class="anLbl">연속일</div></div>';
  var cv=document.getElementById('analysisCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
  var cx=w/2,cy=h/2,maxR=140;
  var labels=['노트수','정확도','곡완주','레슨','업적','연속일'];
  var maxVals=[5000,500,30,120,94,30];
  var values=[Math.min(tn,5000),Math.min(pf,500),Math.min(ts,30),Math.min(tl,120),Math.min(ac,94),Math.min(str,30)];
  var ratios=values.map(function(v,i){return v/maxVals[i];});
  for(var ring=5;ring>=1;ring--){
    var rr=maxR*ring/5;ctx.beginPath();
    for(var a=0;a<6;a++){var angle=Math.PI*2*a/6-Math.PI/2;var px=cx+rr*Math.cos(angle),py=cy+rr*Math.sin(angle);a===0?ctx.moveTo(px,py):ctx.lineTo(px,py);}
    ctx.closePath();ctx.strokeStyle='rgba(255,215,0,'+(ring===5?.15:.06)+')';ctx.lineWidth=1;ctx.stroke();
  }
  for(var ai=0;ai<6;ai++){
    var angle=Math.PI*2*ai/6-Math.PI/2;ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.lineTo(cx+maxR*Math.cos(angle),cy+maxR*Math.sin(angle));ctx.strokeStyle='rgba(255,215,0,.08)';ctx.stroke();
    var lx=cx+(maxR+20)*Math.cos(angle),ly=cy+(maxR+20)*Math.sin(angle);
    ctx.fillStyle='rgba(201,169,110,.5)';ctx.font='9px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(labels[ai],lx,ly);
  }
  ctx.beginPath();
  for(var vi=0;vi<6;vi++){var angle=Math.PI*2*vi/6-Math.PI/2;var vr=maxR*Math.max(ratios[vi],.05);var vx=cx+vr*Math.cos(angle),vy=cy+vr*Math.sin(angle);vi===0?ctx.moveTo(vx,vy):ctx.lineTo(vx,vy);}
  ctx.closePath();ctx.fillStyle='rgba(255,215,0,.12)';ctx.fill();ctx.strokeStyle='rgba(255,215,0,.6)';ctx.lineWidth=2;ctx.stroke();
  for(var di=0;di<6;di++){var angle=Math.PI*2*di/6-Math.PI/2;var dr=maxR*Math.max(ratios[di],.05);ctx.beginPath();ctx.arc(cx+dr*Math.cos(angle),cy+dr*Math.sin(angle),4,0,Math.PI*2);ctx.fillStyle='#ffd700';ctx.fill();}
  v12Sfx('analysis_open');addHistory('general','연습 분석 대시보드 조회');unlockAch('analysis_view');
}

/* ─── 9. MASTER CLASS (12 lectures) ─── */
var MASTER_DATA=[
  {num:1,title:'올바른 악기 자세',teacher:'기초반',body:'바이올린을 턱과 어깨 사이에 안정적으로 거치하고, 왼팔은 자연스럽게.',tip:'턱받침에 지나치게 힘을 주지 마세요.'},
  {num:2,title:'활 잡기의 기본',teacher:'기초반',body:'엄지는 둥글게, 검지~소지가 활대 위에 자연스럽게 감싸듯.',tip:'프랑코-벨기에식 활잡기가 가장 보편적.'},
  {num:3,title:'활의 분배와 속도',teacher:'중급반',body:'전활에서 반활, 3분의 1활까지 다양한 분배를 연습.',tip:'활 끝과 프로그에서 소리가 약해지지 않도록.'},
  {num:4,title:'음정의 이해와 훈련',teacher:'중급반',body:'프렛이 없으므로 음정 감각이 핵심. 개방현 공명을 활용한 음정 확인법.',tip:'드론과 함께 스케일을 연습하면 음정이 빠르게 교정.'},
  {num:5,title:'비브라토의 3가지 종류',teacher:'중급반',body:'손목/팔/손가락 비브라토. 각각의 특성과 적용법.',tip:'느린 속도로 시작하여 점차 빠르게. 메트로놈 활용.'},
  {num:6,title:'포지션 체인지 테크닉',teacher:'고급반',body:'가이드 핑거를 활용. 글리산도가 들리지 않도록 부드럽게.',tip:'이동 중 활 압력을 줄이면 소음 최소화.'},
  {num:7,title:'더블스톱과 화음',teacher:'고급반',body:'3도/6도/옥타브 더블스톱의 음정 잡기.',tip:'한 음씩 따로 음정 확인 후 합치세요.'},
  {num:8,title:'스타카토와 스피카토',teacher:'고급반',body:'온활 스타카토, 활 튀기기, 소티에의 차이와 연습법.',tip:'스피카토는 밸런스 포인트에서 시작.'},
  {num:9,title:'음색 만들기',teacher:'마스터반',body:'접촉점, 활 속도, 활 압력의 3요소 조합으로 음색 조절.',tip:'술 폰티첼로는 날카롭고, 술 타스토는 부드러운 음색.'},
  {num:10,title:'무대 연주의 심리학',teacher:'마스터반',body:'연주 불안 극복법, 집중력 유지, 호흡과 릴랙세이션.',tip:'음악에 집중한다는 마인드셋으로.'},
  {num:11,title:'실내악의 기술',teacher:'마스터반',body:'앙상블에서의 역할 분담, 아이컨택, 호흡 맞추기.',tip:'리드와 서포트 역할을 번갈아 연습.'},
  {num:12,title:'자신만의 해석 만들기',teacher:'마스터반',body:'악보를 넘어 자신만의 프레이징, 루바토, 다이내믹 설계.',tip:'같은 곡의 여러 거장 녹음을 비교 청취.'}
];
function createMasterPanel(){
  var panel=document.createElement('div');panel.id='masterPanel';
  var html='<span class="v12Close" id="masterClose">&times;</span><h3>&#127891; 마스터클래스 12강</h3><div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">기초~마스터반 단계별 레슨</div>';
  MASTER_DATA.forEach(function(m){
    html+='<div class="masterCard" data-num="'+m.num+'"><div class="masterNum">'+m.num+'</div><div class="masterTitle">'+m.title+'</div><div class="masterTeacher">'+m.teacher+'</div><div class="masterBody">'+m.body+'<div class="masterTip">&#128161; '+m.tip+'</div></div></div>';
  });
  panel.innerHTML=html;document.body.appendChild(panel);
  document.getElementById('masterClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  panel.querySelectorAll('.masterCard').forEach(function(card){
    card.addEventListener('pointerdown',function(e){e.preventDefault();
      var was=card.classList.contains('expanded');
      panel.querySelectorAll('.masterCard').forEach(function(c){c.classList.remove('expanded');});
      if(!was){card.classList.add('expanded');v12Sfx('master_open');
        var num=parseInt(card.dataset.num);var prog=loadProgress();
        if(!prog['master_'+num]){prog['master_'+num]=true;saveProgress(prog);card.classList.add('completed');
          var cnt=0;for(var k in prog){if(k.startsWith('master_'))cnt++;}
          if(cnt>=6)unlockAch('master_half');if(cnt>=12)unlockAch('master_all');}
        addHistory('general','마스터클래스: '+MASTER_DATA[num-1].title);}
    });
  });
}

/* ─── 10. ENSEMBLE ─── */
var ENSEMBLE_DATA=[
  {title:'파헬벨 캐논',parts:'Vn1+Vn2+Vn3+Vc',desc:'3대의 바이올린이 카논으로 진입.',
   harmony:[{n:'D4',d:.5},{n:'A3',d:.5},{n:'B3',d:.5},{n:'F#3',d:.5},{n:'G3',d:.5},{n:'D3',d:.5},{n:'G3',d:.5},{n:'A3',d:.5}]},
  {title:'아이네 클라이네 나흐트무지크',parts:'Vn1+Vn2+Va+Vc',desc:'모차르트 세레나데.',
   harmony:[{n:'G3',d:.5},{n:'G3',d:.5},{n:'G3',d:.25},{n:'G3',d:.25},{n:'G3',d:.25},{n:'G3',d:.5}]},
  {title:'비발디 조화의 영감',parts:'Solo Vn+Tutti',desc:'바이올린 협주곡 A단조.',
   harmony:[{n:'A3',d:.5},{n:'A3',d:.5},{n:'E3',d:.5},{n:'E3',d:.5}]},
  {title:'차이콥스키 현악 세레나데',parts:'Vn1+Vn2+Va+Vc+Cb',desc:'현악의 걸작.',
   harmony:[{n:'C3',d:.8},{n:'G3',d:.4},{n:'C3',d:.4},{n:'G3',d:.8},{n:'C3',d:.4},{n:'G3',d:.8}]},
  {title:'보로딘 야상곡',parts:'Vn1+Vn2+Va+Vc',desc:'서정적인 멜로디의 극치.',
   harmony:[{n:'D3',d:.8},{n:'D3',d:.8},{n:'A3',d:.8},{n:'D3',d:.8}]},
  {title:'엘가 현을 위한 세레나데',parts:'Vn1+Vn2+Va+Vc+Cb',desc:'영국 현악의 아름다움.',
   harmony:[{n:'C4',d:.6},{n:'G3',d:.6},{n:'E3',d:.6},{n:'C3',d:.6}]}
];
function createEnsemblePanel(){
  var panel=document.createElement('div');panel.id='ensemblePanel';
  var html='<span class="v12Close" id="ensClose">&times;</span><h3>&#127930; 앙상블 파트 연습</h3><div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">6곡 파트별 연습 + 반주 재생</div>';
  ENSEMBLE_DATA.forEach(function(e,i){
    html+='<div class="ensCard" data-idx="'+i+'"><div class="ensTitle">'+e.title+'</div><div class="ensParts">'+e.parts+'</div><div style="font-size:9px;color:rgba(240,230,200,.5);margin-top:3px;">'+e.desc+'</div><div class="ensPlayBtn" data-idx="'+i+'">&#9654; 반주 재생</div></div>';
  });
  panel.innerHTML=html;document.body.appendChild(panel);
  document.getElementById('ensClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  panel.querySelectorAll('.ensPlayBtn').forEach(function(btn){
    btn.addEventListener('pointerdown',function(e){e.preventDefault();playEnsemble(parseInt(btn.dataset.idx));});
  });
}
function playEnsemble(idx){
  var actx=new(window.AudioContext||window.webkitAudioContext)();
  var piece=ENSEMBLE_DATA[idx];v12Sfx('ensemble_start');addHistory('general','앙상블: '+piece.title);
  var noteMap={'F#3':185,'G3':196,'A3':220,'B3':247,'C3':131,'D3':147,'E3':165,'C4':261.63,'D4':293.66,'G4':392};
  var t=actx.currentTime+.2;
  piece.harmony.forEach(function(n){
    var freq=noteMap[n.n]||220;var osc=actx.createOscillator(),gain=actx.createGain();
    osc.connect(gain);gain.connect(actx.destination);osc.type='triangle';osc.frequency.setValueAtTime(freq,t);
    gain.gain.setValueAtTime(.08,t);gain.gain.exponentialRampToValueAtTime(.001,t+n.d*2-.01);osc.start(t);osc.stop(t+n.d*2);t+=n.d*2;
  });
  document.querySelectorAll('.ensCard').forEach(function(c,i){c.classList.toggle('playing',i===idx);});
  var dur=0;piece.harmony.forEach(function(n){dur+=n.d*2;});
  setTimeout(function(){document.querySelectorAll('.ensCard').forEach(function(c){c.classList.remove('playing');});},dur*1000+500);
  var prog=loadProgress();if(!prog['ens_'+idx]){prog['ens_'+idx]=true;saveProgress(prog);
    var cnt=0;for(var k in prog){if(k.startsWith('ens_'))cnt++;}
    if(cnt>=3)unlockAch('ens_3');if(cnt>=6)unlockAch('ens_all');}
}

/* ─── 11. NEW SONGS (10: 84→94) ─── */
(function addSongs(){
  if(typeof window.SONGS==='undefined')return;
  var newSongs={
    '왈츠2':{name:'왈츠 No.2',category:'클래식',difficulty:'medium',bpm:96,notes:[{note:'D5',dur:1},{note:'E5',dur:.5},{note:'F#5',dur:.5},{note:'G5',dur:1},{note:'A5',dur:1},{note:'G5',dur:1},{note:'F#5',dur:.5},{note:'E5',dur:.5},{note:'D5',dur:2}]},
    '카르멘':{name:'카르멘 하바네라',category:'클래식',difficulty:'medium',bpm:72,notes:[{note:'D5',dur:.5},{note:'E5',dur:.25},{note:'F5',dur:.25},{note:'E5',dur:.25},{note:'D5',dur:.25},{note:'C#5',dur:.5},{note:'D5',dur:1},{note:'R',dur:.5},{note:'A4',dur:.5},{note:'Bb4',dur:.5},{note:'A4',dur:1}]},
    '무언가':{name:'무언가',category:'클래식',difficulty:'easy',bpm:68,notes:[{note:'E5',dur:.75},{note:'D#5',dur:.25},{note:'E5',dur:.5},{note:'B4',dur:.5},{note:'C5',dur:.5},{note:'A4',dur:1},{note:'R',dur:.5},{note:'E4',dur:.5},{note:'A4',dur:.5},{note:'B4',dur:1}]},
    '엘리제':{name:'엘리제를 위하여',category:'클래식',difficulty:'medium',bpm:80,notes:[{note:'E5',dur:.25},{note:'D#5',dur:.25},{note:'E5',dur:.25},{note:'D#5',dur:.25},{note:'E5',dur:.25},{note:'B4',dur:.25},{note:'D5',dur:.25},{note:'C5',dur:.25},{note:'A4',dur:1}]},
    '아리랑v2':{name:'아리랑 고급편곡',category:'한국',difficulty:'hard',bpm:66,notes:[{note:'A4',dur:.5},{note:'C5',dur:.5},{note:'D5',dur:1},{note:'E5',dur:.5},{note:'D5',dur:.5},{note:'C5',dur:.5},{note:'A4',dur:.5},{note:'G4',dur:1},{note:'A4',dur:2}]},
    '대장금':{name:'대장금 OST',category:'한국',difficulty:'medium',bpm:74,notes:[{note:'E5',dur:.5},{note:'D5',dur:.5},{note:'C5',dur:1},{note:'D5',dur:.5},{note:'E5',dur:.5},{note:'G5',dur:1},{note:'E5',dur:.5},{note:'D5',dur:.5},{note:'C5',dur:2}]},
    '봄왈츠':{name:'봄의 왈츠',category:'클래식',difficulty:'easy',bpm:108,notes:[{note:'G4',dur:1},{note:'B4',dur:.5},{note:'D5',dur:.5},{note:'G5',dur:1},{note:'F#5',dur:.5},{note:'E5',dur:.5},{note:'D5',dur:1},{note:'B4',dur:1}]},
    '가을바람':{name:'가을바람 세레나데',category:'오리지널',difficulty:'medium',bpm:64,notes:[{note:'A4',dur:1},{note:'C5',dur:.5},{note:'E5',dur:.5},{note:'D5',dur:1.5},{note:'C5',dur:.5},{note:'B4',dur:1},{note:'A4',dur:2}]},
    '달빛v':{name:'달빛소나타 편곡',category:'클래식',difficulty:'hard',bpm:56,notes:[{note:'G#4',dur:.5},{note:'C#5',dur:.5},{note:'E5',dur:.5},{note:'G#4',dur:.5},{note:'C#5',dur:.5},{note:'E5',dur:.5},{note:'G#4',dur:.5},{note:'C#5',dur:.5},{note:'E5',dur:.5}]},
    '새노래':{name:'새의 노래',category:'클래식',difficulty:'medium',bpm:60,notes:[{note:'G5',dur:1},{note:'F#5',dur:.5},{note:'E5',dur:.5},{note:'D5',dur:1},{note:'E5',dur:.5},{note:'F#5',dur:.5},{note:'G5',dur:2}]}
  };
  for(var key in newSongs){if(!window.SONGS[key])window.SONGS[key]=newSongs[key];}
})();

/* ─── 12. NEW LESSONS (10: 110→120) ─── */
(function addLessons(){
  if(typeof window.LESSONS==='undefined')return;
  var base=window.LESSONS.length;
  [
    {lv:base+1,title:'3rd 포지션 입문',desc:'G현 3rd 포지션으로 이동',targets:[{s:0,f:3,count:4}]},
    {lv:base+2,title:'3rd 포지션 A현',desc:'A현 3rd 포지션 연습',targets:[{s:2,f:3,count:4}]},
    {lv:base+3,title:'더블스톱 3도',desc:'G+D현 동시에 3도 화음',targets:[{s:0,f:1,count:2},{s:1,f:1,count:2}]},
    {lv:base+4,title:'마르텔레 기법',desc:'강한 악센트로 연주',targets:[{s:2,f:0,count:3},{s:2,f:1,count:3}]},
    {lv:base+5,title:'왈츠 리듬 연습',desc:'3/4 박자 강-약-약',targets:[{s:1,f:0,count:1},{s:1,f:1,count:1},{s:1,f:2,count:1},{s:1,f:0,count:1},{s:1,f:1,count:1},{s:1,f:2,count:1}]},
    {lv:base+6,title:'크로매틱 E현',desc:'E현 반음계 상행',targets:[{s:3,f:0,count:1},{s:3,f:1,count:1},{s:3,f:2,count:1},{s:3,f:3,count:1}]},
    {lv:base+7,title:'G장조 아르페지오',desc:'G-B-D-G 아르페지오',targets:[{s:0,f:0,count:1},{s:0,f:2,count:1},{s:1,f:0,count:1},{s:1,f:2,count:1}]},
    {lv:base+8,title:'대장금 테마',desc:'대장금 OST 주요 선율',targets:[{s:3,f:0,count:1},{s:2,f:3,count:1},{s:2,f:1,count:1},{s:2,f:3,count:1},{s:3,f:0,count:1}]},
    {lv:base+9,title:'트릴 연습',desc:'인접 두 음 빠른 교대',targets:[{s:2,f:1,count:2},{s:2,f:2,count:2},{s:2,f:1,count:2},{s:2,f:2,count:2}]},
    {lv:base+10,title:'v12 졸업 과제',desc:'모든 현 2번 포지션까지',targets:[{s:0,f:0,count:1},{s:0,f:1,count:1},{s:0,f:2,count:1},{s:1,f:0,count:1},{s:1,f:1,count:1},{s:1,f:2,count:1},{s:2,f:0,count:1},{s:2,f:1,count:1},{s:2,f:2,count:1},{s:3,f:0,count:1},{s:3,f:1,count:1},{s:3,f:2,count:1}]}
  ].forEach(function(l){window.LESSONS.push(l);});
})();

/* ─── 13. QUIZ v12 (15 questions) ─── */
var V12_QUIZ=[
  {q:'오케스트라에서 바이올린은 보통 몇 개 섹션으로 나뉘나?',a:['1개','2개','3개','4개'],c:1},
  {q:'스트라디바리우스의 골든 피리어드는?',a:['1600-1620','1650-1670','1700-1720','1750-1770'],c:2},
  {q:'3rd 포지션에서 G현 1번 손가락이 짚는 음은?',a:['A3','B3','C4','D4'],c:2},
  {q:'파헬벨 캐논에서 바이올린은 총 몇 파트?',a:['1파트','2파트','3파트','4파트'],c:2},
  {q:'술 폰티첼로는 어디 근처에서 연주하나?',a:['지판 위','브릿지 근처','넥 위','테일피스'],c:1},
  {q:'오케스트라 튜닝 기준음을 내는 악기는?',a:['플루트','바이올린','오보에','피아노'],c:2},
  {q:'안드레아 아마티가 활동한 도시는?',a:['로마','밀라노','크레모나','베네치아'],c:2},
  {q:'비브라토의 3가지 종류가 아닌 것은?',a:['손목','팔','손가락','활'],c:3},
  {q:'바이올린 활의 전통적 나무 소재는?',a:['가문비나무','페르남부코','단풍나무','흑단'],c:1},
  {q:'소티에는 어떤 주법인가?',a:['활을 붙여 느리게','빠른 스타카토','손가락 튕기기','활 나무로 치기'],c:1},
  {q:'엘가 현을 위한 세레나데의 작곡 국적은?',a:['독일','프랑스','영국','러시아'],c:2},
  {q:'일일 워밍업으로 가장 먼저 하는 것은?',a:['기교 연습','개방현 롱톤','빠른 스케일','비브라토'],c:1},
  {q:'현악 4중주의 구성이 아닌 것은?',a:['제1 바이올린','비올라','첼로','더블베이스'],c:3},
  {q:'파가니니가 애용한 바이올린 제작자는?',a:['스트라디바리','아마티','과르네리 델 제수','슈타이너'],c:2},
  {q:'프랑코-벨기에식 활잡기에서 새끼손가락 위치는?',a:['활대 아래','활대 위 둥글게','프로그 끝','활털 위'],c:1}
];
function createQuizV12Panel(){
  var panel=document.createElement('div');panel.id='quizV12Panel';
  panel.innerHTML='<span class="v12Close" id="quizV12Close">&times;</span><h3>&#10067; 바이올린 퀴즈 v12</h3><div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">15문항 심화 테스트</div><div id="quizV12Area" style="width:100%;max-width:360px;"></div>';
  document.body.appendChild(panel);
  document.getElementById('quizV12Close').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}
function startQuizV12(){
  var area=document.getElementById('quizV12Area');if(!area)return;
  var shuffled=V12_QUIZ.slice().sort(function(){return Math.random()-.5;});
  var state={idx:0,correct:0,total:shuffled.length};
  function showQ(){
    if(state.idx>=state.total){
      var pct=Math.round(state.correct/state.total*100);
      var grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
      area.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:36px;color:#ffd700;font-weight:900;">'+grade+'</div><div style="font-size:14px;color:#ffd700;margin:8px 0;">'+state.correct+'/'+state.total+' ('+pct+'%)</div><div class="ensPlayBtn" id="quizV12Retry">다시 도전</div></div>';
      document.getElementById('quizV12Retry').addEventListener('pointerdown',function(e){e.preventDefault();startQuizV12();});
      addHistory('general','퀴즈 v12: '+grade+' ('+pct+'%)');if(pct>=80)unlockAch('quiz_v12_ace');return;
    }
    var q=shuffled[state.idx];
    var html='<div style="font-size:10px;color:rgba(201,169,110,.3);margin-bottom:4px;">문제 '+(state.idx+1)+'/'+state.total+'</div><div style="font-size:12px;color:#ffd700;margin-bottom:10px;line-height:1.5;">'+q.q+'</div>';
    q.a.forEach(function(opt,oi){html+='<div class="warmupCard" data-ans="'+oi+'" style="cursor:pointer"><div style="font-size:11px;color:rgba(240,230,200,.7);">'+(oi+1)+'. '+opt+'</div></div>';});
    area.innerHTML=html;
    area.querySelectorAll('[data-ans]').forEach(function(btn){
      btn.addEventListener('pointerdown',function(e){e.preventDefault();
        var ans=parseInt(btn.dataset.ans);
        if(ans===q.c){state.correct++;btn.style.borderColor='#44ee44';btn.style.background='rgba(68,238,68,.1)';v12Sfx('quiz_v12');}
        else{btn.style.borderColor='#ff4444';btn.style.background='rgba(255,68,68,.1)';
          var correct=area.querySelector('[data-ans="'+q.c+'"]');if(correct){correct.style.borderColor='#44ee44';correct.style.background='rgba(68,238,68,.1)';}}
        setTimeout(function(){state.idx++;showQ();},800);
      });
    });
  }
  showQ();
}

/* ─── 14. ACHIEVEMENTS (12: 82→94) ─── */
var V12_ACHS=[
  {id:'listen_3',icon:'&#127911;',name:'음악 감상 입문',desc:'음악감상실 3곡 감상'},
  {id:'listen_all',icon:'&#127926;',name:'완벽한 감상',desc:'12곡 전부 감상'},
  {id:'pos_3',icon:'&#128204;',name:'포지션 탐험가',desc:'3개 포지션 학습'},
  {id:'pos_all',icon:'&#127942;',name:'포지션 마스터',desc:'7개 포지션 전부 학습'},
  {id:'hist_scholar',icon:'&#128218;',name:'역사 학자',desc:'6시대 학습'},
  {id:'hist_master',icon:'&#127963;',name:'역사 박사',desc:'12시대 전부 학습'},
  {id:'warmup_half',icon:'&#9728;&#65039;',name:'워밍업 반',desc:'4과제 완료'},
  {id:'warmup_all',icon:'&#128293;',name:'완벽한 워밍업',desc:'8과제 전부 완료'},
  {id:'analysis_view',icon:'&#128202;',name:'데이터 분석가',desc:'분석 대시보드 조회'},
  {id:'master_half',icon:'&#127891;',name:'중급 수강생',desc:'마스터클래스 6강 수강'},
  {id:'master_all',icon:'&#128081;',name:'마스터클래스 졸업',desc:'12강 전부 수강'},
  {id:'ens_3',icon:'&#127930;',name:'앙상블 입문',desc:'앙상블 3곡 연습'},
  {id:'ens_all',icon:'&#127929;',name:'앙상블 마스터',desc:'6곡 전부 연습'},
  {id:'quiz_v12_ace',icon:'&#128175;',name:'퀴즈 v12 에이스',desc:'80% 이상 정답'}
];

/* ─── 15. UI INTEGRATION ─── */
(function integrateUI(){
  createOrchPanel();createListenPanel();createPosPanel();createHistPanel();
  createWarmupPanel();createAnalysisPanel();createMasterPanel();createEnsemblePanel();createQuizV12Panel();
  drawOrchCanvas(-1);
  var hdBtns=document.getElementById('hdBtns');if(!hdBtns)return;
  var btns=[
    {title:'오케스트라',text:'&#127932;',action:function(){drawOrchCanvas(orchSelected);document.getElementById('orchPanel').classList.add('show');}},
    {title:'감상실',text:'&#127911;',action:function(){document.getElementById('listenPanel').classList.add('show');}},
    {title:'포지션맵',text:'&#128204;',action:function(){document.getElementById('posPanel').classList.add('show');}},
    {title:'역사관',text:'&#127963;',action:function(){document.getElementById('histPanel').classList.add('show');}},
    {title:'워밍업',text:'&#9728;&#65039;',action:function(){renderWarmup();document.getElementById('warmupPanel').classList.add('show');}},
    {title:'분석',text:'&#128202;',action:function(){drawAnalysis();document.getElementById('analysisPanel').classList.add('show');}},
    {title:'마스터',text:'&#127891;',action:function(){document.getElementById('masterPanel').classList.add('show');}},
    {title:'앙상블',text:'&#127930;',action:function(){document.getElementById('ensemblePanel').classList.add('show');}}
  ];
  btns.forEach(function(b){
    var el=document.createElement('div');el.className='v6Btn';el.title=b.title;el.innerHTML=b.text;
    el.setAttribute('role','button');el.setAttribute('tabindex','0');
    hdBtns.insertBefore(el,hdBtns.firstChild);
    el.addEventListener('pointerdown',function(e){e.preventDefault();b.action();});
  });
  var fab=document.createElement('div');fab.className='v12Fab';
  var fabBtns=[
    {text:'&#127932;',title:'오케스트라',action:btns[0].action},
    {text:'&#127911;',title:'감상실',action:btns[1].action},
    {text:'&#128204;',title:'포지션',action:btns[2].action},
    {text:'&#127963;',title:'역사관',action:btns[3].action},
    {text:'&#9728;&#65039;',title:'워밍업',action:btns[4].action},
    {text:'&#128202;',title:'분석',action:btns[5].action},
    {text:'&#127891;',title:'마스터',action:btns[6].action},
    {text:'&#10067;',title:'퀴즈v12',action:function(){startQuizV12();document.getElementById('quizV12Panel').classList.add('show');}}
  ];
  fabBtns.forEach(function(b){
    var el=document.createElement('div');el.className='v12FabBtn';el.title=b.title;el.innerHTML=b.text;
    el.addEventListener('pointerdown',function(e){e.preventDefault();b.action();});fab.appendChild(el);
  });
  document.body.appendChild(fab);
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    if(!e.shiftKey)return;
    switch(e.key){
      case'F1':e.preventDefault();btns[0].action();break;case'F2':e.preventDefault();btns[1].action();break;
      case'F3':e.preventDefault();btns[2].action();break;case'F4':e.preventDefault();btns[3].action();break;
      case'F5':e.preventDefault();btns[4].action();break;case'F6':e.preventDefault();btns[5].action();break;
      case'F7':e.preventDefault();btns[6].action();break;case'F8':e.preventDefault();btns[7].action();break;
    }
    if(e.key==='Escape'){
      document.querySelectorAll('#orchPanel,#listenPanel,#posPanel,#histPanel,#warmupPanel,#analysisPanel,#masterPanel,#ensemblePanel,#quizV12Panel').forEach(function(p){p.classList.remove('show');});
      stopListen();}
  });
  var titleEl=document.querySelector('#hd h1');
  if(titleEl)titleEl.innerHTML='&#127931; Violin Real <span style="font-size:8px;color:#ff6644;vertical-align:super">v12</span>';
  var logoEl=document.getElementById('logo');if(logoEl)logoEl.textContent='Violin Real v12';
})();

window.VIOLIN_VERSION='12.0';
})();
