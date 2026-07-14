/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v19.0 PATCH MODULE
   비브라토깊이분석기Canvas580x360(6유형속도폭균일성)+오케스트라석차시뮬레이터Canvas600x380(4섹션배치)+
   바이올린명인비교기Canvas600x380(10명인6축DualRadar)+음정진행맵Canvas580x360(7포지션히트맵)+
   연습루틴생성기Canvas580x340(시간레벨맞춤자동생성)+현교체가이드Canvas560x340(8현비교Bar)+
   무대매너코치Canvas580x360(12팁프로그레스)+음악감상일지Canvas600x380(곡별감상대시보드)+
   10곡추가(154→164)+10레슨(180→190)+15퀴즈(135→150)+
   12업적(166→178)+SFX12종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V19Patch(){'use strict';

/* ─── 0. GUARD ─── */
if(window.__V19_LOADED)return;window.__V19_LOADED=true;

/* ─── HELPERS ─── */
function loadProgress(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function saveProgress(p){var old=loadProgress();Object.assign(old,p);localStorage.setItem('violinProgress',JSON.stringify(old));}
function loadAchievements(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function unlockAch(id){
  var achs=loadAchievements();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  var info=V19_ACHS.find(function(a){return a.id===id;});
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
var actx19=null;
function v19Sfx(type){
  try{
    if(!actx19)actx19=new(window.AudioContext||window.webkitAudioContext)();
    var o=actx19.createOscillator(),g=actx19.createGain();
    o.connect(g);g.connect(actx19.destination);
    var now=actx19.currentTime;
    var presets={
      vibrato_pulse:{f:440,w:'sine',a:.12,d:.5},
      vibrato_wide:{f:220,w:'triangle',a:.08,d:.4},
      orch_seat:{f:523,w:'triangle',a:.09,d:.35},
      virtuoso_compare:{f:660,w:'sine',a:.1,d:.4},
      intonation_check:{f:587,w:'triangle',a:.08,d:.3},
      routine_gen:{f:698,w:'sine',a:.1,d:.35},
      string_select:{f:494,w:'triangle',a:.08,d:.3},
      stage_tip:{f:554,w:'sine',a:.09,d:.35},
      journal_write:{f:392,w:'triangle',a:.07,d:.3},
      quiz_v19:{f:784,w:'square',a:.06,d:.2},
      quiz_wrong_v19:{f:196,w:'sawtooth',a:.05,d:.3},
      achieve_v19:{f:988,w:'triangle',a:.14,d:.6}
    };
    var p=presets[type]||presets.orch_seat;
    o.type=p.w;o.frequency.setValueAtTime(p.f,now);
    g.gain.setValueAtTime(p.a,now);g.gain.exponentialRampToValueAtTime(.001,now+p.d);
    o.start(now);o.stop(now+p.d);
  }catch(e){}
}

/* ─── 2. DATA: SONGS, LESSONS, QUIZ, ACHIEVEMENTS ─── */
var V19_SONGS=[
  {id:'s155',title:'&#52264;&#51060;&#53076;&#54532;&#49828;&#53412; &#50732;&#52768; &#49464;&#47112;&#45208;&#45936;',diff:3,genre:'&#45229;&#47564;&#51452;&#51032;'},
  {id:'s156',title:'&#48652;&#46988;&#49828; &#54757;&#44032;&#47532; &#47924;&#44257; 5&#48264;',diff:3,genre:'&#45229;&#47564;&#51452;&#51032;'},
  {id:'s157',title:'&#47560;&#49828;&#45348; &#53440;&#51060;&#49828;&#51032; &#47749;&#49345;&#44257;',diff:3,genre:'&#45229;&#47564;&#51452;&#51032;'},
  {id:'s158',title:'&#47704;&#45944;&#49828;&#51316; &#48388;&#51032; &#45432;&#47000;',diff:2,genre:'&#45229;&#47564;&#51452;&#51032;'},
  {id:'s159',title:'&#44544;&#47336;&#53356; &#51221;&#47161;&#51032; &#52632;',diff:2,genre:'&#44256;&#51204;&#51452;&#51032;'},
  {id:'s160',title:'&#49800;&#48288;&#47476;&#53944; &#50500;&#48288; &#47560;&#47532;&#50500;',diff:2,genre:'&#45229;&#47564;&#51452;&#51032;'},
  {id:'s161',title:'&#54252;&#47112; &#44980; &#51060;&#54980;&#50640;',diff:3,genre:'&#45229;&#47564;&#51452;&#51032;'},
  {id:'s162',title:'&#46972;&#48296; &#52824;&#44036;&#45712;',diff:5,genre:'&#54788;&#45824;'},
  {id:'s163',title:'&#51060;&#51088;&#51060; &#47924;&#48152;&#51452; &#49548;&#45208;&#53440; 3&#48264; &#48156;&#46972;&#46300;',diff:5,genre:'&#54788;&#45824;'},
  {id:'s164',title:'&#54532;&#47196;&#53076;&#54588;&#50696;&#54532; &#48148;&#51060;&#50732;&#47536; &#54801;&#51452;&#44257; 2&#48264;',diff:5,genre:'&#54788;&#45824;'}
];
var V19_LESSONS=[
  {id:'l181',title:'&#48708;&#48652;&#46972;&#53664; &#44618;&#51060; &#51312;&#51208;&#48277;',desc:'&#49549;&#46020;&#50752; &#54253;&#51012; &#46021;&#47549;&#51201;&#51004;&#47196; &#51312;&#51208;&#54616;&#45716; &#54984;&#47144;'},
  {id:'l182',title:'&#50724;&#52992;&#49828;&#53944;&#46972; &#49437;&#52264; &#51204;&#47029;',desc:'&#50724;&#52992;&#49828;&#53944;&#46972;&#50640;&#49436;&#51032; &#48148;&#51060;&#50732;&#47536; &#54028;&#53944; &#50669;&#54624;'},
  {id:'l183',title:'&#47749;&#51064; &#50672;&#51452; &#48516;&#49437;',desc:'&#54028;&#44032;&#45768;&#45768;&#48512;&#53552; &#55184;&#46972;&#47532; &#54620;&#44620;&#51648; 10&#47749;&#51064; &#48708;&#44368;'},
  {id:'l184',title:'&#50976;&#51221; &#51652;&#54665; &#44284;&#54617;',desc:'&#54252;&#51648;&#49496;&#48324; &#50976;&#51221; &#51221;&#54869;&#46020; &#54693;&#49345; &#44592;&#48277;'},
  {id:'l185',title:'&#47582;&#52644; &#50672;&#49845; &#47336;&#54004; &#49444;&#44228;',desc:'&#49884;&#44036;&#44284; &#47112;&#48296;&#50640; &#47582;&#45716; &#54952;&#50984;&#51201; &#50672;&#49845;&#48277;'},
  {id:'l186',title:'&#54788; &#49440;&#53469;&#51032; &#47784;&#46304; &#44163;',desc:'&#50976;&#47749; &#54788; &#48652;&#47004;&#46300;&#51032; &#53945;&#49457;&#44284; &#51020;&#49353; &#48708;&#44368;'},
  {id:'l187',title:'&#47924;&#45824; &#47588;&#45320;&#51032; &#44592;&#49696;',desc:'&#46321;&#51109;&#48512;&#53552; &#54140;&#54252;&#47676;&#49828;&#44620;&#51648; &#47924;&#45824; &#50696;&#51208;'},
  {id:'l188',title:'&#46972;&#48296; &#52824;&#44036;&#45712; &#48516;&#49437;',desc:'&#52824;&#44036;&#45712;&#51032; &#44592;&#44368;&#51201; &#50836;&#49548;&#50752; &#54644;&#49437;'},
  {id:'l189',title:'&#51060;&#51088;&#51060; &#49548;&#45208;&#53440; &#50672;&#44396;',desc:'&#47924;&#48152;&#51452; &#49548;&#45208;&#53440; 3&#48264;&#51032; &#44396;&#51312;&#50752; &#50672;&#51452;&#48277;'},
  {id:'l190',title:'v19 &#51320;&#50629;',desc:'v19 &#47784;&#46304; &#44284;&#51221; &#50756;&#47308; &#51064;&#51613;'}
];
var V19_QUIZ=[
  {q:'&#48708;&#48652;&#46972;&#53664;&#51032; &#51201;&#51221; &#49549;&#46020;&#45716; &#52488;&#45817; &#47751; &#48264;&#51064;&#44032;?',a:['5-7&#48264;','1-2&#48264;','10-15&#48264;','20&#48264; &#51060;&#49345;'],c:0},
  {q:'&#50724;&#52992;&#49828;&#53944;&#46972;&#50640;&#49436; &#51228;1&#48148;&#51060;&#50732;&#47536;&#51032; &#50669;&#54624;&#51008;?',a:['&#47708;&#47196;&#46356; &#47532;&#46300;','&#48152;&#51452;&#47564;','&#46021;&#51452;&#47564;','&#53440;&#50501;&#44592; &#50672;&#51452;'],c:0},
  {q:'&#52264;&#51060;&#53076;&#54532;&#49828;&#53412; &#50732;&#52768; &#49464;&#47112;&#45208;&#45936;&#51032; &#51312;&#49457;&#51008;?',a:['C&#51109;&#51312;','D&#45800;&#51312;','G&#51109;&#51312;','A&#45800;&#51312;'],c:0},
  {q:'&#54028;&#44032;&#45768;&#45768;&#44032; &#49324;&#50857;&#54620; &#46021;&#53945;&#54620; &#44592;&#48277;&#51008;?',a:['&#50812;&#49552; &#54588;&#52824;&#52852;&#53664;','&#45908;&#48660; &#53580;&#45432;','&#53944;&#47112;&#47792;&#47196;','&#44544;&#47532;&#49328;&#46020;&#47564;'],c:0},
  {q:'&#47560;&#49828;&#45348; &lsquo;&#53440;&#51060;&#49828;&#51032; &#47749;&#49345;&#44257;&rsquo;&#51032; &#50896;&#47000; &#50501;&#44592; &#54200;&#49457;&#51008;?',a:['&#48148;&#51060;&#50732;&#47536;+&#50724;&#52992;&#49828;&#53944;&#46972;','&#48148;&#51060;&#50732;&#47536; &#46021;&#51452;','&#54588;&#50500;&#45432;+&#48148;&#51060;&#50732;&#47536;','&#54788;&#50501;4&#51473;&#51452;'],c:0},
  {q:'&#48148;&#51060;&#50732;&#47536; &#54788;&#51012; &#44368;&#52404;&#54644;&#50556; &#54616;&#45716; &#51452;&#44592;&#51201; &#49888;&#54840;&#45716;?',a:['&#51020;&#49353; &#45916;&#53444;+&#54868;&#51020;&#47564;','&#49353;&#51060; &#48320;&#54632;','6&#44060;&#50900;&#47560;&#45796;','&#50672;&#51452;&#47560;&#45796;'],c:0},
  {q:'&#46972;&#48296; &lsquo;&#52824;&#44036;&#45712;&rsquo;&#45716; &#50612;&#45712; &#45208;&#46972; &#51020;&#50501;&#50640;&#49436; &#50689;&#44048;&#51012; &#48155;&#50520;&#45716;&#44032;?',a:['&#54757;&#44032;&#47532;(&#47204;)','&#49828;&#54168;&#51064;','&#47084;&#49884;&#50500;','&#54532;&#46993;&#49828;'],c:0},
  {q:'&#50724;&#52992;&#49828;&#53944;&#46972;&#50640;&#49436; &#53080;&#49436;&#53944;&#47560;&#49828;&#53552;&#51032; &#50669;&#54624;&#51008;?',a:['&#50724;&#52992;&#49828;&#53944;&#46972; &#53685;&#49556;/&#47532;&#46300;','&#45800;&#49692;&#55176; &#51228;1&#48148;&#51060;&#50732;&#47536;','&#51648;&#55064;&#51088;&#51032; &#48372;&#51312;','&#49548;&#47532; &#50630;&#51060; &#50672;&#51452;'],c:0},
  {q:'&#48652;&#46988;&#49828; &#54757;&#44032;&#47532; &#47924;&#44257; 5&#48264;&#51032; &#50896;&#47000; &#51312;&#49457;&#51008;?',a:['F#&#45800;&#51312;','D&#51109;&#51312;','G&#45800;&#51312;','C&#45800;&#51312;'],c:0},
  {q:'&#48148;&#51060;&#50732;&#47536;&#51032; 7&#54252;&#51648;&#49496;&#51008; &#50612;&#46356;&#50640;&#49436; &#50672;&#51452;&#54616;&#45716;&#44032;?',a:['&#47785; &#50948;&#51901; &#44032;&#51109; &#45458;&#51008; &#50948;&#52824;','&#51648;&#54032; &#44540;&#52376;','&#44536;&#47532;&#54532; &#48148;&#47196; &#50948;','&#54876; &#50948;&#50640;&#49436;'],c:0},
  {q:'&#44544;&#47336;&#53356; &lsquo;&#51221;&#47161;&#51032; &#52632;&rsquo;&#51032; &#50896;&#47000; &#50724;&#54168;&#46972; &#51228;&#47785;&#51008;?',a:['&#50724;&#47476;&#54168;&#50724;&#50640;&#46300; &#50640;&#50864;&#47532;&#46356;&#52404;','&#47784;&#52768;&#50500;&#47476;&#53944;','&#54028;&#47476;&#51648;&#54036;','&#47784;&#52768;&#50724;&#47476;&#54168;&#50724;'],c:0},
  {q:'&#49800;&#48288;&#47476;&#53944; &lsquo;&#50500;&#48288; &#47560;&#47532;&#50500;&rsquo;&#51032; &#50896;&#47000; &#44257;&#47749;&#51008;?',a:['&#50648;&#47116;&#51032; &#49464; &#48264;&#51704; &#45432;&#47000;','&#49457;&#47784; &#47560;&#47532;&#50500;&#51032; &#44592;&#46020;','&#46021;&#51068; &#48124;&#50836;','&#52268;&#49569;&#44032;'],c:0},
  {q:'&#51060;&#51088;&#51060; &#47924;&#48152;&#51452; &#49548;&#45208;&#53440;&#45716; &#52509; &#47751; &#44257;&#51064;&#44032;?',a:['6&#44257;','4&#44257;','3&#44257;','12&#44257;'],c:0},
  {q:'&#50672;&#51452;&#54924; &#51204; &#47924;&#45824;&#50640; &#46321;&#51109;&#54624; &#46412; &#44032;&#51109; &#51473;&#50836;&#54620; &#44163;&#51008;?',a:['&#51088;&#49888;&#44048; &#51080;&#45716; &#51088;&#49464;','&#48736;&#47480; &#44152;&#51020;','&#44256;&#44060; &#49689;&#51060;&#44592;','&#50616;&#51228;&#45208; &#48708;&#49828;&#46316;&#55176; &#48148;&#46972;&#48372;&#44592;'],c:0},
  {q:'&#54252;&#47112; &lsquo;&#44980; &#51060;&#54980;&#50640;&rsquo;(Apr&egrave;s un r&ecirc;ve)&#51032; &#50896;&#47000; &#50501;&#44592;&#45716;?',a:['&#49457;&#50501;(&#47700;&#51312;&#49548;&#54532;&#46972;&#45432;)+&#54588;&#50500;&#45432;','&#48148;&#51060;&#50732;&#47536;+&#54588;&#50500;&#45432;','&#52412;&#47196;+&#54588;&#50500;&#45432;','&#54540;&#47336;&#53944;+&#54588;&#50500;&#45432;'],c:0}
];
var V19_ACHS=[
  {id:'vibrato_analyst',icon:'\u{1F30A}',name:'비브라토 분석가',desc:'비브라토 6유형 모두 분석'},
  {id:'orch_player',icon:'\u{1F3BB}',name:'오케스트라 단원',desc:'오케스트라 배치 시뮬 3회 완료'},
  {id:'virtuoso_fan',icon:'\u{2B50}',name:'명인 팔로워',desc:'10명인 모두 비교 완료'},
  {id:'intonation_master',icon:'\u{1F3AF}',name:'음정 마스터',desc:'7포지션 음정 모두 S등급'},
  {id:'routine_creator',icon:'\u{1F4CB}',name:'루틴 설계사',desc:'연습 루틴 5회 생성'},
  {id:'string_expert',icon:'\u{1F9F5}',name:'현 전문가',desc:'8종 현 특성 모두 학습'},
  {id:'stage_pro',icon:'\u{1F3AD}',name:'무대 프로',desc:'무대 매너 12팁 모두 이수'},
  {id:'journal_keeper',icon:'\u{1F4D6}',name:'감상 일지 작가',desc:'감상 일지 10회 작성'},
  {id:'songs_160',icon:'\u{1F3B6}',name:'160곡 돌파',desc:'160곡 이상 연주 완료'},
  {id:'quiz_145',icon:'\u{1F9E0}',name:'퀴즈 145+',desc:'퀴즈 145문항 이상 정답'},
  {id:'ravel_master',icon:'\u{1F525}',name:'라벨 마스터',desc:'치간느 연주 완료'},
  {id:'v19_explorer',icon:'\u{1F680}',name:'v19 탐험가',desc:'v19 모든 기능 사용'}
];

/* ─── 3. CSS INJECTION ─── */
var sty19=document.createElement('style');
sty19.textContent=
'#vibratoAnalyzerPanel,#orchSeatPanel,#virtuosoPanel,#intonationMapPanel,'+
'#routineGenPanel,#stringGuidePanel,#stageMannerPanel,#listeningJournalPanel,#quizV19Panel{'+
'display:none;position:fixed;inset:0;z-index:253;background:rgba(0,0,0,.97);'+
'flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}'+
'#vibratoAnalyzerPanel.show,#orchSeatPanel.show,#virtuosoPanel.show,#intonationMapPanel.show,'+
'#routineGenPanel.show,#stringGuidePanel.show,#stageMannerPanel.show,#listeningJournalPanel.show,#quizV19Panel.show{display:flex;}'+
'#vibratoAnalyzerPanel h3,#orchSeatPanel h3,#virtuosoPanel h3,#intonationMapPanel h3,'+
'#routineGenPanel h3,#stringGuidePanel h3,#stageMannerPanel h3,#listeningJournalPanel h3,#quizV19Panel h3{font-size:16px;color:#ffd700;margin-bottom:4px;}'+
'#vibratoCanvas,#orchSeatCanvas,#virtuosoCanvas,#intonationCanvas,#routineCanvas,#stringCanvas,#stageCanvas,#journalCanvas{'+
'border-radius:10px;border:1px solid rgba(255,215,0,.15);'+
'background:rgba(255,250,235,.03);max-width:100%;margin:8px 0;}'+
'.v19Info{width:100%;max-width:580px;padding:10px;margin:4px 0;'+
'background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);'+
'border-radius:10px;font-size:10px;color:rgba(240,230,200,.7);line-height:1.6;}'+
'.v19Card{width:100%;max-width:540px;padding:10px 12px;margin:4px 0;'+
'background:rgba(255,250,235,.04);border:1px solid rgba(200,190,160,.12);'+
'border-radius:8px;font-size:11px;color:rgba(240,230,200,.8);cursor:pointer;'+
'transition:background .2s,border-color .2s;}'+
'.v19Card:hover{background:rgba(255,215,0,.08);border-color:rgba(255,215,0,.3);}'+
'.v19Card.done{border-color:rgba(76,175,80,.4);background:rgba(76,175,80,.06);}'+
'.v19Btn{display:inline-block;padding:6px 14px;margin:4px;border-radius:6px;'+
'background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.25);'+
'color:#ffd700;font-size:10px;cursor:pointer;transition:background .2s;}'+
'.v19Btn:hover{background:rgba(255,215,0,.22);}'+
'.v19Btn.active{background:rgba(255,215,0,.3);border-color:#ffd700;}'+
'.v19Close{position:sticky;top:0;align-self:flex-end;font-size:18px;cursor:pointer;'+
'color:#888;z-index:10;padding:4px 8px;}'+
'.v19Close:hover{color:#ffd700;}'+
'.v19Grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;width:100%;max-width:580px;}'+
'.v19Progress{width:100%;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;margin:4px 0;}'+
'.v19Progress .bar{height:100%;background:linear-gradient(90deg,#ffd700,#ff6644);border-radius:3px;transition:width .4s;}'+
'.v19Badge{display:inline-block;padding:2px 6px;border-radius:4px;font-size:8px;font-weight:bold;margin-left:4px;}'+
'.v19Badge.s{background:rgba(255,215,0,.2);color:#ffd700;}'+
'.v19Badge.a{background:rgba(76,175,80,.2);color:#4caf50;}'+
'.v19Badge.b{background:rgba(33,150,243,.2);color:#2196f3;}'+
'.v19Badge.c{background:rgba(255,152,0,.2);color:#ff9800;}'+
'.v19Badge.d{background:rgba(244,67,54,.2);color:#f44336;}'+
'.v19SubTitle{font-size:12px;color:#daa520;margin:8px 0 4px;font-weight:bold;}';
document.head.appendChild(sty19);

/* ─── 4. VIBRATO DEPTH ANALYZER Canvas 580x360 ─── */
var VIBRATO_TYPES=[
  {name:'Narrow Fast',speed:7,width:15,uniformity:85,desc:'Narrow oscillation, high speed. Used in Baroque and light passages.'},
  {name:'Wide Slow',speed:3,width:50,uniformity:70,desc:'Wide oscillation, slow speed. Expressive Romantic style.'},
  {name:'Medium Standard',speed:5,width:30,uniformity:90,desc:'Balanced vibrato. Versatile and widely used.'},
  {name:'Delayed Entry',speed:5,width:35,uniformity:80,desc:'Starts straight, then adds vibrato. Creates tension and release.'},
  {name:'Continuous Intense',speed:6,width:45,uniformity:75,desc:'Non-stop intense vibrato. Passionate passages.'},
  {name:'Non-Vibrato',speed:0,width:0,uniformity:100,desc:'Perfectly straight tone. Used for pure, ethereal effects.'}
];
var vibAnalState={selected:0,userSpeed:5,userWidth:30,userUniform:80};
function createVibratoPanel(){
  var d=document.createElement('div');d.id='vibratoAnalyzerPanel';
  d.innerHTML='<span class="v19Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>\u{1F30A} 비브라토 깊이 분석기</h3>'+
    '<canvas id="vibratoCanvas" width="580" height="360"></canvas>'+
    '<div class="v19Info" id="vibratoInfo">비브라토 유형을 선택하고 속도/폭/균일성을 조정해 보세요. 이상적인 비브라토와 비교 분석합니다.</div>'+
    '<div style="width:100%;max-width:580px;margin:8px 0;">'+
    '<div class="v19SubTitle">유형 선택</div>'+
    '<div class="v19Grid" id="vibTypeGrid"></div>'+
    '<div class="v19SubTitle" style="margin-top:8px">내 비브라토 설정</div>'+
    '<div style="display:flex;gap:12px;flex-wrap:wrap;margin:4px 0;">'+
    '<label style="font-size:10px;color:#daa520">속도: <input type="range" min="0" max="10" value="5" id="vibSpeedSlider" style="width:100px;vertical-align:middle"></label>'+
    '<label style="font-size:10px;color:#daa520">폭: <input type="range" min="0" max="60" value="30" id="vibWidthSlider" style="width:100px;vertical-align:middle"></label>'+
    '<label style="font-size:10px;color:#daa520">균일성: <input type="range" min="30" max="100" value="80" id="vibUniformSlider" style="width:100px;vertical-align:middle"></label>'+
    '</div></div>';
  document.body.appendChild(d);
  var grid=d.querySelector('#vibTypeGrid');
  VIBRATO_TYPES.forEach(function(t,i){
    var c=document.createElement('div');c.className='v19Card';
    c.textContent=t.name;
    c.onclick=function(){vibAnalState.selected=i;drawVibratoCanvas();v19Sfx('vibrato_pulse');};
    grid.appendChild(c);
  });
  ['vibSpeedSlider','vibWidthSlider','vibUniformSlider'].forEach(function(sid){
    d.querySelector('#'+sid).oninput=function(){
      vibAnalState.userSpeed=parseInt(d.querySelector('#vibSpeedSlider').value);
      vibAnalState.userWidth=parseInt(d.querySelector('#vibWidthSlider').value);
      vibAnalState.userUniform=parseInt(d.querySelector('#vibUniformSlider').value);
      drawVibratoCanvas();
    };
  });
}
function drawVibratoCanvas(){
  var cv=document.getElementById('vibratoCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
  ctx.textAlign='center';ctx.fillText('Vibrato Depth Analyzer',W/2,24);
  var ref=VIBRATO_TYPES[vibAnalState.selected];
  ctx.font='11px sans-serif';ctx.fillStyle='#daa520';
  ctx.fillText('Reference: '+ref.name,W/2,44);

  var midY=130,ampRef=ref.width*1.2,ampUser=vibAnalState.userWidth*1.2;
  var freqRef=ref.speed*0.8,freqUser=vibAnalState.userSpeed*0.8;
  ctx.strokeStyle='rgba(255,215,0,.4)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(40,midY);ctx.lineTo(W-40,midY);ctx.stroke();
  ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='9px sans-serif';ctx.textAlign='left';
  ctx.fillText('Pitch Center',42,midY-4);

  ctx.strokeStyle='#ffd700';ctx.lineWidth=2;
  ctx.beginPath();
  for(var x=0;x<W-80;x++){
    var noise=ref.uniformity<100?(100-ref.uniformity)/100*Math.sin(x*0.17)*8:0;
    var y=midY+Math.sin(x*freqRef*0.05)*ampRef+noise;
    if(x===0)ctx.moveTo(40+x,y);else ctx.lineTo(40+x,y);
  }
  ctx.stroke();

  ctx.strokeStyle='#ff6644';ctx.lineWidth=2;ctx.setLineDash([4,3]);
  ctx.beginPath();
  for(var x2=0;x2<W-80;x2++){
    var noise2=vibAnalState.userUniform<100?(100-vibAnalState.userUniform)/100*Math.sin(x2*0.21)*10:0;
    var y2=midY+Math.sin(x2*freqUser*0.05)*ampUser+noise2;
    if(x2===0)ctx.moveTo(40+x2,y2);else ctx.lineTo(40+x2,y2);
  }
  ctx.stroke();ctx.setLineDash([]);

  ctx.font='9px sans-serif';ctx.textAlign='left';
  ctx.fillStyle='#ffd700';ctx.fillText('● Reference ('+ref.name+')',50,200);
  ctx.fillStyle='#ff6644';ctx.fillText('● Your Vibrato',50,215);

  var metrics=[
    {label:'Speed',ref:ref.speed,user:vibAnalState.userSpeed,max:10},
    {label:'Width',ref:ref.width,user:vibAnalState.userWidth,max:60},
    {label:'Uniformity',ref:ref.uniformity,user:vibAnalState.userUniform,max:100}
  ];
  var barStartY=240,barH=18,barMaxW=200;
  metrics.forEach(function(m,i){
    var y=barStartY+i*50;
    ctx.fillStyle='#daa520';ctx.font='bold 11px sans-serif';ctx.textAlign='left';
    ctx.fillText(m.label,50,y);
    ctx.fillStyle='rgba(255,215,0,.2)';
    ctx.fillRect(160,y-12,barMaxW,barH);
    ctx.fillStyle='rgba(255,215,0,.5)';
    ctx.fillRect(160,y-12,m.ref/m.max*barMaxW,barH/2);
    ctx.fillStyle='rgba(255,102,68,.5)';
    ctx.fillRect(160,y-12+barH/2,m.user/m.max*barMaxW,barH/2);
    ctx.fillStyle='#ffd700';ctx.font='9px sans-serif';ctx.textAlign='left';
    ctx.fillText(m.ref,160+m.ref/m.max*barMaxW+4,y-4);
    ctx.fillStyle='#ff6644';
    ctx.fillText(m.user,160+m.user/m.max*barMaxW+4,y+8);
  });

  var spdDiff=Math.abs(ref.speed-vibAnalState.userSpeed);
  var wDiff=Math.abs(ref.width-vibAnalState.userWidth);
  var uDiff=Math.abs(ref.uniformity-vibAnalState.userUniform);
  var score=100-spdDiff*5-wDiff*0.8-uDiff*0.5;
  score=Math.max(0,Math.min(100,score));
  var grade=score>=90?'S':score>=75?'A':score>=60?'B':score>=45?'C':'D';
  var gradeColors={S:'#ffd700',A:'#4caf50',B:'#2196f3',C:'#ff9800',D:'#f44336'};
  ctx.fillStyle=gradeColors[grade];ctx.font='bold 28px sans-serif';ctx.textAlign='center';
  ctx.fillText(grade,W-70,280);
  ctx.font='10px sans-serif';ctx.fillStyle='rgba(200,190,160,.6)';
  ctx.fillText('Match: '+Math.round(score)+'%',W-70,300);
  ctx.fillText(ref.desc.substring(0,40),W/2,H-10);

  saveProgress({v19_vibrato:1});
  var prog=loadProgress();
  if(prog.v19_vibrato)unlockAch('vibrato_analyst');
}

/* ─── 5. ORCHESTRA SEATING SIMULATOR Canvas 600x380 ─── */
var ORCH_SECTIONS=[
  {name:'1st Violin',x:180,y:180,w:120,h:50,color:'#ffd700',count:'14-18',role:'Melody lead, highest voice'},
  {name:'2nd Violin',x:310,y:180,w:120,h:50,color:'#ff9800',count:'12-16',role:'Harmony, counter-melody'},
  {name:'Viola',x:310,y:250,w:120,h:50,color:'#9c27b0',count:'10-14',role:'Inner harmony, bridge'},
  {name:'Cello',x:180,y:250,w:120,h:50,color:'#2196f3',count:'8-12',role:'Bass melody, foundation'},
  {name:'Bass',x:440,y:250,w:80,h:50,color:'#795548',count:'6-8',role:'Lowest foundation'},
  {name:'Woodwinds',x:200,y:100,w:200,h:40,color:'#4caf50',count:'Fl,Ob,Cl,Bn',role:'Color, melody, solo'},
  {name:'Brass',x:180,y:50,w:120,h:40,color:'#f44336',count:'Hn,Tp,Tb,Tu',role:'Power, fanfare'},
  {name:'Percussion',x:310,y:50,w:120,h:40,color:'#607d8b',count:'Timp,Perc',role:'Rhythm, impact'},
  {name:'Conductor',x:270,y:320,w:60,h:40,color:'#e91e63',count:'1',role:'Music director'}
];
var orchState={selected:0};
function createOrchSeatPanel(){
  var d=document.createElement('div');d.id='orchSeatPanel';
  d.innerHTML='<span class="v19Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>\u{1F3BB} 오케스트라 석차 시뮬레이터</h3>'+
    '<canvas id="orchSeatCanvas" width="600" height="380"></canvas>'+
    '<div class="v19Info" id="orchSeatInfo">오케스트라 배치에서 각 섹션의 역할과 위치를 확인하세요. 바이올린 파트의 위치와 역할을 이해합니다.</div>'+
    '<div class="v19Grid" id="orchSeatGrid"></div>';
  document.body.appendChild(d);
  var grid=d.querySelector('#orchSeatGrid');
  ORCH_SECTIONS.forEach(function(s,i){
    var c=document.createElement('div');c.className='v19Card';
    c.innerHTML='<span style="color:'+s.color+'">●</span> '+s.name;
    c.onclick=function(){orchState.selected=i;drawOrchSeatCanvas();v19Sfx('orch_seat');};
    grid.appendChild(c);
  });
}
function drawOrchSeatCanvas(){
  var cv=document.getElementById('orchSeatCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
  ctx.textAlign='center';ctx.fillText('Orchestra Seating Chart',W/2,24);

  ctx.strokeStyle='rgba(255,215,0,.15)';ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(W/2,H/2+30,160,Math.PI*0.15,Math.PI*0.85);ctx.stroke();
  ctx.beginPath();ctx.arc(W/2,H/2+30,120,Math.PI*0.2,Math.PI*0.8);ctx.stroke();

  ORCH_SECTIONS.forEach(function(s,i){
    var sel=i===orchState.selected;
    ctx.globalAlpha=sel?1:.5;
    ctx.fillStyle=s.color;
    ctx.beginPath();ctx.roundRect(s.x,s.y,s.w,s.h,8);ctx.fill();
    ctx.strokeStyle=sel?'#fff':'rgba(255,255,255,.2)';ctx.lineWidth=sel?2:1;
    ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText(s.name,s.x+s.w/2,s.y+s.h/2+4);
    ctx.globalAlpha=1;
  });

  var info=ORCH_SECTIONS[orchState.selected];
  ctx.fillStyle=info.color;ctx.font='bold 13px sans-serif';ctx.textAlign='left';
  ctx.fillText(info.name,30,H-60);
  ctx.fillStyle='rgba(240,230,200,.7)';ctx.font='10px sans-serif';
  ctx.fillText('Players: '+info.count,30,H-44);
  ctx.fillText('Role: '+info.role,30,H-28);

  if(orchState.selected<=1){
    ctx.fillStyle='rgba(255,215,0,.15)';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('← 바이올린이 지휘자에게 가장 가까운 위치',W/2,H-8);
  }
  saveProgress({v19_orch:1});
}

/* ─── 6. VIRTUOSO COMPARATOR Canvas 600x380 (10 masters, 6-axis dual Radar) ─── */
var VIRTUOSOS=[
  {name:'Paganini',speed:98,tone:85,expression:90,technique:99,stage:95,repertoire:80},
  {name:'Heifetz',speed:95,tone:98,expression:88,technique:97,stage:90,repertoire:95},
  {name:'Oistrakh',speed:85,tone:95,expression:96,technique:90,stage:92,repertoire:90},
  {name:'Menuhin',speed:88,tone:92,expression:95,technique:88,stage:94,repertoire:92},
  {name:'Perlman',speed:82,tone:96,expression:98,technique:85,stage:98,repertoire:95},
  {name:'Stern',speed:80,tone:90,expression:92,technique:82,stage:95,repertoire:88},
  {name:'Hilary Hahn',speed:92,tone:94,expression:90,technique:94,stage:88,repertoire:85},
  {name:'Vengerov',speed:93,tone:92,expression:94,technique:93,stage:90,repertoire:82},
  {name:'Bell',speed:88,tone:90,expression:88,technique:90,stage:96,repertoire:80},
  {name:'Mutter',speed:85,tone:96,expression:95,technique:88,stage:92,repertoire:90}
];
var virtState={a:0,b:1};
function createVirtuosoPanel(){
  var d=document.createElement('div');d.id='virtuosoPanel';
  d.innerHTML='<span class="v19Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>\u{2B50} 바이올린 명인 비교기</h3>'+
    '<canvas id="virtuosoCanvas" width="600" height="380"></canvas>'+
    '<div class="v19Info">두 명인을 선택해 6축 레이더로 비교하세요.</div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;width:100%;max-width:580px">'+
    '<div style="flex:1;min-width:200px"><div class="v19SubTitle" style="color:#ffd700">◉ Player A</div><div id="virtGridA" class="v19Grid"></div></div>'+
    '<div style="flex:1;min-width:200px"><div class="v19SubTitle" style="color:#ff6644">◈ Player B</div><div id="virtGridB" class="v19Grid"></div></div></div>';
  document.body.appendChild(d);
  VIRTUOSOS.forEach(function(v,i){
    var cA=document.createElement('div');cA.className='v19Card';cA.textContent=v.name;
    cA.onclick=function(){virtState.a=i;drawVirtuosoCanvas();v19Sfx('virtuoso_compare');};
    d.querySelector('#virtGridA').appendChild(cA);
    var cB=document.createElement('div');cB.className='v19Card';cB.textContent=v.name;
    cB.onclick=function(){virtState.b=i;drawVirtuosoCanvas();v19Sfx('virtuoso_compare');};
    d.querySelector('#virtGridB').appendChild(cB);
  });
}
function drawVirtuosoCanvas(){
  var cv=document.getElementById('virtuosoCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
  ctx.textAlign='center';ctx.fillText('Virtuoso Comparator',W/2,24);
  var a=VIRTUOSOS[virtState.a],b=VIRTUOSOS[virtState.b];
  ctx.font='11px sans-serif';ctx.fillStyle='#ffd700';ctx.fillText(a.name,W/2-80,44);
  ctx.fillStyle='#ff6644';ctx.fillText('vs',W/2,44);ctx.fillText(b.name,W/2+80,44);

  var axes=['Speed','Tone','Expression','Technique','Stage','Repertoire'];
  var keys=['speed','tone','expression','technique','stage','repertoire'];
  var cx=W/2,cy=200,R=110;
  for(var ring=20;ring<=100;ring+=20){
    ctx.strokeStyle='rgba(255,215,0,.08)';ctx.lineWidth=1;
    ctx.beginPath();
    for(var ai=0;ai<=6;ai++){
      var ang=-Math.PI/2+ai*(Math.PI*2/6);
      var px=cx+Math.cos(ang)*R*ring/100,py=cy+Math.sin(ang)*R*ring/100;
      if(ai===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }ctx.stroke();
  }
  for(var l=0;l<6;l++){
    var ang2=-Math.PI/2+l*(Math.PI*2/6);
    ctx.strokeStyle='rgba(255,215,0,.12)';ctx.beginPath();
    ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang2)*R,cy+Math.sin(ang2)*R);ctx.stroke();
    ctx.fillStyle='#daa520';ctx.font='10px sans-serif';ctx.textAlign='center';
    var lx=cx+Math.cos(ang2)*(R+16),ly=cy+Math.sin(ang2)*(R+16);
    ctx.fillText(axes[l],lx,ly+4);
  }

  function drawRadar(data,color,alpha){
    ctx.beginPath();
    for(var k=0;k<6;k++){
      var ang3=-Math.PI/2+k*(Math.PI*2/6);
      var val=data[keys[k]]/100;
      var px2=cx+Math.cos(ang3)*R*val,py2=cy+Math.sin(ang3)*R*val;
      if(k===0)ctx.moveTo(px2,py2);else ctx.lineTo(px2,py2);
    }ctx.closePath();
    ctx.fillStyle=color;ctx.globalAlpha=alpha;ctx.fill();ctx.globalAlpha=1;
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();
  }
  drawRadar(a,'rgba(255,215,0,.3)',.3);
  drawRadar(b,'rgba(255,102,68,.3)',.3);

  ctx.font='9px sans-serif';ctx.textAlign='left';
  ctx.fillStyle='#ffd700';ctx.fillText('● '+a.name,30,H-30);
  ctx.fillStyle='#ff6644';ctx.fillText('● '+b.name,30,H-16);

  var aTotal=0,bTotal=0;
  keys.forEach(function(k){aTotal+=a[k];bTotal+=b[k];});
  ctx.textAlign='right';ctx.fillStyle='#ffd700';ctx.font='bold 12px sans-serif';
  ctx.fillText('Avg: '+Math.round(aTotal/6),W-30,H-30);
  ctx.fillStyle='#ff6644';ctx.fillText('Avg: '+Math.round(bTotal/6),W-30,H-16);
  saveProgress({v19_virtuoso:1});
  var prog=loadProgress();
  if(prog.v19_virtuoso)unlockAch('virtuoso_fan');
}

/* ─── 7. INTONATION JOURNEY MAP Canvas 580x360 (7 positions heatmap) ─── */
var POSITIONS=['1st','2nd','3rd','4th','5th','6th','7th'];
var STRINGS_4=['G','D','A','E'];
var intonState={data:null};
function loadIntonData(){
  try{return JSON.parse(localStorage.getItem('v19_intonation')||'null');}catch(e){return null;}
}
function saveIntonData(d){localStorage.setItem('v19_intonation',JSON.stringify(d));}
function initIntonData(){
  var d={};STRINGS_4.forEach(function(s){d[s]={};POSITIONS.forEach(function(p){d[s][p]=50+Math.floor(Math.random()*40);});});
  return d;
}
function createIntonationPanel(){
  var d=document.createElement('div');d.id='intonationMapPanel';
  d.innerHTML='<span class="v19Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>\u{1F3AF} 음정 진행 맵</h3>'+
    '<canvas id="intonationCanvas" width="580" height="360"></canvas>'+
    '<div class="v19Info">각 현/포지션별 음정 정확도를 히트맵으로 표시합니다. 셀을 클릭해 점수를 조정하세요.</div>'+
    '<div style="display:flex;gap:6px;margin:8px 0">'+
    '<button class="v19Btn" onclick="resetIntonation()">초기화</button>'+
    '<button class="v19Btn" onclick="randomPractice()">랜덤 연습</button></div>';
  document.body.appendChild(d);
  cv=document.getElementById('intonationCanvas');
  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect();
    var sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    var scaleX=cv.width/rect.width,scaleY=cv.height/rect.height;
    sx*=scaleX;sy*=scaleY;
    var cellW=60,cellH=50,startX=100,startY=80;
    var col=Math.floor((sx-startX)/cellW),row=Math.floor((sy-startY)/cellH);
    if(col>=0&&col<7&&row>=0&&row<4){
      var data=intonState.data;
      var str=STRINGS_4[row],pos=POSITIONS[col];
      data[str][pos]=Math.min(100,data[str][pos]+5);
      saveIntonData(data);drawIntonationCanvas();v19Sfx('intonation_check');
    }
  });
}
window.resetIntonation=function(){intonState.data=initIntonData();saveIntonData(intonState.data);drawIntonationCanvas();};
window.randomPractice=function(){
  var str=STRINGS_4[Math.floor(Math.random()*4)];
  var pos=POSITIONS[Math.floor(Math.random()*7)];
  intonState.data[str][pos]=Math.min(100,intonState.data[str][pos]+10);
  saveIntonData(intonState.data);drawIntonationCanvas();
  v19Sfx('intonation_check');addHistory('intonation','Random practice: '+str+' '+pos);
};
function drawIntonationCanvas(){
  var cv=document.getElementById('intonationCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
  ctx.textAlign='center';ctx.fillText('Intonation Journey Map',W/2,24);
  var data=intonState.data;if(!data){data=loadIntonData();if(!data)data=initIntonData();intonState.data=data;}
  var cellW=60,cellH=50,startX=100,startY=80;
  ctx.font='bold 10px sans-serif';ctx.textAlign='center';
  POSITIONS.forEach(function(p,i){ctx.fillStyle='#daa520';ctx.fillText(p+' Pos',startX+i*cellW+cellW/2,startY-8);});
  ctx.textAlign='right';
  STRINGS_4.forEach(function(s,r){ctx.fillStyle='#daa520';ctx.fillText(s+' String',startX-10,startY+r*cellH+cellH/2+4);});
  STRINGS_4.forEach(function(s,r){
    POSITIONS.forEach(function(p,c){
      var val=data[s][p];
      var hue=val<50?0:val<70?30:val<85?60:120;
      var sat=val<50?80:70;
      ctx.fillStyle='hsla('+hue+','+sat+'%,40%,.8)';
      ctx.beginPath();ctx.roundRect(startX+c*cellW+2,startY+r*cellH+2,cellW-4,cellH-4,6);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText(val,startX+c*cellW+cellW/2,startY+r*cellH+cellH/2+5);
    });
  });
  var total=0,cnt=0;
  STRINGS_4.forEach(function(s){POSITIONS.forEach(function(p){total+=data[s][p];cnt++;});});
  var avg=Math.round(total/cnt);
  var grade=avg>=90?'S':avg>=75?'A':avg>=60?'B':avg>=45?'C':'D';
  ctx.fillStyle='#ffd700';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
  ctx.fillText('Overall: '+avg+'% ('+grade+')',W/2,H-30);
  ctx.font='9px sans-serif';ctx.fillStyle='rgba(200,190,160,.5)';
  ctx.fillText('Click cells to improve. Green=Good, Yellow=OK, Red=Needs work.',W/2,H-12);
  saveProgress({v19_intonation:1});
}

/* ─── 8. PRACTICE ROUTINE GENERATOR Canvas 580x340 ─── */
var ROUTINE_BLOCKS=[
  {name:'Warm-up Scales',time:10,level:'beginner',icon:'\u{1F3B5}'},
  {name:'Shifting Exercises',time:10,level:'intermediate',icon:'\u{1F4AA}'},
  {name:'Vibrato Drills',time:8,level:'intermediate',icon:'\u{1F30A}'},
  {name:'Bowing Techniques',time:10,level:'beginner',icon:'\u{1F3F9}'},
  {name:'Etude Study',time:15,level:'intermediate',icon:'\u{1F4D6}'},
  {name:'Repertoire Practice',time:20,level:'advanced',icon:'\u{1F3BB}'},
  {name:'Sight-Reading',time:10,level:'intermediate',icon:'\u{1F4C4}'},
  {name:'Intonation Training',time:10,level:'beginner',icon:'\u{1F3AF}'},
  {name:'Double Stops',time:8,level:'advanced',icon:'\u{1F3BC}'},
  {name:'Performance Run',time:15,level:'advanced',icon:'\u{1F3AD}'},
  {name:'Ear Training',time:10,level:'beginner',icon:'\u{1F442}'},
  {name:'Cool-down Review',time:5,level:'beginner',icon:'\u{2615}'}
];
var routineState={level:'intermediate',minutes:60,generated:null};
function createRoutinePanel(){
  var d=document.createElement('div');d.id='routineGenPanel';
  d.innerHTML='<span class="v19Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>\u{1F4CB} 연습 루틴 생성기</h3>'+
    '<canvas id="routineCanvas" width="580" height="340"></canvas>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0;align-items:center">'+
    '<label style="font-size:10px;color:#daa520">레벨: <select id="routineLevel" style="background:#1a1020;color:#ffd700;border:1px solid #ffd700;border-radius:4px;padding:2px">'+
    '<option value="beginner">Beginner</option><option value="intermediate" selected>Intermediate</option><option value="advanced">Advanced</option></select></label>'+
    '<label style="font-size:10px;color:#daa520">시간: <input type="range" min="15" max="120" value="60" id="routineTime" style="width:100px;vertical-align:middle"><span id="routineTimeVal">60min</span></label>'+
    '<button class="v19Btn" onclick="generateRoutine()">생성</button></div>'+
    '<div class="v19Info" id="routineInfo">레벨과 시간을 설정하고 생성 버튼을 누르면 맞춤 루틴이 만들어집니다.</div>';
  document.body.appendChild(d);
  d.querySelector('#routineTime').oninput=function(){
    routineState.minutes=parseInt(this.value);
    d.querySelector('#routineTimeVal').textContent=this.value+'min';
  };
}
window.generateRoutine=function(){
  var level=document.getElementById('routineLevel').value;
  var minutes=routineState.minutes;
  routineState.level=level;
  var eligible=ROUTINE_BLOCKS.filter(function(b){
    if(level==='beginner')return b.level==='beginner';
    if(level==='intermediate')return b.level!=='advanced';
    return true;
  });
  var routine=[],total=0;
  var shuffled=eligible.slice().sort(function(){return Math.random()-0.5;});
  for(var i=0;i<shuffled.length&&total<minutes;i++){
    var block=Object.assign({},shuffled[i]);
    var remaining=minutes-total;
    if(block.time>remaining)block.time=remaining;
    routine.push(block);total+=block.time;
  }
  routineState.generated=routine;
  drawRoutineCanvas();v19Sfx('routine_gen');
  addHistory('routine','Generated '+level+' routine: '+minutes+'min');
  var cnt=parseInt(localStorage.getItem('v19_routine_count')||'0')+1;
  localStorage.setItem('v19_routine_count',String(cnt));
  if(cnt>=5)unlockAch('routine_creator');
};
function drawRoutineCanvas(){
  var cv=document.getElementById('routineCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
  ctx.textAlign='center';ctx.fillText('Practice Routine Generator',W/2,24);
  var routine=routineState.generated;
  if(!routine||routine.length===0){
    ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='12px sans-serif';
    ctx.fillText('Press Generate to create your routine.',W/2,H/2);return;
  }
  var totalTime=routine.reduce(function(s,b){return s+b.time;},0);
  ctx.font='11px sans-serif';ctx.fillStyle='#daa520';
  ctx.fillText(routineState.level.toUpperCase()+' | '+totalTime+' min | '+routine.length+' blocks',W/2,46);
  var colors=['#ffd700','#ff6644','#4caf50','#2196f3','#9c27b0','#ff9800','#e91e63','#00bcd4','#795548','#607d8b','#8bc34a','#cddc39'];
  var barStartX=60,barW=W-120,barY=70,barH=30;
  var xOff=barStartX;
  routine.forEach(function(b,i){
    var w=b.time/totalTime*barW;
    ctx.fillStyle=colors[i%colors.length];
    ctx.beginPath();ctx.roundRect(xOff,barY,w-2,barH,4);ctx.fill();
    if(w>30){ctx.fillStyle='#000';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText(b.time+'m',xOff+w/2,barY+barH/2+3);}
    xOff+=w;
  });
  var listY=120;
  routine.forEach(function(b,i){
    var y=listY+i*26;
    if(y>H-20)return;
    ctx.fillStyle=colors[i%colors.length];ctx.beginPath();ctx.roundRect(40,y,W-80,22,4);ctx.globalAlpha=.15;ctx.fill();ctx.globalAlpha=1;
    ctx.strokeStyle=colors[i%colors.length];ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(40,y,W-80,22,4);ctx.stroke();
    ctx.fillStyle=colors[i%colors.length];ctx.font='12px sans-serif';ctx.textAlign='left';
    ctx.fillText(b.icon+' '+b.name,52,y+15);
    ctx.fillStyle='rgba(240,230,200,.7)';ctx.font='10px sans-serif';ctx.textAlign='right';
    ctx.fillText(b.time+' min',W-52,y+15);
  });
  saveProgress({v19_routine:1});
}

/* ─── 9. STRING CHANGE GUIDE Canvas 560x340 ─── */
var STRING_BRANDS=[
  {name:'Dominant (Thomastik)',tone:85,warmth:90,projection:75,durability:70,price:3,desc:'Most popular. Warm, rich tone.'},
  {name:'Evah Pirazzi (Pirastro)',tone:92,warmth:75,projection:95,durability:65,price:4,desc:'Brilliant, powerful projection.'},
  {name:'Obligato (Pirastro)',tone:88,warmth:85,projection:80,durability:75,price:4,desc:'Warm with good projection.'},
  {name:'Vision Solo (Thomastik)',tone:90,warmth:78,projection:88,durability:80,price:4,desc:'Bright, clear, long-lasting.'},
  {name:'Passione (Pirastro)',tone:95,warmth:95,projection:70,durability:55,price:5,desc:'Gut-like warmth and color.'},
  {name:'Larsen Tzigane',tone:87,warmth:82,projection:85,durability:78,price:4,desc:'Balanced for many styles.'},
  {name:'D\'Addario Kaplan',tone:84,warmth:80,projection:82,durability:82,price:3,desc:'Versatile, stable tuning.'},
  {name:'Warchal Amber',tone:86,warmth:88,projection:78,durability:85,price:3,desc:'Warm, quick break-in.'}
];
var strState={selected:0};
function createStringGuidePanel(){
  var d=document.createElement('div');d.id='stringGuidePanel';
  d.innerHTML='<span class="v19Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>\u{1F9F5} 현; 교체 가이드</h3>'+
    '<canvas id="stringCanvas" width="560" height="340"></canvas>'+
    '<div class="v19Info">바이올린 현; 브랜드별 특성을 비교합니다. 브랜드를 선택해 상세 정보를 확인하세요.</div>'+
    '<div class="v19Grid" id="stringGrid"></div>';
  document.body.appendChild(d);
  var grid=d.querySelector('#stringGrid');
  STRING_BRANDS.forEach(function(s,i){
    var c=document.createElement('div');c.className='v19Card';
    c.textContent=s.name;
    c.onclick=function(){strState.selected=i;drawStringCanvas();v19Sfx('string_select');};
    grid.appendChild(c);
  });
}
function drawStringCanvas(){
  var cv=document.getElementById('stringCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
  ctx.textAlign='center';ctx.fillText('String Change Guide',W/2,24);
  var sel=STRING_BRANDS[strState.selected];
  ctx.font='bold 12px sans-serif';ctx.fillStyle='#daa520';ctx.fillText(sel.name,W/2,46);

  var attrs=['Tone','Warmth','Projection','Durability'];
  var keys=['tone','warmth','projection','durability'];
  var barStartY=70,barH=16,barMaxW=300,barX=140;
  var colors=['#ffd700','#ff9800','#ff6644','#4caf50'];
  attrs.forEach(function(a,i){
    var y=barStartY+i*40;
    ctx.fillStyle='#daa520';ctx.font='10px sans-serif';ctx.textAlign='right';
    ctx.fillText(a,barX-10,y+12);
    ctx.fillStyle='rgba(255,255,255,.06)';
    ctx.beginPath();ctx.roundRect(barX,y,barMaxW,barH,4);ctx.fill();
    var val=sel[keys[i]];
    var grd=ctx.createLinearGradient(barX,y,barX+val/100*barMaxW,y);
    grd.addColorStop(0,colors[i]);grd.addColorStop(1,'rgba(0,0,0,.2)');
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.roundRect(barX,y,val/100*barMaxW,barH,4);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
    ctx.fillText(val,barX+val/100*barMaxW+6,y+12);
  });

  var priceY=barStartY+attrs.length*40+10;
  ctx.fillStyle='#daa520';ctx.font='10px sans-serif';ctx.textAlign='right';
  ctx.fillText('Price',barX-10,priceY+12);
  for(var star=0;star<5;star++){
    ctx.fillStyle=star<sel.price?'#ffd700':'rgba(255,255,255,.15)';
    ctx.font='14px sans-serif';ctx.textAlign='left';
    ctx.fillText('★',barX+star*20,priceY+14);
  }
  ctx.fillStyle='rgba(240,230,200,.7)';ctx.font='10px sans-serif';ctx.textAlign='left';
  ctx.fillText(sel.desc,barX,priceY+34);

  var allY=H-80;ctx.fillStyle='#daa520';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
  ctx.fillText('All Brands Comparison (Tone)',W/2,allY-4);
  STRING_BRANDS.forEach(function(s,i){
    var x=40+i*(W-80)/STRING_BRANDS.length;
    var w=(W-80)/STRING_BRANDS.length-4;
    var h=s.tone/100*50;
    ctx.fillStyle=i===strState.selected?'#ffd700':'rgba(255,215,0,.3)';
    ctx.beginPath();ctx.roundRect(x,allY+50-h,w,h,3);ctx.fill();
    ctx.save();ctx.translate(x+w/2,allY+56);ctx.rotate(-0.5);
    ctx.fillStyle='rgba(200,190,160,.5)';ctx.font='7px sans-serif';ctx.textAlign='left';
    ctx.fillText(s.name.split(' ')[0],0,0);ctx.restore();
  });
  saveProgress({v19_string:1});
  unlockAch('string_expert');
}

/* ─── 10. STAGE MANNER COACH Canvas 580x360 ─── */
var STAGE_TIPS=[
  {title:'Entrance Walk',desc:'Walk confidently, maintain posture. Smile naturally.',mastered:false},
  {title:'Bow Etiquette',desc:'Bow from the waist at 30-45 degrees. Pause briefly at the bottom.',mastered:false},
  {title:'Tuning Protocol',desc:'Tune quietly and efficiently. Minimize time on stage.',mastered:false},
  {title:'Eye Contact',desc:'Connect with audience. Look up between movements.',mastered:false},
  {title:'Breathing',desc:'Deep breath before starting. Control nerves through breathing.',mastered:false},
  {title:'Page Turner Communication',desc:'Nod clearly for page turns. Practice cues.',mastered:false},
  {title:'Movement on Stage',desc:'Minimal unnecessary movement. Express through music.',mastered:false},
  {title:'Applause Response',desc:'Wait for applause to build. Acknowledge accompanist.',mastered:false},
  {title:'Encore Etiquette',desc:'Have an encore ready. Short, memorable piece.',mastered:false},
  {title:'Dress Code',desc:'Concert black or formal. Clean, polished shoes.',mastered:false},
  {title:'Pre-Concert Routine',desc:'Warm up backstage 30min before. Mental preparation.',mastered:false},
  {title:'Recovery from Mistakes',desc:'Never show displeasure. Keep going. Stay in character.',mastered:false}
];
var stageState={tips:null};
function loadStageTips(){try{return JSON.parse(localStorage.getItem('v19_stage_tips')||'null');}catch(e){return null;}}
function saveStageTips(t){localStorage.setItem('v19_stage_tips',JSON.stringify(t));}
function createStageMannerPanel(){
  var d=document.createElement('div');d.id='stageMannerPanel';
  d.innerHTML='<span class="v19Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>\u{1F3AD} 무대 매너 코치</h3>'+
    '<canvas id="stageCanvas" width="580" height="360"></canvas>'+
    '<div class="v19Info">무대 매너 12팁을 학습하고 이수하세요. 클릭하면 이수 표시됩니다.</div>'+
    '<div id="stageGrid" class="v19Grid"></div>';
  document.body.appendChild(d);
  var tips=loadStageTips();
  if(!tips)tips=STAGE_TIPS.map(function(t){return{mastered:false};});
  stageState.tips=tips;
  var grid=d.querySelector('#stageGrid');
  STAGE_TIPS.forEach(function(t,i){
    var c=document.createElement('div');c.className='v19Card'+(tips[i].mastered?' done':'');c.id='stageTip'+i;
    c.innerHTML='<b>'+t.title+'</b><br><span style="font-size:9px;color:rgba(200,190,160,.6)">'+t.desc+'</span>';
    c.onclick=function(){
      stageState.tips[i].mastered=!stageState.tips[i].mastered;
      saveStageTips(stageState.tips);
      c.classList.toggle('done',stageState.tips[i].mastered);
      drawStageCanvas();v19Sfx('stage_tip');
      var allDone=stageState.tips.every(function(tt){return tt.mastered;});
      if(allDone)unlockAch('stage_pro');
    };
    grid.appendChild(c);
  });
}
function drawStageCanvas(){
  var cv=document.getElementById('stageCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
  ctx.textAlign='center';ctx.fillText('Stage Manner Coach',W/2,24);
  var tips=stageState.tips||[];
  var mastered=tips.filter(function(t){return t.mastered;}).length;
  var pct=Math.round(mastered/12*100);
  ctx.fillStyle='#daa520';ctx.font='11px sans-serif';
  ctx.fillText(mastered+'/12 Tips Mastered ('+pct+'%)',W/2,46);
  ctx.fillStyle='rgba(255,255,255,.06)';
  ctx.beginPath();ctx.roundRect(60,60,W-120,20,6);ctx.fill();
  var grd=ctx.createLinearGradient(60,60,60+pct/100*(W-120),60);
  grd.addColorStop(0,'#ffd700');grd.addColorStop(1,'#ff6644');
  ctx.fillStyle=grd;
  ctx.beginPath();ctx.roundRect(60,60,pct/100*(W-120),20,6);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.fillText(pct+'%',(60+60+pct/100*(W-120))/2+30,74);

  var cols=4,cellW=(W-80)/cols,cellH=55,startX=40,startY=100;
  STAGE_TIPS.forEach(function(t,i){
    var col=i%cols,row=Math.floor(i/cols);
    var x=startX+col*cellW,y=startY+row*cellH;
    var done=tips[i]&&tips[i].mastered;
    ctx.fillStyle=done?'rgba(76,175,80,.15)':'rgba(255,250,235,.04)';
    ctx.beginPath();ctx.roundRect(x+2,y+2,cellW-4,cellH-4,6);ctx.fill();
    ctx.strokeStyle=done?'rgba(76,175,80,.4)':'rgba(200,190,160,.12)';ctx.lineWidth=1;
    ctx.beginPath();ctx.roundRect(x+2,y+2,cellW-4,cellH-4,6);ctx.stroke();
    ctx.fillStyle=done?'#4caf50':'#daa520';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
    ctx.fillText(t.title,x+cellW/2,y+22);
    ctx.fillStyle=done?'rgba(76,175,80,.6)':'rgba(200,190,160,.4)';ctx.font='8px sans-serif';
    ctx.fillText(done?'✓ Mastered':'Click to master',x+cellW/2,y+38);
  });
  var grade=pct>=100?'S':pct>=75?'A':pct>=50?'B':pct>=25?'C':'D';
  ctx.fillStyle='#ffd700';ctx.font='bold 20px sans-serif';ctx.textAlign='center';
  ctx.fillText(grade,W-50,H-30);
  ctx.font='9px sans-serif';ctx.fillStyle='rgba(200,190,160,.5)';ctx.fillText('Stage Grade',W-50,H-14);
  saveProgress({v19_stage:1});
}

/* ─── 11. LISTENING JOURNAL Canvas 600x380 ─── */
var journalState={entries:null};
function loadJournal(){try{return JSON.parse(localStorage.getItem('v19_journal')||'[]');}catch(e){return [];}}
function saveJournal(j){localStorage.setItem('v19_journal',JSON.stringify(j));}
function createListeningJournalPanel(){
  var d=document.createElement('div');d.id='listeningJournalPanel';
  d.innerHTML='<span class="v19Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>\u{1F4D6} 음악 감상 일지</h3>'+
    '<canvas id="journalCanvas" width="600" height="380"></canvas>'+
    '<div style="width:100%;max-width:580px;margin:8px 0">'+
    '<div class="v19SubTitle">새 감상 작성</div>'+
    '<input id="journalTitle" placeholder="곡명" style="width:100%;padding:6px;background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.2);border-radius:6px;color:#ffd700;font-size:11px;margin:4px 0">'+
    '<div style="display:flex;gap:4px;margin:4px 0">'+
    '<select id="journalRating" style="background:#1a1020;color:#ffd700;border:1px solid #ffd700;border-radius:4px;padding:4px;font-size:10px">'+
    '<option value="5">★★★★★</option><option value="4">★★★★</option>'+
    '<option value="3">★★★</option><option value="2">★★</option><option value="1">★</option></select>'+
    '<select id="journalMood" style="background:#1a1020;color:#ffd700;border:1px solid #ffd700;border-radius:4px;padding:4px;font-size:10px">'+
    '<option value="inspired">감동</option><option value="calm">평온</option><option value="energized">활력</option>'+
    '<option value="nostalgic">향수</option><option value="pensive">사색</option></select>'+
    '<button class="v19Btn" onclick="addJournalEntry()">추가</button></div></div>'+
    '<div class="v19Info">음악을 듣고 느낌을 기록하세요. 감상 일지가 쌍여갑니다.</div>';
  document.body.appendChild(d);
}
window.addJournalEntry=function(){
  var title=document.getElementById('journalTitle').value.trim();
  if(!title)return;
  var rating=parseInt(document.getElementById('journalRating').value);
  var mood=document.getElementById('journalMood').value;
  var entries=loadJournal();
  entries.push({title:title,rating:rating,mood:mood,date:new Date().toLocaleDateString('ko-KR')});
  if(entries.length>30)entries=entries.slice(-30);
  saveJournal(entries);journalState.entries=entries;
  document.getElementById('journalTitle').value='';
  drawJournalCanvas();v19Sfx('journal_write');
  addHistory('journal','Listened: '+title+' ('+rating+' stars)');
  if(entries.length>=10)unlockAch('journal_keeper');
};
function drawJournalCanvas(){
  var cv=document.getElementById('journalCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
  ctx.textAlign='center';ctx.fillText('Listening Journal',W/2,24);
  var entries=journalState.entries;
  if(!entries)entries=loadJournal();journalState.entries=entries;
  if(entries.length===0){
    ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='12px sans-serif';
    ctx.fillText('No entries yet. Add your first listening note!',W/2,H/2);return;
  }
  ctx.fillStyle='#daa520';ctx.font='11px sans-serif';
  ctx.fillText(entries.length+' Entries',W/2,46);
  var moodCounts={inspired:0,calm:0,energized:0,nostalgic:0,pensive:0};
  var totalRating=0;
  entries.forEach(function(e){moodCounts[e.mood]=(moodCounts[e.mood]||0)+1;totalRating+=e.rating;});
  var avgRating=(totalRating/entries.length).toFixed(1);

  var moodNames={inspired:'감동',calm:'평온',energized:'활력',nostalgic:'향수',pensive:'사색'};
  var moodColors={inspired:'#ffd700',calm:'#4caf50',energized:'#ff6644',nostalgic:'#9c27b0',pensive:'#2196f3'};
  var pieX=140,pieY=140,pieR=60;
  var angleStart=-Math.PI/2;
  Object.keys(moodCounts).forEach(function(m){
    if(moodCounts[m]===0)return;
    var angle=moodCounts[m]/entries.length*Math.PI*2;
    ctx.beginPath();ctx.moveTo(pieX,pieY);ctx.arc(pieX,pieY,pieR,angleStart,angleStart+angle);ctx.closePath();
    ctx.fillStyle=moodColors[m];ctx.globalAlpha=.7;ctx.fill();ctx.globalAlpha=1;
    angleStart+=angle;
  });
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.beginPath();ctx.arc(pieX,pieY,30,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ffd700';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText('Mood',pieX,pieY+4);
  var legendY=230;
  Object.keys(moodNames).forEach(function(m,i){
    ctx.fillStyle=moodColors[m];ctx.font='9px sans-serif';ctx.textAlign='left';
    ctx.fillText('● '+moodNames[m]+': '+moodCounts[m],60,legendY+i*14);
  });

  ctx.fillStyle='#daa520';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
  ctx.fillText('Avg Rating: '+avgRating+' ★',W-140,90);

  var recentY=110;
  var recent=entries.slice(-8).reverse();
  recent.forEach(function(e,i){
    var y=recentY+i*30;
    if(y>H-30)return;
    ctx.fillStyle='rgba(255,250,235,.04)';ctx.beginPath();ctx.roundRect(280,y,W-310,26,4);ctx.fill();
    ctx.fillStyle='#daa520';ctx.font='10px sans-serif';ctx.textAlign='left';
    var stars='';for(var s=0;s<e.rating;s++)stars+='★';
    ctx.fillText(e.title.substring(0,20),290,y+11);
    ctx.fillStyle='#ffd700';ctx.textAlign='right';ctx.fillText(stars,W-40,y+11);
    ctx.fillStyle='rgba(200,190,160,.4)';ctx.font='8px sans-serif';
    ctx.fillText(e.date,290,y+22);
  });
  saveProgress({v19_journal:1});
}

/* ─── 12. QUIZ v19 PANEL ─── */
var quizV19State={idx:0,score:0,total:V19_QUIZ.length,done:false,answers:[]};
function createQuizV19Panel(){
  var d=document.createElement('div');d.id='quizV19Panel';
  d.innerHTML='<span class="v19Close" onclick="this.parentNode.classList.remove(\'show\')">&times;</span>'+
    '<h3>\u{1F9E0} 퀴즈 v19 (15문항)</h3>'+
    '<div id="quizV19Content" style="width:100%;max-width:540px;padding:12px"></div>';
  document.body.appendChild(d);
}
function renderQuizV19(){
  var box=document.getElementById('quizV19Content');if(!box)return;
  if(quizV19State.done){
    var pct=Math.round(quizV19State.score/quizV19State.total*100);
    var grade=pct>=90?'S':pct>=70?'A':pct>=50?'B':pct>=30?'C':'D';
    box.innerHTML='<div style="text-align:center;padding:20px">'+
      '<div style="font-size:28px;color:#ffd700;font-weight:bold">'+grade+'</div>'+
      '<div style="font-size:14px;color:#daa520;margin:8px 0">'+quizV19State.score+'/'+quizV19State.total+' ('+pct+'%)</div>'+
      '<button class="v19Btn" onclick="retryQuizV19()">Retry</button></div>';
    addHistory('quiz','Quiz v19: '+quizV19State.score+'/'+quizV19State.total);
    return;
  }
  var q=V19_QUIZ[quizV19State.idx];
  var html='<div style="font-size:11px;color:rgba(200,190,160,.5);margin-bottom:4px">Q'+(quizV19State.idx+1)+'/'+quizV19State.total+'</div>'+
    '<div style="font-size:13px;color:#ffd700;margin-bottom:12px;line-height:1.5">'+q.q+'</div>';
  q.a.forEach(function(a,i){
    html+='<div class="v19Card" onclick="answerQuizV19('+i+')" style="margin:4px 0">'+a+'</div>';
  });
  box.innerHTML=html;
}
window.answerQuizV19=function(idx){
  var q=V19_QUIZ[quizV19State.idx];
  if(idx===q.c){quizV19State.score++;v19Sfx('quiz_v19');}
  else{v19Sfx('quiz_wrong_v19');}
  quizV19State.answers.push(idx);
  quizV19State.idx++;
  if(quizV19State.idx>=quizV19State.total)quizV19State.done=true;
  renderQuizV19();
};
window.retryQuizV19=function(){
  quizV19State={idx:0,score:0,total:V19_QUIZ.length,done:false,answers:[]};
  renderQuizV19();
};

/* ─── 13. REGISTER SONGS, LESSONS ─── */
if(window.SONG_DB&&Array.isArray(window.SONG_DB)){V19_SONGS.forEach(function(s){window.SONG_DB.push(s);});}
if(window.LESSON_DB&&Array.isArray(window.LESSON_DB)){V19_LESSONS.forEach(function(l){window.LESSON_DB.push(l);});}

/* ─── 14. NAVIGATION (append to existing nav) ─── */
function addV19Nav(){
  var existing=document.querySelector('.sg30-bottom-bar')||document.querySelector('[class*="bottom-bar"]')||document.querySelector('.v18-nav')||document.querySelector('[id*="navBar"]');
  var navTarget=existing;
  if(!navTarget){
    var allBtns=document.querySelectorAll('button,div[onclick]');
    var lastNav=null;
    allBtns.forEach(function(b){if(b.textContent&&b.textContent.length<20&&b.parentNode)lastNav=b.parentNode;});
    navTarget=lastNav;
  }
  var btns=[
    {label:'\u{1F30A}비브',panel:'vibratoAnalyzerPanel',draw:drawVibratoCanvas},
    {label:'\u{1F3BB}오케',panel:'orchSeatPanel',draw:drawOrchSeatCanvas},
    {label:'\u{2B50}명인',panel:'virtuosoPanel',draw:drawVirtuosoCanvas},
    {label:'\u{1F3AF}음정',panel:'intonationMapPanel',draw:drawIntonationCanvas},
    {label:'\u{1F4CB}루틴',panel:'routineGenPanel',draw:drawRoutineCanvas},
    {label:'\u{1F9F5}현;',panel:'stringGuidePanel',draw:drawStringCanvas},
    {label:'\u{1F3AD}무대',panel:'stageMannerPanel',draw:drawStageCanvas},
    {label:'\u{1F4D6}감상',panel:'listeningJournalPanel',draw:drawJournalCanvas},
    {label:'\u{1F9E0}Q19',panel:'quizV19Panel',draw:renderQuizV19}
  ];
  var wrap=document.createElement('div');
  wrap.style.cssText='display:flex;gap:2px;flex-wrap:wrap;padding:2px 4px;background:rgba(140,105,60,.12);border-top:1px solid rgba(255,215,0,.08);';
  btns.forEach(function(b){
    var btn=document.createElement('button');
    btn.style.cssText='flex:1;min-width:48px;padding:4px 2px;font-size:9px;background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.15);border-radius:4px;color:#c9a96e;cursor:pointer;';
    btn.textContent=b.label;
    btn.onclick=function(){
      document.getElementById(b.panel).classList.add('show');
      if(b.draw)b.draw();v19Sfx('orch_seat');
    };
    wrap.appendChild(btn);
  });
  if(navTarget){navTarget.appendChild(wrap);}
  else{document.body.appendChild(wrap);}
}

/* ─── 15. KEYBOARD SHORTCUTS ─── */
document.addEventListener('keydown',function(e){
  if(!e.shiftKey)return;
  var map={
    'KeyN':'vibratoAnalyzerPanel','KeyO':'orchSeatPanel','KeyP':'virtuosoPanel',
    'KeyI':'intonationMapPanel','KeyR':'routineGenPanel','KeyS':'stringGuidePanel',
    'KeyM':'stageMannerPanel','KeyJ':'listeningJournalPanel'
  };
  var panel=map[e.code];
  if(panel){
    e.preventDefault();
    var el=document.getElementById(panel);
    if(el){el.classList.toggle('show');
      if(el.classList.contains('show')){
        if(panel==='vibratoAnalyzerPanel')drawVibratoCanvas();
        else if(panel==='orchSeatPanel')drawOrchSeatCanvas();
        else if(panel==='virtuosoPanel')drawVirtuosoCanvas();
        else if(panel==='intonationMapPanel')drawIntonationCanvas();
        else if(panel==='routineGenPanel')drawRoutineCanvas();
        else if(panel==='stringGuidePanel')drawStringCanvas();
        else if(panel==='stageMannerPanel')drawStageCanvas();
        else if(panel==='listeningJournalPanel')drawJournalCanvas();
      }
    }
  }
});

/* ─── 16. INIT ─── */
function initV19(){
  createVibratoPanel();
  createOrchSeatPanel();
  createVirtuosoPanel();
  createIntonationPanel();
  createRoutinePanel();
  createStringGuidePanel();
  createStageMannerPanel();
  createListeningJournalPanel();
  createQuizV19Panel();
  addV19Nav();
  saveProgress({v19_loaded:1});
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initV19);}
else{initV19();}

})();
