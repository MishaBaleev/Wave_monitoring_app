import os
import threading
from django.core.management import execute_from_command_line
import webview

def run_django_server():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    execute_from_command_line(["manage.py", "runserver", "--noreload"])

def create_app():
    webview.create_window(
        "Волна",
        "http://127.0.0.1:8000/",
        width=1350,  # Ширина окна
        height=800,  # Высота окна
    )
    webview.start()

if __name__ == "__main__":
    django_thread = threading.Thread(target=run_django_server)
    django_thread.daemon = True
    django_thread.start()

    create_app()