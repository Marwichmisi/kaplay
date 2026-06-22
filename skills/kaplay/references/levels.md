# Levels and Tilemaps

## addLevel (Global)

Construct a level from a string map:

```js
addLevel([
    "                          $",
    "                          $",
    "           $$         =   $",
    "  %      ====         =   $",
    "                      =    ",
    "       ^^      = >    =   &",
    "===========================",
], {
    tileWidth: 32,
    tileHeight: 32,
    tiles: {
        "=": () => [sprite("floor"), area(), body({ isStatic: true })],
        "$": () => [sprite("coin"), area(), pos(0, -9)],
        "^": () => [sprite("spike"), area(), "danger"],
    },
});
```

## level Component (Object-based)

Same but as a component on an object:

```js
const myLevel = add([
    level([
        "                          $",
        "                          $",
        "           $$         =   $",
        "  %      ====         =   $",
        "                      =    ",
        "       ^^      = >    =   &",
        "===========================",
    ], {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            "=": () => [sprite("floor"), area(), body({ isStatic: true })],
            "$": () => [sprite("coin"), area(), pos(0, -9)],
        },
    }),
]);
```

## Tile Component

Controls obstacle and cost properties of tiles:

```js
const level = addLevel(map, {
    tileWidth: TILE_WIDTH,
    tileHeight: TILE_HEIGHT,
    tiles: {
        "#": () => [sprite("steel"), tile({ isObstacle: true })],
        ".": () => [sprite("grass"), tile({ cost: 1 })],
        "~": () => [sprite("water"), tile({ cost: 5 })], // slower pathfinding
    },
});
```

## Agent Component (Pathfinding on Level)

Automatically finds path on tilemap level:

```js
const bean = level.spawn(
    [sprite("bean"), anchor("center"), pos(32, 32),
        tile(),
        agent({ speed: 640, allowDiagonals: true }),
        "bean",
    ],
    vec2(1, 1),
);

bean.moveTo(vec2(10, 5)); // navigate to tile (10, 5)
bean.moveTo(player.pos);
```

Agent events:
```js
bean.onTargetReached(() => {});
bean.onNavigationStarted(() => {});
bean.onNavigationNext(() => {});
bean.onNavigationEnded(() => {});
```
