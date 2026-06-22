# KAPLAY API Reference

## Initialization

| Function | Description |
|----------|-------------|
| `kaplay(opt?)` | Initialize KAPLAY context. Returns `KAPLAYCtx`. |
| `KAPLAYOpt` | Configuration: `width`, `height`, `scale`, `letterbox`, `debug`, `font`, `crisp`, `canvas`, `background`, `buttons`, `global`, `plugins`, `burp` |

## Asset Loading

| Function | Description |
|----------|-------------|
| `loadRoot(path?)` | Set base path for all asset URLs |
| `loadSprite(name, src, opt?)` | Load sprite image |
| `loadSpriteAtlas(src, data, repack?)` | Load sprites from atlas |
| `loadSound(name, src)` | Load audio (mp3, ogg, wav) |
| `loadMusic(name, src)` | Load music |
| `loadFont(name, src, opt?)` | Load font (ttf, otf, woff) |
| `loadBitmapFont(name, src, gw, gh)` | Load bitmap font from image |
| `loadShader(id, vert, frag)` | Load shader from strings |
| `loadShaderURL(id, vertURL, fragURL)` | Load shader from files |
| `loadPrefab(name, url)` | Load prefab from file |
| `loadBean(name?)` | Load default "bean" sprite |
| `loadHappy(name?)` | Load default "happy" font |
| `loadJSON(name, url)` | Load JSON data |
| `loadProgress()` | Get asset loading progress |
| `getSprite(name)` | Get loaded sprite data |
| `getSound(name)` | Get loaded sound data |
| `getFont(name)` | Get loaded font data |

## Game Objects

| Function | Description |
|----------|-------------|
| `add(compList)` | Create and add game object to scene |
| `addPrefab(name, comps?)` | Add prefab instance |
| `createPrefab(name?, obj)` | Serialize object into prefab |
| `destroy(obj)` | Remove and destroy game object |
| `destroyAll(tag?)` | Destroy all objects (with optional tag) |
| `get(tag, opt?)` | Get all objects with tag |
| `query(opt)` | Query objects by predicate |
| `exists(tag)` | Check if any object has tag |
| `readd(obj)` | Re-add object (bring to front) |
| `getTreeRoot()` | Get root game object (read-only) |
| `addLevel(map, opt)` | Create tilemap level |
| `addKaboom(pos, opt?)` | Kaboom explosion effect |

### GameObj Properties

| Property | Description |
|----------|-------------|
| `obj.id` | Unique numeric ID |
| `obj.tags` | Read-only array of tags |
| `obj.paused` | Get/set pause state |
| `obj.hidden` | Get/set visibility |

### GameObj Methods

| Method | Description |
|--------|-------------|
| `obj.add(comps)` | Add child game object |
| `obj.remove(child)` | Remove child |
| `obj.get(tag, opt?)` | Get children with tag |
| `obj.use(comp)` | Add component |
| `obj.unuse(compId)` | Remove component |
| `obj.has(compId)` | Check if has component |
| `obj.is(tag)` | Check if has tag |
| `obj.tag(tag)` | Add tag(s) |
| `obj.untag(tag)` | Remove tag |
| `obj.destroy()` | Destroy self |
| `obj.trigger(event, ...args)` | Trigger custom event |
| `obj.on(event, action)` | Listen for custom event |

## Events

| Function | Description |
|----------|-------------|
| `onUpdate(tag?, action)` | Every frame (~60fps) |
| `onDraw(tag?, action)` | Every frame after update |
| `onAdd(tag?, action)` | When object is added |
| `onDestroy(tag?, action)` | When object is destroyed |
| `onLoad(action)` | When assets finish loading |
| `on(event, tag?, action)` | Generic event listener |
| `onKeyPress(key?, action)` | Key pressed |
| `onKeyDown(key?, action)` | Key held |
| `onKeyRelease(key?, action)` | Key released |
| `onMousePress(btn?, action)` | Mouse clicked |
| `onMouseDown(btn?, action)` | Mouse held |
| `onMouseRelease(btn?, action)` | Mouse released |
| `onMouseMove(action)` | Mouse moved |
| `onClick(tag?, action)` | Object clicked |
| `onHover(tag?, action)` | Mouse hovers object |
| `onCollide(t1, t2?, action)` | Two objects collide |
| `onCollideUpdate(t1, t2?, action)` | Objects colliding |
| `onCollideEnd(t1, t2?, action)` | Objects stop colliding |
| `onTouchStart(action)` | Touch starts |
| `onTouchMove(action)` | Touch moves |
| `onTouchEnd(action)` | Touch ends |
| `onScroll(action)` | Scroll event |
| `onCharInput(action)` | Character typed |
| `onResize(action)` | Window resized |
| `onHide(action)` / `onShow(action)` | Tab visibility |
| `onGamepadButtonPress(btn?, action)` | Gamepad button |
| `onGamepadStick(stick?, action)` | Gamepad stick |
| `onGamepadConnect/Disconnect(action)` | Gamepad connect |
| `onButtonPress/Btn/Release(btn, action)` | Button binding |

## Components (Transform)

| Component | Description |
|-----------|-------------|
| `pos(x, y)` | Position (relative to parent) |
| `scale(x, y?)` | Scale factor |
| `rotate(deg)` | Rotation in degrees |
| `skew(x, y)` | Skew transform |
| `z(val)` | Draw order (higher = on top) |
| `layer(name)` | Layer grouping |
| `anchor(o)` | Anchor point ("topleft", "center", etc.) |

## Components (Rendering)

| Component | Description |
|-----------|-------------|
| `sprite(name, opt?)` | Render a sprite |
| `text(txt, opt?)` | Render text |
| `rect(w, h, opt?)` | Render rectangle |
| `circle(radius, opt?)` | Render circle |
| `ellipse(rx, ry, opt?)` | Render ellipse |
| `polygon(pts, opt?)` | Render polygon |
| `uvquad(w, h)` | Render a textured quad |
| `color(r, g, b)` | Set color |
| `opacity(val)` | Set opacity (0-1) |
| `outline(w, color?)` | Draw outline |
| `fill(color?)` | Fill shape |
| `blend(mode)` | Blend mode |
| `shader(id, uniform?)` | Apply shader |
| `particles(popt, eopt)` | Particle emitter |
| `video(src)` | Play video |
| `picture()` | Picture rendering |
| `fixed(bool?)` | Ignore camera, render last |
| `mask()` | Masking mode |

## Components (Physics)

| Component | Description |
|-----------|-------------|
| `area(opt?)` | Collision shape and detection |
| `body(opt?)` | Gravity-affected physics body |
| `doubleJump(n?)` | Double (or multi) jump |
| `move(dir, speed)` | Move in direction, destroy offscreen |
| `platformEffector(opt?)` | One-way platform |
| `surfaceEffector(opt?)` | Conveyor belt |
| `areaEffector(opt?)` | Directional force zone |
| `pointEffector(opt?)` | Point force (attract/repel) |
| `buoyancyEffector(opt?)` | Fluid buoyancy |
| `constantForce(opt?)` | Constant acceleration |

## Components (Behavior)

| Component | Description |
|-----------|-------------|
| `health(hp, max?)` | Health system |
| `lifespan(time)` | Auto-destroy after time |
| `timer()` | Enable wait(), loop(), tween() |
| `state(initial, list)` | Finite state machine |
| `animate(opt?)` | Keyframe animation system |
| `offscreen(opt?)` | Control behavior off-screen |
| `follow(target, offset?)` | Follow another object |
| `stay()` | Survive scene changes |
| `named(name)` | Give object a name |
| `fadeIn(time)` | Fade in on creation |
| `textInput(opt?)` | Text input handler |

## Components (Level)

| Component | Description |
|-----------|-------------|
| `level(map, opt?)` | Tilemap level component |
| `tile(opt?)` | Tile properties (obstacle, cost) |
| `agent(opt?)` | Pathfinding agent |
| `patrol(opt?)` | Follow waypoints |
| `sentry(candidates, opt?)` | Detect objects in view |
| `pathfinder(opt?)` | Navigation component |

## Components (Special)

| Component | Description |
|-----------|-------------|
| `fakeMouse(opt?)` | Virtual mouse cursor |
| `drawon(canvas)` | Draw children into canvas |

## Audio

| Function | Description |
|----------|-------------|
| `play(src, opt?)` | Play audio, returns AudioPlay handle |
| `burp()` | Play burp sound |
| `volume()` | Global volume |
| `cameraPos()` / `cameraScale()` | Camera controls |

## Math / Utilities

| Function | Description |
|----------|-------------|
| `vec2(x, y)` | Create 2D vector |
| `lerp(from, to, t)` | Linear interpolation |
| `rand(min, max)` | Random number |
| `randInt(min, max)` | Random integer |
| `randSeed(seed)` | Seeded random |
| `clamp(val, min, max)` | Clamp value |
| `map(val, oldMin, oldMax, newMin, newMax)` | Remap range |
| `dt()` | Delta time (seconds since last frame) |
| `time()` | Total elapsed time |
| `width()` / `height()` | Game dimensions |
| `center()` | Center position |
| `mousePos()` | Mouse position |
| `mouseWorldPos()` | Mouse world position |
| `screenToWorld(p)` / `worldToScreen(p)` | Coordinate conversion |
| `shake(intensity?)` | Screen shake |
| `flash(color?, duration?)` | Screen flash |

## Debug

| Function | Description |
|----------|-------------|
| `debug.log(msg)` | Log to game screen |
| `debug.inspect` | Toggle inspect mode |
| `debug.frame` | Current frame number |
| `debug.time` | Current time scale |
| `debug.showLog` | Show/hide log |
| `debug.paused` | Pause all |
