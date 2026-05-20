/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v7.0 PATCH MODULE
   일일챌린지+스케일라이브러리+연습캘린더+공유카드+보잉가이드+
   음악이론+10곡추가(34→44)+10레슨(60→70)+10업적(24→34)+SFX6종
   ═══════════════════════════════════════════════════════════ */
(function V7Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V7_LOADED)return;window.__V7_LOADED=true;

/* ─── 1. CSS INJECTION ─── */
var sty=document.createElement('style');
sty.textContent=`
#hd h1::after{content:' → v7'!important;font-size:8px;color:#ffd700;opacity:.6;}

/* Daily Challenge */
#dailyPanel{display:none;position:fixed;inset:0;z-index:210;background:rgba(0,0,0,.94);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#dailyPanel.show{display:flex;}
#dailyPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.dailyCard{width:100%;max-width:360px;padding:12px;margin:6px 0;
  background:rgba(255,250,235,.06);border:1px solid rgba(200,190,160,.12);
  border-radius:10px;transition:all .15s;}
.dailyCard.done{border-color:rgba(68,238,68,.3);background:rgba(68,238,68,.06);}
.dailyCard .dcTitle{font-size:13px;color:#ffd700;font-weight:700;}
.dailyCard .dcDesc{font-size:10px;color:rgba(201,169,110,.6);margin-top:3px;}
.dailyCard .dcProg{height:4px;background:rgba(255,255,255,.08);border-radius:2px;margin-top:8px;overflow:hidden;}
.dailyCard .dcFill{height:100%;background:linear-gradient(90deg,#ffd700,#ff6644);border-radius:2px;transition:width .4s;}
.dailyCard .dcReward{font-size:9px;color:rgba(255,100,68,.6);margin-top:4px;}

/* Scale Library */
#scalePanel{display:none;position:fixed;inset:0;z-index:210;background:rgba(0,0,0,.94);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#scalePanel.show{display:flex;}
#scalePanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.scaleTabs{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:8px 0;}
.scaleTab{padding:4px 10px;border-radius:12px;font-size:10px;cursor:pointer;
  border:1px solid rgba(255,215,0,.2);color:rgba(240,230,200,.6);
  background:rgba(255,250,235,.04);transition:all .15s;}
.scaleTab.active{background:rgba(255,215,0,.15);border-color:rgba(255,215,0,.4);color:#ffd700;}
.scaleNotes{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:12px 0;}
.scaleNote{width:44px;height:44px;border-radius:50%;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  border:2px solid rgba(255,215,0,.3);font-size:12px;font-weight:700;color:#ffd700;
  cursor:pointer;transition:all .15s;background:rgba(255,215,0,.06);}
.scaleNote:active{transform:scale(.9);background:rgba(255,215,0,.2);}
.scaleNote .snFinger{font-size:7px;color:rgba(201,169,110,.5);margin-top:1px;}
.scaleFingering{width:100%;max-width:360px;margin:8px 0;padding:10px;
  background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.1);border-radius:8px;}
.scaleFingering .sfTitle{font-size:11px;color:#ffd700;margin-bottom:4px;}
.scaleFingering .sfDesc{font-size:10px;color:rgba(201,169,110,.5);line-height:1.5;}

/* Practice Calendar */
#calPanel{display:none;position:fixed;inset:0;z-index:210;background:rgba(0,0,0,.94);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#calPanel.show{display:flex;}
#calPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.calGrid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;width:100%;max-width:320px;margin:8px 0;}
.calDay{aspect-ratio:1;display:flex;align-items:center;justify-content:center;
  border-radius:6px;font-size:10px;color:rgba(201,169,110,.4);
  background:rgba(255,250,235,.03);border:1px solid rgba(200,190,160,.06);}
.calDay.practiced{background:rgba(255,215,0,.12);border-color:rgba(255,215,0,.25);color:#ffd700;}
.calDay.today{border-color:rgba(255,100,68,.5);color:#ff6644;font-weight:700;}
.calDay.header{font-size:8px;color:rgba(201,169,110,.3);background:none;border:none;}
.calStats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;width:100%;max-width:320px;margin:12px 0;}
.calStat{text-align:center;padding:8px;background:rgba(255,250,235,.04);border-radius:8px;
  border:1px solid rgba(200,190,160,.08);}
.calStat .csVal{font-size:18px;color:#ffd700;font-weight:700;}
.calStat .csLbl{font-size:8px;color:rgba(201,169,110,.4);margin-top:2px;}

/* Share Card */
#sharePanel{display:none;position:fixed;inset:0;z-index:210;background:rgba(0,0,0,.94);
  flex-direction:column;align-items:center;justify-content:center;padding:16px;color:#c9a96e;}
#sharePanel.show{display:flex;}
#sharePanel h3{font-size:16px;color:#ffd700;margin-bottom:12px;}
#shareCanvas{border-radius:12px;border:2px solid rgba(255,215,0,.2);max-width:95%;box-shadow:0 4px 20px rgba(0,0,0,.5);}
.shareBtns{display:flex;gap:8px;margin-top:16px;}
.shareBtn{padding:8px 16px;border-radius:8px;font-size:11px;cursor:pointer;
  border:1px solid rgba(255,215,0,.3);color:#ffd700;background:rgba(255,250,235,.08);
  font-family:Georgia,serif;transition:all .15s;}
.shareBtn:active{background:rgba(255,215,0,.2);}

/* Bowing Guide */
#bowGuidePanel{display:none;position:fixed;inset:0;z-index:210;background:rgba(0,0,0,.94);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#bowGuidePanel.show{display:flex;}
#bowGuidePanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.bowCard{width:100%;max-width:360px;padding:12px;margin:5px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);border-radius:10px;}
.bowCard .bcName{font-size:13px;color:#ffd700;font-weight:700;}
.bowCard .bcKo{font-size:10px;color:rgba(255,100,68,.6);margin-top:2px;}
.bowCard .bcDesc{font-size:10px;color:rgba(201,169,110,.5);margin-top:4px;line-height:1.5;}
.bowCard .bcTip{font-size:9px;color:rgba(68,238,68,.6);margin-top:6px;padding:4px 8px;
  background:rgba(68,238,68,.06);border-radius:4px;border-left:2px solid rgba(68,238,68,.3);}
.bowCard svg{margin-top:8px;max-width:100%;}

/* Music Theory */
#theoryPanel{display:none;position:fixed;inset:0;z-index:210;background:rgba(0,0,0,.94);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#theoryPanel.show{display:flex;}
#theoryPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.theoryTabs{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:8px 0;}
.theoryTab{padding:4px 10px;border-radius:12px;font-size:10px;cursor:pointer;
  border:1px solid rgba(255,215,0,.2);color:rgba(240,230,200,.6);
  background:rgba(255,250,235,.04);transition:all .15s;}
.theoryTab.active{background:rgba(255,215,0,.15);border-color:rgba(255,215,0,.4);color:#ffd700;}
.theoryContent{width:100%;max-width:360px;margin:8px 0;}
.theoryItem{padding:10px;margin:4px 0;background:rgba(255,250,235,.04);
  border:1px solid rgba(200,190,160,.08);border-radius:8px;}
.theoryItem .tiTitle{font-size:12px;color:#ffd700;font-weight:600;}
.theoryItem .tiDesc{font-size:10px;color:rgba(201,169,110,.5);margin-top:4px;line-height:1.5;}
.theoryItem .tiExample{font-size:10px;color:rgba(68,238,68,.6);margin-top:4px;font-style:italic;}

/* Quick Action buttons */
.v7QuickRow{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:4px 0;}

/* Pulse animation for daily badge */
.dailyBadge{display:inline-flex;align-items:center;gap:2px;padding:1px 6px;
  border-radius:10px;border:1px solid rgba(68,238,68,.3);
  background:rgba(68,238,68,.08);font-size:9px;color:#44ee44;font-weight:700;cursor:pointer;}
.dailyBadge.complete{border-color:rgba(255,215,0,.4);background:rgba(255,215,0,.1);color:#ffd700;}
.dailyBadge.pulse{animation:dailyPulse 2s ease-in-out infinite;}
@keyframes dailyPulse{0%,100%{box-shadow:0 0 0 rgba(68,238,68,0)}50%{box-shadow:0 0 8px rgba(68,238,68,.3)}}

/* v7 close button */
.v7Close{position:fixed;top:12px;right:16px;z-index:220;font-size:20px;color:#c9a96e;cursor:pointer;
  background:rgba(0,0,0,.5);border-radius:50%;width:32px;height:32px;
  display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,215,0,.2);}
.v7Close:active{background:rgba(255,215,0,.15);}
`;
document.head.appendChild(sty);

/* ─── 2. WEB AUDIO SFX 6종 ─── */
function v7Sfx(type){
  if(typeof AE==='undefined'||!AE.getCtx)return;
  try{AE.res();}catch(e){return;}
  var ctx=AE.getCtx();if(!ctx)return;
  var t=ctx.currentTime;
  var g=ctx.createGain();g.gain.setValueAtTime(0,t);g.connect(ctx.destination);
  if(type==='daily_complete'){
    g.gain.linearRampToValueAtTime(.1,t+.02);g.gain.linearRampToValueAtTime(0,t+.5);
    [659.25,783.99,987.77,1318.51].forEach(function(f,i){var o=ctx.createOscillator();o.type='sine';o.frequency.value=f;
      var og=ctx.createGain();og.gain.value=.25;o.connect(og);og.connect(g);o.start(t+i*.06);o.stop(t+.5);});
  }else if(type==='scale_play'){
    g.gain.linearRampToValueAtTime(.08,t+.01);g.gain.linearRampToValueAtTime(0,t+.25);
    var o=ctx.createOscillator();o.type='triangle';o.frequency.value=880;o.connect(g);o.start(t);o.stop(t+.25);
  }else if(type==='share'){
    g.gain.linearRampToValueAtTime(.08,t+.02);g.gain.linearRampToValueAtTime(0,t+.4);
    [523.25,783.99].forEach(function(f,i){var o=ctx.createOscillator();o.type='sine';o.frequency.value=f;
      o.connect(g);o.start(t+i*.1);o.stop(t+.4);});
  }else if(type==='calendar'){
    g.gain.linearRampToValueAtTime(.06,t+.01);g.gain.linearRampToValueAtTime(0,t+.2);
    var o=ctx.createOscillator();o.type='sine';o.frequency.value=1046.5;o.connect(g);o.start(t);o.stop(t+.2);
  }else if(type==='theory'){
    g.gain.linearRampToValueAtTime(.07,t+.02);g.gain.linearRampToValueAtTime(0,t+.3);
    [440,554.37].forEach(function(f,i){var o=ctx.createOscillator();o.type='sine';o.frequency.value=f;
      o.connect(g);o.start(t+i*.05);o.stop(t+.3);});
  }else if(type==='bow_guide'){
    g.gain.linearRampToValueAtTime(.06,t+.02);g.gain.linearRampToValueAtTime(0,t+.35);
    var o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=220;
    var lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=800;
    o.connect(lp);lp.connect(g);o.start(t);o.stop(t+.35);
  }
}

/* ─── 3. NEW SONGS (+10곡, 총 44곡) ─── */
(function addSongs(){
  if(typeof SONGS==='undefined')return;
  SONGS['타이스명상']={name:'타이스 – 명상 (Meditation)',category:'클래식',difficulty:'medium',bpm:60,
    notes:[
      {note:'C5',dur:2,s:2,f:3},{note:'E5',dur:1,s:3,f:0},{note:'G5',dur:1,s:3,f:3},
      {note:'A5',dur:2,s:3,f:5},{note:'G5',dur:1,s:3,f:3},{note:'E5',dur:1,s:3,f:0},
      {note:'F5',dur:1.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'E5',dur:2,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:2,s:1,f:5},
      {note:'C5',dur:2,s:2,f:3},{note:'E5',dur:1,s:3,f:0},{note:'G5',dur:1,s:3,f:3},
      {note:'F5',dur:1.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:2,s:2,f:5},
      {note:'C5',dur:3,s:2,f:3}
    ]};
  SONGS['아리랑']={name:'아리랑',category:'민요',difficulty:'easy',bpm:76,
    notes:[
      {note:'A4',dur:1,s:2,f:0},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:2,s:1,f:5},
      {note:'E4',dur:1,s:1,f:2},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:2,s:2,f:0},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:2,s:2,f:0},
      {note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:2,s:1,f:5},
      {note:'E4',dur:1,s:1,f:2},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:2,s:2,f:0},{note:'R',dur:2,s:-1,f:0}
    ]};
  SONGS['아빠무도']={name:'G선상의 아리아 (바흐)',category:'클래식',difficulty:'hard',bpm:56,
    notes:[
      {note:'D5',dur:2,s:2,f:5},{note:'G5',dur:1.5,s:3,f:3},{note:'F#5',dur:.5,s:3,f:2},
      {note:'G5',dur:1,s:3,f:3},{note:'D5',dur:1,s:2,f:5},{note:'B4',dur:1,s:2,f:2},{note:'G4',dur:1,s:1,f:5},
      {note:'A4',dur:1.5,s:2,f:0},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'F#4',dur:1,s:1,f:4},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},
      {note:'D4',dur:2,s:1,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'B4',dur:1.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:1,s:1,f:5},{note:'F#4',dur:1,s:1,f:4},
      {note:'G4',dur:3,s:1,f:5}
    ]};
  SONGS['콘치르토']={name:'콘치르토 D단조 (바흐)',category:'클래식',difficulty:'hard',bpm:108,
    notes:[
      {note:'A4',dur:1,s:2,f:0},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C#5',dur:.5,s:2,f:4},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'A4',dur:1,s:2,f:0},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C#5',dur:.5,s:2,f:4},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},
      {note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C#5',dur:.5,s:2,f:4},{note:'B4',dur:.5,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C#5',dur:1,s:2,f:4},
      {note:'D5',dur:1.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'F5',dur:1,s:3,f:1},
      {note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C#5',dur:1,s:2,f:4},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'A4',dur:2,s:2,f:0}
    ]};
  SONGS['도레미송']={name:'도레미 송',category:'동요',difficulty:'easy',bpm:110,
    notes:[
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'C5',dur:1,s:2,f:3},
      {note:'E5',dur:1,s:3,f:0},{note:'C5',dur:1,s:2,f:3},{note:'E5',dur:2,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'F5',dur:1,s:3,f:1},{note:'F5',dur:1,s:3,f:1},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'F5',dur:2,s:3,f:1},
      {note:'E5',dur:1,s:3,f:0},{note:'F5',dur:1,s:3,f:1},{note:'G5',dur:2,s:3,f:3},
      {note:'A5',dur:.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'C5',dur:2,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'G4',dur:1,s:1,f:5},{note:'C5',dur:2,s:2,f:3},{note:'R',dur:2,s:-1,f:0}
    ]};
  SONGS['야상곡']={name:'야상곡 (슈베르트)',category:'클래식',difficulty:'medium',bpm:54,
    notes:[
      {note:'C5',dur:2,s:2,f:3},{note:'E5',dur:2,s:3,f:0},
      {note:'G5',dur:1.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'F5',dur:1,s:3,f:1},
      {note:'E5',dur:2,s:3,f:0},{note:'C5',dur:2,s:2,f:3},
      {note:'G4',dur:1,s:1,f:5},{note:'C5',dur:1.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:2,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:2,s:1,f:5},
      {note:'C5',dur:3,s:2,f:3}
    ]};
  SONGS['양처리양']={name:'양 처리양 (사라사테)',category:'동요',difficulty:'easy',bpm:92,
    notes:[
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'D5',dur:1,s:2,f:5},{note:'D5',dur:2,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'G5',dur:1,s:3,f:3},{note:'G5',dur:2,s:3,f:3},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:2,s:2,f:3},{note:'R',dur:2,s:-1,f:0}
    ]};
  SONGS['무대위의고양이']={name:'Memory (캣츠)',category:'뮤지컬',difficulty:'medium',bpm:66,
    notes:[
      {note:'C5',dur:1,s:2,f:3},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'G4',dur:1.5,s:1,f:5},{note:'A4',dur:.5,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:2,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'G5',dur:1,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'C5',dur:2,s:2,f:3},
      {note:'A4',dur:1,s:2,f:0},{note:'C5',dur:1.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'C5',dur:3,s:2,f:3}
    ]};
  SONGS['헝가리무곡2']={name:'헝가리 무곡 2번',category:'클래식',difficulty:'hard',bpm:76,
    notes:[
      {note:'F#4',dur:2,s:1,f:4},{note:'A4',dur:1,s:2,f:0},{note:'C#5',dur:1,s:2,f:4},
      {note:'D5',dur:1.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'F#5',dur:1,s:3,f:2},{note:'D5',dur:1,s:2,f:5},
      {note:'A4',dur:1,s:2,f:0},{note:'F#4',dur:1,s:1,f:4},{note:'A4',dur:1,s:2,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C#5',dur:1.5,s:2,f:4},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:2,s:2,f:0},
      {note:'F#5',dur:2,s:3,f:2},{note:'A5',dur:1,s:3,f:5},{note:'F#5',dur:1,s:3,f:2},
      {note:'D5',dur:1.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'F#5',dur:1,s:3,f:2},{note:'D5',dur:1,s:2,f:5},
      {note:'A4',dur:1,s:2,f:0},{note:'F#5',dur:1,s:3,f:2},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C#5',dur:1,s:2,f:4},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'A4',dur:1,s:2,f:0},
      {note:'D5',dur:3,s:2,f:5}
    ]};
  SONGS['여자의마음']={name:'여자의 마음 (Fickle Heart)',category:'클래식',difficulty:'medium',bpm:84,
    notes:[
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:2,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},
      {note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:2,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'C5',dur:1,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'A4',dur:3,s:2,f:0}
    ]};

  if(typeof CHORDS!=='undefined'){
    CHORDS['타이스명상']=[[261.63,329.63,392],[329.63,392,493.88]];
    CHORDS['아리랑']=[[440,523.25,659.25],[329.63,440,523.25]];
    CHORDS['아빠무도']=[[196,246.94,293.66],[293.66,369.99,440]];
    CHORDS['콘치르토']=[[293.66,369.99,440],[440,554.37,659.25]];
    CHORDS['도레미송']=[[261.63,329.63,392],[349.23,440,523.25]];
    CHORDS['야상곡']=[[261.63,329.63,392],[349.23,440,523.25]];
    CHORDS['양처리양']=[[261.63,329.63,392],[349.23,440,523.25]];
    CHORDS['무대위의고양이']=[[261.63,329.63,392],[440,523.25,659.25]];
    CHORDS['헝가리무곡2']=[[293.66,369.99,440],[440,554.37,659.25]];
    CHORDS['여자의마음']=[[440,523.25,659.25],[293.66,369.99,440]];
  }
})();

/* ─── 4. NEW LESSONS (61-70) ─── */
(function addLessons(){
  if(typeof LESSONS==='undefined')return;
  LESSONS.push({lv:61,title:'더블스톱 G현',desc:'G현에서 두 줄을 동시에 연주',targets:[{s:0,f:0,count:2},{s:0,f:2,count:2},{s:0,f:0,count:2},{s:0,f:4,count:2}]});
  LESSONS.push({lv:62,title:'더블스톱 D현',desc:'D현에서 더블스톱 연습',targets:[{s:1,f:0,count:2},{s:1,f:2,count:2},{s:1,f:4,count:2},{s:1,f:5,count:2}]});
  LESSONS.push({lv:63,title:'스피카토 바운싱',desc:'활 바운싱을 활용한 스피카토',targets:[{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:0,count:1},{s:2,f:3,count:1},{s:2,f:0,count:1},{s:2,f:5,count:1}]});
  LESSONS.push({lv:64,title:'헝고단조 스케일',desc:'A-B-C#-D-E-F#-G#-A 순서대로',targets:[{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:4,count:1},{s:2,f:5,count:1},{s:3,f:0,count:1},{s:3,f:2,count:1},{s:3,f:4,count:1},{s:3,f:5,count:1}]});
  LESSONS.push({lv:65,title:'D장조 스케일',desc:'D-E-F#-G-A-B-C#-D 순서대로',targets:[{s:1,f:0,count:1},{s:1,f:2,count:1},{s:1,f:4,count:1},{s:1,f:5,count:1},{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:4,count:1},{s:2,f:5,count:1}]});
  LESSONS.push({lv:66,title:'G장조 아르페지오',desc:'G-B-D-G-D-B 화음 분해',targets:[{s:0,f:0,count:1},{s:0,f:4,count:1},{s:1,f:0,count:1},{s:1,f:5,count:1},{s:1,f:0,count:1},{s:0,f:4,count:1}]});
  LESSONS.push({lv:67,title:'크로매틱 하행',desc:'A현에서 반음씩 12음 올라가기',targets:[{s:2,f:0,count:1},{s:2,f:1,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:4,count:1},{s:2,f:5,count:1},{s:2,f:6,count:1},{s:2,f:7,count:1}]});
  LESSONS.push({lv:68,title:'아리랑 주제',desc:'아리랑 멜로디 연습',targets:[{s:2,f:0,count:1},{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:2,count:1},{s:2,f:0,count:1},{s:1,f:5,count:1}]});
  LESSONS.push({lv:69,title:'명상곡 주제',desc:'타이스 명상곡 도입부',targets:[{s:2,f:3,count:1},{s:3,f:0,count:1},{s:3,f:3,count:1},{s:3,f:5,count:1},{s:3,f:3,count:1},{s:3,f:0,count:1}]});
  LESSONS.push({lv:70,title:'v7 졸업 시험',desc:'4현 전체 반음씨 완주 (0~7)',targets:[
    {s:0,f:0,count:1},{s:0,f:1,count:1},{s:0,f:2,count:1},{s:0,f:3,count:1},{s:0,f:4,count:1},{s:0,f:5,count:1},{s:0,f:6,count:1},{s:0,f:7,count:1},
    {s:1,f:0,count:1},{s:1,f:1,count:1},{s:1,f:2,count:1},{s:1,f:3,count:1},{s:1,f:4,count:1},{s:1,f:5,count:1},{s:1,f:6,count:1},{s:1,f:7,count:1},
    {s:2,f:0,count:1},{s:2,f:1,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:4,count:1},{s:2,f:5,count:1},{s:2,f:6,count:1},{s:2,f:7,count:1},
    {s:3,f:0,count:1},{s:3,f:1,count:1},{s:3,f:2,count:1},{s:3,f:3,count:1},{s:3,f:4,count:1},{s:3,f:5,count:1},{s:3,f:6,count:1},{s:3,f:7,count:1}
  ]});
})();

/* ─── 5. NEW ACHIEVEMENTS (+10, 총 34개) ─── */
(function addAchievements(){
  if(typeof ACHIEVEMENTS==='undefined')return;
  ACHIEVEMENTS.push(
    {id:'lesson_70',name:'전설의 바이올리니스트',desc:'70개 레슨을 모두 완료했습니다',icon:'🏆'},
    {id:'songs_30',name:'연주 매스터',desc:'30개 곡을 완주했습니다',icon:'🎵'},
    {id:'songs_40',name:'바이올린 마에스트로',desc:'40개 곡을 완주했습니다',icon:'🎻'},
    {id:'daily_7',name:'일주일 챌린저',desc:'7일 연속 일일챌린지를 완료했습니다',icon:'🔥'},
    {id:'daily_30',name:'챌린지 마스터',desc:'30일 챌린지 완료를 달성했습니다',icon:'🏅'},
    {id:'scale_all',name:'스케일 완주자',desc:'스케일 라이브러리 8개를 모두 연주했습니다',icon:'🎼'},
    {id:'share_first',name:'첫 공유',desc:'첫 연주 공유 카드를 만들었습니다',icon:'📤'},
    {id:'theory_reader',name:'음악이론가',desc:'음악이론 5개 항목을 읽었습니다',icon:'📖'},
    {id:'cal_month',name:'한달 연습가',desc:'한 달에 20일 이상 연습했습니다',icon:'📅'},
    {id:'perfect_100',name:'완벽주의자',desc:'총 100회 Perfect 판정을 받았습니다',icon:'💎'}
  );
})();

/* ─── 6. PATCH ACHIEVEMENT CHECKER ─── */
(function patchAchCheck(){
  var origCheck=window.checkAchievements;
  if(!origCheck)return;
  window.checkAchievements=function(){
    origCheck();
    var p=loadProgress();var achs=loadAchievements();var stats=loadStats();
    var lessonsDone=0;for(var i=1;i<=70;i++){if(p['lesson_'+i])lessonsDone++;}
    if(lessonsDone>=70&&!achs.lesson_70)unlockAch('lesson_70');
    var songSet=new Set();
    Object.keys(p).forEach(function(k){
      if(k.startsWith('rhythm_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^rhythm_/,''));
      if(k.startsWith('perform_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^perform_/,''));
    });
    if(songSet.size>=30&&!achs.songs_30)unlockAch('songs_30');
    if(songSet.size>=40&&!achs.songs_40)unlockAch('songs_40');
    if((stats.totalPerfects||0)>=100&&!achs.perfect_100)unlockAch('perfect_100');
    var dailyData=loadDailyData();
    if(dailyData.streak>=7&&!achs.daily_7)unlockAch('daily_7');
    if(dailyData.totalDays>=30&&!achs.daily_30)unlockAch('daily_30');
    var calData=loadCalendarData();var thisMonth=new Date().toISOString().slice(0,7);
    var monthDays=Object.keys(calData).filter(function(d){return d.startsWith(thisMonth);}).length;
    if(monthDays>=20&&!achs.cal_month)unlockAch('cal_month');
  };
})();

/* ─── 7. PATCH STATS DISPLAY ─── */
(function patchStats(){
  var origUpdate=window.updateStatsPanel;
  if(!origUpdate)return;
  window.updateStatsPanel=function(){
    origUpdate();
    var el=document.getElementById('statAch');
    if(el){var achs=loadAchievements();el.textContent=Object.keys(achs).length+'/34';}
    var lesEl=document.getElementById('statLessons');
    if(lesEl){var p=loadProgress();var done=0;for(var i=1;i<=70;i++){if(p['lesson_'+i])done++;}lesEl.textContent=done+'/70';}
  };
})();

/* ─── 8. DAILY CHALLENGE SYSTEM ─── */
var V7_DAILY_KEY='violinV7_daily';
function loadDailyData(){try{return JSON.parse(localStorage.getItem(V7_DAILY_KEY)||'{}');}catch(e){return {};}}
function saveDailyData(d){localStorage.setItem(V7_DAILY_KEY,JSON.stringify(d));}

var DAILY_CHALLENGES=[
  {id:'notes_50',title:'노트 50개 연주',desc:'오늘 50개 이상의 노트를 연주하세요',target:50,unit:'notes'},
  {id:'lesson_3',title:'레슨 3개 완료',desc:'오늘 레슨 3개를 완료하세요',target:3,unit:'lessons'},
  {id:'song_2',title:'곡 2개 완주',desc:'리듬게임이나 곡연주로 2곡을 완주하세요',target:2,unit:'songs'},
  {id:'warmup_all',title:'워밍업 전체',desc:'5가지 워밍업을 모두 완료하세요',target:5,unit:'warmups'},
  {id:'combo_20',title:'콤보 20 달성',desc:'리듬게임에서 20 콤보를 달성하세요',target:20,unit:'combo'},
  {id:'perfect_10',title:'Perfect 10회',desc:'오늘 Perfect 판정 10회를 받으세요',target:10,unit:'perfects'},
  {id:'practice_15',title:'15분 연습',desc:'오늘 15분 이상 연습하세요',target:15,unit:'minutes'},
  {id:'scale_play',title:'스케일 연습',desc:'스케일 라이브러리에서 3개 스케일을 연주하세요',target:3,unit:'scales'},
  {id:'drone_5',title:'드론 연습 5회',desc:'드론 모드를 5회 사용하세요',target:5,unit:'drones'},
  {id:'tuner_use',title:'튜닝 연습',desc:'튜너를 사용하여 조율을 확인하세요',target:1,unit:'tuner'},
  {id:'notes_100',title:'노트 100개 연주',desc:'오늘 100개 이상의 노트를 연주하세요',target:100,unit:'notes'},
  {id:'hard_song',title:'어려운 곡 도전',desc:'hard 난이도 곡을 1곡 완주하세요',target:1,unit:'hard_songs'},
  {id:'record_1',title:'녹음 하기',desc:'오늘 연주를 1회 녹음하세요',target:1,unit:'recordings'},
  {id:'pizz_20',title:'피치카토 20회',desc:'피치카토 모드로 20회 연주하세요',target:20,unit:'pizz'}
];

function getTodayChallenges(){
  var today=new Date().toISOString().slice(0,10);
  var seed=0;for(var i=0;i<today.length;i++)seed+=today.charCodeAt(i);
  var indices=[];var pool=DAILY_CHALLENGES.slice();
  for(var i=0;i<3&&pool.length>0;i++){
    var idx=seed%(pool.length);indices.push(pool.splice(idx,1)[0]);seed=Math.floor(seed*31+7)%9973;
  }
  return indices;
}

function getDailyProgress(){
  var d=loadDailyData();var today=new Date().toISOString().slice(0,10);
  if(!d.date||d.date!==today){d={date:today,progress:{},streak:(d.streak||0),totalDays:(d.totalDays||0)};saveDailyData(d);}
  return d;
}

function updateDailyProgress(unit,amount){
  var d=getDailyProgress();if(!d.progress)d.progress={};
  d.progress[unit]=(d.progress[unit]||0)+amount;saveDailyData(d);
  var challenges=getTodayChallenges();var allDone=true;
  challenges.forEach(function(ch){if((d.progress[ch.unit]||0)<ch.target)allDone=false;});
  if(allDone&&!d.completed){d.completed=true;d.streak=(d.streak||0)+1;d.totalDays=(d.totalDays||0)+1;saveDailyData(d);
    v7Sfx('daily_complete');showToast('일일 챌린지 완료! 🎉');checkAchievements();}
  updateDailyBadge();
}

function createDailyPanel(){
  var panel=document.createElement('div');panel.id='dailyPanel';
  panel.innerHTML='<span class="v7Close" id="dailyClose">&times;</span><h3>🎯 일일 챌린지</h3><div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:12px">매일 3가지 목표를 달성하세요</div><div id="dailyList"></div>';
  document.body.appendChild(panel);
  document.getElementById('dailyClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function showDailyPanel(){
  var panel=document.getElementById('dailyPanel');var list=document.getElementById('dailyList');
  var challenges=getTodayChallenges();var d=getDailyProgress();
  list.innerHTML='';
  challenges.forEach(function(ch){
    var prog=Math.min(d.progress[ch.unit]||0,ch.target);
    var pct=Math.round(prog/ch.target*100);var done=prog>=ch.target;
    var card=document.createElement('div');card.className='dailyCard'+(done?' done':'');
    card.innerHTML='<div class="dcTitle">'+(done?'✅ ':'⭐ ')+ch.title+'</div><div class="dcDesc">'+ch.desc+'</div><div class="dcProg"><div class="dcFill" style="width:'+pct+'%"></div></div><div class="dcReward">'+prog+'/'+ch.target+(done?' 완료!':'')+'</div>';
    list.appendChild(card);
  });
  panel.classList.add('show');
}

function updateDailyBadge(){
  var badge=document.getElementById('dailyBadge');if(!badge)return;
  var challenges=getTodayChallenges();var d=getDailyProgress();
  var done=0;challenges.forEach(function(ch){if((d.progress[ch.unit]||0)>=ch.target)done++;});
  badge.textContent='🎯 '+done+'/3';
  badge.className='dailyBadge'+(done>=3?' complete':' pulse');
}

/* ─── 9. SCALE LIBRARY ─── */
var SCALES=[
  {name:'C 장조',key:'C',notes:['C4','D4','E4','F4','G4','A4','B4','C5'],
    fingers:[{s:0,f:5},{s:1,f:0},{s:1,f:2},{s:1,f:3},{s:1,f:5},{s:2,f:0},{s:2,f:2},{s:2,f:3}],
    desc:'C Major - 가장 기본적인 장조. 조표 없음.'},
  {name:'G 장조',key:'G',notes:['G3','A3','B3','C4','D4','E4','F#4','G4'],
    fingers:[{s:0,f:0},{s:0,f:2},{s:0,f:4},{s:0,f:5},{s:1,f:0},{s:1,f:2},{s:1,f:4},{s:1,f:5}],
    desc:'G Major - 바이올린의 가장 자연스러운 조. 샵 1개 (F#).'},
  {name:'D 장조',key:'D',notes:['D4','E4','F#4','G4','A4','B4','C#5','D5'],
    fingers:[{s:1,f:0},{s:1,f:2},{s:1,f:4},{s:1,f:5},{s:2,f:0},{s:2,f:2},{s:2,f:4},{s:2,f:5}],
    desc:'D Major - 바이올린 협주곡에 가장 많이 사용. 샵 2개.'},
  {name:'A 장조',key:'A',notes:['A4','B4','C#5','D5','E5','F#5','G#5','A5'],
    fingers:[{s:2,f:0},{s:2,f:2},{s:2,f:4},{s:2,f:5},{s:3,f:0},{s:3,f:2},{s:3,f:4},{s:3,f:5}],
    desc:'A Major - 밝고 화려한 소리. 샵 3개.'},
  {name:'A 단조',key:'Am',notes:['A4','B4','C5','D5','E5','F5','G5','A5'],
    fingers:[{s:2,f:0},{s:2,f:2},{s:2,f:3},{s:2,f:5},{s:3,f:0},{s:3,f:1},{s:3,f:3},{s:3,f:5}],
    desc:'A 자연단조 - 슬프고 서정적인 음색. 조표 없음.'},
  {name:'D 단조',key:'Dm',notes:['D4','E4','F4','G4','A4','Bb4','C5','D5'],
    fingers:[{s:1,f:0},{s:1,f:2},{s:1,f:3},{s:1,f:5},{s:2,f:0},{s:2,f:1},{s:2,f:3},{s:2,f:5}],
    desc:'D 자연단조 - 깊고 무거운 느낌. 플랫 1개.'},
  {name:'E 단조',key:'Em',notes:['E4','F#4','G4','A4','B4','C5','D5','E5'],
    fingers:[{s:1,f:2},{s:1,f:4},{s:1,f:5},{s:2,f:0},{s:2,f:2},{s:2,f:3},{s:2,f:5},{s:3,f:0}],
    desc:'E 자연단조 - 바이올린의 대표적 단조. 샵 1개.'},
  {name:'B♭ 장조',key:'Bb',notes:['Bb3','C4','D4','Eb4','F4','G4','A4','Bb4'],
    fingers:[{s:0,f:3},{s:0,f:5},{s:1,f:0},{s:1,f:1},{s:1,f:3},{s:1,f:5},{s:2,f:0},{s:2,f:1}],
    desc:'B♭ Major - 오케스트라에서 자주 사용. 플랫 2개.'}
];

var scalesPlayed=new Set();

function createScalePanel(){
  var panel=document.createElement('div');panel.id='scalePanel';
  panel.innerHTML='<span class="v7Close" id="scaleClose">&times;</span><h3>🎼 스케일 라이브러리</h3><div class="scaleTabs" id="scaleTabs"></div><div class="scaleNotes" id="scaleNotes"></div><div class="scaleFingering" id="scaleFingering"><div class="sfTitle"></div><div class="sfDesc"></div></div>';
  document.body.appendChild(panel);
  document.getElementById('scaleClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  var tabs=document.getElementById('scaleTabs');
  SCALES.forEach(function(sc,idx){
    var tab=document.createElement('div');tab.className='scaleTab'+(idx===0?' active':'');tab.textContent=sc.name;tab.dataset.idx=idx;
    tab.addEventListener('pointerdown',function(e){e.preventDefault();
      tabs.querySelectorAll('.scaleTab').forEach(function(t){t.classList.remove('active');});tab.classList.add('active');renderScale(idx);});
    tabs.appendChild(tab);
  });
}

function renderScale(idx){
  var sc=SCALES[idx];var container=document.getElementById('scaleNotes');var info=document.getElementById('scaleFingering');
  container.innerHTML='';
  var stringNames=['G','D','A','E'];
  sc.notes.forEach(function(note,i){
    var div=document.createElement('div');div.className='scaleNote';
    var fi=sc.fingers[i];
    div.innerHTML=note+'<span class="snFinger">'+stringNames[fi.s]+fi.f+'</span>';
    div.addEventListener('pointerdown',function(e){e.preventDefault();
      if(typeof ensureA==='function')ensureA();
      if(typeof AE!=='undefined')AE.play(fi.s,fi.f,0.6);
      setTimeout(function(){if(typeof AE!=='undefined')AE.stop(fi.s);},800);
      v7Sfx('scale_play');
      scalesPlayed.add(sc.key);updateDailyProgress('scales',0);
      if(scalesPlayed.size>=8){var achs=loadAchievements();if(!achs.scale_all)unlockAch('scale_all');}
    });
    container.appendChild(div);
  });
  info.querySelector('.sfTitle').textContent=sc.name;
  info.querySelector('.sfDesc').textContent=sc.desc;
}

function showScalePanel(){
  document.getElementById('scalePanel').classList.add('show');renderScale(0);
  scalesPlayed.add(SCALES[0].key);updateDailyProgress('scales',1);
}

/* ─── 10. PRACTICE CALENDAR ─── */
var V7_CAL_KEY='violinV7_calendar';
function loadCalendarData(){try{return JSON.parse(localStorage.getItem(V7_CAL_KEY)||'{}');}catch(e){return {};}}
function saveCalendarData(d){localStorage.setItem(V7_CAL_KEY,JSON.stringify(d));}
function markToday(){var today=new Date().toISOString().slice(0,10);var cal=loadCalendarData();if(!cal[today])cal[today]=0;cal[today]++;saveCalendarData(cal);}

function createCalPanel(){
  var panel=document.createElement('div');panel.id='calPanel';
  panel.innerHTML='<span class="v7Close" id="calClose">&times;</span><h3>📅 연습 캘린더</h3><div id="calMonth" style="font-size:12px;color:#ffd700;margin:4px 0"></div><div class="calGrid" id="calGrid"></div><div class="calStats" id="calStats"></div>';
  document.body.appendChild(panel);
  document.getElementById('calClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function showCalPanel(){
  v7Sfx('calendar');
  var panel=document.getElementById('calPanel');var grid=document.getElementById('calGrid');
  var now=new Date();var year=now.getFullYear();var month=now.getMonth();
  document.getElementById('calMonth').textContent=year+'년 '+(month+1)+'월';
  grid.innerHTML='';
  var dayNames=['일','월','화','수','목','금','토'];
  dayNames.forEach(function(d){var h=document.createElement('div');h.className='calDay header';h.textContent=d;grid.appendChild(h);});
  var firstDay=new Date(year,month,1).getDay();var daysInMonth=new Date(year,month+1,0).getDate();
  var cal=loadCalendarData();var todayStr=now.toISOString().slice(0,10);
  for(var i=0;i<firstDay;i++){var empty=document.createElement('div');empty.className='calDay';grid.appendChild(empty);}
  var practicedDays=0;
  for(var d=1;d<=daysInMonth;d++){
    var dateStr=year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var div=document.createElement('div');div.className='calDay';
    if(cal[dateStr]){div.classList.add('practiced');practicedDays++;}
    if(dateStr===todayStr)div.classList.add('today');
    div.textContent=d;grid.appendChild(div);
  }
  var statsEl=document.getElementById('calStats');
  var totalDays=Object.keys(cal).length;
  var totalSessions=0;Object.values(cal).forEach(function(v){totalSessions+=v;});
  statsEl.innerHTML='<div class="calStat"><div class="csVal">'+practicedDays+'</div><div class="csLbl">이번달 연습일</div></div><div class="calStat"><div class="csVal">'+totalDays+'</div><div class="csLbl">총 연습일</div></div><div class="calStat"><div class="csVal">'+totalSessions+'</div><div class="csLbl">총 세션</div></div>';
  panel.classList.add('show');
  checkAchievements();
}

/* ─── 11. SHARE CARD ─── */
function createSharePanel(){
  var panel=document.createElement('div');panel.id='sharePanel';
  panel.innerHTML='<span class="v7Close" id="shareClose">&times;</span><h3>📤 연주 공유 카드</h3><canvas id="shareCanvas" width="600" height="380"></canvas><div class="shareBtns"><div class="shareBtn" id="shareDown">💾 다운로드</div><div class="shareBtn" id="shareCopy">📋 복사</div></div>';
  document.body.appendChild(panel);
  document.getElementById('shareClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  document.getElementById('shareDown').addEventListener('pointerdown',function(e){e.preventDefault();
    var cv=document.getElementById('shareCanvas');var a=document.createElement('a');a.download='violin-card.png';a.href=cv.toDataURL('image/png');a.click();});
  document.getElementById('shareCopy').addEventListener('pointerdown',function(e){e.preventDefault();
    var cv=document.getElementById('shareCanvas');cv.toBlob(function(blob){
      if(navigator.clipboard&&navigator.clipboard.write){navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(function(){showToast('카드가 클립보드에 복사되었습니다');});}
      else{showToast('브라우저가 클립보드 복사를 지원하지 않습니다');}
    });});
}

function showShareCard(){
  v7Sfx('share');
  var cv=document.getElementById('shareCanvas');var ctx=cv.getContext('2d');
  var stats=loadStats();var achs=loadAchievements();var streak=loadStreak();var cal=loadCalendarData();
  var p=loadProgress();var lessonsDone=0;for(var i=1;i<=70;i++){if(p['lesson_'+i])lessonsDone++;}
  var songSet=new Set();
  Object.keys(p).forEach(function(k){
    if(k.startsWith('rhythm_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k);
    if(k.startsWith('perform_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k);
  });

  var grd=ctx.createLinearGradient(0,0,600,380);grd.addColorStop(0,'#1a1020');grd.addColorStop(1,'#2a1530');
  ctx.fillStyle=grd;ctx.fillRect(0,0,600,380);
  ctx.strokeStyle='rgba(255,215,0,.3)';ctx.lineWidth=2;ctx.strokeRect(10,10,580,360);
  ctx.font='bold 28px Georgia,serif';ctx.fillStyle='#ffd700';ctx.textAlign='center';ctx.fillText('🎻 Violin Real v7',300,50);
  ctx.font='12px Georgia,serif';ctx.fillStyle='rgba(201,169,110,.5)';ctx.fillText('바이올린 연주 카드',300,72);

  var items=[
    ['총 노트',String(stats.totalNotes||0)],
    ['최고 콤보',String(stats.bestCombo||0)],
    ['완주 곡',String(songSet.size)],
    ['레슨',lessonsDone+'/70'],
    ['업적',Object.keys(achs).length+'/34'],
    ['연습 스트릭',String(streak.current||0)+'일']
  ];
  items.forEach(function(item,i){
    var col=i%3;var row=Math.floor(i/3);
    var x=80+col*190;var y=100+row*100;
    ctx.fillStyle='rgba(255,250,235,.06)';ctx.beginPath();
    roundRect(ctx,x-60,y-10,160,70,8);ctx.fill();
    ctx.strokeStyle='rgba(255,215,0,.15)';ctx.stroke();
    ctx.font='bold 22px Georgia,serif';ctx.fillStyle='#ffd700';ctx.textAlign='center';ctx.fillText(item[1],x+20,y+25);
    ctx.font='10px Georgia,serif';ctx.fillStyle='rgba(201,169,110,.5)';ctx.fillText(item[0],x+20,y+45);
  });

  var totalDays=Object.keys(cal).length;
  ctx.font='11px Georgia,serif';ctx.fillStyle='rgba(201,169,110,.4)';ctx.textAlign='center';
  ctx.fillText('총 '+totalDays+'일 연습 \xB7 '+new Date().toISOString().slice(0,10),300,330);
  ctx.font='10px Georgia,serif';ctx.fillStyle='rgba(255,215,0,.3)';ctx.fillText('PRIME Holdings \xB7 Violin Real',300,355);

  document.getElementById('sharePanel').classList.add('show');
  var achsObj=loadAchievements();if(!achsObj.share_first)unlockAch('share_first');
}

function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}

/* ─── 12. BOWING GUIDE ─── */
var BOW_TECHNIQUES=[
  {name:'Detaché',ko:'데타셰',desc:'활을 분리하여 한 음씩 끊어서 연주하는 기본 보잉 기법. 활을 현에서 떼지 않고, 방향을 바꾸어 연주합니다.',
    tip:'활의 중간 부분을 사용하고, 일정한 압력을 유지하세요.'},
  {name:'Legato',ko:'레가토',desc:'여러 음을 한 활로 부드럽게 연결하여 연주. 음과 음 사이에 끊어짐이 없어야 합니다.',
    tip:'활 속도를 일정하게 유지하고, 활 교체 시 끊어지지 않도록 연습하세요.'},
  {name:'Staccato',ko:'스타카토',desc:'짧고 꿈어서 연주하는 기법. 활을 현에 착지시킨 채 빠르게 멈추어 음을 끊습니다.',
    tip:'손목을 빠르게 멈춰 음을 끊으세요. 활은 현 위에 남겨둡니다.'},
  {name:'Spiccato',ko:'스피카토',desc:'활을 현에서 튜기듯이 연주하는 기법. 활의 탄력성을 이용하여 가볍고 활발한 소리를 냅니다.',
    tip:'활의 중간~아래쪽을 사용하고, 자연스럽게 튜게 하세요.'},
  {name:'Tremolo',ko:'트레몰로',desc:'같은 음을 빠르게 반복하여 떨리는 듯한 효과를 내는 기법. 긴장감이나 특별한 분위기를 연출할 때 사용.',
    tip:'손목을 빠르게 움직이고, 활의 끝 부분을 사용하세요.'},
  {name:'Col legno',ko:'콜 레뉴',desc:'활의 나무 부분(등)으로 현을 두드려 연주하는 특수 기법. 독특한 타격음 효과.',
    tip:'활을 가볍게 잡고 나무 부분으로 가볍게 두드리세요.'},
  {name:'Martele',ko:'마르텔레',desc:'강하고 악센트가 있는 보입. 활을 현에 꽉 누르고 빠르게 끊어 연주합니다.',
    tip:'활을 현에 먼저 압력을 가한 후, 빠르고 강하게 끊으세요.'},
  {name:'Sul ponticello',ko:'술 폰티첼로',desc:'브릿지 근처에서 연주하여 금속적이고 비음이 많은 음색을 내는 기법.',
    tip:'브릿지 바로 옆에서 활을 가볍게 움직이세요.'}
];

function createBowGuidePanel(){
  var panel=document.createElement('div');panel.id='bowGuidePanel';
  var html='<span class="v7Close" id="bowGuideClose">&times;</span><h3>🏹 보잉 가이드</h3><div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:12px">8가지 활 기법을 배워보세요</div>';
  BOW_TECHNIQUES.forEach(function(bt){
    html+='<div class="bowCard"><div class="bcName">'+bt.name+'</div><div class="bcKo">'+bt.ko+'</div><div class="bcDesc">'+bt.desc+'</div><div class="bcTip">💡 '+bt.tip+'</div>';
    html+='<svg width="280" height="30" viewBox="0 0 280 30">';
    html+='<line x1="10" y1="20" x2="270" y2="20" stroke="rgba(201,169,110,.3)" stroke-width="2"/>';
    if(bt.name==='Detaché'){
      html+='<line x1="30" y1="12" x2="130" y2="12" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>';
      html+='<line x1="150" y1="12" x2="250" y2="12" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>';
    }else if(bt.name==='Legato'){
      html+='<line x1="20" y1="12" x2="260" y2="12" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>';
    }else if(bt.name==='Staccato'){
      for(var i=0;i<6;i++)html+='<circle cx="'+(40+i*40)+'" cy="12" r="4" fill="#ffd700"/>';
    }else if(bt.name==='Spiccato'){
      for(var i=0;i<5;i++)html+='<path d="M'+(30+i*50)+' 18 Q'+(55+i*50)+' 0 '+(80+i*50)+' 18" stroke="#ffd700" stroke-width="2" fill="none"/>';
    }else if(bt.name==='Tremolo'){
      html+='<path d="M20 12';for(var i=0;i<20;i++)html+=' L'+(20+i*12)+' '+(i%2===0?6:18);html+='" stroke="#ffd700" stroke-width="2" fill="none"/>';
    }else{
      html+='<line x1="30" y1="12" x2="250" y2="12" stroke="#ffd700" stroke-width="2" stroke-dasharray="8,6" stroke-linecap="round"/>';
    }
    html+='</svg></div>';
  });
  panel.innerHTML=html;
  document.body.appendChild(panel);
  document.getElementById('bowGuideClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

/* ─── 13. MUSIC THEORY ─── */
var theoryRead=new Set();
var THEORY_DATA={
  '음정/음정':[
    {title:'음정 (Pitch)',desc:'소리의 높낮이. 바이올린은 G3(196Hz)부터 E7(2637Hz)까지의 음역을 커버합니다.',example:'G3-D4-A4-E5 (개방현 주파수: 196-293-440-659Hz)'},
    {title:'음정 (Interval)',desc:'두 음 사이의 거리. 반음=단을 2도, 온음=장 2도, 3반음=단을 3도...',example:'C-D(장 2도), C-E(장 3도), C-G(완전 5도), C-C\'(완전 8도)'},
    {title:'반음과 온음',desc:'반음(Semitone)은 가장 작은 음정 단위. 온음(Whole tone)=반음 2개. 바이올린에서 손가락 1칸 이동 = 반음.',example:'프렛 0→1(반음), 0→2(온음), 0→3(1.5음)'}
  ],
  '조성/스케일':[
    {title:'장음계 (Major Scale)',desc:'온음-온음-반음-온음-온음-온음-반음 패턴. 밝고 활기찬 느낌.',example:'C Major: C-D-E-F-G-A-B-C (조표 없음)'},
    {title:'단음계 (Minor Scale)',desc:'온음-반음-온음-온음-반음-온음-온음 패턴. 슬프고 서정적인 느낌.',example:'A minor: A-B-C-D-E-F-G-A (조표 없음, C Major의 나란히단조)'},
    {title:'조표 (Key Signature)',desc:'악보 시작에 표시되는 샵(♯)이나 플랫(♭). 해당 음을 반음 올리거나 내립니다.',example:'G Major: ♯1개(F♯), D Major: ♯2개(F♯,C♯)'}
  ],
  '박자/리듬':[
    {title:'박자표 (Time Signature)',desc:'한 마디의 박 수와 기본 박 단위. 4/4=4분음표 기준 4박, 3/4=3박(왔츠).',example:'4/4(보통박자), 3/4(왔츠), 6/8(복합박자)'},
    {title:'음표 길이',desc:'온음표(4박), 2분음표(2박), 4분음표(1박), 8분음표(0.5박), 16분음표(0.25박).',example:'온음표 ♩=4박, ♪=1박, ♬=0.5박'},
    {title:'붙임점 (Dot)',desc:'음표 옆의 점. 원래 길이의 50%를 추가합니다. 붙임 2분음표 = 3박.',example:'붙임 4분음표 = 1.5박, 붙임 2분음표 = 3박'}
  ],
  '바이올린 기초':[
    {title:'현의 이름',desc:'G현(196Hz)이 가장 낮고, D현(293Hz), A현(440Hz), E현(659Hz)이 가장 높습니다.',example:'G(4번현) - D(3번현) - A(2번현) - E(1번현)'},
    {title:'포지션',desc:'1포지션: 손가락이 넓목 근처. 3포지션: 손이 본체 위쪽으로 이동.',example:'이 앱에서 프렛 0-7은 대략 1-4포지션에 해당'},
    {title:'비브라토',desc:'손가락을 빠르게 흔들어 음을 떨리는 기법. 손목을 축으로 움직입니다.',example:'초속 5-6Hz, 폭 20-30센트 정도가 일반적'}
  ],
  '음악 용어':[
    {title:'Forte (f)',desc:'강하게 연주. 활의 압력과 속도를 늘립니다.',example:'ff(매우 강하게), fff(가장 강하게)'},
    {title:'Piano (p)',desc:'여리게 연주. 활의 압력과 속도를 줄입니다.',example:'pp(매우 여리게), ppp(가장 여리게)'},
    {title:'Crescendo / Diminuendo',desc:'점점 강하게(<) / 점점 여리게(>). 활 압력을 점진적으로 변화.',example:'cresc. = <, dim. = >, decrescendo라고도 함'}
  ]
};

function createTheoryPanel(){
  var panel=document.createElement('div');panel.id='theoryPanel';
  panel.innerHTML='<span class="v7Close" id="theoryClose">&times;</span><h3>📖 음악 이론</h3><div class="theoryTabs" id="theoryTabs"></div><div class="theoryContent" id="theoryContent"></div>';
  document.body.appendChild(panel);
  document.getElementById('theoryClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  var tabs=document.getElementById('theoryTabs');
  var categories=Object.keys(THEORY_DATA);
  categories.forEach(function(cat,idx){
    var tab=document.createElement('div');tab.className='theoryTab'+(idx===0?' active':'');tab.textContent=cat;
    tab.addEventListener('pointerdown',function(e){e.preventDefault();
      tabs.querySelectorAll('.theoryTab').forEach(function(t){t.classList.remove('active');});tab.classList.add('active');renderTheory(cat);});
    tabs.appendChild(tab);
  });
}

function renderTheory(category){
  v7Sfx('theory');
  var content=document.getElementById('theoryContent');content.innerHTML='';
  THEORY_DATA[category].forEach(function(item){
    theoryRead.add(item.title);
    var div=document.createElement('div');div.className='theoryItem';
    div.innerHTML='<div class="tiTitle">'+item.title+'</div><div class="tiDesc">'+item.desc+'</div><div class="tiExample">예) '+item.example+'</div>';
    content.appendChild(div);
  });
  if(theoryRead.size>=5){var achs=loadAchievements();if(!achs.theory_reader)unlockAch('theory_reader');}
}

/* ─── 14. HOOK EXISTING FUNCTIONS FOR DAILY TRACKING ─── */
(function hookTracking(){
  markToday();

  var origTrackNote=window.trackNote;
  if(origTrackNote){
    window.trackNote=function(){origTrackNote();updateDailyProgress('notes',1);updateDailyProgress('pizz',0);};
  }

  var origFinishRhythm=window.finishRhythm;
  if(origFinishRhythm){
    window.finishRhythm=function(){
      var rs=window.rhythmState;
      origFinishRhythm.apply(this,arguments);
      updateDailyProgress('songs',1);
      if(rs&&rs.combo)updateDailyProgress('combo',0);
      if(rs){
        var pCount=(rs.perfect||0);updateDailyProgress('perfects',pCount);
        var songKey=rs.songKey||'';if(SONGS[songKey]&&SONGS[songKey].difficulty==='hard')updateDailyProgress('hard_songs',1);
      }
    };
  }

  var origFinishPerf=window.finishPerformance;
  if(origFinishPerf){
    window.finishPerformance=function(){
      var ps=window.perfState;
      origFinishPerf.apply(this,arguments);
      updateDailyProgress('songs',1);
      if(ps){
        var pCount=(ps.perfect||0);updateDailyProgress('perfects',pCount);
        var songKey=ps.songKey||'';if(SONGS[songKey]&&SONGS[songKey].difficulty==='hard')updateDailyProgress('hard_songs',1);
      }
    };
  }

  var origStartRec=window.startRecording;
  if(typeof origStartRec==='function'){
    window.startRecording=function(){origStartRec.apply(this,arguments);updateDailyProgress('recordings',1);};
  }

  var origStartTuner=window.startTuner;
  if(typeof origStartTuner==='function'){
    window.startTuner=function(){origStartTuner.apply(this,arguments);updateDailyProgress('tuner',1);};
  }

  setInterval(function(){updateDailyProgress('minutes',1);},60000);
})();

/* ─── 15. UI INTEGRATION ─── */
(function integrateUI(){
  createDailyPanel();createScalePanel();createCalPanel();createSharePanel();createBowGuidePanel();createTheoryPanel();

  var hdBtns=document.getElementById('hdBtns');if(!hdBtns)return;

  var dailyBadge=document.createElement('div');dailyBadge.id='dailyBadge';dailyBadge.className='dailyBadge pulse';dailyBadge.textContent='🎯 0/3';dailyBadge.setAttribute('role','button');dailyBadge.setAttribute('tabindex','0');
  hdBtns.insertBefore(dailyBadge,hdBtns.firstChild);
  dailyBadge.addEventListener('pointerdown',function(e){e.preventDefault();showDailyPanel();});

  var scaleBtn=document.createElement('div');scaleBtn.className='v6Btn';scaleBtn.title='스케일 (S)';scaleBtn.textContent='🎼';scaleBtn.setAttribute('role','button');scaleBtn.setAttribute('tabindex','0');
  hdBtns.insertBefore(scaleBtn,dailyBadge.nextSibling);
  scaleBtn.addEventListener('pointerdown',function(e){e.preventDefault();showScalePanel();});

  var calBtn=document.createElement('div');calBtn.className='v6Btn';calBtn.title='캘린더 (C)';calBtn.textContent='📅';calBtn.setAttribute('role','button');calBtn.setAttribute('tabindex','0');
  hdBtns.insertBefore(calBtn,scaleBtn.nextSibling);
  calBtn.addEventListener('pointerdown',function(e){e.preventDefault();showCalPanel();});

  var shareBtn=document.createElement('div');shareBtn.className='v6Btn';shareBtn.title='공유 카드';shareBtn.textContent='📤';shareBtn.setAttribute('role','button');shareBtn.setAttribute('tabindex','0');
  hdBtns.insertBefore(shareBtn,calBtn.nextSibling);
  shareBtn.addEventListener('pointerdown',function(e){e.preventDefault();showShareCard();});

  var bowBtn=document.createElement('div');bowBtn.className='v6Btn';bowBtn.title='보잉 가이드 (B)';bowBtn.textContent='🏹';bowBtn.setAttribute('role','button');bowBtn.setAttribute('tabindex','0');
  hdBtns.insertBefore(bowBtn,shareBtn.nextSibling);
  bowBtn.addEventListener('pointerdown',function(e){e.preventDefault();v7Sfx('bow_guide');document.getElementById('bowGuidePanel').classList.add('show');});

  var theoryBtn=document.createElement('div');theoryBtn.className='v6Btn';theoryBtn.title='음악이론 (T)';theoryBtn.textContent='📖';theoryBtn.setAttribute('role','button');theoryBtn.setAttribute('tabindex','0');
  hdBtns.insertBefore(theoryBtn,bowBtn.nextSibling);
  theoryBtn.addEventListener('pointerdown',function(e){e.preventDefault();document.getElementById('theoryPanel').classList.add('show');renderTheory(Object.keys(THEORY_DATA)[0]);});

  updateDailyBadge();

  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    if(e.key==='s'||e.key==='S'){showScalePanel();}
    if(e.key==='c'&&!e.ctrlKey&&!e.metaKey){showCalPanel();}
    if(e.key==='b'||e.key==='B'){v7Sfx('bow_guide');document.getElementById('bowGuidePanel').classList.add('show');}
    if(e.key==='t'&&!e.ctrlKey){document.getElementById('theoryPanel').classList.add('show');renderTheory(Object.keys(THEORY_DATA)[0]);}
    if(e.key==='Escape'){
      document.querySelectorAll('#dailyPanel,#scalePanel,#calPanel,#sharePanel,#bowGuidePanel,#theoryPanel').forEach(function(p){p.classList.remove('show');});
    }
  });

  var titleEl=document.querySelector('#hd h1');
  if(titleEl)titleEl.innerHTML='🎻 Violin Real <span style="font-size:8px;color:#ffd700;vertical-align:super">v7</span>';
  var logoEl=document.getElementById('logo');
  if(logoEl)logoEl.textContent='Violin Real v7';
})();

window.VIOLIN_VERSION='7.0';
})();
