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
node setup.mjs
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
> node setup.mjs --keep-data
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
└── setup.mjs            # One-command setup script
```

The React app is built into `laravel-backend/public/app`, and Laravel serves it, so you only need to run one server in production-style use.

## Development

When you're actively changing the frontend, you don't need to rebuild every time. Run both servers separately:

```bash
# Terminal 1: backend
cd laravel-backend
php artisan serve

# Terminal 2: frontend with hot reload
cd react-frontend
npm run dev
```

## Configuration

- **Backend:** `laravel-backend/.env` (database, `APP_URL`, etc.). Set `APP_URL=http://localhost:8000` so uploaded file links are correct.
- **Frontend:** `react-frontend/.env`. Set `VITE_API_URL=http://localhost:8000/api` before building.

## Troubleshooting

- **Blank page or "Failed to load module script":** rebuild the frontend with `npm run build` inside `react-frontend`.
- **Uploaded images don't show:** run `php artisan storage:link` and check `APP_URL` in `.env`.
- **"command not found":** make sure `node`, `php` and `composer` are installed and on your PATH.