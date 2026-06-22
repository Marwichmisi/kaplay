#!/usr/bin/env node

/**
 * Playtest KAPLAY — test un jeu dans un navigateur headless
 *
 * Usage: node playtest.js [url]
 *   url: URL du jeu (défaut: http://localhost:5173)
 *
 * Capture des screenshots, simule des entrées, repère les erreurs.
 */

import puppeteer from "puppeteer";
import { spawn } from "child_process";
import { existsSync, mkdirSync } from "fs";

const CFG = {
    width: 800,
    height: 600,
    dir: "./playtest-screenshots",
    timeout: { page: 30000, afterInput: 500, gameplay: 6000 },
};

const IGNORED = [
    "favicon.ico",
    "Failed to load resource",
];

async function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

async function playtest(url = "http://localhost:5173") {
    console.log("🎮 Playtest KAPLAY —", url, "\n");

    if (!existsSync(CFG.dir)) mkdirSync(CFG.dir, { recursive: true });

    const browser = await puppeteer.launch({
        headless: true,
        args: [`--window-size=${CFG.width},${CFG.height}`, "--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: CFG.width, height: CFG.height });

    const errors = [];
    const logs = [];

    page.on("console", (msg) => {
        logs.push({ type: msg.type(), text: msg.text() });
        if (msg.type() === "error" && !IGNORED.some((i) => msg.text().includes(i))) {
            errors.push(msg.text());
        }
    });
    page.on("pageerror", (err) => {
        if (!IGNORED.some((i) => err.message.includes(i))) errors.push(err.message);
    });

    try {
        console.log("📍 Chargement...");
        await page.goto(url, { waitUntil: "networkidle0", timeout: CFG.timeout.page });
        console.log("✅ Page chargée\n");

        // t=0 capture initiale
        await page.screenshot({ path: `${CFG.dir}/t0_initial.png` });
        console.log("📸 t0_initial.png");

        // Simule ESPACE pour démarrer
        console.log("\n⌨️  ESPACE (start)...");
        await page.keyboard.press("Space");
        await sleep(CFG.timeout.afterInput);
        await page.screenshot({ path: `${CFG.dir}/t1_after_start.png` });
        console.log("📸 t1_after_start.png");

        // Gameplay simulé : mouvement + sauts
        console.log("\n🎮 Simulation gameplay...");
        let dir = "ArrowRight";
        await page.keyboard.down(dir);
        const end = Date.now() + CFG.timeout.gameplay;
        let jumps = 0;

        while (Date.now() < end && errors.length === 0) {
            await page.keyboard.press("Space");
            jumps++;
            await sleep(400);
            if (jumps % 4 === 0) {
                await page.keyboard.up(dir);
                dir = dir === "ArrowRight" ? "ArrowLeft" : "ArrowRight";
                await page.keyboard.down(dir);
            }
        }
        await page.keyboard.up(dir);
        console.log(`   ${jumps} sauts effectués`);

        await page.screenshot({ path: `${CFG.dir}/t2_gameplay.png` });
        console.log("📸 t2_gameplay.png");

        await sleep(1000);
        await page.screenshot({ path: `${CFG.dir}/t3_final.png` });
        console.log("📸 t3_final.png");

        // État du jeu
        const state = await page.evaluate(() => {
            if (typeof window.score !== "undefined") return { score: window.score };
            if (typeof window.gameState !== "undefined") return window.gameState;
            return null;
        });

        // Rapport
        console.log("\n" + "=".repeat(50));
        console.log("📋 RAPPORT PLAYTEST");
        console.log("=".repeat(50));

        if (errors.length) {
            console.log("\n❌ ERREURS :");
            errors.forEach((e) => console.log("   •", e));
        } else {
            console.log("\n✅ Aucune erreur JS");
        }

        const warns = logs.filter((l) => l.type === "warning");
        if (warns.length) {
            console.log("\n⚠️  Warnings :");
            warns.slice(0, 5).forEach((w) => console.log("   •", w.text));
            if (warns.length > 5) console.log(`   ... +${warns.length - 5}`);
        }

        if (state) console.log("\n🎯 État du jeu :", JSON.stringify(state));

        console.log("\n📸 Screenshots :", CFG.dir + "/");
        console.log("\n" + "=".repeat(50));

        if (errors.length) {
            console.log("❌ PLAYTEST ÉCHOUÉ — corrige les erreurs");
            process.exitCode = 1;
        } else {
            console.log("✅ PLAYTEST RÉUSSI — vérifie les screenshots");
        }
        console.log("=".repeat(50) + "\n");
    } catch (err) {
        console.error("\n❌ Erreur playtest :", err.message);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
}

async function startDevServer() {
    return new Promise((resolve, reject) => {
        console.log("🚀 Démarrage du serveur Vite...");
        const server = spawn("npx", ["vite", "--port", "5173"], {
            stdio: ["pipe", "pipe", "pipe"],
            shell: true,
        });
        let started = false;
        server.stdout.on("data", (d) => {
            if (d.toString().includes("Local:") && !started) {
                started = true;
                console.log("✅ Serveur prêt\n");
                resolve(server);
            }
        });
        server.on("error", reject);
        setTimeout(() => {
            if (!started) { server.kill(); reject(new Error("Timeout serveur")); }
        }, 15000);
    });
}

async function main() {
    const url = process.argv[2];
    if (url) {
        await playtest(url);
    } else {
        let server;
        try {
            server = await startDevServer();
            await playtest("http://localhost:5173");
        } finally {
            if (server) { server.kill(); console.log("🛑 Serveur arrêté"); }
        }
    }
}

main().catch(console.error);
