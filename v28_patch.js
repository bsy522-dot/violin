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
    case'dyn_scan':fr=370;dur=0.14;wave='triangle';break;
    case'dyn_optimal':fr=740;dur=0.22;wave='triangle';break;
    case'intv_tap':fr=494;dur=0.1;break;
    case'intv_master':fr=659;dur=0.18;wave='triangle';break;
    case'hist_select':fr=415;dur=0.12;break;
    case'hist_detail':fr=554;dur=0.16;wave='triangle';break;
    case'orch_play':fr=466;dur=0.2;wave='sine';break;
    case'orch_complete':fr=932;dur=0.25;wave='triangle';break;
    case'finger_tap':fr=349;dur=0.1;break;
    case'finger_analyze':fr=523;dur=0.18;wave='triangle';break;
    case'tone_check':fr=392;dur=0.1;break;
    case'tone_grade':fr=784;dur=0.2;wave='triangle';break;
    case'stage_eval':fr=440;dur=0.12;break;
    case'stage_improve':fr=587;dur=0.18;wave='triangle';break;
    case'dna_gauge':fr=523;dur=0.15;wave='triangle';break;
    case'achieve_v28':fr=880;dur=0.3;wave='triangle';break;
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
  {id:'s245',title:'The Four Seasons &quot;Spring&quot; 1st mvt',composer:'Vivaldi',difficulty:3,key:'E major',bpm:132,duration:'3:30',techniques:['trills','bariolage','echo-dynamics'],era:'Baroque'},
  {id:'s246',title:'Andante Cantabile',composer:'Tchaikovsky',difficulty:3,key:'D major',bpm:54,duration:'7:00',techniques:['cantabile','vibrato','espressivo'],era:'Romantic'},
  {id:'s247',title:'La Campanella (violin ver.)',composer:'Paganini',difficulty:5,key:'B minor',bpm:104,duration:'5:30',techniques:['harmonics','staccato','double-stop'],era:'Romantic'},
  {id:'s248',title:'Sch&ouml;n Rosmarin',composer:'Kreisler',difficulty:3,key:'G major',bpm:120,duration:'2:30',techniques:['grace-notes','portamento','charm'],era:'Romantic'},
  {id:'s249',title:'Carmen Fantasy',composer:'Sarasate',difficulty:5,key:'D minor',bpm:88,duration:'12:00',techniques:['left-hand-pizz','harmonics','double-stop'],era:'Romantic'},
  {id:'s250',title:'Partita No.2 Sarabande BWV 1004',composer:'J.S. Bach',difficulty:4,key:'D minor',bpm:56,duration:'4:30',techniques:['chords','legato','polyphony'],era:'Baroque'},
  {id:'s251',title:'Nimrod (violin arr.)',composer:'Elgar',difficulty:3,key:'E-flat major',bpm:52,duration:'4:00',techniques:['espressivo','legato','cantabile'],era:'Romantic'},
  {id:'s252',title:'Romanian Folk Dances',composer:'Bart&oacute;k',difficulty:3,key:'A major',bpm:100,duration:'6:00',techniques:['folk-style','snap-pizz','glissando'],era:'Modern'},
  {id:'s253',title:'Fantasia on Greensleeves',composer:'Vaughan Williams',difficulty:3,key:'A minor',bpm:60,duration:'5:30',techniques:['cantabile','legato','folk-melody'],era:'Modern'},
  {id:'s254',title:'Romantic Pieces Op.75',composer:'Dvo&rcaron;&aacute;k',difficulty:3,key:'D minor',bpm:66,duration:'14:00',techniques:['espressivo','cantabile','rubato'],era:'Romantic'}
];

/* ═══════════════════════════════════════════════════════
   DATA: 10 Lessons (l271-l280)
   ═══════════════════════════════════════════════════════ */
var V28_LESSONS=[
  {id:'l271',title:'Understanding Dynamics in Violin Playing',level:'intermediate',duration:'14min',topics:['dynamics','bow-pressure','expression','forte-piano']},
  {id:'l272',title:'Mastering Interval Jumps on Fingerboard',level:'intermediate',duration:'13min',topics:['intervals','intonation','finger-spacing','accuracy']},
  {id:'l273',title:'Music History for Violinists',level:'all',duration:'16min',topics:['history','baroque','classical','romantic','modern']},
  {id:'l274',title:'Orchestral Excerpt Preparation Tips',level:'advanced',duration:'15min',topics:['orchestra','excerpts','audition','preparation']},
  {id:'l275',title:'Fingerboard Geography: Knowing Every Note',level:'beginner',duration:'12min',topics:['fingerboard','positions','notes','mapping']},
  {id:'l276',title:'Tone Color: Exploring Your Sound Palette',level:'intermediate',duration:'14min',topics:['tone','color','contact-point','pressure','speed']},
  {id:'l277',title:'Stage Performance Psychology',level:'all',duration:'16min',topics:['performance','stage-fright','confidence','preparation']},
  {id:'l278',title:'Vivaldi Spring: Performance Guide',level:'intermediate',duration:'15min',topics:['repertoire','baroque','vivaldi','style','articulation']},
  {id:'l279',title:'Sarasate Carmen Fantasy: Technical Breakdown',level:'advanced',duration:'18min',topics:['repertoire','virtuoso','sarasate','technique']},
  {id:'l280',title:'v28 Comprehensive Review',level:'all',duration:'15min',topics:['dynamics','intervals','history','orchestra','fingerboard','tone','stage','dna']}
];

/* ═══════════════════════════════════════════════════════
   DATA: 15 Quiz (q271-q285)
   ═══════════════════════════════════════════════════════ */
var V28_QUIZ=[
  {q:'비발디 &quot;사계&quot; 중 &quot;봄&quot;의 조성은?',a:['D장조','E장조','G장조','A장조'],c:1},
  {q:'포르테(forte)에서 피아노(piano)로 부드럽게 전환하는 기법을 무엇이라 하는가?',a:['스포르찬도','크레셴도','디미누엔도','아첼레란도'],c:2},
  {q:'바이올린 지판에서 장3도 음정 간격은 몇 반음인가?',a:['2반음','3반음','4반음','5반음'],c:2},
  {q:'파가니니 &quot;라 캄파넬라&quot;에서 종소리 효과를 내는 기법은?',a:['더블스톱','하모닉스','콜레뇨','트레몰로'],c:1},
  {q:'크라이슬러의 작곡 특징이 아닌 것은?',a:['매력적 멜로디','짧은 소품 형식','우아한 포르타멘토','12음 기법 사용'],c:3},
  {q:'사라사테 &quot;카르멘 환상곡&quot;의 원작 오페라 작곡가는?',a:['베르디','푸치니','비제','바그너'],c:2},
  {q:'오케스트라 오디션에서 가장 중요한 첫인상은?',a:['악기 브랜드','첫 음의 음색과 피치','연주자 복장','대기실 태도'],c:1},
  {q:'바흐 사라반드(Sarabande)의 박자는?',a:['2/4박자','3/4박자','4/4박자','6/8박자'],c:1},
  {q:'바르톡 루마니안 폴크 댄스의 음악적 특징은?',a:['12음 기법','민속 선율과 변박','엄격한 소나타 형식','미니멀리즘'],c:1},
  {q:'바이올린의 접촉점(contact point)을 브릿지 쪽으로 옮기면 음색이 어떻게 변하는가?',a:['더 부드러워진다','더 밝고 날카로워진다','볼륨이 줄어든다','피치가 변한다'],c:1},
  {q:'무대 불안(Stage Fright)의 가장 효과적인 대처법은?',a:['연주 직전 연습','충분한 사전 리허설과 호흡법','카페인 섭취','관객 무시'],c:1},
  {q:'엘가 &quot;님로드&quot;의 원작은 어떤 장르인가?',a:['교향곡','변주곡 (수수께끼 변주곡)','현악 사중주','바이올린 협주곡'],c:1},
  {q:'본 윌리엄스 &quot;그린슬리브스 판타지아&quot;에 사용된 영국 민요의 박자는?',a:['2/4박자','3/4박자','4/4박자','5/4박자'],c:1},
  {q:'드보르작 &quot;로맨틱 소품&quot;은 몇 곡으로 구성되어 있는가?',a:['2곡','4곡','6곡','8곡'],c:1},
  {q:'바이올리니스트의 DNA 프로필에서 가장 근본적인 요소는?',a:['음정(Intonation)','의상','악기 가격','연주 경력'],c:0}
];

/* ═══════════════════════════════════════════════════════
   DATA: 12 Achievements
   ═══════════════════════════════════════════════════════ */
var V28_ACHS=[
  {id:'dynamics_explorer',name:'Dynamics Explorer',desc:'Explored all 6 dynamic levels in the analyzer'},
  {id:'interval_master',name:'Interval Master',desc:'Analyzed 10+ interval types on the fingerboard'},
  {id:'history_scholar',name:'History Scholar',desc:'Explored all 6 musical eras in the guide'},
  {id:'orch_auditioner',name:'Orchestra Auditioner',desc:'Practiced 5+ orchestral excerpts'},
  {id:'fingerboard_mapper',name:'Fingerboard Mapper',desc:'Mapped all 4 strings across 5+ positions'},
  {id:'tone_painter',name:'Tone Painter',desc:'Explored 6+ tone colors in the palette'},
  {id:'stage_ready',name:'Stage Ready',desc:'Completed stage readiness evaluation'},
  {id:'dna_profiled',name:'DNA Profiled',desc:'Generated your violinist DNA profile'},
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
   1. DYNAMICS RANGE ANALYZER (다이나믹 레인지 분석기)
   Canvas 620x400 — 6 dynamic levels pp~ff, bow pressure/speed/contact
   ═══════════════════════════════════════════════════════ */
function createDynamicsPanel(){
  var panel=mkPanel('v28-dynamics-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎵 다이나막 레인지 분석기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='6단계 pp~ff 활압력/속도/접촉점 최적 조합 · 클릭 전환';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var levels=['pp','p','mp','mf','f','ff'];
  var params=[
    {pressure:10,speed:80,contact:70},{pressure:25,speed:65,contact:60},
    {pressure:40,speed:55,contact:50},{pressure:55,speed:50,contact:45},
    {pressure:75,speed:40,contact:35},{pressure:90,speed:30,contact:25}
  ];
  var colors=['#4fc3f7','#81c784','#aed581','#ffd54f','#ff9800','#ef5350'];
  var sel=0,explored={};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('다이나막 레벨별 최적 활 파라미터',310,22);

    var bw=80,gap=14,startX=30;
    levels.forEach(function(lv,i){
      var x=startX+i*(bw+gap),y0=50;
      ctx.fillStyle=i===sel?'rgba(212,137,74,0.15)':'transparent';
      ctx.fillRect(x-4,y0-4,bw+8,320);

      var p=params[i];
      var items=[{label:'Pressure',val:p.pressure,color:'#ef5350'},{label:'Speed',val:p.speed,color:'#4fc3f7'},{label:'Contact',val:p.contact,color:'#81c784'}];
      items.forEach(function(it,j){
        var barH=it.val*2.5;
        ctx.fillStyle=it.color;ctx.globalAlpha=i===sel?1:0.6;
        ctx.fillRect(x+j*26,y0+250-barH,22,barH);
        ctx.globalAlpha=1;
        ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.textAlign='center';
        ctx.fillText(it.val+'%',x+j*26+11,y0+250-barH-4);
      });

      ctx.fillStyle=colors[i];ctx.font='bold 14px Georgia';ctx.textAlign='center';
      ctx.fillText(lv,x+bw/2,y0+280);
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';
      var descr=['속삭임, 내밀한','부드러운','중간 부드러운','중간 강한','강한','매우 강한'];
      ctx.fillText(descr[i],x+bw/2,y0+296);
    });

    ctx.fillStyle='#ef5350';ctx.fillRect(30,370,10,10);ctx.fillStyle='#ccc';ctx.font='10px Georgia';ctx.textAlign='left';ctx.fillText('Pressure (활압력)',44,380);
    ctx.fillStyle='#4fc3f7';ctx.fillRect(170,370,10,10);ctx.fillText('Speed (활속도)',184,380);
    ctx.fillStyle='#81c784';ctx.fillRect(300,370,10,10);ctx.fillText('Contact (접촉점)',314,380);

    var grade=sel<=1?'A':sel<=3?'B':sel<=4?'C':'S';
    var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':'#ff9800';
    ctx.fillStyle=gc;ctx.font='bold 16px Georgia';ctx.textAlign='right';
    ctx.fillText('표현난이도: '+grade,600,390);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=(e.clientX-rect.left)*(620/rect.width);
    var bw=80,gap=14,startX=30;
    for(var i=0;i<levels.length;i++){
      if(sx>=startX+i*(bw+gap)&&sx<=startX+i*(bw+gap)+bw){sel=i;explored[levels[i]]=true;break;}
    }
    draw();sfx('dyn_scan');
    if(Object.keys(explored).length>=6)unlockAch('dynamics_explorer','Dynamics Explorer');
  });

  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   2. INTERVAL MAP ANALYZER (음정간격 지판 분석기)
   Canvas 640x400 — 7 positions x 12 intervals heatmap
   ═══════════════════════════════════════════════════════ */
function createIntervalPanel(){
  var panel=mkPanel('v28-interval-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎼 음정간격 지판 분석기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='7포지션 × 12인터벌 난이도 히트맵 · 셀 호버 상세';panel.appendChild(s);
  var cv=mkCanvas(640,400);panel.appendChild(cv);

  var positions=['1st','2nd','3rd','4th','5th','6th','7th'];
  var intervals=['m2','M2','m3','M3','P4','A4/d5','P5','m6','M6','m7','M7','P8'];
  var diffData=[];
  for(var pi=0;pi<7;pi++){
    var row=[];
    for(var ii=0;ii<12;ii++){
      var base=20+pi*8+ii*5;
      row.push(Math.min(100,base+Math.floor((pi*ii*7)%30)));
    }
    diffData.push(row);
  }
  var hoverP=-1,hoverI=-1,explored=0;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('포지션별 음정 간격 난이도 매트릭스',320,22);

    var cellW=42,cellH=38,startX=70,startY=55;
    intervals.forEach(function(iv,i){
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(iv,startX+i*cellW+cellW/2,startY-6);
    });
    positions.forEach(function(pos,p){
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='right';
      ctx.fillText(pos,startX-8,startY+p*cellH+cellH/2+4);
      intervals.forEach(function(iv,i){
        var val=diffData[p][i];
        var r=Math.floor(val*2.55),g=Math.floor(255-val*2.55),b=50;
        ctx.fillStyle='rgb('+r+','+g+','+b+')';
        if(p===hoverP&&i===hoverI)ctx.fillStyle='rgba(212,137,74,0.8)';
        ctx.fillRect(startX+i*cellW,startY+p*cellH,cellW-2,cellH-2);
        ctx.fillStyle='#fff';ctx.font='9px Georgia';ctx.textAlign='center';
        ctx.fillText(val,startX+i*cellW+cellW/2-1,startY+p*cellH+cellH/2+3);
      });
    });

    if(hoverP>=0&&hoverI>=0){
      var val=diffData[hoverP][hoverI];
      var grade=val<30?'S':val<50?'A':val<70?'B':val<85?'C':'D';
      var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';
      ctx.fillStyle='rgba(26,16,32,0.9)';ctx.fillRect(360,340,260,50);
      ctx.fillStyle='#D4894A';ctx.font='11px Georgia';ctx.textAlign='left';
      ctx.fillText(positions[hoverP]+' pos · '+intervals[hoverI]+' interval',370,358);
      ctx.fillStyle=gc;ctx.font='bold 14px Georgia';
      ctx.fillText('난이도: '+val+'/100 ('+grade+')',370,380);
    }

    ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='left';
    ctx.fillText('낮음 ← 난이도 → 높음',30,380);
    var gw=120;
    for(var gi=0;gi<gw;gi++){
      var r=Math.floor(gi/gw*255),g=Math.floor(255-gi/gw*255);
      ctx.fillStyle='rgb('+r+','+g+',50)';ctx.fillRect(30+gi,385,1,10);
    }
  }

  cv.addEventListener('mousemove',function(e){
    var rect=cv.getBoundingClientRect(),mx=(e.clientX-rect.left)*(640/rect.width),my=(e.clientY-rect.top)*(400/rect.height);
    var cellW=42,cellH=38,startX=70,startY=55;
    var ni=Math.floor((mx-startX)/cellW),np=Math.floor((my-startY)/cellH);
    if(ni>=0&&ni<12&&np>=0&&np<7){hoverP=np;hoverI=ni;}else{hoverP=-1;hoverI=-1;}
    draw();
  });
  cv.addEventListener('click',function(){
    if(hoverP>=0&&hoverI>=0){explored++;sfx('intv_tap');
      if(explored>=10)unlockAch('interval_master','Interval Master');
    }
  });

  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   3. MUSIC ERA PERFORMANCE GUIDE (시대별 연주 표현법 가이드)
   Canvas 620x400 — 6 eras, 6-axis Radar
   ═══════════════════════════════════════════════════════ */
function createEraGuidePanel(){
  var panel=mkPanel('v28-eraguide-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎭 시대별 연주 표현법 가이드';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='Baroque~Contemporary 6시대 6축 Radar · 클릭 순환';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var eras=['Baroque','Classical','Romantic','Impressionist','Modern','Contemporary'];
  var axes=['Vibrato','Dynamics','Rubato','Ornaments','Bow Variety','Emotion'];
  var data=[
    [20,40,15,85,30,30],[40,55,25,50,45,40],[80,85,75,35,70,90],
    [60,65,80,25,80,75],[50,70,40,15,90,60],[70,80,65,20,85,70]
  ];
  var eraColors=['#ffd54f','#81c784','#ef5350','#4fc3f7','#ce93d8','#ff7043'];
  var sel=0,explored={};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    var cx=310,cy=200,R=140;

    for(var ring=1;ring<=5;ring++){
      ctx.beginPath();
      for(var a=0;a<6;a++){
        var angle=Math.PI*2*a/6-Math.PI/2;
        var rr=R*ring/5;
        if(a===0)ctx.moveTo(cx+rr*Math.cos(angle),cy+rr*Math.sin(angle));
        else ctx.lineTo(cx+rr*Math.cos(angle),cy+rr*Math.sin(angle));
      }
      ctx.closePath();ctx.strokeStyle='#3a2a1a';ctx.stroke();
    }

    axes.forEach(function(ax,i){
      var angle=Math.PI*2*i/6-Math.PI/2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+R*Math.cos(angle),cy+R*Math.sin(angle));
      ctx.strokeStyle='#3a2a1a';ctx.stroke();
      var tx=cx+(R+20)*Math.cos(angle),ty=cy+(R+20)*Math.sin(angle);
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';ctx.fillText(ax,tx,ty+4);
    });

    var d=data[sel];
    ctx.beginPath();
    d.forEach(function(v,i){
      var angle=Math.PI*2*i/6-Math.PI/2;
      var r=R*v/100;
      if(i===0)ctx.moveTo(cx+r*Math.cos(angle),cy+r*Math.sin(angle));
      else ctx.lineTo(cx+r*Math.cos(angle),cy+r*Math.sin(angle));
    });
    ctx.closePath();ctx.fillStyle=eraColors[sel]+'40';ctx.fill();
    ctx.strokeStyle=eraColors[sel];ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1;

    d.forEach(function(v,i){
      var angle=Math.PI*2*i/6-Math.PI/2;
      var r=R*v/100;
      ctx.beginPath();ctx.arc(cx+r*Math.cos(angle),cy+r*Math.sin(angle),4,0,Math.PI*2);
      ctx.fillStyle=eraColors[sel];ctx.fill();
    });

    ctx.fillStyle=eraColors[sel];ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText(eras[sel],310,30);

    var tips={
      Baroque:'비브라토 절제, 장식음 풍부, 단정한 활',
      Classical:'명확한 프레이징, 균형 잡힌 다이나막',
      Romantic:'풍부한 비브라토, 감정적 루바토',
      Impressionist:'색채적 음색, 유동적 테포',
      Modern:'다양한 활 기법, 새로운 음향',
      Contemporary:'확장 기법, 전자음향 융합'
    };
    ctx.fillStyle='#a08060';ctx.font='11px Georgia';
    ctx.fillText(tips[eras[sel]],310,385);
  }

  cv.addEventListener('click',function(){
    sel=(sel+1)%6;explored[eras[sel]]=true;draw();sfx('hist_select');
    if(Object.keys(explored).length>=6)unlockAch('history_scholar','History Scholar');
  });

  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   4. ORCHESTRAL EXCERPT TRAINER (오케스트라 발췌곡 트레이너)
   Canvas 620x400 — 10 excerpts, difficulty bar + tips
   ═══════════════════════════════════════════════════════ */
function createOrchExcerptPanel(){
  var panel=mkPanel('v28-orchexcerpt-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎻 오케스트라 발취곡 트레이너';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='10대 오디션 발취곡 · 난이도/중요도 · 클릭 연습 기록';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var excerpts=[
    {name:'Beethoven Sym.5 2nd Vn',diff:65,importance:90,tip:'정확한 리듬 패턴'},
    {name:'Brahms Sym.4 Passacaglia',diff:75,importance:85,tip:'음정+프레이징'},
    {name:'Mozart Sym.39 Trio',diff:50,importance:80,tip:'우아한 레가토'},
    {name:'Tchaikovsky Sym.6 1st',diff:80,importance:88,tip:'감정적 비브라토'},
    {name:'Strauss Don Juan Opening',diff:90,importance:95,tip:'완벽한 시작'},
    {name:'Schumann Sym.2 Scherzo',diff:70,importance:75,tip:'리듬 정확도'},
    {name:'Mendelssohn Midsummer',diff:85,importance:82,tip:'가벼운 스피카토'},
    {name:'Prokofiev Classical Sym',diff:78,importance:78,tip:'깨끗한 음정'},
    {name:'Debussy La Mer',diff:72,importance:70,tip:'색채적 음색'},
    {name:'Shostakovich Sym.5 3rd',diff:68,importance:86,tip:'긴 프레이징'}
  ];
  var practiced=lp('v28_orch_practiced')||{},sel=0;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('오디션 필수 발취곡 TOP 10',310,22);

    var barH=28,gap=6,startY=42;
    excerpts.forEach(function(ex,i){
      var y=startY+i*(barH+gap);
      ctx.fillStyle=i===sel?'rgba(212,137,74,0.15)':'transparent';
      ctx.fillRect(0,y-2,620,barH+4);

      ctx.fillStyle=i===sel?'#D4894A':'#a08060';ctx.font='10px Georgia';ctx.textAlign='left';
      ctx.fillText((i+1)+'. '+ex.name,10,y+18);

      var diffW=ex.diff*2.2;
      ctx.fillStyle='#ef5350';ctx.globalAlpha=0.7;ctx.fillRect(280,y+4,diffW,10);ctx.globalAlpha=1;
      ctx.fillStyle='#fff';ctx.font='8px Georgia';ctx.fillText(ex.diff,280+diffW+4,y+13);

      var impW=ex.importance*2.2;
      ctx.fillStyle='#4fc3f7';ctx.globalAlpha=0.7;ctx.fillRect(280,y+16,impW,10);ctx.globalAlpha=1;
      ctx.fillStyle='#fff';ctx.fillText(ex.importance,280+impW+4,y+25);

      if(practiced[ex.name]){
        ctx.fillStyle='#81c784';ctx.font='10px Georgia';ctx.fillText('✓',600,y+18);
      }
    });

    ctx.fillStyle='#ef5350';ctx.fillRect(280,378,10,10);ctx.fillStyle='#ccc';ctx.font='9px Georgia';ctx.textAlign='left';ctx.fillText('Difficulty',294,387);
    ctx.fillStyle='#4fc3f7';ctx.fillRect(370,378,10,10);ctx.fillText('Importance',384,387);

    if(sel>=0&&sel<excerpts.length){
      ctx.fillStyle='#D4894A';ctx.font='11px Georgia';ctx.textAlign='right';
      ctx.fillText('팀: '+excerpts[sel].tip,610,395);
    }
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),my=(e.clientY-rect.top)*(400/rect.height);
    var barH=28,gap=6,startY=42;
    for(var i=0;i<excerpts.length;i++){
      var y=startY+i*(barH+gap);
      if(my>=y&&my<=y+barH){
        sel=i;practiced[excerpts[i].name]=true;sp('v28_orch_practiced',practiced);
        sfx('orch_play');
        if(Object.keys(practiced).length>=5)unlockAch('orch_auditioner','Orchestra Auditioner');
        break;
      }
    }
    draw();
  });

  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   5. FINGERBOARD GEOGRAPHY MAP (지판 지리학 맵)
   Canvas 640x400 — 4 strings x 7 positions note mapping
   ═══════════════════════════════════════════════════════ */
function createFingerboardPanel(){
  var panel=mkPanel('v28-fingerboard-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🗺️ 지판 지리학 맵';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='4현 × 7포지션 전체 음 매핑 · 클릭 탐색';panel.appendChild(s);
  var cv=mkCanvas(640,400);panel.appendChild(cv);

  var strings=['G','D','A','E'];
  var stringColors=['#ef5350','#ff9800','#4fc3f7','#81c784'];
  var notes=[
    ['G','Ab','A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab','A','Bb'],
    ['D','Eb','E','F','F#','G','Ab','A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B','C','C#','D','Eb','E','F'],
    ['A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B','C'],
    ['E','F','F#','G','Ab','A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B','C','C#','D','Eb','E','F','F#','G']
  ];
  var posRanges=[{start:0,end:4},{start:1,end:5},{start:3,end:7},{start:5,end:9},{start:7,end:11},{start:9,end:13},{start:11,end:15}];
  var explored={},hoverS=-1,hoverN=-1;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('바이올린 지판 전체 음 매핑',320,22);

    var cellW=34,cellH=55,startX=80,startY=50;
    for(var p=0;p<7;p++){
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText((p+1)+'pos',startX+p*cellW*2+cellW,startY-8);
    }

    strings.forEach(function(str,si){
      ctx.fillStyle=stringColors[si];ctx.font='bold 12px Georgia';ctx.textAlign='right';
      ctx.fillText(str+'현',startX-10,startY+si*cellH+cellH/2+4);

      for(var p=0;p<7;p++){
        var ni=posRanges[p].start+1;
        for(var f=0;f<4;f++){
          var noteIdx=posRanges[p].start+f;
          if(noteIdx>=notes[si].length)continue;
          var x=startX+p*cellW*2+Math.floor(f*cellW/2);
          var y=startY+si*cellH;
          var isHover=si===hoverS&&noteIdx===hoverN;
          ctx.fillStyle=isHover?'rgba(212,137,74,0.8)':stringColors[si]+'40';
          ctx.fillRect(x,y,cellW/2-1,cellH-4);
          ctx.fillStyle=isHover?'#fff':'#ccc';ctx.font='8px Georgia';ctx.textAlign='center';
          ctx.fillText(notes[si][noteIdx],x+cellW/4,y+cellH/2);
        }
      }
    });

    var expCount=Object.keys(explored).length;
    ctx.fillStyle='#D4894A';ctx.font='11px Georgia';ctx.textAlign='center';
    ctx.fillText('탐색한 영역: '+expCount+' / 28',320,385);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),mx=(e.clientX-rect.left)*(640/rect.width),my=(e.clientY-rect.top)*(400/rect.height);
    var cellW=34,cellH=55,startX=80,startY=50;
    var si=Math.floor((my-startY)/cellH);
    var pi=Math.floor((mx-startX)/(cellW*2));
    if(si>=0&&si<4&&pi>=0&&pi<7){
      var key=strings[si]+'_'+pi;explored[key]=true;sp('v28_fb_explored',explored);sfx('finger_tap');
      var sCount=new Set(Object.keys(explored).map(function(k){return k.split('_')[0]})).size;
      var pCount=new Set(Object.keys(explored).map(function(k){return k.split('_')[1]})).size;
      if(sCount>=4&&pCount>=5)unlockAch('fingerboard_mapper','Fingerboard Mapper');
    }
    draw();
  });

  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   6. TONE COLOR PALETTE (음색 팔레트 탐험기)
   Canvas 620x400 — 8 tone colors, 6-axis Radar + description
   ═══════════════════════════════════════════════════════ */
function createToneColorPanel(){
  var panel=mkPanel('v28-tonecolor-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎨 음색 팔레트 탐험기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8종 음색 6축 Radar · 클릭 순환 · 표현 팁';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var tones=['Brillante','Dolce','Sul Tasto','Sul Ponticello','Con Sordino','Flautando','Espressivo','Martellato'];
  var toneColors=['#ffd54f','#ce93d8','#4fc3f7','#ef5350','#81c784','#4db6ac','#ff7043','#aed581'];
  var axes=['Brightness','Warmth','Projection','Softness','Clarity','Depth'];
  var data=[
    [95,30,90,10,85,40],[30,90,40,85,50,80],[20,80,25,90,30,85],
    [90,10,85,5,70,20],[25,70,20,80,45,75],[15,85,15,95,35,90],
    [70,75,80,40,65,70],[85,20,95,5,80,30]
  ];
  var tips=[
    '브릿지 가까이, 빠른 활, 강한 압력','느린 활, 많은 비브라토, 지판 가까이',
    '지판 위에서 느리게, 가벼운 압력','브릿지 아주 가까이, 유리적 음색',
    '약음기 사용, 부드러운 음색','하모닉스와 유사, 투명한 음색',
    '감정을 담은 자유로운 표현','마르텔레 활법, 강한 어택'
  ];
  var sel=0,explored={};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    var cx=310,cy=185,R=130;

    for(var ring=1;ring<=5;ring++){
      ctx.beginPath();
      for(var a=0;a<6;a++){
        var angle=Math.PI*2*a/6-Math.PI/2;
        var rr=R*ring/5;
        if(a===0)ctx.moveTo(cx+rr*Math.cos(angle),cy+rr*Math.sin(angle));
        else ctx.lineTo(cx+rr*Math.cos(angle),cy+rr*Math.sin(angle));
      }
      ctx.closePath();ctx.strokeStyle='#3a2a1a';ctx.stroke();
    }

    axes.forEach(function(ax,i){
      var angle=Math.PI*2*i/6-Math.PI/2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+R*Math.cos(angle),cy+R*Math.sin(angle));
      ctx.strokeStyle='#3a2a1a';ctx.stroke();
      var tx=cx+(R+18)*Math.cos(angle),ty=cy+(R+18)*Math.sin(angle);
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';ctx.fillText(ax,tx,ty+4);
    });

    var d=data[sel];
    ctx.beginPath();
    d.forEach(function(v,i){
      var angle=Math.PI*2*i/6-Math.PI/2;
      var r=R*v/100;
      if(i===0)ctx.moveTo(cx+r*Math.cos(angle),cy+r*Math.sin(angle));
      else ctx.lineTo(cx+r*Math.cos(angle),cy+r*Math.sin(angle));
    });
    ctx.closePath();ctx.fillStyle=toneColors[sel]+'40';ctx.fill();
    ctx.strokeStyle=toneColors[sel];ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1;

    d.forEach(function(v,i){
      var angle=Math.PI*2*i/6-Math.PI/2;
      var r=R*v/100;
      ctx.beginPath();ctx.arc(cx+r*Math.cos(angle),cy+r*Math.sin(angle),4,0,Math.PI*2);
      ctx.fillStyle=toneColors[sel];ctx.fill();
    });

    ctx.fillStyle=toneColors[sel];ctx.font='bold 14px Georgia';ctx.textAlign='center';
    ctx.fillText(tones[sel],310,28);
    ctx.fillStyle='#a08060';ctx.font='11px Georgia';
    ctx.fillText(tips[sel],310,370);

    var avg=Math.round(d.reduce(function(a,b){return a+b},0)/6);
    var grade=avg>=80?'S':avg>=65?'A':avg>=50?'B':avg>=35?'C':'D';
    var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';
    ctx.fillStyle=gc;ctx.font='bold 14px Georgia';ctx.textAlign='right';
    ctx.fillText('특징도: '+avg+'% ('+grade+')',600,390);
  }

  cv.addEventListener('click',function(){
    sel=(sel+1)%8;explored[tones[sel]]=true;draw();sfx('tone_check');
    if(Object.keys(explored).length>=6)unlockAch('tone_painter','Tone Painter');
  });

  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   7. STAGE READINESS EVALUATOR (무대 준비도 평가기)
   Canvas 620x400 — 8 dimensions bar chart + readiness gauge
   ═══════════════════════════════════════════════════════ */
function createStageReadyPanel(){
  var panel=mkPanel('v28-stageready-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎭 무대 준비도 평가기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8차원 준비도 · 클릭 점수 조정 · 종합 등급';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var dims=['기술 완성도','음악적 해석','암보 안정성','무대 경험','체력/지구력','멘탈 관리','리허설 횟수','의상/매너'];
  var colors=['#ef5350','#ff9800','#ffd54f','#81c784','#4fc3f7','#ce93d8','#4db6ac','#aed581'];
  var scores=[75,68,82,55,70,60,45,80];
  var evaluated=false;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('무대 준비도 종합 평가',310,22);

    var barW=55,gap=12,startX=30,maxH=250,startY=50;
    dims.forEach(function(d,i){
      var x=startX+i*(barW+gap);
      var h=scores[i]*maxH/100;
      ctx.fillStyle=colors[i];ctx.globalAlpha=0.8;
      ctx.fillRect(x,startY+maxH-h,barW,h);ctx.globalAlpha=1;
      ctx.fillStyle='#fff';ctx.font='bold 10px Georgia';ctx.textAlign='center';
      ctx.fillText(scores[i],x+barW/2,startY+maxH-h-6);
      ctx.save();ctx.translate(x+barW/2,startY+maxH+10);ctx.rotate(-Math.PI/4);
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='right';
      ctx.fillText(d,0,0);ctx.restore();
    });

    var avg=Math.round(scores.reduce(function(a,b){return a+b},0)/scores.length);
    var grade=avg>=85?'S':avg>=75?'A':avg>=65?'B':avg>=50?'C':'D';
    var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';

    var gaugeX=310,gaugeY=370,gaugeR=30;
    ctx.beginPath();ctx.arc(gaugeX,gaugeY,gaugeR,Math.PI,0);
    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=8;ctx.stroke();
    var angleRange=Math.PI;
    var fillAngle=Math.PI+angleRange*avg/100;
    ctx.beginPath();ctx.arc(gaugeX,gaugeY,gaugeR,Math.PI,fillAngle);
    ctx.strokeStyle=gc;ctx.lineWidth=8;ctx.stroke();ctx.lineWidth=1;

    ctx.fillStyle=gc;ctx.font='bold 16px Georgia';ctx.textAlign='center';
    ctx.fillText(grade,gaugeX,gaugeY-5);
    ctx.fillStyle='#a08060';ctx.font='10px Georgia';
    ctx.fillText('종합 '+avg+'%',gaugeX,gaugeY+14);

    ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='left';
    ctx.fillText('클릭으로 점수 조정 (±5)',30,395);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),mx=(e.clientX-rect.left)*(620/rect.width),my=(e.clientY-rect.top)*(400/rect.height);
    var barW=55,gap=12,startX=30,maxH=250,startY=50;
    for(var i=0;i<dims.length;i++){
      var x=startX+i*(barW+gap);
      if(mx>=x&&mx<=x+barW&&my>=startY&&my<=startY+maxH){
        scores[i]=Math.min(100,Math.max(0,scores[i]+(my<startY+maxH/2?5:-5)));
        evaluated=true;sfx('stage_eval');break;
      }
    }
    draw();
    if(evaluated)unlockAch('stage_ready','Stage Ready');
  });

  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   8. VIOLINIST DNA PROFILE (바이올리니스트 DNA 프로필)
   Canvas 620x400 — 8 KPI semi-circle gauges, weighted S~D
   ═══════════════════════════════════════════════════════ */
function createDNAPanel(){
  var panel=mkPanel('v28-dna-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🧬 바이올리니스트 DNA 프로필';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8KPI 반원게이지 4×2 · 가중 종합 S~D등급';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var kpis=[
    {name:'Intonation',name_kr:'음정',val:78,weight:0.18,color:'#ef5350'},
    {name:'Rhythm',name_kr:'리듬',val:72,weight:0.12,color:'#ff9800'},
    {name:'Bowing',name_kr:'보잉',val:80,weight:0.16,color:'#ffd54f'},
    {name:'Vibrato',name_kr:'비브라토',val:65,weight:0.12,color:'#81c784'},
    {name:'Sight-Read',name_kr:'초견',val:55,weight:0.10,color:'#4fc3f7'},
    {name:'Theory',name_kr:'이론',val:70,weight:0.10,color:'#ce93d8'},
    {name:'Expression',name_kr:'표현',val:75,weight:0.12,color:'#ff7043'},
    {name:'Repertoire',name_kr:'레퍼토리',val:68,weight:0.10,color:'#4db6ac'}
  ];

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);

    var cols=4,rows=2,gw=130,gh=130,padX=20,padY=50;
    kpis.forEach(function(kpi,i){
      var col=i%cols,row=Math.floor(i/cols);
      var cx=padX+col*(gw+15)+gw/2;
      var cy=padY+row*(gh+30)+gh/2;
      var R=45;

      ctx.beginPath();ctx.arc(cx,cy,R,Math.PI,0);
      ctx.strokeStyle='#3a2a1a';ctx.lineWidth=10;ctx.stroke();
      var fillAngle=Math.PI+Math.PI*kpi.val/100;
      ctx.beginPath();ctx.arc(cx,cy,R,Math.PI,fillAngle);
      ctx.strokeStyle=kpi.color;ctx.lineWidth=10;ctx.stroke();ctx.lineWidth=1;

      ctx.fillStyle=kpi.color;ctx.font='bold 16px Georgia';ctx.textAlign='center';
      ctx.fillText(kpi.val,cx,cy-8);
      ctx.fillStyle='#D4894A';ctx.font='10px Georgia';
      ctx.fillText(kpi.name_kr,cx,cy+8);
      ctx.fillStyle='#a08060';ctx.font='8px Georgia';
      ctx.fillText(kpi.name,cx,cy+20);
    });

    var weighted=0;
    kpis.forEach(function(k){weighted+=k.val*k.weight;});
    weighted=Math.round(weighted);
    var grade=weighted>=85?'S':weighted>=75?'A':weighted>=65?'B':weighted>=50?'C':'D';
    var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';

    ctx.fillStyle=gc;ctx.font='bold 22px Georgia';ctx.textAlign='center';
    ctx.fillText(grade,310,370);
    ctx.fillStyle='#a08060';ctx.font='11px Georgia';
    ctx.fillText('종합 DNA 점수: '+weighted+'/100 (가중평균)',310,390);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),mx=(e.clientX-rect.left)*(620/rect.width),my=(e.clientY-rect.top)*(400/rect.height);
    var cols=4,gw=130,gh=130,padX=20,padY=50;
    kpis.forEach(function(kpi,i){
      var col=i%cols,row=Math.floor(i/cols);
      var cx=padX+col*(gw+15)+gw/2;
      var cy=padY+row*(gh+30)+gh/2;
      var dx=mx-cx,dy=my-cy;
      if(Math.sqrt(dx*dx+dy*dy)<50){
        kpi.val=Math.min(100,Math.max(0,kpi.val+(my<cy?3:-3)));
        sfx('dna_gauge');
      }
    });
    draw();
    unlockAch('dna_profiled','DNA Profiled');
  });

  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   9. QUIZ PANEL
   ═══════════════════════════════════════════════════════ */
function createQuizPanel(){
  var panel=mkPanel('v28-quiz-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='📝 v28 퀴즈 (15문)';panel.appendChild(h);
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
        if(ai===q.c){ab.style.background='#2e7d32';ab.style.color='#fff';correct++;sfx('intv_master');}
        else{ab.style.background='#c62828';ab.style.color='#fff';sfx('dyn_scan');
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
  var navTarget=document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){
    var allNav=document.querySelectorAll('div[style*="flex-wrap"]');
    if(allNav.length>0)navTarget=allNav[allNav.length-1];
  }
  if(!navTarget){navTarget=document.createElement('div');navTarget.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px;justify-content:center;';document.body.appendChild(navTarget);}

  var btns=[
    {label:'DynRng',panel:'v28-dynamics-panel',color:'#ef5350',key:'KeyA'},
    {label:'IntvMap',panel:'v28-interval-panel',color:'#4fc3f7',key:'KeyS'},
    {label:'EraGd',panel:'v28-eraguide-panel',color:'#ce93d8',key:'KeyD'},
    {label:'OrchEx',panel:'v28-orchexcerpt-panel',color:'#ffd54f',key:'KeyF'},
    {label:'FBMap',panel:'v28-fingerboard-panel',color:'#81c784',key:'KeyG'},
    {label:'TonClr',panel:'v28-tonecolor-panel',color:'#ff7043',key:'KeyH'},
    {label:'StgRdy',panel:'v28-stageready-panel',color:'#4db6ac',key:'KeyJ'},
    {label:'DNA',panel:'v28-dna-panel',color:'#aed581',key:'KeyK'},
    {label:'Quiz28',panel:'v28-quiz-panel',color:'#D4894A',key:'Digit0'}
  ];

  var opened=lp('v28_opened')||{};

  btns.forEach(function(b){
    var btn=document.createElement('button');
    btn.textContent=b.label;
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid '+b.color+';background:transparent;color:'+b.color+';cursor:pointer;font-size:0.72em;margin:2px;';
    btn.addEventListener('click',function(){
      var p=document.getElementById(b.panel);
      if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('dyn_scan');
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
        if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('dyn_scan');
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
  createDynamicsPanel();
  createIntervalPanel();
  createEraGuidePanel();
  createOrchExcerptPanel();
  createFingerboardPanel();
  createToneColorPanel();
  createStageReadyPanel();
  createDNAPanel();
  createQuizPanel();
  addV28Nav();
  registerData();
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
else{init();}

})();
