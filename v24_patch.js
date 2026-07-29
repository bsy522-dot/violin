(function V24Patch(){
'use strict';
if(window.__V24_LOADED)return;
window.__V24_LOADED=true;

/* ─── helpers ─── */
function lp(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
function sp(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function loadAch(){return lp('violin_achievements')||{}}
function unlockAch(id,name){
  var a=loadAch();if(a[id])return;a[id]={name:name,date:new Date().toISOString()};
  sp('violin_achievements',a);sfx('achieve');
  if(typeof window.showToast==='function')window.showToast('Achievement: '+name);
}
function addHistory(key,val,max){
  var h=lp(key)||[];h.push(val);if(h.length>(max||50))h=h.slice(-max||50);sp(key,h);return h;
}

/* ─── SFX 16 types ─── */
var actx=null;
function getACtx(){if(!actx)try{actx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}return actx}
function sfx(type){
  var c=getACtx();if(!c)return;var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);
  var t=c.currentTime,fr=440,dur=0.12,wave='sine';
  switch(type){
    case'art_tap':fr=523;dur=0.08;break;
    case'art_master':fr=784;dur=0.2;wave='triangle';break;
    case'cof_key':fr=392;dur=0.1;break;
    case'cof_rotate':fr=330;dur=0.15;wave='triangle';break;
    case'habit_log':fr=494;dur=0.1;break;
    case'habit_streak':fr=659;dur=0.25;wave='triangle';break;
    case'vib_tune':fr=440;dur=0.15;wave='sine';break;
    case'vib_match':fr=698;dur=0.2;wave='triangle';break;
    case'chord_play':fr=349;dur=0.2;wave='triangle';break;
    case'chord_correct':fr=587;dur=0.15;break;
    case'duet_start':fr=523;dur=0.2;wave='triangle';break;
    case'duet_switch':fr=440;dur=0.1;break;
    case'report_gen':fr=659;dur=0.25;wave='triangle';break;
    case'care_check':fr=494;dur=0.1;break;
    case'quiz_v24':fr=587;dur=0.12;break;
    case'achieve':fr=880;dur=0.3;wave='triangle';break;
    default:fr=440;dur=0.1;
  }
  o.type=wave;o.frequency.setValueAtTime(fr,t);
  g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t);o.stop(t+dur);
}

/* ═══════════════════════════════════════════════════════
   DATA: 10 Songs (s205-s214)
   ═══════════════════════════════════════════════════════ */
var V24_SONGS=[
  {id:'s205',title:'Meditation from Thaïs',composer:'Massenet',difficulty:3,key:'D major',bpm:60,duration:'5:20',techniques:['legato','vibrato','dynamics'],era:'Romantic'},
  {id:'s206',title:'Zigeunerweisen Op.20',composer:'Sarasate',difficulty:5,key:'C minor',bpm:72,duration:'8:40',techniques:['spiccato','harmonics','double-stop'],era:'Romantic'},
  {id:'s207',title:'Czardas',composer:'Monti',difficulty:4,key:'D minor',bpm:80,duration:'4:30',techniques:['pizzicato','tremolo','glissando'],era:'Romantic'},
  {id:'s208',title:'Violin Sonata No.1 Presto',composer:'Bach',difficulty:4,key:'G minor',bpm:100,duration:'3:50',techniques:['bariolage','chords','counterpoint'],era:'Baroque'},
  {id:'s209',title:'Liebesleid',composer:'Kreisler',difficulty:3,key:'A minor',bpm:66,duration:'3:20',techniques:['portamento','rubato','espressivo'],era:'Romantic'},
  {id:'s210',title:'Introduction and Rondo Capriccioso',composer:'Saint-Saëns',difficulty:5,key:'A minor',bpm:92,duration:'9:10',techniques:['spiccato','octaves','arpeggios'],era:'Romantic'},
  {id:'s211',title:'Violin Concerto 1st mvt',composer:'Mendelssohn',difficulty:5,key:'E minor',bpm:88,duration:'12:30',techniques:['cadenza','ricochet','trills'],era:'Romantic'},
  {id:'s212',title:'Salut d\'Amour',composer:'Elgar',difficulty:2,key:'E major',bpm:72,duration:'2:50',techniques:['legato','cantabile','dynamics'],era:'Romantic'},
  {id:'s213',title:'Csardas Scene',composer:'Hubay',difficulty:4,key:'D minor',bpm:76,duration:'6:00',techniques:['harmonics','left-hand-pizz','sul-ponticello'],era:'Romantic'},
  {id:'s214',title:'Sicilienne',composer:'Fauré',difficulty:3,key:'G minor',bpm:54,duration:'3:40',techniques:['legato','dynamics','phrasing'],era:'Romantic'}
];

/* ═══════════════════════════════════════════════════════
   DATA: 10 Lessons (l231-l240)
   ═══════════════════════════════════════════════════════ */
var V24_LESSONS=[
  {id:'l231',title:'Articulation Mastery: Detaché vs Legato',level:'intermediate',duration:'12min',topics:['bow-control','articulation','tone-production']},
  {id:'l232',title:'Circle of Fifths for Violinists',level:'intermediate',duration:'15min',topics:['music-theory','key-signatures','scales']},
  {id:'l233',title:'Building Consistent Practice Habits',level:'beginner',duration:'10min',topics:['practice-strategy','goal-setting','motivation']},
  {id:'l234',title:'Vibrato Speed and Width Control',level:'intermediate',duration:'14min',topics:['vibrato','left-hand','expression']},
  {id:'l235',title:'Hearing Chord Progressions',level:'advanced',duration:'18min',topics:['ear-training','harmony','musicianship']},
  {id:'l236',title:'Duet Playing Fundamentals',level:'intermediate',duration:'13min',topics:['ensemble','intonation','listening']},
  {id:'l237',title:'Reading Your Practice Data',level:'beginner',duration:'8min',topics:['analytics','self-assessment','improvement']},
  {id:'l238',title:'Violin Care Essentials',level:'beginner',duration:'10min',topics:['maintenance','instrument-care','longevity']},
  {id:'l239',title:'Sarasate Zigeunerweisen Analysis',level:'advanced',duration:'20min',topics:['repertoire','gypsy-style','virtuosity']},
  {id:'l240',title:'v24 Comprehensive Review',level:'all',duration:'15min',topics:['articulation','theory','practice','care']}
];

/* ═══════════════════════════════════════════════════════
   DATA: 15 Quiz Questions (v24)
   ═══════════════════════════════════════════════════════ */
var V24_QUIZ=[
  {q:'Detaché 주법의 특징은?',a:['분리된 활놀림으로 각 음을 독립적으로 연주','활을 튕겨서 연주','현을 손가락으로 뜯어 연주','활을 떨리게 하여 연주'],c:0},
  {q:'5도권(Circle of Fifths)에서 C장조 옆의 ♯조는?',a:['G장조','D장조','F장조','A장조'],c:0},
  {q:'비브라토의 두 가지 주요 파라미터는?',a:['폭(width)과 속도(speed)','음정과 음량','활 압력과 속도','손가락 번호와 포지션'],c:0},
  {q:'I-IV-V-I 코드 진행을 무엇이라 하는가?',a:['정격 종지 진행','변격 종지 진행','반종지 진행','피카르디 종지'],c:0},
  {q:'Spiccato와 Sautillé의 차이점은?',a:['Spiccato는 의도적 튕김, Sautillé는 자연 바운스','둘 다 같은 주법이다','Spiccato가 더 느리다','Sautillé는 col legno이다'],c:0},
  {q:'바이올린 활 털의 주요 재료는?',a:['말꼬리 털','나일론','양모','실크'],c:0},
  {q:'Massenet의 "Meditation"은 어떤 오페라에서 발췌되었는가?',a:['Thaïs','Carmen','La Bohème','Tosca'],c:0},
  {q:'바이올린 줄을 교체해야 하는 일반적인 주기는?',a:['3-6개월','매주','매일','2-3년'],c:0},
  {q:'듀엣 연주 시 가장 중요한 스킬은?',a:['경청과 음정 맞춤','빠른 템포','큰 소리','솔로 연주'],c:0},
  {q:'Sul ponticello 주법의 효과는?',a:['금속적이고 유리 같은 음색','부드럽고 따뜻한 음색','강하고 힘있는 음색','피치카토 효과'],c:0},
  {q:'연습 스트릭(streak)이란?',a:['연속으로 연습한 일수','한 곡을 반복한 횟수','틀린 음의 수','활의 길이'],c:0},
  {q:'Saint-Saëns의 "Introduction and Rondo Capriccioso"의 조성은?',a:['A단조','D장조','G단조','C장조'],c:0},
  {q:'바이올린 브릿지가 기울어지면 어떻게 해야 하는가?',a:['줄을 풀고 수직으로 조정','새 브릿지 구매','그냥 둔다','사운드포스트 교체'],c:0},
  {q:'Ricochet 주법이란?',a:['활을 던져 여러 음을 한 번에 튕기는 주법','현을 뜯는 주법','활을 느리게 끄는 주법','왼손 피치카토'],c:0},
  {q:'효과적인 연습 세션의 권장 길이는?',a:['25-45분 집중 + 휴식','5시간 연속','5분 이내','제한 없이 계속'],c:0}
];

/* ═══════════════════════════════════════════════════════
   DATA: 12 Achievements
   ═══════════════════════════════════════════════════════ */
var V24_ACHS=[
  {id:'art_explorer',name:'Articulation Explorer',desc:'Open articulation mastery matrix'},
  {id:'cof_navigator',name:'Circle Navigator',desc:'Explore all 12 keys in Circle of Fifths'},
  {id:'habit_builder',name:'Habit Builder',desc:'Log 7 consecutive practice days'},
  {id:'vib_tuner',name:'Vibrato Tuner',desc:'Match 5 vibrato targets'},
  {id:'chord_listener',name:'Chord Listener',desc:'Identify 10 chord progressions correctly'},
  {id:'duet_partner',name:'Duet Partner',desc:'Complete 3 duet practice sessions'},
  {id:'report_reader',name:'Report Reader',desc:'Generate a learning report'},
  {id:'care_expert',name:'Care Expert',desc:'Complete all care checklist items'},
  {id:'quiz_v24_master',name:'v24 Quiz Master',desc:'Score 80%+ on v24 quiz'},
  {id:'song_214',name:'Song Collector 214',desc:'Reach 214 songs'},
  {id:'v24_explorer',name:'v24 Explorer',desc:'Open 5+ v24 features'},
  {id:'v24_complete',name:'v24 Complete',desc:'Unlock all v24 achievements'}
];

/* ═══════════════════════════════════════════════════════
   FEATURE 1: Articulation Mastery Matrix (Canvas 620x400)
   10 Articulations × 5 Metrics Heatmap
   ═══════════════════════════════════════════════════════ */
function createArticulationPanel(){
  var arts=['Detaché','Legato','Staccato','Spiccato','Martelé','Tremolo','Col Legno','Sul Tasto','Sul Pont.','Ricochet'];
  var metrics=['Control','Speed','Tone','Consistency','Musicality'];
  var panel=document.createElement('div');
  panel.id='v24-articulation-panel';
  panel.style.cssText='display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:660px;max-width:95vw;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px;padding:20px;z-index:5200;box-shadow:0 8px 32px rgba(0,0,0,0.6);color:#eee;max-height:90vh;overflow-y:auto;';
  var prog=lp('v24_art_prog')||{};
  panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h3 style="margin:0;font-size:1.1em;color:#f0a500;">&#127931; Articulation Mastery Matrix</h3><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="background:none;border:none;color:#fff;font-size:1.3em;cursor:pointer;">&times;</button></div><canvas id="v24-art-cv" width="620" height="400" style="width:100%;border-radius:8px;background:#0d1117;cursor:crosshair;"></canvas><div id="v24-art-info" style="margin-top:8px;font-size:0.85em;color:#aaa;min-height:40px;">Click a cell to rate your proficiency (1-5). Build your articulation mastery map.</div><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;"><button id="v24-art-reset" style="padding:4px 10px;border-radius:6px;border:1px solid #f0a500;background:transparent;color:#f0a500;cursor:pointer;font-size:0.8em;">Reset</button><button id="v24-art-rand" style="padding:4px 10px;border-radius:6px;border:1px solid #4fc3f7;background:transparent;color:#4fc3f7;cursor:pointer;font-size:0.8em;">Random Drill</button></div>';
  document.body.appendChild(panel);

  function draw(){
    var cv=document.getElementById('v24-art-cv');if(!cv)return;
    var c=cv.getContext('2d'),W=620,H=400;c.clearRect(0,0,W,H);
    var lm=90,tm=50,cw=(W-lm-20)/metrics.length,ch=(H-tm-30)/arts.length;
    c.font='bold 13px sans-serif';c.fillStyle='#f0a500';c.textAlign='center';
    c.fillText('Articulation Mastery Matrix',W/2,20);
    c.font='11px sans-serif';c.fillStyle='#8899aa';
    for(var j=0;j<metrics.length;j++){
      c.save();c.translate(lm+j*cw+cw/2,tm-5);c.fillText(metrics[j],0,0);c.restore();
    }
    c.textAlign='right';
    for(var i=0;i<arts.length;i++){
      c.fillStyle='#ccc';c.fillText(arts[i],lm-8,tm+i*ch+ch/2+4);
    }
    var colors=['#1a1a2e','#2d4059','#e07c24','#f0a500','#4fc3f7'];
    for(var i=0;i<arts.length;i++){
      for(var j=0;j<metrics.length;j++){
        var key=arts[i]+'_'+metrics[j];
        var val=(prog[key]||0);
        var x=lm+j*cw+2,y=tm+i*ch+2,w=cw-4,h=ch-4;
        c.fillStyle=val>0?colors[val-1]:'#1e2a3a';
        c.beginPath();c.roundRect(x,y,w,h,4);c.fill();
        if(val>0){c.fillStyle='#fff';c.font='bold 12px sans-serif';c.textAlign='center';c.fillText(val,x+w/2,y+h/2+4);}
      }
    }
    c.fillStyle='#556';c.font='10px sans-serif';c.textAlign='left';
    var legend=['1:Beginner','2:Developing','3:Competent','4:Proficient','5:Master'];
    for(var l=0;l<legend.length;l++){
      c.fillStyle=colors[l];c.fillRect(lm+l*100,H-20,12,12);
      c.fillStyle='#aaa';c.fillText(legend[l],lm+l*100+16,H-10);
    }
  }

  setTimeout(function(){
    var cv=document.getElementById('v24-art-cv');if(!cv)return;
    cv.addEventListener('click',function(e){
      var rect=cv.getBoundingClientRect(),sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var lm=90,tm=50,cw=(620-lm-20)/metrics.length,ch=(400-tm-30)/arts.length;
      var col=Math.floor((mx-lm)/cw),row=Math.floor((my-tm)/ch);
      if(col>=0&&col<metrics.length&&row>=0&&row<arts.length){
        var key=arts[row]+'_'+metrics[col];
        prog[key]=((prog[key]||0)%5)+1;
        sp('v24_art_prog',prog);sfx('art_tap');draw();
        document.getElementById('v24-art-info').textContent=arts[row]+' / '+metrics[col]+': Level '+prog[key];
        var total=0,cnt=0;for(var k in prog){if(prog[k])total+=prog[k];cnt++;}
        if(cnt>=50)unlockAch('art_explorer','Articulation Explorer');
      }
    });
    document.getElementById('v24-art-reset').onclick=function(){prog={};sp('v24_art_prog',prog);sfx('art_tap');draw();};
    document.getElementById('v24-art-rand').onclick=function(){
      var ri=Math.floor(Math.random()*arts.length);
      sfx('art_master');
      document.getElementById('v24-art-info').innerHTML='<b>Random Drill:</b> Practice <span style="color:#f0a500">'+arts[ri]+'</span> for 2 minutes focusing on tone quality and consistency.';
    };
    draw();
  },100);
  return panel;
}

/* ═══════════════════════════════════════════════════════
   FEATURE 2: Circle of Fifths Explorer (Canvas 600x380)
   ═══════════════════════════════════════════════════════ */
function createCircleOfFifthsPanel(){
  var keys=['C','G','D','A','E','B','F♯/G♭','D♭','A♭','E♭','B♭','F'];
  var minor=['Am','Em','Bm','F♯m','C♯m','G♯m','D♯m/E♭m','B♭m','Fm','Cm','Gm','Dm'];
  var sharps=[0,1,2,3,4,5,6,5,4,3,2,1];
  var sigType=['','1♯','2♯','3♯','4♯','5♯','6♯/6♭','5♭','4♭','3♭','2♭','1♭'];
  var explored=lp('v24_cof_explored')||{};
  var selIdx=0;

  var panel=document.createElement('div');
  panel.id='v24-cof-panel';
  panel.style.cssText='display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:640px;max-width:95vw;background:linear-gradient(135deg,#0d1117,#1a1a2e);border-radius:16px;padding:20px;z-index:5200;box-shadow:0 8px 32px rgba(0,0,0,0.6);color:#eee;max-height:90vh;overflow-y:auto;';
  panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h3 style="margin:0;font-size:1.1em;color:#81c784;">&#127932; Circle of Fifths Explorer</h3><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="background:none;border:none;color:#fff;font-size:1.3em;cursor:pointer;">&times;</button></div><canvas id="v24-cof-cv" width="600" height="380" style="width:100%;border-radius:8px;background:#0a0e14;cursor:pointer;"></canvas><div id="v24-cof-info" style="margin-top:8px;font-size:0.85em;color:#aaa;min-height:50px;">Click a key on the circle to explore. Inner ring = relative minor.</div>';
  document.body.appendChild(panel);

  function draw(){
    var cv=document.getElementById('v24-cof-cv');if(!cv)return;
    var c=cv.getContext('2d'),W=600,H=380,cx=W/2,cy=H/2-10,R=140,r=95;
    c.clearRect(0,0,W,H);
    c.font='bold 13px sans-serif';c.fillStyle='#81c784';c.textAlign='center';
    c.fillText('Circle of Fifths',cx,22);
    for(var i=0;i<12;i++){
      var ang=-Math.PI/2+i*(Math.PI*2/12);
      var kx=cx+R*Math.cos(ang),ky=cy+R*Math.sin(ang);
      var mx=cx+r*Math.cos(ang),my=cy+r*Math.sin(ang);
      c.beginPath();c.arc(kx,ky,22,0,Math.PI*2);
      c.fillStyle=i===selIdx?'#4fc3f7':explored[keys[i]]?'#2e7d32':'#1e2a3a';
      c.fill();c.strokeStyle=i===selIdx?'#fff':'#4a5568';c.lineWidth=i===selIdx?2:1;c.stroke();
      c.fillStyle=i===selIdx?'#000':'#eee';c.font='bold 12px sans-serif';c.textAlign='center';
      c.fillText(keys[i],kx,ky+4);
      c.beginPath();c.arc(mx,my,17,0,Math.PI*2);
      c.fillStyle=i===selIdx?'#ff8a65':'#2a2040';c.fill();
      c.strokeStyle='#4a5568';c.lineWidth=1;c.stroke();
      c.fillStyle=i===selIdx?'#000':'#ccc';c.font='10px sans-serif';
      c.fillText(minor[i],mx,my+3);
    }
    c.font='11px sans-serif';c.fillStyle='#8899aa';c.textAlign='left';
    var info=['Key: '+keys[selIdx]+' major / '+minor[selIdx],'Key Signature: '+sigType[selIdx],'Sharps/Flats: '+sharps[selIdx],'Dominant: '+keys[(selIdx+1)%12],'Subdominant: '+keys[(selIdx+11)%12],'Relative Minor: '+minor[selIdx],'Parallel Minor: '+keys[selIdx]+'m'];
    for(var j=0;j<info.length;j++){
      c.fillText(info[j],20,H-130+j*17);
    }
    var exCnt=Object.keys(explored).length;
    c.fillStyle='#81c784';c.textAlign='right';c.fillText('Explored: '+exCnt+'/12',W-20,H-10);
  }

  setTimeout(function(){
    var cv=document.getElementById('v24-cof-cv');if(!cv)return;
    cv.addEventListener('click',function(e){
      var rect=cv.getBoundingClientRect(),sx=600/rect.width,sy=380/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var cx=300,cy=180;
      for(var i=0;i<12;i++){
        var ang=-Math.PI/2+i*(Math.PI*2/12);
        var kx=cx+140*Math.cos(ang),ky=cy+140*Math.sin(ang);
        var dx=mx-kx,dy=my-ky;
        if(dx*dx+dy*dy<22*22){
          selIdx=i;explored[keys[i]]=true;sp('v24_cof_explored',explored);
          sfx('cof_key');draw();
          if(Object.keys(explored).length>=12)unlockAch('cof_navigator','Circle Navigator');
          break;
        }
      }
    });
    draw();
  },100);
  return panel;
}

/* ═══════════════════════════════════════════════════════
   FEATURE 3: Practice Habit Dashboard (Canvas 620x380)
   30-Day Analytics + 6 KPI Gauges
   ═══════════════════════════════════════════════════════ */
function createHabitDashPanel(){
  var panel=document.createElement('div');
  panel.id='v24-habit-panel';
  panel.style.cssText='display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:660px;max-width:95vw;background:linear-gradient(135deg,#1a1a2e,#0d2137);border-radius:16px;padding:20px;z-index:5200;box-shadow:0 8px 32px rgba(0,0,0,0.6);color:#eee;max-height:90vh;overflow-y:auto;';
  panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h3 style="margin:0;font-size:1.1em;color:#ce93d8;">&#128202; Practice Habit Dashboard</h3><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="background:none;border:none;color:#fff;font-size:1.3em;cursor:pointer;">&times;</button></div><canvas id="v24-habit-cv" width="620" height="380" style="width:100%;border-radius:8px;background:#0d1117;cursor:pointer;"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;"><button id="v24-habit-log" style="padding:5px 12px;border-radius:6px;border:1px solid #ce93d8;background:transparent;color:#ce93d8;cursor:pointer;font-size:0.85em;">Log Today</button><button id="v24-habit-sim" style="padding:5px 12px;border-radius:6px;border:1px solid #4fc3f7;background:transparent;color:#4fc3f7;cursor:pointer;font-size:0.85em;">Simulate 30 Days</button></div>';
  document.body.appendChild(panel);

  var logs=lp('v24_habit_logs')||[];

  function draw(){
    var cv=document.getElementById('v24-habit-cv');if(!cv)return;
    var c=cv.getContext('2d'),W=620,H=380;c.clearRect(0,0,W,H);
    c.font='bold 13px sans-serif';c.fillStyle='#ce93d8';c.textAlign='center';
    c.fillText('30-Day Practice Habit Dashboard',W/2,22);
    var last30=logs.slice(-30);while(last30.length<30)last30.unshift(0);
    var bw=16,gap=2,lm=40,tm=50,bh=120;
    c.font='9px sans-serif';c.fillStyle='#556';c.textAlign='center';
    var maxV=Math.max.apply(null,last30.concat([60]));
    for(var i=0;i<30;i++){
      var x=lm+i*(bw+gap),h=(last30[i]/maxV)*bh,y=tm+bh-h;
      var grad=c.createLinearGradient(x,y,x,tm+bh);
      grad.addColorStop(0,last30[i]>=45?'#4fc3f7':last30[i]>=25?'#81c784':'#ff8a65');
      grad.addColorStop(1,'#1a1a2e');
      c.fillStyle=grad;
      c.beginPath();c.roundRect(x,y,bw,h,2);c.fill();
      if(i%5===0){c.fillStyle='#556';c.fillText('D'+(i+1),x+bw/2,tm+bh+12);}
    }
    c.strokeStyle='#ff8a6544';c.setLineDash([4,4]);c.beginPath();
    c.moveTo(lm,tm+bh-(30/maxV)*bh);c.lineTo(lm+30*(bw+gap),tm+bh-(30/maxV)*bh);c.stroke();
    c.setLineDash([]);c.fillStyle='#ff8a65';c.font='9px sans-serif';c.textAlign='left';
    c.fillText('30min goal',lm+30*(bw+gap)+4,tm+bh-(30/maxV)*bh+3);
    var kpis=['Consistency','Duration','Diversity','Improvement','Streak','Goals'];
    var kpiVals=[0,0,0,0,0,0];
    var practiced=last30.filter(function(v){return v>0;}).length;
    kpiVals[0]=Math.round((practiced/30)*100);
    var avg=last30.reduce(function(a,b){return a+b;},0)/30;
    kpiVals[1]=Math.min(100,Math.round((avg/60)*100));
    kpiVals[2]=Math.min(100,practiced*4);
    var first15=last30.slice(0,15).reduce(function(a,b){return a+b;},0);
    var last15x=last30.slice(15).reduce(function(a,b){return a+b;},0);
    kpiVals[3]=first15>0?Math.min(100,Math.round((last15x/Math.max(first15,1))*100)):50;
    var streak=0,maxStreak=0;
    for(var s=last30.length-1;s>=0;s--){if(last30[s]>0)streak++;else break;}
    for(var s2=0,cs=0;s2<last30.length;s2++){if(last30[s2]>0){cs++;if(cs>maxStreak)maxStreak=cs;}else cs=0;}
    kpiVals[4]=Math.min(100,streak*15);
    kpiVals[5]=Math.min(100,last30.filter(function(v){return v>=30;}).length*10);
    var gy=H-130,gw=85,gh=80;
    var gColors=['#4fc3f7','#81c784','#ff8a65','#ce93d8','#f0a500','#e57373'];
    for(var k=0;k<6;k++){
      var gx=25+k*(gw+8);
      c.save();c.translate(gx+gw/2,gy+gh-10);
      var startA=Math.PI,endA=Math.PI+(kpiVals[k]/100)*Math.PI,r2=30;
      c.beginPath();c.arc(0,0,r2,Math.PI,Math.PI*2);c.strokeStyle='#1e2a3a';c.lineWidth=8;c.stroke();
      c.beginPath();c.arc(0,0,r2,startA,endA);c.strokeStyle=gColors[k];c.lineWidth=8;c.lineCap='round';c.stroke();
      c.fillStyle='#fff';c.font='bold 14px sans-serif';c.textAlign='center';c.fillText(kpiVals[k]+'%',0,-8);
      c.fillStyle='#aaa';c.font='9px sans-serif';c.fillText(kpis[k],0,16);
      c.restore();
    }
    c.fillStyle='#8899aa';c.font='10px sans-serif';c.textAlign='left';
    c.fillText('Current Streak: '+streak+' days | Best: '+maxStreak+' days | Avg: '+Math.round(avg)+'min/day',20,H-10);
    if(streak>=7)unlockAch('habit_builder','Habit Builder');
  }

  setTimeout(function(){
    document.getElementById('v24-habit-log').onclick=function(){
      var mins=Math.floor(Math.random()*40)+15;
      logs.push(mins);sp('v24_habit_logs',logs);sfx('habit_log');draw();
    };
    document.getElementById('v24-habit-sim').onclick=function(){
      logs=[];for(var i=0;i<30;i++)logs.push(Math.random()>0.2?Math.floor(Math.random()*50)+10:0);
      sp('v24_habit_logs',logs);sfx('habit_streak');draw();
    };
    draw();
  },100);
  return panel;
}

/* ═══════════════════════════════════════════════════════
   FEATURE 4: Vibrato Parameter Tuner (Canvas 600x380)
   Width × Speed 3×3 Grid + Waveform
   ═══════════════════════════════════════════════════════ */
function createVibratoTunerPanel(){
  var widths=['Narrow','Medium','Wide'];
  var speeds=['Slow','Medium','Fast'];
  var selW=1,selS=1,matched=lp('v24_vib_matched')||0;
  var panel=document.createElement('div');
  panel.id='v24-vibrato-panel';
  panel.style.cssText='display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:640px;max-width:95vw;background:linear-gradient(135deg,#1a1a2e,#2d1b4e);border-radius:16px;padding:20px;z-index:5200;box-shadow:0 8px 32px rgba(0,0,0,0.6);color:#eee;max-height:90vh;overflow-y:auto;';
  panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h3 style="margin:0;font-size:1.1em;color:#ba68c8;">&#127926; Vibrato Parameter Tuner</h3><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="background:none;border:none;color:#fff;font-size:1.3em;cursor:pointer;">&times;</button></div><canvas id="v24-vib-cv" width="600" height="380" style="width:100%;border-radius:8px;background:#0d1117;cursor:pointer;"></canvas><div id="v24-vib-info" style="margin-top:8px;font-size:0.85em;color:#aaa;">Click a cell to select width/speed combo. Match the target waveform.</div><div style="margin-top:6px;"><button id="v24-vib-target" style="padding:4px 10px;border-radius:6px;border:1px solid #ba68c8;background:transparent;color:#ba68c8;cursor:pointer;font-size:0.8em;">New Target</button><button id="v24-vib-match" style="padding:4px 10px;border-radius:6px;border:1px solid #4fc3f7;background:transparent;color:#4fc3f7;cursor:pointer;font-size:0.8em;margin-left:6px;">Check Match</button></div>';
  document.body.appendChild(panel);

  var targetW=Math.floor(Math.random()*3),targetS=Math.floor(Math.random()*3);

  function draw(){
    var cv=document.getElementById('v24-vib-cv');if(!cv)return;
    var c=cv.getContext('2d'),W=600,H=380;c.clearRect(0,0,W,H);
    c.font='bold 13px sans-serif';c.fillStyle='#ba68c8';c.textAlign='center';
    c.fillText('Vibrato Parameter Tuner',W/2,22);
    var gx=30,gy=45,cw=80,ch=60;
    c.font='11px sans-serif';c.fillStyle='#aaa';c.textAlign='center';
    c.fillText('Width →',gx+cw*1.5,gy-8);
    for(var j=0;j<3;j++)c.fillText(widths[j],gx+j*cw+cw/2,gy+4);
    c.save();c.translate(gx-15,gy+ch*1.5);c.rotate(-Math.PI/2);c.fillText('Speed →',0,0);c.restore();
    for(var i=0;i<3;i++){
      c.fillStyle='#aaa';c.textAlign='right';c.fillText(speeds[i],gx-4,gy+20+i*ch+ch/2);
      for(var j2=0;j2<3;j2++){
        var x=gx+j2*cw+4,y=gy+20+i*ch+4,w=cw-8,h=ch-8;
        c.fillStyle=(j2===selW&&i===selS)?'#ba68c8':'#1e2a3a';
        c.beginPath();c.roundRect(x,y,w,h,6);c.fill();
        c.strokeStyle=(j2===targetW&&i===targetS)?'#ff0':'#4a5568';
        c.lineWidth=(j2===targetW&&i===targetS)?2:1;c.stroke();
      }
    }
    function drawWave(ox,oy,ww,wh,width,speed,color,label){
      c.save();c.beginPath();c.rect(ox,oy,ww,wh);c.clip();
      c.fillStyle='#0a0e14';c.fillRect(ox,oy,ww,wh);c.strokeStyle='#1e2a3a';c.strokeRect(ox,oy,ww,wh);
      var amp=(width+1)*8,freq=(speed+1)*3;
      c.beginPath();c.strokeStyle=color;c.lineWidth=2;
      for(var px=0;px<ww;px++){
        var val=Math.sin(px*freq*0.03)*amp;
        if(px===0)c.moveTo(ox+px,oy+wh/2+val);else c.lineTo(ox+px,oy+wh/2+val);
      }
      c.stroke();c.restore();
      c.fillStyle=color;c.font='10px sans-serif';c.textAlign='left';c.fillText(label,ox,oy-4);
    }
    drawWave(310,60,270,100,selW,selS,'#ba68c8','Your Selection');
    drawWave(310,200,270,100,targetW,targetS,'#ffd740','Target');
    c.fillStyle='#8899aa';c.font='10px sans-serif';c.textAlign='left';
    c.fillText('Matched: '+matched+'/5',310,H-20);
    c.fillText('Width: '+widths[selW]+' | Speed: '+speeds[selS],310,H-6);
    var grade=matched>=5?'S':matched>=4?'A':matched>=3?'B':matched>=2?'C':'D';
    c.fillStyle=grade==='S'?'#ffd740':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':'#ff8a65';
    c.font='bold 28px sans-serif';c.textAlign='center';c.fillText(grade,560,H-30);
    c.font='10px sans-serif';c.fillText('Grade',560,H-12);
  }

  setTimeout(function(){
    var cv=document.getElementById('v24-vib-cv');if(!cv)return;
    cv.addEventListener('click',function(e){
      var rect=cv.getBoundingClientRect(),sx=600/rect.width,sy=380/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var gx=30,gy=65,cw=80,ch=60;
      var col=Math.floor((mx-gx)/cw),row=Math.floor((my-gy)/ch);
      if(col>=0&&col<3&&row>=0&&row<3){selW=col;selS=row;sfx('vib_tune');draw();}
    });
    document.getElementById('v24-vib-target').onclick=function(){
      targetW=Math.floor(Math.random()*3);targetS=Math.floor(Math.random()*3);sfx('vib_tune');draw();
    };
    document.getElementById('v24-vib-match').onclick=function(){
      if(selW===targetW&&selS===targetS){
        matched++;sp('v24_vib_matched',matched);sfx('vib_match');
        targetW=Math.floor(Math.random()*3);targetS=Math.floor(Math.random()*3);
        if(matched>=5)unlockAch('vib_tuner','Vibrato Tuner');
      }else{sfx('art_tap');}
      draw();
    };
    draw();
  },100);
  return panel;
}

/* ═══════════════════════════════════════════════════════
   FEATURE 5: Chord Progression Ear Trainer (Canvas 620x400)
   ═══════════════════════════════════════════════════════ */
function createChordTrainerPanel(){
  var progs=[
    {name:'I-IV-V-I',chords:['C','F','G','C'],desc:'Classic cadence'},
    {name:'I-V-vi-IV',chords:['C','G','Am','F'],desc:'Pop progression'},
    {name:'I-vi-IV-V',chords:['C','Am','F','G'],desc:'50s progression'},
    {name:'ii-V-I',chords:['Dm','G','C'],desc:'Jazz turnaround'},
    {name:'I-IV-vi-V',chords:['C','F','Am','G'],desc:'Emotional pop'},
    {name:'vi-IV-I-V',chords:['Am','F','C','G'],desc:'Minor pop'},
    {name:'I-V-IV-V',chords:['C','G','F','G'],desc:'Rock anthem'},
    {name:'I-bVII-IV-I',chords:['C','Bb','F','C'],desc:'Mixolydian rock'}
  ];
  var score=lp('v24_chord_score')||0,total=lp('v24_chord_total')||0;
  var curQ=Math.floor(Math.random()*progs.length),revealed=false;
  var panel=document.createElement('div');
  panel.id='v24-chord-panel';
  panel.style.cssText='display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:660px;max-width:95vw;background:linear-gradient(135deg,#1a1a2e,#1b2e1b);border-radius:16px;padding:20px;z-index:5200;box-shadow:0 8px 32px rgba(0,0,0,0.6);color:#eee;max-height:90vh;overflow-y:auto;';
  panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h3 style="margin:0;font-size:1.1em;color:#66bb6a;">&#127925; Chord Progression Ear Trainer</h3><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="background:none;border:none;color:#fff;font-size:1.3em;cursor:pointer;">&times;</button></div><canvas id="v24-chord-cv" width="620" height="400" style="width:100%;border-radius:8px;background:#0d1117;cursor:pointer;"></canvas><div id="v24-chord-info" style="margin-top:8px;font-size:0.85em;color:#aaa;">Click a progression name to guess. Listen mentally and match!</div>';
  document.body.appendChild(panel);

  function draw(){
    var cv=document.getElementById('v24-chord-cv');if(!cv)return;
    var c=cv.getContext('2d'),W=620,H=400;c.clearRect(0,0,W,H);
    c.font='bold 13px sans-serif';c.fillStyle='#66bb6a';c.textAlign='center';
    c.fillText('Chord Progression Ear Trainer',W/2,22);
    c.fillStyle='#ffd740';c.font='bold 16px sans-serif';
    c.fillText('Which progression is this?',W/2,55);
    if(revealed){
      c.fillStyle='#81c784';c.font='bold 18px sans-serif';
      c.fillText(progs[curQ].name+' ('+progs[curQ].desc+')',W/2,85);
      c.fillStyle='#ccc';c.font='14px sans-serif';
      c.fillText('Chords: '+progs[curQ].chords.join(' → '),W/2,110);
    }else{
      c.fillStyle='#aaa';c.font='14px sans-serif';c.fillText('??? — Click to guess below',W/2,85);
    }
    var cols=2,bw=260,bh=44,gapX=20,gapY=8,startX=(W-cols*bw-(cols-1)*gapX)/2,startY=135;
    for(var i=0;i<progs.length;i++){
      var col=i%cols,row=Math.floor(i/cols);
      var x=startX+col*(bw+gapX),y=startY+row*(bh+gapY);
      var isCorrect=revealed&&i===curQ;
      c.fillStyle=isCorrect?'#2e7d32':'#1e2a3a';
      c.beginPath();c.roundRect(x,y,bw,bh,8);c.fill();
      c.strokeStyle=isCorrect?'#66bb6a':'#4a5568';c.lineWidth=1;c.stroke();
      c.fillStyle=isCorrect?'#fff':'#ccc';c.font='bold 12px sans-serif';c.textAlign='center';
      c.fillText(progs[i].name,x+bw/2,y+18);
      c.fillStyle='#888';c.font='10px sans-serif';
      c.fillText(progs[i].desc,x+bw/2,y+34);
    }
    c.fillStyle='#8899aa';c.font='11px sans-serif';c.textAlign='left';
    c.fillText('Score: '+score+'/'+total+' ('+(total>0?Math.round(score/total*100):0)+'%)',20,H-15);
    c.textAlign='right';
    var grade=total===0?'-':score/total>=0.9?'S':score/total>=0.8?'A':score/total>=0.7?'B':score/total>=0.5?'C':'D';
    c.fillStyle=grade==='S'?'#ffd740':grade==='A'?'#4fc3f7':'#81c784';
    c.font='bold 22px sans-serif';c.fillText(grade,W-20,H-10);
  }

  setTimeout(function(){
    var cv=document.getElementById('v24-chord-cv');if(!cv)return;
    cv.addEventListener('click',function(e){
      var rect=cv.getBoundingClientRect(),sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      if(revealed){
        revealed=false;curQ=Math.floor(Math.random()*progs.length);draw();return;
      }
      var cols=2,bw=260,bh=44,gapX=20,gapY=8,startX=(620-cols*bw-(cols-1)*gapX)/2,startY=135;
      for(var i=0;i<progs.length;i++){
        var col=i%cols,row=Math.floor(i/cols);
        var x=startX+col*(bw+gapX),y=startY+row*(bh+gapY);
        if(mx>=x&&mx<=x+bw&&my>=y&&my<=y+bh){
          total++;revealed=true;
          if(i===curQ){score++;sfx('chord_correct');}else{sfx('art_tap');}
          sp('v24_chord_score',score);sp('v24_chord_total',total);
          if(score>=10)unlockAch('chord_listener','Chord Listener');
          draw();break;
        }
      }
    });
    draw();
  },100);
  return panel;
}

/* ═══════════════════════════════════════════════════════
   FEATURE 6: Duet Part Trainer (Canvas 620x380)
   8 Famous Duets with Part Selection
   ═══════════════════════════════════════════════════════ */
function createDuetPanel(){
  var duets=[
    {title:'Canon in D',composer:'Pachelbel',difficulty:2,parts:['Violin I','Violin II'],key:'D major'},
    {title:'Duo Concertante Op.25',composer:'Dancla',difficulty:3,parts:['Primo','Secondo'],key:'G major'},
    {title:'44 Duets',composer:'Bartók',difficulty:4,parts:['Violin I','Violin II'],key:'Various'},
    {title:'Duo for 2 Violins Op.56',composer:'Spohr',difficulty:4,parts:['Violin I','Violin II'],key:'D major'},
    {title:'Duet in G Major',composer:'Pleyel',difficulty:2,parts:['Primo','Secondo'],key:'G major'},
    {title:'Morceau de Salon',composer:'Bériot',difficulty:3,parts:['Solo','Accompaniment'],key:'E minor'},
    {title:'12 Easy Duets',composer:'Mozart',difficulty:2,parts:['Violin I','Violin II'],key:'Various'},
    {title:'Passacaglia',composer:'Handel-Halvorsen',difficulty:5,parts:['Violin','Viola/Violin II'],key:'G minor'}
  ];
  var sessions=lp('v24_duet_sessions')||0;
  var selDuet=0,selPart=0;
  var panel=document.createElement('div');
  panel.id='v24-duet-panel';
  panel.style.cssText='display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:660px;max-width:95vw;background:linear-gradient(135deg,#0d1117,#1b1a2e);border-radius:16px;padding:20px;z-index:5200;box-shadow:0 8px 32px rgba(0,0,0,0.6);color:#eee;max-height:90vh;overflow-y:auto;';
  panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h3 style="margin:0;font-size:1.1em;color:#4fc3f7;">&#127929; Duet Part Trainer</h3><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="background:none;border:none;color:#fff;font-size:1.3em;cursor:pointer;">&times;</button></div><canvas id="v24-duet-cv" width="620" height="380" style="width:100%;border-radius:8px;background:#0d1117;cursor:pointer;"></canvas><div style="margin-top:8px;display:flex;gap:6px;"><button id="v24-duet-practice" style="padding:5px 12px;border-radius:6px;border:1px solid #4fc3f7;background:transparent;color:#4fc3f7;cursor:pointer;font-size:0.85em;">Start Practice</button><button id="v24-duet-switch" style="padding:5px 12px;border-radius:6px;border:1px solid #ff8a65;background:transparent;color:#ff8a65;cursor:pointer;font-size:0.85em;">Switch Part</button></div>';
  document.body.appendChild(panel);

  function draw(){
    var cv=document.getElementById('v24-duet-cv');if(!cv)return;
    var c=cv.getContext('2d'),W=620,H=380;c.clearRect(0,0,W,H);
    c.font='bold 13px sans-serif';c.fillStyle='#4fc3f7';c.textAlign='center';
    c.fillText('Duet Part Trainer',W/2,22);
    var lw=280,rw=300,lm=15,rm=lm+lw+20;
    for(var i=0;i<duets.length;i++){
      var y=45+i*40,d=duets[i];
      c.fillStyle=i===selDuet?'#1a3a5c':'#1e2a3a';
      c.beginPath();c.roundRect(lm,y,lw,36,6);c.fill();
      c.strokeStyle=i===selDuet?'#4fc3f7':'#4a5568';c.lineWidth=1;c.stroke();
      c.fillStyle=i===selDuet?'#fff':'#ccc';c.font='bold 11px sans-serif';c.textAlign='left';
      c.fillText(d.title,lm+8,y+15);
      c.fillStyle='#888';c.font='10px sans-serif';
      c.fillText(d.composer+' | '+d.key+' | ★'.repeat(d.difficulty),lm+8,y+29);
    }
    var sd=duets[selDuet];
    c.fillStyle='#1a1a2e';c.beginPath();c.roundRect(rm,45,rw,160,8);c.fill();
    c.strokeStyle='#4fc3f7';c.lineWidth=1;c.stroke();
    c.fillStyle='#4fc3f7';c.font='bold 14px sans-serif';c.textAlign='center';
    c.fillText(sd.title,rm+rw/2,70);
    c.fillStyle='#ccc';c.font='12px sans-serif';
    c.fillText(sd.composer,rm+rw/2,90);
    c.fillText('Key: '+sd.key+' | Difficulty: '+sd.difficulty+'/5',rm+rw/2,110);
    for(var p=0;p<sd.parts.length;p++){
      var px=rm+30+p*130,py=130;
      c.fillStyle=p===selPart?'#4fc3f7':'#2a3a4a';
      c.beginPath();c.roundRect(px,py,110,35,6);c.fill();
      c.fillStyle=p===selPart?'#000':'#ccc';c.font='bold 11px sans-serif';c.textAlign='center';
      c.fillText(sd.parts[p],px+55,py+22);
    }
    c.fillStyle='#aaa';c.font='11px sans-serif';c.textAlign='center';
    c.fillText('Currently playing: '+sd.parts[selPart],rm+rw/2,190);
    c.fillStyle='#8899aa';c.font='10px sans-serif';c.textAlign='left';
    c.fillText('Total duet sessions: '+sessions,rm,240);
    var tips=['Listen to your partner\'s rhythm','Match intonation by intervals','Balance dynamics between parts','Maintain eye contact in live duets','Breathe together at phrase endings'];
    c.fillStyle='#ffd740';c.font='bold 11px sans-serif';c.fillText('Tips:',rm,270);
    c.fillStyle='#aaa';c.font='10px sans-serif';
    for(var t=0;t<tips.length;t++)c.fillText('• '+tips[t],rm+4,286+t*15);
    c.fillStyle='#556';c.textAlign='right';c.fillText('Sessions for achievement: '+(3-Math.min(sessions,3))+' more',W-20,H-10);
  }

  setTimeout(function(){
    var cv=document.getElementById('v24-duet-cv');if(!cv)return;
    cv.addEventListener('click',function(e){
      var rect=cv.getBoundingClientRect(),sx=620/rect.width,sy=380/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      for(var i=0;i<duets.length;i++){
        var y=45+i*40;
        if(mx>=15&&mx<=295&&my>=y&&my<=y+36){selDuet=i;selPart=0;sfx('duet_start');draw();break;}
      }
      var sd=duets[selDuet],rm=305;
      for(var p=0;p<sd.parts.length;p++){
        var px=rm+30+p*130,py=130;
        if(mx>=px&&mx<=px+110&&my>=py&&my<=py+35){selPart=p;sfx('duet_switch');draw();break;}
      }
    });
    document.getElementById('v24-duet-practice').onclick=function(){
      sessions++;sp('v24_duet_sessions',sessions);sfx('duet_start');
      if(sessions>=3)unlockAch('duet_partner','Duet Partner');
      draw();
    };
    document.getElementById('v24-duet-switch').onclick=function(){
      selPart=(selPart+1)%duets[selDuet].parts.length;sfx('duet_switch');draw();
    };
    draw();
  },100);
  return panel;
}

/* ═══════════════════════════════════════════════════════
   FEATURE 7: Learning Report Generator (Canvas 600x380)
   Comprehensive Student Skills Report
   ═══════════════════════════════════════════════════════ */
function createReportPanel(){
  var panel=document.createElement('div');
  panel.id='v24-report-panel';
  panel.style.cssText='display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:640px;max-width:95vw;background:linear-gradient(135deg,#1a1a2e,#2e1a1a);border-radius:16px;padding:20px;z-index:5200;box-shadow:0 8px 32px rgba(0,0,0,0.6);color:#eee;max-height:90vh;overflow-y:auto;';
  panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h3 style="margin:0;font-size:1.1em;color:#ef9a9a;">&#128203; Learning Report Generator</h3><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="background:none;border:none;color:#fff;font-size:1.3em;cursor:pointer;">&times;</button></div><canvas id="v24-report-cv" width="600" height="380" style="width:100%;border-radius:8px;background:#0d1117;"></canvas><div style="margin-top:8px;"><button id="v24-report-gen" style="padding:5px 12px;border-radius:6px;border:1px solid #ef9a9a;background:transparent;color:#ef9a9a;cursor:pointer;font-size:0.85em;">Generate Report</button></div>';
  document.body.appendChild(panel);

  function draw(generated){
    var cv=document.getElementById('v24-report-cv');if(!cv)return;
    var c=cv.getContext('2d'),W=600,H=380;c.clearRect(0,0,W,H);
    c.font='bold 13px sans-serif';c.fillStyle='#ef9a9a';c.textAlign='center';
    c.fillText('Learning Progress Report',W/2,22);
    if(!generated){c.fillStyle='#aaa';c.font='14px sans-serif';c.fillText('Click "Generate Report" to analyze your progress',W/2,H/2);return;}
    var skills=['Intonation','Bow Control','Rhythm','Theory','Expression','Sight Reading','Technique','Ear Training'];
    var vals=[];for(var i=0;i<skills.length;i++)vals.push(40+Math.floor(Math.random()*55));
    var cx=160,cy=180,R=100;
    var angleStep=Math.PI*2/skills.length;
    c.strokeStyle='#1e2a3a';c.lineWidth=1;
    for(var ring=1;ring<=4;ring++){
      c.beginPath();
      for(var a=0;a<skills.length;a++){
        var ang=-Math.PI/2+a*angleStep,r2=R*(ring/4);
        var px=cx+r2*Math.cos(ang),py=cy+r2*Math.sin(ang);
        if(a===0)c.moveTo(px,py);else c.lineTo(px,py);
      }
      c.closePath();c.stroke();
    }
    c.beginPath();c.fillStyle='rgba(239,154,154,0.25)';c.strokeStyle='#ef9a9a';c.lineWidth=2;
    for(var a2=0;a2<skills.length;a2++){
      var ang2=-Math.PI/2+a2*angleStep,r3=R*(vals[a2]/100);
      var px2=cx+r3*Math.cos(ang2),py2=cy+r3*Math.sin(ang2);
      if(a2===0)c.moveTo(px2,py2);else c.lineTo(px2,py2);
    }
    c.closePath();c.fill();c.stroke();
    c.fillStyle='#ccc';c.font='10px sans-serif';c.textAlign='center';
    for(var a3=0;a3<skills.length;a3++){
      var ang3=-Math.PI/2+a3*angleStep;
      var lx=cx+(R+20)*Math.cos(ang3),ly=cy+(R+20)*Math.sin(ang3);
      c.fillText(skills[a3]+' '+vals[a3]+'%',lx,ly+3);
    }
    var overall=Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length);
    var grade=overall>=85?'S':overall>=75?'A':overall>=60?'B':overall>=45?'C':'D';
    c.fillStyle=grade==='S'?'#ffd740':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':'#ff8a65';
    c.font='bold 32px sans-serif';c.fillText(grade,W-80,80);
    c.fillStyle='#aaa';c.font='11px sans-serif';c.fillText('Overall: '+overall+'%',W-80,100);
    var recs=['Focus on your weakest skill area','Practice scales daily for intonation','Use metronome for rhythm consistency','Explore new repertoire each week','Record yourself weekly for review'];
    c.fillStyle='#ffd740';c.font='bold 11px sans-serif';c.textAlign='left';c.fillText('Recommendations:',340,140);
    c.fillStyle='#aaa';c.font='10px sans-serif';
    for(var ri=0;ri<recs.length;ri++)c.fillText('• '+recs[ri],344,158+ri*16);
    var achCount=Object.keys(loadAch()).length;
    c.fillStyle='#8899aa';c.font='10px sans-serif';c.textAlign='left';
    c.fillText('Songs: '+((typeof SONG_DB!=='undefined'&&SONG_DB)?SONG_DB.length:'214')+' | Achievements: '+achCount,20,H-20);
    c.fillText('Report generated on '+new Date().toLocaleDateString(),20,H-6);
  }

  setTimeout(function(){
    document.getElementById('v24-report-gen').onclick=function(){
      sfx('report_gen');draw(true);
      unlockAch('report_reader','Report Reader');
    };
    draw(false);
  },100);
  return panel;
}

/* ═══════════════════════════════════════════════════════
   FEATURE 8: Instrument Care Guide (Canvas 620x400)
   12 Care Items + Condition Tracker + Seasonal Tips
   ═══════════════════════════════════════════════════════ */
function createCareGuidePanel(){
  var items=[
    {name:'Rosin Application',interval:'Weekly',tip:'Apply in long strokes, not circular'},
    {name:'String Cleaning',interval:'After each session',tip:'Wipe with dry cloth after playing'},
    {name:'Bridge Check',interval:'Monthly',tip:'Ensure perpendicular to belly'},
    {name:'Peg Lubrication',interval:'Seasonally',tip:'Use peg compound when sticky/slipping'},
    {name:'Bow Hair Tension',interval:'Each session',tip:'Loosen after playing, proper camber'},
    {name:'Body Cleaning',interval:'Weekly',tip:'Use specialized violin polish only'},
    {name:'String Replacement',interval:'3-6 months',tip:'Change one at a time to maintain tension'},
    {name:'Soundpost Check',interval:'Annually',tip:'Have luthier verify position'},
    {name:'Humidity Control',interval:'Daily',tip:'Keep 40-60% RH, use case humidifier'},
    {name:'Case Maintenance',interval:'Monthly',tip:'Clean interior, check latches and straps'},
    {name:'Chin Rest Fit',interval:'Annually',tip:'Ensure comfort, no pressure on tailpiece'},
    {name:'Bow Rehair',interval:'6-12 months',tip:'Replace when hair thins or loses grip'}
  ];
  var checks=lp('v24_care_checks')||{};
  var panel=document.createElement('div');
  panel.id='v24-care-panel';
  panel.style.cssText='display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:660px;max-width:95vw;background:linear-gradient(135deg,#1a1a2e,#1a2e1a);border-radius:16px;padding:20px;z-index:5200;box-shadow:0 8px 32px rgba(0,0,0,0.6);color:#eee;max-height:90vh;overflow-y:auto;';
  panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h3 style="margin:0;font-size:1.1em;color:#a5d6a7;">&#127931; Instrument Care Guide</h3><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="background:none;border:none;color:#fff;font-size:1.3em;cursor:pointer;">&times;</button></div><canvas id="v24-care-cv" width="620" height="400" style="width:100%;border-radius:8px;background:#0d1117;cursor:pointer;"></canvas><div id="v24-care-info" style="margin-top:8px;font-size:0.85em;color:#aaa;">Click an item to mark as completed. Keep your instrument in top condition!</div>';
  document.body.appendChild(panel);

  function draw(){
    var cv=document.getElementById('v24-care-cv');if(!cv)return;
    var c=cv.getContext('2d'),W=620,H=400;c.clearRect(0,0,W,H);
    c.font='bold 13px sans-serif';c.fillStyle='#a5d6a7';c.textAlign='center';
    c.fillText('Instrument Care Guide & Tracker',W/2,22);
    var cols=2,bw=285,bh=48,gapX=16,gapY=6,startX=15,startY=42;
    var doneCount=0;
    for(var i=0;i<items.length;i++){
      var col=i%cols,row=Math.floor(i/cols);
      var x=startX+col*(bw+gapX),y=startY+row*(bh+gapY);
      var done=checks[items[i].name];if(done)doneCount++;
      c.fillStyle=done?'#1b3a1b':'#1e2a3a';
      c.beginPath();c.roundRect(x,y,bw,bh,6);c.fill();
      c.strokeStyle=done?'#66bb6a':'#4a5568';c.lineWidth=1;c.stroke();
      c.fillStyle=done?'#a5d6a7':'#ccc';c.font='bold 11px sans-serif';c.textAlign='left';
      c.fillText((done?'✓ ':'○ ')+items[i].name,x+8,y+16);
      c.fillStyle='#888';c.font='9px sans-serif';
      c.fillText(items[i].interval+' | '+items[i].tip,x+8,y+32);
      if(done){c.fillStyle='#4caf50';c.font='9px sans-serif';c.textAlign='right';c.fillText('Done',x+bw-8,y+16);}
    }
    var pct=Math.round((doneCount/items.length)*100);
    c.fillStyle='#1e2a3a';c.beginPath();c.roundRect(15,H-55,W-30,45,8);c.fill();
    c.fillStyle='#2e7d32';c.beginPath();c.roundRect(15,H-55,(W-30)*(pct/100),45,8);c.fill();
    c.fillStyle='#fff';c.font='bold 14px sans-serif';c.textAlign='center';
    c.fillText('Care Completion: '+doneCount+'/'+items.length+' ('+pct+'%)',W/2,H-28);
    var season=new Date().getMonth();
    var seasonTip=season>=3&&season<=5?'Spring: Check for winter dryness damage':season>=6&&season<=8?'Summer: Avoid heat/sun exposure, watch humidity':season>=9&&season<=11?'Autumn: Prepare humidifier for winter':'Winter: Use case humidifier, avoid heating vents';
    c.fillStyle='#ffd740';c.font='10px sans-serif';c.textAlign='left';c.fillText('☀ '+seasonTip,20,H-62);
    if(doneCount>=12)unlockAch('care_expert','Care Expert');
  }

  setTimeout(function(){
    var cv=document.getElementById('v24-care-cv');if(!cv)return;
    cv.addEventListener('click',function(e){
      var rect=cv.getBoundingClientRect(),sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var cols=2,bw=285,bh=48,gapX=16,gapY=6,startX=15,startY=42;
      for(var i=0;i<items.length;i++){
        var col=i%cols,row=Math.floor(i/cols);
        var x=startX+col*(bw+gapX),y=startY+row*(bh+gapY);
        if(mx>=x&&mx<=x+bw&&my>=y&&my<=y+bh){
          checks[items[i].name]=!checks[items[i].name];
          sp('v24_care_checks',checks);sfx('care_check');draw();break;
        }
      }
    });
    draw();
  },100);
  return panel;
}

/* ═══════════════════════════════════════════════════════
   QUIZ v24
   ═══════════════════════════════════════════════════════ */
function createQuizPanel(){
  var panel=document.createElement('div');
  panel.id='v24-quiz-panel';
  panel.style.cssText='display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:640px;max-width:95vw;background:linear-gradient(135deg,#1a1a2e,#2e2a1a);border-radius:16px;padding:20px;z-index:5200;box-shadow:0 8px 32px rgba(0,0,0,0.6);color:#eee;max-height:90vh;overflow-y:auto;';
  var qIdx=0,qScore=0,answered=false;
  function renderQ(){
    if(qIdx>=V24_QUIZ.length){
      var pct=Math.round(qScore/V24_QUIZ.length*100);
      panel.innerHTML='<div style="text-align:center;padding:30px;"><h3 style="color:#ffd740;">Quiz v24 Complete!</h3><p style="font-size:1.2em;">Score: '+qScore+'/'+V24_QUIZ.length+' ('+pct+'%)</p><p style="font-size:2em;">'+(pct>=80?'S':pct>=60?'A':pct>=40?'B':'C')+'</p><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="padding:8px 20px;border-radius:8px;border:1px solid #ffd740;background:transparent;color:#ffd740;cursor:pointer;">Close</button></div>';
      if(pct>=80)unlockAch('quiz_v24_master','v24 Quiz Master');
      return;
    }
    var q=V24_QUIZ[qIdx];
    var html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h3 style="margin:0;font-size:1em;color:#ffd740;">Quiz v24 ('+(qIdx+1)+'/'+V24_QUIZ.length+')</h3><button onclick="this.parentElement.parentElement.style.display=\'none\'" style="background:none;border:none;color:#fff;font-size:1.3em;cursor:pointer;">&times;</button></div>';
    html+='<p style="font-size:1em;margin:10px 0;">'+q.q+'</p>';
    for(var i=0;i<q.a.length;i++){
      html+='<button class="v24-quiz-btn" data-idx="'+i+'" style="display:block;width:100%;padding:10px 14px;margin:6px 0;border-radius:8px;border:1px solid #4a5568;background:#1e2a3a;color:#ccc;cursor:pointer;text-align:left;font-size:0.9em;">'+q.a[i]+'</button>';
    }
    html+='<div style="margin-top:8px;font-size:0.85em;color:#888;">Score: '+qScore+'/'+(qIdx)+'</div>';
    panel.innerHTML=html;
    answered=false;
    panel.querySelectorAll('.v24-quiz-btn').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(answered)return;answered=true;
        var idx=parseInt(this.dataset.idx);
        if(idx===q.c){qScore++;this.style.background='#2e7d32';this.style.color='#fff';sfx('quiz_v24');}
        else{this.style.background='#c62828';this.style.color='#fff';sfx('art_tap');
          panel.querySelectorAll('.v24-quiz-btn')[q.c].style.background='#2e7d32';
          panel.querySelectorAll('.v24-quiz-btn')[q.c].style.color='#fff';}
        setTimeout(function(){qIdx++;renderQ();},1200);
      });
    });
  }
  renderQ();
  document.body.appendChild(panel);
  return panel;
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION + INIT
   ═══════════════════════════════════════════════════════ */
function addV24Nav(){
  var navTarget=document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){
    var allNav=document.querySelectorAll('div[style*="flex-wrap"]');
    if(allNav.length>0)navTarget=allNav[allNav.length-1];
  }
  if(!navTarget){navTarget=document.createElement('div');navTarget.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px;justify-content:center;';document.body.appendChild(navTarget);}

  var btns=[
    {label:'Articulation',panel:'v24-articulation-panel',color:'#f0a500',key:'KeyQ'},
    {label:'CoF',panel:'v24-cof-panel',color:'#81c784',key:'KeyW'},
    {label:'Habits',panel:'v24-habit-panel',color:'#ce93d8',key:'KeyR'},
    {label:'Vibrato',panel:'v24-vibrato-panel',color:'#ba68c8',key:'KeyT'},
    {label:'Chords',panel:'v24-chord-panel',color:'#66bb6a',key:'KeyU'},
    {label:'Duet',panel:'v24-duet-panel',color:'#4fc3f7',key:'KeyV'},
    {label:'Report',panel:'v24-report-panel',color:'#ef9a9a',key:'KeyY'},
    {label:'Care',panel:'v24-care-panel',color:'#a5d6a7',key:'KeyZ'},
    {label:'Quiz24',panel:'v24-quiz-panel',color:'#ffd740',key:'Period'}
  ];

  var opened=lp('v24_opened')||{};

  btns.forEach(function(b){
    var btn=document.createElement('button');
    btn.textContent=b.label;
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid '+b.color+';background:transparent;color:'+b.color+';cursor:pointer;font-size:0.72em;margin:2px;';
    btn.addEventListener('click',function(){
      var p=document.getElementById(b.panel);
      if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('art_tap');
        opened[b.label]=true;sp('v24_opened',opened);
        if(Object.keys(opened).length>=5)unlockAch('v24_explorer','v24 Explorer');
      }
    });
    navTarget.appendChild(btn);
  });

  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    btns.forEach(function(b){
      if(e.code===b.key){
        e.preventDefault();
        var p=document.getElementById(b.panel);
        if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('art_tap');
          opened[b.label]=true;sp('v24_opened',opened);
          if(Object.keys(opened).length>=5)unlockAch('v24_explorer','v24 Explorer');
        }
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════
   REGISTER DATA
   ═══════════════════════════════════════════════════════ */
function registerData(){
  if(typeof window.SONG_DB!=='undefined'&&Array.isArray(window.SONG_DB)){
    V24_SONGS.forEach(function(s){
      if(!window.SONG_DB.find(function(x){return x.id===s.id;}))window.SONG_DB.push(s);
    });
  }
  if(typeof window.LESSON_DB!=='undefined'&&Array.isArray(window.LESSON_DB)){
    V24_LESSONS.forEach(function(l){
      if(!window.LESSON_DB.find(function(x){return x.id===l.id;}))window.LESSON_DB.push(l);
    });
  }
  if(typeof window.ACH_DB!=='undefined'&&Array.isArray(window.ACH_DB)){
    V24_ACHS.forEach(function(a){
      if(!window.ACH_DB.find(function(x){return x.id===a.id;}))window.ACH_DB.push(a);
    });
  }
  unlockAch('song_214','Song Collector 214');
  var allAch=loadAch(),v24Ids=V24_ACHS.map(function(a){return a.id;});
  var allV24=v24Ids.every(function(id){return allAch[id];});
  if(allV24)unlockAch('v24_complete','v24 Complete');
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
function init(){
  createArticulationPanel();
  createCircleOfFifthsPanel();
  createHabitDashPanel();
  createVibratoTunerPanel();
  createChordTrainerPanel();
  createDuetPanel();
  createReportPanel();
  createCareGuidePanel();
  createQuizPanel();
  addV24Nav();
  registerData();
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
else{init();}

})();
