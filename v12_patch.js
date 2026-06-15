/* ═══════════════════════════════════════════════════════════
   VIOLIN REAL v12.0 PATCH MODULE
   포지션트레이너Canvas5포지션+오케스트라파트연습6곡+
   이어트레이닝고급12종+연습분석대시보드Canvas+악보리더Canvas+
   바이올린관리가이드12항목+명곡해설12곡+공유카드v2Canvas+
   10곡추가(84→94)+10레슨(110→120)+15퀴즈추가(30→45)+
   12업적추가(82→94)+SFX12종+키보드8종
   ═══════════════════════════════════════════════════════════ */
(function V12Patch(){'use strict';

if(window.__V12_LOADED)return;window.__V12_LOADED=true;

/* ─── HELPERS ─── */
function lp(){try{return JSON.parse(localStorage.getItem('violinProgress')||'{}');}catch(e){return {};}}
function sp(p){var o=lp();Object.assign(o,p);localStorage.setItem('violinProgress',JSON.stringify(o));}
function la(){try{return JSON.parse(localStorage.getItem('violinAchievements')||'{}');}catch(e){return {};}}
function ls2(){try{return JSON.parse(localStorage.getItem('violinStats')||'{}');}catch(e){return {};}}
function ss2(s){localStorage.setItem('violinStats',JSON.stringify(s));}
function unlockAch(id){
  var achs=la();if(achs[id])return;achs[id]=Date.now();
  localStorage.setItem('violinAchievements',JSON.stringify(achs));
  var info=V12_ACHS.find(function(a){return a.id===id;});
  if(!info)return;
  if(typeof window.showAchToast==='function')window.showAchToast(id);
  else{var t=document.getElementById('achToast');if(t){
    t.querySelector('.at').textContent=info.icon+' '+info.name;t.querySelector('.as').textContent=info.desc;
    t.classList.add('show');setTimeout(function(){t.classList.remove('show');},3000);}}
}
function addHist(type,text){
  try{var h=JSON.parse(localStorage.getItem('violinV10_history')||'[]');
  h.push({type:type,text:text,date:new Date().toLocaleString('ko-KR')});
  if(h.length>60)h=h.slice(-60);
  localStorage.setItem('violinV10_history',JSON.stringify(h));}catch(e){}
}

/* ─── AUDIO CONTEXT ─── */
var actx=null;
function getACtx(){if(!actx)try{actx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return actx;}

function v12Sfx(type){
  var ac=getACtx();if(!ac)return;
  var o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);
  var n=ac.currentTime;g.gain.setValueAtTime(0.15,n);
  switch(type){
    case'pos_tap':o.type='triangle';o.frequency.setValueAtTime(660,n);g.gain.exponentialRampToValueAtTime(0.001,n+0.12);o.start(n);o.stop(n+0.12);break;
    case'pos_done':o.type='sine';o.frequency.setValueAtTime(880,n);o.frequency.linearRampToValueAtTime(1320,n+0.2);g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);break;
    case'orch_play':o.type='sawtooth';o.frequency.setValueAtTime(440,n);g.gain.setValueAtTime(0.08,n);g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);break;
    case'orch_part':o.type='triangle';o.frequency.setValueAtTime(523,n);g.gain.exponentialRampToValueAtTime(0.001,n+0.15);o.start(n);o.stop(n+0.15);break;
    case'ear_correct':o.type='sine';o.frequency.setValueAtTime(523,n);var o2=ac.createOscillator(),g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='sine';o2.frequency.setValueAtTime(659,n+0.1);g2.gain.setValueAtTime(0.12,n+0.1);g2.gain.exponentialRampToValueAtTime(0.001,n+0.3);o2.start(n+0.1);o2.stop(n+0.3);g.gain.exponentialRampToValueAtTime(0.001,n+0.2);o.start(n);o.stop(n+0.2);break;
    case'ear_wrong':o.type='square';o.frequency.setValueAtTime(200,n);g.gain.setValueAtTime(0.06,n);g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);break;
    case'dash_open':o.type='triangle';o.frequency.setValueAtTime(440,n);o.frequency.linearRampToValueAtTime(660,n+0.1);g.gain.exponentialRampToValueAtTime(0.001,n+0.15);o.start(n);o.stop(n+0.15);break;
    case'sheet_note':o.type='sine';o.frequency.setValueAtTime(587,n);g.gain.exponentialRampToValueAtTime(0.001,n+0.1);o.start(n);o.stop(n+0.1);break;
    case'care_tip':o.type='triangle';o.frequency.setValueAtTime(392,n);g.gain.exponentialRampToValueAtTime(0.001,n+0.2);o.start(n);o.stop(n+0.2);break;
    case'master_open':o.type='sine';o.frequency.setValueAtTime(523,n);o.frequency.linearRampToValueAtTime(784,n+0.15);g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);break;
    case'share_snap':o.type='triangle';o.frequency.setValueAtTime(1047,n);g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);break;
    case'achieve_v12':o.type='sine';o.frequency.setValueAtTime(523,n);o.frequency.linearRampToValueAtTime(784,n+0.15);o.frequency.linearRampToValueAtTime(1047,n+0.3);g.gain.exponentialRampToValueAtTime(0.001,n+0.4);o.start(n);o.stop(n+0.4);break;
  }
}

/* ─── ACHIEVEMENTS ─── */
var V12_ACHS=[
  {id:'pos_beginner',name:'포지션 입문',desc:'포지션 트레이너 첫 시작',icon:'🎯'},
  {id:'pos_master',name:'포지션 마스터',desc:'5개 포지션 모두 완료',icon:'🏆'},
  {id:'orch_first',name:'합주 데뷔',desc:'오케스트라 파트 첫 연습',icon:'🎶'},
  {id:'orch_all',name:'오케스트라 단원',desc:'6곡 전부 연습',icon:'🎼'},
  {id:'ear_start',name:'음감 훈련생',desc:'이어트레이닝 첫 도전',icon:'👂'},
  {id:'ear_perfect',name:'절대음감',desc:'이어트레이닝 10연속 정답',icon:'🎵'},
  {id:'dash_viewer',name:'분석가',desc:'연습 대시보드 확인',icon:'📊'},
  {id:'sheet_reader',name:'악보 리더',desc:'악보 읽기 첫 완료',icon:'📜'},
  {id:'care_master',name:'악기 관리사',desc:'관리 가이드 전부 읽기',icon:'🔧'},
  {id:'master_10',name:'명곡 감상가',desc:'명곡 해설 10곡 읽기',icon:'🎻'},
  {id:'share_v2',name:'공유 달인',desc:'공유 카드 v2 생성',icon:'📸'},
  {id:'v12_explorer',name:'v12 탐험가',desc:'v12 모든 기능 1회 사용',icon:'🌟'}
];

/* ─── SONGS (10 new: 84→94) ─── */
var V12_SONGS=[
  {name:'차르다시',artist:'몬티',cat:'클래식',diff:'상',bpm:140,
   notes:'G4,A4,B4,C5,D5,E5,F#5,G5,A5,G5,F#5,E5,D5,C5,B4,A4,G4,B4,D5,G5,F#5,E5,D5,C5,B4,A4,G4,A4,B4,C5,D5,E5,F#5,G5'.split(',')},
  {name:'카바티나',artist:'라프',cat:'클래식',diff:'중',bpm:72,
   notes:'E4,G4,B4,E5,D5,C5,B4,A4,G4,F#4,E4,D4,E4,G4,B4,E5,D5,C5,B4,A4,G4,A4,B4,C5,D5,E5,D5,C5,B4,A4,G4'.split(',')},
  {name:'왈츠 Op.39-15',artist:'브람스',cat:'클래식',diff:'중',bpm:108,
   notes:'A4,B4,C#5,D5,E5,F#5,E5,D5,C#5,B4,A4,F#4,A4,D5,F#5,E5,D5,C#5,B4,A4,G4,F#4,E4,D4,A4,D5,F#5,A5'.split(',')},
  {name:'엘리제를 위하여 편곡',artist:'베토벤',cat:'클래식',diff:'중',bpm:100,
   notes:'E5,D#5,E5,D#5,E5,B4,D5,C5,A4,C4,E4,A4,B4,E4,G#4,B4,C5,E4,E5,D#5,E5,D#5,E5,B4,D5,C5,A4'.split(',')},
  {name:'할렐루야',artist:'헨델',cat:'클래식',diff:'하',bpm:100,
   notes:'D4,D4,D4,D4,E4,F#4,F#4,E4,F#4,G4,G4,A4,A4,A4,G4,F#4,G4,A4,B4,A4,G4,F#4,E4,D4,D4,A4,B4,A4'.split(',')},
  {name:'봄이 오면',artist:'한국가곡',cat:'한국',diff:'하',bpm:88,
   notes:'G4,A4,B4,D5,B4,A4,G4,E4,G4,A4,B4,D5,B4,A4,G4,D4,E4,G4,A4,B4,D5,E5,D5,B4,A4,G4'.split(',')},
  {name:'스프링소나타 1악장',artist:'베토벤',cat:'클래식',diff:'상',bpm:128,
   notes:'F5,A5,G5,F5,E5,D5,C5,D5,E5,F5,G5,A5,Bb5,A5,G5,F5,E5,D5,C5,D5,F5,A5,G5,F5,E5,D5,C5,Bb4,A4,G4,F4'.split(',')},
  {name:'노래의 날개 위에',artist:'멘델스존',cat:'클래식',diff:'중',bpm:80,
   notes:'E4,F#4,G4,A4,B4,C5,B4,A4,G4,F#4,E4,B4,A4,G4,F#4,E4,D4,E4,F#4,G4,A4,B4,C5,D5,E5,D5,C5,B4'.split(',')},
  {name:'오 솔레 미오',artist:'나폴리민요',cat:'세계민요',diff:'하',bpm:96,
   notes:'C5,D5,E5,F5,G5,A5,G5,F5,E5,D5,C5,G4,C5,E5,G5,F5,E5,D5,C5,B4,C5,D5,E5,C5'.split(',')},
  {name:'도나우강의 잔물결 편곡',artist:'이바노비치',cat:'클래식',diff:'중',bpm:112,
   notes:'D5,F#5,A5,D6,C#6,B5,A5,G5,F#5,E5,D5,A4,D5,F#5,A5,G5,F#5,E5,D5,C#5,D5,E5,F#5,G5,A5,B5,A5'.split(',')}
];

/* ─── LESSONS (10 new: 110→120) ─── */
var V12_LESSONS=[
  {name:'3rd 포지션 기초',desc:'3포지션에서의 음계 연습',notes:'A4,B4,C5,D5,E5,F5,G5,A5'.split(',')},
  {name:'5th 포지션 도전',desc:'5포지션 하이노트 연습',notes:'E5,F#5,G5,A5,B5,C6,D6,E6'.split(',')},
  {name:'포지션 이동 연습',desc:'1→3포지션 부드러운 전환',notes:'G4,A4,B4,C5,D5,E5,D5,C5,B4,A4,G4'.split(',')},
  {name:'오케스트라 1st 바이올린',desc:'캐논 1st 파트 연습',notes:'F#5,E5,D5,C#5,B4,A4,B4,C#5'.split(',')},
  {name:'화음 청음 훈련',desc:'장/단3도 음정 구별',notes:'C4,E4,C4,Eb4,G4,B4,G4,Bb4'.split(',')},
  {name:'차르다시 도입부',desc:'몬티 차르다시 느린 부분',notes:'G4,A4,B4,C5,D5,E5,F#5,G5'.split(',')},
  {name:'스프링소나타 테마',desc:'베토벤 봄 소나타 주제',notes:'F5,A5,G5,F5,E5,D5,C5,D5,E5,F5'.split(',')},
  {name:'트릴 응용',desc:'빠른 트릴 기법 연습',notes:'A4,B4,A4,B4,A4,B4,A4,B4,C5,D5,C5,D5'.split(',')},
  {name:'하모닉스',desc:'자연 하모닉스 연주법',notes:'G5,D6,B5,G6,D6,B5,G5'.split(',')},
  {name:'v12 졸업곡',desc:'v12 종합 테스트',notes:'G4,A4,B4,D5,G5,F#5,E5,D5,C5,B4,A4,G4,D5,B4,G4'.split(',')}
];

/* ─── QUIZ (15 new: 30→45) ─── */
var V12_QUIZ=[
  {q:'1st 포지션에서 G선의 첫 번째 손가락 음은?',a:['A4','B4','G#4','Ab4'],c:0},
  {q:'3rd 포지션에서 A선의 1번 손가락이 짚는 음은?',a:['D5','C#5','E5','B4'],c:0},
  {q:'오케스트라에서 1st 바이올린의 역할은?',a:['주선율 연주','반주','저음부','타악'],c:0},
  {q:'차르다시(Czardas)를 작곡한 작곡가는?',a:['몬티','파가니니','비발디','바흐'],c:0},
  {q:'비올라의 조율은 바이올린보다?',a:['5도 낮다','5도 높다','같다','옥타브 낮다'],c:0},
  {q:'바이올린 현을 갈아야 하는 적절한 주기는?',a:['3~6개월','1주일','5년','10년'],c:0},
  {q:'장3도 음정의 반음 수는?',a:['4반음','3반음','5반음','2반음'],c:0},
  {q:'단3도 음정의 반음 수는?',a:['3반음','4반음','2반음','5반음'],c:0},
  {q:'바이올린의 f홀(사운드홀)의 기능은?',a:['공명 증폭','장식','현 고정','조율'],c:0},
  {q:'하모닉스(harmonics)는 어떻게 연주하나?',a:['현 위에 가볍게 터치','세게 누름','활을 빨리 움직임','피치카토'],c:0},
  {q:'스프링소나타의 작곡가와 조성은?',a:['베토벤, F장조','모차르트, G장조','바흐, D단조','브람스, A장조'],c:0},
  {q:'바이올린 브릿지의 높이가 음색에 미치는 영향은?',a:['높으면 밝고 크다','없다','높으면 어둡다','관계없다'],c:0},
  {q:'포지션 이동 시 가장 중요한 것은?',a:['엄지의 유연한 이동','손가락 힘','활 압력','현 선택'],c:0},
  {q:'트릴(trill)의 기보 기호는?',a:['tr','f','p','mf'],c:0},
  {q:'바이올린 활의 무게 중심은 어디에 있어야 하나?',a:['중간~프로그 쪽','팁 쪽','정확히 중앙','상관없다'],c:0}
];

/* ─── POSITION DATA ─── */
var POSITIONS=[
  {pos:1,name:'1st 포지션',range:'G3~E5',desc:'가장 기본. 개방현 바로 위',
   strings:{G:['A3','B3','C4','D4'],D:['E4','F4','F#4','G4'],A:['B4','C5','C#5','D5'],E:['F5','F#5','G5','A5']}},
  {pos:2,name:'2nd 포지션',range:'A3~F#5',desc:'1st보다 반음~온음 위',
   strings:{G:['Bb3','B3','C4','D4'],D:['F4','F#4','G4','A4'],A:['C5','C#5','D5','E5'],E:['G5','G#5','A5','B5']}},
  {pos:3,name:'3rd 포지션',range:'C4~A5',desc:'고음역 시작. 중급 필수',
   strings:{G:['C4','D4','Eb4','E4'],D:['G4','A4','Bb4','B4'],A:['D5','E5','F5','F#5'],E:['A5','B5','C6','C#6']}},
  {pos:4,name:'4th 포지션',range:'D4~B5',desc:'중상급. 넓은 음역대',
   strings:{G:['D4','Eb4','E4','F4'],D:['A4','Bb4','B4','C5'],A:['E5','F5','F#5','G5'],E:['B5','C6','C#6','D6']}},
  {pos:5,name:'5th 포지션',range:'E4~D6',desc:'상급. 하이포지션 입문',
   strings:{G:['E4','F4','F#4','G4'],D:['B4','C5','C#5','D5'],A:['F#5','G5','G#5','A5'],E:['C#6','D6','D#6','E6']}}
];

/* ─── ORCHESTRA PIECES ─── */
var ORCH_PIECES=[
  {name:'캐논 in D',artist:'파헬벨',v1:['F#5','E5','D5','C#5','B4','A4','B4','C#5','D5','C#5','B4','A4','G4','F#4','G4','A4'],
   v2:['D4','A3','B3','F#3','G3','D3','G3','A3','D4','A3','B3','F#3','G3','D3','G3','A3']},
  {name:'아이네 클라이네 1악장',artist:'모차르트',v1:['G5','D5','G5','D5','G5','B5','D6','C6','B5','A5','G5','F#5','G5'],
   v2:['B4','G4','B4','G4','B4','D5','F#5','E5','D5','C5','B4','A4','B4']},
  {name:'사계: 봄 1악장',artist:'비발디',v1:['E5','E5','E5','F#5','G#5','G#5','F#5','E5','D#5','C#5','D#5','E5'],
   v2:['E4','E4','E4','A4','B4','B4','A4','G#4','F#4','E4','F#4','G#4']},
  {name:'브란덴부르크 3번',artist:'바흐',v1:['G4','B4','D5','G5','F#5','E5','D5','C5','B4','A4','G4'],
   v2:['G3','D4','B3','G3','A3','B3','C4','D4','E4','F#4','G4']},
  {name:'현악세레나데',artist:'차이코프스키',v1:['C5','E5','G5','C6','B5','A5','G5','F5','E5','D5','C5'],
   v2:['C4','G3','E4','C4','G3','F3','E3','D3','G3','B3','C4']},
  {name:'헝가리 무곡 5번',artist:'브람스',v1:['F#5','G5','A5','B5','C#6','D6','C#6','B5','A5','G5','F#5','E5'],
   v2:['D4','E4','F#4','G4','A4','B4','A4','G4','F#4','E4','D4','C#4']}
];

/* ─── EAR TRAINING INTERVALS ─── */
var EAR_INTERVALS=[
  {name:'단2도 (m2)',semitones:1,example:'조스 테마'},
  {name:'장2도 (M2)',semitones:2,example:'도레미 시작'},
  {name:'단3도 (m3)',semitones:3,example:'슬픈 화음'},
  {name:'장3도 (M3)',semitones:4,example:'밝은 화음'},
  {name:'완전4도 (P4)',semitones:5,example:'결혼행진곡'},
  {name:'증4도 (A4)',semitones:6,example:'심슨즈 테마'},
  {name:'완전5도 (P5)',semitones:7,example:'스타워즈'},
  {name:'단6도 (m6)',semitones:8,example:'엔터테이너'},
  {name:'장6도 (M6)',semitones:9,example:'NBC 사운드'},
  {name:'단7도 (m7)',semitones:10,example:'웨스트사이드'},
  {name:'장7도 (M7)',semitones:11,example:'테이크온미'},
  {name:'옥타브 (P8)',semitones:12,example:'오버더레인보우'}
];

/* ─── CARE GUIDE ─── */
var CARE_GUIDE=[
  {title:'현 교체 시기',icon:'🎵',content:'연습량에 따라 3~6개월마다 교체. 현이 칙칙해지거나 음정이 안 맞으면 교체 시기.'},
  {title:'활 관리법',icon:'🏹',content:'연주 후 반드시 활 장력을 풀어줄 것. 활털이 더러우면 알코올로 가볍게 닦기. 송진은 연주 전 3~5회 가볍게.'},
  {title:'보관 온습도',icon:'🌡️',content:'온도 18~22도, 습도 45~55%. 급격한 온도변화 금지. 차 안에 방치하면 바니시가 손상될 수 있음.'},
  {title:'바니시 관리',icon:'✨',content:'연주 후 부드러운 천으로 송진 가루를 닦아줄 것. 전용 클리너만 사용. 가정용 세제 금지.'},
  {title:'브릿지 점검',icon:'🔍',content:'브릿지가 앞으로 기울어지지 않았는지 정기 점검. 현 교체 시 브릿지 위치도 확인.'},
  {title:'사운드포스트',icon:'🔧',content:'혼(사운드포스트) 위치가 음색을 결정. 이동은 반드시 전문 제작자에게. 자가 수리 금지.'},
  {title:'페그(줄감개) 관리',icon:'⚙️',content:'건조하면 페그컴파운드(Pine compound)를, 습하면 페그드롭스를 사용. 억지로 돌리지 말 것.'},
  {title:'케이스 관리',icon:'💼',content:'케이스 안에 습도조절기(Dampit 등) 비치. 충격 방지 패딩 상태 점검. 악보/소품은 별도 주머니에.'},
  {title:'현 세척',icon:'🧹',content:'연주 후 현을 마른 천으로 닦아 송진 잔여물 제거. 현 수명이 30% 이상 늘어남.'},
  {title:'지판 관리',icon:'🎯',content:'지판은 흑단(Ebony). 가끔 레몬오일로 닦아 건조 방지. 파인 주자 방지. 연 1~2회면 충분.'},
  {title:'턱받침 위생',icon:'🧽',content:'턱받침은 피부 접촉이 많아 정기적으로 소독 티슈로 닦기. 알레르기가 있으면 하이포알러제닉 커버 사용.'},
  {title:'계절 관리 주의',icon:'🍂',content:'겨울: 가습기 필수. 여름: 직사광선 피하기. 장마철: 실리카겔 케이스 안에 비치.'}
];

/* ─── MASTERPIECE COMMENTARY ─── */
var MASTERPIECES=[
  {title:'사계 - 봄',artist:'비발디',year:1725,key:'E장조',icon:'🌸',
   content:'4개의 협주곡 중 가장 유명한 제1번. 새의 노래와 시냇물을 묘사. 3악장 구성으로 빠르고-느리고-빠른 형식. 바이올린 독주가 자연의 아름다움을 표현.'},
  {title:'바이올린 협주곡',artist:'멘델스존',year:1845,key:'E단조',icon:'🎭',
   content:'낭만주의 3대 바이올린 협주곡 중 하나. 1악장 시작부터 바이올린 독주로 시작하는 혁신적 구조. 감미롭고 서정적인 선율이 특징.'},
  {title:'바이올린 협주곡',artist:'베토벤',year:1806,key:'D장조',icon:'🏛️',
   content:'작품61. 유일한 바이올린 협주곡. 초연은 실패했으나 요아힘의 재발견으로 명곡 반열에. 웅장하고 서정적인 1악장이 유명.'},
  {title:'차르다시',artist:'몬티',year:1904,key:'D단조/장조',icon:'🔥',
   content:'헝가리 차르다시 춤곡 형식. 느린 라산(Lassan)과 빠른 프리스카(Friska) 대비가 극적. 기교적이면서도 감성적인 명곡.'},
  {title:'카프리스 24번',artist:'파가니니',year:1820,key:'A단조',icon:'👿',
   content:'24개 카프리스 중 마지막 곡. 초절기교의 대명사. 수많은 작곡가가 이 주제로 변주곡을 작곡. 바이올린 기교의 한계를 시험하는 작품.'},
  {title:'타이스의 명상곡',artist:'마스네',year:1894,key:'D장조',icon:'💫',
   content:'오페라 타이스의 간주곡. 바이올린 독주의 아름다운 선율이 영혼의 평화를 표현. 결혼식/장례식 등에서 자주 연주되는 불후의 명곡.'},
  {title:'G선상의 아리아',artist:'바흐',year:1731,key:'D장조',icon:'🕊️',
   content:'관현악 모음곡 3번 에어. 빌헬미의 편곡으로 G선 하나만으로 연주. 느리고 장엄한 선율이 깊은 감동을 줌.'},
  {title:'시벨리우스 협주곡',artist:'시벨리우스',year:1905,key:'D단조',icon:'❄️',
   content:'핀란드의 자연과 고독을 담은 협주곡. 1악장의 서늘한 서정미, 3악장의 역동적 에너지. 북유럽 감성의 정수.'},
  {title:'치곤느',artist:'바흐',year:1720,key:'D단조',icon:'📿',
   content:'무반주 파르티타 2번의 마지막 악장. 약 15분의 대곡. 바이올린 하나로 오케스트라적 깊이를 구현. 바이올린 문헌의 최고봉.'},
  {title:'차이코프스키 협주곡',artist:'차이코프스키',year:1878,key:'D장조',icon:'🐻',
   content:'러시아적 열정과 서정미의 결합. 초연에서 혹평받았으나 현재 가장 많이 연주되는 협주곡 중 하나. 1악장 카덴차가 압권.'},
  {title:'크로이처 소나타',artist:'베토벤',year:1803,key:'A장조/단조',icon:'⚡',
   content:'바이올린 소나타 9번. 격렬하고 열정적. 톨스토이의 소설 제목으로도 유명. 바이올린과 피아노의 대등한 대화.'},
  {title:'비발디 사계 - 겨울',artist:'비발디',year:1725,key:'F단조',icon:'❄️',
   content:'혹독한 겨울 추위와 얼음 위를 걷는 모습을 묘사. 빠른 비발디 특유의 반복 음형과 떨리는 트레몰로가 한기를 표현.'}
];

/* ─── CSS INJECTION ─── */
var sty=document.createElement('style');
sty.textContent=`
/* Position Trainer */
#posPanel{display:none;position:fixed;inset:0;z-index:230;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#posPanel.show{display:flex;}
#posPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.posCard{width:100%;max-width:380px;padding:12px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:12px;cursor:pointer;transition:all .15s;}
.posCard:active{background:rgba(255,215,0,.1);}
.posCard.active{border-color:rgba(255,215,0,.4);background:rgba(255,215,0,.06);}
.posCard.done{border-color:rgba(68,238,68,.3);background:rgba(68,238,68,.03);}
.posName{font-size:13px;color:#ffd700;font-weight:700;}
.posRange{font-size:9px;color:rgba(201,169,110,.4);margin-left:8px;}
.posDesc{font-size:10px;color:rgba(240,230,200,.6);margin-top:4px;}
#posCanvas{border-radius:12px;margin:8px 0;border:1px solid rgba(200,190,160,.08);}
.posProgBar{width:100%;max-width:380px;height:8px;background:rgba(255,250,235,.08);border-radius:4px;margin:6px 0;overflow:hidden;}
.posProgFill{height:100%;background:linear-gradient(90deg,#44ee44,#ffd700);border-radius:4px;transition:width .3s;}
.posStat{font-size:10px;color:rgba(240,230,200,.5);text-align:center;margin:2px 0;}

/* Orchestra Part */
#orchPanel{display:none;position:fixed;inset:0;z-index:230;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#orchPanel.show{display:flex;}
#orchPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.orchCard{width:100%;max-width:380px;padding:12px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:12px;cursor:pointer;transition:all .15s;}
.orchCard:active{background:rgba(255,215,0,.1);}
.orchTitle{font-size:12px;color:#ffd700;font-weight:700;}
.orchArtist{font-size:9px;color:rgba(201,169,110,.4);margin-left:6px;}
.orchPartBtns{display:flex;gap:6px;margin-top:8px;}
.orchPartBtn{padding:4px 14px;border-radius:12px;font-size:10px;cursor:pointer;
  border:1px solid rgba(255,215,0,.2);color:#c9a96e;background:rgba(255,250,235,.04);
  transition:all .15s;font-family:Georgia,serif;}
.orchPartBtn:active{transform:scale(.95);}
.orchPartBtn.v1{border-color:rgba(68,238,68,.3);color:#44ee44;}
.orchPartBtn.v2{border-color:rgba(136,100,255,.3);color:#8864ff;}
.orchPartBtn.playing{background:rgba(255,215,0,.15);border-color:rgba(255,215,0,.5);}
.orchNoteDisplay{margin-top:6px;font-size:11px;color:#ffd700;min-height:24px;
  background:rgba(255,250,235,.03);border-radius:8px;padding:6px;text-align:center;letter-spacing:2px;}

/* Ear Training Advanced */
#earPanel{display:none;position:fixed;inset:0;z-index:230;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#earPanel.show{display:flex;}
#earPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.earQ{font-size:14px;color:#ffd700;text-align:center;margin:12px 0;}
.earPlayBtn{padding:10px 24px;border-radius:20px;font-size:13px;cursor:pointer;
  border:2px solid rgba(255,215,0,.4);color:#ffd700;background:rgba(255,215,0,.08);
  transition:all .2s;font-family:Georgia,serif;margin:8px 0;}
.earPlayBtn:active{transform:scale(.95);background:rgba(255,215,0,.2);}
.earChoices{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;max-width:380px;margin:12px 0;}
.earChoice{padding:10px;border-radius:12px;font-size:11px;cursor:pointer;text-align:center;
  border:1px solid rgba(200,190,160,.15);color:#c9a96e;background:rgba(255,250,235,.04);
  transition:all .15s;font-family:Georgia,serif;}
.earChoice:active{transform:scale(.97);}
.earChoice.correct{border-color:rgba(68,238,68,.5);color:#44ee44;background:rgba(68,238,68,.08);}
.earChoice.wrong{border-color:rgba(255,80,80,.5);color:#ff5050;background:rgba(255,80,80,.06);}
.earScore{display:flex;gap:16px;justify-content:center;margin:8px 0;}
.earScoreItem{font-size:11px;padding:4px 12px;border-radius:8px;background:rgba(255,250,235,.04);
  border:1px solid rgba(200,190,160,.06);}

/* Analytics Dashboard */
#dashPanel{display:none;position:fixed;inset:0;z-index:230;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#dashPanel.show{display:flex;}
#dashPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
#dashCanvas{border-radius:12px;margin:8px 0;border:1px solid rgba(200,190,160,.08);}
.dashCards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;width:100%;max-width:380px;margin:8px 0;}
.dashCard{background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.08);
  border-radius:10px;padding:10px;text-align:center;}
.dashValue{font-size:18px;color:#ffd700;font-weight:700;}
.dashLabel{font-size:8px;color:rgba(201,169,110,.4);margin-top:2px;}

/* Sheet Music Reader */
#sheetPanel{display:none;position:fixed;inset:0;z-index:230;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#sheetPanel.show{display:flex;}
#sheetPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
#sheetCanvas{border-radius:12px;margin:8px 0;border:1px solid rgba(200,190,160,.08);background:rgba(255,250,235,.03);}
.sheetBtns{display:flex;gap:8px;margin:8px 0;flex-wrap:wrap;justify-content:center;}
.sheetBtn{padding:6px 14px;border-radius:12px;font-size:10px;cursor:pointer;
  border:1px solid rgba(255,215,0,.2);color:#c9a96e;background:rgba(255,250,235,.04);
  transition:all .15s;font-family:Georgia,serif;}
.sheetBtn:active{transform:scale(.95);background:rgba(255,215,0,.1);}
.sheetBtn.active{border-color:rgba(255,215,0,.5);color:#ffd700;background:rgba(255,215,0,.08);}

/* Care Guide */
#carePanel{display:none;position:fixed;inset:0;z-index:230;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#carePanel.show{display:flex;}
#carePanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.careCard{width:100%;max-width:380px;padding:12px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:12px;cursor:pointer;transition:all .15s;}
.careCard:active{background:rgba(255,215,0,.08);}
.careCard.expanded{background:rgba(255,250,235,.08);border-color:rgba(255,215,0,.2);}
.careCard.read{border-left:3px solid rgba(68,238,68,.4);}
.careTitle{font-size:12px;color:#ffd700;font-weight:700;}
.careIcon{margin-right:6px;}
.careContent{display:none;font-size:10px;color:rgba(240,230,200,.7);margin-top:8px;
  line-height:1.7;padding-top:6px;border-top:1px solid rgba(255,215,0,.06);}
.careCard.expanded .careContent{display:block;}
.careProg{width:100%;max-width:380px;margin:6px 0;text-align:center;}
.careProgText{font-size:9px;color:rgba(201,169,110,.4);}

/* Masterpiece Commentary */
#masterPanel{display:none;position:fixed;inset:0;z-index:230;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#masterPanel.show{display:flex;}
#masterPanel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
.masterCard{width:100%;max-width:380px;padding:12px;margin:4px 0;
  background:rgba(255,250,235,.05);border:1px solid rgba(200,190,160,.1);
  border-radius:12px;cursor:pointer;transition:all .15s;}
.masterCard:active{background:rgba(255,215,0,.08);}
.masterCard.expanded{background:rgba(255,250,235,.08);border-color:rgba(255,215,0,.2);}
.masterCard.read{border-left:3px solid rgba(68,238,68,.4);}
.masterTitle{font-size:12px;color:#ffd700;font-weight:700;}
.masterMeta{font-size:9px;color:rgba(201,169,110,.4);margin-top:2px;}
.masterContent{display:none;font-size:10px;color:rgba(240,230,200,.7);margin-top:8px;
  line-height:1.7;padding-top:6px;border-top:1px solid rgba(255,215,0,.06);}
.masterCard.expanded .masterContent{display:block;}

/* Share Card v2 */
#shareV2Panel{display:none;position:fixed;inset:0;z-index:230;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#shareV2Panel.show{display:flex;}
#shareV2Panel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}
#shareV2Canvas{border-radius:12px;margin:8px 0;}
.shareV2Btns{display:flex;gap:10px;margin:10px 0;}
.shareV2Btn{padding:8px 20px;border-radius:16px;font-size:11px;cursor:pointer;
  border:1px solid rgba(255,215,0,.3);color:#ffd700;background:rgba(255,215,0,.08);
  transition:all .15s;font-family:Georgia,serif;}
.shareV2Btn:active{transform:scale(.95);background:rgba(255,215,0,.15);}

/* Quiz v12 */
#quizV12Panel{display:none;position:fixed;inset:0;z-index:230;background:rgba(0,0,0,.97);
  flex-direction:column;align-items:center;padding:16px;color:#c9a96e;overflow-y:auto;}
#quizV12Panel.show{display:flex;}
#quizV12Panel h3{font-size:16px;color:#ffd700;margin-bottom:8px;}

/* V12 FAB */
.v12Fab{position:fixed;left:6px;top:50%;transform:translateY(-50%);z-index:200;
  display:flex;flex-direction:column;gap:4px;}
.v12FabBtn{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:14px;cursor:pointer;
  background:rgba(10,8,5,.85);border:1px solid rgba(200,190,160,.12);
  transition:all .15s;backdrop-filter:blur(4px);}
.v12FabBtn:active{transform:scale(.9);background:rgba(255,215,0,.12);}

/* Close button */
.v12Close{position:sticky;top:0;right:0;align-self:flex-end;width:32px;height:32px;
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:16px;cursor:pointer;color:#ffd700;
  background:rgba(255,250,235,.06);border:1px solid rgba(255,215,0,.15);
  z-index:10;flex-shrink:0;margin-bottom:4px;}
.v12Close:active{transform:scale(.9);}

@media(max-width:480px){
  .v12Fab{left:3px;gap:2px;}
  .v12FabBtn{width:30px;height:30px;font-size:12px;}
  .dashCards{grid-template-columns:1fr 1fr;}
  .earChoices{grid-template-columns:1fr 1fr;}
}
`;
document.head.appendChild(sty);

/* ─── PANEL HTML ─── */
function mkClose(panelId){
  return '<div class="v12Close" onclick="document.getElementById(\''+panelId+'\').classList.remove(\'show\')" role="button" tabindex="0">&times;</div>';
}

/* 1. Position Trainer Panel */
var posP=document.createElement('div');posP.id='posPanel';
posP.innerHTML=mkClose('posPanel')+'<h3>🎯 포지션 트레이너</h3><div id="posCards"></div><canvas id="posCanvas" width="380" height="280"></canvas><div class="posProgBar"><div class="posProgFill" id="posProg" style="width:0%"></div></div><div class="posStat" id="posStat">포지션을 선택하세요</div>';
document.body.appendChild(posP);

/* 2. Orchestra Panel */
var orchP=document.createElement('div');orchP.id='orchPanel';
orchP.innerHTML=mkClose('orchPanel')+'<h3>🎼 오케스트라 파트 연습</h3><div id="orchCards"></div>';
document.body.appendChild(orchP);

/* 3. Ear Training Panel */
var earP=document.createElement('div');earP.id='earPanel';
earP.innerHTML=mkClose('earPanel')+'<h3>👂 이어트레이닝 고급</h3><div class="earScore"><div class="earScoreItem" id="earCorrect">정답: 0</div><div class="earScoreItem" id="earStreak">연속: 0</div><div class="earScoreItem" id="earTotal">총: 0/0</div></div><div class="earQ" id="earQ">▶ 재생을 눌러 음정을 들어보세요</div><div class="earPlayBtn" id="earPlayBtn" role="button" tabindex="0">▶ 재생</div><div class="earChoices" id="earChoices"></div>';
document.body.appendChild(earP);

/* 4. Dashboard Panel */
var dashP=document.createElement('div');dashP.id='dashPanel';
dashP.innerHTML=mkClose('dashPanel')+'<h3>📊 연습 분석 대시보드</h3><div class="dashCards" id="dashCards"></div><canvas id="dashCanvas" width="380" height="280"></canvas>';
document.body.appendChild(dashP);

/* 5. Sheet Music Panel */
var sheetP=document.createElement('div');sheetP.id='sheetPanel';
sheetP.innerHTML=mkClose('sheetPanel')+'<h3>📜 악보 리더</h3><div class="sheetBtns" id="sheetBtns"></div><canvas id="sheetCanvas" width="380" height="200"></canvas><div class="posStat" id="sheetStatus">악보를 선택하세요</div>';
document.body.appendChild(sheetP);

/* 6. Care Guide Panel */
var careP=document.createElement('div');careP.id='carePanel';
careP.innerHTML=mkClose('carePanel')+'<h3>🔧 바이올린 관리 가이드</h3><div class="careProg"><span class="careProgText" id="careProg">0/12 읽음</span></div><div id="careCards"></div>';
document.body.appendChild(careP);

/* 7. Masterpiece Panel */
var masterP=document.createElement('div');masterP.id='masterPanel';
masterP.innerHTML=mkClose('masterPanel')+'<h3>🎻 명곡 해설</h3><div id="masterCards"></div>';
document.body.appendChild(masterP);

/* 8. Share Card v2 Panel */
var shareP=document.createElement('div');shareP.id='shareV2Panel';
shareP.innerHTML=mkClose('shareV2Panel')+'<h3>📸 공유 카드 v2</h3><canvas id="shareV2Canvas" width="600" height="400"></canvas><div class="shareV2Btns"><div class="shareV2Btn" id="shareV2Download" role="button" tabindex="0">📥 PNG 다운로드</div><div class="shareV2Btn" id="shareV2Copy" role="button" tabindex="0">📋 클립보드 복사</div></div>';
document.body.appendChild(shareP);

/* 9. Quiz v12 Panel */
var quizP12=document.createElement('div');quizP12.id='quizV12Panel';
quizP12.innerHTML=mkClose('quizV12Panel')+'<h3>❓ 퀴즈 v12</h3><div class="earQ" id="qv12Q"></div><div class="earChoices" id="qv12Choices"></div><div class="earScore"><div class="earScoreItem" id="qv12Score">0/15</div></div>';
document.body.appendChild(quizP12);

/* ═══════════════════════════════════════════════════
   FEATURE 1: POSITION TRAINER
   ═══════════════════════════════════════════════════ */
var posState={current:-1,completed:{}};
try{posState.completed=JSON.parse(localStorage.getItem('v12_pos_done')||'{}');}catch(e){}

function renderPosCards(){
  var c=document.getElementById('posCards');if(!c)return;c.innerHTML='';
  POSITIONS.forEach(function(p,i){
    var d=document.createElement('div');
    d.className='posCard'+(posState.completed[i]?' done':'')+(posState.current===i?' active':'');
    d.innerHTML='<span class="posName">'+p.name+'</span><span class="posRange">'+p.range+'</span><div class="posDesc">'+p.desc+'</div>';
    d.addEventListener('pointerdown',function(){posState.current=i;v12Sfx('pos_tap');renderPosCards();drawPosCanvas(i);});
    c.appendChild(d);
  });
  var done=Object.keys(posState.completed).length;
  var prog=document.getElementById('posProg');if(prog)prog.style.width=(done/5*100)+'%';
  var stat=document.getElementById('posStat');if(stat)stat.textContent=done+'/5 포지션 완료';
}

function drawPosCanvas(idx){
  var cv=document.getElementById('posCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,w,h);

  var p=POSITIONS[idx];var strings=['G','D','A','E'];
  var colors=['#44ee44','#cc55ff','#44ddee','#ffdd33'];
  var startX=60,endX=w-30,strGap=h/(strings.length+1);

  ctx.strokeStyle='rgba(200,190,160,.15)';ctx.lineWidth=1;
  for(var f=0;f<5;f++){
    var fx=startX+(endX-startX)*(f/4);
    ctx.beginPath();ctx.moveTo(fx,strGap-10);ctx.lineTo(fx,h-strGap+10);ctx.stroke();
    if(f<4){
      ctx.fillStyle='rgba(201,169,110,.3)';ctx.font='9px Georgia';ctx.textAlign='center';
      ctx.fillText((f+1)+'번',fx+(endX-startX)/8,h-10);
    }
  }

  strings.forEach(function(s,si){
    var y=strGap*(si+1);
    ctx.strokeStyle=colors[si];ctx.lineWidth=2;ctx.globalAlpha=0.4;
    ctx.beginPath();ctx.moveTo(startX-20,y);ctx.lineTo(endX,y);ctx.stroke();
    ctx.globalAlpha=1;

    ctx.fillStyle=colors[si];ctx.font='bold 11px Georgia';ctx.textAlign='right';
    ctx.fillText(s,startX-28,y+4);

    var notes=p.strings[s];
    notes.forEach(function(note,ni){
      var nx=startX+(endX-startX)*((ni+0.5)/4);
      ctx.fillStyle='rgba(255,215,0,.15)';
      ctx.beginPath();ctx.arc(nx,y,14,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ffd700';ctx.font='bold 10px Georgia';ctx.textAlign='center';
      ctx.fillText(note.replace(/[0-9]/g,''),nx,y+4);
      ctx.fillStyle='rgba(201,169,110,.3)';ctx.font='7px Georgia';
      ctx.fillText(note.slice(-1),nx+10,y-6);
    });
  });

  ctx.fillStyle='#ffd700';ctx.font='bold 13px Georgia';ctx.textAlign='center';
  ctx.fillText(p.name+' ('+p.range+')',w/2,20);

  posState.completed[idx]=true;
  localStorage.setItem('v12_pos_done',JSON.stringify(posState.completed));
  if(Object.keys(posState.completed).length===1)unlockAch('pos_beginner');
  if(Object.keys(posState.completed).length>=5){unlockAch('pos_master');v12Sfx('pos_done');}
  addHist('포지션','포지션 '+p.name+' 학습');
  renderPosCards();
}

/* ═══════════════════════════════════════════════════
   FEATURE 2: ORCHESTRA PART PRACTICE
   ═══════════════════════════════════════════════════ */
var orchTimers=[];

function renderOrchCards(){
  var c=document.getElementById('orchCards');if(!c)return;c.innerHTML='';
  var practiced=0;
  try{practiced=JSON.parse(localStorage.getItem('v12_orch_done')||'[]').length;}catch(e){}

  ORCH_PIECES.forEach(function(piece,i){
    var d=document.createElement('div');d.className='orchCard';
    d.innerHTML='<span class="orchTitle">'+piece.name+'</span><span class="orchArtist">'+piece.artist+'</span>'+
      '<div class="orchPartBtns">'+
      '<div class="orchPartBtn v1" data-idx="'+i+'" data-part="v1" role="button" tabindex="0">1st Violin ▶</div>'+
      '<div class="orchPartBtn v2" data-idx="'+i+'" data-part="v2" role="button" tabindex="0">2nd Violin ▶</div>'+
      '</div><div class="orchNoteDisplay" id="orchNote_'+i+'"></div>';
    c.appendChild(d);
  });

  c.querySelectorAll('.orchPartBtn').forEach(function(btn){
    btn.addEventListener('pointerdown',function(e){
      e.preventDefault();
      var idx=parseInt(btn.dataset.idx);
      var part=btn.dataset.part;
      orchTimers.forEach(function(t){clearInterval(t);});orchTimers=[];
      c.querySelectorAll('.orchPartBtn').forEach(function(b){b.classList.remove('playing');});
      btn.classList.add('playing');
      v12Sfx('orch_play');
      playOrchPart(idx,part);
    });
  });
}

function playOrchPart(idx,part){
  var piece=ORCH_PIECES[idx];var notes=piece[part];
  var display=document.getElementById('orchNote_'+idx);
  var noteIdx=0;var ac=getACtx();
  if(!ac||!display)return;

  var done=[];try{done=JSON.parse(localStorage.getItem('v12_orch_done')||'[]');}catch(e){}
  if(done.indexOf(idx)===-1){done.push(idx);localStorage.setItem('v12_orch_done',JSON.stringify(done));}
  if(done.length===1)unlockAch('orch_first');
  if(done.length>=6)unlockAch('orch_all');

  var noteFreqs={C3:130.81,D3:146.83,E3:164.81,F3:174.61,'F#3':185.00,G3:196.00,'G#3':207.65,A3:220.00,'Bb3':233.08,B3:246.94,
    C4:261.63,'C#4':277.18,D4:293.66,'D#4':311.13,'Eb4':311.13,E4:329.63,F4:349.23,'F#4':369.99,G4:392.00,'G#4':415.30,A4:440.00,'Bb4':466.16,B4:493.88,
    C5:523.25,'C#5':554.37,D5:587.33,'D#5':622.25,'Eb5':622.25,E5:659.25,F5:698.46,'F#5':739.99,G5:783.99,'G#5':830.61,A5:880.00,'Bb5':932.33,B5:987.77,
    C6:1046.50,'C#6':1108.73,D6:1174.66,'D#6':1244.51,E6:1318.51,'F#6':1396.91};

  orchTimers.forEach(function(t){clearInterval(t);});orchTimers=[];
  var timer=setInterval(function(){
    if(noteIdx>=notes.length){
      clearInterval(timer);display.textContent='✓ 완료!';
      v12Sfx('orch_part');
      addHist('합주',piece.name+' '+part+' 연습 완료');
      return;
    }
    var n=notes[noteIdx];var freq=noteFreqs[n]||440;
    var o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);
    o.type=part==='v1'?'sine':'triangle';o.frequency.setValueAtTime(freq,ac.currentTime);
    g.gain.setValueAtTime(0.12,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.35);
    o.start(ac.currentTime);o.stop(ac.currentTime+0.35);

    var displayNotes=notes.map(function(nn,ni){return ni===noteIdx?'['+nn+']':nn;}).join(' ');
    display.textContent=displayNotes.substring(Math.max(0,noteIdx*4-20),noteIdx*4+30);
    noteIdx++;
  },400);
  orchTimers.push(timer);
}

/* ═══════════════════════════════════════════════════
   FEATURE 3: EAR TRAINING ADVANCED
   ═══════════════════════════════════════════════════ */
var earState={correct:0,streak:0,total:0,currentInterval:null,baseFreq:0,answered:false};

function newEarQuestion(){
  earState.answered=false;
  var idx=Math.floor(Math.random()*EAR_INTERVALS.length);
  earState.currentInterval=idx;
  earState.baseFreq=220+Math.floor(Math.random()*220);

  var q=document.getElementById('earQ');
  if(q)q.textContent='두 음의 음정을 맞춰보세요';

  var choices=document.getElementById('earChoices');
  if(!choices)return;choices.innerHTML='';
  var opts=[idx];
  while(opts.length<4){var r=Math.floor(Math.random()*EAR_INTERVALS.length);if(opts.indexOf(r)===-1)opts.push(r);}
  opts.sort(function(){return Math.random()-0.5;});

  opts.forEach(function(oi){
    var d=document.createElement('div');d.className='earChoice';
    d.textContent=EAR_INTERVALS[oi].name;
    d.setAttribute('role','button');d.setAttribute('tabindex','0');
    d.addEventListener('pointerdown',function(e){
      e.preventDefault();
      if(earState.answered)return;earState.answered=true;earState.total++;
      if(oi===idx){
        d.classList.add('correct');earState.correct++;earState.streak++;
        v12Sfx('ear_correct');
        if(earState.streak>=10)unlockAch('ear_perfect');
      }else{
        d.classList.add('wrong');earState.streak=0;v12Sfx('ear_wrong');
        choices.querySelectorAll('.earChoice').forEach(function(ch){
          if(ch.textContent===EAR_INTERVALS[idx].name)ch.classList.add('correct');
        });
      }
      updateEarScore();
      setTimeout(newEarQuestion,1200);
    });
    choices.appendChild(d);
  });
}

function playEarInterval(){
  var ac=getACtx();if(!ac)return;
  var semi=EAR_INTERVALS[earState.currentInterval].semitones;
  var f1=earState.baseFreq;var f2=f1*Math.pow(2,semi/12);

  var o1=ac.createOscillator(),g1=ac.createGain();o1.connect(g1);g1.connect(ac.destination);
  o1.type='sine';o1.frequency.setValueAtTime(f1,ac.currentTime);
  g1.gain.setValueAtTime(0.15,ac.currentTime);g1.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.6);
  o1.start(ac.currentTime);o1.stop(ac.currentTime+0.6);

  var o2=ac.createOscillator(),g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);
  o2.type='sine';o2.frequency.setValueAtTime(f2,ac.currentTime+0.7);
  g2.gain.setValueAtTime(0.15,ac.currentTime+0.7);g2.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+1.3);
  o2.start(ac.currentTime+0.7);o2.stop(ac.currentTime+1.3);
}

function updateEarScore(){
  var ec=document.getElementById('earCorrect');if(ec)ec.textContent='정답: '+earState.correct;
  var es=document.getElementById('earStreak');if(es)es.textContent='연속: '+earState.streak;
  var et=document.getElementById('earTotal');if(et)et.textContent='총: '+earState.correct+'/'+earState.total;
}

/* ═══════════════════════════════════════════════════
   FEATURE 4: ANALYTICS DASHBOARD
   ═══════════════════════════════════════════════════ */
function drawDashboard(){
  v12Sfx('dash_open');unlockAch('dash_viewer');

  var stats=ls2();var prog=lp();var achs=la();
  var achCount=Object.keys(achs).length;
  var totalNotes=stats.totalNotes||0;
  var totalTime=stats.totalTime||0;
  var lessonsCompleted=0;
  for(var k in prog){if(prog[k]===true||prog[k]==='completed')lessonsCompleted++;}
  var songsDone=stats.songsPlayed||0;
  var streak=stats.streak||0;

  var cards=document.getElementById('dashCards');
  if(cards){
    cards.innerHTML='';
    var items=[
      {value:totalNotes,label:'총 연주 노트'},
      {value:Math.floor(totalTime/60)+'분',label:'총 연습 시간'},
      {value:achCount,label:'업적 달성'},
      {value:lessonsCompleted,label:'레슨 완료'},
      {value:songsDone,label:'곡 연주'},
      {value:streak+'일',label:'연속 연습'}
    ];
    items.forEach(function(it){
      var d=document.createElement('div');d.className='dashCard';
      d.innerHTML='<div class="dashValue">'+it.value+'</div><div class="dashLabel">'+it.label+'</div>';
      cards.appendChild(d);
    });
  }

  var cv=document.getElementById('dashCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='rgba(26,16,32,.95)';ctx.fillRect(0,0,w,h);

  var cx=w/2,cy=h/2+10,r=100;
  var axes=[
    {name:'연주력',val:Math.min(100,totalNotes/50)},
    {name:'꾸준함',val:Math.min(100,streak*10)},
    {name:'업적',val:Math.min(100,achCount*1.5)},
    {name:'레슨',val:Math.min(100,lessonsCompleted*2)},
    {name:'곡연주',val:Math.min(100,songsDone*5)},
    {name:'시간',val:Math.min(100,totalTime/180)}
  ];
  var n=axes.length;

  for(var ring=1;ring<=5;ring++){
    ctx.strokeStyle='rgba(200,190,160,'+(0.04+ring*0.02)+')';ctx.lineWidth=1;
    ctx.beginPath();
    for(var ai=0;ai<=n;ai++){
      var angle=-Math.PI/2+2*Math.PI*ai/n;
      var rr=r*(ring/5);
      if(ai===0)ctx.moveTo(cx+rr*Math.cos(angle),cy+rr*Math.sin(angle));
      else ctx.lineTo(cx+rr*Math.cos(angle),cy+rr*Math.sin(angle));
    }
    ctx.stroke();
  }

  for(var ai2=0;ai2<n;ai2++){
    var angle2=-Math.PI/2+2*Math.PI*ai2/n;
    ctx.strokeStyle='rgba(200,190,160,.08)';ctx.beginPath();
    ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(angle2),cy+r*Math.sin(angle2));ctx.stroke();
    ctx.fillStyle='rgba(201,169,110,.6)';ctx.font='10px Georgia';ctx.textAlign='center';
    ctx.fillText(axes[ai2].name,cx+(r+18)*Math.cos(angle2),cy+(r+18)*Math.sin(angle2)+4);
  }

  ctx.fillStyle='rgba(255,215,0,.12)';ctx.strokeStyle='rgba(255,215,0,.6)';ctx.lineWidth=2;
  ctx.beginPath();
  axes.forEach(function(a,i){
    var angle=-Math.PI/2+2*Math.PI*i/n;
    var rr=r*(a.val/100);
    if(i===0)ctx.moveTo(cx+rr*Math.cos(angle),cy+rr*Math.sin(angle));
    else ctx.lineTo(cx+rr*Math.cos(angle),cy+rr*Math.sin(angle));
  });
  ctx.closePath();ctx.fill();ctx.stroke();

  axes.forEach(function(a,i){
    var angle=-Math.PI/2+2*Math.PI*i/n;
    var rr=r*(a.val/100);
    ctx.fillStyle='#ffd700';ctx.beginPath();ctx.arc(cx+rr*Math.cos(angle),cy+rr*Math.sin(angle),4,0,Math.PI*2);ctx.fill();
  });

  var total=axes.reduce(function(s,a){return s+a.val;},0)/n;
  var grade=total>=90?'S':total>=75?'A':total>=60?'B':total>=40?'C':'D';
  ctx.fillStyle='#ffd700';ctx.font='bold 14px Georgia';ctx.textAlign='center';
  ctx.fillText('종합 등급: '+grade+' ('+Math.round(total)+'점)',w/2,h-10);

  addHist('분석','대시보드 확인 (등급: '+grade+')');
}

/* ═══════════════════════════════════════════════════
   FEATURE 5: SHEET MUSIC READER
   ═══════════════════════════════════════════════════ */
var sheetNotes=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5','C6'];
var sheetY={C4:10,D4:9,E4:8,F4:7,G4:6,A4:5,B4:4,C5:3,D5:2,E5:1,F5:0,G5:-1,A5:-2,B5:-3,C6:-4};

function renderSheetBtns(){
  var c=document.getElementById('sheetBtns');if(!c)return;c.innerHTML='';
  var scales=[
    {name:'C 장조',notes:['C4','D4','E4','F4','G4','A4','B4','C5']},
    {name:'G 장조',notes:['G4','A4','B4','C5','D5','E5','F#5','G5']},
    {name:'D 장조',notes:['D4','E4','F#4','G4','A4','B4','C#5','D5']},
    {name:'A 단조',notes:['A4','B4','C5','D5','E5','F5','G5','A5']},
    {name:'랜덤 8음',notes:null}
  ];
  scales.forEach(function(sc){
    var btn=document.createElement('div');btn.className='sheetBtn';btn.textContent=sc.name;
    btn.setAttribute('role','button');btn.setAttribute('tabindex','0');
    btn.addEventListener('pointerdown',function(e){
      e.preventDefault();c.querySelectorAll('.sheetBtn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      var notes=sc.notes;
      if(!notes){notes=[];for(var i=0;i<8;i++)notes.push(sheetNotes[Math.floor(Math.random()*sheetNotes.length)]);}
      drawSheet(notes);unlockAch('sheet_reader');addHist('악보',sc.name+' 악보 읽기');
    });
    c.appendChild(btn);
  });
}

function drawSheet(notes){
  var cv=document.getElementById('sheetCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='rgba(255,250,235,.03)';ctx.fillRect(0,0,w,h);

  var staffY=h/2;var lineGap=12;var startX=50;

  for(var i=-2;i<=2;i++){
    ctx.strokeStyle='rgba(200,190,160,.3)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(20,staffY+i*lineGap);ctx.lineTo(w-20,staffY+i*lineGap);ctx.stroke();
  }

  ctx.fillStyle='#ffd700';ctx.font='bold 28px Georgia';
  ctx.fillText('𝄞',22,staffY+lineGap+2);

  var noteGap=(w-100)/notes.length;
  notes.forEach(function(note,idx){
    var x=startX+20+idx*noteGap;
    var baseName=note.replace(/[0-9#b]/g,'');var oct=parseInt(note.replace(/[^0-9]/g,''));
    var yOff=sheetY[baseName+oct];
    if(yOff===undefined)yOff=sheetY[baseName.charAt(0)+oct]||0;
    var ny=staffY+yOff*lineGap/2;

    if(yOff>=6||yOff<=-4){
      ctx.strokeStyle='rgba(200,190,160,.2)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x-10,ny);ctx.lineTo(x+10,ny);ctx.stroke();
    }

    ctx.fillStyle='#ffd700';ctx.beginPath();
    ctx.ellipse(x,ny,7,5,-.2,0,Math.PI*2);ctx.fill();

    ctx.strokeStyle='#ffd700';ctx.lineWidth=1.5;
    if(yOff>=3){ctx.beginPath();ctx.moveTo(x+6,ny);ctx.lineTo(x+6,ny-35);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(x-6,ny);ctx.lineTo(x-6,ny+35);ctx.stroke();}

    ctx.fillStyle='rgba(201,169,110,.5)';ctx.font='8px Georgia';ctx.textAlign='center';
    ctx.fillText(note,x,ny+(yOff>=3?18:-12));
  });

  v12Sfx('sheet_note');

  var status=document.getElementById('sheetStatus');
  if(status)status.textContent=notes.join(' → ');
}

/* ═══════════════════════════════════════════════════
   FEATURE 6: CARE GUIDE
   ═══════════════════════════════════════════════════ */
function renderCareCards(){
  var readSet={};try{readSet=JSON.parse(localStorage.getItem('v12_care_read')||'{}');}catch(e){}
  var c=document.getElementById('careCards');if(!c)return;c.innerHTML='';

  CARE_GUIDE.forEach(function(item,i){
    var d=document.createElement('div');
    d.className='careCard'+(readSet[i]?' read':'');
    d.innerHTML='<span class="careIcon">'+item.icon+'</span><span class="careTitle">'+item.title+'</span><div class="careContent">'+item.content+'</div>';
    d.addEventListener('pointerdown',function(e){
      e.preventDefault();d.classList.toggle('expanded');
      if(!readSet[i]){readSet[i]=true;localStorage.setItem('v12_care_read',JSON.stringify(readSet));d.classList.add('read');v12Sfx('care_tip');}
      updateCareProg();
      if(Object.keys(readSet).length>=12)unlockAch('care_master');
    });
    c.appendChild(d);
  });
  updateCareProg();
}

function updateCareProg(){
  var readSet={};try{readSet=JSON.parse(localStorage.getItem('v12_care_read')||'{}');}catch(e){}
  var p=document.getElementById('careProg');
  if(p)p.textContent=Object.keys(readSet).length+'/12 읽음';
}

/* ═══════════════════════════════════════════════════
   FEATURE 7: MASTERPIECE COMMENTARY
   ═══════════════════════════════════════════════════ */
function renderMasterCards(){
  var readSet={};try{readSet=JSON.parse(localStorage.getItem('v12_master_read')||'{}');}catch(e){}
  var c=document.getElementById('masterCards');if(!c)return;c.innerHTML='';

  MASTERPIECES.forEach(function(item,i){
    var d=document.createElement('div');
    d.className='masterCard'+(readSet[i]?' read':'');
    d.innerHTML='<span class="masterTitle">'+item.icon+' '+item.title+'</span>'+
      '<div class="masterMeta">'+item.artist+' ('+item.year+') | '+item.key+'</div>'+
      '<div class="masterContent">'+item.content+'</div>';
    d.addEventListener('pointerdown',function(e){
      e.preventDefault();d.classList.toggle('expanded');
      if(!readSet[i]){readSet[i]=true;localStorage.setItem('v12_master_read',JSON.stringify(readSet));d.classList.add('read');v12Sfx('master_open');}
      if(Object.keys(readSet).length>=10)unlockAch('master_10');
      addHist('명곡',item.title+' 해설 읽기');
    });
    c.appendChild(d);
  });
}

/* ═══════════════════════════════════════════════════
   FEATURE 8: SHARE CARD v2
   ═══════════════════════════════════════════════════ */
function drawShareV2(){
  v12Sfx('share_snap');unlockAch('share_v2');

  var cv=document.getElementById('shareV2Canvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;

  var grd=ctx.createLinearGradient(0,0,w,h);
  grd.addColorStop(0,'#1a1020');grd.addColorStop(0.5,'#2a1530');grd.addColorStop(1,'#0a0a1a');
  ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);

  ctx.strokeStyle='rgba(212,137,74,.15)';ctx.lineWidth=2;
  ctx.strokeRect(8,8,w-16,h-16);
  ctx.strokeStyle='rgba(212,137,74,.08)';ctx.strokeRect(14,14,w-28,h-28);

  ctx.fillStyle='#ffd700';ctx.font='bold 22px Georgia';ctx.textAlign='center';
  ctx.fillText('🎻 Violin Real v12',w/2,45);

  ctx.fillStyle='rgba(212,137,74,.5)';ctx.font='11px Georgia';
  ctx.fillText('바이올린 실시간 연주 앱',w/2,68);

  var stats=ls2();var prog=lp();var achs=la();
  var totalNotes=stats.totalNotes||0;var achCount=Object.keys(achs).length;
  var lessonsCompleted=0;for(var k in prog){if(prog[k]===true||prog[k]==='completed')lessonsCompleted++;}
  var songsDone=stats.songsPlayed||0;var streak=stats.streak||0;
  var totalTime=Math.floor((stats.totalTime||0)/60);

  var items=[
    {icon:'🎵',label:'연주 노트',value:totalNotes},
    {icon:'📚',label:'레슨 완료',value:lessonsCompleted},
    {icon:'🎶',label:'곡 연주',value:songsDone},
    {icon:'🏆',label:'업적 달성',value:achCount+'/94'},
    {icon:'🔥',label:'연속 연습',value:streak+'일'},
    {icon:'⏱️',label:'총 시간',value:totalTime+'분'}
  ];

  var cols=3,rows=2,cw=160,ch=50,startX=(w-cols*cw)/2,startY=90;
  items.forEach(function(it,i){
    var col=i%cols,row=Math.floor(i/cols);
    var x=startX+col*cw+10,y=startY+row*(ch+8);
    ctx.fillStyle='rgba(255,250,235,.04)';
    ctx.beginPath();
    var rx=x,ry=y,rw=cw-20,rh=ch,rr=10;
    ctx.moveTo(rx+rr,ry);ctx.lineTo(rx+rw-rr,ry);ctx.quadraticCurveTo(rx+rw,ry,rx+rw,ry+rr);
    ctx.lineTo(rx+rw,ry+rh-rr);ctx.quadraticCurveTo(rx+rw,ry+rh,rx+rw-rr,ry+rh);
    ctx.lineTo(rx+rr,ry+rh);ctx.quadraticCurveTo(rx,ry+rh,rx,ry+rh-rr);
    ctx.lineTo(rx,ry+rr);ctx.quadraticCurveTo(rx,ry,rx+rr,ry);ctx.closePath();ctx.fill();

    ctx.fillStyle='#ffd700';ctx.font='bold 16px Georgia';ctx.textAlign='center';
    ctx.fillText(it.icon+' '+it.value,x+cw/2-10,y+22);
    ctx.fillStyle='rgba(201,169,110,.4)';ctx.font='9px Georgia';
    ctx.fillText(it.label,x+cw/2-10,y+38);
  });

  var barY=220;var barH=12;var maxW=w-80;
  ctx.fillStyle='rgba(201,169,110,.4)';ctx.font='10px Georgia';ctx.textAlign='left';
  ctx.fillText('포지션',30,barY+10);
  ctx.fillStyle='rgba(255,250,235,.08)';ctx.fillRect(90,barY,maxW,barH);
  var posCount=0;try{posCount=Object.keys(JSON.parse(localStorage.getItem('v12_pos_done')||'{}')).length;}catch(e){}
  ctx.fillStyle='linear-gradient(90deg,#44ee44,#ffd700)';
  var grd2=ctx.createLinearGradient(90,0,90+maxW*(posCount/5),0);
  grd2.addColorStop(0,'#44ee44');grd2.addColorStop(1,'#ffd700');
  ctx.fillStyle=grd2;
  ctx.fillRect(90,barY,maxW*(posCount/5),barH);

  ctx.fillStyle='rgba(201,169,110,.4)';ctx.font='10px Georgia';ctx.textAlign='left';
  ctx.fillText('합주곡',30,barY+32);
  ctx.fillStyle='rgba(255,250,235,.08)';ctx.fillRect(90,barY+22,maxW,barH);
  var orchCount=0;try{orchCount=JSON.parse(localStorage.getItem('v12_orch_done')||'[]').length;}catch(e){}
  var grd3=ctx.createLinearGradient(90,0,90+maxW*(orchCount/6),0);
  grd3.addColorStop(0,'#cc55ff');grd3.addColorStop(1,'#ff6644');
  ctx.fillStyle=grd3;
  ctx.fillRect(90,barY+22,maxW*(orchCount/6),barH);

  ctx.fillStyle='rgba(201,169,110,.2)';ctx.font='9px Georgia';ctx.textAlign='center';
  ctx.fillText('Generated by Violin Real v12 | '+new Date().toLocaleDateString('ko-KR'),w/2,h-20);

  for(var si=0;si<30;si++){
    ctx.fillStyle='rgba(255,215,0,'+(Math.random()*0.05+0.01)+')';
    ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,Math.random()*1.5+0.3,0,Math.PI*2);ctx.fill();
  }

  addHist('공유','공유 카드 v2 생성');
}

/* ═══════════════════════════════════════════════════
   QUIZ v12
   ═══════════════════════════════════════════════════ */
var qv12State={idx:0,score:0,shuffled:[]};

function startQuizV12(){
  qv12State.idx=0;qv12State.score=0;
  qv12State.shuffled=V12_QUIZ.slice().sort(function(){return Math.random()-0.5;});
  showQv12Question();
}

function showQv12Question(){
  if(qv12State.idx>=qv12State.shuffled.length){
    var q=document.getElementById('qv12Q');
    if(q)q.textContent='결과: '+qv12State.score+'/'+qv12State.shuffled.length+(qv12State.score>=13?' 🎉 우수!':qv12State.score>=10?' 👍 양호':' 💪 분발');
    document.getElementById('qv12Choices').innerHTML='';
    document.getElementById('qv12Score').textContent=qv12State.score+'/'+qv12State.shuffled.length;
    addHist('퀴즈','v12 퀴즈 '+qv12State.score+'/'+qv12State.shuffled.length);
    return;
  }
  var item=qv12State.shuffled[qv12State.idx];
  var q=document.getElementById('qv12Q');if(q)q.textContent='Q'+(qv12State.idx+1)+'. '+item.q;
  var c=document.getElementById('qv12Choices');if(!c)return;c.innerHTML='';
  var answered=false;

  item.a.forEach(function(ans,ai){
    var d=document.createElement('div');d.className='earChoice';d.textContent=ans;
    d.setAttribute('role','button');d.setAttribute('tabindex','0');
    d.addEventListener('pointerdown',function(e){
      e.preventDefault();if(answered)return;answered=true;
      if(ai===item.c){d.classList.add('correct');qv12State.score++;v12Sfx('ear_correct');}
      else{d.classList.add('wrong');v12Sfx('ear_wrong');
        c.querySelectorAll('.earChoice').forEach(function(ch,ci){if(ci===item.c)ch.classList.add('correct');});}
      document.getElementById('qv12Score').textContent=qv12State.score+'/'+(qv12State.idx+1);
      qv12State.idx++;
      setTimeout(showQv12Question,1000);
    });
    c.appendChild(d);
  });
}

/* ═══════════════════════════════════════════════════
   SONG/LESSON INJECTION
   ═══════════════════════════════════════════════════ */
(function injectSongsLessons(){
  if(typeof window.songs==='object'&&Array.isArray(window.songs)){
    V12_SONGS.forEach(function(s){
      var exists=window.songs.some(function(es){return es.name===s.name;});
      if(!exists)window.songs.push(s);
    });
  }else if(typeof window.SONGS==='object'&&Array.isArray(window.SONGS)){
    V12_SONGS.forEach(function(s){
      var exists=window.SONGS.some(function(es){return es.name===s.name;});
      if(!exists)window.SONGS.push(s);
    });
  }

  if(typeof window.lessons==='object'&&Array.isArray(window.lessons)){
    V12_LESSONS.forEach(function(l){
      var exists=window.lessons.some(function(el){return el.name===l.name;});
      if(!exists)window.lessons.push(l);
    });
  }else if(typeof window.LESSONS==='object'&&Array.isArray(window.LESSONS)){
    V12_LESSONS.forEach(function(l){
      var exists=window.LESSONS.some(function(el){return el.name===l.name;});
      if(!exists)window.LESSONS.push(l);
    });
  }
})();

/* ═══════════════════════════════════════════════════
   V12 EXPLORER ACHIEVEMENT CHECK
   ═══════════════════════════════════════════════════ */
function checkV12Explorer(){
  var checks=[
    localStorage.getItem('v12_pos_done'),
    localStorage.getItem('v12_orch_done'),
    localStorage.getItem('v12_care_read'),
    localStorage.getItem('v12_master_read')
  ];
  var allUsed=checks.every(function(c){
    if(!c)return false;
    try{var p=JSON.parse(c);return Object.keys(p).length>0||p.length>0;}catch(e){return false;}
  });
  if(allUsed&&earState.total>0)unlockAch('v12_explorer');
}
setInterval(checkV12Explorer,15000);

/* ═══════════════════════════════════════════════════
   UI INIT: FAB + KEYBOARD + TITLE
   ═══════════════════════════════════════════════════ */
(function initV12UI(){
  renderPosCards();
  renderOrchCards();
  renderSheetBtns();
  renderCareCards();
  renderMasterCards();

  document.getElementById('earPlayBtn').addEventListener('pointerdown',function(e){
    e.preventDefault();
    if(!earState.currentInterval&&earState.currentInterval!==0)newEarQuestion();
    playEarInterval();
    if(earState.total===0)unlockAch('ear_start');
  });
  newEarQuestion();

  document.getElementById('shareV2Download').addEventListener('pointerdown',function(e){
    e.preventDefault();drawShareV2();
    var cv=document.getElementById('shareV2Canvas');
    var link=document.createElement('a');link.download='violin_v12_card.png';link.href=cv.toDataURL();link.click();
  });
  document.getElementById('shareV2Copy').addEventListener('pointerdown',function(e){
    e.preventDefault();drawShareV2();
    var cv=document.getElementById('shareV2Canvas');
    cv.toBlob(function(blob){
      if(navigator.clipboard&&window.ClipboardItem){
        navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).catch(function(){});
      }
    });
  });

  var hdBtns=document.querySelector('#hd');
  if(hdBtns){
    var btns=[
      {text:'📸',title:'공유카드v2',action:function(){drawShareV2();document.getElementById('shareV2Panel').classList.add('show');}},
      {text:'❓',title:'퀴즈v12',action:function(){startQuizV12();document.getElementById('quizV12Panel').classList.add('show');}}
    ];
    btns.forEach(function(b){
      var el=document.createElement('div');el.className='v6Btn';el.title=b.title;el.textContent=b.text;
      el.setAttribute('role','button');el.setAttribute('tabindex','0');
      hdBtns.insertBefore(el,hdBtns.firstChild);
      el.addEventListener('pointerdown',function(e){e.preventDefault();b.action();});
    });
  }

  var fab=document.createElement('div');fab.className='v12Fab';
  var fabBtns=[
    {text:'🎯',title:'포지션',action:function(){renderPosCards();document.getElementById('posPanel').classList.add('show');}},
    {text:'🎼',title:'오케스트라',action:function(){renderOrchCards();document.getElementById('orchPanel').classList.add('show');}},
    {text:'👂',title:'이어트레이닝',action:function(){newEarQuestion();document.getElementById('earPanel').classList.add('show');}},
    {text:'📊',title:'대시보드',action:function(){drawDashboard();document.getElementById('dashPanel').classList.add('show');}},
    {text:'📜',title:'악보리더',action:function(){document.getElementById('sheetPanel').classList.add('show');}},
    {text:'🔧',title:'악기관리',action:function(){renderCareCards();document.getElementById('carePanel').classList.add('show');}},
    {text:'🎻',title:'명곡해설',action:function(){renderMasterCards();document.getElementById('masterPanel').classList.add('show');}},
    {text:'📸',title:'공유v2',action:function(){drawShareV2();document.getElementById('shareV2Panel').classList.add('show');}}
  ];
  fabBtns.forEach(function(b){
    var el=document.createElement('div');el.className='v12FabBtn';el.title=b.title;el.textContent=b.text;
    el.addEventListener('pointerdown',function(e){e.preventDefault();b.action();});
    fab.appendChild(el);
  });
  document.body.appendChild(fab);

  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    if(!e.shiftKey)return;
    switch(e.key){
      case'P':case'p':renderPosCards();document.getElementById('posPanel').classList.add('show');break;
      case'O':case'o':renderOrchCards();document.getElementById('orchPanel').classList.add('show');break;
      case'E':case'e':newEarQuestion();document.getElementById('earPanel').classList.add('show');break;
      case'D':case'd':drawDashboard();document.getElementById('dashPanel').classList.add('show');break;
      case'M':case'm':document.getElementById('sheetPanel').classList.add('show');break;
      case'C':case'c':renderCareCards();document.getElementById('carePanel').classList.add('show');break;
      case'N':case'n':renderMasterCards();document.getElementById('masterPanel').classList.add('show');break;
      case'I':case'i':drawShareV2();document.getElementById('shareV2Panel').classList.add('show');break;
    }
    if(e.key==='Escape'){
      document.querySelectorAll('#posPanel,#orchPanel,#earPanel,#dashPanel,#sheetPanel,#carePanel,#masterPanel,#shareV2Panel,#quizV12Panel').forEach(function(p){p.classList.remove('show');});
    }
  });

  var titleEl=document.querySelector('#hd h1');
  if(titleEl)titleEl.innerHTML='🎻 Violin Real <span style="font-size:8px;color:#ff6644;vertical-align:super">v12</span>';
  var logoEl=document.getElementById('logo');
  if(logoEl)logoEl.textContent='Violin Real v12';
})();

window.VIOLIN_VERSION='12.0';
})();
