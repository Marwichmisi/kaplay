---
name: kaplay
description: >-
  Create games with the KAPLAY.js game library (v4000). Use this skill whenever the user wants to build a game, prototype a game idea, create game mechanics, set up a KAPLAY project, add physics, handle input, create levels with tilemaps, animate sprites, add particle effects, implement game AI, publish a web game, or needs help with any KAPLAY API. Also trigger when the user mentions kaplay, kaboom, game development, HTML5 games, 2D games, platformers, or browser game creation.
---

# KAPLAY Game Development Skill

This skill helps you create 2D games using **KAPLAY.js v4000** (the successor to Kaboom.js). Use the reference files below based on what part of game development you're working on.

## Quick Start

```js
import kaplay from "kaplay";

kaplay({
    width: 320,
    height: 240,
    background: "#87ceeb",
});
```

See `references/getting-started.md` for installation and setup.

## Reference Files (read only what you need)

| Area | File |
|------|------|
| Installation, setup, basic concepts | `references/getting-started.md` |
| Game objects, components, tags | `references/game-objects.md` |
| Scenes, events, lifecycle | `references/scenes-events.md` |
| Sprites, text, shapes, audio, rendering | `references/rendering.md` |
| Keyboard, mouse, gamepad, buttons API | `references/input.md` |
| Physics, collisions, body, effectors | `references/physics.md` |
| Level/tilemap creation | `references/levels.md` |
| Animation, tween, particles | `references/animation-particles.md` |
| AI, state machines, pathfinding | `references/ai.md` |
| Custom components, plugins, shaders, optimization | `references/advanced.md` |
| UI, pausing, debug mode, publishing | `references/ui-publishing.md` |
| Complete API function reference | `references/api-reference.md` |

## Workflow for Creating a KAPLAY Game

1. **Setup** - Initialize KAPLAY with `kaplay()` and configure options
2. **Load assets** - Load sprites, sounds, fonts with `loadSprite()`, `loadSound()`, etc.
3. **Create scenes** - Define scenes with `scene()` and navigate with `go()`
4. **Build game objects** - Use `add()` with components and tags
5. **Add logic** - Use event handlers like `onUpdate()`, `onKeyPress()`, `onCollide()`
6. **Polish** - Add animations, particles, audio, UI
7. **Publish** - Package for itch.io, Newgrounds, etc.

## Key Patterns

- Components are added as array elements in `add()`: `add([pos(100,100), sprite("bean"), area(), "player"])`
- Tags are just strings in the array that classify objects
- Events can be global (`onKeyPress()`) or scoped to tags (`onUpdate("enemy", ...)`)
- Use `scene()` and `go()` for game flow management
- Object methods: `obj.onUpdate()`, `obj.onCollide()`, etc. are scoped to the object's lifecycle
- Use `kaplay()` (not `kaboom()` - that was the old library name before the fork)
- Set gravity via `kaplay({ gravity: 980 })` option, not `setGravity()` (still works but option is preferred)
- Health API in v4000: use `hp` as a property: `player.hp--`, `player.hp += 1`, not `hurt()`/`heal()` methods

## Using kaplay() options

```js
kaplay({
    width: 320,           // game width
    height: 240,          // game height
    scale: 2,             // pixel scale
    letterbox: true,      // keep aspect ratio
    background: "#000",   // background color
    font: "monospace",    // default font
    crisp: true,          // sharp pixel display
    global: false,        // don't pollute global namespace (use k.xxx)
    debug: true,          // F1 to toggle debug mode
    buttons: {            // input bindings
        jump: { keyboard: ["space", "up"] },
    },
    plugins: [myPlugin],  // load plugins
});
```

## Common Mistakes to Avoid

- Don't use arrow functions in component methods (`this` context is lost)
- Don't try to `push` to `obj.tags` - use `obj.tag()` and `obj.untag()` instead
- Don't use `make()` - it's removed in v4000; use factory functions instead
- Don't forget `area()` component before using collision events
- Don't use global timers for object-specific timing (use `timer()` component + local methods)
- For Itch.io publishing, call `loadRoot(".")` before loading assets
- Component IDs are no longer tags by default in v4000 - use `obj.has()` not `obj.is()` for component checks
- Health API: `player.hp` is a getter/setter property. Use `player.hp--` to hurt, `player.hp += 1` to heal. NOT `player.hurt()` or `player.hp()` (old Kaboom API)
- Gravity: set via `kaplay({ gravity: 980 })` option rather than `setGravity()` (though `setGravity()` still works)
- `kaboom()` is the old name — use `import kaplay from "kaplay"` and call `kaplay()`
- Don't use `joueur.move()` as a no-op — it needs direction and speed arguments
- For tilemap levels, the `addLevel()` map strings should represent the full map including walls — the `tiles` config maps characters to component lists
