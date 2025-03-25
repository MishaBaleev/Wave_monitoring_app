import os
import re

# Текущая директория
root_dir = os.getcwd()

# Рекурсивный поиск всех .pyc файлов
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".pyc"):
            # Полный путь к файлу
            old_path = os.path.join(dirpath, filename)

            if ".cpython-312" in old_path:
                os.remove(old_path)
                continue
            new_path = old_path.replace(".cpython-311", "")

            if os.path.exists(new_path):
                print(f"File '{new_path}' already exists. Skipping.")
                continue
            
            print(f"Renaming: {old_path} -> {new_path}")
            os.rename(old_path, new_path)