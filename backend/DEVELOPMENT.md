# EEN1037 Example Django REST API

## Overview

This example REST API was produced by following the official Django Documentation
tutorial at <https://docs.djangoproject.com/en/5.2/intro/tutorial01/> and extending
with our example application specific models and REST API views for a minimal Blog
system. Configuration for Visual Studio Code and Docker is also included.


## Customizing for your application

* Delete existing migration files in `myapp/migrations` (except `__init__.py`)

* Change all the code here to implement your web application:
  * `myapp/models.py`
  * `myapp/admin.py`
  * (Now you can test out your models in the admin UI)
  * `myapp/api_urls.py`
  * `myapp/api_views.py`
  * `myapp/serializers.py`

* Replace `myapp/fixtures/myapp_seeddata.json` and `myapp/fixtures/storages/default/*`.

(You can change the other files as you wish, but shouldn't need to).

* Optionally, you can import your existing Django server-side templates:
  * `myapp/views.py`
  * `myapp/urls.py`
  * `myapp/templates/`
  * `myapp/static/`


## Developing


### Requirements

* Python 3.10 - 3.14
* Visual Studio Code
  * Extension: (ms-python.python)


### Running in Visual Studio Code for the first time

* Open the project folder in Visual Studio Code
* Source Control -> Initialize Git Repository -> Commit Everything
* F1 -> Python: Create Virtual Environment -> Venv

* `Run and Debug` in this order:
  * `manage.py makemigrations`
  * `manage.py migrate`
  * `manage.py createsuperuser`
  * `manage.py runserver`


### Visual Studio Code launch targets

* Open the project folder in Visual Studio Code

* Press F5 or select `Run and Debug`
* Run the desired launch target, e.g. `manage.py runserver`

Explanation of the launch targets:

* `manage.py makemigrations`:  Generates new database schema migrations when changes to `models.py` are detected.
* `manage.py migrate`:  Apply any pending database migrations.
* `manage.py createsuperuser`: Add the admin:admin user to the Django Admin UI on <http://localhost:8000/admin>.
* `manage.py runserver`: Run the development web server.
* `manage.py shell`: Access the Django Python Shell.
* `manage.py dumpdata`: Dump the current database as JSON fixture format.
* `manage.py loaddata myapp_seeddata`: Load seed data from `myapp/fixtures/myapp_seeddata.json`.
* `manage.py loadfiles`: Load files from `myapp/fixtures/storages/` into Django storage.
* `manage.py cleardata`: Clears local `storage/db.sqlite3` and `storage/media/*`.


### Database migrations

After editing any Model classes in `models.py`, you must generate a new
database migration corresponding to your changes:

* Run and Debug:
  * `manage.py makemigrations`
  * `manage.py migrate`

These new files in `myapp/migrations` should be saved along with your source code.


### Changing database connection during development

When running in Visual Studio Code, the project is configured by default to
use a local sqlite database located in `storage/db.sqlite3`.

To connect instead to a local PostgreSQL database when running from Visual Studio Code,
uncomment the `DATABASE_URL` environment variable in `.env` file.


## Testing

In the terminal:

* `pytest`
* `pytest --cov=myapp`

In Visual Studio Code:

* Testing
  * Run Tests
  * Debug Tests
  * Run Tests With Coverage


## Logging

Django writes two log files in `storage/logs/`:

* `app.log` — Application-level log messages (INFO and above).
* `trace.log` — Detailed debug log including SQL queries, API HTTP request/response headers, and JSON payloads.


## Test seed data

Ref:
<https://docs.djangoproject.com/en/5.2/howto/initial-data/>

You can provide example database data along with your project by loading
example data into the database from JSON data files known as "fixtures".

To create fixture data, create some example entries as usual using your app
or through the Admin UI. Then use the `manage.py dumpdata` VS Code launch
target to export these database entries as JSON. Copy this into
`myapp/fixtures/myapp_seeddata.json` and save it with your source code.
Run `manage.py loaddata myapp_seeddata` to load them back in.

If you are using FileField in your models.py and want to include the user-uploaded
files with your fixture data, copy them into `myapp/fixtures/storages/default/`
using the same directory structure as `storage/media/`. For example, a file at
`storage/media/profile_images/photo.jpg` would go in
`myapp/fixtures/storages/default/profile_images/photo.jpg`. Then run
`manage.py loadfiles` to copy them into Django storage.


## Source Template

This project was created from:

```
django-admin startproject mysite .
django-admin startapp myapp
```


## Reference

Essential:
* <https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview>
* <https://docs.djangoproject.com/en/5.2/intro/>
* <https://www.django-rest-framework.org/tutorial/quickstart/>

More detail:
* <https://docs.djangoproject.com/en/5.2/>
* <https://www.django-rest-framework.org/api-guide/requests/>
* <https://dj-rest-auth.readthedocs.io/en/latest/>
* <https://drf-spectacular.readthedocs.io/>
* <https://www.postgresql.org/docs/16/tutorial.html>
