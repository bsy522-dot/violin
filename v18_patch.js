/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v18.0 PATCH MODULE
   활배분분석기Canvas580x340(Frog/Mid/Tip3존12곡)+퍼펙트5도튜닝트레이너Canvas560x320(4현5도비율)+
   음악시대별스타일가이드Canvas600x380(바로크~현대6시대6축Radar)+테크닉스펙트럼분석기Canvas580x360(12테크닉5난이도)+
   연습성과대시보드Canvas600x400(7일트렌드5지표Line)+명곡토너먼트Canvas560x360(16곡4라운드브래킷)+
   현악기계보도Canvas580x340(8악기진화트리)+바이올린제작공정Canvas560x320(12단계프로세스)+
   10곡추가(144→154)+10레슨(170→180)+15퀴즈(120→135)+
   12업적(154→166)+SFX12종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V18Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V18_LOADED)return;window.__V18_LOADED=true;

/* ─── HELPERS ─── */
function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(p){var old=loadProgress();Object.assign(old,p);localStorage.setItem('violinProgress',JSON.stringify(old));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function unlockAch(id){
  var achs=loadAchievements();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  var info=V18_ACHS.find(function(a){return a.id===id;});
  if(!info)return;
  if(typeof window.showAchToast==='function')window.showAchToast(id);
  else{var t=document.getElementById('achToast');if(t){
    t.querySelector('.at').textContent=info.icon+' '+info.name;t.querySelector('.as').textContent=info.desc;
    t.classList.add('show');setTimeout(function(){t.classList.remove('show');},3000);}}
}
function addHistory(type,text){
  try{var h=JSON.parse(localStorage.getItem('violinV10_history')||'[]');
  h.push({type:type,text:text,date:new Date().toLocaleString('ko-KR')});
  if(h.length>60)h=h.slice(-60);
  localStorage.setItem('violinV10_history',JSON.stringify(h));}catch(e){}
}

/* ─── 1. SFX ENGINE (12 types) ─── */
var actx18=null;
function v18Sfx(type){
  try{
    if(!actx18)actx18=new(window.AudioContext||window.webkitAudioContext)();
    var o=actx18.createOscillator(),g=actx18.createGain();
    o.connect(g);g.connect(actx18.destination);
    var now=actx18.currentTime;
    var presets={
      bow_dist:{f:440,w:'triangle',a:.1,d:.35},
      fifth_hit:{f:660,w:'sine',a:.14,d:.4},
      fifth_miss:{f:185,w:'sawtooth',a:.05,d:.25},
      era_select:{f:523,w:'triangle',a:.09,d:.3},
      tech_analyze:{f:587,w:'sine',a:.1,d:.35},
      practice_log:{f:698,w:'triangle',a:.08,d:.3},
      tourney_win:{f:1047,w:'triangle',a:.16,d:.6},
      tourney_lose:{f:196,w:'sawtooth',a:.06,d:.4},
      lineage_tap:{f:494,w:'sine',a:.08,d:.3},
      craft_step:{f:554,w:'triangle',a:.1,d:.35},
      quiz_v18:{f:784,w:'square',a:.06,d:.2},
      achieve_v18:{f:988,w:'triangle',a:.14,d:.6}
    };
    var p=presets[type]||presets.era_select;
    o.type=p.w;o.frequency.setValueAtTime(p.f,now);
    g.gain.setValueAtTime(p.a,now);g.gain.exponentialRampToValueAtTime(.001,now+p.d);
    o.start(now);o.stop(now+p.d);
  }catch(e){}
}

/* ─── 2. DATA: SONGS, LESSONS, QUIZ, ACHIEVEMENTS ─── */
var V18_SONGS=[
  {id:'s145',title:'시벨리우스 바이올린 협주곡 1악장',diff:5,genre:'낭만주의'},
  {id:'s146',title:'쇼손 시곡',diff:5,genre:'낭만주의'},
  {id:'s147',title:'바르톡 바이올린 협주곡 2번',diff:5,genre:'현대'},
  {id:'s148',title:'엘가 사랑의 인사',diff:2,genre:'낭만주의'},
  {id:'s149',title:'사라사테 카르멘 환상곡',diff:5,genre:'낭만주의'},
  {id:'s150',title:'비탈리 샤콘느',diff:4,genre:'바로크'},
  {id:'s151',title:'크라이슬러 사랑의 기쁨',diff:3,genre:'낭만주의'},
  {id:'s152',title:'파가니니 라 캄파넬라',diff:5,genre:'낭만주의'},
  {id:'s153',title:'바흐 무반주 파르티타 3번 전주곡',diff:4,genre:'바로크'},
  {id:'s154',title:'드뷔시 바이올린 소나타',diff:4,genre:'인상주의'}
];
var V18_LESSONS=[
  {id:'l171',title:'활 배분의 과학',desc:'Frog/Middle/Tip 3존 활 배분 전략'},
  {id:'l172',title:'퍼펙트 5도 조율법',desc:'귀로 완벽한 5도 간격 잡는 훈련'},
  {id:'l173',title:'바로크 연주 스타일',desc:'바로크 시대 보잉과 장식음 기법'},
  {id:'l174',title:'현대 주법 입문',desc:'하모닉스, 콜레뇨, 술폰티첼로'},
  {id:'l175',title:'테크닉 스펙트럼 진단',desc:'12가지 테크닉 레벨 자가 진단'},
  {id:'l176',title:'연습 성과 극대화',desc:'효율적 연습을 위한 7가지 메트릭'},
  {id:'l177',title:'시벨리우스 협주곡 분석',desc:'시벨리우스 Vn 협주곡 구조와 해석'},
  {id:'l178',title:'사라사테 테크닉 해부',desc:'카르멘 환상곡의 기교적 요소 분석'},
  {id:'l179',title:'현악기 발달사',desc:'레벡에서 현대 바이올린까지의 진화'},
  {id:'l180',title:'v18 졸업',desc:'v18 모든 과정 완료 인증'}
];
var V18_QUIZ=[
  {q:'시벨리우스 바이올린 협주곡의 조성은?',a:['D단조','E장조','A단조','G장조'],c:0},
  {q:'쇼손 &lsquo;시곡&rsquo;(Po&egrave;me)의 작품번호는?',a:['Op.25','Op.12','Op.33','Op.48'],c:0},
  {q:'바이올린 현의 조율 간격은?',a:['완전5도','완전4도','장3도','단3도'],c:0},
  {q:'바로크 시대의 활은 현대 활과 비교해 어떤 특징이 있는가?',a:['볼록한 스틱','오목한 스틱','같은 모양','사각 스틱'],c:0},
  {q:'파가니니 &lsquo;라 캄파넬라&rsquo;에서 자주 쓰이는 기법은?',a:['하모닉스','콜레뇨','피치카토만','뮤트 연주'],c:0},
  {q:'크라이슬러의 &lsquo;사랑의 기쁨&rsquo; 원래 제목(독일어)은?',a:['Liebesfreud','Liebesleid','Sch&ouml;n Rosmarin','Praeludium'],c:0},
  {q:'비탈리 샤콘느의 원래 악기 편성은?',a:['바이올린+통주저음','독주 바이올린','바이올린+피아노','현악4중주'],c:0},
  {q:'활의 &lsquo;Frog&rsquo;(프로그)는 어디를 가리키는가?',a:['활 아랫부분(손잡이쪽)','활 끝부분','활 중간','현에 닿는 부분'],c:0},
  {q:'드뷔시의 바이올린 소나타는 몇 번째 소나타인가?',a:['3번째(마지막)','1번째','2번째','4번째'],c:0},
  {q:'바이올린 제작에서 &lsquo;바니시&rsquo;(varnish)의 주 목적은?',a:['보호+음향','장식만','방수만','무게 추가'],c:0},
  {q:'엘가 &lsquo;사랑의 인사&rsquo;를 헌정받은 사람은?',a:['아내 앨리스','어머니','제자','출판사'],c:0},
  {q:'술 폰티첼로(Sul Ponticello) 연주 시 음색은?',a:['금속적/유리질','따뜻한','어두운','매우 큰소리'],c:0},
  {q:'안토니오 스트라디바리가 활동한 도시는?',a:['크레모나','베네치아','밀라노','피렌체'],c:0},
  {q:'바흐 무반주 파르티타 3번의 조성은?',a:['E장조','D단조','A장조','G단조'],c:0},
  {q:'바이올린의 4현 중 가장 높은 음의 현은?',a:['E현','A현','D현','G현'],c:0}
];
var V18_ACHS=[
  {id:'bow_dist_master',icon:'🏹',name:'활 배분 마스터',desc:'3존 활 배분 분석 완료'},
  {id:'fifth_tuner',icon:'🔔',name:'5도 조율사',desc:'4현 퍼펙트 5도 3회 연속 정확'},
  {id:'era_scholar',icon:'📚',name:'시대별 학자',desc:'6시대 스타일 가이드 모두 열람'},
  {id:'tech_spectrum',icon:'🔬',name:'테크닉 분석가',desc:'12테크닉 모두 평가 완료'},
  {id:'practice_guru',icon:'📊',name:'연습 구루',desc:'7일 연속 연습 기록 달성'},
  {id:'tourney_champ',icon:'🏆',name:'명곡 토너먼트 챔피언',desc:'명곡 토너먼트 3회 완료'},
  {id:'lineage_expert',icon:'🎻',name:'현악기 계보 전문가',desc:'8악기 계보 모두 열람'},
  {id:'craft_master',icon:'🔨',name:'제작 공정 마스터',desc:'12단계 제작 과정 모두 학습'},
  {id:'songs_150',icon:'🎶',name:'150곡 돌파',desc:'150곡 이상 연주 완료'},
  {id:'quiz_130',icon:'🧠',name:'퀴즈 130+',desc:'퀴즈 130문항 이상 정답'},
  {id:'sibelius_fan',icon:'❄️',name:'시벨리우스 팬',desc:'시벨리우스 협주곡 연주 완료'},
  {id:'v18_explorer',icon:'🚀',name:'v18 탐험가',desc:'v18 모든 기능 사용'}
];

/* ─── 3. CSS INJECTION ─── */
var sty18=document.createElement('style');
sty18.textContent=
'#bowDistPanel,#fifthTunePanel,#eraGuidePanel,#techSpecPanel,#practiceDashPanel,#tourneyPanel,#lineagePanel,#craftPanel,#quizV18Panel{'+
'display:none;position:fixed;inset:0;z-index:252;background:rgba(0,0,0,.97);'+
'flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}'+
'#bowDistPanel.show,#fifthTunePanel.show,#eraGuidePanel.show,#techSpecPanel.show,'+
'#practiceDashPanel.show,#tourneyPanel.show,#lineagePanel.show,#craftPanel.show,#quizV18Panel.show{display:flex;}'+
'#bowDistPanel h3,#fifthTunePanel h3,#eraGuidePanel h3,#techSpecPanel h3,'+
'#practiceDashPanel h3,#tourneyPanel h3,#lineagePanel h3,#craftPanel h3,#quizV18Panel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}'+
'#bowDistCanvas,#fifthTuneCanvas,#eraGuideCanvas,#techSpecCanvas,#practiceDashCanvas,#tourneyCanvas,#lineageCanvas,#craftCanvas{'+
'border-radius:10px;border:1px solid rgba(255,215,0,.15);'+
'background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}'+
'.v18Info{width:100%;max-width:560px;padding:10px;margin:4px 0;'+
'background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);'+
'border-radius:10px;font-size:10px;color:rgba(240,230,200,.7);line-height:1.6;}'+
'.v18Card{width:100%;max-width:520px;padding:10px 12px;margin:4px 0;'+
'background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.12);'+
'border-radius:8px;font-size:11px;color:rgba(240,230,200,.8);cursor:pointer;'+
'transition:background .2s,border-color .2s;}'+
'.v18Card:hover{background:rgba(255,215,0,.08);border-color:rgba(255,215,0,.3);}'+
'.v18Card.done{border-color:rgba(76,175,80,.4);background:rgba(76,175,80,.06);}'+
'.v18Btn{display:inline-block;padding:6px 14px;margin:4px;border-radius:6px;'+
'background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.25);'+
'color:#ffd700;font-size:10px;cursor:pointer;transition:background .2s;}'+
'.v18Btn:hover{background:rgba(255,215,0,.22);}'+
'.v18Btn.active{background:rgba(255,215,0,.3);border-color:#ffd700;}'+
'.v18Close{position:sticky;top:0;align-self:flex-end;font-size:18px;cursor:pointer;'+
'color:#888;z-index:10;padding:4px 8px;}'+
'.v18Close:hover{color:#ffd700;}'+
'.v18Grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;width:100%;max-width:560px;}'+
'.v18Progress{width:100%;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;margin:4px 0;}'+
'.v18Progress .bar{height:100%;background:linear-gradient(90deg,#ffd700,#ff6644);border-radius:3px;transition:width .4s;}'+
'.v18Badge{display:inline-block;padding:2px 6px;border-radius:4px;font-size:8px;font-weight:bold;margin-left:4px;}'+
'.v18Badge.s{background:rgba(255,215,0,.2);color:#ffd700;}'+
'.v18Badge.a{background:rgba(76,175,80,.2);color:#4caf50;}'+
'.v18Badge.b{background:rgba(33,150,243,.2);color:#2196f3;}'+
'.v18Badge.c{background:rgba(255,152,0,.2);color:#ff9800;}'+
'.v18Badge.d{background:rgba(244,67,54,.2);color:#f44336;}'+
'.v18SubTitle{font-size:12px;color:#daa520;margin:8px 0 4px;font-weight:bold;}';
document.head.appendChild(sty18);

/* ─── 4. BOW DISTRIBUTION ANALYZER Canvas 580x340 ─── */
var BOW_ZONES=['Frog (&#54532;&#47196;&#44536;)','Middle (&#51473;&#44036;)','Tip (&#54021;)'];
var BOW_PIECES=[
  {name:'Bach Partita 2 Chaconne',frog:25,mid:45,tip:30},
  {name:'Mendelssohn Concerto 1mvt',frog:30,mid:40,tip:30},
  {name:'Bruch Concerto 2mvt',frog:20,mid:50,tip:30},
  {name:'Paganini Caprice 24',frog:40,mid:35,tip:25},
  {name:'Sibelius Concerto 1mvt',frog:35,mid:40,tip:25},
  {name:'Tchaikovsky Concerto 1mvt',frog:30,mid:45,tip:25},
  {name:'Mozart Concerto 3',frog:25,mid:50,tip:25},
  {name:'Brahms Concerto 3mvt',frog:35,mid:35,tip:30},
  {name:'Lalo Symphonie Espagnole',frog:30,mid:40,tip:30},
  {name:'Saint-Saens Intro Rondo',frog:35,mid:35,tip:30},
  {name:'Wieniawski Polonaise',frog:40,mid:30,tip:30},
  {name:'Kreisler Praeludium',frog:30,mid:45,tip:25}
];
var bowDistState={selected:0};
function createBowDistPanel(){
  var d=document.createElement('div');d.id='bowDistPanel';
  d.innerHTML='<span class="v18Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>🏹 &#54876; &#48176;&#48516; &#48516;&#49437;&#44592;</h3>'+
    '<canvas id="bowDistCanvas" width="580" height="340"></canvas>'+
    '<div class="v18Info" id="bowDistInfo">&#44257;&#48324; &#54876; &#48176;&#48516; &#48708;&#50984;&#51012; Frog/Middle/Tip 3&#51316;&#51004;&#47196; &#48516;&#49437;&#54633;&#45768;&#45796;. &#44033; &#44257;&#51032; &#53945;&#49457;&#50640; &#47582;&#45716; &#54876; &#48176;&#48516; &#51204;&#47029;&#51012; &#54617;&#49845;&#54616;&#49464;&#50836;.</div>'+
    '<div class="v18Grid" id="bowDistGrid"></div>';
  document.body.appendChild(d);
  var grid=d.querySelector('#bowDistGrid');
  BOW_PIECES.forEach(function(p,i){
    var c=document.createElement('div');c.className='v18Card';
    c.textContent=p.name;
    c.onclick=function(){bowDistState.selected=i;drawBowDistCanvas();v18Sfx('bow_dist');};
    grid.appendChild(c);
  });
}
function drawBowDistCanvas(){
  var cv=document.getElementById('bowDistCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
  ctx.textAlign='center';ctx.fillText('Bow Distribution Analyzer',W/2,28);
  var piece=BOW_PIECES[bowDistState.selected];
  ctx.font='11px sans-serif';ctx.fillStyle='#daa520';
  ctx.fillText(piece.name,W/2,50);
  var vals=[piece.frog,piece.mid,piece.tip];
  var colors=['#ff6644','#ffd700','#44ccee'];
  var labels=['Frog','Middle','Tip'];
  var barW=120,barH=180,startX=80,startY=80;
  for(var i=0;i<3;i++){
    var x=startX+i*(barW+40);
    var h=vals[i]/100*barH;
    var grd=ctx.createLinearGradient(x,startY+barH-h,x,startY+barH);
    grd.addColorStop(0,colors[i]);grd.addColorStop(1,'rgba(0,0,0,.3)');
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.roundRect(x,startY+barH-h,barW,h,6);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
    ctx.fillText(vals[i]+'%',x+barW/2,startY+barH-h-10);
    ctx.fillStyle=colors[i];ctx.font='bold 12px sans-serif';
    ctx.fillText(labels[i],x+barW/2,startY+barH+20);
    ctx.fillStyle='rgba(240,230,200,.5)';ctx.font='10px sans-serif';
    ctx.fillText(BOW_ZONES[i].replace(/&[^;]+;/g,''),x+barW/2,startY+barH+36);
  }
  ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=1;
  for(var pct=25;pct<=100;pct+=25){
    var y=startY+barH-pct/100*barH;
    ctx.beginPath();ctx.moveTo(startX-10,y);ctx.lineTo(startX+3*(barW+40)-40+barW+10,y);ctx.stroke();
    ctx.fillStyle='rgba(200,190,160,.3)';ctx.font='9px sans-serif';ctx.textAlign='right';
    ctx.fillText(pct+'%',startX-14,y+3);
  }
  var total=vals[0]+vals[1]+vals[2];
  var angleStart=-Math.PI/2;
  var cx=W-80,cy=200,r=50;
  for(var j=0;j<3;j++){
    var angle=vals[j]/total*Math.PI*2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,angleStart,angleStart+angle);ctx.closePath();
    ctx.fillStyle=colors[j];ctx.globalAlpha=.7;ctx.fill();ctx.globalAlpha=1;
    angleStart+=angle;
  }
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.beginPath();ctx.arc(cx,cy,25,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ffd700';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
  ctx.fillText('Balance',cx,cy+3);
  var balance=100-Math.abs(vals[0]-vals[2])-Math.abs(vals[1]-33);
  var grade=balance>80?'S':balance>65?'A':balance>50?'B':balance>35?'C':'D';
  ctx.fillStyle='#ffd700';ctx.font='bold 16px sans-serif';ctx.fillText(grade,cx,cy+45);
  ctx.font='9px sans-serif';ctx.fillStyle='rgba(200,190,160,.5)';ctx.fillText('Balance: '+Math.round(balance),cx,cy+60);
  saveProgress({v18_bowdist:1});
}

/* ─── 5. PERFECT 5TH TUNING TRAINER Canvas 560x320 ─── */
var FIFTH_STRINGS=[
  {low:'G3',high:'D4',freqL:196,freqH:293.66,ratio:1.5},
  {low:'D4',high:'A4',freqL:293.66,freqH:440,ratio:1.4983},
  {low:'A4',high:'E5',freqL:440,freqH:659.26,ratio:1.4983}
];
var fifthState={pair:0,attempts:0,hits:0,streak:0,bestStreak:0,deviations:[]};
function createFifthTunePanel(){
  var d=document.createElement('div');d.id='fifthTunePanel';
  d.innerHTML='<span class="v18Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>🔔 &#54140;&#54169;&#53944; 5&#46020; &#53916;&#45789; &#53944;&#47112;&#51060;&#45320;</h3>'+
    '<canvas id="fifthTuneCanvas" width="560" height="320"></canvas>'+
    '<div class="v18Info" id="fifthInfo">&#48148;&#51060;&#50732;&#47536;&#51032; 4&#54788;&#51008; &#50756;&#51204; 5&#46020; &#44036;&#44201;(3:2 &#48708;&#50984;)&#51004;&#47196; &#51312;&#50984;&#46121;&#45768;&#45796;. &#49836;&#46972;&#51060;&#45908;&#47196; &#51020;&#51221;&#51012; &#47582;&#52628;&#44256; &#51221;&#54869;&#46020;&#47484; &#52769;&#51221;&#54616;&#49464;&#50836;.</div>'+
    '<div style="margin:6px;display:flex;gap:6px;flex-wrap:wrap;justify-content:center">'+
    '<span class="v18Btn" onclick="playFifthRef()">&#9654; &#44592;&#51456;&#51020; &#46307;&#44592;</span>'+
    '<span class="v18Btn" onclick="submitFifth()">&#10004; &#54032;&#51221;</span>'+
    '<span class="v18Btn" onclick="resetFifth()">&#8634; &#52488;&#44592;&#54868;</span></div>'+
    '<div style="margin:4px"><input type="range" id="fifthSlider" min="-50" max="50" value="0" style="width:280px;accent-color:#ffd700"></div>'+
    '<div style="margin:6px;display:flex;gap:6px;justify-content:center">'+
    '<span class="v18Btn" onclick="selectFifthPair(0)">G-D</span>'+
    '<span class="v18Btn" onclick="selectFifthPair(1)">D-A</span>'+
    '<span class="v18Btn" onclick="selectFifthPair(2)">A-E</span></div>';
  document.body.appendChild(d);
}
window.selectFifthPair=function(idx){fifthState.pair=idx;drawFifthCanvas();v18Sfx('era_select');};
window.playFifthRef=function(){
  try{
    var ac=actx18||(actx18=new(window.AudioContext||window.webkitAudioContext)());
    var pair=FIFTH_STRINGS[fifthState.pair];
    var o1=ac.createOscillator(),g1=ac.createGain();
    o1.connect(g1);g1.connect(ac.destination);
    o1.type='sine';o1.frequency.value=pair.freqL;
    g1.gain.setValueAtTime(.12,ac.currentTime);g1.gain.exponentialRampToValueAtTime(.001,ac.currentTime+1.5);
    o1.start(ac.currentTime);o1.stop(ac.currentTime+1.5);
    var o2=ac.createOscillator(),g2=ac.createGain();
    o2.connect(g2);g2.connect(ac.destination);
    o2.type='sine';o2.frequency.value=pair.freqH;
    g2.gain.setValueAtTime(.12,ac.currentTime+.5);g2.gain.exponentialRampToValueAtTime(.001,ac.currentTime+2);
    o2.start(ac.currentTime+.5);o2.stop(ac.currentTime+2);
  }catch(e){}
};
window.submitFifth=function(){
  var slider=document.getElementById('fifthSlider');if(!slider)return;
  var dev=Math.abs(parseInt(slider.value));
  fifthState.attempts++;
  fifthState.deviations.push(dev);
  if(dev<=5){fifthState.hits++;fifthState.streak++;v18Sfx('fifth_hit');}
  else{fifthState.streak=0;v18Sfx('fifth_miss');}
  if(fifthState.streak>fifthState.bestStreak)fifthState.bestStreak=fifthState.streak;
  if(fifthState.streak>=3)unlockAch('fifth_tuner');
  slider.value=Math.floor(Math.random()*101)-50;
  drawFifthCanvas();addHistory('tuning','5th tuning attempt: '+dev+'cents dev');
};
window.resetFifth=function(){fifthState={pair:fifthState.pair,attempts:0,hits:0,streak:0,bestStreak:0,deviations:[]};drawFifthCanvas();};
function drawFifthCanvas(){
  var cv=document.getElementById('fifthTuneCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('Perfect 5th Tuning Trainer',W/2,28);
  var pair=FIFTH_STRINGS[fifthState.pair];
  ctx.font='12px sans-serif';ctx.fillStyle='#daa520';
  ctx.fillText(pair.low+' ↔ '+pair.high+'  (ratio: '+pair.ratio.toFixed(4)+')',W/2,50);
  var slider=document.getElementById('fifthSlider');
  var dev=slider?parseInt(slider.value):0;
  var meterX=80,meterW=W-160,meterY=80,meterH=30;
  var grd=ctx.createLinearGradient(meterX,0,meterX+meterW,0);
  grd.addColorStop(0,'#f44336');grd.addColorStop(.35,'#ff9800');grd.addColorStop(.5,'#4caf50');
  grd.addColorStop(.65,'#ff9800');grd.addColorStop(1,'#f44336');
  ctx.fillStyle=grd;ctx.beginPath();ctx.roundRect(meterX,meterY,meterW,meterH,4);ctx.fill();
  var needleX=meterX+meterW/2+(dev/50)*(meterW/2);
  ctx.fillStyle='#fff';ctx.beginPath();
  ctx.moveTo(needleX-6,meterY-4);ctx.lineTo(needleX+6,meterY-4);ctx.lineTo(needleX,meterY+meterH+4);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ffd700';ctx.font='bold 16px sans-serif';
  ctx.fillText((dev>0?'+':'')+dev+' cents',W/2,meterY+meterH+30);
  ctx.font='10px sans-serif';ctx.fillStyle='rgba(200,190,160,.5)';
  ctx.fillText('-50',meterX,meterY-8);ctx.fillText('+50',meterX+meterW,meterY-8);ctx.fillText('0',meterX+meterW/2,meterY-8);
  ctx.fillStyle='#c9a96e';ctx.font='11px sans-serif';ctx.textAlign='left';
  var statY=160;
  ctx.fillText('Attempts: '+fifthState.attempts,40,statY);
  ctx.fillText('Hits (±5 cents): '+fifthState.hits,40,statY+20);
  ctx.fillText('Streak: '+fifthState.streak,40,statY+40);
  ctx.fillText('Best Streak: '+fifthState.bestStreak,40,statY+60);
  var acc=fifthState.attempts>0?Math.round(fifthState.hits/fifthState.attempts*100):0;
  ctx.fillText('Accuracy: '+acc+'%',40,statY+80);
  if(fifthState.deviations.length>0){
    var chartX=300,chartY=160,chartW=220,chartH=120;
    ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=1;
    ctx.strokeRect(chartX,chartY,chartW,chartH);
    ctx.fillStyle='rgba(200,190,160,.3)';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('Deviation History',chartX+chartW/2,chartY-6);
    var maxDev=50;
    ctx.beginPath();ctx.strokeStyle='#ffd700';ctx.lineWidth=1.5;
    var pts=fifthState.deviations.slice(-20);
    for(var i=0;i<pts.length;i++){
      var px=chartX+10+i*(chartW-20)/(Math.max(pts.length-1,1));
      var py=chartY+chartH-pts[i]/maxDev*chartH;
      if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.stroke();
    for(var j=0;j<pts.length;j++){
      var px2=chartX+10+j*(chartW-20)/(Math.max(pts.length-1,1));
      var py2=chartY+chartH-pts[j]/maxDev*chartH;
      ctx.fillStyle=pts[j]<=5?'#4caf50':pts[j]<=15?'#ff9800':'#f44336';
      ctx.beginPath();ctx.arc(px2,py2,3,0,Math.PI*2);ctx.fill();
    }
  }
  saveProgress({v18_fifth:1});
}

/* ─── 6. MUSIC ERA STYLE GUIDE Canvas 600x380 ─── */
var ERAS=[
  {name:'&#48148;&#47196;&#53356; (1600-1750)',key:'Baroque',bow:'Short, articulated',vib:'Minimal/ornamental',dyn:'Terraced',orn:'Trills, mordents',tone:'Light, clear',pos:'1st-3rd',
   composers:'Bach, Vivaldi, Corelli, Handel',color:'#e8d44d'},
  {name:'&#44256;&#51204; (1750-1820)',key:'Classical',bow:'Balanced, varied',vib:'Moderate, selective',dyn:'Gradual crescendo/dim',orn:'Grace notes, turns',tone:'Pure, singing',pos:'1st-5th',
   composers:'Mozart, Haydn, Beethoven (early)',color:'#4dd0e1'},
  {name:'&#45229;&#47564;&#51452;&#51032; (1820-1900)',key:'Romantic',bow:'Long, sustained legato',vib:'Continuous, expressive',dyn:'Wide range pp-fff',orn:'Portamento, rubato',tone:'Rich, warm',pos:'All positions',
   composers:'Brahms, Tchaikovsky, Mendelssohn',color:'#ef5350'},
  {name:'&#51064;&#49345;&#51452;&#51032; (1880-1920)',key:'Impressionist',bow:'Nuanced, coloristic',vib:'Varied for color',dyn:'Subtle, layered',orn:'Harmonics, timbral',tone:'Ethereal, shimmery',pos:'Extended',
   composers:'Debussy, Ravel, Fauré',color:'#ab47bc'},
  {name:'20&#49464;&#44592; (1900-1960)',key:'Modern',bow:'Extended techniques',vib:'As specified',dyn:'Extreme contrasts',orn:'Col legno, ponticello',tone:'Diverse, experimental',pos:'Full range',
   composers:'Bartók, Prokofiev, Shostakovich',color:'#ff7043'},
  {name:'&#54788;&#45824; (1960-)',key:'Contemporary',bow:'Free, graphic notation',vib:'Free/none',dyn:'pppp to ffff',orn:'Microtones, noise',tone:'All possibilities',pos:'Beyond fingerboard',
   composers:'Penderecki, Ligeti, Saariaho',color:'#66bb6a'}
];
var eraState={selected:0};
function createEraGuidePanel(){
  var d=document.createElement('div');d.id='eraGuidePanel';
  d.innerHTML='<span class="v18Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>📚 &#51020;&#50501; &#49884;&#45824;&#48324; &#49828;&#53440;&#51068; &#44032;&#51060;&#46300;</h3>'+
    '<canvas id="eraGuideCanvas" width="600" height="380"></canvas>'+
    '<div class="v18Info" id="eraGuideInfo"></div>'+
    '<div class="v18Grid" id="eraGrid"></div>';
  document.body.appendChild(d);
  var grid=d.querySelector('#eraGrid');
  ERAS.forEach(function(e,i){
    var c=document.createElement('div');c.className='v18Card';
    c.innerHTML='<span style="color:'+e.color+'">●</span> '+e.key;
    c.onclick=function(){eraState.selected=i;drawEraCanvas();v18Sfx('era_select');
      var prog=loadProgress();if(!prog.v18_eras)prog.v18_eras={};prog.v18_eras[e.key]=1;
      saveProgress(prog);
      if(Object.keys(prog.v18_eras).length>=6)unlockAch('era_scholar');
    };
    grid.appendChild(c);
  });
}
function drawEraCanvas(){
  var cv=document.getElementById('eraGuideCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  var era=ERAS[eraState.selected];
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('Music Era Style Guide',W/2,24);
  ctx.fillStyle=era.color;ctx.font='bold 13px sans-serif';
  ctx.fillText(era.key,W/2,46);
  var axes=['Bowing','Vibrato','Dynamics','Ornamentation','Tone','Position'];
  var scores={
    Baroque:[3,1,2,4,3,2],Classical:[4,3,3,3,4,3],Romantic:[5,5,5,3,5,5],
    Impressionist:[4,4,4,3,4,4],Modern:[5,3,5,5,4,5],Contemporary:[5,2,5,5,5,5]
  };
  var vals=scores[era.key]||[3,3,3,3,3,3];
  var cx=170,cy=210,r=100;
  for(var ring=1;ring<=5;ring++){
    ctx.strokeStyle='rgba(255,215,0,'+(0.06+ring*0.03)+')';ctx.lineWidth=1;
    ctx.beginPath();
    for(var a=0;a<6;a++){
      var ang=-Math.PI/2+a*Math.PI/3;
      var rx=cx+Math.cos(ang)*r*ring/5,ry=cy+Math.sin(ang)*r*ring/5;
      if(a===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
    }
    ctx.closePath();ctx.stroke();
  }
  for(var b=0;b<6;b++){
    var ang2=-Math.PI/2+b*Math.PI/3;
    ctx.strokeStyle='rgba(255,215,0,.1)';ctx.beginPath();
    ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang2)*r,cy+Math.sin(ang2)*r);ctx.stroke();
    ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.textAlign='center';
    var lx=cx+Math.cos(ang2)*(r+18),ly=cy+Math.sin(ang2)*(r+18);
    ctx.fillText(axes[b],lx,ly);
  }
  ctx.beginPath();ctx.fillStyle=era.color.replace(')',',0.25)').replace('rgb','rgba');
  ctx.strokeStyle=era.color;ctx.lineWidth=2;
  for(var c=0;c<6;c++){
    var ang3=-Math.PI/2+c*Math.PI/3;
    var vx=cx+Math.cos(ang3)*r*vals[c]/5,vy=cy+Math.sin(ang3)*r*vals[c]/5;
    if(c===0)ctx.moveTo(vx,vy);else ctx.lineTo(vx,vy);
  }
  ctx.closePath();ctx.fill();ctx.stroke();
  var infoX=340,infoY=70;
  ctx.textAlign='left';ctx.fillStyle='#daa520';ctx.font='bold 11px sans-serif';
  ctx.fillText('Bowing:',infoX,infoY);ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.fillText(era.bow,infoX+60,infoY);
  ctx.fillStyle='#daa520';ctx.font='bold 11px sans-serif';
  ctx.fillText('Vibrato:',infoX,infoY+22);ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.fillText(era.vib,infoX+60,infoY+22);
  ctx.fillStyle='#daa520';ctx.font='bold 11px sans-serif';
  ctx.fillText('Dynamics:',infoX,infoY+44);ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.fillText(era.dyn,infoX+70,infoY+44);
  ctx.fillStyle='#daa520';ctx.font='bold 11px sans-serif';
  ctx.fillText('Ornament:',infoX,infoY+66);ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.fillText(era.orn,infoX+70,infoY+66);
  ctx.fillStyle='#daa520';ctx.font='bold 11px sans-serif';
  ctx.fillText('Tone:',infoX,infoY+88);ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.fillText(era.tone,infoX+60,infoY+88);
  ctx.fillStyle='#daa520';ctx.font='bold 11px sans-serif';
  ctx.fillText('Position:',infoX,infoY+110);ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.fillText(era.pos,infoX+65,infoY+110);
  ctx.fillStyle='#daa520';ctx.font='bold 11px sans-serif';
  ctx.fillText('Composers:',infoX,infoY+140);ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';
  var compLines=era.composers.match(/.{1,30}/g)||[era.composers];
  compLines.forEach(function(line,li){ctx.fillText(line,infoX,infoY+156+li*14);});
  var tlY=H-30;
  var tlX1=40,tlX2=W-40,tlW=tlX2-tlX1;
  ctx.strokeStyle='rgba(255,215,0,.2)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(tlX1,tlY);ctx.lineTo(tlX2,tlY);ctx.stroke();
  var years=[1600,1700,1750,1820,1880,1920,1960,2026];
  years.forEach(function(y){
    var px=tlX1+(y-1600)/(2026-1600)*tlW;
    ctx.fillStyle='rgba(200,190,160,.3)';ctx.font='8px sans-serif';ctx.textAlign='center';
    ctx.fillText(y,px,tlY+12);
    ctx.beginPath();ctx.arc(px,tlY,2,0,Math.PI*2);ctx.fill();
  });
  var eraIdx=eraState.selected;
  var eraStarts=[1600,1750,1820,1880,1900,1960];
  var eraEnds=[1750,1820,1900,1920,1960,2026];
  var sx=tlX1+(eraStarts[eraIdx]-1600)/(2026-1600)*tlW;
  var ex=tlX1+(eraEnds[eraIdx]-1600)/(2026-1600)*tlW;
  ctx.fillStyle=era.color;ctx.globalAlpha=.3;
  ctx.fillRect(sx,tlY-6,ex-sx,12);ctx.globalAlpha=1;
  var info=document.getElementById('eraGuideInfo');
  if(info)info.innerHTML='<b style="color:'+era.color+'">'+era.key+'</b><br>'+era.composers+'<br>Bowing: '+era.bow+' | Vibrato: '+era.vib;
}

/* ─── 7. TECHNIQUE SPECTRUM ANALYZER Canvas 580x360 ─── */
var TECHNIQUES=[
  {name:'Detaché',cat:'Bowing',maxLv:5},{name:'Legato',cat:'Bowing',maxLv:5},
  {name:'Spiccato',cat:'Bowing',maxLv:5},{name:'Staccato',cat:'Bowing',maxLv:5},
  {name:'Vibrato',cat:'Left Hand',maxLv:5},{name:'Trill',cat:'Left Hand',maxLv:5},
  {name:'Shifting',cat:'Left Hand',maxLv:5},{name:'Double Stops',cat:'Left Hand',maxLv:5},
  {name:'Harmonics',cat:'Advanced',maxLv:5},{name:'Pizzicato',cat:'Advanced',maxLv:5},
  {name:'Col Legno',cat:'Advanced',maxLv:5},{name:'Sul Ponticello',cat:'Advanced',maxLv:5}
];
var techState={levels:[3,4,3,2,4,3,3,2,2,3,1,1]};
function createTechSpecPanel(){
  var d=document.createElement('div');d.id='techSpecPanel';
  d.innerHTML='<span class="v18Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>🔬 &#53580;&#53356;&#45769; &#49828;&#54169;&#53944;&#47100; &#48516;&#49437;&#44592;</h3>'+
    '<canvas id="techSpecCanvas" width="580" height="360"></canvas>'+
    '<div class="v18Info">&#44033; &#53580;&#53356;&#45769;&#51012; &#53364;&#47533;&#54616;&#50668; &#47112;&#48296;&#51012; &#51312;&#51208;&#54616;&#49464;&#50836; (1-5). &#45804;&#49457; &#49884; &#50629;&#51201; &#54925;&#46301;!</div>'+
    '<div class="v18Grid" id="techGrid"></div>';
  document.body.appendChild(d);
  var prog=loadProgress();
  if(prog.v18_techLevels)techState.levels=prog.v18_techLevels;
  var grid=d.querySelector('#techGrid');
  TECHNIQUES.forEach(function(t,i){
    var c=document.createElement('div');c.className='v18Card';
    c.id='techCard_'+i;
    c.innerHTML=t.name+' <span style="color:#ffd700">Lv.'+techState.levels[i]+'</span><br><span style="font-size:9px;color:#888">'+t.cat+'</span>';
    c.onclick=function(){
      techState.levels[i]=(techState.levels[i]%5)+1;
      c.innerHTML=t.name+' <span style="color:#ffd700">Lv.'+techState.levels[i]+'</span><br><span style="font-size:9px;color:#888">'+t.cat+'</span>';
      saveProgress({v18_techLevels:techState.levels});
      drawTechSpecCanvas();v18Sfx('tech_analyze');
      if(techState.levels.every(function(l){return l>=3;}))unlockAch('tech_spectrum');
    };
    grid.appendChild(c);
  });
}
function drawTechSpecCanvas(){
  var cv=document.getElementById('techSpecCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('Technique Spectrum Analyzer',W/2,24);
  var barW=34,gap=8,startX=30,barMaxH=200,baseY=280;
  var catColors={Bowing:'#ff6644','Left Hand':'#4dd0e1',Advanced:'#ab47bc'};
  for(var i=0;i<12;i++){
    var x=startX+i*(barW+gap);
    var h=techState.levels[i]/5*barMaxH;
    var col=catColors[TECHNIQUES[i].cat];
    var grd=ctx.createLinearGradient(x,baseY-h,x,baseY);
    grd.addColorStop(0,col);grd.addColorStop(1,'rgba(0,0,0,.3)');
    ctx.fillStyle=grd;ctx.beginPath();ctx.roundRect(x,baseY-h,barW,h,4);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
    ctx.fillText(techState.levels[i],x+barW/2,baseY-h-8);
    ctx.save();ctx.translate(x+barW/2,baseY+12);ctx.rotate(Math.PI/4);
    ctx.fillStyle='#c9a96e';ctx.font='9px sans-serif';ctx.textAlign='left';
    ctx.fillText(TECHNIQUES[i].name,0,0);ctx.restore();
  }
  for(var lv=1;lv<=5;lv++){
    var y=baseY-lv/5*barMaxH;
    ctx.strokeStyle='rgba(255,215,0,.08)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(startX-5,y);ctx.lineTo(startX+12*(barW+gap),y);ctx.stroke();
    ctx.fillStyle='rgba(200,190,160,.3)';ctx.font='9px sans-serif';ctx.textAlign='right';
    ctx.fillText('Lv.'+lv,startX-8,y+3);
  }
  var avg=techState.levels.reduce(function(s,v){return s+v;},0)/12;
  var grade=avg>=4.5?'S':avg>=3.8?'A':avg>=3?'B':avg>=2?'C':'D';
  ctx.fillStyle='#ffd700';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
  ctx.fillText('Overall: '+grade,W/2,baseY+55);
  ctx.font='10px sans-serif';ctx.fillStyle='rgba(200,190,160,.5)';
  ctx.fillText('Average: '+avg.toFixed(1)+'/5.0',W/2,baseY+72);
  var cats=['Bowing','Left Hand','Advanced'];
  cats.forEach(function(cat,ci){
    var sum=0,cnt=0;
    TECHNIQUES.forEach(function(t,ti){if(t.cat===cat){sum+=techState.levels[ti];cnt++;}});
    ctx.fillStyle=catColors[cat];ctx.font='9px sans-serif';
    ctx.fillText(cat+': '+(sum/cnt).toFixed(1),140+ci*120,baseY+88);
  });
}

/* ─── 8. PRACTICE IMPACT DASHBOARD Canvas 600x400 ─── */
var practDashState={days:[],metrics:['Accuracy','Speed','Expression','Stamina','Focus']};
function createPracticeDashPanel(){
  var d=document.createElement('div');d.id='practiceDashPanel';
  d.innerHTML='<span class="v18Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>📊 &#50672;&#49845; &#49457;&#44284; &#45824;&#49884;&#48372;&#46300;</h3>'+
    '<canvas id="practiceDashCanvas" width="600" height="400"></canvas>'+
    '<div class="v18Info">7&#51068;&#44036; &#50672;&#49845; &#49457;&#44284;&#47484; 5&#44060; &#51648;&#54364;&#47196; &#52628;&#51201;&#54633;&#45768;&#45796;. &#44033; &#45216;&#51676;&#47484; &#53364;&#47533;&#54644; &#49457;&#44284;&#47484; &#44592;&#47197;&#54616;&#49464;&#50836;.</div>'+
    '<div style="margin:6px;display:flex;gap:6px;flex-wrap:wrap;justify-content:center">'+
    '<span class="v18Btn" onclick="logPracticeDay()">&#43; &#50724;&#45720; &#44592;&#47197;</span>'+
    '<span class="v18Btn" onclick="resetPracticeDash()">&#8634; &#52488;&#44592;&#54868;</span></div>';
  document.body.appendChild(d);
  var prog=loadProgress();
  if(prog.v18_pracDays)practDashState.days=prog.v18_pracDays;
}
window.logPracticeDay=function(){
  var day={date:new Date().toLocaleDateString('ko-KR'),vals:[]};
  for(var i=0;i<5;i++)day.vals.push(50+Math.floor(Math.random()*51));
  practDashState.days.push(day);
  if(practDashState.days.length>7)practDashState.days=practDashState.days.slice(-7);
  saveProgress({v18_pracDays:practDashState.days});
  drawPracticeDashCanvas();v18Sfx('practice_log');
  addHistory('practice','Practice logged: '+day.vals.join('/'));
  if(practDashState.days.length>=7)unlockAch('practice_guru');
};
window.resetPracticeDash=function(){practDashState.days=[];saveProgress({v18_pracDays:[]});drawPracticeDashCanvas();};
function drawPracticeDashCanvas(){
  var cv=document.getElementById('practiceDashCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('Practice Impact Dashboard',W/2,24);
  if(practDashState.days.length===0){
    ctx.fillStyle='#888';ctx.font='12px sans-serif';
    ctx.fillText('No data yet. Click + to log today.',W/2,H/2);return;
  }
  var chartX=60,chartY=60,chartW=480,chartH=250;
  ctx.strokeStyle='rgba(255,215,0,.1)';ctx.lineWidth=1;
  for(var g=0;g<=100;g+=25){
    var gy=chartY+chartH-g/100*chartH;
    ctx.beginPath();ctx.moveTo(chartX,gy);ctx.lineTo(chartX+chartW,gy);ctx.stroke();
    ctx.fillStyle='rgba(200,190,160,.3)';ctx.font='9px sans-serif';ctx.textAlign='right';
    ctx.fillText(g,chartX-6,gy+3);
  }
  var colors=['#ff6644','#ffd700','#ab47bc','#4dd0e1','#66bb6a'];
  var days=practDashState.days;
  for(var m=0;m<5;m++){
    ctx.beginPath();ctx.strokeStyle=colors[m];ctx.lineWidth=2;
    for(var d=0;d<days.length;d++){
      var dx=chartX+d*chartW/(Math.max(days.length-1,1));
      var dy=chartY+chartH-days[d].vals[m]/100*chartH;
      if(d===0)ctx.moveTo(dx,dy);else ctx.lineTo(dx,dy);
    }
    ctx.stroke();
    for(var d2=0;d2<days.length;d2++){
      var dx2=chartX+d2*chartW/(Math.max(days.length-1,1));
      var dy2=chartY+chartH-days[d2].vals[m]/100*chartH;
      ctx.fillStyle=colors[m];ctx.beginPath();ctx.arc(dx2,dy2,3,0,Math.PI*2);ctx.fill();
    }
  }
  for(var d3=0;d3<days.length;d3++){
    var dx3=chartX+d3*chartW/(Math.max(days.length-1,1));
    ctx.fillStyle='#c9a96e';ctx.font='8px sans-serif';ctx.textAlign='center';
    ctx.fillText(days[d3].date.slice(-5),dx3,chartY+chartH+16);
  }
  var legY=chartY+chartH+36;
  practDashState.metrics.forEach(function(m2,mi){
    ctx.fillStyle=colors[mi];ctx.beginPath();ctx.arc(60+mi*110,legY,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.textAlign='left';
    ctx.fillText(m2,68+mi*110,legY+4);
  });
  var latest=days[days.length-1].vals;
  var avgScore=Math.round(latest.reduce(function(s,v){return s+v;},0)/5);
  var grade=avgScore>=90?'S':avgScore>=75?'A':avgScore>=60?'B':avgScore>=40?'C':'D';
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('Today: '+grade+' ('+avgScore+'/100)',W/2,legY+28);
}

/* ─── 9. FAMOUS PIECE TOURNAMENT Canvas 560x360 ─── */
var TOURNEY_PIECES=[
  'Bach Chaconne','Mendelssohn Concerto','Tchaikovsky Concerto','Brahms Concerto',
  'Sibelius Concerto','Paganini Caprice 24','Bruch Concerto','Beethoven Violin Concerto',
  'Vivaldi Four Seasons','Mozart Concerto 5','Sarasate Carmen Fantasy','Lalo Symphonie Esp.',
  'Saint-Saens Intro Rondo','Wieniawski Concerto 2','Kreisler Liebesleid','Elgar Salut d\'Amour'
];
var tourneyState={bracket:[],round:0,matchIdx:0,wins:0,completions:0};
function createTourneyPanel(){
  var d=document.createElement('div');d.id='tourneyPanel';
  d.innerHTML='<span class="v18Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>🏆 &#47749;&#44257; &#53664;&#45320;&#47676;&#53944;</h3>'+
    '<canvas id="tourneyCanvas" width="560" height="360"></canvas>'+
    '<div class="v18Info">16&#44257;&#51060; &#53664;&#45320;&#47676;&#53944; &#48169;&#49885;&#51004;&#47196; &#45824;&#44208;&#54633;&#45768;&#45796;. &#51339;&#50500;&#54616;&#45716; &#44257;&#51012; &#53364;&#47533;&#54616;&#50668; &#49440;&#53469;&#54616;&#49464;&#50836;!</div>'+
    '<div id="tourneyMatch" style="margin:6px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap"></div>'+
    '<div style="margin:4px"><span class="v18Btn" onclick="startTourney()">&#9654; &#49352; &#53664;&#45320;&#47676;&#53944;</span></div>';
  document.body.appendChild(d);
}
window.startTourney=function(){
  var shuffled=TOURNEY_PIECES.slice().sort(function(){return Math.random()-.5;});
  tourneyState.bracket=[shuffled];tourneyState.round=0;tourneyState.matchIdx=0;
  showTourneyMatch();drawTourneyCanvas();
};
function showTourneyMatch(){
  var div=document.getElementById('tourneyMatch');if(!div)return;
  var current=tourneyState.bracket[tourneyState.round];
  if(!current||tourneyState.matchIdx*2>=current.length){
    if(current&&current.length<=1){
      div.innerHTML='<div style="color:#ffd700;font-size:14px;font-weight:bold">Champion: '+current[0]+'</div>';
      tourneyState.completions++;
      if(tourneyState.completions>=3)unlockAch('tourney_champ');
      v18Sfx('tourney_win');
      addHistory('tournament','Champion: '+current[0]);
      saveProgress({v18_tourneyCompletions:tourneyState.completions});return;
    }
    tourneyState.round++;tourneyState.matchIdx=0;
    showTourneyMatch();return;
  }
  var a=current[tourneyState.matchIdx*2],b=current[tourneyState.matchIdx*2+1];
  if(!b){
    if(!tourneyState.bracket[tourneyState.round+1])tourneyState.bracket.push([]);
    tourneyState.bracket[tourneyState.round+1].push(a);
    tourneyState.matchIdx++;showTourneyMatch();return;
  }
  div.innerHTML='<span class="v18Btn" style="padding:10px 20px;font-size:12px" onclick="pickTourney(0)">'+a+'</span>'+
    '<span style="color:#ffd700;font-size:16px;font-weight:bold">VS</span>'+
    '<span class="v18Btn" style="padding:10px 20px;font-size:12px" onclick="pickTourney(1)">'+b+'</span>';
}
window.pickTourney=function(choice){
  var current=tourneyState.bracket[tourneyState.round];
  var winner=current[tourneyState.matchIdx*2+choice];
  if(!tourneyState.bracket[tourneyState.round+1])tourneyState.bracket.push([]);
  tourneyState.bracket[tourneyState.round+1].push(winner);
  tourneyState.matchIdx++;v18Sfx('lineage_tap');
  showTourneyMatch();drawTourneyCanvas();
};
function drawTourneyCanvas(){
  var cv=document.getElementById('tourneyCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('Famous Piece Tournament',W/2,24);
  var rounds=['R16','QF','SF','Final','Champion'];
  ctx.font='9px sans-serif';ctx.fillStyle='rgba(200,190,160,.5)';
  rounds.forEach(function(r,i){ctx.fillText(r,60+i*120,44);});
  for(var ri=0;ri<tourneyState.bracket.length;ri++){
    var pieces=tourneyState.bracket[ri];
    var colX=20+ri*120;
    var slotH=Math.max(H-60,200)/(pieces.length||1);
    pieces.forEach(function(p,pi){
      var y=60+pi*slotH+slotH/2;
      ctx.fillStyle=ri===tourneyState.bracket.length-1&&pieces.length===1?'#ffd700':'#c9a96e';
      ctx.font=(ri===tourneyState.bracket.length-1?'bold ':'')+((9-ri)+'px sans-serif');
      ctx.textAlign='left';
      var displayName=p.length>16?p.substring(0,16)+'...':p;
      ctx.fillText(displayName,colX,y);
      if(ri<tourneyState.bracket.length-1){
        ctx.strokeStyle='rgba(255,215,0,.1)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(colX+100,y-2);ctx.lineTo(colX+120,y-2);ctx.stroke();
      }
    });
  }
  ctx.fillStyle='rgba(200,190,160,.3)';ctx.font='9px sans-serif';ctx.textAlign='center';
  ctx.fillText('Completions: '+tourneyState.completions,W/2,H-10);
}

/* ─── 10. STRING INSTRUMENT LINEAGE Canvas 580x340 ─── */
var LINEAGE=[
  {name:'Rebec (&#47112;&#48289;)',era:'10-15C',desc:'&#51473;&#49464; &#50500;&#46989; &#52636;&#49888;, 3&#54788;, &#54876;&#47196; &#50672;&#51452;',x:50,y:60},
  {name:'Vielle (&#48708;&#50648;)',era:'12-15C',desc:'&#51473;&#49464; &#50976;&#47101; &#54588;&#46308; &#50501;&#44592;, 5&#54788;',x:170,y:60},
  {name:'Lira da Braccio',era:'15-16C',desc:'&#47476;&#45348;&#49345;&#49828; &#48148;&#51060;&#50732;&#47536;&#51032; &#51204;&#49888;, 7&#54788;',x:290,y:60},
  {name:'Viola da Gamba',era:'15-18C',desc:'&#47924;&#47502; &#49324;&#51060; &#50501;&#44592;, 6&#54788;, &#54532;&#47131;',x:50,y:160},
  {name:'Violin (&#48148;&#51060;&#50732;&#47536;)',era:'16C-',desc:'&#53356;&#47112;&#47784;&#45208; 1550&#45380;&#45824;, 4&#54788;, &#53556;&#50500;&#47000;',x:290,y:160},
  {name:'Viola (&#48708;&#50732;&#46972;)',era:'16C-',desc:'&#48148;&#51060;&#50732;&#47536;&#48372;&#45796; 5&#46020; &#45230;&#51008; &#51312;&#50984;',x:170,y:260},
  {name:'Cello (&#52412;&#47196;)',era:'16C-',desc:'&#48148;&#46300; &#44036; &#50501;&#44592;, C-G-D-A &#51312;&#50984;',x:410,y:260},
  {name:'Double Bass',era:'16C-',desc:'&#50724;&#52992;&#49828;&#53944;&#46972;&#51032; &#44592;&#52488;, &#44032;&#51109; &#45230;&#51008; &#54788;&#50501;&#44592;',x:530,y:260}
];
var LINEAGE_LINKS=[[0,4],[1,4],[2,4],[3,5],[4,5],[4,6],[3,7],[6,7]];
function createLineagePanel(){
  var d=document.createElement('div');d.id='lineagePanel';
  d.innerHTML='<span class="v18Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>🎻 &#54788;&#50501;&#44592; &#44228;&#48372;&#46020;</h3>'+
    '<canvas id="lineageCanvas" width="580" height="340"></canvas>'+
    '<div class="v18Info" id="lineageInfo">&#47112;&#48289;&#50640;&#49436; &#54788;&#45824; &#48148;&#51060;&#50732;&#47536;&#44620;&#51648;&#51032; &#51652;&#54868;&#47484; &#50508;&#50500;&#48372;&#49464;&#50836;. &#44033; &#50501;&#44592;&#47484; &#53364;&#47533;&#54616;&#47732; &#49345;&#49464; &#51221;&#48372;&#47484; &#48380; &#49688; &#51080;&#49845;&#45768;&#45796;.</div>';
  document.body.appendChild(d);
  var cvEl=d.querySelector('#lineageCanvas');
  cvEl.addEventListener('click',function(e){
    var rect=cvEl.getBoundingClientRect();
    var scaleX=cvEl.width/rect.width,scaleY=cvEl.height/rect.height;
    var mx=(e.clientX-rect.left)*scaleX,my=(e.clientY-rect.top)*scaleY;
    for(var i=0;i<LINEAGE.length;i++){
      var inst=LINEAGE[i];
      if(mx>inst.x-10&&mx<inst.x+130&&my>inst.y-10&&my<inst.y+50){
        var info=document.getElementById('lineageInfo');
        if(info)info.innerHTML='<b style="color:#ffd700">'+inst.name.replace(/&[^;]+;/g,'')+'</b> ('+inst.era+')<br>'+inst.desc.replace(/&[^;]+;/g,'');
        v18Sfx('lineage_tap');
        var prog=loadProgress();if(!prog.v18_lineage)prog.v18_lineage={};prog.v18_lineage[i]=1;
        saveProgress(prog);
        if(Object.keys(prog.v18_lineage).length>=8)unlockAch('lineage_expert');
        drawLineageCanvas(i);break;
      }
    }
  });
}
function drawLineageCanvas(highlight){
  var cv=document.getElementById('lineageCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('String Instrument Lineage',W/2,24);
  LINEAGE_LINKS.forEach(function(link){
    var from=LINEAGE[link[0]],to=LINEAGE[link[1]];
    ctx.strokeStyle='rgba(255,215,0,.2)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(from.x+60,from.y+35);ctx.lineTo(to.x+60,to.y);ctx.stroke();
    var mx=(from.x+to.x)/2+60,my=(from.y+35+to.y)/2;
    ctx.fillStyle='rgba(255,215,0,.15)';ctx.beginPath();ctx.arc(mx,my,3,0,Math.PI*2);ctx.fill();
  });
  LINEAGE.forEach(function(inst,i){
    var isHl=highlight===i;
    ctx.fillStyle=isHl?'rgba(255,215,0,.15)':'rgba(255,250,235,.05)';
    ctx.strokeStyle=isHl?'rgba(255,215,0,.5)':'rgba(200,190,160,.15)';
    ctx.lineWidth=isHl?2:1;
    ctx.beginPath();ctx.roundRect(inst.x,inst.y,120,35,6);ctx.fill();ctx.stroke();
    ctx.fillStyle=isHl?'#ffd700':'#c9a96e';ctx.font=(isHl?'bold ':'')+'10px sans-serif';ctx.textAlign='center';
    ctx.fillText(inst.name.replace(/\s*\(.*\)/,''),inst.x+60,inst.y+15);
    ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='8px sans-serif';
    ctx.fillText(inst.era,inst.x+60,inst.y+28);
  });
}

/* ─── 11. VIOLIN CRAFTING PROCESS Canvas 560x320 ─── */
var CRAFT_STEPS=[
  {name:'&#47785;&#51116; &#49440;&#53469;',desc:'&#44032;&#47928;&#48708;&#45208;&#47924;(&#50526;&#54032;) + &#45800;&#54413;&#45208;&#47924;(&#46263;&#54032;). 5-10&#45380; &#44148;&#51312; &#54596;&#49688;.',dur:'2-5&#45380;',icon:'🌳'},
  {name:'&#50526;&#54032; &#51312;&#44033;',desc:'&#44032;&#47928;&#48708;&#45208;&#47924;&#47484; &#50500;&#52824;&#54805; &#50500;&#52824;&#47484; &#44618;&#51060;&#54616;&#44256;, &#54637;&#51012; &#44618;&#49884;&#44256; f-hole &#50948;&#52824; &#44208;&#51221;.',dur:'2-3&#51452;',icon:'🔨'},
  {name:'f-hole &#51208;&#44060;',desc:'&#51020;&#54693;&#50640; &#44208;&#51221;&#51201; &#50689;&#54693;. &#45236;&#48512; &#53681;&#48148; &#44618;&#51060;&#50752; &#44397;&#49440;&#51060; &#51473;&#50836;.',dur:'2-3&#51068;',icon:'🎵'},
  {name:'&#48148;&#49828;&#48148; &#51228;&#51089;',desc:'&#50526;&#54032; &#50504;&#51901; &#48372;&#44053;&#51116;. &#51020;&#54693; &#51204;&#45804; &#44221;&#47196;&#47484; &#44208;&#51221;.',dur:'1&#51452;',icon:'🛠️'},
  {name:'&#46263;&#54032; &#51312;&#44033;',desc:'&#45800;&#54413;&#45208;&#47924;&#47484; &#50500;&#52824;&#54805;&#51004;&#47196; &#51312;&#44033;. &#50526;&#54032;&#48372;&#45796; &#45458;&#51008; &#50500;&#52824;.',dur:'2-3&#51452;',icon:'🔨'},
  {name:'&#47785; &#51228;&#51089;',desc:'&#45800;&#54413;&#45208;&#47924; &#54620; &#45929;&#50612;&#47532;. &#49828;&#53356;&#47204;+&#54172;&#48149;&#49828;+&#45339; &#53685;&#54633; &#44032;&#44277;.',dur:'1-2&#51452;',icon:'🦴'},
  {name:'&#51312;&#47549; &#48143; &#51217;&#54633;',desc:'&#50526;&#54032;+&#46263;&#54032;+&#47785;+&#51648;&#54032;+&#50504;&#48152; &#51217;&#54633;. &#44396;&#51312; &#50756;&#49457;.',dur:'1&#51452;',icon:'🧩'},
  {name:'&#48148;&#45768;&#49884; &#46020;&#54252;',desc:'&#48372;&#54840;+&#51020;&#54693;+&#48120;&#44288;. 20-30&#54924; &#45796;&#52789; &#46020;&#54252;. &#49828;&#53944;&#46972;&#46356;&#48148;&#47532; &#48708;&#48277;.',dur:'3-6&#51452;',icon:'🎨'},
  {name:'&#48652;&#47551;&#51648; &#49444;&#52824;',desc:'&#54788;&#51032; &#51652;&#46041;&#51012; &#48148;&#46356;&#47196; &#51204;&#45804;. &#50948;&#52824;&#50752; &#44033;&#46020;&#44032; &#51020;&#54693; &#44208;&#51221;.',dur:'1&#51068;',icon:'🌉'},
  {name:'&#49324;&#50868;&#46300;&#54252;&#49828;&#53944; &#49444;&#52824;',desc:'&#48148;&#46356; &#50504;&#51901; &#50526;/&#46263;&#54032; &#50672;&#44208;. &#50948;&#52824;&#44032; &#51020;&#54693;&#50640; &#50689;&#54693;.',dur:'30&#48516;',icon:'📍'},
  {name:'&#54788; &#44152;&#44592; &#48143; &#51312;&#50984;',desc:'G-D-A-E &#54788; &#49444;&#52824;. &#54172; &#50672;&#44208;, &#52488;&#44592; &#51312;&#50984;.',dur:'1&#49884;&#44036;',icon:'🎻'},
  {name:'&#52572;&#51333; &#51020;&#54693; &#51312;&#51221;',desc:'&#48148;&#45768;&#49884; &#44221;&#54868;, &#54788; &#44368;&#52404;, &#48652;&#47551;&#51648;/&#49324;&#50868;&#46300;&#54252;&#49828;&#53944; &#48120;&#49464;&#51312;&#51221;.',dur:'1-6&#44060;&#50900;',icon:'✨'}
];
var craftState={viewed:{}};
function createCraftPanel(){
  var d=document.createElement('div');d.id='craftPanel';
  d.innerHTML='<span class="v18Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>🔨 &#48148;&#51060;&#50732;&#47536; &#51228;&#51089; &#44277;&#51221;</h3>'+
    '<canvas id="craftCanvas" width="560" height="320"></canvas>'+
    '<div class="v18Info" id="craftInfo">12&#45800;&#44228; &#51228;&#51089; &#44284;&#51221;&#51012; &#49828;&#53485;&#48324;&#47196; &#50508;&#50500;&#48372;&#49464;&#50836;. &#44033; &#45800;&#44228;&#47484; &#53364;&#47533;&#54616;&#47732; &#49345;&#49464; &#49444;&#47749;&#44284; &#49548;&#50836; &#44592;&#44036;&#51012; &#54869;&#51064;&#54624; &#49688; &#51080;&#49845;&#45768;&#45796;.</div>'+
    '<div class="v18Grid" id="craftGrid"></div>';
  document.body.appendChild(d);
  var prog=loadProgress();if(prog.v18_craft)craftState.viewed=prog.v18_craft;
  var grid=d.querySelector('#craftGrid');
  CRAFT_STEPS.forEach(function(s,i){
    var c=document.createElement('div');c.className='v18Card'+(craftState.viewed[i]?' done':'');
    c.innerHTML=s.icon+' '+(i+1)+'. '+s.name.replace(/&[^;]+;/g,function(m){var d2=document.createElement('span');d2.innerHTML=m;return d2.textContent;});
    c.onclick=function(){
      craftState.viewed[i]=1;c.classList.add('done');
      saveProgress({v18_craft:craftState.viewed});
      drawCraftCanvas(i);v18Sfx('craft_step');
      if(Object.keys(craftState.viewed).length>=12)unlockAch('craft_master');
    };
    grid.appendChild(c);
  });
}
function drawCraftCanvas(activeStep){
  var cv=document.getElementById('craftCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('Violin Crafting Process',W/2,24);
  var cols=4,rows=3,cellW=120,cellH=80,padX=30,padY=50;
  for(var i=0;i<12;i++){
    var col=i%cols,row=Math.floor(i/cols);
    var cx=padX+col*(cellW+15),cy=padY+row*(cellH+10);
    var isActive=activeStep===i;
    var isDone=!!craftState.viewed[i];
    ctx.fillStyle=isActive?'rgba(255,215,0,.12)':isDone?'rgba(76,175,80,.06)':'rgba(255,250,235,.04)';
    ctx.strokeStyle=isActive?'rgba(255,215,0,.5)':isDone?'rgba(76,175,80,.3)':'rgba(200,190,160,.12)';
    ctx.lineWidth=isActive?2:1;
    ctx.beginPath();ctx.roundRect(cx,cy,cellW,cellH,6);ctx.fill();ctx.stroke();
    ctx.fillStyle=isActive?'#ffd700':'#c9a96e';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText((i+1)+'',cx+cellW/2,cy+18);
    var stepName=CRAFT_STEPS[i].name;
    var tmp=document.createElement('span');tmp.innerHTML=stepName;stepName=tmp.textContent;
    if(stepName.length>8)stepName=stepName.substring(0,8)+'..';
    ctx.font='9px sans-serif';ctx.fillText(stepName,cx+cellW/2,cy+35);
    var durText=CRAFT_STEPS[i].dur;tmp.innerHTML=durText;durText=tmp.textContent;
    ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='8px sans-serif';
    ctx.fillText(durText,cx+cellW/2,cy+50);
    if(isDone){ctx.fillStyle='rgba(76,175,80,.6)';ctx.font='14px sans-serif';ctx.fillText('✓',cx+cellW/2,cy+68);}
    if(i<11){
      var nextCol=(i+1)%cols,nextRow=Math.floor((i+1)/cols);
      if(nextRow===row){
        ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(cx+cellW,cy+cellH/2);ctx.lineTo(cx+cellW+15,cy+cellH/2);ctx.stroke();
      }
    }
  }
  if(typeof activeStep==='number'){
    var step=CRAFT_STEPS[activeStep];
    var info=document.getElementById('craftInfo');
    if(info){
      var tmp2=document.createElement('span');
      tmp2.innerHTML=step.name;var sn=tmp2.textContent;
      tmp2.innerHTML=step.desc;var sd=tmp2.textContent;
      tmp2.innerHTML=step.dur;var sdur=tmp2.textContent;
      info.innerHTML='<b style="color:#ffd700">'+step.icon+' '+(activeStep+1)+'. '+sn+'</b><br>'+sd+'<br><span style="color:#daa520">Duration: '+sdur+'</span>';
    }
  }
  var completed=Object.keys(craftState.viewed).length;
  ctx.fillStyle='#c9a96e';ctx.font='10px sans-serif';ctx.textAlign='center';
  ctx.fillText('Progress: '+completed+'/12 ('+Math.round(completed/12*100)+'%)',W/2,H-10);
}

/* ─── 12. QUIZ v18 ─── */
var quizV18State={current:0,score:0,answered:[]};
function createQuizV18Panel(){
  var d=document.createElement('div');d.id='quizV18Panel';
  d.innerHTML='<span class="v18Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>🧠 &#48148;&#51060;&#50732;&#47536; &#53804;&#51592; v18</h3>'+
    '<div id="quizV18Content" style="width:100%;max-width:480px;margin:8px 0"></div>'+
    '<div style="margin:6px"><span class="v18Btn" onclick="startQuizV18()">&#9654; &#49884;&#51089;</span></div>';
  document.body.appendChild(d);
}
window.startQuizV18=function(){quizV18State={current:0,score:0,answered:[]};showQuizV18Q();};
function showQuizV18Q(){
  var div=document.getElementById('quizV18Content');if(!div)return;
  if(quizV18State.current>=V18_QUIZ.length){
    var pct=Math.round(quizV18State.score/V18_QUIZ.length*100);
    var grade=pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';
    div.innerHTML='<div style="text-align:center;padding:20px">'+
      '<div style="font-size:20px;color:#ffd700;font-weight:bold">'+grade+'</div>'+
      '<div style="color:#c9a96e;margin:8px">'+quizV18State.score+'/'+V18_QUIZ.length+' ('+pct+'%)</div></div>';
    addHistory('quiz','v18 quiz: '+quizV18State.score+'/'+V18_QUIZ.length);
    saveProgress({v18_quizScore:quizV18State.score});
    if(quizV18State.score>=13)unlockAch('quiz_130');
    return;
  }
  var q=V18_QUIZ[quizV18State.current];
  var html='<div style="color:#ffd700;font-size:12px;margin-bottom:8px">Q'+(quizV18State.current+1)+'/'+V18_QUIZ.length+'</div>';
  var tmp=document.createElement('span');tmp.innerHTML=q.q;
  html+='<div style="color:#c9a96e;font-size:12px;margin-bottom:10px">'+tmp.textContent+'</div>';
  q.a.forEach(function(a,i){
    tmp.innerHTML=a;
    html+='<div class="v18Card" onclick="answerQuizV18('+i+')" style="text-align:center">'+tmp.textContent+'</div>';
  });
  div.innerHTML=html;
}
window.answerQuizV18=function(idx){
  if(idx===V18_QUIZ[quizV18State.current].c){quizV18State.score++;v18Sfx('quiz_v18');}
  else{v18Sfx('fifth_miss');}
  quizV18State.current++;showQuizV18Q();
};

/* ─── 13. REGISTER SONGS, LESSONS ─── */
(function registerV18Content(){
  if(typeof window.SONG_DB==='undefined')window.SONG_DB=[];
  V18_SONGS.forEach(function(s){
    if(!window.SONG_DB.find(function(x){return x.id===s.id;})){
      window.SONG_DB.push({id:s.id,title:s.title,difficulty:s.diff,genre:s.genre,
        notes:[{note:'A4',dur:500},{note:'B4',dur:500},{note:'C5',dur:700},{note:'D5',dur:500},{note:'E5',dur:800},
               {note:'D5',dur:500},{note:'C5',dur:700},{note:'B4',dur:500},{note:'A4',dur:1000}]
      });
    }
  });
  if(typeof window.LESSON_DB==='undefined')window.LESSON_DB=[];
  V18_LESSONS.forEach(function(l){
    if(!window.LESSON_DB.find(function(x){return x.id===l.id;})){
      window.LESSON_DB.push(l);
    }
  });
})();

/* ─── 14. KEYBOARD SHORTCUTS ─── */
document.addEventListener('keydown',function(e){
  if(!e.shiftKey)return;
  var panels={
    'B':function(){var p=document.getElementById('bowDistPanel');if(p){p.classList.toggle('show');if(p.classList.contains('show'))drawBowDistCanvas();}},
    'T':function(){var p=document.getElementById('fifthTunePanel');if(p){p.classList.toggle('show');if(p.classList.contains('show'))drawFifthCanvas();}},
    'E':function(){var p=document.getElementById('eraGuidePanel');if(p){p.classList.toggle('show');if(p.classList.contains('show'))drawEraCanvas();}},
    'K':function(){var p=document.getElementById('techSpecPanel');if(p){p.classList.toggle('show');if(p.classList.contains('show'))drawTechSpecCanvas();}},
    'D':function(){var p=document.getElementById('practiceDashPanel');if(p){p.classList.toggle('show');if(p.classList.contains('show'))drawPracticeDashCanvas();}},
    'N':function(){var p=document.getElementById('tourneyPanel');if(p){p.classList.toggle('show');if(p.classList.contains('show'))drawTourneyCanvas();}},
    'L':function(){var p=document.getElementById('lineagePanel');if(p){p.classList.toggle('show');if(p.classList.contains('show'))drawLineageCanvas();}},
    'V':function(){var p=document.getElementById('craftPanel');if(p){p.classList.toggle('show');if(p.classList.contains('show'))drawCraftCanvas();}},
  };
  var fn=panels[e.key.toUpperCase()];
  if(fn){e.preventDefault();fn();v18Sfx('era_select');}
});

/* ─── 15. INIT PANELS ─── */
createBowDistPanel();
createFifthTunePanel();
createEraGuidePanel();
createTechSpecPanel();
createPracticeDashPanel();
createTourneyPanel();
createLineagePanel();
createCraftPanel();
createQuizV18Panel();

/* ─── 16. NAVIGATION BUTTONS (appended to existing v17 nav if present) ─── */
(function addV18Nav(){
  var existing=document.querySelector('.v17Nav');
  var nav;
  if(existing){nav=existing;}
  else{
    var navs=document.querySelectorAll('[class*="Nav"]');
    for(var i=navs.length-1;i>=0;i--){
      if(navs[i].style&&navs[i].style.position==='fixed'&&navs[i].style.bottom==='0px'){nav=navs[i];break;}
    }
  }
  var btns=[
    {label:'🏹 &#54876;&#48176;&#48516;',panel:'bowDistPanel',draw:drawBowDistCanvas},
    {label:'🔔 5&#46020;&#53916;&#45789;',panel:'fifthTunePanel',draw:drawFifthCanvas},
    {label:'📚 &#49884;&#45824;&#44032;&#51060;&#46300;',panel:'eraGuidePanel',draw:drawEraCanvas},
    {label:'🔬 &#53580;&#53356;&#45769;',panel:'techSpecPanel',draw:drawTechSpecCanvas},
    {label:'📊 &#50672;&#49845;&#49457;&#44284;',panel:'practiceDashPanel',draw:drawPracticeDashCanvas},
    {label:'🏆 &#47749;&#44257;&#53664;&#45320;',panel:'tourneyPanel',draw:drawTourneyCanvas},
    {label:'🎻 &#44228;&#48372;&#46020;',panel:'lineagePanel',draw:drawLineageCanvas},
    {label:'🔨 &#51228;&#51089;&#44277;&#51221;',panel:'craftPanel',draw:drawCraftCanvas},
    {label:'🧠 &#53804;&#51592;v18',panel:'quizV18Panel',draw:null}
  ];
  if(nav){
    btns.forEach(function(b){
      var btn=document.createElement('span');
      btn.className=nav.children[0]?nav.children[0].className:'v17NavBtn';
      btn.innerHTML=b.label;
      btn.onclick=function(){
        var p=document.getElementById(b.panel);if(p){p.classList.toggle('show');if(p.classList.contains('show')&&b.draw)b.draw();}
        v18Sfx('era_select');
      };
      nav.appendChild(btn);
    });
  }
})();

/* ─── 17. V18 EXPLORER ACHIEVEMENT ─── */
(function checkV18Explorer(){
  setTimeout(function(){
    var prog=loadProgress();
    var feats=[prog.v18_bowdist,prog.v18_fifth,prog.v18_eras,prog.v18_techLevels,
               prog.v18_pracDays,prog.v18_tourneyCompletions,prog.v18_lineage,prog.v18_craft];
    var used=feats.filter(function(f){return !!f;}).length;
    if(used>=8)unlockAch('v18_explorer');
  },2000);
})();

/* ─── 18. STATISTICS AND TRACKING ─── */
(function trackV18Stats(){
  var stats=loadProgress();
  if(!stats.v18_first_open){
    stats.v18_first_open=Date.now();
    saveProgress(stats);
  }
  var totalSongs=154,totalLessons=180,totalQuiz=135,totalAch=166;
  if(typeof window.violinStats==='undefined')window.violinStats={};
  window.violinStats.v18={songs:totalSongs,lessons:totalLessons,quiz:totalQuiz,achievements:totalAch,features:8};
})();

/* ─── 19. CONSOLE BANNER ─── */
console.log('%c♪ Violin Real v18.0 loaded ♪','color:#ffd700;font-size:14px;font-weight:bold;background:#1a1020;padding:4px 12px;border-radius:4px;');
console.log('%cv18: Bow Distribution | 5th Tuning | Era Guide | Tech Spectrum | Practice Dashboard | Tournament | Lineage | Crafting','color:#c9a96e;font-size:10px;');
console.log('%c10songs+10lessons+15quiz+12achievements (total 154/180/135/166)','color:#c9a96e;font-size:10px;');

window.VIOLIN_VERSION='18.0';
})();
