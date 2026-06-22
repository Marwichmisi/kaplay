#!/bin/bash
# setup.sh — initialise un projet KAPLAY avec playtesting
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(pwd)"

echo "🎮 Setup projet KAPLAY..."

if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo "Création package.json..."
    cat > "$PROJECT_DIR/package.json" << 'EOF'
{
  "name": "kaplay-game",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "playtest": "node playtest.js"
  }
}
EOF
fi

if [ ! -d "$PROJECT_DIR/node_modules/kaplay" ]; then
    echo "Installation kaplay..."
    npm install kaplay
fi

if [ ! -d "$PROJECT_DIR/node_modules/puppeteer" ]; then
    echo "Installation puppeteer..."
    npm install puppeteer --save-dev
fi

if [ ! -d "$PROJECT_DIR/node_modules/vite" ]; then
    echo "Installation vite..."
    npm install vite --save-dev
fi

if [ ! -f "$PROJECT_DIR/playtest.js" ]; then
    echo "Copie playtest.js..."
    cp "$SKILL_DIR/scripts/playtest.js" "$PROJECT_DIR/playtest.js"
fi

if [ ! -f "$PROJECT_DIR/index.html" ]; then
    echo "Création index.html..."
    if [ -f "$SKILL_DIR/templates/basic-game.html" ]; then
        cp "$SKILL_DIR/templates/basic-game.html" "$PROJECT_DIR/index.html"
    fi
fi

echo ""
echo "✅ Setup terminé !"
echo ""
echo "Prochaines étapes :"
echo "  1. Édite index.html avec ton jeu"
echo "  2. Lance 'node playtest.js' pour tester"
echo "  3. Lance 'npx vite --open' pour jouer"
