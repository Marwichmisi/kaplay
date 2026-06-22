# Visual Assets, Palettes, Particles, and Game Juice

Procedural sprites, color palettes, idle animations, particle effects, and screen juice — all runtime, no external files.

## Color Palettes

Use these curated palettes instead of random colors.

```js
const PICO8 = {
    black: "#000000", darkBlue: "#1D2B53", darkPurple: "#7E2553",
    darkGreen: "#008751", brown: "#AB5236", darkGray: "#5F574F",
    gray: "#C2C3C7", white: "#FFF1E8", red: "#FF004D",
    orange: "#FFA300", yellow: "#FFEC27", green: "#00E436",
    blue: "#29ADFF", lavender: "#83769C", pink: "#FF77A8", peach: "#FFCCAA",
};

const ENDESGA = {
    void: "#0d2b45", night: "#203c56", shadow: "#544e68", ash: "#8d697a",
    skin: "#d08159", sunset: "#ffaa5e", sunlight: "#ffd4a3", white: "#ffecd6",
    sky: "#4b80ca", water: "#68c2d3", mint: "#a2dcc7", grass: "#ede19e",
    moss: "#6e9437", forest: "#45612b", blood: "#ba3e3b", rust: "#8a503e",
};

const PASTEL = {
    bg: "#2d2d44", bgLight: "#3d3d5c", player: "#7ec8e3", playerDark: "#5ba3c0",
    coin: "#ffd93d", coinDark: "#c9a227", danger: "#ff6b6b", dangerDark: "#c94444",
    safe: "#6bcb77", safeDark: "#4a9e54", platform: "#6c7a89", platformDark: "#4a5568",
    accent: "#c9b1ff", text: "#e8e8e8", textDim: "#9090a0",
};

const NEON = {
    bg: "#0f0f23", bgGlow: "#1a1a3e", cyan: "#00fff5", cyanDark: "#00b8b0",
    magenta: "#ff00ff", magentaDark: "#b000b0", yellow: "#ffff00",
    pink: "#ff71ce", blue: "#01cdfe", green: "#05ffa1", orange: "#ff9f1c",
    white: "#ffffff", gray: "#464666",
};
```

```js
const P = PASTEL;
const bgColor = color(P.bg); // use with color() component
```

## Procedural Sprites

Generate sprites at runtime via Canvas 2D and `loadSprite()` from a data URL.

### Helper: hex to RGB for Canvas

```js
function hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}
```

### Player Sprite

```js
function makePlayerSprite(size = 32, palette = PASTEL) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const cx = size / 2, cy = size / 2, r = size * 0.4;
    const [pr, pg, pb] = hexToRGB(palette.player);
    const [dr, dg, db] = hexToRGB(palette.playerDark);
    const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
    grad.addColorStop(0, palette.player);
    grad.addColorStop(1, palette.playerDark);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.9, r * 0.8, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.3, cy - r * 0.1, r * 0.2, r * 0.25, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + r * 0.3, cy - r * 0.1, r * 0.2, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(cx - r * 0.25, cy - r * 0.05, r * 0.1, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.35, cy - r * 0.05, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.3, cy - r * 0.4, r * 0.15, r * 0.1, -0.5, 0, Math.PI * 2);
    ctx.fill();
    return c.toDataURL();
}

loadSprite("player", makePlayerSprite(48, PASTEL));
```

### Coin Sprite

```js
function makeCoinSprite(size = 24, palette = PASTEL) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const cx = size / 2, cy = size / 2, r = size * 0.4;
    const glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.2);
    glow.addColorStop(0, palette.coin + "60");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);
    const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    grad.addColorStop(0, palette.coin);
    grad.addColorStop(0.5, "#fff8dc");
    grad.addColorStop(1, palette.coinDark);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.coinDark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    const sr = r * 0.25;
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI / 2) - Math.PI / 4;
        ctx.lineTo(cx + Math.cos(angle) * sr, cy + Math.sin(angle) * sr);
        ctx.lineTo(cx + Math.cos(angle + Math.PI / 4) * sr * 0.4, cy + Math.sin(angle + Math.PI / 4) * sr * 0.4);
    }
    ctx.closePath();
    ctx.fill();
    return c.toDataURL();
}

loadSprite("coin", makeCoinSprite(32, PASTEL));
```

### Spike Sprite

```js
function makeSpikeSprite(size = 32, palette = PASTEL) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const cx = size / 2, h = size * 0.85, w = size * 0.8;
    const glow = ctx.createRadialGradient(cx, size * 0.7, 0, cx, size * 0.7, w * 0.6);
    glow.addColorStop(0, palette.danger + "40");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);
    const grad = ctx.createLinearGradient(cx, size * 0.1, cx, size * 0.9);
    grad.addColorStop(0, "#fff");
    grad.addColorStop(0.2, palette.danger);
    grad.addColorStop(1, palette.dangerDark);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx, size * 0.1);
    ctx.lineTo(cx + w / 2, size * 0.9);
    ctx.lineTo(cx - w / 2, size * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, size * 0.1);
    ctx.lineTo(cx - w / 2 + 2, size * 0.85);
    ctx.stroke();
    return c.toDataURL();
}

loadSprite("spike", makeSpikeSprite(32, PASTEL));
```

### Platform Sprite

```js
function makePlatformSprite(w = 128, h = 24, palette = PASTEL) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, palette.platform);
    grad.addColorStop(1, palette.platformDark);
    const r = Math.min(6, h / 3);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, r);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(r, 2, w - r * 2, 3);
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    for (let x = 16; x < w - 8; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 6);
        ctx.lineTo(x, h - 4);
        ctx.stroke();
    }
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(r, h - 4, w - r * 2, 2);
    return c.toDataURL();
}

loadSprite("platform", makePlatformSprite(140, 24, PASTEL));
```

### Enemy Sprite

```js
function makeEnemySprite(size = 40, palette = PASTEL) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const cx = size / 2, cy = size / 2, r = size * 0.38;
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.85, r * 0.9, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r * 1.2);
    grad.addColorStop(0, palette.danger);
    grad.addColorStop(1, palette.dangerDark);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.35, cy - r * 0.15, r * 0.22, r * 0.18, -0.2, 0, Math.PI * 2);
    ctx.ellipse(cx + r * 0.35, cy - r * 0.15, r * 0.22, r * 0.18, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.dangerDark;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.55, cy - r * 0.4);
    ctx.lineTo(cx - r * 0.15, cy - r * 0.25);
    ctx.moveTo(cx + r * 0.55, cy - r * 0.4);
    ctx.lineTo(cx + r * 0.15, cy - r * 0.25);
    ctx.stroke();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.1, r * 0.1, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.4, cy - r * 0.1, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
    return c.toDataURL();
}

loadSprite("enemy", makeEnemySprite(48, PASTEL));
```

### Gradient Background

```js
function makeGradientBg(colorTop, colorBottom, w = 800, h = 600) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, colorTop);
    grad.addColorStop(1, colorBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * w, y = Math.random() * h * 0.7, r = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    return c.toDataURL();
}

loadSprite("bg", makeGradientBg("#1a1a3e", "#0d0d1a"));
add([sprite("bg"), pos(0, 0), z(-100)]);
```

## Idle Animations

Keep objects alive with micro-animations.

```js
function addFloat(obj, amplitude = 3, speed = 2) {
    const startY = obj.pos.y;
    obj.onUpdate(() => {
        obj.pos.y = startY + Math.sin(time() * speed) * amplitude;
    });
}

function addBreathing(obj, range = 0.05, speed = 1.5) {
    obj.onUpdate(() => {
        const pulse = 1 + Math.sin(time() * speed) * range;
        obj.scale = vec2(pulse, pulse);
    });
}

function addSpin(obj, speed = 90) {
    obj.onUpdate(() => { obj.angle += speed * dt(); });
}

function addGlowPulse(obj, minOpacity = 0.3, maxOpacity = 0.7, speed = 2) {
    obj.onUpdate(() => {
        const t = (Math.sin(time() * speed) + 1) / 2;
        obj.opacity = lerp(minOpacity, maxOpacity, t);
    });
}
```

## Particle Effects

### Burst on collect

```js
function burstParticles(posVec, col, count = 8) {
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        add([
            circle(rand(3, 6)), pos(posVec),
            color(col.r, col.g, col.b), opacity(1),
            move(angle * (180 / Math.PI), rand(100, 200)),
            lifespan(0.4, { fade: 0.3 }), z(50),
        ]);
    }
}
```

### Death explosion

```js
function deathExplosion(posVec, col) {
    shake(12);
    flash(Color.fromArray([col.r, col.g, col.b]), 0.15);
    for (let i = 0; i < 15; i++) {
        add([
            circle(rand(4, 10)), pos(posVec),
            color(col.r, col.g, col.b), opacity(1),
            move(rand(0, 360), rand(80, 250)),
            lifespan(rand(0.3, 0.6), { fade: 0.2 }),
            scale(rand(0.8, 1.2)), z(50),
        ]);
    }
}
```

### Ambient particles

```js
function spawnAmbientParticle() {
    add([
        circle(rand(1, 3)),
        pos(rand(0, width()), height() + 10),
        color(255, 255, 255), opacity(rand(0.1, 0.3)),
        move(rand(80, 100), rand(20, 50)),
        lifespan(rand(4, 8), { fade: 2 }), z(-50),
    ]);
}

loop(0.3, spawnAmbientParticle);
```

### Trail effect

```js
function addTrail(obj, trailColor, interval = 0.05) {
    let lastPos = obj.pos.clone();
    loop(interval, () => {
        if (obj.pos.dist(lastPos) > 5) {
            add([
                circle(4), pos(obj.pos),
                color(trailColor.r, trailColor.g, trailColor.b),
                opacity(0.5), lifespan(0.3, { fade: 0.2 }), z(obj.z - 1),
            ]);
            lastPos = obj.pos.clone();
        }
    });
}
```

## Game Juice (Screen Effects)

### Floating score text

```js
function floatingText(position, txt, col) {
    const ft = add([
        text(txt, { size: 18 }), pos(position.x, position.y - 10),
        anchor("center"), color(col.r, col.g, col.b), opacity(1), z(60),
    ]);
    ft.onUpdate(() => {
        ft.pos.y -= 60 * dt();
        ft.opacity -= 1.5 * dt();
        if (ft.opacity <= 0) destroy(ft);
    });
}
```

### Squash & stretch

```js
function addSquashStretch(obj) {
    let active = false, t = 0, type = "squash";
    obj.onUpdate(() => {
        if (active) {
            t += dt() * 8;
            if (t < 1) {
                const dir = obj.scale.x > 0 ? 1 : -1;
                if (type === "squash") {
                    obj.scale.x = dir * (1 + 0.2 * Math.sin(t * Math.PI));
                    obj.scale.y = 1 - 0.15 * Math.sin(t * Math.PI);
                } else {
                    obj.scale.x = dir * (1 - 0.1 * Math.sin(t * Math.PI));
                    obj.scale.y = 1 + 0.15 * Math.sin(t * Math.PI);
                }
            } else { active = false; obj.scale = vec2(dir, 1); }
        }
    });
    return { trigger: (s = "squash") => { active = true; t = 0; type = s; } };
}
```

### HUD bounce

```js
function hudBounce(element, targetScale = 0.9) {
    element.scale = vec2(1.3);
    wait(0.1, () => element.scale = vec2(targetScale));
}
```

### Premium positive event (collect/score)

```js
function positiveEvent(position, value, col) {
    burstParticles(position, col, 14);
    floatingText(position, `+${value}`, col);
    flash(Color.fromArray([col.r, col.g, col.b]), 0.08);
    shake(2);
}
```

## Z-Index Hierarchy

```js
const Z = {
    BG: -100, BG_DECOR: -50, PLATFORMS: 0, PICKUPS: 10,
    ENEMIES: 20, PLAYER: 30, PARTICLES: 50, HUD: 100,
};
add([sprite("bg"), z(Z.BG)]);
add([text("Score: 0"), pos(20, 20), fixed(), z(Z.HUD)]);
```

## Quick Start — Polish Setup

```js
const P = PASTEL;
loadSprite("player", makePlayerSprite(48, P));
loadSprite("coin", makeCoinSprite(32, P));
loadSprite("spike", makeSpikeSprite(32, P));
loadSprite("platform", makePlatformSprite(140, 24, P));
loadSprite("bg", makeGradientBg(P.bgLight, P.bg));

scene("game", () => {
    add([sprite("bg"), pos(0, 0), z(Z.BG)]);
    loop(0.4, spawnAmbientParticle);
    const player = add([sprite("player"), pos(100, 400), area(), body(), z(Z.PLAYER)]);
    addBreathing(player);
    const coin = add([sprite("coin"), pos(300, 350), area(), z(Z.PICKUPS), "coin"]);
    addFloat(coin);
    player.onCollide("coin", (c) => {
        positiveEvent(c.pos, 1, color(255, 215, 0));
        destroy(c);
    });
});
```
