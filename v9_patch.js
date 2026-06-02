/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v9.0 PATCH MODULE
   비브라토트레이너+듀엣모드+보잉분석+공유카드Canvas+난이도가이드+
   주간챌린지+톤분석기+연주일지+10곡추가(54→64)+10레슨(80→90)+
   12업적추가(46→58)+SFX6종
   ═══════════════════════════════════════════════════════════ */
(function V9Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V9_LOADED)return;window.__V9_LOADED=true;

/* ─── 1. CSS INJECTION ─── */
var sty=document.createElement('style');
sty.textContent=`
#hd h1::after{content:' → v9'!important;font-size:8px;color:#ff6644;opacity:.7;}

/* Vibrato Trainer */
#vibratoPanel{display:none;position:fixed;inset:0;z-index:216;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#vibratoPanel.show{display:flex;}
#vibratoPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.vibWave{width:100%;max-width:360px;height:100px;border-radius:10px;
  border:1px solid rgba(255,215,0,.15);background:rgba(255,250,235,.03);margin:8px 0;}
.vibCtrlRow{display:flex;gap:12px;align-items:center;width:100%;max-width:360px;margin:4px 0;}
.vibCtrlRow label{font-size:10px;color:rgba(201,169,110,.5);min-width:40px;}
.vibCtrlRow input{flex:1;accent-color:#ffd700;height:4px;}
.vibCtrlRow .vibVal{font-size:11px;color:#ffd700;min-width:30px;text-align:right;}
.vibPresetRow{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:8px 0;}
.vibPreset{padding:6px 14px;border-radius:16px;font-size:10px;cursor:pointer;
  border:1px solid rgba(255,215,0,.2);color:rgba(240,230,200,.6);
  background:rgba(255,250,235,.04);transition:all .15s;font-family:Georgia,serif;}
.vibPreset.active{border-color:rgba(255,215,0,.5);color:#ffd700;background:rgba(255,215,0,.12);}
.vibPreset:active{transform:scale(.95);}
.vibScore{font-size:14px;color:#ffd700;font-weight:700;margin:4px 0;}
.vibTimer{font-size:24px;color:#ff6644;font-weight:900;text-shadow:0 0 12px rgba(255,100,68,.3);}

/* Duet Mode */
#duetPanel{display:none;position:fixed;inset:0;z-index:216;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#duetPanel.show{display:flex;}
#duetPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.duetTrack{width:100%;max-width:360px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:10px;cursor:pointer;transition:all .15s;}
.duetTrack:active{background:rgba(255,215,0,.12);}
.duetTrack.playing{border-color:rgba(204,85,255,.4);background:rgba(204,85,255,.05);}
.duetName{font-size:12px;color:#cc55ff;font-weight:700;}
.duetDesc{font-size:9px;color:rgba(201,169,110,.4);margin-top:2px;}
.duetParts{display:flex;gap:8px;margin-top:6px;}
.duetPart{font-size:9px;padding:2px 8px;border-radius:8px;border:1px solid rgba(255,215,0,.15);color:rgba(240,230,200,.5);}
.duetPart.you{border-color:rgba(68,238,68,.3);color:#44ee44;}

/* Bowing Distribution */
#bowDistPanel{display:none;position:fixed;inset:0;z-index:216;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#bowDistPanel.show{display:flex;}
#bowDistPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#bowDistCanvas{border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.bowDistStats{display:grid;grid-template-columns:1fr 1fr;gap:6px;width:100%;max-width:360px;margin:8px 0;}
.bdStat{background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.08);
  border-radius:8px;padding:8px;text-align:center;}
.bdStat .bdVal{font-size:18px;color:#ffd700;font-weight:700;}
.bdStat .bdLbl{font-size:9px;color:rgba(201,169,110,.4);margin-top:2px;}

/* Share Card */
#sharePanel{display:none;position:fixed;inset:0;z-index:216;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#sharePanel.show{display:flex;}
#sharePanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
#shareCanvas{border-radius:10px;border:1px solid rgba(255,215,0,.2);max-width:100%;margin:8px 0;}
.shareActions{display:flex;gap:8px;margin:8px 0;flex-wrap:wrap;justify-content:center;}
.shareActBtn{padding:8px 16px;border-radius:16px;font-size:11px;cursor:pointer;
  border:1px solid rgba(255,215,0,.3);color:#ffd700;background:rgba(255,215,0,.08);
  font-family:Georgia,serif;transition:all .15s;}
.shareActBtn:active{background:rgba(255,215,0,.2);transform:scale(.96);}

/* Difficulty Guide */
#diffGuidePanel{display:none;position:fixed;inset:0;z-index:216;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#diffGuidePanel.show{display:flex;}
#diffGuidePanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.diffLevel{width:100%;max-width:360px;margin:6px 0;padding:12px;
  background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.08);border-radius:10px;}
.diffLevel .dlTitle{font-size:13px;font-weight:700;margin-bottom:4px;}
.diffLevel .dlDesc{font-size:10px;color:rgba(201,169,110,.5);line-height:1.5;}
.diffLevel .dlSongs{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}
.diffLevel .dlSong{font-size:9px;padding:2px 8px;border-radius:8px;
  border:1px solid rgba(255,215,0,.1);color:rgba(240,230,200,.5);}
.dlEasy .dlTitle{color:#44ee44;} .dlEasy{border-left:3px solid #44ee44;}
.dlMedium .dlTitle{color:#ffd700;} .dlMedium{border-left:3px solid #ffd700;}
.dlHard .dlTitle{color:#ff4444;} .dlHard{border-left:3px solid #ff4444;}

/* Weekly Challenge */
#weeklyChalPanel{display:none;position:fixed;inset:0;z-index:216;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#weeklyChalPanel.show{display:flex;}
#weeklyChalPanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
.wcCard{width:100%;max-width:360px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);border-radius:10px;}
.wcCard.done{border-color:rgba(68,238,68,.3);background:rgba(68,238,68,.03);}
.wcTitle{font-size:12px;color:#ffd700;font-weight:700;}
.wcDesc{font-size:10px;color:rgba(201,169,110,.5);margin-top:2px;}
.wcBar{height:6px;background:rgba(255,255,255,.06);border-radius:3px;margin-top:6px;overflow:hidden;}
.wcFill{height:100%;background:linear-gradient(90deg,#ffd700,#44ee44);border-radius:3px;transition:width .4s;}
.wcReward{font-size:9px;color:#ff6644;margin-top:3px;}

/* Tone Analyzer */
#tonePanel{display:none;position:fixed;inset:0;z-index:216;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#tonePanel.show{display:flex;}
#tonePanel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}
#toneCanvas{border-radius:10px;border:1px solid rgba(255,215,0,.15);
  background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}
.toneMetrics{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;width:100%;max-width:360px;margin:8px 0;}
.tmCard{background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.08);
  border-radius:8px;padding:8px;text-align:center;}
.tmCard .tmVal{font-size:16px;font-weight:700;}
.tmCard .tmLbl{font-size:8px;color:rgba(201,169,110,.4);margin-top:2px;}
.tmGood .tmVal{color:#44ee44;} .tmOk .tmVal{color:#ffd700;} .tmWarn .tmVal{color:#ff4444;}

/* Performance Journal */
#journalPanel{display:none;position:fixed;inset:0;z-index:216;background:rgba(0,0,0,.95);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#journalPanel.show{display:flex;}
#journalPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.jEntry{width:100%;max-width:360px;padding:10px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.08);border-radius:10px;}
.jDate{font-size:10px;color:#ff6644;font-weight:700;}
.jContent{font-size:11px;color:rgba(240,230,200,.7);margin-top:4px;line-height:1.5;}
.jMood{display:flex;gap:4px;margin-top:4px;}
.jMoodBtn{font-size:16px;cursor:pointer;opacity:.4;transition:opacity .15s;}
.jMoodBtn.active{opacity:1;}
.jMoodBtn:active{transform:scale(1.2);}
.jTextarea{width:100%;max-width:360px;min-height:60px;padding:8px;border-radius:8px;
  border:1px solid rgba(255,215,0,.2);background:rgba(255,250,235,.05);
  color:#ffd700;font-size:11px;font-family:Georgia,serif;resize:vertical;outline:none;}
.jTextarea:focus{border-color:rgba(255,215,0,.4);}
.jSaveBtn{padding:8px 20px;border-radius:16px;font-size:11px;cursor:pointer;
  border:1px solid rgba(255,215,0,.3);color:#ffd700;background:rgba(255,215,0,.08);
  font-family:Georgia,serif;transition:all .15s;margin:8px 0;}
.jSaveBtn:active{background:rgba(255,215,0,.2);}

/* v9 close button */
.v9Close{position:fixed;top:12px;right:16px;z-index:220;font-size:20px;color:#c9a96e;cursor:pointer;
  background:rgba(0,0,0,.5);border-radius:50%;width:32px;height:32px;
  display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,215,0,.2);}
.v9Close:active{background:rgba(255,215,0,.15);}

/* v9 quick action row */
.v9QuickRow{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:4px 0;padding:0 4px;}
`;
document.head.appendChild(sty);

/* ─── 2. WEB AUDIO SFX 6종 ─── */
function v9Sfx(type){
  if(typeof AE==='undefined'||!AE.getCtx)return;
  try{AE.res();}catch(e){return;}
  var ctx=AE.getCtx();if(!ctx)return;
  var t=ctx.currentTime;
  var g=ctx.createGain();g.gain.setValueAtTime(0,t);g.connect(ctx.destination);
  if(type==='vibrato_start'){
    g.gain.linearRampToValueAtTime(.08,t+.02);g.gain.linearRampToValueAtTime(0,t+.5);
    var o=ctx.createOscillator();o.type='sine';o.frequency.value=440;
    var lfo=ctx.createOscillator();lfo.type='sine';lfo.frequency.value=5.5;
    var lfog=ctx.createGain();lfog.gain.value=15;
    lfo.connect(lfog);lfog.connect(o.detune);
    o.connect(g);o.start(t);lfo.start(t);o.stop(t+.5);lfo.stop(t+.5);
  }else if(type==='duet_play'){
    g.gain.linearRampToValueAtTime(.07,t+.02);g.gain.linearRampToValueAtTime(0,t+.4);
    [440,554.37,659.25].forEach(function(f,i){
      var o=ctx.createOscillator();o.type='triangle';o.frequency.value=f;
      o.connect(g);o.start(t+i*.06);o.stop(t+.4);});
  }else if(type==='bow_analyze'){
    g.gain.linearRampToValueAtTime(.06,t+.02);g.gain.linearRampToValueAtTime(0,t+.35);
    var o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(300,t);
    o.frequency.linearRampToValueAtTime(600,t+.35);o.connect(g);o.start(t);o.stop(t+.35);
  }else if(type==='share_capture'){
    g.gain.linearRampToValueAtTime(.09,t+.02);g.gain.linearRampToValueAtTime(0,t+.5);
    [523.25,659.25,783.99,1046.5].forEach(function(f,i){
      var o=ctx.createOscillator();o.type='sine';o.frequency.value=f;
      var og=ctx.createGain();og.gain.value=.15;
      o.connect(og);og.connect(g);o.start(t+i*.06);o.stop(t+.5);});
  }else if(type==='challenge_done'){
    g.gain.linearRampToValueAtTime(.1,t+.02);g.gain.linearRampToValueAtTime(0,t+.6);
    [392,493.88,587.33,783.99].forEach(function(f,i){
      var o=ctx.createOscillator();o.type='sine';o.frequency.value=f;
      o.connect(g);o.start(t+i*.08);o.stop(t+.6);});
  }else if(type==='journal_save'){
    g.gain.linearRampToValueAtTime(.06,t+.02);g.gain.linearRampToValueAtTime(0,t+.25);
    var o=ctx.createOscillator();o.type='sine';o.frequency.value=880;o.connect(g);o.start(t);o.stop(t+.25);
  }
}

/* ─── 3. NEW SONGS (+10곡, 총 64곡) ─── */
(function addSongs(){
  if(typeof SONGS==='undefined')return;
  SONGS['살루에어']={name:'살루 에어 (바흐)',category:'클래식',difficulty:'medium',bpm:60,
    notes:[
      {note:'D5',dur:2,s:2,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:.5,s:2,f:2},{note:'C#5',dur:.5,s:2,f:4},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'F#5',dur:.5,s:3,f:2},{note:'G5',dur:1,s:3,f:3},
      {note:'F#5',dur:1,s:3,f:2},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C#5',dur:1,s:2,f:4},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'B4',dur:.5,s:2,f:2},{note:'C#5',dur:.5,s:2,f:4},{note:'D5',dur:1.5,s:2,f:5},{note:'A4',dur:.5,s:2,f:0},
      {note:'D5',dur:3,s:2,f:5}
    ]};
  SONGS['로망스']={name:'로망스 (베토벤)',category:'클래식',difficulty:'medium',bpm:66,
    notes:[
      {note:'F5',dur:2,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},{note:'F4',dur:1,s:1,f:3},{note:'E4',dur:1,s:1,f:2},
      {note:'F4',dur:2,s:1,f:3},{note:'A4',dur:1,s:2,f:0},{note:'C5',dur:1,s:2,f:3},
      {note:'F5',dur:1.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:1.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'C5',dur:3,s:2,f:3}
    ]};
  SONGS['아베마리아G']={name:'아베 마리아 (구노)',category:'클래식',difficulty:'medium',bpm:58,
    notes:[
      {note:'E5',dur:2,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'G5',dur:1.5,s:3,f:3},{note:'F5',dur:.5,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:2,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},
      {note:'F5',dur:1.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'C5',dur:3,s:2,f:3}
    ]};
  SONGS['즐거운농부']={name:'즐거운 농부 (슈만)',category:'클래식',difficulty:'easy',bpm:108,
    notes:[
      {note:'C5',dur:1,s:2,f:3},{note:'E5',dur:.5,s:3,f:0},{note:'C5',dur:.5,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'F5',dur:.5,s:3,f:1},{note:'D5',dur:.5,s:2,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'G5',dur:1,s:3,f:3},{note:'C5',dur:2,s:2,f:3},
      {note:'A4',dur:1,s:2,f:0},{note:'C5',dur:1,s:2,f:3},{note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:2,s:2,f:3},
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:1.5,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'C5',dur:2,s:2,f:3},{note:'R',dur:1,s:-1,f:0}
    ]};
  SONGS['군밤타령']={name:'군밤타령',category:'민요',difficulty:'easy',bpm:90,
    notes:[
      {note:'G4',dur:1,s:1,f:5},{note:'G4',dur:1,s:1,f:5},{note:'A4',dur:.5,s:2,f:0},{note:'B4',dur:.5,s:2,f:2},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'A4',dur:2,s:2,f:0},{note:'G4',dur:2,s:1,f:5},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'B4',dur:.5,s:2,f:2},{note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:3,s:1,f:5}
    ]};
  SONGS['헌터코러스']={name:'사냥꾼의 합창 (베버)',category:'클래식',difficulty:'medium',bpm:120,
    notes:[
      {note:'C5',dur:1,s:2,f:3},{note:'C5',dur:.5,s:2,f:3},{note:'C5',dur:.5,s:2,f:3},
      {note:'G4',dur:1,s:1,f:5},{note:'C5',dur:1,s:2,f:3},{note:'E5',dur:1,s:3,f:0},{note:'G5',dur:2,s:3,f:3},
      {note:'E5',dur:1,s:3,f:0},{note:'C5',dur:1,s:2,f:3},
      {note:'F5',dur:1,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:2,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'D5',dur:.5,s:2,f:5},{note:'D5',dur:.5,s:2,f:5},
      {note:'B4',dur:1,s:2,f:2},{note:'D5',dur:1,s:2,f:5},{note:'G5',dur:2,s:3,f:3},
      {note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:3,s:2,f:3}
    ]};
  SONGS['트로이메라이']={name:'트로이메라이 (슈만)',category:'클래식',difficulty:'medium',bpm:52,
    notes:[
      {note:'F5',dur:1,s:3,f:1},{note:'A5',dur:1.5,s:3,f:5},{note:'G5',dur:.5,s:3,f:3},
      {note:'F5',dur:1,s:3,f:1},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:2,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'F5',dur:1.5,s:3,f:1},{note:'E5',dur:.5,s:3,f:0},
      {note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},{note:'B4',dur:2,s:2,f:2},
      {note:'A4',dur:1,s:2,f:0},{note:'C5',dur:1,s:2,f:3},{note:'B4',dur:.5,s:2,f:2},{note:'A4',dur:.5,s:2,f:0},
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},
      {note:'F5',dur:3,s:3,f:1}
    ]};
  SONGS['봄바람']={name:'봄바람',category:'민요',difficulty:'easy',bpm:100,
    notes:[
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:.5,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'G5',dur:2,s:3,f:3},
      {note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},{note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},
      {note:'E5',dur:2,s:3,f:0},{note:'C5',dur:2,s:2,f:3},
      {note:'D5',dur:1,s:2,f:5},{note:'E5',dur:.5,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},{note:'C5',dur:1,s:2,f:3},
      {note:'A4',dur:1,s:2,f:0},{note:'G4',dur:2,s:1,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'C5',dur:3,s:2,f:3}
    ]};
  SONGS['무궁동산']={name:'무궁동산',category:'동요',difficulty:'easy',bpm:96,
    notes:[
      {note:'G4',dur:1,s:1,f:5},{note:'A4',dur:1,s:2,f:0},{note:'B4',dur:1,s:2,f:2},{note:'C5',dur:1,s:2,f:3},
      {note:'D5',dur:2,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:1,s:2,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},{note:'G4',dur:1,s:1,f:5},
      {note:'A4',dur:2,s:2,f:0},{note:'G4',dur:2,s:1,f:5},
      {note:'C5',dur:1,s:2,f:3},{note:'D5',dur:1,s:2,f:5},{note:'E5',dur:1,s:3,f:0},{note:'D5',dur:.5,s:2,f:5},
      {note:'C5',dur:.5,s:2,f:3},{note:'B4',dur:1,s:2,f:2},{note:'A4',dur:1,s:2,f:0},
      {note:'G4',dur:3,s:1,f:5}
    ]};
  SONGS['왕벌비행']={name:'왕벌의 비행 (림스키코르사코프)',category:'클래식',difficulty:'hard',bpm:160,
    notes:[
      {note:'E5',dur:.25,s:3,f:0},{note:'D#5',dur:.25,s:2,f:6},{note:'D5',dur:.25,s:2,f:5},{note:'C#5',dur:.25,s:2,f:4},
      {note:'C5',dur:.25,s:2,f:3},{note:'B4',dur:.25,s:2,f:2},{note:'A#4',dur:.25,s:2,f:1},{note:'A4',dur:.25,s:2,f:0},
      {note:'G#4',dur:.25,s:1,f:6},{note:'G4',dur:.25,s:1,f:5},{note:'F#4',dur:.25,s:1,f:4},{note:'G4',dur:.25,s:1,f:5},
      {note:'A4',dur:.25,s:2,f:0},{note:'G4',dur:.25,s:1,f:5},{note:'F#4',dur:.25,s:1,f:4},{note:'G4',dur:.25,s:1,f:5},
      {note:'A4',dur:.25,s:2,f:0},{note:'G#4',dur:.25,s:1,f:6},{note:'A4',dur:.25,s:2,f:0},{note:'A#4',dur:.25,s:2,f:1},
      {note:'B4',dur:.25,s:2,f:2},{note:'C5',dur:.25,s:2,f:3},{note:'C#5',dur:.25,s:2,f:4},{note:'D5',dur:.25,s:2,f:5},
      {note:'D#5',dur:.25,s:2,f:6},{note:'E5',dur:.25,s:3,f:0},{note:'F5',dur:.25,s:3,f:1},{note:'E5',dur:.25,s:3,f:0},
      {note:'D#5',dur:.25,s:2,f:6},{note:'D5',dur:.25,s:2,f:5},{note:'C#5',dur:.25,s:2,f:4},{note:'C5',dur:.5,s:2,f:3}
    ]};

  if(typeof CHORDS!=='undefined'){
    CHORDS['살루에어']=[[293.66,369.99,440],[440,554.37,659.25]];
    CHORDS['로망스']=[[349.23,440,523.25],[261.63,329.63,392]];
    CHORDS['아베마리아G']=[[261.63,329.63,392],[349.23,440,523.25]];
    CHORDS['즐거운농부']=[[261.63,329.63,392],[349.23,440,523.25]];
    CHORDS['군밤타령']=[[196,246.94,293.66],[261.63,329.63,392]];
    CHORDS['헌터코러스']=[[261.63,329.63,392],[196,246.94,293.66]];
    CHORDS['트로이메라이']=[[349.23,440,523.25],[261.63,329.63,392]];
    CHORDS['봄바람']=[[261.63,329.63,392],[440,523.25,659.25]];
    CHORDS['무궁동산']=[[196,246.94,293.66],[261.63,329.63,392]];
    CHORDS['왕벌비행']=[[329.63,415.3,493.88],[261.63,329.63,392]];
  }
})();

/* ─── 4. NEW LESSONS (81-90) ─── */
(function addLessons(){
  if(typeof LESSONS==='undefined')return;
  LESSONS.push({lv:81,title:'비브라토 기초',desc:'느린 비브라토로 음색에 떨림 더하기',targets:[{s:2,f:0,count:1},{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:3,count:1}]});
  LESSONS.push({lv:82,title:'비브라토 속도 변화',desc:'느림→빠름 비브라토 전환 연습',targets:[{s:2,f:3,count:1},{s:2,f:3,count:1},{s:2,f:5,count:1},{s:2,f:5,count:1},{s:3,f:0,count:1},{s:3,f:0,count:1}]});
  LESSONS.push({lv:83,title:'듀엣: 캐논 2파트',desc:'캐논 변주곡의 2번째 바이올린 파트 연습',targets:[{s:2,f:0,count:1},{s:2,f:3,count:1},{s:2,f:5,count:1},{s:2,f:2,count:1},{s:1,f:5,count:1},{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:4,count:1}]});
  LESSONS.push({lv:84,title:'보잉: 균일한 활 배분',desc:'활의 상하반을 균일하게 사용하는 연습',targets:[{s:0,f:0,count:1},{s:0,f:0,count:1},{s:1,f:0,count:1},{s:1,f:0,count:1},{s:2,f:0,count:1},{s:2,f:0,count:1},{s:3,f:0,count:1},{s:3,f:0,count:1}]});
  LESSONS.push({lv:85,title:'E장조 스케일',desc:'E-F#-G#-A-B-C#-D#-E 순서대로',targets:[{s:3,f:0,count:1},{s:3,f:2,count:1},{s:3,f:4,count:1},{s:3,f:5,count:1},{s:3,f:7,count:1},{s:2,f:4,count:1},{s:2,f:6,count:1},{s:2,f:7,count:1}]});
  LESSONS.push({lv:86,title:'리코셰 보잉',desc:'활이 튕기듯 빠르게 연속 터치하기',targets:[{s:2,f:0,count:1},{s:2,f:0,count:1},{s:2,f:0,count:1},{s:2,f:2,count:1},{s:2,f:2,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:3,count:1}]});
  LESSONS.push({lv:87,title:'왕벌의 비행 도입부',desc:'크로매틱 하행 빠른 패시지 연습',targets:[{s:3,f:0,count:1},{s:2,f:6,count:1},{s:2,f:5,count:1},{s:2,f:4,count:1},{s:2,f:3,count:1},{s:2,f:2,count:1},{s:2,f:1,count:1},{s:2,f:0,count:1}]});
  LESSONS.push({lv:88,title:'로망스 테마',desc:'베토벤 로망스 F장조의 주제부 연습',targets:[{s:3,f:1,count:1},{s:3,f:0,count:1},{s:2,f:5,count:1},{s:2,f:3,count:1},{s:2,f:2,count:1},{s:2,f:0,count:1},{s:1,f:5,count:1},{s:1,f:3,count:1}]});
  LESSONS.push({lv:89,title:'4현 아르페지오 상행',desc:'G-B-D G-D-F#-A D-A-C#-E A-E-G#-B',targets:[
    {s:0,f:0,count:1},{s:0,f:4,count:1},{s:1,f:0,count:1},{s:1,f:5,count:1},
    {s:1,f:0,count:1},{s:1,f:4,count:1},{s:2,f:0,count:1},{s:2,f:4,count:1},
    {s:2,f:0,count:1},{s:2,f:4,count:1},{s:3,f:0,count:1},{s:3,f:4,count:1}
  ]});
  LESSONS.push({lv:90,title:'v9 졸업 시험',desc:'비브라토+보잉+크로매틱+아르페지오 종합',targets:[
    {s:0,f:0,count:1},{s:0,f:2,count:1},{s:0,f:4,count:1},{s:0,f:5,count:1},{s:0,f:7,count:1},
    {s:1,f:0,count:1},{s:1,f:2,count:1},{s:1,f:3,count:1},{s:1,f:5,count:1},{s:1,f:7,count:1},
    {s:2,f:0,count:1},{s:2,f:1,count:1},{s:2,f:2,count:1},{s:2,f:3,count:1},{s:2,f:4,count:1},{s:2,f:5,count:1},{s:2,f:6,count:1},{s:2,f:7,count:1},
    {s:3,f:0,count:1},{s:3,f:1,count:1},{s:3,f:2,count:1},{s:3,f:3,count:1},{s:3,f:4,count:1},{s:3,f:5,count:1},{s:3,f:6,count:1},{s:3,f:7,count:1}
  ]});
})();

/* ─── 5. NEW ACHIEVEMENTS (+12, 총 58개) ─── */
(function addAchievements(){
  if(typeof ACHIEVEMENTS==='undefined')return;
  ACHIEVEMENTS.push(
    {id:'lesson_90',name:'그랜드 마에스트로',desc:'90개 레슨을 모두 완료했습니다',icon:'🏆'},
    {id:'songs_60',name:'60곡 컬렉터',desc:'60곡을 완주했습니다',icon:'💿'},
    {id:'vibrato_master',name:'비브라토 마스터',desc:'비브라토 트레이닝을 5회 완료',icon:'〰'},
    {id:'duet_player',name:'듀엣 연주자',desc:'듀엣 모드로 3곡을 연주했습니다',icon:'👯'},
    {id:'bow_analyst',name:'보잉 분석가',desc:'보잉 분석을 5회 확인했습니다',icon:'🏹'},
    {id:'share_first',name:'첫 공유',desc:'공유 카드를 처음 생성했습니다',icon:'📤'},
    {id:'weekly_clear',name:'주간 챌린저',desc:'주간 챌린지를 모두 완료했습니다',icon:'🗓'},
    {id:'journal_writer',name:'연습 일지 작성자',desc:'연주 일지를 10회 작성했습니다',icon:'📝'},
    {id:'tone_checker',name:'톤 감별사',desc:'톤 분석기를 3회 사용했습니다',icon:'🎼'},
    {id:'perfect_500',name:'500 퍼펙트',desc:'총 500회 Perfect 판정을 받았습니다',icon:'💫'},
    {id:'notes_10000',name:'만 노트 달성',desc:'총 10000개 노트를 연주했습니다',icon:'🎺'},
    {id:'daily_streak_30',name:'30일 연속',desc:'30일 연속 연습을 달성했습니다',icon:'👑'}
  );
})();

/* ─── 6. PATCH ACHIEVEMENT CHECKER ─── */
(function patchAchCheck(){
  var origCheck=window.checkAchievements;
  if(!origCheck)return;
  window.checkAchievements=function(){
    origCheck();
    var p=loadProgress();var achs=loadAchievements();var stats=loadStats();
    var lessonsDone=0;for(var i=1;i<=90;i++){if(p['lesson_'+i])lessonsDone++;}
    if(lessonsDone>=90&&!achs.lesson_90)unlockAch('lesson_90');
    var songSet=new Set();
    Object.keys(p).forEach(function(k){
      if(k.startsWith('rhythm_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^rhythm_/,''));
      if(k.startsWith('perform_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^perform_/,''));
    });
    if(songSet.size>=60&&!achs.songs_60)unlockAch('songs_60');
    if((stats.totalPerfects||0)>=500&&!achs.perfect_500)unlockAch('perfect_500');
    if((stats.totalNotes||0)>=10000&&!achs.notes_10000)unlockAch('notes_10000');
    var dailyData=typeof loadDailyData==='function'?loadDailyData():{};
    if(dailyData.streak>=30&&!achs.daily_streak_30)unlockAch('daily_streak_30');
  };
})();

/* ─── 7. PATCH STATS DISPLAY ─── */
(function patchStats(){
  var origUpdate=window.updateStatsPanel;
  if(!origUpdate)return;
  window.updateStatsPanel=function(){
    origUpdate();
    var el=document.getElementById('statAch');
    if(el){var achs=loadAchievements();el.textContent=Object.keys(achs).length+'/58';}
    var lesEl=document.getElementById('statLessons');
    if(lesEl){var p=loadProgress();var done=0;for(var i=1;i<=90;i++){if(p['lesson_'+i])done++;}lesEl.textContent=done+'/90';}
  };
})();

/* ─── 8. VIBRATO TRAINER ─── */
var VIB_KEY='violinV9_vibrato';
function loadVibData(){try{return JSON.parse(localStorage.getItem(VIB_KEY)||'{}');}catch(e){return {};}}
function saveVibData(d){localStorage.setItem(VIB_KEY,JSON.stringify(d));}

var vibTrainerState={active:false,speed:5.5,depth:50,timer:null,elapsed:0,waveAnim:null};
var VIB_PRESETS=[
  {name:'느린 비브라토',speed:4,depth:40,desc:'서정적인 느린 곡용'},
  {name:'표준 비브라토',speed:5.5,depth:55,desc:'일반적인 비브라토'},
  {name:'빠른 비브라토',speed:7,depth:70,desc:'열정적인 빠른 곡용'},
  {name:'넓은 비브라토',speed:4.5,depth:80,desc:'깊고 넓은 떨림'}
];

function createVibratoPanel(){
  var panel=document.createElement('div');panel.id='vibratoPanel';
  var html='<span class="v9Close" id="vibratoClose">&times;</span>'+
    '<h3>〰 비브라토 트레이너</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px">비브라토 속도와 깊이를 연습하세요</div>'+
    '<canvas class="vibWave" id="vibWaveCanvas" width="360" height="100"></canvas>'+
    '<div class="vibCtrlRow"><label>속도</label><input type="range" id="vibSpeedCtrl" min="2" max="10" value="5.5" step="0.5">'+
    '<div class="vibVal" id="vibSpeedVal">5.5Hz</div></div>'+
    '<div class="vibCtrlRow"><label>깊이</label><input type="range" id="vibDepthCtrl" min="10" max="100" value="50">'+
    '<div class="vibVal" id="vibDepthVal">50%</div></div>'+
    '<div class="vibPresetRow" id="vibPresets"></div>'+
    '<div class="vibTimer" id="vibTimerDisp">00:00</div>'+
    '<div class="vibScore" id="vibScoreDisp"></div>'+
    '<div style="display:flex;gap:8px;margin:8px 0;">'+
    '<div class="shareActBtn" id="vibStartBtn">연습 시작</div>'+
    '<div class="shareActBtn" id="vibStopBtn" style="display:none;">정지</div></div>';
  panel.innerHTML=html;document.body.appendChild(panel);

  document.getElementById('vibratoClose').addEventListener('pointerdown',function(e){e.preventDefault();stopVibratoTrainer();panel.classList.remove('show');});

  var presetRow=document.getElementById('vibPresets');
  VIB_PRESETS.forEach(function(pr,idx){
    var btn=document.createElement('div');btn.className='vibPreset';btn.textContent=pr.name;btn.title=pr.desc;
    btn.addEventListener('pointerdown',function(e){e.preventDefault();
      presetRow.querySelectorAll('.vibPreset').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      document.getElementById('vibSpeedCtrl').value=pr.speed;
      document.getElementById('vibDepthCtrl').value=pr.depth;
      document.getElementById('vibSpeedVal').textContent=pr.speed+'Hz';
      document.getElementById('vibDepthVal').textContent=pr.depth+'%';
      vibTrainerState.speed=pr.speed;vibTrainerState.depth=pr.depth;
    });
    presetRow.appendChild(btn);
  });

  document.getElementById('vibSpeedCtrl').addEventListener('input',function(){
    vibTrainerState.speed=parseFloat(this.value);
    document.getElementById('vibSpeedVal').textContent=this.value+'Hz';
  });
  document.getElementById('vibDepthCtrl').addEventListener('input',function(){
    vibTrainerState.depth=parseInt(this.value);
    document.getElementById('vibDepthVal').textContent=this.value+'%';
  });

  document.getElementById('vibStartBtn').addEventListener('pointerdown',function(e){e.preventDefault();startVibratoTrainer();});
  document.getElementById('vibStopBtn').addEventListener('pointerdown',function(e){e.preventDefault();stopVibratoTrainer();});
}

function startVibratoTrainer(){
  if(typeof ensureA==='function')ensureA();
  v9Sfx('vibrato_start');
  vibTrainerState.active=true;vibTrainerState.elapsed=0;
  document.getElementById('vibStartBtn').style.display='none';
  document.getElementById('vibStopBtn').style.display='';
  if(typeof AE!=='undefined'&&AE.setVibrato)AE.setVibrato(vibTrainerState.depth/100);

  vibTrainerState.timer=setInterval(function(){
    vibTrainerState.elapsed++;
    var m=Math.floor(vibTrainerState.elapsed/60);var s=vibTrainerState.elapsed%60;
    document.getElementById('vibTimerDisp').textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
  },1000);

  var cv=document.getElementById('vibWaveCanvas');var ctx=cv.getContext('2d');
  var W=cv.width,H=cv.height;var startTime=Date.now();
  function drawWave(){
    if(!vibTrainerState.active)return;
    ctx.clearRect(0,0,W,H);
    var t=(Date.now()-startTime)/1000;
    var speed=vibTrainerState.speed;var depth=vibTrainerState.depth/100;
    ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();
    ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.beginPath();
    for(var x=0;x<W;x++){
      var phase=t*speed*Math.PI*2+x/W*Math.PI*4;
      var y=H/2+Math.sin(phase)*H*.35*depth;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
    var dotX=W*.7;var dotPhase=t*speed*Math.PI*2+dotX/W*Math.PI*4;
    var dotY=H/2+Math.sin(dotPhase)*H*.35*depth;
    ctx.fillStyle='#ff6644';ctx.beginPath();ctx.arc(dotX,dotY,5,0,Math.PI*2);ctx.fill();
    vibTrainerState.waveAnim=requestAnimationFrame(drawWave);
  }
  drawWave();
}

function stopVibratoTrainer(){
  vibTrainerState.active=false;
  if(vibTrainerState.timer){clearInterval(vibTrainerState.timer);vibTrainerState.timer=null;}
  if(vibTrainerState.waveAnim){cancelAnimationFrame(vibTrainerState.waveAnim);vibTrainerState.waveAnim=null;}
  document.getElementById('vibStartBtn').style.display='';
  document.getElementById('vibStopBtn').style.display='none';
  if(typeof AE!=='undefined'&&AE.setVibrato)AE.setVibrato(0);
  if(vibTrainerState.elapsed>=30){
    var d=loadVibData();d.sessions=(d.sessions||0)+1;d.totalSec=(d.totalSec||0)+vibTrainerState.elapsed;saveVibData(d);
    document.getElementById('vibScoreDisp').textContent='세션 완료! 총 '+d.sessions+'회, '+Math.round(d.totalSec/60)+'분 연습';
    if(d.sessions>=5){var achs=loadAchievements();if(!achs.vibrato_master)unlockAch('vibrato_master');}
  }
}

/* ─── 9. DUET MODE ─── */
var DUET_PIECES=[
  {name:'캐논 듀엣',desc:'파헬벨 캐논 2파트 바이올린',key:'D',bpm:66,
    part2:[{note:'A4',dur:2},{note:'F#4',dur:2},{note:'G4',dur:2},{note:'E4',dur:2},{note:'F#4',dur:2},{note:'D4',dur:2},{note:'E4',dur:2},{note:'F#4',dur:2}]},
  {name:'아리랑 듀엣',desc:'아리랑 하모니 파트',key:'Am',bpm:76,
    part2:[{note:'C4',dur:2},{note:'E4',dur:2},{note:'A3',dur:2},{note:'C4',dur:2},{note:'E4',dur:2},{note:'C4',dur:2},{note:'A3',dur:2},{note:'E4',dur:2}]},
  {name:'미뉴에트 듀엣',desc:'바흐 미뉴에트 하성부',key:'G',bpm:110,
    part2:[{note:'G3',dur:2},{note:'B3',dur:2},{note:'D4',dur:2},{note:'G3',dur:2},{note:'C4',dur:2},{note:'E4',dur:2},{note:'G3',dur:2},{note:'D4',dur:2}]},
  {name:'봄노래 듀엣',desc:'멘델스존 봄노래 반주 파트',key:'A',bpm:88,
    part2:[{note:'A3',dur:2},{note:'C#4',dur:2},{note:'E4',dur:2},{note:'A3',dur:2},{note:'D4',dur:2},{note:'F#4',dur:2},{note:'A3',dur:2},{note:'E4',dur:2}]},
  {name:'세레나데 듀엣',desc:'슈베르트 세레나데 대선율',key:'C',bpm:54,
    part2:[{note:'C4',dur:2},{note:'E4',dur:2},{note:'G4',dur:2},{note:'C4',dur:2},{note:'F4',dur:2},{note:'A4',dur:2},{note:'G3',dur:2},{note:'C4',dur:2}]}
];

var duetOscs=[];var duetTimer=null;var duetPlaying=false;
var DUET_KEY='violinV9_duet';
function loadDuetData(){try{return JSON.parse(localStorage.getItem(DUET_KEY)||'{}');}catch(e){return {};}}
function saveDuetData(d){localStorage.setItem(DUET_KEY,JSON.stringify(d));}

function createDuetPanel(){
  var panel=document.createElement('div');panel.id='duetPanel';
  var html='<span class="v9Close" id="duetClose">&times;</span>'+
    '<h3>👯 듀엣 모드</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:12px">2nd 바이올린이 자동 연주됩니다. 1st 파트를 연주하세요.</div>';
  DUET_PIECES.forEach(function(piece,idx){
    html+='<div class="duetTrack" data-idx="'+idx+'">'+
      '<div class="duetName">'+piece.name+'</div>'+
      '<div class="duetDesc">'+piece.desc+' ('+piece.key+', BPM '+piece.bpm+')</div>'+
      '<div class="duetParts"><span class="duetPart you">1st: 당신</span><span class="duetPart">2nd: 자동</span></div></div>';
  });
  panel.innerHTML=html;document.body.appendChild(panel);

  document.getElementById('duetClose').addEventListener('pointerdown',function(e){e.preventDefault();stopDuet();panel.classList.remove('show');});
  panel.querySelectorAll('.duetTrack').forEach(function(track){
    track.addEventListener('pointerdown',function(e){
      e.preventDefault();var idx=parseInt(track.dataset.idx);
      if(track.classList.contains('playing')){stopDuet();track.classList.remove('playing');}
      else{panel.querySelectorAll('.duetTrack').forEach(function(t){t.classList.remove('playing');});
        startDuet(idx);track.classList.add('playing');}
    });
  });
}

function noteToFreqV9(noteStr){
  var notes={'C':261.63,'C#':277.18,'D':293.66,'D#':311.13,'E':329.63,'F':349.23,'F#':369.99,'G':392,'G#':415.3,'A':440,'A#':466.16,'B':493.88};
  var match=noteStr.match(/^([A-G]#?)(\d)$/);if(!match)return 440;
  return (notes[match[1]]||440)*Math.pow(2,parseInt(match[2])-4);
}

function startDuet(idx){
  stopDuet();if(typeof ensureA==='function')ensureA();v9Sfx('duet_play');
  var piece=DUET_PIECES[idx];
  var ctx=AE.getCtx();if(!ctx)return;
  var beatDur=60/piece.bpm;var noteIdx=0;duetPlaying=true;

  function playNote(){
    if(!duetPlaying)return;
    var n=piece.part2[noteIdx%piece.part2.length];
    var t=ctx.currentTime;var freq=noteToFreqV9(n.note);
    var osc=ctx.createOscillator();osc.type='triangle';osc.frequency.value=freq;
    var g2=ctx.createGain();g2.gain.setValueAtTime(0,t);
    g2.gain.linearRampToValueAtTime(.06,t+.03);
    g2.gain.linearRampToValueAtTime(.03,t+beatDur*n.dur-.1);
    g2.gain.linearRampToValueAtTime(0,t+beatDur*n.dur);
    osc.connect(g2);g2.connect(ctx.destination);osc.start(t);osc.stop(t+beatDur*n.dur);
    duetOscs.push({osc:osc,g:g2});
    noteIdx++;
    duetTimer=setTimeout(playNote,beatDur*n.dur*1000);
  }
  playNote();

  var dd=loadDuetData();dd.plays=(dd.plays||0)+1;saveDuetData(dd);
  if(dd.plays>=3){var achs=loadAchievements();if(!achs.duet_player)unlockAch('duet_player');}
}

function stopDuet(){
  duetPlaying=false;
  if(duetTimer){clearTimeout(duetTimer);duetTimer=null;}
  duetOscs.forEach(function(item){try{item.osc.stop();}catch(e){}});
  duetOscs=[];
}

/* ─── 10. BOWING DISTRIBUTION ─── */
var BOW_KEY='violinV9_bow';
var bowDistData={up:0,down:0,frog:0,mid:0,tip:0,viewCount:0};
function loadBowData(){try{return JSON.parse(localStorage.getItem(BOW_KEY)||JSON.stringify(bowDistData));}catch(e){return bowDistData;}}
function saveBowData(d){localStorage.setItem(BOW_KEY,JSON.stringify(d));}

(function trackBowing(){
  var bowEl=document.getElementById('bowCv');
  if(!bowEl)return;
  var lastY=0;
  bowEl.addEventListener('pointermove',function(e){
    var rect=bowEl.getBoundingClientRect();
    var y=e.clientY-rect.top;var h=rect.height;
    var zone=y/h;
    var bd=loadBowData();
    if(y>lastY)bd.down++;else if(y<lastY)bd.up++;
    if(zone<.33)bd.tip++;else if(zone>.66)bd.frog++;else bd.mid++;
    saveBowData(bd);lastY=y;
  });
})();

function createBowDistPanel(){
  var panel=document.createElement('div');panel.id='bowDistPanel';
  panel.innerHTML='<span class="v9Close" id="bowDistClose">&times;</span>'+
    '<h3>🏹 보잉 분석</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px">활 사용 패턴을 분석합니다</div>'+
    '<canvas id="bowDistCanvas" width="360" height="200"></canvas>'+
    '<div class="bowDistStats" id="bowDistStats"></div>';
  document.body.appendChild(panel);
  document.getElementById('bowDistClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function showBowDist(){
  v9Sfx('bow_analyze');
  var bd=loadBowData();bd.viewCount=(bd.viewCount||0)+1;saveBowData(bd);
  if(bd.viewCount>=5){var achs=loadAchievements();if(!achs.bow_analyst)unlockAch('bow_analyst');}

  var cv=document.getElementById('bowDistCanvas');var ctx=cv.getContext('2d');
  var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);

  var total=bd.frog+bd.mid+bd.tip||1;
  var pcts=[{label:'끝(팁)',val:bd.tip,color:'#44ee44'},{label:'중간',val:bd.mid,color:'#ffd700'},{label:'원(프로그)',val:bd.frog,color:'#ff6644'}];

  ctx.fillStyle='rgba(255,250,235,.03)';ctx.fillRect(0,0,W,H);
  var barW=80,gap=30,startX=(W-3*barW-2*gap)/2;
  pcts.forEach(function(p,i){
    var x=startX+i*(barW+gap);var pct=p.val/total;var barH=pct*140;
    var grd=ctx.createLinearGradient(x,H-20-barH,x,H-20);
    grd.addColorStop(0,p.color);grd.addColorStop(1,p.color+'33');
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.roundRect(x,H-20-barH,barW,barH,6);ctx.fill();
    ctx.fillStyle=p.color;ctx.font='bold 12px Georgia';ctx.textAlign='center';
    ctx.fillText(Math.round(pct*100)+'%',x+barW/2,H-25-barH);
    ctx.fillStyle='rgba(201,169,110,.5)';ctx.font='10px Georgia';
    ctx.fillText(p.label,x+barW/2,H-5);
  });

  var stats=document.getElementById('bowDistStats');stats.innerHTML='';
  var items=[{v:bd.up,l:'업보우'},{v:bd.down,l:'다운보우'},{v:Math.round(bd.tip/total*100)+'%',l:'팁 비율'},{v:Math.round(bd.frog/total*100)+'%',l:'프로그 비율'}];
  items.forEach(function(item){
    stats.innerHTML+='<div class="bdStat"><div class="bdVal">'+item.v+'</div><div class="bdLbl">'+item.l+'</div></div>';
  });

  document.getElementById('bowDistPanel').classList.add('show');
}

/* ─── 11. SHARE CARD ─── */
function createSharePanel(){
  var panel=document.createElement('div');panel.id='sharePanel';
  panel.innerHTML='<span class="v9Close" id="shareClose">&times;</span>'+
    '<h3>📤 성과 공유 카드</h3>'+
    '<canvas id="shareCanvas" width="600" height="380"></canvas>'+
    '<div class="shareActions">'+
    '<div class="shareActBtn" id="shareDownload">📥 이미지 저장</div>'+
    '<div class="shareActBtn" id="shareCopy">📋 클립보드 복사</div></div>';
  document.body.appendChild(panel);
  document.getElementById('shareClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
  document.getElementById('shareDownload').addEventListener('pointerdown',function(e){
    e.preventDefault();var cv=document.getElementById('shareCanvas');
    var link=document.createElement('a');link.download='violin-real-v9-share.png';link.href=cv.toDataURL('image/png');link.click();
  });
  document.getElementById('shareCopy').addEventListener('pointerdown',function(e){
    e.preventDefault();var cv=document.getElementById('shareCanvas');
    cv.toBlob(function(blob){if(blob&&navigator.clipboard&&navigator.clipboard.write){
      navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(function(){
        if(typeof showToast==='function')showToast('클립보드에 복사됨!');
      });
    }});
  });
}

function showShareCard(){
  v9Sfx('share_capture');
  var achs=loadAchievements();if(!achs.share_first)unlockAch('share_first');

  var stats=loadStats();var p=loadProgress();var achList=loadAchievements();
  var lessonsDone=0;for(var i=1;i<=90;i++){if(p['lesson_'+i])lessonsDone++;}
  var songSet=new Set();
  Object.keys(p).forEach(function(k){
    if(k.startsWith('rhythm_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^rhythm_/,''));
    if(k.startsWith('perform_')&&k.indexOf('stars')===-1&&p[k]>0)songSet.add(k.replace(/^perform_/,''));
  });

  var cv=document.getElementById('shareCanvas');var ctx=cv.getContext('2d');
  var W=600,H=380;
  var grd=ctx.createLinearGradient(0,0,W,H);
  grd.addColorStop(0,'#1a1020');grd.addColorStop(.5,'#2d1a0a');grd.addColorStop(1,'#0a0612');
  ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);

  ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=2;
  ctx.strokeRect(8,8,W-16,H-16);
  ctx.strokeStyle='rgba(255,215,0,.08)';ctx.lineWidth=1;
  ctx.strokeRect(12,12,W-24,H-24);

  ctx.font='bold 28px Georgia';ctx.fillStyle='#ffd700';ctx.textAlign='center';
  ctx.fillText('🎻 Violin Real v9',W/2,45);
  ctx.font='12px Georgia';ctx.fillStyle='rgba(201,169,110,.5)';
  ctx.fillText('바이올린 실시간 연주 앱',W/2,65);

  var statItems=[
    {v:songSet.size+'/64',l:'완주 곡'},
    {v:lessonsDone+'/90',l:'레슨'},
    {v:Object.keys(achList).length+'/58',l:'업적'},
    {v:(stats.totalNotes||0).toLocaleString(),l:'연주 노트'},
    {v:Math.round((stats.totalTime||0)/60)+'분',l:'연습 시간'},
    {v:(stats.bestCombo||0)+'콤보',l:'최고 콤보'}
  ];
  var colW=W/3;
  statItems.forEach(function(item,i){
    var col=i%3;var row=Math.floor(i/3);
    var x=colW*col+colW/2;var y=110+row*100;
    ctx.font='bold 24px Georgia';ctx.fillStyle='#ffd700';ctx.textAlign='center';
    ctx.fillText(item.v,x,y);
    ctx.font='10px Georgia';ctx.fillStyle='rgba(201,169,110,.5)';
    ctx.fillText(item.l,x,y+18);
  });

  ctx.font='9px Georgia';ctx.fillStyle='rgba(201,169,110,.25)';ctx.textAlign='center';
  ctx.fillText(new Date().toISOString().slice(0,10)+' | bsy522-dot/violin',W/2,H-15);

  document.getElementById('sharePanel').classList.add('show');
}

/* ─── 12. DIFFICULTY GUIDE ─── */
function createDiffGuidePanel(){
  var panel=document.createElement('div');panel.id='diffGuidePanel';
  panel.innerHTML='<span class="v9Close" id="diffGuideClose">&times;</span>'+
    '<h3>📋 난이도 가이드</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:12px">단계별 추천 곡과 학습 경로</div>'+
    '<div id="diffGuideContent"></div>';
  document.body.appendChild(panel);
  document.getElementById('diffGuideClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function showDiffGuide(){
  if(typeof SONGS==='undefined')return;
  var content=document.getElementById('diffGuideContent');content.innerHTML='';
  var levels=[
    {cls:'dlEasy',title:'🌱 입문 (Easy)',desc:'개방현과 1st 포지션 기본 음만 사용합니다. BPM이 느리고 리듬이 단순합니다. 처음 바이올린을 접하는 분께 추천합니다.',diff:'easy'},
    {cls:'dlMedium',title:'🌿 중급 (Medium)',desc:'반음과 포지션 이동이 포함됩니다. 다양한 리듬 패턴과 표현이 요구됩니다. 기본기가 잡힌 후 도전하세요.',diff:'medium'},
    {cls:'dlHard',title:'🔥 상급 (Hard)',desc:'빠른 패시지, 크로매틱, 높은 포지션이 등장합니다. 정확한 음정과 빠른 손가락 전환이 필수입니다.',diff:'hard'}
  ];
  levels.forEach(function(lv){
    var div=document.createElement('div');div.className='diffLevel '+lv.cls;
    var songsOfLevel=[];
    Object.keys(SONGS).forEach(function(k){if(SONGS[k].difficulty===lv.diff)songsOfLevel.push(SONGS[k].name);});
    div.innerHTML='<div class="dlTitle">'+lv.title+' ('+songsOfLevel.length+'곡)</div>'+
      '<div class="dlDesc">'+lv.desc+'</div>'+
      '<div class="dlSongs">'+songsOfLevel.slice(0,8).map(function(s){return '<span class="dlSong">'+s+'</span>';}).join('')+
      (songsOfLevel.length>8?'<span class="dlSong">+' +(songsOfLevel.length-8)+'곡</span>':'')+'</div>';
    content.appendChild(div);
  });
  document.getElementById('diffGuidePanel').classList.add('show');
}

/* ─── 13. WEEKLY CHALLENGE ─── */
var WEEKLY_CHALLENGES=[
  {id:'wc_lessons',title:'레슨 5개 완료',desc:'이번 주 5개 레슨을 완료하세요',target:5,reward:'50 XP',check:function(p){var c=0;for(var i=1;i<=90;i++){if(p['lesson_'+i])c++;}return c;}},
  {id:'wc_songs',title:'곡 3곡 완주',desc:'이번 주 3곡을 완주하세요',target:3,reward:'30 XP',check:function(p){var s=new Set();Object.keys(p).forEach(function(k){if(k.startsWith('rhythm_')&&k.indexOf('stars')===-1&&p[k]>0)s.add(k);});return s.size;}},
  {id:'wc_notes',title:'500노트 연주',desc:'이번 주 500개 노트를 연주하세요',target:500,reward:'40 XP',check:function(){return (loadStats().totalNotes||0);}},
  {id:'wc_practice',title:'3일 연속 연습',desc:'이번 주 3일 연속 연습하세요',target:3,reward:'60 XP',check:function(){var dd=typeof loadDailyData==='function'?loadDailyData():{};return dd.streak||0;}},
  {id:'wc_perfect',title:'Perfect 20회',desc:'이번 주 20회 Perfect 판정을 받으세요',target:20,reward:'35 XP',check:function(){return (loadStats().totalPerfects||0);}},
  {id:'wc_combo',title:'10콤보 달성',desc:'이번 주 10콤보 이상을 달성하세요',target:10,reward:'25 XP',check:function(){return (loadStats().bestCombo||0);}},
  {id:'wc_warmup',title:'워밍업 2회',desc:'이번 주 워밍업을 2회 완료하세요',target:2,reward:'20 XP',check:function(p){var c=0;var today=new Date().toISOString().slice(0,10);for(var i=0;i<5;i++){if(p['warmup_'+i+'_'+today])c++;}return c;}}
];

var WC_KEY='violinV9_weekly';
function getWeekId(){var d=new Date();var day=d.getDay();var diff=d.getDate()-day;var sun=new Date(d.setDate(diff));return sun.toISOString().slice(0,10);}
function loadWeeklyData(){try{var d=JSON.parse(localStorage.getItem(WC_KEY)||'{}');if(d.weekId!==getWeekId()){d={weekId:getWeekId(),done:{}};}return d;}catch(e){return {weekId:getWeekId(),done:{}};}}
function saveWeeklyData(d){localStorage.setItem(WC_KEY,JSON.stringify(d));}

function createWeeklyChalPanel(){
  var panel=document.createElement('div');panel.id='weeklyChalPanel';
  panel.innerHTML='<span class="v9Close" id="weeklyChalClose">&times;</span>'+
    '<h3>🗓 주간 챌린지</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:12px">이번 주 목표를 달성하세요</div>'+
    '<div id="weeklyChalContent"></div>';
  document.body.appendChild(panel);
  document.getElementById('weeklyChalClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function showWeeklyChallenge(){
  var p=loadProgress();var wd=loadWeeklyData();
  var content=document.getElementById('weeklyChalContent');content.innerHTML='';
  var weekSeed=getWeekId().split('-').reduce(function(a,b){return parseInt(a)+parseInt(b);},0);
  var selectedIdx=[];
  for(var i=0;i<4&&i<WEEKLY_CHALLENGES.length;i++){selectedIdx.push((weekSeed+i*3)%WEEKLY_CHALLENGES.length);}

  var allDone=true;
  selectedIdx.forEach(function(idx){
    var ch=WEEKLY_CHALLENGES[idx];var current=ch.check(p);
    var pct=Math.min(100,Math.round(current/ch.target*100));
    var done=pct>=100;if(!done)allDone=false;
    if(done&&!wd.done[ch.id]){wd.done[ch.id]=true;saveWeeklyData(wd);v9Sfx('challenge_done');}
    var card=document.createElement('div');card.className='wcCard'+(done?' done':'');
    card.innerHTML='<div class="wcTitle">'+(done?'✅ ':'')+ ch.title+'</div>'+
      '<div class="wcDesc">'+ch.desc+'</div>'+
      '<div class="wcBar"><div class="wcFill" style="width:'+pct+'%"></div></div>'+
      '<div class="wcReward">'+current+'/'+ch.target+' | 보상: '+ch.reward+'</div>';
    content.appendChild(card);
  });
  if(allDone){var achs=loadAchievements();if(!achs.weekly_clear)unlockAch('weekly_clear');}
  document.getElementById('weeklyChalPanel').classList.add('show');
}

/* ─── 14. TONE ANALYZER ─── */
var TONE_KEY='violinV9_tone';
function loadToneData(){try{return JSON.parse(localStorage.getItem(TONE_KEY)||'{}');}catch(e){return {};}}
function saveToneData(d){localStorage.setItem(TONE_KEY,JSON.stringify(d));}

function createTonePanel(){
  var panel=document.createElement('div');panel.id='tonePanel';
  panel.innerHTML='<span class="v9Close" id="toneClose">&times;</span>'+
    '<h3>🎼 톤 분석기</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px">활 속도와 음색 품질을 분석합니다</div>'+
    '<canvas id="toneCanvas" width="360" height="160"></canvas>'+
    '<div class="toneMetrics" id="toneMetrics"></div>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);text-align:center;margin:4px 0;" id="toneTips"></div>';
  document.body.appendChild(panel);
  document.getElementById('toneClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});
}

function showToneAnalyzer(){
  var td=loadToneData();td.views=(td.views||0)+1;saveToneData(td);
  if(td.views>=3){var achs=loadAchievements();if(!achs.tone_checker)unlockAch('tone_checker');}

  var stats=loadStats();var bd=loadBowData();
  var totalBow=(bd.up||0)+(bd.down||0)||1;
  var upPct=Math.round((bd.up||0)/totalBow*100);
  var consistency=100-Math.abs(upPct-50)*2;
  var bowTotal=(bd.frog||0)+(bd.mid||0)+(bd.tip||0)||1;
  var midPct=Math.round((bd.mid||0)/bowTotal*100);
  var speed=Math.min(100,Math.round((stats.totalNotes||0)/Math.max(1,(stats.totalTime||1)/60)));

  var cv=document.getElementById('toneCanvas');var ctx=cv.getContext('2d');
  var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(255,250,235,.03)';ctx.fillRect(0,0,W,H);

  var cx=W/2,cy=H/2+10,r=55;
  var metrics=[
    {label:'보잉 균형',val:consistency,angle:-Math.PI/2},
    {label:'중간활 사용',val:midPct,angle:-Math.PI/2+Math.PI*2/5},
    {label:'연주 속도',val:Math.min(100,speed),angle:-Math.PI/2+Math.PI*4/5},
    {label:'노트 정확도',val:Math.min(100,Math.round((stats.totalPerfects||0)/Math.max(1,stats.totalNotes||1)*100)),angle:-Math.PI/2+Math.PI*6/5},
    {label:'연습 지속성',val:Math.min(100,Math.round(((typeof loadDailyData==='function'?loadDailyData():{}).streak||0)/30*100)),angle:-Math.PI/2+Math.PI*8/5}
  ];

  ctx.strokeStyle='rgba(255,215,0,.1)';ctx.lineWidth=1;
  [.2,.4,.6,.8,1].forEach(function(pct){
    ctx.beginPath();
    metrics.forEach(function(m,i){
      var x=cx+Math.cos(m.angle)*r*pct;var y=cy+Math.sin(m.angle)*r*pct;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.closePath();ctx.stroke();
  });

  ctx.fillStyle='rgba(255,215,0,.12)';ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.beginPath();
  metrics.forEach(function(m,i){
    var v=m.val/100;var x=cx+Math.cos(m.angle)*r*v;var y=cy+Math.sin(m.angle)*r*v;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  });
  ctx.closePath();ctx.fill();ctx.stroke();

  ctx.font='9px Georgia';ctx.fillStyle='rgba(201,169,110,.6)';ctx.textAlign='center';
  metrics.forEach(function(m){
    var x=cx+Math.cos(m.angle)*(r+18);var y=cy+Math.sin(m.angle)*(r+18);
    ctx.fillText(m.label,x,y);
  });

  var metricsEl=document.getElementById('toneMetrics');metricsEl.innerHTML='';
  var cards=[
    {v:consistency+'%',l:'보잉 균형',cls:consistency>70?'tmGood':consistency>40?'tmOk':'tmWarn'},
    {v:midPct+'%',l:'중간활 비율',cls:midPct>30?'tmGood':midPct>15?'tmOk':'tmWarn'},
    {v:speed+'n/m',l:'노트/분',cls:speed>20?'tmGood':speed>10?'tmOk':'tmWarn'}
  ];
  cards.forEach(function(c){
    metricsEl.innerHTML+='<div class="tmCard '+c.cls+'"><div class="tmVal">'+c.v+'</div><div class="tmLbl">'+c.l+'</div></div>';
  });

  var tips=[];
  if(consistency<50)tips.push('업보우와 다운보우의 균형을 맞춰보세요.');
  if(midPct<20)tips.push('활의 중간 부분을 더 활용하세요.');
  if(speed<15)tips.push('메트로놈과 함께 연습하면 속도가 향상됩니다.');
  if(tips.length===0)tips.push('훌륭한 톤 퀄리티를 유지하고 있습니다!');
  document.getElementById('toneTips').textContent='💡 '+tips[0];

  document.getElementById('tonePanel').classList.add('show');
}

/* ─── 15. PERFORMANCE JOURNAL ─── */
var JOURNAL_KEY='violinV9_journal';
function loadJournal(){try{return JSON.parse(localStorage.getItem(JOURNAL_KEY)||'[]');}catch(e){return [];}}
function saveJournal(j){localStorage.setItem(JOURNAL_KEY,JSON.stringify(j));}

var MOODS=['😊','😐','😔','🔥','😴'];

function createJournalPanel(){
  var panel=document.createElement('div');panel.id='journalPanel';
  panel.innerHTML='<span class="v9Close" id="journalClose">&times;</span>'+
    '<h3>📝 연주 일지</h3>'+
    '<div style="font-size:10px;color:rgba(201,169,110,.4);margin-bottom:8px">오늘의 연습을 기록하세요</div>'+
    '<div class="jMood" id="journalMood"></div>'+
    '<textarea class="jTextarea" id="journalText" placeholder="오늘 연습한 내용, 느낀 점을 적어보세요..."></textarea>'+
    '<div class="jSaveBtn" id="journalSave">💾 저장</div>'+
    '<div style="font-size:11px;color:#ffd700;margin:12px 0 4px;">최근 일지</div>'+
    '<div id="journalEntries"></div>';
  document.body.appendChild(panel);
  document.getElementById('journalClose').addEventListener('pointerdown',function(e){e.preventDefault();panel.classList.remove('show');});

  var moodRow=document.getElementById('journalMood');
  MOODS.forEach(function(m,i){
    var btn=document.createElement('span');btn.className='jMoodBtn';btn.textContent=m;btn.dataset.idx=i;
    btn.addEventListener('pointerdown',function(e){e.preventDefault();
      moodRow.querySelectorAll('.jMoodBtn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
    });
    moodRow.appendChild(btn);
  });

  document.getElementById('journalSave').addEventListener('pointerdown',function(e){
    e.preventDefault();
    var text=document.getElementById('journalText').value.trim();
    var moodBtn=document.querySelector('#journalMood .jMoodBtn.active');
    var mood=moodBtn?moodBtn.textContent:'😊';
    if(!text)return;
    var entries=loadJournal();
    var stats=loadStats();
    entries.unshift({date:new Date().toISOString().slice(0,10),mood:mood,text:text,
      notes:stats.totalNotes||0,time:Math.round((stats.totalTime||0)/60)});
    if(entries.length>50)entries=entries.slice(0,50);
    saveJournal(entries);
    document.getElementById('journalText').value='';
    v9Sfx('journal_save');
    if(typeof showToast==='function')showToast('일지가 저장되었습니다!');
    if(entries.length>=10){var achs=loadAchievements();if(!achs.journal_writer)unlockAch('journal_writer');}
    renderJournalEntries();
  });
}

function renderJournalEntries(){
  var entries=loadJournal();
  var container=document.getElementById('journalEntries');container.innerHTML='';
  entries.slice(0,10).forEach(function(entry){
    var div=document.createElement('div');div.className='jEntry';
    div.innerHTML='<div class="jDate">'+entry.mood+' '+entry.date+'</div>'+
      '<div class="jContent">'+entry.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div>';
    container.appendChild(div);
  });
}

function showJournal(){
  renderJournalEntries();
  document.getElementById('journalPanel').classList.add('show');
}

/* ─── 16. UI INTEGRATION ─── */
(function integrateUI(){
  createVibratoPanel();createDuetPanel();createBowDistPanel();createSharePanel();
  createDiffGuidePanel();createWeeklyChalPanel();createTonePanel();createJournalPanel();

  var hdBtns=document.getElementById('hdBtns');if(!hdBtns)return;

  var btns=[
    {title:'비브라토 (Shift+V)',text:'〰',action:function(){document.getElementById('vibratoPanel').classList.add('show');}},
    {title:'듀엣 (Shift+D)',text:'👯',action:function(){if(typeof ensureA==='function')ensureA();document.getElementById('duetPanel').classList.add('show');}},
    {title:'보잉분석 (Shift+B)',text:'🏹',action:function(){showBowDist();}},
    {title:'공유 (Shift+S)',text:'📤',action:function(){showShareCard();}},
    {title:'난이도 (Shift+G)',text:'📋',action:function(){showDiffGuide();}},
    {title:'주간챌린지 (Shift+W)',text:'🗓',action:function(){showWeeklyChallenge();}},
    {title:'톤분석 (Shift+T)',text:'🎼',action:function(){showToneAnalyzer();}},
    {title:'연주일지 (Shift+J)',text:'📝',action:function(){showJournal();}}
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
      case'V':document.getElementById('vibratoPanel').classList.add('show');break;
      case'D':if(typeof ensureA==='function')ensureA();document.getElementById('duetPanel').classList.add('show');break;
      case'B':showBowDist();break;
      case'S':showShareCard();break;
      case'G':showDiffGuide();break;
      case'W':showWeeklyChallenge();break;
      case'T':showToneAnalyzer();break;
      case'J':showJournal();break;
    }
    if(e.key==='Escape'){
      document.querySelectorAll('#vibratoPanel,#duetPanel,#bowDistPanel,#sharePanel,#diffGuidePanel,#weeklyChalPanel,#tonePanel,#journalPanel').forEach(function(p){p.classList.remove('show');});
      stopVibratoTrainer();stopDuet();
    }
  });

  var titleEl=document.querySelector('#hd h1');
  if(titleEl)titleEl.innerHTML='🎻 Violin Real <span style="font-size:8px;color:#ff6644;vertical-align:super">v9</span>';
  var logoEl=document.getElementById('logo');
  if(logoEl)logoEl.textContent='Violin Real v9';
})();

window.VIOLIN_VERSION='9.0';
})();
