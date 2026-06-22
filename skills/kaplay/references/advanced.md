# Advanced Features

## Custom Components

Components are just functions returning an object with special fields:

```js
function myComp(data) {
    let internal = data;
    return {
        id: "mycomp",
        require: ["area", "pos"], // required comps
        add() { /* runs when added to scene */ },
        update() { this.move(200, 0); /* every frame */ },
        draw() { drawLine(this.pos, mousePos()); /* after update */ },
        destroy() { /* cleanup */ },
        inspect() { return "state for debug inspect"; },
    };
}
```

**No arrow functions** in component methods - `this` will be undefined.

### TypeScript Custom Components

```ts
import type { Comp, GameObj } from "kaplay";

interface MyCustomComp extends Comp {
    myCustomProp: number;
    myCustomMethod: (arg: string) => void;
}

function myCustomComp(): MyCustomComp {
    return {
        id: "myCustomComp",
        myCustomProp: 123,
        myCustomMethod(this: GameObj<MyCustomComp>, arg: string) {
            console.log(arg);
        },
    };
}
```

## Plugins

Extend KAPLAY with new functionality:

```js
// Define plugin
function myPlugin(k) {
    return {
        hi() { k.debug.log("Hi from myPlugin!"); },
    };
}

// Use plugin
const k = kaplay({ plugins: [myPlugin] });
k.hi();
```

Templates: `kaplay-plugin-template` and `kaplay-plugin-template-ts` on GitHub.

Community plugins:
- [kaplanck](https://kesuave.github.io/KaPlanck/) - Planck.js physics
- [kaplay-rapier-physics](https://www.npmjs.com/package/kaplay-physics-rapier) - Rapier physics

## Shaders

### Writing Shaders (GLSL)

Vertex shader (position manipulation):
```glsl
vec4 vert(vec2 pos, vec2 uv, vec4 color) {
    return def_vert(); // default: no change
}
```

Fragment shader (color manipulation):
```glsl
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    return def_frag(); // default: mix color + texture
}
```

### Loading and Using Shaders

```js
loadShader("invert", null, `
    uniform float u_time;
    vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
        vec4 c = def_frag();
        float t = (sin(u_time * 4.0) + 1.0) / 2.0;
        return mix(c, vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a), t);
    }
`);

// Use on object
add([sprite("bean"), pos(80, 40), scale(8),
    shader("invert", () => ({ u_time: time() })),
]);

// Use in draw API
drawSprite({
    sprite: "bean", pos: vec2(100, 200),
    shader: "invert", uniforms: { u_time: time() },
});

// Fullscreen post-processing
usePostEffect("invert", () => ({ u_time: time() }));
```

**Important:** Shaders require **premultiplied alpha**:
```glsl
// GOOD
vec4(0, 1.0 * u_alpha, 0, u_alpha);
// BAD
vec4(0, 1.0, 0, u_alpha);
```

## Canvas (Framebuffer)

Used for procedural sprites and multi-pass shaders:

```js
const canvas = makeCanvas(320, 200);

// Draw into canvas
canvas.draw(() => {
    drawSprite({ sprite: "bean" });
});

// Or bind/unbind manually
canvas.bind();
drawSprite({ sprite: "bean" });
canvas.unbind();

// Draw canvas to screen
drawCanvas({ canvas: canvas });

// Save canvas as sprite
const dataURL = canvas.toDataURL();
loadSprite("procedural", dataURL);

// Free when done
canvas.free();

// Component: auto-draw children into canvas
add([sprite("bean"), drawon(canvas)]);
```

## Picture API

Optimization: record drawing commands and replay them:

```js
onLoad(() => {
    beginPicture(new Picture());
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            drawSprite({ pos: vec2(64 + i*32, 64 + j*32), sprite: "bean" });
        }
    }
    const picture = endPicture();

    onDraw(() => {
        drawPicture(picture, { pos: vec2(400, 0), angle: 45, scale: vec2(0.5) });
    });
});

// Append more to picture
appendToPicture(picture);
// ... draw more ...
endPicture();

// Free buffers
picture.free();
```

## Video

```js
const intro = add([pos(200, 100), video("intro.mp4")]);
intro.play();
intro.pause();
intro.currentTime; // get/set play position
intro.duration; // total duration
```

## Optimization Tips

1. **Collision algorithm**: `kaplay({ broadPhaseCollisionAlgorithm: "quadtree" })` for cluttered objects, `"sap"` for side-scrollers
2. **Use onDraw instead of game objects** for static elements:
   ```js
   onDraw(() => {
       drawSprite({ sprite: "bean", pos: vec2(100, 200) });
   });
   ```
3. **offscreen()** to destroy/hide off-screen objects:
   ```js
   add([sprite("bullet"), move(LEFT, 600),
       offscreen({ destroy: true })]);
   add([sprite("flower"), pos(rand(-5000, 5000), rand(-5000, 5000)),
       offscreen({ hide: true, pause: true })]);
   ```
4. **Use local timers** (timer() component) instead of global:
   ```js
   const player = add([sprite("bean"), timer()]);
   player.wait(2, () => {});
   await player.tween(from, to, 0.5, setter, easing);
   ```
5. **Use local input handlers** scoped to objects/groups:
   ```js
   const gameScene = add([]);
   gameScene.onKeyPress("space", () => { player.jump(); });
   gameScene.paused = true; // pauses all input for this group
   ```
6. **Avoid global namespace**: `kaplay({ global: false })` and use `k.xxx` instead
7. **Compress assets**: `.ttf` → `.woff2`, `.wav` → `.ogg`/`.mp3`
8. **Prefabs**: serialize/deserialize objects for level design

## Prefabs

```js
// Create prefab from existing object
const enemyPrefab = createPrefab("enemy", enemy);
// Or register with name
createPrefab("hexagon", obj);

// Load from file
loadPrefab("hexagon");

// Instantiate
addPrefab("enemy", [pos(200, 200), color(BLUE)]); // override components

// Serialize custom components
serialize() { return { pos: this.pos.serialize() }; }
registerFactory("pos", data => pos(data.pos));
```

## v3001 to v4000 Migration Notes

- **`make()` removed** - Use factory functions instead
- **`loadPedit()` removed** - Use regular images
- **Component IDs no longer tags** - Use `obj.has()` not `obj.is()` for components
- **Global z-index sorting** - Children can sort above parents
- **GJK default collision** - More versatile than SAT
- **Health API changed** - `obj.hp++`/`obj.hp--` instead of `obj.heal()`/`obj.hurt()`
