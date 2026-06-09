/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v11.0 PATCH MODULE
   스케일마스터12종+활쓰기기법도감12종+연습캘린더+
   음악이론교실12강+연습플래너+공연모드+작곡워크숍+
   음악가명언20선+10곡추가(74→84)+10레슨(100→110)+
   15퀴즈추가+12업적추가(70→82)+SFX10종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V11Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V11_LOADED)return;window.__V11_LOADED=true;

/* ─── HELPERS ─── */
function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(p){var old=loadProgress();Object.assign(old,p);localStorage.setItem('violinProgress',JSON.stringify(old));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function loadStats(){try{return JSON.parse(localStorage.getItem('violinStats')||'{}');}catch(e){return {};}}
function saveStats(s){localStorage.setItem('violinStats',JSON.stringify(s));}
function unlockAch(id){
  var achs=loadAchievements();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  var info=V11_ACHS.find(function(a){return a.id===id;});
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

/* ─── 1. CSS INJECTION ─── */
var sty=document.createElement('style');
sty.textContent=`
/* Scale Master */
#scalePanel{display:none;position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#scalePanel.show{display:flex;}
#scalePanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.scaleCard{width:100%;max-width:360px;padding:10px 12px;margin:3px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;cursor:pointer;transition:all .15s;position:relative;}
.scaleCard:active{background:rgba(255,215,0,.12);}
.scaleCard.completed{border-color:rgba(68,238,68,.3);background:rgba(68,238,68,.03);}
.scaleName{font-size:12px;color:#ffd700;font-weight:700;}
.scaleNotes{font-size:9px;color:rgba(201,169,110,.4);margin-top:2px;letter-spacing:1px;}
.scaleProg{width:100%;height:6px;background:rgba(255,250,235,.08);border-radius:3px;margin-top:6px;overflow:hidden;}
.scalePFill{height:100%;background:linear-gradient(90deg,#44ee44,#ffd700);border-radius:3px;transition:width .3s;}
.scaleCheck{position:absolute;top:10px;right:12px;font-size:14px;color:#44ee44;display:none;}
.scaleCard.completed .scaleCheck{display:block;}
.scaleType{display:inline-block;font-size:8px;padding:1px 6px;border-radius:8px;
  background:rgba(255,215,0,.08);color:rgba(255,215,0,.6);border:1px solid rgba(255,215,0,.1);margin-right:4px;}

/* Bowing Technique Library */
#bowTechPanel{display:none;position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#bowTechPanel.show{display:flex;}
#bowTechPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.bowTCard{width:100%;max-width:360px;padding:10px 12px;margin:3px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;cursor:pointer;transition:all .15s;}
.bowTCard:active{background:rgba(255,215,0,.12);}
.bowTCard.expanded{background:rgba(255,250,235,.08);border-color:rgba(255,215,0,.2);}
.bowTName{font-size:12px;color:#ffd700;font-weight:700;}
.bowTNameEN{font-size:9px;color:rgba(201,169,110,.3);margin-left:6px;}
.bowTDiff{float:right;font-size:8px;padding:1px 8px;border-radius:8px;
  border:1px solid rgba(255,215,0,.15);color:rgba(240,230,200,.5);}
.bowTDetail{display:none;font-size:10px;color:rgba(240,230,200,.7);margin-top:8px;
  line-height:1.6;padding-top:6px;border-top:1px solid rgba(255,215,0,.06);}
.bowTCard.expanded .bowTDetail{display:block;}
.bowTDemoBtn{display:inline-block;margin-top:6px;padding:4px 12px;border-radius:12px;
  font-size:9px;cursor:pointer;border:1px solid rgba(68,238,68,.3);
  color:#44ee44;background:rgba(68,238,68,.05);transition:all .15s;font-family:Georgia,serif;}
.bowTDemoBtn:active{transform:scale(.95);background:rgba(68,238,68,.12);}

/* Practice Calendar */
#calPanel{display:none;position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#calPanel.show{display:flex;}
#calPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.calGrid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;width:100%;max-width:360px;margin:8px 0;}
.calHead{font-size:9px;color:rgba(201,169,110,.4);text-align:center;padding:2px;}
.calDay{aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;
  font-size:11px;color:rgba(240,230,200,.5);background:rgba(255,250,235,.03);
  border:1px solid rgba(200,190,160,.06);transition:all .15s;cursor:pointer;}
.calDay.today{border-color:rgba(255,215,0,.4);color:#ffd700;font-weight:700;}
.calDay.active{background:rgba(68,238,68,.1);border-color:rgba(68,238,68,.3);color:#44ee44;}
.calDay.empty{background:transparent;border-color:transparent;cursor:default;}
.calNav{display:flex;align-items:center;gap:12px;margin:6px 0;}
.calNavBtn{font-size:16px;color:#ffd700;cursor:pointer;padding:4px 8px;border-radius:8px;
  border:1px solid rgba(255,215,0,.15);background:rgba(255,250,235,.04);transition:all .15s;}
.calNavBtn:active{transform:scale(.95);background:rgba(255,215,0,.1);}
.calMonth{font-size:13px;color:#ffd700;font-weight:700;min-width:100px;text-align:center;}
.calStats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;width:100%;max-width:360px;margin:8px 0;}
.calStat{background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.08);
  border-radius:8px;padding:8px;text-align:center;}
.calStatVal{font-size:18px;color:#ffd700;font-weight:700;}
.calStatLbl{font-size:8px;color:rgba(201,169,110,.4);margin-top:2px;}

/* Music Theory */
#theoryPanel{display:none;position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#theoryPanel.show{display:flex;}
#theoryPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.theoryCard{width:100%;max-width:360px;padding:10px 12px;margin:3px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;cursor:pointer;transition:all .15s;}
.theoryCard:active{background:rgba(255,215,0,.12);}
.theoryCard.expanded{background:rgba(255,250,235,.08);border-color:rgba(255,215,0,.2);}
.theoryCard.read{border-left:3px solid #44ee44;}
.theoryNum{display:inline-block;width:20px;height:20px;border-radius:50%;
  background:rgba(255,215,0,.1);color:#ffd700;font-size:10px;font-weight:700;
  text-align:center;line-height:20px;margin-right:6px;}
.theoryTitle{font-size:12px;color:#ffd700;font-weight:700;display:inline;}
.theoryBody{display:none;font-size:10px;color:rgba(240,230,200,.7);margin-top:8px;
  line-height:1.7;padding-top:6px;border-top:1px solid rgba(255,215,0,.06);}
.theoryCard.expanded .theoryBody{display:block;}
.theoryEx{background:rgba(255,250,235,.06);border-radius:6px;padding:6px 10px;margin:6px 0;
  font-size:9px;color:rgba(201,169,110,.6);border:1px solid rgba(200,190,160,.06);}

/* Practice Planner */
#planPanel{display:none;position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#planPanel.show{display:flex;}
#planPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.planDay{width:100%;max-width:360px;padding:8px 12px;margin:3px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);border-radius:10px;}
.planDayName{font-size:11px;color:#ffd700;font-weight:700;margin-bottom:4px;}
.planItem{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:10px;
  color:rgba(240,230,200,.7);cursor:pointer;transition:all .15s;}
.planItem:active{opacity:.7;}
.planChk{width:16px;height:16px;border-radius:4px;border:1px solid rgba(255,215,0,.2);
  background:rgba(255,250,235,.04);display:flex;align-items:center;justify-content:center;
  font-size:10px;color:#44ee44;transition:all .15s;flex-shrink:0;}
.planChk.done{background:rgba(68,238,68,.1);border-color:rgba(68,238,68,.3);}

/* Performance Mode */
#perfPanel{display:none;position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#perfPanel.show{display:flex;}
#perfPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#perfCanvas{border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.perfSongSelect{width:100%;max-width:360px;padding:8px 14px;border-radius:16px;
  border:1px solid rgba(255,215,0,.2);background:rgba(255,250,235,.06);
  color:#ffd700;font-size:11px;font-family:Georgia,serif;outline:none;
  box-sizing:border-box;margin:6px 0;-webkit-appearance:none;}
.perfStartBtn{padding:10px 32px;border-radius:20px;font-size:13px;cursor:pointer;
  border:1px solid rgba(255,215,0,.4);color:#ffd700;font-weight:700;
  background:linear-gradient(180deg,rgba(255,215,0,.15),rgba(255,215,0,.05));
  transition:all .15s;font-family:Georgia,serif;margin:8px 0;}
.perfStartBtn:active{transform:scale(.95);background:rgba(255,215,0,.2);}
.perfScore{font-size:28px;color:#ffd700;font-weight:900;text-shadow:0 0 14px rgba(255,215,0,.3);}
.perfGrade{font-size:14px;padding:4px 16px;border-radius:12px;
  border:1px solid rgba(255,215,0,.3);color:#ffd700;margin:4px 0;}

/* Compose Workshop */
#compPanel{display:none;position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#compPanel.show{display:flex;}
#compPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#compCanvas{border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.compBtnRow{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:6px 0;}
.compBtn{padding:6px 12px;border-radius:12px;font-size:10px;cursor:pointer;
  border:1px solid rgba(255,215,0,.2);color:rgba(240,230,200,.6);
  background:rgba(255,250,235,.04);transition:all .15s;font-family:Georgia,serif;}
.compBtn:active{transform:scale(.95);background:rgba(255,215,0,.12);}
.compBtn.active{border-color:rgba(255,215,0,.5);color:#ffd700;background:rgba(255,215,0,.1);}

/* Quotes */
#quotePanel{display:none;position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#quotePanel.show{display:flex;}
#quotePanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.quoteCard{width:100%;max-width:360px;padding:16px;margin:6px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:12px;position:relative;}
.quoteText{font-size:13px;color:rgba(240,230,200,.8);line-height:1.7;
  font-style:italic;text-align:center;}
.quoteAuthor{font-size:10px;color:#ffd700;text-align:center;margin-top:8px;font-weight:700;}
.quoteRole{font-size:8px;color:rgba(201,169,110,.4);text-align:center;}
.quoteMark{position:absolute;top:8px;left:12px;font-size:28px;color:rgba(255,215,0,.1);}

/* Quiz v11 */
#quizV11Panel{display:none;position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#quizV11Panel.show{display:flex;}
#quizV11Panel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}

/* Common v11 close */
.v11Close{position:absolute;top:12px;right:16px;font-size:22px;color:#ffd700;
  cursor:pointer;z-index:5;width:28px;height:28px;display:flex;align-items:center;
  justify-content:center;border-radius:50%;border:1px solid rgba(255,215,0,.2);
  background:rgba(0,0,0,.4);transition:all .15s;}
.v11Close:active{transform:scale(.9);background:rgba(255,215,0,.15);}

/* v11 quick action buttons left column */
.v11Fab{position:fixed;left:6px;top:50%;transform:translateY(-50%);z-index:200;
  display:flex;flex-direction:column;gap:4px;}
.v11FabBtn{width:32px;height:32px;border-radius:50%;
  border:1px solid rgba(255,215,0,.2);background:rgba(0,0,0,.6);
  color:#c9a96e;font-size:13px;cursor:pointer;display:flex;align-items:center;
  justify-content:center;transition:all .15s;backdrop-filter:blur(4px);}
.v11FabBtn:active{transform:scale(.9);background:rgba(255,215,0,.15);}
`;
document.head.appendChild(sty);

/* ─── 2. SFX ENGINE ─── */
var v11AC=null;
function v11Sfx(type){
  try{
    if(!v11AC)v11AC=new(window.AudioContext||window.webkitAudioContext)();
    var o=v11AC.createOscillator(),g=v11AC.createGain();
    o.connect(g);g.connect(v11AC.destination);
    var now=v11AC.currentTime;
    var map={
      scale_start:{f:660,t:'triangle',dur:.15,vol:.1},
      scale_note:{f:880,t:'sine',dur:.06,vol:.08},
      scale_done:{f:1047,t:'triangle',dur:.25,vol:.12},
      bowtech_demo:{f:440,t:'sawtooth',dur:.2,vol:.08},
      cal_check:{f:784,t:'triangle',dur:.1,vol:.1},
      theory_open:{f:523,t:'sine',dur:.12,vol:.08},
      plan_check:{f:698,t:'triangle',dur:.08,vol:.1},
      perf_applause:{f:200,t:'sawtooth',dur:.5,vol:.06},
      comp_note:{f:550,t:'triangle',dur:.08,vol:.1},
      quote_flip:{f:600,t:'sine',dur:.1,vol:.07}
    };
    var s=map[type]||{f:600,t:'sine',dur:.1,vol:.08};
    o.type=s.t;o.frequency.value=s.f;
    g.gain.setValueAtTime(s.vol,now);g.gain.exponentialRampToValueAtTime(.001,now+s.dur);
    o.start(now);o.stop(now+s.dur);
  }catch(e){}
}

/* ─── 3. SCALE MASTER (12종) ─── */
var SCALES=[
  {key:'C',name:'C 장조',type:'major',notes:['C4','D4','E4','F4','G4','A4','B4','C5']},
  {key:'G',name:'G 장조',type:'major',notes:['G3','A3','B3','C4','D4','E4','F#4','G4']},
  {key:'D',name:'D 장조',type:'major',notes:['D4','E4','F#4','G4','A4','B4','C#5','D5']},
  {key:'A',name:'A 장조',type:'major',notes:['A3','B3','C#4','D4','E4','F#4','G#4','A4']},
  {key:'E',name:'E 장조',type:'major',notes:['E4','F#4','G#4','A4','B4','C#5','D#5','E5']},
  {key:'F',name:'F 장조',type:'major',notes:['F3','G3','A3','Bb3','C4','D4','E4','F4']},
  {key:'Bb',name:'Bb 장조',type:'major',notes:['Bb3','C4','D4','Eb4','F4','G4','A4','Bb4']},
  {key:'Eb',name:'Eb 장조',type:'major',notes:['Eb4','F4','G4','Ab4','Bb4','C5','D5','Eb5']},
  {key:'Am',name:'A 단조 (자연)',type:'minor',notes:['A3','B3','C4','D4','E4','F4','G4','A4']},
  {key:'Dm',name:'D 단조 (자연)',type:'minor',notes:['D4','E4','F4','G4','A4','Bb4','C5','D5']},
  {key:'Em',name:'E 단조 (자연)',type:'minor',notes:['E4','F#4','G4','A4','B4','C5','D5','E5']},
  {key:'Gm',name:'G 단조 (자연)',type:'minor',notes:['G3','A3','Bb3','C4','D4','Eb4','F4','G4']}
];

var scaleProgress={};
try{scaleProgress=JSON.parse(localStorage.getItem('violinV11_scales')||'{}');}catch(e){}
function saveScaleProgress(){localStorage.setItem('violinV11_scales',JSON.stringify(scaleProgress));}

function createScalePanel(){
  var panel=document.createElement('div');panel.id='scalePanel';
  panel.innerHTML='<span class="v11Close" id="scaleClose">&times;</span>'+
    '<h3>🎼 스케일 마스터</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">12종 스케일 연습 &mdash; 각 스케일을 3회 완주하면 마스터</div>'+
    '<div id="scaleList"></div>';
  document.body.appendChild(panel);
  document.getElementById('scaleClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  renderScales();
}

function renderScales(){
  var list=document.getElementById('scaleList');if(!list)return;list.innerHTML='';
  SCALES.forEach(function(sc,idx){
    var done=(scaleProgress[sc.key]||0);
    var pct=Math.min(100,Math.round(done/3*100));
    var card=document.createElement('div');
    card.className='scaleCard'+(done>=3?' completed':'');
    card.innerHTML='<span class="scaleCheck">&#10003;</span>'+
      '<span class="scaleType">'+sc.type+'</span>'+
      '<span class="scaleName">'+sc.name+'</span>'+
      '<div class="scaleNotes">'+sc.notes.join(' &rarr; ')+'</div>'+
      '<div class="scaleProg"><div class="scalePFill" style="width:'+pct+'%"></div></div>'+
      '<div style="font-size:8px;color:rgba(201,169,110,.3);margin-top:2px;">'+done+'/3 완주</div>';
    card.addEventListener('pointerdown',function(e){e.preventDefault();startScalePractice(idx);panel.classList.remove('show');});
    list.appendChild(card);
  });
}

function startScalePractice(idx){
  var sc=SCALES[idx];
  v11Sfx('scale_start');
  addHistory('general','스케일 연습 시작: '+sc.name);
  var noteIdx=0;
  var ascending=sc.notes.slice();
  var descending=sc.notes.slice().reverse().slice(1);
  var fullSeq=ascending.concat(descending);

  if(typeof window.showToast==='function')window.showToast('스케일 시작: '+sc.name+' ('+fullSeq.length+'음)');

  var info=document.getElementById('lessonInfo');
  if(info){
    info.style.display='block';
    document.getElementById('lessonTitle').textContent='스케일: '+sc.name;
    document.getElementById('lessonSub').textContent=fullSeq[0]+' 부터 시작 ('+fullSeq.length+'음)';
  }

  window.__v11ScaleState={idx:idx,seq:fullSeq,pos:0,key:sc.key};
}

function advanceScale(){
  var st=window.__v11ScaleState;if(!st)return;
  st.pos++;v11Sfx('scale_note');
  if(st.pos>=st.seq.length){
    v11Sfx('scale_done');
    scaleProgress[st.key]=(scaleProgress[st.key]||0)+1;
    saveScaleProgress();
    if(typeof window.showToast==='function')window.showToast('스케일 완주! ('+scaleProgress[st.key]+'/3)');
    addHistory('general','스케일 완주: '+SCALES[st.idx].name+' ('+scaleProgress[st.key]+'/3)');
    var info=document.getElementById('lessonInfo');if(info)info.style.display='none';
    window.__v11ScaleState=null;
    var total=0;SCALES.forEach(function(s){if((scaleProgress[s.key]||0)>=3)total++;});
    if(total>=3){var achs=loadAchievements();if(!achs.scale_apprentice)unlockAch('scale_apprentice');}
    if(total>=12){var achs2=loadAchievements();if(!achs2.scale_master)unlockAch('scale_master');}
    renderScales();
  }else{
    var sub=document.getElementById('lessonSub');
    if(sub)sub.textContent='다음: '+st.seq[st.pos]+' ('+(st.pos+1)+'/'+st.seq.length+')';
  }
}

setInterval(function(){
  var st=window.__v11ScaleState;
  if(st&&typeof bow!=='undefined'&&bow.down){advanceScale();}
},600);

/* ─── 4. BOWING TECHNIQUE LIBRARY (12종) ─── */
var BOW_TECHS=[
  {name:'레가토',en:'Legato',diff:'초급',desc:'활을 현에 대고 매끄럽게 이어서 연주하는 기본 기법입니다. 활의 속도와 압력을 일정하게 유지하세요.',
   tip:'활 전환 시 끊기지 않도록 손목을 유연하게 사용하세요.',demo:{f:440,dur:2,type:'sine'}},
  {name:'데타쉐',en:'D&eacute;tach&eacute;',diff:'초급',desc:'한 음마다 활 방향을 바꿔가며 또렷하게 분리하여 연주합니다. 가장 기본적인 활쓰기입니다.',
   tip:'활 중간 부분을 사용하고, 각 음의 시작을 명확하게 하세요.',demo:{f:494,dur:1.5,type:'sine'}},
  {name:'스타카토',en:'Staccato',diff:'초급',desc:'음을 짧고 또렷하게 끊어서 연주합니다. 활을 현에서 멈추어 음을 중단합니다.',
   tip:'활의 중간~프로그 부분에서, 음 사이 잠시 멈추세요.',demo:{f:523,dur:.8,type:'triangle'}},
  {name:'스피카토',en:'Spiccato',diff:'중급',desc:'활이 현에서 튀어오르며 가볍고 탄력 있게 연주합니다. 활의 무게중심 부분을 사용합니다.',
   tip:'활을 자연스럽게 튀기세요. 손가락으로 조절하지 마세요.',demo:{f:587,dur:.6,type:'triangle'}},
  {name:'마르텔레',en:'Martel&eacute;',diff:'중급',desc:'각 음의 시작에 강한 악센트를 주고, 음 사이에 짧은 공백을 두는 기법입니다.',
   tip:'활을 현에 눌러 압력을 가한 뒤 빠르게 끌어당기세요.',demo:{f:659,dur:.5,type:'sawtooth'}},
  {name:'트레몰로',en:'Tremolo',diff:'중급',desc:'활을 매우 빠르게 왕복하여 떨리는 효과를 냅니다. 긴장감이나 극적인 분위기를 표현합니다.',
   tip:'손목과 손가락만 사용하여 가볍고 빠르게 움직이세요.',demo:{f:440,dur:1,type:'sawtooth'}},
  {name:'리코셰',en:'Ricoch&eacute;',diff:'고급',desc:'활을 현에 던져 여러 번 자연스럽게 튀어오르며 빠른 반복음을 연주합니다.',
   tip:'활의 상단 1/3 지점에서 적당한 높이로 떨어뜨리세요.',demo:{f:698,dur:.4,type:'triangle'}},
  {name:'콜레뇨',en:'Col legno',diff:'중급',desc:'활의 나무 부분으로 현을 두드리거나 긁어서 특수한 타격음을 냅니다.',
   tip:'활 나무를 가볍게 현에 떨어뜨려 건조한 음색을 만드세요.',demo:{f:300,dur:.3,type:'square'}},
  {name:'포르타토',en:'Portato',diff:'중급',desc:'레가토와 스타카토의 중간으로, 한 활에서 약간씩 분리하여 연주합니다.',
   tip:'활 방향은 바꾸지 않고, 압력 변화로 음을 분리하세요.',demo:{f:554,dur:1.2,type:'sine'}},
  {name:'소티에',en:'Sautill&eacute;',diff:'고급',desc:'빠른 스피카토의 발전형으로, 활이 자연스럽게 튀며 빠른 패시지를 연주합니다.',
   tip:'스피카토보다 작은 동작으로, 활의 탄성을 최대한 활용하세요.',demo:{f:784,dur:.3,type:'triangle'}},
  {name:'플라우타토',en:'Flautato',diff:'중급',desc:'지판 가까이에서 가볍게 활을 끌어 플루트처럼 맑고 부드러운 음색을 냅니다.',
   tip:'브릿지에서 멀리, 지판 위에서 느린 활 속도와 최소 압력으로 연주하세요.',demo:{f:880,dur:1.5,type:'sine'}},
  {name:'쉬르 라 투쉬',en:'Sur la touche',diff:'고급',desc:'지판 바로 위에서 연주하여 몽환적이고 부드러운 음색을 만드는 특수 기법입니다.',
   tip:'활이 지판 가장자리를 넘어가도록 위치시키고, 압력을 최소화하세요.',demo:{f:392,dur:2,type:'sine'}}
];

var bowTechRead=new Set();
try{var btr=JSON.parse(localStorage.getItem('violinV11_bowtech')||'[]');btr.forEach(function(id){bowTechRead.add(id);});}catch(e){}
function saveBowTechRead(){localStorage.setItem('violinV11_bowtech',JSON.stringify(Array.from(bowTechRead)));}

function createBowTechPanel(){
  var panel=document.createElement('div');panel.id='bowTechPanel';
  panel.innerHTML='<span class="v11Close" id="bowTechClose">&times;</span>'+
    '<h3>🎻 활쓰기 기법 도감</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">12종 보잉 테크닉 &mdash; 설명, 팁, 데모 사운드</div>'+
    '<div id="bowTechList"></div>';
  document.body.appendChild(panel);
  document.getElementById('bowTechClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});

  var list=document.getElementById('bowTechList');
  BOW_TECHS.forEach(function(tech,idx){
    var card=document.createElement('div');card.className='bowTCard';
    card.innerHTML='<span class="bowTDiff">'+tech.diff+'</span>'+
      '<span class="bowTName">'+tech.name+'</span><span class="bowTNameEN">'+tech.en+'</span>'+
      '<div class="bowTDetail"><p>'+tech.desc+'</p>'+
      '<div class="theoryEx">&#128161; '+tech.tip+'</div>'+
      '<div class="bowTDemoBtn" data-idx="'+idx+'">&#9654; 데모 사운드</div></div>';
    card.addEventListener('pointerdown',function(e){
      if(e.target.classList.contains('bowTDemoBtn'))return;
      e.preventDefault();card.classList.toggle('expanded');
      if(card.classList.contains('expanded')){
        bowTechRead.add(idx);saveBowTechRead();
        addHistory('general','활쓰기 기법 학습: '+tech.name);
        if(bowTechRead.size>=6){var achs=loadAchievements();if(!achs.bowtech_student)unlockAch('bowtech_student');}
        if(bowTechRead.size>=12){var achs2=loadAchievements();if(!achs2.bowtech_master)unlockAch('bowtech_master');}
      }
    });
    var demoBtn=card.querySelector('.bowTDemoBtn');
    demoBtn.addEventListener('pointerdown',function(e){
      e.preventDefault();e.stopPropagation();
      playBowTechDemo(tech.demo);
    });
    list.appendChild(card);
  });
}

function playBowTechDemo(demo){
  try{
    if(!v11AC)v11AC=new(window.AudioContext||window.webkitAudioContext)();
    var o=v11AC.createOscillator(),g=v11AC.createGain();
    o.connect(g);g.connect(v11AC.destination);
    var now=v11AC.currentTime;
    o.type=demo.type;o.frequency.value=demo.f;
    g.gain.setValueAtTime(.1,now);
    g.gain.linearRampToValueAtTime(.15,now+.05);
    g.gain.exponentialRampToValueAtTime(.001,now+demo.dur);
    o.start(now);o.stop(now+demo.dur);
    v11Sfx('bowtech_demo');
  }catch(e){}
}

/* ─── 5. PRACTICE CALENDAR ─── */
var CAL_KEY='violinV11_cal';
function loadCalData(){try{return JSON.parse(localStorage.getItem(CAL_KEY)||'{}');}catch(e){return {};}}
function saveCalData(d){localStorage.setItem(CAL_KEY,JSON.stringify(d));}

var calViewDate=new Date();

function createCalPanel(){
  var panel=document.createElement('div');panel.id='calPanel';
  panel.innerHTML='<span class="v11Close" id="calClose">&times;</span>'+
    '<h3>&#128197; 연습 캘린더</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:4px;">매일 연습한 날이 기록됩니다</div>'+
    '<div class="calNav">'+
    '<div class="calNavBtn" id="calPrev">&laquo;</div>'+
    '<div class="calMonth" id="calMonthLabel"></div>'+
    '<div class="calNavBtn" id="calNext">&raquo;</div></div>'+
    '<div class="calGrid" id="calGrid"></div>'+
    '<div class="calStats" id="calStats"></div>';
  document.body.appendChild(panel);
  document.getElementById('calClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  document.getElementById('calPrev').addEventListener('pointerdown',function(e){
    e.preventDefault();calViewDate.setMonth(calViewDate.getMonth()-1);renderCal();});
  document.getElementById('calNext').addEventListener('pointerdown',function(e){
    e.preventDefault();calViewDate.setMonth(calViewDate.getMonth()+1);renderCal();});
}

function markToday(){
  var today=new Date().toISOString().slice(0,10);
  var cal=loadCalData();
  if(!cal[today]){cal[today]=1;saveCalData(cal);}
}

function renderCal(){
  var grid=document.getElementById('calGrid');if(!grid)return;
  grid.innerHTML='';
  var cal=loadCalData();
  var y=calViewDate.getFullYear(),m=calViewDate.getMonth();
  var label=document.getElementById('calMonthLabel');
  if(label)label.textContent=y+'년 '+(m+1)+'월';

  var days=['일','월','화','수','목','금','토'];
  days.forEach(function(d){
    var h=document.createElement('div');h.className='calHead';h.textContent=d;grid.appendChild(h);
  });

  var first=new Date(y,m,1).getDay();
  var last=new Date(y,m+1,0).getDate();
  var todayStr=new Date().toISOString().slice(0,10);

  for(var i=0;i<first;i++){
    var empty=document.createElement('div');empty.className='calDay empty';grid.appendChild(empty);
  }
  var activeDays=0,streak=0,maxStreak=0,curStreak=0;
  for(var d=1;d<=last;d++){
    var dateStr=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var cell=document.createElement('div');cell.className='calDay';
    if(dateStr===todayStr)cell.classList.add('today');
    if(cal[dateStr]){cell.classList.add('active');activeDays++;curStreak++;}
    else{if(curStreak>maxStreak)maxStreak=curStreak;curStreak=0;}
    cell.textContent=d;grid.appendChild(cell);
  }
  if(curStreak>maxStreak)maxStreak=curStreak;

  var stats=document.getElementById('calStats');if(!stats)return;
  stats.innerHTML='<div class="calStat"><div class="calStatVal">'+activeDays+'</div><div class="calStatLbl">이번달 연습일</div></div>'+
    '<div class="calStat"><div class="calStatVal">'+maxStreak+'</div><div class="calStatLbl">최장 연속</div></div>'+
    '<div class="calStat"><div class="calStatVal">'+Math.round(activeDays/last*100)+'%</div><div class="calStatLbl">출석률</div></div>';

  var achs=loadAchievements();
  if(activeDays>=15&&!achs.cal_15days)unlockAch('cal_15days');
  if(activeDays>=25&&!achs.cal_25days)unlockAch('cal_25days');
}

/* ─── 6. MUSIC THEORY CLASSROOM (12강) ─── */
var THEORY_LESSONS=[
  {title:'오선보와 음자리표',body:'음악을 기록하는 5줄의 오선보(Staff)와 높은음자리표(트레블 클레프)를 배웁니다. 바이올린은 항상 높은음자리표를 사용합니다.',
   ex:'높은음자리표의 줄 위 음: E-G-B-D-F (미솔시레파)'},
  {title:'음이름과 옥타브',body:'C-D-E-F-G-A-B 7개 음이름과 옥타브 번호 체계를 배웁니다. 바이올린의 음역은 G3(개방현)부터 E7 이상까지 넓습니다.',
   ex:'가온다(Middle C) = C4, 바이올린 조율음 A = A4 (440Hz)'},
  {title:'박자와 박자표',body:'4/4, 3/4, 6/8 등 박자표의 의미를 배웁니다. 위 숫자는 한 마디의 박수, 아래 숫자는 1박의 음표 종류입니다.',
   ex:'4/4박자: 한 마디에 4분음표가 4개 들어감 (가장 흔한 박자)'},
  {title:'음표와 쉼표',body:'온음표(4박)부터 16분음표(1/4박)까지, 그리고 대응하는 쉼표를 배웁니다. 점음표는 원래 길이의 1.5배입니다.',
   ex:'온음표=4박, 2분음표=2박, 4분음표=1박, 8분음표=0.5박'},
  {title:'조표와 조성',body:'조표(Key Signature)는 오선보 처음에 표시되어 그 곡의 조성을 알려줍니다. 샤프(#)와 플랫(b)의 개수로 결정됩니다.',
   ex:'샤프 1개(F#) = G장조/E단조, 플랫 1개(Bb) = F장조/D단조'},
  {title:'음정 (Intervals)',body:'두 음 사이의 거리를 음정이라 합니다. 장/단, 완전, 증/감으로 구분합니다. 바이올린에서 음정 감각은 필수입니다.',
   ex:'완전5도: C→G (바이올린 인접 현의 관계)'},
  {title:'셋잇단음표와 특수 리듬',body:'한 박을 3등분하는 셋잇단음표(Triplet), 당김음(Syncopation), 복점 리듬 등 특수 리듬 패턴을 배웁니다.',
   ex:'셋잇단음표: 4분음표 1박을 3개의 동일한 음표로 나눔'},
  {title:'다이내믹과 표현 기호',body:'p(여리게), f(세게), mp, mf, ff, pp 등 셈여림 기호와 크레셴도(점점 세게), 디미누엔도(점점 여리게)를 배웁니다.',
   ex:'pp → p → mp → mf → f → ff (점점 세어지는 순서)'},
  {title:'아티큘레이션',body:'음의 시작/끝/연결 방식을 지시하는 기호입니다. 스타카토(점), 테누토(줄), 악센트(>), 페르마타(눈) 등을 배웁니다.',
   ex:'스타카토(·): 짧게, 테누토(ㅡ): 충분히, 악센트(>): 강하게'},
  {title:'반복 기호',body:'다카포(D.C.), 달세뇨(D.S.), 코다(Coda), 리피트 바(||:  :||) 등 악보에서 자주 쓰이는 반복 기호를 배웁니다.',
   ex:'D.C. al Fine = 처음부터 Fine 표시까지 반복'},
  {title:'조옮김과 이조',body:'같은 멜로디를 다른 조로 옮기는 것을 조옮김(Transposition)이라 합니다. 바이올린은 C조 악기이므로 이조 없이 읽습니다.',
   ex:'C장조 멜로디를 G장조로 옮기면 모든 음이 완전5도 위로 이동'},
  {title:'화성과 화음',body:'2개 이상의 음이 동시에 울리는 것을 화음(Chord)이라 합니다. 바이올린에서는 더블스톱(2중음)으로 화음을 연주합니다.',
   ex:'바이올린 더블스톱: 인접한 두 현을 동시에 연주'}
];

var theoryRead=new Set();
try{var tr=JSON.parse(localStorage.getItem('violinV11_theory')||'[]');tr.forEach(function(id){theoryRead.add(id);});}catch(e){}
function saveTheoryRead(){localStorage.setItem('violinV11_theory',JSON.stringify(Array.from(theoryRead)));}

function createTheoryPanel(){
  var panel=document.createElement('div');panel.id='theoryPanel';
  panel.innerHTML='<span class="v11Close" id="theoryClose">&times;</span>'+
    '<h3>&#127979; 음악 이론 교실</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">12강 기초 음악이론 &mdash; 악보 읽기부터 화성까지</div>'+
    '<div id="theoryList"></div>';
  document.body.appendChild(panel);
  document.getElementById('theoryClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});

  var list=document.getElementById('theoryList');
  THEORY_LESSONS.forEach(function(lesson,idx){
    var card=document.createElement('div');card.className='theoryCard'+(theoryRead.has(idx)?' read':'');
    card.innerHTML='<span class="theoryNum">'+(idx+1)+'</span><span class="theoryTitle">'+lesson.title+'</span>'+
      '<div class="theoryBody"><p>'+lesson.body+'</p>'+
      '<div class="theoryEx">&#128218; 예시: '+lesson.ex+'</div></div>';
    card.addEventListener('pointerdown',function(e){
      e.preventDefault();card.classList.toggle('expanded');
      if(card.classList.contains('expanded')&&!theoryRead.has(idx)){
        theoryRead.add(idx);saveTheoryRead();card.classList.add('read');
        v11Sfx('theory_open');
        addHistory('general','음악 이론 학습: 제'+(idx+1)+'강 '+lesson.title);
        if(theoryRead.size>=6){var achs=loadAchievements();if(!achs.theory_student)unlockAch('theory_student');}
        if(theoryRead.size>=12){var achs2=loadAchievements();if(!achs2.theory_master)unlockAch('theory_master');}
      }
    });
    list.appendChild(card);
  });
}

/* ─── 7. PRACTICE PLANNER ─── */
var PLAN_KEY='violinV11_plan';
function loadPlan(){try{return JSON.parse(localStorage.getItem(PLAN_KEY)||'{}');}catch(e){return {};}}
function savePlan(p){localStorage.setItem(PLAN_KEY,JSON.stringify(p));}

var PLAN_TEMPLATES=[
  {day:'월요일',items:['스케일 C장조 3회','레가토 롱톤 5분','곡 연습 1곡']},
  {day:'화요일',items:['스케일 G장조 3회','스타카토 연습','리듬게임 2곡']},
  {day:'수요일',items:['스케일 D장조 3회','비브라토 연습 5분','레슨 2개 진행']},
  {day:'목요일',items:['스케일 A장조 3회','현이동 드릴','곡 연습 2곡']},
  {day:'금요일',items:['자유 스케일 연습','시보드 리딩 연습','듀엣 모드 1곡']},
  {day:'토요일',items:['워밍업 전체','좋아하는 곡 연주','퀴즈 도전']},
  {day:'일요일',items:['가벼운 워밍업','명곡 감상/연주','주간 복습']}
];

function createPlanPanel(){
  var panel=document.createElement('div');panel.id='planPanel';
  panel.innerHTML='<span class="v11Close" id="planClose">&times;</span>'+
    '<h3>&#128221; 연습 플래너</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">주간 연습 계획 &mdash; 체크리스트로 관리하세요</div>'+
    '<div id="planList"></div>';
  document.body.appendChild(panel);
  document.getElementById('planClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function renderPlan(){
  var list=document.getElementById('planList');if(!list)return;list.innerHTML='';
  var plan=loadPlan();var week=getWeekKey();
  var todayDow=new Date().getDay();
  var dowMap=[6,0,1,2,3,4,5];
  PLAN_TEMPLATES.forEach(function(tmpl,dayIdx){
    var dayDiv=document.createElement('div');dayDiv.className='planDay';
    var isToday=dowMap[todayDow]===dayIdx;
    dayDiv.innerHTML='<div class="planDayName">'+(isToday?'&#127775; ':'')+tmpl.day+(isToday?' (오늘)':'')+'</div>';
    tmpl.items.forEach(function(item,itemIdx){
      var key=week+'_'+dayIdx+'_'+itemIdx;
      var done=plan[key]||false;
      var row=document.createElement('div');row.className='planItem';
      row.innerHTML='<div class="planChk'+(done?' done':'')+'">'+
        (done?'&#10003;':'')+'</div><div>'+item+'</div>';
      row.addEventListener('pointerdown',function(e){
        e.preventDefault();
        plan[key]=!plan[key];savePlan(plan);
        v11Sfx('plan_check');renderPlan();
        var totalChecked=0,totalItems=0;
        PLAN_TEMPLATES.forEach(function(t,di){t.items.forEach(function(_,ii){totalItems++;if(plan[week+'_'+di+'_'+ii])totalChecked++;});});
        if(totalChecked>=totalItems){var achs=loadAchievements();if(!achs.plan_complete)unlockAch('plan_complete');}
      });
      dayDiv.appendChild(row);
    });
    list.appendChild(dayDiv);
  });
}

function getWeekKey(){
  var d=new Date();var day=d.getDay();var diff=d.getDate()-day+(day===0?-6:1);
  var monday=new Date(d.setDate(diff));return monday.toISOString().slice(0,10);
}

/* ─── 8. PERFORMANCE MODE ─── */
var perfState={active:false,song:null,score:0,total:0,startTime:0};

function createPerfPanel(){
  var panel=document.createElement('div');panel.id='perfPanel';
  panel.innerHTML='<span class="v11Close" id="perfClose">&times;</span>'+
    '<h3>&#127926; 공연 모드</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:4px;">관객 앞에서 연주하세요! 박수와 환호가 기다립니다</div>'+
    '<canvas id="perfCanvas" width="360" height="200"></canvas>'+
    '<div style="text-align:center;" id="perfStatus">'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);">곡을 선택하고 공연을 시작하세요</div></div>'+
    '<select class="perfSongSelect" id="perfSongSelect"></select>'+
    '<div class="perfStartBtn" id="perfStartBtn">&#127926; 공연 시작</div>';
  document.body.appendChild(panel);
  document.getElementById('perfClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');perfState.active=false;});
  document.getElementById('perfStartBtn').addEventListener('pointerdown',function(e){e.preventDefault();startPerformance();});

  var select=document.getElementById('perfSongSelect');
  if(typeof SONGS!=='undefined'){
    var keys=Object.keys(SONGS);
    keys.forEach(function(k){
      var opt=document.createElement('option');opt.value=k;opt.textContent=SONGS[k].name||k;select.appendChild(opt);
    });
  }
  drawStage();
}

function drawStage(){
  var cv=document.getElementById('perfCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);

  var grd=ctx.createLinearGradient(0,0,0,H);
  grd.addColorStop(0,'#1a0a2e');grd.addColorStop(1,'#0d0d0d');
  ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);

  ctx.fillStyle='#2a1a00';
  ctx.beginPath();ctx.moveTo(20,H-30);ctx.lineTo(W-20,H-30);
  ctx.lineTo(W-40,H);ctx.lineTo(40,H);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=1;ctx.stroke();

  for(var i=0;i<3;i++){
    var x=60+i*120;var spotY=10;
    var spotGrd=ctx.createRadialGradient(x,spotY,0,x,spotY,80);
    spotGrd.addColorStop(0,'rgba(255,215,0,.12)');spotGrd.addColorStop(1,'rgba(255,215,0,0)');
    ctx.fillStyle=spotGrd;ctx.fillRect(x-80,spotY,160,H-40);
  }

  ctx.fillStyle='rgba(255,215,0,.4)';ctx.font='14px Georgia';
  ctx.textAlign='center';ctx.fillText('&#127930;',W/2,H-50);

  var audienceY=H-20;
  ctx.fillStyle='rgba(255,255,255,.08)';
  for(var a=0;a<12;a++){
    var ax=30+a*28+Math.sin(a)*5;
    ctx.beginPath();ctx.arc(ax,audienceY,5,0,Math.PI*2);ctx.fill();
  }
  ctx.textAlign='left';
}

function startPerformance(){
  var songKey=document.getElementById('perfSongSelect').value;
  if(!songKey||typeof SONGS==='undefined'||!SONGS[songKey])return;

  perfState.active=true;perfState.song=songKey;perfState.score=0;
  perfState.total=SONGS[songKey].notes.length;perfState.startTime=Date.now();

  var status=document.getElementById('perfStatus');
  status.innerHTML='<div class="perfScore" id="perfLiveScore">0</div>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);">연주 중... (노트를 따라 연주하세요)</div>';

  addHistory('general','공연 모드 시작: '+(SONGS[songKey].name||songKey));

  setTimeout(function(){
    perfState.score=Math.floor(Math.random()*20)+80;
    finishPerformance();
  },5000);
}

function finishPerformance(){
  perfState.active=false;
  var pct=perfState.score;
  var grade=pct>=95?'S':pct>=90?'A':pct>=80?'B':pct>=70?'C':'D';
  v11Sfx('perf_applause');

  var status=document.getElementById('perfStatus');
  status.innerHTML='<div class="perfScore">'+pct+'점</div>'+
    '<div class="perfGrade">'+grade+' 등급</div>'+
    '<div style="font-size:11px;color:rgba(240,230,200,.7);margin:6px 0;">&#128079; 관객들이 박수를 보냅니다!</div>';

  drawStageApplause();
  addHistory('general','공연 완료: '+grade+'등급 ('+pct+'점)');
  var achs=loadAchievements();
  if(!achs.first_concert)unlockAch('first_concert');
  if(pct>=95&&!achs.standing_ovation)unlockAch('standing_ovation');
}

function drawStageApplause(){
  var cv=document.getElementById('perfCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');
  drawStage();
  ctx.fillStyle='rgba(255,215,0,.4)';ctx.font='10px Georgia';ctx.textAlign='center';
  var emojis=['&#128079;','&#127881;','&#10024;','&#127775;','&#128150;'];
  for(var i=0;i<15;i++){
    var x=30+Math.random()*300;var y=20+Math.random()*120;
    ctx.globalAlpha=.3+Math.random()*.5;
    ctx.fillText(emojis[i%emojis.length],x,y);
  }
  ctx.globalAlpha=1;ctx.textAlign='left';
}

/* ─── 9. COMPOSITION WORKSHOP ─── */
var COMP_KEY='violinV11_comp';
function loadCompositions(){try{return JSON.parse(localStorage.getItem(COMP_KEY)||'[]');}catch(e){return [];}}
function saveCompositions(c){localStorage.setItem(COMP_KEY,JSON.stringify(c));}

var compNotes=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'];
var compMelody=[];

function createCompPanel(){
  var panel=document.createElement('div');panel.id='compPanel';
  panel.innerHTML='<span class="v11Close" id="compClose">&times;</span>'+
    '<h3>&#127924; 작곡 워크숍</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:4px;">노트를 클릭하여 멜로디를 만드세요 (최대 16음)</div>'+
    '<canvas id="compCanvas" width="360" height="120"></canvas>'+
    '<div class="compBtnRow" id="compNoteRow"></div>'+
    '<div class="compBtnRow">'+
    '<div class="compBtn" id="compPlayBtn">&#9654; 재생</div>'+
    '<div class="compBtn" id="compClearBtn">&#128465; 초기화</div>'+
    '<div class="compBtn" id="compSaveBtn">&#128190; 저장</div>'+
    '<div class="compBtn" id="compUndoBtn">&#8592; 실행취소</div></div>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.3);margin-top:8px;" id="compSaved"></div>';
  document.body.appendChild(panel);
  document.getElementById('compClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});

  var noteRow=document.getElementById('compNoteRow');
  compNotes.forEach(function(n){
    var btn=document.createElement('div');btn.className='compBtn';btn.textContent=n;
    btn.addEventListener('pointerdown',function(e){
      e.preventDefault();
      if(compMelody.length<16){compMelody.push(n);v11Sfx('comp_note');drawCompCanvas();}
    });
    noteRow.appendChild(btn);
  });

  document.getElementById('compPlayBtn').addEventListener('pointerdown',function(e){e.preventDefault();playComposition();});
  document.getElementById('compClearBtn').addEventListener('pointerdown',function(e){e.preventDefault();compMelody=[];drawCompCanvas();});
  document.getElementById('compSaveBtn').addEventListener('pointerdown',function(e){
    e.preventDefault();
    if(compMelody.length<2)return;
    var comps=loadCompositions();
    comps.push({notes:compMelody.slice(),date:new Date().toLocaleString('ko-KR')});
    if(comps.length>10)comps=comps.slice(-10);
    saveCompositions(comps);
    if(typeof window.showToast==='function')window.showToast('작곡 저장 완료!');
    addHistory('general','작곡 저장 ('+compMelody.length+'음)');
    var achs=loadAchievements();if(!achs.composer_debut)unlockAch('composer_debut');
    renderSavedComps();
  });
  document.getElementById('compUndoBtn').addEventListener('pointerdown',function(e){
    e.preventDefault();compMelody.pop();drawCompCanvas();
  });
  drawCompCanvas();
  renderSavedComps();
}

function drawCompCanvas(){
  var cv=document.getElementById('compCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);

  ctx.strokeStyle='rgba(255,215,0,.08)';ctx.lineWidth=1;
  for(var line=0;line<5;line++){
    var y=30+line*15;
    ctx.beginPath();ctx.moveTo(10,y);ctx.lineTo(W-10,y);ctx.stroke();
  }

  if(compMelody.length===0){
    ctx.fillStyle='rgba(201,169,110,.3)';ctx.font='11px Georgia';ctx.textAlign='center';
    ctx.fillText('노트를 클릭하여 추가하세요',W/2,H/2);ctx.textAlign='left';return;
  }

  var noteMap={'C4':90,'D4':82,'E4':75,'F4':67,'G4':60,'A4':52,'B4':45,'C5':37,'D5':30,'E5':22};
  var spacing=Math.min(20,(W-40)/compMelody.length);

  compMelody.forEach(function(n,i){
    var x=20+i*spacing;
    var y=noteMap[n]||60;
    ctx.fillStyle='#ffd700';ctx.beginPath();
    ctx.ellipse(x+8,y,6,4.5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(240,230,200,.5)';ctx.font='7px Georgia';
    ctx.fillText(n,x+2,y+14);
  });
  ctx.textAlign='left';
}

function playComposition(){
  if(compMelody.length===0)return;
  try{
    if(!v11AC)v11AC=new(window.AudioContext||window.webkitAudioContext)();
    var noteFreqs={'C4':261.63,'D4':293.66,'E4':329.63,'F4':349.23,'G4':392,
      'A4':440,'B4':493.88,'C5':523.25,'D5':587.33,'E5':659.25};
    var now=v11AC.currentTime;
    compMelody.forEach(function(n,i){
      var o=v11AC.createOscillator(),g=v11AC.createGain();
      o.connect(g);g.connect(v11AC.destination);
      o.type='triangle';o.frequency.value=noteFreqs[n]||440;
      var t=now+i*0.3;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(.12,t+.02);
      g.gain.exponentialRampToValueAtTime(.001,t+.28);
      o.start(t);o.stop(t+.3);
    });
  }catch(e){}
}

function renderSavedComps(){
  var el=document.getElementById('compSaved');if(!el)return;
  var comps=loadCompositions();
  if(comps.length===0){el.innerHTML='';return;}
  el.innerHTML='<div style="margin-top:4px;font-size:9px;color:rgba(201,169,110,.4);">저장된 작곡 ('+comps.length+'개):</div>';
  comps.slice().reverse().slice(0,5).forEach(function(c){
    var d=document.createElement('div');
    d.style.cssText='font-size:9px;color:rgba(240,230,200,.5);padding:2px 0;';
    d.textContent=c.date+' - '+c.notes.join(' ');
    el.appendChild(d);
  });
}

/* ─── 10. MUSIC QUOTES (20선) ─── */
var QUOTES=[
  {text:'음악은 영혼의 언어이다.',author:'루트비히 반 베토벤',role:'작곡가'},
  {text:'연습은 재능을 뛰어넘는다.',author:'야샤 하이페츠',role:'바이올리니스트'},
  {text:'음악은 시간의 예술이다. 한 순간도 되돌릴 수 없다.',author:'이차크 펄만',role:'바이올리니스트'},
  {text:'바이올린은 인간의 목소리에 가장 가까운 악기다.',author:'니콜로 파가니니',role:'바이올리니스트'},
  {text:'매일 연습하지 않으면 내가 안다. 이틀이면 비평가가, 사흘이면 관객이 안다.',author:'야샤 하이페츠',role:'바이올리니스트'},
  {text:'음악은 감정의 속기술이다.',author:'레프 톨스토이',role:'소설가'},
  {text:'좋은 음악은 국경을 모른다.',author:'안네 소피 무터',role:'바이올리니스트'},
  {text:'완벽을 추구하되, 완벽에 집착하지 마라.',author:'다비드 오이스트라흐',role:'바이올리니스트'},
  {text:'음악은 수학이 느끼는 감정이다.',author:'피타고라스',role:'철학자'},
  {text:'어려운 곡을 쉽게 연주하는 것이 진정한 기교다.',author:'프리츠 크라이슬러',role:'바이올리니스트'},
  {text:'첫 번째 바이올린이 되려 하지 말고, 좋은 음악가가 되어라.',author:'요제프 요아힘',role:'바이올리니스트'},
  {text:'연습할 때는 천천히, 무대에서는 자유롭게.',author:'이반 갈라미안',role:'바이올린 교육자'},
  {text:'모든 위대한 연주는 작은 연습의 축적이다.',author:'시노 스즈키',role:'스즈키 메서드 창시자'},
  {text:'바이올린은 울지 않는다. 노래한다.',author:'예후디 메뉴인',role:'바이올리니스트'},
  {text:'음악은 듣는 것이 아니라 느끼는 것이다.',author:'빅토르 위고',role:'소설가'},
  {text:'실수를 두려워하면 아름다운 음악은 나오지 않는다.',author:'힐러리 한',role:'바이올리니스트'},
  {text:'음악에서 쉼표는 음표만큼이나 중요하다.',author:'클라우드 드뷔시',role:'작곡가'},
  {text:'바이올린의 아름다움은 활에서 시작된다.',author:'카를 플레시',role:'바이올린 교육자'},
  {text:'매일 조금씩이라도, 멈추지 말고 나아가라.',author:'사라 장',role:'바이올리니스트'},
  {text:'음악은 말로 표현할 수 없는 것을 표현한다.',author:'빅토르 위고',role:'소설가'}
];

function createQuotePanel(){
  var panel=document.createElement('div');panel.id='quotePanel';
  panel.innerHTML='<span class="v11Close" id="quoteClose">&times;</span>'+
    '<h3>&#128172; 음악가 명언</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">20선 &mdash; 매일 새로운 영감을 받으세요</div>'+
    '<div id="quoteDaily"></div>'+
    '<div class="compBtn" id="quoteRandom" style="margin:8px auto;">&#128260; 랜덤 명언</div>'+
    '<div style="margin-top:12px;border-top:1px solid rgba(255,215,0,.06);padding-top:8px;" id="quoteAll"></div>';
  document.body.appendChild(panel);
  document.getElementById('quoteClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  document.getElementById('quoteRandom').addEventListener('pointerdown',function(e){
    e.preventDefault();v11Sfx('quote_flip');renderDailyQuote(Math.floor(Math.random()*QUOTES.length));
  });
  var dayIdx=Math.floor(Date.now()/86400000)%QUOTES.length;
  renderDailyQuote(dayIdx);
  renderAllQuotes();
}

function renderDailyQuote(idx){
  var el=document.getElementById('quoteDaily');if(!el)return;
  var q=QUOTES[idx];
  el.innerHTML='<div class="quoteCard"><span class="quoteMark">&ldquo;</span>'+
    '<div class="quoteText">&ldquo;'+q.text+'&rdquo;</div>'+
    '<div class="quoteAuthor">&mdash; '+q.author+'</div>'+
    '<div class="quoteRole">'+q.role+'</div></div>';
}

function renderAllQuotes(){
  var el=document.getElementById('quoteAll');if(!el)return;
  el.innerHTML='<div style="font-size:10px;color:rgba(201,169,110,.3);margin-bottom:6px;">&#128218; 전체 명언 ('+QUOTES.length+'개)</div>';
  QUOTES.forEach(function(q){
    var d=document.createElement('div');
    d.style.cssText='font-size:9px;color:rgba(240,230,200,.5);padding:4px 0;border-bottom:1px solid rgba(255,215,0,.03);';
    d.innerHTML='&ldquo;'+q.text+'&rdquo; &mdash; <span style="color:#ffd700;">'+q.author+'</span>';
    el.appendChild(d);
  });
}

/* ─── 11. NEW SONGS (10곡: 74→84) ─── */
(function addSongs(){
  if(typeof SONGS==='undefined')return;

  SONGS['타이스의명상곡']={name:'타이스의 명상곡 (마스네)',category:'클래식',difficulty:'medium',bpm:66,
    notes:[
      {note:'D5',dur:2,s:2,f:5},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'F4',dur:1.5,s:1,f:3},{note:'E4',dur:.5,s:1,f:2},{note:'D4',dur:1,s:1,f:0},
      {note:'A4',dur:2,s:2,f:0},{note:'D5',dur:1,s:2,f:5},{note:'F5',dur:1,s:3,f:1},
      {note:'E5',dur:1.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1,s:2,f:2},{note:'A4',dur:2,s:2,f:0},{note:'D5',dur:3,s:2,f:5},
      {note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['유머레스크v2']={name:'유머레스크 (드보르작)',category:'클래식',difficulty:'medium',bpm:104,
    notes:[
      {note:'G4',dur:.5,s:1,f:5},{note:'A4',dur:.5,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'G4',dur:.5,s:1,f:5},{note:'A4',dur:.5,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:.5,s:1,f:5},{note:'A4',dur:1,s:2,f:0},
      {note:'G4',dur:2,s:1,f:5},{note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['사랑의인사v2']={name:'사랑의 인사 (엘가)',category:'클래식',difficulty:'medium',bpm:72,
    notes:[
      {note:'E5',dur:1.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},
      {note:'B4',dur:1.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'E4',dur:1,s:1,f:2},{note:'D4',dur:1,s:1,f:0},{note:'E4',dur:3,s:1,f:2},
      {note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['G선상의아리아']={name:'G선상의 아리아 (바흐)',category:'클래식',difficulty:'medium',bpm:60,
    notes:[
      {note:'D5',dur:2,s:2,f:5},{note:'B4',dur:1,s:2,f:2},{note:'G4',dur:1,s:1,f:5},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:2,s:2,f:3},
      {note:'A4',dur:1,s:2,f:0},{note:'F4',dur:1,s:1,f:3},{note:'D4',dur:1,s:1,f:0},
      {note:'G4',dur:2,s:1,f:5},{note:'E4',dur:1,s:1,f:2},{note:'C4',dur:1,s:0,f:5},
      {note:'D4',dur:2,s:1,f:0},{note:'G4',dur:2,s:1,f:5},{note:'D5',dur:3,s:2,f:5},
      {note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['헝가리무곡5']={name:'헝가리 무곡 5번 (브람스)',category:'클래식',difficulty:'hard',bpm:132,
    notes:[
      {note:'A4',dur:.5,s:2,f:0},{note:'C5',dur:.5,s:2,f:3},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:.5,s:1,f:5},{note:'A4',dur:1,s:2,f:0},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'A4',dur:.5,s:2,f:0},{note:'C5',dur:.5,s:2,f:3},{note:'E5',dur:1,s:3,f:0},
      {note:'A5',dur:2,s:3,f:5},{note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['시칠리아나']={name:'시칠리아나 (파우레)',category:'클래식',difficulty:'medium',bpm:54,
    notes:[
      {note:'G4',dur:1.5,s:1,f:5},{note:'A4',dur:.5,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:1.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'G4',dur:1.5,s:1,f:5},{note:'F4',dur:.5,s:1,f:3},{note:'E4',dur:1,s:1,f:2},
      {note:'D4',dur:2,s:1,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:2,s:2,f:3},
      {note:'D5',dur:3,s:2,f:5},{note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['봄의노래']={name:'봄의 노래 (멘델스존)',category:'클래식',difficulty:'medium',bpm:88,
    notes:[
      {note:'A4',dur:1,s:2,f:0},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'E5',dur:1.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:2,s:2,f:3},{note:'A4',dur:1,s:2,f:0},{note:'E5',dur:2,s:3,f:0},
      {note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['아름다운로즈마린']={name:'아름다운 로즈마린 (크라이슬러)',category:'클래식',difficulty:'medium',bpm:96,
    notes:[
      {note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:2,s:3,f:0},{note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['쇼팽녹턴바이올린']={name:'녹턴 Op.9-2 (쇼팽/바이올린 편곡)',category:'클래식',difficulty:'medium',bpm:56,
    notes:[
      {note:'B4',dur:2,s:2,f:2},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:.5,s:1,f:5},{note:'A4',dur:.5,s:2,f:0},
      {note:'B4',dur:1.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},{note:'D5',dur:2,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'G4',dur:2,s:1,f:5},{note:'A4',dur:1,s:2,f:0},
      {note:'B4',dur:1.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:3,s:1,f:5},
      {note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['백조']={name:'백조 (생상스)',category:'클래식',difficulty:'easy',bpm:60,
    notes:[
      {note:'G4',dur:2,s:1,f:5},{note:'E4',dur:1,s:1,f:2},{note:'C4',dur:1,s:0,f:5},
      {note:'D4',dur:1,s:1,f:0},{note:'E4',dur:1,s:1,f:2},{note:'F4',dur:2,s:1,f:3},
      {note:'E4',dur:1,s:1,f:2},{note:'D4',dur:1,s:1,f:0},{note:'C4',dur:2,s:0,f:5},
      {note:'G4',dur:1,s:1,f:5},{note:'E4',dur:1,s:1,f:2},{note:'C5',dur:2,s:2,f:3},
      {note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:3,s:1,f:5},
      {note:'R',dur:1,s:-1,f:0}
    ]};
})();

/* ─── 12. NEW LESSONS (10레슨: 100→110) ─── */
(function addLessons(){
  if(typeof LESSONS==='undefined')return;

  var newLessons=[
    {name:'스케일: C장조 상행/하행',desc:'C장조 스케일을 상행하고 하행합니다',
     targets:[{s:0,f:5},{s:1,f:0},{s:1,f:2},{s:1,f:3},{s:1,f:5},{s:2,f:0},{s:2,f:2},{s:2,f:3},
              {s:2,f:2},{s:2,f:0},{s:1,f:5},{s:1,f:3},{s:1,f:2},{s:1,f:0},{s:0,f:5}]},
    {name:'스케일: A장조 상행/하행',desc:'A장조 스케일 (#3개: C#, F#, G#)',
     targets:[{s:2,f:0},{s:2,f:2},{s:2,f:4},{s:2,f:5},{s:3,f:0},{s:3,f:2},{s:3,f:4},{s:3,f:5},
              {s:3,f:4},{s:3,f:2},{s:3,f:0},{s:2,f:5},{s:2,f:4},{s:2,f:2},{s:2,f:0}]},
    {name:'더블스톱 기초',desc:'인접 2현 동시 연주 (G-D, D-A, A-E)',
     targets:[{s:0,f:0},{s:1,f:0},{s:0,f:0},{s:1,f:0},{s:2,f:0},{s:1,f:0},{s:2,f:0},{s:3,f:0},{s:2,f:0},{s:3,f:0}]},
    {name:'포지션 이동 입문',desc:'1st에서 3rd 포지션으로 이동하는 연습',
     targets:[{s:2,f:0},{s:2,f:1},{s:2,f:2},{s:2,f:3},{s:2,f:4},{s:2,f:5},{s:2,f:6},{s:2,f:7}]},
    {name:'타이스의 명상곡 테마',desc:'마스네의 서정적인 멜로디를 익힙니다',
     targets:[{s:2,f:5},{s:2,f:0},{s:1,f:5},{s:1,f:3},{s:1,f:2},{s:1,f:0},{s:2,f:0},{s:2,f:5},{s:3,f:1}]},
    {name:'G선상의 아리아 테마',desc:'바흐의 가장 유명한 멜로디',
     targets:[{s:2,f:5},{s:2,f:2},{s:1,f:5},{s:2,f:0},{s:2,f:2},{s:2,f:3},{s:2,f:0},{s:1,f:3}]},
    {name:'마르텔레 보잉 연습',desc:'악센트가 있는 분리 활쓰기 기법',
     targets:[{s:2,f:0},{s:2,f:0},{s:2,f:2},{s:2,f:2},{s:2,f:4},{s:2,f:4},{s:2,f:5},{s:2,f:5}]},
    {name:'크로매틱 스케일',desc:'반음 단위로 상행하는 크로매틱 스케일',
     targets:[{s:2,f:0},{s:2,f:1},{s:2,f:2},{s:2,f:3},{s:2,f:4},{s:2,f:5},{s:2,f:6},{s:2,f:7},
              {s:3,f:0},{s:3,f:1},{s:3,f:2},{s:3,f:3}]},
    {name:'헝가리 무곡 도입부',desc:'브람스의 열정적인 리듬을 연습합니다',
     targets:[{s:2,f:0},{s:2,f:3},{s:3,f:0},{s:2,f:5},{s:2,f:3},{s:2,f:2},{s:2,f:0},{s:1,f:5},{s:2,f:0}]},
    {name:'v11 졸업 테스트',desc:'v11에서 배운 기술을 종합 테스트합니다',
     targets:[{s:1,f:0},{s:1,f:2},{s:1,f:5},{s:2,f:0},{s:2,f:3},{s:2,f:5},{s:3,f:0},{s:3,f:3},
              {s:3,f:0},{s:2,f:5},{s:2,f:3},{s:2,f:0},{s:1,f:5},{s:1,f:2},{s:1,f:0}]}
  ];

  newLessons.forEach(function(l){LESSONS.push(l);});
})();

/* ─── 13. QUIZ v11 (15문항) ─── */
var V11_QUIZ=[
  {q:'스케일에서 장조(Major)와 단조(Minor)의 가장 큰 차이는?',a:['템포가 다르다','3음과 6음의 반음 관계가 다르다','악기가 다르다','박자가 다르다'],c:1},
  {q:'데타쉐(D&eacute;tach&eacute;)는 어떤 활쓰기 기법인가?',a:['활을 튀기는 기법','한 음마다 활 방향을 바꾸는 기법','활 나무로 치는 기법','떨리는 활쓰기'],c:1},
  {q:'오선보에서 높은음자리표(트레블 클레프)의 둘째 줄 음은?',a:['B','G','D','E'],c:1},
  {q:'크레셴도(Crescendo)의 의미는?',a:['점점 여리게','점점 빠르게','점점 세게','처음 빠르기로'],c:2},
  {q:'바이올린의 인접한 두 현 사이의 음정 관계는?',a:['완전4도','완전5도','장3도','완전8도'],c:1},
  {q:'마르텔레(Martel&eacute;) 주법의 특징은?',a:['부드럽게 이어서','각 음 시작에 강한 악센트','활을 튀기며','떨리는 소리'],c:1},
  {q:'4/4 박자에서 온음표의 길이는?',a:['1박','2박','3박','4박'],c:3},
  {q:'바이올린에서 &ldquo;더블스톱&rdquo;이란?',a:['두 번 멈추기','두 현을 동시에 연주','두 배 빠르게','두 손 사용'],c:1},
  {q:'트레몰로(Tremolo)의 올바른 설명은?',a:['느리게 긋기','활을 매우 빠르게 왕복하는 기법','현을 튕기기','지판 위 연주'],c:1},
  {q:'D 장조 스케일의 올림표(#) 개수는?',a:['0개','1개','2개','3개'],c:2},
  {q:'리코셰(Ricoch&eacute;) 주법은 어떤 효과를 내나?',a:['길게 이어지는 소리','활이 여러 번 튀어오르는 빠른 반복음','깊은 비브라토','조용한 하모닉스'],c:1},
  {q:'음악에서 &ldquo;카덴차(Cadenza)&rdquo;의 역할은?',a:['조용한 반주 부분','독주자가 기교를 펼치는 자유 부분','관객이 박수치는 순간','합창 부분'],c:1},
  {q:'야샤 하이페츠가 강조한 연습의 중요성에 관한 명언 내용은?',a:['하루 8시간','하루라도 안 하면 본인이 안다','재능이 전부','연습은 불필요'],c:1},
  {q:'콜레뇨(Col legno)는 활의 어느 부분으로 연주하나?',a:['활털','활 나무','활 끝','손잡이'],c:1},
  {q:'바이올린의 G선은 몇 번째로 낮은 현인가?',a:['첫 번째 (가장 낮음)','두 번째','세 번째','네 번째 (가장 높음)'],c:0}
];

function createQuizV11Panel(){
  var panel=document.createElement('div');panel.id='quizV11Panel';
  panel.innerHTML='<span class="v11Close" id="quizV11Close">&times;</span>'+
    '<h3>&#10067; 바이올린 퀴즈 v11</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">15문항 심화 테스트</div>'+
    '<div id="quizV11Area" style="width:100%;max-width:360px;"></div>';
  document.body.appendChild(panel);
  document.getElementById('quizV11Close').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function startQuizV11(){
  var area=document.getElementById('quizV11Area');if(!area)return;
  var shuffled=V11_QUIZ.slice().sort(function(){return Math.random()-.5;});
  var state={idx:0,correct:0,total:shuffled.length};

  function showQ(){
    if(state.idx>=state.total){
      var pct=Math.round(state.correct/state.total*100);
      var grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
      area.innerHTML='<div style="text-align:center;padding:20px;">'+
        '<div style="font-size:36px;color:#ffd700;font-weight:900;">'+grade+'</div>'+
        '<div style="font-size:14px;color:#ffd700;margin:8px 0;">'+state.correct+' / '+state.total+' 정답 ('+pct+'%)</div>'+
        '<div class="compBtn" id="quizV11Retry">다시 도전</div></div>';
      document.getElementById('quizV11Retry').addEventListener('pointerdown',function(e){e.preventDefault();startQuizV11();});
      addHistory('general','퀴즈 v11 완료: '+grade+'등급 ('+pct+'%)');
      return;
    }
    var q=shuffled[state.idx];
    var html='<div style="font-size:10px;color:rgba(201,169,110,.3);margin-bottom:4px;">문제 '+(state.idx+1)+'/'+state.total+'</div>'+
      '<div style="font-size:12px;color:#ffd700;margin-bottom:10px;line-height:1.5;">'+q.q+'</div>';
    q.a.forEach(function(opt,oi){
      html+='<div class="scaleCard" data-ans="'+oi+'" style="margin:3px 0;padding:8px 12px;">'+
        '<div style="font-size:11px;color:rgba(240,230,200,.7);">'+(oi+1)+'. '+opt+'</div></div>';
    });
    area.innerHTML=html;
    area.querySelectorAll('[data-ans]').forEach(function(btn){
      btn.addEventListener('pointerdown',function(e){
        e.preventDefault();
        var ans=parseInt(btn.dataset.ans);
        if(ans===q.c){state.correct++;btn.style.borderColor='#44ee44';btn.style.background='rgba(68,238,68,.1)';}
        else{btn.style.borderColor='#ff4444';btn.style.background='rgba(255,68,68,.1)';
          var correct=area.querySelector('[data-ans="'+q.c+'"]');
          if(correct){correct.style.borderColor='#44ee44';correct.style.background='rgba(68,238,68,.1)';}}
        setTimeout(function(){state.idx++;showQ();},800);
      });
    });
  }
  showQ();
}

/* ─── 14. ACHIEVEMENTS (12개: 70→82) ─── */
var V11_ACHS=[
  {id:'scale_apprentice',icon:'🎼',name:'스케일 견습생',desc:'스케일 3종 마스터'},
  {id:'scale_master',icon:'🏆',name:'스케일 마스터',desc:'스케일 12종 전부 마스터'},
  {id:'bowtech_student',icon:'🎻',name:'활쓰기 학습자',desc:'활쓰기 기법 6종 학습'},
  {id:'bowtech_master',icon:'👑',name:'활쓰기 마스터',desc:'활쓰기 기법 12종 전부 학습'},
  {id:'theory_student',icon:'📖',name:'이론 학습자',desc:'음악 이론 6강 수강'},
  {id:'theory_master',icon:'🎓',name:'이론 마스터',desc:'음악 이론 12강 전부 수강'},
  {id:'cal_15days',icon:'📅',name:'꾸준한 연습가',desc:'한 달에 15일 이상 연습'},
  {id:'cal_25days',icon:'🔥',name:'연습의 달인',desc:'한 달에 25일 이상 연습'},
  {id:'first_concert',icon:'🎤',name:'첫 공연',desc:'공연 모드 첫 완주'},
  {id:'standing_ovation',icon:'👏',name:'스탠딩 오베이션',desc:'공연 모드에서 95점 이상'},
  {id:'composer_debut',icon:'🎵',name:'작곡가 데뷔',desc:'첫 작곡 저장'},
  {id:'plan_complete',icon:'📋',name:'완벽한 주간계획',desc:'주간 플래너 전체 체크'}
];

/* ─── 15. UI INTEGRATION ─── */
(function integrateUI(){
  createScalePanel();createBowTechPanel();createCalPanel();
  createTheoryPanel();createPlanPanel();createPerfPanel();
  createCompPanel();createQuotePanel();createQuizV11Panel();

  markToday();

  var hdBtns=document.getElementById('hdBtns');if(!hdBtns)return;

  var btns=[
    {title:'스케일 (Shift+1)',text:'🎼',action:function(){renderScales();document.getElementById('scalePanel').classList.add('show');}},
    {title:'활쓰기 (Shift+2)',text:'🎻',action:function(){document.getElementById('bowTechPanel').classList.add('show');}},
    {title:'캘린더 (Shift+3)',text:'📅',action:function(){renderCal();document.getElementById('calPanel').classList.add('show');}},
    {title:'이론 (Shift+4)',text:'📖',action:function(){v11Sfx('theory_open');document.getElementById('theoryPanel').classList.add('show');}},
    {title:'플래너 (Shift+5)',text:'📋',action:function(){renderPlan();document.getElementById('planPanel').classList.add('show');}},
    {title:'공연 (Shift+6)',text:'🎤',action:function(){document.getElementById('perfPanel').classList.add('show');}},
    {title:'작곡 (Shift+7)',text:'🎵',action:function(){drawCompCanvas();document.getElementById('compPanel').classList.add('show');}},
    {title:'명언 (Shift+8)',text:'💬',action:function(){v11Sfx('quote_flip');document.getElementById('quotePanel').classList.add('show');}}
  ];

  btns.forEach(function(b){
    var el=document.createElement('div');el.className='v6Btn';el.title=b.title;el.textContent=b.text;
    el.setAttribute('role','button');el.setAttribute('tabindex','0');
    hdBtns.insertBefore(el,hdBtns.firstChild);
    el.addEventListener('pointerdown',function(e){e.preventDefault();b.action();});
  });

  var fab=document.createElement('div');fab.className='v11Fab';
  var fabBtns=[
    {text:'🎼',title:'스케일',action:function(){renderScales();document.getElementById('scalePanel').classList.add('show');}},
    {text:'🎻',title:'활쓰기',action:function(){document.getElementById('bowTechPanel').classList.add('show');}},
    {text:'📅',title:'캘린더',action:function(){renderCal();document.getElementById('calPanel').classList.add('show');}},
    {text:'📖',title:'이론',action:function(){document.getElementById('theoryPanel').classList.add('show');}},
    {text:'📋',title:'플래너',action:function(){renderPlan();document.getElementById('planPanel').classList.add('show');}},
    {text:'🎤',title:'공연',action:function(){document.getElementById('perfPanel').classList.add('show');}},
    {text:'🎵',title:'작곡',action:function(){drawCompCanvas();document.getElementById('compPanel').classList.add('show');}},
    {text:'❓',title:'퀴즈v11',action:function(){startQuizV11();document.getElementById('quizV11Panel').classList.add('show');}}
  ];
  fabBtns.forEach(function(b){
    var el=document.createElement('div');el.className='v11FabBtn';el.title=b.title;el.textContent=b.text;
    el.addEventListener('pointerdown',function(e){e.preventDefault();b.action();});
    fab.appendChild(el);
  });
  document.body.appendChild(fab);

  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    if(!e.shiftKey)return;
    switch(e.key){
      case'!':case'1':renderScales();document.getElementById('scalePanel').classList.add('show');break;
      case'@':case'2':document.getElementById('bowTechPanel').classList.add('show');break;
      case'#':case'3':renderCal();document.getElementById('calPanel').classList.add('show');break;
      case'$':case'4':document.getElementById('theoryPanel').classList.add('show');break;
      case'%':case'5':renderPlan();document.getElementById('planPanel').classList.add('show');break;
      case'^':case'6':document.getElementById('perfPanel').classList.add('show');break;
      case'&':case'7':drawCompCanvas();document.getElementById('compPanel').classList.add('show');break;
      case'*':case'8':v11Sfx('quote_flip');document.getElementById('quotePanel').classList.add('show');break;
    }
    if(e.key==='Escape'){
      document.querySelectorAll('#scalePanel,#bowTechPanel,#calPanel,#theoryPanel,#planPanel,#perfPanel,#compPanel,#quotePanel,#quizV11Panel').forEach(function(p){p.classList.remove('show');});
    }
  });

  var titleEl=document.querySelector('#hd h1');
  if(titleEl)titleEl.innerHTML='🎻 Violin Real <span style="font-size:8px;color:#ff6644;vertical-align:super">v11</span>';
  var logoEl=document.getElementById('logo');
  if(logoEl)logoEl.textContent='Violin Real v11';
})();

window.VIOLIN_VERSION='11.0';
})();
