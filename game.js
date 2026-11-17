/* SHADOW REBORN — Phaser 4.2.1
   Original procedural-art prototype. No external game assets required. */
(() => {
'use strict';
const W=1280,H=720, WORLD=5200;
const C={
  bg:0x080d18, sky:0x111b31, moon:0xc9d8ef, blue:0x75a8ff,
  cyan:0x8ce8ef, violet:0x8e67c8, red:0xe65b68, gold:0xe6c27a,
  stone:0x202a3b, stone2:0x344158, dark:0x090d16, white:0xf0f4ff
};
class Boot extends Phaser.Scene{
 constructor(){super('Boot')}
 create(){
  const g=this.make.graphics({x:0,y:0,add:false});
  // hero texture with layered silhouette, cloak and glowing eyes
  g.fillStyle(0x000000,0.28);g.fillEllipse(32,61,43,9);
  g.fillStyle(0x111827,1);g.fillRoundedRect(19,24,26,35,8);
  g.fillStyle(0x27364d,1);g.fillTriangle(20,34,5,61,31,54);g.fillTriangle(42,34,60,61,34,54);
  g.fillStyle(0x0b101b,1);g.fillCircle(32,17,13);
  g.fillStyle(0x9eb8dc,1);g.fillRoundedRect(20,10,24,13,7);
  g.fillStyle(0x78e6f2,1);g.fillRect(24,17,5,2);g.fillRect(36,17,5,2);
  g.fillStyle(0x111827,1);g.fillRoundedRect(20,54,10,10,3);g.fillRoundedRect(34,54,10,10,3);
  g.generateTexture('hero',64,68);g.clear();
  // enemy wraith
  g.fillStyle(0x000000,.25);g.fillEllipse(30,59,42,8);
  g.fillStyle(0x28223e,1);g.fillTriangle(30,4,5,58,55,58);g.fillRoundedRect(12,22,36,32,12);
  g.fillStyle(0xe66b8d,1);g.fillRect(19,27,8,3);g.fillRect(34,27,8,3);
  g.generateTexture('wraith',60,64);g.clear();
  // projectile
  g.fillStyle(0x8ce8ef,1);g.fillCircle(8,8,7);g.fillStyle(0xffffff,.8);g.fillCircle(6,6,3);
  g.generateTexture('orb',16,16);g.clear();
  // particle
  g.fillStyle(0xb8e7ff,1);g.fillCircle(4,4,4);g.generateTexture('spark',8,8);g.destroy();
  this.scene.start('Menu');
 }
}
class Menu extends Phaser.Scene{
 constructor(){super('Menu')}
 create(){
  this.add.rectangle(W/2,H/2,W,H,0x070b14);
  this.paintBackdrop();
  this.add.text(W/2,190,'SHADOW',{fontFamily:'Georgia',fontSize:'92px',fontStyle:'bold',color:'#dce8ff',stroke:'#334c77',strokeThickness:3}).setOrigin(.5).setShadow(0,0,28,'#6faaff',.8);
  this.add.text(W/2,275,'REBORN',{fontFamily:'Georgia',fontSize:'74px',color:'#8fb9ef',letterSpacing:16}).setOrigin(.5);
  this.add.text(W/2,355,'THE KINGDOM REMEMBERS YOUR NAME',{fontFamily:'Arial',fontSize:'14px',color:'#8d9db8',letterSpacing:5}).setOrigin(.5);
  
const start = this.add.text(
  W / 2,
  485,
  '[ ENTER THE FORGOTTEN REALM ]',
  {
    fontFamily: 'Arial',
    fontSize: '19px',
    color: '#e6c27a',
    letterSpacing: 3
  }
).setOrigin(0.5);

start.setInteractive({ useHandCursor: true });

start.on('pointerover', () => start.setColor('#ffffff'));
start.on('pointerout', () => start.setColor('#e6c27a'));

// Mobile and desktop pointer fallback
this.input.once('pointerdown', () => {
  this.scene.start('Game');
});

  this.input.keyboard.once('keydown-ENTER',()=>this.scene.start('Game'));
  this.add.text(W/2,570,'A / D or ARROWS  ·  SPACE TO JUMP  ·  J TO STRIKE  ·  K TO SHADOW BURST',{fontFamily:'Arial',fontSize:'12px',color:'#71809b',letterSpacing:1}).setOrigin(.5);
  this.add.text(W/2,610,'MOBILE: USE THE ON-SCREEN CONTROLS',{fontFamily:'Arial',fontSize:'11px',color:'#56647d',letterSpacing:2}).setOrigin(.5);
 }
 paintBackdrop(){
  const g=this.add.graphics();
  for(let i=0;i<70;i++){let x=(i*197)%W,y=(i*83)%H;g.fillStyle(0x9dbce8,.18+(i%4)*.1);g.fillCircle(x,y,i%3===0?2:1)}
  g.fillStyle(0x9ebde4,.8);g.fillCircle(1000,135,58);g.fillStyle(0x111b31,1);g.fillCircle(1024,115,57);
  for(let layer=0;layer<3;layer++){g.fillStyle([0x17243b,0x111c30,0x0d1525][layer],1);let base=430+layer*65;g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=80){g.lineTo(x,base+Math.sin(x*.012+layer)*55)}g.lineTo(W,H);g.closePath();g.fillPath()}
 }
}
class Game extends Phaser.Scene{
 constructor(){super('Game')}
 create(){
  this.physics.world.setBounds(0,0,WORLD,H);
  this.physics.world.gravity.y=1050;
  this.makeWorld();
  this.player=this.physics.add.sprite(130,500,'hero').setDepth(10);
  this.player.setCollideWorldBounds(true);this.player.setDragX(1500);this.player.setMaxVelocity(360,900);
  this.player.body.setSize(27,52).setOffset(18,12);
  this.platforms=this.physics.add.staticGroup();
  const floors=[[0,640,900],[1000,640,700],[1800,640,900],[2800,640,800],[3700,640,800],[4550,640,650],
   [520,535,180],[790,465,150],[1190,530,180],[1510,455,170],[1960,530,180],[2250,465,160],[2600,535,180],[3100,500,180],[3400,430,170],[3900,520,180],[4200,455,160],[4700,520,180]];
  floors.forEach(([x,y,w])=>this.addPlatform(x,y,w));
  this.physics.add.collider(this.player,this.platforms);
  this.enemies=this.physics.add.group({allowGravity:true});
  [650,1330,2070,3190,4020,4830].forEach((x,i)=>this.spawnEnemy(x,560,i%2?1:-1));
  this.physics.add.collider(this.enemies,this.platforms);
  this.physics.add.collider(this.player,this.enemies,(p,e)=>this.hitPlayer(e),null,this);
  this.cursors=this.input.keyboard.createCursorKeys();
  this.keys=this.input.keyboard.addKeys('A,D,J,K,SHIFT,ENTER,ESC');
  this.lastAttack=0;this.lastBurst=0;this.hp=100;this.score=0;this.dead=false;this.invuln=0;
  this.projectiles=this.physics.add.group({defaultKey:'orb',allowGravity:false});
  this.physics.add.overlap(this.projectiles,this.enemies,(orb,e)=>{orb.destroy();this.damageEnemy(e,35)},null,this);
  this.cameras.main.setBounds(0,0,WORLD,H);this.cameras.main.startFollow(this.player,true,.08,.08);this.cameras.main.setDeadzone(330,170);this.cameras.main.fadeIn(900,0,0,0);
  this.makeHUD();this.makeTouchControls();
  this.input.keyboard.on('keydown-ESC',()=>this.scene.start('Menu'));
  this.add.text(30,105,'CHAPTER I  /  THE ASHEN PASS',{fontFamily:'Arial',fontSize:'12px',color:'#9baecb',letterSpacing:3}).setScrollFactor(0).setDepth(100);
  this.toast('THE DEAD DO NOT SLEEP',2200);
  this.time.addEvent({delay:16000,loop:true,callback:()=>this.spawnEnemy(Math.min(WORLD-100,this.player.x+Phaser.Math.Between(500,850)),560,Phaser.Math.Between(0,1)?1:-1)});
 }
 makeWorld(){
  // layered parallax silhouettes, moon, towers, fog and drifting motes
  const bg=this.add.graphics().setScrollFactor(0).setDepth(-30);
  bg.fillGradientStyle(0x0b1325,0x0b1325,0x17223a,0x080d18,1);bg.fillRect(0,0,W,H);
  bg.fillStyle(0xb8cce9,.55);bg.fillCircle(1010,145,48);bg.fillStyle(0x111a2c,1);bg.fillCircle(1032,129,48);
  for(let layer=0;layer<3;layer++){
   let fac=[.12,.25,.42][layer],col=[0x1c2b43,0x142138,0x101a2c][layer],g=this.add.graphics().setScrollFactor(fac).setDepth(-20+layer);
   g.fillStyle(col,1);
   for(let x=-200;x<WORLD+400;x+=Phaser.Math.Between(260,430)){
    let h=Phaser.Math.Between(130,300),w=Phaser.Math.Between(80,180),y=570-h;
    g.fillRect(x,y,w,h);g.fillTriangle(x-20,y,x+w/2,y-Phaser.Math.Between(25,80),x+w+20,y);
    if(layer===2){g.fillStyle(0x6f8db5,.15);g.fillRect(x+18,y+25,5,30);g.fillStyle(col,1)}
   }
  }
  const fog=this.add.graphics().setDepth(-5).setScrollFactor(.65);fog.fillStyle(0x6e8db8,.06);for(let i=0;i<18;i++)fog.fillEllipse(i*340,550,260,55);
  this.motes=this.add.particles(0,0,'spark',{x:{min:0,max:WORLD},y:{min:100,max:620}, lifespan:9000,frequency:90,quantity:1,scale:{start:.6,end:0},alpha:{start:.35,end:0},speedX:{min:-9,max:9},speedY:{min:-12,max:4},tint:[0x8bbdff,0x9be7ed,0x9278c9]}).setDepth(2);
 }
 addPlatform(x,y,w){
  const r=this.add.rectangle(x+w/2,y+22,w,44,0x1a2435).setStrokeStyle(1,0x52627d,.65);
  const top=this.add.rectangle(x+w/2,y,w,5,0x7185a4).setAlpha(.72);
  this.physics.add.existing(r,true);this.platforms.add(r);this.physics.add.existing(top,true);this.platforms.add(top);
  // subtle rune lights
  for(let xx=x+35;xx<x+w-20;xx+=95)this.add.rectangle(xx,y+3,2,9,0x83dce8,.4).setDepth(3);
 }
 spawnEnemy(x,y,dir){
  const e=this.enemies.create(x,y,'wraith');e.setDepth(8);e.setBounce(.05);e.setCollideWorldBounds(true);e.setDragX(500);e.setMaxVelocity(130,800);
  e.setData('hp',70);e.setData('dir',dir);e.setData('last',0);e.setData('alive',true);e.body.setSize(35,48).setOffset(12,10);
  return e;
 }
 makeHUD(){
  const ui=this.add.container(0,0).setScrollFactor(0).setDepth(100);
  this.add.rectangle(145,42,230,54,0x080d18,.82).setStrokeStyle(1,0x536b91,.7).setScrollFactor(0).setDepth(100);
  this.add.text(42,20,'VITALITY',{fontFamily:'Arial',fontSize:'10px',color:'#9fb0cb',letterSpacing:2}).setScrollFactor(0).setDepth(101);
  this.hpBack=this.add.rectangle(145,54,190,8,0x273349).setScrollFactor(0).setDepth(101);
  this.hpBar=this.add.rectangle(50,54,190,8,0x83dce8).setOrigin(0,.5).setScrollFactor(0).setDepth(102);
  this.scoreText=this.add.text(W-35,30,'SOULS  0000',{fontFamily:'Arial',fontSize:'15px',color:'#e6c27a',letterSpacing:2}).setOrigin(1,0).setScrollFactor(0).setDepth(101);
  this.add.text(W/2,24,'SHADOW REBORN',{fontFamily:'Georgia',fontSize:'14px',color:'#a7bad8',letterSpacing:5}).setOrigin(.5).setScrollFactor(0).setDepth(101).setAlpha(.7);
 }
 makeTouchControls(){
  this.touch={left:false,right:false,jump:false,attack:false,burst:false};
  const make=(x,y,label,key)=>{let c=this.add.circle(x,y,38,0x17243a,.72).setStrokeStyle(2,0x8da8d0,.55).setScrollFactor(0).setDepth(120).setInteractive();
   this.add.text(x,y,label,{fontFamily:'Arial',fontSize:'19px',color:'#e3edff'}).setOrigin(.5).setScrollFactor(0).setDepth(121);
   c.on('pointerdown',()=>this.touch[key]=true);c.on('pointerup',()=>this.touch[key]=false);c.on('pointerout',()=>this.touch[key]=false);return c};
  make(65,H-75,'◀','left');make(155,H-75,'▶','right');make(W-185,H-75,'J','attack');make(W-95,H-75,'↑','jump');make(W-95,H-165,'K','burst');
  this.scale.on('resize',()=>{}); 
 }
 toast(msg,duration=1300){
  const t=this.add.text(W/2,145,msg,{fontFamily:'Georgia',fontSize:'18px',color:'#d9e8ff',letterSpacing:4,stroke:'#0b1220',strokeThickness:4}).setOrigin(.5).setScrollFactor(0).setDepth(150).setAlpha(0);
  this.tweens.add({targets:t,alpha:1,y:125,duration:350,yoyo:true,hold:duration,onComplete:()=>t.destroy()});
 }
 update(time,delta){
  if(this.dead)return;
  const p=this.player,ground=p.body.blocked.down||p.body.touching.down;
  const left=this.cursors.left.isDown||this.keys.A.isDown||this.touch.left;
  const right=this.cursors.right.isDown||this.keys.D.isDown||this.touch.right;
  const jump=Phaser.Input.Keyboard.JustDown(this.cursors.space)||Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.keys.W)||this.touch.jump;
  const attack=Phaser.Input.Keyboard.JustDown(this.keys.J)||this.touch.attack;
  const burst=Phaser.Input.Keyboard.JustDown(this.keys.K)||this.touch.burst;
  if(left){p.setVelocityX(-285);p.setFlipX(true)}else if(right){p.setVelocityX(285);p.setFlipX(false)}else p.setAccelerationX(0);
  if(jump&&ground){p.setVelocityY(-545);this.fxBurst(p.x,p.y+25,0x9be7ed,9)}
  if(attack&&time-this.lastAttack>420){this.lastAttack=time;this.melee(time)}
  if(burst&&time-this.lastBurst>2600){this.lastBurst=time;this.shadowBurst()}
  this.enemies.children.iterate(e=>{if(!e||!e.active)return;let d=p.x-e.x,dist=Math.abs(d);
   if(dist<420){e.setVelocityX(Math.sign(d)*Math.min(95,45+dist*.08));e.setFlipX(d<0);
    if(dist<48&&time-e.getData('last')>1100){e.setData('last',time);this.hitPlayer(e)}
   }else e.setVelocityX(Math.sin(time*.001+e.x)*22);
  });
  if(this.invuln>0){this.invuln-=delta;p.setAlpha(Math.floor(time/75)%2?.35:1)}else p.setAlpha(1);
  this.hpBar.width=190*Math.max(0,this.hp/100);
  this.scoreText.setText('SOULS  '+String(this.score).padStart(4,'0'));
  if(p.y>H+100)this.damagePlayer(30);
  if(p.x>WORLD-150)this.win();
 }
 melee(time){
  const dir=this.player.flipX?-1:1;
  const slash=this.add.arc(this.player.x+dir*35,this.player.y,34,-70,70,false,0x9be7ed,.75).setStrokeStyle(5,0xdafcff,.9).setDepth(20);
  this.tweens.add({targets:slash,alpha:0,scale:1.7,duration:220,onComplete:()=>slash.destroy()});
  this.enemies.children.iterate(e=>{if(e&&e.active&&Math.abs(e.x-this.player.x)<92&&Math.abs(e.y-this.player.y)<65&&Math.sign(e.x-this.player.x)===dir)this.damageEnemy(e,42)});
 }
 shadowBurst(){
  this.fxBurst(this.player.x,this.player.y,0x8e67c8,38);
  this.cameras.main.shake(180,.008);
  this.enemies.children.iterate(e=>{if(e&&e.active&&Phaser.Math.Distance.Between(e.x,e.y,this.player.x,this.player.y)<185)this.damageEnemy(e,55)});
  this.player.setVelocityX(this.player.flipX?-560:560);this.player.setVelocityY(-100);
 }
 damageEnemy(e,amount){
  if(!e.active)return;let hp=e.getData('hp')-amount;e.setData('hp',hp);
  e.setTint(0xffffff);this.time.delayedCall(100,()=>{if(e.active)e.clearTint()});
  this.tweens.add({targets:e,x:e.x+(this.player.flipX?25:-25),duration:100,yoyo:true});
  if(hp<=0){this.fxBurst(e.x,e.y,0x9b78d4,16);e.destroy();this.score+=100}
 }
 hitPlayer(){if(this.invuln<=0)this.damagePlayer(14)}
 damagePlayer(n){
  if(this.invuln>0)return;this.hp-=n;this.invuln=900;this.cameras.main.shake(180,.012);this.fxBurst(this.player.x,this.player.y,0xe65b68,12);
  if(this.hp<=0){this.hp=0;this.dead=true;this.add.rectangle(W/2,H/2,W,H,0x05070d,.83).setScrollFactor(0).setDepth(200);
   this.add.text(W/2,270,'YOUR LIGHT HAS FADED',{fontFamily:'Georgia',fontSize:'38px',color:'#e5d8e4'}).setOrigin(.5).setScrollFactor(0).setDepth(201);
   this.add.text(W/2,350,'SOULS COLLECTED  '+this.score+'\n\nPRESS ENTER TO RISE AGAIN',{fontFamily:'Arial',fontSize:'16px',align:'center',color:'#aebbd1',lineSpacing:12}).setOrigin(.5).setScrollFactor(0).setDepth(201);
   this.input.keyboard.once('keydown-ENTER',()=>this.scene.restart());
  }
 }
 fxBurst(x,y,tint,count){
  for(let i=0;i<count;i++){let s=this.add.image(x,y,'spark').setTint(tint).setDepth(30).setScale(Phaser.Math.FloatBetween(.5,1.4));
   this.tweens.add({targets:s,x:x+Phaser.Math.Between(-90,90),y:y+Phaser.Math.Between(-75,75),alpha:0,scale:0,duration:Phaser.Math.Between(250,650),onComplete:()=>s.destroy()})}
 }
 win(){
  this.dead=true;this.add.rectangle(W/2,H/2,W,H,0x05070d,.86).setScrollFactor(0).setDepth(200);
  this.add.text(W/2,260,'THE SHADOW ENDURES',{fontFamily:'Georgia',fontSize:'42px',color:'#dceaff'}).setOrigin(.5).setScrollFactor(0).setDepth(201);
  this.add.text(W/2,340,'CHAPTER I COMPLETE\nSOULS  '+this.score+'\n\nPRESS ENTER TO PLAY AGAIN',{fontFamily:'Arial',fontSize:'17px',align:'center',color:'#aebbd1',lineSpacing:12}).setOrigin(.5).setScrollFactor(0).setDepth(201);
  this.input.keyboard.once('keydown-ENTER',()=>this.scene.restart());
 }
}
const config={type:Phaser.AUTO,parent:'game',backgroundColor:'#080d18',width:W,height:H,
 scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
 physics:{default:'arcade',arcade:{gravity:{y:1050},debug:false}},
 input:{activePointers:3},scene:[Boot,Menu,Game],render:{antialias:true,pixelArt:false,roundPixels:false}};
window.addEventListener('load',()=>{if(!window.Phaser){document.getElementById('loading').innerHTML='PHASER FAILED TO LOAD<br><span>CHECK YOUR INTERNET CONNECTION</span>';return}
 const game=new Phaser.Game(config);game.events.once('ready',()=>{const l=document.getElementById('loading');l.style.opacity='0';setTimeout(()=>l.remove(),900)});
});
})();
