/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v8.0 PATCH MODULE
   음정트레이닝+앙상블모드+핑거링차트+시보드리더+연습분석+
   10곡추가(44→54)+10레슨(70→80)+12업적(34→46)+SFX6종
   ═══════════════════════════════════════════════════════════ */
(function V8Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V8_LOADED)return;window.__V8_LOADED=true;

/* ─── 1. CSS INJECTION ─── */
var sty=document.createElement('style');
sty.textContent=`
#hd h1::after{content:' → v8'!important;font-size:8px;color:#ffd700;opacity:.6;}

/* Interval Training */
#intervalPanel{display:none;position:fixed;inset:0;z-index:215;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#intervalPanel.show{display:flex;}
#intervalPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.intQuestion{font-size:28px;color:#ffd700;font-weight:900;margin:20px 0 8px;
  text-shadow:0 0 15px rgba(255,215,0,.4);}
.intOptions{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;max-width:320px;margin:12px 0;}
.intOpt{padding:14px 8px;border-radius:10px;text-align:center;font-size:12px;font-weight:700;
  cursor:pointer;border:2px solid rgba(255,215,0,.2);color:rgba(240,230,200,.7);
  background:rgba(255,250,235,.05);transition:all .2s;}
.intOpt:active{transform:scale(.95);}
.intOpt.correct{border-color:#44ee44;background:rgba(68,238,68,.12);color:#44ee44;}
.intOpt.wrong{border-color:#ff4444;background:rgba(255,68,68,.1);color:#ff4444;}
.intScore{display:flex;gap:20px;justify-content:center;margin:8px 0;}
.intScoreItem{text-align:center;}
.intScoreItem .isVal{font-size:24px;color:#ffd700;font-weight:700;}
.intScoreItem .isLbl{font-size:9px;color:rgba(201,169,110,.4);margin-top:2px;}
.intPlayBtn{padding:10px 24px;border-radius:24px;font-size:13px;cursor:pointer;
  border:2px solid rgba(255,215,0,.4);color:#ffd700;background:rgba(255,215,0,.08);
  font-family:Georgia,serif;transition:all .2s;margin:8px 0;}
.intPlayBtn:active{background:rgba(255,215,0,.2);transform:scale(.96);}
.intProgress{width:100%;max-width:320px;height:6px;background:rgba(255,255,255,.06);
  border-radius:3px;margin:12px 0;overflow:hidden;}
.intProgressFill{height:100%;background:linear-gradient(90deg,#ffd700,#44ee44);border-radius:3px;
  transition:width .4s;}
.intStreak{font-size:11px;color:#ff6644;font-weight:700;margin:4px 0;}

/* Ensemble Mode */
#ensemblePanel{display:none;position:fixed;inset:0;z-index:215;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#ensemblePanel.show{display:flex;}
#ensemblePanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.ensTrackRow{display:flex;align-items:center;gap:8px;width:100%;max-width:360px;
  padding:10px;margin:4px 0;background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;transition:all .15s;}
.ensTrackRow.playing{border-color:rgba(68,238,68,.4);background:rgba(68,238,68,.05);}
.ensIcon{font-size:20px;width:36px;text-align:center;}
.ensInfo{flex:1;}
.ensInfo .ensName{font-size:12px;color:#ffd700;font-weight:700;}
.ensInfo .ensDesc{font-size:9px;color:rgba(201,169,110,.4);margin-top:2px;}
.ensPlayBtn{width:36px;height:36px;border-radius:50%;border:2px solid rgba(255,215,0,.3);
  background:rgba(255,215,0,.08);color:#ffd700;font-size:14px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:all .15s;}
.ensPlayBtn:active{background:rgba(255,215,0,.2);}
.ensPlayBtn.active{border-color:#44ee44;color:#44ee44;background:rgba(68,238,68,.08);}
.ensVolRow{display:flex;align-items:center;gap:6px;width:100%;max-width:360px;margin:4px 0;}
.ensVolRow label{font-size:10px;color:rgba(201,169,110,.5);min-width:50px;}
.ensVolRow input{flex:1;accent-color:#ffd700;height:3px;}

/* Fingering Chart */
#fingerPanel{display:none;position:fixed;inset:0;z-index:215;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#fingerPanel.show{display:flex;}
#fingerPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.fingerPosRow{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:8px 0;}
.fingerPosBtn{padding:5px 12px;border-radius:12px;font-size:10px;cursor:pointer;
  border:1px solid rgba(255,215,0,.2);color:rgba(240,230,200,.6);
  background:rgba(255,250,235,.04);transition:all .15s;}
.fingerPosBtn.active{background:rgba(255,215,0,.15);border-color:rgba(255,215,0,.4);color:#ffd700;}
.fingerChart{width:100%;max-width:360px;margin:8px 0;}
.fingerStringRow{display:flex;align-items:center;gap:6px;padding:8px 0;
  border-bottom:1px solid rgba(255,255,255,.04);}
.fingerStringLabel{width:32px;font-size:12px;font-weight:700;text-align:center;}
.fingerStringLabel[data-s='0']{color:#44ee44;}
.fingerStringLabel[data-s='1']{color:#cc55ff;}
.fingerStringLabel[data-s='2']{color:#44ddee;}
.fingerStringLabel[data-s='3']{color:#ffdd33;}
.fingerDots{display:flex;gap:4px;flex:1;}
.fingerDot{width:32px;height:32px;border-radius:50%;display:flex;flex-direction:column;
  align-items:center;justify-content:center;font-size:9px;font-weight:700;
  border:2px solid rgba(255,215,0,.2);color:rgba(240,230,200,.6);
  background:rgba(255,250,235,.04);cursor:pointer;transition:all .15s;}
.fingerDot:active{transform:scale(.9);}
.fingerDot.active{border-color:#ffd700;color:#ffd700;background:rgba(255,215,0,.12);}
.fingerDot .fdNote{font-size:7px;color:rgba(201,169,110,.4);margin-top:1px;}

/* Sight Reading */
#sightPanel{display:none;position:fixed;inset:0;z-index:215;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;}
#sightPanel.show{display:flex;}
#sightPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#sightCanvas{border-radius:8px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;}
.sightControls{display:flex;gap:8px;margin:12px 0;flex-wrap:wrap;justify-content:center;}
.sightBtn{padding:6px 14px;border-radius:8px;font-size:11px;cursor:pointer;
  border:1px solid rgba(255,215,0,.2);color:rgba(240,230,200,.7);
  background:rgba(255,250,235,.05);font-family:Georgia,serif;transition:all .15s;}
.sightBtn:active{background:rgba(255,215,0,.15);}
.sightBtn.active{border-color:rgba(255,215,0,.5);color:#ffd700;background:rgba(255,215,0,.1);}
.sightFeedback{font-size:14px;font-weight:700;margin:8px 0;min-height:24px;text-align:center;}

/* Practice Analytics */
#analyticsPanel{display:none;position:fixed;inset:0;z-index:215;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#analyticsPanel.show{display:flex;}
#analyticsPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.anaSection{width:100%;max-width:360px;margin:8px 0;padding:12px;
  background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.08);border-radius:10px;}
.anaSection .anaTitle{font-size:12px;color:#ffd700;font-weight:700;margin-bottom:8px;}
.anaBar{display:flex;align-items:center;gap:6px;margin:4px 0;}
.anaBar .anaLabel{font-size:10px;color:rgba(201,169,110,.5);min-width:60px;}
.anaBar .anaTrack{flex:1;height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden;}
.anaBar .anaFill{height:100%;border-radius:4px;transition:width .5s;}
.anaBar .anaVal{font-size:10px;color:#ffd700;min-width:30px;text-align:right;}
.anaRec{padding:10px;margin:4px 0;background:rgba(255,215,0,.05);border-radius:8px;
  border-left:3px solid rgba(255,215,0,.3);}
.anaRec .arTitle{font-size:11px;color:#ffd700;font-weight:600;}
.anaRec .arDesc{font-size:10px;color:rgba(201,169,110,.5);margin-top:3px;line-height:1.5;}

/* v8 quick action row */
.v8QuickRow{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:4px 0;padding:0 4px;}

/* v8 close button */
.v8Close{position:fixed;top:12px;right:16px;z-index:220;font-size:20px;color:#c9a96e;cursor:pointer;
  background:rgba(0,0,0,.5);border-radius:50%;width:32px;height:32px;
  display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,215,0,.2);}
.v8Close:active{background:rgba(255,215,0,.15);}
`;
document.head.appendChild(sty);

/* ─── 2. WEB AUDIO SFX 6종 ─── */
function v8Sfx(type){
  if(typeof AE==='undefined'||!AE.getCtx)return;
  try{AE.res();}catch(e){return;}
  var ctx=AE.getCtx();if(!ctx)return;
  var t=ctx.currentTime;
  var g=ctx.createGain();g.gain.setValueAtTime(0,t);g.connect(ctx.destination);
  if(type==='interval_correct'){
    g.gain.linearRampToValueAtTime(.1,t+.02);g.gain.linearRampToValueAtTime(0,t+.4);
    [523.25,659.25,783.99].forEach(function(f,i){var o=ctx.createOscillator();o.type='sine';o.frequency.value=f;
      var og=ctx.createGain();og.gain.value=.2;o.connect(og);og.connect(g);o.start(t+i*.05);o.stop(t+.4);});
  }else if(type==='interval_wrong'){
    g.gain.linearRampToValueAtTime(.08,t+.01);g.gain.linearRampToValueAtTime(0,t+.3);
    var o=ctx.createOscillator();o.type='square';o.frequency.value=200;
    var lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=400;
    o.connect(lp);lp.connect(g);o.start(t);o.stop(t+.3);
  }else if(type==='ensemble_start'){
    g.gain.linearRampToValueAtTime(.08,t+.02);g.gain.linearRampToValueAtTime(0,t+.5);
    [392,493.88,587.33].forEach(function(f,i){var o=ctx.createOscillator();o.type='sine';o.frequency.value=f;
      o.connect(g);o.start(t+i*.08);o.stop(t+.5);});
  }else if(type==='finger_tap'){
    g.gain.linearRampToValueAtTime(.06,t+.01);g.gain.linearRampToValueAtTime(0,t+.15);
    var o=ctx.createOscillator();o.type='triangle';o.frequency.value=1200;o.connect(g);o.start(t);o.stop(t+.15);
  }else if(type==='sight_correct'){
    g.gain.linearRampToValueAtTime(.09,t+.02);g.gain.linearRampToValueAtTime(0,t+.35);
    [659.25,880].forEach(function(f,i){var o=ctx.createOscillator();o.type='sine';o.frequency.value=f;
      o.connect(g);o.start(t+i*.06);o.stop(t+.35);});
  }else if(type==='analytics'){
    g.gain.linearRampToValueAtTime(.06,t+.02);g.gain.linearRampToValueAtTime(0,t+.3);
    var o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(440,t);
    o.frequency.linearRampToValueAtTime(880,t+.3);o.connect(g);o.start(t);o.stop(t+.3);
  }
}

/* ─── 3. NEW SONGS (+10곡, 총 54곡) ─── */
(function addSongs(){
  if(typeof SONGS==='undefined')return;
  SONGS['봄노래']={name:'봄노래 (멘델스존)',category:'클래식',difficulty:'medium',bpm:88,
    notes:[
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C#5',dur:1,s:2,f:4},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C#5',dur:.5,s:2,f:4},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'F#5',dur:1,s:3,f:2},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C#5',dur:1,s:2,f:4},
      {note:'B4',dur:2,s:2,f:2},{note:'A4',dur:2,s:2,f:0},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C#5',dur:.5,s:2,f:4},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'A5',dur:1.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},{note:'F#5',dur:1,s:3,f:2},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C#5',dur:.5,s:2,f:4},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:3,s:2,f:0}
    ]};
  SONGS['유머레스크']={name:'유머레스크 (드보르작)',category:'클래식',difficulty:'medium',bpm:72,
    notes:[
      {note:'G5',dur:.5,s:3,f:3},{note:'F#5',dur:.5,s:3,f:2},{note:'G5',dur:1,s:3,f:3},{note:'E5',dur:1,s:3,f:0},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:2,s:3,f:0},
      {note:'G5',dur:.5,s:3,f:3},{note:'F#5',dur:.5,s:3,f:2},{note:'G5',dur:1,s:3,f:3},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:2,s:2,f:5},{note:'G4',dur:2,s:1,f:5},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:1.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:1,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:3,s:2,f:3}
    ]};
  SONGS['차르다시']={name:'차르다시 (몬티)',category:'클래식',difficulty:'hard',bpm:68,
    notes:[
      {note:'D5',dur:2,s:2,f:5},{note:'C#5',dur:1,s:2,f:4},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C#5',dur:1,s:2,f:4},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:2,s:2,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'F5',dur:1,s:3,f:1},{note:'A5',dur:1.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},
      {note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C#5',dur:1,s:2,f:4},
      {note:'D5',dur:1.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'C#5',dur:1,s:2,f:4},{note:'D5',dur:3,s:2,f:5}
    ]};
  SONGS['카바티나']={name:'카바티나 (라프)',category:'클래식',difficulty:'medium',bpm:60,
    notes:[
      {note:'E5',dur:2,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'F5',dur:2,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:1.5,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:2,s:2,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:2,s:2,f:2},
      {note:'C5',dur:3,s:2,f:3}
    ]};
  SONGS['들장미']={name:'들장미 (슈베르트)',category:'클래식',difficulty:'easy',bpm:92,
    notes:[
      {note:'C5',dur:1,s:2,f:3},{note:'C5',dur:.5,s:2,f:3},{note:'D5',dur:.5,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},{note:'E5',dur:.5,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},
      {note:'G5',dur:2,s:3,f:3},
      {note:'G5',dur:1,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:2,s:2,f:3},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:2,s:2,f:3},{note:'R',dur:2,s:-1,f:0}
    ]};
  SONGS['올드랭사인']={name:'올드 랭 사인 (Auld Lang Syne)',category:'서양민요',difficulty:'easy',bpm:96,
    notes:[
      {note:'G4',dur:1,s:1,f:5},{note:'C5',dur:1.5,s:2,f:3},{note:'C5',dur:.5,s:2,f:3},
      {note:'C5',dur:1,s:2,f:3},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:1,s:2,f:3},{note:'E5',dur:1,s:3,f:0},
      {note:'G5',dur:2,s:3,f:3},{note:'A5',dur:1,s:3,f:5},
      {note:'G5',dur:1.5,s:3,f:3},{note:'E5',dur:.5,s:3,f:0},{note:'E5',dur:1,s:3,f:0},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C5',dur:1.5,s:2,f:3},{note:'A4',dur:.5,s:2,f:0},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'C5',dur:3,s:2,f:3}
    ]};
  SONGS['피가로결혼']={name:'피가로의 결혼 서곡 (모차르트)',category:'클래식',difficulty:'hard',bpm:140,
    notes:[
      {note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},{note:'G5',dur:.5,s:3,f:3},
      {note:'A5',dur:1,s:3,f:5},{note:'A5',dur:.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},
      {note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},{note:'G5',dur:.5,s:3,f:3},
      {note:'A5',dur:1,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:.5,s:2,f:3},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'C5',dur:.5,s:2,f:3},
      {note:'D5',dur:2,s:2,f:5}
    ]};
  SONGS['캐논변주']={name:'캐논 변주곡 (파헬벨)',category:'클래식',difficulty:'medium',bpm:66,
    notes:[
      {note:'F#5',dur:2,s:3,f:2},{note:'E5',dur:2,s:3,f:0},
      {note:'D5',dur:2,s:2,f:5},{note:'C#5',dur:2,s:2,f:4},
      {note:'B4',dur:2,s:2,f:2},{note:'A4',dur:2,s:2,f:0},
      {note:'B4',dur:2,s:2,f:2},{note:'C#5',dur:2,s:2,f:4},
      {note:'D5',dur:1,s:2,f:5},{note:'C#5',dur:1,s:2,f:4},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'F#4',dur:1,s:1,f:4},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},
      {note:'B4',dur:1,s:2,f:2},{note:'C#5',dur:1,s:2,f:4},{note:'D5',dur:1,s:2,f:5},{note:'F#5',dur:1,s:3,f:2},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'C#5',dur:1,s:2,f:4},
      {note:'D5',dur:3,s:2,f:5}
    ]};
  SONGS['고향생각']={name:'고향의 봄',category:'민요',difficulty:'easy',bpm:84,
    notes:[
      {note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},{note:'F5',dur:1,s:3,f:1},{note:'G5',dur:1,s:3,f:3},
      {note:'G5',dur:1,s:3,f:3},{note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'E5',dur:1.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'D5',dur:2,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'E5',dur:1,s:3,f:0},{note:'F5',dur:1,s:3,f:1},{note:'G5',dur:1,s:3,f:3},
      {note:'G5',dur:1,s:3,f:3},{note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'C5',dur:2,s:2,f:3},{note:'R',dur:2,s:-1,f:0}
    ]};
  SONGS['세레나데슈']={name:'세레나데 (슈베르트)',category:'클래식',difficulty:'medium',bpm:54,
    notes:[
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},
      {note:'F5',dur:1.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:2,s:2,f:3},
      {note:'E5',dur:1,s:3,f:0},{note:'F5',dur:.5,s:3,f:1},{note:'G5',dur:.5,s:3,f:3},
      {note:'A5',dur:1.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},{note:'F5',dur:1,s:3,f:1},
      {note:'E5',dur:2,s:3,f:0},
      {note:'G5',dur:1,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},
      {note:'C5',dur:3,s:2,f:3}
    ]};

  if(typeof CHORDS!=='undefined'){
    CHORDS['봄노래']=[[440,554.37,659.25],[329.63,440,523.25]];
    CHORDS['유머레스크']=[[261.63,329.63,392],[196,246.94,293.66]];
    CHORDS['차르다시']=[[293.66,369.99,440],[440,523.25,659.25]];
    CHORDS['카바티나']=[[261.63,329.63,392],[196,246.94,293.66]];
    CHORDS['들장미']=[[261.63,329.63,392],[349.23,440,523.25]];
    CHORDS['올드랭사인']=[[261.63,329.63,392],[349.23,440,523.25]];
    CHORDS['피가로결혼']=[[293.66,369.99,440],[261.63,329.63,392]];
    CHORDS['캐논변주']=[[293.66,369.99,440],[440,554.37,659.25]];
    CHORDS['고향생각']=[[261.63,329.63,392],[349.23,440,523.25]];
    CHORDS['세레나데슈']=[[261.63,329.63,392],[440,523.25,659.25]];
  }
})();

/* ─── 4. NEW LESSONS (71-80) ─── */
(function addLessons(){
  if(typeof LESSONS==='undefined')return;
  LESSONS.push({lv:71,title:'음정: 장2도',desc:'C-D, D-E 같은 장2도 음정 연습',targets:[{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:5,count:1}]});
  LESSONS.push({lv:72,title:'음정: 장3도',desc:'C-E, D-F# 같은 장3도 음정 연습',targets:[{s:2,f:3,count:1},{s:3,f:0,count:1},{s:2,f:3,count:1},{s:3,f:0,count:1},{s:1,f:0,count:1},{s:1,f:4,count:1}]});
  LESSONS.push({lv:73,title:'음정: 완전5도',desc:'C-G, D-A 같은 완전5도 음정 연습',targets:[{s:2,f:3,count:1},{s:3,f:3,count:1},{s:1,f:0,count:1},{s:2,f:0,count:1},{s:0,f:0,count:1},{s:1,f:0,count:1}]});
  LESSONS.push({lv:74,title:'옥타브 점프',desc:'같은 음의 1옥타브 간격 연습',targets:[{s:1,f:0,count:1},{s:2,f:5,count:1},{s:1,f:0,count:1},{s:2,f:5,count:1},{s:2,f:0,count:1},{s:3,f:5,count:1}]});
  LESSONS.push({lv:75,title:'B♭장조 스케일',desc:'B♭-C-D-E♭-F-G-A-B♭ 순서대로',targets:[{s:0,f:3,count:1},{s:0,f:5,count:1},{s:1,f:0,count:1},{s:1,f:1,count:1},{s:1,f:3,count:1},{s:1,f:5,count:1},{s:2,f:0,count:1},{s:2,f:1,count:1}]});
  LESSONS.push({lv:76,title:'3포지션 전환',desc:'1포지션에서 3포지션 이동 연습',targets:[{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:5,count:1},{s:2,f:6,count:1},{s:2,f:7,count:1}]});
  LESSONS.push({lv:77,title:'앙상블: 캐논',desc:'캐논 변주곡 반주와 합주 연습',targets:[{s:3,f:2,count:1},{s:3,f:0,count:1},{s:2,f:5,count:1},{s:2,f:4,count:1},{s:2,f:2,count:1},{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:4,count:1}]});
  LESSONS.push({lv:78,title:'시보드: 오선지 읽기',desc:'오선지의 음표 위치를 빠르게 인식',targets:[{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:5,count:1},{s:3,f:0,count:1},{s:3,f:2,count:1},{s:3,f:3,count:1},{s:3,f:5,count:1}]});
  LESSONS.push({lv:79,title:'차르다시 도입부',desc:'차르다시의 느린 라산(Lassan) 부분',targets:[{s:2,f:5,count:1},{s:2,f:4,count:1},{s:2,f:5,count:1},{s:3,f:0,count:1},{s:3,f:1,count:1},{s:3,f:0,count:1},{s:2,f:5,count:1}]});
  LESSONS.push({lv:80,title:'v8 졸업 시험',desc:'4현 모든 자연음 + 반음 완주',targets:[
    {s:0,f:0,count:1},{s:0,f:2,count:1},{s:0,f:3,count:1},{s:0,f:5,count:1},{s:0,f:7,count:1},
    {s:1,f:0,count:1},{s:1,f:2,count:1},{s:1,f:3,count:1},{s:1,f:5,count:1},{s:1,f:7,count:1},
    {s:2,f:0,count:1},{s:2,f:1,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:4,count:1},{s:2,f:5,count:1},{s:2,f:7,count:1},
    {s:3,f:0,count:1},{s:3,f:1,count:1},{s:3,f:2,count:1},{s:3,f:3,count:1},{s:3,f:4,count:1},{s:3,f:5,count:1},{s:3,f:7,count:1}
  ]});
})();

/* ─── 5. NEW ACHIEVEMENTS (+12, 총 46개) ─── */
(function addAchievements(){
  if(typeof ACHIEVEMENTS==='undefined')return;
  ACHIEVEMENTS.push(
    {id:'lesson_80',name:'전설의 대가',desc:'80개 레슨을 모두 완료했습니다',icon:'👑'},
    {id:'songs_50',name:'반세기 레퍼토리',desc:'50개 곡을 완주했습니다',icon:'🎶'},
    {id:'interval_master',name:'음정 마스터',desc:'음정 트레이닝 10라운드를 완료했습니다',icon:'🎯'},
    {id:'interval_streak',name:'음정 연속',desc:'음정 트레이닝에서 10연속 정답',icon:'⚡'},
    {id:'ensemble_play',name:'앙상블리스트',desc:'앙상블 모드로 3곡 반주와 연주했습니다',icon:'🎭'},
    {id:'sight_reader',name:'시보드 리더',desc:'시보드 리딩 20문제를 정답',icon:'📄'},
    {id:'fingering_all',name:'핑거링 탐험가',desc:'핑거링 차트에서 4포지션을 모두 조회했습니다',icon:'🤚'},
    {id:'analytics_check',name:'데이터 분석가',desc:'연습 분석을 3회 확인했습니다',icon:'📊'},
    {id:'perfect_200',name:'완벽의 경지',desc:'총 200회 Perfect 판정을 받았습니다',icon:'💎'},
    {id:'notes_5000',name:'5000노트 연주자',desc:'총 5000개 노트를 연주했습니다',icon:'🎵'},
    {id:'daily_streak_14',name:'2주 챌린저',desc:'14일 연속 일일챌린지를 완료했습니다',icon:'🔥'},
    {id:'all_modes',name:'올라운더',desc:'자유연주/리듬/학습/곡연주 4모드를 모두 사용했습니다',icon:'🌟'}
  );
})();

/* ─── 6. PATCH ACHIEVEMENT CHECKER ─── */
(function patchAchCheck(){
  var origCheck=window.checkAchievements;
  if(!origCheck)return;
  window.checkAchievements=function(){
    origCheck();
    var p=loadProgress();var achs=loadAchievements();var stats=loadStats();
    var lessonsDone=0;for(var i=1;i<=80;i++){if(p['lesson_'+i])lessonsDone++;}
    if(lessonsDone>=80&&!achs.lesson_80)unlockAch('lesson_80');
    var songSet=new Set();
    Object.keys(p).forEach(function(k){
      if(k.startsWith('rhythm_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^rhythm_/,''));
      if(k.startsWith('perform_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^perform_/,''));
    });
    if(songSet.size>=50&&!achs.songs_50)unlockAch('songs_50');
    if((stats.totalPerfects||0)>=200&&!achs.perfect_200)unlockAch('perfect_200');
    if((stats.totalNotes||0)>=5000&&!achs.notes_5000)unlockAch('notes_5000');
    var dailyData=typeof loadDailyData==='function'?loadDailyData():{};
    if(dailyData.streak>=14&&!achs.daily_streak_14)unlockAch('daily_streak_14');
    var modes=JSON.parse(localStorage.getItem('violinV8_modes')||'{}');
    if(modes.free&&modes.rhythm&&modes.learn&&modes.perform&&!achs.all_modes)unlockAch('all_modes');
  };
})();

/* ─── 7. PATCH STATS DISPLAY ─── */
(function patchStats(){
  var origUpdate=window.updateStatsPanel;
  if(!origUpdate)return;
  window.updateStatsPanel=function(){
    origUpdate();
    var el=document.getElementById('statAch');
    if(el){var achs=loadAchievements();el.textContent=Object.keys(achs).length+'/46';}
    var lesEl=document.getElementById('statLessons');
    if(lesEl){var p=loadProgress();var done=0;for(var i=1;i<=80;i++){if(p['lesson_'+i])done++;}lesEl.textContent=done+'/80';}
  };
})();

/* ─── 8. TRACK ALL MODES ─── */
(function trackModes(){
  var tabs=document.querySelectorAll('.mtab');
  tabs.forEach(function(tab){
    tab.addEventListener('pointerdown',function(){
      var mode=tab.dataset.mode;if(!mode)return;
      var modes=JSON.parse(localStorage.getItem('violinV8_modes')||'{}');
      modes[mode]=true;localStorage.setItem('violinV8_modes',JSON.stringify(modes));
      if(typeof checkAchievements==='function')checkAchievements();
    });
  });
})();

/* ─── 9. INTERVAL TRAINING ─── */
var INTERVALS=[
  {name:'단2도',semitones:1,example:'미-파'},
  {name:'장2도',semitones:2,example:'도-레'},
  {name:'단3도',semitones:3,example:'레-파'},
  {name:'장3도',semitones:4,example:'도-미'},
  {name:'완전4도',semitones:5,example:'도-파'},
  {name:'증4도/감5도',semitones:6,example:'파-시'},
  {name:'완전5도',semitones:7,example:'도-솔'},
  {name:'단6도',semitones:8,example:'미-도\''},
  {name:'장6도',semitones:9,example:'도-라'},
  {name:'단7도',semitones:10,example:'솔-파\''},
  {name:'장7도',semitones:11,example:'도-시'},
  {name:'완전8도',semitones:12,example:'도-도\''}
];

var intState={round:0,correct:0,wrong:0,streak:0,bestStreak:0,totalRounds:0,answered:false};
var INT_KEY='violinV8_interval';
function loadIntData(){try{return JSON.parse(localStorage.getItem(INT_KEY)||'{}');}catch(e){return {};}}
function saveIntData(d){localStorage.setItem(INT_KEY,JSON.stringify(d));}

function noteToFreq(noteStr){
  var notes={'C':261.63,'C#':277.18,'D':293.66,'D#':311.13,'E':329.63,'F':349.23,'F#':369.99,'G':392,'G#':415.3,'A':440,'A#':466.16,'B':493.88};
  var match=noteStr.match(/^([A-G]#?)(\d)$/);if(!match)return 440;
  var base=notes[match[1]]||440;var oct=parseInt(match[2])-4;
  return base*Math.pow(2,oct);
}

function playIntervalNotes(note1,note2){
  if(typeof AE==='undefined'||!AE.getCtx)return;
  try{AE.res();}catch(e){return;}
  var ctx=AE.getCtx();if(!ctx)return;
  var t=ctx.currentTime;
  [note1,note2].forEach(function(n,i){
    var freq=noteToFreq(n);
    var osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=freq;
    var g=ctx.createGain();g.gain.setValueAtTime(0,t+i*.8);
    g.gain.linearRampToValueAtTime(.12,t+i*.8+.02);
    g.gain.linearRampToValueAtTime(0,t+i*.8+.7);
    osc.connect(g);g.connect(ctx.destination);
    osc.start(t+i*.8);osc.stop(t+i*.8+.7);
  });
}

function createIntervalPanel(){
  var panel=document.createElement('div');panel.id='intervalPanel';
  panel.innerHTML='<span class="v8Close" id="intervalClose">&times;</span>'+
    '<h3>🎯 음정 트레이닝</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px">두 음을 듣고 음정을 맞추세요</div>'+
    '<div class="intScore"><div class="intScoreItem"><div class="isVal" id="intCorrect">0</div><div class="isLbl">정답</div></div>'+
    '<div class="intScoreItem"><div class="isVal" id="intWrong">0</div><div class="isLbl">오답</div></div>'+
    '<div class="intScoreItem"><div class="isVal" id="intStreak">0</div><div class="isLbl">연속</div></div></div>'+
    '<div class="intProgress"><div class="intProgressFill" id="intProgressFill" style="width:0%"></div></div>'+
    '<div class="intQuestion" id="intQuestion">🎵 → 🎵</div>'+
    '<div class="intPlayBtn" id="intPlayBtn">🔊 다시 듣기</div>'+
    '<div class="intOptions" id="intOptions"></div>'+
    '<div class="intStreak" id="intFeedback"></div>';
  document.body.appendChild(panel);
  document.getElementById('intervalClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  document.getElementById('intPlayBtn').addEventListener('pointerdown',function(e){e.preventDefault();replayInterval();});
}

var currentInterval=null;
var baseNotes=['A4','B4','C5','D5','E5','F5','G5'];

function startIntervalRound(){
  intState.answered=false;
  intState.round++;
  var baseIdx=Math.floor(Math.random()*baseNotes.length);
  var baseNote=baseNotes[baseIdx];
  var pool=INTERVALS.filter(function(iv){return iv.semitones<=12;});
  var correctIdx=Math.floor(Math.random()*pool.length);
  var correct=pool[correctIdx];
  var noteNames=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var baseFreq=noteToFreq(baseNote);
  var topFreq=baseFreq*Math.pow(2,correct.semitones/12);
  var baseMidi=Math.round(12*Math.log2(baseFreq/261.63))+60;
  var topMidi=baseMidi+correct.semitones;
  var topNoteName=noteNames[topMidi%12]+(Math.floor(topMidi/12)-1);
  currentInterval={base:baseNote,top:topNoteName,correct:correct};

  if(typeof ensureA==='function')ensureA();
  playIntervalNotes(baseNote,topNoteName);

  document.getElementById('intQuestion').textContent=baseNote+' → ?';
  document.getElementById('intCorrect').textContent=intState.correct;
  document.getElementById('intWrong').textContent=intState.wrong;
  document.getElementById('intStreak').textContent=intState.streak;
  document.getElementById('intFeedback').textContent='';
  document.getElementById('intProgressFill').style.width=Math.min(100,intState.round/10*100)+'%';

  var options=document.getElementById('intOptions');options.innerHTML='';
  var choices=[correct];
  while(choices.length<4){
    var r=pool[Math.floor(Math.random()*pool.length)];
    if(!choices.some(function(c){return c.semitones===r.semitones;}))choices.push(r);
  }
  choices.sort(function(){return Math.random()-.5;});
  choices.forEach(function(ch){
    var btn=document.createElement('div');btn.className='intOpt';
    btn.textContent=ch.name+' ('+ch.example+')';
    btn.addEventListener('pointerdown',function(e){
      e.preventDefault();if(intState.answered)return;intState.answered=true;
      if(ch.semitones===correct.semitones){
        btn.classList.add('correct');intState.correct++;intState.streak++;
        if(intState.streak>intState.bestStreak)intState.bestStreak=intState.streak;
        v8Sfx('interval_correct');
        document.getElementById('intFeedback').textContent='정답! '+correct.name+' ('+correct.semitones+'반음)';
        document.getElementById('intFeedback').style.color='#44ee44';
        if(intState.streak>=10){var achs=loadAchievements();if(!achs.interval_streak)unlockAch('interval_streak');}
      }else{
        btn.classList.add('wrong');intState.wrong++;intState.streak=0;
        v8Sfx('interval_wrong');
        options.querySelectorAll('.intOpt').forEach(function(o){
          if(o.textContent.indexOf(correct.name)===0)o.classList.add('correct');
        });
        document.getElementById('intFeedback').textContent='오답. 정답: '+correct.name;
        document.getElementById('intFeedback').style.color='#ff4444';
      }
      document.getElementById('intCorrect').textContent=intState.correct;
      document.getElementById('intWrong').textContent=intState.wrong;
      document.getElementById('intStreak').textContent=intState.streak;
      intState.totalRounds++;
      if(intState.totalRounds>=10){var achs=loadAchievements();if(!achs.interval_master)unlockAch('interval_master');}
      var d=loadIntData();d.totalRounds=(d.totalRounds||0)+1;d.bestStreak=Math.max(d.bestStreak||0,intState.bestStreak);saveIntData(d);
      if(typeof updateDailyProgress==='function')updateDailyProgress('notes',1);
      setTimeout(startIntervalRound,1500);
    });
    options.appendChild(btn);
  });
}

function replayInterval(){
  if(!currentInterval)return;
  if(typeof ensureA==='function')ensureA();
  playIntervalNotes(currentInterval.base,currentInterval.top);
}

function showIntervalPanel(){
  intState={round:0,correct:0,wrong:0,streak:0,bestStreak:0,totalRounds:loadIntData().totalRounds||0,answered:false};
  document.getElementById('intervalPanel').classList.add('show');
  startIntervalRound();
}

/* ─── 10. ENSEMBLE MODE ─── */
var ENSEMBLE_TRACKS=[
  {name:'캐논 반주',desc:'파헬벨 캐논 피아노 반주 (D장조)',key:'D',bpm:66,
    chords:[[293.66,369.99,440],[440,554.37,659.25],[246.94,311.13,369.99],[329.63,415.3,493.88],
            [196,246.94,293.66],[261.63,329.63,392],[196,246.94,293.66],[329.63,415.3,493.88]]},
  {name:'아리랑 반주',desc:'아리랑 기타 코드 반주 (A단조)',key:'Am',bpm:76,
    chords:[[440,523.25,659.25],[329.63,440,523.25],[349.23,440,523.25],[329.63,392,493.88],
            [440,523.25,659.25],[349.23,440,523.25],[261.63,329.63,392],[440,523.25,659.25]]},
  {name:'클래식 드론',desc:'A440 + E 5도 드론 배경',key:'A',bpm:60,
    chords:[[440,659.25,440],[440,659.25,440],[440,659.25,440],[440,659.25,440],
            [440,659.25,440],[440,659.25,440],[440,659.25,440],[440,659.25,440]]},
  {name:'미뉴에트 반주',desc:'바흐 미뉴에트 G장조 반주',key:'G',bpm:110,
    chords:[[196,246.94,293.66],[261.63,329.63,392],[293.66,369.99,440],[196,246.94,293.66],
            [261.63,329.63,392],[293.66,369.99,440],[196,246.94,293.66],[293.66,369.99,440]]},
  {name:'사랑의인사 반주',desc:'엘가 사랑의 인사 피아노 반주 (E장조)',key:'E',bpm:72,
    chords:[[329.63,415.3,493.88],[440,554.37,659.25],[329.63,415.3,493.88],[246.94,311.13,369.99],
            [329.63,415.3,493.88],[440,554.37,659.25],[293.66,369.99,440],[329.63,415.3,493.88]]}
];

var ensembleOscs=[];var ensembleTimer=null;var ensemblePlaying=false;
var V8_ENS_KEY='violinV8_ensemble';
function loadEnsData(){try{return JSON.parse(localStorage.getItem(V8_ENS_KEY)||'{}');}catch(e){return {};}}
function saveEnsData(d){localStorage.setItem(V8_ENS_KEY,JSON.stringify(d));}

function createEnsemblePanel(){
  var panel=document.createElement('div');panel.id='ensemblePanel';
  var html='<span class="v8Close" id="ensembleClose">&times;</span>'+
    '<h3>🎭 앙상블 모드</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:12px">반주와 함께 연주하세요</div>'+
    '<div class="ensVolRow"><label>반주 볼륨</label><input type="range" id="ensVol" min="0" max="100" value="50"></div>';
  ENSEMBLE_TRACKS.forEach(function(track,idx){
    html+='<div class="ensTrackRow" data-idx="'+idx+'">'+
      '<div class="ensIcon">🎹</div>'+
      '<div class="ensInfo"><div class="ensName">'+track.name+'</div><div class="ensDesc">'+track.desc+'</div></div>'+
      '<div class="ensPlayBtn" data-idx="'+idx+'">▶</div></div>';
  });
  panel.innerHTML=html;
  document.body.appendChild(panel);
  document.getElementById('ensembleClose').addEventListener('pointerdown',function(e){
    e.preventDefault();stopEnsemble();panel.classList.remove('show');
  });
  panel.querySelectorAll('.ensPlayBtn').forEach(function(btn){
    btn.addEventListener('pointerdown',function(e){
      e.preventDefault();
      var idx=parseInt(btn.dataset.idx);
      if(btn.classList.contains('active')){stopEnsemble();btn.classList.remove('active');btn.textContent='▶';
        btn.closest('.ensTrackRow').classList.remove('playing');
      }else{
        panel.querySelectorAll('.ensPlayBtn').forEach(function(b){b.classList.remove('active');b.textContent='▶';});
        panel.querySelectorAll('.ensTrackRow').forEach(function(r){r.classList.remove('playing');});
        startEnsemble(idx);btn.classList.add('active');btn.textContent='⏹';
        btn.closest('.ensTrackRow').classList.add('playing');
      }
    });
  });
}

function startEnsemble(idx){
  stopEnsemble();
  if(typeof ensureA==='function')ensureA();
  v8Sfx('ensemble_start');
  var track=ENSEMBLE_TRACKS[idx];
  var vol=(parseInt(document.getElementById('ensVol').value)||50)/100*0.08;
  var ctx=AE.getCtx();
  var beatDur=60/track.bpm;
  var chordIdx=0;
  ensemblePlaying=true;

  function playChord(){
    if(!ensemblePlaying)return;
    var chord=track.chords[chordIdx%track.chords.length];
    var t=ctx.currentTime;
    chord.forEach(function(freq){
      var osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=freq;
      var g=ctx.createGain();
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.05);
      g.gain.linearRampToValueAtTime(vol*.3,t+beatDur*1.8);
      g.gain.linearRampToValueAtTime(0,t+beatDur*2-.05);
      osc.connect(g);g.connect(ctx.destination);
      osc.start(t);osc.stop(t+beatDur*2);
      ensembleOscs.push({osc:osc,g:g});
    });
    chordIdx++;
    ensembleTimer=setTimeout(playChord,beatDur*2*1000);
  }
  playChord();

  var ed=loadEnsData();ed.plays=(ed.plays||0)+1;saveEnsData(ed);
  if(ed.plays>=3){var achs=loadAchievements();if(!achs.ensemble_play)unlockAch('ensemble_play');}
}

function stopEnsemble(){
  ensemblePlaying=false;
  if(ensembleTimer){clearTimeout(ensembleTimer);ensembleTimer=null;}
  ensembleOscs.forEach(function(item){
    try{var ctx=AE.getCtx();var t=ctx.currentTime;
      item.g.gain.cancelScheduledValues(t);
      item.g.gain.linearRampToValueAtTime(0,t+.1);
      setTimeout(function(){try{item.osc.stop();}catch(e){}},200);
    }catch(e){}
  });
  ensembleOscs=[];
}

/* ─── 11. FINGERING CHART ─── */
var FINGER_POSITIONS=[
  {name:'1st 포지션',pos:1,notes:[
    [{n:'G3',f:0},{n:'G#3',f:1},{n:'A3',f:2},{n:'A#3',f:3},{n:'B3',f:4},{n:'C4',f:5},{n:'C#4',f:6},{n:'D4',f:7}],
    [{n:'D4',f:0},{n:'D#4',f:1},{n:'E4',f:2},{n:'F4',f:3},{n:'F#4',f:4},{n:'G4',f:5},{n:'G#4',f:6},{n:'A4',f:7}],
    [{n:'A4',f:0},{n:'A#4',f:1},{n:'B4',f:2},{n:'C5',f:3},{n:'C#5',f:4},{n:'D5',f:5},{n:'D#5',f:6},{n:'E5',f:7}],
    [{n:'E5',f:0},{n:'F5',f:1},{n:'F#5',f:2},{n:'G5',f:3},{n:'G#5',f:4},{n:'A5',f:5},{n:'A#5',f:6},{n:'B5',f:7}]
  ]},
  {name:'3rd 포지션',pos:3,notes:[
    [{n:'B3',f:0},{n:'C4',f:1},{n:'C#4',f:2},{n:'D4',f:3},{n:'D#4',f:4},{n:'E4',f:5},{n:'F4',f:6},{n:'F#4',f:7}],
    [{n:'F#4',f:0},{n:'G4',f:1},{n:'G#4',f:2},{n:'A4',f:3},{n:'A#4',f:4},{n:'B4',f:5},{n:'C5',f:6},{n:'C#5',f:7}],
    [{n:'C#5',f:0},{n:'D5',f:1},{n:'D#5',f:2},{n:'E5',f:3},{n:'F5',f:4},{n:'F#5',f:5},{n:'G5',f:6},{n:'G#5',f:7}],
    [{n:'G#5',f:0},{n:'A5',f:1},{n:'A#5',f:2},{n:'B5',f:3},{n:'C6',f:4},{n:'C#6',f:5},{n:'D6',f:6},{n:'D#6',f:7}]
  ]},
  {name:'5th 포지션',pos:5,notes:[
    [{n:'D4',f:0},{n:'D#4',f:1},{n:'E4',f:2},{n:'F4',f:3},{n:'F#4',f:4},{n:'G4',f:5},{n:'G#4',f:6},{n:'A4',f:7}],
    [{n:'A4',f:0},{n:'A#4',f:1},{n:'B4',f:2},{n:'C5',f:3},{n:'C#5',f:4},{n:'D5',f:5},{n:'D#5',f:6},{n:'E5',f:7}],
    [{n:'E5',f:0},{n:'F5',f:1},{n:'F#5',f:2},{n:'G5',f:3},{n:'G#5',f:4},{n:'A5',f:5},{n:'A#5',f:6},{n:'B5',f:7}],
    [{n:'B5',f:0},{n:'C6',f:1},{n:'C#6',f:2},{n:'D6',f:3},{n:'D#6',f:4},{n:'E6',f:5},{n:'F6',f:6},{n:'F#6',f:7}]
  ]},
  {name:'7th 포지션',pos:7,notes:[
    [{n:'F4',f:0},{n:'F#4',f:1},{n:'G4',f:2},{n:'G#4',f:3},{n:'A4',f:4},{n:'A#4',f:5},{n:'B4',f:6},{n:'C5',f:7}],
    [{n:'C5',f:0},{n:'C#5',f:1},{n:'D5',f:2},{n:'D#5',f:3},{n:'E5',f:4},{n:'F5',f:5},{n:'F#5',f:6},{n:'G5',f:7}],
    [{n:'G5',f:0},{n:'G#5',f:1},{n:'A5',f:2},{n:'A#5',f:3},{n:'B5',f:4},{n:'C6',f:5},{n:'C#6',f:6},{n:'D6',f:7}],
    [{n:'D6',f:0},{n:'D#6',f:1},{n:'E6',f:2},{n:'F6',f:3},{n:'F#6',f:4},{n:'G6',f:5},{n:'G#6',f:6},{n:'A6',f:7}]
  ]}
];

var fingerPosViewed=new Set();

function createFingerPanel(){
  var panel=document.createElement('div');panel.id='fingerPanel';
  panel.innerHTML='<span class="v8Close" id="fingerClose">&times;</span>'+
    '<h3>🤚 핑거링 차트</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px">포지션별 음 위치를 확인하세요</div>'+
    '<div class="fingerPosRow" id="fingerPosTabs"></div>'+
    '<div class="fingerChart" id="fingerChartArea"></div>';
  document.body.appendChild(panel);
  document.getElementById('fingerClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  var tabs=document.getElementById('fingerPosTabs');
  FINGER_POSITIONS.forEach(function(fp,idx){
    var btn=document.createElement('div');btn.className='fingerPosBtn'+(idx===0?' active':'');
    btn.textContent=fp.name;btn.dataset.idx=idx;
    btn.addEventListener('pointerdown',function(e){e.preventDefault();
      tabs.querySelectorAll('.fingerPosBtn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');renderFingerChart(idx);
    });
    tabs.appendChild(btn);
  });
}

function renderFingerChart(posIdx){
  var fp=FINGER_POSITIONS[posIdx];
  fingerPosViewed.add(posIdx);
  if(fingerPosViewed.size>=4){var achs=loadAchievements();if(!achs.fingering_all)unlockAch('fingering_all');}
  var area=document.getElementById('fingerChartArea');area.innerHTML='';
  var stringNames=['G','D','A','E'];
  var stringColors=['#44ee44','#cc55ff','#44ddee','#ffdd33'];
  fp.notes.forEach(function(stringNotes,sIdx){
    var row=document.createElement('div');row.className='fingerStringRow';
    var label=document.createElement('div');label.className='fingerStringLabel';
    label.setAttribute('data-s',sIdx);label.textContent=stringNames[sIdx];
    row.appendChild(label);
    var dots=document.createElement('div');dots.className='fingerDots';
    stringNotes.forEach(function(noteInfo){
      var dot=document.createElement('div');dot.className='fingerDot';
      dot.innerHTML=noteInfo.f+'<span class="fdNote">'+noteInfo.n+'</span>';
      dot.addEventListener('pointerdown',function(e){e.preventDefault();
        if(typeof ensureA==='function')ensureA();
        if(typeof AE!=='undefined')AE.play(sIdx,noteInfo.f,0.6);
        setTimeout(function(){if(typeof AE!=='undefined')AE.stop(sIdx);},600);
        v8Sfx('finger_tap');
        dots.querySelectorAll('.fingerDot').forEach(function(d){d.classList.remove('active');});
        dot.classList.add('active');
      });
      dots.appendChild(dot);
    });
    row.appendChild(dots);
    area.appendChild(row);
  });
}

/* ─── 12. SIGHT READING ─── */
var sightState={score:0,total:0,current:null};
var SIGHT_NOTES=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5'];
var V8_SIGHT_KEY='violinV8_sight';

function createSightPanel(){
  var panel=document.createElement('div');panel.id='sightPanel';
  panel.innerHTML='<span class="v8Close" id="sightClose">&times;</span>'+
    '<h3>📄 시보드 리딩</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px">오선지의 음표를 읽고 연주하세요</div>'+
    '<canvas id="sightCanvas" width="360" height="160"></canvas>'+
    '<div class="sightFeedback" id="sightFeedback"></div>'+
    '<div class="sightControls">'+
    '<div class="sightBtn" id="sightNext">다음 문제</div>'+
    '<div class="sightBtn" id="sightScore">0/0</div></div>';
  document.body.appendChild(panel);
  document.getElementById('sightClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  document.getElementById('sightNext').addEventListener('pointerdown',function(e){e.preventDefault();nextSightNote();});
}

function drawStaff(ctx,W,H,noteName){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(255,250,235,.03)';ctx.fillRect(0,0,W,H);
  var staffTop=40;var lineGap=15;
  ctx.strokeStyle='rgba(201,169,110,.3)';ctx.lineWidth=1;
  for(var i=0;i<5;i++){
    var y=staffTop+i*lineGap;
    ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(W-20,y);ctx.stroke();
  }
  ctx.font='bold 48px serif';ctx.fillStyle='rgba(255,215,0,.6)';
  ctx.fillText('\u{1D11E}',35,staffTop+lineGap*3.6);

  var notePositions={'C4':6,'D4':5.5,'E4':5,'F4':4.5,'G4':4,'A4':3.5,'B4':3,
    'C5':2.5,'D5':2,'E5':1.5,'F5':1,'G5':0.5,'A5':0};
  var pos=notePositions[noteName];if(pos===undefined)pos=3;
  var noteY=staffTop+pos*lineGap;
  var noteX=W/2+20;

  if(pos>4.5){
    for(var l=5;l<=pos+.5;l++){
      var ly=staffTop+l*lineGap;
      ctx.beginPath();ctx.moveTo(noteX-16,ly);ctx.lineTo(noteX+16,ly);ctx.stroke();
    }
  }
  if(pos<0.5){
    for(var l=0;l>=pos-.5;l--){
      var ly=staffTop+l*lineGap;
      ctx.beginPath();ctx.moveTo(noteX-16,ly);ctx.lineTo(noteX+16,ly);ctx.stroke();
    }
  }

  ctx.fillStyle='#ffd700';
  ctx.beginPath();
  ctx.ellipse(noteX,noteY,10,7,-.3,0,Math.PI*2);
  ctx.fill();
  ctx.strokeStyle='#ffd700';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(noteX+9,noteY);ctx.lineTo(noteX+9,noteY-40);ctx.stroke();
}

function nextSightNote(){
  var note=SIGHT_NOTES[Math.floor(Math.random()*SIGHT_NOTES.length)];
  sightState.current=note;
  var cv=document.getElementById('sightCanvas');
  drawStaff(cv.getContext('2d'),cv.width,cv.height,note);
  document.getElementById('sightFeedback').textContent='음표를 연주하세요';
  document.getElementById('sightFeedback').style.color='rgba(201,169,110,.5)';
}

function checkSightAnswer(playedNote){
  if(!sightState.current)return;
  sightState.total++;
  var target=sightState.current;
  if(playedNote===target){
    sightState.score++;
    v8Sfx('sight_correct');
    document.getElementById('sightFeedback').textContent='정답! '+target;
    document.getElementById('sightFeedback').style.color='#44ee44';
    if(sightState.score>=20){var achs=loadAchievements();if(!achs.sight_reader)unlockAch('sight_reader');}
  }else{
    document.getElementById('sightFeedback').textContent='오답. 정답: '+target+' (연주: '+playedNote+')';
    document.getElementById('sightFeedback').style.color='#ff4444';
  }
  document.getElementById('sightScore').textContent=sightState.score+'/'+sightState.total;
  var sd=JSON.parse(localStorage.getItem(V8_SIGHT_KEY)||'{}');
  sd.total=(sd.total||0)+1;sd.correct=(sd.correct||0)+(playedNote===target?1:0);
  localStorage.setItem(V8_SIGHT_KEY,JSON.stringify(sd));
  setTimeout(nextSightNote,1200);
}

/* ─── 13. PRACTICE ANALYTICS ─── */
var analyticsViewCount=0;

function createAnalyticsPanel(){
  var panel=document.createElement('div');panel.id='analyticsPanel';
  panel.innerHTML='<span class="v8Close" id="analyticsClose">&times;</span>'+
    '<h3>📊 연습 분석</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:12px">연습 데이터를 분석하고 개선점을 추천합니다</div>'+
    '<div id="analyticsContent"></div>';
  document.body.appendChild(panel);
  document.getElementById('analyticsClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function showAnalytics(){
  v8Sfx('analytics');
  analyticsViewCount++;
  if(analyticsViewCount>=3){var achs=loadAchievements();if(!achs.analytics_check)unlockAch('analytics_check');}

  var stats=loadStats();var p=loadProgress();var achs=loadAchievements();
  var cal=typeof loadCalendarData==='function'?loadCalendarData():{};
  var intData=loadIntData();var sightData=JSON.parse(localStorage.getItem(V8_SIGHT_KEY)||'{}');

  var lessonsDone=0;for(var i=1;i<=80;i++){if(p['lesson_'+i])lessonsDone++;}
  var songSet=new Set();
  Object.keys(p).forEach(function(k){
    if(k.startsWith('rhythm_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^rhythm_/,''));
    if(k.startsWith('perform_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^perform_/,''));
  });
  var totalPracticeDays=Object.keys(cal).length;

  var content=document.getElementById('analyticsContent');content.innerHTML='';

  var sec1=document.createElement('div');sec1.className='anaSection';
  sec1.innerHTML='<div class="anaTitle">🎯 종합 진행률</div>';
  var metrics=[
    {label:'레슨',val:lessonsDone,max:80,color:'#ffd700'},
    {label:'완주곡',val:songSet.size,max:54,color:'#44ee44'},
    {label:'업적',val:Object.keys(achs).length,max:46,color:'#ff6644'},
    {label:'총 노트',val:Math.min(stats.totalNotes||0,10000),max:10000,color:'#44ddee'},
    {label:'연습일',val:Math.min(totalPracticeDays,100),max:100,color:'#cc55ff'}
  ];
  metrics.forEach(function(m){
    var pct=Math.round(m.val/m.max*100);
    sec1.innerHTML+='<div class="anaBar"><div class="anaLabel">'+m.label+'</div>'+
      '<div class="anaTrack"><div class="anaFill" style="width:'+pct+'%;background:'+m.color+'"></div></div>'+
      '<div class="anaVal">'+m.val+'/'+m.max+'</div></div>';
  });
  content.appendChild(sec1);

  var sec2=document.createElement('div');sec2.className='anaSection';
  sec2.innerHTML='<div class="anaTitle">🧠 스킬 분석</div>';
  var comboScore=Math.min(100,((stats.bestCombo||0)/50)*100);
  var perfScore=Math.min(100,((stats.totalPerfects||0)/200)*100);
  var intScore=intData.totalRounds?Math.min(100,(intData.bestStreak||0)/10*100):0;
  var sightScore=sightData.total?Math.round((sightData.correct||0)/sightData.total*100):0;
  var skills=[
    {label:'리듬 감각',val:Math.round(comboScore),color:'#ffd700'},
    {label:'음정 정확도',val:Math.round(perfScore),color:'#44ee44'},
    {label:'음정 인식',val:Math.round(intScore),color:'#ff6644'},
    {label:'시보드 리딩',val:sightScore,color:'#44ddee'}
  ];
  skills.forEach(function(sk){
    sec2.innerHTML+='<div class="anaBar"><div class="anaLabel">'+sk.label+'</div>'+
      '<div class="anaTrack"><div class="anaFill" style="width:'+sk.val+'%;background:'+sk.color+'"></div></div>'+
      '<div class="anaVal">'+sk.val+'%</div></div>';
  });
  content.appendChild(sec2);

  var sec3=document.createElement('div');sec3.className='anaSection';
  sec3.innerHTML='<div class="anaTitle">💡 맞춤 추천</div>';
  var recs=[];
  if(lessonsDone<40)recs.push({title:'기초 레슨 더 하기',desc:'레슨 완료율이 낮습니다. 기초부터 차근히 진행해보세요.'});
  if(songSet.size<10)recs.push({title:'다양한 곡 도전',desc:'완주한 곡이 적습니다. 쉬운 곡부터 시도해보세요.'});
  if(!intData.totalRounds)recs.push({title:'음정 트레이닝 시작',desc:'음정 인식 훈련을 시작해보세요. 음감이 향상됩니다.'});
  if(!sightData.total)recs.push({title:'시보드 리딩 연습',desc:'악보 읽기 연습을 시작해보세요. 독보력이 늘어납니다.'});
  if(comboScore<50)recs.push({title:'리듬게임 연습',desc:'콤보 점수가 낮습니다. 리듬게임으로 박자 감각을 키워보세요.'});
  if(totalPracticeDays<7)recs.push({title:'매일 연습 습관',desc:'연습 일수가 적습니다. 하루 10분이라도 꾸준히 연습하세요.'});
  if(recs.length===0)recs.push({title:'훌륭합니다!',desc:'모든 영역에서 좋은 진행을 보이고 있습니다. 더 어려운 곡에 도전해보세요.'});
  recs.forEach(function(rec){
    sec3.innerHTML+='<div class="anaRec"><div class="arTitle">→ '+rec.title+'</div><div class="arDesc">'+rec.desc+'</div></div>';
  });
  content.appendChild(sec3);

  document.getElementById('analyticsPanel').classList.add('show');
}

/* ─── 14. SIGHT READING — NOTE DETECTION HOOK ─── */
(function hookNoteForSight(){
  var noteMap={};
  var stringNames=['G','D','A','E'];
  var baseNotes=[
    ['G3','G#3','A3','A#3','B3','C4','C#4','D4'],
    ['D4','D#4','E4','F4','F#4','G4','G#4','A4'],
    ['A4','A#4','B4','C5','C#5','D5','D#5','E5'],
    ['E5','F5','F#5','G5','G#5','A5','A#5','B5']
  ];
  for(var s=0;s<4;s++){for(var f=0;f<8;f++){noteMap[s+'_'+f]=baseNotes[s][f];}}

  var origPlay=typeof AE!=='undefined'&&AE.play?AE.play:null;
  if(origPlay){
    AE.play=function(s,f,v){
      origPlay.call(AE,s,f,v);
      var panel=document.getElementById('sightPanel');
      if(panel&&panel.classList.contains('show')){
        var played=noteMap[s+'_'+f];if(played)checkSightAnswer(played);
      }
    };
  }
})();

/* ─── 15. UI INTEGRATION ─── */
(function integrateUI(){
  createIntervalPanel();createEnsemblePanel();createFingerPanel();createSightPanel();createAnalyticsPanel();

  var hdBtns=document.getElementById('hdBtns');if(!hdBtns)return;

  var intBtn=document.createElement('div');intBtn.className='v6Btn';intBtn.title='음정 트레이닝 (I)';intBtn.textContent='🎯';
  intBtn.setAttribute('role','button');intBtn.setAttribute('tabindex','0');
  hdBtns.insertBefore(intBtn,hdBtns.firstChild);
  intBtn.addEventListener('pointerdown',function(e){e.preventDefault();showIntervalPanel();});

  var ensBtn=document.createElement('div');ensBtn.className='v6Btn';ensBtn.title='앙상블 (E)';ensBtn.textContent='🎭';
  ensBtn.setAttribute('role','button');ensBtn.setAttribute('tabindex','0');
  hdBtns.insertBefore(ensBtn,intBtn.nextSibling);
  ensBtn.addEventListener('pointerdown',function(e){e.preventDefault();if(typeof ensureA==='function')ensureA();document.getElementById('ensemblePanel').classList.add('show');});

  var fingerBtn=document.createElement('div');fingerBtn.className='v6Btn';fingerBtn.title='핑거링 차트 (F)';fingerBtn.textContent='🤚';
  fingerBtn.setAttribute('role','button');fingerBtn.setAttribute('tabindex','0');
  hdBtns.insertBefore(fingerBtn,ensBtn.nextSibling);
  fingerBtn.addEventListener('pointerdown',function(e){e.preventDefault();document.getElementById('fingerPanel').classList.add('show');renderFingerChart(0);});

  var sightBtn=document.createElement('div');sightBtn.className='v6Btn';sightBtn.title='시보드 리딩 (X)';sightBtn.textContent='📄';
  sightBtn.setAttribute('role','button');sightBtn.setAttribute('tabindex','0');
  hdBtns.insertBefore(sightBtn,fingerBtn.nextSibling);
  sightBtn.addEventListener('pointerdown',function(e){e.preventDefault();document.getElementById('sightPanel').classList.add('show');nextSightNote();});

  var anaBtn=document.createElement('div');anaBtn.className='v6Btn';anaBtn.title='연습 분석 (A)';anaBtn.textContent='📊';
  anaBtn.setAttribute('role','button');anaBtn.setAttribute('tabindex','0');
  hdBtns.insertBefore(anaBtn,sightBtn.nextSibling);
  anaBtn.addEventListener('pointerdown',function(e){e.preventDefault();showAnalytics();});

  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    if(e.key==='i'||e.key==='I'){showIntervalPanel();}
    if(e.key==='e'&&!e.ctrlKey){if(typeof ensureA==='function')ensureA();document.getElementById('ensemblePanel').classList.add('show');}
    if(e.key==='f'&&!e.ctrlKey){document.getElementById('fingerPanel').classList.add('show');renderFingerChart(0);}
    if(e.key==='x'||e.key==='X'){document.getElementById('sightPanel').classList.add('show');nextSightNote();}
    if(e.key==='a'&&!e.ctrlKey&&!e.metaKey){showAnalytics();}
    if(e.key==='Escape'){
      document.querySelectorAll('#intervalPanel,#ensemblePanel,#fingerPanel,#sightPanel,#analyticsPanel').forEach(function(p){p.classList.remove('show');});
      stopEnsemble();
    }
  });

  var titleEl=document.querySelector('#hd h1');
  if(titleEl)titleEl.innerHTML='🎻 Violin Real <span style="font-size:8px;color:#ffd700;vertical-align:super">v8</span>';
  var logoEl=document.getElementById('logo');
  if(logoEl)logoEl.textContent='Violin Real v8';
})();

window.VIOLIN_VERSION='8.0';
})();
