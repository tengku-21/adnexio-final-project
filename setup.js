#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

///SHORTCUT SCRIPT TO RUN WHEN FIRST SETUP

const root = dirname(fileURLToPath(import.meta.url));
const frontend = resolve(root, "react-frontend");
const backend = resolve(root, "laravel-backend");

const keepData = process.argv.includes("--keep-data");

function run(command, cwd) {
  console.log(`\n> ${command}   (${cwd})`);

  // shell: true is needed on Windows, where npm and composer are .cmd files
  const result = spawnSync(command, { cwd, stdio: "inherit", shell: true });

  if (result.status !== 0) {
    console.error(`\nFailed: ${command}`);
    process.exit(result.status ?? 1);
  }
}

// 1. React: install and build
run("npm install", frontend);
run("npm run build", frontend);

// 2. Laravel: install, set up, migrate, serve
run("composer install", backend);

if (!existsSync(resolve(backend, ".env"))) {
  console.log("\nNo .env found, creating one from .env.example");
  copyFileSync(
    resolve(backend, ".env.example"),
    resolve(backend, ".env")
  );
  run("php artisan key:generate", backend);
}

run("php artisan storage:link --force", backend);

run(
  keepData
    ? "php artisan migrate --seed"
    : "php artisan migrate:fresh --seed",
  backend
);

// Runs until you press Ctrl+C
run("php artisan serve", backend);