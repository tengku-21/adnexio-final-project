# Project Name

Heyyo, this is a final project (Fullstack laravel-react) for adnexio course. Below is the guide to setup

This repo has two parts:

| Folder | What it is |
|---|---|
| `laravel-backend` | Laravel API (PHP) |
| `react-frontend` | React app (Vite). When built, it outputs into `laravel-backend/public/app` |

## Requirements

- [Node.js](https://nodejs.org/) and npm
- [PHP](https://www.php.net/) 8.4
- [Composer](https://getcomposer.org/)
- A database (SQLite works with no setup, or MySQL if you've configured `.env`)

## Getting started

### Option 1: One command (recommended)

From the repo root:

```bash
node setup.js
```

This works on macOS, Windows and Linux. 
This script will basically do below steps for you instead:

1. Install the React dependencies and build the frontend
2. Install the Laravel dependencies
3. Create `.env` and generate the app key, if `.env` doesn't exist yet
4. Run `php artisan storage:link`
5. Run `php artisan migrate:fresh --seed`
6. Start the server with `php artisan serve`

Then open http://localhost:8000 or http://127.0.0.1:8000.

> **Warning:** `migrate:fresh` drops all tables and re-seeds them. To keep your existing data, run:
>
> ```bash
> node setup.js --keep-data
> ```

### Option 2: Manual setup

If feeling extra rajin or want to troubleshoot maybe can do manual steps below.

**1. Build the frontend**

```bash
cd react-frontend
npm install
npm run build
```

**2. Set up the backend**

```bash
cd ../laravel-backend
composer install
```

Create the `.env` file and generate the app key (skip if `.env` already exists):

```bash
# macOS / Linux
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env

php artisan key:generate
```

Then link storage, set up the database and start the server:

```bash
php artisan storage:link
php artisan migrate:fresh --seed
php artisan serve
```

Open http://localhost:8000 or http://127.0.0.1:8000.

## Project structure

```
.
├── laravel-backend/     # Laravel API
│   └── public/app/      # React build output (generated, don't edit)
├── react-frontend/      # React source code
└── setup.js            # One-command setup script
```

The React app is built into `laravel-backend/public/app`, and Laravel serves it, so you only need to run one server in production-style use.

## Development

When you're actively changing the frontend, you can rebuild to test. By default the build dir for react will be outputted inside laravel.

```bash
# Terminal 1: backend
cd laravel-backend
php artisan serve

# Terminal 2: build
cd react-frontend
npm run build
```
## BIG BIG NOTE

- **If you open react folder in editor it probably show a lot of syntax error. This is due to shadcdn by default use tsx. To counter this, i try to pass type where i can. But to make it easier i change in compile config so that it will ignore typescript error when compile.

- **If you feeling extra and want to refactor, you can turn it on again by going to package json  change the build script to be "build": "tsc -b && vite build".

## END NOTE

Thank you for sir Uzair, for all classes in this short but compact laravel-react course. Hopefully i can implement the things i learn in my next2 project.

Once again, thank you sir.