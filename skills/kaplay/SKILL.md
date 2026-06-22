---
name: kaplay
description: >-
  Create games with the KAPLAY.js game library (v4000). Use this skill whenever the user wants to build a game, prototype a game idea, create game mechanics, set up a KAPLAY project, add physics, handle input, create levels with tilemaps, animate sprites, add particle effects, implement game AI, publish a web game, or needs help with any KAPLAY API. Also trigger when the user mentions kaplay, kaboom, game development, HTML5 games, 2D games, platformers, or browser game creation.
---

# KAPLAY Game Development Skill

Create 2D games with **KAPLAY.js v4000** (successor to Kaboom.js).

**Critical: API v4000 changes from old Kaboom/KAPLAY v3001:**
- `kaplay({ gravity: 1600 })` — NOT `setGravity()`
- `player.hp--` — NOT `player.hurt()` (removed)
- `import kaplay from "kaplay"` — ES module import
- `kaboom()` is the old name — use `kaplay()`
- `make()` is removed — use factory functions

## Workflow

### Phase 1: Analyse (avant d'écrire du code)

1. **Identifier le Core Mechanic** — Quelle est l'action répétée du joueur ? (sauter, tirer, collecter, éviter)
2. **Définir le Challenge** — Timing ? Précision ? Progression de difficulté ?
3. **Établir la Feedback Loop** — Input → Réponse immédiate → Résultat → Récompense/Pénalité
4. **Définir le Minimum Viable Game** — 1 niveau/mode infini, 1 type d'ennemi, 1 capacité joueur, condition win ET lose
5. **Valider la Physique** — Vérifie que le joueur peut atteindre ce qui est requis (voir physics.md)

### Phase 2: Implémentation

1. **Setup** — `kaplay({ gravity: 1600, width: 800, height: 600 })`
2. **Scenes** — Définir `scene("menu")`, `scene("game")`, `scene("gameover")` avec `go()`
3. **Assets** — Charger sprites (procéduraux ou fichiers), sons, polices
4. **Game Objects** — `add()` avec composants, tags, `area()`, `body()`
5. **Input** — `onKeyPress()`, `onKeyDown()` pour les contrôles
6. **Logique** — `onUpdate()`, `onCollide()`, score, états
7. **Polish** — Animations, particules, UI, juice (shake, flash)
8. **Playtest** — Tester le core loop, valider que tout est atteignable

### Phase 3: Polish Visuel

1. **Palette** — Choisir une palette cohérente (PASTEL, PICO8, ENDESGA, NEON — voir visual-assets.md)
2. **Sprites procéduraux** — Pas de `rect()`/`circle()` nus pour les objets (voir visual-assets.md)
3. **Background** — Fond dégradé, pas de couleur plate
4. **Animations inactives** — Float, breathe, spin sur les objets
5. **Particules** — Burst sur collecte, explosion sur mort, particules ambiantes
6. **Juice** — `shake()`, `flash()`, squash & stretch, floating text
7. **Z-index** — Background:-100, platforms:0, pickups:10, enemies:20, player:30, particles:50, HUD:100

## Reference Files

| Area | File |
|------|------|
| Installation, setup | `references/getting-started.md` |
| Game objects, components, tags | `references/game-objects.md` |
| Scenes, events, lifecycle | `references/scenes-events.md` |
| Sprites, text, shapes, audio, rendering | `references/rendering.md` |
| Input (keyboard, mouse, gamepad) | `references/input.md` |
| Physics, collisions, body, validation | `references/physics.md` |
| Level/tilemap creation | `references/levels.md` |
| Animation, tween, particles | `references/animation-particles.md` |
| AI, state machines, pathfinding | `references/ai.md` |
| Custom components, plugins, shaders | `references/advanced.md` |
| UI, pausing, debug, publishing | `references/ui-publishing.md` |
| **Sprites, palettes, juice, effets** | `references/visual-assets.md` |
| Complete API function reference | `references/api-reference.md` |

## Quick Start

```js
import kaplay from "kaplay";

kaplay({
    width: 800,
    height: 600,
    background: "#87ceeb",
    gravity: 1600,
    crisp: true,
});

scene("game", () => {
    const player = add([
        rect(32, 48), color(255, 0, 0),
        pos(100, 400), area(), body(), anchor("center"),
        "player",
    ]);
    add([rect(width(), 20), pos(0, height()-20), color(0, 200, 0), area(), body({ isStatic: true }), "ground"]);
    onKeyDown("left", () => player.move(-300, 0));
    onKeyDown("right", () => player.move(300, 0));
    onKeyPress("space", () => { if (player.isGrounded()) player.jump(600); });
    player.onUpdate(() => { if (player.pos.y > height() + 50) go("game"); });
});

go("game");
```

## Key Patterns

- Components in `add()`: `add([pos(100,100), sprite("bean"), area(), body(), "player"])`
- Tags = strings in array for grouping: `get("enemy")`, `onCollide("player", "enemy")`
- Events: global `onKeyPress()`, tag-scoped `onUpdate("enemy", ...)`, object-local `obj.onCollide()`
- States: `scene()` + `go()` for menu/game/gameover
- Gravity: `kaplay({ gravity: 1600 })` — NOT `setGravity()`
- Health v4000: `player.hp = 3` puis `player.hp--`, pas `hurt()`/`heal()`
- UI/HUD: `fixed()` + `z(100)` pour ignorer la caméra

## Common Mistakes to Avoid

- Pas de `setGravity()` — utilise `gravity` dans `kaplay({})`
- Pas de `hurt()`/`heal()` — utilise `hp--`/`hp += 1`
- Pas de `kaboom()` — utilise `import kaplay from "kaplay"` et `kaplay()`
- Pas de `make()` — utilise des factory functions
- Pas de `joueur.move()` sans arguments — fournis direction et vitesse
- Pas d'arrow functions dans les méthodes de composants (`this` perdu)
- Pas de `obj.tags.push()` — utilise `obj.tag()` et `obj.untag()`
- Pas d'oublier `area()` avant les collisions
- `lifespan()` nécessite `opacity()` pour le fade
- Les crochets `[1]` dans `text()` déclenchent le styled text parser
- `String.repeat()` avec valeur négative crashe — utilise `Math.max(0, n)`
- Ne pas appeler `rgb` comme nom de variable — ça shadow la fonction KAPLAY
- Pour Itch.io: `loadRoot(".")` avant les assets
