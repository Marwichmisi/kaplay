# AI, State Machines, and Pathfinding

> **Experimental:** State machine and pathfinding features may change in future versions.

## State Machine Component

Model behavior with states and transitions:

```js
const enemy = add([
    pos(80, 100),
    sprite("robot"),
    state("idle", ["idle", "attack", "move"]),
]);

// Runs once when entering state
enemy.onStateEnter("attack", () => {
    enemy.play("attackAnim");
    checkHit(enemy, player);
});

// Runs every frame while in state
enemy.onStateUpdate("move", () => {
    enemy.follow(player);
    if (enemy.pos.dist(player.pos) < 16) {
        enemy.enterState("attack");
    }
});

enemy.onStateEnter("idle", (time) => {
    enemy.play("idleAnim");
    wait(time, () => enemy.enterState("move"));
});
```

### With Pre-defined Transitions

```js
const enemy = add([
    pos(80, 100), sprite("robot"),
    state("idle", ["idle", "attack", "move"], {
        idle: "attack",
        attack: "move",
        move: ["idle", "attack"],
    }),
]);

enemy.onStateTransition("idle", "attack", () => {
    checkHit(enemy, player);
});
```

## Rule System (Fuzzy Logic AI)

More complex AI with rules and fuzzy logic:

```js
const rs = new RuleSystem();

rs.addRuleAssertingFact(sys => true, "patrol");
rs.addRuleAssertingFact(sys =>
    sys.state.playerVisible && sys.state.playerClose, "attack");
rs.addRuleAssertingFact(sys => sys.state.health > 50, "attack_ok");
rs.addRuleAssertingFact(sys => sys.state.playerWeak, "attack_ok");
rs.addRuleRetractingFact(sys => sys.state.health < 10, "attack_ok");

onUpdate(() => {
    rs.reset();
    rs.state.health = enemy.health;
    rs.state.playerClose = enemy.pos.dist(player.pos) < 50;
    rs.execute();

    if (rs.minimumGradeForFacts("attack", "attack_ok") > 0) {
        enemy.attack(player);
    } else if (rs.gradeForFact("patrol") > 0) {
        enemy.patrol();
    }
});
```

## Decision Tree

```js
const tree = new DecisionTree("health");

tree.root.addPredicateNode(health => health < 20, "patrol");
let branch = tree.root.addPredicateNode(health => health >= 20, "playerVisible");
branch.addValueNode(false, "patrol");
branch = branch.addValueNode(true, "playerClose");
branch.addValueNode(false, "hunt");
branch.addValueNode(true, "attack");

const action = tree.evaluate({
    health: 100, playerVisible: true, playerClose: false,
}); // "hunt"

// Weighted branches for fuzzy behavior
branch.addWeightNode(5, "critical_attack");
branch.addWeightNode(95, "attack");

// Learn from examples
// DecisionTree.learnFromExamples(data);
```

## Pathfinding

### Agent Component (on tilemap level)

```js
const bean = level.spawn(
    [sprite("bean"), anchor("center"), pos(32, 32),
        tile(), agent({ speed: 640, allowDiagonals: true }),
        "bean",
    ],
    vec2(1, 1),
);

bean.moveTo(player.pos);
bean.moveTo(vec2(10, 5));

// Events
bean.onTargetReached(() => {});
bean.onNavigationStarted(() => {});
bean.onNavigationNext(() => {});
bean.onNavigationEnded(() => {});
```

### Custom Navigation (NavMesh)

```js
const nav = new NavMesh();
nav.addPolygon([
    vec2(20, 20), vec2(1004, 20), vec2(620, 120), vec2(20, 120),
]);
```

### Navigation Component

Calculates waypoints without moving:

```js
add([
    ...navigation({ graph: nav, navigationOpt: { type: "edges" } }),
]);

const path = enemy.navigateTo(player.pos);
enemy.waypoints = path; // for patrol component
```

### Patrol Component

Follows waypoints (can pair with navigation):

```js
const bean = add([
    sprite("bean"), pos(40, 30),
    patrol({
        waypoints: [vec2(100, 100), vec2(120, 170), vec2(50, 50)],
    }),
]);

bean.onPatrolFinished(() => {
    debug.log(`Reached end at ${gb.pos.x}, ${gb.pos.y}`);
});
```

### Sentry Component

Detects objects in line of sight:

```js
add([
    ...sentry(
        { includes: "player" },
        { lineOfSight: true, raycastExclude: ["enemy"] },
    ),
]);

obj.onObjectsSpotted((spotted) => {});
```

## Health Component

```js
const player = add([health(3)]);

player.onHurt(() => { play("ouch"); });
player.onHeal((amount) => {});
player.onDeath(() => { destroy(player); go("lose"); });

// Manage HP
player.hp--;        // hurt
player.hp += 3;     // heal
player.hp = 5;      // set directly
```
