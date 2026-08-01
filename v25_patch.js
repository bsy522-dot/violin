(function V25Patch(){
'use strict';
if(window.__V25_LOADED)return;
window.__V25_LOADED=true;

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
  var h=lp(key)||[];h.push(val);if(h.length>(max||50))h=h.slice(-max||-50);sp(key,h);return h;
}

/* ─── SFX 16 types ─── */
var actx=null;
function getACtx(){if(!actx)try{actx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}return actx}
function sfx(type){
  var c=getACtx();if(!c)return;var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);
  var t=c.currentTime,fr=440,dur=0.12,wave='sine';
  switch(type){
    case'bow_curve':fr=523;dur=0.08;break;
    case'bow_optimal':fr=784;dur=0.2;wave='triangle';break;
    case'scale_tap':fr=392;dur=0.1;break;
    case'scale_master':fr=698;dur=0.25;wave='triangle';break;
    case'finger_tap':fr=494;dur=0.1;break;
    case'finger_strong':fr=659;dur=0.2;wave='triangle';break;
    case'shift_hit':fr=587;dur=0.15;break;
    case'shift_miss':fr=294;dur=0.2;wave='sawtooth';break;
    case'contact_move':fr=440;dur=0.1;wave='sine';break;
    case'contact_sweet':fr=784;dur=0.2;wave='triangle';break;
    case'goal_check':fr=523;dur=0.12;break;
    case'goal_complete':fr=880;dur=0.3;wave='triangle';break;
    case'emotion_pick':fr=349;dur=0.15;wave='triangle';break;
    case'mastery_calc':fr=659;dur=0.2;wave='triangle';break;
    case'quiz_v25':fr=587;dur=0.12;break;
    case'achieve':fr=880;dur=0.3;wave='triangle';break;
    default:fr=440;dur=0.1;
  }
  o.type=wave;o.frequency.setValueAtTime(fr,t);
  g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t);o.stop(t+dur);
}

/* ═══════════════════════════════════════════════════════
   DATA: 10 Songs (s215-s224)
   ═══════════════════════════════════════════════════════ */
var V25_SONGS=[
  {id:'s215',title:'Partita No.2 Chaconne',composer:'Bach',difficulty:5,key:'D minor',bpm:66,duration:'14:00',techniques:['chords','bariolage','counterpoint'],era:'Baroque'},
  {id:'s216',title:'Violin Concerto No.1 3rd mvt',composer:'Bruch',difficulty:5,key:'G minor',bpm:108,duration:'7:30',techniques:['ricochet','double-stop','cadenza'],era:'Romantic'},
  {id:'s217',title:'Мélodie Op.42 No.3',composer:'Tchaikovsky',difficulty:3,key:'E-flat major',bpm:58,duration:'4:20',techniques:['cantabile','vibrato','legato'],era:'Romantic'},
  {id:'s218',title:'Caprice No.5',composer:'Paganini',difficulty:5,key:'A minor',bpm:96,duration:'2:40',techniques:['staccato','arpeggios','left-hand-pizz'],era:'Romantic'},
  {id:'s219',title:'Légende Op.17',composer:'Wieniawski',difficulty:4,key:'G minor',bpm:72,duration:'8:50',techniques:['harmonics','glissando','espressivo'],era:'Romantic'},
  {id:'s220',title:'Sonata No.3 Ballade',composer:'Ysaÿe',difficulty:5,key:'D minor',bpm:80,duration:'7:00',techniques:['chords','spiccato','sul-ponticello'],era:'Modern'},
  {id:'s221',title:'Humoresque No.7',composer:'Dvořák',difficulty:3,key:'G-flat major',bpm:72,duration:'3:30',techniques:['portamento','dynamics','grace-notes'],era:'Romantic'},
  {id:'s222',title:'Devil’s Trill Sonata',composer:'Tartini',difficulty:5,key:'G minor',bpm:84,duration:'15:20',techniques:['trills','double-stop','cadenza'],era:'Baroque'},
  {id:'s223',title:'Romance No.2 in F',composer:'Beethoven',difficulty:3,key:'F major',bpm:68,duration:'9:30',techniques:['legato','cantabile','dynamics'],era:'Classical'},
  {id:'s224',title:'Violin Concerto No.5 1st mvt',composer:'Vieuxtemps',difficulty:5,key:'A minor',bpm:92,duration:'11:00',techniques:['octaves','sautillé','arpeggios'],era:'Romantic'}
];

/* ═══════════════════════════════════════════════════════
   DATA: 10 Lessons (l241-l250)
   ═══════════════════════════════════════════════════════ */
var V25_LESSONS=[
  {id:'l241',title:'Bow Speed Curve Fundamentals',level:'intermediate',duration:'14min',topics:['bow-control','speed-variation','tone-production']},
  {id:'l242',title:'Scale Mastery Roadmap',level:'beginner',duration:'12min',topics:['scales','key-signatures','practice-strategy']},
  {id:'l243',title:'Finger Independence Exercises',level:'intermediate',duration:'15min',topics:['left-hand','finger-strength','dexterity']},
  {id:'l244',title:'Position Shifting Accuracy',level:'intermediate',duration:'13min',topics:['shifting','intonation','muscle-memory']},
  {id:'l245',title:'Contact Point and Tone Color',level:'advanced',duration:'16min',topics:['bow-technique','sul-tasto','sul-ponticello']},
  {id:'l246',title:'Setting Effective Practice Goals',level:'beginner',duration:'10min',topics:['practice-strategy','goal-setting','time-management']},
  {id:'l247',title:'Musical Emotion in Performance',level:'advanced',duration:'18min',topics:['expression','interpretation','communication']},
  {id:'l248',title:'Bach Chaconne Deep Dive',level:'advanced',duration:'22min',topics:['repertoire','baroque','polyphony']},
  {id:'l249',title:'Tartini Devil’s Trill Analysis',level:'advanced',duration:'20min',topics:['repertoire','trills','ornamentation']},
  {id:'l250',title:'v25 Comprehensive Review',level:'all',duration:'15min',topics:['bow-curve','scales','fingers','shifting','goals','emotions']}
];

/* ═══════════════════════════════════════════════════════
   DATA: 15 Quiz (q226-q240)
   ═══════════════════════════════════════════════════════ */
var V25_QUIZ=[
  {q:'보잉 시 팁(tip)에서 프로그(frog)로 이동하는 것을 무엇이라 하는가?',a:['업보우(Up-bow)','다운보우(Down-bow)','스피카토(Spiccato)','마르텔레(Martelé)'],c:0},
  {q:'G장조 스케일의 조표에 샵(#)은 몇 개인가?',a:['0개','1개','2개','3개'],c:1},
  {q:'왼손 4번 손가락(새끼손가락)의 독립성 훈련에 가장 효과적인 연습은?',a:['트릴 연습','비브라토','글리산도','하모닉스'],c:0},
  {q:'1st 포지션에서 3rd 포지션으로 시프팅 시 기준이 되는 손가락은?',a:['1번(검지)','2번(중지)','3번(약지)','4번(새끼)'],c:0},
  {q:'Sul Tasto 주법의 접점(contact point) 위치는?',a:['브릿지 위','브릿지 근처','지판 위','지판과 브릿지 중간'],c:2},
  {q:'효과적인 연습 세션의 권장 최대 지속시간은?',a:['15분','25분','45분','2시간'],c:2},
  {q:'슬픔(Sorrow)을 표현할 때 가장 적합한 보잉 테크닉은?',a:['스피카토','레가토','콜레뇨','리코셰'],c:1},
  {q:'바흐 샤콘느는 몇 번 파르티타에 포함되어 있는가?',a:['1번','2번','3번','4번'],c:1},
  {q:'타르티니 &quot;악마의 트릴&quot; 소나타에서 가장 유명한 기법은?',a:['피치카토','더블스톱 트릴','하모닉스','바리올라주'],c:1},
  {q:'보잉 속도 곡선에서 &quot;Sustain Zone&quot;이란?',a:['활의 시작 가속 구간','일정 속도 유지 구간','감속 정지 구간','활을 들어올리는 구간'],c:1},
  {q:'스케일 연습 시 &quot;원 옥타브 스케일&quot;의 음 수는?',a:['7개','8개','12개','14개'],c:1},
  {q:'비외탕(Vieuxtemps)의 국적은?',a:['프랑스','독일','벨기에','이탈리아'],c:2},
  {q:'이자이(Ysaÿe) 바이올린 소나타는 총 몇 곡인가?',a:['3곡','4곡','6곡','8곡'],c:2},
  {q:'활의 접점을 브릿지 쪽으로 옮기면 음색은 어떻게 변하는가?',a:['따뜻하고 부드러워진다','밝고 날카로워진다','소리가 작아진다','변화 없다'],c:1},
  {q:'연습 목표 설정의 SMART 원칙에서 M은 무엇을 의미하는가?',a:['Meaningful','Measurable','Musical','Moderate'],c:1}
];

/* ═══════════════════════════════════════════════════════
   DATA: 12 Achievements
   ═══════════════════════════════════════════════════════ */
var V25_ACHS=[
  {id:'bow_curve_analyst',name:'Bow Curve Analyst',desc:'Analyzed bow speed curves for all 7 articulations'},
  {id:'scale_cartographer',name:'Scale Cartographer',desc:'Explored 6+ scales on the mastery map'},
  {id:'finger_athlete',name:'Finger Athlete',desc:'Completed finger independence tests for all 4 strings'},
  {id:'shift_navigator',name:'Shift Navigator',desc:'Achieved 80%+ shift accuracy across 3 positions'},
  {id:'contact_master',name:'Contact Point Master',desc:'Found the sweet spot for 5+ contact points'},
  {id:'goal_achiever',name:'Goal Achiever',desc:'Completed practice goals in 4+ categories'},
  {id:'emotion_interpreter',name:'Emotion Interpreter',desc:'Explored 6+ musical emotions'},
  {id:'mastery_reviewer',name:'Mastery Reviewer',desc:'Viewed the comprehensive mastery dashboard'},
  {id:'quiz_v25_master',name:'Quiz v25 Master',desc:'Scored 80%+ on v25 quiz'},
  {id:'song_224',name:'Song Collector 224',desc:'224 songs in the library'},
  {id:'v25_explorer',name:'v25 Explorer',desc:'Explored 5+ v25 features'},
  {id:'v25_complete',name:'v25 Complete',desc:'Completed all v25 achievements'}
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
   1. BOW SPEED CURVE ANALYZER (보잉속도곡선분석기)
   Canvas 620x400 — 7 articulations speed/pressure curves
   ═══════════════════════════════════════════════════════ */
function createBowCurvePanel(){
  var panel=mkPanel('v25-bowcurve-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎻 보잉 속도 곡선 분석기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='7종 아티큐레이션별 활 속도/압력 곡선 분석';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var arts=['Detaché','Legato','Staccato','Spiccato','Martelé','Tremolo','Ricochet'];
  var curves={
    'Detaché':{speed:[0.2,0.6,0.85,0.9,0.88,0.85,0.7,0.4,0.15],pressure:[0.4,0.55,0.6,0.6,0.6,0.55,0.5,0.45,0.35],grade:'A'},
    'Legato':{speed:[0.3,0.5,0.65,0.7,0.72,0.7,0.68,0.6,0.4],pressure:[0.3,0.4,0.45,0.5,0.5,0.5,0.48,0.42,0.3],grade:'S'},
    'Staccato':{speed:[0.8,0.9,0.4,0.1,0,0,0,0,0],pressure:[0.7,0.8,0.5,0.2,0,0,0,0,0],grade:'A'},
    'Spiccato':{speed:[0.1,0.7,0.95,0.6,0.1,0,0.1,0.7,0.95],pressure:[0.05,0.3,0.5,0.2,0,0,0.05,0.3,0.5],grade:'B'},
    'Martelé':{speed:[0.05,0.95,0.7,0.3,0.05,0,0,0,0],pressure:[0.9,0.7,0.4,0.15,0.05,0,0,0,0],grade:'A'},
    'Tremolo':{speed:[0.7,0.9,0.7,0.9,0.7,0.9,0.7,0.9,0.7],pressure:[0.4,0.5,0.4,0.5,0.4,0.5,0.4,0.5,0.4],grade:'B'},
    'Ricochet':{speed:[0.9,0.7,0.5,0.35,0.2,0.1,0.05,0,0],pressure:[0.6,0.4,0.25,0.15,0.08,0.03,0.01,0,0],grade:'S'}
  };
  var selArt=0;
  var history=lp('v25_bowcurve_history')||{};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,620,400);
    var art=arts[selArt],data=curves[art];

    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText(art+' Bow Curve',310,28);

    var gradeColors={S:'#ffd700',A:'#4caf50',B:'#2196f3',C:'#ff9800',D:'#f44336'};
    ctx.fillStyle=gradeColors[data.grade]||'#fff';ctx.font='bold 20px Georgia';
    ctx.fillText(data.grade,580,35);

    var ox=60,oy=340,w=500,ht=260;
    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=1;
    for(var i=0;i<=5;i++){var y=oy-i*(ht/5);ctx.beginPath();ctx.moveTo(ox,y);ctx.lineTo(ox+w,y);ctx.stroke();
      ctx.fillStyle='#6a5a4a';ctx.font='10px Georgia';ctx.textAlign='right';ctx.fillText((i*20)+'%',ox-6,y+4);}
    ctx.fillStyle='#6a5a4a';ctx.textAlign='center';
    var labels=['Start','','','Mid','','','','','End'];
    for(var i=0;i<9;i++){var x=ox+i*(w/8);ctx.fillText(labels[i]||'',x,oy+16);}

    ctx.beginPath();ctx.strokeStyle='#D4894A';ctx.lineWidth=2.5;
    for(var i=0;i<data.speed.length;i++){var x=ox+i*(w/8),y=oy-data.speed[i]*ht;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    ctx.beginPath();ctx.strokeStyle='#81c784';ctx.lineWidth=2;ctx.setLineDash([5,3]);
    for(var i=0;i<data.pressure.length;i++){var x=ox+i*(w/8),y=oy-data.pressure[i]*ht;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.setLineDash([]);

    ctx.fillStyle='#D4894A';ctx.font='11px Georgia';ctx.textAlign='left';
    ctx.fillRect(ox,oy+30,12,3);ctx.fillText('Speed',ox+18,oy+35);
    ctx.fillStyle='#81c784';ctx.fillRect(ox+90,oy+30,12,3);ctx.fillText('Pressure',ox+108,oy+35);

    var btnW=75,btnH=24,bx=ox;
    for(var i=0;i<arts.length;i++){
      ctx.fillStyle=i===selArt?'rgba(212,137,74,0.3)':'rgba(58,42,26,0.5)';
      ctx.fillRect(bx,oy+48,btnW,btnH);ctx.strokeStyle=i===selArt?'#D4894A':'#5a4a3a';
      ctx.strokeRect(bx,oy+48,btnW,btnH);ctx.fillStyle=i===selArt?'#D4894A':'#8a7a6a';
      ctx.font='9px Georgia';ctx.textAlign='center';ctx.fillText(arts[i],bx+btnW/2,oy+64);
      bx+=btnW+3;if(i===3){bx=ox+60;}
    }
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=620/rect.width,x=(e.clientX-rect.left)*sx,y=(e.clientY-rect.top)*(400/rect.height);
    var ox=60,oy=340,btnW=75,btnH=24;
    for(var i=0;i<arts.length;i++){
      var bx=ox+(i<4?i*(btnW+3):(i-4)*(btnW+3)+60),by=oy+48;
      if(i>=4)by=oy+48;
      if(x>=bx&&x<=bx+btnW&&y>=by&&y<=by+btnH){selArt=i;sfx('bow_curve');draw();
        history[arts[i]]=true;sp('v25_bowcurve_history',history);
        if(Object.keys(history).length>=7)unlockAch('bow_curve_analyst','Bow Curve Analyst');
        return;}
    }
  });
  draw();document.body.appendChild(panel);return panel;
}

/* ═══════════════════════════════════════════════════════
   2. SCALE MASTERY MAP (스케일완성도맵)
   Canvas 600x380 — 12 keys × 4 scale types heatmap
   ═══════════════════════════════════════════════════════ */
function createScaleMapPanel(){
  var panel=mkPanel('v25-scalemap-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎵 스케일 완성도 맵';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='12키 × 4스케일 유형 마스터리 히트맵';panel.appendChild(s);
  var cv=mkCanvas(600,380);panel.appendChild(cv);

  var keys=['C','G','D','A','E','B','F#','F','Bb','Eb','Ab','Db'];
  var types=['Major','N.Minor','H.Minor','M.Minor'];
  var mastery=lp('v25_scale_mastery')||{};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,600,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Scale Mastery Map',300,24);

    var ox=70,oy=50,cw=40,ch=24;
    ctx.font='10px Georgia';ctx.textAlign='center';ctx.fillStyle='#a08060';
    for(var j=0;j<types.length;j++){ctx.fillText(types[j],ox+j*cw+cw/2+j*3,oy-6);}

    for(var i=0;i<keys.length;i++){
      ctx.fillStyle='#c9a96e';ctx.textAlign='right';ctx.font='11px Georgia';
      ctx.fillText(keys[i],ox-8,oy+i*ch+ch/2+4+i*2);
      for(var j=0;j<types.length;j++){
        var k=keys[i]+'_'+types[j],val=mastery[k]||0;
        var colors=['#1a1020','#2d1a10','#4a2a10','#6a3a10','#8a5a20','#aa7a30','#cc9a40','#D4894A','#e0a050','#f0c060','#ffd700'];
        var ci=Math.min(10,Math.floor(val/10));
        ctx.fillStyle=colors[ci];
        ctx.fillRect(ox+j*(cw+3),oy+i*(ch+2),cw,ch);
        ctx.strokeStyle='#3a2a1a';ctx.strokeRect(ox+j*(cw+3),oy+i*(ch+2),cw,ch);
        if(val>0){ctx.fillStyle=val>60?'#1a1020':'#c9a96e';ctx.font='9px Georgia';ctx.textAlign='center';
          ctx.fillText(val+'%',ox+j*(cw+3)+cw/2,oy+i*(ch+2)+ch/2+3);}
      }
    }

    var totalKeys=keys.length*types.length,mastered=0;
    for(var k in mastery)if(mastery[k]>=80)mastered++;
    ctx.fillStyle='#D4894A';ctx.font='bold 12px Georgia';ctx.textAlign='center';
    ctx.fillText('Mastered: '+mastered+'/'+totalKeys+' ('+Math.round(mastered/totalKeys*100)+'%)',300,370);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=600/rect.width,sy=380/rect.height;
    var x=(e.clientX-rect.left)*sx,y=(e.clientY-rect.top)*sy;
    var ox=70,oy=50,cw=40,ch=24;
    for(var i=0;i<keys.length;i++){for(var j=0;j<types.length;j++){
      var cx=ox+j*(cw+3),cy=oy+i*(ch+2);
      if(x>=cx&&x<=cx+cw&&y>=cy&&y<=cy+ch){
        var k=keys[i]+'_'+types[j];mastery[k]=Math.min(100,(mastery[k]||0)+10);
        sp('v25_scale_mastery',mastery);sfx('scale_tap');draw();
        var explored=0;for(var m in mastery)if(mastery[m]>0)explored++;
        if(explored>=6)unlockAch('scale_cartographer','Scale Cartographer');
        return;
      }
    }}
  });
  draw();document.body.appendChild(panel);return panel;
}

/* ═══════════════════════════════════════════════════════
   3. FINGER INDEPENDENCE ANALYZER (운지독립성분석기)
   Canvas 620x380 — 4 fingers × 4 strings independence
   ═══════════════════════════════════════════════════════ */
function createFingerPanel(){
  var panel=mkPanel('v25-finger-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='✋ 운지 독립성 분석기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='4손가락 × 4현 독립성 매트릭스';panel.appendChild(s);
  var cv=mkCanvas(620,380);panel.appendChild(cv);

  var strings=['G','D','A','E'];
  var fingers=['1st (Index)','2nd (Middle)','3rd (Ring)','4th (Pinky)'];
  var data=lp('v25_finger_data')||{};

  function getVal(str,fin){return data[str+'_'+fin]||Math.floor(Math.random()*60+20);}

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,380);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,620,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Finger Independence Matrix',310,24);

    var ox=130,oy=55,bw=100,bh=55;
    ctx.font='10px Georgia';ctx.textAlign='center';ctx.fillStyle='#a08060';
    for(var j=0;j<strings.length;j++)ctx.fillText(strings[j]+' String',ox+j*(bw+8)+bw/2,oy-8);
    ctx.textAlign='right';
    for(var i=0;i<fingers.length;i++)ctx.fillText(fingers[i],ox-10,oy+i*(bh+8)+bh/2+4);

    var weakest={val:100,str:'',fin:''};
    for(var i=0;i<fingers.length;i++){for(var j=0;j<strings.length;j++){
      var val=getVal(strings[j],i);
      if(val<weakest.val){weakest={val:val,str:strings[j],fin:fingers[i]};}
      var r=val>80?50:val>60?130:val>40?200:230,g=val>80?200:val>60?180:val>40?120:80;
      ctx.fillStyle='rgba('+r+','+g+',50,0.7)';
      ctx.fillRect(ox+j*(bw+8),oy+i*(bh+8),bw,bh);
      ctx.strokeStyle='#5a4a3a';ctx.strokeRect(ox+j*(bw+8),oy+i*(bh+8),bw,bh);
      ctx.fillStyle='#fff';ctx.font='bold 16px Georgia';ctx.textAlign='center';
      ctx.fillText(val+'%',ox+j*(bw+8)+bw/2,oy+i*(bh+8)+bh/2+6);
      var grade=val>=90?'S':val>=75?'A':val>=60?'B':val>=40?'C':'D';
      ctx.fillStyle=val>=90?'#ffd700':val>=75?'#4caf50':'#ff9800';ctx.font='10px Georgia';
      ctx.fillText(grade,ox+j*(bw+8)+bw-12,oy+i*(bh+8)+14);
    }}

    ctx.fillStyle='#ef9a9a';ctx.font='11px Georgia';ctx.textAlign='center';
    ctx.fillText('⚠ Weakest: '+weakest.fin+' on '+weakest.str+' String ('+weakest.val+'%)',310,oy+4*(bh+8)+15);

    ctx.fillStyle='#81c784';ctx.font='10px Georgia';
    ctx.fillText('Click any cell to train (+5%)',310,370);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=620/rect.width,sy=380/rect.height;
    var x=(e.clientX-rect.left)*sx,y=(e.clientY-rect.top)*sy;
    var ox=130,oy=55,bw=100,bh=55;
    for(var i=0;i<fingers.length;i++){for(var j=0;j<strings.length;j++){
      var cx=ox+j*(bw+8),cy=oy+i*(bh+8);
      if(x>=cx&&x<=cx+bw&&y>=cy&&y<=cy+bh){
        var k=strings[j]+'_'+i;data[k]=Math.min(100,(data[k]||getVal(strings[j],i))+5);
        sp('v25_finger_data',data);sfx('finger_tap');draw();
        var tested=0;for(var m in data)tested++;
        if(tested>=16)unlockAch('finger_athlete','Finger Athlete');
        return;
      }
    }}
  });
  draw();document.body.appendChild(panel);return panel;
}

/* ═══════════════════════════════════════════════════════
   4. SHIFT ACCURACY TRACKER (시프트정확도추적기)
   Canvas 600x380 — Position shift accuracy scatter
   ═══════════════════════════════════════════════════════ */
function createShiftPanel(){
  var panel=mkPanel('v25-shift-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎯 시프트 정확도 추적기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='1st→3rd→5th→7th 포지션 이동 정확도';panel.appendChild(s);
  var cv=mkCanvas(600,380);panel.appendChild(cv);

  var positions=['1st→3rd','1st→5th','3rd→5th','3rd→7th','5th→7th','1st→7th'];
  var shiftData=lp('v25_shift_data')||positions.map(function(p){
    return{name:p,sessions:[]};
  });

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,600,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Position Shift Accuracy',300,24);

    var ox=70,oy=320,w=480,ht=250;
    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=1;
    for(var i=0;i<=5;i++){var y=oy-i*(ht/5);ctx.beginPath();ctx.moveTo(ox,y);ctx.lineTo(ox+w,y);ctx.stroke();
      ctx.fillStyle='#6a5a4a';ctx.font='10px Georgia';ctx.textAlign='right';ctx.fillText((i*20)+'%',ox-6,y+4);}

    var barW=60,gap=15;
    for(var i=0;i<positions.length;i++){
      var sd=shiftData[i]||{sessions:[]};
      var avg=sd.sessions.length>0?sd.sessions.reduce(function(a,b){return a+b;},0)/sd.sessions.length:50+Math.random()*30;
      var bx=ox+i*(barW+gap),bh=avg/100*ht;
      var gc=ctx.createLinearGradient(bx,oy-bh,bx,oy);
      gc.addColorStop(0,avg>=80?'#4caf50':avg>=60?'#ff9800':'#f44336');
      gc.addColorStop(1,'rgba(0,0,0,0.3)');
      ctx.fillStyle=gc;ctx.fillRect(bx,oy-bh,barW,bh);
      ctx.strokeStyle='#5a4a3a';ctx.strokeRect(bx,oy-bh,barW,bh);

      ctx.fillStyle='#fff';ctx.font='bold 12px Georgia';ctx.textAlign='center';
      ctx.fillText(Math.round(avg)+'%',bx+barW/2,oy-bh-8);
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';
      ctx.fillText(positions[i],bx+barW/2,oy+14);

      if(sd.sessions.length>1){
        ctx.strokeStyle='rgba(212,137,74,0.5)';ctx.lineWidth=1;ctx.beginPath();
        for(var j=0;j<Math.min(sd.sessions.length,5);j++){
          var dx=bx+5+j*(barW-10)/4,dy=oy-sd.sessions[sd.sessions.length-5+j]/100*ht;
          ctx.fillStyle='#D4894A';ctx.beginPath();ctx.arc(dx,dy,3,0,Math.PI*2);ctx.fill();
        }
      }
    }

    ctx.fillStyle='#81c784';ctx.font='10px Georgia';ctx.textAlign='center';
    ctx.fillText('Click a bar to practice shift (+random accuracy)',300,355);
    ctx.fillStyle='#6a5a4a';ctx.fillText('Target: 80%+ for all shifts',300,370);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=600/rect.width,sy=380/rect.height;
    var x=(e.clientX-rect.left)*sx,y=(e.clientY-rect.top)*sy;
    var ox=70,oy=320,barW=60,gap=15;
    for(var i=0;i<positions.length;i++){
      var bx=ox+i*(barW+gap);
      if(x>=bx&&x<=bx+barW&&y>=40&&y<=oy+20){
        var acc=60+Math.floor(Math.random()*35);
        if(!shiftData[i])shiftData[i]={name:positions[i],sessions:[]};
        shiftData[i].sessions.push(acc);
        if(shiftData[i].sessions.length>30)shiftData[i].sessions=shiftData[i].sessions.slice(-30);
        sp('v25_shift_data',shiftData);sfx(acc>=80?'shift_hit':'shift_miss');draw();
        var good=0;for(var j=0;j<shiftData.length;j++){
          var avg=shiftData[j].sessions.length>0?shiftData[j].sessions.reduce(function(a,b){return a+b;},0)/shiftData[j].sessions.length:0;
          if(avg>=80)good++;}
        if(good>=3)unlockAch('shift_navigator','Shift Navigator');
        return;
      }
    }
  });
  draw();document.body.appendChild(panel);return panel;
}

/* ═══════════════════════════════════════════════════════
   5. CONTACT POINT PRESSURE PROFILE (활접점압력프로필)
   Canvas 620x400 — Contact point vs pressure 2D heatmap
   ═══════════════════════════════════════════════════════ */
function createContactPanel(){
  var panel=mkPanel('v25-contact-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎨 활 접점 압력 프로필';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='접점(Sul Tasto→Bridge) × 압력 2D 히트맵';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var contactPts=['Sul Tasto','Near Tasto','Mid-Tasto','Center','Mid-Ponte','Near Ponte','Sul Ponte'];
  var pressureLvls=['pp','p','mp','mf','f','ff'];
  var toneData=lp('v25_contact_data')||{};
  var sweet={cp:3,pr:3};

  function getTone(cp,pr){return toneData[cp+'_'+pr]||Math.floor(Math.random()*60+20);}

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Contact Point × Pressure Profile',310,24);

    var ox=100,oy=55,cw=65,ch=42;
    ctx.font='10px Georgia';ctx.textAlign='center';ctx.fillStyle='#a08060';
    for(var j=0;j<contactPts.length;j++){
      ctx.save();ctx.translate(ox+j*(cw+3)+cw/2,oy-8);ctx.rotate(-0.3);
      ctx.fillText(contactPts[j],0,0);ctx.restore();
    }
    ctx.textAlign='right';
    for(var i=0;i<pressureLvls.length;i++)ctx.fillText(pressureLvls[i],ox-8,oy+i*(ch+3)+ch/2+4);

    var explored={};
    for(var i=0;i<pressureLvls.length;i++){for(var j=0;j<contactPts.length;j++){
      var val=getTone(j,i);
      var isSweet=(j===sweet.cp&&i===sweet.pr);
      var r=Math.floor(26+val*2.1),g=Math.floor(16+val*0.8),b=Math.floor(32+val*0.4);
      ctx.fillStyle='rgb('+r+','+g+','+b+')';
      if(isSweet)ctx.fillStyle='rgba(255,215,0,0.5)';
      ctx.fillRect(ox+j*(cw+3),oy+i*(ch+3),cw,ch);
      ctx.strokeStyle=isSweet?'#ffd700':'#3a2a1a';ctx.lineWidth=isSweet?2:1;
      ctx.strokeRect(ox+j*(cw+3),oy+i*(ch+3),cw,ch);

      if(val>0){ctx.fillStyle=val>70?'#ffd700':'#c9a96e';ctx.font='10px Georgia';ctx.textAlign='center';
        ctx.fillText(val+'%',ox+j*(cw+3)+cw/2,oy+i*(ch+3)+ch/2+4);}
      if(toneData[j+'_'+i])explored[j+'_'+i]=true;
    }}

    ctx.fillStyle='#ffd700';ctx.font='11px Georgia';ctx.textAlign='center';
    ctx.fillText('★ Sweet Spot: '+contactPts[sweet.cp]+' @ '+pressureLvls[sweet.pr],310,oy+6*(ch+3)+20);

    var toneName=['Flautando','Warm','Rich','Brilliant','Edgy','Glassy','Metallic'];
    ctx.fillStyle='#a08060';ctx.font='10px Georgia';
    ctx.fillText('Tone: '+toneName[sweet.cp],310,oy+6*(ch+3)+38);

    ctx.fillStyle='#81c784';ctx.font='10px Georgia';
    ctx.fillText('Click cells to explore tone colors',310,385);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=620/rect.width,sy=400/rect.height;
    var x=(e.clientX-rect.left)*sx,y=(e.clientY-rect.top)*sy;
    var ox=100,oy=55,cw=65,ch=42;
    for(var i=0;i<pressureLvls.length;i++){for(var j=0;j<contactPts.length;j++){
      var cx=ox+j*(cw+3),cy=oy+i*(ch+3);
      if(x>=cx&&x<=cx+cw&&y>=cy&&y<=cy+ch){
        toneData[j+'_'+i]=Math.min(100,(toneData[j+'_'+i]||getTone(j,i))+8);
        sp('v25_contact_data',toneData);sfx('contact_move');draw();
        var explored=0;for(var k in toneData)explored++;
        if(explored>=5)unlockAch('contact_master','Contact Point Master');
        return;
      }
    }}
  });
  draw();document.body.appendChild(panel);return panel;
}

/* ═══════════════════════════════════════════════════════
   6. PRACTICE GOAL CALENDAR (연습목표달성캘린더)
   Canvas 620x380 — Monthly goals with 8 categories
   ═══════════════════════════════════════════════════════ */
function createGoalPanel(){
  var panel=mkPanel('v25-goal-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='📅 연습 목표 달성 캘린더';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8카테고리 월간 목표 진행률 추적';panel.appendChild(s);
  var cv=mkCanvas(620,380);panel.appendChild(cv);

  var categories=['Technique','Theory','Repertoire','Ear Training','Rhythm','Expression','Sight-read','Performance'];
  var catColors=['#D4894A','#81c784','#ce93d8','#4fc3f7','#ef9a9a','#ffd740','#a5d6a7','#ba68c8'];
  var goals=lp('v25_goals')||categories.map(function(c){return{name:c,progress:Math.floor(Math.random()*60+10),target:100};});

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,380);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,620,380);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Monthly Practice Goals',310,24);

    var ox=30,oy=50,bw=260,bh=32;
    var completed=0;

    for(var i=0;i<categories.length;i++){
      var col=i<4?0:1,row=i%4;
      var x=ox+col*(bw+40),y=oy+row*(bh+14);
      var pct=goals[i].progress/goals[i].target;

      ctx.fillStyle='#2a1a10';ctx.fillRect(x,y,bw,bh);
      ctx.fillStyle=catColors[i];
      ctx.fillRect(x,y,bw*Math.min(1,pct),bh);
      ctx.strokeStyle='#5a4a3a';ctx.strokeRect(x,y,bw,bh);

      ctx.fillStyle='#fff';ctx.font='bold 10px Georgia';ctx.textAlign='left';
      ctx.fillText(categories[i],x+6,y+13);
      ctx.textAlign='right';ctx.font='10px Georgia';
      ctx.fillText(goals[i].progress+'/'+goals[i].target,x+bw-6,y+13);

      var pctNum=Math.round(pct*100);
      ctx.fillStyle=pctNum>=100?'#ffd700':'#c9a96e';ctx.font='bold 11px Georgia';ctx.textAlign='right';
      ctx.fillText(pctNum+'%',x+bw-6,y+bh-6);

      if(pctNum>=100){
        completed++;
        ctx.fillStyle='#ffd700';ctx.font='10px Georgia';ctx.textAlign='left';
        ctx.fillText('✓',x+bw-24,y+bh-6);
      }
    }

    var overallPct=goals.reduce(function(s,g){return s+g.progress;},0)/(goals.length*100);
    ctx.fillStyle='#D4894A';ctx.font='bold 14px Georgia';ctx.textAlign='center';
    var grade=overallPct>=0.9?'S':overallPct>=0.75?'A':overallPct>=0.6?'B':overallPct>=0.4?'C':'D';
    ctx.fillText('Overall: '+Math.round(overallPct*100)+'% ('+grade+')',310,oy+4*(bh+14)+20);
    ctx.fillStyle='#81c784';ctx.font='10px Georgia';
    ctx.fillText('Click category bars to add progress (+10)',310,365);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=620/rect.width,sy=380/rect.height;
    var x=(e.clientX-rect.left)*sx,y=(e.clientY-rect.top)*sy;
    var ox=30,oy=50,bw=260,bh=32;
    for(var i=0;i<categories.length;i++){
      var col=i<4?0:1,row=i%4;
      var cx=ox+col*(bw+40),cy=oy+row*(bh+14);
      if(x>=cx&&x<=cx+bw&&y>=cy&&y<=cy+bh){
        goals[i].progress=Math.min(goals[i].target,goals[i].progress+10);
        sp('v25_goals',goals);sfx(goals[i].progress>=100?'goal_complete':'goal_check');draw();
        var done=goals.filter(function(g){return g.progress>=g.target;}).length;
        if(done>=4)unlockAch('goal_achiever','Goal Achiever');
        return;
      }
    }
  });
  draw();document.body.appendChild(panel);return panel;
}

/* ═══════════════════════════════════════════════════════
   7. MUSICAL EMOTION EXPRESSION GUIDE (음악감정표현가이드)
   Canvas 600x380 — 10 emotions × 6 technique axes radar
   ═══════════════════════════════════════════════════════ */
function createEmotionPanel(){
  var panel=mkPanel('v25-emotion-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎭 음악 감정 표현 가이드';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='10감정 × 6테크닉축 Radar 표현법';panel.appendChild(s);
  var cv=mkCanvas(600,380);panel.appendChild(cv);

  var emotions=[
    {name:'Joy',color:'#ffd740',axes:[0.9,0.7,0.8,0.6,0.85,0.9],tip:'Bright tone, lively bow, wide vibrato'},
    {name:'Sorrow',color:'#5c6bc0',axes:[0.3,0.9,0.5,0.85,0.4,0.7],tip:'Slow bow, narrow vibrato, soft dynamics'},
    {name:'Anger',color:'#ef5350',axes:[0.95,0.4,0.95,0.3,0.9,0.5],tip:'Heavy pressure, fast bow, sul ponticello'},
    {name:'Peace',color:'#66bb6a',axes:[0.3,0.85,0.3,0.7,0.4,0.8],tip:'Sul tasto, steady bow, gentle vibrato'},
    {name:'Tension',color:'#ff7043',axes:[0.7,0.5,0.8,0.4,0.75,0.3],tip:'Tremolo, crescendo, near bridge'},
    {name:'Nostalgia',color:'#ab47bc',axes:[0.5,0.8,0.4,0.9,0.5,0.85],tip:'Portamento, rubato, warm tone'},
    {name:'Triumph',color:'#ffa726',axes:[0.95,0.6,0.9,0.5,0.95,0.7],tip:'Full bow, forte, broad strokes'},
    {name:'Mystery',color:'#78909c',axes:[0.4,0.6,0.5,0.6,0.3,0.5],tip:'Harmonics, pianissimo, sul tasto'},
    {name:'Love',color:'#e91e63',axes:[0.6,0.9,0.5,0.95,0.6,0.95],tip:'Cantabile, expressive vibrato, legato'},
    {name:'Humor',color:'#8bc34a',axes:[0.7,0.5,0.7,0.4,0.8,0.6],tip:'Staccato, pizzicato, varied articulation'}
  ];
  var axes=['Bow Speed','Bow Length','Pressure','Vibrato','Volume','Expression'];
  var selEmo=0;
  var explored=lp('v25_emotion_explored')||{};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,600,380);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,600,380);

    var em=emotions[selEmo];
    ctx.fillStyle=em.color;ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText(em.name,200,28);

    var cx=200,cy=190,r=120;
    for(var ring=5;ring>=1;ring--){
      ctx.beginPath();ctx.strokeStyle='rgba(58,42,26,0.5)';ctx.lineWidth=1;
      for(var i=0;i<=6;i++){
        var angle=-Math.PI/2+i*(Math.PI*2/6);
        var px=cx+Math.cos(angle)*r*ring/5,py=cy+Math.sin(angle)*r*ring/5;
        if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }ctx.stroke();
    }
    for(var i=0;i<6;i++){
      var angle=-Math.PI/2+i*(Math.PI*2/6);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);
      ctx.strokeStyle='#3a2a1a';ctx.stroke();
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='center';
      var lx=cx+Math.cos(angle)*(r+18),ly=cy+Math.sin(angle)*(r+18);
      ctx.fillText(axes[i],lx,ly);
    }

    ctx.beginPath();ctx.fillStyle=em.color.replace(')',',0.2)').replace('rgb','rgba');
    ctx.strokeStyle=em.color;ctx.lineWidth=2;
    for(var i=0;i<=6;i++){
      var idx=i%6,angle=-Math.PI/2+idx*(Math.PI*2/6);
      var px=cx+Math.cos(angle)*r*em.axes[idx],py=cy+Math.sin(angle)*r*em.axes[idx];
      if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }ctx.fill();ctx.stroke();

    ctx.fillStyle='#c9a96e';ctx.font='11px Georgia';ctx.textAlign='left';
    ctx.fillText('Tip: '+em.tip,20,350);

    var bx=420,by=40,bw=160,bh=28;
    for(var i=0;i<emotions.length;i++){
      ctx.fillStyle=i===selEmo?'rgba(212,137,74,0.3)':'rgba(30,20,10,0.5)';
      ctx.fillRect(bx,by+i*(bh+4),bw,bh);ctx.strokeStyle=emotions[i].color;ctx.lineWidth=1.5;
      ctx.strokeRect(bx,by+i*(bh+4),bw,bh);
      ctx.fillStyle=emotions[i].color;ctx.font='11px Georgia';ctx.textAlign='center';
      ctx.fillText(emotions[i].name,bx+bw/2,by+i*(bh+4)+bh/2+4);
    }
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=600/rect.width,sy=380/rect.height;
    var x=(e.clientX-rect.left)*sx,y=(e.clientY-rect.top)*sy;
    var bx=420,by=40,bw=160,bh=28;
    for(var i=0;i<emotions.length;i++){
      if(x>=bx&&x<=bx+bw&&y>=by+i*(bh+4)&&y<=by+i*(bh+4)+bh){
        selEmo=i;sfx('emotion_pick');draw();
        explored[emotions[i].name]=true;sp('v25_emotion_explored',explored);
        if(Object.keys(explored).length>=6)unlockAch('emotion_interpreter','Emotion Interpreter');
        return;
      }
    }
  });
  draw();document.body.appendChild(panel);return panel;
}

/* ═══════════════════════════════════════════════════════
   8. COMPREHENSIVE MASTERY DASHBOARD (종합마스터리대시보드)
   Canvas 620x400 — 8-axis radar + gauge + history
   ═══════════════════════════════════════════════════════ */
function createMasteryPanel(){
  var panel=mkPanel('v25-mastery-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🏆 종합 마스터리 대시보드';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8축 마스터리 Radar + 종합 등급 + 세션 히스토리';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var masAxes=['Intonation','Rhythm','Bowing','Vibrato','Sight-read','Theory','Expression','Repertoire'];
  var masData=lp('v25_mastery_data')||masAxes.map(function(){return 40+Math.floor(Math.random()*40);});
  var masHistory=lp('v25_mastery_hist')||[];

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('Comprehensive Mastery Dashboard',310,24);

    var cx=200,cy=210,r=130;
    for(var ring=5;ring>=1;ring--){
      ctx.beginPath();ctx.strokeStyle='rgba(58,42,26,0.4)';ctx.lineWidth=1;
      for(var i=0;i<=8;i++){
        var angle=-Math.PI/2+i*(Math.PI*2/8);
        var px=cx+Math.cos(angle)*r*ring/5,py=cy+Math.sin(angle)*r*ring/5;
        if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }ctx.stroke();
    }
    for(var i=0;i<8;i++){
      var angle=-Math.PI/2+i*(Math.PI*2/8);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);
      ctx.strokeStyle='#3a2a1a';ctx.stroke();
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='center';
      var lx=cx+Math.cos(angle)*(r+20),ly=cy+Math.sin(angle)*(r+20);
      ctx.fillText(masAxes[i],lx,ly);
    }

    ctx.beginPath();ctx.fillStyle='rgba(212,137,74,0.15)';ctx.strokeStyle='#D4894A';ctx.lineWidth=2;
    for(var i=0;i<=8;i++){
      var idx=i%8,angle=-Math.PI/2+idx*(Math.PI*2/8),val=masData[idx]/100;
      var px=cx+Math.cos(angle)*r*val,py=cy+Math.sin(angle)*r*val;
      if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }ctx.fill();ctx.stroke();
    for(var i=0;i<8;i++){
      var angle=-Math.PI/2+i*(Math.PI*2/8),val=masData[i]/100;
      var px=cx+Math.cos(angle)*r*val,py=cy+Math.sin(angle)*r*val;
      ctx.fillStyle='#D4894A';ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 9px Georgia';ctx.textAlign='center';
      ctx.fillText(masData[i],px,py-8);
    }

    var avg=Math.round(masData.reduce(function(a,b){return a+b;},0)/masData.length);
    var grade=avg>=90?'S':avg>=75?'A':avg>=60?'B':avg>=45?'C':'D';
    var gradeColors={S:'#ffd700',A:'#4caf50',B:'#2196f3',C:'#ff9800',D:'#f44336'};

    var gx=460,gy=60;
    ctx.fillStyle=gradeColors[grade];ctx.font='bold 48px Georgia';ctx.textAlign='center';
    ctx.fillText(grade,gx,gy+50);
    ctx.fillStyle='#D4894A';ctx.font='14px Georgia';
    ctx.fillText('Overall: '+avg+'%',gx,gy+75);

    var hx=400,hy=170,hw=190,hh=100;
    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.textAlign='center';
    ctx.fillText('Session History',hx+hw/2,hy-5);
    ctx.fillStyle='rgba(30,20,10,0.5)';ctx.fillRect(hx,hy,hw,hh);
    ctx.strokeStyle='#3a2a1a';ctx.strokeRect(hx,hy,hw,hh);

    if(masHistory.length>1){
      ctx.beginPath();ctx.strokeStyle='#D4894A';ctx.lineWidth=1.5;
      var step=hw/Math.max(1,masHistory.length-1);
      for(var i=0;i<masHistory.length;i++){
        var dx=hx+i*step,dy=hy+hh-masHistory[i]/100*hh;
        if(i===0)ctx.moveTo(dx,dy);else ctx.lineTo(dx,dy);
      }ctx.stroke();
    }

    for(var i=0;i<8;i++){
      var bx=410,by=290+i*13;
      ctx.fillStyle='#2a1a10';ctx.fillRect(bx,by,170,10);
      ctx.fillStyle=masData[i]>=80?'#4caf50':masData[i]>=60?'#ff9800':'#f44336';
      ctx.fillRect(bx,by,170*masData[i]/100,10);
      ctx.fillStyle='#c9a96e';ctx.font='8px Georgia';ctx.textAlign='left';
      ctx.fillText(masAxes[i]+': '+masData[i]+'%',bx+2,by+9);
    }

    ctx.fillStyle='#81c784';ctx.font='10px Georgia';ctx.textAlign='center';
    ctx.fillText('Click radar to recalculate random session',310,395);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=620/rect.width;
    var x=(e.clientX-rect.left)*sx;
    if(x<350){
      masData=masAxes.map(function(){return 40+Math.floor(Math.random()*50);});
      var avg=Math.round(masData.reduce(function(a,b){return a+b;},0)/masData.length);
      masHistory.push(avg);if(masHistory.length>20)masHistory=masHistory.slice(-20);
      sp('v25_mastery_data',masData);sp('v25_mastery_hist',masHistory);
      sfx('mastery_calc');draw();
      unlockAch('mastery_reviewer','Mastery Reviewer');
    }
  });
  draw();document.body.appendChild(panel);return panel;
}

/* ═══════════════════════════════════════════════════════
   9. QUIZ v25
   ═══════════════════════════════════════════════════════ */
function createQuizPanel(){
  var panel=mkPanel('v25-quiz-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🧠 Quiz v25';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='15문항 보잉곡선/스케일/운지/시프트/접점/목표/감정';panel.appendChild(s);
  var cv=mkCanvas(580,360);panel.appendChild(cv);

  var qIdx=0,qScore=0,answered=[];

  function renderQ(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,580,360);
    ctx.fillStyle='#1a1020';ctx.fillRect(0,0,580,360);

    if(qIdx>=V25_QUIZ.length){
      ctx.fillStyle='#D4894A';ctx.font='bold 18px Georgia';ctx.textAlign='center';
      ctx.fillText('Quiz Complete!',290,100);
      ctx.font='bold 24px Georgia';ctx.fillText(qScore+'/'+V25_QUIZ.length,290,150);
      var pct=Math.round(qScore/V25_QUIZ.length*100);
      ctx.fillStyle=pct>=80?'#ffd700':'#c9a96e';ctx.font='16px Georgia';
      ctx.fillText(pct+'%'+(pct>=80?' ★ Excellent':''),290,185);
      if(pct>=80)unlockAch('quiz_v25_master','Quiz v25 Master');
      return;
    }
    var q=V25_QUIZ[qIdx];
    ctx.fillStyle='#D4894A';ctx.font='bold 12px Georgia';ctx.textAlign='center';
    ctx.fillText('Q'+(qIdx+1)+'/'+V25_QUIZ.length+' (Score: '+qScore+')',290,25);
    ctx.fillStyle='#c9a96e';ctx.font='12px Georgia';
    var words=q.q.split('');var line='',lines=[],maxW=520;
    for(var i=0;i<words.length;i++){
      var test=line+words[i];
      if(ctx.measureText(test).width>maxW&&line.length>0){lines.push(line);line=words[i];}
      else line=test;
    }if(line)lines.push(line);
    for(var i=0;i<lines.length;i++)ctx.fillText(lines[i],290,60+i*18);

    var ay=120+lines.length*18;
    panel.querySelectorAll('.v25-quiz-btn').forEach(function(b){b.remove();});

    for(var i=0;i<q.a.length;i++){
      (function(idx){
        var btn=document.createElement('button');
        btn.className='v25-quiz-btn';
        btn.textContent=q.a[idx];
        btn.style.cssText='display:block;width:90%;max-width:500px;margin:6px auto;padding:10px;border-radius:8px;border:1px solid #5a4a3a;background:rgba(30,20,10,0.7);color:#c9a96e;font-size:13px;cursor:pointer;font-family:Georgia,serif;';
        btn.addEventListener('click',function(){
          if(answered[qIdx])return;answered[qIdx]=true;
          if(idx===q.c){qScore++;btn.style.background='#2e7d32';btn.style.color='#fff';sfx('quiz_v25');}
          else{btn.style.background='#c62828';btn.style.color='#fff';sfx('shift_miss');
            var btns=panel.querySelectorAll('.v25-quiz-btn');
            if(btns[q.c]){btns[q.c].style.background='#2e7d32';btns[q.c].style.color='#fff';}}
          setTimeout(function(){qIdx++;renderQ();},1200);
        });
        panel.appendChild(btn);
      })(i);
    }
  }
  renderQ();
  document.body.appendChild(panel);return panel;
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION + INIT
   ═══════════════════════════════════════════════════════ */
function addV25Nav(){
  var navTarget=document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){
    var allNav=document.querySelectorAll('div[style*="flex-wrap"]');
    if(allNav.length>0)navTarget=allNav[allNav.length-1];
  }
  if(!navTarget){navTarget=document.createElement('div');navTarget.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px;justify-content:center;';document.body.appendChild(navTarget);}

  var btns=[
    {label:'BowCurve',panel:'v25-bowcurve-panel',color:'#D4894A',key:'KeyE'},
    {label:'ScaleMap',panel:'v25-scalemap-panel',color:'#81c784',key:'KeyD'},
    {label:'Fingers',panel:'v25-finger-panel',color:'#ce93d8',key:'KeyF'},
    {label:'Shift',panel:'v25-shift-panel',color:'#4fc3f7',key:'KeyG'},
    {label:'Contact',panel:'v25-contact-panel',color:'#ef9a9a',key:'KeyC'},
    {label:'Goals',panel:'v25-goal-panel',color:'#ffd740',key:'KeyX'},
    {label:'Emotion',panel:'v25-emotion-panel',color:'#ba68c8',key:'KeyB'},
    {label:'Mastery',panel:'v25-mastery-panel',color:'#a5d6a7',key:'KeyN'},
    {label:'Quiz25',panel:'v25-quiz-panel',color:'#ff8a65',key:'Slash'}
  ];

  var opened=lp('v25_opened')||{};

  btns.forEach(function(b){
    var btn=document.createElement('button');
    btn.textContent=b.label;
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid '+b.color+';background:transparent;color:'+b.color+';cursor:pointer;font-size:0.72em;margin:2px;';
    btn.addEventListener('click',function(){
      var p=document.getElementById(b.panel);
      if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('bow_curve');
        opened[b.label]=true;sp('v25_opened',opened);
        if(Object.keys(opened).length>=5)unlockAch('v25_explorer','v25 Explorer');
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
        if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('bow_curve');
          opened[b.label]=true;sp('v25_opened',opened);
          if(Object.keys(opened).length>=5)unlockAch('v25_explorer','v25 Explorer');
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
    V25_SONGS.forEach(function(s){
      if(!window.SONG_DB.find(function(x){return x.id===s.id;}))window.SONG_DB.push(s);
    });
  }
  if(typeof window.LESSON_DB!=='undefined'&&Array.isArray(window.LESSON_DB)){
    V25_LESSONS.forEach(function(l){
      if(!window.LESSON_DB.find(function(x){return x.id===l.id;}))window.LESSON_DB.push(l);
    });
  }
  if(typeof window.ACH_DB!=='undefined'&&Array.isArray(window.ACH_DB)){
    V25_ACHS.forEach(function(a){
      if(!window.ACH_DB.find(function(x){return x.id===a.id;}))window.ACH_DB.push(a);
    });
  }
  unlockAch('song_224','Song Collector 224');
  var allAch=loadAch(),v25Ids=V25_ACHS.map(function(a){return a.id;});
  var allV25=v25Ids.every(function(id){return allAch[id];});
  if(allV25)unlockAch('v25_complete','v25 Complete');
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
function init(){
  createBowCurvePanel();
  createScaleMapPanel();
  createFingerPanel();
  createShiftPanel();
  createContactPanel();
  createGoalPanel();
  createEmotionPanel();
  createMasteryPanel();
  createQuizPanel();
  addV25Nav();
  registerData();
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
else{init();}

})();
