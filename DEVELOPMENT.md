# EEN1037 Django & React Assignment Template

## Overview

This project folder contains a working template for a full-stack REST API + SPA web application:

* Frontend: React SPA w/ Vite
* Backend: Django + Swagger/OpenAPI 3.0 REST APIs
* JSON Web Token authentication
* PostgreSQL Database

## Using as an assignment template

To complete your EEN1037 assignment, you can use this template as a base (recommended
to avoid long set-up & troubleshooting time), or you can add similar REST APIs and a
React app to your existing Django application.

If using this template, you will need to replace the existing example React & Django
"BlogPost" application logic with your own:

* [backend/myapp/models.py](backend/myapp/models.py)
* [backend/myapp/admin.py](backend/myapp/admin.py)
* [backend/myapp/serializers.py](backend/myapp/serializers.py)
* [backend/myapp/api_views.py](backend/myapp/api_views.py)
* [backend/myapp/api_urls.py](backend/myapp/api_urls.py)

* [frontend/src/App.jsx](frontend/src/App.jsx)
* [frontend/src/pages/*.jsx](frontend/src/pages/)
* [frontend/src/components/*.jsx](frontend/src/components)
* [frontend/src/styles/style.css](frontend/src/styles/style.css)

* [backend/myapp/fixtures/myapp_seeddata.json](backend/myapp/fixtures/myapp_seeddata.json)
* [backend/myapp/fixtures/storages/default/*](backend/myapp/fixtures/storages/default/)

* [backend/myapp/tests.py](backend/myapp/tests.py)
* [frontend/src/\_\_tests\_\_/*.jsx](frontend/src/__tests__)


So to import from the earlier assignment with Django with Server-side HTML templates:

* earlier `models.py` -> `backend/myapp/models.py`
* earlier `admin.py` -> `backend/myapp/admin.py`
* earlier CSS -> `frontend/src/styles/*`
* earlier HTML -> `frontend/src/{pages,components}/*.jsx`

* (optional) `templates` -> `backend/myapp/templates`
* (optional) `views.py` -> `backend/myapp/views.py`
* (optional) `urls.py` -> `backend/myapp/urls.py`


For further details, see:
* [backend/DEVELOPMENT.md](backend/DEVELOPMENT.md)
* [frontend/DEVELOPMENT.md](frontend/DEVELOPMENT.md)


## Quick Start using Visual Studio Code

Set up this folder:

* Download & extract this project zip
* Initialize Git Source control, by either:
  * Command line: `git init` -> `git add .` -> `git commit -m 'Add project template'`
  * VS Code -> Open this top-level folder -> Source Control -> Initialize Git Repository -> Commit Everything

To run Django & React in debug mode (breakpoints etc) inside Visual Studio Code:

* Start Django backend:
  * VS Code -> Open Folder -> `backend/`
  * F1 -> Python: Create Environment -> .venv -> requirements.txt & requirements-dev.txt.
  * Run and Debug:
    * `manage.py makemigrations` - Generates SQL schema migrations from models.py changes
    * `manage.py migrate` - Applies pending SQL schema migrations to database
    * `manage.py loaddata` - Loads example Database entries from JSON fixture files
    * `manage.py loadfiles` - Loads example files associated with the fixtures into Django's file storage
    * `manage.py createsuperuser` - Create admin:admin account
    * `manage.py runserver` - Runs Django Development web server on <http://127.0.0.1:8000>:
  * Run Tests: 
    * Testing -> Run Tests with Coverage

* Start React frontend:
  * VS Code -> Open Folder -> `frontend/`
  * Open a terminal (Ctrl+J) -> `npm install`
  * "Run and Debug":
    * `npm run dev` - Starts React Vite development server on <http://127.0.0.1:5173>
    * `Launch Chrome` - For breakpoint debugging
  * Run Tests: 
    * Testing -> Run Tests with Coverage (Needs VSCode extension: vitest.explorer)

* Connect:
  * <http://127.0.0.1:5173> - React frontend UI
  * <http://127.0.0.1:8000/api/docs/> - Rest API Swagger / OpenAPI 3.0 Schema + test interface
  * <http://127.0.0.1:8000/admin/> - Django Admin UI

* Test accounts: 
  * admin:admin
  * testadmin:testpass
  * testuser:testpass


### Logs

* [backend/storage/logs/app.log](backend/storage/logs/app.log)
  * Django REST backend main application logs
  * logger.info|warn|error
  * HTTP Requests
  * Unhandled exceptions

* [backend/storage/logs/trace.log](backend/storage/logs/trace.log)
  * logger.debug()
  * REST /api/* HTTP Request+Response logging with headers & JSON contents.
  * Database SQL queries


## Docker

A full-stack web server can be started with Docker containers using
[docker-compose.yml](docker-compose.yml). See <https://docs.docker.com/compose/>.


### Running with Docker Compose

To build and run the full stack:
```
docker compose up --build
```

Stop and remove existing containers:
```
docker compose down
```

Stop and remove existing containers + persistent volumes:
```
docker compose down -v
```


### Docker endpoints

- <http://localhost:8080> — React Frontend
- <http://localhost:8081> — Django Backend
- <http://localhost:8081/admin> — Django Admin UI (admin:admin)
- <http://localhost:8081/api/docs/> — Swagger/OpenAPI docs

- localhost:5432 — PostgreSQL (myappdb/myappdbuser:myappdbpass)

If the `localhost` addresses are causing issues and timeouts (e.g. IPv6 or DNS issues), try `127.0.0.1`.


## Exporting your project as a Zip file for assignment submission

You have 2 options:

* If you are not using git:
  * Delete `backend/.venv/`
  * Delete `backend/storage/`
  * Delete `frontend/node_modules/`
  * Create a Zip archive of this project directory.

* If you are using Git for version control:

```
git archive --format=zip --output project-export.zip HEAD
```