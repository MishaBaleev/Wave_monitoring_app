import sys
from cx_Freeze import setup, Executable
import os
import django

# Автоматическое определение пути к статике Django
django_path = os.path.dirname(django.__file__)
django_static = os.path.join(django_path, 'contrib/admin/static')

# Проверка существования пути
if not os.path.exists(django_static):
    raise RuntimeError(f"Django static files not found at: {django_static}")

build_options = {
    'packages': [
        'django',
        'api',
        'Consumers',
        'plans',
        'backend'
    ],
    'include_files': [
        (django_static, 'django/contrib/admin/static'),  # Исправленный путь
        ('backend/db.sqlite3', 'db.sqlite3'),
        'manage.py'
    ],
    'includes': [
        'asyncio',
        'django.core.management',
        'django.db.models',
        'django.contrib.staticfiles'
    ],
    'excludes': ['tkinter'],
}

setup(
    name='BackendApp',
    version='0.1',
    description='Django Application',
    options={'build_exe': build_options},
    executables=[
        Executable(
            'manage.py',
            target_name='run_server.exe',
        )
    ],
)