// Geomo studio core: design-system helpers + legacy post sets (P01–P05, BF v1, stories).
// New posts live in ../posts/<CODE>.js and register SETS.<CODE> and CHOREO.<CODE>.
// Design system "Geomo", version 1791883043-e8a7 (October 2026 refresh): graph paper, Archivo + Newsreader,
// title block with series name, one pencil underline per post, pencil ring on the key number.
var G=window.Geomo,h=React.createElement,F=React.Fragment,clone=React.cloneElement;
var E=G.examples;
var grailM=G.BIKES.grailM, crux=G.BIKES.crux56;
var grailL={name:'Canyon Grail Gen 2',size:'L',stack:613,reach:427,hta:71.5,sta:73.5,chainstay:425,bbDrop:75,wheelbase:1080,trail:69,headTube:187,stem:70};
// add a series name to every slide of a post
var withSeries=function(series,arr){return arr.map(function(el){return clone(el,{series:series});});};

// ---- shared text styles (social register: Archivo for labels/numbers, Newsreader for voice, sentence case) ----
var DISP=function(w,size,stretch){return {fontFamily:'var(--font-display)',fontWeight:w,fontSize:size,fontStretch:(stretch||80)+'%',letterSpacing:'-0.01em',lineHeight:1.05};};
var SERIF=function(size){return {fontFamily:'var(--font-serif)',fontSize:size,lineHeight:1.3,color:'var(--s-fg2)'};};
var lab=function(t,extra){return h('div',{style:Object.assign({fontFamily:'var(--font-display)',fontWeight:600,fontSize:30,color:'var(--s-muted)',lineHeight:1.25},extra||{})},t);};
var kick=function(t,extra){return h('div',{style:Object.assign({fontFamily:'var(--font-display)',fontWeight:600,fontSize:30,color:'var(--s-accent)',lineHeight:1.25},extra||{})},t);};
// pencil ring around a child (key number)
var ring=function(child,w,hh,l,t,rot){return h('span',{style:{position:'relative',display:'inline-block'}},child,h(G.Pencil,{kind:'circle',w:w,h:hh,rotate:rot==null?-4:rot,style:{left:l,top:t}}));};
var CTA_ACT=['Save it for the day you buy','Send it to a friend who’s choosing','Check yours: link in bio'];

// ================= Post #1 (DS worked example; slide 5 says "hundreds of bikes") =================
var post1=E.post1.slice();
post1[4]=h(G.ContentSlide,{key:'5',page:5,total:6,series:'Your height isn’t your bike size',kicker:'Geomo',title:'We check every size of hundreds of bikes against your body.',
  art:h(G.StatGrid,{items:[{value:'Hundreds',label:'road, gravel & MTB bikes'},{value:'~1 min',label:'height, inseam, 4 tests'},{value:'Free',label:'no account'},{value:'As sold',label:'with the factory stem'}]}),
  note:'A pro bike fit comes after you buy. Geomo comes before.',artFirst:true});

// Slide 3: the chart's empty rows get a dashed blank with a pencil "?" (the size chart never asks)
var qbox=function(){return h('span',{className:'gx-q',style:{display:'inline-flex',alignItems:'center',justifyContent:'center',width:220,height:64,border:'3px dashed var(--s-ref)',borderRadius:2}},
  h('span',{style:{fontFamily:'var(--font-display)',fontStyle:'italic',fontWeight:700,fontSize:44,color:'var(--s-measure)',lineHeight:1}},'?'));};
post1[2]=h(G.ContentSlide,{key:'3',page:3,total:6,series:'Your height isn’t your bike size',kicker:'The size chart',title:'A size chart knows one number.',
  art:h('div',{className:'gs-chart-demo'},
    h('div',{className:'gs-chart-row'},h(G.Label,null,'Height'),h('span',null,'170–180 cm'),h('span',{className:'gs-chart-arrow'},'→'),h('b',null,'M')),
    ['Inseam','Torso','Flexibility'].map(function(l){return h('div',{key:l,className:'gs-chart-row is-off'},h(G.Label,null,l),h('span',null,qbox()));})),
  body:'It can’t see your legs, your torso or how far you can lean forward. Both riders get the same M.',artFirst:true});

// ================= Post #3 (DS worked example; Grail trail is calculated) =================
var post3=E.post3.slice();
post3[1]=clone(E.post3[1],{takeaway:'Δ = Grail minus Crux. Grail M vs Crux 56, as sold. Grail trail calculated from its geometry.'});

// ================= Reel #2 · 178 cm. Canyon Grail. M or L? =================
var overlay=function(callout){return h(F,null,
  h(G.BikeDrawing,{bikes:[grailM,grailL],width:860,showSaddle:false,callouts:callout?[{at:'H',from:0,to:1,text:callout,dx:-60,dy:100,size:40}]:[]}),
  h(G.OverlayLegend,{bikes:[grailM,grailL]}));};
var lines=['Canyon Grail Gen 2, M → L:','+22 mm higher','+16 mm longer','+23 mm wheelbase'];
var tests=h('div',{style:{display:'flex',gap:36,justifyContent:'flex-start',flexWrap:'wrap'}},
  ['measure-inseam','test-forward-bend','test-plank','test-twist','test-head-up'].map(function(n){return h(G.Icon,{key:n,name:n,size:130});}));
var reel=[
  h(G.ReelHook,{key:'r1',kicker:'Which size?',hook:'178 cm.\nCanyon Grail.\n*M or L?*',art:h(G.BikeDrawing,{bikes:[grailM],width:860})}),
  h(G.ReelCaptions,{key:'r2',lines:lines,current:1,word:'+22 mm',art:overlay('+22 mm')}),
  h(G.ReelCaptions,{key:'r3',lines:lines,current:2,word:'+16 mm',art:overlay('+22 / +16 mm')}),
  h(G.ReelCaptions,{key:'r4',lines:lines,current:3,word:'+23 mm',art:overlay('+22 / +16 mm')}),
  h(G.ReelHook,{key:'r5',tone:'paper',kicker:'So which one?',hook:'Not your height.\nYour inseam\n+ flexibility.',art:tests}),
  h(G.ReelEndCard,{key:'r6'})
];
var safe=[reel[0],reel[1],reel[4],reel[5]].map(function(el,i){return clone(el,{key:'s'+i,showSafe:true});});

// ---------- bikes (bikes-backup-2026-10-10T08-40-37, size M) ----------
var B={
  urs:{name:'BMC URS',size:'M',stack:580,reach:410,hta:69.5,sta:74.5,chainstay:430,bbDrop:76,wheelbase:1070,trail:86,headTube:140,stem:70},
  rcrg:{name:'Van Rysel RCR-G',size:'M',stack:554,reach:391,hta:72,sta:73.5,chainstay:426,bbDrop:74,wheelbase:1019,headTube:130,stem:90},
  terra:{name:'Orbea Terra Race',size:'M',stack:560,reach:389,hta:71,sta:73.5,chainstay:420,bbDrop:78,wheelbase:1026,trail:59.2,headTube:139,stem:100},
  silex:{name:'Merida Silex',size:'M',stack:607,reach:412,hta:69.5,sta:74.5,chainstay:430,bbDrop:75,wheelbase:1082,headTube:170,stem:80},
  backff:{name:'Rose Backroad FF',size:'M',stack:558,reach:396,hta:72,sta:74.7,chainstay:420,bbDrop:75,wheelbase:1016,headTube:134,stem:100},
  grizl:{name:'Canyon Grizl',size:'M',stack:596,reach:404,hta:71,sta:73.5,chainstay:440,bbDrop:75,wheelbase:1076,headTube:158,stem:60},
  revolt:{name:'Giant Revolt Advanced',size:'M',stack:586,reach:387,hta:71.5,sta:73.5,chainstay:435,bbDrop:81,wheelbase:1036,trail:72,headTube:150,stem:70},
  seigla:{name:'Lauf Seigla',size:'M',stack:564,reach:394,hta:70.5,sta:72.5,chainstay:425,bbDrop:65,wheelbase:1040,headTube:129,stem:80}
};
var pair=function(a,b,opts){return h(F,null,h(G.BikeDrawing,Object.assign({bikes:[a,b],width:900,showSaddle:false},opts||{})),h(G.OverlayLegend,{bikes:[a,b]}));};
var shot=function(src,w){return h('img',{src:'img/'+src,alt:'',style:{display:'block',width:w||'100%',border:'2px solid var(--s-line)',background:'#fff'}});};

// ---------- fit % per size: app screenshot 10-porownanie-tabela.png (178 cm / 84 cm, balanced, 11.10.2026) ----------
var fitCol=function(v){return v>=85?'var(--ig-good)':v>=75?'var(--ig-mid)':'var(--ig-bad)';};
var sizeBars=function(ringM){return h('div',{style:{display:'grid',gap:22,width:'100%'}},
  lab('Canyon Grail Gen 2 · 178 cm rider',{color:'var(--s-fg)',fontWeight:700,fontSize:34}),
  [['2XS',21],['XS',53],['S',86],['M',95],['L',54]].map(function(r){var pct=h('b',{style:Object.assign(DISP(800,46,75),{color:fitCol(r[1])})},r[1]+'%');
    return h('div',{key:r[0],style:{display:'grid',gridTemplateColumns:'90px 1fr 130px',alignItems:'center',gap:20}},
    h('span',{style:Object.assign(DISP(r[0]==='M'?800:600,38,80),{color:'var(--s-fg)'})},r[0]),
    h('div',{style:{height:40,background:'var(--s-line)'}},h('div',{style:{width:r[1]+'%',height:'100%',background:fitCol(r[1])}})),
    h('div',{style:{textAlign:'right'}},(ringM&&r[0]==='M')?ring(pct,150,84,-20,-18):pct));}),
  h('div',{style:{display:'flex',gap:28,flexWrap:'wrap',marginTop:6}},
    [['var(--ig-good)','Good fit 85+'],['var(--ig-mid)','Borderline 75–84'],['var(--ig-bad)','Poor fit below 75']].map(function(l){return h('span',{key:l[1],style:{display:'flex',alignItems:'center',gap:10,fontFamily:'var(--font-display)',fontWeight:600,fontSize:28,color:'var(--s-muted)'}},h('i',{style:{width:22,height:22,background:l[0],display:'inline-block'}}),l[1]);})));};

// ================= C · What Geomo does for you =================
var chip=function(t,on){return h('span',{key:t,style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:32,padding:'10px 16px',border:'2px solid var(--s-fg)',borderRadius:2,background:on?'var(--s-fg)':'transparent',color:on?'var(--s-bg)':'var(--s-fg)',lineHeight:1}},t);};
var chipS=function(t){return h('span',{key:t,style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:28,padding:'8px 12px',border:'2px solid var(--s-fg)',borderRadius:2,color:'var(--s-fg)',lineHeight:1}},t);};
var stepRow=function(art,t,d){return h('div',{style:{display:'grid',gridTemplateColumns:'360px 1fr',gap:30,alignItems:'center'}},
  h('div',{style:{display:'flex',gap:8,alignItems:'center',flexWrap:'nowrap'}},art),
  h('div',{style:{display:'grid',gap:6}},h('b',{style:Object.assign(DISP(800,50,80),{color:'var(--s-fg)'})},t),h('span',{style:SERIF(32)},d)));};
var down=h('div',{style:{fontFamily:'var(--font-display)',fontSize:40,color:'var(--s-accent)',paddingLeft:160,lineHeight:'36px'}},'↓');
var flow=h('div',{style:{display:'grid',gap:10,width:'100%'}},
  stepRow([h('div',{key:1,style:{paddingLeft:100}},h(G.Rider,{height:178,inseam:84,scale:0.85,showMeasures:true}))],'Your body','Height, inseam, flexibility, position'),
  down,
  stepRow([chipS('Road'),chipS('Gravel'),chipS('MTB')],'Hundreds of bikes','Every size, as it’s sold'),
  down,
  stepRow([h('b',{key:1,style:Object.assign(DISP(800,104,72),{color:'var(--ig-good)',paddingLeft:60})},'95%')],'Your fit score','For every bike and size')
);
var testCell=function(icon,name,txt){return h('div',{key:name,style:{display:'grid',gridTemplateColumns:'110px 1fr',gap:20,alignItems:'center'}},h(G.Icon,{name:icon,size:104}),
  h('div',{style:{display:'grid',gap:4}},h('b',{style:Object.assign(DISP(800,38,80),{color:'var(--s-fg)'})},name),h('span',{style:SERIF(28)},txt)));};
var sec=function(first,label,body){return h('div',{style:{borderTop:first?'none':'2px solid var(--s-line)',paddingTop:first?0:26}},kick(label,{marginBottom:16}),body);};
var inputs=h('div',{style:{display:'grid',gap:30,width:'100%'}},
  sec(true,'1 · Height and inseam',shot('01-suwaki.png')),
  sec(false,'2 · Four flexibility checks',h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'22px 30px'}},
    testCell('test-forward-bend','Back of thigh','Bend forward: where do your hands reach?'),
    testCell('test-plank','Core','How long can you hold a plank?'),
    testCell('test-twist','Upper back','How far can you twist your torso?'),
    testCell('test-head-up','Neck','How long can you keep your head up?'))),
  sec(false,'3 · Your position',h('div',{style:{display:'flex',gap:14,alignItems:'center'}},chip('Comfort'),chip('Balanced',true),chip('Sport'))));
var postC=withSeries('How Geomo works',[
  h(G.CoverSlide,{key:1,total:7,kicker:'How Geomo works',title:'What Geomo\ndoes *for you.*',sub:'Swipe to see how it works →',art:flow}),
  h(G.ContentSlide,{key:2,page:2,total:7,kicker:'Step 1 · About a minute',title:'Tell it about your body.',art:inputs,artFirst:true}),
  h(G.ContentSlide,{key:3,page:3,total:7,kicker:'Step 2 · Your result',title:'Every bike gets a fit score.',titleBelow:true,art:h('div',{style:{display:'flex',justifyContent:'center',width:'100%'}},shot('09-karta-strona.png',700)),note:'Fit % = will you sit comfortably.\nTarget = fit + the handling you want.'}),
  h(G.ContentSlide,{key:4,page:4,total:7,kicker:'Every size, as sold',title:'Same bike. 95% or 54%.',art:sizeBars(true),note:'One size up and the fit drops from 95% to 54%. A size chart can’t tell you that.',artFirst:true}),
  h(G.ContentSlide,{key:5,page:5,total:7,kicker:'Step 3 · Your matches',title:'Hundreds of bikes, ranked for you.',titleBelow:true,art:shot('05-propozycje.png'),note:'Road, gravel or MTB. Fit % and Target for the best size of each bike.'}),
  h(G.ContentSlide,{key:6,page:6,total:7,kicker:'Step 4 · Compare',title:'Crux 56: 86%. Grail M: 95%.',art:shot('08-porownanie-rysunek-kierownica.png'),note:'Up to 4 bikes side by side, scored for the same rider.',artFirst:true}),
  h(G.CTASlide,{key:7,page:7,total:7,title:'Check your fit score before you buy.',sub:'Free · no account · about a minute',actions:CTA_ACT})
]);


// Motion version of C: slide 6 drawn natively (a screenshot can't draw itself). Handlebar numbers and fit % from the app (178 cm / 84 cm, balanced, 11.10).
var postCm=postC.slice();
postCm[5]=h(G.ContentSlide,{key:6,page:6,total:7,series:'How Geomo works',kicker:'Step 4 · Compare',title:'Crux 56: 86%. Grail M: 95%.',artFirst:true,
  art:h('div',{style:{display:'grid',gap:18,width:'100%',justifyItems:'center'}},
    h(G.BikeDrawing,{bikes:['grailM','crux56'],width:600,showCockpit:true,showSaddle:false,callouts:[{at:'bar',from:0,to:1,text:'+16 mm',dx:20,dy:90}]}),
    h('div',{style:{width:'100%'}},h(G.CompareTable,{a:grailM,b:crux,circle:[2],rows:[{label:'Fit',a:95,b:86,unit:'%'},{label:'Bar stack',a:635,b:627},{label:'Bar reach',a:470,b:486}]}))),
  note:'Same rider, as sold. Δ = Grail minus Crux.'});


// Motion version: slide 3 = real landing card recording, slide 5 = real app screen recording (slots filled by video in ffmpeg)
var vslot=function(w,hh,border){return h('div',{id:'vslot',style:{width:w,height:hh,boxSizing:'content-box',border:'2px solid '+(border||'var(--s-line)'),background:'#f6f5f1'}});};
postCm[2]=h(G.ContentSlide,{key:3,page:3,total:7,series:'How Geomo works',kicker:'Step 2 · Your result',title:'Every bike gets a fit score.',titleBelow:true,
  art:h('div',{style:{display:'flex',justifyContent:'center',width:'100%'}},vslot(700,Math.round(700*840/820))),note:'Fit % = will you sit comfortably.\nTarget = fit + the handling you want.'});
postCm[4]=h(G.Slide,{key:5,page:5,total:7,series:'How Geomo works',swipe:true},
  h('div',{style:{display:'grid',gridTemplateColumns:'520px 1fr',gap:40,alignItems:'center',flex:1,minHeight:0}},
    vslot(520,Math.round(520*1296/780),'var(--s-fg)'),
    h('div',{style:{display:'grid',gap:26,alignContent:'center'}},h(G.Kicker,null,'Step 3 · Your matches'),h(G.Headline,{size:62},'Hundreds of bikes, ranked for you.'),
      h('p',{className:'gs-caption'},'Road, gravel or MTB. Tap + to add a bike to your list, then compare.'))));

// ================= 101 · Part 1 · Stack & reach =================
var posPair=h('div',{style:{display:'flex',gap:48}},
  [['pos-comfort','Higher stack, shorter reach','More upright'],['pos-sport','Lower stack, longer reach','More stretched']].map(function(p){
    return h('div',{key:p[0],style:{display:'grid',gap:14,flex:1}},h(G.Icon,{name:p[0],size:200}),
      h('b',{style:Object.assign(DISP(800,46,80),{color:'var(--s-fg)'})},p[2]),
      h('span',{style:SERIF(32)},p[1]));}));
var g1=withSeries('Geometry 101',[
  h(G.CoverSlide,{key:1,total:7,kicker:'Geometry 101 · Part 1',title:'“I ride a medium.”\n*Which medium?*',sub:'Stack and reach, explained. Swipe →',art:h(G.BikeDrawing,{bikes:['grailM'],width:820,dims:['stack','reach']})}),
  h(G.ExplainerSlide,{key:2,page:2,total:7,kicker:'The two frame numbers',title:'Stack = how high.\nReach = how long.',
    drawing:h(G.BikeDrawing,{bikes:['grailM'],width:860,dims:['stack','reach']}),
    notes:[{term:'Stack',text:'bottom bracket to the top of the head tube, measured straight up.'},{term:'Reach',text:'the same two points, measured straight across.'}]}),
  h(G.ContentSlide,{key:3,page:3,total:7,kicker:'What they change',title:'They decide how you sit.',titleBelow:true,art:posPair,note:'Too low or too long, and you feel it in your back, neck and hands.'}),
  h(G.ContentSlide,{key:4,page:4,total:7,kicker:'Gravel, size M',title:'Same letter. 55 mm apart.',art:h(G.StripPlot,{values:E.STACK_M_ALL,median:580}),note:'Every dot is a size-M gravel frame in Geomo: 48 bikes, stack 552 to 607 mm.',artFirst:true}),
  h(G.ContentSlide,{key:5,page:5,total:7,kicker:'Beyond the frame',title:'Geomo checks where your hands end up.',titleBelow:true,art:shot('08-porownanie-rysunek-kierownica.png'),note:'Handlebar view: frame + spacers + stock stem. Crux 56 vs Grail M, same rider.'}),
  h(G.ContentSlide,{key:6,page:6,total:7,kicker:'How the fit works',title:'Your body sets the target.',art:h('div',{style:{display:'grid',gap:14}},shot('06-karta-top.png'),shot('06-karta-dol.png')),note:'+8 / +2 mm = how far the bars land from your target. Close to zero = high fit score.',artFirst:true}),
  h(G.CTASlide,{key:7,page:7,total:7,title:'Geomo does this math for your body.',sub:'Free · no account · about a minute',actions:CTA_ACT})
]);

// ================= 101 · Part 2 · Frame vs handlebar =================
var g2=withSeries('Geometry 101',[
  h(G.CoverSlide,{key:1,total:7,kicker:'Geometry 101 · Part 2',title:'Frame numbers vs\n*handlebar numbers.*',sub:'Why a size chart can fool you. Swipe →',art:h(G.BikeDrawing,{bikes:['grailM'],width:820,showCockpit:true})}),
  h(G.ExplainerSlide,{key:2,page:2,total:7,kicker:'From frame to hands',title:'You don’t hold the frame.\nYou hold the bars.',
    drawing:h(G.BikeDrawing,{bikes:['grailM'],width:820,showCockpit:true,dims:['stack','reach']}),
    notes:[{term:'Frame stack & reach',text:'end at the head tube. That’s the chart.'},{term:'Spacers',text:'lift the stem.'},{term:'Stem',text:'pushes the bars forward. That’s where your hands are.'}]}),
  h(G.CompareSlide,{key:3,page:3,total:7,a:grailM,b:crux,kicker:'On the chart',title:'The Grail frame looks longer.',circle:[1],note:'+14 mm on the chart',
    rows:[{label:'Frame stack',a:591,b:578},{label:'Frame reach',a:411,b:397}],takeaway:'Grail M vs Crux 56. Δ = Grail minus Crux.'}),
  h(G.ContentSlide,{key:4,page:4,total:7,kicker:'At the handlebar',title:'The Crux puts your hands further forward.',
    art:h(G.Dumbbell,{rows:[{label:'Frame reach',a:411,b:397},{label:'Bar reach',a:470,b:486}],names:['Grail M','Crux 56'],windowMm:40}),
    note:'Δ = Grail minus Crux. From Geomo, as sold: factory stems (70 vs 100 mm), typical spacers, 178 cm rider.',artFirst:true}),
  h(G.ExplainerSlide,{key:5,page:5,total:7,kicker:'Why',title:'A 30 mm longer stem flips the result.',
    drawing:h(F,null,h(G.BikeDrawing,{bikes:['grailM','crux56'],width:700,showCockpit:true,showWheels:false,showSaddle:false,callouts:[{at:'bar',from:0,to:1,text:'+16 mm',dx:20,dy:90}]}),h(G.OverlayLegend,{bikes:['grailM','crux56']})),
    notes:[{term:'Grail M:',text:'14 mm longer frame, 70 mm stem → hands at 470 mm.'},{term:'Crux 56:',text:'shorter frame, 100 mm stem → hands at 486 mm.'}]}),
  h(G.ContentSlide,{key:6,page:6,total:7,kicker:'What Geomo shows',title:'Frame and handlebar, for every size.',titleBelow:true,art:h('div',{style:{display:'flex',justifyContent:'center'}},shot('06-karta-roweru.png',540)),note:'Every bike as sold, plus a better stem if one fits you.'}),
  h(G.CTASlide,{key:7,page:7,total:7,title:'Check where your hands end up, before you buy.',sub:'Free · no account · about a minute',actions:CTA_ACT})
]);

// ================= 101 · Part 3 · Handling =================
// Ground-aligned overlay (both bikes on the same floor, same wheel size). Formulas as in design system geo.jsx.
var rad=function(d){return d*Math.PI/180;};
function fGeo(g){var bbd=g.bbDrop,cs=g.chainstay,hta=rad(g.hta),sta=rad(g.sta),R=350;
  var rear={x:-Math.sqrt(cs*cs-bbd*bbd),y:bbd},front={x:rear.x+g.wheelbase,y:bbd},H={x:g.reach,y:g.stack};
  var ht=g.headTube||Math.max(100,(g.stack-bbd)/Math.sin(hta)-395);
  var Hb={x:H.x+ht*Math.cos(hta),y:H.y-ht*Math.sin(hta)},Hd={x:H.x+(ht-25)*Math.cos(hta),y:H.y-(ht-25)*Math.sin(hta)};
  var stL=(g.stack-40)/Math.sin(sta),S={x:-stL*Math.cos(sta),y:stL*Math.sin(sta)};
  var sh=R-bbd,T=function(p){return {x:p.x,y:p.y+sh};};
  return {rear:T(rear),front:T(front),H:T(H),Hb:T(Hb),Hd:T(Hd),S:T(S),BB:{x:0,y:sh},R:R};}
function GroundPair(props){var a=props.a,b=props.b,W=props.width||900,cols=['var(--series-1)','var(--series-2)'];
  var gs=[fGeo(a),fGeo(b)],R=gs[0].R;
  var build=function(minX,maxX,minY,maxY,W,detail){var vbW=maxX-minX,vbH=maxY-minY,k=W/vbW,px=function(v){return v/k;};
    var P=function(p){return p.x.toFixed(1)+','+(-p.y).toFixed(1);};var els=[];
    var txt=function(key,x,y,size,t,extra){return h('text',Object.assign({key:key,x:x,y:y,fontSize:px(size),fill:'var(--s-muted)',fontFamily:'var(--font-display)',fontWeight:600},extra||{}),t);};
    els.push(h('line',{key:'g',x1:minX,x2:maxX,y1:0,y2:0,stroke:'var(--s-fg)',strokeWidth:3,vectorEffect:'non-scaling-stroke'}));
    gs.forEach(function(g,i){var c=cols[i];
      els.push(h('circle',{key:'wr'+i,cx:g.rear.x,cy:-g.rear.y,r:R,fill:'none',stroke:'var(--s-ref)',strokeWidth:3,vectorEffect:'non-scaling-stroke',opacity:.7}));
      els.push(h('circle',{key:'wf'+i,cx:g.front.x,cy:-g.front.y,r:R,fill:'none',stroke:'var(--s-ref)',strokeWidth:3,vectorEffect:'non-scaling-stroke',opacity:.7}));
      els.push(h('path',{key:'f'+i,d:'M'+P(g.rear)+' L'+P(g.BB)+' L'+P(g.Hd)+' M'+P(g.Hb)+' L'+P(g.H)+' L'+P(g.S)+' L'+P(g.rear)+' M'+P(g.BB)+' L'+P(g.S)+' M'+P(g.Hb)+' L'+P(g.front),fill:'none',stroke:c,strokeWidth:detail?9:7,strokeLinecap:'round',strokeLinejoin:'round',vectorEffect:'non-scaling-stroke'}));});
    els.push(h('line',{key:'ax',x1:minX,x2:maxX,y1:-R,y2:-R,stroke:'var(--s-ref)',strokeWidth:2,strokeDasharray:'8 8',vectorEffect:'non-scaling-stroke'}));
    if(detail) els.push(txt('axl',minX+px(10),-R-px(12),26,'Wheel axles'));
    gs.forEach(function(g,i){els.push(h('circle',{key:'bb'+i,cx:0,cy:-g.BB.y,r:px(detail?10:8),fill:cols[i]}));});
    if(detail){var xr=maxX-px(230),y0=gs[0].BB.y,y1=gs[1].BB.y;
      gs.forEach(function(g,i){els.push(h('line',{key:'bl'+i,x1:0,x2:xr+px(14),y1:-g.BB.y,y2:-g.BB.y,stroke:cols[i],strokeWidth:2,strokeDasharray:'6 6',vectorEffect:'non-scaling-stroke'}));});
      els.push(h('line',{key:'m',x1:xr,x2:xr,y1:-y0,y2:-y1,stroke:'var(--s-measure)',strokeWidth:4,vectorEffect:'non-scaling-stroke'}));
      els.push(txt('mt',xr+px(24),-(y0+y1)/2+px(14),42,Math.round(Math.abs(y1-y0))+' mm',{fill:'var(--s-measure)',fontWeight:700,fontStyle:'italic'}));
      els.push(txt('bbl',90,-Math.max(y0,y1)-px(14),26,'BB height'));}
    return h('svg',{width:W,height:Math.round(vbH*k),viewBox:minX+' '+(-maxY)+' '+vbW+' '+vbH,style:{display:'block',overflow:'hidden'}},els);};
  var minX=Math.min(gs[0].rear.x,gs[1].rear.x)-R-30,maxX=Math.max(gs[0].front.x,gs[1].front.x)+R+30;
  var maxY=Math.max(gs[0].H.y,gs[1].H.y,gs[0].S.y,gs[1].S.y)+40;
  var main=h('div',{style:{display:'flex',justifyContent:'center'}},build(minX,maxX,-20,maxY,Math.round(W*0.74),false));
  var lowBB=Math.min(gs[0].BB.y,gs[1].BB.y);
  var det=build(-330,470,lowBB-32,R+30,W,true);
  return h('div',{style:{display:'grid',gap:10,width:'100%'}},main,
    kick('Zoom on the bottom bracket'),
    h('div',{style:{border:'2px solid var(--s-line)',background:'var(--s-surface)'}},det),
    h(G.OverlayLegend,{bikes:[a,b]}));}

var g3=withSeries('Geometry 101',[
  h(G.CoverSlide,{key:1,total:8,kicker:'Geometry 101 · Part 3',title:'Fit is how you sit.\n*Handling* is how it rides.',sub:'5 numbers, explained. Swipe →',art:h(G.BikeDrawing,{bikes:['grailM'],width:820})}),
  h(G.ContentSlide,{key:2,page:2,total:8,kicker:'1 · Head angle (HTA)',title:'Slacker = calmer.\nSteeper = quicker.',art:pair(B.urs,B.rcrg),note:'Gravel, size M, in Geomo: 69.5° (BMC URS) to 72° (Van Rysel RCR-G).',artFirst:true}),
  h(G.ContentSlide,{key:3,page:3,total:8,kicker:'2 · Trail',title:'More trail = it holds a line.\nLess = it turns in fast.',titleBelow:true,art:pair(B.urs,B.terra),note:'Published, gravel size M: 59 mm (Orbea Terra Race) to 86 mm (BMC URS). When a maker doesn’t publish it, Geomo calculates it.'}),
  h(G.ContentSlide,{key:4,page:4,total:8,kicker:'3 · Wheelbase',title:'Longer = steadier.\nShorter = nimbler.',art:pair(B.silex,B.backff),note:'Gravel, size M: 1011 to 1082 mm. That’s 7 cm.',artFirst:true}),
  h(G.ContentSlide,{key:5,page:5,total:8,kicker:'4 · Chainstay',title:'Short = lively.\nLong = planted, room for big tyres.',titleBelow:true,art:pair(B.grizl,B.terra),note:'Gravel, size M: 420 to 450 mm.'}),
  h(G.ContentSlide,{key:6,page:6,total:8,kicker:'5 · BB drop',title:'More drop = you sit lower between the wheels.',art:h(GroundPair,{a:B.revolt,b:B.seigla,width:936}),note:'BB drop: Revolt 81 mm, Seigla 65 mm. Gravel size M: 65–83 mm.',artFirst:true}),
  h(G.ContentSlide,{key:7,page:7,total:8,kicker:'In Geomo',title:'Fit % first. Then the Target score.',titleBelow:true,
    art:h(G.StatGrid,{items:[{value:'95%',label:'Fit · will you sit comfortably?'},{value:'95',label:'Target · does it ride the way you want?'}]}),
    note:'Target adds handling: trail, head angle, wheelbase, chainstay, BB drop. Example: Canyon Grail Gen 2 M for a rider of 178 cm, inseam 84 cm, typical flexibility, balanced position.'}),
  h(G.CTASlide,{key:8,page:8,total:8,title:'Find a bike that fits and rides your way.',sub:'Free · no account · about a minute',actions:CTA_ACT})
]);

// ================= BLACK FRIDAY CAMPAIGN =================
// Data: size step median (bikes-backup 2026-10-10): gravel stack +20 mm, reach +9 mm. App limits (js/algorithms.js, i18n/en.js): spacers up to 3.5 cm (4.5 comfort), stem 60–140 mm.
var rowList=function(items,mark){return h('div',{style:{display:'grid',gap:22,width:'100%'}},items.map(function(it){return h('div',{key:it[0],style:{display:'grid',gridTemplateColumns:'56px 1fr',gap:18,alignItems:'baseline',borderTop:'2px solid var(--s-line)',paddingTop:18}},
  h('span',{style:Object.assign(DISP(800,44,80),{color:'var(--s-accent)'})},it[2]||mark),
  h('div',{style:{display:'grid',gap:4}},h('b',{style:Object.assign(DISP(800,42,80),{color:'var(--s-fg)'})},it[0]),it[1]?h('span',{style:SERIF(32)},it[1]):null));}));};
var col=function(head,items){return h('div',{style:{display:'grid',gap:14,alignContent:'start'}},
  kick(head,{borderBottom:'3px solid var(--s-fg)',paddingBottom:12}),
  items.map(function(t){return h('div',{key:t,style:Object.assign(DISP(700,40,80),{color:'var(--s-fg)',borderBottom:'2px solid var(--s-line)',paddingBottom:12})},t);}));};
var twoCol=h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,width:'100%'}},
  col('Swap it later',['Tyres','Saddle','Stem','Handlebar','Gearing','Wheels']),
  col('Fixed for good',['Stack','Reach','Head angle','Wheelbase','Standover']));

var bf1=withSeries('Black Friday',[
  h(G.CoverSlide,{key:1,total:6,kicker:'Before Black Friday',title:'Parts you can swap.\n*The frame stays.*',sub:'What to check before a bike deal. Swipe →',art:h(G.BikeDrawing,{bikes:['grailM'],width:820,showCockpit:true})}),
  h(G.ContentSlide,{key:2,page:2,total:6,kicker:'Change it later vs live with it',title:'Upgrades are easy. Geometry isn’t.',art:twoCol,note:'Everything on the right is built into the frame.',artFirst:true}),
  h(G.ContentSlide,{key:3,page:3,total:6,kicker:'How much can the cockpit fix?',title:'Spacers and a stem only go so far.',titleBelow:true,
    art:h(G.StatGrid,{items:[{value:'3.5 cm',label:'max spacers (4.5 cm for comfort)'},{value:'60–140',label:'sensible stem length, mm'}]}),
    note:'The limits Geomo uses. If a frame needs more than this, it’s the wrong size.'}),
  h(G.BigNumberSlide,{key:4,page:4,total:6,kicker:'One size up',sign:'+',value:'20',unit:'mm',label:'taller stack, typical gravel size step',title:'Spacers can lift your bars. Nothing can lower them below the frame.',size:240,
    caption:'Median step between gravel sizes in Geomo: +20 mm stack, +9 mm reach.'}),
  h(G.ContentSlide,{key:5,page:5,total:6,kicker:'The expensive part',title:'The part you can’t swap is the one you pay most for.',titleBelow:true,art:h(G.BikeDrawing,{bikes:['grailM'],width:820,showWheels:false,showSaddle:false}),note:'Especially on a carbon bike. Check the size before the discount.'}),
  h(G.CTASlide,{key:6,page:6,total:6,title:'Check your size before you check the price.',sub:'Free · no account · about a minute',actions:CTA_ACT})
]);

var bf2=withSeries('Black Friday',[
  h(G.CoverSlide,{key:1,total:6,kicker:'Between sizes?',title:'Too big or too small:\n*which is worse?*',sub:'Usually: too big. Here’s why. Swipe →',art:h(G.BikeDrawing,{bikes:[grailM,grailL],width:780,showSaddle:false})}),
  h(G.ContentSlide,{key:2,page:2,total:6,kicker:'A bit too small',title:'Usually fixable.',art:rowList([['More spacers','Raise the bars, up to about 3.5 cm.','↑'],['A longer stem','Move the bars forward, up to about 140 mm.','→'],['Setback seatpost','More room between saddle and bars.','←']]),artFirst:true}),
  h(G.ContentSlide,{key:3,page:3,total:6,kicker:'A bit too big',title:'Usually harder.',titleBelow:true,art:rowList([['Bars can’t go lower than the frame','Take out every spacer and that’s the floor.','↓'],['Stems stop at about 60 mm','Shorter makes steering twitchy.','←'],['Less standover clearance','Nothing changes how tall the top tube is.','!']]),
    note:'When this happens, Geomo says it straight: “even the shortest sensible stem will not fix it.”'}),
  h(G.ContentSlide,{key:4,page:4,total:6,kicker:'Real example · 178 cm rider',title:'One size up: 95% → 54%.',art:sizeBars(true),note:'Canyon Grail Gen 2. Size M fits; size L is too big for this rider.',artFirst:true}),
  h(G.ContentSlide,{key:5,page:5,total:6,kicker:'Canyon Grail Gen 2 · M vs L',title:'+22 mm higher. +16 mm longer.',titleBelow:true,art:pair(grailM,grailL,{showSaddle:false,callouts:[{at:'H',from:0,to:1,text:'+22 / +16 mm',dx:-60,dy:100,size:40}]}),note:'Between two sizes? Check both against your body, not the chart.'}),
  h(G.CTASlide,{key:6,page:6,total:6,title:'Between sizes? Check both in 60 seconds.',sub:'Free · no account',actions:CTA_ACT})
]);

var bf3=withSeries('Black Friday',[
  h(G.CoverSlide,{key:1,total:7,kicker:'Black Friday checklist',title:'60 seconds\nbefore you *pay.*',sub:'5 checks before you buy a bike on sale. Swipe →',art:h(G.BikeDrawing,{bikes:['grailM'],width:820,dims:['stack','reach']})}),
  h(G.ContentSlide,{key:2,page:2,total:7,kicker:'Check 1',title:'Know your inseam.',art:h('div',{style:{display:'grid',gridTemplateColumns:'260px 1fr',gap:30,alignItems:'center',width:'100%'}},h('div',{style:{display:'flex',justifyContent:'center'}},h(G.Rider,{height:178,inseam:84,scale:1.4,showMeasures:true})),
      rowList([['Barefoot, back to a wall','','1'],['Book between your legs, spine up','','2'],['Measure floor to spine','','3']])),note:'Trouser inseam is usually 3–5 cm shorter. Use the book method.',artFirst:true}),
  h(G.BigNumberSlide,{key:3,page:3,total:7,kicker:'Check 2 · Ignore the letter',value:'55',unit:'mm',label:'stack spread, size M, 48 gravel bikes',title:'An M is not an M.',size:220,artBelow:true,art:h(G.StripPlot,{values:E.STACK_M_ALL,median:580}),caption:'Size M stack in Geomo: 552 to 607 mm. Compare numbers, not letters.'}),
  h(G.ContentSlide,{key:4,page:4,total:7,kicker:'Check 3',title:'Check where your hands end up.',titleBelow:true,art:shot('06-karta-dol.png'),note:'Frame + spacers + stock stem. That’s what you ride, not the frame chart.'}),
  h(G.ContentSlide,{key:5,page:5,total:7,kicker:'Check 4',title:'Between sizes? Check both.',art:sizeBars(true),note:'Same bike, same rider: 95% in M, 54% in L.',artFirst:true}),
  h(G.ContentSlide,{key:6,page:6,total:7,kicker:'Check 5',title:'Wrong size? Skip the deal.',titleBelow:true,art:twoCol,note:'A stem is cheap. A frame isn’t.'}),
  h(G.CTASlide,{key:7,page:7,total:7,title:'Run the deal through Geomo before you pay.',sub:'Free · no account · about a minute',actions:CTA_ACT})
]);

// ================= Reel #12 · A discount on the wrong size isn't a deal =================
var bigTxt=function(t,strike){return h('div',{style:Object.assign(DISP(800,320,72),{color:'var(--s-fg)',lineHeight:1,textDecoration:strike?'line-through':'none',textDecorationColor:'var(--measure-on-dark)',textDecorationThickness:'22px'})},t);};
var hookTxt=function(t){return h(G.Hook,{size:96},t);};
var r12=[
  h(G.Slide,{key:1,format:'reel',tone:'navy',footer:false},h('div',{className:'gs-stack'},h(G.Kicker,null,'Black Friday'),bigTxt('−30%'),h('div',{style:{marginTop:30}},hookTxt('Great deal?')))),
  h(G.Slide,{key:2,format:'reel',tone:'navy',footer:false},h('div',{className:'gs-stack'},h(G.Kicker,null,'Black Friday'),bigTxt('−30%',true),h('div',{style:{marginTop:30}},hookTxt('Not if it’s\nthe wrong size.')))),
  h(G.ReelHook,{key:3,tone:'paper',kicker:'Why',hook:'A stem is cheap.\n*A frame isn’t.*',art:h(G.BikeDrawing,{bikes:['grailM'],width:860,showCockpit:true})}),
  h(G.ReelHook,{key:4,tone:'paper',kicker:'Before you pay',hook:'Check your size\nin 60 seconds.',art:h('div',{style:{display:'grid',justifyItems:'center',gap:10}},
    ring(h('b',{style:Object.assign(DISP(800,240,72),{color:'var(--ig-good)',lineHeight:1,display:'block'})},'95%'),520,250,-50,-10),
    h('span',{style:{fontFamily:'var(--font-display)',fontWeight:600,fontSize:36,color:'var(--s-muted)'}},'Your fit score'))}),
  h(G.ReelEndCard,{key:5,line:'A discount on the wrong size isn’t a deal.',cta:'Check yours — link in bio'})
];

// ================= Stories =================
var stories=[
  h(G.StoryPoll,{key:1,question:'Buying a bike on Black Friday?',a:'Yes',b:'Just looking',art:h(G.BikeDrawing,{bikes:['grailM'],width:860})}),
  h(G.StoryLink,{key:2,title:'Black Friday deal?\n*Check the size first.*',sub:'60 seconds · free · no account'}),
  h(G.StoryQuiz,{key:3,question:'Canyon Grail Gen 2, M → L. How much higher is the frame?',options:['+5 mm','+22 mm','+50 mm'],art:pair(grailM,grailL,{showSaddle:false})}),
  h(G.StoryQuestion,{key:4,prompt:'Stuck between two sizes on a deal? Ask us.'}),
  h(G.StoryLink,{key:5,title:'Bought a bike?\n*Check it in 60 s.*',sub:'Free · no account · see how it fits you'})
];


// ================= Story · How to measure your inseam (app wizard steps, i18n wizard.inseam.step1–4) =================
var inseamArt=function(){
  var W=936,H=520,F=490,X0=300,S=2.35,leg=84*S;            // floor y, wall x, px per cm, inseam 84 cm (example rider 178/84)
  var rs=S, rw=120*rs*0.55, rH=178*rs;                      // DS Rider geometry (icons.jsx)
  var rx=X0+22-rw/2+rw*0.12, ry=F-(rH+20);                   // back close to the wall
  var crotchX=X0+22+rw*0.12, yL=F-leg;
  return h('svg',{id:'inseam-art',width:W,height:H,viewBox:'0 0 '+W+' '+H,style:{display:'block',overflow:'visible'}},
    h('rect',{id:'wall-fill',x:60,y:40,width:X0-60,height:F-40,fill:'var(--s-line)',opacity:.55}),
    h('line',{id:'wall',x1:X0,y1:F,x2:X0,y2:40,stroke:'var(--s-fg)',strokeWidth:5,strokeLinecap:'round'}),
    h('line',{id:'floor',x1:40,y1:F,x2:W-40,y2:F,stroke:'var(--s-fg)',strokeWidth:5,strokeLinecap:'round'}),
    h('text',{id:'wall-lab',x:80,y:84,fontFamily:'var(--font-display)',fontWeight:600,fontSize:30,fill:'var(--s-muted)'},'Wall'),
    h('svg',{id:'rider',x:rx,y:ry,overflow:'visible'},h(G.Rider,{height:178,inseam:84,scale:rs,showMeasures:false})),
    // book: hardback, spine up, pressed up to the crotch
    h('g',{id:'book'},
      h('rect',{x:crotchX-6,y:yL,width:46,height:150,fill:'var(--s-surface)',stroke:'var(--s-accent)',strokeWidth:5}),
      h('line',{x1:crotchX-8,y1:yL,x2:crotchX+42,y2:yL,stroke:'var(--s-accent)',strokeWidth:10,strokeLinecap:'round'}),
      h('text',{x:crotchX+60,y:yL+92,fontFamily:'var(--font-display)',fontWeight:600,fontSize:30,fill:'var(--s-accent)'},'Book, spine up')),
    h('g',{id:'push'},h(G.Pencil?'path':'path',{d:'M'+(crotchX+17)+','+(yL+240)+' L'+(crotchX+17)+','+(yL+170)+' M'+(crotchX+3)+','+(yL+186)+' L'+(crotchX+17)+','+(yL+168)+' L'+(crotchX+31)+','+(yL+186),fill:'none',stroke:'var(--s-measure)',strokeWidth:5,strokeLinecap:'round',strokeLinejoin:'round'})),
    // pencil mark on the wall + level line from the spine
    h('line',{id:'level',x1:crotchX-8,y1:yL,x2:X0+2,y2:yL,stroke:'var(--s-ref)',strokeWidth:3,strokeDasharray:'8 7'}),
    h('path',{id:'mark',d:'M'+(X0-46)+','+(yL+3)+' C'+(X0-30)+','+(yL-3)+' '+(X0-14)+','+(yL+4)+' '+(X0+4)+','+(yL-1),fill:'none',stroke:'var(--s-measure)',strokeWidth:6,strokeLinecap:'round'}),
    // tape from the floor to the mark
    h('g',{id:'tape'},
      h('line',{id:'tape-line',x1:X0-110,y1:F,x2:X0-110,y2:yL,stroke:'var(--s-measure)',strokeWidth:5}),
      h('line',{x1:X0-126,y1:F,x2:X0-94,y2:F,stroke:'var(--s-measure)',strokeWidth:5})),
    h('line',{id:'tape-top',x1:X0-126,y1:yL,x2:X0-94,y2:yL,stroke:'var(--s-measure)',strokeWidth:5}),
    h('text',{id:'tape-lab',x:X0-136,y:yL+(F-yL)/2+16,textAnchor:'end',fontFamily:'var(--font-display)',fontStyle:'italic',fontWeight:800,fontSize:48,fill:'var(--s-measure)'},'84 cm'),
    h('text',{id:'tape-eg',x:X0-136,y:yL+(F-yL)/2+56,textAnchor:'end',fontFamily:'var(--font-serif)',fontSize:28,fill:'var(--s-fg2)'},'example')
  );};
var inseamSteps=[['1 / 4','Barefoot, back against a wall, feet 15–20\u00a0cm apart.'],['2 / 4','Book between your legs, spine up. Pull it up firmly, like a saddle.'],['3 / 4','Keep the spine level. Mark its height on the wall.'],['4 / 4','Measure floor to mark. Repeat 2–3 times, take the average.']];
var storyInseam=[h(G.Slide,{key:'si',format:'story',tone:'paper',footer:false},
  h('div',{className:'gs-stack'},h(G.Kicker,null,'How to measure your inseam'),h(G.Hook,{size:88},'Your inseam, in *one minute.*')),
  h('div',{className:'gs-art gs-art-mid',style:{marginTop:0}},inseamArt()),
  h('div',{id:'si-steps',style:{display:'grid',minHeight:140,alignContent:'start'}},
    inseamSteps.map(function(st,i){return h('div',{key:i,className:'si-step',style:{gridArea:'1 / 1',display:'grid',gap:8}},
      h('span',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:30,color:'var(--s-accent)'}},st[0]),
      h('p',{style:{margin:0,fontFamily:'var(--font-display)',fontWeight:800,fontStretch:'80%',fontSize:56,lineHeight:1.08,letterSpacing:'-0.01em',color:'var(--s-fg)'}},st[1]));})),
  h('p',{id:'si-note',className:'gs-caption',style:{marginTop:6}},'Not your trouser leg: a body inseam is usually a few cm longer.'),
  h('div',{id:'si-cta',style:{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginTop:10}},
    h('span',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:36,color:'var(--s-fg)'}},'Enter it in Geomo'),
    h('span',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:44,color:'var(--s-accent)'}},'↓')),
  h('div',{id:'si-sticker',style:{alignSelf:'center',width:520,height:130,marginTop:14,visibility:'hidden'}})
)];


// ================= P04 v2 · reel · Same height, three answers (Canyon Grail Gen 3) =================
// Scores: Geomo algorithm (supabase/functions/_shared/algorithms.ts) on bikes-backup 2026-10-13, Canyon Grail CF/CF SLX/CFR (Gen 3, 2027–), factory stems.
// Riders: 178 cm; A inseam 84, flexibility 3/3/3/3 (typical), balanced · B inseam 88, flexibility 4, sport · C inseam 80, flexibility 2, comfort.
var fitC=function(v){return v>=85?'var(--ig-good)':v>=75?'var(--ig-mid)':'var(--ig-bad)';};
var sizeRow=function(sz,v,win){var pct=h('b',{className:'p4-pct',style:Object.assign(DISP(800,64,75),{color:fitC(v)})},v+'%');
  return h('div',{key:sz,className:'p4-row',style:{display:'grid',gridTemplateColumns:'110px 1fr 170px',alignItems:'center',gap:24}},
    h('span',{style:Object.assign(DISP(win?800:600,60,80),{color:'var(--s-fg)'})},sz),
    h('div',{style:{height:72,background:'var(--s-line)'}},h('div',{className:'p4-bar',style:{width:Math.max(v,1)+'%',height:'100%',background:fitC(v)}})),
    h('div',{style:{textAlign:'right'}},win?ring(pct,230,112,-50,-22):pct));};
var riderCard=function(id,inseam,traits,rows,why){return h(G.Slide,{key:id,format:'reel',tone:'paper',footer:false},
  h('div',{className:'gs-stack',style:{gap:14}},h(G.Kicker,null,'Rider '+id+' · 178 cm'),
    h('div',{className:'p4-traits',style:{display:'grid',gap:6}},traits.map(function(t){return h('span',{key:t,style:Object.assign(DISP(700,52,80),{color:'var(--s-fg)',lineHeight:1.1})},t);}))),
  h('div',{className:'gs-art gs-art-mid',style:{display:'grid',gridTemplateColumns:'300px 1fr',gap:40,alignItems:'center',width:'100%',marginTop:80}},
    h('div',{style:{display:'flex',justifyContent:'center'}},h(G.Rider,{height:178,inseam:inseam,scale:3.3,showMeasures:true})),
    h('div',{className:'p4-rows',style:{display:'grid',gap:64}},rows.map(function(r){return sizeRow(r[0],r[1],r[2]);}))),
  h('p',{className:'gs-caption',style:{fontSize:46,lineHeight:1.3,marginTop:70}},why),
  h('div',{style:{flex:1}}));};
var p4=[
  h(G.Slide,{key:1,format:'reel',tone:'paper',footer:false},
    h('div',{className:'gs-stack'},h(G.Kicker,null,'Which size?'),h(G.Hook,{size:118},'178 cm.\nCanyon Grail.\n*S, M or L?*')),
    h('div',{className:'p4-photo',style:{marginTop:40,display:'grid',gap:10}},h('img',{src:'grail3-ride.jpg',style:{width:936,height:860,objectFit:'cover',display:'block'}}),
      h('span',{style:{fontFamily:'var(--font-display)',fontSize:24,color:'var(--s-muted)'}},'Canyon Grail Gen 3 · Photo: Canyon Bicycles GmbH (press kit)'))),
  h(G.Slide,{key:2,format:'reel',tone:'paper',footer:false},
    h('div',{className:'gs-stack'},h(G.Kicker,null,'Same height'),h(G.Hook,{size:110},'Three riders.\nAll *178 cm.*')),
    h('div',{className:'gs-riders',style:{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginTop:90,width:'100%',paddingRight:40}},
      [['A',84],['B',88],['C',80]].map(function(r){return h('div',{key:r[0],style:{display:'grid',justifyItems:'center',gap:8}},h(G.Rider,{height:178,inseam:r[1],scale:2.6,showMeasures:true}),
        h('b',{style:Object.assign(DISP(800,56,80),{color:'var(--s-fg)'})},r[0]),h('span',{style:{fontFamily:'var(--font-display)',fontWeight:600,fontSize:30,color:'var(--s-muted)'}},'inseam '+r[1]+' cm'));})),
    h('p',{className:'gs-caption',style:{fontSize:46,marginTop:60}},'Different legs, backs and riding styles. Which Grail fits each?')),
  riderCard('A',84,['Inseam 84 cm','Typical flexibility','Balanced position'],[['S',93],['M',96,true],['L',61]],'Size M lands the bars right where this body needs them.'),
  riderCard('B',88,['Inseam 88 cm','Very flexible','Sporty, low position'],[['S',79,true],['M',62],['L',0]],'Long legs, a flexible back and a sporty position want the bars lower and further. The smaller frame gets closest.'),
  riderCard('C',80,['Inseam 80 cm','Stiff back','Comfort position'],[['S',65],['M',93,true],['L',92]],'A stiffer back needs the bars higher. The taller L fits almost as well as M.'),
  h(G.Slide,{key:6,format:'reel',tone:'paper',footer:false},
    h('div',{className:'gs-stack'},h(G.Kicker,null,'Same height, three answers'),h(G.Hook,{size:108},'Your height\nisn’t your\n*bike size.*')),
    h('div',{className:'p4-why',style:{display:'grid',gap:44,marginTop:90}},
      [['Inseam','sets your saddle height'],['Flexibility','sets how low your bars can go'],['Position','comfort, balanced or sport']].map(function(r){return h('div',{key:r[0],style:{display:'grid',gap:4,borderTop:'3px solid var(--s-line)',paddingTop:18}},
        h('b',{style:Object.assign(DISP(800,58,80),{color:'var(--s-fg)'})},r[0]),h('span',{style:SERIF(40)},r[1]));}))),
  h(G.ReelEndCard,{key:7,line:'Check which size fits your body. About a minute.',cta:'Free · link in bio'})
];


// ================= P05 v2 · Geometry 101 cz. 2 · frame vs handlebar (wzorzec P07 v2) =================
// Spacers 25 mm = DEFAULT_SPACERS in the app; stem angle −6° and clamp half-height 20 mm = constants K in algorithms.ts.
// Bar positions 635/470 (Grail M, 70 mm) and 627/486 (Crux 56, 100 mm): from the app, profile 178/84, 11.10.
function Cockpit(props){var g=props.g,W=props.width||936,col=props.color||'var(--series-1)',sp=props.spacers==null?25:props.spacers,c0=20,stem=props.stem,step=props.step||3;
  var r=function(d){return d*Math.PI/180;},hta=r(g.hta),dx=-Math.cos(hta),dy=Math.sin(hta);
  var H={x:g.reach,y:g.stack},Hb={x:H.x-dx*(g.headTube||150),y:H.y-dy*(g.headTube||150)};
  var top={x:H.x+dx*sp,y:H.y+dy*sp},clamp={x:H.x+dx*(sp+c0),y:H.y+dy*(sp+c0)};
  var a=r((90-g.hta)-6),bar={x:clamp.x+stem*Math.cos(a),y:clamp.y+stem*Math.sin(a)};
  var x0=H.x-(props.short?200:210),x1=H.x+(props.short?150:190),y0=H.y-(props.short?120:130),y1=H.y+(props.short?120:110),k=W/(x1-x0),Hh=Math.round((y1-y0)*k),fs=Math.max(.62,W/936);
  var X=function(x){return (x-x0)*k;},Y=function(y){return (y1-y)*k;};
  var L=function(key,a,b,st){return h('line',Object.assign({key:key,x1:X(a.x),y1:Y(a.y),x2:X(b.x),y2:Y(b.y),strokeLinecap:'round'},st));};
  var T=function(key,x,y,t,st){st=Object.assign({},st);st.fontSize=Math.round((st.fontSize||30)*fs);return h('text',Object.assign({key:key,x:x,y:y,fontFamily:'var(--font-display)',fontWeight:700,fill:'var(--s-fg)'},st),t);};
  var els=[];
  els.push(h('g',{key:'frame',className:'ck-frame'},L('ht',Hb,H,{stroke:col,strokeWidth:14}),L('tt',H,{x:H.x-260,y:H.y-30},{stroke:col,strokeWidth:12}),L('dt',Hb,{x:Hb.x-200,y:Hb.y-150},{stroke:col,strokeWidth:12})));
  els.push(h('g',{key:'hpt',className:'ck-s1'},h('circle',{cx:X(H.x),cy:Y(H.y),r:12,fill:'var(--s-measure)'}),
    T('t1',X(H.x)-30*fs,Y(H.y)+90*fs,props.short?'Frame':'Frame stack & reach end here',{fill:'var(--s-measure)',fontSize:30,textAnchor:'end'}),
    T('t1b',X(H.x)-30*fs,Y(H.y)+128*fs,g.stack+' / '+g.reach+' mm',{fill:'var(--s-measure)',fontSize:30,fontWeight:800,textAnchor:'end'})));
  if(step>=2){var n=Math.max(1,Math.round(sp/5)),seg=[];for(var i=0;i<n;i++){var a1={x:H.x+dx*(i*5),y:H.y+dy*(i*5)},a2={x:H.x+dx*(i*5+4.2),y:H.y+dy*(i*5+4.2)};seg.push(L('s'+i,a1,a2,{stroke:'var(--s-fg)',strokeWidth:40,strokeLinecap:'butt'}));}
    els.push(h('g',{key:'sp',className:'ck-s2'},seg,props.short?null:T('t2',X(top.x)-36*fs,Y((H.y+top.y)/2)+10*fs,'+ '+sp+' mm spacers',{fontSize:32,textAnchor:'end'})));}
  if(step>=3){els.push(h('g',{key:'st',className:'ck-s3'},L('cl',{x:clamp.x-dx*c0,y:clamp.y-dy*c0},{x:clamp.x+dx*c0,y:clamp.y+dy*c0},{stroke:'var(--s-fg)',strokeWidth:46,strokeLinecap:'butt'}),
      L('stem',clamp,bar,{stroke:'var(--s-fg)',strokeWidth:22}),h('circle',{cx:X(bar.x),cy:Y(bar.y),r:26,fill:'var(--s-bg)',stroke:'var(--s-fg)',strokeWidth:10}),
      props.short?null:T('t3',X(bar.x)+10*fs,Y(bar.y)+75*fs,'+ '+stem+' mm stem',{fontSize:32,textAnchor:'middle'})));}
  if(props.hands){els.push(h('g',{key:'hd',className:'ck-s4'},T('t4',X(bar.x),Y(bar.y)-(props.short?75:50)*fs,props.short?props.hands:'Your hands: '+props.hands,{fill:'var(--s-accent)',fontSize:props.short?44:34,fontWeight:800,textAnchor:'middle'})));}
  return h('svg',{className:'ck',width:W,height:Hh,viewBox:'0 0 '+W+' '+Hh,style:{display:'block',overflow:'hidden'}},els);}
var grail2={hta:71.5,stack:591,reach:411,headTube:163},crux2={hta:72,stack:578,reach:397,headTube:147};
var g2v2=withSeries('Geometry 101',[
  clone(g2[0],{total:8}),
  h(G.ContentSlide,{key:2,page:2,total:8,kicker:'1 · What the chart measures',title:'Stack and reach stop at the top of the frame.',art:h(G.BikeDrawing,{bikes:['grailM'],width:860,dims:['stack','reach']}),note:'A geometry chart describes the frame only. Your hands sit higher and further forward, on the bars.',artFirst:true}),
  h(G.ContentSlide,{key:3,page:3,total:8,kicker:'2 · From frame to hands',title:'Spacers lift the bars.\nThe stem pushes them forward.',titleBelow:true,art:h(Cockpit,{g:grail2,stem:70,spacers:25,step:3,width:900,hands:'635 / 470 mm'}),note:'Canyon Grail Gen 2, size M: 70 mm factory stem. Geomo assumes 25 mm of spacers unless you tell it otherwise.'}),
  h(G.ContentSlide,{key:4,page:4,total:8,kicker:'3 · On the chart',title:'The Grail frame looks longer.',art:pair(grailM,crux,{callouts:[{at:'H',from:0,to:1,text:'+13 / +14 mm',dx:-40,dy:110,size:40}]}),note:'Frame stack and reach: Grail M 591 / 411 mm, Crux 56 578 / 397 mm.',artFirst:true}),
  h(G.ContentSlide,{key:5,page:5,total:8,kicker:'4 · At the handlebar',title:'The Crux puts your hands 16 mm further.',titleBelow:true,art:h('div',{className:'ck-pair',style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,width:'100%'}},
      h('div',null,lab('Grail M · 70 mm stem',{color:'var(--series-1)',fontWeight:700,fontSize:30}),h(Cockpit,{g:grail2,stem:70,spacers:25,step:3,width:450,short:true,color:'var(--series-1)',hands:'470 mm'})),
      h('div',null,lab('Crux 56 · 100 mm stem',{color:'var(--series-2)',fontWeight:700,fontSize:30}),h(Cockpit,{g:crux2,stem:100,spacers:25,step:3,width:450,short:true,color:'var(--series-2)',hands:'486 mm'}))),
    note:'Hand reach: Grail 470 mm, Crux 486 mm (Geomo, 178 cm rider, factory stems). The Crux frame is shorter, but its stem is 30 mm longer.'}),
  h(G.ContentSlide,{key:6,page:6,total:8,kicker:'5 · What 16 mm means',title:'Further forward = more stretched.',art:h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,width:'100%'}},
      h('div',{style:{display:'grid',gap:12,alignContent:'start'}},kick('Hands further forward',{borderBottom:'3px solid var(--s-fg)',paddingBottom:10}),
        h('span',{style:SERIF(36)},'+ Lower, more aero position.'),h('span',{style:SERIF(36)},'− Harder on a stiff back and neck.')),
      h('div',{style:{display:'grid',gap:12,alignContent:'start'}},kick('Hands closer',{borderBottom:'3px solid var(--s-fg)',paddingBottom:10}),
        h('span',{style:SERIF(36)},'+ More upright, easier on long days.'),h('span',{style:SERIF(36)},'− Less aero, can feel cramped.'))),
    note:'A stem swap moves the bars, within limits: Geomo works with 60–140 mm stems and checks if a different one would fit you better.',artFirst:true}),
  clone(g2[5],{page:7,total:8,key:7}),
  h(G.CTASlide,{key:8,page:8,total:8,title:'Check where your hands end up, before you buy.',sub:'Free · no account · about a minute',actions:CTA_ACT})
]);

window.SETS={g2v2:g2v2,p4:p4,si:storyInseam,cm:postCm,bf1:bf1,bf2:bf2,bf3:bf3,r12:r12,st:stories,p1:post1,p3:post3,r2:reel,safe:safe,c:postC,g1:g1,g2:g2,g3:g3};
