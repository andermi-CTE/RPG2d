// EPOCH RPG r002. Load AFTER the class runtime. Original NES-inspired blockout.
// STUDENT EDIT: change one number or enemy name in RULES, then test.
// The shared class engine still owns input, scenes, town and the frame loop.
(() => {
  'use strict';
  const RULES = { startHP: 24, attack: 6, heal: 12, innCost: 3, herbCost: 3,
    encounterSteps: 14, enemies: [
      { name: 'Moss Imp', hp: 10, attack: 3, xp: 4, gold: 3, color: '#64b854' },
      { name: 'Dusk Moth', hp: 14, attack: 4, xp: 6, gold: 4, color: '#aa78d5' }
    ], guardian: { name: 'Tower Sentinel', hp: 30, attack: 5, xp: 12, gold: 10, color: '#d88746' } };
  const fresh = () => ({ hp: RULES.startHP, maxHP: RULES.startHP, level: 1, xp: 0, gold: 6, herbs: 3, tower: false });
  let hero = fresh(), battle = null, message = '', steps = 0, encounter = 0;
  const SAVE = 'epoch-rpg-r002';
  function save() { try { localStorage.setItem(SAVE, JSON.stringify(hero)); return true; } catch (_) { return false; } }
  try {
    const h = JSON.parse(localStorage.getItem(SAVE));
    if (h && ['hp','maxHP','level','xp','gold','herbs'].every(k => Number.isFinite(h[k]) && h[k] >= 0) && h.level >= 1 && h.maxHP >= 1 && h.hp <= h.maxHP && typeof h.tower === 'boolean') hero = h;
  } catch (_) { /* Storage is optional; play still works. */ }
  function startBattle(boss = false) {
    battle = { ...(boss ? RULES.guardian : RULES.enemies[encounter++ % RULES.enemies.length]), boss };
    message = battle.name + ' approaches! Choose a command.';
  }
  function act(command) {
    if (!battle || hero.hp <= 0) return;
    if (command === 'run') {
      if (!battle.boss) { battle = null; message = 'You escaped. Keep exploring.'; return; }
      message = 'The sentinel blocks your escape!';
    } else if (command === 'herb') {
      if (!hero.herbs) { message = 'No herbs left. Choose another command.'; return; }
      hero.herbs--; hero.hp = Math.min(hero.maxHP, hero.hp + RULES.heal);
      message = 'You used an herb.';
    } else {
      const damage = RULES.attack + (hero.level - 1) * 2;
      battle.hp -= damage; message = 'You strike for ' + damage + '.';
      if (battle.hp <= 0) {
        hero.xp += battle.xp; hero.gold += battle.gold;
        if (battle.boss) hero.tower = true;
        message = 'Victory! +' + battle.xp + ' XP, +' + battle.gold + ' gold.';
        while (hero.xp >= hero.level * 10) { hero.level++; hero.maxHP += 6; hero.hp = hero.maxHP; message += ' Level up!'; }
        if (battle.boss) message += ' Return to town!';
        battle = null; return;
      }
    }
    hero.hp = Math.max(0, hero.hp - battle.attack);
    message += ' Enemy deals ' + battle.attack + '.';
    if (!hero.hp) message = 'Defeated. Enter: return to town (lose half your gold).';
  }
  function box(ctx, x, y, w, h) { ctx.fillStyle='#090d21';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#f4f1de';ctx.lineWidth=2;ctx.strokeRect(x+2,y+2,w-4,h-4); }
  function text(ctx, s, x, y, color='#f4f1de') { ctx.fillStyle=color;ctx.font='14px monospace';ctx.fillText(s,x,y); }
  function sprite(ctx,x,y,color) { ctx.fillStyle=color;ctx.fillRect(x+8,y+3,16,9);ctx.fillRect(x+5,y+12,22,12);ctx.fillRect(x+6,y+24,8,6);ctx.fillRect(x+19,y+24,8,6);ctx.fillStyle='#fff';ctx.fillRect(x+10,y+7,3,3);ctx.fillRect(x+20,y+7,3,3); }
  const scene = {
    name:'epochAdventure', x:9,y:9,cooldown:0,
    create() { this.x=9;this.y=9;this.cooldown=0;battle=null;steps=0;message=hero.tower?'Return to the town below to finish.':'Find the tower northeast. E enters town or tower.';gameState.currentScene=this.name; },
    update(dt) {
      if (hero.hp <= 0) { if(input.isPressed('Enter')) {hero.gold=Math.floor(hero.gold/2);hero.hp=hero.maxHP;battle=null;sceneManager.changeScene('home_epoch_teacher');} return; }
      if (battle) { if(input.isPressed('Digit1'))act('attack');else if(input.isPressed('Digit2'))act('herb');else if(input.isPressed('Digit3'))act('run');return; }
      if(input.isPressed('Escape')) {sceneManager.changeScene('home_epoch_teacher');return;}
      if(input.isPressed('KeyR')) { this.create();return; }
      if(input.isPressed('KeyE')) {
        if(Math.abs(this.x-9)+Math.abs(this.y-10)<=1) {
          message=hero.tower?'Quest complete! You reached the tower and returned safely.':'Back in town. Rest at the inn before your next trip.';
          sceneManager.changeScene('home_epoch_teacher');return;
        }
        if(Math.abs(this.x-17)+Math.abs(this.y-2)<=1) {
          if(hero.tower)message='The sentinel is defeated. Return to town.';else startBattle(true);
          return;
        }
      }
      this.cooldown=Math.max(0,this.cooldown-Math.min(dt||16,100));if(this.cooldown)return;
      let dx=0,dy=0;
      if(input.isDown('ArrowUp')||input.isDown('KeyW'))dy=-1;
      else if(input.isDown('ArrowDown')||input.isDown('KeyS'))dy=1;
      else if(input.isDown('ArrowLeft')||input.isDown('KeyA'))dx=-1;
      else if(input.isDown('ArrowRight')||input.isDown('KeyD'))dx=1;
      if(!dx&&!dy)return;
      this.cooldown=145;const x=this.x+dx,y=this.y+dy;
      if(x<1||x>18||y<1||y>10||(x===5&&y>=3&&y<=7))return;
      this.x=x;this.y=y;steps++;
      if(steps>=RULES.encounterSteps) {steps=0;startBattle();}
    },
    draw(ctx) {
      ctx.save();ctx.scale(canvas.width/640,canvas.height/480);ctx.imageSmoothingEnabled=false;
      ctx.fillStyle='#244936';ctx.fillRect(0,0,640,480);
      for(let y=0;y<12;y++)for(let x=0;x<20;x++) {
        ctx.fillStyle=(x===0||x===19||y===0||y===11||(x===5&&y>=3&&y<=7))?'#355c9d':(x+y)%2?'#347344':'#30683d';
        ctx.fillRect(x*32,y*32,32,32);
        if((x*3+y)%7===0&&x>0&&x<19&&y>0&&y<11){ctx.fillStyle='#73a54b';ctx.fillRect(x*32+7,y*32+20,3,5);}
      }
      ctx.fillStyle='#d3b269';ctx.fillRect(9*32,10*32,32,32);text(ctx,'T',9*32+12,10*32+22,'#090d21');
      ctx.fillStyle='#aaa7b8';ctx.fillRect(17*32+4,2*32,24,32);text(ctx,'A',17*32+12,2*32+22,'#090d21');
      sprite(ctx,this.x*32,this.y*32,'#f0cf75');
      box(ctx,4,4,632,30);text(ctx,`EPOCH  LV ${hero.level}  HP ${hero.hp}/${hero.maxHP}  XP ${hero.xp}  GOLD ${hero.gold}  HERBS ${hero.herbs}`,12,25);
      if(battle) {box(ctx,110,60,420,270);text(ctx,battle.name+'  HP '+Math.max(0,battle.hp),145,95);ctx.save();ctx.translate(270,112);ctx.scale(3,3);sprite(ctx,0,0,battle.color);ctx.restore();text(ctx,'1 ATTACK    2 HERB    3 RUN',145,280);}
      box(ctx,4,386,632,90);
      const words=message.split(' ');let line='',row=408;for(const word of words){if((line+word).length>70){text(ctx,line,14,row);row+=19;line='';}line+=word+' ';}text(ctx,line,14,row);
      text(ctx,'WASD/Arrows move | E interact | Esc town | R map restart',14,464,'#a4b6d3');ctx.restore();
    }
  };
  sceneManager.register(scene);
  const home=sceneManager.scenes.home_epoch_teacher;
  const oldInteract=home.handleInteract,oldDraw=home.draw;
  home.handleInteract=function(item) {
    if(item.id&&item.id.endsWith('_gate')) {sceneManager.changeScene('epochAdventure');return;}
    if(item.id==='inn') {if(hero.gold>=RULES.innCost){hero.gold-=RULES.innCost;hero.hp=hero.maxHP;this.lastSaveMessage='Inn: fully healed for '+RULES.innCost+' gold.';}else this.lastSaveMessage='Inn: need '+RULES.innCost+' gold. Use herbs or explore.';this._saveMsgTimer=0;return;}
    if(item.id==='shop') {if(hero.gold>=RULES.herbCost){hero.gold-=RULES.herbCost;hero.herbs++;this.lastSaveMessage='Bought one healing herb.';}else this.lastSaveMessage='Shop: need '+RULES.herbCost+' gold.';this._saveMsgTimer=0;return;}
    if(item.id==='town_save') {this.lastSaveMessage=save()?'RPG stats saved in this browser.':'Saving unavailable; game still playable.';this._saveMsgTimer=0;return;}
    oldInteract.call(this,item);
  };
  home.draw=function(ctx){oldDraw.call(this,ctx);box(ctx,8,8,canvas.width-16,36);text(ctx,`EPOCH | LV ${hero.level} | HP ${hero.hp}/${hero.maxHP} | GOLD ${hero.gold} | HERBS ${hero.herbs}`,18,32);if(hero.tower){box(ctx,8,48,canvas.width-16,36);text(ctx,'QUEST COMPLETE: Tower Sentinel defeated; safely home!',18,72);}};
  // Read-only snapshots support repeatable checks without exposing mutable hero state.
  window.epochRPG={snapshot:()=>({hero:{...hero},battle:battle?{...battle}:null,message,steps}),rules:RULES};
})();
