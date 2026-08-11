(function V28Patch(){
'use strict';
if(window.__V28_LOADED)return;
window.__V28_LOADED=true;

/* ─── helpers ─── */
function lp(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
function sp(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function loadAch(){return lp('violin_achievements')||{}}
function unlockAch(id,name){
  var a=loadAch();if(a[id])return;a[id]={name:name,date:new Date().toISOString()};
  sp('violin_achievements',a);sfx('achieve_v28');
  if(typeof window.showToast==='function')window.showToast('Achievement: '+name);
}
function addHistory(key,val,max){
  var h=lp(key)||[];h.push(val);if(h.length>(max||50))h=h.slice(-max||-50);sp(key,h);return h;
}

/* ─── SFX 16 types ─── */
var actx=null;
function getACtx(){if(!actx)try{actx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}return actx}
function sfx(type){
  var c=getACtx();if(!c)return;var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);
  var t=c.currentTime,fr=440,dur=0.12,wave='sine';
  switch(type){
    case'drift_note':fr=370;dur=0.10;break;
    case'drift_zone':fr=740;dur=0.20;wave='triangle';break;
    case'contact_tap':fr=415;dur=0.09;break;
    case'contact_play':fr=554;dur=0.22;wave='triangle';break;
    case'pos_shift':fr=330;dur=0.11;break;
    case'pos_optimize':fr=660;dur=0.20;wave='triangle';break;
    case'vib_emotion':fr=466;dur=0.13;wave='sine';break;
    case'vib_set':fr=622;dur=0.18;wave='triangle';break;
    case'peak_slot':fr=392;dur=0.10;break;
    case'peak_best':fr=784;dur=0.22;wave='triangle';break;
    case'tone_axis':fr=349;dur=0.11;break;
    case'tone_compare':fr=523;dur=0.19;wave='triangle';break;
    case'energy_bar':fr=294;dur=0.10;break;
    case'energy_tip':fr=587;dur=0.17;wave='triangle';break;
    case'maestro_gauge':fr=440;dur=0.14;wave='triangle';break;
    case'achieve_v28':fr=932;dur=0.32;wave='triangle';break;
    default:fr=440;dur=0.1;
  }
  o.type=wave;o.frequency.setValueAtTime(fr,t);
  g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t);o.stop(t+dur);
}

/* ═══════════════════════════════════════════════════════
   DATA: 10 Songs (s245-s254)
   ═══════════════════════════════════════════════════════ */
var V28_SONGS=[
  {id:'s245',title:'Polonaise No.1 in D major',composer:'Wieniawski',difficulty:4,key:'D major',bpm:108,duration:'8:30',techniques:['double-stop','spiccato','cantabile'],era:'Romantic'},
  {id:'s246',title:'Praeludium and Allegro',composer:'Kreisler',difficulty:4,key:'E minor',bpm:72,duration:'7:00',techniques:['martele','chords','baroque-style'],era:'Baroque'},
  {id:'s247',title:'Violin Sonata No.1, 1st mvt',composer:'Prokofiev',difficulty:5,key:'F minor',bpm:80,duration:'12:00',techniques:['dissonance','sforzando','col-legno'],era:'Modern'},
  {id:'s248',title:'Carmen Fantasy',composer:'Sarasate',difficulty:5,key:'D minor',bpm:120,duration:'12:30',techniques:['harmonics','left-hand-pizz','ricochet'],era:'Romantic'},
  {id:'s249',title:'Salut d&apos;Amour',composer:'Elgar',difficulty:3,key:'E major',bpm:80,duration:'3:30',techniques:['espressivo','vibrato','legato'],era:'Romantic'},
  {id:'s250',title:'M&eacute;ditation from Tha&iuml;s',composer:'Massenet',difficulty:3,key:'D major',bpm:56,duration:'5:30',techniques:['cantabile','portamento','espressivo'],era:'Romantic'},
  {id:'s251',title:'Violin Concerto No.2, 1st mvt',composer:'Bart&oacute;k',difficulty:5,key:'B minor',bpm:96,duration:'18:00',techniques:['quarter-tone','glissando','pizzicato'],era:'Modern'},
  {id:'s252',title:'Sonata No.3 &quot;Ballade&quot;',composer:'Ysa&yuml;e',difficulty:5,key:'D minor',bpm:66,duration:'7:30',techniques:['polyphony','chords','rubato'],era:'Modern'},
  {id:'s253',title:'The Four Seasons &quot;Summer&quot; 3rd mvt',composer:'Vivaldi',difficulty:4,key:'G minor',bpm:168,duration:'3:00',techniques:['bariolage','tremolo','presto'],era:'Baroque'},
  {id:'s254',title:'Violin Concerto 3rd mvt',composer:'Mendelssohn',difficulty:4,key:'E minor',bpm:132,duration:'6:30',techniques:['staccato','arpeggios','cadenza'],era:'Romantic'}
];

/* ═══════════════════════════════════════════════════════
   DATA: 10 Lessons (l271-l280)
   ═══════════════════════════════════════════════════════ */
var V28_LESSONS=[
  {id:'l271',title:'Intonation Drift Awareness Training',level:'intermediate',duration:'14min',topics:['intonation','drift','session-analysis','fatigue']},
  {id:'l272',title:'Bow Contact Point Mastery',level:'intermediate',duration:'15min',topics:['bow-control','contact-point','sonority','tasto-ponticello']},
  {id:'l273',title:'Efficient Position Shifting Patterns',level:'intermediate',duration:'13min',topics:['shifting','positions','optimization','transitions']},
  {id:'l274',title:'Vibrato as Emotional Expression',level:'intermediate',duration:'16min',topics:['vibrato','emotion','expression','speed-width']},
  {id:'l275',title:'Optimizing Your Practice Schedule',level:'beginner',duration:'12min',topics:['practice','schedule','circadian','peak-performance']},
  {id:'l276',title:'Understanding Violin Tone DNA',level:'all',duration:'14min',topics:['tone','warmth','brilliance','projection','resonance']},
  {id:'l277',title:'Bow Energy Conservation Techniques',level:'intermediate',duration:'15min',topics:['bow-energy','efficiency','technique','conservation']},
  {id:'l278',title:'Wieniawski Polonaise Performance Guide',level:'advanced',duration:'18min',topics:['repertoire','wieniawski','polonaise','performance']},
  {id:'l279',title:'Sarasate Carmen Fantasy Breakdown',level:'advanced',duration:'20min',topics:['repertoire','sarasate','carmen','virtuosity']},
  {id:'l280',title:'v28 Comprehensive Review',level:'all',duration:'15min',topics:['intonation-drift','contact-point','position-shift','vibrato-emotion','practice-peak','tone-dna','bow-energy','maestro-index']}
];

/* ═══════════════════════════════════════════════════════
   DATA: 15 Quiz (q271-q285)
   ═══════════════════════════════════════════════════════ */
var V28_QUIZ=[
  {q:'인토네이션 드리프트란 무엇인가?',a:['활의 떨림 현상','연습 중 음정이 서서히 벗어나는 현상','현의 진동 패턴','비브라토의 일종'],c:1},
  {q:'술 타스토(sul tasto)는 활을 어디에서 연주하는 기법인가?',a:['브릿지 가까이','지판 위','현의 정중앙','너트 가까이'],c:1},
  {q:'7포지션에서 1포지션으로 이동할 때 가장 중요한 기술은?',a:['빠른 손목 회전','엄지의 부드러운 가이드','강한 팔 압력','눈으로 지판 보기'],c:1},
  {q:'비브라토 속도와 폭을 넓게 하면 주로 어떤 감정을 표현하는가?',a:['고요함','긴장과 열정','슬픔','미스터리'],c:1},
  {q:'바이올린 연습 효율이 가장 높은 시간대는 일반적으로?',a:['새벽 4-6시','오전 10시-12시','자정-새벽 2시','상관없다'],c:1},
  {q:'스트라디바리우스 바이올린의 가장 큰 특징은?',a:['가벼운 무게','프로젝션과 음색의 복합성','낮은 가격','검은 색상'],c:1},
  {q:'스피카토(spiccato)의 에너지 효율이 높은 이유는?',a:['활이 무겁기 때문','활의 탄성을 활용하기 때문','현이 가늘기 때문','템포가 느리기 때문'],c:1},
  {q:'비에니아프스키 폴로네이즈 1번의 조성은?',a:['A장조','D장조','E단조','G단조'],c:1},
  {q:'사라사테 카르멘 환상곡의 원작 작곡가는?',a:['모차르트','비제','베르디','푸치니'],c:1},
  {q:'술 폰티첼로(sul ponticello) 연주 시 음색의 특징은?',a:['부드럽고 따뜻함','금속적이고 유리질 같음','둔하고 무거움','매우 조용함'],c:1},
  {q:'엘가 &quot;사랑의 인사&quot;의 난이도가 중급인 이유는?',a:['매우 빠른 템포','복잡한 더블스톱','서정적 표현과 안정된 비브라토 필요','높은 포지션만 사용'],c:2},
  {q:'바르토크 바이올린 협주곡 2번에서 사용되는 특수 기법은?',a:['일반 비브라토만','4분음(quarter-tone)과 글리산도','피치카토만','아르페지오만'],c:1},
  {q:'이자이 소나타 3번의 부제는?',a:['로망스','발라드','녹턴','스케르초'],c:1},
  {q:'비발디 &quot;여름&quot; 3악장의 빠르기말은?',a:['Adagio','Andante','Allegro','Presto'],c:3},
  {q:'마에스트로 인덱스에서 가장 높은 등급은?',a:['A등급','S등급','SS등급','프로등급'],c:1}
];

/* ═══════════════════════════════════════════════════════
   DATA: 12 Achievements
   ═══════════════════════════════════════════════════════ */
var V28_ACHS=[
  {id:'drift_tracker',name:'Drift Tracker',desc:'Analyzed intonation drift across 20+ notes'},
  {id:'sonority_mapper',name:'Sonority Mapper',desc:'Explored 15+ cells in sonority matrix'},
  {id:'path_optimizer',name:'Path Optimizer',desc:'Optimized 8+ position transition paths'},
  {id:'emotion_vibrato',name:'Emotion Vibrato',desc:'Explored 6+ vibrato emotion types'},
  {id:'peak_finder',name:'Peak Finder',desc:'Identified 5+ peak performance time slots'},
  {id:'tone_profiler',name:'Tone Profiler',desc:'Compared tone DNA with 3+ famous violins'},
  {id:'energy_analyst',name:'Energy Analyst',desc:'Analyzed energy efficiency for 6+ bowing types'},
  {id:'maestro_rank',name:'Maestro Rank',desc:'Achieved S-rank in 4+ maestro KPIs'},
  {id:'quiz_v28_master',name:'Quiz v28 Master',desc:'Scored 80%+ on v28 quiz'},
  {id:'song_254',name:'Song Collector 254',desc:'254 songs in the library'},
  {id:'v28_explorer',name:'v28 Explorer',desc:'Explored 5+ v28 features'},
  {id:'v28_complete',name:'v28 Complete',desc:'Completed all v28 achievements'}
];

/* ═══════════════════════════════════════════════════════
   PANEL STYLES
   ═══════════════════════════════════════════════════════ */
var PNL='position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(10,8,5,0.96);overflow-y:auto;display:none;padding:12px;box-sizing:border-box;';
var HDR='font-size:15px;font-weight:700;color:#D4894A;text-align:center;margin:8px 0;';
var SUB='font-size:11px;color:#a08060;text-align:center;margin:4px 0 10px;';
var CLOSE='position:absolute;top:8px;right:12px;font-size:22px;color:#D4894A;cursor:pointer;background:none;border:none;z-index:10;';

function mkPanel(id){
  var p=document.createElement('div');p.id=id;p.style.cssText=PNL;
  var cb=document.createElement('button');cb.textContent='×';cb.style.cssText=CLOSE;
  cb.onclick=function(){p.style.display='none';};
  p.appendChild(cb);return p;
}
function mkCanvas(w,h){
  var c=document.createElement('canvas');c.width=w;c.height=h;
  c.style.cssText='display:block;margin:8px auto;max-width:100%;border-radius:8px;background:#1a1020;border:1px solid #3a2a1a;';
  return c;
}

/* ═══════════════════════════════════════════════════════
   1. INTONATION DRIFT TIMELINE (인토네이션 드리프트 타임라인)
   Canvas 620x400 — 30-note cent deviation line chart
   ═══════════════════════════════════════════════════════ */
function createDriftPanel(){
  var panel=mkPanel('v28-drift-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='Intonation Drift Timeline';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='30-note cent deviation over session · drift zones · click to simulate notes';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var notes=lp('v28_drift_notes')||[];
  var maxNotes=30,sel=-1,explored=0;

  function genNote(){return Math.round((Math.random()-0.5)*60);}
  if(notes.length===0){for(var i=0;i<maxNotes;i++)notes.push(genNote());sp('v28_drift_notes',notes);}

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1e1228';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Intonation Drift: Cent Deviation per Note',310,22);

    var padL=55,padR=15,padT=45,padB=60;
    var gw=620-padL-padR,gh=400-padT-padB;
    var maxCent=50;

    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=0.5;
    for(var lv=-50;lv<=50;lv+=10){
      var ly=padT+gh/2-lv/maxCent*(gh/2);
      ctx.beginPath();ctx.moveTo(padL,ly);ctx.lineTo(padL+gw,ly);ctx.stroke();
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='right';
      ctx.fillText((lv>0?'+':'')+lv,padL-5,ly+3);
    }
    ctx.fillStyle='#81c784';ctx.font='9px Georgia';ctx.textAlign='left';
    ctx.fillText('cents',padL-50,padT-5);

    ctx.fillStyle='rgba(129,199,132,0.08)';
    var safeTop=padT+gh/2-10/maxCent*(gh/2),safeBot=padT+gh/2+10/maxCent*(gh/2);
    ctx.fillRect(padL,safeTop,gw,safeBot-safeTop);

    ctx.strokeStyle='#81c784';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(padL,safeTop);ctx.lineTo(padL+gw,safeTop);ctx.stroke();
    ctx.beginPath();ctx.moveTo(padL,safeBot);ctx.lineTo(padL+gw,safeBot);ctx.stroke();
    ctx.setLineDash([]);

    var step=gw/(maxNotes-1);
    ctx.strokeStyle='#4fc3f7';ctx.lineWidth=2;ctx.beginPath();
    for(var i=0;i<notes.length;i++){
      var nx=padL+i*step;
      var ny=padT+gh/2-notes[i]/maxCent*(gh/2);
      if(i===0)ctx.moveTo(nx,ny);else ctx.lineTo(nx,ny);
    }
    ctx.stroke();

    for(var i=0;i<notes.length;i++){
      var nx=padL+i*step;
      var ny=padT+gh/2-notes[i]/maxCent*(gh/2);
      var abs=Math.abs(notes[i]);
      var dotColor=abs<=10?'#81c784':abs<=25?'#ff9800':'#ef5350';
      ctx.fillStyle=dotColor;ctx.beginPath();ctx.arc(nx,ny,i===sel?5:3,0,Math.PI*2);ctx.fill();
      if(i===sel){ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();}
    }

    for(var i=0;i<notes.length;i++){
      ctx.fillStyle='#777';ctx.font='7px Georgia';ctx.textAlign='center';
      ctx.fillText(i+1,padL+i*step,padT+gh+15);
    }
    ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
    ctx.fillText('Note #',310,padT+gh+30);

    var zones=[{name:'Cold Start',range:[0,4],color:'#4fc3f7'},{name:'Peak',range:[10,19],color:'#81c784'},{name:'Fatigue',range:[24,29],color:'#ef5350'}];
    zones.forEach(function(z,zi){
      var x1=padL+z.range[0]*step,x2=padL+z.range[1]*step;
      ctx.fillStyle=z.color+'15';ctx.fillRect(x1,padT,x2-x1,gh);
      ctx.fillStyle=z.color;ctx.font='8px Georgia';ctx.textAlign='center';
      ctx.fillText(z.name,(x1+x2)/2,padT+gh+42);
    });

    if(sel>=0&&sel<notes.length){
      ctx.fillStyle='#1e1228';ctx.fillRect(400,340,210,50);ctx.strokeStyle='#3a2a1a';ctx.strokeRect(400,340,210,50);
      ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='left';
      ctx.fillText('Note '+(sel+1)+': '+(notes[sel]>0?'+':'')+notes[sel]+' cents',410,358);
      var q=Math.abs(notes[sel])<=10?'Accurate':Math.abs(notes[sel])<=25?'Slight drift':'Significant drift';
      ctx.fillStyle='#ccc';ctx.font='10px Georgia';ctx.fillText(q,410,376);
    }
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width;var x=sx*scaleX;
    var padL=55,padR=15,gw=620-padL-padR,step=gw/(maxNotes-1);
    for(var i=0;i<notes.length;i++){
      var nx=padL+i*step;
      if(Math.abs(x-nx)<10){sel=i;sfx('drift_note');explored++;
        if(explored>=20)unlockAch('drift_tracker','Drift Tracker');
        draw();return;
      }
    }
    notes.push(genNote());if(notes.length>maxNotes)notes.shift();
    sp('v28_drift_notes',notes);sfx('drift_zone');explored++;
    if(explored>=20)unlockAch('drift_tracker','Drift Tracker');
    draw();
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   2. BOW CONTACT POINT SONORITY MATRIX (활 접촉점 소노리티 매트릭스)
   Canvas 640x400 — 7 contact points x 6 dynamics heatmap
   ═══════════════════════════════════════════════════════ */
function createSonorityPanel(){
  var panel=mkPanel('v28-sonority-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='Bow Contact Sonority Matrix';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='7 contact points × 6 dynamics · click cells for sonority rating';panel.appendChild(s);
  var cv=mkCanvas(640,400);panel.appendChild(cv);

  var contacts=['Sul Tasto','Near Tasto','Mid-Tasto','Center','Mid-Pont','Near Pont','Sul Pont'];
  var dynamics=['pp','p','mp','mf','f','ff'];
  var qualities=[
    ['Airy','Soft','Warm','Rich','Full','Harsh'],
    ['Gentle','Mellow','Sweet','Bright','Bold','Edgy'],
    ['Round','Clear','Balanced','Focused','Strong','Intense'],
    ['Open','Pure','Centered','Resonant','Powerful','Biting'],
    ['Hollow','Thin','Nasal','Metallic','Brilliant','Glassy'],
    ['Wispy','Pale','Eerie','Steely','Piercing','Shriek'],
    ['Ghost','Faint','Icy','Silver','Scratch','Noise']
  ];
  var ratings=lp('v28_sonority_ratings')||{};
  var selR=-1,selC=-1,explored={};

  function getColor(cp,dyn){
    var warmth=1-(cp/6);var power=dyn/5;
    var r=Math.round(40+power*160+cp*15);var g=Math.round(60+warmth*100-power*20);var b=Math.round(80+warmth*80);
    return 'rgb('+Math.min(255,r)+','+Math.min(255,g)+','+Math.min(255,b)+')';
  }

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#1e1228';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Contact Point × Dynamic Sonority Matrix',320,22);

    var padL=80,padT=48,cellW=72,cellH=42,gap=2;
    dynamics.forEach(function(d,j){
      ctx.fillStyle='#a08060';ctx.font='bold 10px Georgia';ctx.textAlign='center';
      ctx.fillText(d,padL+j*(cellW+gap)+cellW/2,padT-6);
    });
    contacts.forEach(function(cp,i){
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='right';
      ctx.fillText(cp,padL-6,padT+i*(cellH+gap)+cellH/2+4);
    });

    for(var i=0;i<7;i++){
      for(var j=0;j<6;j++){
        var x=padL+j*(cellW+gap),y=padT+i*(cellH+gap);
        var isSel=i===selR&&j===selC;
        ctx.fillStyle=getColor(i,j);ctx.fillRect(x,y,cellW,cellH);
        if(isSel){ctx.strokeStyle='#D4894A';ctx.lineWidth=2;}else{ctx.strokeStyle='#3a2a1a';ctx.lineWidth=1;}
        ctx.strokeRect(x,y,cellW,cellH);

        var key=i+'_'+j;var rating=ratings[key]||'';
        ctx.fillStyle='#fff';ctx.font='8px Georgia';ctx.textAlign='center';
        ctx.fillText(qualities[i][j],x+cellW/2,y+cellH/2-2);
        if(rating){ctx.fillStyle='#ffd700';ctx.font='bold 9px Georgia';ctx.fillText(rating,x+cellW/2,y+cellH/2+12);}
      }
    }

    if(selR>=0&&selC>=0){
      ctx.fillStyle='#1e1228';ctx.fillRect(15,360,610,35);ctx.strokeStyle='#3a2a1a';ctx.strokeRect(15,360,610,35);
      ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='center';
      var key2=selR+'_'+selC;
      ctx.fillText(contacts[selR]+' + '+dynamics[selC]+' = '+qualities[selR][selC]+(ratings[key2]?' ['+ratings[key2]+']':'  (click again to rate S~D)'),320,382);
    }
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=640/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var padL=80,padT=48,cellW=72,cellH=42,gap=2;
    for(var i=0;i<7;i++){
      for(var j=0;j<6;j++){
        var bx=padL+j*(cellW+gap),by=padT+i*(cellH+gap);
        if(x>=bx&&x<=bx+cellW&&y>=by&&y<=by+cellH){
          if(selR===i&&selC===j){
            var key=i+'_'+j;var grades=['S','A','B','C','D'];
            var cur=ratings[key]||'';var idx=grades.indexOf(cur);
            ratings[key]=grades[(idx+1)%5];sp('v28_sonority_ratings',ratings);sfx('contact_play');
          }else{selR=i;selC=j;sfx('contact_tap');}
          explored[i+'_'+j]=true;
          if(Object.keys(explored).length>=15)unlockAch('sonority_mapper','Sonority Mapper');
          draw();return;
        }
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   3. POSITION SHIFT PATH OPTIMIZER (포지션 전환 경로 최적화기)
   Canvas 620x400 — 7-position x 4-string grid with arrows
   ═══════════════════════════════════════════════════════ */
function createPosShiftPanel(){
  var panel=mkPanel('v28-posshift-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='Position Shift Path Optimizer';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='7 positions × 4 strings · click two nodes to show transition path';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var positions=['1st','2nd','3rd','4th','5th','6th','7th'];
  var strings=['G','D','A','E'];
  var strColors=['#ef5350','#ff9800','#4fc3f7','#81c784'];
  var nodeA=null,nodeB=null,paths=lp('v28_shift_paths')||[],optimized=0;

  function dist(a,b){return Math.abs(a.p-b.p)+Math.abs(a.s-b.s)*0.5;}
  function difficulty(a,b){var d=dist(a,b);return d<=1?'Easy':d<=2.5?'Medium':d<=4?'Hard':'Very Hard';}
  function diffColor(d){return d<=1?'#81c784':d<=2.5?'#4fc3f7':d<=4?'#ff9800':'#ef5350';}

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1e1228';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Position Shift Path Optimizer',310,22);

    var padL=70,padT=50,cellW=72,cellH=60,gap=4;
    positions.forEach(function(pos,i){
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(pos,padL+i*(cellW+gap)+cellW/2,padT-8);
    });
    strings.forEach(function(st,j){
      ctx.fillStyle=strColors[j];ctx.font='bold 11px Georgia';ctx.textAlign='right';
      ctx.fillText(st,padL-10,padT+j*(cellH+gap)+cellH/2+4);
    });

    for(var p=0;p<7;p++){
      for(var st=0;st<4;st++){
        var x=padL+p*(cellW+gap),y=padT+st*(cellH+gap);
        var isA=nodeA&&nodeA.p===p&&nodeA.s===st;
        var isB=nodeB&&nodeB.p===p&&nodeB.s===st;
        ctx.fillStyle=isA?'#D4894A44':isB?'#4fc3f744':'#2a1a3088';
        ctx.fillRect(x,y,cellW,cellH);
        ctx.strokeStyle=isA?'#D4894A':isB?'#4fc3f7':'#3a2a1a';
        ctx.lineWidth=isA||isB?2:1;ctx.strokeRect(x,y,cellW,cellH);
        ctx.fillStyle=strColors[st];ctx.beginPath();ctx.arc(x+cellW/2,y+cellH/2,6,0,Math.PI*2);ctx.fill();
      }
    }

    if(nodeA&&nodeB){
      var ax=padL+nodeA.p*(cellW+gap)+cellW/2,ay=padT+nodeA.s*(cellH+gap)+cellH/2;
      var bx=padL+nodeB.p*(cellW+gap)+cellW/2,by=padT+nodeB.s*(cellH+gap)+cellH/2;
      var d=dist(nodeA,nodeB);var dc=diffColor(d);
      ctx.strokeStyle=dc;ctx.lineWidth=2.5;ctx.setLineDash([6,3]);
      ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.setLineDash([]);
      var angle=Math.atan2(by-ay,bx-ax);
      ctx.fillStyle=dc;ctx.beginPath();
      ctx.moveTo(bx,by);ctx.lineTo(bx-10*Math.cos(angle-0.3),by-10*Math.sin(angle-0.3));
      ctx.lineTo(bx-10*Math.cos(angle+0.3),by-10*Math.sin(angle+0.3));ctx.closePath();ctx.fill();

      ctx.fillStyle='#1e1228';ctx.fillRect(15,310,590,80);ctx.strokeStyle='#3a2a1a';ctx.strokeRect(15,310,590,80);
      ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='left';
      ctx.fillText(positions[nodeA.p]+'/'+strings[nodeA.s]+' → '+positions[nodeB.p]+'/'+strings[nodeB.s],25,330);
      ctx.fillStyle='#ccc';ctx.font='10px Georgia';
      ctx.fillText('Distance: '+d.toFixed(1)+' | Difficulty: '+difficulty(nodeA,nodeB),25,348);
      var speed=d<=1?'Fast':d<=2.5?'Medium':d<=4?'Slow':'Very Slow';
      ctx.fillText('Speed: '+speed+' | Tip: '+(d>2?'Use guide finger for smooth transition':'Direct shift is fine'),25,366);
      var grade=d<=1?'S':d<=2?'A':d<=3?'B':d<=4?'C':'D';
      var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';
      ctx.fillStyle=gc;ctx.font='bold 16px Georgia';ctx.textAlign='right';ctx.fillText(grade,590,340);
    }else{
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText('Click two grid nodes to analyze the transition path',310,370);
    }
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var padL=70,padT=50,cellW=72,cellH=60,gap=4;
    for(var p=0;p<7;p++){
      for(var st=0;st<4;st++){
        var bx=padL+p*(cellW+gap),by=padT+st*(cellH+gap);
        if(x>=bx&&x<=bx+cellW&&y>=by&&y<=by+cellH){
          if(!nodeA){nodeA={p:p,s:st};sfx('pos_shift');}
          else if(!nodeB){nodeB={p:p,s:st};sfx('pos_optimize');optimized++;
            if(optimized>=8)unlockAch('path_optimizer','Path Optimizer');
          }else{nodeA={p:p,s:st};nodeB=null;sfx('pos_shift');}
          draw();return;
        }
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   4. VIBRATO EMOTION SPECTRUM (비브라토 감정 스펙트럼)
   Canvas 620x400 — 10-emotion Radar chart
   ═══════════════════════════════════════════════════════ */
function createVibratoPanel(){
  var panel=mkPanel('v28-vibrato-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='Vibrato Emotion Spectrum';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='10 emotions · Radar chart · click emotion for vibrato settings';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var emotions=[
    {name:'Joy',speed:6.5,width:4,reg:85,color:'#ffd54f'},
    {name:'Sorrow',speed:4.0,width:5,reg:70,color:'#4fc3f7'},
    {name:'Tension',speed:7.5,width:3,reg:60,color:'#ef5350'},
    {name:'Calm',speed:3.0,width:3,reg:95,color:'#81c784'},
    {name:'Passion',speed:7.0,width:6,reg:75,color:'#ff7043'},
    {name:'Nostalgia',speed:4.5,width:5,reg:80,color:'#ce93d8'},
    {name:'Mystery',speed:3.5,width:4,reg:50,color:'#ab47bc'},
    {name:'Triumph',speed:6.0,width:5,reg:90,color:'#ffd700'},
    {name:'Serenity',speed:2.5,width:2,reg:98,color:'#4db6ac'},
    {name:'Agony',speed:8.0,width:7,reg:40,color:'#d32f2f'}
  ];
  var sel=0,explored={};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1e1228';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Vibrato Emotion Spectrum',310,22);

    var cx=240,cy=200,r=140,n=10;
    for(var ring=1;ring<=5;ring++){
      ctx.strokeStyle='#3a2a1a';ctx.lineWidth=0.5;ctx.beginPath();
      for(var j=0;j<n;j++){
        var ang=-Math.PI/2+j*Math.PI*2/n;
        var px=cx+Math.cos(ang)*r*ring/5,py=cy+Math.sin(ang)*r*ring/5;
        if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }ctx.closePath();ctx.stroke();
    }

    emotions.forEach(function(em,j){
      var ang=-Math.PI/2+j*Math.PI*2/n;
      ctx.strokeStyle='#3a2a1a';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r);ctx.stroke();
      var lx=cx+Math.cos(ang)*(r+22),ly=cy+Math.sin(ang)*(r+22);
      ctx.fillStyle=j===sel?em.color:'#a08060';ctx.font=j===sel?'bold 10px Georgia':'9px Georgia';ctx.textAlign='center';
      ctx.fillText(em.name,lx,ly+4);
    });

    ctx.beginPath();ctx.fillStyle=emotions[sel].color+'33';ctx.strokeStyle=emotions[sel].color;ctx.lineWidth=2;
    emotions.forEach(function(em,j){
      var ang=-Math.PI/2+j*Math.PI*2/n;
      var val=(em.speed/10*0.33+em.width/8*0.33+em.reg/100*0.34);
      var px=cx+Math.cos(ang)*r*val,py=cy+Math.sin(ang)*r*val;
      if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    });
    ctx.closePath();ctx.fill();ctx.stroke();

    var em=emotions[sel];
    ctx.fillStyle='#1e1228';ctx.fillRect(420,50,190,185);ctx.strokeStyle='#3a2a1a';ctx.strokeRect(420,50,190,185);
    ctx.fillStyle=em.color;ctx.font='bold 13px Georgia';ctx.textAlign='left';
    ctx.fillText(em.name,432,72);
    ctx.fillStyle='#ccc';ctx.font='11px Georgia';
    ctx.fillText('Speed: '+em.speed.toFixed(1)+' Hz',432,95);
    ctx.fillText('Width: '+em.width+' mm',432,115);
    ctx.fillText('Regularity: '+em.reg+'%',432,135);

    var barW=140;
    ctx.fillStyle='#3a2a1a';ctx.fillRect(432,148,barW,8);ctx.fillStyle=em.color;ctx.fillRect(432,148,barW*(em.speed/10),8);
    ctx.fillStyle='#3a2a1a';ctx.fillRect(432,162,barW,8);ctx.fillStyle=em.color;ctx.fillRect(432,162,barW*(em.width/8),8);
    ctx.fillStyle='#3a2a1a';ctx.fillRect(432,176,barW,8);ctx.fillStyle=em.color;ctx.fillRect(432,176,barW*(em.reg/100),8);

    ctx.fillStyle='#a08060';ctx.font='8px Georgia';
    ctx.fillText('Slow       Speed       Fast',432,196);
    ctx.fillText('Narrow     Width       Wide',432,210);
    ctx.fillText('Irregular  Regularity  Regular',432,224);

    ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
    ctx.fillText('Click emotion labels on radar to explore vibrato settings',310,390);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var cx=240,cy=200,r=140,n=10;
    for(var j=0;j<n;j++){
      var ang=-Math.PI/2+j*Math.PI*2/n;
      var lx=cx+Math.cos(ang)*(r+22),ly=cy+Math.sin(ang)*(r+22);
      if(Math.abs(x-lx)<30&&Math.abs(y-ly)<15){
        sel=j;sfx('vib_emotion');explored[emotions[j].name]=true;
        if(Object.keys(explored).length>=6)unlockAch('emotion_vibrato','Emotion Vibrato');
        draw();return;
      }
    }
    for(var j=0;j<n;j++){
      var ang=-Math.PI/2+j*Math.PI*2/n;
      var em=emotions[j];var val=(em.speed/10*0.33+em.width/8*0.33+em.reg/100*0.34);
      var px=cx+Math.cos(ang)*r*val,py=cy+Math.sin(ang)*r*val;
      if(Math.abs(x-px)<15&&Math.abs(y-py)<15){
        sel=j;sfx('vib_set');explored[emotions[j].name]=true;
        if(Object.keys(explored).length>=6)unlockAch('emotion_vibrato','Emotion Vibrato');
        draw();return;
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   5. PRACTICE PEAK PERFORMANCE ANALYZER (연습 피크 퍼포먼스 시간대 분석기)
   Canvas 640x400 — 12 time slots x 7 days heatmap
   ═══════════════════════════════════════════════════════ */
function createPeakPanel(){
  var panel=mkPanel('v28-peak-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='Practice Peak Performance Analyzer';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='12 time slots × 7 days · click cells to log quality (0~100)';panel.appendChild(s);
  var cv=mkCanvas(640,400);panel.appendChild(cv);

  var slots=['6-8AM','8-10AM','10-12PM','12-2PM','2-4PM','4-6PM','6-8PM','8-10PM','10-12AM','12-2AM','2-4AM','4-6AM'];
  var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var stored=lp('v28_peak_data')||{};
  var peakCount=0;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#1e1228';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Circadian Practice Quality Heatmap',320,22);

    var padL=68,padT=45,cellW=44,cellH=24,gap=2;
    slots.forEach(function(sl,i){
      ctx.fillStyle='#a08060';ctx.font='7px Georgia';ctx.textAlign='center';
      ctx.save();ctx.translate(padL+i*(cellW+gap)+cellW/2,padT-4);ctx.rotate(-0.4);ctx.fillText(sl,0,0);ctx.restore();
    });
    days.forEach(function(d,j){
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='right';
      ctx.fillText(d,padL-6,padT+j*(cellH+gap)+cellH/2+4);
    });

    var bestSlot='',bestVal=0;peakCount=0;
    for(var j=0;j<7;j++){
      for(var i=0;i<12;i++){
        var x=padL+i*(cellW+gap),y=padT+j*(cellH+gap);
        var key=j+'_'+i;var val=stored[key]||0;
        if(val>bestVal){bestVal=val;bestSlot=days[j]+' '+slots[i];}
        if(val>=70)peakCount++;
        var intensity=val/100;
        var r=Math.round(26+intensity*180),g=Math.round(16+intensity*120),b=Math.round(48-intensity*30);
        ctx.fillStyle=val>0?'rgb('+r+','+g+','+b+')':'#2a1a30';
        ctx.fillRect(x,y,cellW,cellH);ctx.strokeStyle='#3a2a1a';ctx.lineWidth=0.5;ctx.strokeRect(x,y,cellW,cellH);
        if(val>0){ctx.fillStyle=val>=70?'#fff':'#ccc';ctx.font='8px Georgia';ctx.textAlign='center';ctx.fillText(val,x+cellW/2,y+cellH/2+3);}
      }
    }

    ctx.fillStyle='#1e1228';ctx.fillRect(15,236,610,25);
    var gColors=['#1a0a20','#3d1a20','#7d3a20','#bd6a20','#ffa040'];
    gColors.forEach(function(gc,i){ctx.fillStyle=gc;ctx.fillRect(20+i*50,240,48,15);});
    ctx.fillStyle='#a08060';ctx.font='8px Georgia';ctx.textAlign='left';ctx.fillText('0',20,268);ctx.fillText('25',70,268);ctx.fillText('50',120,268);ctx.fillText('75',170,268);ctx.fillText('100',220,268);

    ctx.fillStyle='#1e1228';ctx.fillRect(15,278,610,55);ctx.strokeStyle='#3a2a1a';ctx.strokeRect(15,278,610,55);
    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='left';
    ctx.fillText('Peak Performance: '+(bestSlot||'No data yet'),25,298);
    ctx.fillStyle='#ccc';ctx.font='10px Georgia';
    ctx.fillText('Best quality: '+bestVal+'/100 | High-quality slots (70+): '+peakCount,25,316);
    ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
    ctx.fillText('Click cells to add +20 quality | Find your circadian rhythm peak',320,355);

    if(peakCount>=5)unlockAch('peak_finder','Peak Finder');
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=640/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var padL=68,padT=45,cellW=44,cellH=24,gap=2;
    for(var j=0;j<7;j++){
      for(var i=0;i<12;i++){
        var bx=padL+i*(cellW+gap),by=padT+j*(cellH+gap);
        if(x>=bx&&x<=bx+cellW&&y>=by&&y<=by+cellH){
          var key=j+'_'+i;stored[key]=Math.min(100,(stored[key]||0)+20);
          sp('v28_peak_data',stored);sfx('peak_slot');draw();return;
        }
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   6. VIOLIN TONE DNA PROFILER (현악기 음색 DNA 프로파일러)
   Canvas 620x400 — 8-axis Radar + 5 famous violin comparison
   ═══════════════════════════════════════════════════════ */
function createToneDNAPanel(){
  var panel=mkPanel('v28-tonedna-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='Violin Tone DNA Profiler';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8-axis tone profile · compare with 5 famous violins · S~D grading';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var axes=['Warmth','Brilliance','Projection','Depth','Clarity','Resonance','Edge','Sweetness'];
  var user={name:'You',vals:[65,55,50,60,70,58,45,68],color:'#D4894A'};
  var violins=[
    {name:'Stradivarius',vals:[85,95,98,80,90,95,70,88],color:'#ffd700'},
    {name:'Guarneri',vals:[78,80,92,88,75,85,85,72],color:'#ef5350'},
    {name:'Amati',vals:[92,70,72,85,80,78,50,95],color:'#4fc3f7'},
    {name:'Stainer',vals:[88,65,68,90,72,82,45,90],color:'#81c784'},
    {name:'Modern',vals:[75,88,85,70,85,80,78,75],color:'#ce93d8'}
  ];
  var compared={},showViolin=-1;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1e1228';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Tone DNA Profiler',310,22);

    var cx=230,cy=210,r=135,n=8;
    for(var ring=1;ring<=5;ring++){
      ctx.strokeStyle='#3a2a1a';ctx.lineWidth=0.5;ctx.beginPath();
      for(var j=0;j<n;j++){
        var ang=-Math.PI/2+j*Math.PI*2/n;
        var px=cx+Math.cos(ang)*r*ring/5,py=cy+Math.sin(ang)*r*ring/5;
        if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }ctx.closePath();ctx.stroke();
    }
    axes.forEach(function(ax,j){
      var ang=-Math.PI/2+j*Math.PI*2/n;
      ctx.strokeStyle='#3a2a1a';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r);ctx.stroke();
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(ax,cx+Math.cos(ang)*(r+18),cy+Math.sin(ang)*(r+18)+4);
    });

    function drawPoly(data,fill){
      ctx.beginPath();ctx.fillStyle=data.color+'33';ctx.strokeStyle=data.color;ctx.lineWidth=fill?2:1.5;
      data.vals.forEach(function(v,j){
        var ang=-Math.PI/2+j*Math.PI*2/n;
        var px=cx+Math.cos(ang)*r*v/100,py=cy+Math.sin(ang)*r*v/100;
        if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      });
      ctx.closePath();if(fill)ctx.fill();ctx.stroke();
    }
    drawPoly(user,true);
    if(showViolin>=0)drawPoly(violins[showViolin],false);

    violins.forEach(function(v,i){
      var bx=430,by=50+i*55;
      ctx.fillStyle=i===showViolin?'rgba(212,137,74,0.12)':'transparent';ctx.fillRect(bx,by,180,48);
      ctx.strokeStyle=i===showViolin?v.color:'#3a2a1a';ctx.lineWidth=i===showViolin?2:1;ctx.strokeRect(bx,by,180,48);
      ctx.fillStyle=v.color;ctx.font='bold 10px Georgia';ctx.textAlign='left';ctx.fillText(v.name,bx+8,by+16);
      var avg=Math.round(v.vals.reduce(function(a,b){return a+b},0)/n);
      ctx.fillStyle='#ccc';ctx.font='9px Georgia';ctx.fillText('Avg: '+avg,bx+8,by+32);
      var similarity=0;user.vals.forEach(function(uv,j){similarity+=Math.abs(uv-v.vals[j]);});
      var simPct=Math.max(0,100-Math.round(similarity/n));
      ctx.fillText('Similarity: '+simPct+'%',bx+8,by+44);
    });

    var uAvg=Math.round(user.vals.reduce(function(a,b){return a+b},0)/n);
    var grade=uAvg>=85?'S':uAvg>=70?'A':uAvg>=55?'B':uAvg>=40?'C':'D';
    var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';
    ctx.fillStyle='#1e1228';ctx.fillRect(430,330,180,35);ctx.strokeStyle='#3a2a1a';ctx.strokeRect(430,330,180,35);
    ctx.fillStyle=gc;ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText('Your Grade: '+grade+' ('+uAvg+')',520,352);

    ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
    ctx.fillText('Click violin names to compare | Click radar to adjust your profile',310,392);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    for(var i=0;i<violins.length;i++){
      var bx=430,by=50+i*55;
      if(x>=bx&&x<=bx+180&&y>=by&&y<=by+48){
        showViolin=showViolin===i?-1:i;sfx('tone_compare');
        compared[violins[i].name]=true;
        if(Object.keys(compared).length>=3)unlockAch('tone_profiler','Tone Profiler');
        draw();return;
      }
    }
    var cx=230,cy=210,r=135,n=8;
    for(var j=0;j<n;j++){
      var ang=-Math.PI/2+j*Math.PI*2/n;
      var px=cx+Math.cos(ang)*r*user.vals[j]/100,py=cy+Math.sin(ang)*r*user.vals[j]/100;
      if(Math.abs(x-px)<15&&Math.abs(y-py)<15){
        user.vals[j]=Math.min(100,user.vals[j]+5);sfx('tone_axis');draw();return;
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   7. BOWING ENERGY EFFICIENCY ANALYZER (보잉 에너지 효율 분석기)
   Canvas 620x400 — 8 techniques dual bar + efficiency %
   ═══════════════════════════════════════════════════════ */
function createBowEnergyPanel(){
  var panel=mkPanel('v28-bowenergy-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='Bowing Energy Efficiency Analyzer';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8 techniques · energy input vs sound output · click for optimization tips';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var techniques=[
    {name:'Detache',energy:60,output:75,tip:'Use natural arm weight; avoid pressing'},
    {name:'Legato',energy:45,output:80,tip:'Smooth bow changes with consistent speed'},
    {name:'Staccato',energy:70,output:55,tip:'Quick wrist motion; release pressure fast'},
    {name:'Spiccato',energy:40,output:65,tip:'Let bow bounce naturally at balance point'},
    {name:'Martele',energy:75,output:60,tip:'Firm grip then release; accent start only'},
    {name:'Tremolo',energy:85,output:50,tip:'Small wrist motion near tip; relax arm'},
    {name:'Ricochet',energy:35,output:58,tip:'Drop bow and let it bounce on its own'},
    {name:'Col legno',energy:30,output:35,tip:'Light wood contact; minimal force needed'}
  ];
  var sel=-1,analyzed={};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1e1228';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Bowing Energy Efficiency',310,22);

    var bw=26,gap=6,startX=62,barH=220,y0=50;
    techniques.forEach(function(t,i){
      var x=startX+i*(2*bw+gap+14);
      var hE=barH*t.energy/100,hO=barH*t.output/100;
      ctx.fillStyle='#ef5350';ctx.fillRect(x,y0+barH-hE,bw,hE);
      ctx.fillStyle='#81c784';ctx.fillRect(x+bw+2,y0+barH-hO,bw,hO);

      ctx.fillStyle='#ef5350';ctx.font='8px Georgia';ctx.textAlign='center';
      ctx.fillText(t.energy,x+bw/2,y0+barH-hE-4);
      ctx.fillStyle='#81c784';ctx.fillText(t.output,x+bw+2+bw/2,y0+barH-hO-4);

      var eff=Math.round(t.output/t.energy*100);
      var ec=eff>=120?'#ffd700':eff>=100?'#81c784':eff>=80?'#ff9800':'#ef5350';
      ctx.fillStyle=ec;ctx.font='bold 9px Georgia';ctx.fillText(eff+'%',x+bw+1,y0+barH+14);

      ctx.fillStyle=i===sel?'#D4894A':'#a08060';ctx.font='8px Georgia';
      ctx.save();ctx.translate(x+bw+1,y0+barH+24);ctx.rotate(Math.PI/6);ctx.textAlign='left';ctx.fillText(t.name,0,0);ctx.restore();
    });

    ctx.fillStyle='#ef5350';ctx.fillRect(30,310,10,10);ctx.fillStyle='#ccc';ctx.font='10px Georgia';ctx.textAlign='left';ctx.fillText('Energy Input',44,320);
    ctx.fillStyle='#81c784';ctx.fillRect(150,310,10,10);ctx.fillText('Sound Output',164,320);
    ctx.fillStyle='#a08060';ctx.fillText('Percentage = Output/Input efficiency',290,320);

    if(sel>=0){
      var t=techniques[sel];var eff=Math.round(t.output/t.energy*100);
      var grade=eff>=140?'S':eff>=120?'A':eff>=100?'B':eff>=80?'C':'D';
      var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';
      ctx.fillStyle='#1e1228';ctx.fillRect(15,335,590,55);ctx.strokeStyle='#3a2a1a';ctx.strokeRect(15,335,590,55);
      ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='left';
      ctx.fillText(t.name+' Efficiency: '+eff+'%',25,355);
      ctx.fillStyle=gc;ctx.font='bold 14px Georgia';ctx.textAlign='right';ctx.fillText(grade,595,355);
      ctx.fillStyle='#ccc';ctx.font='10px Georgia';ctx.textAlign='left';
      ctx.fillText('Tip: '+t.tip,25,376);
    }else{
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText('Click bars to see optimization tips for each bowing technique',310,360);
    }
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var bw=26,gap=6,startX=62;
    for(var i=0;i<8;i++){
      var bx=startX+i*(2*bw+gap+14);
      if(x>=bx&&x<=bx+2*bw+2&&y>=50&&y<=270+50){
        sel=i;sfx('energy_bar');analyzed[techniques[i].name]=true;
        if(Object.keys(analyzed).length>=6)unlockAch('energy_analyst','Energy Analyst');
        draw();return;
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   8. COMPREHENSIVE MAESTRO INDEX (종합 바이올린 마에스트로 인덱스)
   Canvas 620x400 — 8 KPI semicircular gauges 4x2
   ═══════════════════════════════════════════════════════ */
function createMaestroPanel(){
  var panel=mkPanel('v28-maestro-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='Comprehensive Maestro Index';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8 KPI semicircular gauges 4×2 · weighted S~D grade · click to adjust';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var kpis=[
    {name:'Intonation',val:70,weight:0.15,color:'#ef5350'},
    {name:'Bowing',val:65,weight:0.15,color:'#4fc3f7'},
    {name:'Vibrato',val:60,weight:0.12,color:'#ab47bc'},
    {name:'Position',val:55,weight:0.10,color:'#81c784'},
    {name:'SightRead',val:50,weight:0.10,color:'#ffd54f'},
    {name:'Expression',val:62,weight:0.15,color:'#ce93d8'},
    {name:'Technique',val:58,weight:0.13,color:'#ff7043'},
    {name:'Repertoire',val:72,weight:0.10,color:'#4db6ac'}
  ];
  var sCount=0;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1e1228';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Maestro Index: 8 Core KPIs',310,20);

    var cols=4,rows=2,gw=130,gh=140,padX=22,padY=38,gapX=10,gapY=10;
    sCount=0;
    kpis.forEach(function(kpi,i){
      var col=i%cols,row=Math.floor(i/cols);
      var ccx=padX+col*(gw+gapX)+gw/2,ccy=padY+row*(gh+gapY)+gh/2+10;
      var ra=48;

      ctx.strokeStyle='#3a2a1a';ctx.lineWidth=12;ctx.beginPath();ctx.arc(ccx,ccy,ra,Math.PI,0);ctx.stroke();
      var pct=kpi.val/100;
      var endAng=Math.PI+pct*Math.PI;
      ctx.strokeStyle=kpi.color;ctx.lineWidth=12;ctx.beginPath();ctx.arc(ccx,ccy,ra,Math.PI,endAng);ctx.stroke();

      ctx.fillStyle=kpi.color;ctx.font='bold 16px Georgia';ctx.textAlign='center';
      ctx.fillText(kpi.val,ccx,ccy-5);

      var grade=kpi.val>=85?'S':kpi.val>=70?'A':kpi.val>=55?'B':kpi.val>=40?'C':'D';
      if(grade==='S')sCount++;
      var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';
      ctx.fillStyle=gc;ctx.font='bold 11px Georgia';ctx.fillText(grade,ccx,ccy+12);

      ctx.fillStyle='#a08060';ctx.font='9px Georgia';
      ctx.fillText(kpi.name,ccx,ccy+28);
      ctx.fillStyle='#777';ctx.font='8px Georgia';
      ctx.fillText('w:'+(kpi.weight*100).toFixed(0)+'%',ccx,ccy+40);
    });

    var weighted=kpis.reduce(function(a,k){return a+k.val*k.weight},0);
    var wg=weighted>=85?'S':weighted>=70?'A':weighted>=55?'B':weighted>=40?'C':'D';
    var wgc=wg==='S'?'#ffd700':wg==='A'?'#4fc3f7':wg==='B'?'#81c784':wg==='C'?'#ff9800':'#ef5350';
    ctx.fillStyle='#1e1228';ctx.fillRect(15,355,590,38);
    ctx.fillStyle=wgc;ctx.font='bold 16px Georgia';ctx.textAlign='center';
    ctx.fillText('Maestro Grade: '+wg+' ('+weighted.toFixed(1)+')',310,378);

    if(sCount>=4)unlockAch('maestro_rank','Maestro Rank');
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var cols=4,gw=130,gh=140,padX=22,padY=38,gapX=10,gapY=10;
    for(var i=0;i<8;i++){
      var col=i%cols,row=Math.floor(i/cols);
      var bx=padX+col*(gw+gapX),by=padY+row*(gh+gapY);
      if(x>=bx&&x<=bx+gw&&y>=by&&y<=by+gh){
        kpis[i].val=Math.min(100,kpis[i].val+5);sfx('maestro_gauge');draw();return;
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   QUIZ PANEL
   ═══════════════════════════════════════════════════════ */
function createQuizPanel(){
  var panel=mkPanel('v28-quiz-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='Quiz v28 (15 Questions)';panel.appendChild(h);
  var total=V28_QUIZ.length,correct=0,answered=0;
  var wrap=document.createElement('div');wrap.style.cssText='max-width:600px;margin:0 auto;';

  V28_QUIZ.forEach(function(q,qi){
    var qd=document.createElement('div');qd.style.cssText='margin:10px 0;padding:10px;background:#1e1228;border-radius:8px;border:1px solid #3a2a1a;';
    var qt=document.createElement('div');qt.style.cssText='color:#D4894A;font-size:12px;margin-bottom:6px;';qt.textContent=(qi+1)+'. '+q.q;qd.appendChild(qt);
    q.a.forEach(function(a,ai){
      var ab=document.createElement('button');
      ab.textContent=a;
      ab.style.cssText='display:block;width:100%;padding:6px;margin:3px 0;border-radius:6px;border:1px solid #3a2a1a;background:#2a1a30;color:#ccc;cursor:pointer;font-size:11px;text-align:left;';
      ab.addEventListener('click',function(){
        if(ab.dataset.done)return;ab.dataset.done='1';answered++;
        if(ai===q.c){ab.style.background='#2e7d32';ab.style.color='#fff';correct++;sfx('drift_zone');}
        else{ab.style.background='#c62828';ab.style.color='#fff';sfx('energy_bar');
          qd.querySelectorAll('button')[q.c].style.background='#2e7d32';qd.querySelectorAll('button')[q.c].style.color='#fff';}
        if(answered===total&&correct>=Math.ceil(total*0.8))unlockAch('quiz_v28_master','Quiz v28 Master');
      });
      qd.appendChild(ab);
    });
    wrap.appendChild(qd);
  });
  panel.appendChild(wrap);document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════ */
function addV28Nav(){
  var navTarget=document.querySelector('.v19-nav-bar')||document.querySelector('nav')||document.querySelector('.bottom-nav')||document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){
    var allNav=document.querySelectorAll('div[style*="flex-wrap"]');
    if(allNav.length>0)navTarget=allNav[allNav.length-1];
  }
  if(!navTarget){navTarget=document.createElement('div');navTarget.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px;justify-content:center;margin:8px auto;max-width:600px;';document.body.appendChild(navTarget);}

  var btns=[
    {label:'Drift',panel:'v28-drift-panel',color:'#4fc3f7',key:'KeyQ'},
    {label:'Sonority',panel:'v28-sonority-panel',color:'#ce93d8',key:'KeyW'},
    {label:'PosShft',panel:'v28-posshift-panel',color:'#81c784',key:'KeyE'},
    {label:'VibEmo',panel:'v28-vibrato-panel',color:'#ffd54f',key:'KeyR'},
    {label:'PeakPrf',panel:'v28-peak-panel',color:'#ff7043',key:'KeyT'},
    {label:'ToneDNA',panel:'v28-tonedna-panel',color:'#4db6ac',key:'KeyY'},
    {label:'BowNRG',panel:'v28-bowenergy-panel',color:'#ef5350',key:'KeyU'},
    {label:'Maestro',panel:'v28-maestro-panel',color:'#aed581',key:'KeyI'},
    {label:'Quiz28',panel:'v28-quiz-panel',color:'#D4894A',key:'Digit0'}
  ];

  var opened=lp('v28_opened')||{};

  btns.forEach(function(b){
    var btn=document.createElement('button');
    btn.textContent=b.label;
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid '+b.color+';background:transparent;color:'+b.color+';cursor:pointer;font-size:0.72em;margin:2px;';
    btn.addEventListener('click',function(){
      var p=document.getElementById(b.panel);
      if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('drift_note');
        opened[b.label]=true;sp('v28_opened',opened);
        if(Object.keys(opened).length>=5)unlockAch('v28_explorer','v28 Explorer');
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
        if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('drift_note');
          opened[b.label]=true;sp('v28_opened',opened);
          if(Object.keys(opened).length>=5)unlockAch('v28_explorer','v28 Explorer');
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
    V28_SONGS.forEach(function(s){
      if(!window.SONG_DB.find(function(x){return x.id===s.id;}))window.SONG_DB.push(s);
    });
  }
  if(typeof window.LESSON_DB!=='undefined'&&Array.isArray(window.LESSON_DB)){
    V28_LESSONS.forEach(function(l){
      if(!window.LESSON_DB.find(function(x){return x.id===l.id;}))window.LESSON_DB.push(l);
    });
  }
  if(typeof window.ACH_DB!=='undefined'&&Array.isArray(window.ACH_DB)){
    V28_ACHS.forEach(function(a){
      if(!window.ACH_DB.find(function(x){return x.id===a.id;}))window.ACH_DB.push(a);
    });
  }
  unlockAch('song_254','Song Collector 254');
  var allAch=loadAch(),v28Ids=V28_ACHS.map(function(a){return a.id;});
  var allV28=v28Ids.every(function(id){return allAch[id];});
  if(allV28)unlockAch('v28_complete','v28 Complete');
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
function init(){
  createDriftPanel();
  createSonorityPanel();
  createPosShiftPanel();
  createVibratoPanel();
  createPeakPanel();
  createToneDNAPanel();
  createBowEnergyPanel();
  createMaestroPanel();
  createQuizPanel();
  addV28Nav();
  registerData();
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
else{init();}

})();
