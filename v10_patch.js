/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v10.0 PATCH MODULE
   연습녹음재생+템포빌더+현이동훈련+음악용어사전40항목+
   연습목표설정+레퍼토리추천+연주히스토리타임라인+
   보잉궤적시뮬레이터Canvas+음색프리셋6종+
   10곡추가(64→74)+10레슨(90→100)+
   15퀴즈추가+12업적추가(58→70)+SFX8종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V10Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V10_LOADED)return;window.__V10_LOADED=true;

/* ─── HELPERS ─── */
function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(p){localStorage.setItem('violinProgress',JSON.stringify(p));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function loadStats(){try{return JSON.parse(localStorage.getItem('violinStats')||'{}');}catch(e){return {};}}
function saveStats(s){localStorage.setItem('violinStats',JSON.stringify(s));}
function unlockAch(id){
  var achs=loadAchievements();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  if(typeof window.showAchToast==='function')window.showAchToast(id);
  else{var t=document.getElementById('achToast');if(t){var info=V10_ACHS.find(function(a){return a.id===id;});
    if(info){t.querySelector('.at').textContent=info.icon+' '+info.name;t.querySelector('.as').textContent=info.desc;
    t.classList.add('show');setTimeout(function(){t.classList.remove('show');},3000);}}}
}

/* ─── 1. CSS INJECTION ─── */
var sty=document.createElement('style');
sty.textContent=`
#hd h1::after{content:' → v10'!important;font-size:8px;color:#ff6644;opacity:.7;}

/* Recording Panel */
#recPanel{display:none;position:fixed;inset:0;z-index:218;background:rgba(0,0,0,.96);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#recPanel.show{display:flex;}
#recPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.recCard{width:100%;max-width:360px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;cursor:pointer;transition:all .15s;}
.recCard:active{background:rgba(255,215,0,.12);}
.recMeta{font-size:9px;color:rgba(201,169,110,.4);margin-top:2px;}
.recName{font-size:12px;color:#ffd700;font-weight:700;}
.recActions{display:flex;gap:6px;margin-top:6px;}
.recActBtn{padding:4px 12px;border-radius:12px;font-size:10px;cursor:pointer;
  border:1px solid rgba(255,215,0,.2);color:rgba(240,230,200,.6);
  background:rgba(255,250,235,.04);transition:all .15s;font-family:Georgia,serif;}
.recActBtn:active{transform:scale(.95);background:rgba(255,215,0,.12);}
.recRecording{animation:recPulse 1s ease-in-out infinite;}
@keyframes recPulse{0%,100%{box-shadow:0 0 0 rgba(255,0,0,0)}50%{box-shadow:0 0 16px rgba(255,0,0,.4)}}

/* Tempo Builder */
#tempoPanel{display:none;position:fixed;inset:0;z-index:218;background:rgba(0,0,0,.96);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#tempoPanel.show{display:flex;}
#tempoPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.tempoBar{width:100%;max-width:360px;height:30px;background:rgba(255,250,235,.06);
  border-radius:15px;border:1px solid rgba(255,215,0,.15);overflow:hidden;margin:8px 0;position:relative;}
.tempoFill{height:100%;background:linear-gradient(90deg,#44ee44,#ffd700,#ff6644);
  border-radius:15px;transition:width .3s;width:0%;}
.tempoBPM{font-size:28px;color:#ffd700;font-weight:900;text-shadow:0 0 14px rgba(255,215,0,.3);}
.tempoCtrlRow{display:flex;gap:8px;align-items:center;width:100%;max-width:360px;margin:4px 0;}

/* String Crossing */
#crossPanel{display:none;position:fixed;inset:0;z-index:218;background:rgba(0,0,0,.96);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#crossPanel.show{display:flex;}
#crossPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#crossCanvas{border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.crossDrill{width:100%;max-width:360px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;cursor:pointer;transition:all .15s;}
.crossDrill:active{background:rgba(255,215,0,.12);}
.crossDrill.active{border-color:rgba(68,238,68,.4);background:rgba(68,238,68,.05);}
.crossTitle{font-size:12px;color:#44ee44;font-weight:700;}
.crossDesc{font-size:9px;color:rgba(201,169,110,.4);margin-top:2px;}

/* Music Dictionary */
#dictPanel{display:none;position:fixed;inset:0;z-index:218;background:rgba(0,0,0,.96);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#dictPanel.show{display:flex;}
#dictPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.dictSearch{width:100%;max-width:360px;padding:8px 14px;border-radius:16px;
  border:1px solid rgba(255,215,0,.2);background:rgba(255,250,235,.06);
  color:#ffd700;font-size:11px;font-family:Georgia,serif;outline:none;
  box-sizing:border-box;margin:6px 0;}
.dictSearch:focus{border-color:rgba(255,215,0,.4);}
.dictCatTabs{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:6px 0;}
.dictCatTab{padding:4px 10px;border-radius:12px;font-size:9px;cursor:pointer;
  border:1px solid rgba(255,215,0,.15);color:rgba(240,230,200,.5);
  background:rgba(255,250,235,.04);transition:all .15s;font-family:Georgia,serif;}
.dictCatTab.active{border-color:rgba(255,215,0,.5);color:#ffd700;background:rgba(255,215,0,.1);}
.dictItem{width:100%;max-width:360px;padding:8px 12px;margin:3px 0;
  background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.08);
  border-radius:8px;cursor:pointer;transition:all .15s;}
.dictItem.expanded{background:rgba(255,250,235,.08);border-color:rgba(255,215,0,.2);}
.dictWord{font-size:12px;color:#ffd700;font-weight:700;}
.dictWordEN{font-size:9px;color:rgba(201,169,110,.4);margin-left:6px;}
.dictDef{display:none;font-size:10px;color:rgba(240,230,200,.7);margin-top:4px;
  line-height:1.5;padding-top:4px;border-top:1px solid rgba(255,215,0,.06);}
.dictItem.expanded .dictDef{display:block;}

/* Practice Goals */
#goalPanel{display:none;position:fixed;inset:0;z-index:218;background:rgba(0,0,0,.96);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#goalPanel.show{display:flex;}
#goalPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.goalCard{width:100%;max-width:360px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;}
.goalTitle{font-size:12px;color:#ffd700;font-weight:700;}
.goalProg{width:100%;height:8px;background:rgba(255,250,235,.08);border-radius:4px;
  margin:6px 0 2px;overflow:hidden;}
.goalFill{height:100%;background:linear-gradient(90deg,#44ee44,#ffd700);border-radius:4px;
  transition:width .3s;}
.goalStat{font-size:9px;color:rgba(201,169,110,.4);}

/* Repertoire Recommender */
#recoPanel{display:none;position:fixed;inset:0;z-index:218;background:rgba(0,0,0,.96);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#recoPanel.show{display:flex;}
#recoPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.recoCard{width:100%;max-width:360px;padding:12px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;cursor:pointer;transition:all .15s;}
.recoCard:active{background:rgba(255,215,0,.12);}
.recoMatch{float:right;font-size:11px;color:#44ee44;font-weight:700;}
.recoSong{font-size:13px;color:#ffd700;font-weight:700;}
.recoReason{font-size:9px;color:rgba(201,169,110,.5);margin-top:2px;}

/* History Timeline */
#histPanel{display:none;position:fixed;inset:0;z-index:218;background:rgba(0,0,0,.96);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#histPanel.show{display:flex;}
#histPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.histLine{position:relative;width:100%;max-width:360px;padding-left:20px;
  border-left:2px solid rgba(255,215,0,.15);}
.histEntry{position:relative;padding:8px 12px;margin:6px 0;
  background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.08);
  border-radius:8px;}
.histEntry::before{content:'';position:absolute;left:-25px;top:12px;
  width:8px;height:8px;border-radius:50%;background:#ffd700;border:2px solid rgba(0,0,0,.5);}
.histDate{font-size:9px;color:rgba(201,169,110,.3);}
.histText{font-size:11px;color:rgba(240,230,200,.7);margin-top:2px;}
.histType{display:inline-block;font-size:8px;padding:1px 6px;border-radius:8px;
  background:rgba(255,215,0,.1);color:#ffd700;border:1px solid rgba(255,215,0,.15);margin-right:4px;}

/* Bow Trajectory Sim */
#bowSimPanel{display:none;position:fixed;inset:0;z-index:218;background:rgba(0,0,0,.96);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#bowSimPanel.show{display:flex;}
#bowSimPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#bowSimCanvas{border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.bowSimInfo{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;width:100%;max-width:360px;margin:6px 0;}
.bsCard{background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.08);
  border-radius:8px;padding:6px;text-align:center;}
.bsCard .bsVal{font-size:16px;color:#ffd700;font-weight:700;}
.bsCard .bsLbl{font-size:8px;color:rgba(201,169,110,.4);margin-top:2px;}

/* Tone Presets */
#tonePrePanel{display:none;position:fixed;inset:0;z-index:218;background:rgba(0,0,0,.96);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#tonePrePanel.show{display:flex;}
#tonePrePanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.tonePreCard{width:100%;max-width:360px;padding:12px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;cursor:pointer;transition:all .15s;}
.tonePreCard:active{background:rgba(255,215,0,.12);}
.tonePreCard.active{border-color:rgba(255,215,0,.5);background:rgba(255,215,0,.08);}
.tonePreName{font-size:13px;color:#ffd700;font-weight:700;}
.tonePreDesc{font-size:9px;color:rgba(201,169,110,.4);margin-top:2px;}
.tonePreTags{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;}
.tonePreTag{font-size:8px;padding:2px 8px;border-radius:8px;
  border:1px solid rgba(255,215,0,.15);color:rgba(240,230,200,.5);}

/* Quiz v10 */
#quizV10Panel{display:none;position:fixed;inset:0;z-index:218;background:rgba(0,0,0,.96);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#quizV10Panel.show{display:flex;}
#quizV10Panel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}

/* Common v10 close */
.v10Close{position:absolute;top:12px;right:16px;font-size:22px;color:#ffd700;
  cursor:pointer;z-index:5;width:28px;height:28px;display:flex;align-items:center;
  justify-content:center;border-radius:50%;border:1px solid rgba(255,215,0,.2);
  background:rgba(0,0,0,.4);transition:all .15s;}
.v10Close:active{transform:scale(.9);background:rgba(255,215,0,.15);}

/* v6Btn style for v10 buttons */
.v6Btn{min-width:24px;height:24px;border-radius:50%;border:1px solid rgba(255,215,0,.2);
  background:rgba(0,0,0,.3);color:#c9a96e;font-size:11px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:all .15s;}
`;
document.head.appendChild(sty);

/* ─── 2. SFX ENGINE ─── */
var v10AC=null;
function v10Sfx(type){
  try{
    if(!v10AC)v10AC=new(window.AudioContext||window.webkitAudioContext)();
    var o=v10AC.createOscillator(),g=v10AC.createGain();
    o.connect(g);g.connect(v10AC.destination);
    var now=v10AC.currentTime;
    var map={
      rec_start:{f:880,t:'sine',dur:.15,vol:.12},
      rec_stop:{f:440,t:'sine',dur:.2,vol:.12},
      rec_play:{f:660,t:'triangle',dur:.12,vol:.1},
      tempo_tick:{f:1000,t:'square',dur:.03,vol:.08},
      tempo_up:{f:1200,t:'sine',dur:.1,vol:.1},
      cross_hit:{f:550,t:'triangle',dur:.08,vol:.1},
      dict_open:{f:500,t:'sine',dur:.12,vol:.08},
      goal_done:{f:784,t:'triangle',dur:.2,vol:.12}
    };
    var s=map[type]||{f:600,t:'sine',dur:.1,vol:.08};
    o.type=s.t;o.frequency.value=s.f;
    g.gain.setValueAtTime(s.vol,now);g.gain.exponentialRampToValueAtTime(.001,now+s.dur);
    o.start(now);o.stop(now+s.dur);
  }catch(e){}
}

/* ─── 3. NEW SONGS (10곡: 64→74) ─── */
(function addSongs(){
  if(typeof SONGS==='undefined')return;

  SONGS['지고이네르바이젠']={name:'지고이네르바이젠 (사라사테)',category:'클래식',difficulty:'hard',bpm:130,
    notes:[
      {note:'A4',dur:.5,s:2,f:0},{note:'C5',dur:.5,s:2,f:3},{note:'E5',dur:.5,s:3,f:0},{note:'A5',dur:.5,s:3,f:5},
      {note:'G5',dur:.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'A4',dur:.5,s:2,f:0},{note:'B4',dur:.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},{note:'D5',dur:.5,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'C5',dur:1,s:2,f:3},{note:'A4',dur:2,s:2,f:0}
    ]};

  SONGS['사랑의기쁨']={name:'사랑의 기쁨 (크라이슬러)',category:'클래식',difficulty:'medium',bpm:76,
    notes:[
      {note:'E5',dur:1.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:1.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:2,s:2,f:3},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},
      {note:'B4',dur:1,s:2,f:2},{note:'C5',dur:2,s:2,f:3},{note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['탱고질투']={name:'라쿰파르시타 탱고',category:'클래식',difficulty:'medium',bpm:108,
    notes:[
      {note:'E4',dur:1,s:1,f:2},{note:'F4',dur:.5,s:1,f:3},{note:'E4',dur:.5,s:1,f:2},
      {note:'D4',dur:1,s:1,f:0},{note:'E4',dur:1,s:1,f:2},
      {note:'A4',dur:1.5,s:2,f:0},{note:'G4',dur:.5,s:1,f:5},{note:'F4',dur:1,s:1,f:3},
      {note:'E4',dur:1,s:1,f:2},{note:'D4',dur:1,s:1,f:0},{note:'E4',dur:1,s:1,f:2},
      {note:'F4',dur:1,s:1,f:3},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'F4',dur:1,s:1,f:3},{note:'E4',dur:2,s:1,f:2},{note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['메뉴에트3']={name:'메뉴에트 3번 (바흐)',category:'클래식',difficulty:'easy',bpm:100,
    notes:[
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:2,s:1,f:5},
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:1.5,s:2,f:0},{note:'G4',dur:.5,s:1,f:5},{note:'A4',dur:1,s:2,f:0},
      {note:'G4',dur:2,s:1,f:5},{note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['오베르타스']={name:'오베르타스 (비에니아프스키)',category:'클래식',difficulty:'hard',bpm:140,
    notes:[
      {note:'A4',dur:.5,s:2,f:0},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:.5,s:1,f:5},{note:'A4',dur:.5,s:2,f:0},
      {note:'B4',dur:1,s:2,f:2},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'F4',dur:.5,s:1,f:3},{note:'E4',dur:.5,s:1,f:2},
      {note:'D4',dur:1,s:1,f:0},{note:'E4',dur:1,s:1,f:2},{note:'A4',dur:2,s:2,f:0}
    ]};

  SONGS['도나우강']={name:'아름답고 푸른 도나우 (슈트라우스)',category:'클래식',difficulty:'easy',bpm:84,
    notes:[
      {note:'C5',dur:2,s:2,f:3},{note:'E5',dur:1,s:3,f:0},
      {note:'E5',dur:2,s:3,f:0},{note:'R',dur:1,s:-1,f:0},
      {note:'E5',dur:2,s:3,f:0},{note:'G5',dur:1,s:3,f:3},
      {note:'G5',dur:2,s:3,f:3},{note:'R',dur:1,s:-1,f:0},
      {note:'D5',dur:2,s:2,f:5},{note:'F5',dur:1,s:3,f:1},
      {note:'F5',dur:2,s:3,f:1},{note:'R',dur:1,s:-1,f:0},
      {note:'D5',dur:2,s:2,f:5},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:2,s:2,f:3},{note:'E5',dur:1,s:3,f:0},
      {note:'C5',dur:3,s:2,f:3}
    ]};

  SONGS['풍년가']={name:'풍년가',category:'민요',difficulty:'easy',bpm:92,
    notes:[
      {note:'G4',dur:1,s:1,f:5},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},{note:'E4',dur:1,s:1,f:2},
      {note:'D4',dur:2,s:1,f:0},{note:'E4',dur:1,s:1,f:2},{note:'G4',dur:1,s:1,f:5},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},{note:'E4',dur:1,s:1,f:2},{note:'D4',dur:1,s:1,f:0},
      {note:'C4',dur:2,s:0,f:5},{note:'R',dur:1,s:-1,f:0},
      {note:'D4',dur:1,s:1,f:0},{note:'E4',dur:1,s:1,f:2},{note:'G4',dur:1,s:1,f:5},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:2,s:1,f:5},{note:'R',dur:1,s:-1,f:0}
    ]};

  SONGS['어린양']={name:'어린 양 (모차르트)',category:'클래식',difficulty:'easy',bpm:90,
    notes:[
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'C5',dur:1,s:2,f:3},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'C5',dur:1,s:2,f:3},
      {note:'E5',dur:1,s:3,f:0},{note:'F5',dur:1,s:3,f:1},{note:'G5',dur:2,s:3,f:3},
      {note:'E5',dur:1,s:3,f:0},{note:'F5',dur:1,s:3,f:1},{note:'G5',dur:2,s:3,f:3},
      {note:'G5',dur:.5,s:3,f:3},{note:'A5',dur:.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},
      {note:'E5',dur:1,s:3,f:0},{note:'C5',dur:1,s:2,f:3},
      {note:'G5',dur:.5,s:3,f:3},{note:'A5',dur:.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},
      {note:'E5',dur:1,s:3,f:0},{note:'C5',dur:1,s:2,f:3},
      {note:'C5',dur:1,s:2,f:3},{note:'G4',dur:1,s:1,f:5},{note:'C5',dur:2,s:2,f:3}
    ]};

  SONGS['소야곡']={name:'소야곡 (하이든)',category:'클래식',difficulty:'medium',bpm:72,
    notes:[
      {note:'C5',dur:1,s:2,f:3},{note:'E5',dur:.5,s:3,f:0},{note:'G5',dur:.5,s:3,f:3},
      {note:'G5',dur:1,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1,s:2,f:2},{note:'D5',dur:.5,s:2,f:5},{note:'F5',dur:.5,s:3,f:1},
      {note:'E5',dur:1.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:2,s:2,f:3},
      {note:'E5',dur:1,s:3,f:0},{note:'G5',dur:.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:2,s:2,f:3}
    ]};

  SONGS['강강술래']={name:'강강술래',category:'민요',difficulty:'easy',bpm:96,
    notes:[
      {note:'E4',dur:1,s:1,f:2},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'E4',dur:2,s:1,f:2},{note:'D4',dur:1,s:1,f:0},{note:'E4',dur:1,s:1,f:2},
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},{note:'E4',dur:1,s:1,f:2},
      {note:'D4',dur:2,s:1,f:0},{note:'R',dur:1,s:-1,f:0},
      {note:'A4',dur:1,s:2,f:0},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},{note:'E4',dur:1,s:1,f:2},
      {note:'G4',dur:1,s:1,f:5},{note:'E4',dur:1,s:1,f:2},{note:'D4',dur:2,s:1,f:0}
    ]};
})();

/* ─── 4. NEW LESSONS (10레슨: 90→100) ─── */
(function addLessons(){
  if(typeof LESSONS==='undefined')return;
  LESSONS.push({lv:91,title:'현 이동 (G→D)',desc:'G현과 D현을 번갈아 연주하세요',targets:[{s:0,f:0,count:1},{s:1,f:0,count:1},{s:0,f:0,count:1},{s:1,f:0,count:1},{s:0,f:0,count:1},{s:1,f:0,count:1}]});
  LESSONS.push({lv:92,title:'현 이동 (D→A)',desc:'D현과 A현을 번갈아 연주하세요',targets:[{s:1,f:0,count:1},{s:2,f:0,count:1},{s:1,f:0,count:1},{s:2,f:0,count:1},{s:1,f:0,count:1},{s:2,f:0,count:1}]});
  LESSONS.push({lv:93,title:'현 이동 (A→E)',desc:'A현과 E현을 번갈아 연주하세요',targets:[{s:2,f:0,count:1},{s:3,f:0,count:1},{s:2,f:0,count:1},{s:3,f:0,count:1},{s:2,f:0,count:1},{s:3,f:0,count:1}]});
  LESSONS.push({lv:94,title:'현 건너뛰기 (G→A)',desc:'G현에서 A현으로 건너뛰어 연주하세요',targets:[{s:0,f:0,count:1},{s:2,f:0,count:1},{s:0,f:2,count:1},{s:2,f:2,count:1},{s:0,f:0,count:1},{s:2,f:0,count:1}]});
  LESSONS.push({lv:95,title:'현 건너뛰기 (D→E)',desc:'D현에서 E현으로 건너뛰어 연주하세요',targets:[{s:1,f:0,count:1},{s:3,f:0,count:1},{s:1,f:2,count:1},{s:3,f:2,count:1},{s:1,f:0,count:1},{s:3,f:0,count:1}]});
  LESSONS.push({lv:96,title:'F 장음계',desc:'F-G-A-Bb-C-D-E-F를 순서대로 연주하세요',targets:[{s:1,f:3,count:1},{s:1,f:5,count:1},{s:2,f:0,count:1},{s:2,f:1,count:1},{s:2,f:3,count:1},{s:2,f:5,count:1},{s:3,f:0,count:1},{s:3,f:1,count:1}]});
  LESSONS.push({lv:97,title:'Bb 장음계',desc:'Bb-C-D-Eb-F-G-A-Bb를 순서대로 연주하세요',targets:[{s:2,f:1,count:1},{s:2,f:3,count:1},{s:2,f:5,count:1},{s:3,f:1,count:1},{s:3,f:1,count:1},{s:3,f:3,count:1},{s:3,f:5,count:1},{s:3,f:1,count:1}]});
  LESSONS.push({lv:98,title:'사랑의기쁨 테마',desc:'크라이슬러 사랑의 기쁨 주선율 연주',targets:[{s:3,f:0,count:1},{s:2,f:5,count:1},{s:2,f:3,count:1},{s:2,f:5,count:1},{s:2,f:3,count:1},{s:2,f:2,count:1}]});
  SONGS['어린양']&&LESSONS.push({lv:99,title:'어린 양 테마',desc:'모차르트 어린 양 주제부 연습',targets:[{s:2,f:3,count:1},{s:2,f:5,count:1},{s:3,f:0,count:1},{s:2,f:3,count:1},{s:3,f:0,count:1},{s:3,f:1,count:1},{s:3,f:3,count:1}]});
  LESSONS.push({lv:100,title:'v10 졸업 시험',desc:'4현 전체를 0-2-4-5 순서로 연주 (16음)',targets:[
    {s:0,f:0,count:1},{s:0,f:2,count:1},{s:0,f:4,count:1},{s:0,f:5,count:1},
    {s:1,f:0,count:1},{s:1,f:2,count:1},{s:1,f:4,count:1},{s:1,f:5,count:1},
    {s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:4,count:1},{s:2,f:5,count:1},
    {s:3,f:0,count:1},{s:3,f:2,count:1},{s:3,f:4,count:1},{s:3,f:5,count:1}
  ]});
})();

/* ─── 5. NEW ACHIEVEMENTS (12: 58→70) ─── */
var V10_ACHS=[
  {id:'lesson_100',name:'마에스트로 그랜드마스터',desc:'100개 레슨을 모두 완료했습니다',icon:'👑'},
  {id:'songs_70',name:'70곡 컬렉터',desc:'70곡을 완주했습니다',icon:'🎵'},
  {id:'recorder_first',name:'첫 녹음',desc:'연습을 처음 녹음했습니다',icon:'🎙'},
  {id:'tempo_builder',name:'템포 마스터',desc:'템포 빌더를 5회 완료했습니다',icon:'⏱'},
  {id:'cross_master',name:'현 이동 달인',desc:'현 이동 훈련을 10회 완료했습니다',icon:'🎯'},
  {id:'dict_reader',name:'음악 사전 독파',desc:'음악 용어 20개를 확인했습니다',icon:'📖'},
  {id:'goal_achiever',name:'목표 달성자',desc:'연습 목표를 3개 달성했습니다',icon:'🏅'},
  {id:'tone_explorer',name:'음색 탐험가',desc:'음색 프리셋 3종을 시도했습니다',icon:'🎨'},
  {id:'history_viewer',name:'히스토리 뷰어',desc:'연주 히스토리를 확인했습니다',icon:'📜'},
  {id:'bow_sim_user',name:'보잉 시뮬레이터',desc:'보잉 궤적 시뮬레이터를 사용했습니다',icon:'🏹'},
  {id:'perfect_1000',name:'1000 퍼펙트',desc:'총 1000회 Perfect 판정을 받았습니다',icon:'💎'},
  {id:'daily_streak_60',name:'60일 연속',desc:'60일 연속 연습을 달성했습니다',icon:'🔥'}
];
(function addAchs(){
  if(typeof window.ACHIEVEMENTS==='undefined')return;
  V10_ACHS.forEach(function(a){window.ACHIEVEMENTS.push(a);});
})();

/* ─── 6. ACHIEVEMENT CHECKER PATCH ─── */
(function patchAchCheck(){
  var origCheck=window.checkAchievements;
  if(!origCheck)return;
  window.checkAchievements=function(){
    origCheck();
    var p=loadProgress();var achs=loadAchievements();var stats=loadStats();
    var lessonsDone=0;for(var i=1;i<=100;i++){if(p['lesson_'+i])lessonsDone++;}
    if(lessonsDone>=100&&!achs.lesson_100)unlockAch('lesson_100');
    var songSet=new Set();
    Object.keys(p).forEach(function(k){
      if(k.startsWith('rhythm_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^rhythm_/,''));
      if(k.startsWith('perform_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^perform_/,''));
    });
    if(songSet.size>=70&&!achs.songs_70)unlockAch('songs_70');
    if((stats.totalPerfects||0)>=1000&&!achs.perfect_1000)unlockAch('perfect_1000');
    var dailyData=typeof loadDailyData==='function'?loadDailyData():{};
    if(dailyData.streak>=60&&!achs.daily_streak_60)unlockAch('daily_streak_60');
  };
})();

/* ─── 7. STATS DISPLAY PATCH ─── */
(function patchStats(){
  var origUpdate=window.updateStatsPanel;
  if(!origUpdate)return;
  window.updateStatsPanel=function(){
    origUpdate();
    var el=document.getElementById('statAch');
    if(el){var achs=loadAchievements();el.textContent=Object.keys(achs).length+'/70';}
    var lesEl=document.getElementById('statLessons');
    if(lesEl){var p=loadProgress();var done=0;for(var i=1;i<=100;i++){if(p['lesson_'+i])done++;}lesEl.textContent=done+'/100';}
  };
})();

/* ─── 8. RECORDING & PLAYBACK ─── */
var REC_KEY='violinV10_recordings';
function loadRecordings(){try{return JSON.parse(localStorage.getItem(REC_KEY)||'[]');}catch(e){return [];}}
function saveRecordings(r){localStorage.setItem(REC_KEY,JSON.stringify(r.slice(-20)));}

var recState={active:false,events:[],startTime:0};

function startRecording(){
  v10Sfx('rec_start');
  recState={active:true,events:[],startTime:Date.now()};
  var origOnNote=window.onNotePress;
  if(origOnNote){
    window._origOnNote=origOnNote;
    window.onNotePress=function(s,f){
      if(recState.active){
        recState.events.push({t:Date.now()-recState.startTime,s:s,f:f});
      }
      origOnNote(s,f);
    };
  }
  var btn=document.getElementById('recToggleBtn');
  if(btn){btn.textContent='⏹ 녹음 중';btn.classList.add('recRecording');}
}

function stopRecording(){
  v10Sfx('rec_stop');
  recState.active=false;
  if(window._origOnNote){window.onNotePress=window._origOnNote;delete window._origOnNote;}
  if(recState.events.length>0){
    var recs=loadRecordings();
    var now=new Date();
    recs.push({
      date:now.toLocaleDateString('ko-KR')+'  '+now.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}),
      notes:recState.events.length,
      duration:Math.round((Date.now()-recState.startTime)/1000),
      events:recState.events
    });
    saveRecordings(recs);
    var achs=loadAchievements();if(!achs.recorder_first)unlockAch('recorder_first');
    addHistory('recording','연습 녹음 완료 ('+recState.events.length+'개 노트, '+Math.round((Date.now()-recState.startTime)/1000)+'초)');
  }
  var btn=document.getElementById('recToggleBtn');
  if(btn){btn.textContent='🎙 녹음';btn.classList.remove('recRecording');}
  renderRecordings();
}

function playRecording(idx){
  var recs=loadRecordings();if(!recs[idx])return;
  v10Sfx('rec_play');
  var events=recs[idx].events;
  if(typeof ensureA==='function')ensureA();
  events.forEach(function(ev){
    setTimeout(function(){
      if(typeof window.onNotePress==='function')window.onNotePress(ev.s,ev.f);
    },ev.t);
  });
}

function deleteRecording(idx){
  var recs=loadRecordings();recs.splice(idx,1);saveRecordings(recs);renderRecordings();
}

function renderRecordings(){
  var container=document.getElementById('recList');if(!container)return;
  var recs=loadRecordings();container.innerHTML='';
  if(recs.length===0){container.innerHTML='<div style="font-size:10px;color:rgba(201,169,110,.3);text-align:center;padding:20px;">녹음된 연습이 없습니다. 녹음 버튼을 눌러 시작하세요.</div>';return;}
  recs.slice().reverse().forEach(function(r,i){
    var realIdx=recs.length-1-i;
    var div=document.createElement('div');div.className='recCard';
    div.innerHTML='<div class="recName">🎙 녹음 #'+(realIdx+1)+'</div>'+
      '<div class="recMeta">'+r.date+' | '+r.notes+'개 노트 | '+r.duration+'초</div>'+
      '<div class="recActions"><div class="recActBtn" data-play="'+realIdx+'">▶ 재생</div>'+
      '<div class="recActBtn" data-del="'+realIdx+'">🗑 삭제</div></div>';
    container.appendChild(div);
  });
  container.querySelectorAll('[data-play]').forEach(function(b){
    b.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();playRecording(parseInt(b.dataset.play));});
  });
  container.querySelectorAll('[data-del]').forEach(function(b){
    b.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();deleteRecording(parseInt(b.dataset.del));});
  });
}

function createRecPanel(){
  var panel=document.createElement('div');panel.id='recPanel';
  panel.innerHTML='<span class="v10Close" id="recClose">&times;</span>'+
    '<h3>🎙 연습 녹음 &amp; 재생</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">연주를 녹음하고 다시 들어보세요</div>'+
    '<div style="display:flex;gap:8px;margin:8px 0;">'+
    '<div class="recActBtn" id="recToggleBtn">🎙 녹음</div></div>'+
    '<div id="recList"></div>';
  document.body.appendChild(panel);
  document.getElementById('recClose').addEventListener('pointerdown',function(e){e.preventDefault();if(recState.active)stopRecording();panel.classList.remove('show');});
  document.getElementById('recToggleBtn').addEventListener('pointerdown',function(e){
    e.preventDefault();if(recState.active)stopRecording();else startRecording();
  });
}

/* ─── 9. TEMPO BUILDER ─── */
var TEMPO_KEY='violinV10_tempo';
function loadTempoData(){try{return JSON.parse(localStorage.getItem(TEMPO_KEY)||'{}');}catch(e){return {};}}
function saveTempoData(d){localStorage.setItem(TEMPO_KEY,JSON.stringify(d));}

var tempoState={active:false,bpm:60,target:120,step:5,interval:null,metronomeInterval:null};

function createTempoPanel(){
  var panel=document.createElement('div');panel.id='tempoPanel';
  panel.innerHTML='<span class="v10Close" id="tempoClose">&times;</span>'+
    '<h3>⏱ 템포 빌더</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">느린 템포에서 점차 빨라집니다</div>'+
    '<div class="tempoBPM" id="tempoBPMDisp">60 BPM</div>'+
    '<div class="tempoBar"><div class="tempoFill" id="tempoFill"></div></div>'+
    '<div class="tempoCtrlRow"><label style="font-size:10px;color:rgba(201,169,110,.5);min-width:60px;">시작 BPM</label>'+
    '<input type="range" id="tempoStartCtrl" min="40" max="120" value="60" style="flex:1;accent-color:#ffd700;">'+
    '<span id="tempoStartVal" style="font-size:11px;color:#ffd700;min-width:40px;text-align:right;">60</span></div>'+
    '<div class="tempoCtrlRow"><label style="font-size:10px;color:rgba(201,169,110,.5);min-width:60px;">목표 BPM</label>'+
    '<input type="range" id="tempoTargetCtrl" min="80" max="200" value="120" style="flex:1;accent-color:#ffd700;">'+
    '<span id="tempoTargetVal" style="font-size:11px;color:#ffd700;min-width:40px;text-align:right;">120</span></div>'+
    '<div class="tempoCtrlRow"><label style="font-size:10px;color:rgba(201,169,110,.5);min-width:60px;">증가 간격</label>'+
    '<input type="range" id="tempoStepCtrl" min="1" max="10" value="5" style="flex:1;accent-color:#ffd700;">'+
    '<span id="tempoStepVal" style="font-size:11px;color:#ffd700;min-width:40px;text-align:right;">5 BPM/10s</span></div>'+
    '<div style="display:flex;gap:8px;margin:12px 0;">'+
    '<div class="recActBtn" id="tempoStartBtn">▶ 시작</div>'+
    '<div class="recActBtn" id="tempoStopBtn" style="display:none;">⏹ 정지</div></div>';
  document.body.appendChild(panel);
  document.getElementById('tempoClose').addEventListener('pointerdown',function(e){e.preventDefault();stopTempo();panel.classList.remove('show');});
  document.getElementById('tempoStartCtrl').addEventListener('input',function(){
    tempoState.bpm=parseInt(this.value);document.getElementById('tempoStartVal').textContent=this.value;
  });
  document.getElementById('tempoTargetCtrl').addEventListener('input',function(){
    tempoState.target=parseInt(this.value);document.getElementById('tempoTargetVal').textContent=this.value;
  });
  document.getElementById('tempoStepCtrl').addEventListener('input',function(){
    tempoState.step=parseInt(this.value);document.getElementById('tempoStepVal').textContent=this.value+' BPM/10s';
  });
  document.getElementById('tempoStartBtn').addEventListener('pointerdown',function(e){e.preventDefault();startTempo();});
  document.getElementById('tempoStopBtn').addEventListener('pointerdown',function(e){e.preventDefault();stopTempo();});
}

function startTempo(){
  if(typeof ensureA==='function')ensureA();
  tempoState.active=true;
  tempoState.bpm=parseInt(document.getElementById('tempoStartCtrl').value);
  tempoState.target=parseInt(document.getElementById('tempoTargetCtrl').value);
  tempoState.step=parseInt(document.getElementById('tempoStepCtrl').value);
  document.getElementById('tempoStartBtn').style.display='none';
  document.getElementById('tempoStopBtn').style.display='';
  updateTempoDisplay();
  startMetronomeClick();
  tempoState.interval=setInterval(function(){
    if(tempoState.bpm<tempoState.target){
      tempoState.bpm+=tempoState.step;
      if(tempoState.bpm>tempoState.target)tempoState.bpm=tempoState.target;
      v10Sfx('tempo_up');updateTempoDisplay();
      startMetronomeClick();
    }else{
      stopTempo();
      var d=loadTempoData();d.sessions=(d.sessions||0)+1;saveTempoData(d);
      if(d.sessions>=5){var achs=loadAchievements();if(!achs.tempo_builder)unlockAch('tempo_builder');}
      addHistory('tempo','템포 빌더 완료 (목표 '+tempoState.target+' BPM 달성)');
    }
  },10000);
}

function startMetronomeClick(){
  if(tempoState.metronomeInterval)clearInterval(tempoState.metronomeInterval);
  var ms=60000/tempoState.bpm;
  tempoState.metronomeInterval=setInterval(function(){v10Sfx('tempo_tick');},ms);
}

function stopTempo(){
  tempoState.active=false;
  if(tempoState.interval){clearInterval(tempoState.interval);tempoState.interval=null;}
  if(tempoState.metronomeInterval){clearInterval(tempoState.metronomeInterval);tempoState.metronomeInterval=null;}
  document.getElementById('tempoStartBtn').style.display='';
  document.getElementById('tempoStopBtn').style.display='none';
}

function updateTempoDisplay(){
  document.getElementById('tempoBPMDisp').textContent=tempoState.bpm+' BPM';
  var pct=Math.min(100,((tempoState.bpm-40)/(tempoState.target-40))*100);
  document.getElementById('tempoFill').style.width=pct+'%';
}

/* ─── 10. STRING CROSSING DRILLS ─── */
var CROSS_KEY='violinV10_cross';
function loadCrossData(){try{return JSON.parse(localStorage.getItem(CROSS_KEY)||'{}');}catch(e){return {};}}
function saveCrossData(d){localStorage.setItem(CROSS_KEY,JSON.stringify(d));}

var CROSS_DRILLS=[
  {name:'G-D 인접 이동',desc:'G현과 D현 사이를 부드럽게 이동',pattern:[0,1,0,1,0,1,0,1]},
  {name:'D-A 인접 이동',desc:'D현과 A현 사이를 부드럽게 이동',pattern:[1,2,1,2,1,2,1,2]},
  {name:'A-E 인접 이동',desc:'A현과 E현 사이를 부드럽게 이동',pattern:[2,3,2,3,2,3,2,3]},
  {name:'G-A 건너뛰기',desc:'G현에서 A현으로 건너뛰어 이동',pattern:[0,2,0,2,0,2,0,2]},
  {name:'D-E 건너뛰기',desc:'D현에서 E현으로 건너뛰어 이동',pattern:[1,3,1,3,1,3,1,3]},
  {name:'G-E 대각선',desc:'가장 먼 G현과 E현을 넘나들기',pattern:[0,3,0,3,0,3,0,3]},
  {name:'순차 상행',desc:'G→D→A→E 순서로 올라가기',pattern:[0,1,2,3,0,1,2,3]},
  {name:'순차 하행',desc:'E→A→D→G 순서로 내려가기',pattern:[3,2,1,0,3,2,1,0]},
  {name:'지그재그',desc:'G-A-D-E 지그재그 패턴',pattern:[0,2,1,3,0,2,1,3]},
  {name:'역 지그재그',desc:'E-D-A-G 역방향 지그재그',pattern:[3,1,2,0,3,1,2,0]}
];

var crossState={active:false,drill:null,step:0,hits:0};

function createCrossPanel(){
  var panel=document.createElement('div');panel.id='crossPanel';
  var html='<span class="v10Close" id="crossClose">&times;</span>'+
    '<h3>🎯 현 이동 훈련</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">현과 현 사이를 부드럽게 넘나드는 연습</div>'+
    '<canvas id="crossCanvas" width="360" height="120"></canvas>'+
    '<div id="crossDrillList"></div>';
  panel.innerHTML=html;document.body.appendChild(panel);
  document.getElementById('crossClose').addEventListener('pointerdown',function(e){e.preventDefault();crossState.active=false;panel.classList.remove('show');});
  var list=document.getElementById('crossDrillList');
  CROSS_DRILLS.forEach(function(dr,idx){
    var div=document.createElement('div');div.className='crossDrill';
    div.innerHTML='<div class="crossTitle">'+dr.name+'</div><div class="crossDesc">'+dr.desc+'</div>';
    div.addEventListener('pointerdown',function(e){e.preventDefault();startCrossDrill(idx);});
    list.appendChild(div);
  });
}

function startCrossDrill(idx){
  if(typeof ensureA==='function')ensureA();
  crossState={active:true,drill:idx,step:0,hits:0};
  drawCrossCanvas();
  var drills=document.querySelectorAll('.crossDrill');
  drills.forEach(function(d,i){d.classList.toggle('active',i===idx);});
}

function drawCrossCanvas(){
  var cv=document.getElementById('crossCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  var STRS=['G','D','A','E'];var COLS=['#44ee44','#cc55ff','#44ddee','#ffdd33'];
  for(var i=0;i<4;i++){
    var y=20+i*25;
    ctx.strokeStyle=COLS[i];ctx.lineWidth=2;ctx.globalAlpha=.3;
    ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(W-20,y);ctx.stroke();
    ctx.globalAlpha=1;ctx.fillStyle=COLS[i];ctx.font='10px Georgia';
    ctx.fillText(STRS[i],4,y+4);
  }
  if(crossState.drill!==null){
    var dr=CROSS_DRILLS[crossState.drill];
    dr.pattern.forEach(function(s,pi){
      var x=40+pi*38;var y=20+s*25;
      ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);
      if(pi<crossState.step){ctx.fillStyle='rgba(68,238,68,.6)';ctx.fill();}
      else if(pi===crossState.step){ctx.fillStyle='rgba(255,215,0,.8)';ctx.fill();
        ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.stroke();}
      else{ctx.strokeStyle='rgba(255,215,0,.2)';ctx.lineWidth=1;ctx.stroke();}
    });
  }
}

/* ─── 11. MUSIC DICTIONARY (40항목) ─── */
var DICT_DATA=[
  {cat:'기본',word:'피치카토',en:'Pizzicato',def:'활 대신 손가락으로 현을 튕겨 연주하는 기법. 가볍고 경쾌한 소리가 특징.'},
  {cat:'기본',word:'아르코',en:'Arco',def:'활로 현을 긋는 기본 주법. 피치카토 다음에 다시 활로 돌아갈 때 표시.'},
  {cat:'기본',word:'레가토',en:'Legato',def:'음과 음 사이를 끊기지 않게 매끄럽게 이어 연주하는 것. 슬러와 함께 사용.'},
  {cat:'기본',word:'스타카토',en:'Staccato',def:'음을 짧게 끊어서 연주하는 기법. 음표 위에 점으로 표시.'},
  {cat:'기본',word:'페르마타',en:'Fermata',def:'해당 음을 원래 길이보다 길게 유지하라는 표시. 눈 모양 기호.'},
  {cat:'보잉',word:'데타셰',en:'Detache',def:'각 음을 분리된 활쓰기로 연주. 활의 방향이 음마다 바뀜.'},
  {cat:'보잉',word:'마르텔레',en:'Martele',def:'강하고 또렷하게 음을 시작하는 활쓰기 기법. 악센트가 있는 스타카토.'},
  {cat:'보잉',word:'스피카토',en:'Spiccato',def:'활을 튀기듯이 현에서 약간 떼며 연주. 빠른 패시지에 사용.'},
  {cat:'보잉',word:'트레몰로',en:'Tremolo',def:'같은 음을 빠르게 반복하는 기법. 활을 빠르게 왕복.'},
  {cat:'보잉',word:'콜레뇨',en:'Col Legno',def:'활의 나무 부분으로 현을 두드리거나 긋는 특수 주법.'},
  {cat:'보잉',word:'술 폰티첼로',en:'Sul Ponticello',def:'브릿지 가까이에서 연주하여 금속성의 독특한 음색을 내는 기법.'},
  {cat:'보잉',word:'술 타스토',en:'Sul Tasto',def:'지판 위에서 연주하여 부드럽고 몽환적인 음색을 내는 기법.'},
  {cat:'표현',word:'크레셴도',en:'Crescendo',def:'점차 소리를 크게 하는 것. &lt; 기호로 표시.'},
  {cat:'표현',word:'디크레셴도',en:'Decrescendo',def:'점차 소리를 작게 하는 것. &gt; 기호로 표시. 디미누엔도라고도 함.'},
  {cat:'표현',word:'포르테',en:'Forte',def:'세게 연주. f로 표시. ff는 매우 세게, fff는 가장 세게.'},
  {cat:'표현',word:'피아노',en:'Piano',def:'여리게 연주. p로 표시. pp는 매우 여리게, ppp는 가장 여리게.'},
  {cat:'표현',word:'비브라토',en:'Vibrato',def:'손가락을 미세하게 흔들어 음에 떨림과 따뜻함을 주는 기법.'},
  {cat:'표현',word:'글리산도',en:'Glissando',def:'한 음에서 다른 음으로 미끄러지듯 연결하는 기법.'},
  {cat:'표현',word:'포르타멘토',en:'Portamento',def:'글리산도보다 섬세하게 음을 연결하며 이동하는 기법.'},
  {cat:'표현',word:'리타르단도',en:'Ritardando',def:'점차 느리게. rit.으로 약칭. 곡의 마무리에 자주 사용.'},
  {cat:'구조',word:'소나타',en:'Sonata',def:'보통 3~4악장으로 이루어진 기악곡 형식.'},
  {cat:'구조',word:'콘체르토',en:'Concerto',def:'독주 악기와 오케스트라를 위한 악곡. 바이올린 콘체르토가 대표적.'},
  {cat:'구조',word:'카덴차',en:'Cadenza',def:'콘체르토에서 독주자가 기교를 발휘하는 자유로운 즉흥 부분.'},
  {cat:'구조',word:'코다',en:'Coda',def:'악곡의 끝부분에 추가되는 마무리 부분.'},
  {cat:'악기',word:'현침',en:'Bridge',def:'바이올린 몸통 위에 세워진 나무 조각. 현의 진동을 몸통에 전달.'},
  {cat:'악기',word:'지판',en:'Fingerboard',def:'손가락으로 현을 누르는 흑단 판. 넥 위에 부착.'},
  {cat:'악기',word:'턱받침',en:'Chin Rest',def:'턱을 올려 악기를 고정하는 부품. 1820년 스포어가 발명.'},
  {cat:'악기',word:'미세조율기',en:'Fine Tuner',def:'테일피스에 부착된 나사형 조율 장치. E현에 기본 장착.'},
  {cat:'악기',word:'송진',en:'Rosin',def:'활털에 바르는 소나무 수지. 마찰력을 높여 현과 활의 접촉을 개선.'},
  {cat:'악기',word:'활털',en:'Bow Hair',def:'활에 사용되는 말꼬리 털(약 150~200가닥). 정기적 교체 필요.'},
  {cat:'음악이론',word:'조성',en:'Key',def:'악곡의 중심이 되는 음(으뜸음)과 그에 따른 음계 체계.'},
  {cat:'음악이론',word:'음정',en:'Interval',def:'두 음 사이의 높낮이 차이. 완전1도부터 완전8도까지.'},
  {cat:'음악이론',word:'화음',en:'Chord',def:'3개 이상의 음이 동시에 울리는 것. 바이올린에서는 더블스톱으로 구현.'},
  {cat:'음악이론',word:'이명동음',en:'Enharmonic',def:'표기는 다르지만 같은 높이의 음. 예: C#과 Db.'},
  {cat:'음악이론',word:'장조',en:'Major',def:'밝고 명랑한 느낌의 음계/조성. 온온반온온온반 간격.'},
  {cat:'음악이론',word:'단조',en:'Minor',def:'어둡고 슬픈 느낌의 음계/조성. 자연단음계/화성단음계/선율단음계.'},
  {cat:'연주용어',word:'솔로',en:'Solo',def:'한 명의 연주자가 단독으로 연주하는 것.'},
  {cat:'연주용어',word:'앙상블',en:'Ensemble',def:'2인 이상이 함께 연주하는 것. 듀오, 트리오, 현악4중주 등.'},
  {cat:'연주용어',word:'투티',en:'Tutti',def:'오케스트라 전원이 함께 연주하는 부분.'},
  {cat:'연주용어',word:'피아니시모',en:'Pianissimo',def:'매우 여리게 연주. pp로 표시. 섬세한 감정 표현에 사용.'}
];

function createDictPanel(){
  var panel=document.createElement('div');panel.id='dictPanel';
  var cats=[...new Set(DICT_DATA.map(function(d){return d.cat;}))];
  var catHtml=cats.map(function(c){return '<div class="dictCatTab" data-cat="'+c+'">'+c+'</div>';}).join('');
  panel.innerHTML='<span class="v10Close" id="dictClose">&times;</span>'+
    '<h3>📖 음악 용어 사전</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:4px;">40개 바이올린/음악 용어</div>'+
    '<input class="dictSearch" id="dictSearchInput" placeholder="용어 검색...">'+
    '<div class="dictCatTabs"><div class="dictCatTab active" data-cat="all">전체</div>'+catHtml+'</div>'+
    '<div id="dictItemList" style="width:100%;max-width:360px;"></div>';
  document.body.appendChild(panel);
  document.getElementById('dictClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});

  var dictViewed=new Set();

  function renderDict(filter,query){
    var list=document.getElementById('dictItemList');list.innerHTML='';
    DICT_DATA.forEach(function(d){
      if(filter!=='all'&&d.cat!==filter)return;
      if(query&&d.word.indexOf(query)===-1&&d.en.toLowerCase().indexOf(query.toLowerCase())===-1&&d.def.indexOf(query)===-1)return;
      var item=document.createElement('div');item.className='dictItem';
      item.innerHTML='<span class="dictWord">'+d.word+'</span><span class="dictWordEN">'+d.en+'</span>'+
        '<div class="dictDef">'+d.def+'</div>';
      item.addEventListener('pointerdown',function(e){
        e.preventDefault();item.classList.toggle('expanded');
        if(item.classList.contains('expanded')){
          dictViewed.add(d.word);
          if(dictViewed.size>=20){var achs=loadAchievements();if(!achs.dict_reader)unlockAch('dict_reader');}
        }
      });
      list.appendChild(item);
    });
  }
  renderDict('all','');

  panel.querySelectorAll('.dictCatTab').forEach(function(tab){
    tab.addEventListener('pointerdown',function(e){
      e.preventDefault();
      panel.querySelectorAll('.dictCatTab').forEach(function(t){t.classList.remove('active');});
      tab.classList.add('active');
      renderDict(tab.dataset.cat,document.getElementById('dictSearchInput').value);
    });
  });
  document.getElementById('dictSearchInput').addEventListener('input',function(){
    var active=panel.querySelector('.dictCatTab.active');
    renderDict(active?active.dataset.cat:'all',this.value);
  });
}

/* ─── 12. PRACTICE GOALS ─── */
var GOAL_KEY='violinV10_goals';
function loadGoals(){try{return JSON.parse(localStorage.getItem(GOAL_KEY)||'{}');}catch(e){return {};}}
function saveGoals(g){localStorage.setItem(GOAL_KEY,JSON.stringify(g));}

var GOAL_TEMPLATES=[
  {id:'daily_15min',name:'매일 15분 연습',target:15,unit:'분',type:'time'},
  {id:'weekly_songs_5',name:'이번 주 5곡 완주',target:5,unit:'곡',type:'songs'},
  {id:'lesson_10',name:'레슨 10개 클리어',target:10,unit:'개',type:'lessons'},
  {id:'perfect_50',name:'퍼펙트 50회 달성',target:50,unit:'회',type:'perfects'},
  {id:'streak_7',name:'7일 연속 연습',target:7,unit:'일',type:'streak'},
  {id:'notes_500',name:'노트 500개 연주',target:500,unit:'개',type:'notes'}
];

function createGoalPanel(){
  var panel=document.createElement('div');panel.id='goalPanel';
  panel.innerHTML='<span class="v10Close" id="goalClose">&times;</span>'+
    '<h3>🎯 연습 목표</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">목표를 설정하고 달성해보세요</div>'+
    '<div id="goalList"></div>';
  document.body.appendChild(panel);
  document.getElementById('goalClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function renderGoals(){
  var container=document.getElementById('goalList');if(!container)return;
  container.innerHTML='';
  var goals=loadGoals();var stats=loadStats();var p=loadProgress();
  var achieved=0;
  GOAL_TEMPLATES.forEach(function(tmpl){
    var current=0;
    if(tmpl.type==='songs'){
      var songSet=new Set();
      Object.keys(p).forEach(function(k){
        if((k.startsWith('rhythm_')||k.startsWith('perform_'))&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k);
      });
      current=songSet.size;
    }else if(tmpl.type==='lessons'){
      for(var i=1;i<=100;i++){if(p['lesson_'+i])current++;}
    }else if(tmpl.type==='perfects'){current=stats.totalPerfects||0;}
    else if(tmpl.type==='notes'){current=stats.totalNotes||0;}
    else if(tmpl.type==='streak'){var dd=typeof loadDailyData==='function'?loadDailyData():{};current=dd.streak||0;}
    else if(tmpl.type==='time'){current=Math.round((stats.totalPlayTime||0)/60);}

    var pct=Math.min(100,Math.round((current/tmpl.target)*100));
    if(pct>=100)achieved++;

    var card=document.createElement('div');card.className='goalCard';
    card.innerHTML='<div class="goalTitle">'+(pct>=100?'✅ ':'')+ tmpl.name+'</div>'+
      '<div class="goalProg"><div class="goalFill" style="width:'+pct+'%"></div></div>'+
      '<div class="goalStat">'+current+' / '+tmpl.target+' '+tmpl.unit+' ('+pct+'%)</div>';
    container.appendChild(card);
  });
  if(achieved>=3){var achs=loadAchievements();if(!achs.goal_achiever)unlockAch('goal_achiever');}
}

/* ─── 13. REPERTOIRE RECOMMENDER ─── */
function createRecoPanel(){
  var panel=document.createElement('div');panel.id='recoPanel';
  panel.innerHTML='<span class="v10Close" id="recoClose">&times;</span>'+
    '<h3>💡 레퍼토리 추천</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">실력에 맞는 곡을 추천합니다</div>'+
    '<div id="recoList"></div>';
  document.body.appendChild(panel);
  document.getElementById('recoClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function renderRecommendations(){
  var container=document.getElementById('recoList');if(!container)return;
  container.innerHTML='';
  if(typeof SONGS==='undefined')return;
  var p=loadProgress();
  var played=new Set();
  Object.keys(p).forEach(function(k){
    if((k.startsWith('rhythm_')||k.startsWith('perform_'))&&k.indexOf('stars')===-1&&p[k]>0){
      played.add(k.replace(/^rhythm_|^perform_/,''));
    }
  });

  var lessonsDone=0;for(var i=1;i<=100;i++){if(p['lesson_'+i])lessonsDone++;}
  var level='easy';
  if(lessonsDone>60)level='hard';
  else if(lessonsDone>30)level='medium';

  var recommendations=[];
  Object.keys(SONGS).forEach(function(key){
    if(played.has(key))return;
    var song=SONGS[key];
    var match=100;
    if(song.difficulty===level)match=95;
    else if(level==='medium'&&song.difficulty==='easy')match=70;
    else if(level==='medium'&&song.difficulty==='hard')match=80;
    else if(level==='easy'&&song.difficulty==='medium')match=60;
    else if(level==='hard'&&song.difficulty==='medium')match=75;
    else match=50;
    recommendations.push({key:key,song:song,match:match});
  });

  recommendations.sort(function(a,b){return b.match-a.match;});
  recommendations.slice(0,8).forEach(function(r){
    var card=document.createElement('div');card.className='recoCard';
    var diffLabel={easy:'초급',medium:'중급',hard:'고급'}[r.song.difficulty]||r.song.difficulty;
    var reason=r.match>=90?'현재 실력에 딱 맞는 곡':r.match>=70?'도전해볼 만한 곡':'새로운 영역의 곡';
    card.innerHTML='<div class="recoMatch">'+r.match+'% 적합</div>'+
      '<div class="recoSong">'+r.song.name+'</div>'+
      '<div class="recoReason">'+r.song.category+' | '+diffLabel+' | '+reason+'</div>';
    container.appendChild(card);
  });
}

/* ─── 14. PERFORMANCE HISTORY TIMELINE ─── */
var HIST_KEY='violinV10_history';
function loadHistory(){try{return JSON.parse(localStorage.getItem(HIST_KEY)||'[]');}catch(e){return [];}}
function saveHistory(h){localStorage.setItem(HIST_KEY,JSON.stringify(h.slice(-50)));}
function addHistory(type,text){
  var hist=loadHistory();
  var now=new Date();
  hist.push({date:now.toLocaleDateString('ko-KR')+' '+now.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}),type:type,text:text});
  saveHistory(hist);
}

function createHistPanel(){
  var panel=document.createElement('div');panel.id='histPanel';
  panel.innerHTML='<span class="v10Close" id="histClose">&times;</span>'+
    '<h3>📜 연주 히스토리</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">연습 활동 타임라인</div>'+
    '<div class="histLine" id="histList"></div>';
  document.body.appendChild(panel);
  document.getElementById('histClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function renderHistory(){
  var container=document.getElementById('histList');if(!container)return;
  container.innerHTML='';
  var hist=loadHistory();
  if(hist.length===0){container.innerHTML='<div style="font-size:10px;color:rgba(201,169,110,.3);text-align:center;padding:20px;">아직 활동 기록이 없습니다.</div>';return;}
  var typeLabels={recording:'녹음',tempo:'템포',cross:'현이동',goal:'목표',tone:'음색',general:'연습',song:'곡',lesson:'레슨'};
  hist.slice().reverse().forEach(function(h){
    var entry=document.createElement('div');entry.className='histEntry';
    entry.innerHTML='<div class="histDate">'+h.date+'</div>'+
      '<div class="histText"><span class="histType">'+(typeLabels[h.type]||h.type)+'</span>'+h.text+'</div>';
    container.appendChild(entry);
  });
  var achs=loadAchievements();if(!achs.history_viewer)unlockAch('history_viewer');
}

/* ─── 15. BOW TRAJECTORY SIMULATOR ─── */
var bowSimState={active:false,anim:null,angle:0,speed:2,pressure:50};

function createBowSimPanel(){
  var panel=document.createElement('div');panel.id='bowSimPanel';
  panel.innerHTML='<span class="v10Close" id="bowSimClose">&times;</span>'+
    '<h3>🏹 보잉 궤적 시뮬레이터</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:4px;">이상적인 활 궤적을 시각화합니다</div>'+
    '<canvas id="bowSimCanvas" width="360" height="200"></canvas>'+
    '<div class="bowSimInfo">'+
    '<div class="bsCard"><div class="bsVal" id="bsAngle">0&deg;</div><div class="bsLbl">활 각도</div></div>'+
    '<div class="bsCard"><div class="bsVal" id="bsSpeed">2</div><div class="bsLbl">속도</div></div>'+
    '<div class="bsCard"><div class="bsVal" id="bsPressure">50%</div><div class="bsLbl">압력</div></div></div>'+
    '<div class="tempoCtrlRow"><label style="font-size:10px;color:rgba(201,169,110,.5);min-width:40px;">속도</label>'+
    '<input type="range" id="bowSimSpeedCtrl" min="1" max="5" value="2" style="flex:1;accent-color:#ffd700;">'+
    '</div>'+
    '<div class="tempoCtrlRow"><label style="font-size:10px;color:rgba(201,169,110,.5);min-width:40px;">압력</label>'+
    '<input type="range" id="bowSimPressCtrl" min="10" max="100" value="50" style="flex:1;accent-color:#ffd700;">'+
    '</div>'+
    '<div style="display:flex;gap:8px;margin:8px 0;">'+
    '<div class="recActBtn" id="bowSimStartBtn">▶ 시작</div>'+
    '<div class="recActBtn" id="bowSimStopBtn" style="display:none;">⏹ 정지</div></div>';
  document.body.appendChild(panel);
  document.getElementById('bowSimClose').addEventListener('pointerdown',function(e){e.preventDefault();stopBowSim();panel.classList.remove('show');});
  document.getElementById('bowSimSpeedCtrl').addEventListener('input',function(){
    bowSimState.speed=parseInt(this.value);document.getElementById('bsSpeed').textContent=this.value;
  });
  document.getElementById('bowSimPressCtrl').addEventListener('input',function(){
    bowSimState.pressure=parseInt(this.value);document.getElementById('bsPressure').textContent=this.value+'%';
  });
  document.getElementById('bowSimStartBtn').addEventListener('pointerdown',function(e){e.preventDefault();startBowSim();});
  document.getElementById('bowSimStopBtn').addEventListener('pointerdown',function(e){e.preventDefault();stopBowSim();});
}

function startBowSim(){
  bowSimState.active=true;bowSimState.angle=0;
  document.getElementById('bowSimStartBtn').style.display='none';
  document.getElementById('bowSimStopBtn').style.display='';
  var achs=loadAchievements();if(!achs.bow_sim_user)unlockAch('bow_sim_user');
  addHistory('general','보잉 궤적 시뮬레이터 사용');
  drawBowSim();
}

function stopBowSim(){
  bowSimState.active=false;
  if(bowSimState.anim){cancelAnimationFrame(bowSimState.anim);bowSimState.anim=null;}
  document.getElementById('bowSimStartBtn').style.display='';
  document.getElementById('bowSimStopBtn').style.display='none';
}

function drawBowSim(){
  if(!bowSimState.active)return;
  var cv=document.getElementById('bowSimCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);

  var strings=['G','D','A','E'];var cols=['#44ee44','#cc55ff','#44ddee','#ffdd33'];
  for(var i=0;i<4;i++){
    var y=50+i*35;
    ctx.strokeStyle=cols[i];ctx.globalAlpha=.2;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(W-30,y);ctx.stroke();
    ctx.globalAlpha=1;ctx.fillStyle=cols[i];ctx.font='10px Georgia';
    ctx.fillText(strings[i],10,y+4);
  }

  bowSimState.angle+=bowSimState.speed*0.02;
  var bowX=W/2+Math.sin(bowSimState.angle)*((W/2)-50);
  var bowWidth=4+bowSimState.pressure/25;
  var press=bowSimState.pressure/100;

  ctx.strokeStyle='rgba(255,215,0,'+(0.3+press*0.7)+')';
  ctx.lineWidth=bowWidth;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(bowX-2,40);ctx.lineTo(bowX+2,H-20);ctx.stroke();

  ctx.fillStyle='#ffd700';ctx.globalAlpha=.6;
  ctx.beginPath();ctx.arc(bowX,85,3,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;

  var deg=Math.round(Math.sin(bowSimState.angle)*15);
  document.getElementById('bsAngle').innerHTML=deg+'&deg;';

  bowSimState.anim=requestAnimationFrame(drawBowSim);
}

/* ─── 16. TONE PRESETS ─── */
var TONE_KEY='violinV10_tone';
function loadTonePreData(){try{return JSON.parse(localStorage.getItem(TONE_KEY)||'{}');}catch(e){return {};}}
function saveTonePreData(d){localStorage.setItem(TONE_KEY,JSON.stringify(d));}

var TONE_PRESETS=[
  {name:'클래식 워밍',desc:'따뜻하고 풍성한 클래식 바이올린 음색',tags:['따뜻한','풍성한','서정적'],harmonics:[1,.45,.2,.1,.05],vibRate:5,vibDepth:.02},
  {name:'모던 브라이트',desc:'밝고 선명한 현대적 음색',tags:['밝은','선명한','현대적'],harmonics:[1,.6,.35,.2,.12],vibRate:6,vibDepth:.015},
  {name:'바로크 에어리',desc:'가볍고 맑은 바로크 시대 음색',tags:['가벼운','맑은','투명한'],harmonics:[1,.3,.1,.03],vibRate:4,vibDepth:.01},
  {name:'로맨틱 딥',desc:'깊고 감성적인 낭만주의 음색',tags:['깊은','감성적','울림'],harmonics:[1,.5,.3,.18,.1,.06],vibRate:5.5,vibDepth:.03},
  {name:'솔로 파워',desc:'강력하고 투사적인 솔로 연주용 음색',tags:['강렬한','투사적','독주'],harmonics:[1,.55,.4,.25,.15,.08],vibRate:6.5,vibDepth:.025},
  {name:'챔버 소프트',desc:'부드럽고 조화로운 실내악용 음색',tags:['부드러운','조화로운','섬세한'],harmonics:[1,.35,.15,.06,.02],vibRate:4.5,vibDepth:.018}
];

var toneTriedSet=new Set();

function createTonePrePanel(){
  var panel=document.createElement('div');panel.id='tonePrePanel';
  panel.innerHTML='<span class="v10Close" id="tonePreClose">&times;</span>'+
    '<h3>🎨 음색 프리셋</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">바이올린 음색을 변경하세요</div>'+
    '<div id="tonePreList"></div>';
  document.body.appendChild(panel);
  document.getElementById('tonePreClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});

  var list=document.getElementById('tonePreList');
  TONE_PRESETS.forEach(function(preset,idx){
    var card=document.createElement('div');card.className='tonePreCard';
    var tagsHtml=preset.tags.map(function(t){return '<span class="tonePreTag">'+t+'</span>';}).join('');
    card.innerHTML='<div class="tonePreName">'+preset.name+'</div>'+
      '<div class="tonePreDesc">'+preset.desc+'</div>'+
      '<div class="tonePreTags">'+tagsHtml+'</div>';
    card.addEventListener('pointerdown',function(e){
      e.preventDefault();applyTonePreset(idx);
      list.querySelectorAll('.tonePreCard').forEach(function(c){c.classList.remove('active');});
      card.classList.add('active');
    });
    list.appendChild(card);
  });
}

function applyTonePreset(idx){
  var preset=TONE_PRESETS[idx];
  toneTriedSet.add(idx);
  if(typeof AE!=='undefined'){
    if(AE.setHarmonics)AE.setHarmonics(preset.harmonics);
    if(AE.setVibrato)AE.setVibrato(preset.vibDepth);
  }
  addHistory('tone','음색 프리셋 적용: '+preset.name);
  if(toneTriedSet.size>=3){var achs=loadAchievements();if(!achs.tone_explorer)unlockAch('tone_explorer');}
}

/* ─── 17. QUIZ v10 (15문항) ─── */
var V10_QUIZ=[
  {q:'바이올린의 4현을 낮은음부터 순서대로 나열하면?',a:['G-D-A-E','E-A-D-G','A-D-G-E','D-G-A-E'],c:0},
  {q:'피치카토(Pizzicato)는 어떤 주법인가?',a:['활로 긋기','손가락으로 튕기기','활 나무로 치기','지판 위 연주'],c:1},
  {q:'바이올린의 현침(Bridge) 역할은?',a:['음을 높이는 장치','현의 진동을 몸통에 전달','줄을 감는 장치','턱을 받치는 부품'],c:1},
  {q:'비브라토(Vibrato)의 올바른 설명은?',a:['활을 빠르게 왕복','손가락을 미세하게 흔들어 음에 떨림을 주는 기법','현을 세게 누르는 것','활 나무로 연주'],c:1},
  {q:'스피카토(Spiccato)는 어떤 활쓰기 기법인가?',a:['활을 느리게 긋기','활을 튀기듯이 현에서 떼며 연주','활을 세게 누르기','활을 돌려 연주'],c:1},
  {q:'바이올린의 활털은 무엇으로 만들어지나?',a:['나일론 실','말꼬리 털','강철 와이어','면 실'],c:1},
  {q:'송진(Rosin)을 활에 바르는 이유는?',a:['활을 보호하기 위해','음색을 바꾸기 위해','마찰력을 높이기 위해','활을 무겁게 하기 위해'],c:2},
  {q:'콘체르토(Concerto)에서 카덴차(Cadenza)란?',a:['오케스트라만 연주하는 부분','독주자의 자유로운 기교 부분','합창이 들어가는 부분','지휘자의 독백'],c:1},
  {q:'레가토(Legato)의 뜻은?',a:['짧게 끊어서','점점 크게','매끄럽게 이어서','점점 빠르게'],c:2},
  {q:'리타르단도(rit.)의 의미는?',a:['점점 세게','점점 빠르게','점점 느리게','처음 빠르기로'],c:2},
  {q:'바이올린 지판은 주로 어떤 나무로 만드나?',a:['단풍나무','가문비나무','흑단(에보니)','호두나무'],c:2},
  {q:'현악4중주의 구성은?',a:['바이올린4','바이올린2+비올라+첼로','바이올린+비올라+첼로+베이스','바이올린+플루트+첼로+피아노'],c:1},
  {q:'크레셴도의 기호는?',a:['&gt;','&lt;','p','ff'],c:1},
  {q:'바이올린의 표준 조율 주파수(A4)는?',a:['420Hz','440Hz','460Hz','400Hz'],c:1},
  {q:'술 폰티첼로(Sul Ponticello)는 어디에서 연주하나?',a:['지판 위','브릿지 가까이','현의 중간','스크롤 근처'],c:1}
];

function createQuizV10Panel(){
  var panel=document.createElement('div');panel.id='quizV10Panel';
  panel.innerHTML='<span class="v10Close" id="quizV10Close">&times;</span>'+
    '<h3>❓ 바이올린 퀴즈 v10</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px;">15문항 바이올린 지식 테스트</div>'+
    '<div id="quizV10Area" style="width:100%;max-width:360px;"></div>';
  document.body.appendChild(panel);
  document.getElementById('quizV10Close').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function startQuizV10(){
  var area=document.getElementById('quizV10Area');if(!area)return;
  var shuffled=V10_QUIZ.slice().sort(function(){return Math.random()-.5;});
  var state={idx:0,correct:0,total:shuffled.length};

  function showQ(){
    if(state.idx>=state.total){
      var pct=Math.round(state.correct/state.total*100);
      var grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
      area.innerHTML='<div style="text-align:center;padding:20px;">'+
        '<div style="font-size:36px;color:#ffd700;font-weight:900;">'+grade+'</div>'+
        '<div style="font-size:14px;color:#ffd700;margin:8px 0;">'+state.correct+' / '+state.total+' 정답 ('+pct+'%)</div>'+
        '<div class="recActBtn" id="quizV10Retry">다시 도전</div></div>';
      document.getElementById('quizV10Retry').addEventListener('pointerdown',function(e){e.preventDefault();startQuizV10();});
      addHistory('general','퀴즈 v10 완료: '+grade+'등급 ('+pct+'%)');
      return;
    }
    var q=shuffled[state.idx];
    var html='<div style="font-size:10px;color:rgba(201,169,110,.3);margin-bottom:4px;">문제 '+(state.idx+1)+'/'+state.total+'</div>'+
      '<div style="font-size:12px;color:#ffd700;margin-bottom:10px;line-height:1.5;">'+q.q+'</div>';
    q.a.forEach(function(opt,oi){
      html+='<div class="crossDrill" data-ans="'+oi+'" style="margin:3px 0;"><div class="crossDesc" style="font-size:11px;color:rgba(240,230,200,.7);">'+(oi+1)+'. '+opt+'</div></div>';
    });
    area.innerHTML=html;
    area.querySelectorAll('[data-ans]').forEach(function(btn){
      btn.addEventListener('pointerdown',function(e){
        e.preventDefault();
        var ans=parseInt(btn.dataset.ans);
        if(ans===q.c){state.correct++;btn.style.borderColor='#44ee44';btn.style.background='rgba(68,238,68,.1)';}
        else{btn.style.borderColor='#ff4444';btn.style.background='rgba(255,68,68,.1)';
          var correct=area.querySelector('[data-ans="'+q.c+'"]');if(correct){correct.style.borderColor='#44ee44';correct.style.background='rgba(68,238,68,.1)';}}
        setTimeout(function(){state.idx++;showQ();},800);
      });
    });
  }
  showQ();
}

/* ─── 18. UI INTEGRATION ─── */
(function integrateUI(){
  createRecPanel();createTempoPanel();createCrossPanel();createDictPanel();
  createGoalPanel();createRecoPanel();createHistPanel();createBowSimPanel();
  createTonePrePanel();createQuizV10Panel();

  var hdBtns=document.getElementById('hdBtns');if(!hdBtns)return;

  var btns=[
    {title:'녹음 (Shift+R)',text:'🎙',action:function(){renderRecordings();document.getElementById('recPanel').classList.add('show');}},
    {title:'템포빌더 (Shift+P)',text:'⏱',action:function(){document.getElementById('tempoPanel').classList.add('show');}},
    {title:'현이동 (Shift+X)',text:'🎯',action:function(){drawCrossCanvas();document.getElementById('crossPanel').classList.add('show');}},
    {title:'용어사전 (Shift+K)',text:'📖',action:function(){v10Sfx('dict_open');document.getElementById('dictPanel').classList.add('show');}},
    {title:'목표 (Shift+O)',text:'🏅',action:function(){renderGoals();document.getElementById('goalPanel').classList.add('show');}},
    {title:'추천 (Shift+L)',text:'💡',action:function(){renderRecommendations();document.getElementById('recoPanel').classList.add('show');}},
    {title:'히스토리 (Shift+H)',text:'📜',action:function(){renderHistory();document.getElementById('histPanel').classList.add('show');}},
    {title:'보잉시뮬 (Shift+N)',text:'🏹',action:function(){document.getElementById('bowSimPanel').classList.add('show');}},
    {title:'음색 (Shift+Y)',text:'🎨',action:function(){document.getElementById('tonePrePanel').classList.add('show');}},
    {title:'퀴즈v10 (Shift+Q)',text:'❓',action:function(){startQuizV10();document.getElementById('quizV10Panel').classList.add('show');}}
  ];

  btns.forEach(function(b){
    var el=document.createElement('div');el.className='v6Btn';el.title=b.title;el.textContent=b.text;
    el.setAttribute('role','button');el.setAttribute('tabindex','0');
    hdBtns.insertBefore(el,hdBtns.firstChild);
    el.addEventListener('pointerdown',function(e){e.preventDefault();b.action();});
  });

  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    if(!e.shiftKey)return;
    switch(e.key){
      case'R':renderRecordings();document.getElementById('recPanel').classList.add('show');break;
      case'P':document.getElementById('tempoPanel').classList.add('show');break;
      case'X':drawCrossCanvas();document.getElementById('crossPanel').classList.add('show');break;
      case'K':v10Sfx('dict_open');document.getElementById('dictPanel').classList.add('show');break;
      case'O':renderGoals();document.getElementById('goalPanel').classList.add('show');break;
      case'L':renderRecommendations();document.getElementById('recoPanel').classList.add('show');break;
      case'H':renderHistory();document.getElementById('histPanel').classList.add('show');break;
      case'N':document.getElementById('bowSimPanel').classList.add('show');break;
      case'Y':document.getElementById('tonePrePanel').classList.add('show');break;
      case'Q':startQuizV10();document.getElementById('quizV10Panel').classList.add('show');break;
    }
    if(e.key==='Escape'){
      document.querySelectorAll('#recPanel,#tempoPanel,#crossPanel,#dictPanel,#goalPanel,#recoPanel,#histPanel,#bowSimPanel,#tonePrePanel,#quizV10Panel').forEach(function(p){p.classList.remove('show');});
      stopTempo();stopBowSim();if(recState.active)stopRecording();
    }
  });

  var titleEl=document.querySelector('#hd h1');
  if(titleEl)titleEl.innerHTML='🎻 Violin Real <span style="font-size:8px;color:#ff6644;vertical-align:super">v10</span>';
  var logoEl=document.getElementById('logo');
  if(logoEl)logoEl.textContent='Violin Real v10';
})();

window.VIOLIN_VERSION='10.0';
})();
