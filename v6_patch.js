/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v6.0 PATCH MODULE
   녹음+연주기록+튜너+비주얼메트로놈+드론+템포조절+8곡+10레슨+8업적+접근성+버그픽스
   ═══════════════════════════════════════════════════════════ */
(function V6Patch(){'use strict';

/* ─── 1. CSS INJECTION ─── */
const sty=document.createElement('style');
sty.textContent=`
#hd h1::after{content:' → v6';font-size:8px;color:#ffd700;opacity:.6;}
.v6Btn{display:inline-flex;align-items:center;justify-content:center;
  width:22px;height:22px;font-size:12px;border-radius:6px;cursor:pointer;
  background:rgba(255,255,255,.06);border:1px solid rgba(255,215,0,.15);
  color:rgba(201,169,110,.7);transition:all .15s;}
.v6Btn:active,.v6Btn.on{color:#ffd700;background:rgba(255,215,0,.15);border-color:rgba(255,215,0,.4);}

/* Recording Panel */
#recPanel{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.92);
  flex-direction:column;align-items:center;justify-content:center;padding:20px;color:#c9a96e;}
#recPanel.show{display:flex;}
#recPanel h3{font-size:16px;color:#ffd700;margin-bottom:12px;}
.recCircle{width:80px;height:80px;border-radius:50%;border:3px solid #ff4444;
  display:flex;align-items:center;justify-content:center;font-size:32px;
  cursor:pointer;transition:all .3s;margin:10px 0;}
.recCircle.recording{animation:recPulse 1s infinite;background:rgba(255,68,68,.2);}
@keyframes recPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,68,68,.4)}50%{box-shadow:0 0 0 20px rgba(255,68,68,0)}}
.recTime{font-size:24px;color:#ff6644;font-weight:bold;font-variant-numeric:tabular-nums;}
#recList{width:100%;max-height:40vh;overflow-y:auto;margin-top:16px;}
.recItem{display:flex;align-items:center;gap:8px;padding:8px;margin:4px 0;
  background:rgba(255,255,255,.05);border-radius:8px;font-size:12px;}
.recItem button{background:rgba(255,215,0,.15);border:1px solid rgba(255,215,0,.3);
  color:#ffd700;border-radius:6px;padding:3px 10px;font-size:11px;cursor:pointer;}
.recClose{position:absolute;top:12px;right:16px;font-size:20px;color:#c9a96e;cursor:pointer;}

/* History Panel */
#histPanel{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.92);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#histPanel.show{display:flex;}
#histPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
#histChart{width:100%;max-width:360px;height:160px;background:rgba(255,255,255,.03);
  border-radius:8px;border:1px solid rgba(255,215,0,.1);margin:8px 0;}
#histList{width:100%;max-width:360px;max-height:45vh;overflow-y:auto;}
.histItem{display:flex;justify-content:space-between;padding:6px 8px;
  border-bottom:1px solid rgba(255,255,255,.06);font-size:11px;}
.histItem .hDate{color:rgba(201,169,110,.5);}
.histItem .hSong{color:#c9a96e;flex:1;margin:0 8px;}
.histItem .hScore{color:#ffd700;font-weight:bold;}
.histItem .hStars{color:#ff6644;}

/* Drone Panel */
#dronePanel{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.92);
  flex-direction:column;align-items:center;justify-content:center;padding:20px;color:#c9a96e;}
#dronePanel.show{display:flex;}
#dronePanel h3{font-size:16px;color:#ffd700;margin-bottom:16px;}
.droneRow{display:flex;gap:12px;margin:8px 0;flex-wrap:wrap;justify-content:center;}
.droneBtn{width:64px;height:64px;border-radius:50%;border:2px solid;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  font-size:13px;font-weight:bold;cursor:pointer;transition:all .2s;background:rgba(0,0,0,.3);}
.droneBtn.active{transform:scale(1.1);}
.droneBtn[data-s="0"]{border-color:#44ee44;color:#44ee44;}
.droneBtn[data-s="1"]{border-color:#cc55ff;color:#cc55ff;}
.droneBtn[data-s="2"]{border-color:#44ddee;color:#44ddee;}
.droneBtn[data-s="3"]{border-color:#ffdd33;color:#ffdd33;}
.droneBtn.active[data-s="0"]{background:rgba(68,238,68,.15);box-shadow:0 0 20px rgba(68,238,68,.3);}
.droneBtn.active[data-s="1"]{background:rgba(204,85,255,.15);box-shadow:0 0 20px rgba(204,85,255,.3);}
.droneBtn.active[data-s="2"]{background:rgba(68,221,238,.15);box-shadow:0 0 20px rgba(68,221,238,.3);}
.droneBtn.active[data-s="3"]{background:rgba(255,221,51,.15);box-shadow:0 0 20px rgba(255,221,51,.3);}

/* Tuner Panel */
#tunerPanel{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.92);
  flex-direction:column;align-items:center;justify-content:center;padding:20px;color:#c9a96e;}
#tunerPanel.show{display:flex;}
#tunerPanel h3{font-size:16px;color:#ffd700;margin-bottom:12px;}
#tunerNote{font-size:48px;color:#ffd700;font-weight:900;margin:8px 0;}
#tunerFreq{font-size:14px;color:rgba(201,169,110,.6);}
#tunerMeter{width:240px;height:24px;background:rgba(255,255,255,.05);border-radius:12px;
  margin:12px 0;position:relative;overflow:hidden;border:1px solid rgba(255,215,0,.15);}
#tunerNeedle{position:absolute;top:2px;bottom:2px;width:4px;background:#ffd700;
  border-radius:2px;left:50%;transform:translateX(-50%);transition:left .1s;}
#tunerCenter{position:absolute;top:0;bottom:0;left:50%;width:2px;background:rgba(68,238,68,.4);}
.tunerRefBtns{display:flex;gap:8px;margin:16px 0;}
.tunerRefBtn{padding:6px 16px;border:1px solid;border-radius:8px;cursor:pointer;
  font-size:12px;font-weight:bold;transition:all .15s;background:rgba(0,0,0,.3);}
.tunerRefBtn[data-s="0"]{border-color:#44ee44;color:#44ee44;}
.tunerRefBtn[data-s="1"]{border-color:#cc55ff;color:#cc55ff;}
.tunerRefBtn[data-s="2"]{border-color:#44ddee;color:#44ddee;}
.tunerRefBtn[data-s="3"]{border-color:#ffdd33;color:#ffdd33;}

/* Visual Metronome */
#metroVisual{display:none;position:fixed;bottom:60px;right:8px;z-index:180;
  width:60px;height:100px;pointer-events:none;}
#metroVisual.show{display:block;}
#metroPend{width:2px;height:60px;background:linear-gradient(to bottom,#ffd700,rgba(255,215,0,.3));
  position:absolute;bottom:20px;left:50%;transform-origin:bottom center;
  transform:translateX(-50%) rotate(0deg);border-radius:1px;}
#metroPend.tick{animation:pendSwing var(--beat-dur,.5s) ease-in-out infinite alternate;}
@keyframes pendSwing{0%{transform:translateX(-50%) rotate(-25deg)}100%{transform:translateX(-50%) rotate(25deg)}}
#metroBeat{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);
  font-size:10px;color:#ffd700;font-weight:bold;}
#metroDot{position:absolute;top:0;left:50%;transform:translateX(-50%);
  width:8px;height:8px;border-radius:50%;background:#ffd700;}

/* Tempo Slider */
#tempoWrap{display:none;position:absolute;bottom:50px;left:8px;right:8px;z-index:90;
  background:rgba(0,0,0,.7);border-radius:8px;padding:6px 10px;
  border:1px solid rgba(255,215,0,.15);}
#tempoWrap.show{display:flex;align-items:center;gap:8px;}
#tempoSlider{flex:1;accent-color:#ffd700;height:4px;}
#tempoLabel{font-size:11px;color:#ffd700;min-width:50px;text-align:right;}

/* Accessibility */
#skipLink{position:absolute;top:-40px;left:0;background:#ffd700;color:#000;
  padding:4px 12px;z-index:999;font-size:12px;text-decoration:none;font-weight:bold;}
#skipLink:focus{top:0;}
[role="button"]{cursor:pointer;}

/* Category badges */
.catBadge{display:inline-block;font-size:8px;padding:1px 4px;border-radius:3px;
  margin-left:4px;opacity:.7;font-weight:bold;}

/* Perf optimize: reduce particle allocations */
.confPart{will-change:transform,opacity;}
`;
document.head.appendChild(sty);

/* ─── 2. BUG FIXES ─── */
(function fixBugs(){
  var origCheck=window.checkAchievements;
  window.checkAchievements=function(){
    var p=loadProgress();
    var achs=loadAchievements();
    var stats=loadStats();
    if(stats.totalNotes>0&&!achs.first_note)unlockAch('first_note');
    var lessonsDone=0;
    for(var i=1;i<=60;i++){if(p['lesson_'+i])lessonsDone++;}
    if(lessonsDone>=5&&!achs.lesson_5)unlockAch('lesson_5');
    if(lessonsDone>=15&&!achs.lesson_15)unlockAch('lesson_15');
    if(lessonsDone>=30&&!achs.lesson_30)unlockAch('lesson_30');
    if(lessonsDone>=50&&!achs.all_clear)unlockAch('all_clear');
    if(lessonsDone>=50&&!achs.lesson_50)unlockAch('lesson_50');
    if(lessonsDone>=60&&!achs.lesson_60)unlockAch('lesson_60');
    if(stats.bestCombo>=10&&!achs.combo_10)unlockAch('combo_10');
    if(stats.bestCombo>=30&&!achs.combo_30)unlockAch('combo_30');
    if(stats.bestCombo>=50&&!achs.combo_50)unlockAch('combo_50');
    if(stats.totalPerfects>=50&&!achs.perfect_50)unlockAch('perfect_50');
    var has3star=false,songsDone=0;
    var songSet=new Set();
    Object.keys(p).forEach(function(k){
      if(k.startsWith('rhythm_stars_')&&p[k]>=3)has3star=true;
      if(k.startsWith('perform_stars_')&&p[k]>=3)has3star=true;
      if(k.startsWith('rhythm_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^rhythm_/,''));
      if(k.startsWith('perform_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^perform_/,''));
    });
    songsDone=songSet.size;
    if(has3star&&!achs.stars_3)unlockAch('stars_3');
    if(songsDone>=5&&!achs.songs_5)unlockAch('songs_5');
    if(songsDone>=10&&!achs.songs_10)unlockAch('songs_10');
    if(songsDone>=20&&!achs.songs_20)unlockAch('songs_20');
    var streak=loadStreak();
    if(streak.current>=3&&!achs.streak_3)unlockAch('streak_3');
    if(streak.current>=7&&!achs.streak_7)unlockAch('streak_7');
    if(streak.current>=30&&!achs.streak_30)unlockAch('streak_30');
    if((stats.totalPizz||0)>=50&&!achs.pizz_50)unlockAch('pizz_50');
    if((stats.totalDrone||0)>=10&&!achs.drone_practice)unlockAch('drone_practice');
    var today=new Date().toISOString().slice(0,10);
    var allWarmup=true;
    for(var w=0;w<5;w++){if(!p['warmup_'+w+'_'+today]){allWarmup=false;break;}}
    if(allWarmup&&!achs.warmup_all)unlockAch('warmup_all');
  };

  var origFinish=window.finishRhythm;
  if(origFinish){
    window.finishRhythm=function(){
      var rs=window.rhythmState;
      origFinish.apply(this,arguments);
      if(rs&&rs.miss===0&&rs.good===0&&rs.ok===0&&rs.perfect>0){
        var achs=loadAchievements();
        if(!achs.all_perfect)unlockAch('all_perfect');
      }
      if(rs){
        var score=rs.score||0;
        var stars=score>=rs.notes.length*90?3:score>=rs.notes.length*60?2:1;
        addHistory('rhythm',rs.songKey||'unknown',score,stars);
      }
    };
  }

  var toast=document.getElementById('toast');
  if(toast&&toast.hasAttribute('id')){
    toast.removeAttribute('id');
    toast.id='toast';
  }
})();

/* ─── 3. NEW SONGS (8곡, 총 34곡) ─── */
(function addSongs(){
  SONGS['그린슬리브스']={name:'그린슬리브스',category:'서양민요',difficulty:'medium',bpm:100,
    notes:[
      {note:'A4',dur:1,s:2,f:0},{note:'C5',dur:1.5,s:2,f:3},{note:'D5',dur:.5,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'B4',dur:1,s:2,f:2},
      {note:'G4',dur:.5,s:1,f:5},{note:'A4',dur:.5,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:1,s:2,f:3},{note:'A4',dur:1,s:2,f:0},
      {note:'A4',dur:.5,s:2,f:0},{note:'G#4',dur:.5,s:1,f:6},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'G#4',dur:1,s:1,f:6},
      {note:'E4',dur:2,s:1,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'C5',dur:1.5,s:2,f:3},{note:'D5',dur:.5,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'B4',dur:1,s:2,f:2},
      {note:'G4',dur:.5,s:1,f:5},{note:'A4',dur:.5,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'G#4',dur:1,s:1,f:6},{note:'A4',dur:2,s:2,f:0}
    ]};
  SONGS['반달']={name:'반달',category:'민요',difficulty:'easy',bpm:80,
    notes:[
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},{note:'E4',dur:1,s:1,f:2},
      {note:'D4',dur:2,s:1,f:0},{note:'R',dur:1,s:-1,f:0},
      {note:'E4',dur:1,s:1,f:2},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'E4',dur:2,s:1,f:2},{note:'D4',dur:2,s:1,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:2,s:2,f:0},{note:'G4',dur:2,s:1,f:5},
      {note:'E4',dur:1,s:1,f:2},{note:'G4',dur:1,s:1,f:5},{note:'D4',dur:1,s:1,f:0},{note:'E4',dur:1,s:1,f:2},
      {note:'G4',dur:2,s:1,f:5},{note:'R',dur:2,s:-1,f:0}
    ]};
  SONGS['헝가리무곡5']={name:'헝가리 무곡 5번',category:'클래식',difficulty:'hard',bpm:140,
    notes:[
      {note:'F#5',dur:.5,s:3,f:2},{note:'G5',dur:.5,s:3,f:3},{note:'A5',dur:.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},
      {note:'F#5',dur:.5,s:3,f:2},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:.5,s:3,f:0},{note:'F#5',dur:.5,s:3,f:2},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C#5',dur:.5,s:2,f:4},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'F#5',dur:.5,s:3,f:2},{note:'G5',dur:.5,s:3,f:3},{note:'A5',dur:.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},
      {note:'F#5',dur:.5,s:3,f:2},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:.5,s:3,f:0},{note:'F#5',dur:.5,s:3,f:2},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C#5',dur:.5,s:2,f:4},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'A5',dur:.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},{note:'F#5',dur:.5,s:3,f:2},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'F#5',dur:.5,s:3,f:2},{note:'D5',dur:.5,s:2,f:5},
      {note:'A4',dur:1,s:2,f:0},{note:'D5',dur:2,s:2,f:5}
    ]};
  SONGS['사랑의인사']={name:'사랑의 인사 (엘가)',category:'클래식',difficulty:'medium',bpm:72,
    notes:[
      {note:'E5',dur:2,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},
      {note:'F#5',dur:1,s:3,f:2},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C#5',dur:.5,s:2,f:4},
      {note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'E5',dur:2,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},
      {note:'G5',dur:1,s:3,f:3},{note:'F#5',dur:1,s:3,f:2},
      {note:'E5',dur:1.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C#5',dur:1,s:2,f:4},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:2,s:3,f:0},{note:'A5',dur:1,s:3,f:5},
      {note:'G5',dur:1,s:3,f:3},{note:'F#5',dur:1,s:3,f:2},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C#5',dur:.5,s:2,f:4},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:2,s:2,f:0}
    ]};
  SONGS['포르우나카베사']={name:'포르 우나 카베사',category:'탱고',difficulty:'hard',bpm:130,
    notes:[
      {note:'A4',dur:1,s:2,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:.5,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C#5',dur:1,s:2,f:4},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:.5,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},{note:'G5',dur:.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C#5',dur:.5,s:2,f:4},
      {note:'D5',dur:1,s:2,f:5},{note:'A5',dur:1,s:3,f:5},
      {note:'G5',dur:.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C#5',dur:.5,s:2,f:4},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'A5',dur:.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:.5,s:2,f:5},{note:'C#5',dur:.5,s:2,f:4},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},
      {note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:2,s:2,f:5}
    ]};
  SONGS['시간의강']={name:'River Flows in You',category:'뉴에이지',difficulty:'medium',bpm:68,
    notes:[
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},
      {note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'E5',dur:1.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:1.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},
      {note:'A4',dur:2,s:2,f:0},
      {note:'E5',dur:1,s:3,f:0},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'G5',dur:1,s:3,f:3},
      {note:'A5',dur:1.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1,s:2,f:2},{note:'A4',dur:2,s:2,f:0}
    ]};
  SONGS['할렐루야']={name:'할렐루야 (코헨)',category:'팝',difficulty:'medium',bpm:76,
    notes:[
      {note:'C5',dur:1,s:2,f:3},{note:'E5',dur:.5,s:3,f:0},{note:'E5',dur:.5,s:3,f:0},
      {note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},
      {note:'F5',dur:.5,s:3,f:1},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:2,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'E5',dur:.5,s:3,f:0},{note:'E5',dur:.5,s:3,f:0},
      {note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},
      {note:'F5',dur:.5,s:3,f:1},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:2,s:2,f:5},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'F5',dur:1,s:3,f:1},{note:'F5',dur:1,s:3,f:1},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},
      {note:'C5',dur:2,s:2,f:3},{note:'R',dur:1,s:-1,f:0}
    ]};
  SONGS['사랑의슬픔']={name:'사랑의 슬픔 (크라이슬러)',category:'클래식',difficulty:'hard',bpm:110,
    notes:[
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'B4',dur:.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'G#4',dur:.5,s:1,f:6},{note:'A4',dur:.5,s:2,f:0},
      {note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},
      {note:'G#4',dur:.5,s:1,f:6},{note:'A4',dur:.5,s:2,f:0},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:.5,s:2,f:3},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'E5',dur:1,s:3,f:0},{note:'A4',dur:2,s:2,f:0}
    ]};

  if(typeof CHORDS!=='undefined'){
    CHORDS['그린슬리브스']=[[440,523.25,659.25],[329.63,440,523.25]];
    CHORDS['반달']=[[329.63,392,493.88],[261.63,329.63,392]];
    CHORDS['헝가리무곡5']=[[293.66,369.99,440],[440,554.37,659.25]];
    CHORDS['사랑의인사']=[[440,554.37,659.25],[329.63,440,523.25]];
    CHORDS['포르우나카베사']=[[293.66,369.99,440],[440,523.25,659.25]];
    CHORDS['시간의강']=[[440,523.25,659.25],[329.63,440,523.25]];
    CHORDS['할렐루야']=[[261.63,329.63,392],[349.23,440,523.25]];
    CHORDS['사랑의슬픔']=[[440,523.25,659.25],[329.63,392,493.88]];
  }
})();

/* ─── 4. NEW LESSONS (51-60) ─── */
(function addLessons(){
  LESSONS.push({lv:51,title:'스타카토 G현',desc:'G현에서 짧고 끊어치기 연습',targets:[{s:0,f:0,count:2},{s:0,f:2,count:2},{s:0,f:4,count:2},{s:0,f:5,count:2}]});
  LESSONS.push({lv:52,title:'스타카토 D현',desc:'D현에서 짧고 끊어치기 연습',targets:[{s:1,f:0,count:2},{s:1,f:2,count:2},{s:1,f:4,count:2},{s:1,f:5,count:2}]});
  LESSONS.push({lv:53,title:'스타카토 A/E현',desc:'A현과 E현을 번갈아 끊어치기',targets:[{s:2,f:0,count:2},{s:3,f:0,count:2},{s:2,f:3,count:2},{s:3,f:3,count:2}]});
  LESSONS.push({lv:54,title:'레가토 현전환',desc:'G-D-A-E를 부드럽게 이어서',targets:[{s:0,f:0,count:1},{s:0,f:5,count:1},{s:1,f:0,count:1},{s:1,f:5,count:1},{s:2,f:0,count:1},{s:2,f:5,count:1},{s:3,f:0,count:1}]});
  LESSONS.push({lv:55,title:'포지션 이동',desc:'1번-3번-5번 포지션 전환',targets:[{s:2,f:1,count:1},{s:2,f:3,count:1},{s:2,f:5,count:1},{s:2,f:3,count:1},{s:2,f:1,count:1}]});
  LESSONS.push({lv:56,title:'트릴 D현',desc:'D현에서 1번-2번 빠르게 교대',targets:[{s:1,f:1,count:1},{s:1,f:2,count:1},{s:1,f:1,count:1},{s:1,f:2,count:1},{s:1,f:1,count:1},{s:1,f:2,count:1},{s:1,f:1,count:1},{s:1,f:2,count:1}]});
  LESSONS.push({lv:57,title:'트릴 A현',desc:'A현에서 2번-3번 빠르게 교대',targets:[{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1}]});
  LESSONS.push({lv:58,title:'E 장음계',desc:'E-F#-G#-A-B를 순서대로',targets:[{s:3,f:0,count:1},{s:3,f:2,count:1},{s:3,f:4,count:1},{s:3,f:5,count:1},{s:3,f:7,count:1}]});
  LESSONS.push({lv:59,title:'그린슬리브스 (주제)',desc:'라-도-레-미-파-미를 연주하세요',targets:[{s:2,f:0,count:1},{s:2,f:3,count:1},{s:2,f:5,count:1},{s:3,f:0,count:1},{s:3,f:1,count:1},{s:3,f:0,count:1}]});
  LESSONS.push({lv:60,title:'v6 졸업 시험',desc:'4현 전체 0-2-4-5-7 완주',targets:[
    {s:0,f:0,count:1},{s:0,f:2,count:1},{s:0,f:4,count:1},{s:0,f:5,count:1},{s:0,f:7,count:1},
    {s:1,f:0,count:1},{s:1,f:2,count:1},{s:1,f:4,count:1},{s:1,f:5,count:1},{s:1,f:7,count:1},
    {s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:4,count:1},{s:2,f:5,count:1},{s:2,f:7,count:1},
    {s:3,f:0,count:1},{s:3,f:2,count:1},{s:3,f:4,count:1},{s:3,f:5,count:1},{s:3,f:7,count:1}
  ]});
})();

/* ─── 5. NEW ACHIEVEMENTS (8) ─── */
(function addAchievements(){
  ACHIEVEMENTS.push(
    {id:'combo_50',name:'콤보 마스터',desc:'리듬게임에서 50 콤보를 달성했습니다',icon:'🔥'},
    {id:'songs_20',name:'연주 컬렉션',desc:'20개 곡을 완주했습니다',icon:'🎼'},
    {id:'lesson_60',name:'그랜드 마스터',desc:'60개 레슨을 모두 완료했습니다',icon:'🏆'},
    {id:'recorder_first',name:'첫 녹음',desc:'처음으로 연주를 녹음했습니다',icon:'🎤'},
    {id:'drone_practice',name:'드론 연습가',desc:'드론 모드를 10회 사용했습니다',icon:'🎵'},
    {id:'warmup_all',name:'워밍업 달인',desc:'하루에 5가지 워밍업을 모두 완료했습니다',icon:'💪'},
    {id:'streak_30',name:'한달 연습',desc:'30일 연속으로 연습했습니다',icon:'🏅'},
    {id:'tempo_master',name:'템포 마스터',desc:'느린 연습 모드를 사용했습니다',icon:'⏱'}
  );
})();

/* ─── 6. PATCH STATS DISPLAY ─── */
(function patchStatsPanel(){
  var origUpdateStats=window.updateStatsPanel;
  window.updateStatsPanel=function(){
    origUpdateStats();
    var el=document.getElementById('statAch');
    if(el){var achs=loadAchievements();el.textContent=Object.keys(achs).length+'/24';}
    var lesEl=document.getElementById('statLessons');
    if(lesEl){var p=loadProgress();var done=0;for(var i=1;i<=60;i++){if(p['lesson_'+i])done++;}lesEl.textContent=done+'/60';}
  };
})();

/* ─── 7. PERFORMANCE HISTORY ─── */
var V6_HISTORY_KEY='violinV6_history';
function loadHistory(){try{return JSON.parse(localStorage.getItem(V6_HISTORY_KEY)||'[]');}catch(e){return[];}}
function addHistory(mode,song,score,stars){
  var h=loadHistory();h.push({date:new Date().toISOString(),mode:mode,song:song,score:score,stars:stars});
  if(h.length>100)h.splice(0,h.length-100);localStorage.setItem(V6_HISTORY_KEY,JSON.stringify(h));
}
function createHistoryPanel(){
  var panel=document.createElement('div');panel.id='histPanel';
  panel.innerHTML='<span class="recClose" id="histClose">&times;</span><h3>연주 기록</h3><canvas id="histChart" width="360" height="160"></canvas><div id="histList"></div>';
  document.body.appendChild(panel);
  document.getElementById('histClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}
function showHistory(){
  var panel=document.getElementById('histPanel');var h=loadHistory();var list=document.getElementById('histList');list.innerHTML='';
  var recent=h.slice(-20).reverse();
  if(recent.length===0){list.innerHTML='<div style="text-align:center;padding:20px;color:rgba(201,169,110,.4)">아직 연주 기록이 없습니다</div>';}
  recent.forEach(function(r){var d=new Date(r.date);var dateStr=(d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours()+':'+String(d.getMinutes()).padStart(2,'0');
    var songName=SONGS[r.song]?SONGS[r.song].name:r.song;var stars='★'.repeat(r.stars||0)+'☆'.repeat(3-(r.stars||0));
    var div=document.createElement('div');div.className='histItem';
    div.innerHTML='<span class="hDate">'+dateStr+'</span><span class="hSong">'+songName+'</span><span class="hScore">'+r.score+'</span><span class="hStars">'+stars+'</span>';
    list.appendChild(div);
  });
  var cv=document.getElementById('histChart');var ctx=cv.getContext('2d');var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
  if(h.length<2){panel.classList.add('show');return;}
  var scores=h.slice(-30).map(function(r){return r.score;});var maxS=Math.max.apply(null,scores.concat([1]));
  ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=1;
  for(var i=0;i<4;i++){var y=H*.1+i*(H*.8/3);ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(W-10,y);ctx.stroke();}
  ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.beginPath();
  scores.forEach(function(s,i){var x=20+i*((W-30)/(scores.length-1));var yy=H*.9-s/maxS*(H*.8);i===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);});
  ctx.stroke();
  scores.forEach(function(s,i){var x=20+i*((W-30)/(scores.length-1));var yy=H*.9-s/maxS*(H*.8);ctx.fillStyle='#ffd700';ctx.beginPath();ctx.arc(x,yy,3,0,Math.PI*2);ctx.fill();});
  panel.classList.add('show');
}

/* ─── 8. RECORDING SYSTEM ─── */
var recorder=null,recChunks=[],recStartTime=0,recTimerID=0,recordings=[];
function createRecPanel(){
  var panel=document.createElement('div');panel.id='recPanel';
  panel.innerHTML='<span class="recClose" id="recClose">&times;</span><h3>녹음</h3><div class="recTime" id="recTime">0:00</div><div class="recCircle" id="recCircle">🎤</div><div style="font-size:11px;color:rgba(201,169,110,.5);margin:4px 0" id="recStatus">터치하여 녹음 시작</div><div id="recList"></div>';
  document.body.appendChild(panel);
  document.getElementById('recClose').addEventListener('pointerdown',function(e){e.preventDefault();if(recorder&&recorder.state==='recording')stopRecording();panel.classList.remove('show');});
  document.getElementById('recCircle').addEventListener('pointerdown',function(e){e.preventDefault();if(recorder&&recorder.state==='recording'){stopRecording();}else{startRecording();}});
}
function startRecording(){ensureA();try{var ctx=AE.getCtx();var dest=ctx.createMediaStreamDestination();AE.getMaster().connect(dest);
  recorder=new MediaRecorder(dest.stream,{mimeType:'audio/webm;codecs=opus'});recChunks=[];
  recorder.ondataavailable=function(e){if(e.data.size>0)recChunks.push(e.data);};
  recorder.onstop=function(){var blob=new Blob(recChunks,{type:'audio/webm'});var url=URL.createObjectURL(blob);
    var dur=Math.floor((Date.now()-recStartTime)/1000);recordings.push({url:url,dur:dur,date:new Date().toISOString()});renderRecList();
    var cnt=parseInt(localStorage.getItem('violinV6_rec_count')||'0');cnt++;localStorage.setItem('violinV6_rec_count',String(cnt));
    if(cnt===1){var achs=loadAchievements();if(!achs.recorder_first)unlockAch('recorder_first');}};
  recorder.start(500);recStartTime=Date.now();document.getElementById('recCircle').classList.add('recording');
  document.getElementById('recStatus').textContent='녹음 중...';
  recTimerID=setInterval(function(){var sec=Math.floor((Date.now()-recStartTime)/1000);document.getElementById('recTime').textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');},500);
  }catch(e){showToast('녹음을 시작할 수 없습니다');}}
function stopRecording(){if(recorder&&recorder.state==='recording'){recorder.stop();clearInterval(recTimerID);document.getElementById('recCircle').classList.remove('recording');document.getElementById('recStatus').textContent='녹음 완료!';showToast('녹음 저장됨');}}
function renderRecList(){var list=document.getElementById('recList');if(!list)return;list.innerHTML='';
  recordings.slice(-5).reverse().forEach(function(r){var d=new Date(r.date);var item=document.createElement('div');item.className='recItem';
    item.innerHTML='<span style="flex:1">'+(d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours()+':'+String(d.getMinutes()).padStart(2,'0')+' ('+Math.floor(r.dur/60)+':'+String(r.dur%60).padStart(2,'0')+')</span>';
    var playBtn=document.createElement('button');playBtn.textContent='재생';
    playBtn.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();var audio=new Audio(r.url);audio.play();playBtn.textContent='재생 중';audio.onended=function(){playBtn.textContent='재생';};});
    item.appendChild(playBtn);list.appendChild(item);});}

/* ─── 9. TUNER ─── */
var tunerStream=null,tunerAnalyser=null,tunerAnimID=0;
var NOTE_NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
function createTunerPanel(){var panel=document.createElement('div');panel.id='tunerPanel';
  panel.innerHTML='<span class="recClose" id="tunerClose">&times;</span><h3>튜너</h3><div id="tunerNote">--</div><div id="tunerFreq">0 Hz</div><div id="tunerMeter"><div id="tunerCenter"></div><div id="tunerNeedle"></div></div><div style="font-size:11px;color:rgba(201,169,110,.4);margin:8px 0" id="tunerStatus">마이크 접근 필요</div><div class="tunerRefBtns"><div class="tunerRefBtn" data-s="0" role="button" tabindex="0">G3</div><div class="tunerRefBtn" data-s="1" role="button" tabindex="0">D4</div><div class="tunerRefBtn" data-s="2" role="button" tabindex="0">A4</div><div class="tunerRefBtn" data-s="3" role="button" tabindex="0">E5</div></div>';
  document.body.appendChild(panel);
  document.getElementById('tunerClose').addEventListener('pointerdown',function(e){e.preventDefault();stopTuner();panel.classList.remove('show');});
  panel.querySelectorAll('.tunerRefBtn').forEach(function(btn){btn.addEventListener('pointerdown',function(e){e.preventDefault();ensureA();AE.playTuner(parseInt(btn.dataset.s));});});}
function startTuner(){ensureA();navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){tunerStream=stream;var ctx=AE.getCtx();var src=ctx.createMediaStreamSource(stream);tunerAnalyser=ctx.createAnalyser();tunerAnalyser.fftSize=4096;src.connect(tunerAnalyser);document.getElementById('tunerStatus').textContent='마이크 활성';tunerLoop();}).catch(function(){document.getElementById('tunerStatus').textContent='마이크 접근이 거부되었습니다';});}
function stopTuner(){cancelAnimationFrame(tunerAnimID);if(tunerStream){tunerStream.getTracks().forEach(function(t){t.stop();});tunerStream=null;}}
function tunerLoop(){if(!tunerAnalyser)return;var buf=new Float32Array(tunerAnalyser.fftSize);tunerAnalyser.getFloatTimeDomainData(buf);var freq=autoCorrelate(buf,AE.getCtx().sampleRate);
  if(freq>0){var noteNum=12*(Math.log2(freq/440))+69;var roundNote=Math.round(noteNum);var cents=(noteNum-roundNote)*100;
    document.getElementById('tunerNote').textContent=NOTE_NAMES[roundNote%12]+(Math.floor(roundNote/12)-1);document.getElementById('tunerFreq').textContent=freq.toFixed(1)+' Hz';
    var needle=document.getElementById('tunerNeedle');var pct=50+cents/50*40;needle.style.left=Math.max(5,Math.min(95,pct))+'%';
    needle.style.background=Math.abs(cents)<5?'#44ee44':Math.abs(cents)<15?'#ffd700':'#ff4444';}
  tunerAnimID=requestAnimationFrame(tunerLoop);}
function autoCorrelate(buf,sampleRate){var rms=0;for(var i=0;i<buf.length;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/buf.length);if(rms<0.01)return -1;
  var r1=0,r2=buf.length-1,thresh=0.2;for(var i=0;i<buf.length/2;i++){if(Math.abs(buf[i])<thresh){r1=i;break;}}
  for(var i=buf.length-1;i>=buf.length/2;i--){if(Math.abs(buf[i])<thresh){r2=i;break;}}
  var trimmed=buf.slice(r1,r2);var len=trimmed.length;var c=new Array(len).fill(0);
  for(var i=0;i<len;i++){for(var j=0;j<len-i;j++){c[i]+=trimmed[j]*trimmed[j+i];}}
  var d=0;while(c[d]>c[d+1])d++;var maxVal=-1,maxPos=-1;for(var i=d;i<len;i++){if(c[i]>maxVal){maxVal=c[i];maxPos=i;}}
  if(maxPos<2)return -1;var y1=c[maxPos-1],y2=c[maxPos],y3=c[maxPos+1];var a=(y1+y3-2*y2)/2;var b=(y3-y1)/2;var shift=a?-b/(2*a):0;return sampleRate/(maxPos+shift);}

/* ─── 10. VISUAL METRONOME ─── */
function createMetroVisual(){var wrap=document.createElement('div');wrap.id='metroVisual';wrap.innerHTML='<div id="metroDot"></div><div id="metroPend"></div><div id="metroBeat">1</div>';document.body.appendChild(wrap);}
(function patchMetro(){var origMetroBtn=document.getElementById('metroBtn');if(!origMetroBtn)return;
  var observer=new MutationObserver(function(){var mv=document.getElementById('metroVisual');
    if(origMetroBtn.classList.contains('on')){if(mv){mv.classList.add('show');var dur=60/AE.metroBPM;mv.querySelector('#metroPend').style.setProperty('--beat-dur',dur+'s');mv.querySelector('#metroPend').classList.add('tick');}}
    else{if(mv){mv.classList.remove('show');mv.querySelector('#metroPend').classList.remove('tick');}}});
  observer.observe(origMetroBtn,{attributes:true,attributeFilter:['class']});})();

/* ─── 11. DRONE MODE ─── */
var droneOscs=[];
function createDronePanel(){var panel=document.createElement('div');panel.id='dronePanel';var freqs=[196,293.66,440,659.25];var names=['G3','D4','A4','E5'];
  panel.innerHTML='<span class="recClose" id="droneClose">&times;</span><h3>드론 연습</h3><div style="font-size:11px;color:rgba(201,169,110,.5);margin-bottom:12px">지속음과 함께 음정 연습</div><div class="droneRow">'+names.map(function(n,i){return '<div class="droneBtn" data-s="'+i+'" data-freq="'+freqs[i]+'" role="button" tabindex="0">'+n+'</div>';}).join('')+'</div>';
  document.body.appendChild(panel);
  document.getElementById('droneClose').addEventListener('pointerdown',function(e){e.preventDefault();stopAllDrones();panel.classList.remove('show');});
  panel.querySelectorAll('.droneBtn').forEach(function(btn){btn.addEventListener('pointerdown',function(e){e.preventDefault();ensureA();var idx=parseInt(btn.dataset.s);var freq=parseFloat(btn.dataset.freq);
    if(btn.classList.contains('active')){stopDrone(idx);btn.classList.remove('active');}
    else{startDrone(idx,freq);btn.classList.add('active');var s=loadStats();s.totalDrone=(s.totalDrone||0)+1;localStorage.setItem('violinV4_stats',JSON.stringify(s));checkAchievements();}});});}
function startDrone(idx,freq){stopDrone(idx);var ctx=AE.getCtx();var osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=freq;var g=ctx.createGain();g.gain.value=0;g.gain.linearRampToValueAtTime(0.12,ctx.currentTime+0.5);
  var osc2=ctx.createOscillator();osc2.type='triangle';osc2.frequency.value=freq;var g2=ctx.createGain();g2.gain.value=0;g2.gain.linearRampToValueAtTime(0.05,ctx.currentTime+0.5);
  osc.connect(g);osc2.connect(g2);g.connect(AE.getMaster());g2.connect(AE.getMaster());osc.start();osc2.start();droneOscs[idx]={osc:osc,osc2:osc2,g:g,g2:g2};}
function stopDrone(idx){var d=droneOscs[idx];if(d){var ctx=AE.getCtx();var t=ctx.currentTime;d.g.gain.linearRampToValueAtTime(0,t+0.3);d.g2.gain.linearRampToValueAtTime(0,t+0.3);setTimeout(function(){try{d.osc.stop();d.osc2.stop();}catch(e){}},400);droneOscs[idx]=null;}}
function stopAllDrones(){for(var i=0;i<4;i++)stopDrone(i);document.querySelectorAll('.droneBtn').forEach(function(b){b.classList.remove('active');});}

/* ─── 12. TEMPO CONTROL ─── */
var tempoMult=1.0;
function createTempoSlider(){var wrap=document.createElement('div');wrap.id='tempoWrap';
  wrap.innerHTML='<span style="font-size:10px;color:rgba(201,169,110,.5)">템포</span><input type="range" id="tempoSlider" min="30" max="150" value="100" step="5"><span id="tempoLabel">100%</span>';
  var bz=document.getElementById('bz');if(bz)bz.appendChild(wrap);
  document.getElementById('tempoSlider').addEventListener('input',function(e){tempoMult=parseInt(e.target.value)/100;document.getElementById('tempoLabel').textContent=e.target.value+'%';
    if(tempoMult<1.0){var achs=loadAchievements();if(!achs.tempo_master)unlockAch('tempo_master');}});}
(function patchPerformTempo(){if(typeof window.startPerformance==='function'){var origStart=window.startPerformance;
  window.startPerformance=function(key){var song=SONGS[key];if(song&&tempoMult!==1.0){var origBPM=song.bpm;song.bpm=Math.round(origBPM*tempoMult);origStart(key);song.bpm=origBPM;}else{origStart(key);};};}})();

/* ─── 13. ACCESSIBILITY ─── */
(function initA11y(){var skip=document.createElement('a');skip.id='skipLink';skip.href='#bz';skip.textContent='메인 콘텐츠로 건너뛰기';document.body.insertBefore(skip,document.body.firstChild);
  document.querySelectorAll('.hdBtn,.mtab,.ob,.nb,.v6Btn').forEach(function(el){if(!el.getAttribute('role'))el.setAttribute('role','button');if(!el.getAttribute('tabindex'))el.setAttribute('tabindex','0');});
  var hd=document.getElementById('hd');if(hd){hd.setAttribute('role','toolbar');hd.setAttribute('aria-label','도구 모음');}
  var mt=document.getElementById('modeTabs');if(mt){mt.setAttribute('role','tablist');mt.setAttribute('aria-label','모드 선택');}
  document.querySelectorAll('.mtab').forEach(function(tab){tab.setAttribute('role','tab');tab.setAttribute('aria-selected',tab.classList.contains('active')?'true':'false');});
  var bz=document.getElementById('bz');if(bz){bz.setAttribute('role','application');bz.setAttribute('aria-label','활 연주 영역');}
  document.addEventListener('keydown',function(e){if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;
    if(e.key==='m'||e.key==='M'){var mb=document.getElementById('metroBtn');if(mb)mb.click();}
    if(e.key==='v'||e.key==='V'){var vb=document.getElementById('vibBtn');if(vb)vb.click();}
    if(e.key==='d'||e.key==='D'){var db=document.getElementById('darkBtn');if(db)db.click();}
    if(e.key==='p'||e.key==='P'){var pb=document.getElementById('pizzBtn');if(pb)pb.click();}
    if(e.key==='r'||e.key==='R'){var rp=document.getElementById('recPanel');if(rp){rp.classList.contains('show')?rp.classList.remove('show'):showRecPanel();}}
    if(e.key==='Escape'){document.querySelectorAll('#recPanel,#histPanel,#dronePanel,#tunerPanel,#statsPanel,#setPanel,#warmupPanel,#streakPanel').forEach(function(p){p.classList.remove('show');});stopTuner();stopAllDrones();}});})();

/* ─── 14. UI INTEGRATION ─── */
(function integrateUI(){createRecPanel();createHistoryPanel();createDronePanel();createTunerPanel();createMetroVisual();createTempoSlider();
  var hdBtns=document.getElementById('hdBtns');if(!hdBtns)return;
  var recBtn=document.createElement('div');recBtn.className='v6Btn';recBtn.id='recBtn';recBtn.title='녹음 (R)';recBtn.textContent='🎤';recBtn.setAttribute('role','button');recBtn.setAttribute('tabindex','0');hdBtns.insertBefore(recBtn,hdBtns.firstChild);
  var histBtn=document.createElement('div');histBtn.className='v6Btn';histBtn.id='histBtn';histBtn.title='연주 기록';histBtn.textContent='📈';histBtn.setAttribute('role','button');histBtn.setAttribute('tabindex','0');hdBtns.insertBefore(histBtn,recBtn.nextSibling);
  var droneBtn=document.createElement('div');droneBtn.className='v6Btn';droneBtn.id='droneHdBtn';droneBtn.title='드론 연습';droneBtn.textContent='🎵';droneBtn.setAttribute('role','button');droneBtn.setAttribute('tabindex','0');hdBtns.insertBefore(droneBtn,histBtn.nextSibling);
  var tunerBtn=document.createElement('div');tunerBtn.className='v6Btn';tunerBtn.id='tunerHdBtn';tunerBtn.title='튜너';tunerBtn.textContent='🎯';tunerBtn.setAttribute('role','button');tunerBtn.setAttribute('tabindex','0');hdBtns.insertBefore(tunerBtn,droneBtn.nextSibling);
  recBtn.addEventListener('pointerdown',function(e){e.preventDefault();showRecPanel();});
  histBtn.addEventListener('pointerdown',function(e){e.preventDefault();showHistory();});
  droneBtn.addEventListener('pointerdown',function(e){e.preventDefault();ensureA();document.getElementById('dronePanel').classList.add('show');});
  tunerBtn.addEventListener('pointerdown',function(e){e.preventDefault();ensureA();document.getElementById('tunerPanel').classList.add('show');startTuner();});
  var modeObs=new MutationObserver(function(){var tabs=document.querySelectorAll('.mtab');var activeMode='free';tabs.forEach(function(t){if(t.classList.contains('active'))activeMode=t.dataset.mode;});
    var tw=document.getElementById('tempoWrap');if(tw){tw.classList.toggle('show',activeMode==='perform');}});
  document.querySelectorAll('.mtab').forEach(function(t){modeObs.observe(t,{attributes:true,attributeFilter:['class']});});
  var logoEl=document.getElementById('logo');if(logoEl)logoEl.textContent='Violin Real v6';
  var titleEl=document.querySelector('#hd h1');if(titleEl)titleEl.innerHTML='🎻 Violin Real <span style="font-size:8px;color:#ffd700;vertical-align:super">v6</span>';})();

function showRecPanel(){renderRecList();document.getElementById('recPanel').classList.add('show');}

/* ─── 15. PATCH PERFORM FINISH ─── */
(function patchPerformFinish(){if(typeof window.finishPerformance==='function'){var origFinishPerf=window.finishPerformance;
  window.finishPerformance=function(){var ps=window.perfState;origFinishPerf.apply(this,arguments);
    if(ps){var totalNotes=(ps.perfect||0)+(ps.good||0)+(ps.ok||0)+(ps.miss||0);var score=ps.score||0;var stars=score>=totalNotes*90?3:score>=totalNotes*60?2:1;addHistory('perform',ps.songKey||'unknown',score,stars);};};}})();

/* ─── 16. PERFORMANCE OPTIMIZATION ─── */
(function optimizeTrackNote(){var noteCache=null,noteCacheTick=0;
  window.trackNote=function(){var now=Date.now();if(!noteCache||now-noteCacheTick>2000){noteCache=loadStats();noteCacheTick=now;}
    noteCache.totalNotes++;localStorage.setItem('violinV4_stats',JSON.stringify(noteCache));if(noteCache.totalNotes%10===0)checkAchievements();};})();

window.VIOLIN_VERSION='6.0';
})();
