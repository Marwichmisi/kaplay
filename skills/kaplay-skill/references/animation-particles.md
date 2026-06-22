# Animation and Particles

## Manual Animation

Every animation is just an `onUpdate` handler changing values:

```js
const obj = add([pos(50, 50), sprite("bean")]);
let time = 0;

obj.onUpdate(() => {
    time += dt();
    const t = (time % 5) / 5;
    obj.pos = lerp(vec2(50, 50), vec2(100, 50), t);
});
```

## Tween (timer() component)

Linear interpolation over time. Requires `timer()` component.

```js
const obj = add([pos(50, 50), sprite("bean"), timer()]);

obj.tween(
    vec2(50, 50),           // from
    vec2(100, 50),          // to
    5,                      // duration (seconds)
    (value) => (obj.pos = value), // setter
    easings.easeOutQuad,    // easing function (optional)
);
```

**Important:** Use object-local tween, not global. Global tween on a destroyed object crashes.

## Animate Component

More powerful keyframe-based animation:

```js
const obj = add([pos(50, 50), sprite("bean"), animate()]);

// Simple: animate one property between values
obj.animate("pos", [vec2(50, 50), vec2(100, 50)], { duration: 2 });

// Multiple keyframes
obj.animate("pos", [vec2(50, 50), vec2(100, 50), vec2(100, 150)], {
    duration: 4,
});

// With timing control (percentage of where each keyframe is in time)
obj.animate("pos", [vec2(50, 50), vec2(100, 50), vec2(100, 150)], {
    duration: 3,
    timing: [0, 1/3, 1],
    interpolation: "spline", // "linear", "spline", "none"
    direction: "ping-pong",  // "normal", "reverse", "ping-pong"
    loops: 4,               // infinite if not set
});

// Relative animation (mixes with initial state)
const obj = add([
    sprite("bean"), pos(150, 0), anchor("center"),
    animate({ relative: true }),
]);

// Unanimate to change animation mid-way
obj.unanimate("opacity");
obj.unanimateAll();
obj.animation.seek(0); // reset internal timer
obj.animate("opacity", [1, 0], { duration: 1, loops: 1 });
```

### Animate events
```js
obj.onAnimateChannelFinished(() => {});
obj.onAnimateFinished(() => {});
```

## Sprite Animations

```js
loadSprite("player", "player.png", {
    sliceX: 4, sliceY: 1,
    anims: { run: { from: 0, to: 3 }, jump: { from: 3, to: 3 } },
});

const player = add([sprite("player"), pos(100, 100)]);
player.play("run");
player.stop();

// Animation events
player.onAnimStart("run", () => {});
player.onAnimEnd("run", () => {});
```

## Particles

Efficient visual effects with `particles()` component:

```js
// 1. Load sprite first, then create particles
loadSprite("bean", "./sprites/bean.png");

const emitter = add([
    pos(center()),
    particles(
        {
            // Particle options
            max: 20,                    // max particles at once
            lifeTime: [2, 5],          // lifespan range
            speed: [50, 100],          // speed range
            acceleration: [vec2(0), vec2(0, -10)],
            damping: [0, 0.5],
            angle: [0, 360],
            angularVelocity: [0, 100],
            scales: [1.0, 0.5, 0.0],  // scale over lifetime
            colors: [RED, GREEN, BLUE],// color over lifetime
            opacities: [1.0, 0.0],    // opacity over lifetime
            texture: getSprite("bean").data.tex,   // sprite texture
            quads: getSprite("bean").data.frames,  // sprite frames
        },
        {
            // Emitter options
            shape: new Rect(vec2(0), 32, 32), // emission area
            lifetime: 5,            // emitter lifetime (seconds)
            rate: 5,                // particles per second
            direction: 0,           // direction in degrees
            spread: 45,            // spread in degrees
        },
    ),
]);

// Emit manually
emitter.emit(5);

// Check if emitter finished
emitter.onEnd(() => { destroy(emitter); });
```

### Simple burst example
```js
const emitter = add([
    pos(center()),
    particles({
        max: 100,
        speed: [75, 100],
        lifeTime: [0.75, 1.0],
        angle: [0, 360],
        opacities: [1.0, 0.0],
        texture: getSprite("bean").tex,
        quads: getSprite("bean").frames,
    }, {
        direction: 0,
        spread: 360,
    }),
]);

onUpdate(() => { emitter.emit(1); });
```
