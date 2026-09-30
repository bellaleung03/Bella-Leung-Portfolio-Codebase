import * as THREE from './three.module.js';
import { stories } from './stories.js';
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let selected = 0, pendingOpen = null, engaged = false;
const storyDialog=$('storyDialog'), indexDialog=$('indexDialog'), helpDialog=$('helpDialog'), tourDialog=$('tourDialog'), videoPlayer=$('videoPlayer'), videoFrame=$('videoFrame'), projectDetails=$('projectDetails'), projectAssets=$('projectAssets'), writingContent=$('writingContent');
const modals=[storyDialog,indexDialog,helpDialog,tourDialog];
const featuredWorks=['[AI+AE short ad film] Bowl of Friendship','[app promotion video] HAPI trailer 2 / app demo','[AI short ad] 一日勞動貓','[AI short ad] Dog Wash Diary','【自由之後】POV 你啱啱畢業'].map(title=>stories.findIndex(s=>s.title===title));let featuredMode=false,featuredCursor=0;
const engage=()=>{engaged=true;$('intro').classList.add('gone');$('world').style.opacity='1';};
$('world').style.opacity='.35';
$('world').style.transition='opacity .6s';
for(const dialog of modals){const close=dialog.querySelector('.close');if(close)close.onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(dialog===tourDialog||e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});}
tourDialog.addEventListener('cancel',e=>e.preventDefault());
storyDialog.addEventListener('close',()=>{videoPlayer.src='';});
function renderDetails(s){projectDetails.replaceChildren();const rows=[['Summary',s.summary],['Style',s.style],[s.message?'Message':'Goal',s.message??s.goal],['Date',s.date]].filter(([,value])=>value);for(const [label,value] of rows){const row=document.createElement('div');row.className='project-detail';const key=document.createElement('b');key.textContent=label.toUpperCase();const text=document.createElement('span');text.textContent=value;row.append(key,text);projectDetails.append(row);}}
function appendWritingSection(target,section){const block=document.createElement('section');block.className='writing-story';const heading=document.createElement('h3');heading.textContent=section.title;block.append(heading);if(section.date){const date=document.createElement('p');date.className='writing-date';date.textContent=section.date;block.append(date);}for(const paragraph of section.paragraphs){const p=document.createElement('p');p.textContent=paragraph;block.append(p);}const images=section.images??(section.title==='#3 貓皇帝'?[{image:'gallery/一公里-貓皇帝1.jpeg',caption:'街坊為牠貼上的「自由時間，請勿打擾」告示。'},{image:'gallery/一公里-貓皇帝2.jpeg',caption:'豹谷在店外的專屬位置。'}]:[]);if(images.length){const imageGrid=document.createElement('div');imageGrid.className='writing-images';for(const item of images){const figure=document.createElement('figure');const image=document.createElement('img');image.src=item.image;image.alt=item.caption;const caption=document.createElement('figcaption');caption.textContent=item.caption;figure.append(image,caption);imageGrid.append(figure);}block.append(imageGrid);}target.append(block);}
function renderWritingStory(section){writingContent.replaceChildren();const backToSeries=()=>{renderWriting(stories[selected]);storyDialog.scrollTo({top:0,behavior:reduced?'auto':'smooth'});};const back=document.createElement('button');back.className='writing-back';back.textContent='← Back to series';back.onclick=backToSeries;writingContent.append(back);appendWritingSection(writingContent,section);const finish=document.createElement('div');finish.className='writing-finish';const finishButton=document.createElement('button');finishButton.textContent='Back to series';finishButton.onclick=backToSeries;finish.append(finishButton);writingContent.append(finish);storyDialog.scrollTo({top:0,behavior:reduced?'auto':'smooth'});}
function renderWriting(s){writingContent.replaceChildren();writingContent.hidden=!s.articleSections;if(!s.articleSections)return;for(const section of s.articleSections.slice(0,2))appendWritingSection(writingContent,section);const tileImages={'#1 原點':'gallery/一公里-原點.jpeg','#2 秘密':'gallery/一公里-秘密.jpg','#3 貓皇帝':'gallery/一公里-貓皇帝1.jpeg'};const heading=document.createElement('h3');heading.className='writing-stories-title';heading.textContent='Three stories';const grid=document.createElement('div');grid.className='writing-tiles';for(const section of s.articleSections.slice(2)){const tile=document.createElement('button');tile.className='writing-tile';tile.style.backgroundImage=`linear-gradient(0deg,#111b 0%,#1110 70%),url("${encodeURI(tileImages[section.title])}")`;const title=document.createElement('strong');title.textContent=section.title;const hint=document.createElement('span');hint.textContent='Read story';tile.append(title,hint);tile.onclick=()=>renderWritingStory(section);grid.append(tile);}writingContent.append(heading,grid);}
function renderProjectAssets(s){projectAssets.replaceChildren();projectAssets.hidden=!s.projectAssets?.length;if(!s.projectAssets?.length)return;const heading=document.createElement('h3');heading.textContent='Project materials';projectAssets.append(heading);for(const asset of s.projectAssets){const figure=document.createElement('figure');const image=document.createElement('img');image.src=asset.image;image.alt=asset.caption;image.loading='lazy';const caption=document.createElement('figcaption');caption.textContent=asset.caption;figure.append(image,caption);projectAssets.append(figure);}}
function setGalleryEmphasis(){for(const node of nodes){const isFeatured=stories[node.userData.story]?.featured;node.material.transparent=true;node.material.opacity=!featuredMode||isFeatured?1:.22;}}
function showStory(i){selected=(i+stories.length)%stories.length;const s=stories[selected];const cursor=featuredWorks.indexOf(selected);if(featuredMode&&cursor>=0){featuredCursor=cursor;$('storyMeta').textContent=`FEATURED ${String(cursor+1).padStart(2,'0')} / ${String(featuredWorks.length).padStart(2,'0')} · ${s.label}`;$('previous').textContent=cursor?'← Previous featured work':'← Featured start';$('next').textContent=cursor===featuredWorks.length-1?'Explore all works →':'Next featured work →';}else{$('storyMeta').textContent=s.label;$('previous').textContent='← Previous work';$('next').textContent='Next work →';}$('storyTitle').textContent=s.title;renderDetails(s);renderProjectAssets(s);renderWriting(s);videoFrame.hidden=!s.video;videoPlayer.src=s.video??'';setGalleryEmphasis();if(!storyDialog.open)storyDialog.showModal();}
function moveWork(delta){if(featuredMode){const next=featuredCursor+delta;if(next<0)return;if(next>=featuredWorks.length){featuredMode=false;setGalleryEmphasis();storyDialog.close();return;}focusStory(featuredWorks[next],true);return;}focusStory(selected+delta,true);}
$('previous').onclick=()=>moveWork(-1);$('next').onclick=()=>moveWork(1);
$('help').onclick=()=>helpDialog.showModal();
function startFeaturedTour(){featuredMode=true;featuredCursor=0;setGalleryEmphasis();focusStory(featuredWorks[0]);}
$('featuredTour').onclick=()=>{helpDialog.close();startFeaturedTour();};$('tourStart').onclick=()=>{tourDialog.close();startFeaturedTour();};$('tourSkip').onclick=()=>{tourDialog.close();engage();};
const categories=[
 {id:'cinematic',title:'Photorealistic cinematic',traits:'Film-style lighting, colour grading, and light comedy or whimsy.',image:'gallery/talk of the town.png'},
 {id:'parody',title:'Genre parody',traits:'Familiar formats reimagined for comedy.',image:'gallery/dog wash diary.png'},
 {id:'animation',title:'Stylized animation',traits:'Illustrated and rendered worlds with distinct art direction.',image:'gallery/bowl of friendship.png'},
 {id:'product',title:'Motion graphics and others',traits:'Graphic-led, handmade, and other formats that promote HAPI directly.',image:'gallery/hapi pet app demo.png'}
];
const categoryGrid=$('categoryGrid'),storyList=$('storyList'),indexTitle=$('indexTitle'),indexIntro=$('indexIntro'),showAllWorks=$('showAllWorks'),backToCategories=$('backToCategories');
function renderWorkList(filter,title,description){categoryGrid.hidden=true;storyList.hidden=false;showAllWorks.hidden=true;backToCategories.hidden=false;indexTitle.textContent=title;indexIntro.hidden=false;indexIntro.textContent=description;storyList.replaceChildren();stories.forEach((s,i)=>{if(filter&&!filter(s))return;const b=document.createElement('button');b.className='work-index-item';const number=document.createElement('span');number.className='work-number';number.textContent=String(i+1).padStart(2,'0');const thumbnail=document.createElement('img');thumbnail.className='work-thumbnail';thumbnail.src=s.image;thumbnail.alt='';const content=document.createElement('span');const name=document.createElement('strong');name.textContent=s.title;content.append(name);for(const [label,value] of [['Summary',s.summary],['Style',s.style],[s.message?'Message':'Goal',s.message??s.goal],['Date',s.date]]){if(!value)continue;const detail=document.createElement('small');const key=document.createElement('b');key.textContent=label+': ';detail.append(key,document.createTextNode(value));content.append(detail);}b.append(number,thumbnail,content);b.onclick=()=>{indexDialog.close();focusStory(i);};storyList.append(b);});}
function renderCategoryMenu(){storyList.hidden=true;categoryGrid.hidden=false;showAllWorks.hidden=false;backToCategories.hidden=true;indexTitle.textContent='What would you like to watch?';indexIntro.hidden=true;categoryGrid.replaceChildren();for(const category of categories){const card=document.createElement('button');card.className='category-card';card.style.setProperty('--category-image',`url("${encodeURI(category.image)}")`);const name=document.createElement('strong');name.textContent=category.title;const count=document.createElement('span');count.textContent=stories.filter(s=>s.category===category.id).length+' works';card.append(name,count);card.onclick=()=>renderWorkList(s=>s.category===category.id,category.title,category.traits);categoryGrid.append(card);}}
function openIndex(){renderCategoryMenu();indexDialog.showModal();}
$('indexButton').onclick=openIndex;$('fallbackIndex').onclick=openIndex;showAllWorks.onclick=()=>renderWorkList(null,'All 16 works','Browse the complete AI video portfolio.');backToCategories.onclick=renderCategoryMenu;renderCategoryMenu();
tourDialog.showModal();
let scene,camera,renderer,world,raycaster;
const home={yaw:-.18,pitch:0,distance:33};
const view={...home}, goal={...home};
const velocity={x:0,y:0}, nodes=[], anchors=[];
const clamp=THREE.MathUtils.clamp;
function focusStory(i,immediate=false){engage();selected=(i+stories.length)%stories.length;const a=anchors[selected];if(a){const desired=-a.angle;goal.yaw=view.yaw+Math.atan2(Math.sin(desired-view.yaw),Math.cos(desired-view.yaw));goal.pitch=clamp(Math.atan2(a.y,16),-.55,.55);goal.distance=26;velocity.x=velocity.y=0;}
 clearTimeout(pendingOpen);pendingOpen=null;if(immediate||reduced||!renderer)showStory(selected);else pendingOpen=setTimeout(()=>{pendingOpen=null;showStory(selected);},650);
}
function cancelPending(){clearTimeout(pendingOpen);pendingOpen=null;}
function reset(){cancelPending();featuredMode=false;setGalleryEmphasis();goal.yaw=view.yaw+Math.atan2(Math.sin(home.yaw-view.yaw),Math.cos(home.yaw-view.yaw));goal.pitch=0;goal.distance=home.distance;velocity.x=velocity.y=0;$('intro').classList.remove('gone');$('world').style.opacity='.35';engaged=false;}
$('reset').onclick=reset;
function zoom(delta){engage();cancelPending();goal.distance=clamp(goal.distance+delta,23,52);}
$('zoomIn').onclick=()=>zoom(-3);$('zoomOut').onclick=()=>zoom(3);
function textTexture(text,card=false,index=0){const c=document.createElement('canvas');c.width=card?768:2048;c.height=card?640:128;const ctx=c.getContext('2d');
 if(card){const colors=['#e9cbc1','#c5d7d7','#dedaba','#c8cfdf'];ctx.fillStyle=colors[index%4];ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#363b3b';ctx.font='24px Arial';ctx.fillText('PERSPECTIVE / '+String(index+1).padStart(2,'0'),48,65);ctx.font='54px Georgia';let words=text.split(' '),line='',y=285;for(const word of words){if(ctx.measureText(line+word).width>655){ctx.fillText(line,48,y);line='';y+=66;}line+=word+' ';}ctx.fillText(line,48,y);ctx.font='24px Arial';ctx.fillText('Read the story  ↗',48,580);
 }else{ctx.fillStyle='#343a3b';ctx.font=index%3===0?'italic 49px Georgia':'45px Arial';ctx.textBaseline='middle';ctx.fillText(text,8,64,2028);}
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;}
function filenameTexture(filename,label,compact=false){const c=document.createElement('canvas');c.width=compact?840:1200;c.height=compact?300:240;const ctx=c.getContext('2d');
 ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#273236';ctx.textAlign='center';ctx.textBaseline='middle';
 if(compact){ctx.font="600 42px ui-monospace, SFMono-Regular, Menlo, Consolas, 'Microsoft JhengHei', monospace";ctx.fillText(label,c.width/2,80,760);ctx.font="600 54px ui-monospace, SFMono-Regular, Menlo, Consolas, 'Microsoft JhengHei', monospace";ctx.fillText(filename,c.width/2,205,760);}
 else{ctx.font="600 42px ui-monospace, SFMono-Regular, Menlo, Consolas, 'Microsoft JhengHei', monospace";ctx.fillText(label,c.width/2,62,1120);ctx.font="600 64px ui-monospace, SFMono-Regular, Menlo, Consolas, 'Microsoft JhengHei', monospace";ctx.fillText(filename,c.width/2,165,1120);}
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;}
function ribbon(width,height){const geo=new THREE.PlaneGeometry(width,height,48,1);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i);p.setXYZ(i,16*Math.sin(x/16),p.getY(i),16*(Math.cos(x/16)-1));}geo.computeVertexNormals();return geo;}
function place(mesh,angle,y,id,radius=16){mesh.position.set(Math.sin(angle)*radius,y,Math.cos(angle)*radius);mesh.rotation.y=angle;mesh.userData.story=id;world.add(mesh);nodes.push(mesh);}
try{
 scene=new THREE.Scene();scene.background=new THREE.Color('#f7f8f8');scene.fog=new THREE.Fog('#f7f8f8',24,62);
 camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,100);renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;$('world').append(renderer.domElement);
 world=new THREE.Group();scene.add(world);raycaster=new THREE.Raycaster();
 // A loose, hand-curated path gives the gallery an exhibition-like rhythm.
 const galleryPath=[
  {angle:-2.85,y:2.5,radius:16.2},{angle:-2.44,y:5.6,radius:16.7},
  {angle:-2.03,y:-.6,radius:15.6},{angle:-1.63,y:3.8,radius:16.8},
  {angle:-1.25,y:-3,radius:15.8},{angle:-.85,y:-.5,radius:16.9},
  {angle:-.44,y:2.8,radius:15.7},{angle:-.05,y:-5,radius:16.5},
  {angle:.36,y:-1.6,radius:15.9},{angle:.77,y:5.1,radius:16.7},
  {angle:1.11,y:.8,radius:16},{angle:1.51,y:-3.9,radius:16.8},
  {angle:1.91,y:3.5,radius:15.8},{angle:2.31,y:-.7,radius:16.6},
  {angle:2.71,y:-5.7,radius:16.1},{angle:3.07,y:-1.5,radius:16.2}
 ];
 // Strong hierarchy: small covers retain their current scale; middle and hero
 // covers become immediately recognisable focal points.
 const sizeScale={large:2,medium:1.48,small:.9};
 const loader=new THREE.TextureLoader();
 stories.forEach((s,i)=>{const spot=galleryPath[i];
  const mat=new THREE.MeshBasicMaterial({map:textTexture(s.title,true,i),side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(3.45,5.15),mat);place(mesh,spot.angle,spot.y,i,spot.radius);anchors.push(spot);
  const filename=(s.filename??s.image.split('/').pop()).replace(/\.png$/i,'.mp4');
  loader.load(encodeURI(s.image),tex=>{tex.colorSpace=THREE.SRGBColorSpace;
   // Fit within a shared gallery envelope, without ever cropping or stretching.
   const ratio=tex.image.width/tex.image.height,maxWidth=4.25,maxHeight=5.15;
   const width=ratio>maxWidth/maxHeight?maxWidth:maxHeight*ratio;
   const height=ratio>maxWidth/maxHeight?maxWidth/ratio:maxHeight;
   const scale=sizeScale[s.size]??1;
   mesh.scale.set(width/3.45*scale,height/5.15*scale,1);
   const horizontal=ratio>1;
   const labelHeight=2.04*scale;
   const labelWidth=horizontal?5.7*scale:10.2*(width/3.45)*scale;
   const caption=new THREE.Mesh(new THREE.PlaneGeometry(labelWidth,labelHeight),new THREE.MeshBasicMaterial({map:filenameTexture(filename,s.label,horizontal),transparent:true,side:THREE.DoubleSide,depthWrite:false}));
   caption.position.set(Math.sin(spot.angle)*spot.radius,spot.y-height*scale/2-labelHeight/2-.18*scale,Math.cos(spot.angle)*spot.radius);caption.rotation.y=spot.angle;caption.userData.story=i;world.add(caption);nodes.push(caption);
   mat.map.dispose();mat.map=tex;mat.needsUpdate=true;
  },undefined,()=>console.warn('Thumbnail unavailable:',s.title));
 });
 const points=[];let seed=9;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};for(let i=0;i<600;i++)points.push((rnd()-.5)*65,(rnd()-.5)*40,(rnd()-.5)*50);const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.Float32BufferAttribute(points,3));world.add(new THREE.Points(pg,new THREE.PointsMaterial({color:'#a7afb1',size:.026,transparent:true,opacity:.32})));
 const el=$('world'),pointers=new Map();let lastX=0,lastY=0,moved=0,lastTime=0,pinch=0,gesture=false,hover=null;
 function hit(x,y){const p=new THREE.Vector2(x/innerWidth*2-1,-y/innerHeight*2+1);raycaster.setFromCamera(p,camera);const results=raycaster.intersectObjects(nodes);return results.find(r=>r.distance<40)?.object??null;}
 function clearHover(){if(hover)hover.material.color.set('#ffffff');hover=null;$('tooltip').style.opacity='0';}
 el.addEventListener('pointerdown',e=>{if(e.button!==0)return;engage();cancelPending();el.focus({preventScroll:true});pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});el.setPointerCapture(e.pointerId);lastX=e.clientX;lastY=e.clientY;lastTime=performance.now();moved=0;velocity.x=velocity.y=0;clearHover();el.classList.add('dragging');if(pointers.size===2){gesture=true;const p=[...pointers.values()];pinch=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}});
 el.addEventListener('pointermove',e=>{if(pointers.has(e.pointerId)){pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const p=[...pointers.values()],d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);goal.distance=clamp(goal.distance-(d-pinch)*.035,23,52);pinch=d;moved=100;return;}
 const dx=e.clientX-lastX,dy=e.clientY-lastY,dt=Math.max(performance.now()-lastTime,8);moved+=Math.abs(dx)+Math.abs(dy);goal.yaw+=dx*.0035;goal.pitch=clamp(goal.pitch+dy*.0025,-.75,.75);velocity.x=dx*.0035/dt*16;velocity.y=dy*.0025/dt*16;lastX=e.clientX;lastY=e.clientY;lastTime=performance.now();return;}
 const obj=hit(e.clientX,e.clientY);if(obj!==hover){clearHover();hover=obj;if(obj)obj.material.color.set('#cf675b');}el.style.cursor=obj?'pointer':'grab';if(obj){const s=stories[obj.userData.story];$('tooltip').textContent=s.summary;$('tooltip').style.left=Math.min(e.clientX+15,innerWidth-350)+'px';$('tooltip').style.top=Math.max(10,e.clientY-38)+'px';$('tooltip').style.opacity='1';}});
 function finish(e){if(!pointers.has(e.pointerId))return;const click=e.type==='pointerup'&&moved<7&&!gesture;pointers.delete(e.pointerId);if(pointers.size){const p=[...pointers.values()][0];lastX=p.x;lastY=p.y;}else{el.classList.remove('dragging');gesture=false;if(performance.now()-lastTime>90)velocity.x=velocity.y=0;}
 if(e.type==='pointercancel'){velocity.x=velocity.y=0;return;}if(click){const obj=hit(e.clientX,e.clientY);if(obj)focusStory(obj.userData.story);}}
 el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',finish);el.addEventListener('lostpointercapture',finish);el.addEventListener('pointerleave',clearHover);
 el.addEventListener('wheel',e=>{e.preventDefault();zoom(clamp(e.deltaY,-100,100)*.025);clearHover();},{passive:false});
 el.addEventListener('keydown',e=>{const actions={ArrowLeft:()=>goal.yaw-=.12,ArrowRight:()=>goal.yaw+=.12,ArrowUp:()=>goal.pitch=clamp(goal.pitch-.09,-.75,.75),ArrowDown:()=>goal.pitch=clamp(goal.pitch+.09,-.75,.75),'+':()=>zoom(-2),'=':()=>zoom(-2),'-':()=>zoom(2),Home:reset};if(actions[e.key]){e.preventDefault();cancelPending();engage();actions[e.key]();}});
 addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('fallback').hidden=false;});
 let previous=performance.now();function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-previous)/16.667,3);previous=now;if(!pointers.size&&!modals.some(d=>d.open)&&!pendingOpen){if(!reduced){goal.yaw+=velocity.x*dt;goal.pitch=clamp(goal.pitch+velocity.y*dt,-.75,.75);}velocity.x*=Math.pow(.91,dt);velocity.y*=Math.pow(.91,dt);}
 const lerp=reduced?1:1-Math.pow(.89,dt);view.yaw+=(goal.yaw-view.yaw)*lerp;view.pitch+=(goal.pitch-view.pitch)*lerp;view.distance+=(goal.distance-view.distance)*lerp;world.rotation.y=view.yaw;camera.position.set(0,Math.sin(view.pitch)*view.distance,Math.cos(view.pitch)*view.distance);camera.lookAt(0,0,0);renderer.render(scene,camera);}
 requestAnimationFrame(animate);
}catch(error){console.error(error);$('fallback').hidden=false;$('intro').classList.add('gone');}
