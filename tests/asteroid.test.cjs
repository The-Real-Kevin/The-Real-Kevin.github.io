const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

const html = fs.readFileSync('asteroid.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function game() {
  const buttons = ['left', 'right', 'thrust', 'fire'].map(control => ({
    dataset: { control },
    handlers: {},
    attrs: {},
    classList: { toggle() {} },
    addEventListener(name, handler) { this.handlers[name] = handler; },
    setAttribute(name, value) { this.attrs[name] = value; },
    setPointerCapture() {},
  }));
  const canvas = {
    width: 1080, height: 648, parentElement: { clientWidth: 1000 },
    getContext: () => new Proxy({}, { get: () => () => {} }),
  };
  const documentHandlers = {};
  const windowHandlers = {};
  const score = { textContent: '0' };
  const context = vm.createContext({
    document: {
      getElementById: id => id === 'gameCanvas' ? canvas : score,
      querySelector: () => ({ textContent: 'Score:' }),
      querySelectorAll: () => buttons,
      addEventListener: (name, handler) => { documentHandlers[name] = handler; },
    },
    window: { addEventListener: (name, handler) => { windowHandlers[name] = handler; } },
    setInterval() {},
  });
  vm.runInContext(script, context);
  const run = source => vm.runInContext(source, context);
  const pointer = (control, type, pointerId) =>
    buttons.find(button => button.dataset.control === control).handlers[type]({
      pointerId, preventDefault() {},
    });
  const key = (type, value) => documentHandlers[type]({
    key: value, repeat: false, target: { closest: () => false }, preventDefault() {},
  });
  return { run, canvas, buttons, pointer, key, windowHandlers };
}

test('standalone header has only its title; touch buttons are present', () => {
  const header = html.match(/<header>([\s\S]*?)<\/header>/)[1];
  assert(!/<nav|<a\b/.test(header));
  assert(header.includes('ast_h1'));
  assert.equal((html.match(/data-control="/g) || []).length, 4);
  for (const page of ['index', 'resume', 'blog', 'projects', 'showcase']) {
    assert(!fs.readFileSync(page + '.html', 'utf8').includes('href="asteroid.html"'));
  }
});

test('collision resets ship to center with zero velocity and a protection period', () => {
  const g = game();
  g.run(`ship.x=135; ship.y=90; ship.thrust.x=3; ship.thrust.y=-2;
    score=42; invulnerableFrames=0;
    asteroids=[{x:138,y:88,xv:0,yv:0,radius:50}];
    bullets=[{x:10,y:10,xv:0,yv:0,life:10}]; update();`);
  assert.equal(g.run('ship.x'), g.canvas.width / 2);
  assert.equal(g.run('ship.y'), g.canvas.height / 2);
  assert.equal(g.run('ship.thrust.x'), 0);
  assert.equal(g.run('ship.thrust.y'), 0);
  assert.equal(g.run('score'), 0);
  assert.equal(g.run('bullets.length'), 0);
  assert.equal(g.run('asteroids.length'), 5);
  assert.equal(g.run('invulnerableFrames'), 120);
});

test('ship keeps over 90% of its velocity after a second without thrust', () => {
  const g = game();
  g.run('asteroids=[]; ship.thrust.x=4; ship.thrust.y=0; for(let i=0;i<60;i++) update();');
  assert(g.run('ship.thrust.x') > 3.6);
  assert(g.run('ship.thrust.x') < 4);
});

test('touch can steer, thrust and repeatedly fire at the same time', () => {
  const g = game();
  g.run('asteroids=[];');
  g.pointer('left', 'pointerdown', 1);
  g.pointer('thrust', 'pointerdown', 2);
  g.pointer('fire', 'pointerdown', 3);
  assert(g.run('ship.rotation') > 0);
  assert.equal(g.run('ship.thrusting'), true);
  g.run('for(let i=0;i<16;i++) update();');
  assert(g.run('bullets.length') >= 3);
  assert(g.run('Math.hypot(ship.thrust.x,ship.thrust.y)') > 0);
  g.pointer('left', 'pointerup', 1);
  assert.equal(g.run('ship.rotation'), 0);
  assert.equal(g.run('ship.thrusting'), true);
  g.pointer('thrust', 'pointercancel', 2);
  assert.equal(g.run('ship.thrusting'), false);
  g.windowHandlers.blur();
  assert.equal(g.run('controlHeld("fire")'), false);
  assert(g.buttons.every(button => button.attrs['aria-pressed'] === 'false'));
});

test('keyboard combinations and release do not leave steering stuck', () => {
  const g = game();
  g.key('keydown', 'a');
  g.key('keydown', 'd');
  assert.equal(g.run('ship.rotation'), 0);
  g.key('keyup', 'd');
  assert(g.run('ship.rotation') > 0);
  g.key('keydown', 'ArrowUp');
  assert.equal(g.run('ship.thrusting'), true);
  g.windowHandlers.blur();
  assert.equal(g.run('ship.rotation'), 0);
  assert.equal(g.run('ship.thrusting'), false);
});

test('mobile resizing keeps the ship in proportion and uses a taller play area', () => {
  const g = game();
  g.run('ship.x=canvas.width/2; ship.y=canvas.height/2;');
  g.canvas.parentElement.clientWidth = 350;
  g.run('resizeGame();');
  assert.equal(g.canvas.width, 350);
  assert.equal(g.canvas.height, 378);
  assert.equal(g.run('ship.x'), 175);
  assert.equal(g.run('ship.y'), 189);
});

test('high thrust speed is capped and protection prevents immediate repeat deaths', () => {
  const g = game();
  g.run('ship.thrust.x=100; asteroids=[]; update();');
  assert(g.run('Math.hypot(ship.thrust.x,ship.thrust.y)') <= 8.001);
  g.run(`respawnShip(); score=7;
    asteroids=[{x:ship.x,y:ship.y,xv:0,yv:0,radius:50,vertices:0,offsets:[]}]; update();`);
  assert.equal(g.run('score'), 7);
});
