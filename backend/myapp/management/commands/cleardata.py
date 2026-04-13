import os
import glob

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Clear storage/db.sqlite3 and storage/media/*"

    def handle(self, *args, **options):

        for file_path in glob.glob(os.path.join('storage', 'db.sqlite3')):
            os.remove(file_path)
            self.stdout.write(f'Removed "{file_path}".')

        for file_path in glob.glob(os.path.join('storage', 'media', '*', '*')):
            os.remove(file_path)
            self.stdout.write(f'Removed "{file_path}".')

