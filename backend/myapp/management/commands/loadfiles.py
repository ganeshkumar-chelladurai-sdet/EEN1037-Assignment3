from pathlib import Path

from django.core.files.base import ContentFile
from django.core.files.storage import storages
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = """
    Load files from myapp/fixtures/storages/* into Django Storage API (FileSystemStorage, S3Storage, etc).

    Usage: python manage.py loadfiles
    """

    def handle(self, *args, **options):
        # Add more storage names here if you have multiple storages to load files into
        self._load_storage_files("default")

    def _load_storage_files(self, storage_name: str):
        storage = storages[storage_name]
        source_dir = Path(__file__).resolve().parent.parent.parent / "fixtures" / "storages" / storage_name
        for file_path in source_dir.rglob("*"):
            if not file_path.is_file() or file_path.name == '.gitkeep':
                continue
            storage_path = file_path.relative_to(source_dir).as_posix()
            if storage.exists(storage_path):
                storage.delete(storage_path)
            storage.save(storage_path, ContentFile(file_path.read_bytes()))
            self.stdout.write(f'Loaded "{storage_path}" into storage "{storage_name}".')
