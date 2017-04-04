"""
WSGI config for mysite project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

_application = get_wsgi_application()

env_variables = ['DJANGO_KEY', ]
def application(environ, start_response):
    for var in env_variables:
        os.environ[var] = environ.get(var, '')
    return _application(environ, start_response)
