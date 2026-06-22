# KAPLAY Game Development Skill

Crée des jeux 2D avec **KAPLAY.js v4000** (successeur de Kaboom.js).

API v4000 à jour : `kaplay({ gravity: 1600 })`, `player.hp--`, `import kaplay from "kaplay"`.

## Installation

```bash
npx skills add Marwichmisi/kaplay --skill kaplay
```

## Utilisation

### Démarrer un projet

```bash
bash scripts/setup.sh
```

Installe KAPLAY, Vite et Puppeteer, puis copie le template de base.

### Playtesting automatisé

```bash
node scripts/playtest.js
```

Lance le jeu en headless, simule des entrées, capture des screenshots et détecte les erreurs. Voir `playtest-screenshots/`.

## Contenu du skill

| Catégorie | Fichiers |
|-----------|----------|
| **Core API** | `SKILL.md` + `references/api-reference.md`, `references/getting-started.md` |
| **Game objects** | `references/game-objects.md` |
| **Scènes & événements** | `references/scenes-events.md` |
| **Rendu (sprites, text, shapes)** | `references/rendering.md` |
| **Input** | `references/input.md` |
| **Physique & collisions** | `references/physics.md` — inclut formules de validation |
| **Niveaux / tilemaps** | `references/levels.md` |
| **Animation & particules** | `references/animation-particles.md` |
| **IA, state machines** | `references/ai.md` |
| **Composants custom / plugins** | `references/advanced.md` |
| **UI, debug, publishing** | `references/ui-publishing.md` |
| **Sprites procéduraux, palettes, juice** | `references/visual-assets.md` |
| **Playtesting automatisé** | `scripts/playtest.js` + `scripts/setup.sh` |
| **Template de base** | `templates/basic-game.html` |
| **Évaluations benchmarkées** | `evals/evals.json` |

## Points clés API v4000

- `kaplay({ gravity: 1600 })` — pas `setGravity()`
- `player.hp--` — pas `player.hurt()` (supprimé)
- `import kaplay from "kaplay"` — pas `kaboom()`
- `player.onCollide(tag, fn)` — collisions avec tags
- `addLevel()` — niveaux en mode texte
- `onKeyPress()`, `onKeyDown()` — entrées clavier

## Structure

```
skills/
└── kaplay/
    ├── SKILL.md
    ├── references/
    │   ├── api-reference.md
    │   ├── getting-started.md
    │   ├── physics.md
    │   ├── rendering.md
    │   ├── input.md
    │   ├── levels.md
    │   ├── scenes-events.md
    │   ├── game-objects.md
    │   ├── animation-particles.md
    │   ├── advanced.md
    │   ├── ai.md
    │   ├── ui-publishing.md
    │   └── visual-assets.md
    ├── scripts/
    │   ├── playtest.js   (playtesting headless)
    │   └── setup.sh      (bootstrap projet)
    ├── templates/
    │   └── basic-game.html
    └── evals/
        └── evals.json
```
