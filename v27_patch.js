(function V27Patch(){
'use strict';
if(window.__V27_LOADED)return;
window.__V27_LOADED=true;

/* ─── helpers ─── */
function lp(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
function sp(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function loadAch(){return lp('violin_achievements')||{}}
function unlockAch(id,name){
  var a=loadAch();if(a[id])return;a[id]={name:name,date:new Date().toISOString()};
  sp('violin_achievements',a);sfx('achieve_v27');
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
    case'bow_dist':fr=349;dur=0.14;wave='triangle';break;
    case'bow_optimal_v27':fr=698;dur=0.22;wave='triangle';break;
    case'scale_tap':fr=523;dur=0.1;break;
    case'scale_record':fr=659;dur=0.18;wave='triangle';break;
    case'era_select':fr=440;dur=0.12;break;
    case'era_detail':fr=587;dur=0.16;wave='triangle';break;
    case'tune_ping':fr=440;dur=0.2;wave='sine';break;
    case'tune_lock':fr=880;dur=0.25;wave='triangle';break;
    case'ens_part':fr=392;dur=0.1;break;
    case'ens_analyze':fr=523;dur=0.18;wave='triangle';break;
    case'plog_check':fr=330;dur=0.1;break;
    case'plog_streak':fr=784;dur=0.2;wave='triangle';break;
    case'tech_compare':fr=494;dur=0.12;break;
    case'tech_improve':fr=659;dur=0.18;wave='triangle';break;
    case'perf_gauge':fr=440;dur=0.15;wave='triangle';break;
    case'achieve_v27':fr=880;dur=0.3;wave='triangle';break;
    default:fr=440;dur=0.1;
  }
  o.type=wave;o.frequency.setValueAtTime(fr,t);
  g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t);o.stop(t+dur);
}

/* ═══════════════════════════════════════════════════════
   DATA: 10 Songs (s235-s244)
   ═══════════════════════════════════════════════════════ */
var V27_SONGS=[
  {id:'s235',title:'Partita No.2 Chaconne',composer:'J.S. Bach',difficulty:5,key:'D minor',bpm:66,duration:'14:00',techniques:['chords','arpeggios','polyphony'],era:'Baroque'},
  {id:'s236',title:'Violin Sonata No.9 &quot;Kreutzer&quot; 1st mvt',composer:'Beethoven',difficulty:5,key:'A major',bpm:96,duration:'14:30',techniques:['double-stop','sforzando','cadenza'],era:'Classical'},
  {id:'s237',title:'Tzigane',composer:'Ravel',difficulty:5,key:'D major',bpm:80,duration:'10:00',techniques:['harmonics','left-hand-pizz','glissando'],era:'Impressionist'},
  {id:'s238',title:'Violin Concerto 1st mvt',composer:'Brahms',difficulty:5,key:'D major',bpm:104,duration:'22:00',techniques:['octaves','cantabile','double-stop'],era:'Romantic'},
  {id:'s239',title:'Introduction and Rondo Capriccioso',composer:'Saint-Sa&euml;ns',difficulty:4,key:'A minor',bpm:92,duration:'9:00',techniques:['spiccato','staccato','arpeggios'],era:'Romantic'},
  {id:'s240',title:'The Lark Ascending',composer:'Vaughan Williams',difficulty:4,key:'D major',bpm:60,duration:'14:30',techniques:['espressivo','cadenza','harmonics'],era:'Modern'},
  {id:'s241',title:'Caprice No.24',composer:'Paganini',difficulty:5,key:'A minor',bpm:76,duration:'5:00',techniques:['ricochet','left-hand-pizz','double-stop'],era:'Romantic'},
  {id:'s242',title:'Violin Concerto No.3 1st mvt',composer:'Mozart',difficulty:3,key:'G major',bpm:128,duration:'10:00',techniques:['legato','trills','cadenza'],era:'Classical'},
  {id:'s243',title:'Poème Op.25',composer:'Chausson',difficulty:4,key:'E-flat major',bpm:52,duration:'16:00',techniques:['vibrato','espressivo','portamento'],era:'Romantic'},
  {id:'s244',title:'Violin Concerto No.1 1st mvt',composer:'Shostakovich',difficulty:5,key:'A minor',bpm:72,duration:'16:00',techniques:['passacaglia','cadenza','col-legno'],era:'Modern'}
];

/* ═══════════════════════════════════════════════════════
   DATA: 10 Lessons (l261-l270)
   ═══════════════════════════════════════════════════════ */
var V27_LESSONS=[
  {id:'l261',title:'Bow Distribution for Different Genres',level:'intermediate',duration:'14min',topics:['bow-control','distribution','genre-awareness']},
  {id:'l262',title:'Scale Speed and Accuracy Training',level:'intermediate',duration:'13min',topics:['scales','speed','metronome','accuracy']},
  {id:'l263',title:'Navigating Musical Eras on Violin',level:'all',duration:'16min',topics:['baroque','classical','romantic','modern','style']},
  {id:'l264',title:'Perfect Tuning with Open Strings',level:'beginner',duration:'10min',topics:['tuning','intonation','open-strings','resonance']},
  {id:'l265',title:'Playing in Ensemble: Listening Skills',level:'intermediate',duration:'15min',topics:['ensemble','chamber','listening','blend']},
  {id:'l266',title:'Building a Practice Log Habit',level:'beginner',duration:'12min',topics:['practice','logging','habit','consistency']},
  {id:'l267',title:'Comparing Technique Milestones',level:'intermediate',duration:'14min',topics:['technique','progress','self-assessment','milestones']},
  {id:'l268',title:'Bach Chaconne: A Comprehensive Guide',level:'advanced',duration:'20min',topics:['repertoire','baroque','bach','chords','polyphony']},
  {id:'l269',title:'Paganini Caprice 24: Variations Breakdown',level:'advanced',duration:'18min',topics:['repertoire','virtuoso','paganini','variations']},
  {id:'l270',title:'v27 Comprehensive Review',level:'all',duration:'15min',topics:['bow-distribution','scales','eras','tuning','ensemble','practice-log','technique','performance']}
];

/* ═══════════════════════════════════════════════════════
   DATA: 15 Quiz (q256-q270)
   ═══════════════════════════════════════════════════════ */
var V27_QUIZ=[
  {q:'바흐 샤콘느(Chaconne)가 속한 파르티타 번호는?',a:['파르티타 1번','파르티타 2번','파르티타 3번','소나타 2번'],c:1},
  {q:'활의 상활(up-bow)과 하활(down-bow) 비율이 곡 유형에 따라 달라지는 이유는?',a:['활의 무게가 변해서','프레이징과 악센트 방향 때문','현의 장력 변화','조율이 달라져서'],c:1},
  {q:'12개 장조 스케일을 완벽히 연주하려면 최소 몇 포지션이 필요한가?',a:['1포지션','3포지션','5포지션','7포지션'],c:2},
  {q:'바로크 시대 바이올린 연주의 특징이 아닌 것은?',a:['비브라토 절제','짧은 활 스트로크','두꺼운 폴 친레스트 사용','구트 현 사용'],c:2},
  {q:'표준 A현의 조율 주파수는?',a:['415Hz','432Hz','440Hz','442Hz'],c:2},
  {q:'오케스트라에서 제1바이올린과 제2바이올린의 주요 차이는?',a:['악기 크기','현의 수','멜로디 vs 화성 역할','활의 길이'],c:2},
  {q:'효과적인 연습 로그에 반드시 포함해야 할 항목은?',a:['연습 곡명만','시간, 목표, 성취도','악기 브랜드','연습실 온도'],c:1},
  {q:'파가니니 카프리체 24번의 형식은?',a:['소나타','론도','주제와 변주','푸가'],c:2},
  {q:'레가토에서 포르테로 전환 시 활의 어느 요소를 조절하는가?',a:['활의 속도와 압력','활의 색상','활의 길이','현의 번호'],c:0},
  {q:'라벨 &quot;치간&quot;(Tzigane)의 영감이 된 음악 전통은?',a:['일본 전통음악','로마(집시) 음악','아프리카 리듬','중국 민속음악'],c:1},
  {q:'브람스 바이올린 협주곡의 조성은?',a:['A장조','D장조','E단조','G단조'],c:1},
  {q:'앙상블에서 &quot;블렌딩&quot;을 위해 가장 중요한 기술은?',a:['최대 볼륨 연주','다른 파트 경청과 음량 조절','솔로처럼 연주','템포 무시'],c:1},
  {q:'연습 시간 대비 효율이 가장 높은 세션 길이는?',a:['15-20분 집중 후 휴식','3시간 연속','5분씩 자주','하루 종일'],c:0},
  {q:'모차르트 바이올린 협주곡은 총 몇 곡인가?',a:['3곡','5곡','7곡','9곡'],c:1},
  {q:'본 세르비스(Vaughan Williams) &quot;종달새의 비상&quot;이 묘사하는 것은?',a:['폭풍우','새의 비행','바다','산 정상'],c:1}
];

/* ═══════════════════════════════════════════════════════
   DATA: 12 Achievements
   ═══════════════════════════════════════════════════════ */
var V27_ACHS=[
  {id:'bow_distributor',name:'Bow Distributor',desc:'Analyzed bow distribution for 5+ genre types'},
  {id:'scale_speedster',name:'Scale Speedster',desc:'Recorded speed for 8+ scales'},
  {id:'era_explorer',name:'Era Explorer',desc:'Explored repertoire across 4+ musical eras'},
  {id:'tuning_master',name:'Tuning Master',desc:'Achieved green-zone tuning on all 4 strings'},
  {id:'ensemble_listener',name:'Ensemble Listener',desc:'Analyzed all 4 ensemble parts'},
  {id:'practice_logger',name:'Practice Logger',desc:'Logged 7 consecutive practice days'},
  {id:'technique_analyst',name:'Technique Analyst',desc:'Compared 6+ technique dimensions'},
  {id:'performance_ace',name:'Performance Ace',desc:'Achieved S-rank in 5+ performance KPIs'},
  {id:'quiz_v27_master',name:'Quiz v27 Master',desc:'Scored 80%+ on v27 quiz'},
  {id:'song_244',name:'Song Collector 244',desc:'244 songs in the library'},
  {id:'v27_explorer',name:'v27 Explorer',desc:'Explored 5+ v27 features'},
  {id:'v27_complete',name:'v27 Complete',desc:'Completed all v27 achievements'}
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
   1. BOW DISTRIBUTION OPTIMIZER (활분배비율최적화기)
   Canvas 620x400 — 7 genre types, up/mid/lower bow ratio
   ═══════════════════════════════════════════════════════ */
function createBowDistPanel(){
  var panel=mkPanel('v27-bowdist-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎻 활분배비율 최적화기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='7곡유형별 상활/중활/하활 최적 비율 · S~D등급';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var genres=['Baroque','Classical','Romantic','Impressionist','Modern','Concerto','Chamber'];
  var optimal=[
    {up:35,mid:40,low:25},{up:30,mid:45,low:25},{up:25,mid:35,low:40},
    {up:40,mid:35,low:25},{up:30,mid:30,low:40},{up:20,mid:35,low:45},
    {up:35,mid:40,low:25}
  ];
  var colors={up:'#4fc3f7',mid:'#81c784',low:'#ff7043'};
  var sel=0,explored={};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('곡 유형별 활 분배 최적 비율',310,22);

    var bw=65,gap=10,startX=30;
    genres.forEach(function(g,i){
      var x=startX+i*(bw+gap),y0=60,barH=280;
      var o=optimal[i];
      ctx.fillStyle=i===sel?'rgba(212,137,74,0.15)':'transparent';
      ctx.fillRect(x-2,y0-5,bw+4,barH+30);
      var hUp=barH*o.up/100, hMid=barH*o.mid/100, hLow=barH*o.low/100;
      ctx.fillStyle=colors.up;ctx.fillRect(x,y0,bw,hUp);
      ctx.fillStyle=colors.mid;ctx.fillRect(x,y0+hUp,bw,hMid);
      ctx.fillStyle=colors.low;ctx.fillRect(x,y0+hUp+hMid,bw,hLow);
      ctx.fillStyle='#fff';ctx.font='10px Georgia';ctx.textAlign='center';
      if(hUp>14)ctx.fillText(o.up+'%',x+bw/2,y0+hUp/2+4);
      if(hMid>14)ctx.fillText(o.mid+'%',x+bw/2,y0+hUp+hMid/2+4);
      if(hLow>14)ctx.fillText(o.low+'%',x+bw/2,y0+hUp+hMid+hLow/2+4);
      ctx.fillStyle=i===sel?'#D4894A':'#a08060';ctx.font='9px Georgia';
      ctx.fillText(g,x+bw/2,y0+barH+14);
    });

    ctx.fillStyle=colors.up;ctx.fillRect(30,370,12,12);ctx.fillStyle='#ccc';ctx.font='10px Georgia';ctx.textAlign='left';ctx.fillText('상활 (Up-bow)',46,381);
    ctx.fillStyle=colors.mid;ctx.fillRect(150,370,12,12);ctx.fillText('중활 (Mid)',166,381);
    ctx.fillStyle=colors.low;ctx.fillRect(260,370,12,12);ctx.fillText('하활 (Lower)',276,381);

    var o=optimal[sel];
    var bal=Math.abs(o.up-33)+Math.abs(o.mid-33)+Math.abs(o.low-34);
    var grade=bal<10?'S':bal<20?'A':bal<30?'B':bal<40?'C':'D';
    var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';
    ctx.fillStyle=gc;ctx.font='bold 18px Georgia';ctx.textAlign='right';
    ctx.fillText(grade,600,385);
    ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.fillText(genres[sel]+' 특화도',600,398);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,scaleX=620/rect.width;
    var x=sx*scaleX,bw=65,gap=10,startX=30;
    for(var i=0;i<genres.length;i++){
      var bx=startX+i*(bw+gap);
      if(x>=bx&&x<=bx+bw){sel=i;sfx('bow_dist');explored[genres[i]]=true;
        if(Object.keys(explored).length>=5)unlockAch('bow_distributor','Bow Distributor');
        draw();break;}
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   2. SCALE SPEED DIAGNOSTIC (음계속도진단기)
   Canvas 620x400 — 12 scales BPM + accuracy dual bars
   ═══════════════════════════════════════════════════════ */
function createScaleSpeedPanel(){
  var panel=mkPanel('v27-scalespeed-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎼 음계속도 진단기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='12스케일 BPM + 정확도 듀얼바 · 탭으로 BPM 기록';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var scales=['C장','G장','D장','A장','E장','F장','A단','E단','D단','B단','F#단','C#단'];
  var stored=lp('v27_scale_speeds')||{};
  var tapTimes=[],tapScale=0,recorded=0;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('12스케일 속도 진단 (탭으로 BPM 기록)',310,22);

    var bw=38,gap=6,startX=32,maxBPM=200;
    scales.forEach(function(sc,i){
      var x=startX+i*(bw+gap),y0=45,barH=280;
      var data=stored[sc]||{bpm:0,acc:0};
      var hBpm=barH*(data.bpm/maxBPM),hAcc=barH*(data.acc/100);
      ctx.fillStyle='rgba(79,195,247,0.7)';ctx.fillRect(x,y0+barH-hBpm,bw/2-1,hBpm);
      ctx.fillStyle='rgba(129,199,132,0.7)';ctx.fillRect(x+bw/2+1,y0+barH-hAcc,bw/2-1,hAcc);
      ctx.fillStyle=i===tapScale?'#D4894A':'#a08060';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText(sc,x+bw/2,y0+barH+14);
      if(data.bpm>0){ctx.fillStyle='#4fc3f7';ctx.font='8px Georgia';ctx.fillText(data.bpm,x+bw/4,y0+barH-hBpm-4);}
      if(data.acc>0){ctx.fillStyle='#81c784';ctx.fillText(data.acc+'%',x+3*bw/4,y0+barH-hAcc-4);}
    });

    ctx.fillStyle='#4fc3f7';ctx.fillRect(30,365,10,10);ctx.fillStyle='#ccc';ctx.font='10px Georgia';ctx.textAlign='left';ctx.fillText('BPM',44,375);
    ctx.fillStyle='#81c784';ctx.fillRect(100,365,10,10);ctx.fillText('정확도',114,375);
    ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
    ctx.fillText('◀ 탭으로 BPM 측정 (4탭 기준) ▶  |  스케일 클릭으로 선택',310,395);
    ctx.fillStyle='#D4894A';ctx.font='bold 11px Georgia';ctx.fillText('▶ '+scales[tapScale]+' 선택중  (탭탭탭탭 입력)',310,352);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var bw=38,gap=6,startX=32;
    for(var i=0;i<scales.length;i++){
      var bx=startX+i*(bw+gap);
      if(x>=bx&&x<=bx+bw&&y>320){tapScale=i;tapTimes=[];sfx('scale_tap');draw();return;}
    }
    var now=performance.now();tapTimes.push(now);sfx('scale_tap');
    if(tapTimes.length>=5){
      var intervals=[];for(var j=1;j<tapTimes.length;j++)intervals.push(tapTimes[j]-tapTimes[j-1]);
      var avg=intervals.reduce(function(a,b){return a+b},0)/intervals.length;
      var bpm=Math.round(60000/avg);
      var variance=intervals.reduce(function(a,b){return a+Math.abs(b-avg)},0)/intervals.length;
      var acc=Math.max(0,Math.min(100,Math.round(100-variance/avg*100)));
      stored[scales[tapScale]]={bpm:Math.min(bpm,200),acc:acc};
      sp('v27_scale_speeds',stored);sfx('scale_record');
      recorded++;if(recorded>=8)unlockAch('scale_speedster','Scale Speedster');
      tapTimes=[];draw();
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   3. REPERTOIRE ERA EXPLORER (레퍼토리시대별탐험기)
   Canvas 640x400 — 6 eras treemap with song counts
   ═══════════════════════════════════════════════════════ */
function createEraExplorerPanel(){
  var panel=mkPanel('v27-eraexplorer-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎶 레퍼토리 시대별 탐험기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='Baroque~Modern 6시대 트리맵 · 대표작곡가 + 특징';panel.appendChild(s);
  var cv=mkCanvas(640,400);panel.appendChild(cv);

  var eras=[
    {name:'Baroque',period:'1600-1750',composers:['Bach','Vivaldi','Corelli','Handel'],count:28,color:'#8d6e63',traits:'비브라토 절제, 구트현, 통주저음'},
    {name:'Classical',period:'1750-1820',composers:['Mozart','Haydn','Beethoven'],count:22,color:'#7986cb',traits:'균형미, 명확한 프레이징, 소나타'},
    {name:'Romantic',period:'1820-1900',composers:['Mendelssohn','Brahms','Tchaikovsky','Wieniawski'],count:95,color:'#ef5350',traits:'풍부한 비브라토, 감정표현, 비르투오소'},
    {name:'Impressionist',period:'1880-1930',composers:['Debussy','Ravel','Fauré'],count:18,color:'#4db6ac',traits:'음색 탐구, 자유로운 구조, 하모닉스'},
    {name:'Modern',period:'1900-1975',composers:['Prokofiev','Shostakovich','Bartók','Stravinsky'],count:42,color:'#ab47bc',traits:'불협화음, 복잡 리듬, 확장 기법'},
    {name:'Contemporary',period:'1975-현재',composers:['Glass','Pärt','Salonen','Adams'],count:15,color:'#26a69a',traits:'미니멀리즘, 전자음악, 실험적'}
  ];
  var sel=0,explored={};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('시대별 레퍼토리 분포',320,22);

    var total=eras.reduce(function(a,e){return a+e.count},0);
    var cols=3,rows=2,padX=15,padY=40,gapX=8,gapY=8;
    var cellW=(640-2*padX-(cols-1)*gapX)/cols;
    var cellH=(320-gapY)/rows;

    eras.forEach(function(era,i){
      var col=i%cols,row=Math.floor(i/cols);
      var x=padX+col*(cellW+gapX),y=padY+row*(cellH+gapY);
      var ratio=era.count/total;
      ctx.fillStyle=i===sel?era.color:era.color+'88';
      ctx.fillRect(x,y,cellW,cellH);
      ctx.strokeStyle=i===sel?'#D4894A':'#3a2a1a';ctx.lineWidth=i===sel?2:1;ctx.strokeRect(x,y,cellW,cellH);
      ctx.fillStyle='#fff';ctx.font='bold 12px Georgia';ctx.textAlign='center';
      ctx.fillText(era.name,x+cellW/2,y+20);
      ctx.fillStyle='#ddd';ctx.font='10px Georgia';
      ctx.fillText(era.period,x+cellW/2,y+36);
      ctx.fillText(era.count+'곡 ('+(ratio*100).toFixed(0)+'%)',x+cellW/2,y+52);
      ctx.fillStyle='#ccc';ctx.font='9px Georgia';
      ctx.fillText(era.composers.slice(0,3).join(', '),x+cellW/2,y+68);
    });

    var e=eras[sel];
    ctx.fillStyle='#1e1228';ctx.fillRect(15,310,610,80);ctx.strokeStyle='#3a2a1a';ctx.strokeRect(15,310,610,80);
    ctx.fillStyle=e.color;ctx.font='bold 13px Georgia';ctx.textAlign='left';
    ctx.fillText(e.name+' ('+e.period+')',25,330);
    ctx.fillStyle='#ccc';ctx.font='11px Georgia';
    ctx.fillText('대표 작곡가: '+e.composers.join(', '),25,350);
    ctx.fillText('특징: '+e.traits,25,368);
    ctx.fillText('수록곡: '+e.count+'곡',25,386);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=640/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var cols=3,padX=15,padY=40,gapX=8,gapY=8;
    var cellW=(640-2*padX-(cols-1)*gapX)/cols;
    var cellH=(320-gapY)/2;
    for(var i=0;i<eras.length;i++){
      var col=i%cols,row=Math.floor(i/cols);
      var bx=padX+col*(cellW+gapX),by=padY+row*(cellH+gapY);
      if(x>=bx&&x<=bx+cellW&&y>=by&&y<=by+cellH){
        sel=i;sfx('era_select');explored[eras[i].name]=true;
        if(Object.keys(explored).length>=4)unlockAch('era_explorer','Era Explorer');
        draw();break;
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   4. TUNING REFERENCE TOOL (조율레퍼런스도구)
   Canvas 620x400 — 4 strings frequency spectrum + pitch gauge
   ═══════════════════════════════════════════════════════ */
function createTuningPanel(){
  var panel=mkPanel('v27-tuning-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎵 조율 레퍼런스 도구';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='4현 기준주파수 + 피치편차 게이지 · 클릭으로 기준음 재생';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var strings=[
    {name:'G',freq:196,color:'#ef5350',range:[190,202]},
    {name:'D',freq:293.66,color:'#ff9800',range:[287,300]},
    {name:'A',freq:440,color:'#4fc3f7',range:[434,446]},
    {name:'E',freq:659.26,color:'#81c784',range:[652,666]}
  ];
  var sel=2,playing=false,allTuned={};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('바이올린 4현 조율 레퍼런스',310,22);

    strings.forEach(function(st,i){
      var x=40+i*150,y=50,w=120,h=200;
      ctx.fillStyle=i===sel?'rgba(212,137,74,0.12)':'rgba(30,20,40,0.5)';
      ctx.fillRect(x,y,w,h);ctx.strokeStyle=i===sel?st.color:'#3a2a1a';ctx.lineWidth=i===sel?2:1;ctx.strokeRect(x,y,w,h);

      ctx.fillStyle=st.color;ctx.font='bold 24px Georgia';ctx.textAlign='center';
      ctx.fillText(st.name+'현',x+w/2,y+35);
      ctx.fillStyle='#ddd';ctx.font='14px Georgia';
      ctx.fillText(st.freq.toFixed(1)+' Hz',x+w/2,y+60);

      var gaugeY=y+80,gaugeH=100,gw=60;
      ctx.fillStyle='#1a0a20';ctx.fillRect(x+w/2-gw/2,gaugeY,gw,gaugeH);
      var zones=[{pct:15,c:'#ef5350'},{pct:20,c:'#ff9800'},{pct:30,c:'#81c784'},{pct:20,c:'#ff9800'},{pct:15,c:'#ef5350'}];
      var yOff=0;
      zones.forEach(function(z){var zh=gaugeH*z.pct/100;ctx.fillStyle=z.c+'44';ctx.fillRect(x+w/2-gw/2,gaugeY+yOff,gw,zh);yOff+=zh;});

      var cOff=(st.freq-st.freq)/st.freq;
      var needleY=gaugeY+gaugeH/2-cOff*gaugeH;
      ctx.strokeStyle=st.color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w/2-gw/2-5,needleY);ctx.lineTo(x+w/2+gw/2+5,needleY);ctx.stroke();

      ctx.fillStyle='#a08060';ctx.font='10px Georgia';
      ctx.fillText(st.range[0]+'-'+st.range[1]+' Hz',x+w/2,y+195);
      if(allTuned[st.name]){ctx.fillStyle='#81c784';ctx.font='bold 11px Georgia';ctx.fillText('✓ Tuned',x+w/2,y+210);}
    });

    ctx.fillStyle='#a08060';ctx.font='11px Georgia';ctx.textAlign='center';
    ctx.fillText('클릭하면 선택한 현의 기준음을 재생합니다 (Web Audio)',310,290);

    var refData=[
      {label:'A=440 Hz',desc:'현대 표준'},
      {label:'A=442 Hz',desc:'유럽 오케스트라'},
      {label:'A=415 Hz',desc:'바로크 피치'},
      {label:'A=432 Hz',desc:'커즈니소프 피치'}
    ];
    refData.forEach(function(r,i){
      ctx.fillStyle='#D4894A';ctx.font='10px Georgia';ctx.textAlign='left';
      ctx.fillText(r.label,40+i*150,320);
      ctx.fillStyle='#a08060';ctx.fillText(r.desc,40+i*150,335);
    });

    ctx.fillStyle='#1e1228';ctx.fillRect(15,350,590,40);
    ctx.fillStyle='#ddd';ctx.font='11px Georgia';ctx.textAlign='center';
    var st=strings[sel];
    ctx.fillText(st.name+'현: '+st.freq.toFixed(2)+' Hz | 범위: '+st.range[0]+'-'+st.range[1]+' Hz | 클릭으로 재생',310,375);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left;
    var scaleX=620/rect.width;var x=sx*scaleX;
    for(var i=0;i<4;i++){
      var bx=40+i*150;
      if(x>=bx&&x<=bx+120){
        sel=i;sfx('tune_ping');
        var ac=getACtx();if(ac){
          var osc=ac.createOscillator(),gn=ac.createGain();osc.connect(gn);gn.connect(ac.destination);
          osc.frequency.setValueAtTime(strings[i].freq,ac.currentTime);osc.type='sine';
          gn.gain.setValueAtTime(0.12,ac.currentTime);gn.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+1.5);
          osc.start();osc.stop(ac.currentTime+1.5);
        }
        allTuned[strings[i].name]=true;
        if(Object.keys(allTuned).length>=4)unlockAch('tuning_master','Tuning Master');
        draw();break;
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   5. ENSEMBLE PART AWARENESS (앙상블파트인식기)
   Canvas 620x400 — 4 parts (Vn1/Vn2/Va/Vc) 6-axis Radar
   ═══════════════════════════════════════════════════════ */
function createEnsemblePanel(){
  var panel=mkPanel('v27-ensemble-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎶 앙상블 파트 인식기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='Vn1/Vn2/Va/Vc 4파트 6축 Radar · 역할 분석';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var parts=[
    {name:'Violin I',abbr:'Vn1',color:'#ef5350',skills:{melody:90,harmony:40,rhythm:70,dynamics:85,blend:60,leadership:95}},
    {name:'Violin II',abbr:'Vn2',color:'#4fc3f7',skills:{melody:50,harmony:85,rhythm:75,dynamics:70,blend:90,leadership:30}},
    {name:'Viola',abbr:'Va',color:'#ab47bc',skills:{melody:35,harmony:90,rhythm:80,dynamics:65,blend:95,leadership:20}},
    {name:'Cello',abbr:'Vc',color:'#81c784',skills:{melody:60,harmony:70,rhythm:90,dynamics:75,blend:80,leadership:50}}
  ];
  var axes=['Melody','Harmony','Rhythm','Dynamics','Blend','Leadership'];
  var sel=0,explored={};

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('앙상블 파트별 역할 분석',310,22);

    var cx=240,cy=210,r=130;
    for(var ring=1;ring<=5;ring++){
      ctx.strokeStyle='#3a2a1a';ctx.lineWidth=0.5;ctx.beginPath();
      for(var j=0;j<6;j++){
        var ang=-Math.PI/2+j*Math.PI*2/6;
        var px=cx+Math.cos(ang)*r*ring/5,py=cy+Math.sin(ang)*r*ring/5;
        if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }ctx.closePath();ctx.stroke();
    }
    axes.forEach(function(ax,j){
      var ang=-Math.PI/2+j*Math.PI*2/6;
      ctx.strokeStyle='#3a2a1a';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r);ctx.stroke();
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(ax,cx+Math.cos(ang)*(r+18),cy+Math.sin(ang)*(r+18)+4);
    });

    var p=parts[sel];
    ctx.beginPath();ctx.fillStyle=p.color+'33';ctx.strokeStyle=p.color;ctx.lineWidth=2;
    var vals=[p.skills.melody,p.skills.harmony,p.skills.rhythm,p.skills.dynamics,p.skills.blend,p.skills.leadership];
    vals.forEach(function(v,j){
      var ang=-Math.PI/2+j*Math.PI*2/6;
      var px=cx+Math.cos(ang)*r*v/100,py=cy+Math.sin(ang)*r*v/100;
      if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    });
    ctx.closePath();ctx.fill();ctx.stroke();

    parts.forEach(function(pt,i){
      var bx=460,by=60+i*80;
      ctx.fillStyle=i===sel?'rgba(212,137,74,0.12)':'transparent';ctx.fillRect(bx,by,150,65);
      ctx.strokeStyle=i===sel?pt.color:'#3a2a1a';ctx.strokeRect(bx,by,150,65);
      ctx.fillStyle=pt.color;ctx.font='bold 12px Georgia';ctx.textAlign='left';
      ctx.fillText(pt.name,bx+8,by+20);
      ctx.fillStyle='#ccc';ctx.font='10px Georgia';
      var topSkill='';var topVal=0;
      Object.keys(pt.skills).forEach(function(k){if(pt.skills[k]>topVal){topVal=pt.skills[k];topSkill=k;}});
      ctx.fillText('강점: '+topSkill+' ('+topVal+')',bx+8,by+38);
      var avg=Math.round(Object.values(pt.skills).reduce(function(a,b){return a+b},0)/6);
      ctx.fillText('평균: '+avg,bx+8,by+54);
    });
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    for(var i=0;i<4;i++){
      var bx=460,by=60+i*80;
      if(x>=bx&&x<=bx+150&&y>=by&&y<=by+65){
        sel=i;sfx('ens_part');explored[parts[i].abbr]=true;
        if(Object.keys(explored).length>=4)unlockAch('ensemble_listener','Ensemble Listener');
        draw();break;
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   6. PRACTICE LOG ANALYZER (연습로그분석기)
   Canvas 620x400 — 7 days x 8 categories heatmap + streak
   ═══════════════════════════════════════════════════════ */
function createPracticeLogPanel(){
  var panel=mkPanel('v27-practicelog-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='📊 연습로그 분석기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='7일×8카테고리 히트맵 · 클릭으로 연습 기록';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var days=['월','화','수','목','금','토','일'];
  var cats=['Scales','Etudes','Repertoire','Sight-Read','Technique','Theory','Ear Train','Expression'];
  var stored=lp('v27_practice_log')||{};
  var streak=0;

  function calcStreak(){
    var s=0;
    for(var d=6;d>=0;d--){
      var key='day_'+d;var dayData=stored[key]||{};
      var hasAny=Object.values(dayData).some(function(v){return v>0;});
      if(hasAny)s++;else break;
    }
    return s;
  }

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('주간 연습 로그 히트맵',310,22);

    var startX=100,startY=55,cellW=65,cellH=32,gap=3;
    days.forEach(function(d,i){
      ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='center';
      ctx.fillText(d,startX+i*(cellW+gap)+cellW/2,startY-8);
    });
    cats.forEach(function(c,j){
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';ctx.textAlign='right';
      ctx.fillText(c,startX-8,startY+j*(cellH+gap)+cellH/2+4);
    });

    for(var d=0;d<7;d++){
      var dayKey='day_'+d;var dayData=stored[dayKey]||{};
      for(var c=0;c<8;c++){
        var x=startX+d*(cellW+gap),y=startY+c*(cellH+gap);
        var val=dayData[cats[c]]||0;
        var intensity=Math.min(val/60,1);
        var r=Math.round(26+intensity*100),g2=Math.round(16+intensity*150),b=Math.round(48+intensity*50);
        ctx.fillStyle='rgb('+r+','+g2+','+b+')';
        ctx.fillRect(x,y,cellW,cellH);
        ctx.strokeStyle='#3a2a1a';ctx.strokeRect(x,y,cellW,cellH);
        if(val>0){ctx.fillStyle='#fff';ctx.font='10px Georgia';ctx.textAlign='center';ctx.fillText(val+'m',x+cellW/2,y+cellH/2+4);}
      }
    }

    streak=calcStreak();
    ctx.fillStyle='#1e1228';ctx.fillRect(15,340,590,50);
    ctx.fillStyle='#D4894A';ctx.font='bold 12px Georgia';ctx.textAlign='left';
    ctx.fillText('연속 연습: '+streak+'일',25,362);
    ctx.fillStyle='#a08060';ctx.font='10px Georgia';
    ctx.fillText('셀 클릭: +15분 추가 | 우클릭: 초기화',25,380);
    if(streak>=7){ctx.fillStyle='#81c784';ctx.font='bold 11px Georgia';ctx.textAlign='right';ctx.fillText('★ 7일 연속 달성!',600,362);}
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var startX=100,startY=55,cellW=65,cellH=32,gap=3;
    for(var d=0;d<7;d++){
      for(var c=0;c<8;c++){
        var bx=startX+d*(cellW+gap),by=startY+c*(cellH+gap);
        if(x>=bx&&x<=bx+cellW&&y>=by&&y<=by+cellH){
          var dayKey='day_'+d;if(!stored[dayKey])stored[dayKey]={};
          stored[dayKey][cats[c]]=(stored[dayKey][cats[c]]||0)+15;
          sp('v27_practice_log',stored);sfx('plog_check');
          streak=calcStreak();if(streak>=7)unlockAch('practice_logger','Practice Logger');
          draw();return;
        }
      }
    }
  });

  cv.addEventListener('contextmenu',function(e){
    e.preventDefault();
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var startX=100,startY=55,cellW=65,cellH=32,gap=3;
    for(var d=0;d<7;d++){
      for(var c=0;c<8;c++){
        var bx=startX+d*(cellW+gap),by=startY+c*(cellH+gap);
        if(x>=bx&&x<=bx+cellW&&y>=by&&y<=by+cellH){
          var dayKey='day_'+d;if(stored[dayKey])stored[dayKey][cats[c]]=0;
          sp('v27_practice_log',stored);draw();return;
        }
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   7. TECHNIQUE COMPARISON DIAGNOSTIC (테크닉비교진단기)
   Canvas 620x400 — 8 techniques current vs target dual bar
   ═══════════════════════════════════════════════════════ */
function createTechComparePanel(){
  var panel=mkPanel('v27-techcompare-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🎯 테크닉 비교 진단기';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8테크닉 현재 vs 목표 듀얼바 · 클릭으로 점수 조정';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var techs=['Intonation','Vibrato','Bowing','Shifting','Double Stop','Spiccato','Legato','Dynamics'];
  var targets=[90,85,88,80,75,82,90,85];
  var stored=lp('v27_tech_scores')||[60,50,55,45,35,40,65,55];
  var compared=0;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('테크닉 현재 수준 vs 목표',310,22);

    var bw=28,gap=8,startX=70,barH=260,y0=50;
    techs.forEach(function(t,i){
      var x=startX+i*(2*bw+gap+12);
      var hCur=barH*stored[i]/100,hTgt=barH*targets[i]/100;
      ctx.fillStyle='#4fc3f7';ctx.fillRect(x,y0+barH-hCur,bw,hCur);
      ctx.fillStyle='#ff9800';ctx.fillRect(x+bw+2,y0+barH-hTgt,bw,hTgt);
      ctx.fillStyle='#4fc3f7';ctx.font='8px Georgia';ctx.textAlign='center';
      ctx.fillText(stored[i],x+bw/2,y0+barH-hCur-4);
      ctx.fillStyle='#ff9800';ctx.fillText(targets[i],x+bw+2+bw/2,y0+barH-hTgt-4);
      ctx.fillStyle='#a08060';ctx.font='9px Georgia';
      ctx.save();ctx.translate(x+bw+1,y0+barH+8);ctx.rotate(Math.PI/6);ctx.textAlign='left';ctx.fillText(t,0,0);ctx.restore();

      var diff=stored[i]-targets[i];
      var gc=diff>=0?'#81c784':diff>=-20?'#ff9800':'#ef5350';
      ctx.fillStyle=gc;ctx.font='8px Georgia';ctx.textAlign='center';
      ctx.fillText((diff>=0?'+':'')+diff,x+bw+1,y0+barH+28);
    });

    ctx.fillStyle='#4fc3f7';ctx.fillRect(30,370,10,10);ctx.fillStyle='#ccc';ctx.font='10px Georgia';ctx.textAlign='left';ctx.fillText('현재',44,380);
    ctx.fillStyle='#ff9800';ctx.fillRect(100,370,10,10);ctx.fillText('목표',114,380);
    ctx.fillStyle='#a08060';ctx.font='10px Georgia';ctx.textAlign='right';ctx.fillText('클릭: 현재 점수 +5',600,380);

    var avg=Math.round(stored.reduce(function(a,b){return a+b},0)/8);
    var grade=avg>=85?'S':avg>=70?'A':avg>=55?'B':avg>=40?'C':'D';
    var gc2=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';
    ctx.fillStyle=gc2;ctx.font='bold 16px Georgia';ctx.textAlign='center';ctx.fillText('종합: '+grade+' ('+avg+')',310,395);
  }

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=620/rect.width,scaleY=400/rect.height;
    var x=sx*scaleX,y=sy*scaleY;
    var bw=28,gap=8,startX=70;
    for(var i=0;i<8;i++){
      var bx=startX+i*(2*bw+gap+12);
      if(x>=bx&&x<=bx+2*bw+2&&y>=50&&y<=310){
        stored[i]=Math.min(100,stored[i]+5);
        sp('v27_tech_scores',stored);sfx('tech_compare');
        compared++;if(compared>=6)unlockAch('technique_analyst','Technique Analyst');
        draw();return;
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   8. COMPREHENSIVE PERFORMANCE DASHBOARD (종합연주역량대시보드)
   Canvas 620x400 — 8 KPI semicircle gauges 4x2
   ═══════════════════════════════════════════════════════ */
function createPerfDashPanel(){
  var panel=mkPanel('v27-perfdash-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='🏆 종합 연주역량 대시보드';panel.appendChild(h);
  var s=document.createElement('div');s.style.cssText=SUB;s.textContent='8KPI 반원게이지 4×2 · 가중종합 S~D등급';panel.appendChild(s);
  var cv=mkCanvas(620,400);panel.appendChild(cv);

  var kpis=[
    {name:'Intonation',val:72,weight:0.15,color:'#ef5350'},
    {name:'Rhythm',val:78,weight:0.12,color:'#4fc3f7'},
    {name:'Bowing',val:68,weight:0.15,color:'#81c784'},
    {name:'Vibrato',val:65,weight:0.10,color:'#ab47bc'},
    {name:'Sight-Read',val:55,weight:0.10,color:'#ffd54f'},
    {name:'Theory',val:70,weight:0.08,color:'#ff7043'},
    {name:'Expression',val:60,weight:0.15,color:'#ce93d8'},
    {name:'Repertoire',val:75,weight:0.15,color:'#4db6ac'}
  ];
  var sCount=0;

  function draw(){
    var ctx=cv.getContext('2d');ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#2a1a30';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#D4894A';ctx.font='bold 13px Georgia';ctx.textAlign='center';
    ctx.fillText('8대 연주 역량 지표',310,20);

    var cols=4,rows=2,gw=130,gh=140,padX=22,padY=38,gapX=10,gapY=10;
    sCount=0;
    kpis.forEach(function(kpi,i){
      var col=i%cols,row=Math.floor(i/cols);
      var cx=padX+col*(gw+gapX)+gw/2,cy=padY+row*(gh+gapY)+gh/2+10;
      var r=48;

      ctx.strokeStyle='#3a2a1a';ctx.lineWidth=12;ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,0);ctx.stroke();
      var pct=kpi.val/100;
      var endAng=Math.PI+pct*Math.PI;
      ctx.strokeStyle=kpi.color;ctx.lineWidth=12;ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,endAng);ctx.stroke();

      ctx.fillStyle=kpi.color;ctx.font='bold 16px Georgia';ctx.textAlign='center';
      ctx.fillText(kpi.val,cx,cy-5);

      var grade=kpi.val>=85?'S':kpi.val>=70?'A':kpi.val>=55?'B':kpi.val>=40?'C':'D';
      if(grade==='S')sCount++;
      var gc=grade==='S'?'#ffd700':grade==='A'?'#4fc3f7':grade==='B'?'#81c784':grade==='C'?'#ff9800':'#ef5350';
      ctx.fillStyle=gc;ctx.font='bold 11px Georgia';ctx.fillText(grade,cx,cy+12);

      ctx.fillStyle='#a08060';ctx.font='9px Georgia';
      ctx.fillText(kpi.name,cx,cy+28);
      ctx.fillStyle='#777';ctx.font='8px Georgia';
      ctx.fillText('w:'+(kpi.weight*100).toFixed(0)+'%',cx,cy+40);
    });

    var weighted=kpis.reduce(function(a,k){return a+k.val*k.weight},0);
    var wg=weighted>=85?'S':weighted>=70?'A':weighted>=55?'B':weighted>=40?'C':'D';
    var wgc=wg==='S'?'#ffd700':wg==='A'?'#4fc3f7':wg==='B'?'#81c784':wg==='C'?'#ff9800':'#ef5350';
    ctx.fillStyle='#1e1228';ctx.fillRect(15,355,590,38);
    ctx.fillStyle=wgc;ctx.font='bold 16px Georgia';ctx.textAlign='center';
    ctx.fillText('종합 등급: '+wg+' ('+weighted.toFixed(1)+'점)',310,378);

    if(sCount>=5)unlockAch('performance_ace','Performance Ace');
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
        kpis[i].val=Math.min(100,kpis[i].val+5);sfx('perf_gauge');draw();return;
      }
    }
  });
  draw();document.body.appendChild(panel);
}

/* ═══════════════════════════════════════════════════════
   QUIZ PANEL
   ═══════════════════════════════════════════════════════ */
function createQuizPanel(){
  var panel=mkPanel('v27-quiz-panel');
  var h=document.createElement('div');h.style.cssText=HDR;h.textContent='❓ Quiz v27 (15문)';panel.appendChild(h);
  var total=V27_QUIZ.length,correct=0,answered=0;
  var wrap=document.createElement('div');wrap.style.cssText='max-width:600px;margin:0 auto;';

  V27_QUIZ.forEach(function(q,qi){
    var qd=document.createElement('div');qd.style.cssText='margin:10px 0;padding:10px;background:#1e1228;border-radius:8px;border:1px solid #3a2a1a;';
    var qt=document.createElement('div');qt.style.cssText='color:#D4894A;font-size:12px;margin-bottom:6px;';qt.textContent=(qi+1)+'. '+q.q;qd.appendChild(qt);
    q.a.forEach(function(a,ai){
      var ab=document.createElement('button');
      ab.textContent=a;
      ab.style.cssText='display:block;width:100%;padding:6px;margin:3px 0;border-radius:6px;border:1px solid #3a2a1a;background:#2a1a30;color:#ccc;cursor:pointer;font-size:11px;text-align:left;';
      ab.addEventListener('click',function(){
        if(ab.dataset.done)return;ab.dataset.done='1';answered++;
        if(ai===q.c){ab.style.background='#2e7d32';ab.style.color='#fff';correct++;sfx('scale_record');}
        else{ab.style.background='#c62828';ab.style.color='#fff';sfx('burnout_check');
          qd.querySelectorAll('button')[q.c].style.background='#2e7d32';qd.querySelectorAll('button')[q.c].style.color='#fff';}
        if(answered===total&&correct>=Math.ceil(total*0.8))unlockAch('quiz_v27_master','Quiz v27 Master');
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
function addV27Nav(){
  var navTarget=document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  if(!navTarget){
    var allNav=document.querySelectorAll('div[style*="flex-wrap"]');
    if(allNav.length>0)navTarget=allNav[allNav.length-1];
  }
  if(!navTarget){navTarget=document.createElement('div');navTarget.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px;justify-content:center;';document.body.appendChild(navTarget);}

  var btns=[
    {label:'BowDst',panel:'v27-bowdist-panel',color:'#4fc3f7',key:'KeyQ'},
    {label:'ScaleSpd',panel:'v27-scalespeed-panel',color:'#81c784',key:'KeyW'},
    {label:'EraExp',panel:'v27-eraexplorer-panel',color:'#ce93d8',key:'KeyE'},
    {label:'Tuning',panel:'v27-tuning-panel',color:'#ffd54f',key:'KeyR'},
    {label:'Ensembl',panel:'v27-ensemble-panel',color:'#ff7043',key:'KeyT'},
    {label:'PrcLog',panel:'v27-practicelog-panel',color:'#4db6ac',key:'KeyY'},
    {label:'TchCmp',panel:'v27-techcompare-panel',color:'#ef5350',key:'KeyU'},
    {label:'PerfDsh',panel:'v27-perfdash-panel',color:'#aed581',key:'KeyI'},
    {label:'Quiz27',panel:'v27-quiz-panel',color:'#D4894A',key:'Digit9'}
  ];

  var opened=lp('v27_opened')||{};

  btns.forEach(function(b){
    var btn=document.createElement('button');
    btn.textContent=b.label;
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid '+b.color+';background:transparent;color:'+b.color+';cursor:pointer;font-size:0.72em;margin:2px;';
    btn.addEventListener('click',function(){
      var p=document.getElementById(b.panel);
      if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('bow_dist');
        opened[b.label]=true;sp('v27_opened',opened);
        if(Object.keys(opened).length>=5)unlockAch('v27_explorer','v27 Explorer');
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
        if(p){p.style.display=p.style.display==='none'?'block':'none';sfx('bow_dist');
          opened[b.label]=true;sp('v27_opened',opened);
          if(Object.keys(opened).length>=5)unlockAch('v27_explorer','v27 Explorer');
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
    V27_SONGS.forEach(function(s){
      if(!window.SONG_DB.find(function(x){return x.id===s.id;}))window.SONG_DB.push(s);
    });
  }
  if(typeof window.LESSON_DB!=='undefined'&&Array.isArray(window.LESSON_DB)){
    V27_LESSONS.forEach(function(l){
      if(!window.LESSON_DB.find(function(x){return x.id===l.id;}))window.LESSON_DB.push(l);
    });
  }
  if(typeof window.ACH_DB!=='undefined'&&Array.isArray(window.ACH_DB)){
    V27_ACHS.forEach(function(a){
      if(!window.ACH_DB.find(function(x){return x.id===a.id;}))window.ACH_DB.push(a);
    });
  }
  unlockAch('song_244','Song Collector 244');
  var allAch=loadAch(),v27Ids=V27_ACHS.map(function(a){return a.id;});
  var allV27=v27Ids.every(function(id){return allAch[id];});
  if(allV27)unlockAch('v27_complete','v27 Complete');
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
function init(){
  createBowDistPanel();
  createScaleSpeedPanel();
  createEraExplorerPanel();
  createTuningPanel();
  createEnsemblePanel();
  createPracticeLogPanel();
  createTechComparePanel();
  createPerfDashPanel();
  createQuizPanel();
  addV27Nav();
  registerData();
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
else{init();}

})();
